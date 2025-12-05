
import React, { useEffect, useState } from 'react';
import { Activity, Globe2, Trophy, Cpu, Search, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { WC_TEAMS } from '../constants';

const Hero: React.FC = () => {
  const [activeMatch, setActiveMatch] = useState(0);
  
  // Simulation of "Live Data" cycling through matchups
  const mockMatchups = [
    { a: 'BRA', b: 'FRA', probA: 45, probB: 30, draw: 25 },
    { a: 'ARG', b: 'GER', probA: 42, probB: 38, draw: 20 },
    { a: 'USA', b: 'ENG', probA: 22, probB: 55, draw: 23 },
    { a: 'ESP', b: 'POR', probA: 38, probB: 36, draw: 26 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMatch((prev) => (prev + 1) % mockMatchups.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentMatch = mockMatchups[activeMatch];
  const teamA = WC_TEAMS.find(t => t.id === currentMatch.a);
  const teamB = WC_TEAMS.find(t => t.id === currentMatch.b);

  return (
    <div className="relative bg-[#050B14] text-white overflow-hidden min-h-[90vh] flex flex-col justify-center">
      {/* --- BACKGROUND LAYERS --- */}
      
      {/* 1. Grid Floor */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)', 
             backgroundSize: '40px 40px',
             perspective: '1000px',
             transform: 'scale(1.5) perspective(500px) rotateX(60deg) translateY(100px)'
           }}>
      </div>

      {/* 2. Spotlight Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>

      {/* 3. Scanlines */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 z-0 pointer-events-none"></div>

      {/* --- CONTENT --- */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid lg:grid-cols-12 gap-16 items-center">
          
          {/* LEFT: TEXT & CTA */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-3 border border-blue-500/30 bg-blue-900/10 backdrop-blur-md px-4 py-2 rounded-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-blue-300 text-[10px] font-mono uppercase tracking-[0.2em]">Sistema Operacional v.2026</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-oswald font-bold leading-[0.9] tracking-tighter text-white">
              INTELIGÊNCIA <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-slate-400">
                PREDITIVA
              </span>
            </h1>
            
            <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed font-light border-l-2 border-blue-500 pl-6">
              A convergência entre Big Data e Futebol. Utilize nossos modelos matemáticos para simular cenários da Copa do Mundo FIFA 2026™ na América do Norte.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <a href="#hub" className="group relative px-8 py-4 bg-white text-[#050B14] font-oswald font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                <div className="absolute inset-0 bg-blue-100 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out origin-left"></div>
                <span className="relative z-10 flex items-center gap-2">
                  <Cpu className="w-5 h-5" /> Acessar Sistema
                </span>
              </a>
              
              <a href="#methodology" className="group px-8 py-4 border border-slate-700 text-slate-300 font-oswald font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:border-blue-500 hover:text-white transition-all">
                <Search className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
                Metodologia
              </a>
            </div>

            {/* Stats Ticker */}
            <div className="pt-8 flex items-center gap-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
               <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Dados Verificados</span>
               </div>
               <div className="h-4 w-px bg-slate-800"></div>
               <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>Latência &lt; 20ms</span>
               </div>
               <div className="h-4 w-px bg-slate-800"></div>
               <div>
                  Build: 2.5-Flash
               </div>
            </div>
          </div>
          
          {/* RIGHT: LIVE PREDICTION CARD */}
          <div className="lg:col-span-5 relative perspective-1000 hidden lg:block">
             <div className="relative z-10 bg-[#0B1221] border border-slate-800 rounded-2xl p-6 shadow-2xl shadow-blue-900/20 backdrop-blur-sm transform rotate-y-[-10deg] hover:rotate-y-0 transition-transform duration-700">
                
                {/* Header Card */}
                <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
                   <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-500" />
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Simulação Contínua</span>
                   </div>
                   <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                   </div>
                </div>

                {/* Match Display */}
                <div className="flex justify-between items-center mb-8">
                   <div className="text-center group cursor-pointer">
                      <div className="text-6xl mb-2 transition-transform group-hover:scale-110">{teamA?.flag}</div>
                      <div className="font-oswald font-bold text-2xl uppercase">{teamA?.id}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest">{teamA?.tier} Tier</div>
                   </div>

                   <div className="flex flex-col items-center gap-2">
                      <div className="text-xs font-bold text-slate-500 uppercase">VS</div>
                      <div className="h-px w-12 bg-slate-700"></div>
                   </div>

                   <div className="text-center group cursor-pointer">
                      <div className="text-6xl mb-2 transition-transform group-hover:scale-110">{teamB?.flag}</div>
                      <div className="font-oswald font-bold text-2xl uppercase">{teamB?.id}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest">{teamB?.tier} Tier</div>
                   </div>
                </div>

                {/* Bars */}
                <div className="space-y-4 font-mono text-xs">
                   <div className="space-y-1">
                      <div className="flex justify-between text-slate-400">
                         <span>Vitória {teamA?.id}</span>
                         <span className="text-blue-400">{currentMatch.probA}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                         <div style={{ width: `${currentMatch.probA}%` }} className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000"></div>
                      </div>
                   </div>

                   <div className="space-y-1">
                      <div className="flex justify-between text-slate-400">
                         <span>Vitória {teamB?.id}</span>
                         <span className="text-red-400">{currentMatch.probB}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                         <div style={{ width: `${currentMatch.probB}%` }} className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-1000"></div>
                      </div>
                   </div>
                   
                   <div className="pt-4 text-center">
                      <span className="text-[10px] text-slate-600">Calculado via Monte Carlo (n=10k)</span>
                   </div>
                </div>

                {/* Decor elements */}
                <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-blue-500"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-blue-500"></div>
             </div>
             
             {/* Glow behind card */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-500/10 blur-[60px] -z-10 rounded-full"></div>
          </div>
      </div>
      
      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default Hero;
