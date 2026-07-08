import React from 'react';
import { ArrowRight, BarChart3, Globe2, Newspaper, Swords, Trophy, XCircle } from 'lucide-react';
import PageHeader from './PageHeader';
import OpinionCallout from './OpinionCallout';
import ReportEditionSelector from './ReportEditionSelector';

const fmt = (value: number) => value.toFixed(1).replace('.', ',');
const signed = (value: number) => `${value > 0 ? '+' : value < 0 ? '-' : ''}${fmt(Math.abs(value))}`;

const ENG_FLAG = '🏴\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}';
const FLAG: Record<string, string> = {
  França: '🇫🇷',
  Argentina: '🇦🇷',
  Espanha: '🇪🇸',
  Inglaterra: ENG_FLAG,
  Brasil: '🇧🇷',
  Portugal: '🇵🇹',
  México: '🇲🇽',
  Colômbia: '🇨🇴',
  'Estados Unidos': '🇺🇸',
  Marrocos: '🇲🇦',
  Noruega: '🇳🇴',
  Bélgica: '🇧🇪',
  Suíça: '🇨🇭',
  Egito: '🇪🇬',
  Canadá: '🇨🇦',
  Paraguai: '🇵🇾',
};

const TEAM_CODE: Record<string, string> = {
  França: 'FRA',
  Marrocos: 'MAR',
  Espanha: 'ESP',
  Bélgica: 'BEL',
  Noruega: 'NOR',
  Inglaterra: 'ING',
  Argentina: 'ARG',
  Suíça: 'SUI',
};

const TeamLabel = ({ team, className = '' }: { team: string; className?: string }) => (
  <span className={`inline-flex min-w-0 items-center gap-2 ${className}`}>
    <span className="text-lg leading-none" aria-hidden="true">{FLAG[team] ?? '⚽'}</span>
    <span className="truncate">{team}</span>
  </span>
);

const TeamCodeLabel = ({ team, className = '' }: { team: string; className?: string }) => (
  <span className={`inline-flex min-w-0 items-center gap-2 ${className}`}>
    <span className="flex h-5 min-w-8 items-center justify-center rounded bg-brand-dark/8 px-1.5 font-montserrat text-[9px] font-black text-brand-dark/45">
      {TEAM_CODE[team] ?? team.slice(0, 3).toUpperCase()}
    </span>
    <span className="truncate">{team}</span>
  </span>
);

const LOCAL_FLAG_SRC: Record<string, string> = {
  França: '/flags/fr.webp',
  Marrocos: '/flags/ma.webp',
  Espanha: '/flags/es.webp',
  Bélgica: '/flags/be.webp',
  Noruega: '/flags/no.webp',
  Inglaterra: '/flags/gb-eng.webp',
  Argentina: '/flags/ar.webp',
  Suíça: '/flags/ch.webp',
};

const TeamFlagLabel = ({ team, className = '' }: { team: string; className?: string }) => {
  const src = LOCAL_FLAG_SRC[team];
  return (
    <span className={`inline-flex min-w-0 items-center gap-2 ${className}`}>
      {src ? (
        <img
          src={src}
          alt=""
          className="h-4 w-6 flex-none rounded-[3px] object-cover shadow-sm ring-1 ring-brand-dark/10"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="flex h-4 min-w-6 items-center justify-center rounded-[3px] bg-brand-dark/8 px-1 font-montserrat text-[8px] font-black text-brand-dark/45">
          {team.slice(0, 3).toUpperCase()}
        </span>
      )}
      <span className="truncate">{team}</span>
    </span>
  );
};

