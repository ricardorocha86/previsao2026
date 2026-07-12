import React from 'react';
import { ArrowRight, BarChart3, CalendarDays, CheckCircle2, Globe2, MapPin, Newspaper, Swords, Trophy } from 'lucide-react';
import PageHeader from './PageHeader';
import ReportEditionSelector from './ReportEditionSelector';

const fmt = (value: number) => value.toFixed(1).replace('.', ',');
const signed = (value: number) => `${value > 0 ? '+' : value < 0 ? '-' : ''}${fmt(Math.abs(value))}`;

const ENG_FLAG = '🏴\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}';
const FLAG: Record<string, string> = {
  França: '🇫🇷',
  Espanha: '🇪🇸',
  Inglaterra: ENG_FLAG,
  Argentina: '🇦🇷',
  Marrocos: '🇲🇦',
  Bélgica: '🇧🇪',
  Noruega: '🇳🇴',
  Suíça: '🇨🇭',
};

const LOCAL_FLAG_SRC: Record<string, string> = {
  França: '/flags/fr.webp',
  Espanha: '/flags/es.webp',
  Inglaterra: '/flags/gb-eng.webp',
  Argentina: '/flags/ar.webp',
  Marrocos: '/flags/ma.webp',
  Bélgica: '/flags/be.webp',
  Noruega: '/flags/no.webp',
  Suíça: '/flags/ch.webp',
};

const TeamLabel = ({ team, className = '' }: { team: string; className?: string }) => (
  <span className={`inline-flex min-w-0 items-center gap-2 ${className}`}>
    <span className="text-lg leading-none" aria-hidden="true">{FLAG[team] ?? '⚽'}</span>
    <span className="truncate">{team}</span>
  </span>
);

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
  const [left, right] = match.split(' x ');
  return (
    <span className="inline-flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
      <TeamLabel team={left} />
      <span>x</span>
      <TeamLabel team={right} />
    </span>
  );
};

// Simulação oficial de 12/07 vs edição 06 (08/07): probabilidade de título e variação.
const TITLE_RACE = [
  ['França', 38.3, 4.8],
  ['Inglaterra', 21.2, 5.9],
  ['Espanha', 20.8, 1.8],
  ['Argentina', 19.8, 1.4],
] as const;

// Placar real das quartas + avanço estimado publicado na edição 06.
const QUARTERFINAL_RESULTS = [
  {
    home: 'França', away: 'Marrocos', scoreA: 2, scoreB: 0, winner: 'França', adv: 77.5,
    note: 'A maior favorita das quartas avançou sem sofrer gols.',
  },
  {
    home: 'Espanha', away: 'Bélgica', scoreA: 2, scoreB: 1, winner: 'Espanha', adv: 72.1,
    note: 'Encerrou a campanha belga que havia despachado os Estados Unidos.',
  },
  {
    home: 'Noruega', away: 'Inglaterra', scoreA: 1, scoreB: 2, winner: 'Inglaterra', adv: 61.2,
    note: 'A Inglaterra eliminou o carrasco do Brasil no jogo mais aberto da fase.',
  },
  {
    home: 'Argentina', away: 'Suíça', scoreA: 3, scoreB: 1, winner: 'Argentina', adv: 72.3,
    note: 'A única sul-americana viva confirmou o favoritismo com autoridade.',
  },
] as const;

// Jogos 101 e 102: probabilidades em 90 minutos do motor oficial do mata-mata;
// avanço = coluna "Final" da simulação oficial de 12/07.
const SEMIFINALS = [
  {
    match: 'França x Espanha',
    date: 'Terça, 14/07',
    venue: 'Dallas, nos EUA · 16h de Brasília',
    winA: 46.0, draw: 26.6, winB: 27.4, advA: 60.6, advB: 39.4,
  },
  {
    match: 'Inglaterra x Argentina',
    date: 'Quarta, 15/07',
    venue: 'Atlanta, nos EUA · 16h de Brasília',
    winA: 37.4, draw: 27.2, winB: 35.4, advA: 51.1, advB: 48.9,
  },
] as const;

const FINALS = [
  ['Inglaterra x França', 31.0],
  ['Argentina x França', 29.7],
  ['Inglaterra x Espanha', 20.1],
  ['Argentina x Espanha', 19.2],
] as const;

