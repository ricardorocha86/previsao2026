import React from 'react';
import { ArrowRight, BarChart3, CalendarDays, CheckCircle2, Trophy } from 'lucide-react';
import ReportEditionSelector from './ReportEditionSelector';

const TEAMS = {
  França: '🇫🇷',
  Espanha: '🇪🇸',
  Inglaterra: '🏴',
  Argentina: '🇦🇷',
} as const;

const TITLE_RACE = [
  ['França', 38.3],
  ['Inglaterra', 21.2],
  ['Espanha', 20.8],
  ['Argentina', 19.8],
] as const;

const SEMIFINALS = [
  { home: 'França', away: 'Espanha', winA: 46.0, draw: 26.6, winB: 27.4, advA: 60.6, advB: 39.4, date: '14/07' },
  { home: 'Inglaterra', away: 'Argentina', winA: 37.4, draw: 27.2, winB: 35.4, advA: 51.2, advB: 48.8, date: '15/07' },
] as const;

const pct = (value: number) => `${value.toFixed(1).replace('.', ',')}%`;
const flag = (team: keyof typeof TEAMS) => `${TEAMS[team]} ${team}`;

const Stat = ({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) => (
  <div className="rounded-xl border border-brand-dark/10 bg-white p-5">
    <p className={`font-montserrat text-3xl font-black ${accent ? 'text-brand-green' : 'text-brand-dark'}`}>{value}</p>
    <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-brand-dark/45">{label}</p>
  </div>
);

const SemifinalsPage: React.FC = () => (
  <div className="bg-brand-light text-brand-dark">
    <section className="bg-brand-dark px-4 py-16 text-white md:py-24">
      <div className="mx-auto max-w-[1080px]">
        <p className="font-montserrat text-xs font-black uppercase tracking-[0.24em] text-brand-green">Edição 07 · 12/07/2026</p>
        <h1 className="mt-5 max-w-4xl font-montserrat text-4xl font-black uppercase leading-[0.95] md:text-7xl">
          Quatro seleções, dois jogos, uma nova corrida pelo título
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/65">
          As quartas eliminaram Marrocos, Bélgica, Noruega e Suíça. França, Inglaterra, Espanha e Argentina concentram agora 100% dos títulos possíveis.
        </p>
      </div>
    </section>

    <ReportEditionSelector current="inicio-semifinais" />

    <main className="mx-auto max-w-[1080px] px-4 py-14">
      <section>
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Seleções restantes" value="4" accent />
          <Stat label="Jogos encerrados" value="100" />
          <Stat label="Título concentrado" value="100%" />
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-montserrat text-xs font-black uppercase tracking-[0.2em] text-brand-green">Corrida pelo título</p>
            <h2 className="mt-2 font-montserrat text-3xl font-black uppercase md:text-4xl">França ainda lidera</h2>
          </div>
          <Trophy className="hidden h-10 w-10 text-brand-green sm:block" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TITLE_RACE.map(([team, probability], index) => (
            <article key={team} className="rounded-xl border border-brand-dark/10 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="font-montserrat text-xs font-black uppercase">{flag(team as keyof typeof TEAMS)}</span>
                <span className="font-montserrat text-xs font-black text-brand-dark/30">#{index + 1}</span>
              </div>
              <p className="mt-6 font-montserrat text-4xl font-black text-brand-green">{pct(probability)}</p>
              <p className="mt-2 text-xs text-brand-dark/50">chance de ser campeã</p>
            </article>
          ))}
        </div>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-brand-dark/70">
          A França permanece no topo, mas sua vantagem encolheu: o novo vetor estima 38,3% de título. Inglaterra, Espanha e Argentina aparecem separadas por menos de dois pontos percentuais, deixando a segunda semifinal praticamente equilibrada.
        </p>
      </section>

      <section className="mt-16">
        <div className="mb-8">
          <p className="font-montserrat text-xs font-black uppercase tracking-[0.2em] text-brand-green">O quadro das semifinais</p>
          <h2 className="mt-2 font-montserrat text-3xl font-black uppercase md:text-4xl">Dois confrontos definidos</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {SEMIFINALS.map((match) => (
            <article key={`${match.home}-${match.away}`} className="rounded-2xl border border-brand-dark/10 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-brand-dark/35">
                <span><CalendarDays className="mr-1 inline h-3.5 w-3.5" />{match.date}</span>
                <span>Semifinal</span>
              </div>
              <h3 className="mt-5 font-montserrat text-2xl font-black uppercase">{flag(match.home)} <span className="text-brand-dark/25">x</span> {flag(match.away)}</h3>
              <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg bg-brand-light p-3"><p className="font-black">{pct(match.winA)}</p><p className="mt-1 text-[9px] uppercase text-brand-dark/40">vitória {match.home}</p></div>
                <div className="rounded-lg bg-brand-light p-3"><p className="font-black">{pct(match.draw)}</p><p className="mt-1 text-[9px] uppercase text-brand-dark/40">empate</p></div>
                <div className="rounded-lg bg-brand-light p-3"><p className="font-black">{pct(match.winB)}</p><p className="mt-1 text-[9px] uppercase text-brand-dark/40">vitória {match.away}</p></div>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-brand-dark/10 pt-4">
                <span className="text-xs font-bold text-brand-dark/50">Avanço estimado</span>
                <span className="font-montserrat text-sm font-black text-brand-green">{match.advA.toFixed(1).replace('.', ',')}% <span className="text-brand-dark/30">×</span> {match.advB.toFixed(1).replace('.', ',')}%</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl bg-brand-dark p-6 text-white md:col-span-2">
          <BarChart3 className="h-7 w-7 text-brand-green" />
          <h2 className="mt-5 font-montserrat text-2xl font-black uppercase">O que mudou nas quartas</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/65">A França confirmou o favoritismo contra Marrocos; Espanha superou a Bélgica; Inglaterra virou sobre a Noruega na prorrogação; e Argentina venceu a Suíça por 3 a 1. O resultado é um quadrangular final sem zebras restantes.</p>
        </div>
        <div className="rounded-2xl border border-brand-dark/10 bg-white p-6">
          <CheckCircle2 className="h-7 w-7 text-brand-green" />
          <h2 className="mt-5 font-montserrat text-xl font-black uppercase">Método</h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-dark/60">O retrato combina mercados, força calibrada e 500 mil simulações oficiais com os 100 resultados já encerrados travados.</p>
        </div>
      </section>

      <div className="mt-16 flex items-center gap-3 border-t border-brand-dark/10 pt-8 text-xs font-bold uppercase tracking-wider text-brand-dark/45">
        <ArrowRight className="h-4 w-4 text-brand-green" /> Próxima atualização: após as semifinais
      </div>
    </main>
  </div>
);

export default SemifinalsPage;
