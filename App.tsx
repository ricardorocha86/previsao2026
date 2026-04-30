
import React, { useState } from 'react';
import { Logo } from './components/Logo';
import Hero from './components/Hero';
import WorldCupHub from './components/WorldCupHub';
import TeamPage from './components/TeamPage';
import SciencePage from './components/SciencePage';
import MediaPage from './components/MediaPage';
import MethodologyPage from './components/MethodologyPage';
import { Menu, X, Instagram, Mail, ArrowUpRight } from 'lucide-react';

type ViewState = 'home' | 'copa' | 'team' | 'science' | 'media' | 'methodology';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('home');

  const navigateTo = (view: ViewState) => {
    setCurrentView(view);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const NavItem: React.FC<{ view: ViewState; label: string }> = ({ view, label }) => (
    <button 
      onClick={() => navigateTo(view)}
      className={`font-montserrat font-bold text-sm uppercase tracking-widest transition-colors pb-1 ${currentView === view ? 'text-brand-green border-b-2 border-brand-green' : 'text-brand-dark/40 hover:text-brand-green'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-brand-light font-opensans selection:bg-brand-green selection:text-white flex flex-col text-brand-dark">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-brand-dark/10 shadow-sm">
        <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div 
              className="flex-shrink-0 flex items-center gap-2 cursor-pointer group"
              onClick={() => navigateTo('home')}
            >
              <Logo className="h-10 md:h-12 group-hover:opacity-80 transition-opacity" />
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <NavItem view="home" label="Início" />
              <NavItem view="copa" label="Copa 2026" />
              <NavItem view="methodology" label="Metodologia" />
              <NavItem view="science" label="Pesquisa" />
              <NavItem view="media" label="Na Mídia" />
              <NavItem view="team" label="Equipe" />
              
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-brand-dark p-2">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-brand-dark/10 absolute w-full shadow-2xl h-screen z-50">
            <div className="px-4 pt-4 pb-8 space-y-2">
              <button onClick={() => navigateTo('home')} className={`block w-full text-left px-3 py-6 text-xl font-montserrat font-bold border-b border-brand-dark/5 transition-colors ${currentView === 'home' ? 'text-brand-green bg-brand-green/5' : 'text-brand-dark'}`}>Início</button>
              <button onClick={() => navigateTo('copa')} className={`block w-full text-left px-3 py-6 text-xl font-montserrat font-bold border-b border-brand-dark/5 transition-colors ${currentView === 'copa' ? 'text-brand-green bg-brand-green/5' : 'text-brand-dark'}`}>Copa 2026</button>
              <button onClick={() => navigateTo('methodology')} className={`block w-full text-left px-3 py-6 text-xl font-montserrat font-bold border-b border-brand-dark/5 transition-colors ${currentView === 'methodology' ? 'text-brand-green bg-brand-green/5' : 'text-brand-dark'}`}>Metodologia</button>
              <button onClick={() => navigateTo('science')} className={`block w-full text-left px-3 py-6 text-xl font-montserrat font-bold border-b border-brand-dark/5 transition-colors ${currentView === 'science' ? 'text-brand-green bg-brand-green/5' : 'text-brand-dark'}`}>Produção Científica</button>
              <button onClick={() => navigateTo('media')} className={`block w-full text-left px-3 py-6 text-xl font-montserrat font-bold border-b border-brand-dark/5 transition-colors ${currentView === 'media' ? 'text-brand-green bg-brand-green/5' : 'text-brand-dark'}`}>Na Mídia</button>
              <button onClick={() => navigateTo('team')} className={`block w-full text-left px-3 py-6 text-xl font-montserrat font-bold border-b border-brand-dark/5 transition-colors ${currentView === 'team' ? 'text-brand-green bg-brand-green/5' : 'text-brand-dark'}`}>Equipe</button>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {currentView === 'home' && (
          <>
            <Hero onNavigate={(view) => navigateTo(view)} />

            <section className="bg-white px-4 py-20 border-t border-brand-dark/10">
              <div className="max-w-[1080px] mx-auto grid gap-12 lg:grid-cols-[0.82fr_1.18fr]">
                <div>
                  <p className="mb-4 font-montserrat text-sm font-bold uppercase text-brand-green">
                    Explore o site
                  </p>
                  <h2 className="text-3xl md:text-5xl font-montserrat font-black uppercase leading-tight text-brand-dark">
                    O projeto em cinco frentes.
                  </h2>
                  <p className="mt-6 max-w-md text-lg leading-relaxed text-brand-dark/64">
                    Resultados, método, produção científica, imprensa e equipe reunidos para consulta pública.
                  </p>
                </div>

                <div className="border-t border-brand-dark/10">
                  {[
                    {
                      title: 'Copa 2026',
                      description: 'Probabilidades, confrontos e sínteses do torneio.',
                      view: 'copa' as ViewState,
                    },
                    {
                      title: 'Metodologia',
                      description: 'Como as estimativas são construídas e interpretadas.',
                      view: 'methodology' as ViewState,
                    },
                    {
                      title: 'Pesquisa',
                      description: 'Publicações e referências acadêmicas do grupo.',
                      view: 'science' as ViewState,
                    },
                    {
                      title: 'Na mídia',
                      description: 'Reportagens e registros de divulgação científica.',
                      view: 'media' as ViewState,
                    },
                    {
                      title: 'Equipe',
                      description: 'Pesquisadores e instituições envolvidas.',
                      view: 'team' as ViewState,
                    },
                  ].map((item) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => navigateTo(item.view)}
                      className="group grid w-full gap-3 border-b border-brand-dark/10 py-6 text-left transition hover:bg-brand-light/70 sm:grid-cols-[220px_1fr_auto] sm:items-center sm:px-5"
                    >
                      <span className="font-montserrat text-xl font-bold uppercase text-brand-dark">
                        {item.title}
                      </span>
                      <span className="text-sm leading-relaxed text-brand-dark/60">
                        {item.description}
                      </span>
                      <span className="inline-flex h-10 w-10 items-center justify-center border border-brand-dark/10 text-brand-green transition group-hover:border-brand-green group-hover:bg-brand-green group-hover:text-white" style={{ borderRadius: 8 }}>
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
        {currentView === 'copa' && <WorldCupHub />}
        {currentView === 'team' && <TeamPage />}
        {currentView === 'science' && <SciencePage />}
        {currentView === 'media' && <MediaPage />}
        {currentView === 'methodology' && <MethodologyPage />}
      </main>

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
              className="mt-6 inline-flex items-center gap-3 bg-brand-green px-6 py-4 font-montserrat text-sm font-bold uppercase text-white transition hover:bg-brand-grad2 md:mt-0"
              style={{ borderRadius: 8 }}
            >
              <Instagram className="h-5 w-5" />
              @previsaoesportiva
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="max-w-[1080px] mx-auto px-4 py-14 grid gap-12 lg:grid-cols-[1.25fr_0.85fr_0.9fr]">
          <div>
            <button onClick={() => navigateTo('home')} className="inline-block text-left">
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
              <button onClick={() => navigateTo('copa')} className="text-left hover:text-brand-green transition">Resultados</button>
              <button onClick={() => navigateTo('methodology')} className="text-left hover:text-brand-green transition">Metodologia</button>
              <button onClick={() => navigateTo('science')} className="text-left hover:text-brand-green transition">Pesquisa</button>
              <button onClick={() => navigateTo('media')} className="text-left hover:text-brand-green transition">Na mídia</button>
              <button onClick={() => navigateTo('team')} className="text-left hover:text-brand-green transition">Equipe</button>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-dark/10 bg-brand-light">
          <div className="max-w-[1080px] mx-auto px-4 py-5 flex flex-col gap-2 text-xs text-brand-dark/55 md:flex-row md:items-center md:justify-between">
            <span>© 2026 Previsão Esportiva</span>
            <span>Projeto acadêmico sem afiliação direta com a FIFA.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
