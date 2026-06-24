import React from 'react';
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Newspaper,
} from 'lucide-react';
import PageHeader from './PageHeader';
import ReportEditionSelector from './ReportEditionSelector';

const ENG_FLAG = '🏴\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}';
const fmt = (value: number, digits = 1) => value.toFixed(digits).replace('.', ',');
const signed = (value: number) => `${value > 0 ? '+' : value < 0 ? '−' : ''}${fmt(Math.abs(value))}`;

const FLAG: Record<string, string> = {
  França: '🇫🇷', Espanha: '🇪🇸', Argentina: '🇦🇷', Inglaterra: ENG_FLAG,
  Portugal: '🇵🇹', Holanda: '🇳🇱', Alemanha: '🇩🇪', Brasil: '🇧🇷',
  'Estados Unidos': '🇺🇸', Noruega: '🇳🇴', Marrocos: '🇲🇦', Japão: '🇯🇵',
  Colômbia: '🇨🇴', México: '🇲🇽', Bélgica: '🇧🇪', Suíça: '🇨🇭',
  'Costa do Marfim': '🇨🇮', 'Coreia do Sul': '🇰🇷', Suécia: '🇸🇪',
  Escócia: '🏴', Haiti: '🇭🇹', Paraguai: '🇵🇾', Canadá: '🇨🇦',
  Argélia: '🇩🇿', Egito: '🇪🇬', Croácia: '🇭🇷', Gana: '🇬🇭',
  Turquia: '🇹🇷', Equador: '🇪🇨', Uruguai: '🇺🇾', 'RD do Congo': '🇨🇩',
  Catar: '🇶🇦', 'Nova Zelândia': '🇳🇿', Tcheca: '🇨🇿',
  'Bósnia e Herzegovina': '🇧🇦',
};

const TITLE_RACE = [
  { team: 'França', before: 17.8230, after: 18.2537 },
  { team: 'Espanha', before: 13.2025, after: 13.4822 },
  { team: 'Argentina', before: 10.7902, after: 13.3082 },
  { team: 'Inglaterra', before: 12.4981, after: 10.6159 },
  { team: 'Portugal', before: 8.1980, after: 8.3462 },
  { team: 'Holanda', before: 4.0663, after: 5.5324 },
  { team: 'Alemanha', before: 5.6545, after: 5.4318 },
  { team: 'Brasil', before: 6.5610, after: 5.2505, highlight: true },
  { team: 'Estados Unidos', before: 2.5977, after: 3.4569 },
  { team: 'Noruega', before: 2.6320, after: 2.8472 },
  { team: 'Marrocos', before: 2.0167, after: 1.9250 },
  { team: 'Japão', before: 1.5454, after: 1.8551 },
  { team: 'Colômbia', before: 1.7796, after: 1.8106 },
  { team: 'México', before: 1.4305, after: 1.5493 },
  { team: 'Bélgica', before: 1.7196, after: 1.2451 },
];

const FAVORITE_EVOLUTION = [
  {
    team: 'Argentina',
    values: [8.1617, 10.7902, 13.3082],
    ranks: [6, 4, 3],
  },
  {
    team: 'França',
    values: [14.7847, 17.8230, 18.2537],
    ranks: [2, 1, 1],
  },
  {
    team: 'Holanda',
    values: [4.4972, 4.0663, 5.5324],
    ranks: [8, 8, 6],
  },
  {
    team: 'Noruega',
    values: [2.3591, 2.6320, 2.8472],
    ranks: [9, 9, 10],
  },
  {
    team: 'Inglaterra',
    values: [10.2555, 12.4981, 10.6159],
    ranks: [3, 3, 4],
  },
  // Linha de baixo (quedas) ordenada por menor variação primeiro — oposto da linha de cima.
  {
    team: 'Alemanha',
    values: [5.5527, 5.6545, 5.4318],
    ranks: [7, 7, 7],
  },
  {
    team: 'Bélgica',
    values: [2.1792, 1.7196, 1.2451],
    ranks: [10, 13, 15],
  },
  {
    team: 'Portugal',
    values: [9.9242, 8.1980, 8.3462],
    ranks: [4, 5, 5],
  },
  {
    team: 'Espanha',
    values: [15.9260, 13.2025, 13.4822],
    ranks: [1, 2, 2],
  },
  {
    team: 'Brasil',
    values: [8.3376, 6.5610, 5.2505],
    ranks: [5, 6, 8],
  },
] as const;

