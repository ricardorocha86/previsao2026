import React from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Newspaper,
  Swords,
  Trophy,
  XCircle,
} from 'lucide-react';
import PageHeader from './PageHeader';
import ReportEditionSelector from './ReportEditionSelector';

const ENG_FLAG = '🏴\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}';
const fmt = (value: number, digits = 1) => value.toFixed(digits).replace('.', ',');
const signed = (value: number) => `${value > 0 ? '+' : value < 0 ? '−' : ''}${fmt(Math.abs(value))}`;

const FLAG: Record<string, string> = {
  França: '🇫🇷',
  Argentina: '🇦🇷',
  Espanha: '🇪🇸',
  Inglaterra: ENG_FLAG,
  Portugal: '🇵🇹',
  Brasil: '🇧🇷',
  Holanda: '🇳🇱',
  Alemanha: '🇩🇪',
  'Estados Unidos': '🇺🇸',
  Colômbia: '🇨🇴',
  Noruega: '🇳🇴',
  México: '🇲🇽',
  Bélgica: '🇧🇪',
  Marrocos: '🇲🇦',
  Japão: '🇯🇵',
  Suíça: '🇨🇭',
  Equador: '🇪🇨',
  Senegal: '🇸🇳',
  Croácia: '🇭🇷',
  'Costa do Marfim': '🇨🇮',
  Canadá: '🇨🇦',
  'Bósnia e Herzegovina': '🇧🇦',
  'RD do Congo': '🇨🇩',
  Egito: '🇪🇬',
  Austrália: '🇦🇺',
  Suécia: '🇸🇪',
  Áustria: '🇦🇹',
  Gana: '🇬🇭',
  Argélia: '🇩🇿',
  'Cabo Verde': '🇨🇻',
  Paraguai: '🇵🇾',
  'África do Sul': '🇿🇦',
  Uruguai: '🇺🇾',
  Turquia: '🇹🇷',
  Tcheca: '🇨🇿',
  'Coreia do Sul': '🇰🇷',
  Irã: '🇮🇷',
  Escócia: '🏴',
  Jordânia: '🇯🇴',
};

const teamWithFlag = (team: string) => `${FLAG[team] ?? '⚽'} ${team}`;

const TITLE_RACE = [
  { team: 'França', pre: 14.7847, previous: 18.2537, current: 22.2478 },
  { team: 'Argentina', pre: 8.1617, previous: 13.3082, current: 19.8669 },
  { team: 'Espanha', pre: 15.9260, previous: 13.4822, current: 10.7095 },
  { team: 'Inglaterra', pre: 10.2555, previous: 10.6159, current: 10.3543 },
  { team: 'Portugal', pre: 9.9242, previous: 8.3462, current: 6.0651 },
  { team: 'Brasil', pre: 8.3376, previous: 5.2505, current: 5.6948, highlight: true },
  { team: 'Holanda', pre: 4.4972, previous: 5.5324, current: 4.9125 },
  { team: 'Alemanha', pre: 5.5527, previous: 5.4318, current: 3.7815 },
  { team: 'Estados Unidos', pre: 1.3946, previous: 3.4569, current: 2.7786 },
  { team: 'Colômbia', pre: 2.0232, previous: 1.8106, current: 2.3962 },
  { team: 'Noruega', pre: 2.3591, previous: 2.8472, current: 2.1726 },
  { team: 'México', pre: 1.7775, previous: 1.5493, current: 1.9044 },
  { team: 'Bélgica', pre: 2.1792, previous: 1.2451, current: 1.4073 },
  { team: 'Marrocos', pre: 1.5217, previous: 1.9250, current: 1.2806 },
  { team: 'Japão', pre: 1.6287, previous: 1.8551, current: 1.1259 },
  { team: 'Suíça', pre: 1.0579, previous: 0.7192, current: 0.9158 },
];

const FAVORITE_EVOLUTION = [
  { team: 'Espanha', values: [15.9260, 13.2025, 13.4822, 10.7095], ranks: [1, 2, 2, 3] },
  { team: 'França', values: [14.7847, 17.8230, 18.2537, 22.2478], ranks: [2, 1, 1, 1] },
  { team: 'Inglaterra', values: [10.2555, 12.4981, 10.6159, 10.3543], ranks: [3, 3, 4, 4] },
  { team: 'Portugal', values: [9.9242, 8.1980, 8.3462, 6.0651], ranks: [4, 5, 5, 5] },
  { team: 'Brasil', values: [8.3376, 6.5610, 5.2505, 5.6948], ranks: [5, 6, 8, 6] },
  { team: 'Argentina', values: [8.1617, 10.7902, 13.3082, 19.8669], ranks: [6, 4, 3, 2] },
  { team: 'Alemanha', values: [5.5527, 5.6545, 5.4318, 3.7815], ranks: [7, 7, 7, 8] },
  { team: 'Holanda', values: [4.4972, 4.0663, 5.5324, 4.9125], ranks: [8, 8, 6, 7] },
  { team: 'Noruega', values: [2.3591, 2.6320, 2.8472, 2.1726], ranks: [9, 9, 10, 11] },
  { team: 'Bélgica', values: [2.1792, 1.7196, 1.2451, 1.4073], ranks: [10, 13, 15, 13] },
] as const;

const FAVORITE_EVOLUTION_POSITIVE = [...FAVORITE_EVOLUTION]
  .filter((item) => item.values[3] - item.values[0] >= 0)
  .sort((a, b) => (b.values[3] - b.values[0]) - (a.values[3] - a.values[0]));

