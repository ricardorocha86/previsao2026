import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const weights = [
  {
    component: 'Pontuação FIFA',
    variable: 'FIFA',
    impact: '1,6%',
    coefficient: '0,016',
    description: 'Pontuação institucional oficial da seleção.',
  },
  {
    component: 'Rating ELO',
    variable: 'ELO',
    impact: '23,0%',
    coefficient: '0,230',
    description: 'Mede a força competitiva atual a partir de resultados internacionais.',
  },
  {
    component: 'Momento recente',
    variable: 'Momento',
    impact: '9,8%',
    coefficient: '0,098',
    description: 'Captura se a seleção vem ganhando ou perdendo força no último ano.',
  },
  {
    component: 'Valor de mercado',
    variable: 'Mercado',
    impact: '32,8%',
    coefficient: '0,328',
    description: 'Aproxima a qualidade agregada do elenco pelo valor econômico dos jogadores.',
  },
  {
    component: 'Histórico em Copas',
    variable: 'Histórico',
    impact: '29,5%',
    coefficient: '0,295',
    description: 'Resume tradição, participações e melhor desempenho histórico no torneio.',
  },
  {
    component: 'Vantagem de sede',
    variable: 'Sede',
    impact: '3,3%',
    coefficient: '0,033',
    description: 'Inclui o benefício estrutural de atuar como país-sede.',
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
  tex: string;
  note?: string;
}

const renderMath = (tex: string, displayMode = false) => ({
  __html: katex.renderToString(tex, {
    displayMode,
    output: 'html',
    strict: false,
    throwOnError: false,
  }),
});

const InlineMath: React.FC<{ tex: string }> = ({ tex }) => (
  <span dangerouslySetInnerHTML={renderMath(tex)} />
);

const SymbolPill: React.FC<{ tex: string }> = ({ tex }) => (
  <span
    className="mx-1 inline-flex items-center bg-brand-light px-2 py-1 text-brand-green"
    style={{ borderRadius: 8 }}
  >
    <InlineMath tex={tex} />
  </span>
);

const Equation: React.FC<EquationProps> = ({ number, title, tex, note }) => (
  <figure className="my-8 border border-brand-dark/14 bg-white shadow-sm" style={{ borderRadius: 8 }}>
    <figcaption className="flex items-center justify-between gap-4 border-b border-brand-dark/10 bg-brand-light/70 px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-brand-dark/60 sm:px-6">
      <span>{title}</span>
      <span className="font-mono text-brand-green">equação {number}</span>
    </figcaption>
    <div className="overflow-x-auto px-4 py-6 sm:px-6">
      <div
        className="min-w-max text-center text-brand-dark [&_.katex-display]:my-0 [&_.katex]:text-[1.35rem] sm:[&_.katex]:text-[1.7rem]"
        dangerouslySetInnerHTML={renderMath(tex, true)}
      />
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
        </section>

        <section className="py-10">
          <h2 className="mb-5 font-serif text-2xl font-bold normal-case text-brand-dark">1. Introdução</h2>
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
          <h2 className="mb-5 font-serif text-2xl font-bold normal-case text-brand-dark">2. Variáveis e preditor linear</h2>
          <p className="leading-relaxed text-brand-dark/75">
            A primeira etapa é construir um preditor linear para resumir a força pré-torneio de cada seleção. Para isso,
            usamos seis informações: pontuação FIFA, rating ELO, momento recente, valor de mercado, histórico em Copas e
            vantagem de sede. A ideia é combinar dimensões complementares: desempenho institucional, força competitiva,
            tendência recente, qualidade do elenco, tradição no torneio e contexto geográfico da Copa de 2026.
          </p>

          <p className="mt-4 leading-relaxed text-brand-dark/75">
            Como essas variáveis vêm em escalas diferentes, todas são normalizadas para a faixa de 0 a 1 antes de entrar no
            preditor. Assim, cada componente passa a representar posição relativa no conjunto de seleções: valores próximos
            de 1 indicam uma seleção perto do topo naquele critério, enquanto valores próximos de 0 indicam uma seleção mais
            distante do topo.
          </p>
        </section>

        <section className="border-t border-brand-dark/15 py-10">
          <h2 className="mb-5 font-serif text-2xl font-bold normal-case text-brand-dark">3. Construindo a força de cada seleção</h2>
          <p className="leading-relaxed text-brand-dark/75">
            A força da seleção é obtida por um preditor linear: cada variável normalizada entra multiplicada por um
            coeficiente. Esses coeficientes representam o impacto ajustado de cada componente na força pré-torneio.
          </p>

          <Equation
            number="1"
            title="Preditor linear de força"
            tex={String.raw`\begin{aligned}\mathrm{For\c{c}a}={}&w_1\cdot\mathrm{FIFA}\\&+w_2\cdot\mathrm{ELO}\\&+w_3\cdot\mathrm{Momento}\\&+w_4\cdot\mathrm{Mercado}\\&+w_5\cdot\mathrm{Hist\acute{o}rico}\\&+w_6\cdot\mathrm{Sede}\end{aligned}`}
            note="A equação é calculada para uma seleção por vez. Cada variável representa o valor normalizado daquela seleção no respectivo componente."
          />

          <p className="leading-relaxed text-brand-dark/75">
            Os coeficientes e parâmetros foram calibrados para que as probabilidades reflitam, da melhor forma possível,
            a leitura do cenário atual pela média de 26 casas de apostas. Na tabela abaixo, o impacto é o coeficiente
            ajustado de cada variável no preditor.
          </p>

          <div className="mt-8 overflow-x-auto border border-brand-dark/12" style={{ borderRadius: 8 }}>
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-brand-dark/12 bg-brand-light/60 text-left">
                  <th className="px-4 py-3 font-montserrat text-[11px] font-black uppercase tracking-[0.16em]">Componente</th>
                  <th className="px-4 py-3 font-montserrat text-[11px] font-black uppercase tracking-[0.16em]">Variável</th>
                  <th className="px-4 py-3 font-montserrat text-[11px] font-black uppercase tracking-[0.16em]">Impacto ajustado</th>
                  <th className="px-4 py-3 font-montserrat text-[11px] font-black uppercase tracking-[0.16em]">O que representa</th>
                </tr>
              </thead>
              <tbody>
                {weights.map((row) => (
                  <tr key={row.component} className="border-b border-brand-dark/8 last:border-b-0">
                    <td className="px-4 py-4 font-bold text-brand-dark">{row.component}</td>
                    <td className="px-4 py-4 font-mono font-bold">{row.variable}</td>
                    <td className="px-4 py-4 font-mono font-bold text-brand-green">{row.impact}</td>
                    <td className="px-4 py-4 leading-relaxed text-brand-dark/65">{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Equation
            number="2"
            title="Força com os coeficientes calibrados"
            tex={String.raw`\begin{aligned}\mathrm{For\c{c}a}={}&0{,}016\cdot\mathrm{FIFA}\\&+0{,}230\cdot\mathrm{ELO}\\&+0{,}098\cdot\mathrm{Momento}\\&+0{,}328\cdot\mathrm{Mercado}\\&+0{,}295\cdot\mathrm{Hist\acute{o}rico}\\&+0{,}033\cdot\mathrm{Sede}\end{aligned}`}
            note="Os percentuais da tabela são usados como proporções na equação: por exemplo, 32,8% entra como 0,328."
          />
        </section>

        <section className="border-t border-brand-dark/15 py-10">
          <h2 className="mb-5 font-serif text-2xl font-bold normal-case text-brand-dark">4. Ajuste da força</h2>
          <p className="leading-relaxed text-brand-dark/75">
            Depois de calcular a força linear, aplicamos uma transformação de calibração. Ela tem dois papéis. O offset
            adiciona uma base comum às seleções e, com isso, controla o quanto a distância entre favorito e menos favorito
            pesa na divisão de gols esperados. Quanto maior esse offset, menor tende a ser a diferença relativa entre uma
            seleção muito forte e uma seleção mais fraca; quanto menor o offset, mais a distância original entre elas aparece.
          </p>

          <p className="mt-4 leading-relaxed text-brand-dark/75">
            A elasticidade controla a curvatura da escala de força. Valores acima de 1 ampliam diferenças no topo: seleções
            já fortes ficam proporcionalmente mais fortes. Valores abaixo de 1 comprimem essas diferenças, tornando o campo
            competitivo mais equilibrado. Assim, o parâmetro regula quanto o modelo deseja premiar superioridade estrutural
            antes de deixar a variância do futebol atuar.
          </p>

          <Equation
            number="3"
            title="Força ajustada usada nas partidas"
            tex={String.raw`\mathrm{For\c{c}a}_{\mathrm{ajustada}}=\alpha+\left(\mathrm{For\c{c}a}\right)^{\gamma}`}
            note="No projeto, usamos offset α = 0,13 e elasticidade γ = 1,15. A força ajustada é a quantidade que entra na comparação entre duas seleções."
          />
        </section>

        <section className="border-t border-brand-dark/15 py-10">
          <h2 className="mb-5 font-serif text-2xl font-bold normal-case text-brand-dark">5. Transformando força em gols esperados</h2>
          <p className="leading-relaxed text-brand-dark/75">
            Em uma partida, o modelo fixa primeiro a média total de gols: 3,00 gols por jogo. Depois, divide esse total entre
            as duas seleções conforme a força ajustada de cada uma. Se as forças forem iguais, cada seleção fica com 1,50 gol
            esperado. Se uma seleção for mais forte, ela recebe uma parcela maior dos 3,00 gols esperados.
          </p>

          <Equation
            number="4"
            title="Divisão da média total de gols"
            tex={String.raw`\begin{aligned}\lambda_A&=\mu\frac{\mathrm{For\c{c}a}_{A,\mathrm{ajustada}}}{\mathrm{For\c{c}a}_{A,\mathrm{ajustada}}+\mathrm{For\c{c}a}_{B,\mathrm{ajustada}}}\\[0.35em]\lambda_B&=\mu\frac{\mathrm{For\c{c}a}_{B,\mathrm{ajustada}}}{\mathrm{For\c{c}a}_{A,\mathrm{ajustada}}+\mathrm{For\c{c}a}_{B,\mathrm{ajustada}}}\end{aligned}`}
            note="A forma geral reparte a média total μ entre as equipes. No projeto, μ = 3,00 gols por partida."
          />

          <p className="leading-relaxed text-brand-dark/75">
            Aqui, <SymbolPill tex={String.raw`\lambda_A`} /> e <SymbolPill tex={String.raw`\lambda_B`} /> são os gols esperados de cada seleção,
            <SymbolPill tex={String.raw`\mathrm{For\c{c}a}_{A,\mathrm{ajustada}}`} /> e <SymbolPill tex={String.raw`\mathrm{For\c{c}a}_{B,\mathrm{ajustada}}`} /> são as forças ajustadas no confronto, e
            <SymbolPill tex={String.raw`\mu`} /> é a média total de gols do jogo.
          </p>
        </section>

        <section className="border-t border-brand-dark/15 py-10">
          <h2 className="mb-5 font-serif text-2xl font-bold normal-case text-brand-dark">6. Transformando gols esperados em placares prováveis</h2>
          <p className="leading-relaxed text-brand-dark/75">
            Uma média esperada não diz que o placar será exatamente aquele número. Ela define uma distribuição. Se uma
            seleção tem média de 1,8 gol, por exemplo, ela pode marcar 0, 1, 2, 3 ou mais gols; cada contagem tem uma
            probabilidade. Para isso usamos a distribuição de Poisson.
          </p>

          <Equation
            number="5"
            title="Probabilidade de uma seleção marcar uma quantidade de gols"
            tex={String.raw`\mathbb{P}(G=g\mid\lambda)=\frac{e^{-\lambda}\lambda^g}{g!}`}
            note="A letra g representa uma contagem possível de gols: 0, 1, 2, 3 etc. O λ é a média esperada de gols daquela seleção no confronto."
          />

          <Equation
            number="6"
            title="Probabilidade inicial de um placar"
            tex={String.raw`P_0(a,b)=\mathbb{P}(G_A=a\mid\lambda_A)\,\mathbb{P}(G_B=b\mid\lambda_B)`}
            note="Aqui, a é o número de gols da seleção A e b é o número de gols da seleção B. Por exemplo: a probabilidade inicial de 2 a 1 é a chance de A marcar 2 gols multiplicada pela chance de B marcar 1 gol."
          />

          <p className="leading-relaxed text-brand-dark/75">
            O futebol, porém, tem muitos jogos de baixa contagem. Por isso, aplicamos a correção de Dixon-Coles nos placares
            0 a 0, 1 a 0, 0 a 1 e 1 a 1. Essa correção ajusta a dependência entre os gols das duas equipes em partidas mais
            fechadas.
          </p>

          <Equation
            number="7"
            title="Probabilidade corrigida do placar"
            tex={String.raw`P(a,b)=\tau(a,b;\lambda_A,\lambda_B,\rho)\,P_0(a,b)`}
            note="No ajuste atual, ρ = -0,13. O fator τ vale 1 para os demais placares; portanto, a correção só atua nos resultados baixos."
          />

          <p className="leading-relaxed text-brand-dark/75">
            Em termos práticos, o fator <InlineMath tex={String.raw`\tau`} /> altera apenas os placares de baixa contagem:
            0 a 0, 1 a 0, 0 a 1 e 1 a 1. Para os demais placares, o fator é igual a 1 e a probabilidade permanece a mesma
            da matriz de Poisson independente.
          </p>
        </section>

        <section className="border-t border-brand-dark/15 py-10">
          <h2 className="mb-5 font-serif text-2xl font-bold normal-case text-brand-dark">7. Somando placares para obter vitória, empate e derrota</h2>
          <p className="leading-relaxed text-brand-dark/75">
            Depois que todos os placares têm probabilidade, as probabilidades de resultado são obtidas por soma. A chance de
            vitória da seleção A é a soma de todos os placares em que A faz mais gols que B. A chance de empate é a soma dos
            placares iguais. A chance de vitória da seleção B é a soma dos placares em que B faz mais gols que A.
          </p>

          <Equation
            number="8"
            title="Resultado como soma de placares"
            tex={String.raw`\begin{aligned}P(A\ \mathrm{vence})&=\sum_{a>b}P(a,b)\\[0.35em]P(\mathrm{empate})&=\sum_{a=b}P(a,b)\\[0.35em]P(B\ \mathrm{vence})&=\sum_{a<b}P(a,b)\end{aligned}`}
            note="Essa etapa evita transformar o modelo em um palpite único. O resultado final considera a matriz inteira de placares possíveis."
          />
        </section>

        <section className="border-t border-brand-dark/15 py-10">
          <h2 className="mb-5 font-serif text-2xl font-bold normal-case text-brand-dark">8. Da partida ao torneio completo</h2>
          <p className="leading-relaxed text-brand-dark/75">
            A Copa não é apenas uma coleção de jogos independentes. O resultado de uma partida altera classificação no grupo,
            adversários prováveis e caminho no mata-mata. Por isso, depois de calcular as probabilidades de placar, o torneio
            inteiro é simulado <span className="font-mono font-bold">1.000.000</span> de vezes.
          </p>

          <Equation
            number="9"
            title="Probabilidade estimada por simulação"
            tex={String.raw`\hat{P}(E)=\frac{\displaystyle\sum_{r=1}^{N}\mathbf{1}\{E_r\}}{N}`}
            note="Na notação, N é o número total de simulações, r identifica uma simulação específica, E é o evento de interesse e I(E_r) vale 1 quando o evento ocorreu naquela simulação e 0 quando não ocorreu."
          />

          <p className="leading-relaxed text-brand-dark/75">
            Em termos diretos, se uma seleção é campeã em 83.000 de 1.000.000 simulações, sua probabilidade estimada de
            título é 83.000 dividido por 1.000.000, isto é, 8,3%.
          </p>
        </section>

        <section className="border-t border-brand-dark/15 py-10">
          <h2 className="mb-5 font-serif text-2xl font-bold normal-case text-brand-dark">9. Como interpretar</h2>
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
