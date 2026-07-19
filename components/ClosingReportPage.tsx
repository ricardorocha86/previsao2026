import { BarChart3, CheckCircle2, Medal, Target, Trophy } from 'lucide-react';
import PageHeader from './PageHeader';
import ReportEditionSelector from './ReportEditionSelector';

const fmt = (value: number) => value.toFixed(1).replace('.', ',');

const PodiumTeam = ({ place, team, result, tone }: { place: string; team: string; result: string; tone: string }) => (
  <article className="rounded-2xl border border-brand-dark/10 bg-white p-5 shadow-sm">
    <p className={`font-montserrat text-[10px] font-black uppercase tracking-widest ${tone}`}>{place}</p>
    <p className="mt-3 font-montserrat text-2xl font-black uppercase text-brand-dark">{team}</p>
    <p className="mt-1 text-sm text-brand-dark/55">{result}</p>
  </article>
);

const Metric = ({ label, official, bayesian, detail }: { label: string; official: string; bayesian: string; detail: string }) => (
  <div className="grid gap-3 border-t border-brand-dark/10 py-4 sm:grid-cols-[1.1fr_0.75fr_0.75fr] sm:items-center">
    <div>
      <p className="font-montserrat text-xs font-black uppercase text-brand-dark">{label}</p>
      <p className="mt-1 text-xs leading-relaxed text-brand-dark/50">{detail}</p>
    </div>
    <p className="font-montserrat text-2xl font-black text-brand-green">{official}</p>
    <p className="font-montserrat text-2xl font-black text-brand-blue">{bayesian}</p>
  </div>
);

