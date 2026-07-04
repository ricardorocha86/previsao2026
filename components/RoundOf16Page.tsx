import { ArrowRight, BarChart3, Newspaper, ShieldCheck, Swords } from 'lucide-react';
import PageHeader from './PageHeader';
import ReportEditionSelector from './ReportEditionSelector';

const fmt = (value: number) => value.toFixed(1).replace('.', ',');
const signed = (value: number) => `${value > 0 ? '+' : value < 0 ? '−' : ''}${fmt(Math.abs(value))}`;

const TITLE_RACE = [
  ['França', 32.8, 10.6],
  ['Argentina', 16.5, -3.4],
  ['Espanha', 12.4, 1.7],
  ['Inglaterra', 7.4, -3.0],
  ['Brasil', 6.6, 0.9],
  ['Portugal', 6.3, 0.2],
  ['México', 4.2, 2.3],
  ['Colômbia', 3.3, 1.0],
  ['Estados Unidos', 2.9, 0.1],
  ['Marrocos', 2.5, 1.2],
  ['Noruega', 1.9, -0.3],
  ['Bélgica', 1.4, 0.0],
  ['Suíça', 1.0, 0.1],
  ['Egito', 0.3, 0.2],
  ['Canadá', 0.3, 0.1],
  ['Paraguai', 0.2, 0.2],
] as const;

const MOVERS_UP = [
  ['França', 32.8, 10.6],
  ['México', 4.2, 2.3],
  ['Espanha', 12.4, 1.7],
  ['Marrocos', 2.5, 1.2],
  ['Colômbia', 3.3, 1.0],
  ['Brasil', 6.6, 0.9],
] as const;

const MOVERS_DOWN = [
  ['Holanda', 0.0, -4.9],
  ['Alemanha', 0.0, -3.8],
  ['Argentina', 16.5, -3.4],
  ['Inglaterra', 7.4, -3.0],
  ['Japão', 0.0, -1.1],
] as const;

const SIXTEENTH_RESULTS = [
  ['Alemanha 1 x 1 Paraguai', 'Paraguai', 18.5, 'maior zebra da fase'],
  ['Holanda 1 x 1 Marrocos', 'Marrocos', 38.5, 'derrubou uma favorita relevante'],
  ['Austrália 1 x 1 Egito', 'Egito', 50.9, 'duelo praticamente equilibrado'],
  ['Argentina 3 x 2 Cabo Verde', 'Argentina', 89.2, 'maior confirmação'],
  ['França 3 x 0 Suécia', 'França', 86.7, 'confirmou favoritismo'],
  ['Espanha 3 x 0 Áustria', 'Espanha', 81.6, 'vitória limpa'],
] as const;

const BRAZIL_PATH = [
  ['Oitavas', 'Noruega', 61.5],
  ['Quartas', 'Inglaterra ou México', 10.7],
  ['Semifinal', 'Argentina, Colômbia, Suíça ou Egito', 21.3],
  ['Final', 'França é o cruzamento mais provável', 41.3],
] as const;

const ROUND_OF_16 = [
  ['Paraguai', 'França', 11.5, 88.5],
  ['Canadá', 'Marrocos', 31.9, 68.1],
  ['Brasil', 'Noruega', 61.5, 38.5],
  ['México', 'Inglaterra', 44.2, 55.8],
  ['Portugal', 'Espanha', 42.5, 57.5],
  ['Estados Unidos', 'Bélgica', 56.4, 43.6],
  ['Argentina', 'Egito', 81.7, 18.3],
  ['Suíça', 'Colômbia', 39.7, 60.3],
] as const;

const FINALS = [
  ['Argentina x França', 16.4],
  ['Inglaterra x França', 8.1],
  ['Brasil x França', 7.7],
  ['Argentina x Espanha', 7.0],
  ['França x México', 5.3],
  ['Colômbia x França', 4.9],
] as const;

const CONFEDERATIONS = [
  ['UEFA', 63.2],
  ['CONMEBOL', 26.7],
  ['CONCACAF', 7.3],
  ['CAF', 2.8],
  ['AFC', 0.0],
  ['OFC', 0.0],
] as const;

const StatCard = ({ value, label }: { value: string; label: string }) => (
  <div className="rounded-lg border border-brand-dark/10 bg-white p-5">
    <p className="font-montserrat text-3xl font-black text-brand-green">{value}</p>
    <p className="mt-2 text-xs font-bold uppercase leading-snug text-brand-dark/45">{label}</p>
  </div>
);

