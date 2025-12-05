
import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Calculator, TrendingUp, FlaskConical, Sigma, Database, BarChart3, Binary } from 'lucide-react';

// Historical Data from Slide 8
const HISTORICAL_GOALS = [
  { year: '1950', goals: 4.00 },
  { year: '1954', goals: 5.39 },
  { year: '1958', goals: 3.60 },
  { year: '1962', goals: 2.78 },
  { year: '1966', goals: 2.78 },
  { year: '1970', goals: 2.97 },
  { year: '1974', goals: 2.55 },
  { year: '1978', goals: 2.68 },
  { year: '1982', goals: 2.81 },
  { year: '1986', goals: 2.54 },
  { year: '1990', goals: 2.21 },
  { year: '1994', goals: 2.71 },
  { year: '1998', goals: 2.67 },
  { year: '2002', goals: 2.52 },
  { year: '2006', goals: 2.30 },
  { year: '2010', goals: 2.27 },
  { year: '2014', goals: 2.67 },
  { year: '2018', goals: 2.64 },
  { year: '2022', goals: 2.69 }, // Updated
];

// Poisson Function
const poisson = (lambda: number, k: number) => {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
};

const factorial = (n: number): number => {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
};

const MethodologyPage: React.FC = () => {
  // Interactive State
  const [mTotal, setMTotal] = useState(2.75); // Slide 1: m = 2.75
  const [f1, setF1] = useState(0.980); // Slide 4 Example (Brazil)
  const [f2, setF2] = useState(0.779); // Slide 4 Example (France)

  // Derived Calculations (Slide 3)
  // m1 = m * f1 / (f1 + f2)
  const m1 = useMemo(() => (mTotal * f1) / (f1 + f2), [mTotal, f1, f2]);
  const m2 = useMemo(() => mTotal - m1, [mTotal, m1]);

  // Probability Calculation (Slide 4/5 Sim)
  const probabilities = useMemo(() => {
    let probHome = 0;
    let probDraw = 0;
    let probAway = 0;

    // Simulate scorelines up to 7-7
    for (let i = 0; i <= 7; i++) {
      for (let j = 0; j <= 7; j++) {
        const p = poisson(m1, i) * poisson(m2, j);
        if (i > j) probHome += p;
        else if (i === j) probDraw += p;
        else probAway += p;
      }
    }
    return { 
      home: (probHome * 100).toFixed(1), 
      draw: (probDraw * 100).toFixed(1), 
      away: (probAway * 100).toFixed(1) 
    };
  }, [m1, m2]);

  return (
    <div className="bg-slate-50 min-h-screen py-24 px-4 font-inter text-slate-900">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-20">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 border border-blue-200 rounded-full mb-6">
             <FlaskConical className="w-4 h-4 text-blue-700" />
             <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">Laboratório Científico</span>
           </div>
           <h2 className="text-5xl font-oswald font-bold text-slate-900 uppercase tracking-tight">Metodologia <span className="text-blue-600">Poisson</span></h2>
           <p className="text-slate-500 mt-6 text-lg max-w-2xl mx-auto leading-relaxed">
             Desconstruindo a matemática por trás das previsões. Do histórico de gols à distribuição de forças.
           </p>
        </div>

        {/* SECTION 1: HISTORICAL DATA (Slide 8) */}
        <section className="mb-24 bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
           <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-slate-100 rounded-xl">
                 <TrendingUp className="w-6 h-6 text-slate-700" />
              </div>
              <div>
                <h3 className="text-2xl font-oswald font-bold text-slate-800 uppercase">1. Médias de Gols na Copa</h3>
                <p className="text-sm text-slate-500">Evolução histórica da variável <strong className="text-blue-600">m</strong> (gols por partida).</p>
              </div>
           </div>

           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={HISTORICAL_GOALS}>
                  <defs>
                    <linearGradient id="colorGoals" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{fontSize: 12}} stroke="#94a3b8" />
                  <YAxis domain={[0, 6]} tick={{fontSize: 12}} stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    labelStyle={{color: '#64748b', fontWeight: 'bold'}}
                  />
                  <Area type="monotone" dataKey="goals" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorGoals)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
           <div className="mt-4 text-center">
              <span className="inline-block bg-slate-900 text-white px-4 py-1 rounded text-sm font-bold font-mono">
                 m = 2.75 (Expectativa Atual)
              </span>
           </div>
        </section>

        {/* SECTION 2: THE FORMULA (Slides 1, 3, 6) */}
        <section className="mb-24">
           <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                 <h3 className="text-3xl font-oswald font-bold text-slate-800 mb-6 uppercase">2. O Algoritmo das Forças</h3>
                 <p className="text-slate-600 text-lg leading-relaxed mb-6">
                    A expectativa de gols de uma partida (<span className="font-serif italic font-bold">m</span>) é a soma das expectativas individuais das duas equipes (<span className="font-serif italic font-bold">m₁ + m₂</span>).
                 </p>
                 <p className="text-slate-600 text-lg leading-relaxed mb-6">
                    Para distribuir esses gols, utilizamos a "Força" (<span className="font-serif italic font-bold">f</span>) de cada seleção. O modelo assume que os gols seguem uma distribuição de Poisson independente.
                 </p>
                 
                 <div className="space-y-4 font-mono text-sm bg-slate-100 p-6 rounded-xl border border-slate-200 text-slate-700">
                    <div className="flex items-center gap-4">
                       <span className="bg-white px-2 py-1 rounded shadow-sm">m₁</span>
                       <span>=</span>
                       <span>Média de gols da Seleção 1</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="bg-white px-2 py-1 rounded shadow-sm">f₁</span>
                       <span>=</span>
                       <span>Força da Seleção 1</span>
                    </div>
                    <div className="w-full h-px bg-slate-300 my-2"></div>
                    <div className="text-xs text-slate-500 uppercase tracking-widest">Premissa de Independência</div>
                    <div>S₁ ~ Poisson(m₁)</div>
                    <div>S₂ ~ Poisson(m₂)</div>
                 </div>
              </div>

              {/* Formula Card */}
              <div className="bg-[#0f172a] text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                  <div className="absolute -right-10 -top-10 text-slate-800 opacity-20 transform rotate-12 group-hover:rotate-0 transition-transform duration-700">
                     <Sigma className="w-64 h-64" />
                  </div>
                  
                  <h4 className="font-oswald text-slate-400 uppercase tracking-widest text-sm mb-8 border-b border-slate-700 pb-4">Cálculo das Médias Poisson</h4>
                  
                  <div className="space-y-8 relative z-10">
                     <div className="text-center">
                        <div className="text-4xl md:text-5xl font-serif font-bold mb-2 tracking-wide">
                           m = m₁ + m₂
                        </div>
                        <p className="text-slate-400 text-xs uppercase">Lei da Expectativa Total</p>
                     </div>

                     <div className="bg-blue-900/30 p-6 rounded-xl border border-blue-500/30 backdrop-blur-sm">
                        <div className="flex items-center justify-center gap-4 text-2xl md:text-3xl font-serif">
                           <span>m₁ =</span>
                           <div className="flex flex-col items-center text-center">
                              <span>m • f₁</span>
                              <div className="h-0.5 w-full bg-white my-1"></div>
                              <span>(f₁ + f₂)</span>
                           </div>
                        </div>
                     </div>
                     
                     <div className="text-center opacity-70">
                        <div className="text-2xl font-serif">m₂ = m - m₁</div>
                     </div>
                  </div>
              </div>
           </div>
        </section>

        {/* SECTION 3: ORIGIN OF FORCES (NEW SECTION) */}
        <section className="mb-24 relative overflow-hidden">
           {/* Background Mesh */}
           <div className="absolute inset-0 bg-slate-100 rounded-3xl -z-10 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-50"></div>
           
           <div className="p-8 md:p-12 rounded-3xl border border-slate-200">
              <div className="text-center mb-12">
                 <div className="inline-flex items-center justify-center p-3 bg-white rounded-xl shadow-sm mb-6">
                    <Database className="w-8 h-8 text-blue-600" />
                 </div>
                 <h3 className="text-3xl font-oswald font-bold text-slate-800 uppercase mb-4">3. Como Calcular a "Força"?</h3>
                 <p className="text-slate-600 max-w-2xl mx-auto">
                    O parâmetro <span className="font-serif italic font-bold">f</span> (força) não é um número mágico. Ele é derivado de dados robustos. Existem duas abordagens principais para encontrá-lo:
                 </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                 {/* Method A: Rankings */}
                 <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-300 transition-colors">
                    <div className="flex items-start gap-4 mb-4">
                       <div className="p-2 bg-yellow-100 text-yellow-700 rounded-lg">
                          <BarChart3 className="w-6 h-6" />
                       </div>
                       <div>
                          <h4 className="font-oswald font-bold text-lg uppercase text-slate-800">Método 1: Normalização de Ranking</h4>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Abordagem Simplificada</span>
                       </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                       Podemos utilizar os pontos do Ranking da FIFA para estimar a força relativa. Se o Brasil tem 1800 pontos e a média das seleções na Copa é 1500, a força do Brasil seria:
                    </p>
                    <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm text-center border border-slate-200 text-slate-700">
                       f = Pontos_Seleção / Média_Copa
                       <div className="text-xs text-slate-400 mt-2">Ex: f = 1800 / 1500 = 1.20</div>
                    </div>
                 </div>

                 {/* Method B: Regression */}
                 <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-300 transition-colors">
                    <div className="flex items-start gap-4 mb-4">
                       <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                          <Binary className="w-6 h-6" />
                       </div>
                       <div>
                          <h4 className="font-oswald font-bold text-lg uppercase text-slate-800">Método 2: Regressão Estatística</h4>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Abordagem Científica</span>
                       </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                       A forma mais precisa envolve modelos de <strong>Regressão de Poisson Bivariada</strong>. Analisamos milhares de jogos passados para isolar variáveis:
                    </p>
                    <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside bg-slate-50 p-4 rounded-lg border border-slate-200">
                       <li>Capacidade de Ataque (Gols Feitos)</li>
                       <li>Capacidade de Defesa (Gols Sofridos)</li>
                       <li>Fator Casa / Campo Neutro</li>
                    </ul>
                 </div>
              </div>
           </div>
        </section>

        {/* SECTION 4: INTERACTIVE LAB (Slides 2, 4, 5) */}
        <section className="relative">
           {/* Visual anchor for the lab */}
           <div className="absolute -inset-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-[3rem] -z-10 transform -rotate-1"></div>

           <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-[#1e293b] text-white p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6">
                 <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                       <Calculator className="w-3 h-3" />
                       Interativo
                    </div>
                    <h3 className="text-3xl font-oswald font-bold uppercase">Laboratório de Forças</h3>
                    <p className="text-slate-400 mt-2 max-w-lg">
                       Ajuste as variáveis <span className="text-white font-serif italic">m</span>, <span className="text-white font-serif italic">f₁</span> e <span className="text-white font-serif italic">f₂</span> para simular as probabilidades de um confronto, como nos exemplos dos slides.
                    </p>
                 </div>
                 
                 {/* Preset Buttons */}
                 <div className="flex gap-3">
                    <button 
                       onClick={() => { setF1(0.980); setF2(0.779); setMTotal(2.75); }}
                       className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold uppercase transition border border-slate-600"
                    >
                       Ex: Brasil x França
                    </button>
                    <button 
                       onClick={() => { setF1(0.980); setF2(0.161); setMTotal(2.75); }}
                       className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold uppercase transition border border-slate-600"
                    >
                       Ex: Brasil x Gana
                    </button>
                 </div>
              </div>

              <div className="p-8 md:p-12 grid lg:grid-cols-2 gap-16">
                 
                 {/* CONTROLS */}
                 <div className="space-y-10">
                    {/* M Total Slider */}
                    <div>
                       <div className="flex justify-between mb-2">
                          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">m (Expectativa da Copa)</label>
                          <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 rounded">{mTotal.toFixed(2)}</span>
                       </div>
                       <input 
                         type="range" min="1.5" max="4.0" step="0.05"
                         value={mTotal} onChange={(e) => setMTotal(parseFloat(e.target.value))}
                         className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                       />
                       <p className="text-xs text-slate-400 mt-2">Média histórica de gols (Slide 8)</p>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-8">
                       {/* F1 Slider */}
                       <div>
                          <div className="flex justify-between mb-2">
                             <label className="text-sm font-bold text-red-600 uppercase tracking-wider">f₁ (Força Seleção 1)</label>
                             <span className="font-mono font-bold text-red-600">{f1.toFixed(3)}</span>
                          </div>
                          <input 
                            type="range" min="0.1" max="2.0" step="0.001"
                            value={f1} onChange={(e) => setF1(parseFloat(e.target.value))}
                            className="w-full h-2 bg-red-100 rounded-lg appearance-none cursor-pointer accent-red-600"
                          />
                       </div>

                       {/* F2 Slider */}
                       <div>
                          <div className="flex justify-between mb-2">
                             <label className="text-sm font-bold text-slate-800 uppercase tracking-wider">f₂ (Força Seleção 2)</label>
                             <span className="font-mono font-bold text-slate-800">{f2.toFixed(3)}</span>
                          </div>
                          <input 
                            type="range" min="0.1" max="2.0" step="0.001"
                            value={f2} onChange={(e) => setF2(parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
                          />
                       </div>
                    </div>
                 </div>

                 {/* VISUALIZATION */}
                 <div className="flex flex-col justify-center space-y-8">
                    
                    {/* Slide 2: Visual Representation of Means */}
                    <div>
                       <h4 className="font-oswald font-bold text-slate-400 uppercase tracking-widest text-xs mb-4">Visualização das Médias (Slide 2)</h4>
                       <div className="relative h-24 w-full rounded-lg overflow-hidden flex shadow-inner">
                          {/* m1 Bar */}
                          <div 
                             style={{ width: `${(m1 / mTotal) * 100}%` }} 
                             className="bg-red-600 h-full flex flex-col items-center justify-center text-white transition-all duration-300 relative group"
                          >
                             <span className="font-serif italic font-bold text-2xl">m₁</span>
                             <span className="font-mono text-sm opacity-80">{m1.toFixed(2)}</span>
                             <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                          </div>
                          
                          {/* m2 Bar */}
                          <div 
                             style={{ width: `${(m2 / mTotal) * 100}%` }} 
                             className="bg-[#2c1810] h-full flex flex-col items-center justify-center text-white transition-all duration-300 relative group"
                          >
                             <span className="font-serif italic font-bold text-2xl">m₂</span>
                             <span className="font-mono text-sm opacity-80">{m2.toFixed(2)}</span>
                             <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                          </div>
                       </div>
                       
                       {/* Total Arrow */}
                       <div className="flex items-center justify-center mt-3 text-slate-500 font-mono text-sm font-bold">
                          <div className="flex-1 h-px bg-slate-300"></div>
                          <span className="px-3">m = {mTotal.toFixed(2)}</span>
                          <div className="flex-1 h-px bg-slate-300"></div>
                       </div>
                    </div>

                    {/* Calculated Probabilities (Slide 4/5 Results) */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                       <h4 className="font-oswald font-bold text-slate-400 uppercase tracking-widest text-xs mb-4">Probabilidades Resultantes</h4>
                       <div className="flex justify-between items-end text-center">
                          <div className="w-1/3">
                             <div className="text-3xl font-bold text-red-600 mb-1">{probabilities.home}%</div>
                             <div className="text-[10px] uppercase font-bold text-slate-400">Vitória S1</div>
                          </div>
                          <div className="w-1/3 border-x border-slate-100">
                             <div className="text-xl font-bold text-slate-500 mb-1">{probabilities.draw}%</div>
                             <div className="text-[10px] uppercase font-bold text-slate-400">Empate</div>
                          </div>
                          <div className="w-1/3">
                             <div className="text-3xl font-bold text-slate-800 mb-1">{probabilities.away}%</div>
                             <div className="text-[10px] uppercase font-bold text-slate-400">Vitória S2</div>
                          </div>
                       </div>
                    </div>

                 </div>
              </div>
           </div>
        </section>

      </div>
    </div>
  );
};

export default MethodologyPage;
