
import React, { useEffect, useState } from 'react';
import { fetchWorldCupNews } from '../services/geminiService';
import { NewsItem } from '../types';
import { ExternalLink, Radio, Zap } from 'lucide-react';
import { MOCK_NEWS } from '../constants';

const NewsSection: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      // If API key is not present, use mock to avoid empty section in demo
      if (!process.env.API_KEY) {
         setNews(MOCK_NEWS);
         setLoading(false);
         return;
      }
      
      const fetchedNews = await fetchWorldCupNews();
      setNews(fetchedNews.length > 0 ? fetchedNews : MOCK_NEWS);
      setLoading(false);
    };
    loadNews();
  }, []);

  return (
    <section id="news" className="bg-[#0f172a] py-24 px-4 text-white relative border-t border-slate-800">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 border-b border-slate-800 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
               <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
               </span>
               <span className="text-red-400 font-mono text-xs font-bold uppercase tracking-widest">Live Feed</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-oswald font-bold text-white uppercase tracking-tight">
              Central de <span className="text-blue-500">Inteligência</span>
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl text-lg font-light">
              Monitoramento em tempo real das diretrizes da FIFA, logística das sedes e notícias que impactam as probabilidades.
            </p>
          </div>
          
          <div className="hidden md:block">
             <div className="text-right">
                <div className="text-3xl font-oswald font-bold text-white">2026</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest">Road to World Cup</div>
             </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
             Array.from({ length: 4 }).map((_, i) => (
               <div key={i} className="bg-slate-800/30 h-72 rounded-sm animate-pulse border border-slate-800"></div>
             ))
          ) : (
            news.map((item, idx) => (
              <a 
                key={idx} 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative bg-[#151f32] p-6 h-full flex flex-col transition-all duration-500 hover:-translate-y-2 border border-slate-800 hover:border-yellow-600/50 overflow-hidden"
              >
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-yellow-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                   <div className="flex justify-between items-start mb-4">
                      <div className="bg-blue-900/30 text-blue-400 p-2 rounded-sm">
                         <Zap className="w-4 h-4" />
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-yellow-500 transition-colors" />
                   </div>

                   <h3 className="font-oswald font-bold text-xl mb-3 text-slate-100 group-hover:text-yellow-400 transition-colors line-clamp-3 uppercase leading-tight">
                     {item.title}
                   </h3>
                   
                   <p className="text-slate-400 text-sm leading-relaxed line-clamp-4 mb-6 flex-grow border-l border-slate-700 pl-3">
                     {item.snippet}
                   </p>

                   <div className="pt-4 border-t border-slate-800 flex justify-between items-center mt-auto">
                      <span className="text-xs font-bold text-blue-500 uppercase tracking-wider truncate">
                        {item.source}
                      </span>
                      <span className="text-[10px] text-slate-600 font-mono">
                         #{idx + 1}
                      </span>
                   </div>
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
