import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Globe2,
  MapPin,
  Newspaper,
  Swords,
  Trophy,
} from 'lucide-react';
import PageHeader from './PageHeader';
import ReportEditionSelector from './ReportEditionSelector';

const fmt = (value: number) => value.toFixed(1).replace('.', ',');
const signed = (value: number) => `${value > 0 ? '+' : value < 0 ? '−' : ''}${fmt(Math.abs(value))}`;

const LOCAL_FLAG_SRC: Record<string, string> = {
  Espanha: '/flags/es.webp',
  Argentina: '/flags/ar.webp',
  França: '/flags/fr.webp',
  Inglaterra: '/flags/gb-eng.webp',
};

const FlagImage = ({ team, className = '' }: { team: string; className?: string }) => (
  <img
    src={LOCAL_FLAG_SRC[team]}
    alt=""
    className={`flex-none rounded object-cover shadow-sm ring-1 ring-brand-dark/10 ${className}`}
    decoding="async"
  />
);

const TeamLabel = ({ team, className = '' }: { team: string; className?: string }) => (
  <span className={`inline-flex min-w-0 items-center gap-2 ${className}`}>
    <FlagImage team={team} className="h-4 w-6" />
    <span className="truncate">{team}</span>
  </span>
);

const SEMIFINAL_RESULTS = [
  {
    home: 'França',
    away: 'Espanha',
    score: '0 × 2',
    winnerChance: 39.4,
    note: 'A Espanha eliminou a seleção que liderava a corrida pelo título desde o início do mata-mata.',
  },
  {
    home: 'Inglaterra',
    away: 'Argentina',
    score: '1 × 2',
    winnerChance: 48.9,
    note: 'A Argentina venceu o confronto mais equilibrado das semifinais e voltou à decisão.',
  },
] as const;

const EVOLUTION_LABELS = ['11/06', '18/06', '24/06', '28/06', '04/07', '08/07', '12/07', '16/07'] as const;

const TITLE_EVOLUTION = [
  { team: 'Espanha', values: [15.9, 13.2, 13.5, 10.7, 12.4, 19.0, 20.8, 58.4], color: '#FFCF26' },
  { team: 'Argentina', values: [8.2, 10.8, 13.3, 19.9, 16.5, 18.4, 19.8, 41.6], color: '#4FC3F7' },
] as const;

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
    <p className={`font-montserrat text-xs font-black uppercase tracking-wider ${light ? 'text-brand-neon' : 'text-brand-green'}`}>
      {eyebrow}
    </p>
    <h2 className={`mt-2 font-montserrat text-3xl font-black uppercase leading-none md:text-4xl ${light ? 'text-white' : 'text-brand-dark'}`}>
      {title}
    </h2>
    {children && <p className={`mt-4 text-base leading-relaxed ${light ? 'text-white/70' : 'text-brand-dark/70'}`}>{children}</p>}
  </div>
);