const FAVORITE_EVOLUTION_NEGATIVE = [...FAVORITE_EVOLUTION]
  .filter((item) => item.values[3] - item.values[0] < 0)
  .sort((a, b) => (b.values[3] - b.values[0]) - (a.values[3] - a.values[0]));

const FAVORITE_EVOLUTION_TOP_ROW = [
  ...FAVORITE_EVOLUTION_POSITIVE,
  FAVORITE_EVOLUTION_NEGATIVE[0],
];

const FAVORITE_EVOLUTION_BOTTOM_ROW = FAVORITE_EVOLUTION_NEGATIVE.slice(1);

const FAVORITE_PATHS = [
  { team: 'França', stages: [13.3254, 22.3327, 15.5365, 15.4086, 11.1490, 22.2478] },
  { team: 'Argentina', stages: [10.8159, 12.1131, 17.7823, 22.5394, 16.8824, 19.8669] },
  { team: 'Espanha', stages: [18.4699, 31.6353, 14.6369, 16.6310, 7.9174, 10.7095] },
  { team: 'Inglaterra', stages: [19.8138, 24.7891, 20.6898, 14.4200, 9.9330, 10.3543] },
  { team: 'Portugal', stages: [27.8024, 35.5184, 12.4913, 12.6223, 5.5005, 6.0651] },
  { team: 'Brasil', stages: [36.3958, 21.9990, 18.8829, 10.4215, 6.6060, 5.6948], highlight: true },
];

const STAGE_LABELS = ['16-avos', 'Oitavas', 'Quartas', 'Semi', 'Vice', 'Campeão'];

const ADVANCEMENT_SURPRISES = [
  { team: 'África do Sul', before: 31.82, note: 'entrou como vice do Grupo A' },
  { team: 'Gana', before: 45.54, note: 'avançou como melhor terceiro do Grupo L' },
  { team: 'Cabo Verde', before: 45.93, note: 'foi vice do Grupo H e deixou o Uruguai para trás' },
  { team: 'Austrália', before: 48.26, note: 'passou em segundo no Grupo D' },
  { team: 'Argélia', before: 48.88, note: 'sobreviveu como terceiro do Grupo J' },
  { team: 'Paraguai', before: 60.16, note: 'entrou como terceiro do Grupo D' },
];

const ADVANCEMENT_MISSES = [
  { team: 'Uruguai', before: 84.75, note: 'maior queda entre os eliminados' },
  { team: 'Turquia', before: 80.36, note: 'terminou em quarto no Grupo D' },
  { team: 'Tcheca', before: 74.93, note: 'ficou fora no Grupo A' },
  { team: 'Coreia do Sul', before: 71.90, note: 'terceira do Grupo A, mas fora do corte' },
  { team: 'Irã', before: 67.74, note: 'terceiro do Grupo G sem vaga' },
  { team: 'Escócia', before: 65.99, note: 'terceira no grupo do Brasil' },
];

const BRAZIL_PROGRESSION = [
  { stage: 'Vencer o Japão', value: 63.6042 },
  { stage: 'Chegar às quartas', value: 41.6052 },
  { stage: 'Chegar à semifinal', value: 22.7223 },
  { stage: 'Chegar à final', value: 12.3008 },
  { stage: 'Ser campeão', value: 5.6948 },
];

const BRAZIL_CONDITIONAL = [
  ['Se passar do Japão', 8.9535],
  ['Se chegar às quartas', 13.6877],
  ['Se chegar à semifinal', 25.0626],
  ['Se chegar à final', 46.2962],
] as const;

const BRAZIL_PATH = [
  { stage: '16-avos', text: 'Japão', teams: [['Japão', 100.0]] },
  { stage: 'Oitavas', text: 'Noruega ou Costa do Marfim', teams: [['Noruega', 66.7], ['Costa do Marfim', 33.3]] },
  { stage: 'Quartas', text: 'Inglaterra é a principal ameaça', teams: [['Inglaterra', 55.4], ['México', 25.2], ['Equador', 12.3], ['RD do Congo', 7.1]] },
  { stage: 'Semifinal', text: 'Argentina domina o horizonte', teams: [['Argentina', 59.3], ['Colômbia', 17.8], ['Suíça', 10.7], ['Egito', 3.4]] },
  { stage: 'Final', text: 'França é o cruzamento mais provável', teams: [['França', 33.7], ['Espanha', 18.6], ['Portugal', 11.5], ['Holanda', 10.2], ['Alemanha', 8.0]] },
];

const BRAZIL_ELIMINATORS = [
  { team: 'Japão', phase: '16-avos', total: 36.4 },
  { team: 'Noruega', phase: 'Oitavas', total: 16.7 },
  { team: 'Inglaterra', phase: 'Quartas', total: 12.6 },
  { team: 'Argentina', phase: 'Semifinal', total: 7.8 },
  { team: 'Costa do Marfim', phase: 'Oitavas', total: 5.3 },
  { team: 'México', phase: 'Quartas', total: 4.1 },
  { team: 'França', phase: 'Final', total: 2.8 },
  { team: 'Equador', phase: 'Quartas', total: 1.5 },
];

const FINALS = [
  ['Argentina x França', 12.2833],
  ['Argentina x Espanha', 6.8416],
  ['Inglaterra x França', 6.7574],
  ['Argentina x Portugal', 4.2557],
  ['Brasil x França', 4.1452],
  ['Inglaterra x Espanha', 3.8033],
  ['Argentina x Holanda', 3.6986],
  ['Argentina x Alemanha', 2.9921],
  ['Colômbia x França', 2.4009],
  ['Argentina x Estados Unidos', 2.3716],
  ['Inglaterra x Portugal', 2.3371],
  ['Brasil x Espanha', 2.2838],
] as const;

