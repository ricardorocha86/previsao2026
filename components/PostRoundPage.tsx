import React, { useEffect, useRef, useState } from 'react';
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Newspaper,
} from 'lucide-react';
import PageHeader from './PageHeader';
import ReportEditionSelector from './ReportEditionSelector';

const ENG_FLAG = '🏴\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}';
const fmt = (value: number, digits = 1) => value.toFixed(digits).replace('.', ',');
const signed = (value: number) => `${value > 0 ? '+' : '−'}${fmt(Math.abs(value))}`;

const FLAG: Record<string, string> = {
  França: '🇫🇷', Espanha: '🇪🇸', Inglaterra: ENG_FLAG, Argentina: '🇦🇷',
  Portugal: '🇵🇹', Brasil: '🇧🇷', Alemanha: '🇩🇪', Holanda: '🇳🇱',
  Noruega: '🇳🇴', 'Estados Unidos': '🇺🇸', Austrália: '🇦🇺', Gana: '🇬🇭',
  Suécia: '🇸🇪', 'Arábia Saudita': '🇸🇦', Áustria: '🇦🇹', 'Costa do Marfim': '🇨🇮',
  'Coreia do Sul': '🇰🇷', Escócia: '🏴', Jordânia: '🇯🇴', Turquia: '🇹🇷',
  Paraguai: '🇵🇾', Panamá: '🇵🇦', Tcheca: '🇨🇿', Equador: '🇪🇨',
  Senegal: '🇸🇳', Uruguai: '🇺🇾', Marrocos: '🇲🇦', Japão: '🇯🇵',
  México: '🇲🇽', 'Cabo Verde': '🇨🇻', Haiti: '🇭🇹', Tunísia: '🇹🇳',
  Bélgica: '🇧🇪', Iraque: '🇮🇶', Colômbia: '🇨🇴',
};

const TITLE_RACE = [
  { team: 'França', before: 14.7847, after: 17.8230 },
  { team: 'Espanha', before: 15.9260, after: 13.2025 },
  { team: 'Inglaterra', before: 10.2555, after: 12.4981 },
  { team: 'Argentina', before: 8.1617, after: 10.7902 },
  { team: 'Portugal', before: 9.9242, after: 8.1980 },
  { team: 'Brasil', before: 8.3376, after: 6.5610, highlight: true },
  { team: 'Alemanha', before: 5.5527, after: 5.6545 },
  { team: 'Holanda', before: 4.4972, after: 4.0663 },
  { team: 'Noruega', before: 2.3591, after: 2.6320 },
  { team: 'Estados Unidos', before: 1.3946, after: 2.5977 },
  { team: 'Marrocos', before: 1.5217, after: 2.0167 },
  { team: 'Colômbia', before: 2.0232, after: 1.7796 },
  { team: 'Bélgica', before: 2.1792, after: 1.7196 },
  { team: 'Japão', before: 1.6287, after: 1.5454 },
  { team: 'México', before: 1.7775, after: 1.4305 },
];

const ROUND_STORIES = [
  { match: 'Espanha 0 × 0 Cabo Verde', probability: 17.2, text: 'Foi o resultado menos provável da rodada e contribuiu para a Espanha perder a liderança na projeção do título.' },
  { match: 'Austrália 2 × 0 Turquia', probability: 21.7, text: 'Produziu a maior alta na chance de classificação: 42,7 pontos percentuais para a Austrália.' },
  { match: 'Arábia Saudita 1 × 1 Uruguai', probability: 21.8, text: 'Elevou a Arábia Saudita a 52,9% de chance de classificação e reduziu a projeção do Uruguai.' },
  { match: 'Catar 1 × 1 Suíça', probability: 21.9, text: 'Manteve o Grupo B mais equilibrado do que indicava a projeção anterior ao torneio.' },
  { match: 'Portugal 1 × 1 RD do Congo', probability: 22.6, text: 'A chance portuguesa de título recuou de 9,9% para 8,2% após a atualização.' },
];

const FAVORITE_PATHS = [
  {
    team: 'França', before: [7.8858, 21.2556, 20.6656, 14.8436, 12.1366, 8.4281, 14.7847],
    after: [1.1641, 21.7923, 21.8560, 15.5564, 12.4021, 9.4061, 17.8230],
  },
  {
    team: 'Espanha', before: [1.9135, 24.1964, 20.6132, 13.4937, 14.3623, 9.4949, 15.9260],
    after: [6.7497, 25.3218, 19.1181, 12.6167, 14.1755, 8.8157, 13.2025],
  },
  {
    team: 'Inglaterra', before: [3.6301, 28.1072, 20.9621, 17.7018, 11.5485, 7.7948, 10.2555],
    after: [0.4126, 26.0324, 19.5814, 19.9090, 12.6475, 8.9190, 12.4981],
  },
  {
    team: 'Argentina', before: [5.7762, 33.1128, 17.7118, 15.6765, 12.3549, 7.2061, 8.1617],
    after: [0.3713, 30.1279, 17.9957, 16.2198, 15.6944, 8.8007, 10.7902],
  },
  {
    team: 'Portugal', before: [4.4959, 26.6395, 20.8099, 16.9574, 13.1380, 8.0351, 9.9242],
    after: [8.5886, 26.9545, 20.3492, 16.4225, 12.3954, 7.0918, 8.1980],
  },
  {
    team: 'Brasil', before: [4.6182, 31.8066, 21.8477, 16.4110, 10.3108, 6.6681, 8.3376],
    after: [6.3507, 33.8394, 21.6211, 16.9697, 8.8095, 5.8486, 6.5610],
  },
];