const ROUND_SURPRISES = [
  { match: 'Inglaterra 0 × 0 Gana', probability: 20.1, text: 'Após o empate, a Inglaterra caiu do terceiro para o quarto lugar na projeção do título; Gana passou a 100,0% de classificação após arredondamento.' },
  { match: 'Equador 0 × 0 Curaçau', probability: 22.7, text: 'O Equador perdeu 38,0 pontos percentuais de chance de classificação entre os dois retratos.' },
  { match: 'Uruguai 2 × 2 Cabo Verde', probability: 23.2, text: 'A chance uruguaia de avançar caiu de 72,7% para 40,1%.' },
  { match: 'Bélgica 0 × 0 Irã', probability: 24.6, text: 'A Bélgica caiu para 80,1% de classificação e para 1,2% de chance de título.' },
  { match: 'Tcheca 1 × 1 África do Sul', probability: 26.0, text: 'O empate manteve a disputa aberta, mas reduziu a projeção tcheca de classificação para 31,3%.' },
  { match: 'Turquia 0 × 1 Paraguai', probability: 27.0, text: 'Foi a única vitória do resultado menos provável: o Paraguai saltou para 83,6% e a Turquia caiu a 0% nas simulações.' },
];

const FAVORITE_PATHS = [
  {
    team: 'França',
    before: [1.1641, 21.7923, 21.8560, 15.5564, 12.4021, 9.4061, 17.8230],
    after: [0, 18.4305, 24.7870, 15.7861, 13.2797, 9.4630, 18.2537],
  },
  {
    team: 'Espanha',
    before: [6.7497, 25.3218, 19.1181, 12.6167, 14.1755, 8.8157, 13.2025],
    after: [0, 20.8817, 25.6601, 14.2501, 16.4769, 9.2490, 13.4822],
  },
  {
    team: 'Argentina',
    before: [0.3713, 30.1279, 17.9957, 16.2198, 15.6944, 8.8007, 10.7902],
    after: [0, 18.8998, 18.6986, 19.5265, 18.0199, 11.5470, 13.3082],
  },
  {
    team: 'Inglaterra',
    before: [0.4126, 26.0324, 19.5814, 19.9090, 12.6475, 8.9190, 12.4981],
    after: [0, 26.1704, 22.5843, 19.2395, 12.7603, 8.6296, 10.6159],
  },
  {
    team: 'Portugal',
    before: [8.5886, 26.9545, 20.3492, 16.4225, 12.3954, 7.0918, 8.1980],
    after: [0, 25.2755, 25.7474, 19.0896, 13.9016, 7.6397, 8.3462],
  },
  {
    team: 'Brasil',
    before: [6.3507, 33.8394, 21.6211, 16.9697, 8.8095, 5.8486, 6.5610],
    after: [0, 42.0001, 22.3135, 16.3417, 8.7280, 5.3662, 5.2505],
  },
];


const BRAZIL_PATH = [
  { stage: 'Classificar (Top 32)', before: 93.6493, after: 100 },
  { stage: 'Oitavas', before: 59.8099, after: 57.9999 },
  { stage: 'Quartas', before: 38.1888, after: 35.6864 },
  { stage: 'Semifinal', before: 21.2191, after: 19.3447 },
  { stage: 'Final', before: 12.4096, after: 10.6167 },
  { stage: 'Campeão', before: 6.5610, after: 5.2505 },
];

const GROUP_C = [
  { team: 'Brasil', before: [46.5847, 33.2852, 16.3882, 3.7419], after: [60.3744, 25.1182, 14.5074, 0], qualifyBefore: 93.6493, qualifyAfter: 100 },
  { team: 'Marrocos', before: [32.8208, 36.7605, 23.5019, 6.9168], after: [35.5707, 63.2409, 1.1884, 0], qualifyBefore: 88.7438, qualifyAfter: 99.9999 },
  { team: 'Escócia', before: [19.7679, 26.7480, 51.8188, 1.6653], after: [4.0549, 11.6409, 84.3042, 0], qualifyBefore: 81.7185, qualifyAfter: 87.1268 },
  { team: 'Haiti', before: [0.8266, 3.2063, 8.2911, 87.6760], after: [0, 0, 0, 100], qualifyBefore: 9.2187, qualifyAfter: 0 },
];

const BRAZIL_OPPONENTS = [
  { stage: '16-avos', teams: [['Japão', 36.6], ['Holanda', 35.8], ['Suécia', 13.1], ['México', 10.0], ['Alemanha', 4.5]] },
  { stage: 'Oitavas', teams: [['Noruega', 33.5], ['Costa do Marfim', 15.5], ['França', 12.7], ['Suíça', 8.0], ['Coreia do Sul', 7.3]] },
  { stage: 'Quartas', teams: [['Inglaterra', 27.5], ['México', 15.4], ['França', 13.9], ['Alemanha', 9.7], ['Noruega', 4.4]] },
  { stage: 'Semifinal', teams: [['Argentina', 30.9], ['Portugal', 15.8], ['Espanha', 11.8], ['Colômbia', 7.4], ['Bélgica', 6.0]] },
  { stage: 'Final', teams: [['França', 19.2], ['Espanha', 15.7], ['Alemanha', 8.0], ['Portugal', 7.6], ['Holanda', 7.2]] },
] as const;

