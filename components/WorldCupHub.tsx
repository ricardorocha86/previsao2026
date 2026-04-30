
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Trophy, Search, ArrowUpDown, ArrowUp, ArrowDown, Clock, CalendarDays, MapPin } from 'lucide-react';
import simulacaoGeral from '../assets/simulacao_geral.json';
import previsoesJogos from '../assets/previsoes_jogos.json';
import flags from '../assets/flags.json';
import PageHeader from './PageHeader';

const GROUP_STYLE = {
  bg: '#209927',
  fg: '#ffffff',
  soft: 'rgba(32,153,39,0.10)',
  border: 'rgba(32,153,39,0.24)',
};

const WorldCupHub: React.FC = () => {
  const [activeCard, setActiveCard] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermJogos, setSearchTermJogos] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('Todos');
  
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({
    key: 'Campeão',
    direction: 'desc'
  });

  const cards = Array.from({ length: 10 }, (_, i) => `/assets/cards/card_${i + 1}.png`);

  const nextCard = () => {
    setSlideDirection(1);
    setActiveCard((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setSlideDirection(-1);
    setActiveCard((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const goToCard = (index: number) => {
    if (index === activeCard) return;
    const forwardDistance = (index - activeCard + cards.length) % cards.length;
    setSlideDirection(forwardDistance <= cards.length / 2 ? 1 : -1);
    setActiveCard(index);
  };

  const getCardOffset = (index: number) => {
    const rawOffset = index - activeCard;
    if (rawOffset > cards.length / 2) return rawOffset - cards.length;
    if (rawOffset < -cards.length / 2) return rawOffset + cards.length;
    return rawOffset;
  };

  const previousCard = cards[(activeCard - 1 + cards.length) % cards.length];
  const nextPreviewCard = cards[(activeCard + 1) % cards.length];

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

  const sortedData = useMemo(() => {
    let sortableData = [...(simulacaoGeral as any[])];
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
  }, [simulacaoGeral, sortConfig]);

  const filteredSimulacao = sortedData.filter((team: any) => 
    team['Seleção']?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupOptions = useMemo(() => {
    return Array.from(new Set((previsoesJogos as any[]).map((jogo: any) => jogo['Grupo']).filter(Boolean)))
      .sort((a: any, b: any) => getGroupLetter(a).localeCompare(getGroupLetter(b)));
  }, []);

  const filteredJogos = (previsoesJogos as any[]).filter((jogo: any) => {
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
    return sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 ml-1 text-brand-green" /> : <ArrowDown className="w-3 h-3 ml-1 text-brand-green" />;
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

      {/* CAROUSEL SECTION */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
        <div className="relative overflow-hidden rounded-[1.75rem] md:rounded-[3.5rem] bg-brand-dark shadow-2xl border border-white/20 p-3 md:p-6">
          <div className="absolute inset-0 overflow-hidden">
            <img
              key={`prev-bg-${previousCard}`}
              src={previousCard}
              alt=""
              className="absolute inset-y-0 left-0 h-full w-1/2 object-cover opacity-45 blur-3xl scale-125 transition-opacity duration-700"
            />
            <img
              key={`next-bg-${nextPreviewCard}`}
              src={nextPreviewCard}
              alt=""
              className="absolute inset-y-0 right-0 h-full w-1/2 object-cover opacity-55 blur-3xl scale-125 transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,18,16,0.80),rgba(8,18,16,0.22)_28%,rgba(8,18,16,0.18)_72%,rgba(8,18,16,0.82))]" />
            <div className="absolute inset-0 bg-brand-dark/20 backdrop-blur-sm" />
          </div>

          <div className="relative h-[82vh] min-h-[560px] max-h-[880px] overflow-hidden rounded-[1.25rem] md:rounded-[2.75rem] border border-white/10 bg-black/10">
             <button 
                onClick={prevCard} 
                aria-label="Card anterior"
                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-40 p-3 md:p-5 rounded-full bg-white/12 hover:bg-white/25 text-white backdrop-blur-md transition-all border border-white/20 group shadow-xl"
             >
                <ChevronLeft className="w-7 h-7 md:w-8 md:h-8 group-hover:-translate-x-1 transition-transform" />
             </button>
             
             <button 
                onClick={nextCard} 
                aria-label="Proximo card"
                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-40 p-3 md:p-5 rounded-full bg-white/12 hover:bg-white/25 text-white backdrop-blur-md transition-all border border-white/20 group shadow-xl"
             >
                <ChevronRight className="w-7 h-7 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform" />
             </button>

             <div className="absolute inset-0 flex items-center justify-center perspective-[1600px]">
               {cards.map((card, i) => {
                 const offset = getCardOffset(i);
                 const isActive = offset === 0;
                 const isAdjacent = Math.abs(offset) === 1;
                 const hiddenDirection = offset === 0 ? slideDirection : Math.sign(offset || slideDirection);
                 const transformClass = isActive
                   ? 'translate-x-0 translate-y-0 rotate-0 scale-100 opacity-100 z-30 blur-0'
                   : isAdjacent
                     ? `${offset < 0 ? '-translate-x-[68%] md:-translate-x-[48%] -rotate-[5deg]' : 'translate-x-[68%] md:translate-x-[48%] rotate-[5deg]'} translate-y-3 scale-[0.82] opacity-30 md:opacity-35 z-20 blur-[3px] saturate-75 brightness-75`
                     : `${hiddenDirection < 0 ? '-translate-x-[105%]' : 'translate-x-[105%]'} translate-y-8 scale-75 opacity-0 z-10 blur-md pointer-events-none`;

                 return (
                   <button
                     key={card}
                     type="button"
                     onClick={() => isAdjacent && goToCard(i)}
                     aria-label={`Abrir card ${i + 1}`}
                     className={`absolute top-6 bottom-20 md:top-8 md:bottom-20 w-[84%] md:w-[72%] max-w-[980px] transition-all duration-700 ease-[cubic-bezier(0.2,0.85,0.25,1)] ${transformClass} ${isAdjacent ? 'cursor-pointer' : 'pointer-events-none'}`}
                   >
                     <img
                       src={card}
                       alt={`Insight ${i + 1}`}
                       className={`h-full w-full object-contain transition-all duration-700 ${isActive ? 'drop-shadow-[0_40px_95px_rgba(0,0,0,0.62)]' : 'drop-shadow-[0_14px_36px_rgba(0,0,0,0.22)]'}`}
                     />
                   </button>
                 );
               })}
             </div>
             
             <div className="absolute bottom-5 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-40 rounded-full bg-black/20 px-3 py-2 backdrop-blur-md border border-white/10">
                {cards.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToCard(i)}
                    aria-label={`Ir para card ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-500 ${i === activeCard ? 'w-12 md:w-16 bg-brand-green' : 'w-3 md:w-4 bg-white/35 hover:bg-white/60'}`}
                  />
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* TABLES SECTION */}
      <div className="max-w-7xl mx-auto px-4 mt-32 space-y-32">
        
        {/* PROBABILITIES TABLE - BRAND TYPOGRAPHY */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
            <div className="max-w-xl">
              <h2 className="text-5xl font-montserrat font-black text-brand-dark uppercase tracking-tighter leading-none mb-4">Simulação <span className="text-brand-green">Global</span></h2>
              <p className="text-brand-dark/50 font-light text-lg font-opensans">Ranking probabilístico detalhado do torneio.</p>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-dark/30" />
              <input type="text" placeholder="Filtrar seleção..." className="w-full pl-14 pr-8 py-5 bg-white border-2 border-brand-dark/5 rounded-3xl text-sm outline-none focus:border-brand-green transition-all shadow-sm font-opensans" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-2xl border border-brand-dark/5 overflow-hidden overflow-x-auto">
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
                  <tr key={idx} className="hover:bg-brand-green/5 transition-colors group">
                    <td className="p-2.5 px-6 sticky left-0 bg-white group-hover:bg-[#F8FFF9] z-10 border-r border-brand-dark/5">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-brand-dark/30 font-black w-6 tabular-nums font-opensans">{idx + 1}</span>
                        <div className="w-8 h-5 rounded-sm shadow-sm border border-brand-dark/5 overflow-hidden flex-shrink-0">
                          <img src={getFlag(team['Seleção'])} className="w-full h-full object-cover" alt="" />
                        </div>
                        <span className="font-montserrat font-bold text-brand-dark uppercase tracking-tight text-sm">{team['Seleção']}</span>
                      </div>
                    </td>
                    {['1º Grupo', '2º Grupo', '3º Grupo', '4º Grupo', 'Top 32', 'Oitavas', 'Quartas', 'Semi', 'Final', 'Campeão'].map((phase) => (
                      <td key={phase} className={`p-2.5 text-center text-sm font-bold tabular-nums font-opensans ${phase === 'Campeão' ? 'text-brand-green bg-brand-green/5 font-black text-base' : 'text-brand-dark/70'}`}>
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-8">
            <div className="max-w-xl">
              <h2 className="text-5xl font-montserrat font-black text-brand-dark uppercase tracking-tighter leading-none mb-4">Agenda de <span className="text-brand-green italic">Confrontos</span></h2>
              <p className="text-brand-dark/50 font-light text-lg font-opensans">Partidas agrupadas por chave, com probabilidades em leitura compacta.</p>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-dark/30" />
              <input type="text" placeholder="Buscar grupo ou seleção..." className="w-full pl-14 pr-8 py-5 bg-white border-2 border-brand-dark/5 rounded-3xl text-sm outline-none focus:border-brand-green transition-all shadow-sm font-opensans" value={searchTermJogos} onChange={(e) => setSearchTermJogos(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setSelectedGroup('Todos')}
              className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest border transition-all ${selectedGroup === 'Todos' ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-brand-dark/50 border-brand-dark/10 hover:border-brand-green/40'}`}
            >
              Todos
            </button>
            {groupOptions.map((group: any) => {
              return (
                <button
                  key={group}
                  onClick={() => setSelectedGroup(group)}
                  className="px-3 py-2 rounded-full text-[11px] font-black uppercase tracking-widest border transition-all bg-white hover:-translate-y-0.5"
                  style={{
                    borderColor: selectedGroup === group ? GROUP_STYLE.bg : GROUP_STYLE.border,
                    color: selectedGroup === group ? GROUP_STYLE.fg : GROUP_STYLE.bg,
                    backgroundColor: selectedGroup === group ? GROUP_STYLE.bg : '#ffffff',
                  }}
                >
                  {getGroupLetter(group)}
                </button>
              );
            })}
          </div>

          <div className="space-y-8">
             {Object.entries(jogosPorGrupo).map(([group, jogos]) => {
               return (
                 <div key={group} className="bg-white border shadow-sm overflow-hidden" style={{ borderColor: GROUP_STYLE.border, borderRadius: 8 }}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-5 md:px-6 py-4 border-b border-brand-dark/5 bg-gradient-to-r from-brand-green/15 via-white to-brand-grad1/10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 flex items-center justify-center font-montserrat font-black text-2xl text-white bg-gradient-to-br from-brand-grad1 to-brand-grad2 shadow-sm" style={{ borderRadius: 8 }}>
                          {getGroupLetter(group)}
                        </div>
                        <div>
                          <h3 className="text-2xl font-montserrat font-black text-brand-dark leading-none">{group}</h3>
                          <p className="text-[10px] uppercase tracking-widest font-black text-brand-dark/35 mt-1">{jogos.length} confrontos da chave</p>
                        </div>
                      </div>
                      <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-dark/40">
                        <span className="w-3 h-3 rounded-sm bg-gradient-to-r from-brand-grad1 to-brand-grad2" />
                        Vitória A
                        <span className="w-3 h-3 rounded-sm bg-brand-dark/25 ml-3" />
                        Empate
                        <span className="w-3 h-3 rounded-sm bg-brand-blue ml-3" />
                        Vitória B
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 p-4 md:p-5 bg-brand-light/35">
                      {(jogos as any[]).map((jogo: any, idx: number) => (
                        <div key={`${group}-${idx}`} className="bg-white border border-brand-dark/10 p-4 shadow-sm hover:shadow-md transition-shadow" style={{ borderRadius: 8 }}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 text-[11px] font-bold text-brand-dark/45">
                            <span className="flex items-center gap-1.5 min-w-0">
                              <CalendarDays className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate">{jogo['Data']}</span>
                            </span>
                            <span className="flex items-center gap-1.5 flex-shrink-0">
                              <Clock className="w-3.5 h-3.5" />
                              {getShortBrasiliaTime(jogo['Horário Brasília'])}
                            </span>
                          </div>

                          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-7 rounded-sm border border-brand-dark/5 overflow-hidden flex-shrink-0 shadow-sm">
                                <img src={getFlag(jogo['Seleção A'])} className="w-full h-full object-cover" alt="" />
                              </div>
                              <span className="font-montserrat font-black text-brand-dark uppercase text-sm md:text-base leading-tight line-clamp-2">{jogo['Seleção A']}</span>
                            </div>
                            <div className="px-2 py-1 bg-brand-light rounded text-[10px] font-black text-brand-dark/35">vs</div>
                            <div className="flex items-center justify-end gap-3 min-w-0">
                              <span className="font-montserrat font-black text-brand-dark uppercase text-sm md:text-base leading-tight text-right line-clamp-2">{jogo['Seleção B']}</span>
                              <div className="w-10 h-7 rounded-sm border border-brand-dark/5 overflow-hidden flex-shrink-0 shadow-sm">
                                <img src={getFlag(jogo['Seleção B'])} className="w-full h-full object-cover" alt="" />
                              </div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="flex h-3 overflow-hidden bg-brand-light rounded-full border border-brand-dark/5">
                              <div style={{ width: jogo['Vitória A'] }} className="bg-gradient-to-r from-brand-grad2 to-brand-green" />
                              <div style={{ width: jogo['Empate'] }} className="bg-brand-dark/25" />
                              <div style={{ width: jogo['Vitória B'] }} className="bg-brand-blue" />
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-2 text-xs md:text-sm font-montserrat font-black tabular-nums">
                              <span className="text-brand-green">{jogo['Vitória A']}</span>
                              <span className="text-center text-brand-dark/55">{jogo['Empate']}</span>
                              <span className="text-right text-brand-blue">{jogo['Vitória B']}</span>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-brand-dark/35 min-w-0">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{getShortVenue(jogo['Horário/Local'])}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>
               );
             })}
             {filteredJogos.length === 0 && (
               <div className="bg-white border border-brand-dark/10 p-8 text-center" style={{ borderRadius: 8 }}>
                 <p className="font-montserrat font-black uppercase text-brand-dark">Nenhum confronto encontrado</p>
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
