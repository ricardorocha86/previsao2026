import React, { useEffect, useRef, useState } from 'react';
import {
  Trophy, Target, Skull, Globe2, ShieldAlert, Sparkles,
  ArrowRight, Flag, Swords, MapPin, Dices, Flame, Activity,
} from 'lucide-react';
import PageHeader from './PageHeader';

/* ------------------------------------------------------------------ */
/*  DADOS — retrato INÍCIO DA COPA (11/06/2026) · 1.000.000 de Copas    */
/* ------------------------------------------------------------------ */

const ENG_FLAG = '🏴\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}';

const CHAMPION_ODDS = [
  { team: 'Espanha', flag: '🇪🇸', value: 15.9 },
  { team: 'França', flag: '🇫🇷', value: 14.8 },
  { team: 'Inglaterra', flag: ENG_FLAG, value: 10.3 },
  { team: 'Portugal', flag: '🇵🇹', value: 9.9 },
  { team: 'Brasil', flag: '🇧🇷', value: 8.3, highlight: true },
  { team: 'Argentina', flag: '🇦🇷', value: 8.2 },
  { team: 'Alemanha', flag: '🇩🇪', value: 5.6 },
  { team: 'Holanda', flag: '🇳🇱', value: 4.5 },
  { team: 'Noruega', flag: '🇳🇴', value: 2.4 },
  { team: 'Bélgica', flag: '🇧🇪', value: 2.2 },
];

const BRAZIL_FUNNEL = [
  { stage: 'Classificar (Top 32)', value: 95.4 },
  { stage: 'Oitavas de final', value: 63.6 },
  { stage: 'Quartas de final', value: 41.7 },
  { stage: 'Semifinal', value: 25.3 },
  { stage: 'Final', value: 15.0 },
  { stage: 'CAMPEÃO 🏆', value: 8.3 },
];

const BRAZIL_CONDITIONAL = [
  { stage: 'Se chegar às oitavas', value: 13.1 },
  { stage: 'Se chegar às quartas', value: 20.0 },
  { stage: 'Se chegar à semifinal', value: 32.9 },
  { stage: 'Se chegar à final', value: 55.6 },
];

const CARRASCOS = [
  { team: 'Holanda', flag: '🇳🇱', value: 13.8 },
  { team: 'França', flag: '🇫🇷', value: 9.7 },
  { team: 'Japão', flag: '🇯🇵', value: 9.7 },
  { team: 'Alemanha', flag: '🇩🇪', value: 6.6 },
  { team: 'Inglaterra', flag: ENG_FLAG, value: 6.2 },
  { team: 'Suécia', flag: '🇸🇪', value: 5.4 },
  { team: 'Noruega', flag: '🇳🇴', value: 3.9 },
  { team: 'Espanha', flag: '🇪🇸', value: 3.9 },
  { team: 'Portugal', flag: '🇵🇹', value: 3.2 },
  { team: 'México', flag: '🇲🇽', value: 3.0 },
];

const GROUP_TITLE_ODDS = [
  { pos: '1º no grupo', value: 8.5, note: 'largar na frente, mas a taça não exige' },
  { pos: '2º no grupo', value: 9.3, note: 'mais chances no chaveamento?' },
  { pos: '3º no grupo', value: 7.1, note: 'caminho mais duro, mas título possível' },
  { pos: '4º no grupo', value: 0.0, note: 'eliminado — fim da Copa' },
];

const BRAZIL_ELIM_DIST = [
  { stage: 'Não classifica (grupos)', value: 4.6, color: '#7A7A7A' },
  { stage: 'Cai nos 16-avos', value: 31.8, color: '#BF1A1F' },
  { stage: 'Cai nas oitavas', value: 21.9, color: '#BF1A1F' },
  { stage: 'Cai nas quartas', value: 16.4, color: '#E27C2D' },
  { stage: 'Cai na semifinal', value: 10.3, color: '#E27C2D' },
  { stage: 'Perde a final', value: 6.7, color: '#035C88' },
  { stage: 'CAMPEÃO 🏆', value: 8.3, color: '#209927' },
];

