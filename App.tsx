import React, { Suspense, lazy, useEffect, useState } from 'react';
import { ArrowUpRight, ChevronDown, Instagram, Mail, Menu, ShieldCheck, X } from 'lucide-react';
import { Logo } from './components/Logo';
import Hero from './components/Hero';
import HomeOverview from './components/HomeOverview';
import HexaCallout from './components/HexaCallout';
import MediaHighlight from './components/MediaHighlight';
import SponsorBar from './components/SponsorBar';
import LegalModal, { LegalTab } from './components/LegalModal';
import InstitutionLogos from './components/InstitutionLogos';
import { Analytics } from '@vercel/analytics/react';
import resultadosJogos from './assets/resultados_jogos.json';
import { PARTNER_INSTITUTIONS, RESEARCH_CENTERS } from './data/institutions';

type ViewState = 'home' | 'copa' | 'mapa' | 'simulador' | 'bolao' | 'team' | 'science' | 'media' | 'methodology' | 'hexa' | 'hexa-oitavas' | 'hexa-rodada2' | 'hexa-inicio' | 'pos-rodada';

const WorldCupHub = lazy(() => import('./components/WorldCupHub'));
const MapPage = lazy(() => import('./components/MapPage'));
const SimulatorPage = lazy(() => import('./components/SimulatorPage'));
const BolaoPage = lazy(() => import('./components/BolaoPage'));
const TeamPage = lazy(() => import('./components/TeamPage'));
const SciencePage = lazy(() => import('./components/SciencePage'));
const MediaPage = lazy(() => import('./components/MediaPage'));
const MethodologyPage = lazy(() => import('./components/MethodologyPage'));
const HexaPage = lazy(() => import('./components/HexaPage'));
const PostRoundPage = lazy(() => import('./components/PostRoundPage'));
const SecondRoundPage = lazy(() => import('./components/SecondRoundPage'));
const KnockoutPage = lazy(() => import('./components/KnockoutPage'));
const RoundOf16Page = lazy(() => import('./components/RoundOf16Page'));

const ROUTES: Record<ViewState, string> = {
  home: '/',
  copa: '/copa-2026',
  mapa: '/mapa',
  simulador: '/simulador',
  bolao: '/bolao',
  methodology: '/metodologia',
  science: '/pesquisa',
  media: '/midia',
  team: '/equipe',
  hexa: '/caminho-do-hexa',
  'hexa-oitavas': '/caminho-do-hexa/inicio-das-oitavas',
  'hexa-rodada2': '/caminho-do-hexa/fim-da-segunda-rodada',
  'hexa-inicio': '/caminho-do-hexa/inicio-da-copa',
  'pos-rodada': '/a-copa-mudou-de-rosto',
};

const SITE_ORIGIN = 'https://www.previsaoesportiva.com.br';

// Progresso da Copa: jogos encerrados de um total de 104 partidas do torneio.
const TOTAL_JOGOS_COPA = 104;
const JOGOS_ENCERRADOS = (resultadosJogos as Array<{ Status?: string }>).filter(
  (jogo) => jogo.Status === 'encerrado',
).length;
const PCT_COPA_CONCLUIDA = ((JOGOS_ENCERRADOS / TOTAL_JOGOS_COPA) * 100).toFixed(1);

const CopaProgressBadge: React.FC = () => {
  const radius = 11;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - JOGOS_ENCERRADOS / TOTAL_JOGOS_COPA);

  return (
    <div
      className="hidden sm:flex items-center gap-2.5"
      aria-label={`${JOGOS_ENCERRADOS} de ${TOTAL_JOGOS_COPA} jogos encerrados, ${PCT_COPA_CONCLUIDA}% da Copa concluída`}
    >
      <svg width="28" height="28" viewBox="0 0 28 28" className="-rotate-90 flex-shrink-0" aria-hidden="true">
        <circle cx="14" cy="14" r={radius} fill="none" stroke="#2E2E2E" strokeOpacity="0.1" strokeWidth="2.5" />
        <circle
          cx="14"
          cy="14"
          r={radius}
          fill="none"
          stroke="#209927"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <span className="flex flex-col leading-snug">
        <span className="font-montserrat text-[10px] font-bold uppercase tracking-widest text-brand-dark/55">
          Copa do Mundo 2026
        </span>
        <span className="font-montserrat text-[10.5px] text-brand-green">
          <span className="font-bold">{PCT_COPA_CONCLUIDA}% concluída</span>
          {' '}
          <span className="font-normal opacity-60">({JOGOS_ENCERRADOS}/{TOTAL_JOGOS_COPA})</span>
        </span>
      </span>
    </div>
  );
};

