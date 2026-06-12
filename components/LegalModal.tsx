import React, { useEffect } from 'react';
import { X, FileText, ShieldCheck, Mail } from 'lucide-react';

export type LegalTab = 'terms' | 'privacy';

interface LegalModalProps {
  open: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
}

const CONTACT_EMAIL = 'equipeprevisaoesportiva@gmail.com';
const LAST_UPDATED = 'Junho de 2026';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="mt-6 mb-2 font-montserrat text-sm font-black uppercase tracking-wide text-brand-dark first:mt-0">
    {children}
  </h3>
);

const Paragraph: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="mb-3 text-sm leading-relaxed text-brand-dark/70">{children}</p>
);

const Bullets: React.FC<{ items: React.ReactNode[] }> = ({ items }) => (
  <ul className="mb-3 ml-4 list-disc space-y-1.5 text-sm leading-relaxed text-brand-dark/70 marker:text-brand-green">
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);

const TermsContent: React.FC = () => (
  <div>
    <SectionTitle>1. Sobre o projeto</SectionTitle>
    <Paragraph>
      O Previsão Esportiva é uma iniciativa acadêmica de pesquisa e divulgação científica dedicada à análise
      probabilística do futebol. Todo o conteúdo do site — probabilidades, simulações, metodologia e materiais — tem
      finalidade educacional, informativa e científica.
    </Paragraph>

    <SectionTitle>2. Natureza das informações</SectionTitle>
    <Paragraph>
      As probabilidades apresentadas são estimativas estatísticas geradas por modelos matemáticos a partir de dados
      anteriores às partidas. Elas representam cenários e frequências esperadas — não são previsões garantidas nem
      asseguram qualquer resultado.
    </Paragraph>
    <Paragraph>
      O Previsão Esportiva <strong>não tem vínculo com casas de apostas</strong>, não comercializa palpites e não
      incentiva a prática de jogos de azar. As informações <strong>não constituem aconselhamento de apostas</strong> ou
      recomendação financeira de qualquer natureza.
    </Paragraph>

    <SectionTitle>3. Uso do site</SectionTitle>
    <Paragraph>
      O acesso e o uso do site são pessoais e não comerciais. É vedado utilizar o conteúdo de forma indevida, realizar
      acessos automatizados abusivos, tentar comprometer a segurança da plataforma ou reproduzir o conteúdo sem a devida
      citação da fonte.
    </Paragraph>

    <SectionTitle>4. Bolão</SectionTitle>
    <Bullets
      items={[
        'A participação é gratuita, voluntária e tem caráter recreativo e científico — não é uma aposta.',
        'É permitido um único envio por participante, identificado pelo e-mail informado.',
        'Após o envio, os palpites são definitivos e não podem ser alterados ou excluídos pelo participante.',
        'A premiação é simbólica (uma caixa de bombons Sonho de Valsa ao participante com maior pontuação no grupo).',
        'Os critérios de pontuação e a apuração são definidos e conduzidos pela organização do projeto, cujas decisões são finais.',
      ]}
    />

    <SectionTitle>5. Propriedade intelectual</SectionTitle>
    <Paragraph>
      A marca, os textos, a metodologia e os modelos estatísticos do Previsão Esportiva pertencem ao projeto e aos seus
      pesquisadores. O uso de qualquer conteúdo deve ser acompanhado de citação à fonte.
    </Paragraph>

    <SectionTitle>6. Limitação de responsabilidade</SectionTitle>
    <Paragraph>
      O site é fornecido "como está", sem garantia de disponibilidade ininterrupta. Parte dos dados utilizados provém de
      fontes de terceiros (ranking FIFA, rating ELO, valores de mercado, entre outros) e pode conter imprecisões alheias
      ao controle do projeto.
    </Paragraph>

    <SectionTitle>7. Alterações</SectionTitle>
    <Paragraph>
      Estes Termos podem ser atualizados a qualquer momento. A data da última revisão está indicada ao final deste
      documento.
    </Paragraph>

    <SectionTitle>8. Contato</SectionTitle>
    <Paragraph>
      Dúvidas sobre estes Termos podem ser encaminhadas para{' '}
      <a className="font-semibold text-brand-green underline" href={`mailto:${CONTACT_EMAIL}`}>
        {CONTACT_EMAIL}
      </a>
      .
    </Paragraph>
  </div>
);

