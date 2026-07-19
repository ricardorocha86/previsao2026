import {
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  Medal,
  Quote,
  Scale,
  Target,
  Trophy,
} from 'lucide-react';
import PageHeader from './PageHeader';
import ReportEditionSelector from './ReportEditionSelector';

type RankingItem = {
  rank: number;
  team: string;
  value: number;
  note?: string;
};

const FORCE_OPENING: RankingItem[] = [
  { rank: 1, team: 'Espanha', value: 15.9, note: 'campeã' },
  { rank: 2, team: 'França', value: 14.8 },
  { rank: 3, team: 'Inglaterra', value: 10.3, note: '3º lugar' },
  { rank: 4, team: 'Portugal', value: 9.9 },
  { rank: 5, team: 'Brasil', value: 8.3 },
  { rank: 6, team: 'Argentina', value: 8.2, note: 'vice-campeã' },
];

const BAYES_OPENING: RankingItem[] = [
  { rank: 1, team: 'França', value: 14.3 },
  { rank: 2, team: 'Inglaterra', value: 13.3, note: '3º lugar' },
  { rank: 3, team: 'Espanha', value: 11.1, note: 'campeã' },
  { rank: 4, team: 'Brasil', value: 9.1 },
  { rank: 5, team: 'Argentina', value: 9.0, note: 'vice-campeã' },
  { rank: 6, team: 'Portugal', value: 6.2 },
];

const TITLE_TIMELINE = [
  { date: '11/06', stage: 'Início', spain: '15,9%', argentina: '8,2%', text: 'Espanha em 1º; Argentina em 6º.' },
  { date: '28/06', stage: 'Mata-mata', spain: '10,7%', argentina: '19,9%', text: 'A Argentina assume a frente entre as duas.' },
  { date: '12/07', stage: 'Semifinais', spain: '20,8%', argentina: '19,8%', text: 'A distância cai para um ponto percentual.' },
  { date: '16/07', stage: 'Final', spain: '58,3%', argentina: '41,7%', text: 'A vantagem espanhola existe, mas a decisão segue aberta.' },
  { date: '19/07', stage: 'Desfecho', spain: 'Campeã', argentina: 'Vice', text: 'Um gol separa a projeção do troféu.' },
] as const;

const fmt = (value: number) => value.toFixed(1).replace('.', ',');

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
  <div className="max-w-3xl">
    <p className={`font-montserrat text-xs font-black uppercase tracking-widest ${light ? 'text-brand-neon' : 'text-brand-green'}`}>
      {eyebrow}
    </p>
    <h2 className={`mt-3 font-montserrat text-3xl font-black uppercase leading-none md:text-5xl ${light ? 'text-white' : 'text-brand-dark'}`}>
      {title}
    </h2>
    {children && <div className={`mt-5 space-y-4 leading-relaxed ${light ? 'text-white/70' : 'text-brand-dark/68'}`}>{children}</div>}
  </div>
);

const PodiumTeam = ({ place, team, result, tone }: { place: string; team: string; result: string; tone: string }) => (
  <article className="rounded-2xl border border-brand-dark/10 bg-white p-5 shadow-sm">
    <p className={`font-montserrat text-[10px] font-black uppercase tracking-widest ${tone}`}>{place}</p>
    <p className="mt-3 font-montserrat text-2xl font-black uppercase text-brand-dark">{team}</p>
    <p className="mt-1 text-sm text-brand-dark/55">{result}</p>
  </article>
);

