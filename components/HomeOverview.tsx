import React from 'react';
import {
  Trophy,
  GraduationCap,
  Newspaper,
  Users,
  ArrowUpRight
} from 'lucide-react';

type ViewState = 'home' | 'copa' | 'mapa' | 'simulador' | 'bolao' | 'team' | 'science' | 'media' | 'methodology';

interface HomeOverviewProps {
  onNavigate: (view: ViewState) => void;
}

const HomeOverview: React.FC<HomeOverviewProps> = ({ onNavigate }) => {
  return (
    <div className="bg-brand-light pb-24 font-opensans">
      {/* CORE FEATURES GRID */}
      <section className="max-w-[1080px] mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-montserrat text-xs font-bold uppercase tracking-widest text-brand-green mb-3">
            Explore o site
          </p>
          <h2 className="text-3xl md:text-5xl font-montserrat font-black uppercase tracking-tight text-brand-dark leading-none">
            Análises e Simulações
          </h2>
          <p className="mt-4 text-base md:text-lg text-brand-dark/60 leading-relaxed">
            Acompanhe o caminho das seleções e teste cenários interativos com base em nossos modelos matemáticos.
          </p>
        </div>

        {/* PRIMARY HIGHLIGHT: PREVISÕES COPA 2026 */}
        <div 
          onClick={() => onNavigate('copa')}
          className="group relative overflow-hidden rounded-[2.5rem] border-2 border-brand-green bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] cursor-pointer mb-10"
        >
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-0 items-stretch min-h-[380px]">
            {/* TEXT INFO */}
            <div className="p-8 md:p-12 flex flex-col justify-between relative z-10">
              <div className="absolute top-0 left-0 w-48 h-48 bg-brand-green/5 rounded-full blur-3xl -ml-20 -mt-20 group-hover:bg-brand-green/10 transition-colors duration-500" />
              
              <div className="relative">
                <div className="inline-flex items-center gap-2 text-brand-green font-montserrat text-xs font-black uppercase tracking-widest bg-brand-green/10 px-4 py-2 rounded-full mb-6">
                  <Trophy className="w-4 h-4 text-brand-yellow" />
                  Destaque Principal
                </div>
                
                <h3 className="font-montserrat font-black text-3xl md:text-5xl text-brand-dark uppercase tracking-tight leading-none group-hover:text-brand-green transition-colors duration-500">
                  Previsões Copa 2026
                </h3>
                
                <p className="mt-4 text-sm md:text-base text-brand-dark/65 leading-relaxed max-w-xl">
                  Acompanhe as probabilidades estatísticas de cada seleção nas fases de grupos e no chaveamento final. Nosso modelo simula a Copa do Mundo 1 milhão de vezes para calcular as chances reais de classificação e título.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-2.5 font-montserrat font-bold text-xs uppercase tracking-widest text-brand-green">
                <span>Ver Previsões da Copa</span>
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </div>

            {/* DECORATIVE IMAGE */}
            <div className="relative bg-brand-dark overflow-hidden min-h-[260px] lg:min-h-full">
              <img 
                src="/assets/copa_previsoes_hero.webp"
                alt="Previsões Copa 2026" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-white via-white/10 to-transparent lg:from-white lg:via-white/5 lg:to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* SECONDARY HIGHLIGHT GRID */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          {/* SIMULADOR INTERATIVO */}
          <div 
            onClick={() => onNavigate('simulador')}
            className="group relative overflow-hidden rounded-[2rem] border-2 border-brand-dark/5 hover:border-brand-green bg-white hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[400px]"
          >
            <div>
              {/* IMAGE CONTAINER */}
              <div className="h-[180px] bg-brand-dark overflow-hidden relative border-b border-brand-dark/5">
                <img 
                  src="/assets/simulator_ui_mockup.webp"
                  alt="Simulador Interativo" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 px-3 py-1 text-[9px] font-black font-montserrat uppercase tracking-widest bg-brand-green/20 text-brand-green backdrop-blur-md rounded-full border border-brand-green/30">
                  Simulação
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-montserrat font-black text-xl text-brand-dark uppercase tracking-tight leading-none group-hover:text-brand-green transition-colors duration-500">
                  Simulador Interativo
                </h3>
                <p className="mt-3 text-xs md:text-sm text-brand-dark/60 leading-relaxed">
                  Replique nossas simulações ou teste seus próprios parâmetros para prever as partidas da copa.
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 flex items-center gap-2 font-montserrat font-bold text-[10px] uppercase tracking-widest text-brand-dark/55 group-hover:text-brand-green transition-colors">
              <span>Iniciar Simulador</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* BOLÃO COPA 2026 */}
          <div 
            onClick={() => onNavigate('bolao')}
            className="group relative overflow-hidden rounded-[2rem] border-2 border-brand-dark/5 hover:border-brand-green bg-white hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[400px]"
          >
            <div>
              {/* IMAGE CONTAINER */}
              <div className="h-[180px] bg-brand-dark overflow-hidden relative border-b border-brand-dark/5">
                <img 
                  src="/assets/bracket_tournament_illustration.webp"
                  alt="Bolão Copa 2026" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 px-3 py-1 text-[9px] font-black font-montserrat uppercase tracking-widest bg-brand-green/20 text-brand-green backdrop-blur-md rounded-full border border-brand-green/30">
                  Palpites
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-montserrat font-black text-xl text-brand-dark uppercase tracking-tight leading-none group-hover:text-brand-green transition-colors duration-500">
                  Bolão Copa 2026
                </h3>
                <p className="mt-3 text-xs md:text-sm text-brand-dark/60 leading-relaxed">
                  Crie seus palpites para os confrontos de brackets e acompanhe o chaveamento de forma visual.
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 flex items-center gap-2 font-montserrat font-bold text-[10px] uppercase tracking-widest text-brand-dark/55 group-hover:text-brand-green transition-colors">
              <span>Jogar Bolão</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* MAPA DE SELEÇÕES */}
          <div 
            onClick={() => onNavigate('mapa')}
            className="group relative overflow-hidden rounded-[2rem] border-2 border-brand-dark/5 hover:border-brand-green bg-white hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[400px]"
          >
            <div>
              {/* IMAGE CONTAINER */}
              <div className="h-[180px] bg-brand-dark overflow-hidden relative border-b border-brand-dark/5">
                <img 
                  src="/assets/world_map_soccer.webp"
                  alt="Mapa de Seleções" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 px-3 py-1 text-[9px] font-black font-montserrat uppercase tracking-widest bg-brand-green/20 text-brand-green backdrop-blur-md rounded-full border border-brand-green/30">
                  Geografia
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-montserrat font-black text-xl text-brand-dark uppercase tracking-tight leading-none group-hover:text-brand-green transition-colors duration-500">
                  Mapa de Seleções
                </h3>
                <p className="mt-3 text-xs md:text-sm text-brand-dark/60 leading-relaxed">
                  Explore dados das 48 seleções classificadas navegando de forma interativa por nosso mapa.
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 flex items-center gap-2 font-montserrat font-bold text-[10px] uppercase tracking-widest text-brand-dark/55 group-hover:text-brand-green transition-colors">
              <span>Abrir Mapa</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT THE PROJECT SECTION */}
      <section className="max-w-[1080px] mx-auto px-4 py-20 border-t border-brand-dark/10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="mb-3 font-montserrat text-xs font-bold uppercase tracking-widest text-brand-green">
            Sobre o Projeto
          </p>
          <h2 className="text-3xl md:text-5xl font-montserrat font-black uppercase leading-tight text-brand-dark">
            Divulgação Científica e Metodologia
          </h2>
          <p className="mt-4 text-base text-brand-dark/60 leading-relaxed">
            Conheça as bases acadêmicas, a repercussão pública, os pesquisadores envolvidos e a fundamentação teórica de nossas previsões.
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* SCIENCE CARD */}
          <button
            onClick={() => onNavigate('science')}
            type="button"
            className="group flex flex-col items-center text-center bg-white border border-brand-dark/5 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-brand-green/20 hover:-translate-y-1 transition-all duration-300 w-full min-h-[280px] justify-between"
          >
            <div className="p-5 bg-brand-green/5 text-brand-green rounded-2xl group-hover:scale-110 group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
              <GraduationCap className="w-10 h-10" />
            </div>
            <div className="my-4">
              <span className="font-montserrat font-bold text-sm uppercase text-brand-dark group-hover:text-brand-green transition-colors block">
                Produção Científica
              </span>
              <span className="text-xs text-brand-dark/50 block mt-2 leading-relaxed">
                Artigos, preprints e materiais acadêmicos do grupo.
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold font-montserrat uppercase tracking-wider text-brand-dark/40 group-hover:text-brand-green">
              Acessar Artigos <ArrowUpRight className="h-3.5 h-3.5" />
            </span>
          </button>

          {/* MEDIA CARD */}
          <button
            onClick={() => onNavigate('media')}
            type="button"
            className="group flex flex-col items-center text-center bg-white border border-brand-dark/5 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-brand-green/20 hover:-translate-y-1 transition-all duration-300 w-full min-h-[280px] justify-between"
          >
            <div className="p-5 bg-brand-green/5 text-brand-green rounded-2xl group-hover:scale-110 group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
              <Newspaper className="w-10 h-10" />
            </div>
            <div className="my-4">
              <span className="font-montserrat font-bold text-sm uppercase text-brand-dark group-hover:text-brand-green transition-colors block">
                Na Mídia
              </span>
              <span className="text-xs text-brand-dark/50 block mt-2 leading-relaxed">
                Reportagens e registros de divulgação pública na imprensa.
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold font-montserrat uppercase tracking-wider text-brand-dark/40 group-hover:text-brand-green">
              Ver Destaques <ArrowUpRight className="h-3.5 h-3.5" />
            </span>
          </button>

          {/* TEAM CARD */}
          <button
            onClick={() => onNavigate('team')}
            type="button"
            className="group flex flex-col items-center text-center bg-white border border-brand-dark/5 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-brand-green/20 hover:-translate-y-1 transition-all duration-300 w-full min-h-[280px] justify-between"
          >
            <div className="p-5 bg-brand-green/5 text-brand-green rounded-2xl group-hover:scale-110 group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
              <Users className="w-10 h-10" />
            </div>
            <div className="my-4">
              <span className="font-montserrat font-bold text-sm uppercase text-brand-dark group-hover:text-brand-green transition-colors block">
                Equipe de Pesquisa
              </span>
              <span className="text-xs text-brand-dark/50 block mt-2 leading-relaxed">
                Membros, professores e as instituições parceiras envolvidas.
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold font-montserrat uppercase tracking-wider text-brand-dark/40 group-hover:text-brand-green">
              Conhecer Equipe <ArrowUpRight className="h-3.5 h-3.5" />
            </span>
          </button>

        </div>
      </section>
    </div>
  );
};

export default HomeOverview;
