
import React, { useState, useMemo } from 'react';
import { Trophy, Search, ArrowUpDown, ArrowUp, ArrowDown, Clock, CalendarDays, MapPin, TrendingUp, Network } from 'lucide-react';
import simulacaoGeral from '../assets/simulacao_geral.json';
import simulacaoGeralBayes from '../assets/simulacao_geral_bayes.json';
import previsoesJogos from '../assets/previsoes_jogos.json';
import previsoesJogosBayes from '../assets/previsoes_jogos_bayes.json';
import flags from '../assets/flags.json';
import PageHeader from './PageHeader';

const GROUP_STYLE = {
  bg: '#209927',
  fg: '#ffffff',
  soft: 'rgba(32,153,39,0.10)',
  border: 'rgba(32,153,39,0.24)',
};

const WorldCupHub: React.FC = () => {
  const [methodology, setMethodology] = useState<1 | 2>(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermJogos, setSearchTermJogos] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('Todos');
  
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({
    key: 'Campeão',
    direction: 'desc'
  });

  const currentSimulacaoGeral = methodology === 1 ? simulacaoGeral : simulacaoGeralBayes;
  const currentPrevisoesJogos = methodology === 1 ? previsoesJogos : previsoesJogosBayes;
  const theme = useMemo(() => {
    if (methodology === 1) {
      return {
        accent: '#209927',
        accentSoft: 'rgba(32, 153, 39, 0.10)',
        accentBorder: 'rgba(32, 153, 39, 0.24)',
        accentText: 'text-brand-green',
        accentBg: 'bg-brand-green',
        accentBorderClass: 'border-brand-green',
        accentHoverBgSoft: 'hover:bg-brand-green/5',
        accentFocusBorder: 'focus:border-brand-green',
        accentHoverBorderSoft: 'hover:border-brand-green/40',
        accentBgSoftClass: 'bg-brand-green/5',
        accentBorderR: 'border-brand-green/5',
        barColor: 'bg-brand-green',
      };
    } else {
      return {
        accent: '#005C53', // Dark Teal from Edição Bayesiana
        accentSoft: 'rgba(0, 92, 83, 0.10)',
        accentBorder: 'rgba(0, 92, 83, 0.24)',
        accentText: 'text-teal-600',
        accentBg: 'bg-teal-600',
        accentBorderClass: 'border-teal-600',
        accentHoverBgSoft: 'hover:bg-teal-600/5',
        accentFocusBorder: 'focus:border-teal-600',
        accentHoverBorderSoft: 'hover:border-teal-600/40',
        accentBgSoftClass: 'bg-teal-600/5',
        accentBorderR: 'border-teal-600/5',
        barColor: 'bg-teal-600',
      };
    }
  }, [methodology]);
  const getFlag = (teamName: string) => {
    if (!teamName) return "https://flagcdn.com/w320/un.png";
    const normalized = teamName.trim();
    return (flags as any)[normalized] || (flags as any)[normalized.replace('República ', '')] || "https://flagcdn.com/w320/un.png";
  };

  const parsePercent = (val: any) => {
    if (typeof val === 'string') {
      const cleaned = val.replace('%', '').replace(',', '.').trim();
      return parseFloat(cleaned) || 0;
    }
    return val || 0;
  };

  const formatFairOdd = (val: any) => {
    const probability = parsePercent(val);
    if (!probability) return '-';
    return (100 / probability).toFixed(2);
  };

  const sortedData = useMemo(() => {
    let sortableData = [...(currentSimulacaoGeral as any[])];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        const aValue = parsePercent(a[sortConfig.key]);
        const bValue = parsePercent(b[sortConfig.key]);
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableData;
  }, [currentSimulacaoGeral, sortConfig]);

  const filteredSimulacao = sortedData.filter((team: any) => 
    team['Seleção']?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupOptions = useMemo(() => {
    return Array.from(new Set((currentPrevisoesJogos as any[]).map((jogo: any) => jogo['Grupo']).filter(Boolean)))
      .sort((a: any, b: any) => getGroupLetter(a).localeCompare(getGroupLetter(b)));
  }, [currentPrevisoesJogos]);

  const filteredJogos = (currentPrevisoesJogos as any[]).filter((jogo: any) => {
    const matchesSearch =
      jogo['Seleção A']?.toLowerCase().includes(searchTermJogos.toLowerCase()) ||
      jogo['Seleção B']?.toLowerCase().includes(searchTermJogos.toLowerCase()) ||
      jogo['Grupo']?.toLowerCase().includes(searchTermJogos.toLowerCase());
    const matchesGroup = selectedGroup === 'Todos' || jogo['Grupo'] === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const jogosPorGrupo = useMemo(() => {
    return filteredJogos.reduce((acc: Record<string, any[]>, jogo: any) => {
      const group = jogo['Grupo'] || 'Sem grupo';
      if (!acc[group]) acc[group] = [];
      acc[group].push(jogo);
      return acc;
    }, {});
  }, [filteredJogos]);

  function getGroupLetter(group: string) {
    return group?.replace('Grupo ', '').trim() || '-';
  }

  const getShortBrasiliaTime = (value: string) => {
    const match = value?.match(/\(([^/]+)/);
    return match ? match[1].trim() : value;
  };

  const getShortVenue = (value: string) => {
    return value?.split('–')[0]?.trim() || value;
  };

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ col }: { col: string }) => {
    if (sortConfig?.key !== col) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-20" />;
    return sortConfig.direction === 'asc' ? <ArrowUp className={`w-3 h-3 ml-1 ${theme.accentText}`} /> : <ArrowDown className={`w-3 h-3 ml-1 ${theme.accentText}`} />;
  };

  return (
    <div className="min-h-screen bg-brand-light pb-24 font-opensans">
      <PageHeader
        icon={Trophy}
        eyebrow="Copa do Mundo FIFA 2026"
        title="Previsão"
        accent="Copa do Mundo 2026"
        description="Estimativas probabilísticas para eventos da Copa do Mundo 2026, elaboradas a partir de modelos estatísticos e informações quantitativas sobre seleções, partidas e desempenho."
      />

      {/* METHODOLOGY SELECTOR */}
      <div className="max-w-7xl mx-auto px-4 mt-8 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => {
              setMethodology(1);
            }}
            className={`p-6 md:p-8 rounded-[2rem] text-left transition-all duration-500 border-2 cursor-pointer group flex items-start gap-5 relative overflow-hidden ${
              methodology === 1
                ? 'bg-brand-dark text-white border-brand-dark shadow-2xl scale-[1.02]'
                : 'bg-white text-brand-dark border-brand-dark/10 hover:border-brand-green/45 hover:shadow-xl shadow-md'
            }`}
          >
            <div className={`p-4 rounded-2xl transition-colors ${
              methodology === 1 ? 'bg-brand-green text-white' : 'bg-brand-green/10 text-brand-green'
            }`}>
              <TrendingUp className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="font-montserrat text-xs font-black uppercase tracking-widest text-brand-green">Metodologia 1</span>
              <h3 className="font-montserrat font-black text-xl md:text-2xl uppercase tracking-tight leading-none mt-1">Modelo de Força</h3>
              <p className={`text-xs md:text-sm mt-2 leading-relaxed ${
                methodology === 1 ? 'text-white/60' : 'text-brand-dark/50'
              }`}>
                Estimativas baseadas no ranking histórico FIFA ELO e simulação clássica de força.
              </p>
            </div>
          </button>
          <button
            onClick={() => {
              setMethodology(2);
            }}
            className={`p-6 md:p-8 rounded-[2rem] text-left transition-all duration-500 border-2 cursor-pointer group flex items-start gap-5 relative overflow-hidden ${
              methodology === 2
                ? 'bg-brand-dark text-white border-brand-dark shadow-2xl scale-[1.02]'
                : 'bg-white text-brand-dark border-brand-dark/10 hover:border-teal-600/45 hover:shadow-xl shadow-md'
            }`}
          >
            <div className={`p-4 rounded-2xl transition-colors ${
              methodology === 2 ? 'bg-teal-600 text-white' : 'bg-teal-600/10 text-teal-600'
            }`}>
              <Network className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="font-montserrat text-xs font-black uppercase tracking-widest text-teal-600">Metodologia 2</span>
              <h3 className="font-montserrat font-black text-xl md:text-2xl uppercase tracking-tight leading-none mt-1">Edição Bayesiana</h3>
              <p className={`text-xs md:text-sm mt-2 leading-relaxed ${
                methodology === 2 ? 'text-white/60' : 'text-brand-dark/50'
              }`}>
                Estimativas probabilísticas alternativas usando modelagem bayesiana avançada.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* TABLES SECTION */}
      <div className="max-w-7xl mx-auto px-4 mt-16 space-y-32">
        
        {/* PROBABILITIES TABLE - BRAND TYPOGRAPHY */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
            <div className="max-w-4xl">
              <h2 className="text-4xl md:text-6xl font-montserrat font-black text-brand-dark uppercase tracking-tighter leading-none mb-4">
                Simulação <span className={`${theme.accentText} italic whitespace-nowrap`}>Pré-Torneio</span>
              </h2>
              <p className="text-brand-dark/50 font-light text-lg font-opensans">Simulação realizada em 30/04/2026. O torneio foi simulado 1 milhão de vezes e as probabilidades representam a frequência dos acontecimentos.</p>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-dark/30" />
              <input type="text" placeholder="Filtrar seleção..." className={`w-full pl-14 pr-8 py-5 bg-white border-2 border-brand-dark/5 rounded-3xl text-sm outline-none ${theme.accentFocusBorder} transition-all shadow-sm font-opensans`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl border border-brand-dark/5 overflow-hidden overflow-x-auto overscroll-x-contain">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-brand-dark text-white font-montserrat text-[10px] uppercase tracking-[0.25em]">
                  <th className="p-4 cursor-pointer hover:bg-white/5 transition-colors sticky left-0 bg-brand-dark z-20" onClick={() => requestSort('Seleção')}>
                    <div className="flex items-center">Seleção <SortIcon col="Seleção" /></div>
                  </th>
                  {['1º Grupo', '2º Grupo', '3º Grupo', '4º Grupo', 'Top 32', 'Oitavas', 'Quartas', 'Semi', 'Final', 'Campeão'].map((phase) => (
                    <th key={phase} className="p-4 text-center cursor-pointer hover:bg-white/5 transition-colors" onClick={() => requestSort(phase)}>
                      <div className="flex items-center justify-center">{phase} <SortIcon col={phase} /></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-dark/5">
                {filteredSimulacao.map((team: any, idx) => (
                  <tr key={idx} className={`${theme.accentHoverBgSoft} transition-colors group`}>
                    <td className="p-2.5 px-6 sticky left-0 bg-white group-hover:bg-[#F8FFF9] z-10 border-r border-brand-dark/5">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-brand-dark/30 font-black w-6 tabular-nums font-opensans">{idx + 1}</span>
                        <div className="w-8 h-5 rounded-sm shadow-sm border border-brand-dark/5 overflow-hidden flex-shrink-0">
                          <img src={getFlag(team['Seleção'])} className="w-full h-full object-cover" alt="" loading="lazy" decoding="async" />
                        </div>
                        <span className="font-montserrat font-bold text-brand-dark uppercase tracking-tight text-sm">{team['Seleção']}</span>
                      </div>
                    </td>
                    {['1º Grupo', '2º Grupo', '3º Grupo', '4º Grupo', 'Top 32', 'Oitavas', 'Quartas', 'Semi', 'Final', 'Campeão'].map((phase) => (
                      <td key={phase} className={`p-2.5 text-center text-sm font-bold tabular-nums font-opensans ${phase === 'Campeão' ? `${theme.accentText} ${theme.accentBgSoftClass} font-black text-base` : 'text-brand-dark/70'}`}>
                        {team[phase]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* GAMES LIST - COMPACT GROUPED DISPLAY */}
        <section>
          <div className="mb-10 space-y-6">
            <h2 className="text-4xl md:text-6xl font-montserrat font-black text-brand-dark uppercase tracking-tighter leading-none mb-4">
              Agenda de <span className={`${theme.accentText} italic whitespace-nowrap`}>Confrontos</span>
            </h2>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-6 border-b border-brand-dark/5">
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <button
                  onClick={() => setSelectedGroup('Todos')}
                  className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all ${selectedGroup === 'Todos' ? 'bg-brand-dark text-white border-brand-dark shadow-lg scale-105' : `bg-white text-brand-dark/50 border-brand-dark/10 ${theme.accentHoverBorderSoft} shadow-sm`}`}
                >
                  Todos
                </button>
                {groupOptions.map((group: any) => (
                  <button
                    key={group}
                    onClick={() => setSelectedGroup(group)}
                    className="px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all bg-white hover:-translate-y-0.5 shadow-sm"
                    style={{
                      borderColor: selectedGroup === group ? theme.accent : theme.accentBorder,
                      color: selectedGroup === group ? '#ffffff' : theme.accent,
                      backgroundColor: selectedGroup === group ? theme.accent : '#ffffff',
                      transform: selectedGroup === group ? 'scale(1.05)' : 'none',
                      boxShadow: selectedGroup === group ? `0 10px 15px -3px ${theme.accentSoft}` : 'none'
                    }}
                  >
                    {getGroupLetter(group)}
                  </button>
                ))}
              </div>
              
              <div className="relative w-full md:w-80">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-dark/30" />
                <input 
                  type="text" 
                  placeholder="Buscar seleção no calendário..." 
                  className={`w-full pl-14 pr-6 py-4 bg-white border-2 border-brand-dark/5 rounded-2xl text-sm outline-none ${theme.accentFocusBorder} transition-all shadow-md font-opensans`} 
                  value={searchTermJogos} 
                  onChange={(e) => setSearchTermJogos(e.target.value)} 
                />
              </div>
            </div>
          </div>

          <div className="space-y-10">
             {Object.entries(jogosPorGrupo).map(([group, jogos]) => {
               return (
                 <div key={group} className="bg-white border-2 shadow-md overflow-hidden" style={{ borderColor: theme.accent, borderRadius: 16 }}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-5 border-b-2" style={{ backgroundColor: theme.accent, borderColor: theme.accent }}>
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 flex items-center justify-center font-montserrat font-black text-3xl bg-white shadow-inner" style={{ color: theme.accent, borderRadius: 12 }}>
                          {getGroupLetter(group)}
                        </div>
                        <div>
                          <h3 className="text-3xl font-montserrat font-black text-white leading-none uppercase tracking-tight">{group}</h3>
                        </div>
                      </div>
                      <div className="hidden md:flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/80">
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-white" /> Vitória A</span>
                        <span className="flex items-center gap-1.5 ml-2"><span className="w-2.5 h-2.5 rounded-full bg-white/40" /> Empate</span>
                        <span className="flex items-center gap-1.5 ml-2"><span className="w-2.5 h-2.5 rounded-full bg-brand-blue border border-white/20" /> Vitória B</span>
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-5 p-5 md:p-6 bg-brand-light/20">
                      {(jogos as any[]).map((jogo: any, idx: number) => (
                        <div key={`${group}-${idx}`} className="bg-white border border-brand-dark/5 p-5 rounded-3xl shadow-md hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] transition-all duration-500 group/card relative overflow-hidden">
                          {/* 3-COLUMN INFO HEADER */}
                          <div className="grid grid-cols-3 gap-2 mb-6 pb-4 border-b border-brand-dark/5 text-[9px] font-black uppercase tracking-tight text-brand-dark/35">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <CalendarDays className={`w-3 h-3 flex-shrink-0 ${theme.accentText}`} />
                              <span className="truncate">{jogo['Data']?.split(',')[1] || jogo['Data']}</span>
                            </div>
                            <div className="flex items-center justify-center gap-1.5">
                              <Clock className={`w-3 h-3 flex-shrink-0 ${theme.accentText}`} />
                              <span>{getShortBrasiliaTime(jogo['Horário Brasília'])}</span>
                            </div>
                            <div className="flex items-center justify-end gap-1.5 min-w-0">
                              <MapPin className={`w-3 h-3 flex-shrink-0 ${theme.accentText}`} />
                              <span className="truncate text-right">{getShortVenue(jogo['Horário/Local'])}</span>
                            </div>
                          </div>

                          {/* TEAMS AND PROBABILITIES GRID */}
                          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-2 mb-4">
                            <div className="flex flex-col items-center text-center gap-2">
                              <div className="w-16 h-10 rounded-xl border border-brand-dark/10 overflow-hidden shadow-sm group-hover/card:scale-110 transition-transform duration-500">
                                <img src={getFlag(jogo['Seleção A'])} className="w-full h-full object-cover" alt="" loading="lazy" decoding="async" />
                              </div>
                              <div className="space-y-1">
                                <span className="font-montserrat font-black text-brand-dark uppercase text-[11px] leading-tight block h-7 flex items-center justify-center">{jogo['Seleção A']}</span>
                                <span className={`font-exo text-lg font-bold italic ${theme.accentText} block`}>{jogo['Vitória A']}</span>
                                <span className="block text-[9px] font-montserrat font-bold tabular-nums text-brand-dark/30">{formatFairOdd(jogo['Vitória A'])}</span>
                              </div>
                            </div>

                            <div className="flex flex-col items-center pt-2">
                              <div className="px-2.5 py-1 bg-brand-light rounded-full text-[9px] font-black text-brand-dark/25 mb-4">VS</div>
                              <div className="flex flex-col items-center opacity-40">
                                <span className="text-[8px] font-montserrat font-black uppercase tracking-widest mb-0.5">Empate</span>
                                <span className="font-exo text-sm font-bold italic text-brand-dark">{jogo['Empate']}</span>
                                <span className="mt-0.5 text-[8px] font-montserrat font-bold tabular-nums text-brand-dark/70">{formatFairOdd(jogo['Empate'])}</span>
                              </div>
                            </div>

                            <div className="flex flex-col items-center text-center gap-2">
                              <div className="w-16 h-10 rounded-xl border border-brand-dark/10 overflow-hidden shadow-sm group-hover/card:scale-110 transition-transform duration-500">
                                <img src={getFlag(jogo['Seleção B'])} className="w-full h-full object-cover" alt="" loading="lazy" decoding="async" />
                              </div>
                              <div className="space-y-1">
                                <span className="font-montserrat font-black text-brand-dark uppercase text-[11px] leading-tight block h-7 flex items-center justify-center">{jogo['Seleção B']}</span>
                                <span className="font-exo text-lg font-bold italic text-brand-blue block">{jogo['Vitória B']}</span>
                                <span className="block text-[9px] font-montserrat font-bold tabular-nums text-brand-dark/30">{formatFairOdd(jogo['Vitória B'])}</span>
                              </div>
                            </div>
                          </div>

                          {/* MINIMALIST BAR */}
                          <div className="flex h-1 overflow-hidden bg-brand-light rounded-full">
                            <div style={{ width: jogo['Vitória A'] }} className={theme.barColor} />
                            <div style={{ width: jogo['Empate'] }} className="bg-brand-dark/10" />
                            <div style={{ width: jogo['Vitória B'] }} className="bg-brand-blue" />
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>
               );
             })}
             {filteredJogos.length === 0 && (
               <div className="bg-white border-2 border-dashed border-brand-dark/10 p-16 text-center rounded-[2rem]">
                 <p className="font-montserrat font-black uppercase text-brand-dark text-xl">Nenhum confronto encontrado</p>
                 <p className="text-sm text-brand-dark/45 mt-2">Ajuste o filtro de grupo ou a busca por seleção.</p>
               </div>
             )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default WorldCupHub;
