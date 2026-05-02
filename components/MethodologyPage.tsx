import React from 'react';

const weights = [
  {
    component: 'Valor de mercado',
    weight: '1,00',
    impact: '32,8%',
    description: 'Aproxima a qualidade agregada do elenco pelo valor econômico dos jogadores.',
  },
  {
    component: 'Histórico em Copas',
    weight: '0,90',
    impact: '29,5%',
    description: 'Resume tradição, participações e melhor desempenho histórico no torneio.',
  },
  {
    component: 'Rating ELO',
    weight: '0,70',
    impact: '23,0%',
    description: 'Mede a força competitiva atual a partir de resultados internacionais.',
  },
  {
    component: 'Momento recente',
    weight: '0,30',
    impact: '9,8%',
    description: 'Captura se a seleção vem ganhando ou perdendo força no último ano.',
  },
  {
    component: 'Vantagem de sede',
    weight: '0,10',
    impact: '3,3%',
    description: 'Inclui o benefício estrutural de atuar como país-sede.',
  },
  {
    component: 'Pontuação FIFA',
    weight: '0,05',
    impact: '1,6%',
    description: 'Usa a pontuação institucional oficial como informação complementar.',
  },
];

const steps = [
  'Juntar informações comparáveis para todas as seleções.',
  'Colocar todas as informações na mesma escala, de 0 a 1.',
  'Combinar as informações em uma força única para cada seleção.',
  'Comparar duas forças para dividir a média esperada de gols do jogo.',
  'Transformar médias de gols em probabilidades de placar.',
  'Repetir o torneio muitas vezes e contar a frequência dos eventos.',
];

interface EquationProps {
  number: string;
  title: string;
  children: React.ReactNode;
  note?: string;
}

const Fraction: React.FC<{ top: React.ReactNode; bottom: React.ReactNode }> = ({ top, bottom }) => (
  <span className="mx-2 inline-flex min-w-[9rem] flex-col items-center align-middle">
    <span className="w-full px-2 pb-1 text-center">{top}</span>
    <span className="w-full border-t-2 border-brand-dark px-2 pt-1 text-center">{bottom}</span>
  </span>
);

const Equation: React.FC<EquationProps> = ({ number, title, children, note }) => (
  <figure className="my-8 border border-brand-dark/14 bg-white shadow-sm" style={{ borderRadius: 8 }}>
    <figcaption className="flex items-center justify-between gap-4 border-b border-brand-dark/10 bg-brand-light/70 px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-brand-dark/60 sm:px-6">
      <span>{title}</span>
      <span className="font-mono text-brand-green">equação {number}</span>
    </figcaption>
    <div className="overflow-x-auto px-4 py-6 sm:px-6">
      <div className="min-w-max text-center font-serif text-[1.35rem] leading-[2.4rem] text-brand-dark sm:text-[1.65rem]">
        {children}
      </div>
    </div>
    {note && (
      <p className="border-t border-brand-dark/10 px-4 py-4 text-sm leading-relaxed text-brand-dark/68 sm:px-6">
        {note}
      </p>
    )}
  </figure>
);

const MethodologyPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-white font-opensans text-brand-dark">
      <article className="mx-auto max-w-[1000px] px-4 py-12 sm:px-6 md:py-16">
        <header className="border-b border-brand-dark/15 pb-10">
          <p className="mb-4 font-montserrat text-xs font-black uppercase tracking-[0.28em] text-brand-green">
            Nota metodológica
          </p>
          <h1 className="max-w-4xl font-serif text-4xl font-bold leading-tight tracking-normal text-brand-dark normal-case md:text-6xl">
            Como transformamos dados de seleções em probabilidades para a Copa de 2026
          </h1>
          <div className="mt-6 grid gap-2 border-y border-brand-dark/10 py-4 text-sm text-brand-dark/68 sm:grid-cols-3">
            <p><strong className="text-brand-dark">Projeto:</strong> Previsão Esportiva</p>
            <p><strong className="text-brand-dark">Unidade básica:</strong> partida</p>
            <p><strong className="text-brand-dark">Resultado final:</strong> probabilidades de campanha</p>
          </div>
        </header>

        <section className="border-b border-brand-dark/15 py-10">
          <h2 className="mb-4 font-serif text-2xl font-bold normal-case text-brand-dark">Resumo</h2>
          <p className="text-lg leading-relaxed text-brand-dark/75">
            O modelo segue uma sequência simples. Primeiro, cada seleção recebe uma medida de força construída com dados
            anteriores ao torneio. Depois, quando duas seleções se enfrentam, essas forças são usadas para dividir a média
            esperada de gols da partida. Com as médias de gols de cada lado, calculamos a probabilidade de cada placar
            possível. Por fim, o torneio é simulado muitas vezes; a chance de ser campeão, chegar à final ou avançar de fase
            é a frequência com que esse evento aparece nas simulações.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-dark/58">
            <span className="border border-brand-dark/15 px-3 py-2" style={{ borderRadius: 8 }}>índice de força</span>
            <span className="border border-brand-dark/15 px-3 py-2" style={{ borderRadius: 8 }}>Poisson</span>
            <span className="border border-brand-dark/15 px-3 py-2" style={{ borderRadius: 8 }}>Dixon-Coles</span>
            <span className="border border-brand-dark/15 px-3 py-2" style={{ borderRadius: 8 }}>Monte Carlo</span>
          </div>
        </section>

        <section className="py-10">
          <h2 className="mb-5 font-serif text-2xl font-bold normal-case text-brand-dark">1. O fio condutor</h2>
          <p className="leading-relaxed text-brand-dark/75">
            A pergunta “quem tem mais chance de ganhar a Copa?” é grande demais para ser respondida de uma vez. O modelo
            quebra essa pergunta em partes menores. Primeiro pergunta: “qual é a força relativa de cada seleção?”. Depois:
            “em uma partida específica, quantos gols esperamos de cada lado?”. Por último: “se repetirmos a Copa milhares
            ou milhões de vezes, em quantas delas cada seleção chega a cada fase?”.
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
          <h2 className="mb-5 font-serif text-2xl font-bold normal-case text-brand-dark">2. Colocando variáveis diferentes na mesma escala</h2>
          <p className="leading-relaxed text-brand-dark/75">
            Os dados entram no modelo em unidades diferentes: milhões de euros, pontos de rating, variação recente, presença
            como país-sede. Para que nenhum componente domine a conta só por usar uma unidade maior, cada informação é
            convertida para a escala de 0 a 1.
          </p>

          <Equation
            number="1"
            title="Normalização de uma informação"
            note="Assim, a seleção com menor valor naquele critério recebe 0, a seleção com maior valor recebe 1, e as demais ficam proporcionalmente entre esses dois extremos."
          >
            <span>
              valor normalizado =
              <Fraction
                top="valor da seleção - menor valor entre as seleções"
                bottom="maior valor entre as seleções - menor valor entre as seleções"
              />
            </span>
          </Equation>

          <p className="leading-relaxed text-brand-dark/75">
            Depois da normalização, todos os componentes falam a mesma língua. Um valor próximo de 1 significa que a seleção
            está perto do topo naquele critério; um valor próximo de 0 significa que ela está perto da base.
          </p>
        </section>

        <section className="border-t border-brand-dark/15 py-10">
          <h2 className="mb-5 font-serif text-2xl font-bold normal-case text-brand-dark">3. Construindo a força de cada seleção</h2>
          <p className="leading-relaxed text-brand-dark/75">
            A força pré-torneio é uma média ponderada. Isso quer dizer que cada componente entra na conta, mas alguns entram
            com mais peso do que outros. No ajuste atual, valor de mercado, histórico em Copas e ELO têm maior influência;
            momento recente, sede e pontuação FIFA entram como informações complementares.
          </p>

          <Equation
            number="2"
            title="Força bruta da seleção"
            note="A soma dos pesos é 3,05. Dividir por 3,05 transforma a soma ponderada em uma média ponderada, mantendo o resultado em uma escala comparável entre seleções."
          >
            <span>
              força bruta =
              <Fraction
                top={
                  <span>
                    1,00 × mercado + 0,90 × histórico + 0,70 × ELO + 0,30 × momento
                    <br />
                    + 0,10 × sede + 0,05 × FIFA
                  </span>
                }
                bottom="3,05"
              />
            </span>
          </Equation>

          <div className="mt-8 overflow-x-auto border border-brand-dark/12" style={{ borderRadius: 8 }}>
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-brand-dark/12 bg-brand-light/60 text-left">
                  <th className="px-4 py-3 font-montserrat text-[11px] font-black uppercase tracking-[0.16em]">Componente</th>
                  <th className="px-4 py-3 font-montserrat text-[11px] font-black uppercase tracking-[0.16em]">Peso</th>
                  <th className="px-4 py-3 font-montserrat text-[11px] font-black uppercase tracking-[0.16em]">Impacto</th>
                  <th className="px-4 py-3 font-montserrat text-[11px] font-black uppercase tracking-[0.16em]">O que representa</th>
                </tr>
              </thead>
              <tbody>
                {weights.map((row) => (
                  <tr key={row.component} className="border-b border-brand-dark/8 last:border-b-0">
                    <td className="px-4 py-4 font-bold text-brand-dark">{row.component}</td>
                    <td className="px-4 py-4 font-mono font-bold">{row.weight}</td>
                    <td className="px-4 py-4 font-mono font-bold text-brand-green">{row.impact}</td>
                    <td className="px-4 py-4 leading-relaxed text-brand-dark/65">{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 leading-relaxed text-brand-dark/75">
            Em seguida, aplicamos uma transformação pequena na força bruta. Ela serve para calibrar o comportamento do
            simulador: a elasticidade separa um pouco mais as seleções mais fortes, enquanto o offset garante que nenhuma
            seleção comece com força praticamente nula.
          </p>

          <Equation
            number="3"
            title="Força ajustada usada nas partidas"
            note="No ajuste atual, o offset é 0,13 e a elasticidade é 1,15. A força ajustada é a quantidade que de fato entra na comparação entre duas seleções."
          >
            <span>
              força ajustada = 0,13 + (força bruta)<sup>1,15</sup>
            </span>
          </Equation>
        </section>

        <section className="border-t border-brand-dark/15 py-10">
          <h2 className="mb-5 font-serif text-2xl font-bold normal-case text-brand-dark">4. Transformando força em gols esperados</h2>
          <p className="leading-relaxed text-brand-dark/75">
            Em uma partida, o modelo fixa primeiro a média total de gols: 3,00 gols por jogo. Depois, divide esse total entre
            as duas seleções conforme a força ajustada de cada uma. Se as forças forem iguais, cada seleção fica com 1,50 gol
            esperado. Se uma seleção for mais forte, ela recebe uma parcela maior dos 3,00 gols esperados.
          </p>

          <Equation
            number="4"
            title="Divisão da média total de gols"
            note="Esta equação é o coração intuitivo do modelo: a soma esperada continua sendo 3,00, mas a fatia de cada seleção muda conforme a força relativa no confronto."
          >
            <span>
              parcela da seleção A =
              <Fraction
                top="força ajustada da seleção A"
                bottom="força ajustada da seleção A + força ajustada da seleção B"
              />
            </span>
          </Equation>

          <Equation
            number="5"
            title="Gols esperados de cada seleção"
            note="O símbolo λ, quando aparece na literatura, significa apenas “média esperada de gols”. Aqui mantemos a frase completa para evitar ambiguidade."
          >
            <span>
              gols esperados da seleção A = 3,00 × parcela da seleção A
              <br />
              gols esperados da seleção B = 3,00 - gols esperados da seleção A
            </span>
          </Equation>
        </section>

        <section className="border-t border-brand-dark/15 py-10">
          <h2 className="mb-5 font-serif text-2xl font-bold normal-case text-brand-dark">5. Transformando gols esperados em placares prováveis</h2>
          <p className="leading-relaxed text-brand-dark/75">
            Uma média esperada não diz que o placar será exatamente aquele número. Ela define uma distribuição. Se uma
            seleção tem média de 1,8 gol, por exemplo, ela pode marcar 0, 1, 2, 3 ou mais gols; cada contagem tem uma
            probabilidade. Para isso usamos a distribuição de Poisson.
          </p>

          <Equation
            number="6"
            title="Probabilidade de uma seleção marcar uma quantidade de gols"
            note="A letra g representa uma contagem possível de gols: 0, 1, 2, 3 etc. A função exponencial e o fatorial são a forma matemática padrão da distribuição de Poisson."
          >
            <span>
              probabilidade de marcar g gols =
              <Fraction
                top={
                  <span>
                    e<sup>-gols esperados</sup> × (gols esperados)<sup>g</sup>
                  </span>
                }
                bottom="g!"
              />
            </span>
          </Equation>

          <Equation
            number="7"
            title="Probabilidade inicial de um placar"
            note="Aqui, a é o número de gols da seleção A e b é o número de gols da seleção B. Por exemplo: a probabilidade inicial de 2 a 1 é a chance de A marcar 2 gols multiplicada pela chance de B marcar 1 gol."
          >
            <span>
              probabilidade inicial do placar a × b =
              <br />
              probabilidade de A marcar a gols × probabilidade de B marcar b gols
            </span>
          </Equation>

          <p className="leading-relaxed text-brand-dark/75">
            O futebol, porém, tem muitos jogos de baixa contagem. Por isso, aplicamos a correção de Dixon-Coles nos placares
            0 a 0, 1 a 0, 0 a 1 e 1 a 1. Essa correção ajusta a dependência entre os gols das duas equipes em partidas mais
            fechadas.
          </p>

          <Equation
            number="8"
            title="Probabilidade corrigida do placar"
            note="O parâmetro ρ é igual a -0,13 no ajuste atual. O fator Dixon-Coles vale 1 para os demais placares; portanto, a correção só atua nos resultados baixos."
          >
            <span>
              probabilidade corrigida do placar =
              <br />
              probabilidade inicial do placar × fator Dixon-Coles
            </span>
          </Equation>

          <div className="overflow-x-auto border border-brand-dark/12" style={{ borderRadius: 8 }}>
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-brand-dark/12 bg-brand-light/60 text-left">
                  <th className="px-4 py-3 font-montserrat text-[11px] font-black uppercase tracking-[0.16em]">Placar</th>
                  <th className="px-4 py-3 font-montserrat text-[11px] font-black uppercase tracking-[0.16em]">Fator Dixon-Coles</th>
                  <th className="px-4 py-3 font-montserrat text-[11px] font-black uppercase tracking-[0.16em]">Interpretação</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-brand-dark/8">
                  <td className="px-4 py-4 font-mono">0 a 0</td>
                  <td className="px-4 py-4 font-serif text-lg">1 - gols esperados A × gols esperados B × ρ</td>
                  <td className="px-4 py-4 text-brand-dark/65">Ajusta empates sem gols.</td>
                </tr>
                <tr className="border-b border-brand-dark/8">
                  <td className="px-4 py-4 font-mono">1 a 0</td>
                  <td className="px-4 py-4 font-serif text-lg">1 + gols esperados B × ρ</td>
                  <td className="px-4 py-4 text-brand-dark/65">Ajusta vitória mínima da seleção A.</td>
                </tr>
                <tr className="border-b border-brand-dark/8">
                  <td className="px-4 py-4 font-mono">0 a 1</td>
                  <td className="px-4 py-4 font-serif text-lg">1 + gols esperados A × ρ</td>
                  <td className="px-4 py-4 text-brand-dark/65">Ajusta vitória mínima da seleção B.</td>
                </tr>
                <tr className="border-b border-brand-dark/8">
                  <td className="px-4 py-4 font-mono">1 a 1</td>
                  <td className="px-4 py-4 font-serif text-lg">1 - ρ</td>
                  <td className="px-4 py-4 text-brand-dark/65">Ajusta empate com um gol para cada lado.</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 font-mono">demais placares</td>
                  <td className="px-4 py-4 font-serif text-lg">1</td>
                  <td className="px-4 py-4 text-brand-dark/65">Mantém a probabilidade calculada pela Poisson.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="border-t border-brand-dark/15 py-10">
          <h2 className="mb-5 font-serif text-2xl font-bold normal-case text-brand-dark">6. Somando placares para obter vitória, empate e derrota</h2>
          <p className="leading-relaxed text-brand-dark/75">
            Depois que todos os placares têm probabilidade, as probabilidades de resultado são obtidas por soma. A chance de
            vitória da seleção A é a soma de todos os placares em que A faz mais gols que B. A chance de empate é a soma dos
            placares iguais. A chance de vitória da seleção B é a soma dos placares em que B faz mais gols que A.
          </p>

          <Equation
            number="9"
            title="Resultado como soma de placares"
            note="Essa etapa evita transformar o modelo em um palpite único. O resultado final considera a matriz inteira de placares possíveis."
          >
            <span>
              chance de A vencer = soma dos placares em que gols de A &gt; gols de B
              <br />
              chance de empate = soma dos placares em que gols de A = gols de B
              <br />
              chance de B vencer = soma dos placares em que gols de A &lt; gols de B
            </span>
          </Equation>
        </section>

        <section className="border-t border-brand-dark/15 py-10">
          <h2 className="mb-5 font-serif text-2xl font-bold normal-case text-brand-dark">7. Da partida ao torneio completo</h2>
          <p className="leading-relaxed text-brand-dark/75">
            A Copa não é apenas uma coleção de jogos independentes. O resultado de uma partida altera classificação no grupo,
            adversários prováveis e caminho no mata-mata. Por isso, depois de calcular as probabilidades de placar, o torneio
            inteiro é simulado <span className="font-mono font-bold">1.000.000</span> de vezes.
          </p>

          <Equation
            number="10"
            title="Probabilidade estimada por simulação"
            note="Se uma seleção é campeã em 83.000 de 1.000.000 simulações, a estimativa de título é 83.000 dividido por 1.000.000, isto é, 8,3%."
          >
            <span>
              probabilidade estimada de um evento =
              <Fraction
                top="número de simulações em que o evento aconteceu"
                bottom="número total de simulações"
              />
            </span>
          </Equation>
        </section>

        <section className="border-t border-brand-dark/15 py-10">
          <h2 className="mb-5 font-serif text-2xl font-bold normal-case text-brand-dark">8. Como interpretar</h2>
          <div className="grid gap-5 md:grid-cols-3">
            <div className="border border-brand-dark/12 p-5" style={{ borderRadius: 8 }}>
              <h3 className="mb-3 font-serif text-xl font-bold normal-case">Probabilidade não é destino</h3>
              <p className="text-sm leading-relaxed text-brand-dark/68">
                Uma seleção com 70% de chance ainda perde em 30% dos cenários. O modelo mede incerteza.
              </p>
            </div>
            <div className="border border-brand-dark/12 p-5" style={{ borderRadius: 8 }}>
              <h3 className="mb-3 font-serif text-xl font-bold normal-case">O caminho importa</h3>
              <p className="text-sm leading-relaxed text-brand-dark/68">
                Duas seleções fortes podem ter chances diferentes se uma delas estiver em um grupo mais difícil.
              </p>
            </div>
            <div className="border border-brand-dark/12 p-5" style={{ borderRadius: 8 }}>
              <h3 className="mb-3 font-serif text-xl font-bold normal-case">O modelo é pré-torneio</h3>
              <p className="text-sm leading-relaxed text-brand-dark/68">
                As estimativas refletem os dados disponíveis antes dos jogos e podem mudar com novas informações.
              </p>
            </div>
          </div>
        </section>

        <footer className="border-t-2 border-brand-dark py-8">
          <h2 className="mb-4 font-serif text-2xl font-bold normal-case text-brand-dark">Conclusão</h2>
          <p className="text-lg leading-relaxed text-brand-dark/75">
            O método tem começo, meio e fim: dados viram força, força vira gols esperados, gols esperados viram placares
            prováveis, e placares simulados viram probabilidades de campanha. A pergunta final não é “quem vai ganhar com
            certeza?”, mas “em quantos cenários plausíveis cada seleção chega a cada fase?”.
          </p>
        </footer>
      </article>
    </main>
  );
};

export default MethodologyPage;