const DEFAULT_DESCRIPTION =
  'Previsões probabilísticas para a Copa do Mundo 2026 com metodologia científica. Projeto acadêmico de pesquisa e divulgação científica em modelagem estatística do futebol.';

const PAGE_META: Record<ViewState, { title: string; description: string }> = {
  home: { title: 'Previsão Esportiva - Copa do Mundo 2026 🏆', description: DEFAULT_DESCRIPTION },
  copa: {
    title: 'Previsões Copa do Mundo 2026 | Previsão Esportiva',
    description: 'Probabilidades de cada seleção avançar de fase e ser campeã da Copa do Mundo 2026, a partir de simulação estatística do torneio.',
  },
  mapa: {
    title: 'Mapa das Seleções | Previsão Esportiva',
    description: 'Explore dados das 48 seleções classificadas para a Copa do Mundo 2026 em um mapa interativo.',
  },
  simulador: {
    title: 'Simulador Interativo | Previsão Esportiva',
    description: 'Simule partidas e cenários da Copa do Mundo 2026 com os modelos estatísticos do Previsão Esportiva.',
  },
  bolao: {
    title: 'Bolão Copa do Mundo 2026 | Previsão Esportiva',
    description: 'Faça seus palpites para a Copa do Mundo 2026 e participe do bolão do projeto Previsão Esportiva.',
  },
  methodology: {
    title: 'Metodologia | Previsão Esportiva',
    description: 'Como transformamos dados de seleções em probabilidades: o modelo estatístico do Previsão Esportiva, passo a passo.',
  },
  science: {
    title: 'Artigos Científicos | Previsão Esportiva',
    description: 'Publicações acadêmicas que fundamentam a metodologia estatística do projeto Previsão Esportiva.',
  },
  media: {
    title: 'Na Mídia | Previsão Esportiva',
    description: 'Cobertura jornalística e repercussão pública das previsões científicas do projeto Previsão Esportiva.',
  },
  team: {
    title: 'Equipe de Pesquisa | Previsão Esportiva',
    description: 'Conheça os pesquisadores e as instituições por trás do projeto Previsão Esportiva.',
  },
  hexa: {
    title: 'Agora É Mata-Mata | Previsão Esportiva',
    description: 'Com os 32 classificados definidos, o Brasil enfrenta o Japão nos 16-avos; França e Argentina abrem distância na nova simulação do mata-mata.',
  },
  'hexa-oitavas': {
    title: 'França Dispara e o Brasil Respira | Previsão Esportiva',
    description: 'Após os 16-avos, a França chega a 32,8% de chance de título e o Brasil encara a Noruega com 61,5% de probabilidade de avanço.',
  },
  'hexa-rodada2': {
    title: 'O Hexa Ficou Mais Difícil | Previsão Esportiva',
    description: 'Após a segunda rodada, o Brasil chega a 100% de classificação nas simulações, mas cai para 5,3% de chance de título; Argentina sobe e França mantém a liderança.',
  },
  'hexa-inicio': {
    title: 'O Caminho Rumo ao Hexa 🇧🇷 | Previsão Esportiva',
    description: 'O retrato de um milhão de simulações antes de a bola rolar na Copa do Mundo de 2026.',
  },
  'pos-rodada': {
    title: 'A Copa Mudou de Rosto | Previsão Esportiva',
    description: 'O que a primeira rodada da Copa do Mundo de 2026 mudou nas probabilidades: França assume a ponta, Brasil recua e novas forças entram no mapa.',
  },
};

// Reordered as requested: Copa 2026, Bolão, Mapa, Simulador (Metodologia moved to dropdown)
const NAV_ITEMS: Array<{ view: ViewState; label: string; mobileLabel?: string }> = [
  { view: 'hexa', label: '🇧🇷 Hexa' },
  { view: 'copa', label: '🏆 Copa 2026' },
  { view: 'bolao', label: '⚽ Bolão' },
  { view: 'mapa', label: '🗺️ Mapa' },
  { view: 'simulador', label: '📊 Simulador' },
];

const PROJECT_NAV_ITEMS: Array<{ view: ViewState; label: string; mobileLabel?: string }> = [
  { view: 'science', label: 'Artigos Científicos', mobileLabel: 'Artigos Científicos' },
  { view: 'media', label: 'Destaques na Mídia', mobileLabel: 'Destaques na Mídia' },
  { view: 'team', label: 'Membros da Equipe', mobileLabel: 'Membros da Equipe' },
];