const EvolutionCard = ({ item, index }: { item: (typeof TITLE_EVOLUTION)[number]; index: number }) => {
  const chartMax = 64;
  const x = [14, 47, 80, 113, 146, 179, 212, 245];
  const y = item.values.map((value) => 92 - (value / chartMax) * 72);
  const line = x.map((xValue, pointIndex) => `${xValue},${y[pointIndex]}`).join(' ');
  const area = `M ${x[0]} 96 L ${x[0]} ${y[0]} ${x.slice(1).map((xValue, pointIndex) => `L ${xValue} ${y[pointIndex + 1]}`).join(' ')} L ${x[x.length - 1]} 96 Z`;
  const delta = item.values[item.values.length - 1] - item.values[item.values.length - 2];
  const gradientId = `finals-title-evolution-${index}`;

  return (
    <article className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-sm md:p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 font-montserrat text-base font-black uppercase text-white">
          <TeamLabel team={item.team} />
        </h3>
        <span
          className="rounded-md px-2.5 py-1 font-montserrat text-[9px] font-black leading-tight"
          style={{ color: item.color, backgroundColor: `${item.color}18` }}
        >
          {signed(delta)} pp desde 12/07
        </span>
      </div>

      <div className="mt-6">
        <svg viewBox="0 0 260 108" className="block w-full overflow-visible" role="img" aria-label={`Evolução da chance de título de ${item.team} nas oito simulações oficiais`}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={item.color} stopOpacity="0.34" />
              <stop offset="1" stopColor={item.color} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {[20, 56, 92].map((gridY) => (
            <line key={gridY} x1="10" y1={gridY} x2="249" y2={gridY} stroke="#FFFFFF" strokeOpacity="0.09" strokeDasharray="3 4" />
          ))}
          <path d={area} fill={`url(#${gradientId})`} />
          <polyline points={line} fill="none" stroke={item.color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {x.map((xValue, pointIndex) => (
            <g key={xValue}>
              <circle cx={xValue} cy={y[pointIndex]} r="4.4" fill="#071F14" stroke={item.color} strokeWidth="2.5" />
              <text x={xValue} y={Math.max(y[pointIndex] - 9, 12)} textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="900">
                {fmt(item.values[pointIndex])}%
              </text>
            </g>
          ))}
        </svg>
        <div className="grid grid-cols-8 border-t border-white/10 pt-2 font-montserrat text-[7px] font-black uppercase text-white/35">
          {EVOLUTION_LABELS.map((label, labelIndex) => (
            <span key={label} className={labelIndex === 0 ? '' : labelIndex === EVOLUTION_LABELS.length - 1 ? 'text-right' : 'text-center'}>{label}</span>
          ))}
        </div>
      </div>
    </article>
  );
};

const FinalsPage = () => (
  <div className="bg-brand-light font-opensans">
    <PageHeader
      icon={Newspaper}
      eyebrow="Reportagem 08 · Início das finais · 1.000.000 de simulações"
      title="A Copa cabe"
      accent="em um jogo."
      description="Depois de 102 partidas, Espanha e Argentina chegam à decisão. A vantagem espanhola existe, mas a projeção mantém a final aberta."
    />
    <ReportEditionSelector current="inicio-finais" />

    <section className="border-b border-brand-dark/10 bg-white">
      <div className="mx-auto grid max-w-[1080px] items-center gap-10 px-4 py-14 lg:grid-cols-[1fr_360px]">
        <div>
          <p className="font-montserrat text-xs font-black uppercase text-brand-green">A última partida</p>
          <h1 className="mt-2 font-montserrat text-4xl font-black uppercase leading-none text-brand-dark md:text-5xl">
            A Espanha chega como favorita. A Argentina entra com força suficiente para manter a decisão em aberto.
          </h1>
          <p className="mt-5 text-lg font-light leading-relaxed text-brand-dark/75">
            Toda a incerteza que antes se espalhava por 48 seleções, 12 grupos e cinco fases eliminatórias agora está concentrada em um único confronto. A diferença entre as finalistas é clara, mas não dominante: o modelo vê vantagem espanhola sem transformar a decisão em resultado antecipado.
          </p>
        </div>
        <div className="overflow-hidden rounded-xl border border-brand-dark/10 bg-brand-light shadow-sm">
          <div className="bg-brand-dark px-5 py-4 text-white">
            <p className="font-montserrat text-[10px] font-black uppercase tracking-wider text-brand-neon">Jogo 104 · Final</p>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
              <div><FlagImage team="Espanha" className="mx-auto h-7 w-11" /><p className="mt-2 font-montserrat text-sm font-black uppercase">Espanha</p></div>
              <Swords className="h-6 w-6 text-brand-dark/25" />
              <div><FlagImage team="Argentina" className="mx-auto h-7 w-11" /><p className="mt-2 font-montserrat text-sm font-black uppercase">Argentina</p></div>
            </div>
            <div className="mt-5 space-y-2 border-t border-brand-dark/10 pt-4 text-xs font-bold text-brand-dark/50">
              <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-brand-green" /> Domingo, 19/07</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-green" /> Nova York/Nova Jersey</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-[#071F14] py-16 text-white">
      <div className="mx-auto max-w-[1080px] px-4">
        <SectionTitle light eyebrow="A projeção da final" title="A Espanha vence em 58,3% dos cenários; a Argentina, em 41,7%">
          Como a taça será decidida neste confronto, a probabilidade de título passa a ser a probabilidade de vencer a final, incluindo prorrogação e pênaltis. Em termos simples: a Espanha vence pouco menos de seis em cada dez decisões simuladas; a Argentina, pouco mais de quatro.
        </SectionTitle>

        <article className="overflow-hidden rounded-xl border border-white/10 bg-white text-brand-dark shadow-lg">
          <div className="grid items-center gap-6 p-6 md:grid-cols-[1fr_60px_1fr] md:p-9">
            <div className="text-center">
              <FlagImage team="Espanha" className="mx-auto h-9 w-14" />
              <p className="mt-3 font-montserrat text-lg font-black uppercase">Espanha</p>
              <p className="mt-2 font-montserrat text-5xl font-black text-brand-green md:text-6xl">58,3%</p>
              <p className="mt-1 text-xs font-bold uppercase text-brand-dark/45">chance de título</p>
            </div>
            <Swords className="mx-auto h-8 w-8 text-brand-dark/25" strokeWidth={3} />
            <div className="text-center">
              <FlagImage team="Argentina" className="mx-auto h-9 w-14" />
              <p className="mt-3 font-montserrat text-lg font-black uppercase">Argentina</p>
              <p className="mt-2 font-montserrat text-5xl font-black text-brand-blue md:text-6xl">41,7%</p>
              <p className="mt-1 text-xs font-bold uppercase text-brand-dark/45">chance de título</p>
            </div>
          </div>
          <div className="border-t border-brand-dark/10 bg-brand-light px-6 py-5">
            <p className="mb-3 font-montserrat text-[10px] font-black uppercase tracking-wider text-brand-dark/40">Desfecho nos 90 minutos</p>
            <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-brand-dark/10 bg-white text-center">
              <div className="p-4"><p className="text-xs text-brand-dark/45">Espanha vence</p><strong className="mt-1 block font-montserrat text-lg">43,8%</strong></div>
              <div className="border-x border-brand-dark/10 p-4"><p className="text-xs text-brand-dark/45">Empate</p><strong className="mt-1 block font-montserrat text-lg">26,8%</strong></div>
              <div className="p-4"><p className="text-xs text-brand-dark/45">Argentina vence</p><strong className="mt-1 block font-montserrat text-lg">29,3%</strong></div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-brand-dark/45">O empate leva a projeção adiante: prorrogação e pênaltis redistribuem esses cenários até que haja uma campeã.</p>
          </div>
        </article>
      </div>
    </section>

    <section className="mx-auto max-w-[1080px] px-4 py-16">
      <SectionTitle eyebrow="Como a decisão foi formada" title="A Espanha derrubou a líder; a Argentina venceu o duelo mais equilibrado">
        A França entrou nas semifinais com a maior chance de título já registrada na série, mas perdeu por 2 a 0. Do outro lado da chave, a Argentina superou a Inglaterra por 2 a 1 em um confronto que já começara praticamente dividido ao meio.
      </SectionTitle>
      <div className="grid gap-4 md:grid-cols-2">
        {SEMIFINAL_RESULTS.map((game) => (
          <article key={`${game.home}-${game.away}`} className="rounded-lg border border-brand-dark/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <p className="font-montserrat text-xs font-black uppercase tracking-wider text-brand-green">Semifinal</p>
              <span className="rounded-full bg-brand-green/10 px-3 py-1 font-montserrat text-[10px] font-black uppercase text-brand-green">{fmt(game.winnerChance)}% de avanço antes do jogo</span>
            </div>
            <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
              <TeamLabel team={game.home} className="justify-center font-montserrat text-sm font-black uppercase" />
              <p className="font-montserrat text-3xl font-black text-brand-dark">{game.score}</p>
              <TeamLabel team={game.away} className="justify-center font-montserrat text-sm font-black uppercase" />
            </div>
            <p className="mt-5 border-t border-brand-dark/8 pt-4 text-sm leading-relaxed text-brand-dark/60">{game.note}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="bg-[#101D15] py-16 text-white">
      <div className="mx-auto max-w-[1080px] px-4">
        <SectionTitle light eyebrow="A corrida em oito atos" title="Como Espanha e Argentina chegaram à final">
          A Espanha abriu a Copa como favorita, caiu para 10,7% no início do mata-mata e se recuperou a partir das quartas. A Argentina partiu em sexto lugar, cresceu durante a fase de grupos e chegou ao mata-mata como segunda força. Na véspera das semifinais, apenas um ponto percentual separava as duas.
        </SectionTitle>
        <div className="grid gap-5 lg:grid-cols-2">
          {TITLE_EVOLUTION.map((item, index) => <EvolutionCard key={item.team} item={item} index={index} />)}
        </div>
        <p className="mt-6 text-center text-[10px] font-bold uppercase leading-relaxed tracking-wider text-white/30">
          Probabilidade de título publicada em cada atualização · 11/06 início da Copa · 18/06 fim da primeira rodada · 24/06 fim da segunda rodada · 28/06 início do mata-mata · 04/07 oitavas · 08/07 quartas · 12/07 semifinais · 16/07 final
        </p>
      </div>
    </section>

    <section className="border-y border-brand-dark/10 bg-white">
      <div className="mx-auto grid max-w-[1080px] items-center gap-8 px-4 py-14 md:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="font-montserrat text-xs font-black uppercase tracking-wider text-brand-green">Disputa pelo terceiro lugar</p>
          <h2 className="mt-2 font-montserrat text-3xl font-black uppercase leading-none text-brand-dark">França é favorita contra a Inglaterra</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-brand-dark/65">As duas seleções que lideravam a projeção antes das semifinais encerram suas campanhas no sábado, em Miami. A França vence o confronto em 62,7% dos cenários; a Inglaterra, em 37,3%.</p>
        </div>
        <div className="rounded-lg bg-brand-light p-6">
          <div className="flex items-center justify-between gap-4">
            <TeamLabel team="França" className="font-montserrat text-sm font-black uppercase" />
            <TeamLabel team="Inglaterra" className="font-montserrat text-sm font-black uppercase" />
          </div>
          <div className="mt-5 flex h-8 overflow-hidden rounded-full bg-brand-dark/10">
            <div className="flex items-center justify-center bg-brand-green text-xs font-black text-white" style={{ width: '62.7%' }}>62,7%</div>
            <div className="flex items-center justify-center bg-brand-blue text-xs font-black text-white" style={{ width: '37.3%' }}>37,3%</div>
          </div>
          <p className="mt-4 text-sm text-brand-dark/55">Sábado, 18/07 · Miami, Estados Unidos</p>
        </div>
      </div>
    </section>

    <section className="bg-brand-green py-14 text-white">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
        <div><p className="font-montserrat text-xs font-black uppercase text-brand-neon">Dados completos</p><h2 className="mt-2 font-montserrat text-3xl font-black uppercase leading-none">Veja a tabela atualizada da Copa</h2></div>
        <a href="/copa-2026" className="inline-flex items-center justify-center gap-3 rounded-lg bg-white px-7 py-4 font-montserrat text-sm font-bold uppercase text-brand-green transition hover:bg-brand-neon hover:text-brand-dark">Abrir probabilidades <ArrowRight className="h-4 w-4" /></a>
      </div>
    </section>

    <section className="bg-brand-light">
      <div className="mx-auto max-w-[840px] px-4 py-10 text-center">
        <div className="mb-4 flex items-center justify-center gap-2 text-brand-dark/35"><BarChart3 className="h-4 w-4" /><span className="font-montserrat text-[10px] font-black uppercase">Nota metodológica</span></div>
        <p className="text-xs leading-relaxed text-brand-dark/45">Atualização de 16/07/2026 com 1.000.000 de simulações e 102 resultados oficiais travados. Como apenas as finalistas mantêm chance de título, a força da Espanha foi preservada e somente a da Argentina foi ajustada para reproduzir a probabilidade-alvo da tabela mestra. O motor usa média de 3,0 gols e correção Dixon-Coles rho −0,13. A pequena diferença entre a probabilidade analítica do confronto e a frequência observada em um milhão de simulações decorre da variação de Monte Carlo.</p>
        <div className="mt-4 flex items-center justify-center gap-2 text-brand-dark/35"><Trophy className="h-4 w-4" /><Globe2 className="h-4 w-4" /></div>
      </div>
    </section>
  </div>
);

export default FinalsPage;