const MATA_MATA_STAGES = [
  {
    stage: '16-avos',
    eyebrow: 'Estreia do mata-mata',
    teams: [
      { team: 'Holanda', flag: '🇳🇱', value: 31.0 },
      { team: 'Japão', flag: '🇯🇵', value: 28.0 },
      { team: 'Suécia', flag: '🇸🇪', value: 20.9 },
      { team: 'Tunísia', flag: '🇹🇳', value: 10.1 },
      { team: 'Alemanha', flag: '🇩🇪', value: 3.5 },
    ],
  },
  {
    stage: 'Oitavas',
    eyebrow: 'Se passar dos 16-avos',
    teams: [
      { team: 'França', flag: '🇫🇷', value: 14.8 },
      { team: 'Noruega', flag: '🇳🇴', value: 12.5 },
      { team: 'Alemanha', flag: '🇩🇪', value: 10.1 },
      { team: 'Equador', flag: '🇪🇨', value: 9.2 },
      { team: 'Senegal', flag: '🇸🇳', value: 8.6 },
    ],
  },
  {
    stage: 'Quartas',
    eyebrow: 'Se chegar às quartas',
    teams: [
      { team: 'Inglaterra', flag: ENG_FLAG, value: 20.7 },
      { team: 'França', flag: '🇫🇷', value: 12.2 },
      { team: 'Alemanha', flag: '🇩🇪', value: 8.7 },
      { team: 'México', flag: '🇲🇽', value: 8.5 },
      { team: 'Noruega', flag: '🇳🇴', value: 4.2 },
    ],
  },
  {
    stage: 'Semifinal',
    eyebrow: 'Se chegar à semi',
    teams: [
      { team: 'Espanha', flag: '🇪🇸', value: 16.4 },
      { team: 'Portugal', flag: '🇵🇹', value: 16.1 },
      { team: 'Argentina', flag: '🇦🇷', value: 15.9 },
      { team: 'Bélgica', flag: '🇧🇪', value: 6.1 },
      { team: 'Colômbia', flag: '🇨🇴', value: 5.3 },
    ],
  },
  {
    stage: 'Final',
    eyebrow: 'Se chegar à final',
    teams: [
      { team: 'Espanha', flag: '🇪🇸', value: 15.2 },
      { team: 'França', flag: '🇫🇷', value: 14.6 },
      { team: 'Inglaterra', flag: ENG_FLAG, value: 8.4 },
      { team: 'Portugal', flag: '🇵🇹', value: 8.1 },
      { team: 'Argentina', flag: '🇦🇷', value: 6.7 },
    ],
  },
];

const TOP_FINALS = [
  { rank: 1, a: { team: 'Inglaterra', flag: ENG_FLAG }, b: { team: 'Espanha', flag: '🇪🇸' }, value: 3.2 },
  { rank: 2, a: { team: 'Portugal', flag: '🇵🇹' }, b: { team: 'Espanha', flag: '🇪🇸' }, value: 3.2 },
  { rank: 3, a: { team: 'Argentina', flag: '🇦🇷' }, b: { team: 'Espanha', flag: '🇪🇸' }, value: 3.1 },
  { rank: 4, a: { team: 'França', flag: '🇫🇷' }, b: { team: 'Espanha', flag: '🇪🇸' }, value: 2.7 },
  { rank: 5, a: { team: 'Inglaterra', flag: ENG_FLAG }, b: { team: 'França', flag: '🇫🇷' }, value: 2.7 },
  { rank: 7, a: { team: 'Brasil', flag: '🇧🇷' }, b: { team: 'Espanha', flag: '🇪🇸' }, value: 2.3, highlight: true },
];

const CONFEDERATIONS = [
  { name: 'Europa (UEFA)', short: 'Europa', value: 70.2, color: '#035C88' },
  { name: 'América do Sul (Conmebol)', short: 'A. do Sul', value: 20.8, color: '#209927' },
  { name: 'Concacaf', short: 'Concacaf', value: 3.5, color: '#E27C2D' },
  { name: 'África (CAF)', short: 'África', value: 3.2, color: '#FFCF26' },
  { name: 'Ásia (AFC)', short: 'Ásia', value: 2.3, color: '#BF1A1F' },
  { name: 'Oceania', short: 'Oceania', value: 0.003, color: '#7A7A7A' },
];

const FAVORITES_AT_RISK = [
  { team: 'Senegal', flag: '🇸🇳', value: 39.8 },
  { team: 'Noruega', flag: '🇳🇴', value: 27.2 },
  { team: 'Japão', flag: '🇯🇵', value: 20.2 },
  { team: 'Turquia', flag: '🇹🇷', value: 19.6 },
  { team: 'Croácia', flag: '🇭🇷', value: 19.3 },
  { team: 'Uruguai', flag: '🇺🇾', value: 15.2 },
  { team: 'Holanda', flag: '🇳🇱', value: 11.3 },
];

const HOSTS = [
  { team: 'México', flag: '🇲🇽', rank: 13, value: 1.8 },
  { team: 'Estados Unidos', flag: '🇺🇸', rank: 15, value: 1.4 },
  { team: 'Canadá', flag: '🇨🇦', rank: 27, value: 0.3 },
];

const GROUP_DEATH = { letter: 'I', champ: 18.2, teams: [
  { team: 'França', flag: '🇫🇷' }, { team: 'Noruega', flag: '🇳🇴' },
  { team: 'Senegal', flag: '🇸🇳' }, { team: 'Iraque', flag: '🇮🇶' },
] };
const GROUP_CALM = { letter: 'B', champ: 1.6, teams: [
  { team: 'Suíça', flag: '🇨🇭' }, { team: 'Canadá', flag: '🇨🇦' },
  { team: 'Bósnia', flag: '🇧🇦' }, { team: 'Catar', flag: '🇶🇦' },
] };