const ClosingReportPage = () => (
  <div className="bg-brand-light font-opensans">
    <PageHeader
      icon={Trophy}
      eyebrow="Reportagem 09 · Balanço final · 104 partidas"
      title="A previsão encontra"
      accent="a taça."
      description="A Espanha é campeã do mundo. O desfecho fecha a Copa de 2026 e abre o balanço: o que os modelos anteciparam, onde acertaram e o que ainda precisamos aprender."
    />
    <ReportEditionSelector current="balanco-final" />

    <section className="border-b border-brand-dark/10 bg-white">
      <div className="mx-auto grid max-w-[1080px] gap-8 px-4 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="font-montserrat text-xs font-black uppercase tracking-widest text-brand-green">Copa do Mundo 2026 encerrada</p>
          <h1 className="mt-3 font-montserrat text-4xl font-black uppercase leading-none text-brand-dark md:text-6xl">
            Espanha campeã. A previsão não era certeza — era a melhor leitura disponível.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-dark/70">
            A Espanha venceu a Argentina por 1 a 0 na final e levantou a taça. No primeiro retrato do torneio, publicado em 11 de junho, o modelo oficial já colocava a seleção espanhola no topo da corrida, com 15,9% de chance de título.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <PodiumTeam place="Campeã" team="Espanha" result="1 × 0 Argentina na final" tone="text-brand-green" />
          <PodiumTeam place="Vice-campeã" team="Argentina" result="Finalista depois de vencer a Inglaterra" tone="text-brand-blue" />
          <PodiumTeam place="3º lugar" team="Inglaterra" result="6 × 4 França" tone="text-brand-dark/50" />
        </div>
      </div>
    </section>

    <section className="bg-[#071F14] py-16 text-white">
      <div className="mx-auto max-w-[1080px] px-4">
        <p className="font-montserrat text-xs font-black uppercase tracking-widest text-brand-neon">Balanço em duas partes</p>
        <h2 className="mt-3 max-w-4xl font-montserrat text-3xl font-black uppercase leading-none md:text-5xl">
          Primeiro, a seleção da campeã. Depois, a qualidade das probabilidades jogo a jogo.
        </h2>
        <div className="mt-9 grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/[0.06] p-7">
            <div className="flex items-center gap-3 text-brand-neon"><Target className="h-6 w-6" /><span className="font-montserrat text-xs font-black uppercase tracking-widest">Parte 1 · Antes da bola rolar</span></div>
            <h3 className="mt-5 font-montserrat text-2xl font-black uppercase leading-none">O modelo oficial acertou a líder da projeção.</h3>
            <p className="mt-4 leading-relaxed text-white/70">
              A Espanha abriu a competição em primeiro lugar, com 15,9%. É uma probabilidade relevante, mas distante de uma promessa: os outros 84,1% dos cenários ainda distribuíam a taça entre as demais seleções. O valor do modelo foi ordenar corretamente a incerteza, não anunciar um resultado inevitável.
            </p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/[0.06] p-7">
            <div className="flex items-center gap-3 text-brand-neon"><BarChart3 className="h-6 w-6" /><span className="font-montserrat text-xs font-black uppercase tracking-widest">Parte 2 · Ao longo da Copa</span></div>
            <h3 className="mt-5 font-montserrat text-2xl font-black uppercase leading-none">Probabilidades também se medem partida por partida.</h3>
            <p className="mt-4 leading-relaxed text-white/70">
              A comparação entre as duas abordagens usa métricas próprias — acerto, Brier, RPS, log loss e calibração — porque uma boa previsão precisa atribuir mais chance ao que acontece sem exagerar a confiança nos cenários que não acontecem.
            </p>
          </article>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-[1080px] px-4 py-16">
      <div className="max-w-3xl">
        <p className="font-montserrat text-xs font-black uppercase tracking-widest text-brand-green">Leitura comparável já auditada</p>
        <h2 className="mt-3 font-montserrat text-3xl font-black uppercase leading-none text-brand-dark md:text-4xl">Na fase de grupos, os dois modelos tiveram desempenho competitivo.</h2>
        <p className="mt-5 text-base leading-relaxed text-brand-dark/65">
          A etapa com as duas séries completas e diretamente comparáveis cobre os 72 jogos da fase de grupos. O modelo bayesiano teve maior taxa de acerto; o modelo oficial teve Brier e calibração pontualmente melhores. As diferenças devem ser lidas com cautela: os intervalos de incerteza se sobrepõem.
        </p>
      </div>

      <div className="mt-9 overflow-hidden rounded-2xl border border-brand-dark/10 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-3 grid gap-3 border-b border-brand-dark/10 pb-4 sm:grid-cols-[1.1fr_0.75fr_0.75fr]">
          <p className="font-montserrat text-[10px] font-black uppercase tracking-widest text-brand-dark/40">Métrica · 72 jogos</p>
          <p className="font-montserrat text-[10px] font-black uppercase tracking-widest text-brand-green">Modelo oficial</p>
          <p className="font-montserrat text-[10px] font-black uppercase tracking-widest text-brand-blue">Edição bayesiana</p>
        </div>
        <Metric label="Acerto" official="61,1%" bayesian="63,9%" detail="Resultado de maior probabilidade comparado ao desfecho observado." />
        <Metric label="Brier" official="0,531" bayesian="0,549" detail="Menor é melhor; avalia a distância entre probabilidades e resultado." />
        <Metric label="RPS" official="0,165" bayesian="0,173" detail="Menor é melhor; mede a qualidade probabilística dos três resultados." />
        <Metric label="Calibração (ECE)" official="0,067" bayesian="0,084" detail="Menor é melhor; verifica se probabilidades publicadas se realizam na frequência esperada." />
      </div>

      <aside className="mt-6 flex gap-4 rounded-xl border border-brand-green/20 bg-brand-green/5 p-5 text-sm leading-relaxed text-brand-dark/70">
        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-brand-green" />
        <p><strong className="text-brand-dark">Leitura honesta:</strong> o campeonato confirma que o modelo oficial encontrou a campeã como sua principal candidata inicial. O balanço completo do mata-mata será incorporado ao relatório técnico com as previsões correspondentes a cada confronto; não tratamos probabilidade posterior como se tivesse sido previsão pré-jogo.</p>
      </aside>
    </section>

    <section className="border-y border-brand-dark/10 bg-white">
      <div className="mx-auto max-w-[1080px] px-4 py-14">
        <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-start">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-green text-white"><Medal className="h-8 w-8" /></div>
          <div>
            <p className="font-montserrat text-xs font-black uppercase tracking-widest text-brand-green">O que fica</p>
            <h2 className="mt-2 font-montserrat text-3xl font-black uppercase leading-none text-brand-dark">Previsão boa não elimina surpresa. Ela a coloca em escala.</h2>
            <p className="mt-5 max-w-3xl leading-relaxed text-brand-dark/65">
              A Copa começou com 48 seleções e uma favorita de 15,9%. Terminou com a seleção mais bem posicionada pela projeção inicial levantando a taça. É um resultado forte, mas não é licença para transformar uma edição em certeza. O acervo da Copa 2026 permanece aberto para que as escolhas, os acertos e os erros possam ser examinados com transparência.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-brand-light">
      <div className="mx-auto max-w-[840px] px-4 py-10 text-center">
        <p className="text-xs leading-relaxed text-brand-dark/45">Dados: resultados oficiais da Copa do Mundo 2026, encerrada em 19/07/2026. A avaliação comparável por partida usa as previsões publicadas antes dos 72 jogos da fase de grupos. Métricas probabilísticas menores são melhores, exceto acerto.</p>
      </div>
    </section>
  </div>
);

export default ClosingReportPage;
