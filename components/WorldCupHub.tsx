
import React, { useState, useMemo } from 'react';
import { Trophy, Search, ArrowUpDown, ArrowUp, ArrowDown, Clock, CalendarDays, MapPin, TrendingUp, Network, ChevronLeft, ChevronRight } from 'lucide-react';
import simulacaoGeral from '../assets/simulacao_geral.json';
import simulacaoGeralInicioCopa from '../assets/simulacao_geral_inicio_copa.json';
import simulacaoGeralBayes from '../assets/simulacao_geral_bayes.json';
import previsoesJogos from '../assets/previsoes_jogos.json';
import previsoesJogosInicioCopa from '../assets/previsoes_jogos_inicio_copa.json';
import previsoesJogosBayes from '../assets/previsoes_jogos_bayes.json';
import resultadosJogos from '../assets/resultados_jogos.json';
import flags from '../assets/flags.json';
import PageHeader from './PageHeader';

const GROUP_STYLE = {
  bg: '#209927',
  fg: '#ffffff',
  soft: 'rgba(32,153,39,0.10)',
  border: 'rgba(32,153,39,0.24)',
};

type StageId = 'inicio-copa' | 'pre-convocacao';

// Etapas da simulação do Modelo de Força (Metodologia 1), em ordem cronológica.
const STAGES: Array<{ id: StageId; label: string; date: string; data: any[]; jogos: any[] }> = [
  { id: 'pre-convocacao', label: 'Pré-Convocação', date: '11/05/2026', data: simulacaoGeral as any[], jogos: previsoesJogos as any[] },
  { id: 'inicio-copa', label: 'Início da Copa', date: '11/06/2026', data: simulacaoGeralInicioCopa as any[], jogos: previsoesJogosInicioCopa as any[] },
];

// Etapa exibida por padrão: a mais recente já disponível.
const DEFAULT_STAGE_ID: StageId = 'inicio-copa';

// Etapas futuras em que o modelo ainda será rodado — exibidas desabilitadas até a simulação existir.
// Datas conforme o calendário oficial da Copa 2026 (fim de cada rodada/fase).
const UPCOMING_STAGES: Array<{ label: string; date: string }> = [
  { label: 'Fim da 1ª Rodada', date: '17/06/2026' },
  { label: 'Fim da 2ª Rodada', date: '23/06/2026' },
  { label: 'Fim da Fase de Grupos', date: '27/06/2026' },
  { label: 'Fim dos 16-avos', date: '03/07/2026' },
  { label: 'Fim das Oitavas', date: '07/07/2026' },
  { label: 'Fim das Quartas', date: '11/07/2026' },
  { label: 'Fim das Semifinais', date: '15/07/2026' },
];

