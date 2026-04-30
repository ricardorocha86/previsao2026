
import React from 'react';
import { FlaskConical, Sigma, Sliders, Zap, Shield } from 'lucide-react';
import PageHeader from './PageHeader';

const MethodologyPage: React.FC = () => {
  return (
    <div className="bg-brand-light min-h-screen font-opensans text-brand-dark">

      <PageHeader
        icon={FlaskConical}
        eyebrow="Laboratório Científico"
        title="Metodologia da"
        accent="Simulação"
        description="Como transformamos a força relativa das seleções em médias de gols, probabilidades de placar e simulações do torneio."
      />

      <div className="max-w-5xl mx-auto px-4 py-20 space-y-20">

        {/* INTRODUÇÃO: Modelo Poisson e soma fixa de gols */}
        <section>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-green/10 border border-brand-green/20 rounded-full mb-5">
                <span className="text-[10px] font-black text-brand-green uppercase tracking-[0.15em]">Introdução</span>
              </div>
              <h3 className="text-3xl font-montserrat font-black text-brand-dark uppercase tracking-tight mb-5">
                Do modelo aos gols simulados
              </h3>
              <p className="text-brand-dark/70 text-base leading-relaxed mb-4">
                A base da simulação é um <strong className="text-brand-dark">modelo Poisson com médias independentes</strong>. Em cada confronto, a Seleção 1 tem uma média esperada de gols (<span className="font-black italic">m₁</span>) e a Seleção 2 tem outra média (<span className="font-black italic">m₂</span>).
              </p>
              <p className="text-brand-dark/70 text-base leading-relaxed mb-4">
                Em vez de começar estimando essas médias separadamente, o modelo fixa primeiro a <strong className="text-brand-dark">soma esperada de gols da partida</strong> (<span className="font-black italic">m</span>). Depois, divide essa soma entre as equipes conforme a força relativa de cada uma.
              </p>
              <p className="text-brand-dark/70 text-base leading-relaxed mb-6">
                Assim, o objetivo da modelagem é simples: dado um total esperado de gols para o jogo, repartir esse total entre os dois times de acordo com o potencial competitivo de cada seleção.
              </p>
              <div className="space-y-3 font-mono text-sm bg-white p-6 rounded-2xl border border-brand-dark/10 shadow-sm text-brand-dark/70">
                <div className="flex items-center gap-3">
                  <span className="bg-brand-green/10 text-brand-green font-black px-2 py-1 rounded-lg">m</span>
                  <span>=</span>
                  <span>Total esperado de gols da partida</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-brand-green/10 text-brand-green font-black px-2 py-1 rounded-lg">m₁, m₂</span>
                  <span>=</span>
                  <span>Médias de gols de cada seleção</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-brand-green/10 text-brand-green font-black px-2 py-1 rounded-lg">f₁, f₂</span>
                  <span>=</span>
                  <span>Forças usadas para dividir a soma fixa</span>
                </div>
                <div className="w-full h-px bg-brand-dark/10 my-1"></div>
                <div className="text-[10px] text-brand-dark/40 uppercase tracking-widest font-bold">Premissa de Independência</div>
                <div className="text-brand-green font-bold">S₁ ~ Poisson(m₁)</div>
                <div className="text-brand-green font-bold">S₂ ~ Poisson(m₂)</div>
              </div>
            </div>

            {/* Formula Card */}
            <div className="bg-brand-dark text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 opacity-[0.06] transform rotate-12 group-hover:rotate-0 transition-transform duration-700">
                <Sigma className="w-56 h-56 text-brand-neon" />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-green/20 rounded-full mb-6">
                <span className="text-[10px] font-black text-brand-neon uppercase tracking-widest">Modelo de soma fixa</span>
              </div>
              <div className="space-y-8 relative z-10">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-black font-montserrat mb-2 tracking-tight text-white">
                    m = m₁ + m₂
                  </div>
                  <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold">Total de gols esperado no confronto</p>
                </div>
                <div className="bg-brand-green/10 p-6 rounded-2xl border border-brand-green/20">
                  <div className="flex items-center justify-center gap-4 text-2xl md:text-3xl font-black font-montserrat">
                    <span>m₁ =</span>
                    <div className="flex flex-col items-center text-center">
                      <span className="text-brand-neon">m • f₁</span>
                      <div className="h-0.5 w-full bg-white/30 my-1"></div>
                      <span className="text-white/70">(f₁ + f₂)</span>
                    </div>
                  </div>
                </div>
                <div className="text-center opacity-50">
                  <div className="text-2xl font-montserrat font-black">m₂ = m - m₁</div>
                </div>
                <p className="text-white/45 text-sm leading-relaxed text-center">
                  Se as forças forem iguais, cada equipe recebe metade do total esperado. Quanto maior a força relativa de uma seleção, maior a parcela de gols esperados atribuída a ela.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: FORÇA RESULTANTE — 6 PILARES */}
        <section className="bg-white rounded-3xl shadow-sm border border-brand-dark/5 overflow-hidden">
          {/* Section header stripe */}
          <div className="bg-brand-dark px-8 py-5 flex items-center gap-4">
            <div className="p-2 bg-brand-green/20 rounded-xl">
              <Sigma className="w-5 h-5 text-brand-neon" />
            </div>
            <div>
              <p className="text-[10px] font-black text-brand-neon uppercase tracking-[0.2em]">Seção 01</p>
              <h3 className="text-xl font-montserrat font-black text-white uppercase tracking-tight">Força Resultante — Os 6 Pilares</h3>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <p className="text-brand-dark/70 leading-relaxed mb-8">
              A força usada na divisão da média de gols não vem de um único indicador. Ela resume seis dimensões complementares: qualidade do elenco, histórico competitivo, rating atual, momento recente, vantagem de sede e pontuação institucional. Cada dimensão é normalizada para a mesma escala e combinada por pesos.
            </p>

            {/* Formula */}
            <div className="bg-brand-dark rounded-2xl p-6 mb-8 overflow-x-auto">
              <p className="text-brand-neon text-[10px] uppercase tracking-[0.2em] font-black mb-3">Fórmula da Força Resultante</p>
              <div className="font-mono text-sm md:text-base text-center leading-loose">
                <span className="text-brand-neon font-black">F<sub>res</sub></span>
                <span className="text-white/50"> = </span>
                <span className="text-white">
                  (w<sub>FIFA</sub>·x<sub>FIFA</sub>) + (w<sub>ELO</sub>·x<sub>ELO</sub>) + (w<sub>Mom</sub>·x<sub>Mom</sub>) + (w<sub>Mkt</sub>·x<sub>Mkt</sub>) + (w<sub>Hist</sub>·x<sub>Hist</sub>) + (w<sub>Anf</sub>·x<sub>Anf</sub>)
                </span>
                <br />
                <span className="text-white/30 text-xs">onde cada </span>
                <span className="text-white/60 text-xs font-mono">w</span>
                <span className="text-white/30 text-xs"> é o peso do componente e cada </span>
                <span className="text-white/60 text-xs font-mono">x</span>
                <span className="text-white/30 text-xs"> o valor normalizado [0, 1]</span>
              </div>
            </div>

            {/* Pillars */}
            <div className="overflow-x-auto rounded-2xl border border-brand-dark/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-brand-dark/5">
                    <th className="text-left px-5 py-4 font-montserrat font-black uppercase tracking-widest text-xs text-brand-dark">Componente</th>
                    <th className="text-center px-5 py-4 font-montserrat font-black uppercase tracking-widest text-xs text-brand-dark">Impacto</th>
                    <th className="text-left px-5 py-4 font-montserrat font-black uppercase tracking-widest text-xs text-brand-dark hidden md:table-cell">Origem</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Valor de Mercado', pct: '32.8%', pctNum: 32.8, origin: 'Valor agregado do elenco (Milhões de EUR)' },
                    { label: 'Histórico Copas',  pct: '29.5%', pctNum: 29.5, origin: 'Score ponderado de participações e melhor resultado histórico' },
                    { label: 'ELO Rating',       pct: '23.0%', pctNum: 23.0, origin: 'Rating competitivo atual (eloratings.net)' },
                    { label: 'Momento',          pct: '9.8%',  pctNum: 9.8,  origin: 'Variação do ELO nos últimos 12 meses' },
                    { label: 'Anfitrião',        pct: '3.3%',  pctNum: 3.3,  origin: 'Flag binária — vantagem para USA, MEX e CAN' },
                    { label: 'FIFA',             pct: '1.6%',  pctNum: 1.6,  origin: 'Pontuação institucional oficial (FIFA_Current_Points)' },
                  ].map((row, i) => (
                    <tr key={i} className="border-t border-brand-dark/5 hover:bg-brand-green/5 transition-colors">
                      <td className="px-5 py-4 font-black text-brand-dark">{row.label}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-brand-dark/10 rounded-full h-2 hidden sm:block">
                            <div className="bg-brand-green h-2 rounded-full transition-all" style={{ width: `${(row.pctNum / 33) * 100}%` }}></div>
                          </div>
                          <span className="font-black text-brand-green font-mono text-sm whitespace-nowrap">{row.pct}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-brand-dark/50 text-xs hidden md:table-cell">{row.origin}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-brand-dark/10 bg-brand-dark/5">
                    <td className="px-5 py-3 font-montserrat font-black text-xs uppercase tracking-widest text-brand-dark">Total</td>
                    <td className="px-5 py-3 text-center font-black text-brand-green font-mono">100%</td>
                    <td className="hidden md:table-cell"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>

        {/* SECTION 2: PARÂMETROS DE AJUSTE */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="p-2 bg-brand-yellow/20 rounded-xl">
              <Sliders className="w-5 h-5 text-brand-yellow" />
            </div>
            <div>
              <p className="text-[10px] font-black text-brand-yellow uppercase tracking-[0.2em]">Seção 02</p>
              <h3 className="text-2xl font-montserrat font-black text-brand-dark uppercase tracking-tight">Parâmetros de Ajuste</h3>
            </div>
          </div>

          <p className="text-brand-dark/70 leading-relaxed mb-8">
            Depois de calcular a força resultante, aplicamos ajustes calibrados para transformar esse indicador em uma força final utilizável na simulação. Esses parâmetros controlam o quanto o modelo separa favoritos e azarões antes de repartir a média fixa de gols.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Formula span full */}
            <div className="md:col-span-2 bg-brand-dark rounded-2xl p-6 text-center font-mono">
              <p className="text-brand-neon text-[10px] uppercase tracking-[0.2em] font-black mb-3">Transformação Final</p>
              <p className="text-2xl md:text-3xl font-black font-montserrat text-white">
                Força Final = <span className="text-brand-yellow">Offset</span> + (F<sub>res</sub>)<sup className="text-brand-neon">Elasticidade</sup>
              </p>
            </div>

            {/* Elasticidade */}
            <div className="bg-white border border-brand-dark/10 rounded-2xl p-8 shadow-sm hover:border-brand-green/40 transition-colors">
              <div className="flex items-start gap-4 mb-5">
                <div className="p-2 bg-brand-green/10 rounded-xl">
                  <Zap className="w-6 h-6 text-brand-green" />
                </div>
                <div>
                  <h4 className="font-montserrat font-black text-base uppercase tracking-tight text-brand-dark">Elasticidade</h4>
                  <span className="font-mono font-black text-brand-green text-3xl">1.15</span>
                </div>
              </div>
              <p className="text-brand-dark/70 text-sm leading-relaxed">
                Age como um <strong className="text-brand-dark">potenciador de elite</strong>. Valores acima de 1.00 amplificam as pequenas diferenças no topo da tabela, transformando vantagens marginais em ganhos competitivos reais.
              </p>
              <div className="mt-4 bg-brand-green/5 border border-brand-green/20 rounded-xl p-3 text-xs text-brand-green font-mono font-bold">
                f &gt; 1.0 ⟹ vantagem amplificada exponencialmente
              </div>
            </div>

            {/* Offset */}
            <div className="bg-white border border-brand-dark/10 rounded-2xl p-8 shadow-sm hover:border-brand-yellow/40 transition-colors">
              <div className="flex items-start gap-4 mb-5">
                <div className="p-2 bg-brand-yellow/10 rounded-xl">
                  <Sliders className="w-6 h-6 text-brand-yellow" />
                </div>
                <div>
                  <h4 className="font-montserrat font-black text-base uppercase tracking-tight text-brand-dark">Offset</h4>
                  <span className="font-mono font-black text-brand-yellow text-3xl">0.13</span>
                </div>
              </div>
              <p className="text-brand-dark/70 text-sm leading-relaxed">
                É o <strong className="text-brand-dark">parâmetro de balanceamento</strong>. Reduz a distância relativa entre potências e azarões, garantindo que nenhum time seja "nulo" e que o fator sorte opere sobre uma base mínima.
              </p>
              <div className="mt-4 bg-brand-yellow/5 border border-brand-yellow/20 rounded-xl p-3 text-xs text-brand-dark/60 font-mono font-bold">
                gap = Forte − Offset / Fraco − Offset → mais equilibrado
              </div>
            </div>

            {/* Média de Gols */}
            <div className="md:col-span-2 bg-brand-dark rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="text-center sm:text-left shrink-0">
                <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-black mb-1">Média de Gols</p>
                <p className="font-mono font-black text-5xl text-brand-neon">3.00</p>
              </div>
              <div className="h-px sm:h-14 sm:w-px bg-white/10 w-full sm:w-auto"></div>
              <p className="text-white/50 text-sm leading-relaxed font-opensans">
                Define a <strong className="text-white">intensidade ofensiva geral</strong> do torneio. No modelo, este é o total esperado de gols da partida (<strong className="text-white">m</strong>), que depois é dividido entre as seleções conforme suas forças finais.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: CORREÇÃO DIXON-COLES */}
        <section className="bg-white rounded-3xl shadow-sm border border-brand-dark/5 overflow-hidden">
          <div className="bg-brand-dark px-8 py-5 flex items-center gap-4">
            <div className="p-2 bg-brand-neon/20 rounded-xl">
              <Shield className="w-5 h-5 text-brand-neon" />
            </div>
            <div>
              <p className="text-[10px] font-black text-brand-neon uppercase tracking-[0.2em]">Seção 03</p>
              <h3 className="text-xl font-montserrat font-black text-white uppercase tracking-tight">Correção Dixon-Coles</h3>
            </div>
          </div>

          <div className="p-8 md:p-10 grid md:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-brand-dark/70 leading-relaxed mb-5">
                Com as médias <strong className="text-brand-dark">m₁</strong> e <strong className="text-brand-dark">m₂</strong> definidas, o modelo calcula a probabilidade de cada placar possível pela <strong className="text-brand-dark">Distribuição de Poisson</strong>. Essa matriz de placares é a base para estimar vitória, empate, derrota e avanço no torneio.
              </p>
              <p className="text-brand-dark/70 leading-relaxed mb-5">
                No entanto, modelos Poisson puros tendem a subestimar placares baixos — como <strong className="text-brand-dark">0-0</strong> e <strong className="text-brand-dark">1-1</strong> — extremamente comuns no futebol.
              </p>
              <p className="text-brand-dark/70 leading-relaxed">
                A correção de <strong className="text-brand-dark">Dixon-Coles</strong> ajusta a probabilidade conjunta dos gols quando os placares esperados são baixos, tornando o modelo muito mais realista em torneios de tiro curto como a Copa do Mundo.
              </p>
            </div>

            <div className="space-y-5">
              <div className="bg-brand-dark rounded-2xl p-6">
                <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-black mb-3">Parâmetro de Correlação</p>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono font-black text-6xl text-brand-neon">ρ</span>
                  <span className="font-mono font-black text-3xl text-white">= −0.13</span>
                </div>
              </div>

              <div className="bg-brand-green/5 border border-brand-green/20 rounded-2xl p-5">
                <p className="text-brand-green text-[10px] font-black uppercase tracking-[0.15em] mb-2">Por que −0.13?</p>
                <p className="text-brand-dark/70 text-sm leading-relaxed">
                  Ajuste empírico clássico da literatura de modelagem de futebol. Um ρ <strong className="text-brand-dark">negativo</strong> corrige a dependência entre ataques e defesas em situações de poucos gols, evitando que o modelo ignore confrontos defensivos.
                </p>
              </div>

              <div>
                <p className="text-[10px] text-brand-dark/40 uppercase tracking-[0.15em] font-black mb-3">Placares corrigidos</p>
                <div className="flex gap-3 flex-wrap">
                  {['0 × 0', '0 × 1', '1 × 0', '1 × 1'].map(s => (
                    <span key={s} className="font-mono font-black text-sm bg-brand-dark text-brand-neon px-4 py-2 rounded-xl">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default MethodologyPage;
