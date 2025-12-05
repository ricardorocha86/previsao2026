
import React, { useState } from 'react';
import { Logo } from './components/Logo';
import Hero from './components/Hero';
import WorldCupHub from './components/WorldCupHub';
import TeamPage from './components/TeamPage';
import SciencePage from './components/SciencePage';
import MediaPage from './components/MediaPage';
import MethodologyPage from './components/MethodologyPage';
import { Menu, X, Github, Twitter, Trophy, LayoutDashboard, Microscope, Globe, BookOpen, ArrowUpRight } from 'lucide-react';

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
      className={`font-oswald font-medium text-sm uppercase tracking-widest transition-colors pb-1 ${currentView === view ? 'text-white border-b-2 border-blue-500' : 'text-slate-400 hover:text-white'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-inter selection:bg-blue-500 selection:text-white flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#050B14]/95 backdrop-blur-md border-b border-slate-800/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div 
              className="flex-shrink-0 flex items-center gap-2 cursor-pointer group"
              onClick={() => navigateTo('home')}
            >
              <Logo className="h-10 md:h-12 brightness-0 invert group-hover:opacity-80 transition-opacity" />
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <NavItem view="home" label="Início" />
              <NavItem view="copa" label="Copa 2026" />
              <NavItem view="methodology" label="Metodologia" />
              <NavItem view="science" label="Pesquisa" />
              <NavItem view="media" label="Na Mídia" />
              <NavItem view="team" label="Equipe" />
              
              <button className="bg-blue-600 text-white px-6 py-2 rounded-sm font-oswald font-bold text-sm uppercase tracking-wider hover:bg-blue-500 transition shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center gap-2">
                <Trophy className="w-4 h-4" /> Pro Login
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#050B14] border-t border-slate-800 absolute w-full shadow-2xl h-screen z-50">
            <div className="px-4 pt-4 pb-8 space-y-2">
              <button onClick={() => navigateTo('home')} className="block w-full text-left px-3 py-4 text-lg font-oswald font-bold text-white border-b border-slate-800 hover:text-blue-500">Início</button>
              <button onClick={() => navigateTo('copa')} className="block w-full text-left px-3 py-4 text-lg font-oswald font-bold text-white border-b border-slate-800 hover:text-blue-500">Copa 2026</button>
              <button onClick={() => navigateTo('methodology')} className="block w-full text-left px-3 py-4 text-lg font-oswald font-bold text-white border-b border-slate-800 hover:text-blue-500">Metodologia</button>
              <button onClick={() => navigateTo('science')} className="block w-full text-left px-3 py-4 text-lg font-oswald font-bold text-white border-b border-slate-800 hover:text-blue-500">Produção Científica</button>
              <button onClick={() => navigateTo('media')} className="block w-full text-left px-3 py-4 text-lg font-oswald font-bold text-white border-b border-slate-800 hover:text-blue-500">Na Mídia</button>
              <button onClick={() => navigateTo('team')} className="block w-full text-left px-3 py-4 text-lg font-oswald font-bold text-white border-b border-slate-800 hover:text-blue-500">Equipe</button>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow bg-[#0f172a]">
        {currentView === 'home' && (
          <>
            <Hero />
            
            {/* Modules Grid - "The Hub" */}
            <div id="hub" className="py-24 px-4 bg-slate-900 border-t border-slate-800">
               <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-16">
                     <h2 className="text-slate-400 font-mono text-sm uppercase tracking-widest mb-2">Painel de Controle</h2>
                     <h3 className="text-3xl md:text-4xl font-oswald font-bold text-white uppercase">Selecione um <span className="text-blue-500">Módulo</span></h3>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {/* Card 1 */}
                     <div onClick={() => navigateTo('copa')} className="group cursor-pointer bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 p-8 rounded-xl transition-all duration-300 relative overflow-hidden">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                           <LayoutDashboard className="w-24 h-24 text-blue-500" />
                        </div>
                        <LayoutDashboard className="w-10 h-10 text-blue-500 mb-6" />
                        <h4 className="text-xl font-oswald font-bold text-white mb-2 uppercase">Simulador de Odds</h4>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                           Motor de inferência estatística para prever resultados entre seleções com base em dados históricos e táticos.
                        </p>
                        <div className="flex items-center text-blue-400 text-xs font-bold uppercase tracking-wider gap-2">
                           Acessar Ferramenta <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                     </div>

                     {/* Card 2 */}
                     <div onClick={() => navigateTo('science')} className="group cursor-pointer bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 p-8 rounded-xl transition-all duration-300 relative overflow-hidden">
                         <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                           <Microscope className="w-24 h-24 text-purple-500" />
                        </div>
                        <Microscope className="w-10 h-10 text-purple-500 mb-6" />
                        <h4 className="text-xl font-oswald font-bold text-white mb-2 uppercase">Laboratório de Pesquisa</h4>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                           Acesso a papers acadêmicos, modelos matemáticos e metodologia científica por trás do projeto.
                        </p>
                        <div className="flex items-center text-purple-400 text-xs font-bold uppercase tracking-wider gap-2">
                           Ler Publicações <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                     </div>

                     {/* Card 3 */}
                     <div onClick={() => navigateTo('media')} className="group cursor-pointer bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 p-8 rounded-xl transition-all duration-300 relative overflow-hidden">
                         <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                           <Globe className="w-24 h-24 text-emerald-500" />
                        </div>
                        <Globe className="w-10 h-10 text-emerald-500 mb-6" />
                        <h4 className="text-xl font-oswald font-bold text-white mb-2 uppercase">Na Mídia</h4>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                           Acompanhe a repercussão das nossas previsões científicas em grandes portais de notícias e na academia.
                        </p>
                        <div className="flex items-center text-emerald-400 text-xs font-bold uppercase tracking-wider gap-2">
                           Ver Repercussão <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </>
        )}
        {currentView === 'copa' && <WorldCupHub />}
        {currentView === 'team' && <TeamPage />}
        {currentView === 'science' && <SciencePage />}
        {currentView === 'media' && <MediaPage />}
        {currentView === 'methodology' && <MethodologyPage />}
      </main>

      <footer className="bg-[#050B14] text-slate-500 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div onClick={() => navigateTo('home')} className="cursor-pointer inline-block">
               <Logo className="mb-6 brightness-0 invert opacity-60 scale-90 origin-left" />
            </div>
            <p className="max-w-md text-sm leading-relaxed mb-8 font-light text-slate-400">
              Plataforma independente de análise preditiva para a Copa do Mundo FIFA 2026™. Modelagem estatística avançada para entusiastas e profissionais.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 hover:text-white transition"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-white hover:text-black transition"><Github className="w-4 h-4" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-oswald font-bold uppercase tracking-wider mb-6 text-sm">Navegação</h4>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => navigateTo('methodology')} className="hover:text-blue-500 transition flex items-center gap-2">Metodologia</button></li>
              <li><button onClick={() => navigateTo('team')} className="hover:text-blue-500 transition flex items-center gap-2">Pesquisadores</button></li>
              <li><button onClick={() => navigateTo('media')} className="hover:text-blue-500 transition flex items-center gap-2">Na Mídia</button></li>
            </ul>
          </div>

          <div>
             <h4 className="text-white font-oswald font-bold uppercase tracking-wider mb-6 text-sm">Legal</h4>
             <p className="text-xs leading-relaxed text-slate-500">
               Projeto acadêmico sem afiliação direta com a FIFA. Dados fornecidos "como estão" para fins de pesquisa e entretenimento.
             </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-slate-900 text-center text-xs tracking-widest uppercase opacity-40 font-mono">
          © 2025 Scientific Sports Forecasting Group • Built with React & Gemini AI
        </div>
      </footer>
    </div>
  );
}
