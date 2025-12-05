import React from 'react';
import { RESEARCHERS } from '../constants';

const TeamPage: React.FC = () => {
  return (
    <div className="bg-[#050B14] min-h-screen py-24 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #172554 0%, transparent 60%)' }}>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block px-3 py-1 border border-blue-500/30 rounded-full bg-blue-900/10 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
            Pesquisadores
          </div>
          <h2 className="text-4xl md:text-5xl font-oswald font-bold text-white uppercase tracking-tight">
            Equipe de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Pesquisa</span>
          </h2>
          <p className="mt-6 text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Grupo acadêmico dedicado à estatística aplicada ao esporte.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12 justify-center">
          {RESEARCHERS.map((researcher) => (
            <div key={researcher.id} className="group">
               <div className="relative flex flex-col items-center text-center">
                  {/* Image Container - Reduced size, ensuring no grayscale */}
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-slate-700 group-hover:border-blue-500 transition-colors mb-4 relative shadow-lg bg-slate-800">
                    <img 
                      src={researcher.image} 
                      alt={researcher.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="space-y-1 w-full px-2">
                     <h3 className="font-oswald font-medium text-sm md:text-base text-white uppercase tracking-wide group-hover:text-blue-400 transition-colors">
                        {researcher.name}
                     </h3>
                     
                     <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                        {researcher.role}
                     </div>

                     <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono truncate">
                        {researcher.affiliation}
                     </p>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;