
import React, { useState, useMemo } from 'react';
import { Trophy, Search, ArrowUpDown, ArrowUp, ArrowDown, Clock, CalendarDays, MapPin, TrendingUp, Network, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import simulacaoGeral from '../assets/simulacao_geral.json';
import simulacaoGeralInicioCopa from '../assets/simulacao_geral_inicio_copa.json';
import simulacaoGeralPosRodada1 from '../assets/simulacao_geral_pos_rodada1.json';
import simulacaoGeralPosRodada2 from '../assets/simulacao_geral_pos_rodada2.json';
import simulacaoGeralPosFaseGrupos from '../assets/simulacao_geral_pos_fase_grupos.json';
import simulacaoGeralBayes from '../assets/simulacao_geral_bayes.json';
import simulacaoGeralBayesPreTorneio from '../assets/simulacao_geral_bayes_pre_torneio.json';
import previsoesJogos from '../assets/previsoes_jogos.json';
import previsoesJogosInicioCopa from '../assets/previsoes_jogos_inicio_copa.json';
import previsoesJogosPosRodada1 from '../assets/previsoes_jogos_pos_rodada1.json';
import previsoesJogosPosRodada2 from '../assets/previsoes_jogos_pos_rodada2.json';
import previsoesJogosPosFaseGrupos from '../assets/previsoes_jogos_pos_fase_grupos.json';
import previsoesJogosBayes from '../assets/previsoes_jogos_bayes.json';
import previsoesJogosBayesPreTorneio from '../assets/previsoes_jogos_bayes_pre_torneio.json';
import resultadosJogos from '../assets/resultados_jogos.json';
import flags from '../assets/flags.json';
import analisePreConvocacao from '../assets/analise_pre_convocacao.json';
import analiseInicioCopa from '../assets/analise_inicio_copa.json';
import analisePosRodada1 from '../assets/analise_pos_rodada1.json';
import analisePosRodada2 from '../assets/analise_pos_rodada2.json';
import analisePosFaseGrupos from '../assets/analise_pos_fase_grupos.json';
import PageHeader from './PageHeader';

type StageId = 'inicio-copa' | 'pre-convocacao' | 'fim-rodada1' | 'fim-rodada2' | 'inicio-mata-mata';
type BayesStageId = 'bayes-pre-torneio' | 'bayes-fim-rodada1';
type InfoTab = 'probabilidades' | 'eliminacao' | 'brasil';

const STAGES: Array<{ id: StageId; label: string; date: string; data: any[]; jogos: any[] }> = [
  { id: 'pre-convocacao', label: 'Pré-Convocação', date: '11/05/2026', data: simulacaoGeral as any[], jogos: previsoesJogos as any[] },
  { id: 'inicio-copa', label: 'Início da Copa', date: '11/06/2026', data: simulacaoGeralInicioCopa as any[], jogos: previsoesJogosInicioCopa as any[] },
  { id: 'fim-rodada1', label: 'Fim da 1ª Rodada', date: '17/06/2026', data: simulacaoGeralPosRodada1 as any[], jogos: previsoesJogosPosRodada1 as any[] },
  { id: 'fim-rodada2', label: 'Fim da 2ª Rodada', date: '24/06/2026', data: simulacaoGeralPosRodada2 as any[], jogos: previsoesJogosPosRodada2 as any[] },
  { id: 'inicio-mata-mata', label: 'Início do Mata-Mata', date: '28/06/2026', data: simulacaoGeralPosFaseGrupos as any[], jogos: previsoesJogosPosFaseGrupos as any[] },
];

const BAYES_STAGES: Array<{ id: BayesStageId; label: string; date: string; data: any[]; jogos: any[] }> = [
  { id: 'bayes-pre-torneio', label: 'Pré-Torneio', date: '30/04/2026', data: simulacaoGeralBayesPreTorneio as any[], jogos: previsoesJogosBayesPreTorneio as any[] },
  { id: 'bayes-fim-rodada1', label: 'Fim da 1ª Rodada', date: '17/06/2026', data: simulacaoGeralBayes as any[], jogos: previsoesJogosBayes as any[] },
];

const DEFAULT_STAGE_ID: StageId = 'inicio-mata-mata';
const DEFAULT_BAYES_STAGE_ID: BayesStageId = 'bayes-fim-rodada1';

const UPCOMING_STAGES: Array<{ label: string; date: string }> = [
  { label: 'Fim dos 16-avos', date: '03/07/2026' },
  { label: 'Fim das Oitavas', date: '07/07/2026' },
  { label: 'Fim das Quartas', date: '11/07/2026' },
  { label: 'Fim das Semifinais', date: '15/07/2026' },
];

// Análises detalhadas (eliminação + caminho do Brasil) só existem para a Metodologia 1.
const ANALISE_MAP: Record<StageId, any> = {
  'pre-convocacao': analisePreConvocacao,
  'inicio-copa': analiseInicioCopa,
  'fim-rodada1': analisePosRodada1,
  'fim-rodada2': analisePosRodada2,
  'inicio-mata-mata': analisePosFaseGrupos,
};

const getFlag = (teamName: string) => {
  if (!teamName) return "https://flagcdn.com/w320/un.webp";
  const normalized = teamName.trim();
  return (flags as any)[normalized] || (flags as any)[normalized.replace('República ', '')] || "https://flagcdn.com/w320/un.webp";
};

const parsePercent = (val: any) => {
  if (typeof val === 'string') {
    const cleaned = val.replace('%', '').replace(',', '.').trim();
    return parseFloat(cleaned) || 0;
  }
  return val || 0;
};

const formatFairOdd = (val: any) => {
  const probability = parsePercent(val);
  if (!probability) return '-';
  return (100 / probability).toFixed(2);
};

const formatPct = (val: any, decimals = 1) => {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return `${(Number(val) * 100).toFixed(decimals)}%`;
};

const formatInt = (val: any) => {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return Math.round(Number(val)).toLocaleString('pt-BR');
};

function getGroupLetter(group: string) {
  return group?.replace('Grupo ', '').trim() || '-';
}

const getShortBrasiliaTime = (value: string) => {
  const match = value?.match(/\(([^/]+)/);
  return match ? match[1].trim() : value;
};

const getShortVenue = (value: string) => {
  return value?.split('–')[0]?.trim() || value;
};

const WEEKDAYS_PT = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const MONTH_NAMES_PT = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

const TOURNAMENT_START_ISO = '2026-06-11';
const TOURNAMENT_FINAL_ISO = '2026-07-19';

const parseIsoDateParts = (iso: string) => {
  const [year, month, day] = iso.split('-').map(Number);
  return { year, month, day };
};

const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDateKeyFromTimestamp = (ts: number) => {
  if (!ts) return '';
  return getDateKey(new Date(ts));
};

const formatDataPtFromIso = (iso: string) => {
  const { year, month, day } = parseIsoDateParts(iso);
  const date = new Date(year, month - 1, day);
  return `${WEEKDAYS_PT[date.getDay()]}, ${day} de ${MONTH_NAMES_PT[month - 1]} de ${year}`;
};

const formatClock = (hours: number, minutes: number) => `${hours}h${String(minutes).padStart(2, '0')}`;

const formatEtClock = (timeEt: string) => {
  const [hours, minutes] = timeEt.split(':').map(Number);
  return formatClock(hours, minutes);
};

const formatOffsetClock = (utcMs: number, offsetHours: number, baseIso: string) => {
  const target = new Date(utcMs + offsetHours * 60 * 60 * 1000);
  const clock = formatClock(target.getUTCHours(), target.getUTCMinutes());
  const targetIso = `${target.getUTCFullYear()}-${String(target.getUTCMonth() + 1).padStart(2, '0')}-${String(target.getUTCDate()).padStart(2, '0')}`;
  if (targetIso === baseIso) return clock;
  return `${clock} de ${target.getUTCDate()} de ${MONTH_NAMES_PT[target.getUTCMonth()]}`;
};

const formatBrasiliaTimesFromEt = (dateIso: string, timeEt: string) => {
  const { year, month, day } = parseIsoDateParts(dateIso);
  const [hours, minutes] = timeEt.split(':').map(Number);
  const utcMs = Date.UTC(year, month - 1, day, hours + 4, minutes);
  return `(${formatOffsetClock(utcMs, -3, dateIso)} em Brasília / ${formatOffsetClock(utcMs, -1, dateIso)} em Praia / ${formatOffsetClock(utcMs, 1, dateIso)} em Lisboa)`;
};

const addDays = (iso: string, days: number) => {
  const { year, month, day } = parseIsoDateParts(iso);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return getDateKey(date);
};

const MESES_PT: Record<string, number> = {
  janeiro: 0, fevereiro: 1, 'março': 2, abril: 3, maio: 4, junho: 5,
  julho: 6, agosto: 7, setembro: 8, outubro: 9, novembro: 10, dezembro: 11,
};

const OFFICIAL_KNOCKOUT_RAW = [
  { match: 73, stage: '16-avos', date: '2026-06-28', timeEt: '15:00', venue: 'Los Angeles, nos EUA', home: 'África do Sul', away: 'Canadá', homeSeed: '2º Grupo A', awaySeed: '2º Grupo B', winA: '22.6%', draw: '25.6%', winB: '51.8%', advA: '32.2%', advB: '67.8%' },
  { match: 74, stage: '16-avos', date: '2026-06-29', timeEt: '16:30', venue: 'Boston, nos EUA', home: 'Alemanha', away: 'Paraguai', homeSeed: '1º Grupo E', awaySeed: 'Melhor 3º colocado', winA: '65.5%', draw: '21.7%', winB: '12.8%', advA: '81.5%', advB: '18.5%' },
  { match: 75, stage: '16-avos', date: '2026-06-29', timeEt: '21:00', venue: 'Monterrey, no México', home: 'Holanda', away: 'Marrocos', homeSeed: '1º Grupo F', awaySeed: '2º Grupo C', winA: '46.1%', draw: '26.6%', winB: '27.4%', advA: '61.5%', advB: '38.5%' },
  { match: 76, stage: '16-avos', date: '2026-06-29', timeEt: '13:00', venue: 'Houston, nos EUA', home: 'Brasil', away: 'Japão', homeSeed: '1º Grupo C', awaySeed: '2º Grupo F', winA: '47.9%', draw: '26.3%', winB: '25.8%', advA: '63.5%', advB: '36.5%' },
  { match: 77, stage: '16-avos', date: '2026-06-30', timeEt: '17:00', venue: 'Nova York/Nova Jersey, nos EUA', home: 'França', away: 'Suécia', homeSeed: '1º Grupo I', awaySeed: 'Melhor 3º colocado', winA: '71.7%', draw: '19.3%', winB: '9.1%', advA: '86.7%', advB: '13.3%' },
  { match: 78, stage: '16-avos', date: '2026-06-30', timeEt: '13:00', venue: 'Dallas, nos EUA', home: 'Costa do Marfim', away: 'Noruega', homeSeed: '2º Grupo E', awaySeed: '2º Grupo I', winA: '23.5%', draw: '25.8%', winB: '50.7%', advA: '33.4%', advB: '66.6%' },
  { match: 79, stage: '16-avos', date: '2026-06-30', timeEt: '21:00', venue: 'Cidade do México, no México', home: 'México', away: 'Equador', homeSeed: '1º Grupo A', awaySeed: 'Melhor 3º colocado', winA: '45.9%', draw: '26.6%', winB: '27.6%', advA: '61.2%', advB: '38.8%' },
  { match: 80, stage: '16-avos', date: '2026-07-01', timeEt: '12:00', venue: 'Atlanta, nos EUA', home: 'Inglaterra', away: 'RD do Congo', homeSeed: '1º Grupo L', awaySeed: 'Melhor 3º colocado', winA: '64.1%', draw: '22.2%', winB: '13.6%', advA: '80.2%', advB: '19.8%' },
  { match: 81, stage: '16-avos', date: '2026-07-01', timeEt: '20:00', venue: 'Santa Clara, nos EUA', home: 'Estados Unidos', away: 'Bósnia e Herzegovina', homeSeed: '1º Grupo D', awaySeed: '3º Grupo B', winA: '54.2%', draw: '25.1%', winB: '20.8%', advA: '70.3%', advB: '29.7%' },
  { match: 82, stage: '16-avos', date: '2026-07-01', timeEt: '16:00', venue: 'Seattle, nos EUA', home: 'Bélgica', away: 'Senegal', homeSeed: '1º Grupo G', awaySeed: 'Melhor 3º colocado', winA: '44.3%', draw: '26.8%', winB: '29.0%', advA: '59.4%', advB: '40.6%' },
  { match: 83, stage: '16-avos', date: '2026-07-02', timeEt: '19:00', venue: 'Toronto, no Canadá', home: 'Portugal', away: 'Croácia', homeSeed: '2º Grupo K', awaySeed: '2º Grupo L', winA: '56.0%', draw: '24.6%', winB: '19.3%', advA: '72.3%', advB: '27.7%' },
  { match: 84, stage: '16-avos', date: '2026-07-02', timeEt: '15:00', venue: 'Los Angeles, nos EUA', home: 'Espanha', away: 'Áustria', homeSeed: '1º Grupo H', awaySeed: '2º Grupo J', winA: '65.6%', draw: '21.7%', winB: '12.7%', advA: '81.6%', advB: '18.4%' },
  { match: 85, stage: '16-avos', date: '2026-07-02', timeEt: '23:00', venue: 'Vancouver, no Canadá', home: 'Suíça', away: 'Argélia', homeSeed: '1º Grupo B', awaySeed: 'Melhor 3º colocado', winA: '52.7%', draw: '25.4%', winB: '21.9%', advA: '68.8%', advB: '31.2%' },
  { match: 86, stage: '16-avos', date: '2026-07-03', timeEt: '18:00', venue: 'Miami, nos EUA', home: 'Argentina', away: 'Cabo Verde', homeSeed: '1º Grupo J', awaySeed: '2º Grupo H', winA: '74.7%', draw: '17.9%', winB: '7.4%', advA: '89.2%', advB: '10.8%' },
  { match: 87, stage: '16-avos', date: '2026-07-03', timeEt: '21:30', venue: 'Kansas City, nos EUA', home: 'Colômbia', away: 'Gana', homeSeed: '1º Grupo K', awaySeed: 'Melhor 3º colocado', winA: '56.6%', draw: '24.5%', winB: '18.9%', advA: '72.9%', advB: '27.1%' },
  { match: 88, stage: '16-avos', date: '2026-07-03', timeEt: '14:00', venue: 'Dallas, nos EUA', home: 'Austrália', away: 'Egito', homeSeed: '2º Grupo D', awaySeed: '2º Grupo G', winA: '35.7%', draw: '27.2%', winB: '37.1%', advA: '49.1%', advB: '50.9%' },
  { match: 89, stage: 'Oitavas', date: '2026-07-04', timeEt: '17:00', venue: 'Filadélfia, nos EUA', home: 'Vencedor Jogo 74', away: 'Vencedor Jogo 77', homeSeed: 'Vencedor 16-avos', awaySeed: 'Vencedor 16-avos' },
  { match: 90, stage: 'Oitavas', date: '2026-07-04', timeEt: '13:00', venue: 'Houston, nos EUA', home: 'Vencedor Jogo 73', away: 'Vencedor Jogo 75', homeSeed: 'Vencedor 16-avos', awaySeed: 'Vencedor 16-avos' },
  { match: 91, stage: 'Oitavas', date: '2026-07-05', timeEt: '16:00', venue: 'Nova York/Nova Jersey, nos EUA', home: 'Vencedor Jogo 76', away: 'Vencedor Jogo 78', homeSeed: 'Vencedor 16-avos', awaySeed: 'Vencedor 16-avos' },
  { match: 92, stage: 'Oitavas', date: '2026-07-05', timeEt: '20:00', venue: 'Cidade do México, no México', home: 'Vencedor Jogo 79', away: 'Vencedor Jogo 80', homeSeed: 'Vencedor 16-avos', awaySeed: 'Vencedor 16-avos' },
  { match: 93, stage: 'Oitavas', date: '2026-07-06', timeEt: '15:00', venue: 'Dallas, nos EUA', home: 'Vencedor Jogo 83', away: 'Vencedor Jogo 84', homeSeed: 'Vencedor 16-avos', awaySeed: 'Vencedor 16-avos' },
  { match: 94, stage: 'Oitavas', date: '2026-07-06', timeEt: '20:00', venue: 'Seattle, nos EUA', home: 'Vencedor Jogo 81', away: 'Vencedor Jogo 82', homeSeed: 'Vencedor 16-avos', awaySeed: 'Vencedor 16-avos' },
  { match: 95, stage: 'Oitavas', date: '2026-07-07', timeEt: '12:00', venue: 'Atlanta, nos EUA', home: 'Vencedor Jogo 86', away: 'Vencedor Jogo 88', homeSeed: 'Vencedor 16-avos', awaySeed: 'Vencedor 16-avos' },
  { match: 96, stage: 'Oitavas', date: '2026-07-07', timeEt: '16:00', venue: 'Vancouver, no Canadá', home: 'Vencedor Jogo 85', away: 'Vencedor Jogo 87', homeSeed: 'Vencedor 16-avos', awaySeed: 'Vencedor 16-avos' },
  { match: 97, stage: 'Quartas', date: '2026-07-09', timeEt: '16:00', venue: 'Boston, nos EUA', home: 'Vencedor Jogo 89', away: 'Vencedor Jogo 90', homeSeed: 'Vencedor oitavas', awaySeed: 'Vencedor oitavas' },
  { match: 98, stage: 'Quartas', date: '2026-07-10', timeEt: '15:00', venue: 'Los Angeles, nos EUA', home: 'Vencedor Jogo 93', away: 'Vencedor Jogo 94', homeSeed: 'Vencedor oitavas', awaySeed: 'Vencedor oitavas' },
  { match: 99, stage: 'Quartas', date: '2026-07-11', timeEt: '17:00', venue: 'Miami, nos EUA', home: 'Vencedor Jogo 91', away: 'Vencedor Jogo 92', homeSeed: 'Vencedor oitavas', awaySeed: 'Vencedor oitavas' },
  { match: 100, stage: 'Quartas', date: '2026-07-11', timeEt: '21:00', venue: 'Kansas City, nos EUA', home: 'Vencedor Jogo 95', away: 'Vencedor Jogo 96', homeSeed: 'Vencedor oitavas', awaySeed: 'Vencedor oitavas' },
  { match: 101, stage: 'Semifinais', date: '2026-07-14', timeEt: '15:00', venue: 'Dallas, nos EUA', home: 'Vencedor Jogo 97', away: 'Vencedor Jogo 98', homeSeed: 'Vencedor quartas', awaySeed: 'Vencedor quartas' },
  { match: 102, stage: 'Semifinais', date: '2026-07-15', timeEt: '15:00', venue: 'Atlanta, nos EUA', home: 'Vencedor Jogo 99', away: 'Vencedor Jogo 100', homeSeed: 'Vencedor quartas', awaySeed: 'Vencedor quartas' },
  { match: 103, stage: 'Disputa de 3º lugar', date: '2026-07-18', timeEt: '17:00', venue: 'Miami, nos EUA', home: 'Perdedor Jogo 101', away: 'Perdedor Jogo 102', homeSeed: 'Semifinalista', awaySeed: 'Semifinalista' },
  { match: 104, stage: 'Final', date: '2026-07-19', timeEt: '15:00', venue: 'Nova York/Nova Jersey, nos EUA', home: 'Vencedor Jogo 101', away: 'Vencedor Jogo 102', homeSeed: 'Finalista', awaySeed: 'Finalista' },
];

const OFFICIAL_KNOCKOUT_MATCHES = OFFICIAL_KNOCKOUT_RAW.map((match) => ({
  Grupo: match.stage,
  Fase: match.stage,
  Tipo: 'mata-mata',
  Jogo: match.match,
  Data: formatDataPtFromIso(match.date),
  'Horário/Local': `${match.venue} – ${formatEtClock(match.timeEt)} ET oficial`,
  'Horário Brasília': formatBrasiliaTimesFromEt(match.date, match.timeEt),
  'Seleção A': match.home,
  'Seleção B': match.away,
  'Origem A': match.homeSeed,
  'Origem B': match.awaySeed,
  // Probabilidades do modelo (presentes só nos 16-avos já definidos):
  ...((match as any).winA ? {
    'Vitória A': (match as any).winA,
    'Empate': (match as any).draw,
    'Vitória B': (match as any).winB,
    'Avanço A': (match as any).advA,
    'Avanço B': (match as any).advB,
  } : {}),
}));

const parseDataHora = (jogo: any): number => {
  const m = String(jogo['Data'] || '').match(/(\d{1,2}) de (\S+) de (\d{4})/);
  if (!m) return 0;
  const mes = MESES_PT[m[2].toLowerCase()] ?? 0;
  const h = String(jogo['Horário Brasília'] || '').match(/(\d{1,2})h(\d{2})/);
  return new Date(Number(m[3]), mes, Number(m[1]), h ? Number(h[1]) : 0, h ? Number(h[2]) : 0).getTime();
};

const jogoPairKey = (teamA: string, teamB: string) => `${teamA}|${teamB}`;

const reverseResultado = (resultado: any) => ({
  ...resultado,
  'Seleção A': resultado['Seleção B'],
  'Seleção B': resultado['Seleção A'],
  'Placar A': resultado['Placar B'],
  'Placar B': resultado['Placar A'],
});

const RESULTADOS_MAP: Record<string, any> = (resultadosJogos as any[]).reduce((acc, r) => {
  if (r['Status'] === 'encerrado') {
    acc[jogoPairKey(r['Seleção A'], r['Seleção B'])] = r;
    acc[jogoPairKey(r['Seleção B'], r['Seleção A'])] = reverseResultado(r);
  }
  return acc;
}, {} as Record<string, any>);

const getResultado = (jogo: any) => {
  const r = RESULTADOS_MAP[jogoPairKey(jogo['Seleção A'], jogo['Seleção B'])];
  return r && r['Status'] === 'encerrado' ? r : undefined;
};

type Desfecho = 'A' | 'E' | 'B';

const getDesfecho = (resultado: any): Desfecho =>
  resultado['Placar A'] > resultado['Placar B'] ? 'A' : resultado['Placar A'] < resultado['Placar B'] ? 'B' : 'E';

const hasMatchProbabilities = (jogo: any) => Boolean(jogo['Vitória A'] && jogo['Empate'] && jogo['Vitória B']);

const getAgendaBadge = (group: string) => {
  if (group?.startsWith('Grupo ')) return getGroupLetter(group);
  if (group === '16-avos') return '32';
  if (group === 'Oitavas') return '16';
  if (group === 'Quartas') return 'Q';
  if (group === 'Semifinais') return 'S';
  if (group === 'Disputa de 3º lugar') return '3º';
  if (group === 'Final') return 'F';
  return 'M';
};

// ─── JogoCard ────────────────────────────────────────────────────────────────

const JogoCard: React.FC<{ jogo: any; theme: any; showGroup?: boolean }> = ({ jogo, theme, showGroup }) => {
  const resultado = getResultado(jogo);
  const desfecho = resultado ? getDesfecho(resultado) : null;
  const hasProbabilities = hasMatchProbabilities(jogo);
  const hasAdvancement = Boolean(jogo['Avanço A'] && jogo['Avanço B']);
  const dimClass = (d: Desfecho) => (resultado && desfecho !== d ? 'opacity-35' : '');

  return (
    <div className="bg-white border border-brand-dark/5 p-5 rounded-3xl shadow-md hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] transition-all duration-500 group/card relative overflow-hidden">
      <div className="grid grid-cols-3 gap-2 mb-6 pb-4 border-b border-brand-dark/5 text-[9px] font-black uppercase tracking-tight text-brand-dark/35">
        <div className="flex items-center gap-1.5 min-w-0">
          {showGroup ? (
            <>
              <Trophy className={`w-3 h-3 flex-shrink-0 ${theme.accentText}`} />
              <span className="truncate">{jogo['Grupo']}</span>
            </>
          ) : (
            <>
              <CalendarDays className={`w-3 h-3 flex-shrink-0 ${theme.accentText}`} />
              <span className="truncate">{jogo['Data']?.split(',')[1] || jogo['Data']}</span>
            </>
          )}
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <Clock className={`w-3 h-3 flex-shrink-0 ${theme.accentText}`} />
          <span>{getShortBrasiliaTime(jogo['Horário Brasília'])}</span>
        </div>
        <div className="flex items-center justify-end gap-1.5 min-w-0">
          <MapPin className={`w-3 h-3 flex-shrink-0 ${theme.accentText}`} />
          <span className="truncate text-right">{getShortVenue(jogo['Horário/Local'])}</span>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-2 mb-4">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-16 h-10 rounded-xl border border-brand-dark/10 overflow-hidden shadow-sm group-hover/card:scale-110 transition-transform duration-500">
            <img src={getFlag(jogo['Seleção A'])} className="w-full h-full object-cover" alt="" loading="lazy" decoding="async" />
          </div>
          <div className="space-y-1">
            <span className="font-montserrat font-black text-brand-dark uppercase text-[11px] leading-tight block min-h-7 flex items-center justify-center break-words">{jogo['Seleção A']}</span>
            {hasAdvancement ? (
              <>
                <span className="block text-[7px] font-montserrat font-black uppercase tracking-widest text-brand-dark/35 mb-0.5">Avança</span>
                <span className={`font-exo text-xl font-bold italic ${theme.accentText} block`}>{jogo['Avanço A']}</span>
                <span className="block font-exo text-xs font-bold italic text-brand-dark/70 mt-0.5">{jogo['Vitória A']}</span>
              </>
            ) : hasProbabilities ? (
              <>
                <span className={`font-exo text-lg font-bold italic ${theme.accentText} block ${dimClass('A')}`}>{jogo['Vitória A']}</span>
                <span className={`block text-[9px] font-montserrat font-bold tabular-nums text-brand-dark/30 ${dimClass('A')}`}>{formatFairOdd(jogo['Vitória A'])}</span>
              </>
            ) : (
              <span className="block text-[9px] font-montserrat font-black uppercase tracking-widest text-brand-dark/35">{jogo['Origem A'] || 'A definir'}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center pt-2">
          {resultado ? (
            <>
              <span className="text-[8px] font-montserrat font-black uppercase tracking-widest text-brand-dark/40 mb-1">Encerrado</span>
              <div className="px-3.5 py-1.5 bg-brand-dark text-white rounded-2xl font-exo font-black text-xl tabular-nums shadow-md mb-3">
                {resultado['Placar A']} <span className="opacity-40 text-sm font-bold">×</span> {resultado['Placar B']}
              </div>
            </>
          ) : (
            <div className="px-2.5 py-1 bg-brand-light rounded-full text-[9px] font-black text-brand-dark/25 mb-4">VS</div>
          )}
          {hasAdvancement ? (
            <div className="flex flex-col items-center opacity-70">
              <span className="text-[8px] font-montserrat font-black uppercase tracking-widest mb-0.5 text-brand-dark/50">Empate</span>
              <span className="font-exo text-xs font-bold italic text-brand-dark/70">{jogo['Empate']}</span>
              <span className="mt-0.5 text-[7px] font-montserrat font-bold uppercase tracking-tight text-brand-dark/40">tempo normal</span>
            </div>
          ) : hasProbabilities ? (
            <div className={`flex flex-col items-center ${resultado && desfecho === 'E' ? '' : 'opacity-40'} ${dimClass('E')}`}>
              <span className="text-[8px] font-montserrat font-black uppercase tracking-widest mb-0.5">Empate</span>
              <span className="font-exo text-sm font-bold italic text-brand-dark">{jogo['Empate']}</span>
              <span className="mt-0.5 text-[8px] font-montserrat font-bold tabular-nums text-brand-dark/70">{formatFairOdd(jogo['Empate'])}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center opacity-60">
              <span className="text-[8px] font-montserrat font-black uppercase tracking-widest mb-0.5">Jogo</span>
              <span className="font-exo text-sm font-black tabular-nums text-brand-dark">{jogo['Jogo']}</span>
              <span className="mt-0.5 text-[8px] font-montserrat font-bold uppercase tracking-tight text-brand-dark/60">{jogo['Fase']}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-16 h-10 rounded-xl border border-brand-dark/10 overflow-hidden shadow-sm group-hover/card:scale-110 transition-transform duration-500">
            <img src={getFlag(jogo['Seleção B'])} className="w-full h-full object-cover" alt="" loading="lazy" decoding="async" />
          </div>
          <div className="space-y-1">
            <span className="font-montserrat font-black text-brand-dark uppercase text-[11px] leading-tight block min-h-7 flex items-center justify-center break-words">{jogo['Seleção B']}</span>
            {hasAdvancement ? (
              <>
                <span className="block text-[7px] font-montserrat font-black uppercase tracking-widest text-brand-dark/35 mb-0.5">Avança</span>
                <span className="font-exo text-xl font-bold italic text-brand-blue block">{jogo['Avanço B']}</span>
                <span className="block font-exo text-xs font-bold italic text-brand-dark/70 mt-0.5">{jogo['Vitória B']}</span>
              </>
            ) : hasProbabilities ? (
              <>
                <span className={`font-exo text-lg font-bold italic text-brand-blue block ${dimClass('B')}`}>{jogo['Vitória B']}</span>
                <span className={`block text-[9px] font-montserrat font-bold tabular-nums text-brand-dark/30 ${dimClass('B')}`}>{formatFairOdd(jogo['Vitória B'])}</span>
              </>
            ) : (
              <span className="block text-[9px] font-montserrat font-black uppercase tracking-widest text-brand-dark/35">{jogo['Origem B'] || 'A definir'}</span>
            )}
          </div>
        </div>
      </div>

      {hasAdvancement ? (
        <div className="flex h-1 overflow-hidden bg-brand-light rounded-full">
          <div style={{ width: jogo['Avanço A'] }} className={theme.barColor} />
          <div style={{ width: jogo['Avanço B'] }} className="bg-brand-blue" />
        </div>
      ) : hasProbabilities ? (
        <div className="flex h-1 overflow-hidden bg-brand-light rounded-full">
          <div style={{ width: jogo['Vitória A'] }} className={theme.barColor} />
          <div style={{ width: jogo['Empate'] }} className="bg-brand-dark/10" />
          <div style={{ width: jogo['Vitória B'] }} className="bg-brand-blue" />
        </div>
      ) : (
        <div className="flex h-1 overflow-hidden bg-brand-light rounded-full">
          <div className={`w-full ${theme.barColor} opacity-30`} />
        </div>
      )}
    </div>
  );
};

// ─── DataTable (estilo da tabela principal) ────────────────────────────────────

type ColType = 'team' | 'pct' | 'int' | 'text';
interface Column {
  key: string;
  label: string;
  type?: ColType;
  highlight?: boolean;
  align?: 'left' | 'center' | 'right';
}

const DataTable: React.FC<{
  columns: Column[];
  rows: any[];
  theme: any;
  rank?: boolean;
  minWidth?: number;
  compact?: boolean;
  maxHeight?: number;
}> = ({ columns, rows, theme, rank = false, minWidth = 0, compact = false, maxHeight }) => {
  if (!rows || rows.length === 0) {
    return <div className="text-center py-8 text-brand-dark/30 text-sm font-opensans bg-white rounded-2xl border border-brand-dark/5">Sem dados disponíveis.</div>;
  }
  const padX = (ci: number) => (ci === 0 ? 'px-4' : 'px-3');
  const headPadY = compact ? 'py-2.5' : 'py-4';
  const bodyPadY = compact ? 'py-2' : 'py-2.5';
  const headText = compact ? 'text-[9px] tracking-[0.2em]' : 'text-[10px] tracking-[0.25em]';
  const teamFlag = compact ? 'w-6 h-4' : 'w-8 h-5';
  const rankW = compact ? 'w-5' : 'w-6';
  const teamText = compact ? 'text-[12px]' : 'text-sm';

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-brand-dark/5 overflow-auto overscroll-contain" style={maxHeight ? { maxHeight } : undefined}>
      <table className="w-full text-left border-collapse" style={minWidth ? { minWidth } : undefined}>
        <thead>
          <tr className="bg-brand-dark text-white font-montserrat uppercase">
            {columns.map((col, ci) => (
              <th
                key={col.key}
                className={`${padX(ci)} ${headPadY} ${headText} sticky top-0 bg-brand-dark ${ci === 0 ? 'left-0 z-30' : 'z-20'} ${
                  col.align === 'right' ? 'text-right' : col.align === 'left' || col.type === 'team' || col.type === 'text' ? 'text-left' : 'text-center'
                } whitespace-nowrap`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-dark/5">
          {rows.map((row, ri) => (
            <tr key={ri} className={`${theme.accentHoverBgSoft} transition-colors group`}>
              {columns.map((col, ci) => {
                const val = row[col.key];
                if (col.type === 'team') {
                  return (
                    <td key={col.key} className={`${padX(0)} ${bodyPadY} sticky left-0 bg-white group-hover:bg-[#F8FFF9] z-10 border-r border-brand-dark/5`}>
                      <div className="flex items-center gap-3">
                        {rank && <span className={`text-[10px] text-brand-dark/30 font-black ${rankW} tabular-nums font-opensans`}>{ri + 1}</span>}
                        <div className={`${teamFlag} rounded-sm shadow-sm border border-brand-dark/5 overflow-hidden flex-shrink-0`}>
                          <img src={getFlag(val)} className="w-full h-full object-cover" alt="" loading="lazy" decoding="async" />
                        </div>
                        <span className={`font-montserrat font-bold text-brand-dark uppercase tracking-tight ${teamText} whitespace-nowrap`}>{val}</span>
                      </div>
                    </td>
                  );
                }
                if (col.type === 'text') {
                  return (
                    <td key={col.key} className={`${padX(ci)} ${bodyPadY} text-left ${ci === 0 ? `sticky left-0 bg-white group-hover:bg-[#F8FFF9] z-10 border-r border-brand-dark/5 font-montserrat font-bold text-brand-dark ${teamText}` : 'text-brand-dark/70 text-sm font-opensans'}`}>
                      {val}
                    </td>
                  );
                }
                const display = col.type === 'int' ? formatInt(val) : formatPct(val);
                return (
                  <td
                    key={col.key}
                    className={`${padX(ci)} ${bodyPadY} tabular-nums font-opensans text-center ${
                      col.highlight ? `${theme.accentText} ${theme.accentBgSoftClass} font-black text-base` : 'text-brand-dark/70 text-sm font-bold'
                    }`}
                  >
                    {display}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SectionTitle: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="mb-6">
    <h3 className="text-xl md:text-2xl font-montserrat font-black text-brand-dark uppercase tracking-tight leading-tight">{title}</h3>
    {subtitle && <p className="text-sm text-brand-dark/50 font-opensans mt-1.5 max-w-3xl">{subtitle}</p>}
  </div>
);

const NoDataNotice: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-white border-2 border-dashed border-brand-dark/10 p-12 md:p-16 text-center rounded-[2rem] flex flex-col items-center gap-3">
    <Info className="w-9 h-9 text-brand-dark/20" />
    <p className="font-montserrat font-black uppercase text-brand-dark text-lg">Análise não disponível</p>
    <p className="text-sm text-brand-dark/45 max-w-md">{children}</p>
  </div>
);

// ─── EliminacaoSection ────────────────────────────────────────────────────────

const EliminacaoSection: React.FC<{ analise: any; theme: any }> = ({ analise, theme }) => {
  const rows: any[] = analise?.eliminacao || [];
  if (rows.length === 0) {
    return <NoDataNotice>Os dados de eliminação por fase não estão disponíveis para esta etapa.</NoDataNotice>;
  }

  const columns: Column[] = [
    { key: 'Seleção', label: 'Seleção', type: 'team' },
    { key: 'Fase de Grupos', label: 'Fase de Grupos', type: 'pct' },
    { key: '16-avos', label: '16-avos', type: 'pct' },
    { key: 'Oitavas', label: 'Oitavas', type: 'pct' },
    { key: 'Quartas', label: 'Quartas', type: 'pct' },
    { key: 'Semifinal', label: 'Semifinal', type: 'pct' },
    { key: 'Vice (Final)', label: 'Vice', type: 'pct' },
    { key: 'Campeã', label: 'Campeã', type: 'pct', highlight: true },
  ];

  return <DataTable columns={columns} rows={rows} theme={theme} rank minWidth={920} />;
};

// ─── BrasilSection ────────────────────────────────────────────────────────────

const BrasilSection: React.FC<{ analise: any; theme: any }> = ({ analise, theme }) => {
  if (!analise || !(analise.brasil_titulo_condicional || []).length) {
    return <NoDataNotice>O detalhamento do caminho do Brasil não está disponível para esta etapa.</NoDataNotice>;
  }

  const adv1o: any[] = analise.brasil_adv_1o || [];
  const adv2o: any[] = analise.brasil_adv_2o || [];
  const adv3o: any[] = analise.brasil_adv_3o || [];
  const advPorFase = [
    { label: '16-avos', rows: analise.brasil_adv_16avos || [] },
    { label: 'Oitavas', rows: analise.brasil_adv_oitavas || [] },
    { label: 'Quartas', rows: analise.brasil_adv_quartas || [] },
    { label: 'Semifinal', rows: analise.brasil_adv_semi || [] },
    { label: 'Final', rows: analise.brasil_adv_final || [] },
  ];
  const tituloCondicional: any[] = analise.brasil_titulo_condicional || [];
  const carrascos: any[] = analise.brasil_carrascos || [];
  const encontros: any[] = analise.brasil_encontros || [];

  const titBy = (frag: string) => {
    const row = tituloCondicional.find((r: any) => String(r['Condicao']).includes(frag));
    return row ? row['Prob titulo'] : null;
  };

  // KPIs — probabilidade de título por avanço na posição do grupo (+ prob. geral)
  const elimBrasil = (analise.eliminacao || []).find((r: any) => r['Seleção'] === 'Brasil');
  const probGeral = elimBrasil ? elimBrasil['Campeã'] : titBy('Top 32');
  const kpis = [
    { label: 'Título se 1º no grupo', val: titBy('1o no grupo'), big: false },
    { label: 'Título se 2º no grupo', val: titBy('2o no grupo'), big: false },
    { label: 'Título se avançar em 3º', val: titBy('3o no grupo'), big: false },
    { label: 'Título — probabilidade geral', val: probGeral, big: true },
  ].filter((k) => k.val !== null && k.val !== undefined);

  // 9 condições de título — 4 por posição no grupo + 5 por fase alcançada
  const nove: Array<{ lab: string; val: number; grp: 'pos' | 'fase' }> = [
    { lab: '1º', val: titBy('1o no grupo'), grp: 'pos' },
    { lab: '2º', val: titBy('2o no grupo'), grp: 'pos' },
    { lab: '3º', val: titBy('3o no grupo'), grp: 'pos' },
    { lab: '4º', val: titBy('4o no grupo'), grp: 'pos' },
    { lab: 'Top 32', val: titBy('Top 32'), grp: 'fase' },
    { lab: 'Oitavas', val: titBy('Oitavas'), grp: 'fase' },
    { lab: 'Quartas', val: titBy('Quartas'), grp: 'fase' },
    { lab: 'Semi', val: titBy('Semifinal'), grp: 'fase' },
    { lab: 'Final', val: titBy('a Final'), grp: 'fase' },
  ].filter((d) => d.val !== null && d.val !== undefined) as any;
  const noveMax = Math.max(...nove.map((d) => d.val), 0.0001);

  return (
    <div className="space-y-14">

      {/* KPIs — probabilidade de título por avanço no grupo */}
      {kpis.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {kpis.map((k, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md border border-brand-dark/5 p-5 flex flex-col gap-1"
              style={{ borderTop: `3px solid ${k.big ? theme.accent : 'rgba(42,52,46,0.12)'}` }}
            >
              <span className="text-[10px] font-montserrat font-black uppercase tracking-widest text-brand-dark/40">{k.label}</span>
              <span className={`font-exo font-black tabular-nums leading-none ${k.big ? 'text-4xl' : 'text-3xl text-brand-dark'}`} style={k.big ? { color: theme.accent } : undefined}>
                {formatPct(k.val)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 1 — Título conforme o caminho */}
      <div>
        <SectionTitle
          title="Chance de título conforme o caminho"
          subtitle="Probabilidade de o Brasil ser campeão dependendo da posição no grupo e da fase que alcançar. As condições por fase são cumulativas: quanto mais longe a Seleção for, maior a chance de levar a taça."
        />
        <div className="bg-white rounded-2xl shadow-xl border border-brand-dark/5 p-5 md:p-7 overflow-x-auto overscroll-x-contain">
          <div className="min-w-[680px]">
            {/* cabeçalhos de grupo */}
            <div className="flex gap-2 mb-4">
              <div className="flex-[4] pb-2 border-b-2" style={{ borderColor: theme.accentBorder }}>
                <span className="text-[10px] font-montserrat font-black uppercase tracking-[0.18em] text-brand-dark/40">Por posição no grupo</span>
              </div>
              <div className="w-2" />
              <div className="flex-[5] pb-2 border-b-2" style={{ borderColor: theme.accentBorder }}>
                <span className="text-[10px] font-montserrat font-black uppercase tracking-[0.18em] text-brand-dark/40">Por fase alcançada</span>
              </div>
            </div>
            {/* barras */}
            <div className="flex items-end gap-2" style={{ height: 210 }}>
              {nove.map((d, i) => (
                <React.Fragment key={i}>
                  {i === 4 && <div className="w-2 self-stretch flex items-center justify-center"><div className="w-px h-full bg-brand-dark/10" /></div>}
                  <div className="flex-1 flex flex-col items-center justify-end h-full gap-2">
                    <span className="font-exo font-black tabular-nums leading-none" style={{ color: theme.accent, fontSize: i === nove.length - 1 ? '1.05rem' : '0.92rem' }}>
                      {formatPct(d.val)}
                    </span>
                    <div
                      className="w-full rounded-t-lg transition-all duration-500"
                      style={{ height: `${Math.max(2, (d.val / noveMax) * 100)}%`, background: theme.tabGradient }}
                    />
                  </div>
                </React.Fragment>
              ))}
            </div>
            {/* rótulos */}
            <div className="flex gap-2 mt-2 pt-2.5 border-t border-brand-dark/10">
              {nove.map((d, i) => (
                <React.Fragment key={i}>
                  {i === 4 && <div className="w-2" />}
                  <span className="flex-1 text-center text-[10px] md:text-[11px] font-montserrat font-black uppercase tracking-tight text-brand-dark/55 leading-tight">
                    {d.lab}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2 — Adversário no 1º mata-mata */}
      <div>
        <SectionTitle
          title="Adversário no 1º jogo do mata-mata (16-avos)"
          subtitle="Quem o Brasil enfrenta na estreia do mata-mata, dependendo de como terminar a fase de grupos."
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {[
            { rows: adv1o, label: 'Se terminar em 1º', probKey: 'Prob dado Brasil 1o grupo' },
            { rows: adv2o, label: 'Se terminar em 2º', probKey: 'Prob dado Brasil 2o grupo' },
            { rows: adv3o, label: 'Se avançar em 3º', probKey: 'Prob dado Brasil 3o grupo' },
          ].map(({ rows, label, probKey }, i) => (
            <div key={i}>
              <p className="text-[11px] font-montserrat font-black uppercase tracking-widest mb-2.5" style={{ color: theme.accent }}>{label}</p>
              <DataTable
                theme={theme}
                compact
                rank
                maxHeight={372}
                columns={[
                  { key: 'Adversario', label: 'Adversário', type: 'team' },
                  { key: probKey, label: 'Prob.', type: 'pct', highlight: true },
                ]}
                rows={[...rows].sort((a, b) => (b[probKey] || 0) - (a[probKey] || 0))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3 — Adversário por fase (5 colunas) */}
      <div>
        <SectionTitle
          title="Adversário mais provável em cada fase"
          subtitle="Dado que o Brasil chegou a cada fase, quais seleções são mais prováveis do outro lado do confronto."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {advPorFase.map(({ label, rows }, i) => (
            <div key={i}>
              <p className="text-[11px] font-montserrat font-black uppercase tracking-widest mb-2.5" style={{ color: theme.accent }}>{label}</p>
              <DataTable
                theme={theme}
                compact
                rank
                maxHeight={372}
                columns={[
                  { key: 'Selecao', label: 'Seleção', type: 'team' },
                  { key: 'Probabilidade', label: 'Prob.', type: 'pct', highlight: true },
                ]}
                rows={[...rows].sort((a, b) => (b['Probabilidade'] || 0) - (a['Probabilidade'] || 0))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 4 — Quem pode eliminar / Quem cruza com o Brasil */}
      <div>
        <SectionTitle
          title="Quem pode eliminar o Brasil"
          subtitle="À esquerda, as seleções com maior chance de eliminar o Brasil em qualquer fase. À direita, quem deve cruzar com o Brasil em algum momento da Copa."
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div>
            <p className="text-[11px] font-montserrat font-black uppercase tracking-widest mb-2.5" style={{ color: theme.accent }}>Carrascos — quem mais elimina o Brasil?</p>
            <DataTable
              theme={theme}
              compact
              rank
              minWidth={360}
              maxHeight={520}
              columns={[
                { key: 'Eliminador', label: 'Seleção', type: 'team' },
                { key: 'Prob dado Brasil eliminado', label: 'Se eliminado', type: 'pct', highlight: true },
                { key: 'Prob no total de copas', label: 'No total', type: 'pct' },
              ]}
              rows={[...carrascos].sort((a, b) => (b['Prob dado Brasil eliminado'] || 0) - (a['Prob dado Brasil eliminado'] || 0))}
            />
          </div>
          <div>
            <p className="text-[11px] font-montserrat font-black uppercase tracking-widest mb-2.5" style={{ color: theme.accent }}>Quem deve cruzar com o Brasil</p>
            {encontros.length > 0 ? (
              <DataTable
                theme={theme}
                compact
                rank
                minWidth={300}
                maxHeight={520}
                columns={[
                  { key: 'Selecao', label: 'Seleção', type: 'team' },
                  { key: 'Probabilidade', label: 'Prob. de enfrentar', type: 'pct', highlight: true },
                ]}
                rows={[...encontros].sort((a, b) => (b['Probabilidade'] || 0) - (a['Probabilidade'] || 0))}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-brand-dark/10 p-8 text-center text-sm text-brand-dark/40 font-opensans h-full flex items-center justify-center">
                Disponível a partir da simulação do fim da 1ª rodada, quando o chaveamento começa a se definir.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── WorldCupHub ──────────────────────────────────────────────────────────────

type ViewMode = 'data' | 'grupos' | 'mataMata';
type KnockoutStage = '16-avos' | 'Oitavas' | 'Quartas' | 'Semifinais' | 'Disputa de 3º lugar' | 'Final';

const KNOCKOUT_STAGE_OPTIONS: Array<{ value: KnockoutStage; label: string }> = [
  { value: '16-avos', label: '16-avos' },
  { value: 'Oitavas', label: 'Oitavas' },
  { value: 'Quartas', label: 'Quartas' },
  { value: 'Semifinais', label: 'Semifinais' },
  { value: 'Disputa de 3º lugar', label: '3º lugar' },
  { value: 'Final', label: 'Final' },
];

const WorldCupHub: React.FC = () => {
  const [methodology, setMethodology] = useState<1 | 2>(1);
  const [stageId, setStageId] = useState<StageId>(DEFAULT_STAGE_ID);
  const [bayesStageId, setBayesStageId] = useState<BayesStageId>(DEFAULT_BAYES_STAGE_ID);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('Grupo A');
  const [viewMode, setViewMode] = useState<ViewMode>('data');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedKnockoutStage, setSelectedKnockoutStage] = useState<KnockoutStage>('16-avos');
  const [infoTab, setInfoTab] = useState<InfoTab>('probabilidades');

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({
    key: 'Campeão',
    direction: 'desc'
  });

  const currentStage = STAGES.find((s) => s.id === stageId) ?? STAGES[STAGES.length - 1];
  const currentBayesStage = BAYES_STAGES.find((s) => s.id === bayesStageId) ?? BAYES_STAGES[BAYES_STAGES.length - 1];
  const currentSimulacaoGeral = methodology === 1 ? currentStage.data : currentBayesStage.data;
  const currentPrevisoesJogos = methodology === 1 ? currentStage.jogos : currentBayesStage.jogos;
  const currentAgendaJogos = useMemo(() => [
    ...(currentPrevisoesJogos as any[]),
    ...OFFICIAL_KNOCKOUT_MATCHES,
  ], [currentPrevisoesJogos]);

  // Análises detalhadas só existem para a Metodologia 1.
  const currentAnalise = methodology === 1 ? ANALISE_MAP[stageId] : null;

  const theme = useMemo(() => {
    if (methodology === 1) {
      return {
        accent: '#209927',
        accentSoft: 'rgba(32, 153, 39, 0.10)',
        accentBorder: 'rgba(32, 153, 39, 0.24)',
        accentText: 'text-brand-green',
        accentBg: 'bg-brand-green',
        accentBorderClass: 'border-brand-green',
        accentHoverBgSoft: 'hover:bg-brand-green/5',
        accentFocusBorder: 'focus:border-brand-green',
        accentHoverBorderSoft: 'hover:border-brand-green/40',
        accentBgSoftClass: 'bg-brand-green/5',
        accentBorderR: 'border-brand-green/5',
        barColor: 'bg-brand-green',
        tabGradient: 'linear-gradient(150deg, #0f5132 0%, #1f8f3a 48%, #46c46e 100%)',
        tabShadow: 'rgba(15, 81, 50, 0.45)',
      };
    } else {
      return {
        accent: '#005C53',
        accentSoft: 'rgba(0, 92, 83, 0.10)',
        accentBorder: 'rgba(0, 92, 83, 0.24)',
        accentText: 'text-teal-600',
        accentBg: 'bg-teal-600',
        accentBorderClass: 'border-teal-600',
        accentHoverBgSoft: 'hover:bg-teal-600/5',
        accentFocusBorder: 'focus:border-teal-600',
        accentHoverBorderSoft: 'hover:border-teal-600/40',
        accentBgSoftClass: 'bg-teal-600/5',
        accentBorderR: 'border-teal-600/5',
        barColor: 'bg-teal-600',
        tabGradient: 'linear-gradient(150deg, #00322d 0%, #00665c 48%, #0bb39e 100%)',
        tabShadow: 'rgba(0, 50, 45, 0.45)',
      };
    }
  }, [methodology]);

  const teamGroupByName = useMemo(() => {
    return (currentPrevisoesJogos as any[]).reduce((acc: Record<string, string>, jogo: any) => {
      const group = jogo['Grupo'];
      if (!group) return acc;
      [jogo['Seleção A'], jogo['Seleção B']].forEach((teamName) => {
        if (teamName) acc[teamName] = getGroupLetter(group);
      });
      return acc;
    }, {});
  }, [currentPrevisoesJogos]);

  const sortedData = useMemo(() => {
    let sortableData = [...(currentSimulacaoGeral as any[])];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        const getSortValue = (team: any) => {
          if (sortConfig.key === 'Grupo') return teamGroupByName[team['Seleção']] || '';
          if (sortConfig.key === 'Seleção') return team['Seleção'] || '';
          return parsePercent(team[sortConfig.key]);
        };
        const aValue = getSortValue(a);
        const bValue = getSortValue(b);
        const comparison = typeof aValue === 'string' && typeof bValue === 'string'
          ? aValue.localeCompare(bValue)
          : aValue - bValue;
        if (comparison < 0) return sortConfig.direction === 'asc' ? -1 : 1;
        if (comparison > 0) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableData;
  }, [currentSimulacaoGeral, sortConfig, teamGroupByName]);

  const filteredSimulacao = sortedData.filter((team: any) =>
    team['Seleção']?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupOptions = useMemo(() => {
    return Array.from(new Set((currentPrevisoesJogos as any[]).map((jogo: any) => jogo['Grupo']).filter(Boolean)))
      .sort((a: any, b: any) => getGroupLetter(a).localeCompare(getGroupLetter(b)));
  }, [currentPrevisoesJogos]);

  const jogosComMeta = useMemo(() => {
    return (currentAgendaJogos as any[]).map((jogo: any) => {
      const ts = parseDataHora(jogo);
      return {
        jogo,
        ts,
        dateKey: getDateKeyFromTimestamp(ts),
        isKnockout: jogo['Tipo'] === 'mata-mata',
        resultado: getResultado(jogo),
      };
    }).sort((a, b) => a.ts - b.ts);
  }, [currentAgendaJogos]);

  const dateOptions = useMemo(() => {
    const datesWithGames = new Map<string, number>();
    for (const item of jogosComMeta) {
      if (!item.dateKey) continue;
      const current = datesWithGames.get(item.dateKey);
      if (current === undefined || item.ts < current) datesWithGames.set(item.dateKey, item.ts);
    }

    const options = [];
    for (let dateKey = TOURNAMENT_START_ISO; dateKey <= TOURNAMENT_FINAL_ISO; dateKey = addDays(dateKey, 1)) {
      const { year, month, day } = parseIsoDateParts(dateKey);
      const dayTs = new Date(year, month - 1, day).getTime();
      options.push({
        key: dateKey,
        data: formatDataPtFromIso(dateKey),
        ts: datesWithGames.get(dateKey) ?? dayTs,
        hasGames: datesWithGames.has(dateKey),
      });
    }
    return options;
  }, [jogosComMeta]);

  const hojeTs = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  const isHoje = (ts: number) => {
    const d = new Date(ts);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === hojeTs;
  };

  const playableDateOptions = useMemo(() => dateOptions.filter((o) => o.hasGames), [dateOptions]);

  const defaultDate = useMemo(() => {
    const hoje = playableDateOptions.find((o) => isHoje(o.ts));
    const proxima = playableDateOptions.find((o) => o.ts >= hojeTs);
    return (hoje ?? proxima ?? playableDateOptions[playableDateOptions.length - 1] ?? dateOptions[dateOptions.length - 1])?.key ?? '';
  }, [dateOptions, playableDateOptions, hojeTs]);

  const effectiveDate = selectedDate || defaultDate;
  const effectiveDateOption = dateOptions.find((o) => o.key === effectiveDate);
  const effectiveDateTs = effectiveDateOption?.ts ?? 0;
  const effectiveDateLabel = effectiveDateOption?.data ?? '';

  const agendaStageOrder = (item: any) => {
    const stage = item.jogo['Grupo'];
    const order = ['Grupo A', 'Grupo B', 'Grupo C', 'Grupo D', 'Grupo E', 'Grupo F', 'Grupo G', 'Grupo H', 'Grupo I', 'Grupo J', 'Grupo K', 'Grupo L', '16-avos', 'Oitavas', 'Quartas', 'Semifinais', 'Disputa de 3º lugar', 'Final'];
    const idx = order.indexOf(stage);
    return idx === -1 ? 99 : idx;
  };

  const filteredJogos = jogosComMeta.filter(({ jogo, dateKey, isKnockout }) => {
    if (viewMode === 'grupos') return !isKnockout && jogo['Grupo'] === selectedGroup;
    if (viewMode === 'mataMata') return isKnockout && jogo['Grupo'] === selectedKnockoutStage;
    return dateKey === effectiveDate;
  }).sort((a, b) => {
    if (viewMode === 'mataMata') return agendaStageOrder(a) - agendaStageOrder(b) || a.ts - b.ts;
    return a.ts - b.ts;
  });

  const stepGroup = (delta: number) => {
    const idx = groupOptions.indexOf(selectedGroup);
    const next = (idx + delta + groupOptions.length) % groupOptions.length;
    setSelectedGroup(groupOptions[next] as string);
  };

  const isGroupedView = viewMode === 'grupos' || viewMode === 'mataMata';

  const jogosPorGrupo = useMemo(() => {
    if (!isGroupedView) return {};
    return filteredJogos.reduce((acc: Record<string, any[]>, item) => {
      const group = item.jogo['Grupo'] || 'Sem grupo';
      if (!acc[group]) acc[group] = [];
      acc[group].push(item);
      return acc;
    }, {});
  }, [filteredJogos, isGroupedView]);

  const jogosDoDia = useMemo(() => {
    if (isGroupedView) return [];
    return [...filteredJogos].sort((a, b) => a.ts - b.ts);
  }, [filteredJogos, isGroupedView]);

  const stepDate = (delta: number) => {
    if (playableDateOptions.length === 0) return;
    const idx = playableDateOptions.findIndex((o) => o.key === effectiveDate);
    const safeIdx = idx === -1 ? 0 : idx;
    const next = (safeIdx + delta + playableDateOptions.length) % playableDateOptions.length;
    setSelectedDate(playableDateOptions[next].key);
  };

  const shortDate = (ts: number) => new Date(ts).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = ['Grupo', 'Seleção'].includes(key) ? 'asc' : 'desc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    } else if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ col }: { col: string }) => {
    if (sortConfig?.key !== col) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-20" />;
    return sortConfig.direction === 'asc' ? <ArrowUp className={`w-3 h-3 ml-1 ${theme.accentText}`} /> : <ArrowDown className={`w-3 h-3 ml-1 ${theme.accentText}`} />;
  };

  const VIEW_TABS: Array<{ id: ViewMode; label: string }> = [
    { id: 'data', label: 'Por Data' },
    { id: 'grupos', label: 'Por Grupo' },
    { id: 'mataMata', label: 'Mata-mata' },
  ];

  const INFO_TABS: Array<{ id: InfoTab; label: string; emoji: string }> = [
    { id: 'probabilidades', label: 'Probabilidade por Seleção', emoji: '🏆' },
    { id: 'eliminacao', label: 'Probabilidade de Eliminação', emoji: '❌' },
    { id: 'brasil', label: 'Caminho do Brasil', emoji: '🇧🇷' },
  ];

  return (
    <div className="min-h-screen bg-brand-light pb-24 font-opensans">
      <PageHeader
        icon={Trophy}
        eyebrow="Copa do Mundo FIFA 2026"
        title="Previsão"
        accent="Copa do Mundo 2026"
        description="Estimativas probabilísticas para eventos da Copa do Mundo 2026, elaboradas a partir de modelos estatísticos e informações quantitativas sobre seleções, partidas e desempenho."
      />

      {/* METHODOLOGY SELECTOR */}
      <div className="max-w-7xl mx-auto px-4 mt-8 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => setMethodology(1)}
            className={`p-6 md:p-8 rounded-[2rem] text-left transition-all duration-500 border-2 cursor-pointer group flex items-start gap-5 relative overflow-hidden ${
              methodology === 1
                ? 'bg-brand-dark text-white border-brand-dark shadow-2xl scale-[1.02]'
                : 'bg-white text-brand-dark border-brand-dark/10 hover:border-brand-green/45 hover:shadow-xl shadow-md'
            }`}
          >
            <div className={`p-4 rounded-2xl transition-colors ${methodology === 1 ? 'bg-brand-green text-white' : 'bg-brand-green/10 text-brand-green'}`}>
              <TrendingUp className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="font-montserrat text-xs font-black uppercase tracking-widest text-brand-green">Metodologia 1</span>
              <h3 className="font-montserrat font-black text-xl md:text-2xl uppercase tracking-tight leading-none mt-1">Modelo de Força</h3>
              <p className={`text-xs md:text-sm mt-2 leading-relaxed ${methodology === 1 ? 'text-white/60' : 'text-brand-dark/50'}`}>
                Estimativas baseadas no ranking histórico FIFA ELO e simulação clássica de força.
              </p>
            </div>
          </button>
          <button
            onClick={() => setMethodology(2)}
            className={`p-6 md:p-8 rounded-[2rem] text-left transition-all duration-500 border-2 cursor-pointer group flex items-start gap-5 relative overflow-hidden ${
              methodology === 2
                ? 'bg-brand-dark text-white border-brand-dark shadow-2xl scale-[1.02]'
                : 'bg-white text-brand-dark border-brand-dark/10 hover:border-teal-600/45 hover:shadow-xl shadow-md'
            }`}
          >
            <div className={`p-4 rounded-2xl transition-colors ${methodology === 2 ? 'bg-teal-600 text-white' : 'bg-teal-600/10 text-teal-600'}`}>
              <Network className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="font-montserrat text-xs font-black uppercase tracking-widest text-teal-600">Metodologia 2</span>
              <h3 className="font-montserrat font-black text-xl md:text-2xl uppercase tracking-tight leading-none mt-1">Edição Bayesiana</h3>
              <p className={`text-xs md:text-sm mt-2 leading-relaxed ${methodology === 2 ? 'text-white/60' : 'text-brand-dark/50'}`}>
                Estimativas probabilísticas alternativas usando modelagem bayesiana avançada.
              </p>
            </div>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-16">

        {/* STAGE SELECTOR CARD */}
        <div className="bg-white rounded-2xl shadow-md border border-brand-dark/5 px-6 py-5 mb-6">
          <div className="flex-1 min-w-0 mb-1">
            <h2 className="text-[length:clamp(1.2rem,4vw,2.2rem)] font-montserrat font-black text-brand-dark uppercase tracking-tighter leading-none">
              Simulação <span className={`${theme.accentText} italic`}>
                {methodology === 1 ? currentStage.label : currentBayesStage.label}
              </span>
            </h2>
            <p className="text-brand-dark/50 font-light text-sm font-opensans mt-1">
              Simulação realizada em {methodology === 1 ? currentStage.date : currentBayesStage.date}. O torneio foi simulado 1 milhão de vezes e as probabilidades representam a frequência dos acontecimentos.
            </p>
          </div>
          <div className="mt-5">
            <span className="block text-[10px] font-montserrat font-black uppercase tracking-[0.25em] text-brand-dark/40 mb-2">Etapa da simulação</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(methodology === 1 ? STAGES : BAYES_STAGES).map((s) => {
                const isActive = methodology === 1 ? s.id === stageId : s.id === bayesStageId;
                return (
                  <button
                    key={s.id}
                    onClick={() => methodology === 1 ? setStageId(s.id as StageId) : setBayesStageId(s.id as BayesStageId)}
                    className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border-2 transition-all ${isActive ? 'shadow-lg -translate-y-0.5' : 'shadow-sm'}`}
                    style={{
                      borderColor: isActive ? '#2a342e' : theme.accentBorder,
                      color: isActive ? '#ffffff' : theme.accent,
                      backgroundColor: isActive ? '#2a342e' : '#ffffff',
                      boxShadow: isActive ? '0 10px 22px -8px rgba(42,52,46,0.6)' : undefined,
                    }}
                  >
                    {s.label} · {s.date}
                  </button>
                );
              })}
              {methodology === 1 && UPCOMING_STAGES.map((s) => (
                <button
                  key={s.label}
                  disabled
                  title="Em breve — o modelo será rodado ao fim desta etapa"
                  className="px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border-2 shadow-sm cursor-not-allowed"
                  style={{
                    borderColor: 'rgba(42,52,46,0.12)',
                    color: 'rgba(42,52,46,0.35)',
                    backgroundColor: 'rgba(42,52,46,0.04)',
                  }}
                >
                  {s.label} · {s.date}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* INFO TABS — folder-style tabs, after stage list, before titles */}
        <div
          className="flex gap-1 sm:gap-1.5 mb-10 border-b-[3px]"
          style={{ borderColor: theme.accentBorder }}
        >
          {INFO_TABS.map((tab) => {
            const active = infoTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setInfoTab(tab.id)}
                className={`group relative flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-3.5 sm:py-4 -mb-[3px] rounded-t-2xl rounded-b-none font-montserrat font-black uppercase tracking-tight text-[11px] md:text-[13px] leading-none transition-all duration-300 ${
                  active ? 'italic -translate-y-0.5' : 'hover:-translate-y-0.5'
                }`}
                style={
                  active
                    ? {
                        color: '#ffffff',
                        background: theme.tabGradient,
                        boxShadow: `0 -6px 22px -8px ${theme.tabShadow}`,
                      }
                    : {
                        color: 'rgba(42,52,46,0.45)',
                        background: 'rgba(255,255,255,0.65)',
                        borderTop: `1px solid ${theme.accentBorder}`,
                        borderLeft: `1px solid ${theme.accentBorder}`,
                        borderRight: `1px solid ${theme.accentBorder}`,
                      }
                }
              >
                <span className="text-sm sm:text-base leading-none not-italic">{tab.emoji}</span>
                <span className="text-center">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Tab: Probabilidades ── */}
        {infoTab === 'probabilidades' && (
          <div className="space-y-20">
            <section>
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-8 gap-4">
                <h2 className="text-[length:clamp(1.5rem,5.5vw,3.2rem)] whitespace-nowrap font-montserrat font-black text-brand-dark uppercase tracking-tighter leading-none">
                  Probabilidade por <span className={`${theme.accentText} italic`}>Seleção</span>
                </h2>
                <div className="relative w-full xl:w-96">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-dark/30" />
                  <input type="text" placeholder="Filtrar seleção..." className={`w-full pl-14 pr-8 py-5 bg-white border-2 border-brand-dark/5 rounded-3xl text-sm outline-none ${theme.accentFocusBorder} transition-all shadow-sm font-opensans`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-2xl border border-brand-dark/5 overflow-hidden overflow-x-auto overscroll-x-contain">
                <table className="w-full text-left border-collapse min-w-[1080px]">
                  <thead>
                    <tr className="bg-brand-dark text-white font-montserrat text-[10px] uppercase tracking-[0.25em]">
                      <th className="px-4 py-4 cursor-pointer hover:bg-white/5 transition-colors sticky left-0 bg-brand-dark z-20" onClick={() => requestSort('Seleção')}>
                        <div className="flex items-center">Seleção <SortIcon col="Seleção" /></div>
                      </th>
                      <th className="w-10 px-2 py-4 text-center bg-brand-dark cursor-pointer hover:bg-white/5 transition-colors" onClick={() => requestSort('Grupo')}>
                        <div className="flex items-center justify-center">Grupo <SortIcon col="Grupo" /></div>
                      </th>
                      {['1º Grupo', '2º Grupo', '3º Grupo', '4º Grupo', 'Top 32', 'Oitavas', 'Quartas', 'Semi', 'Final', 'Campeão'].map((phase) => (
                        <th key={phase} className="px-3 py-4 text-center cursor-pointer hover:bg-white/5 transition-colors" onClick={() => requestSort(phase)}>
                          <div className="flex items-center justify-center">{phase} <SortIcon col={phase} /></div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-dark/5">
                    {filteredSimulacao.map((team: any, idx) => (
                      <tr key={idx} className={`${theme.accentHoverBgSoft} transition-colors group`}>
                        <td className="p-2.5 px-4 sticky left-0 bg-white group-hover:bg-[#F8FFF9] z-10 border-r border-brand-dark/5">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-brand-dark/30 font-black w-6 tabular-nums font-opensans">{idx + 1}</span>
                            <div className="w-8 h-5 rounded-sm shadow-sm border border-brand-dark/5 overflow-hidden flex-shrink-0">
                              <img src={getFlag(team['Seleção'])} className="w-full h-full object-cover" alt="" loading="lazy" decoding="async" />
                            </div>
                            <span className="font-montserrat font-bold text-brand-dark uppercase tracking-tight text-sm">{team['Seleção']}</span>
                          </div>
                        </td>
                        <td className="px-2 py-2.5 text-center font-montserrat text-xs font-bold text-brand-dark/55">
                          {teamGroupByName[team['Seleção']] || '-'}
                        </td>
                        {['1º Grupo', '2º Grupo', '3º Grupo', '4º Grupo', 'Top 32', 'Oitavas', 'Quartas', 'Semi', 'Final', 'Campeão'].map((phase) => (
                          <td key={phase} className={`px-3 py-2.5 text-center text-sm font-bold tabular-nums font-opensans ${phase === 'Campeão' ? `${theme.accentText} ${theme.accentBgSoftClass} font-black text-base` : 'text-brand-dark/70'}`}>
                            {team[phase]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Games list */}
            <section>
              <div className="mb-10 space-y-6">
                <h2 className="text-[length:clamp(1.5rem,5.5vw,3.2rem)] whitespace-nowrap font-montserrat font-black text-brand-dark uppercase tracking-tighter leading-none mb-4">
                  Agenda de <span className={`${theme.accentText} italic`}>Confrontos</span>
                </h2>

                {methodology === 1 && (
                  <p
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-montserrat font-black uppercase tracking-widest border"
                    style={{ color: theme.accent, borderColor: theme.accentBorder, backgroundColor: theme.accentSoft }}
                  >
                    Probabilidades da etapa {currentStage.label} · simulação de {currentStage.date}
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  {VIEW_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        if (tab.id === 'mataMata' && viewMode !== 'mataMata') {
                          setSelectedKnockoutStage('16-avos');
                        }
                        setViewMode(tab.id);
                      }}
                      className="px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest border-2 transition-all shadow-sm"
                      style={{
                        borderColor: viewMode === tab.id ? theme.accent : theme.accentBorder,
                        color: viewMode === tab.id ? '#ffffff' : theme.accent,
                        backgroundColor: viewMode === tab.id ? theme.accent : '#ffffff',
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-6 border-b border-brand-dark/5">
                  {viewMode === 'grupos' ? (
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      {groupOptions.map((group: any) => (
                        <button
                          key={group}
                          onClick={() => setSelectedGroup(group)}
                          className="px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all bg-white hover:-translate-y-0.5 shadow-sm"
                          style={{
                            borderColor: selectedGroup === group ? theme.accent : theme.accentBorder,
                            color: selectedGroup === group ? '#ffffff' : theme.accent,
                            backgroundColor: selectedGroup === group ? theme.accent : '#ffffff',
                            transform: selectedGroup === group ? 'scale(1.05)' : 'none',
                            boxShadow: selectedGroup === group ? `0 10px 15px -3px ${theme.accentSoft}` : 'none'
                          }}
                        >
                          {getGroupLetter(group)}
                        </button>
                      ))}
                    </div>
                  ) : viewMode === 'data' ? (
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      {dateOptions.map(({ key, ts, hasGames }) => {
                        const isActive = effectiveDate === key;
                        return (
                          <button
                            key={key}
                            disabled={!hasGames}
                            onClick={() => hasGames && setSelectedDate(key)}
                            className={`px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all shadow-sm ${
                              hasGames ? 'bg-white hover:-translate-y-0.5' : 'cursor-not-allowed bg-brand-dark/5 text-brand-dark/25 shadow-none'
                            }`}
                            style={hasGames ? {
                              borderColor: isActive ? theme.accent : theme.accentBorder,
                              color: isActive ? '#ffffff' : theme.accent,
                              backgroundColor: isActive ? theme.accent : '#ffffff',
                              transform: isActive ? 'scale(1.05)' : 'none',
                              boxShadow: isActive ? `0 10px 15px -3px ${theme.accentSoft}` : 'none'
                            } : {
                              borderColor: 'rgba(42,52,46,0.10)',
                              color: 'rgba(42,52,46,0.25)',
                              backgroundColor: 'rgba(42,52,46,0.04)',
                            }}
                          >
                            {shortDate(ts)}{isHoje(ts) ? ' · Hoje' : ''}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      {KNOCKOUT_STAGE_OPTIONS.map(({ value, label }) => {
                        const isActive = selectedKnockoutStage === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setSelectedKnockoutStage(value)}
                            className="px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all shadow-sm hover:-translate-y-0.5"
                            style={{
                              borderColor: isActive ? theme.accent : theme.accentBorder,
                              color: isActive ? '#ffffff' : theme.accent,
                              backgroundColor: isActive ? theme.accent : '#ffffff',
                              transform: isActive ? 'scale(1.05)' : 'none',
                              boxShadow: isActive ? `0 10px 15px -3px ${theme.accentSoft}` : 'none',
                            }}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  )}

                </div>
              </div>

              <div className="space-y-10">
                {isGroupedView && Object.entries(jogosPorGrupo).map(([group, itens]) => (
                  <div key={group} className="bg-white border-2 shadow-md overflow-hidden" style={{ borderColor: theme.accent, borderRadius: 16 }}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-5 border-b-2" style={{ backgroundColor: theme.accent, borderColor: theme.accent }}>
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 flex items-center justify-center font-montserrat font-black text-3xl bg-white shadow-inner" style={{ color: theme.accent, borderRadius: 12 }}>
                          {getAgendaBadge(group)}
                        </div>
                        <h3 className="text-3xl font-montserrat font-black text-white leading-none uppercase tracking-tight">{group}</h3>
                      </div>
                    </div>
                    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-5 p-5 md:p-6 bg-brand-light/20">
                      {(itens as any[]).map((item: any, idx: number) => (
                        <JogoCard key={`${group}-${idx}`} jogo={item.jogo} theme={theme} />
                      ))}
                    </div>
                  </div>
                ))}
                {!isGroupedView && jogosDoDia.length > 0 && (
                  <div className="bg-white border-2 shadow-md overflow-hidden" style={{ borderColor: theme.accent, borderRadius: 16 }}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-5 border-b-2" style={{ backgroundColor: theme.accent, borderColor: theme.accent }}>
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 flex items-center justify-center bg-white shadow-inner flex-shrink-0" style={{ color: theme.accent, borderRadius: 12 }}>
                          <CalendarDays className="w-7 h-7" />
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-montserrat font-black text-white leading-none uppercase tracking-tight">{effectiveDateLabel}</h3>
                          <span className="block text-[10px] font-montserrat font-black uppercase tracking-widest text-white/70 mt-1.5">
                            {jogosDoDia.length} {jogosDoDia.length === 1 ? 'jogo' : 'jogos'}{isHoje(effectiveDateTs) ? ' · Hoje' : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-5 p-5 md:p-6 bg-brand-light/20">
                      {jogosDoDia.map((item: any, idx: number) => (
                        <JogoCard key={`${effectiveDate}-${idx}`} jogo={item.jogo} theme={theme} showGroup />
                      ))}
                    </div>
                  </div>
                )}
                {filteredJogos.length > 0 && viewMode !== 'mataMata' && (
                  <div className="flex items-center justify-center gap-6 pt-2">
                    <button
                      onClick={() => (viewMode === 'grupos' ? stepGroup(-1) : stepDate(-1))}
                      aria-label={viewMode === 'grupos' ? 'Grupo anterior' : 'Dia anterior'}
                      className="w-11 h-11 flex items-center justify-center rounded-full border border-brand-dark/10 bg-white text-brand-dark/40 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                      style={{ color: theme.accent }}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-[11px] font-montserrat font-black uppercase tracking-widest text-brand-dark/40 min-w-[5.5rem] text-center">
                      {viewMode === 'grupos' ? selectedGroup : shortDate(effectiveDateTs)}
                    </span>
                    <button
                      onClick={() => (viewMode === 'grupos' ? stepGroup(1) : stepDate(1))}
                      aria-label={viewMode === 'grupos' ? 'Próximo grupo' : 'Próximo dia'}
                      className="w-11 h-11 flex items-center justify-center rounded-full border border-brand-dark/10 bg-white text-brand-dark/40 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                      style={{ color: theme.accent }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
                {filteredJogos.length === 0 && (
                  <div className="bg-white border-2 border-dashed border-brand-dark/10 p-16 text-center rounded-[2rem]">
                    <p className="font-montserrat font-black uppercase text-brand-dark text-xl">Nenhum confronto encontrado</p>
                    <p className="text-sm text-brand-dark/45 mt-2">Ajuste o filtro de data, grupo, mata-mata ou a busca por seleção.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* ── Tab: Eliminação ── */}
        {infoTab === 'eliminacao' && (
          <section>
            <div className="mb-8">
              <h2 className="text-[length:clamp(1.5rem,5.5vw,3.2rem)] font-montserrat font-black text-brand-dark uppercase tracking-tighter leading-none mb-2">
                Probabilidade de <span className={`${theme.accentText} italic`}>Eliminação</span>
              </h2>
              <p className="text-brand-dark/50 font-light text-base md:text-lg font-opensans max-w-3xl">
                Em qual fase cada seleção é eliminada. Cada linha soma 100%: a chance de a seleção cair em cada etapa.
                {' '}<span className="font-bold text-brand-dark/70">Campeã</span> = venceu o torneio; <span className="font-bold text-brand-dark/70">Vice</span> = perdeu a final.
              </p>
            </div>
            {methodology === 2
              ? <NoDataNotice>A análise detalhada de eliminação está disponível apenas na <span className="font-bold">Metodologia 1 — Modelo de Força</span>. A edição bayesiana fornece somente a tabela de probabilidades por fase.</NoDataNotice>
              : <EliminacaoSection analise={currentAnalise} theme={theme} />}
          </section>
        )}

        {/* ── Tab: Caminho do Brasil ── */}
        {infoTab === 'brasil' && (
          <section>
            <div className="mb-8">
              <h2 className="text-[length:clamp(1.5rem,5.5vw,3.2rem)] font-montserrat font-black text-brand-dark uppercase tracking-tighter leading-none mb-2">
                Caminho do <span className={`${theme.accentText} italic`}>Brasil</span>
              </h2>
              <p className="text-brand-dark/50 font-light text-base md:text-lg font-opensans max-w-3xl">
                Adversários prováveis, ameaças e condições para o título — o panorama completo da Seleção nesta etapa.
              </p>
            </div>
            {methodology === 2
              ? <NoDataNotice>O detalhamento do caminho do Brasil está disponível apenas na <span className="font-bold">Metodologia 1 — Modelo de Força</span>. A edição bayesiana fornece somente a tabela de probabilidades por fase.</NoDataNotice>
              : <BrasilSection analise={currentAnalise} theme={theme} />}
          </section>
        )}

      </div>
    </div>
  );
};

export default WorldCupHub;