const SectionTitle = ({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) => (
  <div className="mb-8 max-w-3xl">
    <p className="font-montserrat text-xs font-black uppercase tracking-wider text-brand-green">{eyebrow}</p>
    <h2 className="mt-2 font-montserrat text-3xl font-black uppercase leading-none text-brand-dark md:text-4xl">{title}</h2>
    {children && <p className="mt-4 text-base leading-relaxed text-brand-dark/70">{children}</p>}
  </div>
);

const RoundOf16Page: React.FC = () => (
  <div className="bg-brand-light font-opensans">
    <PageHeader
      icon={Newspaper}
      eyebrow="Reportagem 05 · Início das oitavas · 1.000.000 de simulações"
      title="França dispara"
      accent="e o Brasil respira."
      description="Os 16-avos eliminaram Alemanha e Holanda, empurraram a França para 32,8% de chance de título e deixaram o Brasil com 61,5% de probabilidade de passar pela Noruega."
    />
    <ReportEditionSelector current="inicio-oitavas" />

    <section className="border-b border-brand-dark/10 bg-white">
      <div className="mx-auto grid max-w-[1080px] gap-10 px-4 py-14 lg:grid-cols-[1fr_360px]">
        <div>
          <p className="font-montserrat text-xs font-black uppercase text-brand-green">O que mudou nos 16-avos</p>
          <h1 className="mt-2 font-montserrat text-4xl font-black uppercase leading-none text-brand-dark md:text-5xl">
            A corrida ficou mais concentrada.
          </h1>
          <p className="mt-5 text-lg font-light leading-relaxed text-brand-dark/75">
            A França saiu dos 16-avos com 32,8% de chance de título, alta de 10,6 pontos percentuais
            em relação ao início do mata-mata. O Brasil avançou contra o Japão e subiu para 6,6%.
            Alemanha e Holanda foram zeradas depois das eliminações para Paraguai e Marrocos.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <StatCard value="16" label="seleções seguem vivas" />
          <StatCard value="32,8%" label="chance de título da França" />
          <StatCard value="61,5%" label="chance do Brasil nas oitavas" />
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-[1080px] px-4 py-16">
      <SectionTitle eyebrow="Corrida do título" title="França abre distância; Argentina cai, mas segue em segundo">
        O novo retrato usa os 88 jogos já encerrados como resultados travados. A coluna de variação compara a
        simulação de 04/07 com a simulação de 28/06.
      </SectionTitle>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-brand-dark/10 bg-white p-5">
          {TITLE_RACE.map(([team, value, delta]) => (
            <div key={team} className="grid grid-cols-[120px_1fr_72px_64px] items-center gap-3 border-b border-brand-dark/8 py-2 last:border-0">
              <span className="font-montserrat text-sm font-black text-brand-dark">{team}</span>
              <div className="h-2 rounded-full bg-brand-dark/8"><div className="h-full rounded-full bg-brand-green" style={{ width: `${value * 2.4}%` }} /></div>
              <span className="text-right font-montserrat text-sm font-black text-brand-green">{fmt(value)}%</span>
              <span className={`text-right text-xs font-bold ${delta >= 0 ? 'text-brand-green' : 'text-red-600'}`}>{signed(delta)} pp</span>
            </div>
          ))}
        </div>
        <div className="grid gap-4">
          <div className="rounded-lg border border-brand-dark/10 bg-white p-5">
            <h3 className="font-montserrat text-sm font-black uppercase text-brand-dark">Maiores altas</h3>
            {MOVERS_UP.map(([team, value, delta]) => (
              <p key={team} className="mt-3 flex justify-between text-sm"><span>{team}</span><strong className="text-brand-green">{fmt(value)}% · {signed(delta)} pp</strong></p>
            ))}
          </div>
          <div className="rounded-lg border border-brand-dark/10 bg-white p-5">
            <h3 className="font-montserrat text-sm font-black uppercase text-brand-dark">Maiores quedas</h3>
            {MOVERS_DOWN.map(([team, value, delta]) => (
              <p key={team} className="mt-3 flex justify-between text-sm"><span>{team}</span><strong className="text-red-600">{fmt(value)}% · {signed(delta)} pp</strong></p>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="border-y border-brand-dark/10 bg-white">
      <div className="mx-auto max-w-[1080px] px-4 py-16">
        <SectionTitle eyebrow="Zebras e confirmações" title="Paraguai e Marrocos mudaram a chave">
          A maior quebra veio no Alemanha 1 x 1 Paraguai: antes da bola rolar, o Paraguai tinha 18,5% de chance de avançar.
          A outra eliminação pesada foi Holanda 1 x 1 Marrocos, com 38,5% para os marroquinos. No topo, Argentina, França
          e Espanha confirmaram favoritismo.
        </SectionTitle>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SIXTEENTH_RESULTS.map(([match, winner, chance, note]) => (
            <div key={match} className="rounded-lg border border-brand-dark/10 bg-brand-light p-5">
              <Swords className="mb-4 h-5 w-5 text-brand-green" />
              <p className="font-montserrat text-sm font-black text-brand-dark">{match}</p>
              <p className="mt-2 text-sm text-brand-dark/65">{winner} avançou; probabilidade pré-jogo: <strong>{fmt(chance)}%</strong>.</p>
              <p className="mt-2 text-xs font-bold uppercase text-brand-dark/35">{note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="mx-auto grid max-w-[1080px] gap-10 px-4 py-16 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <SectionTitle eyebrow="Brasil" title="Noruega é o próximo teste">
          O Brasil já passou pelo Japão. Agora a simulação dá 61,5% de avanço contra a Noruega.
          Se chegar às quartas, a chance de título brasileira sobe para 10,7%; se chegar à semifinal, vai a 21,3%.
        </SectionTitle>
        <div className="rounded-lg bg-brand-dark p-6 text-white">
          <p className="font-montserrat text-5xl font-black text-brand-neon">6,6%</p>
          <p className="mt-2 text-sm text-white/60">chance atual de título do Brasil</p>
        </div>
      </div>
      <div className="rounded-lg border border-brand-dark/10 bg-white p-5">
        {BRAZIL_PATH.map(([stage, text, value]) => (
          <div key={stage} className="border-b border-brand-dark/8 py-4 last:border-0">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-montserrat text-xs font-black uppercase text-brand-green">{stage}</p>
                <p className="mt-1 text-sm text-brand-dark/70">{text}</p>
              </div>
              <p className="font-montserrat text-xl font-black text-brand-dark">{fmt(value)}%</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    <section className="border-y border-brand-dark/10 bg-white">
      <div className="mx-auto max-w-[1080px] px-4 py-16">
        <SectionTitle eyebrow="Quadro das oitavas" title="Favoritos de cada confronto" />
        <div className="grid gap-3 md:grid-cols-2">
          {ROUND_OF_16.map(([a, b, advA, advB]) => {
            const fav = advA >= advB ? a : b;
            const favProb = Math.max(advA, advB);
            return (
              <div key={`${a}-${b}`} className="rounded-lg border border-brand-dark/10 bg-brand-light p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-montserrat text-sm font-black text-brand-dark">{a} x {b}</p>
                  <ShieldCheck className="h-5 w-5 text-brand-green" />
                </div>
                <p className="mt-3 text-sm text-brand-dark/65">Favorito: <strong>{fav}</strong>, com {fmt(favProb)}% de avanço.</p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs font-bold">
                  <span className="rounded bg-white py-2">{a}: {fmt(advA)}%</span>
                  <span className="rounded bg-white py-2">{b}: {fmt(advB)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>

    <section className="mx-auto grid max-w-[1080px] gap-8 px-4 py-16 lg:grid-cols-2">
      <div>
        <SectionTitle eyebrow="Finais" title="Argentina x França lidera a lista" />
        <div className="rounded-lg border border-brand-dark/10 bg-white p-5">
          {FINALS.map(([match, prob]) => (
            <p key={match} className="flex justify-between border-b border-brand-dark/8 py-3 text-sm last:border-0">
              <span>{match}</span><strong>{fmt(prob)}%</strong>
            </p>
          ))}
        </div>
      </div>
      <div>
        <SectionTitle eyebrow="Confederações" title="Europa concentra quase dois terços dos títulos" />
        <div className="rounded-lg border border-brand-dark/10 bg-white p-5">
          {CONFEDERATIONS.map(([name, prob]) => (
            <div key={name} className="grid grid-cols-[90px_1fr_70px] items-center gap-3 py-3">
              <span className="font-montserrat text-sm font-black">{name}</span>
              <div className="h-2 rounded-full bg-brand-dark/8"><div className="h-full rounded-full bg-brand-blue" style={{ width: `${prob}%` }} /></div>
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
          Atualização de 04/07/2026 com 1.000.000 de simulações, vetor de força calibrado à média de Kalshi,
          Polymarket e Oddschecker, média de gols 3,0 e correção Dixon-Coles rho −0,13. Os 88 jogos já encerrados
          estão travados. Percentuais arredondados podem gerar pequenas diferenças de soma.
        </p>
      </div>
    </section>
  </div>
);

export default RoundOf16Page;