const QUALIFICATION_RISES = [
  ['Paraguai', 50.7516, 83.6226], ['Canadá', 27.7680, 100], ['Argélia', 26.9327, 80.6615],
  ['Suíça', 24.4840, 100], ['Egito', 23.7047, 99.9994], ['Croácia', 23.2392, 94.7280],
  ['Gana', 21.8684, 99.9857], ['Japão', 19.0565, 100],
] as const;

const QUALIFICATION_FALLS = [
  ['Turquia', -47.5406, 0], ['Equador', -38.0042, 22.1382], ['Uruguai', -32.5889, 40.1156],
  ['RD do Congo', -23.9677, 45.5377], ['Catar', -21.8213, 24.3163], ['Nova Zelândia', -21.5956, 20.1026],
  ['Tcheca', -21.5320, 31.2544], ['Bósnia e Herzegovina', -20.6955, 49.7675],
] as const;

const THIRD_POINTS = [
  [4, 99.95], [3, 75.96], [2, 5.75], [1, 0],
] as const;

const THIRD_EXAMPLES = [
  { points: 3, saldo: 1, value: 98.9 },
  { points: 3, saldo: 0, value: 98.7 },
  { points: 3, saldo: -1, value: 94.6 },
  { points: 3, saldo: -2, value: 85.0 },
  { points: 3, saldo: -3, value: 70.7 },
  { points: 3, saldo: -4, value: 54.7 },
  { points: 3, saldo: -5, value: 38.9 },
  { points: 2, saldo: -1, value: 10.0 },
];

const GROUP_POWER = [
  ['Grupo I', 21.1462, 21.5775],
  ['Grupo H', 13.9049, 13.7349],
  ['Grupo J', 11.3061, 13.6106],
  ['Grupo L', 13.2911, 11.2278],
  ['Grupo K', 10.1825, 10.3794],
  ['Grupo F', 6.1914, 7.6259],
  ['Grupo C', 8.7802, 7.3033],
] as const;

const SectionTitle: React.FC<{
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  light?: boolean;
}> = ({ eyebrow, title, children, light = false }) => (
  <div className="mb-8 max-w-3xl">
    <p className={`mb-2 font-montserrat text-xs font-black uppercase tracking-[0.25em] ${light ? 'text-brand-neon' : 'text-brand-green'}`}>{eyebrow}</p>
    <h2 className={`font-montserrat text-3xl font-black uppercase leading-none tracking-tight md:text-4xl ${light ? 'text-white' : 'text-brand-dark'}`}>{title}</h2>
    <p className={`mt-4 text-base leading-relaxed ${light ? 'text-white/65' : 'text-brand-dark/65'}`}>{children}</p>
  </div>
);