const OpeningRanking = ({ title, subtitle, data, tone }: { title: string; subtitle: string; data: RankingItem[]; tone: 'green' | 'blue' }) => {
  const color = tone === 'green' ? 'text-brand-green' : 'text-brand-blue';
  const bar = tone === 'green' ? 'bg-brand-green' : 'bg-brand-blue';

  return (
    <article className="overflow-hidden rounded-2xl border border-brand-dark/10 bg-white shadow-sm">
      <div className="border-b border-brand-dark/10 px-6 py-5">
        <p className={`font-montserrat text-xs font-black uppercase tracking-wider ${color}`}>{title}</p>
        <p className="mt-1 text-xs text-brand-dark/45">{subtitle}</p>
      </div>
      <div className="divide-y divide-brand-dark/8 px-6">
        {data.map((item) => (
          <div key={item.team} className="grid grid-cols-[28px_1fr_auto] items-center gap-3 py-3.5">
            <span className="font-montserrat text-xs font-black text-brand-dark/35">{item.rank}</span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <p className="font-montserrat text-sm font-black uppercase text-brand-dark">{item.team}</p>
                {item.note && (
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${tone === 'green' ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-blue/10 text-brand-blue'}`}>
                    {item.note}
                  </span>
                )}
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-brand-dark/8">
                <div className={`h-full rounded-full ${bar}`} style={{ width: `${item.value * 5.8}%` }} />
              </div>
            </div>
            <strong className={`font-montserrat text-lg ${color}`}>{fmt(item.value)}%</strong>
          </div>
        ))}
      </div>
    </article>
  );
};

const Metric = ({
  label,
  force,
  bayesian,
  detail,
  best,
}: {
  label: string;
  force: string;
  bayesian: string;
  detail: string;
  best: 'force' | 'bayesian';
}) => (
  <div className="grid gap-3 border-t border-brand-dark/10 py-4 sm:grid-cols-[1.25fr_0.7fr_0.7fr] sm:items-center">
    <div>
      <p className="font-montserrat text-xs font-black uppercase text-brand-dark">{label}</p>
      <p className="mt-1 text-xs leading-relaxed text-brand-dark/50">{detail}</p>
    </div>
    <p className={`font-montserrat text-2xl font-black ${best === 'force' ? 'text-brand-green' : 'text-brand-dark/45'}`}>{force}</p>
    <p className={`font-montserrat text-2xl font-black ${best === 'bayesian' ? 'text-brand-blue' : 'text-brand-dark/45'}`}>{bayesian}</p>
  </div>
);

const ClosingReportPage = () => (
  <div className="bg-brand-light font-opensans">
    <PageHeader
      icon={Trophy}
      eyebrow="Reportagem 09 · Balanço final · 104 partidas"
      title="A taça encontrou"
      accent="a previsão."
      description="A Espanha é campeã do mundo. Depois de nove reportagens, dois modelos e um milhão de Copas por atualização, voltamos ao primeiro palpite para separar acerto, incerteza e aprendizado."
    />
    <ReportEditionSelector current="balanco-final" />

    <section className="border-b border-brand-dark/10 bg-white">
      <div className="mx-auto grid max-w-[1080px] gap-9 px-4 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="font-montserrat text-xs font-black uppercase tracking-widest text-brand-green">Copa do Mundo 2026 encerrada</p>
          <h1 className="mt-3 font-montserrat text-4xl font-black uppercase leading-[0.98] text-brand-dark md:text-6xl">
            A Espanha começou favorita. Terminou campeã. Entre uma coisa e outra, coube uma Copa inteira.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-dark/72">
            Aos 104 jogos, a distância entre 48 candidatas e uma campeã ficou reduzida ao 1 a 0 da Espanha sobre a Argentina. O placar confirmou a seleção que o Modelo de Força colocara no topo em 11 de junho, com 15,9% de chance de título. Não confirmou uma certeza — porque ela nunca existiu.
          </p>
          <div className="mt-7 grid max-w-2xl gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-brand-light p-4"><strong className="font-montserrat text-2xl text-brand-green">14–1</strong><p className="mt-1 text-xs text-brand-dark/50">gols da Espanha na campanha</p></div>
            <div className="rounded-xl bg-brand-light p-4"><strong className="font-montserrat text-2xl text-brand-green">7V · 1E</strong><p className="mt-1 text-xs text-brand-dark/50">oito jogos, nenhuma derrota</p></div>
            <div className="rounded-xl bg-brand-light p-4"><strong className="font-montserrat text-2xl text-brand-green">2º título</strong><p className="mt-1 text-xs text-brand-dark/50">depois da conquista de 2010</p></div>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <PodiumTeam place="Campeã" team="Espanha" result="1 × 0 Argentina na final" tone="text-brand-green" />
          <PodiumTeam place="Vice-campeã" team="Argentina" result="Sete vitórias antes da decisão" tone="text-brand-blue" />
          <PodiumTeam place="3º lugar" team="Inglaterra" result="6 × 4 França" tone="text-brand-dark/50" />
        </div>
      </div>
    </section>

    <section className="bg-[#071F14] py-16 text-white">
      <div className="mx-auto max-w-[1080px] px-4">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <SectionTitle light eyebrow="O sentido de 15,9%" title="Favorita não é sinônimo de campeã antecipada.">
            <p>
              Antes da bola rolar, a Espanha liderava o Modelo de Força. Ainda assim, em 84,1% das Copas simuladas, a taça terminava em outras mãos. Dizer que ela era favorita significava apenas que nenhuma seleção, isoladamente, ocupava uma parcela maior do universo de cenários.
            </p>
            <p>
              O título espanhol é coerente com a previsão inicial. Mas não transforma 15,9% em 100% retroativamente. Esse cuidado é o mesmo que orientou nossa leitura da eliminação brasileira: uma boa projeção pode terminar derrotada; um resultado favorável não torna infalível a decisão que o antecedeu.
            </p>
          </SectionTitle>
          <blockquote className="rounded-2xl border border-white/10 bg-white/[0.06] p-7">
            <Quote className="h-8 w-8 text-brand-neon" />
            <p className="mt-5 font-montserrat text-2xl font-black uppercase leading-tight">
              Previsão boa não elimina a surpresa. Ela dá tamanho à surpresa antes que o placar nos convença de que tudo era óbvio.
            </p>
            <p className="mt-5 text-sm leading-relaxed text-white/50">A ideia que atravessou as nove reportagens da série.</p>
          </blockquote>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-[1080px] px-4 py-16">
      <SectionTitle eyebrow="11 de junho · Antes do primeiro jogo" title="Dois modelos, duas leituras — e o pódio inteiro dentro do radar.">
        <p>
          O Modelo de Força, base da série oficial, combinava forças de ataque e defesa com um modelo de gols Poisson/Dixon–Coles e simulava o torneio completo. A edição bayesiana partia de outra construção estatística e atualizava crenças sobre as seleções. Compará-los é útil justamente porque eles não precisavam concordar.
        </p>
        <p>
          O primeiro colocou a futura campeã em 1º e a futura vice em 6º. O segundo colocou a Espanha em 3º e a Argentina em 5º. A Inglaterra, que terminaria em terceiro, aparecia em 3º no Modelo de Força e em 2º no Bayesiano.
        </p>
      </SectionTitle>

      <div className="mt-9 grid gap-5 lg:grid-cols-2">
        <OpeningRanking title="Modelo de Força · Oficial" subtitle="Probabilidade de título no início da Copa" data={FORCE_OPENING} tone="green" />
        <OpeningRanking title="Modelo Bayesiano" subtitle="Snapshot pré-torneio arquivado" data={BAYES_OPENING} tone="blue" />
      </div>

      <aside className="mt-6 flex gap-4 rounded-xl border border-brand-green/20 bg-brand-green/5 p-5 text-sm leading-relaxed text-brand-dark/70">
        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-brand-green" />
        <p>
          <strong className="text-brand-dark">O recorte que resume a largada:</strong> Espanha, França, Inglaterra e Argentina — as quatro semifinalistas — já estavam entre as seis primeiras do Modelo de Força e entre as cinco primeiras do Bayesiano. Somavam 49,2% e 47,7% da chance de título, respectivamente.
        </p>
      </aside>
    </section>

    <section className="border-y border-brand-dark/10 bg-white py-16">
      <div className="mx-auto max-w-[1080px] px-4">
        <SectionTitle eyebrow="A Copa em movimento" title="A favorita perdeu terreno, recuperou-o e chegou à final na frente.">
          <p>
            A previsão não ficou congelada em 11 de junho. Cada resultado alterou forças, adversários e caminhos possíveis. O empate espanhol com Cabo Verde na estreia ajudou a derrubar sua chance; a Argentina cresceu durante os grupos; a França liderou boa parte do mata-mata. Na semifinal, porém, a Espanha venceu a então líder por 2 a 0.
          </p>
        </SectionTitle>

        <div className="mt-10 grid gap-3 lg:grid-cols-5">
          {TITLE_TIMELINE.map((item, index) => (
            <article key={item.date} className={`relative rounded-xl border p-5 ${index === TITLE_TIMELINE.length - 1 ? 'border-brand-green bg-brand-green text-white' : 'border-brand-dark/10 bg-brand-light'}`}>
              <div className="flex items-center justify-between gap-3">
                <p className={`font-montserrat text-xs font-black uppercase ${index === TITLE_TIMELINE.length - 1 ? 'text-brand-neon' : 'text-brand-green'}`}>{item.date}</p>
                <span className={`text-[9px] font-black uppercase ${index === TITLE_TIMELINE.length - 1 ? 'text-white/55' : 'text-brand-dark/35'}`}>{item.stage}</span>
              </div>
              <div className="mt-5 space-y-2">
                <p className="flex items-center justify-between gap-2 text-sm"><span className={index === TITLE_TIMELINE.length - 1 ? 'text-white/65' : 'text-brand-dark/55'}>Espanha</span><strong className="font-montserrat">{item.spain}</strong></p>
                <p className="flex items-center justify-between gap-2 text-sm"><span className={index === TITLE_TIMELINE.length - 1 ? 'text-white/65' : 'text-brand-dark/55'}>Argentina</span><strong className="font-montserrat">{item.argentina}</strong></p>
              </div>
              <p className={`mt-5 border-t pt-4 text-xs leading-relaxed ${index === TITLE_TIMELINE.length - 1 ? 'border-white/15 text-white/65' : 'border-brand-dark/10 text-brand-dark/50'}`}>{item.text}</p>
            </article>
          ))}
        </div>
        <p className="mt-5 text-center text-[10px] font-bold uppercase tracking-wider text-brand-dark/35">Probabilidades do Modelo de Força publicadas em cada atualização · a final usa a chance de levantar a taça, incluindo prorrogação e pênaltis</p>
      </div>
    </section>

    <section className="mx-auto max-w-[1080px] px-4 py-16">
      <SectionTitle eyebrow="O teste jogo a jogo" title="Na fase de grupos, houve equilíbrio estatístico entre os dois modelos.">
        <p>
          Acertar a campeã é uma história poderosa, mas não basta para avaliar um sistema probabilístico. O teste mais rigoroso pergunta, em cada partida, se as probabilidades publicadas foram informativas e bem calibradas. A amostra diretamente comparável reúne os 72 jogos da fase de grupos, sempre usando o retrato disponível antes de cada rodada.
        </p>
        <p>
          O Bayesiano acertou mais vezes o resultado de maior probabilidade. O Modelo de Força foi melhor nas métricas que consideram toda a distribuição — vitória, empate e derrota — e também na calibração. Com apenas 72 jogos, porém, os intervalos de incerteza se sobrepõem: tecnicamente, não há evidência para declarar um vencedor entre os dois.
        </p>
      </SectionTitle>

      <div className="mt-9 overflow-hidden rounded-2xl border border-brand-dark/10 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-3 grid gap-3 border-b border-brand-dark/10 pb-4 sm:grid-cols-[1.25fr_0.7fr_0.7fr]">
          <p className="font-montserrat text-[10px] font-black uppercase tracking-widest text-brand-dark/40">Métrica · 72 jogos</p>
          <p className="font-montserrat text-[10px] font-black uppercase tracking-widest text-brand-green">Modelo de Força</p>
          <p className="font-montserrat text-[10px] font-black uppercase tracking-widest text-brand-blue">Bayesiano</p>
        </div>
        <Metric label="Acerto" force="61,1%" bayesian="63,9%" detail="Resultado de maior probabilidade comparado ao placar após 90 minutos." best="bayesian" />
        <Metric label="Brier" force="0,531" bayesian="0,549" detail="Menor é melhor; penaliza a distância entre as três probabilidades e o resultado." best="force" />
        <Metric label="RPS" force="0,165" bayesian="0,173" detail="Menor é melhor; outra medida da qualidade da distribuição probabilística." best="force" />
        <Metric label="Log loss" force="0,897" bayesian="0,930" detail="Menor é melhor; pune especialmente o excesso de confiança em um resultado errado." best="force" />
        <Metric label="Calibração (ECE)" force="0,067" bayesian="0,084" detail="Menor é melhor; compara o que foi previsto com a frequência em que ocorreu." best="force" />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-brand-dark/10 bg-white p-6">
          <div className="flex items-center gap-3 text-brand-green"><Scale className="h-5 w-5" /><p className="font-montserrat text-xs font-black uppercase tracking-wider">Como ler o empate</p></div>
          <p className="mt-4 text-sm leading-relaxed text-brand-dark/65">
            A diferença de 2,8 pontos no acerto parece clara, mas cabe confortavelmente na variação esperada de uma amostra desse tamanho. Rankings pontuais ajudam a descrever o torneio; não autorizam uma conclusão universal sobre qual modelo será melhor na próxima Copa.
          </p>
        </article>
        <article className="rounded-xl border border-brand-dark/10 bg-white p-6">
          <div className="flex items-center gap-3 text-brand-blue"><BookOpenCheck className="h-5 w-5" /><p className="font-montserrat text-xs font-black uppercase tracking-wider">Por que o recorte termina nos grupos</p></div>
          <p className="mt-4 text-sm leading-relaxed text-brand-dark/65">
            O arquivo do mata-mata não contém snapshots pré-jogo simétricos dos dois modelos para todas as 32 partidas. Misturar etapas ou usar probabilidades posteriores produziria uma comparação artificial. O limite faz parte do resultado, não é uma nota escondida.
          </p>
        </article>
      </div>
    </section>

    <section className="bg-[#101D15] py-16 text-white">
      <div className="mx-auto max-w-[1080px] px-4">
        <SectionTitle light eyebrow="Acertos, erros e futebol" title="O modelo enxergou a hierarquia. A Copa preservou o direito de contrariá-la.">
          <p>
            O Modelo de Força apontou a campeã e manteve no topo as seleções que formariam as semifinais. Também projetou a decisão Espanha × Argentina entre as finais mais frequentes antes do torneio. São acertos relevantes de estrutura, não apenas a coincidência de um nome.
          </p>
          <p>
            Mas o caminho recusou qualquer leitura triunfalista. A Espanha tinha 76,1% para vencer Cabo Verde na estreia e empatou. O Brasil era favorito contra a Noruega e foi eliminado. A França chegou à semifinal na liderança da projeção e perdeu por 2 a 0. Na disputa do terceiro lugar, a Inglaterra contrariou o favoritismo francês. A probabilidade organizou os possíveis; a bola escolheu um deles.
          </p>
        </SectionTitle>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-white/[0.06] p-6">
            <Target className="h-6 w-6 text-brand-neon" />
            <h3 className="mt-4 font-montserrat text-xl font-black uppercase">O que acertou</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/62">A campeã no topo do Modelo de Força; o pódio dentro da elite inicial dos dois modelos; quatro semifinalistas já concentradas no grupo principal.</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/[0.06] p-6">
            <BarChart3 className="h-6 w-6 text-brand-neon" />
            <h3 className="mt-4 font-montserrat text-xl font-black uppercase">O que aprendeu</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/62">O Bayesiano ganhou no acerto; o Modelo de Força, nas métricas probabilísticas. A amostra não separou estatisticamente as abordagens.</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/[0.06] p-6">
            <Clock3 className="h-6 w-6 text-brand-neon" />
            <h3 className="mt-4 font-montserrat text-xl font-black uppercase">O que permanece</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/62">Os snapshots, resultados e critérios ficam arquivados. Previsão confiável precisa poder ser julgada depois, inclusive onde falhou.</p>
          </article>
        </div>
      </div>
    </section>

    <section className="border-b border-brand-dark/10 bg-white">
      <div className="mx-auto grid max-w-[1080px] gap-8 px-4 py-16 md:grid-cols-[auto_1fr] md:items-start">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-green text-white"><Medal className="h-8 w-8" /></div>
        <div>
          <p className="font-montserrat text-xs font-black uppercase tracking-widest text-brand-green">Epílogo</p>
          <h2 className="mt-2 max-w-4xl font-montserrat text-3xl font-black uppercase leading-none text-brand-dark md:text-5xl">O fim da Copa não encerra a pergunta. Preserva a resposta que demos antes.</h2>
          <div className="mt-6 max-w-3xl space-y-4 leading-relaxed text-brand-dark/68">
            <p>
              Durante 39 dias, esta série acompanhou o torneio sem apagar o passado a cada atualização. Publicamos a largada, as mudanças das três rodadas, o novo tabuleiro do mata-mata, as oitavas, a eliminação brasileira, as quartas, as semifinais e a final. Agora fechamos o percurso no mesmo lugar em que começamos: diante da incerteza.
            </p>
            <p>
              A Espanha levou a taça. O Modelo de Força levou o principal acerto da série. O Bayesiano mostrou que outra formulação podia contar uma história diferente e ainda competitiva. E o futebol lembrou, 104 vezes, por que uma previsão séria deve ser humilde: o objetivo não é adivinhar o futuro, mas descrevê-lo honestamente antes que ele aconteça.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-brand-light">
      <div className="mx-auto max-w-[900px] px-4 py-10 text-center">
        <p className="font-montserrat text-[10px] font-black uppercase tracking-widest text-brand-dark/35">Nota metodológica e fontes</p>
        <p className="mt-3 text-xs leading-relaxed text-brand-dark/48">
          Resultados oficiais da Copa do Mundo 2026, encerrada em 19/07/2026. Probabilidades de título dos snapshots arquivados em 11/06/2026 e das atualizações do Modelo de Força. Avaliação jogo a jogo calculada sobre 72 partidas da fase de grupos, com previsões tomadas antes de cada rodada; intervalos de confiança por bootstrap não paramétrico com 30.000 reamostras. Brier, RPS, log loss e ECE: menor é melhor. O RPS é mantido para comparabilidade, embora a ordenação vitória–empate–derrota seja arbitrária em campo neutro.
        </p>
      </div>
    </section>
  </div>
);

export default ClosingReportPage;
