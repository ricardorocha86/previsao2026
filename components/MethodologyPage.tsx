import React from 'react';

const weights = [
  {
    component: 'Valor de mercado',
    symbol: 'x_Mkt',
    weight: '1,00',
    impact: '32,8%',
    description: 'Aproxima a qualidade agregada do elenco por meio do valor econômico dos jogadores.',
  },
  {
    component: 'Histórico em Copas',
    symbol: 'x_Hist',
    weight: '0,90',
    impact: '29,5%',
    description: 'Resume tradição competitiva, participações e melhor desempenho histórico no torneio.',
  },
  {
    component: 'Rating ELO',
    symbol: 'x_ELO',
    weight: '0,70',
    impact: '23,0%',
    description: 'Mede a força competitiva corrente a partir de resultados internacionais recentes e passados.',
  },
  {
    component: 'Momento',
    symbol: 'x_Mom',
    weight: '0,30',
    impact: '9,8%',
    description: 'Captura a direção recente da equipe, usando a variação do rating ELO no último ano.',
  },
  {
    component: 'Anfitrião',
    symbol: 'x_Anf',
    weight: '0,10',
    impact: '3,3%',
    description: 'Inclui a vantagem estrutural dos países-sede da Copa de 2026.',
  },
  {
    component: 'Pontuação FIFA',
    symbol: 'x_FIFA',
    weight: '0,05',
    impact: '1,6%',
    description: 'Usa a pontuação institucional oficial como informação complementar de desempenho.',
  },
];

const steps = [
  'Organizar variáveis comparáveis para todas as seleções.',
  'Normalizar cada variável para a escala comum de 0 a 1.',
  'Combinar as variáveis em um índice único de força.',
  'Converter a força relativa do confronto em médias esperadas de gols.',
  'Calcular a distribuição de placares possíveis.',
  'Repetir o torneio muitas vezes e estimar probabilidades por frequência.',
];

interface EquationProps {
  number: string;
  title: string;
  children: React.ReactNode;
  note?: string;
}

const Equation: React.FC<EquationProps> = ({ number, title, children, note }) => (
  <figure className="my-7 border-l-4 border-brand-green bg-brand-light/45 px-4 py-5 sm:px-6" style={{ borderRadius: 8 }}>
    <figcaption className="mb-3 flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-[0.18em] text-brand-dark/55">
      <span>{title}</span>
      <span className="font-mono text-brand-green">({number})</span>
    </figcaption>
    <div className="overflow-x-auto">
      <div className="min-w-max text-center font-serif text-2xl leading-relaxed text-brand-dark sm:text-3xl">
        {children}
      </div>
    </div>
    {note && <p className="mt-3 text-sm leading-relaxed text-brand-dark/68">{note}</p>}
  </figure>
);

const MethodologyPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-white font-opensans text-brand-dark">
      <article className="mx-auto max-w-[980px] px-4 py-12 sm:px-6 md:py-16">
        <header className="border-b border-brand-dark/15 pb-10">
          <p className="mb-4 font-montserrat text-xs font-black uppercase tracking-[0.28em] text-brand-green">
            Nota metodológica
          </p>
          <h1 className="max-w-4xl font-serif text-4xl font-bold leading-tight tracking-normal text-brand-dark normal-case md:text-6xl">
            Modelo probabilístico para a simulação da Copa do Mundo de 2026
          </h1>
          <div className="mt-6 grid gap-2 border-y border-brand-dark/10 py-4 text-sm text-brand-dark/68 sm:grid-cols-3">
            <p><strong className="text-brand-dark">Projeto:</strong> Previsão Esportiva</p>
            <p><strong className="text-brand-dark">Objeto:</strong> Seleções nacionais</p>
            <p><strong className="text-brand-dark">Saída:</strong> Probabilidades de placar e avanço</p>
          </div>
        </header>

        <section className="border-b border-brand-dark/15 py-10">
          <h2 className="mb-4 font-serif text-2xl font-bold normal-case text-brand-dark">Resumo</h2>
          <p className="text-lg leading-relaxed text-brand-dark/75">
            O objetivo do modelo é transformar informações conhecidas antes do torneio em probabilidades de resultados.
            Para isso, cada seleção recebe um índice de força construído a partir de seis componentes: valor de mercado,
            histórico em Copas, rating ELO, momento recente, vantagem de sede e pontuação FIFA. Em cada partida, as forças
            das duas equipes são comparadas para definir quantos gols se espera que cada uma marque. A partir dessas médias,
            calculamos a probabilidade de placares como 0 a 0, 1 a 0, 2 a 1 e assim por diante. Por fim, o torneio inteiro
            é simulado muitas vezes; as probabilidades divulgadas são as frequências com que cada evento ocorre nessas simulações.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-dark/58">
            <span className="border border-brand-dark/15 px-3 py-2" style={{ borderRadius: 8 }}>Poisson</span>
            <span className="border border-brand-dark/15 px-3 py-2" style={{ borderRadius: 8 }}>Dixon-Coles</span>
            <span className="border border-brand-dark/15 px-3 py-2" style={{ borderRadius: 8 }}>Monte Carlo</span>
            <span className="border border-brand-dark/15 px-3 py-2" style={{ borderRadius: 8 }}>Copa 2026</span>
          </div>
        </section>

        <section className="py-10">
          <h2 className="mb-5 font-serif text-2xl font-bold normal-case text-brand-dark">1. A pergunta estatística</h2>
          <p className="leading-relaxed text-brand-dark/75">
            A pergunta central é simples: se duas seleções se enfrentam hoje, qual é a chance de cada placar possível?
            A resposta não começa tentando adivinhar diretamente o campeão. Ela começa em uma unidade menor e observável:
            a partida. Uma vez que sabemos estimar jogos individuais, conseguimos encadear esses jogos para simular fase
            de grupos, mata-mata e campanha completa.
          </p>

          <ol className="mt-6 grid gap-3 text-sm text-brand-dark/74 sm:grid-cols-2">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-3 border border-brand-dark/10 p-4" style={{ borderRadius: 8 }}>
                <span className="font-mono text-base font-black text-brand-green">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t border-brand-dark/15 py-10">
          <h2 className="mb-5 font-serif text-2xl font-bold normal-case text-brand-dark">2. Das evidências ao índice de força</h2>
          <p className="leading-relaxed text-brand-dark/75">
            Cada fonte de informação tem escala própria. Valor de mercado pode estar em milhões de euros; rating ELO pode
            estar em pontos; vantagem de sede pode ser uma variável binária. Para combinar grandezas tão diferentes, primeiro
            colocamos tudo na mesma escala. Para uma seleção <span className="font-serif italic">i</span> e um componente
            <span className="font-serif italic"> k</span>, usamos uma normalização min-max:
          </p>

          <Equation
            number="1"
            title="Normalização dos componentes"
            note="Depois dessa transformação, 0 representa o menor valor observado entre as seleções e 1 representa o maior valor observado naquele componente."
          >
            <span>
              x<sub>i,k</sub> =
              <span className="mx-3 inline-flex flex-col align-middle">
                <span>z<sub>i,k</sub> - min(z<sub>k</sub>)</span>
                <span className="border-t border-brand-dark pt-1">max(z<sub>k</sub>) - min(z<sub>k</sub>)</span>
              </span>
            </span>
          </Equation>

          <p className="leading-relaxed text-brand-dark/75">
            Em seguida, os seis componentes normalizados são agregados por média ponderada. Os pesos não dizem que um fator
            é o único determinante do futebol; eles dizem quanto cada evidência contribui para a força pré-torneio usada
            pelo simulador.
          </p>

          <Equation
            number="2"
            title="Força resultante"
            note="A divisão pela soma dos pesos mantém o índice em escala interpretável e evita que o valor final dependa apenas da quantidade de componentes incluídos."
          >
            <span>
              F<sup>res</sup><sub>i</sub> =
              <span className="mx-3 inline-flex flex-col align-middle">
                <span>Σ<sub>k=1</sub><sup>6</sup> w<sub>k</sub>x<sub>i,k</sub></span>
                <span className="border-t border-brand-dark pt-1">Σ<sub>k=1</sub><sup>6</sup> w<sub>k</sub></span>
              </span>
            </span>
          </Equation>

          <div className="mt-8 overflow-x-auto border border-brand-dark/12" style={{ borderRadius: 8 }}>
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-brand-dark/12 bg-brand-light/60 text-left">
                  <th className="px-4 py-3 font-montserrat text-[11px] font-black uppercase tracking-[0.16em]">Componente</th>
                  <th className="px-4 py-3 font-montserrat text-[11px] font-black uppercase tracking-[0.16em]">Símbolo</th>
                  <th className="px-4 py-3 font-montserrat text-[11px] font-black uppercase tracking-[0.16em]">Peso</th>
                  <th className="px-4 py-3 font-montserrat text-[11px] font-black uppercase tracking-[0.16em]">Impacto</th>
                  <th className="px-4 py-3 font-montserrat text-[11px] font-black uppercase tracking-[0.16em]">Interpretação</th>
                </tr>
              </thead>
              <tbody>
                {weights.map((row) => (
                  <tr key={row.component} className="border-b border-brand-dark/8 last:border-b-0">
                    <td className="px-4 py-4 font-bold text-brand-dark">{row.component}</td>
                    <td className="px-4 py-4 font-serif text-lg italic">{row.symbol}</td>
                    <td className="px-4 py-4 font-mono font-bold">{row.weight}</td>
                    <td className="px-4 py-4 font-mono font-bold text-brand-green">{row.impact}</td>
                    <td className="px-4 py-4 leading-relaxed text-brand-dark/65">{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="border-t border-brand-dark/15 py-10">
          <h2 className="mb-5 font-serif text-2xl font-bold normal-case text-brand-dark">3. Da força ao número esperado de gols</h2>
          <p className="leading-relaxed text-brand-dark/75">
            O índice de força ainda não é uma probabilidade de vitória. Ele precisa ser convertido para a linguagem do jogo:
            gols. Antes dessa conversão, aplicamos uma transformação com dois parâmetros. A elasticidade aumenta levemente
            a separação entre seleções fortes no topo; o offset impede que seleções mais fracas tenham força próxima de zero.
          </p>

          <Equation
            number="3"
            title="Transformação da força"
            note="No modelo atual, α = 0,13 e γ = 1,15. Em termos práticos, isso preserva a possibilidade de surpresa sem apagar a diferença entre favoritos e azarões."
          >
            <span>
              F<sub>i</sub> = α + (F<sup>res</sup><sub>i</sub>)<sup>γ</sup>
            </span>
          </Equation>

          <p className="leading-relaxed text-brand-dark/75">
            Para uma partida entre as seleções <span className="font-serif italic">i</span> e
            <span className="font-serif italic"> j</span>, a média total de gols é fixada em
            <span className="font-mono font-bold"> m = 3,00</span>. O modelo então reparte esse total de acordo com a força
            relativa das duas equipes. Se as forças forem iguais, cada lado recebe metade da média. Se uma equipe for mais
            forte, ela recebe uma parcela maior.
          </p>

          <Equation
            number="4"
            title="Partição da média total de gols"
            note="λi e λj são as médias esperadas de gols de cada seleção no confronto específico. Elas são o elo entre o índice de força e a matriz de placares."
          >
            <span>
              π<sub>i</sub> =
              <span className="mx-3 inline-flex flex-col align-middle">
                <span>F<sub>i</sub></span>
                <span className="border-t border-brand-dark pt-1">F<sub>i</sub> + F<sub>j</sub></span>
              </span>
              ,&nbsp; λ<sub>i</sub> = mπ<sub>i</sub>,&nbsp; λ<sub>j</sub> = m(1 - π<sub>i</sub>)
            </span>
          </Equation>
        </section>

        <section className="border-t border-brand-dark/15 py-10">
          <h2 className="mb-5 font-serif text-2xl font-bold normal-case text-brand-dark">4. Da média de gols à probabilidade de placar</h2>
          <p className="leading-relaxed text-brand-dark/75">
            Com as médias <span className="font-serif italic">λ</span> definidas, usamos a distribuição de Poisson para
            calcular a chance de cada contagem de gols. Essa escolha é comum em modelagem de futebol porque gols são eventos
            discretos, raros em comparação ao tempo total de jogo, e bem representados por uma taxa média de ocorrência.
          </p>

          <Equation
            number="5"
            title="Distribuição de Poisson para o placar"
            note="A matriz conjunta combina todos os pares de placar: 0 a 0, 1 a 0, 0 a 1, 2 a 1, 3 a 2 e assim por diante."
          >
            <span>
              P<sub>0</sub>(G<sub>i</sub>=a, G<sub>j</sub>=b) =
              e<sup>-(λ<sub>i</sub>+λ<sub>j</sub>)</sup>
              <span className="mx-3 inline-flex flex-col align-middle">
                <span>λ<sub>i</sub><sup>a</sup></span>
                <span className="border-t border-brand-dark pt-1">a!</span>
              </span>
              <span className="inline-flex flex-col align-middle">
                <span>λ<sub>j</sub><sup>b</sup></span>
                <span className="border-t border-brand-dark pt-1">b!</span>
              </span>
            </span>
          </Equation>

          <p className="leading-relaxed text-brand-dark/75">
            O futebol, porém, tem uma particularidade: placares baixos são mais estruturados do que a independência pura
            sugere. Um jogo truncado aumenta a chance de 0 a 0 ou 1 a 1 e altera a frequência de 1 a 0 e 0 a 1. Para lidar
            com isso, aplicamos a correção de Dixon-Coles nos quatro placares baixos.
          </p>

          <Equation
            number="6"
            title="Correção Dixon-Coles"
            note="No modelo atual, ρ = -0,13. O fator τ só altera os placares baixos; para os demais resultados, a probabilidade permanece a da Poisson independente."
          >
            <span>
              P(a,b) = τ(a,b; λ<sub>i</sub>, λ<sub>j</sub>, ρ) P<sub>0</sub>(a,b)
            </span>
          </Equation>

          <div className="overflow-x-auto border border-brand-dark/12" style={{ borderRadius: 8 }}>
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-brand-dark/12 bg-brand-light/60 text-left">
                  <th className="px-4 py-3 font-montserrat text-[11px] font-black uppercase tracking-[0.16em]">Condição</th>
                  <th className="px-4 py-3 font-montserrat text-[11px] font-black uppercase tracking-[0.16em]">Fator τ</th>
                  <th className="px-4 py-3 font-montserrat text-[11px] font-black uppercase tracking-[0.16em]">Leitura intuitiva</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-brand-dark/8">
                  <td className="px-4 py-4 font-mono">a = 0, b = 0</td>
                  <td className="px-4 py-4 font-serif text-lg">1 - λ<sub>i</sub>λ<sub>j</sub>ρ</td>
                  <td className="px-4 py-4 text-brand-dark/65">Ajusta a frequência de empates sem gols.</td>
                </tr>
                <tr className="border-b border-brand-dark/8">
                  <td className="px-4 py-4 font-mono">a = 0, b = 1</td>
                  <td className="px-4 py-4 font-serif text-lg">1 + λ<sub>i</sub>ρ</td>
                  <td className="px-4 py-4 text-brand-dark/65">Corrige vitórias mínimas da equipe visitante.</td>
                </tr>
                <tr className="border-b border-brand-dark/8">
                  <td className="px-4 py-4 font-mono">a = 1, b = 0</td>
                  <td className="px-4 py-4 font-serif text-lg">1 + λ<sub>j</sub>ρ</td>
                  <td className="px-4 py-4 text-brand-dark/65">Corrige vitórias mínimas da equipe mandante.</td>
                </tr>
                <tr className="border-b border-brand-dark/8">
                  <td className="px-4 py-4 font-mono">a = 1, b = 1</td>
                  <td className="px-4 py-4 font-serif text-lg">1 - ρ</td>
                  <td className="px-4 py-4 text-brand-dark/65">Ajusta empates de baixa contagem.</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 font-mono">demais placares</td>
                  <td className="px-4 py-4 font-serif text-lg">1</td>
                  <td className="px-4 py-4 text-brand-dark/65">Mantém a probabilidade original da Poisson.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <Equation
            number="7"
            title="Probabilidades de resultado da partida"
            note="A vitória, o empate e a derrota são somas de células da matriz de placares, não palpites isolados."
          >
            <span>
              P(i vence) = Σ<sub>a&gt;b</sub> P(a,b),&nbsp;
              P(empate) = Σ<sub>a=b</sub> P(a,b),&nbsp;
              P(j vence) = Σ<sub>a&lt;b</sub> P(a,b)
            </span>
          </Equation>
        </section>

        <section className="border-t border-brand-dark/15 py-10">
          <h2 className="mb-5 font-serif text-2xl font-bold normal-case text-brand-dark">5. Da partida ao torneio</h2>
          <p className="leading-relaxed text-brand-dark/75">
            Uma Copa do Mundo não é uma única previsão; é uma sequência de dependências. O resultado de um jogo muda
            classificação, adversários possíveis e caminho no mata-mata. Por isso, depois de obter a matriz de placares
            de cada confronto, usamos simulação de Monte Carlo: o torneio é repetido <span className="font-mono font-bold">1.000.000</span>
            de vezes, sempre respeitando a estrutura da competição.
          </p>

          <Equation
            number="8"
            title="Estimativa por frequência de simulação"
            note="Se uma seleção é campeã em 83.000 de 1.000.000 simulações, sua probabilidade estimada de título é 8,3%."
          >
            <span>
              P̂(E) =
              <span className="mx-3 inline-flex flex-col align-middle">
                <span>1</span>
                <span className="border-t border-brand-dark pt-1">N</span>
              </span>
              Σ<sub>r=1</sub><sup>N</sup> I(E ocorre na simulação r)
            </span>
          </Equation>

          <p className="leading-relaxed text-brand-dark/75">
            Essa etapa final produz as probabilidades publicadas: terminar em cada posição do grupo, avançar de fase,
            chegar às oitavas, quartas, semifinal, final e conquistar o título. A interpretação correta é frequencista:
            a probabilidade é a proporção de universos simulados em que aquele evento aconteceu.
          </p>
        </section>

        <section className="border-t border-brand-dark/15 py-10">
          <h2 className="mb-5 font-serif text-2xl font-bold normal-case text-brand-dark">6. Como ler o resultado</h2>
          <div className="grid gap-5 md:grid-cols-3">
            <div className="border border-brand-dark/12 p-5" style={{ borderRadius: 8 }}>
              <h3 className="mb-3 font-serif text-xl font-bold normal-case">Probabilidade não é destino</h3>
              <p className="text-sm leading-relaxed text-brand-dark/68">
                Um time com 70% de chance ainda perde em 30% dos cenários. O modelo mede incerteza, não certeza.
              </p>
            </div>
            <div className="border border-brand-dark/12 p-5" style={{ borderRadius: 8 }}>
              <h3 className="mb-3 font-serif text-xl font-bold normal-case">O caminho importa</h3>
              <p className="text-sm leading-relaxed text-brand-dark/68">
                Duas seleções de força parecida podem ter chances diferentes por causa do grupo e dos adversários prováveis.
              </p>
            </div>
            <div className="border border-brand-dark/12 p-5" style={{ borderRadius: 8 }}>
              <h3 className="mb-3 font-serif text-xl font-bold normal-case">O modelo é pré-torneio</h3>
              <p className="text-sm leading-relaxed text-brand-dark/68">
                As estimativas refletem as informações disponíveis antes dos jogos e devem ser atualizadas quando novos dados surgirem.
              </p>
            </div>
          </div>
        </section>

        <footer className="border-t-2 border-brand-dark py-8">
          <h2 className="mb-4 font-serif text-2xl font-bold normal-case text-brand-dark">Conclusão</h2>
          <p className="text-lg leading-relaxed text-brand-dark/75">
            A metodologia segue uma cadeia transparente: dados viram força, força vira média de gols, média de gols vira
            distribuição de placares, e placares simulados viram probabilidades de campanha. Esse encadeamento permite que
            o resultado final seja explicado passo a passo. A pergunta deixa de ser “quem vai ganhar?” e passa a ser
            “em quantos cenários plausíveis cada seleção chega a cada fase?”.
          </p>
        </footer>
      </article>
    </main>
  );
};

export default MethodologyPage;
