import React from 'react';
import { MEDIA_MENTIONS } from '../constants';
import { ExternalLink, Newspaper, TrendingUp, Calendar, PlayCircle, Tv, MonitorPlay } from 'lucide-react';

const MediaPage: React.FC = () => {
  return (
    <div className="bg-[#0f172a] min-h-screen pb-24 text-white">
      
      {/* FEATURED VIDEO HERO SECTION (G1) */}
      <section className="relative w-full flex items-center py-24 bg-[#050B14] overflow-hidden border-b border-slate-900">
        
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
           <div className="absolute top-[-50%] left-[20%] w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[120px]"></div>
           <div className="absolute bottom-[-50%] right-[20%] w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[100px]"></div>
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 w-full relative z-10 flex flex-col items-center text-center">
           
           <div className="inline-flex items-center gap-3 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full backdrop-blur-md mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                 <Tv className="w-3 h-3" />
                 Destaque na TV
              </span>
           </div>

           <h1 className="text-5xl md:text-6xl lg:text-7xl font-oswald font-bold leading-[0.9] tracking-tighter mb-8">
              INTELIGÊNCIA ARTIFICIAL <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                 NA COPA DO MUNDO
              </span>
           </h1>

           <p className="text-lg text-slate-400 leading-relaxed font-light max-w-2xl mb-8">
              Pesquisadores da USP e UFSCar utilizam modelos matemáticos avançados para prever cenários do mundial. A equipe desenvolveu algoritmos capazes de simular milhares de partidas, com destaque em rede nacional.
           </p>

           <div className="flex flex-col sm:flex-row items-center gap-6">
              <a 
                href="https://g1.globo.com/sp/sao-paulo/bom-dia-sp/video/grupo-usa-inteligencia-artificial-para-simular-resultados-da-copa-11178283.ghtml" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative px-8 py-4 bg-white hover:bg-slate-100 text-slate-900 font-oswald font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 rounded-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                 <PlayCircle className="w-5 h-5 group-hover:text-red-600 transition-colors" />
                 Assistir Matéria Completa
              </a>
              
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                 <MonitorPlay className="w-3 h-3" />
                 TV Globo • G1
              </div>
           </div>

        </div>
      </section>

      {/* MEDIA GRID SECTION */}
      <div className="max-w-7xl mx-auto px-4 pt-16">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12 border-b border-slate-800 pb-8">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-600/30">
                  <Newspaper className="w-6 h-6" />
              </div>
              <div>
                  <h2 className="text-3xl font-oswald font-bold uppercase tracking-tight text-slate-200">Repercussão</h2>
              </div>
           </div>
           
           <div className="hidden md:block text-right">
              <div className="text-2xl font-bold font-oswald text-slate-500">{MEDIA_MENTIONS.length}</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-600">Arquivos Indexados</div>
           </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           {MEDIA_MENTIONS.map((item) => (
             <a 
               key={item.id} 
               href={item.link} 
               target="_blank"
               rel="noopener noreferrer"
               className="group relative h-80 block bg-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-blue-500/20 border border-slate-700 hover:border-blue-500/50"
             >
                {/* Background Image (Cover) */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-50 group-hover:brightness-75" 
                  />
                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 p-6 flex flex-col h-full justify-between">
                   
                   {/* Top Badge */}
                   <div className="flex justify-between items-start">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-blue-300">
                         <TrendingUp className="w-3 h-3" />
                         {item.outlet}
                      </div>
                      <div className="p-2 bg-slate-900/50 rounded-full text-slate-400 group-hover:text-white transition-colors border border-slate-700 group-hover:border-blue-500">
                         <ExternalLink className="w-3 h-3" />
                      </div>
                   </div>

                   {/* Bottom Text */}
                   <div>
                      <div className="flex items-center gap-2 mb-2 text-[10px] font-mono text-blue-400">
                         <Calendar className="w-3 h-3" />
                         {item.date}
                      </div>
                      <h3 className="text-lg md:text-xl font-oswald font-bold leading-tight mb-3 text-slate-200 group-hover:text-white transition-colors line-clamp-3">
                         "{item.title}"
                      </h3>
                      
                      {/* Decorative Bar */}
                      <div className="w-8 h-1 bg-blue-600 rounded-full transform origin-left group-hover:scale-x-150 transition-transform duration-300"></div>
                   </div>
                </div>
             </a>
           ))}
        </div>
      </div>
    </div>
  );
};

export default MediaPage;