const ChangePill: React.FC<{ value: number; light?: boolean }> = ({ value, light = false }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-montserrat text-[11px] font-black ${
    value >= 0
      ? light ? 'bg-brand-neon/15 text-brand-neon' : 'bg-brand-green/10 text-brand-green'
      : light ? 'bg-brand-red/20 text-red-200' : 'bg-brand-red/10 text-brand-red'
  }`}>
    {value >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
    {signed(value)} p.p.
  </span>
);

const TitleRaceChart: React.FC = () => (
  <div className="overflow-x-auto pb-1">
    <div className="min-w-[760px]">
      <div className="mb-2 grid grid-cols-[180px_58px_minmax(260px,1fr)_58px_100px] items-center gap-3 px-2 font-montserrat text-[9px] font-black uppercase tracking-wider text-brand-dark/35">
        <span>Seleção</span><span className="text-right">18/06</span><span>Variação</span><span>24/06</span><span className="text-right">Mudança</span>
      </div>
      <div className="divide-y divide-brand-dark/5">
        {TITLE_RACE.map((item, index) => {
          const delta = item.after - item.before;
          const left = Math.min(item.before, item.after);
          return (
            <div key={item.team} className={`grid grid-cols-[180px_58px_minmax(260px,1fr)_58px_100px] items-center gap-3 px-2 py-2 ${item.highlight ? 'bg-brand-green/[0.05]' : ''}`}>
              <span className="flex min-w-0 items-center gap-2 font-montserrat text-xs font-black uppercase">
                <span className="w-5 text-right text-[9px] text-brand-dark/25">{index + 1}</span>
                <span className="text-lg">{FLAG[item.team]}</span>
                <span className={`truncate ${item.highlight ? 'text-brand-green' : 'text-brand-dark'}`}>{item.team}</span>
              </span>
              <span className="text-right font-montserrat text-xs font-bold text-brand-dark/45">{fmt(item.before)}%</span>
              <div className="relative h-7 rounded-full bg-brand-dark/5">
                <div className={`absolute top-1/2 h-2 -translate-y-1/2 rounded-full ${delta >= 0 ? 'bg-brand-green' : 'bg-brand-red'}`} style={{ left: `${left * 5}%`, width: `${Math.max(Math.abs(delta) * 5, 1.5)}%` }} />
                <span className="absolute top-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand-dark/30 bg-white" style={{ left: `${item.before * 5}%` }} />
                <span className={`absolute top-1/2 z-20 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white ${delta >= 0 ? 'bg-brand-green' : 'bg-brand-red'}`} style={{ left: `${item.after * 5}%` }} />
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

const FavoriteEvolutionCard: React.FC<{
  item: (typeof FAVORITE_EVOLUTION)[number];
  index: number;
}> = ({ item, index }) => {
  const chartMax = 20;
  const x = [18, 110, 202];
  const y = item.values.map((value) => 82 - (value / chartMax) * 66);
  const line = x.map((xValue, pointIndex) => `${xValue},${y[pointIndex]}`).join(' ');
  const area = `M ${x[0]} 88 L ${x[0]} ${y[0]} L ${x[1]} ${y[1]} L ${x[2]} ${y[2]} L ${x[2]} 88 Z`;
  const delta = item.values[2] - item.values[0];
  const lineColor = delta >= 0 ? '#209927' : '#E27C2D';
  const gradientId = `favorite-evolution-${index}`;
  const isBrazil = item.team === 'Brasil';

  return (
    <article className={`relative overflow-hidden rounded-3xl border bg-white/[0.055] p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
      isBrazil ? 'border-transparent' : 'border-white/10'
    }`}>
      {isBrazil && (
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl p-px"
          style={{
            background: 'linear-gradient(135deg, #209927 0%, #68E70F 55%, #FFCF26 100%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
      )}
      <div className="relative">
        <h3 className="flex min-w-0 items-center gap-2 font-montserrat text-base font-black uppercase text-white">
          <span className="text-xl">{FLAG[item.team]}</span>
          <span className="truncate">{item.team}</span>
        </h3>
        <span
          className="mt-2 inline-flex rounded-full px-2.5 py-1 font-montserrat text-[10px] font-black"
          style={{ color: lineColor, backgroundColor: `${lineColor}18` }}
        >
          {signed(delta)} p.p.
        </span>
      </div>

      <div className="relative mt-5">
        <svg viewBox="0 0 220 96" className="block w-full overflow-visible" role="img" aria-label={`Evolução da chance de título de ${item.team}`}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={lineColor} stopOpacity="0.38" />
              <stop offset="1" stopColor={lineColor} stopOpacity="0.015" />
            </linearGradient>
          </defs>
          {[16, 49, 82].map((gridY) => (
            <line key={gridY} x1="14" y1={gridY} x2="206" y2={gridY} stroke="#FFFFFF" strokeOpacity="0.09" strokeDasharray="3 4" />
          ))}
          <path d={area} fill={`url(#${gradientId})`} />
          <polyline points={line} fill="none" stroke={lineColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {x.map((xValue, pointIndex) => (
            <g key={xValue}>
              <circle cx={xValue} cy={y[pointIndex]} r="6" fill="#18251D" stroke={lineColor} strokeWidth="3" />
              <text x={xValue} y={Math.max(y[pointIndex] - 12, 14)} textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="900">
                {fmt(item.values[pointIndex])}%
              </text>
            </g>
          ))}
        </svg>
        <div className="grid grid-cols-3 border-t border-white/10 pt-2 font-montserrat text-[8px] font-black uppercase tracking-wider text-white/35">
          <span>11/06</span>
          <span className="text-center">18/06</span>
          <span className="text-right">24/06</span>
        </div>
      </div>
    </article>
  );
};

const ELIM_SCALE = 45;
const ELIM_KNOCKOUT_LABELS = [
  ['cair em', '16-avos'],
  ['cair nas', 'oitavas'],
  ['cair nas', 'quartas'],
  ['cair na', 'semi'],
  ['perder a', 'final'],
  ['ganhar a', 'final'],
] as const;

