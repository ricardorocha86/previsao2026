import React from 'react';
import { PUBLICATIONS } from '../constants';
import { Bookmark, ArrowUpRight, GraduationCap, FileText } from 'lucide-react';

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
             Artigos e estudos que fundamentam a metodologia estatística do projeto.
          </p>
        </div>

        <div className="grid gap-6">
           {PUBLICATIONS.map((pub) => (
             <div key={pub.id} className="group relative bg-white rounded-xl p-8 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col md:flex-row gap-6">
                
                {/* Accent Line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Left: Meta */}
                <div className="md:w-48 flex-shrink-0 flex flex-col items-start gap-2 border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6">
                   <div className="text-4xl font-oswald font-bold text-slate-200 group-hover:text-blue-600 transition-colors duration-300">
                      {pub.year}
                   </div>
                   <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">
                      <FileText className="w-3 h-3" />
                      Paper
                   </div>
                   <div className="text-[10px] text-slate-400 font-mono mt-auto leading-relaxed hidden md:block">
                      ID: {pub.id.padStart(4, '0')}
                   </div>
                </div>
                
                {/* Right: Content */}
                <div className="flex-1 flex flex-col">
                   <div className="mb-4">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-2">
                         {pub.journal}
                      </span>
                      <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-900 leading-snug group-hover:text-blue-800 transition-colors">
                          {pub.title}
                      </h3>
                   </div>

                   <div className="mt-auto pt-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
                      <div className="text-sm text-slate-500 font-medium italic">
                         {pub.authors}
                      </div>
                      <a 
                        href={pub.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold bg-slate-900 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors uppercase tracking-wider shadow-sm self-start md:self-auto"
                      >
                         Ler Publicação <ArrowUpRight className="w-3 h-3" />
                      </a>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default SciencePage;