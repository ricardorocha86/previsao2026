// Gera o HTML do card 4:5 (1080x1350) do mata-mata palpitado, para rasterizar em PNG.
// Geometria portada de tmp/gen-card.mjs. Bandeiras por URL local (/flags/<iso2>.webp).

export interface SCMatch {
  home: string;
  away: string;
  homeIso: string;
  awayIso: string;
  winner: string | null;
}

export interface ShareCardData {
  roundOf32: SCMatch[]; // 16, ordenadas por id 1..16
  roundOf16: SCMatch[]; // 8
  quarterfinals: SCMatch[]; // 4
  semifinals: SCMatch[]; // 2
  final: SCMatch;
  finalScore: [string, string]; // [gols do campeão, gols do vice]
  third?: { winner: string; winnerIso: string; loser: string; loserIso: string } | null;
  champion: string;
  championIso: string;
  participantName: string;
}

const FONT = 'Montserrat, Arial, sans-serif';
const GREEN = '#209927';
const GRAY = 'rgba(46,46,46,.25)';
const flagUrl = (iso: string) => `/flags/${iso}.webp`;

const PLAYER_EGGS: Record<string, { file: string; pl: 'left' | 'right' }> = {
  Argentina: { file: 'messi.webp', pl: 'right' },
  Brasil: { file: 'endrick-19-trophy.webp', pl: 'left' },
  Espanha: { file: 'yamal.webp', pl: 'right' },
  França: { file: 'mbappe.webp', pl: 'left' },
  Inglaterra: { file: 'kane.webp', pl: 'left' },
  Portugal: { file: 'cr7.webp', pl: 'right' },
};

// Tamanho da arte/template (= dimensão de saída do PNG, 4:5).
export const CARD_W = 1122;
export const CARD_H = 1402;
// O chaveamento é desenhado num "palco" próprio de 1080x1350 (geometria inalterada) e
// posicionado SEM rescale dentro da janela branca do template, só por deslocamento.
export const STAGE_W = 1080;
export const STAGE_H = 1350;
export const STAGE_OFFSET_X = 21; // centraliza no eixo X da arte (centro ~561)
export const STAGE_OFFSET_Y = 131; // centraliza na janela branca (centro vertical ~809)

// Embute a Montserrat como data-URI para o html-to-image (evita o erro de ler
// cssRules cross-origin do Google Fonts e garante a fonte certa no PNG).
let _fontCssCache: string | null = null;
export async function getMontserratEmbedCSS(): Promise<string> {
  if (_fontCssCache !== null) return _fontCssCache;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch('/fonts/montserrat-embed.css', { signal: ctrl.signal });
    clearTimeout(timer);
    _fontCssCache = res.ok ? await res.text() : '';
  } catch {
    _fontCssCache = ''; // fallback: html-to-image cai pro skipFonts (Arial)
  }
  return _fontCssCache;
}

// ---------- geometria ----------
// Span vertical do chaveamento comprimido simetricamente em torno do centro (y=688),
// onde semis e final ficam alinhadas. TOPB+BOT=1350 mantém esse centro fixo; as caixas
// 3:2 (mais baixas) permitiram encurtar o span e deixar margens iguais em cima/embaixo.
const TOPB = 234, BOT = 1116, LABELH = 26;
const flexTop = TOPB + LABELH, flexH = BOT - flexTop;
const colCenter = [60, 155, 250, 322, 540, 758, 830, 925, 1020];
// Largura da bandeira por rodada (horizontal FIXO). A altura é 3:2 (= largura × 2/3),
// menor que a largura, para deixar as caixas mais baixas e ganhar espaço vertical.
const FLAG: Record<number, number> = { 0: 46, 1: 50, 2: 54, 3: 60 };
const flagH = (w: number) => Math.round((w * 2) / 3);
const colFor = (round: number, idx: number) => {
  if (round === 0) return idx < 8 ? 0 : 8;
  if (round === 1) return idx < 4 ? 1 : 7;
  if (round === 2) return idx < 2 ? 2 : 6;
  return idx < 1 ? 3 : 5;
};
const NFor = (round: number) => [8, 4, 2, 1][round];
const posInCol = (round: number, idx: number) => {
  if (round === 0) return idx < 8 ? idx : idx - 8;
  if (round === 1) return idx < 4 ? idx : idx - 4;
  if (round === 2) return idx < 2 ? idx : idx - 2;
  return 0;
};
const box = (round: number, idx: number) => {
  const fw = FLAG[round], fh = flagH(fw), N = NFor(round), ci = colFor(round, idx);
  const cx = colCenter[ci];
  const cy = flexTop + (posInCol(round, idx) + 0.5) * (flexH / N);
  const boxW = fw + 18, boxH = 2 * fh + 31;
  return { cx, cy, boxW, boxH, left: cx - boxW / 2, right: cx + boxW / 2, top: cy - boxH / 2, fw, fh };
};