const CONFEDERATIONS = [
  { name: 'UEFA', teams: '13 de 16', title: 63.2231, color: '#035C88' },
  { name: 'CONMEBOL', teams: '5 de 6', title: 28.3998, color: '#209927' },
  { name: 'CONCACAF', teams: '3 de 6', title: 4.8586, color: '#E27C2D' },
  { name: 'CAF', teams: '9 de 10', title: 2.2876, color: '#FFCF26' },
  { name: 'AFC', teams: '2 de 9', title: 1.2309, color: '#BF1A1F' },
  { name: 'OFC', teams: '0 de 1', title: 0, color: '#7A7A7A' },
];

const GROUP_POWER = [
  ['Grupo I', 'França e Noruega', 24.7996],
  ['Grupo J', 'Argentina, Áustria e Argélia', 20.0150],
  ['Grupo L', 'Inglaterra, Croácia e Gana', 10.7509],
  ['Grupo H', 'Espanha e Cabo Verde', 10.7440],
  ['Grupo K', 'Colômbia, Portugal e RD Congo', 8.5957],
  ['Grupo C', 'Brasil e Marrocos', 6.9754],
] as const;

const GROUP_STANDINGS = [
  ['A', 'México', 'África do Sul', 'Coreia do Sul', 'Tcheca', false],
  ['B', 'Suíça', 'Canadá', 'Bósnia e Herzegovina', 'Catar', true],
  ['C', 'Brasil', 'Marrocos', 'Escócia', 'Haiti', false],
  ['D', 'Estados Unidos', 'Austrália', 'Paraguai', 'Turquia', true],
  ['E', 'Alemanha', 'Costa do Marfim', 'Equador', 'Curaçau', true],
  ['F', 'Holanda', 'Japão', 'Suécia', 'Tunísia', true],
  ['G', 'Bélgica', 'Egito', 'Irã', 'Nova Zelândia', false],
  ['H', 'Espanha', 'Cabo Verde', 'Uruguai', 'Arábia Saudita', false],
  ['I', 'França', 'Noruega', 'Senegal', 'Iraque', true],
  ['J', 'Argentina', 'Áustria', 'Argélia', 'Jordânia', true],
  ['K', 'Colômbia', 'Portugal', 'RD do Congo', 'Uzbequistão', true],
  ['L', 'Inglaterra', 'Croácia', 'Gana', 'Panamá', true],
] as const;

const SectionTitle: React.FC<{
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  light?: boolean;
}> = ({ eyebrow, title, children, light = false }) => (
  <div className="mb-8 max-w-3xl">
    <p className={`mb-2 font-montserrat text-xs font-black uppercase ${light ? 'text-brand-neon' : 'text-brand-green'}`}>{eyebrow}</p>
    <h2 className={`font-montserrat text-3xl font-black uppercase leading-none md:text-4xl ${light ? 'text-white' : 'text-brand-dark'}`}>{title}</h2>
    <p className={`mt-4 text-base leading-relaxed ${light ? 'text-white/65' : 'text-brand-dark/65'}`}>{children}</p>
  </div>
);