const getViewFromLocation = (): ViewState => {
  const hashPath = window.location.hash.startsWith('#/') ? window.location.hash.slice(1) : '';
  const currentPath = hashPath || window.location.pathname;
  if (currentPath === '/a-copa-mudou-de-rosto') return 'pos-rodada';
  return (Object.entries(ROUTES).find(([, path]) => path === currentPath)?.[0] as ViewState) || 'home';
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>(() => getViewFromLocation());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<{ open: boolean; tab: LegalTab }>({ open: false, tab: 'terms' });

  const openLegal = (tab: LegalTab) => setLegalModal({ open: true, tab });

  useEffect(() => {
    const syncView = () => setCurrentView(getViewFromLocation());
    window.addEventListener('popstate', syncView);
    window.addEventListener('hashchange', syncView);
    return () => {
      window.removeEventListener('popstate', syncView);
      window.removeEventListener('hashchange', syncView);
    };
  }, []);

  useEffect(() => {
    const meta = PAGE_META[currentView] ?? PAGE_META.home;
    const path = ROUTES[currentView] ?? '/';
    const url = path === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`;

    document.title = meta.title;

    const setMeta = (selector: string, value: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute('content', value);
    };
    setMeta('meta[name="description"]', meta.description);
    setMeta('meta[property="og:title"]', meta.title);
    setMeta('meta[property="og:description"]', meta.description);
    setMeta('meta[property="og:url"]', url);
    setMeta('meta[name="twitter:title"]', meta.title);
    setMeta('meta[name="twitter:description"]', meta.description);

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', url);
  }, [currentView]);

  const navigateTo = (view: ViewState) => {
    const targetPath = ROUTES[view];
    if (window.location.pathname !== targetPath || window.location.hash) {
      window.history.pushState(null, '', targetPath);
    }
    setCurrentView(view);
    setIsMenuOpen(false);
    setIsMobileDropdownOpen(false);
    window.scrollTo(0, 0);
  };

  const NavItem: React.FC<{ view: ViewState; label: string }> = ({ view, label }) => (
    <button
      type="button"
      onClick={() => navigateTo(view)}
      className={`font-montserrat font-bold text-sm uppercase tracking-widest transition-colors pb-1 ${currentView === view ? 'text-brand-green border-b-2 border-brand-green' : 'text-brand-dark/40 hover:text-brand-green'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-brand-light font-opensans selection:bg-brand-green selection:text-white flex flex-col text-brand-dark">
      <nav className="relative z-50 bg-white/90 backdrop-blur-md border-b border-brand-dark/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo + progresso da Copa */}
            <div className="flex items-center gap-3 md:gap-4">
              <button
                type="button"
                className="flex-shrink-0 flex items-center gap-2 cursor-pointer group text-left"
                onClick={() => navigateTo('home')}
                aria-label="Ir para o início"
              >
                <Logo className="h-[52px] md:h-[62px] group-hover:opacity-80 transition-opacity" />
              </button>
              <span className="hidden sm:block h-9 w-px bg-brand-dark/10" aria-hidden="true" />
              <CopaProgressBadge />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden min-[1180px]:flex items-center gap-6 xl:gap-8">
              {NAV_ITEMS.map((item) => (
                <NavItem key={item.view} view={item.view} label={item.label} />
              ))}

              {/* Grouped Pages Dropdown under "Sobre" */}
              <div 
                className="relative py-4 flex items-center"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button
                  type="button"
                  className={`flex items-center gap-1 font-montserrat font-bold text-sm uppercase tracking-widest transition-colors pb-1 ${
                    ['science', 'media', 'team', 'methodology'].includes(currentView) 
                      ? 'text-brand-green border-b-2 border-brand-green' 
                      : 'text-brand-dark/40 hover:text-brand-green'
                  }`}
                >
                  <span>Sobre</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute left-0 top-full pt-1 w-[240px] z-50">
                    <div className="rounded-lg shadow-xl bg-white border border-brand-dark/10 divide-y divide-brand-dark/5 focus:outline-none py-1 transition-all">
                      {PROJECT_NAV_ITEMS.map((item) => (
                        <button
                          key={item.view}
                          type="button"
                          onClick={() => {
                            navigateTo(item.view);
                            setIsDropdownOpen(false);
                          }}
                          className={`block w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-montserrat font-bold transition-colors ${
                            currentView === item.view 
                              ? 'text-brand-green bg-brand-green/5' 
                              : 'text-brand-dark/60 hover:text-brand-green hover:bg-brand-light/50'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Instagram Icon-only Button */}
              <a
                href="https://www.instagram.com/previsaoesportiva/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-[#f9ce3f] via-[#e1306c] to-[#833ab4] text-white shadow-sm hover:shadow-md hover:scale-110 active:scale-95 transition-all duration-300 ml-2"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>

            {/* Mobile Header Icons: Instagram Icon-only Button & Hamburger Menu */}
            <div className="min-[1180px]:hidden flex items-center gap-3">
              <a
                href="https://www.instagram.com/previsaoesportiva/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-[#f9ce3f] via-[#e1306c] to-[#833ab4] text-white shadow-sm hover:scale-110 active:scale-95 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-brand-dark p-2"
                aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="min-[1180px]:hidden bg-white border-t border-brand-dark/10 absolute w-full shadow-2xl h-[calc(100vh-5rem)] overflow-y-auto z-50 flex flex-col justify-between">
            <div className="px-4 pt-4 pb-12 space-y-2">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.view}
                  type="button"
                  onClick={() => navigateTo(item.view)}
                  className={`block w-full text-left px-3 py-5 text-xl font-montserrat font-bold border-b border-brand-dark/5 transition-colors ${currentView === item.view ? 'text-brand-green bg-brand-green/5' : 'text-brand-dark'}`}
                >
                  {item.mobileLabel ?? item.label}
                </button>
              ))}

              {/* Collapsible Accordion for "Sobre" */}
              <div className="border-b border-brand-dark/5">
                <button
                  type="button"
                  onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                  className={`flex items-center justify-between w-full text-left px-3 py-5 text-xl font-montserrat font-bold transition-colors ${
                    ['science', 'media', 'team', 'methodology'].includes(currentView) ? 'text-brand-green' : 'text-brand-dark'
                  }`}
                >
                  <span>Sobre</span>
                  <ChevronDown className={`h-6 w-6 transition-transform duration-200 ${isMobileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMobileDropdownOpen && (
                  <div className="bg-brand-light/40 pl-4 py-2 space-y-1">
                    {PROJECT_NAV_ITEMS.map((item) => (
                      <button
                        key={item.view}
                        type="button"
                        onClick={() => navigateTo(item.view)}
                        className={`block w-full text-left px-4 py-4 text-lg font-montserrat font-semibold transition-colors ${
                          currentView === item.view ? 'text-brand-green font-bold' : 'text-brand-dark/70 hover:text-brand-green'
                        }`}
                      >
                        {item.mobileLabel ?? item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Instagram Button (Circular, Centered) */}
              <div className="pt-8 flex justify-center">
                <a
                  href="https://www.instagram.com/previsaoesportiva/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-[#f9ce3f] via-[#e1306c] to-[#833ab4] text-white shadow-md hover:scale-110 active:scale-95 transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {currentView === 'home' && (
          <>
            <Hero onNavigate={(view) => navigateTo(view)} />
            <HexaCallout onNavigate={() => navigateTo('hexa')} />
            <MediaHighlight onNavigate={() => navigateTo('media')} />
            <HomeOverview onNavigate={(view) => navigateTo(view)} />
          </>
        )}

        {currentView !== 'home' && (
          <Suspense fallback={<div className="min-h-[60vh] bg-brand-light" />}>
            {currentView === 'copa' && <WorldCupHub />}
            {currentView === 'mapa' && <MapPage />}
            {currentView === 'simulador' && <SimulatorPage />}
            {currentView === 'bolao' && <BolaoPage />}
            {currentView === 'team' && <TeamPage />}
            {currentView === 'science' && <SciencePage />}
            {currentView === 'media' && <MediaPage />}
            {currentView === 'methodology' && <MethodologyPage />}
            {currentView === 'hexa' && <KnockoutPage />}
            {currentView === 'hexa-oitavas' && <RoundOf16Page />}
            {currentView === 'hexa-rodada2' && <SecondRoundPage />}
            {currentView === 'pos-rodada' && <PostRoundPage />}
            {currentView === 'hexa-inicio' && <HexaPage />}
          </Suspense>
        )}
      </main>

      {currentView !== 'simulador' && (
      <footer className="bg-white text-brand-dark border-t border-brand-dark/10">
        <div className="bg-brand-dark text-white">
          <div className="max-w-[1080px] mx-auto px-4 py-10 md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <p className="font-montserrat text-sm font-bold uppercase text-brand-yellow">Acompanhe o projeto</p>
              <h2 className="mt-2 text-3xl font-montserrat font-black uppercase md:text-4xl">
                Previsão Esportiva no Instagram
              </h2>
            </div>
            <a
              href="https://www.instagram.com/previsaoesportiva/"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-3 bg-brand-green px-6 py-4 font-montserrat text-sm font-bold uppercase text-white transition hover:bg-brand-grad2 md:mt-0 rounded-lg"
            >
              <Instagram className="h-5 w-5" />
              @previsaoesportiva
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="max-w-[1080px] mx-auto px-4 py-14 grid gap-12 lg:grid-cols-[1.25fr_0.85fr_0.9fr]">
          <div>
            <button type="button" onClick={() => navigateTo('home')} className="inline-block text-left">
              <Logo className="h-16 mb-5 origin-left" />
            </button>
            <p className="max-w-lg text-sm leading-relaxed text-brand-dark/68">
              O Previsão Esportiva é um projeto acadêmico de pesquisa e divulgação científica dedicado à análise
              probabilística do futebol, reunindo pesquisadores de diferentes universidades brasileiras.
            </p>
            <p className="mt-4 max-w-lg text-xs leading-relaxed text-brand-dark/45">
              As probabilidades têm finalidade informativa, educacional e científica. O projeto não possui vínculo
              com casas de apostas e não constitui aconselhamento de apostas.
            </p>
          </div>

          <div className="border-l-4 border-brand-green pl-5">
            <h4 className="text-brand-dark font-montserrat font-bold uppercase tracking-wider mb-5 text-sm">Contato</h4>
            <a
              href="mailto:equipeprevisaoesportiva@gmail.com"
              className="flex items-center gap-3 text-sm text-brand-dark/72 transition hover:text-brand-green"
            >
              <Mail className="h-5 w-5 text-brand-green" />
              equipeprevisaoesportiva@gmail.com
            </a>
            <a
              href="https://www.instagram.com/previsaoesportiva/"
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center gap-3 text-sm font-bold text-brand-dark transition hover:text-brand-green"
            >
              <Instagram className="h-5 w-5 text-brand-green" />
              @previsaoesportiva
            </a>
          </div>

          <div>
            <h4 className="text-brand-dark font-montserrat font-bold uppercase tracking-wider mb-5 text-sm">Navegação</h4>
            <div className="grid grid-cols-2 gap-3 text-sm text-brand-dark/68">
              <button type="button" onClick={() => navigateTo('copa')} className="text-left hover:text-brand-green transition">Resultados</button>
              <button type="button" onClick={() => navigateTo('hexa')} className="text-left hover:text-brand-green transition">Rumo ao Hexa</button>
              <button type="button" onClick={() => navigateTo('mapa')} className="text-left hover:text-brand-green transition">Mapa</button>
              <button type="button" onClick={() => navigateTo('simulador')} className="text-left hover:text-brand-green transition">Simulador</button>
              <button type="button" onClick={() => navigateTo('bolao')} className="text-left hover:text-brand-green transition">Bolão</button>
              <button type="button" onClick={() => navigateTo('science')} className="text-left hover:text-brand-green transition">Pesquisa</button>
              <button type="button" onClick={() => navigateTo('media')} className="text-left hover:text-brand-green transition">Na mídia</button>
              <button type="button" onClick={() => navigateTo('team')} className="text-left hover:text-brand-green transition">Equipe</button>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-dark/10">
          <div className="max-w-[1080px] mx-auto px-4 py-8">
            <p className="mb-5 font-montserrat text-[11px] font-bold uppercase tracking-widest text-brand-dark/35">
              Centros e instituições associadas
            </p>
            <InstitutionLogos institutions={[...RESEARCH_CENTERS, ...PARTNER_INSTITUTIONS]} compact />
          </div>
        </div>

        <div className="border-t border-brand-dark/10 bg-brand-light">
          <div className="max-w-[1080px] mx-auto px-4 py-5 flex flex-col gap-3 text-xs text-brand-dark/55 md:flex-row md:items-center md:justify-between">
            <span>© 2026 Projeto Previsão Esportiva. Todos os direitos reservados.</span>
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => openLegal('terms')}
                className="transition-colors hover:text-brand-green"
              >
                Termos de Uso
              </button>
              <button
                type="button"
                onClick={() => openLegal('privacy')}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-brand-green"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Política de Privacidade
              </button>
            </div>
          </div>
        </div>
      </footer>
      )}

      <LegalModal
        open={legalModal.open}
        initialTab={legalModal.tab}
        onClose={() => setLegalModal((prev) => ({ ...prev, open: false }))}
      />

      <SponsorBar />

      <Analytics />
    </div>
  );
}