const PIPELINE = [
  {
    step: '1',
    title: 'Índice de força',
    text: 'Cada uma das 48 seleções recebe um índice de força, calibrado contra três fontes globais de previsão (Kalshi, Polymarket e o agregado de casas do Oddschecker) na véspera da estreia.',
  },
  {
    step: '2',
    title: 'Modelo de gols',
    text: 'A força das duas seleções alimenta um modelo de gols Poisson com ajuste Dixon-Coles, que gera o placar de cada partida — do jogo de abertura à final.',
  },
  {
    step: '3',
    title: '1.000.000 de Copas',
    text: 'O torneio inteiro — grupos, classificação dos melhores terceiros e o mata-mata com o chaveamento oficial da FIFA — é simulado um milhão de vezes. Os números da página são a média de tudo isso.',
  },
];

/* ------------------------------------------------------------------ */
/*  HOOK — revela/anima quando entra na viewport                       */
/* ------------------------------------------------------------------ */

const useReveal = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

const fmt = (v: number) => (v < 1 ? v.toString().replace('.', ',') : v.toFixed(1).replace('.0', '').replace('.', ','));

/* ------------------------------------------------------------------ */
/*  VISUALIZAÇÃO — gráfico de barras horizontais animado               */
/* ------------------------------------------------------------------ */

interface BarDatum { team: string; flag: string; value: number; highlight?: boolean }

