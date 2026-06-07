import React, { Suspense, lazy, useEffect, useState } from 'react';
import { ArrowUpRight, ChevronDown, Instagram, Mail, Menu, X } from 'lucide-react';
import { Logo } from './components/Logo';
import Hero from './components/Hero';
import HomeOverview from './components/HomeOverview';

type ViewState = 'home' | 'copa' | 'mapa' | 'simulador' | 'bolao' | 'team' | 'science' | 'media' | 'methodology';

const WorldCupHub = lazy(() => import('./components/WorldCupHub'));
const MapPage = lazy(() => import('./components/MapPage'));
const SimulatorPage = lazy(() => import('./components/SimulatorPage'));
const BolaoPage = lazy(() => import('./components/BolaoPage'));
const TeamPage = lazy(() => import('./components/TeamPage'));
const SciencePage = lazy(() => import('./components/SciencePage'));
const MediaPage = lazy(() => import('./components/MediaPage'));
const MethodologyPage = lazy(() => import('./components/MethodologyPage'));

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
};

// Reordered as requested: Copa 2026, Bolão, Mapa, Simulador (Metodologia moved to dropdown)
const NAV_ITEMS: Array<{ view: ViewState; label: string; mobileLabel?: string }> = [
  { view: 'copa', label: '🏆 Copa 2026' },
  { view: 'bolao', label: '⚽ Bolão' },
  { view: 'mapa', label: '🗺️ Mapa' },
  { view: 'simulador', label: '📊 Simulador' },
];

const PROJECT_NAV_ITEMS: Array<{ view: ViewState; label: string; mobileLabel?: string }> = [
  { view: 'science', label: 'Artigos Científicos', mobileLabel: 'Artigos Científicos' },
  { view: 'media', label: 'Destaques na Mídia', mobileLabel: 'Destaques na Mídia' },
  { view: 'team', label: 'Membros da Equipe', mobileLabel: 'Membros da Equipe' },
  { view: 'methodology', label: 'Metodologia', mobileLabel: 'Metodologia' },
];

const getViewFromLocation = (): ViewState => {
  const hashPath = window.location.hash.startsWith('#/') ? window.location.hash.slice(1) : '';
  const currentPath = hashPath || window.location.pathname;
  return (Object.entries(ROUTES).find(([, path]) => path === currentPath)?.[0] as ViewState) || 'home';
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>(() => getViewFromLocation());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

  useEffect(() => {
    const syncView = () => setCurrentView(getViewFromLocation());
    window.addEventListener('popstate', syncView);
    window.addEventListener('hashchange', syncView);
    return () => {
      window.removeEventListener('popstate', syncView);
      window.removeEventListener('hashchange', syncView);
    };
  }, []);

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
            {/* Logo 30% larger */}
            <button
              type="button"
              className="flex-shrink-0 flex items-center gap-2 cursor-pointer group text-left"
              onClick={() => navigateTo('home')}
              aria-label="Ir para o início"
            >
              <Logo className="h-[52px] md:h-[62px] group-hover:opacity-80 transition-opacity" />
            </button>

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
              Projeto acadêmico dedicado à pesquisa, análise probabilística e divulgação científica no futebol.
              As informações são apresentadas para fins de estudo, comunicação pública e acompanhamento esportivo.
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
              <button type="button" onClick={() => navigateTo('mapa')} className="text-left hover:text-brand-green transition">Mapa</button>
              <button type="button" onClick={() => navigateTo('simulador')} className="text-left hover:text-brand-green transition">Simulador</button>
              <button type="button" onClick={() => navigateTo('bolao')} className="text-left hover:text-brand-green transition">Bolão</button>
              <button type="button" onClick={() => navigateTo('methodology')} className="text-left hover:text-brand-green transition">Metodologia</button>
              <button type="button" onClick={() => navigateTo('science')} className="text-left hover:text-brand-green transition">Pesquisa</button>
              <button type="button" onClick={() => navigateTo('media')} className="text-left hover:text-brand-green transition">Na mídia</button>
              <button type="button" onClick={() => navigateTo('team')} className="text-left hover:text-brand-green transition">Equipe</button>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-dark/10 bg-brand-light">
          <div className="max-w-[1080px] mx-auto px-4 py-5 flex flex-col gap-2 text-xs text-brand-dark/55 md:flex-row md:items-center md:justify-between">
            <span>© 2026 Previsão Esportiva</span>
          </div>
        </div>
      </footer>
      )}
    </div>
  );
}
