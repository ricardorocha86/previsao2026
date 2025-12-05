
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
  };

  return (
    <section id="simulator" className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.05]" 
             style={{ 
                backgroundImage: 'radial-gradient(#1e3a8a 1px, transparent 1px)', 
                backgroundSize: '24px 24px' 
             }}>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <span className="text-blue-600 font-bold tracking-widest text-xs uppercase border-b-2 border-blue-600 pb-1">Simulador Oficial</span>
            <h2 className="text-5xl md:text-6xl font-oswald font-bold text-slate-900 uppercase">
              Laboratório de <span className="text-blue-800">Probabilidades</span>
            </h2>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
             {/* Header Strip */}
             <div className="h-2 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-900"></div>

             <div className="grid lg:grid-cols-12 min-h-[600px]">
                
                {/* LEFT: Controls */}
                <div className="lg:col-span-4 bg-slate-50 p-8 lg:p-10 border-r border-slate-200 flex flex-col justify-between">
                   <div className="space-y-10">
                      <div>
                        <h3 className="font-oswald text-2xl text-slate-800 mb-6 flex items-center gap-2">
                           <Activity className="w-5 h-5 text-blue-600" /> SETUP DA PARTIDA
                        </h3>
                        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                           Configure o confronto para iniciar a modelagem preditiva baseada em dados históricos e momento atual.
                        </p>
                      </div>

                      {/* Team A Selector */}
                      <div className="space-y-3">
                         <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mandante</label>
                         <div className="relative group">
                            <select 
                              value={teamA} 
                              onChange={(e) => setTeamA(e.target.value)}
                              className="w-full p-4 pl-14 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer hover:border-blue-300"
                            >
                               {WC_TEAMS.map(t => (
                                  <option key={`A-${t.id}`} value={t.id}>{t.name}</option>
                               ))}
                            </select>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl filter grayscale group-hover:grayscale-0 transition-all">
                               {getTeam(teamA)?.flag}
                            </div>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                               <ArrowRight className="w-4 h-4 text-slate-300 rotate-90" />
                            </div>
                         </div>
                      </div>

                      {/* VS Badge */}
                      <div className="flex justify-center -my-2 relative z-10">
                         <div className="bg-slate-200 text-slate-500 font-black text-xs px-3 py-1 rounded-full border-4 border-slate-50">VS</div>
                      </div>

                      {/* Team B Selector */}
                      <div className="space-y-3">
                         <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Visitante</label>
                         <div className="relative group">
                            <select 
                              value={teamB} 
                              onChange={(e) => setTeamB(e.target.value)}
                              className="w-full p-4 pl-14 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer hover:border-blue-300"
                            >
                               {WC_TEAMS.map(t => (
                                  <option key={`B-${t.id}`} value={t.id}>{t.name}</option>
                               ))}
                            </select>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl filter grayscale group-hover:grayscale-0 transition-all">
                               {getTeam(teamB)?.flag}
                            </div>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                               <ArrowRight className="w-4 h-4 text-slate-300 rotate-90" />
                            </div>
                         </div>
                      </div>
                   </div>

                   <button 
                      onClick={handleSimulate}
                      disabled={status === SimulationStatus.LOADING}
                      className="mt-8 w-full bg-slate-900 text-white font-oswald font-bold text-lg py-5 rounded-xl shadow-xl shadow-slate-900/10 hover:bg-blue-900 transition-all transform hover:scale-[1.02] disabled:opacity-80 disabled:cursor-wait flex items-center justify-center gap-3"
                   >
                      {status === SimulationStatus.LOADING ? (
                        <Activity className="w-5 h-5 animate-spin text-blue-400" />
                      ) : (
                        <Calculator className="w-5 h-5 text-blue-400" />
                      )}
                      {status === SimulationStatus.LOADING ? "PROCESSANDO..." : "CALCULAR PROBABILIDADE"}
                   </button>
                </div>

                {/* RIGHT: Display */}
                <div className="lg:col-span-8 bg-white relative flex flex-col">
                   
                   {/* Idle State */}
                   {status === SimulationStatus.IDLE && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                         <BrainCircuit className="w-32 h-32 mb-6 opacity-20" />
                         <p className="font-oswald text-2xl text-slate-400 uppercase tracking-widest">Aguardando Input</p>
                      </div>
                   )}

                   {/* Loading State */}
                   {status === SimulationStatus.LOADING && (
                      <div className="absolute inset-0 bg-slate-900 z-20 flex flex-col items-center justify-center text-white">
                         <div className="w-64 h-1 bg-slate-800 rounded-full mb-8 overflow-hidden">
                            <div className="h-full bg-blue-500 animate-progress"></div>
                         </div>
                         <div className="font-mono text-blue-400 text-sm tracking-widest animate-pulse">
                            {loadingMessages[loadingStep]}
                         </div>
                      </div>
                   )}

                   {/* Result State */}
                   {status === SimulationStatus.SUCCESS && result && (
                      <div className="flex-1 flex flex-col animate-fadeIn">
                         {/* Match Score Header */}
                         <div className="bg-[#0B1120] text-white p-8 lg:p-12 flex justify-between items-center relative overflow-hidden">
                            {/* Abstract Glow */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-900/20 blur-3xl pointer-events-none"></div>

                            {/* Team A */}
                            <div className="text-center relative z-10 w-1/3">
                               <div className="text-5xl lg:text-7xl mb-2">{getTeam(teamA)?.flag}</div>
                               <h2 className="font-oswald font-bold text-xl lg:text-3xl uppercase tracking-wider">{getTeam(teamA)?.name}</h2>
                            </div>

                            {/* Score */}
                            <div className="text-center relative z-10 w-1/3">
                               <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl px-8 py-4 inline-block shadow-2xl">
                                  <span className="font-oswald font-bold text-5xl lg:text-6xl text-white tracking-widest">{result.predictedScore}</span>
                               </div>
                               <div className="mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">Placar Estimado</div>
                            </div>

                            {/* Team B */}
                            <div className="text-center relative z-10 w-1/3">
                               <div className="text-5xl lg:text-7xl mb-2">{getTeam(teamB)?.flag}</div>
                               <h2 className="font-oswald font-bold text-xl lg:text-3xl uppercase tracking-wider">{getTeam(teamB)?.name}</h2>
                            </div>
                         </div>

                         {/* Probabilities Bar (Tug of War) */}
                         <div className="bg-slate-100 p-8 border-b border-slate-200">
                             <div className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-3 tracking-wider">
                                <span>Vitória {getTeam(teamA)?.name}</span>
                                <span>Empate</span>
                                <span>Vitória {getTeam(teamB)?.name}</span>
                             </div>
                             <div className="h-4 lg:h-6 flex rounded-full overflow-hidden shadow-inner bg-slate-200">
                                <div 
                                  style={{ width: `${result.homeWinProbability}%`, backgroundColor: getTeam(teamA)?.color || '#1e40af' }} 
                                  className="h-full relative group"
                                >
                                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {result.homeWinProbability}%
                                  </div>
                                </div>
                                <div 
                                  style={{ width: `${result.drawProbability}%` }} 
                                  className="h-full bg-slate-400 relative group"
                                >
                                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {result.drawProbability}%
                                  </div>
                                </div>
                                <div 
                                  style={{ width: `${result.awayWinProbability}%`, backgroundColor: getTeam(teamB)?.color || '#dc2626' }} 
                                  className="h-full relative group"
                                >
                                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {result.awayWinProbability}%
                                  </div>
                                </div>
                             </div>
                             <div className="flex justify-between mt-2 font-mono text-sm font-bold text-slate-700">
                                <span>{result.homeWinProbability}%</span>
                                <span className="text-slate-400">{result.drawProbability}%</span>
                                <span>{result.awayWinProbability}%</span>
                             </div>
                         </div>

                         {/* Analysis Content */}
                         <div className="p-8 lg:p-10 flex-1 bg-slate-50/50">
                            <div className="flex items-start gap-4 mb-6">
                               <div className="p-2 bg-yellow-100 rounded-lg">
                                  <Trophy className="w-6 h-6 text-yellow-600" />
                               </div>
                               <div>
                                  <h4 className="font-oswald font-bold text-lg text-slate-800 uppercase">Análise do Especialista</h4>
                                  <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                                    "{result.reasoning}"
                                  </p>
                               </div>
                            </div>

                            <div>
                               <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-3">Fatores Chave</h4>
                               <div className="flex flex-wrap gap-2">
                                  {result.keyFactors.map((factor, i) => (
                                     <span key={i} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm font-semibold shadow-sm flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
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
            50% { width: 70%; }
            100% { width: 100%; }
          }
          .animate-progress {
            animation: progress 4s ease-in-out infinite;
          }
        `}</style>
    </section>
  );
};

export default OddsCalculator;