const ChangePill: React.FC<{ value: number; light?: boolean }> = ({ value, light = false }) => (
  <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 font-montserrat text-[11px] font-black ${
    value >= 0
      ? light ? 'bg-brand-neon/15 text-brand-neon' : 'bg-brand-green/10 text-brand-green'
      : light ? 'bg-brand-red/20 text-red-100' : 'bg-brand-red/10 text-brand-red'
  }`}>
    {value >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
    {signed(value)} p.p.
  </span>
);

const TeamLabel: React.FC<{ team: string; className?: string }> = ({ team, className = '' }) => (
  <span className={`inline-flex min-w-0 items-center gap-2 ${className}`}>
    <span aria-hidden="true">{FLAG[team] ?? '⚽'}</span>
    <span className="truncate">{team}</span>
  </span>
);

const FinalLabel: React.FC<{ final: string }> = ({ final }) => {
  const [left, right] = final.split(' x ');
  return (
    <>
      {teamWithFlag(left)} x {teamWithFlag(right)}
    </>
  );
};

const TitleRaceChart: React.FC = () => (
  <div className="overflow-x-auto pb-1">
    <div className="min-w-[820px]">
      <div className="mb-2 grid grid-cols-[190px_64px_64px_minmax(250px,1fr)_64px_100px] items-center gap-3 px-2 font-montserrat text-[9px] font-black uppercase text-brand-dark/40">
        <span>Seleção</span>
        <span className="text-right">11/06</span>
        <span className="text-right">24/06</span>
        <span>Movimento desde a segunda rodada</span>
        <span>28/06</span>
        <span className="text-right">Mudança</span>
      </div>
      <div className="divide-y divide-brand-dark/5">
        {TITLE_RACE.map((item, index) => {
          const delta = item.current - item.previous;
          const left = Math.min(item.previous, item.current);
          return (
            <div key={item.team} className={`grid grid-cols-[190px_64px_64px_minmax(250px,1fr)_64px_100px] items-center gap-3 px-2 py-2 ${item.highlight ? 'bg-brand-green/[0.055]' : ''}`}>
              <span className="flex min-w-0 items-center gap-2 font-montserrat text-xs font-black uppercase">
                <span className="w-5 text-right text-[9px] text-brand-dark/25">{index + 1}</span>
                <TeamLabel team={item.team} className={item.highlight ? 'text-brand-green' : 'text-brand-dark'} />
              </span>
              <span className="text-right font-montserrat text-xs font-bold text-brand-dark/45">{fmt(item.pre)}%</span>
              <span className="text-right font-montserrat text-xs font-bold text-brand-dark/45">{fmt(item.previous)}%</span>
              <div className="relative h-7 rounded-lg bg-brand-dark/5">
                <div
                  className={`absolute top-1/2 h-2 -translate-y-1/2 rounded-full ${delta >= 0 ? 'bg-brand-green' : 'bg-brand-red'}`}
                  style={{ left: `${left * 4.1}%`, width: `${Math.max(Math.abs(delta) * 4.1, 1.2)}%` }}
                />
                <span className="absolute top-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand-dark/30 bg-white" style={{ left: `${item.previous * 4.1}%` }} />
                <span className={`absolute top-1/2 z-20 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white ${delta >= 0 ? 'bg-brand-green' : 'bg-brand-red'}`} style={{ left: `${item.current * 4.1}%` }} />
              </div>
              <span className="font-montserrat text-xs font-black text-brand-dark">{fmt(item.current)}%</span>
              <span className="justify-self-end"><ChangePill value={delta} /></span>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

const FavoritePhaseChart: React.FC = () => (
  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
    {FAVORITE_PATHS.map((item) => {
      const isBrazil = item.team === 'Brasil';
      return (
        <article key={item.team} className={`rounded-lg border bg-white p-5 shadow-sm ${isBrazil ? 'border-brand-green/40 ring-2 ring-brand-green/10' : 'border-brand-dark/10'}`}>
          <div className="flex items-start justify-between gap-3">
            <h3 className="min-w-0 font-montserrat text-sm font-black uppercase text-brand-dark">
              <TeamLabel team={item.team} />
            </h3>
            <span className={`rounded-lg px-2.5 py-1 font-montserrat text-[11px] font-black ${isBrazil ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-blue/10 text-brand-blue'}`}>
              {fmt(item.stages[5])}%
            </span>
          </div>
          <div className="mt-6 grid h-44 grid-cols-6 items-end gap-1.5 border-b-2 border-brand-dark/15">
            {item.stages.map((value, index) => (
              <div key={STAGE_LABELS[index]} className="relative flex h-full items-end justify-center">
                <div className={`relative w-full max-w-9 rounded-t-md ${isBrazil ? 'bg-brand-green' : 'bg-brand-blue'}`} style={{ height: `${Math.max(value / 38 * 100, 1.5)}%` }}>
                  <span className={`absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-montserrat text-[9px] font-black ${isBrazil ? 'text-brand-green' : 'text-brand-blue'}`}>{fmt(value)}%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-6 gap-1.5">
            {STAGE_LABELS.map((label) => (
              <span key={label} className="text-center font-montserrat text-[7px] font-black uppercase leading-tight text-brand-dark/45">{label}</span>
            ))}
          </div>
        </article>
      );
    })}
  </div>
);

const AdvancementColumn: React.FC<{
  title: string;
  items: typeof ADVANCEMENT_SURPRISES;
  positive: boolean;
}> = ({ title, items, positive }) => (
  <div className="rounded-lg border border-brand-dark/10 bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-center gap-2">
      {positive ? <CheckCircle2 className="h-5 w-5 text-brand-green" /> : <XCircle className="h-5 w-5 text-brand-red" />}
      <h3 className="font-montserrat text-sm font-black uppercase text-brand-dark">{title}</h3>
    </div>
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.team} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-brand-dark/5 pb-3 last:border-0 last:pb-0">
          <div className="min-w-0">
            <p className="font-montserrat text-xs font-black uppercase text-brand-dark"><TeamLabel team={item.team} /></p>
            <p className="mt-1 text-[11px] leading-snug text-brand-dark/45">{item.note}</p>
          </div>
          <span className={`font-montserrat text-lg font-black ${positive ? 'text-brand-green' : 'text-brand-red'}`}>{fmt(item.before)}%</span>
        </div>
      ))}
    </div>
  </div>
);

const BrazilProgressChart: React.FC = () => (
  <div className="space-y-5">
    {BRAZIL_PROGRESSION.map((item) => (
      <div key={item.stage} className="grid grid-cols-[118px_1fr_58px] items-center gap-3 sm:grid-cols-[170px_1fr_68px]">
        <span className="text-right font-montserrat text-[10px] font-bold uppercase leading-tight text-white/65 sm:text-xs">{item.stage}</span>
        <div className="h-3.5 rounded-lg bg-white/10">
          <div className="h-full rounded-lg bg-brand-neon" style={{ width: `${item.value}%` }} />
        </div>
        <span className="font-montserrat text-sm font-black text-brand-neon">{fmt(item.value)}%</span>
      </div>
    ))}
  </div>
);