const getFlag = (teamName: string) => {
  if (!teamName) return "https://flagcdn.com/w320/un.webp";
  const normalized = teamName.trim();
  return (flags as any)[normalized] || (flags as any)[normalized.replace('República ', '')] || "https://flagcdn.com/w320/un.webp";
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

const MESES_PT: Record<string, number> = {
  janeiro: 0, fevereiro: 1, 'março': 2, abril: 3, maio: 4, junho: 5,
  julho: 6, agosto: 7, setembro: 8, outubro: 9, novembro: 10, dezembro: 11,
};

// Timestamp do jogo (horário de Brasília) para ordenação cronológica.
const parseDataHora = (jogo: any): number => {
  const m = String(jogo['Data'] || '').match(/(\d{1,2}) de (\S+) de (\d{4})/);
  if (!m) return 0;
  const mes = MESES_PT[m[2].toLowerCase()] ?? 0;
  const h = String(jogo['Horário Brasília'] || '').match(/(\d{1,2})h(\d{2})/);
  return new Date(Number(m[3]), mes, Number(m[1]), h ? Number(h[1]) : 0, h ? Number(h[2]) : 0).getTime();
};

// Resultados oficiais ficam em arquivo separado: as previsões publicadas nunca são editadas após as partidas.
// Na fase de grupos, cada par de seleções joga uma única vez; por isso não dependemos da data.
const jogoPairKey = (teamA: string, teamB: string) => `${teamA}|${teamB}`;

const reverseResultado = (resultado: any) => ({
  ...resultado,
  'Seleção A': resultado['Seleção B'],
  'Seleção B': resultado['Seleção A'],
  'Placar A': resultado['Placar B'],
  'Placar B': resultado['Placar A'],
});

const RESULTADOS_MAP: Record<string, any> = (resultadosJogos as any[]).reduce((acc, r) => {
  if (r['Status'] === 'encerrado') {
    acc[jogoPairKey(r['Seleção A'], r['Seleção B'])] = r;
    acc[jogoPairKey(r['Seleção B'], r['Seleção A'])] = reverseResultado(r);
  }
  return acc;
}, {} as Record<string, any>);

const getResultado = (jogo: any) => {
  const r = RESULTADOS_MAP[jogoPairKey(jogo['Seleção A'], jogo['Seleção B'])];
  return r && r['Status'] === 'encerrado' ? r : undefined;
};

type Desfecho = 'A' | 'E' | 'B';

const getDesfecho = (resultado: any): Desfecho =>
  resultado['Placar A'] > resultado['Placar B'] ? 'A' : resultado['Placar A'] < resultado['Placar B'] ? 'B' : 'E';

const JogoCard: React.FC<{ jogo: any; theme: any; showGroup?: boolean }> = ({ jogo, theme, showGroup }) => {
  const resultado = getResultado(jogo);
  const desfecho = resultado ? getDesfecho(resultado) : null;
  const dimClass = (d: Desfecho) => (resultado && desfecho !== d ? 'opacity-35' : '');

  return (
    <div className="bg-white border border-brand-dark/5 p-5 rounded-3xl shadow-md hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] transition-all duration-500 group/card relative overflow-hidden">
      {/* 3-COLUMN INFO HEADER */}
      <div className="grid grid-cols-3 gap-2 mb-6 pb-4 border-b border-brand-dark/5 text-[9px] font-black uppercase tracking-tight text-brand-dark/35">
        <div className="flex items-center gap-1.5 min-w-0">
          {showGroup ? (
            <>
              <Trophy className={`w-3 h-3 flex-shrink-0 ${theme.accentText}`} />
              <span className="truncate">{jogo['Grupo']}</span>
            </>
          ) : (
            <>
              <CalendarDays className={`w-3 h-3 flex-shrink-0 ${theme.accentText}`} />
              <span className="truncate">{jogo['Data']?.split(',')[1] || jogo['Data']}</span>
            </>
          )}
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
            <span className={`font-exo text-lg font-bold italic ${theme.accentText} block ${dimClass('A')}`}>{jogo['Vitória A']}</span>
            <span className={`block text-[9px] font-montserrat font-bold tabular-nums text-brand-dark/30 ${dimClass('A')}`}>{formatFairOdd(jogo['Vitória A'])}</span>
          </div>
        </div>

        <div className="flex flex-col items-center pt-2">
          {resultado ? (
            <>
              <span className="text-[8px] font-montserrat font-black uppercase tracking-widest text-brand-dark/40 mb-1">Encerrado</span>
              <div className="px-3.5 py-1.5 bg-brand-dark text-white rounded-2xl font-exo font-black text-xl tabular-nums shadow-md mb-3">
                {resultado['Placar A']} <span className="opacity-40 text-sm font-bold">×</span> {resultado['Placar B']}
              </div>
            </>
          ) : (
            <div className="px-2.5 py-1 bg-brand-light rounded-full text-[9px] font-black text-brand-dark/25 mb-4">VS</div>
          )}
          <div className={`flex flex-col items-center ${resultado && desfecho === 'E' ? '' : 'opacity-40'} ${dimClass('E')}`}>
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
            <span className={`font-exo text-lg font-bold italic text-brand-blue block ${dimClass('B')}`}>{jogo['Vitória B']}</span>
            <span className={`block text-[9px] font-montserrat font-bold tabular-nums text-brand-dark/30 ${dimClass('B')}`}>{formatFairOdd(jogo['Vitória B'])}</span>
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
  );
};

type ViewMode = 'data' | 'grupos';

const WorldCupHub: React.FC = () => {
  const [methodology, setMethodology] = useState<1 | 2>(1);
  const [stageId, setStageId] = useState<StageId>(DEFAULT_STAGE_ID);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermJogos, setSearchTermJogos] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('Grupo A');
  const [viewMode, setViewMode] = useState<ViewMode>('data');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({
    key: 'Campeão',
    direction: 'desc'
  });

  const currentStage = STAGES.find((s) => s.id === stageId) ?? STAGES[STAGES.length - 1];
  const currentSimulacaoGeral = methodology === 1 ? currentStage.data : simulacaoGeralBayes;
  const currentPrevisoesJogos = methodology === 1 ? currentStage.jogos : previsoesJogosBayes;
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

  const teamGroupByName = useMemo(() => {
    return (currentPrevisoesJogos as any[]).reduce((acc: Record<string, string>, jogo: any) => {
      const group = jogo['Grupo'];
      if (!group) return acc;

      [jogo['Seleção A'], jogo['Seleção B']].forEach((teamName) => {
        if (teamName) acc[teamName] = getGroupLetter(group);
      });

      return acc;
    }, {});
  }, [currentPrevisoesJogos]);

  const sortedData = useMemo(() => {
    let sortableData = [...(currentSimulacaoGeral as any[])];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        const getSortValue = (team: any) => {
          if (sortConfig.key === 'Grupo') return teamGroupByName[team['Seleção']] || '';
          if (sortConfig.key === 'Seleção') return team['Seleção'] || '';
          return parsePercent(team[sortConfig.key]);
        };

        const aValue = getSortValue(a);
        const bValue = getSortValue(b);
        const comparison = typeof aValue === 'string' && typeof bValue === 'string'
          ? aValue.localeCompare(bValue)
          : aValue - bValue;

        if (comparison < 0) return sortConfig.direction === 'asc' ? -1 : 1;
        if (comparison > 0) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableData;
  }, [currentSimulacaoGeral, sortConfig, teamGroupByName]);

  const filteredSimulacao = sortedData.filter((team: any) =>
    team['Seleção']?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupOptions = useMemo(() => {
    return Array.from(new Set((currentPrevisoesJogos as any[]).map((jogo: any) => jogo['Grupo']).filter(Boolean)))
      .sort((a: any, b: any) => getGroupLetter(a).localeCompare(getGroupLetter(b)));
  }, [currentPrevisoesJogos]);

  const jogosComMeta = useMemo(() => {
    return (currentPrevisoesJogos as any[]).map((jogo: any) => ({
      jogo,
      ts: parseDataHora(jogo),
      resultado: getResultado(jogo),
    }));
  }, [currentPrevisoesJogos]);

  // Datas únicas do calendário em ordem cronológica.
  const dateOptions = useMemo(() => {
    const porData = new Map<string, number>();
    for (const item of jogosComMeta) {
      const data = item.jogo['Data'] || 'Data a definir';
      const atual = porData.get(data);
      if (atual === undefined || item.ts < atual) porData.set(data, item.ts);
    }
    return [...porData.entries()].sort((a, b) => a[1] - b[1]).map(([data, ts]) => ({ data, ts }));
  }, [jogosComMeta]);

  const hojeTs = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  const isHoje = (ts: number) => {
    const d = new Date(ts);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === hojeTs;
  };

  // Dia exibido por padrão: o dia atual; sem jogos hoje, o próximo dia com jogos; após o fim, o último.
  const defaultDate = useMemo(() => {
    const hoje = dateOptions.find((o) => isHoje(o.ts));
    const proxima = dateOptions.find((o) => o.ts >= hojeTs);
    return (hoje ?? proxima ?? dateOptions[dateOptions.length - 1])?.data ?? '';
  }, [dateOptions, hojeTs]);

  const effectiveDate = selectedDate || defaultDate;

  // Com busca ativa, procura em todos os grupos; sem busca, a aba define o recorte.
  const searchJogosAtivo = searchTermJogos.trim().length > 0;
  const filteredJogos = jogosComMeta.filter(({ jogo }) => {
    if (searchJogosAtivo) {
      const term = searchTermJogos.trim().toLowerCase();
      return (
        jogo['Seleção A']?.toLowerCase().includes(term) ||
        jogo['Seleção B']?.toLowerCase().includes(term) ||
        jogo['Grupo']?.toLowerCase().includes(term)
      );
    }
    if (viewMode === 'grupos') return jogo['Grupo'] === selectedGroup;
    return jogo['Data'] === effectiveDate;
  });

  const stepGroup = (delta: number) => {
    const idx = groupOptions.indexOf(selectedGroup);
    const next = (idx + delta + groupOptions.length) % groupOptions.length;
    setSelectedGroup(groupOptions[next] as string);
  };

  const isGroupedView = searchJogosAtivo || viewMode === 'grupos';

  const jogosPorGrupo = useMemo(() => {
    if (!isGroupedView) return {};
    return filteredJogos.reduce((acc: Record<string, any[]>, item) => {
      const group = item.jogo['Grupo'] || 'Sem grupo';
      if (!acc[group]) acc[group] = [];
      acc[group].push(item);
      return acc;
    }, {});
  }, [filteredJogos, isGroupedView]);

  // Vista por data exibe um dia por vez, com os jogos em ordem cronológica.
  const jogosDoDia = useMemo(() => {
    if (isGroupedView) return [];
    return [...filteredJogos].sort((a, b) => a.ts - b.ts);
  }, [filteredJogos, isGroupedView]);

  const stepDate = (delta: number) => {
    const idx = dateOptions.findIndex((o) => o.data === effectiveDate);
    const next = (idx + delta + dateOptions.length) % dateOptions.length;
    setSelectedDate(dateOptions[next].data);
  };

  const shortDate = (ts: number) => new Date(ts).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  const effectiveDateTs = dateOptions.find((o) => o.data === effectiveDate)?.ts ?? 0;

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = ['Grupo', 'Seleção'].includes(key) ? 'asc' : 'desc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    } else if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ col }: { col: string }) => {
    if (sortConfig?.key !== col) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-20" />;
    return sortConfig.direction === 'asc' ? <ArrowUp className={`w-3 h-3 ml-1 ${theme.accentText}`} /> : <ArrowDown className={`w-3 h-3 ml-1 ${theme.accentText}`} />;
  };

  const VIEW_TABS: Array<{ id: ViewMode; label: string }> = [
    { id: 'data', label: 'Por Data' },
    { id: 'grupos', label: 'Por Grupo' },
  ];

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
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-12 gap-8">
            <div className="max-w-4xl">
              {/* Fonte fluida com teto calibrado para "Pré-Convocação" (rótulo mais largo) caber sem quebra de linha */}
              <h2 className="text-[length:clamp(1.5rem,5.5vw,3.2rem)] whitespace-nowrap font-montserrat font-black text-brand-dark uppercase tracking-tighter leading-none mb-4">
                Simulação <span className={`${theme.accentText} italic`}>{methodology === 1 ? currentStage.label : 'Pré-Torneio'}</span>
              </h2>
              <p className="text-brand-dark/50 font-light text-lg font-opensans">Simulação realizada em {methodology === 1 ? currentStage.date : '30/04/2026'}. O torneio foi simulado 1 milhão de vezes e as probabilidades representam a frequência dos acontecimentos.</p>
              {methodology === 1 && (
                <div className="mt-6">
                  <span className="block text-[10px] font-montserrat font-black uppercase tracking-[0.25em] text-brand-dark/40 mb-2">Etapa da simulação</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {STAGES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setStageId(s.id)}
                        className="px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border-2 transition-all shadow-sm"
                        style={{
                          borderColor: stageId === s.id ? theme.accent : theme.accentBorder,
                          color: stageId === s.id ? '#ffffff' : theme.accent,
                          backgroundColor: stageId === s.id ? theme.accent : '#ffffff',
                        }}
                      >
                        {s.label} · {s.date}
                      </button>
                    ))}
                    {UPCOMING_STAGES.map((s) => (
                      <button
                        key={s.label}
                        disabled
                        title="Em breve — o modelo será rodado ao fim desta etapa"
                        className="px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border-2 shadow-sm cursor-not-allowed"
                        style={{
                          borderColor: 'rgba(42,52,46,0.12)',
                          color: 'rgba(42,52,46,0.35)',
                          backgroundColor: 'rgba(42,52,46,0.04)',
                        }}
                      >
                        {s.label} · {s.date}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="relative w-full xl:w-96">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-dark/30" />
              <input type="text" placeholder="Filtrar seleção..." className={`w-full pl-14 pr-8 py-5 bg-white border-2 border-brand-dark/5 rounded-3xl text-sm outline-none ${theme.accentFocusBorder} transition-all shadow-sm font-opensans`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl border border-brand-dark/5 overflow-hidden overflow-x-auto overscroll-x-contain">
            <table className="w-full text-left border-collapse min-w-[1080px]">
              <thead>
                <tr className="bg-brand-dark text-white font-montserrat text-[10px] uppercase tracking-[0.25em]">
                  <th className="px-4 py-4 cursor-pointer hover:bg-white/5 transition-colors sticky left-0 bg-brand-dark z-20" onClick={() => requestSort('Seleção')}>
                    <div className="flex items-center">Seleção <SortIcon col="Seleção" /></div>
                  </th>
                  <th className="w-10 px-2 py-4 text-center bg-brand-dark cursor-pointer hover:bg-white/5 transition-colors" onClick={() => requestSort('Grupo')}>
                    <div className="flex items-center justify-center">Grupo <SortIcon col="Grupo" /></div>
                  </th>
                  {['1º Grupo', '2º Grupo', '3º Grupo', '4º Grupo', 'Top 32', 'Oitavas', 'Quartas', 'Semi', 'Final', 'Campeão'].map((phase) => (
                    <th key={phase} className="px-3 py-4 text-center cursor-pointer hover:bg-white/5 transition-colors" onClick={() => requestSort(phase)}>
                      <div className="flex items-center justify-center">{phase} <SortIcon col={phase} /></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-dark/5">
                {filteredSimulacao.map((team: any, idx) => (
                  <tr key={idx} className={`${theme.accentHoverBgSoft} transition-colors group`}>
                    <td className="p-2.5 px-4 sticky left-0 bg-white group-hover:bg-[#F8FFF9] z-10 border-r border-brand-dark/5">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-brand-dark/30 font-black w-6 tabular-nums font-opensans">{idx + 1}</span>
                        <div className="w-8 h-5 rounded-sm shadow-sm border border-brand-dark/5 overflow-hidden flex-shrink-0">
                          <img src={getFlag(team['Seleção'])} className="w-full h-full object-cover" alt="" loading="lazy" decoding="async" />
                        </div>
                        <span className="font-montserrat font-bold text-brand-dark uppercase tracking-tight text-sm">{team['Seleção']}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2.5 text-center font-montserrat text-xs font-bold text-brand-dark/55">
                      {teamGroupByName[team['Seleção']] || '-'}
                    </td>
                    {['1º Grupo', '2º Grupo', '3º Grupo', '4º Grupo', 'Top 32', 'Oitavas', 'Quartas', 'Semi', 'Final', 'Campeão'].map((phase) => (
                      <td key={phase} className={`px-3 py-2.5 text-center text-sm font-bold tabular-nums font-opensans ${phase === 'Campeão' ? `${theme.accentText} ${theme.accentBgSoftClass} font-black text-base` : 'text-brand-dark/70'}`}>
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
            <h2 className="text-[length:clamp(1.5rem,5.5vw,3.2rem)] whitespace-nowrap font-montserrat font-black text-brand-dark uppercase tracking-tighter leading-none mb-4">
              Agenda de <span className={`${theme.accentText} italic`}>Confrontos</span>
            </h2>

            {methodology === 1 && (
              <p
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-montserrat font-black uppercase tracking-widest border"
                style={{ color: theme.accent, borderColor: theme.accentBorder, backgroundColor: theme.accentSoft }}
              >
                Probabilidades da etapa {currentStage.label} · simulação de {currentStage.date}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {VIEW_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id)}
                  className="px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest border-2 transition-all shadow-sm"
                  style={{
                    borderColor: viewMode === tab.id ? theme.accent : theme.accentBorder,
                    color: viewMode === tab.id ? '#ffffff' : theme.accent,
                    backgroundColor: viewMode === tab.id ? theme.accent : '#ffffff',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-6 border-b border-brand-dark/5">
              {viewMode === 'grupos' ? (
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
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
              ) : (
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {dateOptions.map(({ data, ts }) => (
                    <button
                      key={data}
                      onClick={() => setSelectedDate(data)}
                      className="px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all bg-white hover:-translate-y-0.5 shadow-sm"
                      style={{
                        borderColor: effectiveDate === data ? theme.accent : theme.accentBorder,
                        color: effectiveDate === data ? '#ffffff' : theme.accent,
                        backgroundColor: effectiveDate === data ? theme.accent : '#ffffff',
                        transform: effectiveDate === data ? 'scale(1.05)' : 'none',
                        boxShadow: effectiveDate === data ? `0 10px 15px -3px ${theme.accentSoft}` : 'none'
                      }}
                    >
                      {shortDate(ts)}{isHoje(ts) ? ' · Hoje' : ''}
                    </button>
                  ))}
                </div>
              )}

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
             {isGroupedView && Object.entries(jogosPorGrupo).map(([group, itens]) => {
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
                      {(itens as any[]).map((item: any, idx: number) => (
                        <JogoCard key={`${group}-${idx}`} jogo={item.jogo} theme={theme} />
                      ))}
                    </div>
                 </div>
               );
             })}
             {!isGroupedView && jogosDoDia.length > 0 && (
               <div className="bg-white border-2 shadow-md overflow-hidden" style={{ borderColor: theme.accent, borderRadius: 16 }}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-5 border-b-2" style={{ backgroundColor: theme.accent, borderColor: theme.accent }}>
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 flex items-center justify-center bg-white shadow-inner flex-shrink-0" style={{ color: theme.accent, borderRadius: 12 }}>
                        <CalendarDays className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-montserrat font-black text-white leading-none uppercase tracking-tight">{effectiveDate}</h3>
                        <span className="block text-[10px] font-montserrat font-black uppercase tracking-widest text-white/70 mt-1.5">
                          {jogosDoDia.length} {jogosDoDia.length === 1 ? 'jogo' : 'jogos'}{isHoje(effectiveDateTs) ? ' · Hoje' : ''}
                        </span>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/80">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-white" /> Vitória A</span>
                      <span className="flex items-center gap-1.5 ml-2"><span className="w-2.5 h-2.5 rounded-full bg-white/40" /> Empate</span>
                      <span className="flex items-center gap-1.5 ml-2"><span className="w-2.5 h-2.5 rounded-full bg-brand-blue border border-white/20" /> Vitória B</span>
                    </div>
                  </div>
                  <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-5 p-5 md:p-6 bg-brand-light/20">
                    {jogosDoDia.map((item: any, idx: number) => (
                      <JogoCard key={`${effectiveDate}-${idx}`} jogo={item.jogo} theme={theme} showGroup />
                    ))}
                  </div>
               </div>
             )}
             {!searchJogosAtivo && filteredJogos.length > 0 && (
               <div className="flex items-center justify-center gap-6 pt-2">
                 <button
                   onClick={() => (viewMode === 'grupos' ? stepGroup(-1) : stepDate(-1))}
                   aria-label={viewMode === 'grupos' ? 'Grupo anterior' : 'Dia anterior'}
                   className="w-11 h-11 flex items-center justify-center rounded-full border border-brand-dark/10 bg-white text-brand-dark/40 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                   style={{ color: theme.accent }}
                 >
                   <ChevronLeft className="w-5 h-5" />
                 </button>
                 <span className="text-[11px] font-montserrat font-black uppercase tracking-widest text-brand-dark/40 min-w-[5.5rem] text-center">
                   {viewMode === 'grupos' ? selectedGroup : shortDate(effectiveDateTs)}
                 </span>
                 <button
                   onClick={() => (viewMode === 'grupos' ? stepGroup(1) : stepDate(1))}
                   aria-label={viewMode === 'grupos' ? 'Próximo grupo' : 'Próximo dia'}
                   className="w-11 h-11 flex items-center justify-center rounded-full border border-brand-dark/10 bg-white text-brand-dark/40 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                   style={{ color: theme.accent }}
                 >
                   <ChevronRight className="w-5 h-5" />
                 </button>
               </div>
             )}
             {filteredJogos.length === 0 && (
               <div className="bg-white border-2 border-dashed border-brand-dark/10 p-16 text-center rounded-[2rem]">
                 <p className="font-montserrat font-black uppercase text-brand-dark text-xl">Nenhum confronto encontrado</p>
                 <p className="text-sm text-brand-dark/45 mt-2">Ajuste o filtro de data, grupo ou a busca por seleção.</p>
               </div>
             )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default WorldCupHub;
