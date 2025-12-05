
import React from 'react';
import { PUBLICATIONS } from '../constants';
import { FileText, Download, Bookmark, ArrowUpRight, GraduationCap } from 'lucide-react';

const SciencePage: React.FC = () => {
  return (
    <div className="bg-[#f8fafc] min-h-screen py-24 px-4 font-inter text-slate-900">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(#1e3a8a 1px, transparent 1px)', 
          backgroundSize: '30px 30px' 
        }}>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-full mb-6 shadow-sm">
             <Bookmark className="w-3 h-3 text-blue-800" />
             <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Biblioteca Acadêmica</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-oswald font-bold text-slate-900 uppercase tracking-tight mb-4">
            Produção <span className="text-blue-700">Científica</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-light">
             Publicações fundamentais para a metodologia estatística utilizada.
          </p>
        </div>

        <div className="grid gap-6">
           {PUBLICATIONS.map((pub) => (
             <div key={pub.id} className="group bg-white rounded-2xl p-0 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden flex flex-col md:flex-row">
                
                {/* Visual Strip */}
                <div className="bg-slate-50 border-r border-slate-100 p-6 flex flex-col items-center justify-center md:w-32 gap-2 group-hover:bg-blue-50 transition-colors">
                   <GraduationCap className="w-8 h-8 text-slate-300 group-hover:text-blue-500 transition-colors" />
                   <span className="text-xl font-bold font-oswald text-slate-700 group-hover:text-blue-600 transition-colors">{pub.year}</span>
                </div>
                
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                   <div>
                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-full group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                             {pub.journal}
                          </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-3 font-serif leading-snug group-hover:text-blue-800 transition-colors">
                          {pub.title}
                      </h3>

                      {/* Authors */}
                      <p className="text-sm text-slate-500 font-medium">
                        {pub.authors}
                      </p>
                   </div>
                   
                   <div className="mt-6 flex items-center gap-4">
                      <a 
                        href={pub.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-wider"
                      >
                         Acessar Artigo <ArrowUpRight className="w-4 h-4" />
                      </a>
                   </div>
                </div>
             </div>
           ))}
        </div>

        <div className="mt-16 text-center border-t border-slate-200 pt-8">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
               DOI System • Digital Object Identifier
            </p>
        </div>
      </div>
    </div>
  );
};

export default SciencePage;