const OpeningRouteCard: React.FC = () => (
  <div className="rounded-lg border border-brand-dark/10 bg-[#071F14] p-6 text-white shadow-xl md:p-7">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-montserrat text-xs font-black uppercase text-brand-neon">Rota mais provável do Brasil</p>
        <h3 className="mt-2 font-montserrat text-2xl font-black uppercase leading-none">Japão primeiro. Argentina no horizonte.</h3>
      </div>
      <Swords className="h-8 w-8 flex-none text-brand-neon" />
    </div>
    <div className="mt-6 space-y-3">
      {BRAZIL_PATH.map((phase, index) => (
        <div key={phase.stage} className="grid grid-cols-[76px_minmax(0,1fr)] items-start gap-3 rounded-lg border border-white/10 bg-white/[0.045] p-3">
          <div>
            <p className="font-montserrat text-[10px] font-black uppercase text-brand-neon">{phase.stage}</p>
            <p className="mt-1 text-[10px] font-bold uppercase text-white/35">{index === 0 ? 'fixo' : 'se avançar'}</p>
          </div>
          <div className="min-w-0">
            <p className="font-montserrat text-sm font-black uppercase text-white">{phase.text}</p>
            <p className="mt-1 truncate text-xs text-white/45">
              {phase.teams.slice(0, 3).map(([team, value]) => `${team} ${fmt(value as number)}%`).join(' · ')}
            </p>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-5 flex items-center gap-3 rounded-lg bg-brand-neon/10 p-4">
      <Trophy className="h-5 w-5 flex-none text-brand-neon" />
      <p className="text-xs leading-relaxed text-white/65">
        A final brasileira mais frequente é contra a França: <strong className="text-brand-neon">4,1%</strong> de todas as Copas simuladas.
      </p>
    </div>
  </div>
);

const FavoriteEvolutionCard: React.FC<{
  item: (typeof FAVORITE_EVOLUTION)[number];
  index: number;
}> = ({ item, index }) => {
  const chartMax = 24;
  const x = [18, 80, 142, 204];
  const y = item.values.map((value) => 88 - (value / chartMax) * 70);
  const line = x.map((xValue, pointIndex) => `${xValue},${y[pointIndex]}`).join(' ');
  const area = `M ${x[0]} 92 L ${x[0]} ${y[0]} L ${x[1]} ${y[1]} L ${x[2]} ${y[2]} L ${x[3]} ${y[3]} L ${x[3]} 92 Z`;
  const delta = item.values[3] - item.values[0];
  const lineColor = delta >= 0 ? '#68E70F' : '#E27C2D';
  const gradientId = `knockout-favorite-evolution-${index}`;
  const isBrazil = item.team === 'Brasil';

  return (
    <article className={`relative overflow-hidden rounded-lg border bg-white/[0.055] p-5 shadow-sm ${
      isBrazil ? 'border-brand-neon/70 ring-2 ring-brand-neon/10' : 'border-white/10'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 font-montserrat text-sm font-black uppercase text-white">
          <TeamLabel team={item.team} />
        </h3>
        <span
          className="rounded-md px-2 py-1 font-montserrat text-[8px] font-black leading-tight"
          style={{ color: lineColor, backgroundColor: `${lineColor}18` }}
        >
          {signed(delta)}%
        </span>
      </div>
      <p className="mt-2 text-[10px] font-bold uppercase text-white/35">
        ranking: {item.ranks[0]}º no início · {item.ranks[3]}º agora
      </p>

      <div className="mt-5">
        <svg viewBox="0 0 220 102" className="block w-full overflow-visible" role="img" aria-label={`Evolução da chance de título de ${item.team}`}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={lineColor} stopOpacity="0.36" />
              <stop offset="1" stopColor={lineColor} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {[18, 53, 88].map((gridY) => (
            <line key={gridY} x1="14" y1={gridY} x2="206" y2={gridY} stroke="#FFFFFF" strokeOpacity="0.09" strokeDasharray="3 4" />
          ))}
          <path d={area} fill={`url(#${gradientId})`} />
          <polyline points={line} fill="none" stroke={lineColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {x.map((xValue, pointIndex) => (
            <g key={xValue}>
              <circle cx={xValue} cy={y[pointIndex]} r="5.5" fill="#071F14" stroke={lineColor} strokeWidth="3" />
              <text x={xValue} y={Math.max(y[pointIndex] - 11, 13)} textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="900">
                {fmt(item.values[pointIndex])}%
              </text>
            </g>
          ))}
        </svg>
        <div className="grid grid-cols-4 border-t border-white/10 pt-2 font-montserrat text-[8px] font-black uppercase text-white/35">
          <span>11/06</span>
          <span className="text-center">18/06</span>
          <span className="text-center">24/06</span>
          <span className="text-right">28/06</span>
        </div>
      </div>
    </article>
  );
};

const GroupStandingsSection: React.FC = () => (
  <section className="bg-white py-16">
    <div className="mx-auto max-w-[1080px] px-4">
      <SectionTitle eyebrow="Como os grupos terminaram" title="Os oito terceiros classificados completam o novo tabuleiro">
        Além dos dois primeiros de cada grupo, avançaram Bósnia e Herzegovina, Paraguai, Equador, Suécia,
        Senegal, Argélia, RD do Congo e Gana. A partir daqui, a posição no grupo deixa de ser projeção e vira rota:
        o Brasil, por exemplo, não tem mais variação de porta de entrada. É Japão.
      </SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {GROUP_STANDINGS.map(([group, first, second, third, fourth, thirdAdvanced]) => (
          <article key={group} className="rounded-lg border border-brand-dark/10 bg-brand-light p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-brand-green font-montserrat text-sm font-black text-white">{group}</span>
              <span className={`rounded-lg px-2 py-1 font-montserrat text-[9px] font-black uppercase ${thirdAdvanced ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-dark/5 text-brand-dark/40'}`}>
                {thirdAdvanced ? '3º avançou' : '3º eliminado'}
              </span>
            </div>
            <ol className="space-y-2 text-xs">
              {[first, second, third, fourth].map((team, index) => {
                const advanced = index < 2 || (index === 2 && thirdAdvanced);
                return (
                  <li key={team as string} className={`grid grid-cols-[18px_minmax(0,1fr)_auto] items-center gap-2 ${advanced ? 'text-brand-dark' : 'text-brand-dark/35'}`}>
                    <span className="font-montserrat font-black">{index + 1}</span>
                    <TeamLabel team={team as string} className="font-bold uppercase" />
                    {advanced ? <CheckCircle2 className="h-4 w-4 text-brand-green" /> : <XCircle className="h-4 w-4 text-brand-dark/25" />}
                  </li>
                );
              })}
            </ol>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const KnockoutPage: React.FC = () => (
  <div className="bg-brand-light font-opensans">
    <PageHeader
      icon={Newspaper}
      eyebrow="Reportagem 04 · Início do mata-mata · 1.000.000 de simulações"
      title="Agora é"
      accent="Mata-Mata."
      description="Com os 32 classificados definidos, a previsão deixa de medir caminhos possíveis nos grupos e passa a medir confrontos concretos. O Brasil abre contra o Japão; França e Argentina puxam a nova corrida pelo título."
    />
    <ReportEditionSelector current="pos-fase-grupos" />

    <section className="border-b border-brand-dark/10 bg-white">
      <div className="mx-auto grid max-w-[1080px] items-center gap-10 px-4 py-14 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="mb-3 font-montserrat text-xs font-black uppercase text-brand-green">Fim da fase de grupos</p>
          <h2 className="font-montserrat text-4xl font-black uppercase leading-none text-brand-dark md:text-5xl">
            A Copa agora cabe em uma chave.
          </h2>
          <p className="mt-5 text-lg font-light leading-relaxed text-brand-dark/75 md:text-xl">
            Com os 72 jogos da fase de grupos travados, a simulação deixou de perguntar quem chegaria ao mata-mata
            e passou a medir confrontos concretos. {teamWithFlag('Brasil')} começa contra o {teamWithFlag('Japão')};
            no topo, {teamWithFlag('França')} e {teamWithFlag('Argentina')}{' '}
            transformaram o lado de cima da projeção em uma disputa particular.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              ['32', 'seleções vivas'],
              ['16', 'confrontos nos 16-avos'],
              ['42,1%', `dos títulos em ${teamWithFlag('França')} + ${teamWithFlag('Argentina')}`],
              ['36,4%', `risco de queda do ${teamWithFlag('Brasil')} contra o ${teamWithFlag('Japão')}`],
            ].map(([value, label]) => (
              <div key={value} className="rounded-lg border border-brand-dark/10 bg-brand-light p-5 text-center">
                <p className="font-montserrat text-4xl font-black text-brand-green">{value}</p>
                <p className="mt-1 text-xs font-bold uppercase text-brand-dark/45">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <OpeningRouteCard />
      </div>
    </section>

    <GroupStandingsSection />

    <section className="mx-auto max-w-[1080px] px-4 py-16">
      <SectionTitle eyebrow="Antes da Copa x realidade" title="A previsão inicial acertou 26 dos 32 classificados">
        Tomando como referência as 32 maiores probabilidades de classificação publicadas antes da Copa,
        o modelo antecipou <strong>26 dos 32</strong> nomes que chegaram ao mata-mata. A graça da fase de grupos
        esteve nos seis espaços que mudaram de dono em relação a esse corte: África do Sul, Gana, Cabo Verde,
        Austrália, Argélia e Paraguai entraram; Uruguai, Turquia, Tcheca, Coreia do Sul, Irã e Escócia ficaram fora.
      </SectionTitle>
      <div className="grid gap-6 lg:grid-cols-2">
        <AdvancementColumn title="Entraram fora do top 32 inicial" items={ADVANCEMENT_SURPRISES} positive />
        <AdvancementColumn title="Tinham vaga provável e caíram" items={ADVANCEMENT_MISSES} positive={false} />
      </div>
      <div className="mt-6 rounded-lg border border-brand-dark/10 bg-white p-5 text-sm leading-relaxed text-brand-dark/60 shadow-sm">
        A África do Sul é o caso mais forte: tinha 31,8% de chance de Top 32 antes da Copa e entrou como vice do Grupo A.
        O Paraguai já tinha 60,2%, mas estava abaixo do corte dos 32 mais prováveis. No outro extremo, o Uruguai começou
        com 84,8% de chance de avançar e terminou fora do mata-mata. O resultado mostra uma leitura importante para a
        segunda fase: a elite passou quase inteira, mas o miolo do torneio foi reordenado.
      </div>
    </section>

    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1080px] px-4">
        <SectionTitle eyebrow="Corrida pelo título" title="França e Argentina abrem distância">
          A França subiu para <strong>22,2%</strong> e a Argentina saltou para <strong>19,9%</strong>. Juntas,
          elas concentram 42,1% dos títulos simulados. A Espanha, que era a principal força antes da Copa,
          caiu para 10,7%; Portugal e Alemanha também perderam terreno após a definição do chaveamento.
          O Brasil subiu levemente desde 24/06, mas segue abaixo do retrato inicial.
        </SectionTitle>
        <div className="rounded-lg border border-brand-dark/10 bg-brand-light p-5 shadow-sm md:p-7"><TitleRaceChart /></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['63,2%', 'dos títulos no top 4'],
            ['83,6%', 'dos títulos no top 8'],
            ['92,9%', 'dos títulos no top 12'],
            ['97,6%', 'dos títulos no top 16'],
          ].map(([value, label]) => (
            <div key={label} className="rounded-lg border border-brand-dark/10 bg-brand-light p-6 text-center">
              <p className="font-montserrat text-4xl font-black text-brand-blue">{value}</p>
              <p className="mt-2 text-xs font-bold uppercase text-brand-dark/50">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-[#101D15] py-16 text-white">
      <div className="mx-auto max-w-[1080px] px-4">
        <SectionTitle light eyebrow="A corrida em quatro atos" title="Como evoluíram os dez favoritos do início da Copa">
          Mantivemos fixo o grupo das dez seleções que começaram o torneio com maior probabilidade de título
          e acompanhamos sua trajetória nas quatro simulações oficiais. França e Argentina são as grandes altas;
          Espanha, Portugal e Brasil chegam ao mata-mata abaixo do ponto de partida.
        </SectionTitle>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {FAVORITE_EVOLUTION_TOP_ROW.map((item, index) => (
              <FavoriteEvolutionCard key={item.team} item={item} index={index} />
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {FAVORITE_EVOLUTION_BOTTOM_ROW.map((item, index) => (
              <FavoriteEvolutionCard key={item.team} item={item} index={index + FAVORITE_EVOLUTION_TOP_ROW.length} />
            ))}
          </div>
        </div>
        <p className="mt-6 text-center text-[10px] font-bold uppercase text-white/30">
          Probabilidade de título · 11/06: início da Copa · 18/06: fim da primeira rodada · 24/06: fim da segunda rodada · 28/06: início do mata-mata
        </p>
      </div>
    </section>

    <section className="mx-auto max-w-[1080px] px-4 py-16">
      <SectionTitle eyebrow="Seis caminhos principais" title="A ameaça do primeiro mata-mata não é igual para todos">
        As barras mostram onde a campanha de cada favorita termina nas simulações. Argentina e França chegam às oitavas
        em mais de 86% dos cenários. O Brasil tem um desenho mais estreito: a eliminação nos 16-avos, contra o Japão,
        aparece em 36,4% das Copas simuladas, acima do risco inicial de França, Argentina, Espanha e Inglaterra.
      </SectionTitle>
      <FavoritePhaseChart />
    </section>

    <section className="bg-[#072B18] py-16 text-white">
      <div className="mx-auto max-w-[1080px] px-4">
        <SectionTitle light eyebrow="O caminho do Brasil" title="O Japão é a porta de entrada; a Argentina aparece na semifinal">
          O Brasil liderou o Grupo C e entra no mata-mata com 5,7% de chance de título. A primeira barreira é fixa:
          Brasil x Japão. Se passar, o caminho mais provável tem Noruega ou Costa do Marfim nas oitavas, Inglaterra
          nas quartas, Argentina na semifinal e França em uma eventual final.
        </SectionTitle>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-lg border border-white/10 bg-white/5 p-6 md:p-8">
            <BrazilProgressChart />
            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="mb-4 font-montserrat text-xs font-black uppercase text-white/45">Chance de título condicional</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {BRAZIL_CONDITIONAL.map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-white/5 p-4">
                    <p className="font-montserrat text-2xl font-black text-brand-neon">{fmt(value)}%</p>
                    <p className="mt-1 text-[10px] font-bold uppercase text-white/55">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {[
              ['6º', 'no ranking do título', 'subiu do 8º lugar em 24/06'],
              ['9,0%', 'de chance de título se passar do Japão', 'primeiro salto condicional'],
              ['36,4%', 'de cair já nos 16-avos', 'maior risco do caminho brasileiro'],
            ].map(([value, label, note]) => (
              <div key={value} className="rounded-lg border border-brand-neon/15 bg-brand-neon/5 p-5">
                <p className="font-montserrat text-4xl font-black text-brand-neon">{value}</p>
                <p className="mt-2 text-xs font-bold uppercase text-white/75">{label}</p>
                <p className="mt-2 text-xs text-white/40">{note}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {BRAZIL_PATH.map((phase) => (
            <article key={phase.stage} className="rounded-lg border border-white/10 bg-white/5 p-5">
              <p className="font-montserrat text-sm font-black uppercase text-brand-neon">{phase.stage}</p>
              <p className="mt-2 min-h-[40px] text-xs leading-relaxed text-white/55">{phase.text}</p>
              <div className="mt-4 space-y-2">
                {phase.teams.map(([team, value]) => (
                  <div key={team} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                    <span className="truncate text-[11px] font-bold uppercase text-white/75">{FLAG[team as string] ?? '⚽'} {team}</span>
                    <span className="font-montserrat text-xs font-black text-brand-neon">{fmt(value as number)}%</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-[1080px] px-4 py-16">
      <SectionTitle eyebrow="Carrascos prováveis" title="Japão concentra mais de um terço das eliminações brasileiras">
        O primeiro jogo pesa mais do que qualquer outro ponto da rota. Entre todas as simulações em que o Brasil é eliminado,
        o Japão responde por 38,6% das quedas; em termos do total de Copas simuladas, isso equivale a 36,4%.
        Depois vêm Noruega, Inglaterra e Argentina, refletindo a sequência mais provável do chaveamento.
      </SectionTitle>
      <div className="rounded-lg border border-brand-dark/10 bg-white p-6 shadow-sm md:p-8">
        <div className="space-y-4">
          {BRAZIL_ELIMINATORS.map((item) => (
            <div key={item.team} className="grid grid-cols-[150px_86px_1fr_58px] items-center gap-3">
              <span className="min-w-0 font-montserrat text-xs font-black uppercase text-brand-dark"><TeamLabel team={item.team} /></span>
              <span className="rounded-lg bg-brand-dark/5 px-2 py-1 text-center font-montserrat text-[10px] font-black uppercase text-brand-dark/45">{item.phase}</span>
              <div className="h-7 rounded-lg bg-brand-dark/5"><div className="h-full rounded-lg bg-brand-red" style={{ width: `${item.total * 2.6}%` }} /></div>
              <span className="font-montserrat text-sm font-black text-brand-red">{fmt(item.total)}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-brand-dark py-16 text-white">
      <div className="mx-auto max-w-[1080px] px-4">
        <SectionTitle light eyebrow="Finais prováveis" title="Argentina x França virou a final mais frequente">
          A final mais comum nas simulações reúne as duas maiores candidatas, com 12,3% de probabilidade.
          {' '}{teamWithFlag('Brasil')} x {teamWithFlag('França')} aparece como a quinta final mais provável,
          em 4,1% das Copas simuladas. {teamWithFlag('Brasil')} x {teamWithFlag('Espanha')} também entra no top 12, com 2,3%.
        </SectionTitle>
        <div className="grid gap-3 md:grid-cols-2">
          {FINALS.map(([final, value], index) => (
            <div key={final} className="grid grid-cols-[34px_minmax(0,1fr)_74px] items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
              <span className="font-montserrat text-sm font-black text-white/30">{index + 1}</span>
              <span className="truncate font-montserrat text-sm font-black uppercase text-white"><FinalLabel final={final} /></span>
              <span className="text-right font-montserrat text-lg font-black text-brand-neon">{fmt(value)}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-[1080px] px-4 py-16">
      <SectionTitle eyebrow="Mapa do mata-mata" title="Europa tem menos da metade dos classificados e quase dois terços do título">
        A distribuição dos 32 classificados ficou mais aberta do que a distribuição do título. A UEFA tem 13 seleções vivas
        e 63,2% da probabilidade de campeão. A CONMEBOL tem cinco classificadas e 28,4%, impulsionada por Argentina, Brasil
        e Colômbia. A África colocou nove seleções no mata-mata, mas soma 2,3% de chance de título.
      </SectionTitle>
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg border border-brand-dark/10 bg-white p-6 shadow-sm">
          <h3 className="mb-5 font-montserrat text-sm font-black uppercase text-brand-dark">Probabilidade por confederação</h3>
          <div className="flex h-12 overflow-hidden rounded-lg">
            {CONFEDERATIONS.map((item) => (
              <div key={item.name} className="flex items-center justify-center" style={{ width: `${Math.max(item.title, 0.7)}%`, backgroundColor: item.color }} title={`${item.name}: ${fmt(item.title)}%`}>
                {item.title > 7 && <span className="font-montserrat text-xs font-black text-white">{fmt(item.title)}%</span>}
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {CONFEDERATIONS.map((item) => (
              <div key={item.name} className="rounded-lg bg-brand-light p-4">
                <span className="block h-2 w-8 rounded-full" style={{ backgroundColor: item.color }} />
                <p className="mt-2 font-montserrat text-xs font-black uppercase">{item.name}</p>
                <p className="font-montserrat text-xl font-black">{fmt(item.title)}%</p>
                <p className="text-[10px] uppercase text-brand-dark/40">{item.teams} seleções no Top 32</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-brand-dark/10 bg-white p-6 shadow-sm">
          <h3 className="mb-5 font-montserrat text-sm font-black uppercase text-brand-dark">Grupos que mais concentram título</h3>
          <div className="space-y-3">
            {GROUP_POWER.map(([group, note, value]) => (
              <div key={group} className="grid grid-cols-[86px_1fr_58px] items-center gap-3">
                <span className="font-montserrat text-xs font-black uppercase text-brand-dark">{group}</span>
                <div>
                  <div className="h-3 rounded-lg bg-brand-dark/5"><div className="h-full rounded-lg bg-brand-blue" style={{ width: `${value * 3.5}%` }} /></div>
                  <p className="mt-1 text-[10px] text-brand-dark/40">{note}</p>
                </div>
                <span className="text-right font-montserrat text-sm font-black text-brand-blue">{fmt(value)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="bg-brand-green py-16 text-white">
      <div className="mx-auto grid max-w-[1080px] items-center gap-8 px-4 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="font-montserrat text-xs font-black uppercase text-brand-neon">Próxima atualização</p>
          <h2 className="mt-2 font-montserrat text-3xl font-black uppercase leading-none md:text-4xl">Os 16-avos vão separar caminho difícil de caminho encerrado</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-white/75">
            O próximo retrato mostrará quais favoritas sobreviveram ao primeiro corte e quanto a rota de Brasil, França,
            Argentina, Espanha e Inglaterra mudou depois dos confrontos eliminatórios.
          </p>
        </div>
        <a href="/copa-2026" className="inline-flex items-center justify-center gap-3 rounded-lg bg-white px-7 py-4 font-montserrat text-sm font-bold uppercase text-brand-green transition hover:bg-brand-neon hover:text-brand-dark">
          Ver probabilidades completas <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>

    <section className="bg-brand-light">
      <div className="mx-auto max-w-[820px] px-4 py-10 text-center">
        <div className="mb-4 flex items-center justify-center gap-2 text-brand-dark/35">
          <Activity className="h-4 w-4" />
          <span className="font-montserrat text-[10px] font-black uppercase">Nota metodológica</span>
        </div>
        <p className="text-xs leading-relaxed text-brand-dark/45">
          Comparação entre as simulações oficiais de 24/06/2026 e 28/06/2026, com referência adicional à simulação
          inicial de 11/06/2026. Cada retrato contém 1.000.000 de simulações completas. Na atualização de 28/06/2026,
          os 72 jogos da fase de grupos e os 32 classificados estão travados; as probabilidades de eliminação por fase
          são exclusivas e somam 100% por seleção. Percentuais arredondados podem gerar pequenas diferenças de soma.
        </p>
      </div>
    </section>
  </div>
);

export default KnockoutPage;