// champion + final + 3rd geometry
const champW = 206, champH = 138, champCy = 418;
const FW = 96, FH = flagH(FW), FSCORE = 72, FGAP = 14, FPAD = 7, FBORD = 2.2;
const finalContentW = FW + FGAP + FSCORE + FGAP + FW;
const finalContainerW = finalContentW + 2 * FPAD + 2 * FBORD;
const finalContainerH = FH + 2 * FPAD + 2 * FBORD;
const finalCy = 688;
const finalLeft = 540 - finalContainerW / 2, finalRight = 540 + finalContainerW / 2;
const finalContainerTop = finalCy - finalContainerH / 2;
const thirdCy = 982;
const SEMI_SAFE_GAP = 14;
const leftSemiInnerLimit = box(3, 0).right + SEMI_SAFE_GAP;
const rightSemiInnerLimit = box(3, 1).left - SEMI_SAFE_GAP;
const centralSafeW = rightSemiInnerLimit - leftSemiInnerLimit;

// ---------- helpers de render ----------
const tile = (iso: string, state: 'win' | 'lose', w: number, h: number) => {
  const border = state === 'win' ? `2px solid ${GREEN}` : '2px solid rgba(46,46,46,.3)';
  const op = state === 'lose' ? 'opacity:.42;' : '';
  return `<div style="width:${w}px;height:${h}px;border-radius:7px;overflow:hidden;border:${border};${op}background:#fff;"><img src="${flagUrl(iso)}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;"></div>`;
};
const rectFlag = (iso: string, state: 'win' | 'lose', w: number, h: number, rad: number, gold: boolean) => {
  const border = gold ? '3px solid #E6A700' : state === 'win' ? `2.5px solid ${GREEN}` : '2.5px solid rgba(46,46,46,.3)';
  const sh = gold ? 'box-shadow:0 0 22px rgba(255,193,7,.5);' : state === 'win' ? 'box-shadow:0 2px 8px rgba(32,153,39,.22);' : '';
  const op = state === 'lose' ? 'opacity:.45;' : '';
  return `<div style="width:${w}px;height:${h}px;border-radius:${rad}px;overflow:hidden;border:${border};${sh}${op}background:#fff;"><img src="${flagUrl(iso)}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;display:block;"></div>`;
};
const stOf = (m: SCMatch, team: string): 'win' | 'lose' => (m.winner === team ? 'win' : 'lose');
const otherOf = (m: SCMatch, team: string): string => (team === m.home ? m.away : m.home);
const isoOf = (m: SCMatch, team: string): string => (team === m.home ? m.homeIso : m.awayIso);