// Aba "Fase de Eliminacao": como termina a campanha de cada semifinalista.
const CAMPAIGN_ENDINGS = [
  ['França', 38.3, 22.4, 39.4],
  ['Inglaterra', 21.2, 29.9, 48.9],
  ['Espanha', 20.8, 18.6, 60.6],
  ['Argentina', 19.8, 29.2, 51.1],
] as const;

const CONFEDERATIONS = [
  ['UEFA', 'França, Espanha e Inglaterra', 80.2],
  ['CONMEBOL', 'Argentina, a última não europeia', 19.8],
] as const;

const EVOLUTION_LABELS = ['11/06', '18/06', '24/06', '28/06', '04/07', '08/07', '12/07'] as const;

const TITLE_EVOLUTION = [
  { team: 'França', values: [14.8, 17.8, 18.3, 22.2, 32.8, 33.5, 38.3], color: '#68E70F' },
  { team: 'Inglaterra', values: [10.3, 12.5, 10.6, 10.4, 7.4, 15.3, 21.2], color: '#E27C2D' },
  { team: 'Espanha', values: [15.9, 13.2, 13.5, 10.7, 12.4, 19.0, 20.8], color: '#FFCF26' },
  { team: 'Argentina', values: [8.2, 10.8, 13.3, 19.9, 16.5, 18.4, 19.8], color: '#4FC3F7' },
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
  const chartMax = 42;
  const x = [12, 43, 74, 105, 136, 167, 198];
  const y = item.values.map((value) => 88 - (value / chartMax) * 70);
  const line = x.map((xValue, pointIndex) => `${xValue},${y[pointIndex]}`).join(' ');
  const area = `M ${x[0]} 92 L ${x[0]} ${y[0]} ${x.slice(1).map((xValue, pointIndex) => `L ${xValue} ${y[pointIndex + 1]}`).join(' ')} L ${x[x.length - 1]} 92 Z`;
  const deltaFromQuarterfinals = item.values[item.values.length - 1] - item.values[item.values.length - 2];
  const gradientId = `semifinals-title-evolution-${index}`;

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
          {signed(deltaFromQuarterfinals)} pp
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
            <line key={gridY} x1="10" y1={gridY} x2="204" y2={gridY} stroke="#FFFFFF" strokeOpacity="0.09" strokeDasharray="3 4" />
          ))}
          <path d={area} fill={`url(#${gradientId})`} />
          <polyline points={line} fill="none" stroke={item.color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {x.map((xValue, pointIndex) => (
            <g key={xValue}>
              <circle cx={xValue} cy={y[pointIndex]} r="4.4" fill="#071F14" stroke={item.color} strokeWidth="2.5" />
              <text x={xValue} y={Math.max(y[pointIndex] - 9, 12)} textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="900">
                {fmt(item.values[pointIndex])}%
              </text>
            </g>
          ))}
        </svg>
        <div className="grid grid-cols-7 border-t border-white/10 pt-2 font-montserrat text-[7px] font-black uppercase text-white/35">
          {EVOLUTION_LABELS.map((label, labelIndex) => (
            <span key={label} className={labelIndex === 0 ? '' : labelIndex === EVOLUTION_LABELS.length - 1 ? 'text-right' : 'text-center'}>{label}</span>
          ))}
        </div>
      </div>
    </article>
  );
};

const ResultCard: React.FC<{ result: (typeof QUARTERFINAL_RESULTS)[number] }> = ({ result }) => (
  <article className="rounded-lg border border-brand-dark/10 bg-brand-light p-5">
    <div className="flex items-center justify-between gap-3">
      <Swords className="h-5 w-5 text-brand-green" />
      <span className="rounded-full bg-brand-green/10 px-2.5 py-1 font-montserrat text-[8px] font-black uppercase tracking-wider text-brand-green">
        favorito confirmado
      </span>
    </div>
    <div className="mt-4 space-y-2">
      {[
        { team: result.home, score: result.scoreA },
        { team: result.away, score: result.scoreB },
      ].map(({ team, score }) => (
        <div key={team} className={`flex items-center justify-between gap-2 ${team === result.winner ? 'text-brand-dark' : 'text-brand-dark/40'}`}>
          <span className="inline-flex min-w-0 items-center gap-2 font-montserrat text-sm font-black uppercase">
            <FlagImage team={team} className="h-4 w-6" />
            <span className="truncate">{team}</span>
          </span>
          <span className="font-montserrat text-lg font-black">{score}</span>
        </div>
      ))}
    </div>
    <div className="mt-4 border-t border-brand-dark/10 pt-3">
      <p className="font-montserrat text-xs font-black text-brand-green">{fmt(result.adv)}% de avanço estimado antes do jogo</p>
      <p className="mt-2 text-xs leading-relaxed text-brand-dark/50">{result.note}</p>
    </div>
  </article>
);

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