const ELIM_STAGES = ['Grupos', '16-avos', 'Oitavas', 'Quartas', 'Semi', 'Vice', 'Campeão'];
const ELIM_AXIS_LABELS = ['Fase de\ngrupos', '16-avos', 'Oitavas', 'Quartas', 'Semifinal', 'Vice', 'Campeã'];
const ELIM_CHART_MAX = 36;
const TEAM_CHART_COLORS: Record<string, string> = {
  França: '#173F9F',
  Espanha: '#C81D25',
  Inglaterra: '#C8102E',
  Argentina: '#1689C9',
  Portugal: '#8B1538',
  Brasil: '#209927',
};
const getLargestShift = (before: number[], after: number[]) => {
  const changes = after.map((value, index) => value - before[index]);
  const index = changes.reduce(
    (largest, value, current) => Math.abs(value) > Math.abs(changes[largest]) ? current : largest,
    0,
  );
  return { stage: ELIM_STAGES[index], value: changes[index] };
};

const BRAZIL_PATH = [
  { stage: 'Classificar (Top 32)', before: 95.382, after: 93.649 },
  { stage: 'Oitavas', before: 63.575, after: 59.810 },
  { stage: 'Quartas', before: 41.727, after: 38.189 },
  { stage: 'Semifinal', before: 25.316, after: 21.219 },
  { stage: 'Final', before: 15.006, after: 12.410 },
  { stage: 'Campeão', before: 8.338, after: 6.561 },
];

const GROUP_C = [
  {
    team: 'Brasil',
    before: [58.440, 27.418, 11.350, 2.792],
    after: [46.585, 33.285, 16.388, 3.742],
    qualifyBefore: 95.382, qualifyAfter: 93.649,
  },
  {
    team: 'Marrocos',
    before: [27.160, 38.514, 25.339, 8.986],
    after: [32.821, 36.761, 23.502, 6.917],
    qualifyBefore: 84.433, qualifyAfter: 88.744,
  },
  {
    team: 'Escócia',
    before: [12.450, 26.558, 40.720, 20.272],
    after: [19.768, 26.748, 51.819, 1.665],
    qualifyBefore: 65.992, qualifyAfter: 81.719,
  },
  {
    team: 'Haiti',
    before: [1.950, 7.510, 22.590, 67.949],
    after: [0.827, 3.206, 8.291, 87.676],
    qualifyBefore: 20.426, qualifyAfter: 9.219,
  },
];
const POSITION_COLORS = ['#209927', '#035C88', '#FFCF26', '#BF1A1F'];

const BRAZIL_OPPONENTS = [
  { stage: '16-avos', teams: [['Holanda', 29.8], ['Japão', 26.4], ['Suécia', 24.7], ['Alemanha', 6.3], ['Tunísia', 4.3]] },
  { stage: 'Oitavas', teams: [['Noruega', 16.4], ['França', 15.5], ['Costa do Marfim', 9.5], ['Coreia do Sul', 8.1], ['Alemanha', 6.7]] },
  { stage: 'Quartas', teams: [['Inglaterra', 22.5], ['França', 17.1], ['Alemanha', 10.9], ['México', 6.5], ['Noruega', 5.2]] },
  { stage: 'Semifinal', teams: [['Argentina', 18.0], ['Espanha', 16.9], ['Portugal', 12.6], ['Estados Unidos', 7.5], ['Bélgica', 5.9]] },
  { stage: 'Final', teams: [['França', 15.9], ['Espanha', 11.8], ['Inglaterra', 11.0], ['Argentina', 9.7], ['Portugal', 7.9]] },
] as const;

const CARRASCOS = [
  { team: 'Holanda', before: 13.821, after: 13.648 },
  { team: 'França', before: 9.748, after: 11.091 },
  { team: 'Japão', before: 9.703, after: 9.641 },
  { team: 'Alemanha', before: 6.563, after: 7.049 },
  { team: 'Inglaterra', before: 6.187, after: 7.022 },
  { team: 'Suécia', before: 5.399, after: 6.638 },
  { team: 'Noruega', before: 3.929, after: 4.809 },
  { team: 'México', before: 2.959, after: 3.183 },
];

const QUALIFICATION_RISES = [
  ['Austrália', 42.74, 91.00], ['Gana', 32.57, 78.12], ['Suécia', 29.39, 94.88],
  ['Arábia Saudita', 24.00, 52.88], ['Áustria', 23.10, 92.80], ['Noruega', 22.42, 95.26],
  ['Costa do Marfim', 21.27, 93.88], ['Coreia do Sul', 20.36, 92.26],
] as const;
const QUALIFICATION_FALLS = [
  ['Jordânia', -40.27, 12.51], ['Turquia', -32.82, 47.54], ['Paraguai', -27.29, 32.87],
  ['Panamá', -25.50, 13.58], ['Tcheca', -22.14, 52.79], ['Equador', -21.75, 60.14],
  ['Tunísia', -18.87, 16.36], ['Iraque', -18.71, 23.53],
] as const;