// Retorna o HTML INTERNO do card (svg de conexões + header + elementos + footer).
// O container externo (1080x1350, fundo claro) é montado pelo componente React.
export function buildShareCardInnerHTML(d: ShareCardData): string {
  const rounds: SCMatch[][] = [d.roundOf32, d.roundOf16, d.quarterfinals, d.semifinals];
  let els = '';

  // caixas dos confrontos (rodadas 0..3)
  rounds.forEach((arr, round) => {
    arr.forEach((m, idx) => {
      const g = box(round, idx);
      els += `<div style="position:absolute;left:${g.cx}px;top:${g.cy}px;transform:translate(-50%,-50%);z-index:2;background:#fff;border-radius:12px;border:2.2px solid ${GREEN};box-shadow:0 1px 4px rgba(0,0,0,.09);padding:6px 5px;display:flex;flex-direction:column;gap:6px;align-items:center;">`
        + tile(m.homeIso, stOf(m, m.home), g.fw, g.fh) + tile(m.awayIso, stOf(m, m.away), g.fw, g.fh) + `</div>`;
    });
  });

  // labels escalonados (acima do 1º confronto de cada coluna)
  const roundOfCol: Record<number, number> = { 0: 0, 1: 1, 2: 2, 3: 3, 5: 3, 6: 2, 7: 1, 8: 0 };
  const lblTxt: Record<number, string> = { 0: '16 avos', 1: 'Oitavas', 2: 'Quartas', 3: 'Semis' };
  [0, 1, 2, 3, 5, 6, 7, 8].forEach((ci) => {
    const rd = roundOfCol[ci], N = NFor(rd), boxH = 2 * flagH(FLAG[rd]) + 31;
    const firstCy = flexTop + 0.5 * (flexH / N), ly = firstCy - boxH / 2 - 19;
    els += `<div style="position:absolute;left:${colCenter[ci]}px;top:${ly}px;transform:translateX(-50%);z-index:2;font:800 11px ${FONT};letter-spacing:1.5px;color:rgba(46,46,46,.5);text-transform:uppercase;white-space:nowrap;">${lblTxt[rd]}</div>`;
  });

  // campeão (retangular, +20%)
  els += `<div style="position:absolute;left:540px;top:${champCy - champH / 2 - 20}px;transform:translateX(-50%);z-index:3;font:800 12px ${FONT};letter-spacing:3px;color:#C8960A;white-space:nowrap;">★ CAMPEÃO</div>`;
  els += `<div style="position:absolute;left:540px;top:${champCy}px;transform:translate(-50%,-50%);z-index:3;">` + rectFlag(d.championIso, 'win', champW, champH, 20, true) + `</div>`;
  const champNameTop = champCy + champH / 2 + 12;
  els += `<div style="position:absolute;left:540px;top:${champNameTop}px;transform:translateX(-50%);z-index:3;max-width:${centralSafeW}px;overflow:hidden;text-overflow:ellipsis;background:#fff;border:1.5px solid rgba(0,0,0,.1);border-radius:10px;box-shadow:0 2px 6px rgba(0,0,0,.1);padding:7px 18px;font:800 24px ${FONT};color:#2E2E2E;letter-spacing:.5px;white-space:nowrap;box-sizing:border-box;">${d.champion.toUpperCase()}</div>`;
  const champNameBottom = champNameTop + 46;

  // easter egg do jogador comemorando junto à bandeira do campeão
  const egg = PLAYER_EGGS[d.champion];
  if (egg) {
    const eh = 221, ew = 196; // +40% sobre 158×140
    const cfL = 540 - champW / 2, cfR = 540 + champW / 2;
    const rawLeft = egg.pl === 'left' ? (cfL - ew + 44) : (cfR - 44);
    const eleft = Math.min(Math.max(rawLeft, leftSemiInnerLimit), rightSemiInnerLimit - ew);
    const etop = champCy - eh / 2;
    const opos = egg.pl === 'left' ? 'right' : 'left';
    els += `<img src="/assets/easter-eggs/${egg.file}" alt="" style="position:absolute;left:${eleft}px;top:${etop}px;width:${ew}px;height:${eh}px;object-fit:contain;object-position:${opos} center;z-index:5;filter:drop-shadow(0 10px 12px rgba(0,0,0,.35));">`;
  }

  // final — bandeiras 3:2 (FW×FH) num container justo verde.
  // Ordem segue a chave: vencedor da semi esquerda fica à esquerda; da direita, à direita.
  const leftFinalist = d.semifinals[0]?.winner ?? d.final.home;
  const rightFinalist = d.semifinals[1]?.winner ?? d.final.away;
  const championSide: 'left' | 'right' = leftFinalist === d.champion ? 'left' : 'right';
  const leftFinalIso = isoOf(d.final, leftFinalist);
  const rightFinalIso = isoOf(d.final, rightFinalist);
  const leftScore = championSide === 'left' ? d.finalScore[0] : d.finalScore[1];
  const rightScore = championSide === 'left' ? d.finalScore[1] : d.finalScore[0];
  const leftFinalState: 'win' | 'lose' = championSide === 'left' ? 'win' : 'lose';
  const rightFinalState: 'win' | 'lose' = championSide === 'left' ? 'lose' : 'win';
  // x do centro da bandeira do campeão dentro do container (para o conector em degrau)
  const champFlagCx = championSide === 'left'
    ? 540 - finalContentW / 2 + FW / 2
    : 540 + finalContentW / 2 - FW / 2;
  els += `<div style="position:absolute;left:540px;top:${finalContainerTop - 18}px;transform:translateX(-50%);z-index:3;font:800 10px ${FONT};letter-spacing:2.5px;color:rgba(46,46,46,.5);white-space:nowrap;">GRANDE FINAL</div>`;
  els += `<div style="position:absolute;left:540px;top:${finalCy}px;transform:translate(-50%,-50%);z-index:3;width:${finalContentW}px;box-sizing:content-box;background:#fff;border:${FBORD}px solid ${GREEN};border-radius:14px;box-shadow:0 1px 4px rgba(0,0,0,.09);padding:${FPAD}px;display:flex;align-items:center;gap:${FGAP}px;">`
    + rectFlag(leftFinalIso, leftFinalState, FW, FH, 9, false)
    + `<div style="font:800 32px ${FONT};color:#2E2E2E;flex:0 0 ${FSCORE}px;width:${FSCORE}px;text-align:center;white-space:nowrap;">${leftScore}<span style="color:rgba(46,46,46,.35);font-size:21px;margin:0 4px;">×</span>${rightScore}</div>`
    + rectFlag(rightFinalIso, rightFinalState, FW, FH, 9, false) + `</div>`;

  // 3º lugar — duas bandeiras 3:2 de tamanho igual (largura = semi, 60), em container justo.
  // Ordem segue a chave: perdedor da semi esquerda à esquerda; da direita, à direita.
  if (d.third) {
    const T3 = 60, TH = flagH(T3);
    const sf0 = d.semifinals[0], sf1 = d.semifinals[1];
    const leftLoser = sf0?.winner ? otherOf(sf0, sf0.winner) : d.third.winner;
    const rightLoser = sf1?.winner ? otherOf(sf1, sf1.winner) : d.third.loser;
    const leftLoserIso = sf0?.winner ? isoOf(sf0, leftLoser) : d.third.winnerIso;
    const rightLoserIso = sf1?.winner ? isoOf(sf1, rightLoser) : d.third.loserIso;
    const leftThirdState: 'win' | 'lose' = leftLoser === d.third.winner ? 'win' : 'lose';
    const rightThirdState: 'win' | 'lose' = rightLoser === d.third.winner ? 'win' : 'lose';
    els += `<div style="position:absolute;left:540px;top:${thirdCy - TH / 2 - FPAD - 18}px;transform:translateX(-50%);z-index:3;font:800 9px ${FONT};letter-spacing:2px;color:rgba(46,46,46,.42);white-space:nowrap;">3º LUGAR</div>`;
    els += `<div style="position:absolute;left:540px;top:${thirdCy}px;transform:translate(-50%,-50%);z-index:3;background:#fff;border:${FBORD}px solid ${GREEN};border-radius:12px;box-shadow:0 1px 4px rgba(0,0,0,.09);padding:6px;display:flex;align-items:center;gap:10px;">`
      + rectFlag(leftLoserIso, leftThirdState, T3, TH, 8, false) + rectFlag(rightLoserIso, rightThirdState, T3, TH, 8, false) + `</div>`;
  }

  // ---------- conexões (atrás das caixas) ----------
  let paths = '';
  const addConn = (c: ReturnType<typeof box>, p: ReturnType<typeof box>, childWinner: string | null, parentWinner: string | null) => {
    const left = c.cx < 540;
    const green = !!childWinner && childWinner === parentWinner;
    const stroke = green ? GREEN : GRAY, sw = green ? 2.2 : 1.1;
    const mid = (c.cx + p.cx) / 2;
    const d2 = left ? `M ${c.right} ${c.cy} H ${mid} V ${p.cy} H ${p.left}` : `M ${c.left} ${c.cy} H ${mid} V ${p.cy} H ${p.right}`;
    paths += `<path d="${d2}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  // R32->R16, R16->QF
  ([[d.roundOf32, d.roundOf16, 0], [d.roundOf16, d.quarterfinals, 1]] as [SCMatch[], SCMatch[], number][]).forEach(([cr, pr, round]) => {
    cr.forEach((m, idx) => { const c = box(round, idx); const pIdx = Math.floor(idx / 2); const p = box(round + 1, pIdx); addConn(c, p, m.winner, pr[pIdx]?.winner ?? null); });
  });
  // QF->SF: sai pela base/topo da quartas, vertical até a cy da semi, entra lateralmente
  d.quarterfinals.forEach((m, idx) => {
    const c = box(2, idx); const sfIdx = Math.floor(idx / 2); const p = box(3, sfIdx);
    const isTop = idx % 2 === 0; const startY = isTop ? c.cy + c.boxH / 2 : c.cy - c.boxH / 2;
    const left = c.cx < 540; const sfSide = left ? p.left : p.right;
    const green = !!m.winner && m.winner === (d.semifinals[sfIdx]?.winner ?? null);
    const stroke = green ? GREEN : GRAY, sw = green ? 2.2 : 1.1;
    paths += `<path d="M ${c.cx} ${startY} V ${p.cy} H ${sfSide}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
  });
  // SF->Final
  [0, 1].forEach((idx) => {
    const c = box(3, idx); const left = idx === 0;
    const x1 = left ? c.right : c.left, x2 = left ? finalLeft : finalRight, mid = (c.cx + 540) / 2;
    const green = !!d.semifinals[idx]?.winner && d.semifinals[idx].winner === d.final.winner;
    const stroke = green ? GREEN : GRAY, sw = green ? 2.2 : 1.1;
    paths += `<path d="M ${x1} ${c.cy} H ${mid} V ${finalCy} H ${x2}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
  });
  // conector do campeão em degrau (verde) desviando do 'GRANDE FINAL'
  const yAbove = finalContainerTop - 30;
  paths += `<path d="M ${champFlagCx} ${finalContainerTop} V ${yAbove} H 540 V ${champNameBottom}" fill="none" stroke="${GREEN}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`;

  const svg = `<svg width="${STAGE_W}" height="${STAGE_H}" viewBox="0 0 ${STAGE_W} ${STAGE_H}" style="position:absolute;left:0;top:0;z-index:1;pointer-events:none;">${paths}</svg>`;

  // Cabeçalho/rodapé agora vêm da própria arte (template fixo); aqui só o chaveamento.
  return svg + els;
}
