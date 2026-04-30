import React, { useState } from 'react';
import { WC_TEAMS } from '../constants';
import { getComparativeAnalysis } from '../services/geminiService';
import { ArrowRightLeft, Shield, Sword, Trophy, History, BrainCircuit, Globe } from 'lucide-react';

const TeamComparator: React.FC = () => {
  const [teamAId, setTeamAId] = useState(WC_TEAMS[0].id);
  const [teamBId, setTeamBId] = useState(WC_TEAMS[1].id);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const teamA = WC_TEAMS.find(t => t.id === teamAId)!;
  const teamB = WC_TEAMS.find(t => t.id === teamBId)!;

  const handleAnalysis = async () => {
    if (teamAId === teamBId) return;
    setLoading(true);
    setAnalysis(null); // Clear previous analysis
    const result = await getComparativeAnalysis(teamA.name, teamB.name);
    setAnalysis(result);
    setLoading(false);
  };

  const StatBar: React.FC<{ valueA: number, valueB: number, colorA: string, colorB: string }> = ({ valueA, valueB, colorA, colorB }) => (
    <div className="flex items-center gap-4 w-full">
      <div className="flex-1 flex justify-end">
        <div className="h-3 rounded-l-full bg-brand-dark/5 w-full flex justify-end relative overflow-hidden">
           <div style={{ width: `${valueA}%`, backgroundColor: colorA }} className="h-full rounded-l-full"></div>
           <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] font-bold text-white mix-blend-difference">{valueA}</span>
        </div>
      </div>
      <div className="w-px h-6 bg-brand-dark/10"></div>
      <div className="flex-1">
        <div className="h-3 rounded-r-full bg-brand-dark/5 w-full relative overflow-hidden">
           <div style={{ width: `${valueB}%`, backgroundColor: colorB }} className="h-full rounded-r-full"></div>
           <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[9px] font-bold text-white mix-blend-difference">{valueB}</span>
        </div>
      </div>
    </div>
  );

  return (
    <section id="comparator" className="py-24 bg-white relative">
       <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col items-center mb-16 text-center">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green/10 text-brand-green rounded-full mb-4">
                <ArrowRightLeft className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Raio-X das Seleções</span>
             </div>
             <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-brand-dark uppercase">
               Análise <span className="text-brand-green">Comparativa</span>
             </h2>
             <p className="mt-4 text-brand-dark/60 max-w-2xl font-opensans">
               Coloque as maiores potências frente a frente. Compare métricas e solicite uma investigação de inteligência artificial sobre o momento atual das equipes.
             </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
             {/* Main Comparator Card */}
             <div className="lg:col-span-12 bg-brand-light/30 border border-brand-dark/5 rounded-3xl p-6 lg:p-12 shadow-sm relative overflow-hidden">
                
                {/* Selectors */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12 relative z-10">
                   {/* Team A */}
                   <div className="w-full md:w-1/3 text-center md:text-left">
                      <select 
                        value={teamAId} 
                        onChange={(e) => setTeamAId(e.target.value)}
                        className="w-full bg-white border border-brand-dark/10 rounded-xl p-3 font-bold text-brand-dark shadow-sm focus:ring-2 focus:ring-brand-green/20 outline-none"
                      >
                         {WC_TEAMS.map(t => <option key={`CA-${t.id}`} value={t.id}>{t.name}</option>)}
                      </select>
                      <div className="mt-6 flex flex-col items-center md:items-start">
                         <div className="text-8xl transform hover:scale-110 transition duration-500 cursor-default mb-2 drop-shadow-sm">{teamA.flag}</div>
                         <h3 className="font-montserrat text-4xl font-bold uppercase text-brand-dark tracking-tighter">{teamA.name}</h3>
                         <div className="text-sm font-bold text-brand-dark/30 uppercase tracking-widest">{teamA.region}</div>
                      </div>
                   </div>

                   {/* VS Graphic */}
                   <div className="w-full md:w-1/3 flex flex-col items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-brand-dark flex items-center justify-center border-4 border-white shadow-xl relative z-10">
                         <span className="font-exo font-bold text-2xl text-white italic pr-1">VS</span>
                      </div>
                      <div className="h-px w-full bg-brand-dark/10 absolute top-1/2 left-0 -z-0 hidden md:block"></div>
                   </div>

                   {/* Team B */}
                   <div className="w-full md:w-1/3 text-center md:text-right">
                      <select 
                        value={teamBId} 
                        onChange={(e) => setTeamBId(e.target.value)}
                        className="w-full bg-white border border-brand-dark/10 rounded-xl p-3 font-bold text-brand-dark shadow-sm focus:ring-2 focus:ring-brand-green/20 outline-none text-right"
                      >
                         {WC_TEAMS.map(t => <option key={`CB-${t.id}`} value={t.id}>{t.name}</option>)}
                      </select>
                      <div className="mt-6 flex flex-col items-center md:items-end">
                         <div className="text-8xl transform hover:scale-110 transition duration-500 cursor-default mb-2 drop-shadow-sm">{teamB.flag}</div>
                         <h3 className="font-montserrat text-4xl font-bold uppercase text-brand-dark tracking-tighter">{teamB.name}</h3>
                         <div className="text-sm font-bold text-brand-dark/30 uppercase tracking-widest">{teamB.region}</div>
                      </div>
                   </div>
                </div>

                {/* Comparison Grid */}
                <div className="grid md:grid-cols-2 gap-12 relative z-10">
                   
                   {/* Stats Columns */}
                   <div className="space-y-8">
                      <h4 className="font-montserrat font-bold text-brand-dark/30 uppercase tracking-widest text-center mb-6 text-[10px]">Métricas de Performance</h4>
                      
                      {/* Attack */}
                      <div>
                         <div className="flex justify-between text-xs font-bold text-brand-dark/50 uppercase mb-2 px-2">
                            <span>Ataque</span>
                            <Sword className="w-4 h-4 text-brand-green/30" />
                            <span>Ataque</span>
                         </div>
                         <StatBar valueA={teamA.attack} valueB={teamB.attack} colorA={teamA.color} colorB={teamB.color} />
                      </div>

                      {/* Defense */}
                      <div>
                         <div className="flex justify-between text-xs font-bold text-brand-dark/50 uppercase mb-2 px-2">
                            <span>Defesa</span>
                            <Shield className="w-4 h-4 text-brand-green/30" />
                            <span>Defesa</span>
                         </div>
                         <StatBar valueA={teamA.defense} valueB={teamB.defense} colorA={teamA.color} colorB={teamB.color} />
                      </div>

                      {/* Ranking FIFA */}
                      <div className="bg-white p-4 rounded-xl border border-brand-dark/5 shadow-sm flex justify-between items-center">
                         <div className="text-center w-1/3">
                            <div className="text-2xl font-montserrat font-bold text-brand-dark">#{teamA.ranking}</div>
                         </div>
                         <div className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-wider">Ranking FIFA</div>
                         <div className="text-center w-1/3">
                            <div className="text-2xl font-montserrat font-bold text-brand-dark">#{teamB.ranking}</div>
                         </div>
                      </div>

                      {/* Titles */}
                      <div className="bg-white p-4 rounded-xl border border-brand-dark/5 shadow-sm flex justify-between items-center">
                         <div className="text-center w-1/3 flex justify-center gap-1">
                            {Array.from({ length: teamA.titles }).map((_, i) => (
                               <Trophy key={i} className="w-4 h-4 text-brand-yellow fill-current" />
                            ))}
                            {teamA.titles === 0 && <span className="text-brand-dark/20 text-sm font-bold">-</span>}
                         </div>
                         <div className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-wider">Títulos Mundiais</div>
                         <div className="text-center w-1/3 flex justify-center gap-1">
                             {Array.from({ length: teamB.titles }).map((_, i) => (
                               <Trophy key={i} className="w-4 h-4 text-brand-yellow fill-current" />
                            ))}
                            {teamB.titles === 0 && <span className="text-brand-dark/20 text-sm font-bold">-</span>}
                         </div>
                      </div>
                       {/* Star Player */}
                       <div className="bg-white p-4 rounded-xl border border-brand-dark/5 shadow-sm flex justify-between items-center">
                         <div className="text-center w-1/3">
                            <div className="text-sm font-bold text-brand-dark">{teamA.starPlayer}</div>
                         </div>
                         <div className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-wider">Craque</div>
                         <div className="text-center w-1/3">
                            <div className="text-sm font-bold text-brand-dark">{teamB.starPlayer}</div>
                         </div>
                      </div>
                   </div>

                   {/* AI Narrative Section */}
                   <div className="flex flex-col h-full">
                      <h4 className="font-montserrat font-bold text-brand-dark/30 uppercase tracking-widest text-center mb-6 text-[10px]">Inteligência Viva (Web Search)</h4>
                      
                      <div className="flex-1 bg-white border border-brand-dark/10 rounded-2xl p-8 relative shadow-sm min-h-[300px]">
                         {!analysis ? (
                           <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                              <History className={`w-12 h-12 ${loading ? 'text-brand-green animate-pulse' : 'text-brand-dark/10'}`} />
                              <p className="text-brand-dark/40 text-sm max-w-xs mx-auto font-opensans">
                                {loading 
                                  ? "Varrendo a web por polêmicas, lesões e notícias de última hora..." 
                                  : "Investigue polêmicas recentes, lesões e bastidores usando Google Search."}
                              </p>
                              {!loading && (
                                <button 
                                  onClick={handleAnalysis}
                                  className="bg-brand-dark hover:bg-brand-green text-white px-8 py-4 rounded-xl font-montserrat font-bold uppercase tracking-wider text-xs transition flex items-center gap-2 shadow-lg"
                                >
                                  Investigar Agora
                                  <Globe className="w-4 h-4" />
                                </button>
                              )}
                           </div>
                         ) : (
                           <div className="prose prose-sm prose-slate max-w-none h-full flex flex-col">
                              <div className="flex items-center gap-2 mb-4 border-b border-brand-dark/5 pb-3">
                                <BrainCircuit className="w-5 h-5 text-brand-green" />
                                <span className="font-bold text-brand-dark uppercase text-xs tracking-wider">Relatório de Inteligência</span>
                              </div>
                              <p className="whitespace-pre-wrap leading-relaxed text-brand-dark/70 flex-grow font-opensans italic">
                                {analysis}
                              </p>
                              <div className="mt-4 pt-4 border-t border-brand-dark/5 flex justify-between items-center">
                                <span className="text-[9px] text-brand-dark/30 font-bold uppercase tracking-widest">Fonte: Google Grounding</span>
                                <button 
                                  onClick={() => setAnalysis(null)} 
                                  className="text-[10px] font-black text-brand-green hover:underline uppercase tracking-wider"
                                >
                                  Nova Investigação
                                </button>
                              </div>
                           </div>
                         )}
                      </div>
                   </div>

                </div>
             </div>
          </div>
       </div>
    </section>
  );
};

export default TeamComparator;