
import React, { useState } from 'react';
import { RefreshCw, TrendingDown, HelpCircle, Trophy, AlertTriangle } from 'lucide-react';

const DifficultyVisualizer: React.FC = () => {
  const [winRate, setWinRate] = useState(65); // Average win rate per match for a strong team
  const [selectedProb, setSelectedProb] = useState(15); // For the grid visualization

  // Calculate cumulative probability for 5 knockout games (R32, R16, QF, SF, Final)
  const knockoutStages = 5;
  const cumulativeProb = Math.pow(winRate / 100, knockoutStages) * 100;

  return (
    <section className="bg-brand-dark py-24 px-4 relative overflow-hidden text-white">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-brand-green rounded-full mix-blend-screen filter blur-[80px]"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-yellow rounded-full mix-blend-screen filter blur-[100px]"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-montserrat font-bold uppercase mb-4">
            A Ilusão da <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-neon via-brand-green to-brand-grad1">Certeza</span>
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto text-lg font-opensans leading-relaxed">
            Entender que 15% de chance de título é, na verdade, um status de "Favorito", exige reajustar nossa intuição. Visualizamos aqui a brutalidade matemática do mata-mata.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* VISUALIZATION 1: THE MULTIVERSE GRID */}
          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-md">
                <h3 className="font-montserrat font-bold text-2xl mb-8 flex items-center gap-4 uppercase tracking-tighter">
                   Probabilidades
                </h3>
               
               <div className="mb-10">
                  <label className="flex justify-between text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-6">
                     <span>Probabilidade Estimada: <span className="text-brand-neon text-xl ml-2">{selectedProb}%</span></span>
                  </label>
                  <input 
                    type="range" 
                    min="1" 
                    max="99" 
                    value={selectedProb} 
                    onChange={(e) => setSelectedProb(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-green"
                  />
                  <div className="flex justify-between text-[9px] text-white/20 mt-4 font-bold uppercase tracking-widest">
                     <span>1% (Zebra)</span>
                     <span>50% (Moeda)</span>
                     <span>99% (Certeza)</span>
                  </div>
               </div>

               {/* The Grid */}
               <div className="grid grid-cols-10 gap-2 aspect-square max-w-md mx-auto mb-10">
                  {Array.from({ length: 100 }).map((_, i) => {
                    const isWin = i < selectedProb;
                    return (
                      <div 
                        key={i}
                        className={`rounded-md transition-all duration-500 ${isWin ? 'bg-brand-neon shadow-[0_0_15px_rgba(104,231,15,0.4)] scale-110 z-10' : 'bg-white/5 scale-100'}`}
                      ></div>
                    );
                  })}
               </div>

               <div className="bg-white/5 p-6 rounded-2xl border-l-4 border-brand-neon">
                  <p className="text-sm text-white/60 leading-relaxed font-opensans italic">
                     Se o Brasil tem <strong>{selectedProb}%</strong> de chance de ganhar a Copa, isso significa que em <strong>{100 - selectedProb}</strong> universos paralelos, outra seleção levanta a taça. Mesmo favoritos perdem na grande maioria das vezes.
                  </p>
               </div>
            </div>
          </div>

          {/* VISUALIZATION 2: THE GAUNTLET */}
          <div className="space-y-8">
             <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-md h-full flex flex-col">
                <h3 className="font-montserrat font-bold text-2xl mb-8 flex items-center gap-4 uppercase tracking-tighter">
                   Simulação de Mata-mata
                </h3>
               
               <p className="text-white/40 text-sm mb-10 font-opensans">
                  Para ser campeão em 2026, um time precisará vencer 5 jogos de mata-mata (32-avos até a Final). Veja como a probabilidade colapsa a cada fase.
               </p>

               <div className="mb-10 bg-brand-dark/50 p-8 rounded-3xl border border-white/5">
                  <label className="block text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">
                     Força do Time (Chance por Jogo)
                  </label>
                  <div className="flex items-center gap-6">
                     <input 
                       type="range" 
                       min="50" 
                       max="95" 
                       value={winRate} 
                       onChange={(e) => setWinRate(parseInt(e.target.value))}
                       className="flex-1 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-red"
                     />
                     <span className="text-3xl font-montserrat font-black text-brand-red w-20 text-right">{winRate}%</span>
                  </div>
                  <p className="text-[9px] text-white/20 mt-4 uppercase font-bold tracking-widest">
                     *Um time "Dominante" tem cerca de 65-70% contra oponentes variados.
                  </p>
               </div>

               {/* The Funnel Visualization */}
               <div className="flex-1 flex flex-col justify-between space-y-3 relative">
                  {/* Phase 1 */}
                  <div className="flex items-center gap-6 group">
                     <div className="w-24 text-right text-[10px] font-black text-white/30 uppercase tracking-widest">32-Avos</div>
                     <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden">
                        <div style={{ width: '100%' }} className="h-full bg-white/20"></div>
                     </div>
                     <div className="w-16 font-montserrat text-xs font-bold text-white/20">100%</div>
                  </div>
                  
                  {/* Arrow */}
                  <div className="pl-32 opacity-10"><ArrowDownIcon /></div>

                  {/* Phase 2: R16 */}
                  <div className="flex items-center gap-6">
                     <div className="w-24 text-right text-[10px] font-black text-white/30 uppercase tracking-widest">Oitavas</div>
                     <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden">
                        <div style={{ width: `${winRate}%` }} className="h-full bg-brand-red/40 transition-all duration-500 shadow-[0_0_10px_rgba(191,26,31,0.3)]"></div>
                     </div>
                     <div className="w-16 font-montserrat text-xs font-bold text-white/60">{winRate.toFixed(1)}%</div>
                  </div>

                  {/* Arrow */}
                  <div className="pl-32 opacity-10"><ArrowDownIcon /></div>

                  {/* Phase 3: QF */}
                  <div className="flex items-center gap-6">
                     <div className="w-24 text-right text-[10px] font-black text-white/30 uppercase tracking-widest">Quartas</div>
                     <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden">
                        <div style={{ width: `${Math.pow(winRate/100, 2)*100}%` }} className="h-full bg-brand-red/60 transition-all duration-500 shadow-[0_0_10px_rgba(191,26,31,0.4)]"></div>
                     </div>
                     <div className="w-16 font-montserrat text-xs font-bold text-white/80">{(Math.pow(winRate/100, 2)*100).toFixed(1)}%</div>
                  </div>

                   {/* Arrow */}
                   <div className="pl-32 opacity-10"><ArrowDownIcon /></div>

                  {/* Phase 4: SF */}
                  <div className="flex items-center gap-6">
                     <div className="w-24 text-right text-[10px] font-black text-white/30 uppercase tracking-widest">Semi</div>
                     <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden">
                        <div style={{ width: `${Math.pow(winRate/100, 3)*100}%` }} className="h-full bg-brand-red/80 transition-all duration-500 shadow-[0_0_10px_rgba(191,26,31,0.5)]"></div>
                     </div>
                     <div className="w-16 font-montserrat text-xs font-bold text-white">{(Math.pow(winRate/100, 3)*100).toFixed(1)}%</div>
                  </div>

                   {/* Arrow */}
                   <div className="pl-32 opacity-10"><ArrowDownIcon /></div>

                  {/* Phase 5: Final */}
                  <div className="flex items-center gap-6">
                     <div className="w-24 text-right text-[10px] font-black text-white/30 uppercase tracking-widest">Final</div>
                     <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden">
                        <div style={{ width: `${Math.pow(winRate/100, 4)*100}%` }} className="h-full bg-brand-red transition-all duration-500 shadow-[0_0_15px_rgba(191,26,31,0.6)]"></div>
                     </div>
                     <div className="w-16 font-montserrat text-sm font-black text-brand-red">{(Math.pow(winRate/100, 4)*100).toFixed(1)}%</div>
                  </div>

                   {/* Arrow */}
                   <div className="pl-32 opacity-10"><ArrowDownIcon /></div>

                   {/* CHAMPION */}
                   <div className="flex items-center gap-6 p-6 bg-brand-yellow/10 border border-brand-yellow/30 rounded-2xl mt-4">
                     <div className="w-24 text-right text-[10px] font-black text-brand-yellow uppercase flex justify-end tracking-widest"><Trophy className="w-6 h-6" /></div>
                     <div className="flex-1 text-[10px] text-brand-yellow/70 font-black uppercase tracking-[0.2em]">Probabilidade Final de Título</div>
                     <div className="w-16 font-montserrat text-3xl font-black text-brand-yellow">{(Math.pow(winRate/100, 5)*100).toFixed(1)}%</div>
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
