
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
    <section id="news" className="bg-brand-light py-24 px-4 text-brand-dark relative border-t border-brand-dark/10">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#209927 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 border-b border-brand-dark/10 pb-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-brand-dark uppercase tracking-tighter leading-none">
              Central de <span className="text-brand-green">Notícias</span>
            </h2>
            <p className="text-brand-dark/50 mt-6 max-w-xl text-lg font-opensans leading-relaxed">
              Monitoramento em tempo real das diretrizes da FIFA, logística das sedes e notícias que impactam as probabilidades estatísticas.
            </p>
          </div>
          
          <div className="hidden md:block">
             <div className="text-right">
                <div className="text-4xl font-montserrat font-black text-brand-dark/10">2026</div>
                <div className="text-[10px] text-brand-dark/20 uppercase tracking-[0.3em] font-bold">North America</div>
             </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
             Array.from({ length: 4 }).map((_, i) => (
               <div key={i} className="bg-white/50 h-72 rounded-3xl animate-pulse border border-brand-dark/5"></div>
             ))
          ) : (
            news.map((item, idx) => (
              <a 
                key={idx} 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative bg-white p-8 h-full flex flex-col transition-all duration-500 hover:-translate-y-2 border border-brand-dark/5 hover:border-brand-green/30 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl"
              >
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-brand-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                   <div className="flex justify-between items-start mb-6">
                      <div className="bg-brand-green/10 text-brand-green p-3 rounded-xl">
                         <Zap className="w-5 h-5" />
                      </div>
                      <ExternalLink className="w-4 h-4 text-brand-dark/20 group-hover:text-brand-green transition-colors" />
                   </div>

                   <h3 className="font-montserrat font-bold text-xl mb-4 text-brand-dark group-hover:text-brand-green transition-colors line-clamp-3 uppercase leading-tight tracking-tight">
                     {item.title}
                   </h3>
                   
                   <p className="text-brand-dark/60 text-sm leading-relaxed line-clamp-4 mb-8 flex-grow border-l-2 border-brand-dark/5 pl-4 font-opensans italic">
                     {item.snippet}
                   </p>

                   <div className="pt-6 border-t border-brand-dark/5 flex justify-between items-center mt-auto">
                      <span className="text-[10px] font-black text-brand-green uppercase tracking-widest truncate max-w-[120px]">
                        {item.source}
                      </span>
                      <span className="text-[10px] text-brand-dark/20 font-bold">
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

