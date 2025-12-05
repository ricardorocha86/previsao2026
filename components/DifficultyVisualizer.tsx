
import React, { useState } from 'react';
import { RefreshCw, TrendingDown, HelpCircle, Trophy, AlertTriangle } from 'lucide-react';

const DifficultyVisualizer: React.FC = () => {
  const [winRate, setWinRate] = useState(65); // Average win rate per match for a strong team
  const [selectedProb, setSelectedProb] = useState(15); // For the grid visualization

  // Calculate cumulative probability for 5 knockout games (R32, R16, QF, SF, Final)
  const knockoutStages = 5;
  const cumulativeProb = Math.pow(winRate / 100, knockoutStages) * 100;

  return (
    <section className="bg-slate-900 py-24 px-4 relative overflow-hidden text-white">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-600 rounded-full mix-blend-screen filter blur-[80px]"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px]"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-full mb-6">
             <BrainIcon className="w-4 h-4 text-purple-400" />
             <span className="text-xs font-bold text-purple-300 uppercase tracking-widest">Educação Estatística</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-oswald font-bold uppercase mb-4">
            A Ilusão da <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Certeza</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Entender que 15% de chance de título é, na verdade, um status de "Favorito", exige reajustar nossa intuição. Visualizamos aqui a brutalidade matemática do mata-mata.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* VISUALIZATION 1: THE MULTIVERSE GRID */}
          <div className="space-y-8">
            <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl backdrop-blur-sm">
               <h3 className="font-oswald text-2xl mb-6 flex items-center gap-3">
                 <div className="p-2 bg-blue-500/20 rounded-lg">
                    <GridIcon className="w-5 h-5 text-blue-400" />
                 </div>
                 O Multiverso (100 Cenários)
               </h3>
               
               <div className="mb-8">
                  <label className="flex justify-between text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                     <span>Probabilidade Estimada: <span className="text-white text-lg">{selectedProb}%</span></span>
                  </label>
                  <input 
                    type="range" 
                    min="1" 
                    max="99" 
                    value={selectedProb} 
                    onChange={(e) => setSelectedProb(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                     <span>1% (Zebra Histórica)</span>
                     <span>50% (Moeda)</span>
                     <span>99% (Certeza)</span>
                  </div>
               </div>

               {/* The Grid */}
               <div className="grid grid-cols-10 gap-1.5 aspect-square max-w-md mx-auto mb-6">
                  {Array.from({ length: 100 }).map((_, i) => {
                    const isWin = i < selectedProb;
                    return (
                      <div 
                        key={i}
                        className={`rounded-sm transition-all duration-300 ${isWin ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)] scale-110 z-10' : 'bg-slate-700/50 scale-100'}`}
                      ></div>
                    );
                  })}
               </div>

               <div className="bg-slate-900/80 p-4 rounded-xl border-l-4 border-yellow-500">
                  <p className="text-sm text-slate-300 leading-relaxed">
                     Se o Brasil tem <strong>{selectedProb}%</strong> de chance de ganhar a Copa, isso significa que em <strong>{100 - selectedProb}</strong> universos paralelos, outra seleção levanta a taça. Mesmo favoritos perdem na grande maioria das vezes.
                  </p>
               </div>
            </div>
          </div>

          {/* VISUALIZATION 2: THE GAUNTLET */}
          <div className="space-y-8">
             <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl backdrop-blur-sm h-full flex flex-col">
                <h3 className="font-oswald text-2xl mb-6 flex items-center gap-3">
                 <div className="p-2 bg-red-500/20 rounded-lg">
                    <TrendingDown className="w-5 h-5 text-red-400" />
                 </div>
                 O "Corredor da Morte"
               </h3>
               
               <p className="text-slate-400 text-sm mb-8">
                  Para ser campeão em 2026, um time precisará vencer 5 jogos de mata-mata (32-avos até a Final). Veja como a probabilidade colapsa a cada fase.
               </p>

               <div className="mb-8 bg-slate-900 p-6 rounded-2xl border border-slate-700">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                     Força do Time (Chance de Vitória por Jogo)
                  </label>
                  <div className="flex items-center gap-4">
                     <input 
                       type="range" 
                       min="50" 
                       max="95" 
                       value={winRate} 
                       onChange={(e) => setWinRate(parseInt(e.target.value))}
                       className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                     />
                     <span className="text-2xl font-oswald font-bold text-white w-16 text-right">{winRate}%</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                     *Um time "Dominante" tem cerca de 65-70% contra oponentes variados.
                  </p>
               </div>

               {/* The Funnel Visualization */}
               <div className="flex-1 flex flex-col justify-between space-y-2 relative">
                  {/* Phase 1 */}
                  <div className="flex items-center gap-4 group">
                     <div className="w-24 text-right text-xs font-bold text-slate-400 uppercase">32-Avos</div>
                     <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div style={{ width: '100%' }} className="h-full bg-slate-500"></div>
                     </div>
                     <div className="w-16 font-mono text-xs text-slate-500">100%</div>
                  </div>
                  
                  {/* Arrow */}
                  <div className="pl-28 opacity-20"><ArrowDownIcon /></div>

                  {/* Phase 2: R16 */}
                  <div className="flex items-center gap-4">
                     <div className="w-24 text-right text-xs font-bold text-slate-400 uppercase">Oitavas</div>
                     <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div style={{ width: `${winRate}%` }} className="h-full bg-red-400 transition-all duration-500"></div>
                     </div>
                     <div className="w-16 font-mono text-sm font-bold text-white">{winRate.toFixed(1)}%</div>
                  </div>

                  {/* Arrow */}
                  <div className="pl-28 opacity-20"><ArrowDownIcon /></div>

                  {/* Phase 3: QF */}
                  <div className="flex items-center gap-4">
                     <div className="w-24 text-right text-xs font-bold text-slate-400 uppercase">Quartas</div>
                     <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div style={{ width: `${Math.pow(winRate/100, 2)*100}%` }} className="h-full bg-red-500 transition-all duration-500"></div>
                     </div>
                     <div className="w-16 font-mono text-sm font-bold text-white">{(Math.pow(winRate/100, 2)*100).toFixed(1)}%</div>
                  </div>

                   {/* Arrow */}
                   <div className="pl-28 opacity-20"><ArrowDownIcon /></div>


                  {/* Phase 4: SF */}
                  <div className="flex items-center gap-4">
                     <div className="w-24 text-right text-xs font-bold text-slate-400 uppercase">Semi</div>
                     <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div style={{ width: `${Math.pow(winRate/100, 3)*100}%` }} className="h-full bg-red-600 transition-all duration-500"></div>
                     </div>
                     <div className="w-16 font-mono text-sm font-bold text-white">{(Math.pow(winRate/100, 3)*100).toFixed(1)}%</div>
                  </div>

                   {/* Arrow */}
                   <div className="pl-28 opacity-20"><ArrowDownIcon /></div>

                  {/* Phase 5: Final */}
                  <div className="flex items-center gap-4">
                     <div className="w-24 text-right text-xs font-bold text-slate-400 uppercase">Final</div>
                     <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div style={{ width: `${Math.pow(winRate/100, 4)*100}%` }} className="h-full bg-red-700 transition-all duration-500"></div>
                     </div>
                     <div className="w-16 font-mono text-sm font-bold text-white">{(Math.pow(winRate/100, 4)*100).toFixed(1)}%</div>
                  </div>

                   {/* Arrow */}
                   <div className="pl-28 opacity-20"><ArrowDownIcon /></div>

                   {/* CHAMPION */}
                   <div className="flex items-center gap-4 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-xl mt-2">
                     <div className="w-24 text-right text-xs font-bold text-yellow-500 uppercase flex justify-end"><Trophy className="w-5 h-5" /></div>
                     <div className="flex-1 text-xs text-yellow-200 uppercase tracking-wider">Probabilidade Final de Título</div>
                     <div className="w-16 font-mono text-2xl font-bold text-yellow-400">{(Math.pow(winRate/100, 5)*100).toFixed(1)}%</div>
                  </div>
               </div>

             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Icons components
const GridIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const BrainIcon = ({ className }: { className?: string }) => (
   <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
   </svg>
);

const ArrowDownIcon = () => (
   <svg className="w-3 h-3 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M19 12l-7 7-7-7" />
   </svg>
)

export default DifficultyVisualizer;