const GROUP_POWER = [
  ['Grupo I', 18.2090, 21.1462], ['Grupo H', 17.0024, 13.9049], ['Grupo L', 11.1936, 13.2911],
  ['Grupo J', 8.7588, 11.3061], ['Grupo K', 12.1583, 10.1825], ['Grupo C', 10.0865, 8.7802],
  ['Grupo E', 7.0022, 6.5413], ['Grupo F', 6.5810, 6.1914], ['Grupo D', 2.8417, 3.5197],
  ['Grupo G', 2.3762, 1.9733], ['Grupo A', 2.2232, 1.9076], ['Grupo B', 1.5671, 1.2557],
] as const;

const THIRD_POINTS = [
  [6, 100], [5, 100], [4, 99.62], [3, 64.72], [2, 4.07], [1, 0.015],
] as const;
const THIRD_GOAL_DIFF = [
  [5, 99.94], [4, 99.40], [3, 99.68], [2, 99.49], [1, 99.34],
  [0, 96.55], [-1, 62.53], [-2, 51.01], [-3, 36.48], [-4, 28.32],
  [-5, 28.59], [-6, 16.08], [-7, 17.00], [-8, 16.09], [-9, 15.71],
] as const;
const THIRD_EXAMPLES = [
  { points: 4, saldo: -5, value: 97.25 },
  { points: 3, saldo: 2, value: 96.90 },
  { points: 3, saldo: 0, value: 92.20 },
  { points: 3, saldo: -1, value: 79.72 },
  { points: 3, saldo: -2, value: 63.86 },
  { points: 3, saldo: -3, value: 44.96 },
  { points: 2, saldo: -1, value: 7.02 },
  { points: 2, saldo: -2, value: 1.46 },
];

const CONFEDERATIONS = [
  { name: 'Europa', before: 70.2048, after: 69.2428, color: '#035C88' },
  { name: 'América do Sul', before: 20.7995, after: 20.2992, color: '#209927' },
  { name: 'Concacaf', before: 3.4913, after: 4.2922, color: '#E27C2D' },
  { name: 'África', before: 3.2488, after: 3.6421, color: '#FFCF26' },
  { name: 'Ásia', before: 2.2530, after: 2.5123, color: '#BF1A1F' },
  { name: 'Oceania', before: 0.0026, after: 0.0114, color: '#7A7A7A' },
];

const useReveal = (threshold = 0.12) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold });
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
};

const SectionTitle: React.FC<{
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  light?: boolean;
}> = ({ eyebrow, title, children, light = false }) => (
  <div className="mb-8 max-w-3xl">
    <p className={`mb-2 font-montserrat text-xs font-black uppercase tracking-[0.25em] ${light ? 'text-brand-neon' : 'text-brand-green'}`}>{eyebrow}</p>
    <h2 className={`font-montserrat text-3xl font-black uppercase leading-none tracking-tight md:text-4xl ${light ? 'text-white' : 'text-brand-dark'}`}>{title}</h2>
    <p className={`mt-4 text-base leading-relaxed ${light ? 'text-white/60' : 'text-brand-dark/65'}`}>{children}</p>
  </div>
);