const FavoriteEliminationChart: React.FC = () => (
  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
    {FAVORITE_PATHS.map((item) => {
      const isBrazil = item.team === 'Brasil';
      const barColor = isBrazil ? 'bg-brand-green' : 'bg-brand-blue';
      const textColor = isBrazil ? 'text-brand-green' : 'text-brand-blue';
      // Etapas exclusivas: cair em cada fase do mata-mata, perder a final (vice) e ganhá-la (título).
      const stages = [item.after[1], item.after[2], item.after[3], item.after[4], item.after[5], item.after[6]];
      return (
        <article key={item.team} className={`rounded-2xl border bg-white p-5 shadow-sm ${isBrazil ? 'border-brand-green/40 ring-2 ring-brand-green/10' : 'border-brand-dark/10'}`}>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 font-montserrat text-sm font-black uppercase"><span className="text-xl">{FLAG[item.team]}</span>{item.team}</span>
          </div>
          <div className="mt-6 grid h-44 grid-cols-6 items-end gap-1.5 border-b-2 border-brand-dark/15">
            {stages.map((value, index) => (
              <div key={ELIM_KNOCKOUT_LABELS[index].join('-')} className="relative flex h-full items-end justify-center">
                <div className={`relative w-full max-w-9 rounded-t-md ${barColor}`} style={{ height: `${Math.max(value / ELIM_SCALE * 100, 1.5)}%` }}>
                  <span className={`absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-montserrat text-[9px] font-black ${textColor}`}>{fmt(value)}%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-6 gap-1.5">
            {ELIM_KNOCKOUT_LABELS.map(([line1, line2]) => (
              <span key={`${line1}-${line2}`} className="text-center font-montserrat text-[7px] font-black uppercase leading-tight text-brand-dark/45">
                {line1}<br />{line2}
              </span>
            ))}
          </div>
        </article>
      );
    })}
  </div>
);

const BrazilPathChart: React.FC = () => (
  <div className="space-y-5">
    {BRAZIL_PATH.map((item) => (
      <div key={item.stage} className="grid grid-cols-[96px_1fr_50px] items-center gap-3 sm:grid-cols-[150px_1fr_60px]">
        <span className="text-right font-montserrat text-[10px] font-bold uppercase leading-tight text-white/65 sm:text-xs">{item.stage}</span>
        <div className="space-y-1.5">
          <div className="h-2.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-white/30" style={{ width: `${item.before}%` }} /></div>
          <div className="h-3.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-brand-neon" style={{ width: `${item.after}%` }} /></div>
        </div>
        <span className="font-montserrat text-sm font-black text-brand-neon">{fmt(item.after)}%</span>
      </div>
    ))}
    <div className="flex justify-end gap-5 text-[10px] font-bold uppercase tracking-wider text-white/45">
      <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-white/30" />18/06</span>
      <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-brand-neon" />24/06</span>
    </div>
  </div>
);

const GroupCChart: React.FC = () => (
  <div className="space-y-7">
    {GROUP_C.map((team) => (
      <div key={team.team}>
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 font-montserrat text-sm font-black uppercase"><span className="text-xl">{FLAG[team.team]}</span>{team.team}</span>
          <ChangePill value={team.qualifyAfter - team.qualifyBefore} />
        </div>
        {[['18/06', team.before], ['24/06', team.after]].map(([label, values]) => (
          <div key={label as string} className="mb-1.5 grid grid-cols-[44px_1fr] items-center gap-2">
            <span className="text-[9px] font-bold uppercase text-brand-dark/35">{label as string}</span>
            <div className="flex h-7 overflow-hidden rounded-lg bg-brand-dark/5">
              {(values as number[]).map((value, index) => (
                <div key={index} className="flex items-center justify-center overflow-hidden text-[9px] font-black text-white" style={{ width: `${value}%`, backgroundColor: ['#209927', '#035C88', '#E6B800', '#BF1A1F'][index] }}>
                  {value >= 8 ? `${fmt(value)}%` : ''}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    ))}
    <div className="flex flex-wrap justify-center gap-4 text-[9px] font-bold uppercase text-brand-dark/45">
      {['1º lugar', '2º lugar', '3º lugar', '4º lugar'].map((label, index) => (
        <span key={label} className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: ['#209927', '#035C88', '#E6B800', '#BF1A1F'][index] }} />{label}</span>
      ))}
    </div>
  </div>
);

const QualificationColumn: React.FC<{
  title: string;
  data: ReadonlyArray<readonly [string, number, number]>;
  positive: boolean;
}> = ({ title, data, positive }) => (
  <div className="rounded-3xl border border-brand-dark/10 bg-white p-6 shadow-sm">
    <h3 className="mb-5 font-montserrat text-sm font-black uppercase text-brand-dark">{title}</h3>
    <div className="space-y-4">
      {data.map(([team, delta, now]) => (
        <div key={team} className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-brand-dark/5 pb-3 last:border-0 last:pb-0">
          <div className="min-w-0">
            <p className="truncate font-montserrat text-xs font-black uppercase">{FLAG[team]} {team}</p>
            <p className="mt-1 text-[10px] uppercase text-brand-dark/35">Agora {fmt(now)}% de classificação</p>
          </div>
          <span className={`font-montserrat text-lg font-black ${positive ? 'text-brand-green' : 'text-brand-red'}`}>{signed(delta)} p.p.</span>
        </div>
      ))}
    </div>
  </div>
);

const SecondRoundPage: React.FC = () => (
  <div className="bg-brand-light font-opensans">
    <PageHeader
      icon={Newspaper}
      eyebrow="Reportagem 03 · Fim da segunda rodada · 1.000.000 de simulações"
      title="O Hexa Ficou"
      accent="Mais Difícil."
      description="A vitória sobre o Haiti levou o Brasil a 100% de classificação nas simulações, mas a segunda rodada tornou o primeiro confronto eliminatório mais duro e reduziu a chance do Hexa."
    />
    <ReportEditionSelector current="pos-rodada2" />

    <section className="border-b border-brand-dark/10 bg-white">
      <div className="mx-auto max-w-[1080px] px-4 py-14">
        <p className="text-xl font-light leading-relaxed text-brand-dark/80 md:text-2xl">
          <span className="font-montserrat text-2xl font-black text-brand-green md:text-3xl">A Copa começou a trocar possibilidades por certezas.</span>{' '}
          Com 48 partidas encerradas, 46,2% do torneio já foi disputado. Quinze seleções avançaram
          em todas as simulações; cinco não avançaram em nenhuma. Entre as favoritas, a Argentina
          acelerou. Para o Brasil, chegar a 100% de classificação no modelo veio acompanhado de um
          paradoxo: a chance de título caiu.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['48', 'jogos disputados'], ['141', 'gols marcados'],
            ['15', 'seleções com 100% de classificação'], ['5', 'seleções com 0% de classificação'],
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
      <SectionTitle eyebrow="Resultados e probabilidades" title="O desfecho mais provável ocorreu em 18 dos 24 jogos">
        Na segunda rodada, <strong>75% das partidas</strong> terminaram com o resultado de maior
        probabilidade no modelo publicado após a estreia. A probabilidade média atribuída ao que
        efetivamente ocorreu foi de <strong>48,1%</strong>. Ainda assim, seis jogos contrariaram o
        favoritismo — cinco empates e a vitória do Paraguai sobre a Turquia. O percentual de 75%
        descreve a frequência do desfecho mais provável; não deve ser interpretado isoladamente
        como medida de acurácia de uma previsão probabilística.
      </SectionTitle>
      <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {[
            ['75%', 'dos jogos seguiram o desfecho mais provável'],
            ['48,1%', 'probabilidade média do resultado observado'],
            ['2,75', 'gols por jogo na segunda rodada'],
          ].map(([value, label]) => (
            <div key={label} className="rounded-3xl border border-brand-dark/10 bg-white p-6 shadow-sm">
              <p className="font-montserrat text-4xl font-black text-brand-blue">{value}</p>
              <p className="mt-2 text-xs font-bold uppercase leading-snug text-brand-dark/50">{label}</p>
            </div>
          ))}
        </div>
        <div className="rounded-3xl border border-brand-dark/10 bg-white p-6 shadow-sm md:p-8">
          <p className="mb-5 font-montserrat text-xs font-black uppercase tracking-widest text-brand-dark/40">Os resultados que contrariaram o favoritismo</p>
          <div className="space-y-4">
            {ROUND_SURPRISES.map((item) => (
              <div key={item.match} className="grid grid-cols-[1fr_auto] gap-4 border-b border-brand-dark/5 pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="font-montserrat text-sm font-black uppercase">{item.match}</p>
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
        <SectionTitle eyebrow="Corrida pelo título" title="Argentina sobe; França preserva a liderança">
          A França segue na frente, com <strong>18,3%</strong> de chance de título. A maior mudança
          veio da Argentina: de 10,8% para 13,3%, ultrapassando a Inglaterra e praticamente
          alcançando a Espanha. Holanda e Estados Unidos também avançaram. Inglaterra (−1,9 p.p.)
          e Brasil (−1,3 p.p.) registraram os maiores recuos entre as 15 primeiras. A concentração
          também aumentou: o top 4 passou de 54,3% para 55,7% dos títulos simulados.
        </SectionTitle>
        <div className="rounded-3xl border border-brand-dark/10 bg-brand-light p-6 shadow-sm md:p-8"><TitleRaceChart /></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['55,7%', 'dos títulos concentrados no top 4'],
            ['80,2%', 'dos títulos concentrados no top 8'],
            ['90,3%', 'dos títulos concentrados no top 12'],
            ['95,6%', 'dos títulos concentrados no top 16'],
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl border border-brand-dark/10 bg-brand-light p-6 text-center">
              <p className="font-montserrat text-4xl font-black text-brand-green">{value}</p>
              <p className="mt-2 text-xs font-bold uppercase text-brand-dark/50">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="relative overflow-hidden bg-[#101D15] py-16 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] bg-[radial-gradient(#68E70F_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="pointer-events-none absolute -left-32 top-16 h-80 w-80 rounded-full bg-brand-green/20 blur-3xl" />
      <div className="relative mx-auto max-w-[1080px] px-4">
        <SectionTitle light eyebrow="A corrida em três atos" title="Como evoluíram os dez favoritos do início da Copa">
          Mantivemos fixo o grupo das dez seleções que começaram o torneio com maior probabilidade
          de título e acompanhamos sua trajetória nas três simulações oficiais. Argentina e França
          são as grandes altas; Brasil e Bélgica caem nas duas atualizações.
        </SectionTitle>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {FAVORITE_EVOLUTION.map((item, index) => (
            <FavoriteEvolutionCard key={item.team} item={item} index={index} />
          ))}
        </div>

        <p className="mt-6 text-center text-[10px] font-bold uppercase tracking-wider text-white/30">
          Probabilidade de título · 11/06: início da Copa · 18/06: fim da primeira rodada · 24/06: fim da segunda rodada
        </p>
      </div>
    </section>

    <section className="mx-auto max-w-[1080px] px-4 py-16">
      <SectionTitle eyebrow="Seis principais candidatas" title="O risco migrou da fase de grupos para o mata-mata">
        Cada barra mostra a probabilidade de a campanha terminar exatamente naquele ponto — desde
        a queda nos 16-avos até perder ou ganhar a final. Com a classificação garantida, o risco
        se concentra agora no primeiro confronto: no Brasil, a chance de cair nos 16-avos cresceu
        de 33,8% para <strong>42,0%</strong>.
      </SectionTitle>
      <FavoriteEliminationChart />
      <p className="mt-5 text-center text-[10px] font-bold uppercase text-brand-dark/40">Probabilidade de a campanha terminar em cada etapa do mata-mata · 24/06</p>
    </section>

    <section className="bg-[#072B18] py-16 text-white">
      <div className="mx-auto max-w-[1080px] px-4">
        <SectionTitle light eyebrow="O paradoxo brasileiro" title="100% de classificação, mas 5,3% de chance do Hexa">
          O Brasil venceu o Haiti, passou de 93,6% para 100% de classificação nas simulações e
          elevou de 46,6% para 60,4% a chance de liderar o Grupo C. Mesmo assim, caiu do sexto para
          o oitavo lugar na projeção do título. Uma parte relevante da explicação está no caminho:
          Japão e Holanda, os adversários mais prováveis nos 16-avos, ganharam seus jogos e passaram
          a concentrar 72,3% dos primeiros confrontos.
        </SectionTitle>
        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8"><BrazilPathChart /></div>
          <div className="grid gap-4">
            {[
              ['8º', 'no ranking do título', 'era 6º após a primeira rodada'],
              ['−1,3 p.p.', 'na chance de ser campeão', 'de 6,6% para 5,3%'],
              ['49,5%', 'de chance de título se chegar à final', 'era 52,9% em 18/06'],
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
        <SectionTitle eyebrow="Grupo C depois de dois jogos" title="Brasil chega a 100%; Marrocos fica a um passo">
          O Brasil avançou ao mata-mata em todas as 1.000.000 de simulações. Marrocos avançou em
          999.999 delas, restando um único cenário de eliminação no modelo. O Brasil tem 60,4% de
          chance de terminar em primeiro; a Escócia aparece em terceiro em 84,3% das simulações e
          avança em 87,1% do total. O Haiti não avançou em nenhuma simulação.
        </SectionTitle>
        <div className="rounded-3xl border border-brand-dark/10 bg-brand-light p-6 shadow-sm md:p-8"><GroupCChart /></div>
      </div>
    </section>

    <section className="bg-brand-dark py-16 text-white">
      <div className="mx-auto max-w-[1080px] px-4">
        <SectionTitle light eyebrow="O chaveamento provável" title="Japão e Holanda dominam a porta de entrada do Brasil">
          O primeiro adversário depende da posição final no grupo. Se o Brasil terminar em primeiro,
          o Japão aparece em 50,0% dos cenários; se terminar em segundo, a Holanda chega a 69,3%.
          Mais adiante, Noruega lidera nas oitavas, Inglaterra nas quartas, Argentina na semifinal
          e França em uma eventual final.
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
      <SectionTitle eyebrow="Quem ganhou e quem perdeu terreno" title="A classificação produziu mudanças de mais de 50 pontos">
        O Paraguai foi a maior alta da rodada, impulsionado pela vitória sobre a Turquia. Canadá,
        Suíça e Japão chegaram a 100% de classificação; Egito e Gana aparecem com 100,0% após
        arredondamento. No extremo oposto, a Turquia caiu a 0% no modelo; Equador e Uruguai
        perderam mais de 30 pontos percentuais.
      </SectionTitle>
      <div className="grid gap-6 lg:grid-cols-2">
        <QualificationColumn title="Maiores altas na classificação" data={QUALIFICATION_RISES} positive />
        <QualificationColumn title="Maiores quedas na classificação" data={QUALIFICATION_FALLS} positive={false} />
      </div>
    </section>

    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1080px] px-4">
        <SectionTitle eyebrow="Os melhores terceiros" title="Três pontos ganharam valor antes da rodada decisiva">
          Com os resultados já conhecidos, uma campanha de três pontos passou de 64,7% para
          <strong> 76,0%</strong> de chance média de classificação. O saldo continua decisivo:
          três pontos e saldo zero correspondem a 98,7%; com saldo −4, a projeção cai para 54,7%.
          Com dois pontos, a chance média é de apenas 5,7%.
        </SectionTitle>
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-3xl border border-brand-dark/10 bg-brand-light p-6">
            <h3 className="mb-5 font-montserrat text-sm font-black uppercase">Classificação por pontos</h3>
            <div className="space-y-4">
              {THIRD_POINTS.map(([points, value]) => (
                <div key={points} className="grid grid-cols-[50px_1fr_58px] items-center gap-3">
                  <span className="text-right font-montserrat text-xs font-black">{points} pts</span>
                  <div className="h-7 overflow-hidden rounded-lg bg-white"><div className="h-full rounded-lg bg-brand-green" style={{ width: `${Math.max(value, 0.3)}%` }} /></div>
                  <span className="font-montserrat text-xs font-black text-brand-green">{fmt(value, value > 99.9 && value < 100 ? 2 : 1)}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {THIRD_EXAMPLES.map((item) => (
              <div key={`${item.points}-${item.saldo}`} className="rounded-2xl border border-brand-dark/10 bg-brand-light p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-montserrat text-xs font-black uppercase">{item.points} pontos · saldo {item.saldo > 0 ? '+' : ''}{item.saldo}</span>
                  <span className="font-montserrat text-xl font-black text-brand-blue">{fmt(item.value)}%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white"><div className="h-full rounded-full bg-brand-blue" style={{ width: `${item.value}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-[1080px] px-4 py-16">
      <SectionTitle eyebrow="Onde está a força do torneio" title="Grupo I lidera; Grupo J cresce com a Argentina">
        França e Noruega mantêm o Grupo I no topo, com 21,6% da probabilidade de título. O Grupo J,
        liderado pela Argentina, ganhou 2,3 pontos percentuais. O Grupo C perdeu 1,5 ponto apesar
        de o Brasil alcançar 100% de classificação no modelo. Por confederação, a Europa recuou de
        69,2% para 68,0%; a Concacaf avançou de 4,3% para 5,4%.
      </SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2">
        {GROUP_POWER.map(([group, before, after]) => (
          <div key={group} className="rounded-2xl border border-brand-dark/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-montserrat text-sm font-black uppercase">{group}</span>
              <ChangePill value={after - before} />
            </div>
            <div className="mt-4 h-3 rounded-full bg-brand-dark/5"><div className="h-full rounded-full bg-brand-blue" style={{ width: `${after * 4.3}%` }} /></div>
            <p className="mt-2 text-right text-xs text-brand-dark/45">Agora <strong className="text-brand-blue">{fmt(after)}%</strong> dos títulos</p>
          </div>
        ))}
      </div>
    </section>

    <section className="bg-brand-green py-16 text-white">
      <div className="mx-auto grid max-w-[1080px] items-center gap-8 px-4 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="font-montserrat text-xs font-black uppercase tracking-[0.25em] text-brand-neon">Próxima atualização</p>
          <h2 className="mt-2 font-montserrat text-3xl font-black uppercase leading-none md:text-4xl">A terceira rodada vai transformar projeções em chaveamento</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-white/75">As posições finais dos grupos definirão adversários, lados da chave e o peso real dos caminhos que hoje ainda aparecem como probabilidades.</p>
        </div>
        <a href="/copa-2026" className="inline-flex items-center justify-center gap-3 rounded-xl bg-white px-7 py-4 font-montserrat text-sm font-bold uppercase text-brand-green transition hover:bg-brand-neon hover:text-brand-dark">
          Ver probabilidades completas <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>

    <section className="bg-brand-light">
      <div className="mx-auto max-w-[820px] px-4 py-10 text-center">
        <div className="mb-4 flex items-center justify-center gap-2 text-brand-dark/35">
          <Activity className="h-4 w-4" />
          <span className="font-montserrat text-[10px] font-black uppercase tracking-widest">Nota metodológica</span>
        </div>
        <p className="text-xs leading-relaxed text-brand-dark/45">
          Comparação entre as simulações oficiais de 18/06/2026 e 24/06/2026. Cada retrato contém
          1.000.000 de simulações completas; no segundo, os 48 resultados oficiais das duas primeiras
          rodadas estão travados. Probabilidades de eliminação são exclusivas por fase e somam 100%
          por seleção. A análise dos 24 jogos da segunda rodada usa as probabilidades publicadas após
          o encerramento da primeira rodada. Valores de 100% ou 0% indicam a frequência observada
          neste conjunto de um milhão de simulações e não devem ser confundidos, por si sós, com
          prova de certeza matemática.
        </p>
      </div>
    </section>
  </div>
);

export default SecondRoundPage;