const BarChart: React.FC<{ data: BarDatum[]; color?: string; suffix?: string; labelWidth?: string }> = ({
  data, color = '#209927', suffix = '%', labelWidth = 'w-32 sm:w-40',
}) => {
  const { ref, visible } = useReveal();
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div ref={ref} className="space-y-2.5">
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        const barColor = d.highlight ? '#FFCF26' : color;
        return (
          <div key={d.team} className="flex items-center gap-3">
            <div className={`flex ${labelWidth} flex-shrink-0 items-center gap-2`}>
              {d.flag && <span className="text-xl leading-none">{d.flag}</span>}
              <span className={`truncate font-montserrat text-xs font-bold uppercase tracking-wide sm:text-sm ${d.highlight ? 'text-brand-dark' : 'text-brand-dark/75'}`}>
                {d.team}
              </span>
            </div>
            <div className="relative h-8 flex-grow overflow-hidden rounded-md bg-brand-dark/5">
              <div
                className="flex h-full items-center justify-end rounded-md pr-2.5 transition-all duration-[1100ms] ease-out"
                style={{
                  width: visible ? `${Math.max(pct, 7)}%` : '0%',
                  backgroundColor: barColor,
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                <span className={`font-montserrat text-xs font-black ${d.highlight ? 'text-brand-dark' : 'text-white'}`}>
                  {fmt(d.value)}{suffix}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  VISUALIZAÇÃO — funil de avanço do Brasil                           */
/* ------------------------------------------------------------------ */

const Funnel: React.FC<{ data: { stage: string; value: number }[] }> = ({ data }) => {
  const { ref, visible } = useReveal();
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div ref={ref} className="mx-auto max-w-3xl space-y-2">
      {data.map((d, i) => {
        const last = i === data.length - 1;
        const pct = (d.value / max) * 100;
        return (
          <div key={d.stage} className="flex items-center gap-3">
            <span className={`w-32 flex-shrink-0 text-right font-montserrat text-[11px] font-bold uppercase leading-tight tracking-wide sm:w-44 sm:text-xs ${last ? 'text-brand-yellow' : 'text-white/80'}`}>
              {d.stage}
            </span>
            <div className="flex flex-grow justify-center">
              <div
                className="h-9 rounded-md transition-all duration-[1000ms] ease-out"
                style={{
                  width: visible ? `${Math.max(pct, 4)}%` : '0%',
                  opacity: visible ? 1 : 0,
                  transitionDelay: `${i * 110}ms`,
                  background: last
                    ? 'linear-gradient(90deg,#FFCF26,#FFB300)'
                    : 'linear-gradient(90deg,#209927,#00621A)',
                }}
              />
            </div>
            <span className={`w-14 flex-shrink-0 font-montserrat text-sm font-black sm:text-base ${last ? 'text-brand-yellow' : 'text-white'}`}>
              {fmt(d.value)}%
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  VISUALIZAÇÃO — barra empilhada 100% (confederações)                */
/* ------------------------------------------------------------------ */

const StackedBar: React.FC<{ data: typeof CONFEDERATIONS }> = ({ data }) => {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref}>
      <div className="flex h-12 w-full overflow-hidden rounded-lg shadow-inner">
        {data.map((d, i) => (
          <div
            key={d.name}
            className="flex items-center justify-center transition-all duration-[1200ms] ease-out"
            style={{
              width: visible ? `${d.value}%` : '0%',
              backgroundColor: d.color,
              transitionDelay: `${i * 90}ms`,
            }}
            title={`${d.name}: ${fmt(d.value)}%`}
          >
            {d.value >= 6 && (
              <span className="font-montserrat text-xs font-black text-white drop-shadow">{fmt(d.value)}%</span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: d.color }} />
            <span className="font-montserrat text-xs font-bold uppercase tracking-wide text-brand-dark/70">
              {d.short} <span className="text-brand-dark/45">{fmt(d.value)}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  COMPONENTES DE TÍTULO/STAT                                          */
/* ------------------------------------------------------------------ */

const SectionTitle: React.FC<{ eyebrow: string; title: string; children?: React.ReactNode }> = ({ eyebrow, title, children }) => (
  <div className="mb-8 max-w-2xl">
    <p className="mb-2 font-montserrat text-xs font-black uppercase tracking-[0.25em] text-brand-green">{eyebrow}</p>
    <h2 className="font-montserrat text-3xl font-black uppercase leading-none tracking-tight text-brand-dark md:text-4xl">{title}</h2>
    {children && <p className="mt-4 text-base leading-relaxed text-brand-dark/65">{children}</p>}
  </div>
);

const BigStat: React.FC<{ value: string; label: string; accent?: string }> = ({ value, label, accent = 'text-brand-green' }) => (
  <div className="rounded-2xl border border-brand-dark/10 bg-white p-6 text-center shadow-sm">
    <p className={`font-montserrat text-4xl font-black leading-none md:text-5xl ${accent}`}>{value}</p>
    <p className="mt-3 text-xs font-semibold uppercase leading-snug tracking-wide text-brand-dark/55">{label}</p>
  </div>
);

/* ------------------------------------------------------------------ */
/*  PÁGINA                                                              */
/* ------------------------------------------------------------------ */

const HexaPage: React.FC = () => {
  return (
    <div className="bg-brand-light font-opensans">
      <PageHeader
        icon={Trophy}
        eyebrow="Análise Especial · Início da Copa · 1.000.000 de simulações"
        title="O Caminho Rumo ao"
        accent="Hexa 🇧🇷"
        noBreak
        description="Rodamos a Copa do Mundo de 2026 um milhão de vezes na véspera da estreia. Estas são as histórias — e os números — que saíram de dentro do nosso modelo."
      />

      {/* LEAD */}
      <section className="border-b border-brand-dark/10 bg-white">
        <div className="mx-auto max-w-[1080px] px-4 py-14">
          <p className="text-xl font-light leading-relaxed text-brand-dark/80 md:text-2xl">
            <span className="font-montserrat text-2xl font-black text-brand-green md:text-3xl">Um milhão de Copas.</span>{' '}
            Em cada uma delas, 48 seleções disputaram do primeiro jogo da fase de grupos até a bola
            parar na final. Quando somamos tudo, um retrato nítido apareceu: a taça de 2026 é{' '}
            <strong className="font-semibold text-brand-dark">disputadíssima</strong>, a Europa larga
            na frente — e o Brasil aparece logo ali, à espreita, como o melhor dos não-europeus.
            Esta é a leitura, número por número, do que o modelo enxergou no{' '}
            <em>retrato do início da Copa</em>, simulado em 11/06/2026, antes de a bola rolar.
          </p>
        </div>
      </section>

      {/* 1 · FAVORITOS */}
      <section className="mx-auto max-w-[1080px] px-4 py-16">
        <SectionTitle eyebrow="O pelotão da frente" title="Duas na ponta, um pelotão na cola">
          Nem a favorita chega a 1 em cada 6 chances de título. A <strong>Espanha</strong> assumiu a
          ponta com <strong>15,9%</strong>, com a França colada (14,8%) — e, logo atrás da dupla,
          um quarteto embolado: Inglaterra, Portugal, <strong>Brasil (5º, 8,3%)</strong> e
          Argentina, separados por 2 pontos. É uma Copa de pelo menos seis candidatos reais.
        </SectionTitle>
        <div className="rounded-3xl border border-brand-dark/10 bg-white p-6 shadow-sm md:p-8">
          <p className="mb-5 font-montserrat text-xs font-black uppercase tracking-widest text-brand-dark/40">
            Probabilidade de ser campeão · Top 10
          </p>
          <BarChart data={CHAMPION_ODDS} />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <BigStat value="15,9%" label="A Espanha, nova favorita — mas sem disparar" />
          <BigStat value="30,7%" label="de chance de a taça ficar com Espanha ou França" accent="text-brand-blue" />
          <BigStat value="5º" label="O Brasil entre os favoritos — o melhor fora da Europa" accent="text-brand-yellow" />
        </div>
      </section>

      {/* 2 · FUNIL DO BRASIL */}
      <section className="bg-brand-dark py-16 text-white">
        <div className="mx-auto max-w-[1080px] px-4">
          <div className="mb-8 max-w-2xl">
            <p className="mb-2 font-montserrat text-xs font-black uppercase tracking-[0.25em] text-brand-neon">
              <Flag className="mr-1 inline h-4 w-4" /> A jornada da Seleção
            </p>
            <h2 className="font-montserrat text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
              Até onde o Brasil chega
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/55">
              O Brasil quase não tropeça na largada: classifica em <strong className="text-white">95%</strong>{' '}
              das simulações. O afunilamento vem depois — e ergue a taça em <strong className="text-white">8,3%</strong>{' '}
              das Copas. Cada degrau abaixo é uma porta que vai ficando mais estreita.
            </p>
          </div>
          <Funnel data={BRAZIL_FUNNEL} />
        </div>
      </section>

      {/* 3 · BRASIL CONDICIONAL */}
      <section className="mx-auto max-w-[1080px] px-4 py-16">
        <SectionTitle eyebrow="O detalhe que anima o torcedor" title="Quanto mais longe, mais favorito">
          Há um número que muda o humor de qualquer torcedor: <strong>se o Brasil chegar à final,
          a chance de título salta para 55,6%</strong>. Ou seja, passar da semi já vira o jogo a
          favor. O obstáculo é o caminho até lá.
        </SectionTitle>
        <div className="rounded-3xl border border-brand-dark/10 bg-white p-6 shadow-sm md:p-8">
          <p className="mb-5 font-montserrat text-xs font-black uppercase tracking-widest text-brand-dark/40">
            Probabilidade de o Brasil ser campeão, dado que alcançou cada fase
          </p>
          <BarChart
            data={BRAZIL_CONDITIONAL.map((d) => ({ team: d.stage, flag: '', value: d.value, highlight: d.value > 50 }))}
            color="#00621A"
            labelWidth="w-44 sm:w-60"
          />
        </div>
      </section>

      {/* 4 · TÍTULO POR POSIÇÃO NO GRUPO */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-[1080px] px-4">
          <SectionTitle eyebrow="A largada importa?" title="O Hexa depende de terminar em 1º?">
            Não necessariamente. Fechar o grupo em <strong>2º dá a maior chance de título</strong>{' '}
            (9,3%) — ligeiramente acima de terminar em 1º (8,5%). O modelo explica: o chaveamento
            da Copa de 2026 pode colocar o 2º de um grupo mais fraco num caminho mais fácil.
            Terminar em 3º ainda abre a porta (7,1%), mas em 4º a Copa acaba ali.
          </SectionTitle>
          <div className="grid gap-4 sm:grid-cols-4">
            {GROUP_TITLE_ODDS.map((g) => (
              <div
                key={g.pos}
                className={`rounded-2xl border p-5 text-center shadow-sm ${
                  g.value === 0
                    ? 'border-brand-dark/10 bg-brand-dark/5'
                    : g.value >= 9
                    ? 'border-brand-green/30 bg-brand-green/5'
                    : 'border-brand-dark/10 bg-brand-light'
                }`}
              >
                <p className="font-montserrat text-xs font-black uppercase tracking-widest text-brand-dark/45">{g.pos}</p>
                <p className={`mt-3 font-montserrat text-4xl font-black leading-none ${g.value === 0 ? 'text-brand-dark/30' : g.value >= 9 ? 'text-brand-green' : 'text-brand-dark'}`}>
                  {g.value === 0 ? '—' : `${g.value.toFixed(1).replace('.', ',')}%`}
                </p>
                <p className="mt-2 text-[11px] leading-snug text-brand-dark/45">{g.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 · DISTRIBUIÇÃO DE ELIMINAÇÃO */}
      <section className="mx-auto max-w-[1080px] px-4 py-16">
        <SectionTitle eyebrow="O destino mais provável" title="Em qual fase o Brasil costuma cair">
          De todas as Copas simuladas, o Brasil <strong>não classifica em apenas 4,6%</strong> delas.
          O pior pesadelo é cair logo nos 16-avos — acontece em <strong>32%</strong> das vezes.
          Mas a soma de "chegar pelo menos à semi" é expressiva: <strong>mais de 1 em cada 4</strong>{' '}
          Copas o Brasil joga uma semifinal.
        </SectionTitle>
        <div className="space-y-2.5">
          {BRAZIL_ELIM_DIST.map((d, i) => {
            const max = 31.8;
            const pct = (d.value / max) * 100;
            const isChamp = d.stage.includes('CAMPEÃO');
            return (
              <ElimBar key={d.stage} label={d.stage} value={d.value} pct={pct} color={isChamp ? '#FFCF26' : d.color} delay={i * 80} isChamp={isChamp} />
            );
          })}
        </div>
      </section>

      {/* 6 · TOP 5 ADVERSÁRIOS POR FASE */}
      <section className="bg-brand-dark py-16 text-white">
        <div className="mx-auto max-w-[1080px] px-4">
          <div className="mb-8 max-w-2xl">
            <p className="mb-2 font-montserrat text-xs font-black uppercase tracking-[0.25em] text-brand-neon">
              <Swords className="mr-1 inline h-4 w-4" /> O caminho pedra a pedra
            </p>
            <h2 className="font-montserrat text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
              Quem espera o Brasil em cada fase
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/55">
              O chaveamento já existe — e o modelo calculou os adversários mais prováveis em cada
              etapa. Nos 16-avos, a <strong className="text-white">Holanda</strong> domina (31%). Na
              final, um duelo europeu: <strong className="text-white">Espanha e França</strong> como
              prováveis adversárias.
            </p>
          </div>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MATA_MATA_STAGES.slice(0, 3).map((s) => (
                <div key={s.stage} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="font-montserrat text-[10px] font-black uppercase tracking-[0.2em] text-brand-neon/70">{s.eyebrow}</p>
                  <p className="mt-1 font-montserrat text-base font-black uppercase tracking-tight text-white">{s.stage}</p>
                  <div className="mt-4 space-y-2">
                    {s.teams.map((t, ti) => (
                      <div key={t.team} className="flex items-center gap-2">
                        <span className="w-5 flex-shrink-0 font-montserrat text-[10px] font-black text-white/25">{ti + 1}</span>
                        <span className="text-base leading-none">{t.flag}</span>
                        <span className="flex-grow truncate font-montserrat text-xs font-bold uppercase text-white/80">{t.team}</span>
                        <span className="flex-shrink-0 font-montserrat text-xs font-black text-brand-neon">{t.value.toFixed(1).replace('.', ',')}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:mx-auto lg:max-w-[712px]">
              {MATA_MATA_STAGES.slice(3).map((s) => (
                <div key={s.stage} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="font-montserrat text-[10px] font-black uppercase tracking-[0.2em] text-brand-neon/70">{s.eyebrow}</p>
                  <p className="mt-1 font-montserrat text-base font-black uppercase tracking-tight text-white">{s.stage}</p>
                  <div className="mt-4 space-y-2">
                    {s.teams.map((t, ti) => (
                      <div key={t.team} className="flex items-center gap-2">
                        <span className="w-5 flex-shrink-0 font-montserrat text-[10px] font-black text-white/25">{ti + 1}</span>
                        <span className="text-base leading-none">{t.flag}</span>
                        <span className="flex-grow truncate font-montserrat text-xs font-bold uppercase text-white/80">{t.team}</span>
                        <span className="flex-shrink-0 font-montserrat text-xs font-black text-brand-neon">{t.value.toFixed(1).replace('.', ',')}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7 · CARRASCOS */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-[1080px] px-4">
          <SectionTitle eyebrow="O fantasma é laranja" title="Quem mais elimina o Brasil">
            Quando o Brasil cai, há um nome que se repete mais que todos: a{' '}
            <strong>Holanda</strong> — velha conhecida de 1974, 1998 e 2010. Pelo chaveamento
            oficial, a laranja é o cruzamento mais provável do Brasil já na estreia do mata-mata
            (31% nos 16-avos) e derruba a Seleção em <strong>1 a cada 7 Copas</strong>. França e
            Japão vêm logo atrás, praticamente empatados.
          </SectionTitle>
          <div className="rounded-3xl border border-brand-red/15 bg-brand-red/5 p-6 shadow-sm md:p-8">
            <p className="mb-5 font-montserrat text-xs font-black uppercase tracking-widest text-brand-red/60">
              <Skull className="mr-1 inline h-4 w-4" /> Eliminador do Brasil · % do total de Copas
            </p>
            <BarChart data={CARRASCOS} color="#BF1A1F" />
          </div>
        </div>
      </section>

      {/* 6 · FINAIS MAIS PROVÁVEIS */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-[1080px] px-4">
          <SectionTitle eyebrow="A decisão dos sonhos" title="As finais mais prováveis">
            Entre todas as 995 finais diferentes que apareceram, a mais frequente é{' '}
            <strong>Inglaterra x Espanha</strong>. A Espanha, aliás, é a "rainha das finais":
            aparece em 4 das 5 decisões mais prováveis. A final com Brasil mais provável também é
            contra ela — a 7ª mais frequente de todas.
          </SectionTitle>
          <div className="space-y-3">
            {TOP_FINALS.map((f, i) => (
              <div
                key={i}
                className={`flex items-center justify-between rounded-2xl border p-4 shadow-sm md:p-5 ${
                  f.highlight ? 'border-brand-yellow bg-brand-yellow/10' : 'border-brand-dark/10 bg-brand-light'
                }`}
              >
                <div className="flex items-center gap-3 md:gap-5">
                  <span className="hidden font-montserrat text-lg font-black text-brand-dark/25 sm:block">{f.rank}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{f.a.flag}</span>
                    <span className="font-montserrat text-sm font-bold uppercase text-brand-dark md:text-base">{f.a.team}</span>
                  </div>
                  <span className="font-montserrat text-xs font-black text-brand-dark/35">×</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{f.b.flag}</span>
                    <span className="font-montserrat text-sm font-bold uppercase text-brand-dark md:text-base">{f.b.team}</span>
                  </div>
                </div>
                <span className="font-montserrat text-lg font-black text-brand-green md:text-xl">{fmt(f.value)}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 · MAPA DO PODER (CONFEDERAÇÕES) */}
      <section className="mx-auto max-w-[1080px] px-4 py-16">
        <SectionTitle eyebrow="O mapa do poder" title="90% da taça entre dois continentes">
          A geografia do título é implacável: <strong>Europa (70,2%)</strong> e{' '}
          <strong>América do Sul (20,8%)</strong> concentram mais de <strong>9 em cada 10</strong>{' '}
          títulos simulados. Para o resto do mundo, levantar a taça segue sendo a grande exceção.
        </SectionTitle>
        <div className="rounded-3xl border border-brand-dark/10 bg-white p-6 shadow-sm md:p-8">
          <p className="mb-5 font-montserrat text-xs font-black uppercase tracking-widest text-brand-dark/40">
            <Globe2 className="mr-1 inline h-4 w-4" /> De onde sai o campeão · por confederação
          </p>
          <StackedBar data={CONFEDERATIONS} />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <BigStat value="36%" label="de chance de o campeão ser uma seleção que nunca levou a taça" accent="text-brand-green" />
          <BigStat value="10,5%" label="seleções com 1 ou 2 títulos são as mais perigosas, uma a uma" accent="text-brand-blue" />
          <BigStat value="0,11%" label="é toda a chance somada das 4 estreantes em Copas" accent="text-brand-red" />
        </div>
      </section>

      {/* 8 · ZEBRAS */}
      <section className="bg-brand-dark py-16 text-white">
        <div className="mx-auto max-w-[1080px] px-4">
          <div className="mb-8 max-w-2xl">
            <p className="mb-2 font-montserrat text-xs font-black uppercase tracking-[0.25em] text-brand-neon">
              <Dices className="mr-1 inline h-4 w-4" /> E se der zebra?
            </p>
            <h2 className="font-montserrat text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
              O caos também tem número
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/55">
              A Copa não é só dos favoritos. Entre as 16 seleções mais fracas, há{' '}
              <strong className="text-white">42%</strong> de chance de pelo menos uma chegar às
              quartas. E em <strong className="text-white">1 a cada 11</strong> Copas o campeão vem
              de fora do grupo das 16 mais fortes.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { v: '42%', l: 'de uma das 16 mais fracas chegar às quartas' },
              { v: '8,8%', l: 'de o campeão estar fora do top-16 de força' },
              { v: '2,6%', l: 'de um azarão extremo chegar à final' },
              { v: '7 em 1 mi', l: 'a chance do Haiti, o azarão dos azarões' },
            ].map((s) => (
              <div key={s.v} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <p className="font-montserrat text-3xl font-black leading-none text-brand-neon md:text-4xl">{s.v}</p>
                <p className="mt-3 text-xs font-semibold uppercase leading-snug tracking-wide text-white/55">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9 · FAVORITOS EM PERIGO */}
      <section className="mx-auto max-w-[1080px] px-4 py-16">
        <SectionTitle eyebrow="Alerta na largada" title="Os favoritos em perigo na fase de grupos">
          Nem todo time forte dorme tranquilo. Algumas seleções de respeito carregam um risco real
          de cair já na primeira fase — lideradas por <strong>Senegal</strong> e{' '}
          <strong>Noruega</strong>, que pagam o preço de dividir o grupo da morte com a França.
          Até a 9ª favorita ao título cai na largada em mais de 1 a cada 4 simulações.
        </SectionTitle>
        <div className="rounded-3xl border border-brand-dark/10 bg-white p-6 shadow-sm md:p-8">
          <p className="mb-5 font-montserrat text-xs font-black uppercase tracking-widest text-brand-dark/40">
            <ShieldAlert className="mr-1 inline h-4 w-4" /> Probabilidade de cair na fase de grupos
          </p>
          <BarChart data={FAVORITES_AT_RISK} color="#E27C2D" />
        </div>
      </section>

      {/* 10 · GRUPOS */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-[1080px] px-4">
          <SectionTitle eyebrow="O sorteio importa" title="O grupo da morte e o grupo tranquilo">
            Nem todos os caminhos são iguais. De um lado, o grupo que mais costuma cuspir o campeão;
            do outro, o de travessia mais suave.
          </SectionTitle>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border-2 border-brand-red/30 bg-brand-red/5 p-7">
              <div className="mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2 font-montserrat text-sm font-black uppercase tracking-wider text-brand-red">
                  <Flame className="h-5 w-5" /> Grupo {GROUP_DEATH.letter} · O grupo da morte
                </span>
                <span className="font-montserrat text-2xl font-black text-brand-red">{fmt(GROUP_DEATH.champ)}%</span>
              </div>
              <p className="mb-5 text-xs uppercase tracking-wide text-brand-dark/45">de chance de o campeão sair daqui</p>
              <div className="flex flex-wrap gap-3">
                {GROUP_DEATH.teams.map((t) => (
                  <span key={t.team} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 font-montserrat text-sm font-bold text-brand-dark shadow-sm">
                    <span className="text-xl">{t.flag}</span> {t.team}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border-2 border-brand-green/25 bg-brand-green/5 p-7">
              <div className="mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2 font-montserrat text-sm font-black uppercase tracking-wider text-brand-green">
                  <Activity className="h-5 w-5" /> Grupo {GROUP_CALM.letter} · O mais tranquilo
                </span>
                <span className="font-montserrat text-2xl font-black text-brand-green">{fmt(GROUP_CALM.champ)}%</span>
              </div>
              <p className="mb-5 text-xs uppercase tracking-wide text-brand-dark/45">de chance de o campeão sair daqui</p>
              <div className="flex flex-wrap gap-3">
                {GROUP_CALM.teams.map((t) => (
                  <span key={t.team} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 font-montserrat text-sm font-bold text-brand-dark shadow-sm">
                    <span className="text-xl">{t.flag}</span> {t.team}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11 · ANFITRIÕES */}
      <section className="mx-auto max-w-[1080px] px-4 py-16">
        <SectionTitle eyebrow="Jogar em casa basta?" title="Os anfitriões da Copa de 2026">
          Pela primeira vez, três países sediam o torneio — mas, para o modelo, o fator casa pesa
          pouco. Juntos, México, Estados Unidos e Canadá somam cerca de <strong>3,5%</strong> de
          chance de título.
        </SectionTitle>
        <div className="grid gap-5 sm:grid-cols-3">
          {HOSTS.map((h) => (
            <div key={h.team} className="rounded-2xl border border-brand-dark/10 bg-white p-6 text-center shadow-sm">
              <span className="text-5xl">{h.flag}</span>
              <p className="mt-3 font-montserrat text-base font-black uppercase text-brand-dark">{h.team}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-brand-dark/40">{h.rank}º no ranking de força</p>
              <p className="mt-4 font-montserrat text-3xl font-black text-brand-blue">{fmt(h.value)}%</p>
              <p className="text-[11px] uppercase tracking-wide text-brand-dark/45">de título</p>
            </div>
          ))}
        </div>
      </section>

      {/* 12 · METODOLOGIA + CTA */}
      <section className="bg-brand-dark py-16 text-white">
        <div className="mx-auto max-w-[1080px] px-4">
          <div className="mb-8 max-w-2xl">
            <p className="mb-2 font-montserrat text-xs font-black uppercase tracking-[0.25em] text-brand-neon">
              <Target className="mr-1 inline h-4 w-4" /> Como chegamos aqui
            </p>
            <h2 className="font-montserrat text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
              Um milhão de Copas, sem achismo
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/55">
              Cada seleção recebe um índice de força calibrado contra os grandes mercados globais
              de previsão. A partir dele, simulamos o torneio inteiro — grupos, mata-mata e final —{' '}
              <strong className="text-white">1.000.000 de vezes</strong>, com um modelo de gols
              Poisson (Dixon-Coles). O que você leu acima é a média de tudo isso.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {PIPELINE.map((p) => (
              <div key={p.step} className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-7">
                <p className="font-montserrat text-3xl font-black leading-none text-brand-neon">{p.step}</p>
                <p className="mt-3 font-montserrat text-sm font-black uppercase tracking-widest text-white">{p.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{p.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row">
            <a
              href="/simulador"
              className="inline-flex items-center gap-3 rounded-xl bg-brand-green px-7 py-4 font-montserrat text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-grad1"
            >
              <Sparkles className="h-5 w-5" /> Faça a sua própria simulação
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/copa-2026"
              className="inline-flex items-center gap-3 rounded-xl border border-white/25 px-7 py-4 font-montserrat text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white/10"
            >
              <MapPin className="h-5 w-5 text-brand-neon" /> Ver todas as probabilidades
            </a>
          </div>
        </div>
      </section>

      <section className="bg-brand-light">
        <div className="mx-auto max-w-[760px] px-4 py-10 text-center">
          <p className="text-xs leading-relaxed text-brand-dark/45">
            Os números desta página são um retrato do início da Copa, simulado em 11/06/2026 antes
            de a bola rolar, e têm finalidade informativa, educacional e científica. O projeto não
            possui vínculo com casas de apostas e não constitui aconselhamento de apostas.
          </p>
        </div>
      </section>
    </div>
  );
};

const ElimBar: React.FC<{ label: string; value: number; pct: number; color: string; delay: number; isChamp: boolean }> = ({
  label, value, pct, color, delay, isChamp,
}) => {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className="flex items-center gap-3">
      <div className="w-40 flex-shrink-0 text-right sm:w-52">
        <span className={`font-montserrat text-xs font-bold uppercase tracking-wide ${isChamp ? 'text-brand-green' : 'text-brand-dark/70'}`}>{label}</span>
      </div>
      <div className="relative h-8 flex-grow overflow-hidden rounded-md bg-brand-dark/5">
        <div
          className="flex h-full items-center justify-end rounded-md pr-2.5 transition-all duration-[1000ms] ease-out"
          style={{
            width: visible ? `${Math.max(pct, 5)}%` : '0%',
            backgroundColor: color,
            transitionDelay: `${delay}ms`,
          }}
        >
          <span className={`font-montserrat text-xs font-black ${isChamp ? 'text-brand-dark' : 'text-white'}`}>
            {value.toFixed(1).replace('.', ',')}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default HexaPage;