const FlagImage = ({ team, className = '' }: { team: string; className?: string }) => {
  const src = LOCAL_FLAG_SRC[team];
  if (!src) {
    return (
      <span className={`flex items-center justify-center rounded bg-brand-dark/8 font-montserrat font-black text-brand-dark/45 ${className}`}>
        {team.slice(0, 3).toUpperCase()}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt=""
      className={`flex-none rounded object-cover shadow-sm ring-1 ring-brand-dark/10 ${className}`}
      loading="lazy"
      decoding="async"
    />
  );
};

const MatchLabel = ({ match }: { match: string }) => {
  const scoreMatch = match.match(/^(.+?)\s+(\d+)\s+x\s+(\d+)\s+(.+)$/);
  if (scoreMatch) {
    const [, left, leftScore, rightScore, right] = scoreMatch;
    return (
      <span className="inline-flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
        <TeamLabel team={left} />
        <span>{leftScore} x {rightScore}</span>
        <TeamLabel team={right} />
      </span>
    );
  }
  const [left, right] = match.split(' x ');
  return (
    <span className="inline-flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
      <TeamLabel team={left} />
      <span>x</span>
      <TeamLabel team={right} />
    </span>
  );
};

const TITLE_RACE = [
  ['França', 33.5, 0.7],
  ['Espanha', 19.0, 6.6],
  ['Argentina', 18.4, 1.9],
  ['Inglaterra', 15.3, 7.9],
  ['Noruega', 6.0, 4.1],
  ['Marrocos', 3.0, 0.5],
  ['Bélgica', 2.5, 1.1],
  ['Suíça', 2.3, 1.3],
] as const;

const ROUND_OF_16_RESULTS = [
  ['Paraguai 0 x 1 França', 'França', 88.5, 'confirmou o maior favoritismo das oitavas'],
  ['Canadá 0 x 3 Marrocos', 'Marrocos', 68.1, 'avançou com autoridade'],
  ['Brasil 1 x 2 Noruega', 'Noruega', 38.5, 'foi a maior quebra das oitavas'],
  ['México 2 x 3 Inglaterra', 'Inglaterra', 55.8, 'virou força real no quadrante'],
  ['Portugal 0 x 1 Espanha', 'Espanha', 57.5, 'derrubou uma candidata ao título'],
  ['Estados Unidos 1 x 4 Bélgica', 'Bélgica', 43.6, 'mudou a leitura do lado espanhol'],
  ['Argentina 3 x 2 Egito', 'Argentina', 81.7, 'sobreviveu em jogo de cinco gols'],
  ['Suíça 0 x 0 Colômbia', 'Suíça', 39.7, 'passou depois de um duelo travado'],
] as const;

const QUARTERFINALS = [
  { match: 'França x Marrocos', winA: 63.0, draw: 22.6, winB: 14.4, advA: 77.5, advB: 22.5 },
  { match: 'Espanha x Bélgica', winA: 57.3, draw: 24.3, winB: 18.4, advA: 72.1, advB: 27.9 },
  { match: 'Noruega x Inglaterra', winA: 27.0, draw: 26.5, winB: 46.5, advA: 38.8, advB: 61.2 },
  { match: 'Argentina x Suíça', winA: 57.5, draw: 24.3, winB: 18.2, advA: 72.3, advB: 27.7 },
] as const;

const FINALS = [
  ['Argentina x França', 20.2],
  ['Inglaterra x França', 17.2],
  ['Argentina x Espanha', 13.4],
  ['Inglaterra x Espanha', 11.4],
  ['França x Noruega', 8.8],
  ['Noruega x Espanha', 5.8],
] as const;

const CONFEDERATIONS = [
  ['UEFA', '6 de 8 nas quartas', 78.6],
  ['CONMEBOL', 'Argentina ainda viva', 18.4],
  ['CAF', 'Marrocos ainda vivo', 3.0],
] as const;

const BRAZIL_TIMELINE = [
  { label: 'Início da Copa', value: 8.3 },
  { label: 'Fim da 1ª rodada', value: 6.6 },
  { label: 'Fim da 2ª rodada', value: 5.3 },
  { label: 'Início do mata-mata', value: 5.7 },
  { label: 'Início das oitavas', value: 6.6 },
  { label: 'Início das quartas', value: null },
] as const;

const EVOLUTION_LABELS = ['11/06', '18/06', '24/06', '28/06', '04/07', '08/07'] as const;

const TITLE_EVOLUTION = [
  { team: 'França', values: [14.8, 17.8, 18.3, 22.2, 32.8, 33.5], color: '#68E70F' },
  { team: 'Espanha', values: [15.9, 13.2, 13.5, 10.7, 12.4, 19.0], color: '#FFCF26' },
  { team: 'Argentina', values: [8.2, 10.8, 13.3, 19.9, 16.5, 18.4], color: '#4FC3F7' },
  { team: 'Inglaterra', values: [10.3, 12.5, 10.6, 10.4, 7.4, 15.3], color: '#E27C2D' },
  { team: 'Noruega', values: [2.4, 2.6, 2.8, 2.2, 1.9, 6.0], color: '#7AD7F0' },
  { team: 'Marrocos', values: [1.5, 2.0, 1.9, 1.3, 2.5, 3.0], color: '#E45C86' },
  { team: 'Bélgica', values: [2.2, 1.7, 1.2, 1.4, 1.4, 2.5], color: '#C7A6FF' },
  { team: 'Suíça', values: [1.1, 0.8, 0.7, 0.9, 1.0, 2.3], color: '#FFFFFF' },
] as const;

const StatCard = ({ value, label }: { value: string; label: string }) => (
  <div className="rounded-lg border border-brand-dark/10 bg-white p-5">
    <p className="font-montserrat text-3xl font-black text-brand-green">{value}</p>
    <p className="mt-2 text-xs font-bold uppercase leading-snug text-brand-dark/45">{label}</p>
  </div>
);

const SectionTitle = ({
  eyebrow,
  title,
  children,
  light = false,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
  light?: boolean;
}) => (
  <div className="mb-8 max-w-3xl">
    <p className="font-montserrat text-xs font-black uppercase tracking-wider text-brand-green">{eyebrow}</p>
    <h2 className={`mt-2 font-montserrat text-3xl font-black uppercase leading-none md:text-4xl ${light ? 'text-white' : 'text-brand-dark'}`}>{title}</h2>
    {children && <p className={`mt-4 text-base leading-relaxed ${light ? 'text-white/70' : 'text-brand-dark/70'}`}>{children}</p>}
  </div>
);

const AliveEvolutionCard: React.FC<{
  item: (typeof TITLE_EVOLUTION)[number];
  index: number;
}> = ({ item, index }) => {
  const chartMax = 36;
  const x = [16, 53, 90, 127, 164, 201];
  const y = item.values.map((value) => 88 - (value / chartMax) * 70);
  const line = x.map((xValue, pointIndex) => `${xValue},${y[pointIndex]}`).join(' ');
  const area = `M ${x[0]} 92 L ${x[0]} ${y[0]} ${x.slice(1).map((xValue, pointIndex) => `L ${xValue} ${y[pointIndex + 1]}`).join(' ')} L ${x[x.length - 1]} 92 Z`;
  const deltaFromRoundOf16 = item.values[item.values.length - 1] - item.values[item.values.length - 2];
  const gradientId = `quarterfinals-title-evolution-${index}`;

  return (
    <article className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 font-montserrat text-sm font-black uppercase text-white">
          <TeamLabel team={item.team} />
        </h3>
        <span
          className="rounded-md px-2 py-1 font-montserrat text-[8px] font-black leading-tight"
          style={{ color: item.color, backgroundColor: `${item.color}18` }}
        >
          {signed(deltaFromRoundOf16)} pp
        </span>
      </div>

      <div className="mt-5">
        <svg viewBox="0 0 220 102" className="block w-full overflow-visible" role="img" aria-label={`Evolução da chance de título de ${item.team}`}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={item.color} stopOpacity="0.34" />
              <stop offset="1" stopColor={item.color} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {[18, 53, 88].map((gridY) => (
            <line key={gridY} x1="14" y1={gridY} x2="206" y2={gridY} stroke="#FFFFFF" strokeOpacity="0.09" strokeDasharray="3 4" />
          ))}
          <path d={area} fill={`url(#${gradientId})`} />
          <polyline points={line} fill="none" stroke={item.color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {x.map((xValue, pointIndex) => (
            <g key={xValue}>
              <circle cx={xValue} cy={y[pointIndex]} r="4.8" fill="#071F14" stroke={item.color} strokeWidth="2.5" />
              <text x={xValue} y={Math.max(y[pointIndex] - 10, 13)} textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="900">
                {fmt(item.values[pointIndex])}%
              </text>
            </g>
          ))}
        </svg>
        <div className="grid grid-cols-6 border-t border-white/10 pt-2 font-montserrat text-[8px] font-black uppercase text-white/35">
          {EVOLUTION_LABELS.map((label, labelIndex) => (
            <span key={label} className={labelIndex === 0 ? '' : labelIndex === EVOLUTION_LABELS.length - 1 ? 'text-right' : 'text-center'}>{label}</span>
          ))}
        </div>
      </div>
    </article>
  );
};

const DuelSide: React.FC<{
  team: string;
  chance: number;
  favorite: boolean;
  side: 'left' | 'right';
}> = ({ team, chance, favorite, side }) => {
  const flag = <FlagImage team={team} className="h-9 w-14" />;
  const name = (
    <p className="min-w-0 truncate font-montserrat text-base font-black uppercase leading-none text-brand-dark md:text-lg">
      {team}
    </p>
  );

  return (
    <div className={`min-w-0 ${side === 'right' ? 'text-right' : ''}`}>
      <div className={`grid items-center gap-3 ${side === 'right' ? 'grid-cols-[minmax(0,1fr)_56px]' : 'grid-cols-[56px_minmax(0,1fr)]'}`}>
        {side === 'left' ? (
          <>
            {flag}
            {name}
          </>
        ) : (
          <>
            {name}
            {flag}
          </>
        )}
      </div>
      <p className={`mt-4 font-montserrat text-3xl font-black ${favorite ? 'text-brand-green' : 'text-brand-blue'}`}>
        {fmt(chance)}%
      </p>
    </div>
  );
};

const QuarterfinalCard: React.FC<{
  game: (typeof QUARTERFINALS)[number];
  index: number;
}> = ({ game, index }) => {
  const { match, winA, draw, winB, advA, advB } = game;
  const [a, b] = match.split(' x ');
  const aIsFavorite = advA >= advB;

  return (
    <article className="overflow-hidden rounded-lg border border-[#D6D6D6] bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 bg-brand-dark px-5 py-3 text-white">
        <p className="font-montserrat text-[10px] font-black uppercase tracking-wider text-brand-neon">
          Jogo {index + 1} · Quartas de final
        </p>
        <p className="rounded-full border border-white/10 px-3 py-1 font-montserrat text-[8px] font-black uppercase tracking-wider text-white/55">
          vaga na semifinal
        </p>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-[minmax(0,1fr)_44px_minmax(0,1fr)] items-center gap-4">
          <DuelSide team={a} chance={advA} favorite={aIsFavorite} side="left" />
          <div className="flex items-center justify-center">
            <Swords className="h-7 w-7 text-brand-dark/45" strokeWidth={3} />
          </div>
          <DuelSide team={b} chance={advB} favorite={!aIsFavorite} side="right" />
        </div>

        <div className="mt-6 flex h-6 overflow-hidden rounded-full bg-brand-dark/10">
          <div
            className={`h-full ${aIsFavorite ? 'bg-brand-green' : 'bg-brand-blue/45'}`}
            style={{ width: `${advA}%` }}
          />
          <div
            className={`h-full ${aIsFavorite ? 'bg-brand-blue/45' : 'bg-brand-green'}`}
            style={{ width: `${advB}%` }}
          />
        </div>

        <div className="mt-4 border-t border-brand-dark/10 pt-3">
          <p className="text-center font-montserrat text-[9px] font-black uppercase tracking-wider text-brand-dark/35">Em 90 minutos</p>
          <div className="mx-auto mt-2 grid max-w-[560px] grid-cols-3 divide-x divide-brand-dark/10 rounded-md border border-brand-dark/10 text-center">
            <div className="px-2 py-2">
              <p className="truncate text-[10px] font-bold text-brand-dark/50">{a} vence</p>
              <p className="mt-0.5 font-montserrat text-xs font-black text-brand-dark">{fmt(winA)}%</p>
            </div>
            <div className="px-2 py-2">
              <p className="text-[10px] font-bold text-brand-dark/50">Empate</p>
              <p className="mt-0.5 font-montserrat text-xs font-black text-brand-dark">{fmt(draw)}%</p>
            </div>
            <div className="px-2 py-2">
              <p className="truncate text-[10px] font-bold text-brand-dark/50">{b} vence</p>
              <p className="mt-0.5 font-montserrat text-xs font-black text-brand-dark">{fmt(winB)}%</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

interface QuarterfinalsPageProps {
  onNavigate?: (view: any) => void;
}

const QuarterfinalsPage: React.FC<QuarterfinalsPageProps> = ({ onNavigate }) => (
  <div className="bg-brand-light font-opensans">
    <PageHeader
      icon={Newspaper}
      eyebrow="Reportagem 06 · Início das quartas · 1.000.000 de simulações"
      title="O hexa acabou"
      accent="França segue líder."
      description="O Brasil perdeu para a Noruega nas oitavas e saiu da Copa. O torneio entra nas quartas com oito seleções vivas, França na frente e Espanha, Argentina e Inglaterra mais próximas."
    />
    <ReportEditionSelector current="inicio-quartas" />

    <section className="border-b border-brand-dark/10 bg-white">
      <div className="mx-auto grid max-w-[1080px] gap-10 px-4 py-14 lg:grid-cols-[1fr_360px]">
        <div>
          <p className="font-montserrat text-xs font-black uppercase text-brand-green">Brasil 1 x 2 Noruega</p>
          <h1 className="mt-2 font-montserrat text-4xl font-black uppercase leading-none text-brand-dark md:text-5xl">
            O sonho brasileiro terminou antes das quartas.
          </h1>
          <p className="mt-5 text-lg font-light leading-relaxed text-brand-dark/75">
            O 2 a 1 da Noruega encerrou a campanha brasileira e tirou o país da corrida pelo título.
            Antes da bola rolar, o Brasil ainda era favorito para avançar: tinha 61,5% no confronto e 6,6% de chance de título.
            A Copa agora entra nas quartas com oito seleções vivas e 96 jogos já encerrados.
          </p>
        </div>
        <div className="grid gap-3">
          <div className="rounded-lg bg-brand-dark p-5 text-white">
            <div className="flex items-center gap-3">
              <XCircle className="h-7 w-7 text-red-400" />
              <p className="font-montserrat text-3xl font-black uppercase text-brand-neon">Eliminado</p>
            </div>
            <p className="mt-2 text-xs font-bold uppercase leading-snug text-white/50">Brasil fora da disputa pelo hexa</p>
          </div>
          <StatCard value="38,5%" label="chance de avanço da Noruega antes do jogo" />
          <StatCard value="8" label="seleções seguem vivas" />
        </div>
      </div>
      <div className="mx-auto max-w-[1080px] px-4 pb-14">
        <div className="rounded-lg border border-brand-dark/10 bg-brand-light p-5">
          <p className="mb-4 font-montserrat text-xs font-black uppercase tracking-wider text-brand-dark/45">A chance brasileira ao longo da Copa</p>
          <div className="grid gap-3 md:grid-cols-6">
            {BRAZIL_TIMELINE.map(({ label, value }) => (
              <div key={label} className="rounded bg-white p-3">
                <p className="font-montserrat text-[9px] font-black uppercase leading-tight text-brand-dark/40">{label}</p>
                <p className={`mt-2 font-montserrat text-2xl font-black ${value === null ? 'text-red-600' : 'text-brand-green'}`}>
                  {value === null ? 'fora' : `${fmt(value)}%`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <OpinionCallout
      eyebrow="Opinião de Ricardo Rocha"
      href="/opiniao/o-verdadeiro-culpado-pela-eliminacao-do-brasil-na-copa-do-mundo"
      onNavigate={onNavigate ? () => onNavigate('cronica-eliminacao-brasil') : undefined}
      variant="report"
    />

    <section className="mx-auto max-w-[1080px] px-4 py-16">
      <SectionTitle eyebrow="Corrida do título" title="Quatro seleções concentram 86,1% da taça">
        A França ainda é a referência da Copa, com 33,5%. Mas as oitavas aproximaram a perseguição:
        Espanha, Argentina e Inglaterra agora somam 52,6% de chance de título. A variação abaixo compara
        o retrato de 08/07 com a edição de 04/07, publicada no início das oitavas.
      </SectionTitle>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-brand-dark/10 bg-white p-5">
          {TITLE_RACE.map(([team, value, delta]) => (
            <div key={team} className="grid grid-cols-[130px_1fr_72px_64px] items-center gap-3 border-b border-brand-dark/8 py-2 last:border-0 sm:grid-cols-[150px_1fr_72px_64px]">
              <TeamLabel team={team} className="font-montserrat text-sm font-black text-brand-dark" />
              <div className="h-2 rounded-full bg-brand-dark/8"><div className="h-full rounded-full bg-brand-green" style={{ width: `${value * 2.2}%` }} /></div>
              <span className="text-right font-montserrat text-sm font-black text-brand-green">{fmt(value)}%</span>
              <span className={`text-right text-xs font-bold ${delta >= 0 ? 'text-brand-green' : 'text-red-600'}`}>{signed(delta)} pp</span>
            </div>
          ))}
        </div>
        <div>
          <div className="rounded-lg border border-brand-dark/10 bg-white p-5">
            <h3 className="font-montserrat text-sm font-black uppercase text-brand-dark">Maiores altas</h3>
            {TITLE_RACE.slice(1, 5).sort((a, b) => b[2] - a[2]).map(([team, value, delta]) => (
              <p key={team} className="mt-3 flex items-center justify-between gap-3 text-sm">
                <TeamLabel team={team} />
                <strong className="whitespace-nowrap text-brand-green">{fmt(value)}% · {signed(delta)} pp</strong>
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="bg-[#101D15] py-16 text-white">
      <div className="mx-auto max-w-[1080px] px-4">
        <SectionTitle light eyebrow="A corrida em seis atos" title="Como chegaram até aqui as oito seleções vivas">
          No início da Copa, essas oito seleções concentravam 56,4% da probabilidade de título. Depois das oitavas,
          passaram a concentrar 100%: as eliminações de Brasil, Portugal, México, Colômbia e Estados Unidos redistribuíram
          a corrida sem mudar a líder.
        </SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TITLE_EVOLUTION.map((item, index) => (
            <AliveEvolutionCard key={item.team} item={item} index={index} />
          ))}
        </div>
        <p className="mt-6 text-center text-[10px] font-bold uppercase text-white/30">
          Probabilidade de título · 11/06 início da Copa · 18/06 fim da primeira rodada · 24/06 fim da segunda rodada · 28/06 início do mata-mata · 04/07 início das oitavas · 08/07 início das quartas
        </p>
      </div>
    </section>

    <section className="border-y border-brand-dark/10 bg-white">
      <div className="mx-auto max-w-[1080px] px-4 py-16">
        <SectionTitle eyebrow="Resultados das oitavas" title="Noruega foi a maior quebra; Suíça e Bélgica também furaram a fila">
          A maior surpresa estatística foi justamente a queda brasileira: a Noruega tinha 38,5% de chance de avançar.
          A Suíça passou pela Colômbia com 39,7%, e a Bélgica derrubou os Estados Unidos com 43,6%.
        </SectionTitle>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {ROUND_OF_16_RESULTS.map(([match, , , note]) => (
            <div key={match} className="rounded-lg border border-brand-dark/10 bg-brand-light p-5">
              <Swords className="mb-4 h-5 w-5 text-brand-green" />
              <p className="font-montserrat text-sm font-black text-brand-dark"><MatchLabel match={match} /></p>
              <p className="mt-2 text-xs font-bold uppercase text-brand-dark/35">{note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-[1080px] px-4 py-16">
      <SectionTitle eyebrow="Quartas de final" title="França, Espanha e Argentina chegam como favoritas">
        Inglaterra é favorita contra a Noruega, mas esse é o confronto mais aberto das quartas. Nos outros três jogos,
        França, Espanha e Argentina têm mais de 70% de chance de avançar quando o empate e os pênaltis entram na conta.
      </SectionTitle>
      <div className="grid gap-4 md:grid-cols-2">
        {QUARTERFINALS.map((game, index) => (
          <QuarterfinalCard key={game.match} game={game} index={index} />
        ))}
      </div>
    </section>

    <section className="mx-auto grid max-w-[1080px] gap-8 px-4 py-16 lg:grid-cols-2">
      <div>
        <SectionTitle eyebrow="Finais" title="Argentina x França vira a final mais provável">
          O cruzamento mais comum nas simulações reúne a líder geral e a única sul-americana sobrevivente.
          Inglaterra x França vem logo atrás, sinal de como o lado norueguês-inglês da chave pesa no desenho da final.
        </SectionTitle>
        <div className="rounded-lg border border-brand-dark/10 bg-white p-5">
          {FINALS.map(([match, prob]) => (
            <p key={match} className="flex justify-between gap-4 border-b border-brand-dark/8 py-3 text-sm last:border-0">
              <MatchLabel match={match} /><strong>{fmt(prob)}%</strong>
            </p>
          ))}
        </div>
      </div>
      <div>
        <SectionTitle eyebrow="Confederações" title="A Europa domina o fim da Copa">
          Seis das oito seleções das quartas são europeias. A UEFA concentra 78,6% da chance de título;
          Argentina mantém a CONMEBOL viva, e Marrocos carrega sozinho a probabilidade africana. CONCACAF,
          AFC e OFC já não têm representantes.
        </SectionTitle>
        <div className="rounded-lg border border-brand-dark/10 bg-white p-5">
          {CONFEDERATIONS.map(([name, note, prob]) => (
            <div key={name} className="grid grid-cols-[90px_1fr_70px] items-center gap-3 py-3">
              <span className="font-montserrat text-sm font-black">{name}</span>
              <div>
                <div className="h-2 rounded-full bg-brand-dark/8"><div className="h-full rounded-full bg-brand-blue" style={{ width: `${prob}%` }} /></div>
                <p className="mt-1 text-[10px] font-bold uppercase text-brand-dark/35">{note}</p>
              </div>
              <span className="text-right font-montserrat text-sm font-black">{fmt(prob)}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-brand-green py-14 text-white">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-montserrat text-xs font-black uppercase text-brand-neon">Dados completos</p>
          <h2 className="mt-2 font-montserrat text-3xl font-black uppercase leading-none">Veja a tabela atualizada da Copa</h2>
        </div>
        <a href="/copa-2026" className="inline-flex items-center justify-center gap-3 rounded-lg bg-white px-7 py-4 font-montserrat text-sm font-bold uppercase text-brand-green transition hover:bg-brand-neon hover:text-brand-dark">
          Abrir probabilidades <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>

    <section className="bg-brand-light">
      <div className="mx-auto max-w-[820px] px-4 py-10 text-center">
        <div className="mb-4 flex items-center justify-center gap-2 text-brand-dark/35">
          <BarChart3 className="h-4 w-4" />
          <span className="font-montserrat text-[10px] font-black uppercase">Nota metodológica</span>
        </div>
        <p className="text-xs leading-relaxed text-brand-dark/45">
          Atualização de 08/07/2026 com 1.000.000 de simulações, vetor de força calibrado à média de Kalshi,
          Polymarket e Oddschecker, média de gols 3,0 e correção Dixon-Coles rho -0,13. Os 96 jogos já encerrados
          foram incorporados como resultados definitivos. Percentuais arredondados podem gerar pequenas diferenças de soma.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-brand-dark/35">
          <Trophy className="h-4 w-4" />
          <Globe2 className="h-4 w-4" />
        </div>
      </div>
    </section>
  </div>
);

export default QuarterfinalsPage;