const ChangePill: React.FC<{ value: number }> = ({ value }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-montserrat text-[11px] font-black ${
    value >= 0 ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-red/10 text-brand-red'
  }`}>
    {value >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
    {signed(value)} p.p.
  </span>
);

const BeforeAfterChart: React.FC = () => {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className="overflow-x-auto pb-1">
      <div className="min-w-[760px]">
        <div className="mb-2 grid grid-cols-[180px_58px_minmax(260px,1fr)_58px_100px] items-center gap-3 px-2 font-montserrat text-[9px] font-black uppercase tracking-wider text-brand-dark/35">
          <span>Seleção</span>
          <span className="text-right">Antes</span>
          <span>Variação da probabilidade</span>
          <span>Agora</span>
          <span className="text-right">Mudança</span>
        </div>
        <div className="divide-y divide-brand-dark/5">
          {TITLE_RACE.map((item, index) => {
            const delta = item.after - item.before;
            const left = Math.min(item.before, item.after);
            return (
              <div
                key={item.team}
                className={`grid grid-cols-[180px_58px_minmax(260px,1fr)_58px_100px] items-center gap-3 px-2 py-2 ${
                  item.highlight ? 'bg-brand-green/[0.045]' : ''
                }`}
              >
                <span className="flex min-w-0 items-center gap-2 font-montserrat text-xs font-black uppercase">
                  <span className="w-5 text-right text-[9px] text-brand-dark/25">{index + 1}</span>
                  <span className="text-lg">{FLAG[item.team]}</span>
                  <span className={`truncate ${item.highlight ? 'text-brand-green' : 'text-brand-dark'}`}>{item.team}</span>
                </span>
                <span className="text-right font-montserrat text-xs font-bold text-brand-dark/45">{fmt(item.before)}%</span>
                <div className="relative h-7 rounded-full bg-brand-dark/5">
                  <div
                    className={`absolute top-1/2 h-2 -translate-y-1/2 rounded-full ${delta >= 0 ? 'bg-brand-green' : 'bg-brand-red'}`}
                    style={{ left: `${left * 5}%`, width: visible ? `${Math.max(Math.abs(delta) * 5, 1.5)}%` : '0%', transition: `width 700ms ease ${index * 35}ms` }}
                  />
                  <span
                    className="absolute top-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand-dark/30 bg-white"
                    style={{ left: `${item.before * 5}%` }}
                  />
                  <span
                    className={`absolute top-1/2 z-20 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white ${
                      delta >= 0 ? 'bg-brand-green' : 'bg-brand-red'
                    }`}
                    style={{ left: visible ? `${item.after * 5}%` : `${item.before * 5}%`, transition: `left 700ms ease ${index * 35}ms` }}
                  />
                </div>
                <span className="font-montserrat text-xs font-black text-brand-dark">{fmt(item.after)}%</span>
                <span className="justify-self-end"><ChangePill value={delta} /></span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const FavoriteEliminationChart: React.FC = () => (
  <div>
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {FAVORITE_PATHS.map((item) => {
        const largestShift = getLargestShift(item.before, item.after);
        const barColor = TEAM_CHART_COLORS[item.team] ?? '#035C88';
        return (
          <article key={item.team} className="rounded-2xl border border-brand-dark/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2 font-montserrat text-sm font-black uppercase text-brand-dark">
                <span className="text-xl">{FLAG[item.team]}</span>
                <span className="truncate">{item.team}</span>
              </span>
              <ChangePill value={item.after[6] - item.before[6]} />
            </div>

            <div className="mt-5 border-b-2 border-brand-blue/70">
              <div className="grid h-52 grid-cols-7 items-end gap-1.5">
                {item.after.map((value, index) => (
                  <div key={ELIM_STAGES[index]} className="relative flex h-full items-end justify-center">
                    <span
                      className="absolute left-0 right-0 z-10 border-t-2 border-dashed border-brand-dark/35"
                      style={{ bottom: `${Math.min(item.before[index] / ELIM_CHART_MAX * 100, 100)}%` }}
                      title={`Antes: ${fmt(item.before[index])}%`}
                    />
                    <div
                      className="relative w-full max-w-9 rounded-t-md transition-[height] duration-700"
                      style={{
                        height: `${Math.max(value / ELIM_CHART_MAX * 100, 2)}%`,
                        backgroundColor: barColor,
                      }}
                      title={`${ELIM_STAGES[index]}: agora ${fmt(value)}%; antes ${fmt(item.before[index])}%`}
                    >
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-montserrat text-[10px] font-black" style={{ color: barColor }}>
                        {fmt(value)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-2 grid grid-cols-7 gap-1.5">
              {ELIM_AXIS_LABELS.map((label) => (
                <span key={label} className="whitespace-pre-line text-center font-montserrat text-[8px] font-black uppercase leading-[1.1] text-brand-dark/55">
                  {label}
                </span>
              ))}
            </div>

            <p className="mt-4 border-t border-brand-dark/5 pt-3 text-[10px] leading-relaxed text-brand-dark/45">
              Maior probabilidade: <strong>{ELIM_STAGES[item.after.indexOf(Math.max(...item.after))]}</strong> ({fmt(Math.max(...item.after))}%).
              {' '}Maior variação: <strong>{largestShift.stage}</strong> ({signed(largestShift.value)} p.p.).
            </p>
          </article>
        );
      })}
    </div>
    <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] font-bold uppercase text-brand-dark/45">
      <span>As barras usam a cor característica de cada seleção</span>
      <span className="flex items-center gap-2"><i className="w-6 border-t-2 border-dashed border-brand-dark/40" />Probabilidade antes da Copa</span>
    </div>
  </div>
);

const BrazilPathChart: React.FC = () => {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className="space-y-5">
      {BRAZIL_PATH.map((item, index) => (
        <div key={item.stage} className="grid grid-cols-[96px_1fr_48px] items-center gap-3 sm:grid-cols-[150px_1fr_58px]">
          <span className="text-right font-montserrat text-[10px] font-bold uppercase leading-tight text-white/65 sm:text-xs">{item.stage}</span>
          <div className="space-y-1.5">
            <div className="h-2.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-white/30" style={{ width: visible ? `${item.before}%` : '0%', transition: `width 900ms ease ${index * 70}ms` }} /></div>
            <div className="h-3.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-brand-neon" style={{ width: visible ? `${item.after}%` : '0%', transition: `width 900ms ease ${index * 70 + 80}ms` }} /></div>
          </div>
          <span className="font-montserrat text-sm font-black text-brand-neon">{fmt(item.after)}%</span>
        </div>
      ))}
      <div className="flex justify-end gap-5 text-[10px] font-bold uppercase tracking-wider text-white/45">
        <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-white/30" />Antes</span>
        <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-brand-neon" />Agora</span>
      </div>
    </div>
  );
};

const GroupCChart: React.FC = () => (
  <div className="space-y-7">
    {GROUP_C.map((team) => (
      <div key={team.team}>
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 font-montserrat text-sm font-black uppercase text-brand-dark">
            <span className="text-xl">{FLAG[team.team]}</span>{team.team}
          </span>
          <ChangePill value={team.qualifyAfter - team.qualifyBefore} />
        </div>
        {[
          ['Antes', team.before],
          ['Agora', team.after],
        ].map(([label, values]) => (
          <div key={label as string} className="mb-1.5 grid grid-cols-[42px_1fr] items-center gap-2">
            <span className="text-[9px] font-bold uppercase text-brand-dark/35">{label as string}</span>
            <div className="flex h-7 overflow-hidden rounded-md">
              {(values as number[]).map((value, index) => (
                <div key={index} className="flex items-center justify-center" style={{ width: `${value}%`, backgroundColor: POSITION_COLORS[index] }} title={`${index + 1}º: ${fmt(value)}%`}>
                  {value >= 12 && <span className={`font-montserrat text-[9px] font-black ${index === 2 ? 'text-brand-dark' : 'text-white'}`}>{fmt(value)}%</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
        <p className="mt-1 text-right text-[10px] text-brand-dark/45">Classificação agora: <strong>{fmt(team.qualifyAfter)}%</strong></p>
      </div>
    ))}
    <div className="flex flex-wrap gap-4">
      {['1º', '2º', '3º', '4º'].map((label, index) => (
        <span key={label} className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-brand-dark/45">
          <i className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: POSITION_COLORS[index] }} />{label}
        </span>
      ))}
    </div>
  </div>
);

const QualificationColumn: React.FC<{ title: string; data: ReadonlyArray<readonly [string, number, number]>; positive: boolean }> = ({ title, data, positive }) => (
  <div className="rounded-3xl border border-brand-dark/10 bg-white p-6 shadow-sm">
    <h3 className={`mb-5 font-montserrat text-sm font-black uppercase ${positive ? 'text-brand-green' : 'text-brand-red'}`}>{title}</h3>
    <div className="space-y-3">
      {data.map(([team, delta, current]) => (
        <div key={team} className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-brand-dark/5 pb-3 last:border-0 last:pb-0">
          <span className="flex min-w-0 items-center gap-2">
            <span className="text-xl">{FLAG[team] ?? '⚽'}</span>
            <span>
              <strong className="block truncate font-montserrat text-xs uppercase text-brand-dark">{team}</strong>
              <small className="text-[10px] text-brand-dark/40">agora {fmt(current)}% de classificação</small>
            </span>
          </span>
          <span className={`font-montserrat text-base font-black ${positive ? 'text-brand-green' : 'text-brand-red'}`}>{signed(delta)}</span>
        </div>
      ))}
    </div>
  </div>
);

const CompactBarChart: React.FC<{ data: ReadonlyArray<readonly [number, number]>; label: (v: number) => string }> = ({ data, label }) => (
  <div className="space-y-3">
    {data.map(([key, value]) => (
      <div key={key} className="grid grid-cols-[72px_1fr_58px] items-center gap-3">
        <span className="text-right font-montserrat text-xs font-bold uppercase text-brand-dark/60">{label(key)}</span>
        <div className="h-6 overflow-hidden rounded-md bg-brand-dark/5">
          <div className="h-full rounded-md bg-brand-green" style={{ width: `${Math.max(value, 0.3)}%` }} />
        </div>
        <span className="font-montserrat text-xs font-black text-brand-green">{value < 0.1 ? fmt(value, 3) : fmt(value)}%</span>
      </div>
    ))}
  </div>
);

const PostRoundPage: React.FC = () => (
  <div className="bg-brand-light font-opensans">
    <PageHeader
      icon={Newspaper}
      eyebrow="Reportagem 02 · Fim da primeira rodada · 1.000.000 de simulações"
      title="A Copa Mudou de"
      accent="Rosto"
      description="Após 24 jogos, a França passou a liderar a projeção do título e o Brasil recuou. Comparamos as simulações de 11 e 18 de junho para medir o efeito da primeira rodada."
    />
    <ReportEditionSelector current="pos-rodada1" />

    <section className="border-b border-brand-dark/10 bg-white">
      <div className="mx-auto max-w-[1080px] px-4 py-14">
        <p className="text-xl font-light leading-relaxed text-brand-dark/80 md:text-2xl">
          <span className="font-montserrat text-2xl font-black text-brand-green md:text-3xl">A primeira rodada alterou as projeções.</span>{' '}
          A França assumiu a liderança, Argentina e Inglaterra ganharam probabilidade, enquanto
          Espanha, Portugal e Brasil recuaram. Os resultados ainda não definem tendências
          permanentes, mas produziram diferenças relevantes entre as principais seleções.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-4">
          {[
            ['24', 'jogos disputados'], ['75', 'gols marcados'], ['9', 'empates'],
            ['23,1%', 'da Copa concluída'],
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl border border-brand-dark/10 bg-brand-light p-5 text-center">
              <p className="font-montserrat text-4xl font-black text-brand-green">{value}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-brand-dark/45">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-[1080px] px-4 py-16">
      <SectionTitle eyebrow="Resultados e probabilidades" title="Metade dos jogos teve o desfecho mais provável">
        O desfecho de maior probabilidade aconteceu em <strong>12 dos 24 jogos</strong>. Isso não
        significa que o modelo “errou metade”: previsões probabilísticas distribuem chances entre
        três resultados possíveis. A probabilidade média atribuída aos resultados observados foi
        de 41,2%, em uma rodada com nove empates.
      </SectionTitle>
      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {[
            ['50%', 'dos jogos seguiram o desfecho mais provável'],
            ['41,2%', 'foi a probabilidade média atribuída ao resultado que ocorreu'],
            ['3,13', 'gols por jogo na primeira rodada'],
          ].map(([value, label]) => (
            <div key={label} className="rounded-3xl border border-brand-dark/10 bg-white p-6 shadow-sm">
              <p className="font-montserrat text-4xl font-black text-brand-blue">{value}</p>
              <p className="mt-2 text-xs font-bold uppercase leading-snug text-brand-dark/50">{label}</p>
            </div>
          ))}
        </div>
        <div className="rounded-3xl border border-brand-dark/10 bg-white p-6 shadow-sm md:p-8">
          <p className="mb-5 font-montserrat text-xs font-black uppercase tracking-widest text-brand-dark/40">As maiores surpresas · chance pré-jogo do resultado ocorrido</p>
          <div className="space-y-4">
            {ROUND_STORIES.map((item) => (
              <div key={item.match} className="grid grid-cols-[1fr_auto] gap-4 border-b border-brand-dark/5 pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="font-montserrat text-sm font-black uppercase text-brand-dark">{item.match}</p>
                  <p className="mt-1 text-xs leading-relaxed text-brand-dark/45">{item.text}</p>
                </div>
                <span className="font-montserrat text-xl font-black text-brand-red">{fmt(item.probability)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1080px] px-4">
        <SectionTitle eyebrow="Projeção do título" title="A França passa a liderar">
          A França agora vence <strong>17,8%</strong> das Copas simuladas. Inglaterra e Argentina
          se aproximaram; Espanha, Portugal e Brasil recuaram. Os quatro primeiros passaram a
          concentrar 54,3% dos títulos, contra 50,9% antes da abertura. O gráfico reúne as 15
          seleções com maior probabilidade de título na simulação atual.
        </SectionTitle>
        <div className="rounded-3xl border border-brand-dark/10 bg-brand-light p-6 shadow-sm md:p-8"><BeforeAfterChart /></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-brand-dark/10 bg-brand-light p-6 text-center"><p className="font-montserrat text-4xl font-black text-brand-green">54,3%</p><p className="mt-2 text-xs font-bold uppercase text-brand-dark/50">dos títulos agora estão no top 4</p></div>
          <div className="rounded-2xl border border-brand-dark/10 bg-brand-light p-6 text-center"><p className="font-montserrat text-4xl font-black text-brand-blue">78,8%</p><p className="mt-2 text-xs font-bold uppercase text-brand-dark/50">dos títulos concentrados no top 8</p></div>
          <div className="rounded-2xl border border-brand-dark/10 bg-brand-light p-6 text-center"><p className="font-montserrat text-4xl font-black text-brand-orange">87,8%</p><p className="mt-2 text-xs font-bold uppercase text-brand-dark/50">dos títulos concentrados no top 12</p></div>
          <div className="rounded-2xl border border-brand-dark/10 bg-brand-light p-6 text-center"><p className="font-montserrat text-4xl font-black text-brand-red">93,3%</p><p className="mt-2 text-xs font-bold uppercase text-brand-dark/50">dos títulos concentrados no top 16</p></div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-[1080px] px-4 py-16">
      <SectionTitle eyebrow="Seis principais candidatas" title="A distribuição por fase de eliminação">
        Os seis gráficos apresentam resultados exclusivos: eliminação nos grupos ou em cada fase,
        vice-campeonato e título. As barras mostram a simulação atual; a linha tracejada indica a
        probabilidade antes da Copa. Inglaterra e Argentina reduziram o risco de eliminação nos
        grupos; Espanha, Portugal e Brasil registraram aumento. Os 16-avos são a fase de eliminação
        mais provável para cinco das seis seleções. Na França, as oitavas aparecem ligeiramente acima.
      </SectionTitle>
      <FavoriteEliminationChart />
    </section>

    <section className="bg-[#072B18] py-16 text-white">
      <div className="mx-auto max-w-[1080px] px-4">
        <SectionTitle light eyebrow="A projeção do Brasil" title="A chance de título recua para 6,6%">
          A probabilidade de título caiu de 8,3% para 6,6%. A chance de alcançar a semifinal passou
          de 25,3% para 21,2%. Ao mesmo tempo, a probabilidade de eliminação nos 16-avos subiu para
          33,8%, o resultado mais frequente nas simulações do Brasil.
        </SectionTitle>
        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8"><BrazilPathChart /></div>
          <div className="grid gap-4">
            {[
              ['6º', 'no ranking do título', 'era 5º'],
              ['46,6%', 'de chance de liderar o grupo', 'queda de 11,9 p.p.'],
              ['52,9%', 'de ser campeão se chegar à final', 'probabilidade condicional à presença na final'],
            ].map(([value, label, note]) => (
              <div key={value} className="rounded-3xl border border-brand-neon/15 bg-brand-neon/5 p-6">
                <p className="font-montserrat text-4xl font-black text-brand-neon">{value}</p>
                <p className="mt-2 text-xs font-bold uppercase text-white/75">{label}</p>
                <p className="mt-2 text-xs text-white/40">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1080px] px-4">
        <SectionTitle eyebrow="O Grupo C depois da estreia" title="Brasil recua; Escócia registra a maior alta">
          O empate tirou 11,9 pontos da chance brasileira de terminar em primeiro, mas o Brasil
          ainda lidera a projeção do grupo. Marrocos aumentou sua chance de classificação em 4,3
          pontos; a Escócia ganhou 15,7 pontos; e o Haiti caiu de 20,4% para 9,2%. O indicador ao
          lado de cada seleção mostra a variação, em pontos percentuais, da probabilidade total de
          classificação ao mata-mata: no Brasil, ela passou de 95,4% para 93,6% (−1,7 p.p.); em
          Marrocos, subiu de 84,4% para 88,7% (+4,3 p.p.).
        </SectionTitle>
        <div className="rounded-3xl border border-brand-dark/10 bg-brand-light p-6 shadow-sm md:p-8"><GroupCChart /></div>
      </div>
    </section>

    <section className="bg-brand-dark py-16 text-white">
      <div className="mx-auto max-w-[1080px] px-4">
        <SectionTitle light eyebrow="Adversários possíveis" title="Os confrontos mais prováveis do Brasil">
          O primeiro confronto segue concentrado em Holanda, Japão e Suécia. Nas fases seguintes:
          Noruega passou à frente da França nas oitavas; Inglaterra cresceu nas quartas; Argentina
          passou a ser a adversária mais provável na semifinal; e a França lidera a projeção para
          uma eventual final.
        </SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BRAZIL_OPPONENTS.map((phase) => (
            <div key={phase.stage} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="font-montserrat text-sm font-black uppercase text-brand-neon">{phase.stage}</p>
              <div className="mt-4 space-y-3">
                {phase.teams.map(([team, value], index) => (
                  <div key={team} className="grid grid-cols-[20px_1fr_auto] items-center gap-2">
                    <span className="text-[10px] font-black text-white/25">{index + 1}</span>
                    <span className="truncate text-xs font-bold uppercase text-white/75">{FLAG[team] ?? '⚽'} {team}</span>
                    <span className="font-montserrat text-xs font-black text-brand-neon">{fmt(value)}%</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-[1080px] px-4 py-16">
      <SectionTitle eyebrow="Eliminações do Brasil por adversário" title="Holanda mantém a liderança; França aumenta participação">
        A Holanda é a seleção que mais elimina o Brasil nas simulações, com 13,6%, praticamente
        estável. A França registrou a maior alta, de 9,7% para 11,1%. Suécia, Noruega e Inglaterra
        também aumentaram sua participação nas eliminações brasileiras.
      </SectionTitle>
      <div className="rounded-3xl border border-brand-dark/10 bg-white p-6 shadow-sm md:p-8">
        <div className="space-y-4">
          {CARRASCOS.map((item) => (
            <div key={item.team} className="grid grid-cols-[120px_1fr_auto] items-center gap-3">
              <span className="truncate font-montserrat text-xs font-black uppercase text-brand-dark">{FLAG[item.team]} {item.team}</span>
              <div className="relative h-7 rounded-md bg-brand-dark/5">
                <div className="h-full rounded-md bg-brand-red" style={{ width: `${item.after * 6.8}%` }} />
                <span className="absolute inset-y-0 flex items-center" style={{ left: `${item.before * 6.8}%` }}><i className="h-9 w-0.5 bg-brand-dark/40" /></span>
              </div>
              <span className="font-montserrat text-sm font-black text-brand-red">{fmt(item.after)}%</span>
            </div>
          ))}
        </div>
        <p className="mt-5 text-[10px] text-brand-dark/40">A marca vertical indica a probabilidade antes da Copa.</p>
      </div>
    </section>

    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1080px] px-4">
        <SectionTitle eyebrow="Maiores variações da rodada" title="A classificação concentrou as mudanças mais intensas">
          As probabilidades de título variaram poucos pontos, mas as chances de classificação
          mudaram em dezenas de pontos percentuais. A Austrália ganhou 42,7 pontos; a Jordânia
          perdeu 40,3; Gana ganhou 32,6; e a Turquia perdeu 32,8.
        </SectionTitle>
        <div className="grid gap-6 lg:grid-cols-2">
          <QualificationColumn title="Quem mais ganhou chance de classificação" data={QUALIFICATION_RISES} positive />
          <QualificationColumn title="Quem mais perdeu chance de classificação" data={QUALIFICATION_FALLS} positive={false} />
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-[1080px] px-4 py-16">
      <SectionTitle eyebrow="Participação dos grupos" title="Como se distribui a probabilidade de título">
        O Grupo I, de França e Noruega, ampliou a liderança e agora responde por 21,1% dos títulos.
        Os grupos de Argentina e Inglaterra também cresceram. Após os empates de Espanha e Brasil,
        os grupos H e C reduziram sua participação na projeção.
      </SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2">
        {GROUP_POWER.map(([group, before, after]) => (
          <div key={group} className="rounded-2xl border border-brand-dark/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-montserrat text-sm font-black uppercase text-brand-dark">{group}</span>
              <ChangePill value={after - before} />
            </div>
            <div className="mt-4 h-3 rounded-full bg-brand-dark/5"><div className="h-full rounded-full bg-brand-blue" style={{ width: `${after * 4.4}%` }} /></div>
            <p className="mt-2 text-right text-xs text-brand-dark/45">Agora <strong className="text-brand-blue">{fmt(after)}%</strong> dos títulos</p>
          </div>
        ))}
      </div>
    </section>

    <section className="bg-brand-dark py-16 text-white">
      <div className="mx-auto max-w-[1080px] px-4">
        <SectionTitle light eyebrow="A classificação dos melhores terceiros" title="Pontos e saldo alteram substancialmente a probabilidade">
          Quatro pontos correspondem a 99,6% de chance de classificação. Com três pontos, a média
          é 64,7%, mas a combinação com o saldo produz diferenças importantes: 96,9% com saldo +2
          e 45,0% com saldo −3. Com dois pontos, a chance média é de 4,1%.
        </SectionTitle>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 text-brand-dark">
            <h3 className="mb-5 font-montserrat text-sm font-black uppercase">Classificação por pontos</h3>
            <CompactBarChart data={THIRD_POINTS} label={(value) => `${value} pts`} />
          </div>
          <div className="rounded-3xl bg-white p-6 text-brand-dark">
            <h3 className="mb-2 font-montserrat text-sm font-black uppercase">Classificação por saldo de gols</h3>
            <p className="mb-5 text-xs leading-relaxed text-brand-dark/45">Probabilidade marginal por saldo, sem controlar a pontuação.</p>
            <CompactBarChart data={THIRD_GOAL_DIFF} label={(value) => `${value > 0 ? '+' : ''}${value}`} />
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {THIRD_EXAMPLES.map((item) => (
            <div key={`${item.points}-${item.saldo}`} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
              <p className="font-montserrat text-xs font-black uppercase text-white/55">{item.points} pontos · saldo {item.saldo > 0 ? '+' : ''}{item.saldo}</p>
              <p className="mt-2 font-montserrat text-3xl font-black text-brand-neon">{fmt(item.value)}%</p>
              <p className="mt-1 text-[10px] uppercase text-white/35">de classificação</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-[1080px] px-4 py-16">
      <SectionTitle eyebrow="Distribuição por confederação" title="A Europa mantém 69,2% da probabilidade de título">
        A participação europeia caiu de 70,2% para 69,2%. Concacaf, África, Ásia e Oceania cresceram,
        embora a Oceania permaneça abaixo de 0,1%. A América do Sul passou de 20,8% para 20,3%.
      </SectionTitle>
      <div className="rounded-3xl border border-brand-dark/10 bg-white p-6 shadow-sm md:p-8">
        <div className="flex h-12 overflow-hidden rounded-xl">
          {CONFEDERATIONS.map((item) => (
            <div key={item.name} className="flex items-center justify-center" style={{ width: `${item.after}%`, backgroundColor: item.color }} title={`${item.name}: ${fmt(item.after, item.after < 0.1 ? 2 : 1)}%`}>
              {item.after > 8 && <span className="font-montserrat text-xs font-black text-white">{fmt(item.after)}%</span>}
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {CONFEDERATIONS.map((item) => (
            <div key={item.name} className="rounded-xl bg-brand-light p-4">
              <span className="block h-2 w-8 rounded-full" style={{ backgroundColor: item.color }} />
              <p className="mt-2 font-montserrat text-xs font-black uppercase">{item.name}</p>
              <p className="font-montserrat text-xl font-black">{fmt(item.after, item.after < 0.1 ? 2 : 1)}%</p>
              <p className="text-[10px] uppercase text-brand-dark/35">antes {fmt(item.before, item.before < 0.1 ? 3 : 1)}%</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-brand-green py-16 text-white">
      <div className="mx-auto grid max-w-[1080px] items-center gap-8 px-4 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="font-montserrat text-xs font-black uppercase tracking-[0.25em] text-brand-neon">Próxima atualização</p>
          <h2 className="mt-2 font-montserrat text-3xl font-black uppercase leading-none md:text-4xl">A segunda rodada permitirá avaliar a continuidade das mudanças</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-white/70">A próxima simulação mostrará se as altas de França, Inglaterra e Argentina e os recuos de Espanha, Portugal e Brasil persistem após novos resultados.</p>
        </div>
        <a href="/copa-2026" className="inline-flex items-center justify-center gap-3 rounded-xl bg-white px-7 py-4 font-montserrat text-sm font-bold uppercase text-brand-green transition hover:bg-brand-neon hover:text-brand-dark">
          Ver probabilidades completas <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>

    <section className="bg-brand-light">
      <div className="mx-auto max-w-[800px] px-4 py-10 text-center">
        <div className="mb-4 flex items-center justify-center gap-2 text-brand-dark/35"><Activity className="h-4 w-4" /><span className="font-montserrat text-[10px] font-black uppercase tracking-widest">Nota metodológica</span></div>
        <p className="text-xs leading-relaxed text-brand-dark/45">
          Comparação entre as simulações oficiais de 11/06/2026 e 18/06/2026. Cada retrato contém
          1.000.000 de simulações completas; no segundo, os 24 resultados oficiais da primeira rodada
          estão travados. Probabilidades de eliminação são exclusivas por fase e somam 100% por
          seleção. A análise de desempenho usa as probabilidades pré-jogo publicadas antes da Copa.
        </p>
      </div>
    </section>
  </div>
);

export default PostRoundPage;