const SemifinalCard: React.FC<{
  game: (typeof SEMIFINALS)[number];
  index: number;
}> = ({ game, index }) => {
  const { match, date, venue, winA, draw, winB, advA, advB } = game;
  const [a, b] = match.split(' x ');
  const aIsFavorite = advA >= advB;

  return (
    <article className="overflow-hidden rounded-lg border border-[#D6D6D6] bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 bg-brand-dark px-5 py-3 text-white">
        <p className="font-montserrat text-[10px] font-black uppercase tracking-wider text-brand-neon">
          Jogo {101 + index} · Semifinal
        </p>
        <p className="rounded-full border border-white/10 px-3 py-1 font-montserrat text-[8px] font-black uppercase tracking-wider text-white/55">
          vaga na final
        </p>
      </div>

      <div className="p-5">
        <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-bold uppercase tracking-wider text-brand-dark/40">
          <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{date}</span>
          <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{venue}</span>
        </div>

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

const SemifinalsPage: React.FC = () => (
  <div className="bg-brand-light font-opensans">
    <PageHeader
      icon={Newspaper}
      eyebrow="Reportagem 07 · Início das semifinais · 500.000 simulações"
      title="Quatro na corrida"
      accent="pelo título."
      description="As quartas confirmaram os quatro favoritos: França, Espanha, Inglaterra e Argentina seguem vivas. A França lidera com 38,3% de chance de título, e a Inglaterra foi quem mais subiu na nova simulação."
    />
    <ReportEditionSelector current="inicio-semifinais" />

    <section className="border-b border-brand-dark/10 bg-white">
      <div className="mx-auto grid max-w-[1080px] gap-10 px-4 py-14 lg:grid-cols-[1fr_360px]">
        <div>
          <p className="font-montserrat text-xs font-black uppercase text-brand-green">O fim das zebras</p>
          <h1 className="mt-2 font-montserrat text-4xl font-black uppercase leading-none text-brand-dark md:text-5xl">
            Pela primeira vez no mata-mata, todos os favoritos venceram.
          </h1>
          <p className="mt-5 text-lg font-light leading-relaxed text-brand-dark/75">
            Depois de 16-avos e oitavas cheios de surpresas — incluindo a queda do Brasil diante da Noruega —,
            as quartas de final devolveram a Copa ao roteiro esperado: os quatro favoritos do modelo avançaram.
            Marrocos, Bélgica, Noruega e Suíça, que juntas carregavam 13,8% de chance de título, foram eliminadas,
            e essa probabilidade se redistribuiu entre as quatro sobreviventes. Com 100 dos 104 jogos encerrados,
            restam as duas semifinais, a disputa de terceiro lugar e a final.
          </p>
        </div>
        <div className="grid gap-3">
          <div className="rounded-lg bg-brand-dark p-5 text-white">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-7 w-7 text-brand-neon" />
              <p className="font-montserrat text-3xl font-black uppercase text-brand-neon">4 de 4</p>
            </div>
            <p className="mt-2 text-xs font-bold uppercase leading-snug text-white/50">favoritos das quartas confirmados</p>
          </div>
          <StatCard value="100" label="jogos encerrados de 104" />
          <StatCard value="49,2%" label="chance de título que as quatro somavam no início da Copa — hoje somam 100%" />
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-[1080px] px-4 py-16">
      <SectionTitle eyebrow="Resultados das quartas" title="Os quatro placares que definiram as semifinais">
        Nenhum dos quatro confrontos fugiu da probabilidade publicada na edição 06. O jogo mais aberto era
        Noruega x Inglaterra, em que os ingleses tinham 61,2% de chance de avançar — e venceram por 2 a 1,
        eliminando justamente a seleção que havia tirado o Brasil da Copa.
      </SectionTitle>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {QUARTERFINAL_RESULTS.map((result) => (
          <ResultCard key={`${result.home}-${result.away}`} result={result} />
        ))}
      </div>
    </section>

    <section className="border-y border-brand-dark/10 bg-white">
      <div className="mx-auto max-w-[1080px] px-4 py-16">
        <SectionTitle eyebrow="Corrida do título" title="França na frente; Inglaterra assume a vice-liderança">
          A França chega a 38,3% — o valor mais alto registrado por uma seleção em toda a série de simulações.
          Atrás dela, a ordem mudou: a Inglaterra saltou de 15,3% para 21,2% e ultrapassou Espanha e Argentina.
          As três perseguidoras estão separadas por apenas 1,4 ponto percentual. A variação compara o retrato
          de 12/07 com a edição de 08/07, publicada no início das quartas.
        </SectionTitle>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-lg border border-brand-dark/10 bg-brand-light p-5">
            {TITLE_RACE.map(([team, value, delta]) => (
              <div key={team} className="grid grid-cols-[130px_1fr_72px_64px] items-center gap-3 border-b border-brand-dark/8 py-3 last:border-0 sm:grid-cols-[150px_1fr_72px_64px]">
                <TeamLabel team={team} className="font-montserrat text-sm font-black text-brand-dark" />
                <div className="h-2 rounded-full bg-brand-dark/8"><div className="h-full rounded-full bg-brand-green" style={{ width: `${value * 2.2}%` }} /></div>
                <span className="text-right font-montserrat text-sm font-black text-brand-green">{fmt(value)}%</span>
                <span className="text-right text-xs font-bold text-brand-green">{signed(delta)} pp</span>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-brand-dark/10 bg-brand-light p-5">
            <h3 className="font-montserrat text-sm font-black uppercase text-brand-dark">A disparada inglesa</h3>
            <p className="mt-3 text-sm leading-relaxed text-brand-dark/70">
              No início das oitavas, a Inglaterra valia 7,4% de título — era apenas a quinta força da Copa.
              Oito dias e duas vitórias depois, vale 21,2%: quase o triplo. A virada sobre o México e o 2 a 1
              na Noruega transformaram o lado direito da chave no caminho inglês para a final.
            </p>
            <div className="mt-4 flex items-center gap-4 rounded-lg bg-white p-4">
              <FlagImage team="Inglaterra" className="h-8 w-12" />
              <div>
                <p className="font-montserrat text-2xl font-black text-brand-green">7,4% → 21,2%</p>
                <p className="text-[10px] font-bold uppercase text-brand-dark/40">chance de título · 04/07 → 12/07</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-[#101D15] py-16 text-white">
      <div className="mx-auto max-w-[1080px] px-4">
        <SectionTitle light eyebrow="A corrida em sete atos" title="Como as quatro semifinalistas chegaram até aqui">
          A França cresceu em todas as atualizações desde o fim da fase de grupos. A Espanha se recuperou da
          queda que sofreu na segunda rodada, a Argentina construiu sua posição no fim da fase de grupos, e a
          Inglaterra fez o caminho mais irregular: chegou a valer 7,4% no início das oitavas antes de dobrar
          de tamanho nas duas fases seguintes.
        </SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TITLE_EVOLUTION.map((item, index) => (
            <AliveEvolutionCard key={item.team} item={item} index={index} />
          ))}
        </div>
        <p className="mt-6 text-center text-[10px] font-bold uppercase text-white/30">
          Probabilidade de título · 11/06 início da Copa · 18/06 fim da primeira rodada · 24/06 fim da segunda rodada · 28/06 início do mata-mata · 04/07 início das oitavas · 08/07 início das quartas · 12/07 início das semifinais
        </p>
      </div>
    </section>

    <section className="mx-auto max-w-[1080px] px-4 py-16">
      <SectionTitle eyebrow="Semifinais" title="Um duelo com favorita clara; outro, quase uma moeda ao ar">
        Na primeira semifinal, a França tem 60,6% de chance de alcançar a final, com o empate e a prorrogação
        entrando na conta. Na segunda, Inglaterra e Argentina protagonizam o confronto mais equilibrado do
        mata-mata até aqui: 51,1% contra 48,9% — na prática, uma moeda ao ar.
      </SectionTitle>
      <div className="grid gap-4 md:grid-cols-2">
        {SEMIFINALS.map((game, index) => (
          <SemifinalCard key={game.match} game={game} index={index} />
        ))}
      </div>
    </section>

    <section className="border-y border-brand-dark/10 bg-white">
      <div className="mx-auto grid max-w-[1080px] gap-8 px-4 py-16 lg:grid-cols-2">
        <div>
          <SectionTitle eyebrow="Finais possíveis" title="Inglaterra x França é a decisão mais provável">
            Com quatro seleções, restam quatro finais possíveis — e a França está em 60,6% delas.
            O cruzamento mais comum nas simulações reúne as duas seleções que mais cresceram nesta edição.
          </SectionTitle>
          <div className="rounded-lg border border-brand-dark/10 bg-brand-light p-5">
            {FINALS.map(([match, prob]) => (
              <p key={match} className="flex justify-between gap-4 border-b border-brand-dark/8 py-3 text-sm last:border-0">
                <MatchLabel match={match} /><strong>{fmt(prob)}%</strong>
              </p>
            ))}
          </div>
        </div>
        <div>
          <SectionTitle eyebrow="Fim de campanha" title="Como cada seleção termina a Copa">
            A Inglaterra é a vice-campeã mais provável (29,9%): chega à final com frequência, mas costuma
            encontrar a França do outro lado. Já a Espanha tem o desenho inverso — cai na semifinal em 60,6%
            das simulações, mas quando passa pela França, briga pelo título de igual para igual.
          </SectionTitle>
          <div className="overflow-hidden rounded-lg border border-brand-dark/10 bg-brand-light">
            <div className="grid grid-cols-[minmax(0,1.4fr)_1fr_1fr_1fr] gap-2 border-b border-brand-dark/10 bg-brand-dark px-4 py-3 font-montserrat text-[9px] font-black uppercase tracking-wider text-white/60">
              <span>Seleção</span>
              <span className="text-right text-brand-neon">Campeã</span>
              <span className="text-right">Vice</span>
              <span className="text-right">Cai na semi</span>
            </div>
            {CAMPAIGN_ENDINGS.map(([team, champion, runnerUp, semifinal]) => (
              <div key={team} className="grid grid-cols-[minmax(0,1.4fr)_1fr_1fr_1fr] items-center gap-2 border-b border-brand-dark/8 px-4 py-3 last:border-0">
                <TeamLabel team={team} className="font-montserrat text-sm font-black text-brand-dark" />
                <span className="text-right font-montserrat text-sm font-black text-brand-green">{fmt(champion)}%</span>
                <span className="text-right text-sm font-bold text-brand-dark/60">{fmt(runnerUp)}%</span>
                <span className="text-right text-sm font-bold text-brand-dark/60">{fmt(semifinal)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-[1080px] px-4 py-16">
      <SectionTitle eyebrow="Confederações" title="A Europa já garantiu lugar na decisão">
        França x Espanha assegura pelo menos uma seleção europeia na final. A UEFA, com três das quatro
        semifinalistas, concentra 80,2% da chance de título; a Argentina, atual campeã do mundo, carrega
        sozinha os 19,8% da CONMEBOL — e é a única capaz de manter a taça fora da Europa.
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
          Atualização de 12/07/2026 com 500.000 simulações, vetor de força calibrado à média de Kalshi,
          Polymarket e Oddschecker, média de gols 3,0 e correção Dixon-Coles rho -0,13. Os 100 jogos já
          encerrados foram incorporados como resultados definitivos. As probabilidades em 90 minutos usam o
          motor oficial do mata-mata; percentuais arredondados podem gerar pequenas diferenças de soma.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-brand-dark/35">
          <Trophy className="h-4 w-4" />
          <Globe2 className="h-4 w-4" />
        </div>
      </div>
    </section>
  </div>
);

export default SemifinalsPage;