const PrivacyContent: React.FC = () => (
  <div>
    <SectionTitle>1. Controlador dos dados</SectionTitle>
    <Paragraph>
      O tratamento de dados pessoais descrito nesta política é realizado pelo <strong>Projeto Previsão Esportiva</strong>,
      iniciativa acadêmica de pesquisa e divulgação científica. Contato para assuntos de privacidade:{' '}
      <a className="font-semibold text-brand-green underline" href={`mailto:${CONTACT_EMAIL}`}>
        {CONTACT_EMAIL}
      </a>
      .
    </Paragraph>

    <SectionTitle>2. Dados que coletamos</SectionTitle>
    <Paragraph>
      A navegação geral pelo site (probabilidades, mapa, metodologia, equipe etc.) não exige cadastro. Coletamos dados
      pessoais apenas quando você opta por participar do Bolão:
    </Paragraph>
    <Bullets
      items={[
        'Nome e e-mail informados no formulário;',
        'Respostas do questionário de pesquisa (nível de conhecimento em futebol, frequência com que acompanha o esporte, experiência em bolões e seleção favorita);',
        'Os palpites enviados (placares e campeão).',
      ]}
    />

    <SectionTitle>3. Para que usamos seus dados</SectionTitle>
    <Bullets
      items={[
        'Gestão do bolão: identificar sua participação, garantir um único envio por pessoa e contatá-lo a respeito da premiação;',
        'Pesquisa científica: aprimorar modelos de previsão estatística esportiva. Nas análises e publicações, os dados são utilizados de forma agregada e anonimizada.',
      ]}
    />

    <SectionTitle>4. Base legal</SectionTitle>
    <Paragraph>
      O tratamento se fundamenta no seu <strong>consentimento</strong> (art. 7º, I, da LGPD) e, para fins de estudo, na
      hipótese de <strong>realização de pesquisa</strong> (art. 7º, IV, da LGPD), com anonimização sempre que possível.
    </Paragraph>

    <SectionTitle>5. Compartilhamento e operadores</SectionTitle>
    <Paragraph>
      Não vendemos nem compartilhamos seus dados pessoais com terceiros para fins comerciais ou publicitários. Para
      operar o serviço, utilizamos o <strong>Google Firebase / Firestore</strong> (armazenamento dos envios) e o
      <strong> Google reCAPTCHA</strong> (proteção contra envios automatizados/abuso). Esses serviços tratam dados em nome
      do projeto conforme suas próprias políticas.
    </Paragraph>

    <SectionTitle>6. Armazenamento, segurança e retenção</SectionTitle>
    <Paragraph>
      Os dados são armazenados em infraestrutura do Google Firebase, com regras de acesso restrito. Mantemos os dados
      pelo período necessário à condução do bolão e da pesquisa, após o qual são eliminados ou definitivamente
      anonimizados.
    </Paragraph>

    <SectionTitle>7. Seus direitos</SectionTitle>
    <Paragraph>
      Nos termos da LGPD, você pode solicitar a confirmação do tratamento, o acesso, a correção, a anonimização, a
      eliminação dos seus dados e a revogação do consentimento. Para exercer esses direitos, escreva para{' '}
      <a className="font-semibold text-brand-green underline" href={`mailto:${CONTACT_EMAIL}`}>
        {CONTACT_EMAIL}
      </a>
      .
    </Paragraph>

    <SectionTitle>8. Cookies e armazenamento local</SectionTitle>
    <Paragraph>
      Utilizamos armazenamento local do navegador apenas para salvar o rascunho do seu bolão no próprio dispositivo,
      evitando que você perca o preenchimento. Não usamos cookies de rastreamento publicitário. O Google reCAPTCHA pode
      utilizar cookies próprios para distinguir humanos de robôs.
    </Paragraph>

    <SectionTitle>9. Menores de idade</SectionTitle>
    <Paragraph>
      O bolão não é direcionado a menores de 18 anos. A participação de menores deve ocorrer com o consentimento e a
      supervisão dos responsáveis legais.
    </Paragraph>

    <SectionTitle>10. Alterações</SectionTitle>
    <Paragraph>
      Esta política pode ser atualizada periodicamente. Recomendamos a consulta sempre que participar do bolão. A data da
      última revisão consta abaixo.
    </Paragraph>
  </div>
);

const LegalModal: React.FC<LegalModalProps> = ({ open, onClose, initialTab = 'terms' }) => {
  const [tab, setTab] = React.useState<LegalTab>(initialTab);

  useEffect(() => {
    if (open) setTab(initialTab);
  }, [open, initialTab]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Termos de Uso e Política de Privacidade"
    >
      <div
        className="relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-brand-dark/10 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-dark/10 bg-brand-light/60 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-brand-green" />
            <span className="font-montserrat text-sm font-black uppercase tracking-wide text-brand-dark">
              Termos e Privacidade
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-full p-1.5 text-brand-dark/50 transition hover:bg-brand-dark/5 hover:text-brand-dark"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-brand-dark/10 px-5 pt-4">
          <button
            type="button"
            onClick={() => setTab('terms')}
            className={`flex items-center gap-2 border-b-2 px-3 py-2.5 font-montserrat text-xs font-bold uppercase tracking-wider transition-colors ${
              tab === 'terms'
                ? 'border-brand-green text-brand-green'
                : 'border-transparent text-brand-dark/45 hover:text-brand-dark'
            }`}
          >
            <FileText className="h-4 w-4" />
            Termos de Uso
          </button>
          <button
            type="button"
            onClick={() => setTab('privacy')}
            className={`flex items-center gap-2 border-b-2 px-3 py-2.5 font-montserrat text-xs font-bold uppercase tracking-wider transition-colors ${
              tab === 'privacy'
                ? 'border-brand-green text-brand-green'
                : 'border-transparent text-brand-dark/45 hover:text-brand-dark'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Privacidade
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {tab === 'terms' ? <TermsContent /> : <PrivacyContent />}

          <div className="mt-8 flex items-center gap-2 border-t border-brand-dark/10 pt-4 text-xs text-brand-dark/45">
            <Mail className="h-3.5 w-3.5 text-brand-green" />
            <span>
              {CONTACT_EMAIL} · Última atualização: {LAST_UPDATED}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-brand-dark/10 bg-brand-light/40 px-5 py-3 text-right">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-brand-green px-5 py-2.5 font-montserrat text-xs font-black uppercase tracking-wider text-white transition hover:bg-brand-grad2"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
