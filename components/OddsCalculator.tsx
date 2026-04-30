
import React, { useState, useEffect } from 'react';
import { WC_TEAMS } from '../constants';
import { calculateOdds } from '../services/geminiService';
import { PredictionResult, SimulationStatus } from '../types';
import { Calculator, AlertCircle, Trophy, Activity, BrainCircuit, ArrowRight } from 'lucide-react';

const OddsCalculator: React.FC = () => {
  const [teamA, setTeamA] = useState(WC_TEAMS[0].id);
  const [teamB, setTeamB] = useState(WC_TEAMS[1].id);
  const [status, setStatus] = useState<SimulationStatus>(SimulationStatus.IDLE);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  // Helper to find full team object
  const getTeam = (id: string) => WC_TEAMS.find(t => t.id === id);

  const loadingMessages = [
    "ACESSANDO BANCO DE DADOS FIFA...",
    "ANALISANDO CONFRONTOS DIRETOS...",
    "SIMULANDO VARIÁVEIS TÁTICAS...",
    "CALCULANDO EXPECTATIVA DE GOLS (xG)...",
    "GERANDO RELATÓRIO FINAL..."
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === SimulationStatus.LOADING) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % loadingMessages.length);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleSimulate = async () => {
    if (teamA === teamB) {
      alert("Selecione duas equipes diferentes.");
      return;
    }
    setStatus(SimulationStatus.LOADING);
    
    const minTimePromise = new Promise(resolve => setTimeout(resolve, 3000));
    const dataPromise = calculateOdds(
      getTeam(teamA)?.name || '',
      getTeam(teamB)?.name || ''
    );

    const [data] = await Promise.all([dataPromise, minTimePromise]);
    setResult(data);
    setStatus(SimulationStatus.SUCCESS);
  };  return (
    <section id="simulator" className="py-24 bg-brand-light relative overflow-hidden">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03]" 
             style={{ 
                backgroundImage: 'radial-gradient(#209927 1px, transparent 1px)', 
                backgroundSize: '32px 32px' 
             }}>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-montserrat font-bold text-brand-dark uppercase tracking-tighter leading-none mb-4">
              Laboratório de <span className="text-brand-green">Probabilidades</span>
            </h2>
            <p className="text-brand-dark/50 max-w-2xl mx-auto text-lg font-opensans">
              Projete resultados baseados em dados históricos e performance técnica das seleções.
            </p>
          </div>

          <div className="bg-white rounded-[3rem] shadow-2xl shadow-brand-dark/5 overflow-hidden border border-brand-dark/5">
             {/* Header Strip */}
             <div className="h-2 bg-gradient-to-r from-brand-green via-brand-neon to-brand-yellow"></div>

             <div className="grid lg:grid-cols-12 min-h-[650px]">
                
                {/* LEFT: Controls */}
                <div className="lg:col-span-4 bg-brand-light/20 p-8 lg:p-12 border-r border-brand-dark/5 flex flex-col justify-between">
                   <div className="space-y-12">
                      <div>
                        <h3 className="font-montserrat font-bold text-xl text-brand-dark mb-6 flex items-center gap-3 uppercase tracking-tighter">
                           Confronto
                        </h3>
                        <p className="text-brand-dark/40 text-xs font-opensans leading-relaxed">
                           Selecione as equipes para iniciar a simulação baseada em histórico, momento atual e tática.
                        </p>
                      </div>

                      {/* Team A Selector */}
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-brand-dark/30 uppercase tracking-[0.2em]">Mandante</label>
                         <div className="relative group">
                            <select 
                              value={teamA} 
                              onChange={(e) => setTeamA(e.target.value)}
                              className="w-full p-5 pl-16 bg-white border border-brand-dark/10 rounded-2xl font-montserrat font-bold text-brand-dark shadow-sm outline-none focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green transition-all appearance-none cursor-pointer"
                            >
                               {WC_TEAMS.map(t => (
                                  <option key={`A-${t.id}`} value={t.id}>{t.name}</option>
                               ))}
                            </select>
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-3xl transition-transform group-hover:scale-110">
                               {getTeam(teamA)?.flag}
                            </div>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                               <ArrowRight className="w-4 h-4 rotate-90" />
                            </div>
                         </div>
                      </div>

                      {/* VS Badge */}
                      <div className="flex justify-center -my-4 relative z-10">
                         <div className="bg-brand-dark text-white font-exo font-bold text-xs italic px-5 py-2 rounded-full border-4 border-white shadow-lg pr-6">VS</div>
                      </div>

                      {/* Team B Selector */}
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-brand-dark/30 uppercase tracking-[0.2em]">Visitante</label>
                         <div className="relative group">
                            <select 
                              value={teamB} 
                              onChange={(e) => setTeamB(e.target.value)}
                              className="w-full p-5 pl-16 bg-white border border-brand-dark/10 rounded-2xl font-montserrat font-bold text-brand-dark shadow-sm outline-none focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green transition-all appearance-none cursor-pointer"
                            >
                               {WC_TEAMS.map(t => (
                                  <option key={`B-${t.id}`} value={t.id}>{t.name}</option>
                               ))}
                            </select>
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-3xl transition-transform group-hover:scale-110">
                               {getTeam(teamB)?.flag}
                            </div>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                               <ArrowRight className="w-4 h-4 rotate-90" />
                            </div>
                         </div>
                      </div>
                   </div>

                   <button 
                      onClick={handleSimulate}
                      disabled={status === SimulationStatus.LOADING}
                      className="mt-12 w-full bg-brand-dark hover:bg-brand-green text-white font-montserrat font-bold text-sm py-6 rounded-2xl shadow-xl shadow-brand-dark/20 transition-all transform hover:scale-[1.02] disabled:opacity-80 disabled:cursor-wait flex items-center justify-center gap-3 uppercase tracking-widest"
                   >
                      {status === SimulationStatus.LOADING ? (
                        <Activity className="w-5 h-5 animate-spin text-brand-neon" />
                      ) : (
                        <Calculator className="w-5 h-5 text-brand-neon" />
                      )}
                      {status === SimulationStatus.LOADING ? "Analizando..." : "Iniciar Simulação"}
                   </button>
                </div>

                {/* RIGHT: Display */}
                <div className="lg:col-span-8 bg-white relative flex flex-col">
                   
                   {/* Idle State */}
                   {status === SimulationStatus.IDLE && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-dark/5">
                         <div className="relative">
                            <BrainCircuit className="w-40 h-40 mb-8 opacity-10" />
                            <div className="absolute inset-0 animate-pulse bg-brand-green/5 blur-3xl rounded-full"></div>
                         </div>
                         <p className="font-montserrat font-black text-2xl uppercase tracking-[0.4em] text-brand-dark/10">Pronto</p>
                         <p className="text-[10px] font-bold uppercase tracking-widest mt-2 text-brand-dark/20">Aguardando Seleções</p>
                      </div>
                   )}

                   {/* Loading State */}
                   {status === SimulationStatus.LOADING && (
                      <div className="absolute inset-0 bg-brand-dark z-20 flex flex-col items-center justify-center text-white p-12 text-center">
                         <div className="w-72 h-1.5 bg-white/10 rounded-full mb-10 overflow-hidden">
                            <div className="h-full bg-brand-green animate-progress shadow-[0_0_15px_rgba(32,153,39,0.5)]"></div>
                         </div>
                         <div className="font-montserrat font-black text-brand-green text-xs tracking-[0.3em] animate-pulse uppercase max-w-sm leading-loose">
                            {loadingMessages[loadingStep]}
                         </div>
                         <div className="mt-20 flex gap-4 opacity-20">
                            <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                         </div>
                      </div>
                   )}

                   {/* Result State */}
                   {status === SimulationStatus.SUCCESS && result && (
                      <div className="flex-1 flex flex-col animate-fadeIn">
                         {/* Match Score Header */}
                         <div className="bg-brand-dark text-white p-10 lg:p-16 flex justify-between items-center relative overflow-hidden">
                            {/* Abstract Glow */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-brand-green/10 blur-3xl pointer-events-none"></div>

                            {/* Team A */}
                            <div className="text-center relative z-10 w-1/3">
                               <div className="text-6xl lg:text-8xl mb-4 drop-shadow-2xl">{getTeam(teamA)?.flag}</div>
                               <h2 className="font-montserrat font-black text-xl lg:text-3xl uppercase tracking-tighter">{getTeam(teamA)?.name}</h2>
                            </div>

                            {/* Score */}
                            <div className="text-center relative z-10 w-1/3">
                               <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] px-10 py-6 inline-block shadow-2xl">
                                  <span className="font-montserrat font-black text-6xl lg:text-8xl text-brand-green tracking-tighter">{result.predictedScore}</span>
                               </div>
                               <div className="mt-4 text-[10px] text-white/30 font-black uppercase tracking-[0.4em]">Placar Provável</div>
                            </div>

                            {/* Team B */}
                            <div className="text-center relative z-10 w-1/3">
                               <div className="text-6xl lg:text-8xl mb-4 drop-shadow-2xl">{getTeam(teamB)?.flag}</div>
                               <h2 className="font-montserrat font-black text-xl lg:text-3xl uppercase tracking-tighter">{getTeam(teamB)?.name}</h2>
                            </div>
                         </div>

                         {/* Probabilities Bar (Tug of War) */}
                         <div className="bg-brand-light/50 p-10 border-b border-brand-dark/5">
                             <div className="flex justify-between text-[10px] font-black text-brand-dark/40 uppercase mb-4 tracking-[0.2em]">
                                <span>Vitória {getTeam(teamA)?.name}</span>
                                <span className="text-brand-dark/20">Empate</span>
                                <span>Vitória {getTeam(teamB)?.name}</span>
                             </div>
                             <div className="h-6 lg:h-10 flex rounded-2xl overflow-hidden shadow-inner bg-brand-dark/5 p-1">
                                <div 
                                  style={{ width: `${result.homeWinProbability}%`, backgroundColor: getTeam(teamA)?.color || '#209927' }} 
                                  className="h-full relative group rounded-l-xl transition-all duration-1000"
                                >
                                </div>
                                <div 
                                  style={{ width: `${result.drawProbability}%` }} 
                                  className="h-full bg-brand-dark/10 relative group transition-all duration-1000"
                                >
                                </div>
                                <div 
                                  style={{ width: `${result.awayWinProbability}%`, backgroundColor: getTeam(teamB)?.color || '#BF1A1F' }} 
                                  className="h-full relative group rounded-r-xl transition-all duration-1000"
                                >
                                </div>
                             </div>
                             <div className="flex justify-between mt-4 font-montserrat text-lg font-black text-brand-dark">
                                <span>{result.homeWinProbability}%</span>
                                <span className="text-brand-dark/20">{result.drawProbability}%</span>
                                <span>{result.awayWinProbability}%</span>
                             </div>
                         </div>

                         {/* Analysis Content */}
                         <div className="p-10 lg:p-14 flex-1 bg-white">
                            <div className="flex items-start gap-6 mb-10">
                               <div className="p-4 bg-brand-yellow/10 rounded-2xl">
                                  <Trophy className="w-8 h-8 text-brand-yellow" />
                               </div>
                               <div>
                                  <h4 className="font-montserrat font-black text-xl text-brand-dark uppercase tracking-tighter mb-2">Análise</h4>
                                  <p className="text-brand-dark/60 text-base leading-relaxed font-opensans italic">
                                    "{result.reasoning}"
                                  </p>
                               </div>
                            </div>

                            <div>
                               <h4 className="font-black text-brand-dark/20 text-[10px] uppercase tracking-[0.3em] mb-6">Fatores Analisados</h4>
                               <div className="flex flex-wrap gap-3">
                                  {result.keyFactors.map((factor, i) => (
                                     <span key={i} className="px-6 py-3 bg-brand-light/50 border border-brand-dark/5 rounded-xl text-brand-dark text-xs font-bold shadow-sm flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-brand-green shadow-[0_0_8px_rgba(32,153,39,0.5)]"></div>
                                        {factor}
                                     </span>
                                  ))}
                                </div>
                            </div>
                         </div>
                      </div>
                   )}
                </div>
             </div>
          </div>
        </div>
        
        <style>{`
          @keyframes progress {
            0% { width: 0%; }
            20% { width: 30%; }
            70% { width: 60%; }
            100% { width: 100%; }
          }
          .animate-progress {
            animation: progress 4s cubic-bezier(0.65, 0, 0.35, 1) infinite;
          }
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
    </section>
  );
};


export default OddsCalculator;
