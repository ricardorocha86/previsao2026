import React, { useEffect, useMemo, useState, useLayoutEffect, useRef } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Eraser,
  Gift,
  Lock,
  MapPin,
  Save,
  Sparkles,
  UserRound,
  Trophy,
  Check,
  AlertCircle,
  Loader2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  ShieldCheck,
  Share2,
  Percent,
  X,
} from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import LegalModal, { LegalTab } from './LegalModal';
import previsoesJogos from '../assets/previsoes_jogos.json';
import resultadosJogos from '../assets/resultados_jogos.json';
import flags from '../assets/flags.json';
import forcaSelecoes from '../assets/forca_selecoes.json';
import { toPng } from 'html-to-image';
import { buildShareCardInnerHTML, getMontserratEmbedCSS, CARD_W, CARD_H, STAGE_W, STAGE_H, STAGE_OFFSET_X, STAGE_OFFSET_Y, type ShareCardData, type SCMatch } from './shareCard';
import { officialThirdPlaceAssignment, type ThirdPlaceAssignmentColumn } from '../data/thirdPlaceAnnexC';

type SourceMatch = Record<string, string>;
type MatchStage = 'groups' | 'roundOf32' | 'roundOf16' | 'quarterfinals' | 'semifinals' | 'thirdPlace' | 'final';

interface CupMatch {
  id: string;
  stage: MatchStage;
  label: string;
  group?: string;
  date?: string;
  venue?: string;
  time?: string;
  homeTeam: string;
  awayTeam: string;
  homeProbability?: string;
  drawProbability?: string;
  awayProbability?: string;
  homeSeed?: string;
  awaySeed?: string;
}

interface MatchPrediction {
  homeGoals: number | null;
  awayGoals: number | null;
  penaltyWinner: string | null;
}

type PredictionSource = 'manual' | 'randomGroup' | 'official';

interface FillMetadata {
  usedRandomGroupFill: boolean;
  randomGroupMatchCount: number;
}

interface Participant {
  name: string;
  email: string;
  expertiseLevel: string;
  footballFollowFrequency: string;
  cupPoolExperience: string;
  favoriteTeam: string;
}

interface BolaoDraft {
  participant: Participant;
  predictions: Record<string, MatchPrediction>;
  predictionSources: Record<string, PredictionSource>;
  submittedAt: string | null;
  lastSavedAt: string | null;
}

interface StandingRow {
  team: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  group: string;
}

interface QualifiedTeam extends StandingRow {
  seedLabel: string;
  seedRank: number;
  groupRank: number;
}

const STORAGE_KEY = 'previsao-bolao-draft-v1';
const MATCHES = previsoesJogos as SourceMatch[];
const FLAGS = flags as Record<string, string>;

const FIELD: Record<string, string[]> = {
  group: ['Grupo'],
  date: ['Data'],
  venue: ['Horário/Local', 'HorÃ¡rio/Local'],
  time: ['Horário Brasília', 'HorÃ¡rio BrasÃ­lia'],
  homeTeam: ['Seleção A', 'SeleÃ§Ã£o A'],
  awayTeam: ['Seleção B', 'SeleÃ§Ã£o B'],
  homeProbability: ['Vitória A', 'VitÃ³ria A'],
  drawProbability: ['Empate'],
  awayProbability: ['Vitória B', 'VitÃ³ria B'],
};

const GROUP_ORDER = 'ABCDEFGHIJKL'.split('');

const emptyPrediction = (): MatchPrediction => ({
  homeGoals: null,
  awayGoals: null,
  penaltyWinner: null,
});

const createInitialParticipant = (): Participant => ({
  name: '',
  email: '',
  expertiseLevel: '',
  footballFollowFrequency: '',
  cupPoolExperience: '',
  favoriteTeam: '',
});

const createInitialDraft = (): BolaoDraft => ({
  participant: createInitialParticipant(),
  predictions: {},
  predictionSources: {},
  submittedAt: null,
  lastSavedAt: null,
});

const normalizeDraft = (draft: BolaoDraft): BolaoDraft => ({
  ...draft,
  submittedAt: null,
  predictionSources: draft.predictionSources ?? {},
  participant: {
    ...createInitialParticipant(),
    ...draft.participant,
  },
});

const localBolaoRepository = {
  loadDraft(): BolaoDraft | null {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? normalizeDraft(JSON.parse(raw) as BolaoDraft) : null;
    } catch {
      return null;
    }
  },
  saveDraft(draft: BolaoDraft) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  },
};

const sourceValue = (match: SourceMatch, field: keyof typeof FIELD) => {
  const key = FIELD[field].find((candidate) => match[candidate] !== undefined);
  return key ? match[key] : '';
};

const normalizeSlug = (value: string) =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();

const groupLetter = (group: string) => group.replace('Grupo ', '').trim();

const parsePercent = (value?: string) => {
  if (!value) return 0;
  return Number(value.replace('%', '').replace(',', '.')) || 0;
};

const formatDate = (value?: string) => value?.replace(/^\w+-feira,\s*/i, '').replace(/^SÃ¡bado\s*/i, 'SÃ¡bado, ') ?? '';

const shortTime = (value?: string) => {
  const match = value?.match(/\(([^/]+)/);
  return match ? match[1].trim() : value ?? '';
};

const shortVenue = (value?: string) => value?.split('â€“')[0]?.trim() ?? '';

const TEAM_CODE_OVERRIDES: Record<string, string> = {
  'Africa do Sul': 'RSA',
  'Alemanha': 'GER',
  'Argelia': 'ALG',
  'Argentina': 'ARG',
  'Australia': 'AUS',
  'Austria': 'AUT',
  'Belgica': 'BEL',
  'Bosnia e Herzegovina': 'BIH',
  'Brasil': 'BRA',
  'Canada': 'CAN',
  'Catar': 'QAT',
  'Colombia': 'COL',
  'Coreia do Sul': 'KOR',
  'Costa do Marfim': 'CIV',
  'Croacia': 'CRO',
  'Egito': 'EGY',
  'Equador': 'ECU',
  'Escocia': 'SCO',
  'Espanha': 'ESP',
  'Estados Unidos': 'USA',
  'Franca': 'FRA',
  'Holanda': 'NED',
  'Inglaterra': 'ENG',
  'Japao': 'JPN',
  'Marrocos': 'MAR',
  'Mexico': 'MEX',
  'Noruega': 'NOR',
  'Paraguai': 'PAR',
  'Portugal': 'POR',
  'Senegal': 'SEN',
  'Suecia': 'SWE',
  'Suica': 'SUI',
  'Tcheca': 'CZE',
  'Uruguai': 'URU',
};

const FLAGCDN_CODE_OVERRIDES: Record<string, string> = {
  'Africa do Sul': 'za',
  'Alemanha': 'de',
  'Arabia Saudita': 'sa',
  'Argelia': 'dz',
  'Argentina': 'ar',
  'Australia': 'au',
  'Austria': 'at',
  'Belgica': 'be',
  'Bosnia e Herzegovina': 'ba',
  'Brasil': 'br',
  'Cabo Verde': 'cv',
  'Canada': 'ca',
  'Catar': 'qa',
  'Colombia': 'co',
  'Coreia do Sul': 'kr',
  'Costa do Marfim': 'ci',
  'Croacia': 'hr',
  'Curacao': 'cw',
  'Egito': 'eg',
  'Equador': 'ec',
  'Escocia': 'gb-sct',
  'Espanha': 'es',
  'Estados Unidos': 'us',
  'Franca': 'fr',
  'Gana': 'gh',
  'Haiti': 'ht',
  'Holanda': 'nl',
  'Inglaterra': 'gb-eng',
  'Iraque': 'iq',
  'Ira': 'ir',
  'Japao': 'jp',
  'Jordania': 'jo',
  'Marrocos': 'ma',
  'Mexico': 'mx',
  'Noruega': 'no',
  'Nova Zelandia': 'nz',
  'Panama': 'pa',
  'Paraguai': 'py',
  'Portugal': 'pt',
  'RD do Congo': 'cd',
  'Senegal': 'sn',
  'Suecia': 'se',
  'Suica': 'ch',
  'Tcheca': 'cz',
  'Tunisia': 'tn',
  'Turquia': 'tr',
  'Uruguai': 'uy',
  'Uzbequistao': 'uz',
};

const normalizedTeamName = (team: string) =>
  team
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const flagFor = (team: string) => FLAGS[team] || 'https://flagcdn.com/w320/un.webp';

const heroFlagFor = (team: string) => {
  const code = FLAGCDN_CODE_OVERRIDES[normalizedTeamName(team)];
  return code ? `https://flagcdn.com/w640/${code}.webp` : flagFor(team);
};

type PlayerEasterEggPlacement = 'right' | 'left' | 'top';

const PLAYER_EASTER_EGGS: Record<string, { player: string; src: string; placement: PlayerEasterEggPlacement }> = {
  Argentina: { player: 'Messi', src: '/assets/easter-eggs/messi.webp', placement: 'right' },
  Brasil: { player: 'Endrick', src: '/assets/easter-eggs/endrick-19-trophy.webp', placement: 'left' },
  Espanha: { player: 'Yamal', src: '/assets/easter-eggs/yamal.webp', placement: 'right' },
  Franca: { player: 'Mbappé', src: '/assets/easter-eggs/mbappe.webp', placement: 'left' },
  Inglaterra: { player: 'Harry Kane', src: '/assets/easter-eggs/kane.webp', placement: 'left' },
  Portugal: { player: 'CR7', src: '/assets/easter-eggs/cr7.webp', placement: 'right' },
};

const playerEasterEggFor = (team: string) => PLAYER_EASTER_EGGS[normalizedTeamName(team)] ?? null;

const teamCode = (team: string) => {
  const normalized = normalizedTeamName(team);
  return TEAM_CODE_OVERRIDES[normalized] ?? normalized.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase();
};

const teamAccent = (team: string) => {
  const colors = ['#209927', '#035C88', '#BF1A1F', '#7AB802', '#00621A', '#E0A800'];
  const sum = Array.from(team).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[sum % colors.length];
};

const makeGroupMatches = (): CupMatch[] =>
  MATCHES.map((match, index) => {
    const group = sourceValue(match, 'group');
    const letter = groupLetter(group);
    const homeTeam = sourceValue(match, 'homeTeam');
    const awayTeam = sourceValue(match, 'awayTeam');

    return {
      id: `group-${letter}-${index + 1}-${normalizeSlug(homeTeam)}-${normalizeSlug(awayTeam)}`,
      stage: 'groups',
      label: `${letter}${(index % 6) + 1}`,
      group,
      date: sourceValue(match, 'date'),
      venue: sourceValue(match, 'venue'),
      time: sourceValue(match, 'time'),
      homeTeam,
      awayTeam,
      homeProbability: sourceValue(match, 'homeProbability'),
      drawProbability: sourceValue(match, 'drawProbability'),
      awayProbability: sourceValue(match, 'awayProbability'),
    };
  });

const GROUP_MATCHES = makeGroupMatches();
const TOTAL_MATCHES = 104;

const groupMatchesByLetter = GROUP_MATCHES.reduce<Record<string, CupMatch[]>>((acc, match) => {
  const letter = groupLetter(match.group ?? '');
  acc[letter] = [...(acc[letter] ?? []), match];
  return acc;
}, {});

// Resultados oficiais de jogos já encerrados (mesma fonte do site de previsões).
// Na fase de grupos, cada par de seleções joga uma única vez; por isso não dependemos da data.
// O placar real fica fora da edição e do preenchimento aleatório.
interface OfficialResult {
  'Seleção A': string;
  'Seleção B': string;
  Data: string;
  'Placar A': number;
  'Placar B': number;
  Status: string;
}

const officialResultKey = (home: string, away: string) => `${home}|${away}`;

const OFFICIAL_RESULTS_BY_ID: Record<string, MatchPrediction> = (() => {
  const byKey = new Map<string, MatchPrediction>();
  (resultadosJogos as OfficialResult[]).forEach((result) => {
    if (result.Status === 'encerrado') {
      byKey.set(officialResultKey(result['Seleção A'], result['Seleção B']), {
        homeGoals: result['Placar A'],
        awayGoals: result['Placar B'],
        penaltyWinner: null,
      });
      byKey.set(officialResultKey(result['Seleção B'], result['Seleção A']), {
        homeGoals: result['Placar B'],
        awayGoals: result['Placar A'],
        penaltyWinner: null,
      });
    }
  });

  const map: Record<string, MatchPrediction> = {};
  GROUP_MATCHES.forEach((match) => {
    const result = byKey.get(officialResultKey(match.homeTeam, match.awayTeam));
    if (result) {
      map[match.id] = result;
    }
  });
  return map;
})();

const LOCKED_MATCH_IDS = new Set(Object.keys(OFFICIAL_RESULTS_BY_ID));

const isLockedMatch = (matchId: string) => LOCKED_MATCH_IDS.has(matchId);

// Força os placares oficiais nas predições, sobrescrevendo qualquer palpite salvo para jogos já encerrados.
const withOfficialResults = (predictions: Record<string, MatchPrediction>): Record<string, MatchPrediction> => ({
  ...predictions,
  ...OFFICIAL_RESULTS_BY_ID,
});

const withOfficialSources = (sources: Record<string, PredictionSource>): Record<string, PredictionSource> => {
  const next = { ...sources };
  LOCKED_MATCH_IDS.forEach((id) => {
    next[id] = 'official';
  });
  return next;
};

const buildFillMetadata = (predictionSources: Record<string, PredictionSource>): FillMetadata => {
  const randomGroupMatchCount = GROUP_MATCHES.filter((match) => predictionSources[match.id] === 'randomGroup').length;
  return {
    usedRandomGroupFill: randomGroupMatchCount > 0,
    randomGroupMatchCount,
  };
};

const getPrediction = (predictions: Record<string, MatchPrediction>, matchId: string) =>
  predictions[matchId] ?? emptyPrediction();

const hasScore = (prediction?: MatchPrediction) =>
  prediction?.homeGoals !== null &&
  prediction?.homeGoals !== undefined &&
  prediction?.awayGoals !== null &&
  prediction?.awayGoals !== undefined;

const resolvedWinner = (match: CupMatch, prediction?: MatchPrediction) => {
  if (!hasScore(prediction)) return null;
  if ((prediction?.homeGoals ?? 0) > (prediction?.awayGoals ?? 0)) return match.homeTeam;
  if ((prediction?.awayGoals ?? 0) > (prediction?.homeGoals ?? 0)) return match.awayTeam;
  return match.stage === 'groups' ? null : prediction?.penaltyWinner ?? null;
};

const isResolved = (match: CupMatch, prediction?: MatchPrediction) =>
  match.stage === 'groups' ? hasScore(prediction) : resolvedWinner(match, prediction) !== null;

const sortOverallStandings = <T extends StandingRow>(rows: T[]): T[] =>
  [...rows].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.team.localeCompare(b.team);
  });

interface HeadToHeadStats {
  points: number;
  goalDifference: number;
  goalsFor: number;
}

const calculateHeadToHeadStats = (
  tiedRows: StandingRow[],
  matches: CupMatch[],
  predictions: Record<string, MatchPrediction>,
) => {
  const tiedTeams = new Set(tiedRows.map((row) => row.team));
  const stats = new Map<string, HeadToHeadStats>(
    tiedRows.map((row) => [
      row.team,
      { points: 0, goalDifference: 0, goalsFor: 0 },
    ]),
  );

  matches.forEach((match) => {
    if (!tiedTeams.has(match.homeTeam) || !tiedTeams.has(match.awayTeam)) return;

    const prediction = predictions[match.id];
    if (!hasScore(prediction)) return;

    const home = stats.get(match.homeTeam);
    const away = stats.get(match.awayTeam);
    if (!home || !away) return;

    const homeGoals = prediction.homeGoals ?? 0;
    const awayGoals = prediction.awayGoals ?? 0;
    home.goalsFor += homeGoals;
    away.goalsFor += awayGoals;
    home.goalDifference += homeGoals - awayGoals;
    away.goalDifference += awayGoals - homeGoals;

    if (homeGoals > awayGoals) {
      home.points += 3;
    } else if (awayGoals > homeGoals) {
      away.points += 3;
    } else {
      home.points += 1;
      away.points += 1;
    }
  });

  return stats;
};

const sameHeadToHeadStats = (left: HeadToHeadStats, right: HeadToHeadStats) =>
  left.points === right.points &&
  left.goalDifference === right.goalDifference &&
  left.goalsFor === right.goalsFor;

const rankTiedGroupRows = (
  tiedRows: StandingRow[],
  matches: CupMatch[],
  predictions: Record<string, MatchPrediction>,
): StandingRow[] => {
  if (tiedRows.length <= 1) return tiedRows;

  const stats = calculateHeadToHeadStats(tiedRows, matches, predictions);
  const sorted = [...tiedRows].sort((a, b) => {
    const statsA = stats.get(a.team)!;
    const statsB = stats.get(b.team)!;
    if (statsB.points !== statsA.points) return statsB.points - statsA.points;
    if (statsB.goalDifference !== statsA.goalDifference) {
      return statsB.goalDifference - statsA.goalDifference;
    }
    if (statsB.goalsFor !== statsA.goalsFor) return statsB.goalsFor - statsA.goalsFor;
    return 0;
  });

  const equalBlocks: StandingRow[][] = [];
  sorted.forEach((row) => {
    const currentBlock = equalBlocks[equalBlocks.length - 1];
    if (
      !currentBlock ||
      !sameHeadToHeadStats(stats.get(currentBlock[0].team)!, stats.get(row.team)!)
    ) {
      equalBlocks.push([row]);
    } else {
      currentBlock.push(row);
    }
  });

  return equalBlocks.flatMap((block) => {
    if (block.length === 1) return block;

    // A FIFA reaplica os critérios de confronto direto somente entre as equipes
    // que continuaram empatadas. Se nenhuma equipe foi separada, segue para os
    // critérios gerais: saldo de gols e gols marcados em todo o grupo.
    if (block.length < tiedRows.length) {
      return rankTiedGroupRows(block, matches, predictions);
    }
    return sortOverallStandings(block);
  });
};

const rankGroupStandings = (
  rows: StandingRow[],
  matches: CupMatch[],
  predictions: Record<string, MatchPrediction>,
) => {
  const rowsByPoints = new Map<number, StandingRow[]>();
  rows.forEach((row) => {
    rowsByPoints.set(row.points, [...(rowsByPoints.get(row.points) ?? []), row]);
  });

  return [...rowsByPoints.keys()]
    .sort((a, b) => b - a)
    .flatMap((points) => rankTiedGroupRows(rowsByPoints.get(points)!, matches, predictions));
};

const calculateGroupStandings = (matches: CupMatch[], predictions: Record<string, MatchPrediction>) => {
  const rows = new Map<string, StandingRow>();

  matches.forEach((match) => {
    [match.homeTeam, match.awayTeam].forEach((team) => {
      if (!rows.has(team)) {
        rows.set(team, {
          team,
          played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0,
          group: match.group ?? '',
        });
      }
    });

    const prediction = predictions[match.id];
    if (!hasScore(prediction)) return;

    const home = rows.get(match.homeTeam);
    const away = rows.get(match.awayTeam);
    if (!home || !away) return;

    const homeGoals = prediction.homeGoals ?? 0;
    const awayGoals = prediction.awayGoals ?? 0;

    home.played += 1;
    away.played += 1;
    home.goalsFor += homeGoals;
    home.goalsAgainst += awayGoals;
    away.goalsFor += awayGoals;
    away.goalsAgainst += homeGoals;

    if (homeGoals > awayGoals) {
      home.wins += 1;
      away.losses += 1;
      home.points += 3;
    } else if (awayGoals > homeGoals) {
      away.wins += 1;
      home.losses += 1;
      away.points += 3;
    } else {
      home.draws += 1;
      away.draws += 1;
      home.points += 1;
      away.points += 1;
    }

    home.goalDifference = home.goalsFor - home.goalsAgainst;
    away.goalDifference = away.goalsFor - away.goalsAgainst;
  });

  return rankGroupStandings(Array.from(rows.values()), matches, predictions);
};

const calculateAllStandings = (predictions: Record<string, MatchPrediction>) =>
  GROUP_ORDER.reduce<Record<string, StandingRow[]>>((acc, letter) => {
    acc[letter] = calculateGroupStandings(groupMatchesByLetter[letter] ?? [], predictions);
    return acc;
  }, {});

const calculateQualifiers = (standings: Record<string, StandingRow[]>) => {
  const firstAndSecond: QualifiedTeam[] = [];
  const thirdPlaced: QualifiedTeam[] = [];

  GROUP_ORDER.forEach((letter) => {
    const rows = standings[letter] ?? [];
    rows.slice(0, 2).forEach((row, index) => {
      firstAndSecond.push({
        ...row,
        seedLabel: `${index + 1}º ${letter}`,
        seedRank: 0,
        groupRank: index + 1,
      });
    });
    if (rows[2]) {
      thirdPlaced.push({
        ...rows[2],
        seedLabel: `3º ${letter}`,
        seedRank: 0,
        groupRank: 3,
      });
    }
  });

  const bestThirds = sortOverallStandings(thirdPlaced).slice(0, 8);
  return sortOverallStandings([...firstAndSecond, ...bestThirds]).map((team, index) => ({
    ...team,
    seedRank: index + 1,
  }));
};

const stageMeta: Record<MatchStage, { title: string; next?: MatchStage }> = {
  groups: { title: 'Grupos', next: 'roundOf32' },
  roundOf32: { title: '16 avos', next: 'roundOf16' },
  roundOf16: { title: 'Oitavas', next: 'quarterfinals' },
  quarterfinals: { title: 'Quartas', next: 'semifinals' },
  semifinals: { title: 'Semifinais', next: 'final' },
  thirdPlace: { title: 'Disputa de 3º lugar' },
  final: { title: 'Final' },
};

type KnockoutStage = Exclude<MatchStage, 'groups'>;

const knockoutStages: KnockoutStage[] = ['roundOf32', 'roundOf16', 'quarterfinals', 'semifinals', 'thirdPlace', 'final'];

const roundSlots: Record<KnockoutStage, number> = {
  roundOf32: 16,
  roundOf16: 8,
  quarterfinals: 4,
  semifinals: 2,
  thirdPlace: 1,
  final: 1,
};

const makeKnockoutMatch = (
  stage: KnockoutStage,
  index: number,
  home: QualifiedTeam,
  away: QualifiedTeam,
): CupMatch => ({
  id: `ko-${stage}-${index + 1}`,
  stage,
  label: `${stageMeta[stage].title} ${index + 1}`,
  homeTeam: home.team,
  awayTeam: away.team,
  homeSeed: home.seedLabel,
  awaySeed: away.seedLabel,
});

const winnerSlotsFromRound = (
  matches: CupMatch[],
  predictions: Record<string, MatchPrediction>,
  previousEntrants: QualifiedTeam[],
) =>
  Array.from({ length: matches.length }, (_, index) => {
    const match = matches[index];
    if (!match) return null;
    const winner = resolvedWinner(match, predictions[match.id]);
    const source = previousEntrants.find((team) => team.team === winner);
    return source ? { ...source, seedLabel: source.seedLabel } : null;
  });

const buildPairedRound = (stage: KnockoutStage, entrants: Array<QualifiedTeam | null>) => {
  const matches = Array<CupMatch>(entrants.length / 2);

  for (let index = 0; index < entrants.length; index += 2) {
    const home = entrants[index];
    const away = entrants[index + 1];
    if (home && away) {
      matches[index / 2] = makeKnockoutMatch(stage, index / 2, home, away);
    }
  }

  return matches;
};

const thirdPlaceSlotMatches: { matchId: string; winnerGroup: ThirdPlaceAssignmentColumn }[] = [
  { matchId: 'ko-roundOf32-1', winnerGroup: 'E' },
  { matchId: 'ko-roundOf32-2', winnerGroup: 'I' },
  { matchId: 'ko-roundOf32-7', winnerGroup: 'D' },
  { matchId: 'ko-roundOf32-8', winnerGroup: 'G' },
  { matchId: 'ko-roundOf32-11', winnerGroup: 'A' },
  { matchId: 'ko-roundOf32-12', winnerGroup: 'L' },
  { matchId: 'ko-roundOf32-15', winnerGroup: 'B' },
  { matchId: 'ko-roundOf32-16', winnerGroup: 'K' },
];

const getTeamByRank = (
  standings: Record<string, StandingRow[]>,
  groupLetter: string,
  rank: 1 | 2 | 3
): QualifiedTeam => {
  const groupStandings = standings[groupLetter] ?? [];
  const row = groupStandings[rank - 1];
  
  if (row) {
    return {
      ...row,
      seedLabel: rank === 1 ? `1º ${groupLetter}` : rank === 2 ? `2º ${groupLetter}` : `3º ${groupLetter}`,
      seedRank: 0,
      groupRank: rank,
    };
  }
  
  return {
    team: `Aguardando ${rank}º ${groupLetter}`,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
    group: `Grupo ${groupLetter}`,
    seedLabel: rank === 1 ? `1º ${groupLetter}` : rank === 2 ? `2º ${groupLetter}` : `3º ${groupLetter}`,
    seedRank: 0,
    groupRank: rank,
  };
};

const ROUND_OF_32_JOGOS = [
  'Jogo 74',
  'Jogo 77',
  'Jogo 73',
  'Jogo 75',
  'Jogo 83',
  'Jogo 84',
  'Jogo 81',
  'Jogo 82',
  'Jogo 76',
  'Jogo 78',
  'Jogo 79',
  'Jogo 80',
  'Jogo 86',
  'Jogo 88',
  'Jogo 85',
  'Jogo 87'
];

const buildBracket = (standings: Record<string, StandingRow[]>, predictions: Record<string, MatchPrediction>) => {
  const rounds: Partial<Record<Exclude<MatchStage, 'groups'>, CupMatch[]>> = {};
  
  // Verify if we have standings for all groups
  const allGroupsHasTeams = GROUP_ORDER.every(letter => (standings[letter] ?? []).length >= 3);
  if (!allGroupsHasTeams) return rounds;

  // Extract qualifiers for the winnerSlotsFromRound functionality
  const firstAndSecond: QualifiedTeam[] = [];
  const thirdPlaced: QualifiedTeam[] = [];

  GROUP_ORDER.forEach((letter) => {
    const rows = standings[letter] ?? [];
    rows.slice(0, 2).forEach((row, index) => {
      firstAndSecond.push({
        ...row,
        seedLabel: `${index + 1}º ${letter}`,
        seedRank: 0,
        groupRank: index + 1,
      });
    });
    if (rows[2]) {
      thirdPlaced.push({
        ...rows[2],
        seedLabel: `3º ${letter}`,
        seedRank: 0,
        groupRank: 3,
      });
    }
  });

  const bestThirds = sortOverallStandings(thirdPlaced).slice(0, 8);
  const qualifiers = sortOverallStandings([...firstAndSecond, ...bestThirds]);

  const assignedThirds = new Map<string, QualifiedTeam>();

  // FIFA Annex C assigns the third-place teams by the exact combination of
  // qualified third-place groups, not by best-third ranking order.
  const thirdByGroup = new Map(bestThirds.map((team) => [groupLetter(team.group), team]));
  const thirdAssignment = officialThirdPlaceAssignment([...thirdByGroup.keys()]);
  if (thirdAssignment) {
    thirdPlaceSlotMatches.forEach(({ matchId, winnerGroup }) => {
      const assignedGroup = thirdAssignment[winnerGroup];
      const team = thirdByGroup.get(assignedGroup);
      if (team) assignedThirds.set(matchId, team);
    });
  } else {
    thirdPlaceSlotMatches.forEach(({ matchId }, index) => {
      const team = bestThirds[index];
      if (team) assignedThirds.set(matchId, team);
    });
  }

  // Construct Round of 32 matches in the exact order shown in the bracket diagram
  const roundOf32Matches: CupMatch[] = [];

  const addMatch = (index: number, home: QualifiedTeam, away: QualifiedTeam) => {
    roundOf32Matches.push({
      id: `ko-roundOf32-${index + 1}`,
      stage: 'roundOf32',
      label: ROUND_OF_32_JOGOS[index],
      homeTeam: home.team,
      awayTeam: away.team,
      homeSeed: home.seedLabel,
      awaySeed: away.seedLabel,
    });
  };

  // Helper to fallback safely
  const getThirdTeam = (matchId: string): QualifiedTeam => {
    return assignedThirds.get(matchId) || getTeamByRank(standings, 'A', 3);
  };

  // Match 1 (Jogo 74): 1º E vs 3º A/B/C/D/F
  addMatch(0, getTeamByRank(standings, 'E', 1), getThirdTeam('ko-roundOf32-1'));
  // Match 2 (Jogo 77): 1º I vs 3º C/D/F/G/H
  addMatch(1, getTeamByRank(standings, 'I', 1), getThirdTeam('ko-roundOf32-2'));
  // Match 3 (Jogo 73): 2º A vs 2º B
  addMatch(2, getTeamByRank(standings, 'A', 2), getTeamByRank(standings, 'B', 2));
  // Match 4 (Jogo 75): 1º F vs 2º C
  addMatch(3, getTeamByRank(standings, 'F', 1), getTeamByRank(standings, 'C', 2));
  // Match 5 (Jogo 83): 2º K vs 2º L
  addMatch(4, getTeamByRank(standings, 'K', 2), getTeamByRank(standings, 'L', 2));
  // Match 6 (Jogo 84): 1º H vs 2º J
  addMatch(5, getTeamByRank(standings, 'H', 1), getTeamByRank(standings, 'J', 2));
  // Match 7 (Jogo 81): 1º D vs 3º B/E/F/I/J
  addMatch(6, getTeamByRank(standings, 'D', 1), getThirdTeam('ko-roundOf32-7'));
  // Match 8 (Jogo 82): 1º G vs 3º A/E/H/I/J
  addMatch(7, getTeamByRank(standings, 'G', 1), getThirdTeam('ko-roundOf32-8'));
  // Match 9 (Jogo 76): 1º C vs 2º F
  addMatch(8, getTeamByRank(standings, 'C', 1), getTeamByRank(standings, 'F', 2));
  // Match 10 (Jogo 78): 2º E vs 2º I
  addMatch(9, getTeamByRank(standings, 'E', 2), getTeamByRank(standings, 'I', 2));
  // Match 11 (Jogo 79): 1º A vs 3º C/E/F/H/I
  addMatch(10, getTeamByRank(standings, 'A', 1), getThirdTeam('ko-roundOf32-11'));
  // Match 12 (Jogo 80): 1º L vs 3º E/H/I/J/K
  addMatch(11, getTeamByRank(standings, 'L', 1), getThirdTeam('ko-roundOf32-12'));
  // Match 13 (Jogo 86): 1º J vs 2º H
  addMatch(12, getTeamByRank(standings, 'J', 1), getTeamByRank(standings, 'H', 2));
  // Match 14 (Jogo 88): 2º D vs 2º G
  addMatch(13, getTeamByRank(standings, 'D', 2), getTeamByRank(standings, 'G', 2));
  // Match 15 (Jogo 85): 1º B vs 3º E/F/G/I/J
  addMatch(14, getTeamByRank(standings, 'B', 1), getThirdTeam('ko-roundOf32-15'));
  // Match 16 (Jogo 87): 1º K vs 3º D/E/I/J/L
  addMatch(15, getTeamByRank(standings, 'K', 1), getThirdTeam('ko-roundOf32-16'));

  rounds.roundOf32 = roundOf32Matches;

  const roundOf32Winners = winnerSlotsFromRound(rounds.roundOf32, predictions, qualifiers);

  rounds.roundOf16 = buildPairedRound('roundOf16', roundOf32Winners);
  const roundOf16Winners = winnerSlotsFromRound(
    rounds.roundOf16,
    predictions,
    roundOf32Winners.filter((team): team is QualifiedTeam => Boolean(team)),
  );

  rounds.quarterfinals = buildPairedRound('quarterfinals', roundOf16Winners);
  const quarterWinners = winnerSlotsFromRound(
    rounds.quarterfinals,
    predictions,
    roundOf16Winners.filter((team): team is QualifiedTeam => Boolean(team)),
  );

  rounds.semifinals = buildPairedRound('semifinals', quarterWinners);
  const semiWinners = winnerSlotsFromRound(
    rounds.semifinals,
    predictions,
    quarterWinners.filter((team): team is QualifiedTeam => Boolean(team)),
  );

  rounds.final = buildPairedRound('final', semiWinners);

  // Disputa de 3º lugar: os perdedores das duas semifinais.
  const semiEntrants = quarterWinners.filter((team): team is QualifiedTeam => Boolean(team));
  const semiLosers = (rounds.semifinals ?? []).map((match) => {
    if (!match) return null;
    const winner = resolvedWinner(match, predictions[match.id]);
    if (!winner) return null;
    const loserTeam = match.homeTeam === winner ? match.awayTeam : match.homeTeam;
    return semiEntrants.find((team) => team.team === loserTeam) ?? null;
  });
  if (semiLosers[0] && semiLosers[1]) {
    rounds.thirdPlace = [
      {
        id: 'ko-thirdPlace-1',
        stage: 'thirdPlace',
        label: 'Disputa de 3º lugar',
        homeTeam: semiLosers[0].team,
        awayTeam: semiLosers[1].team,
        homeSeed: semiLosers[0].seedLabel,
        awaySeed: semiLosers[1].seedLabel,
      },
    ];
  }

  return rounds;
};

const suggestedScore = (match: CupMatch): MatchPrediction => {
  const home = parsePercent(match.homeProbability);
  const draw = parsePercent(match.drawProbability);
  const away = parsePercent(match.awayProbability);

  if (draw >= home && draw >= away) return { homeGoals: 1, awayGoals: 1, penaltyWinner: null };
  if (home >= away) return { homeGoals: home - away > 35 ? 2 : 1, awayGoals: home - away > 50 ? 0 : 1, penaltyWinner: null };
  return { homeGoals: away - home > 50 ? 0 : 1, awayGoals: away - home > 35 ? 2 : 1, penaltyWinner: null };
};

// Tabela de força otimizada e parâmetros do modelo carregados de
// assets/forca_selecoes.json. Mantém a mesma estrutura da metodologia oficial
// (compute_match_probabilities em forca_core.py): distribuímos a média de gols entre
// os dois times proporcionalmente à força de cada um (share).
const FORCAS_SELECOES = forcaSelecoes.forcas as Record<string, number>;
const MEDIA_GOLS_COPA = forcaSelecoes.mediaGols ?? 3.0;
const FORCA_PADRAO = 0.5; // seleção sem dado de Elo (ex.: vaga de repescagem ainda indefinida)
const MAX_GOLS_POISSON = 10;
const MAX_GOLS_PRORROGACAO = 15;
const USAR_DIXON_COLES = forcaSelecoes.dixonColes ?? true;
const RHO_DIXON_COLES = forcaSelecoes.rhoDixonColes ?? -0.13;

const forcaSelecao = (team: string): number => FORCAS_SELECOES[team] ?? FORCA_PADRAO;

// Amostra uma Poisson(lambda) pelo algoritmo de Knuth (sem dependências externas).
const samplePoisson = (lambda: number): number => {
  if (lambda <= 0) return 0;
  const limite = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k += 1;
    p *= Math.random();
  } while (p > limite);
  return k - 1;
};

const poissonSeries = (lambda: number, maxGoals: number) => {
  const probabilities = Array.from({ length: maxGoals + 1 }, () => 0);
  probabilities[0] = Math.exp(-lambda);
  for (let goals = 1; goals <= maxGoals; goals += 1) {
    probabilities[goals] = probabilities[goals - 1] * lambda / goals;
  }
  const residual = Math.max(0, 1 - probabilities.reduce((sum, value) => sum + value, 0));
  probabilities[maxGoals] += residual;
  return probabilities;
};

const dixonColesCorrection = (
  homeGoals: number,
  awayGoals: number,
  lambdaHome: number,
  lambdaAway: number,
  rho = RHO_DIXON_COLES,
) => {
  if (homeGoals === 0 && awayGoals === 0) return 1 - lambdaHome * lambdaAway * rho;
  if (homeGoals === 0 && awayGoals === 1) return 1 + lambdaHome * rho;
  if (homeGoals === 1 && awayGoals === 0) return 1 + lambdaAway * rho;
  if (homeGoals === 1 && awayGoals === 1) return 1 - rho;
  return 1;
};

const poissonMatrix = (
  lambdaHome: number,
  lambdaAway: number,
  maxGoals = MAX_GOLS_POISSON,
  usarDixonColes = USAR_DIXON_COLES,
  rhoDixonColes = RHO_DIXON_COLES,
) => {
  const homeProbabilities = poissonSeries(lambdaHome, maxGoals);
  const awayProbabilities = poissonSeries(lambdaAway, maxGoals);
  const matrix = homeProbabilities.map((homeProbability, homeGoals) =>
    awayProbabilities.map((awayProbability, awayGoals) => {
      const correction = usarDixonColes
        ? dixonColesCorrection(homeGoals, awayGoals, lambdaHome, lambdaAway, rhoDixonColes)
        : 1;
      return homeProbability * awayProbability * correction;
    })
  );
  const total = matrix.flat().reduce((sum, value) => sum + value, 0) || 1;
  return matrix.map((row) => row.map((value) => value / total));
};

interface MatchProbabilities {
  shareHome: number;
  shareAway: number;
  lambdaHome: number;
  lambdaAway: number;
  winHome: number;
  draw: number;
  winAway: number;
  matrix: number[][];
}

interface KnockoutProbabilities extends MatchProbabilities {
  extraWinHome: number;
  extraDraw: number;
  extraWinAway: number;
  advanceHome: number;
  advanceAway: number;
}

const matchProbabilities = (match: CupMatch): MatchProbabilities => {
  const forcaHome = forcaSelecao(match.homeTeam);
  const forcaAway = forcaSelecao(match.awayTeam);

  const total = forcaHome + forcaAway;
  const shareHome = total > 0 ? forcaHome / total : 0.5;
  const shareAway = 1 - shareHome;

  const lambdaHome = MEDIA_GOLS_COPA * shareHome;
  const lambdaAway = MEDIA_GOLS_COPA * shareAway;
  const matrix = poissonMatrix(lambdaHome, lambdaAway);

  let winHome = 0;
  let draw = 0;
  let winAway = 0;
  matrix.forEach((row, homeGoals) => {
    row.forEach((probability, awayGoals) => {
      if (homeGoals > awayGoals) winHome += probability;
      else if (awayGoals > homeGoals) winAway += probability;
      else draw += probability;
    });
  });

  return {
    shareHome,
    shareAway,
    lambdaHome,
    lambdaAway,
    winHome,
    draw,
    winAway,
    matrix,
  };
};

const knockoutProbabilities = (match: CupMatch): KnockoutProbabilities => {
  const base = matchProbabilities(match);
  const extraMatrix = poissonMatrix(
    base.lambdaHome * 0.3,
    base.lambdaAway * 0.3,
    MAX_GOLS_PRORROGACAO,
    false,
  );

  let extraWinHome = 0;
  let extraDraw = 0;
  let extraWinAway = 0;
  extraMatrix.forEach((row, homeGoals) => {
    row.forEach((probability, awayGoals) => {
      if (homeGoals > awayGoals) extraWinHome += probability;
      else if (awayGoals > homeGoals) extraWinAway += probability;
      else extraDraw += probability;
    });
  });

  const advanceHome = base.winHome + base.draw * (extraWinHome + extraDraw * base.shareHome);
  const advanceAway = base.winAway + base.draw * (extraWinAway + extraDraw * base.shareAway);

  return {
    ...base,
    extraWinHome,
    extraDraw,
    extraWinAway,
    advanceHome,
    advanceAway,
  };
};

const sampleScoreFromMatrix = (matrix: number[][]): { homeGoals: number; awayGoals: number } => {
  const target = Math.random();
  let cumulative = 0;
  for (let homeGoals = 0; homeGoals < matrix.length; homeGoals += 1) {
    for (let awayGoals = 0; awayGoals < matrix[homeGoals].length; awayGoals += 1) {
      cumulative += matrix[homeGoals][awayGoals];
      if (target <= cumulative) return { homeGoals, awayGoals };
    }
  }
  return { homeGoals: matrix.length - 1, awayGoals: matrix[matrix.length - 1].length - 1 };
};

const formatProbability = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    maximumFractionDigits: 0,
  }).format(value);

const randomScoreByStrength = (match: CupMatch): { homeGoals: number; awayGoals: number } => {
  const probabilities = matchProbabilities(match);
  return sampleScoreFromMatrix(probabilities.matrix);
};

// Fase de grupos: empate é resultado válido, então não há pênaltis.
const randomGroupScore = (match: CupMatch): MatchPrediction => ({
  ...randomScoreByStrength(match),
  penaltyWinner: null,
});

// Mata-mata: mesmo fluxo do app Streamlit. Sorteia o tempo normal pela matriz
// Poisson+Dixon-Coles; empate vai para prorrogacao com lambda * 0.3; se persistir,
// os penaltis seguem o share de forca do confronto.
const randomKnockoutScore = (match: CupMatch): MatchPrediction => {
  const probabilities = matchProbabilities(match);
  let { homeGoals, awayGoals } = sampleScoreFromMatrix(probabilities.matrix);
  let penaltyWinner: string | null = null;

  if (homeGoals === awayGoals) {
    homeGoals += samplePoisson(probabilities.lambdaHome * 0.3);
    awayGoals += samplePoisson(probabilities.lambdaAway * 0.3);
    if (homeGoals === awayGoals) {
      penaltyWinner = Math.random() < probabilities.shareHome ? match.homeTeam : match.awayTeam;
    }
  }

  return { homeGoals, awayGoals, penaltyWinner };
};

const randomKnockoutScoreForWinner = (match: CupMatch, team: string): MatchPrediction => {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const prediction = randomKnockoutScore(match);
    if (resolvedWinner(match, prediction) === team) return prediction;
  }

  const prediction = randomKnockoutScore(match);
  const homeWins = team === match.homeTeam;
  if ((prediction.homeGoals ?? 0) === (prediction.awayGoals ?? 0)) {
    return { ...prediction, penaltyWinner: team };
  }
  return {
    homeGoals: homeWins ? Math.max(prediction.homeGoals ?? 0, (prediction.awayGoals ?? 0) + 1) : prediction.homeGoals,
    awayGoals: homeWins ? prediction.awayGoals : Math.max(prediction.awayGoals ?? 0, (prediction.homeGoals ?? 0) + 1),
    penaltyWinner: null,
  };
};

const formatSaveTime = (value: string | null) => {
  if (!value) return 'Rascunho ainda não salvo';
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(value));
};

const downloadJson = (draft: BolaoDraft, allMatches: CupMatch[], champion: string | null) => {
  const payload = {
    participant: draft.participant,
    submittedAt: draft.submittedAt,
    champion,
    fillMetadata: buildFillMetadata(draft.predictionSources),
    predictions: allMatches.map((match) => ({
      matchId: match.id,
      stage: match.stage,
      label: match.label,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      prediction: getPrediction(draft.predictions, match.id),
    })),
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `bolao-previsao-${normalizeSlug(draft.participant.name || 'rascunho')}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

const ChampionFlagBadge: React.FC<{ team: string; compact?: boolean }> = ({ team, compact = false }) => {
  const easterEgg = playerEasterEggFor(team);
  const playerPosition = easterEgg
    ? {
        right: compact ? '-right-5 bottom-0' : '-right-10 bottom-0',
        left: compact ? '-left-5 bottom-0' : '-left-10 bottom-0',
        top: compact ? 'left-1/2 -top-4 -translate-x-1/2' : 'left-1/2 -top-12 -translate-x-1/2',
      }[easterEgg.placement]
    : '';

  if (compact) {
    return (
      <span className="relative h-12 w-12 flex-none" title={easterEgg ? `${team} - ${easterEgg.player}` : team}>
        <span className="absolute left-0 top-1.5 grid h-9 w-12 place-items-center overflow-hidden rounded-md border border-brand-dark/10 bg-white shadow-sm">
          <img src={heroFlagFor(team)} alt={`Bandeira de ${team}`} className="h-full w-full object-cover" loading="lazy" decoding="async" />
        </span>
        {easterEgg && (
          <span className={`absolute ${playerPosition} h-12 w-11`}>
            <img
              src={easterEgg.src}
              alt=""
              aria-hidden="true"
              className="h-full w-full animate-player-pulse object-contain drop-shadow-[0_6px_8px_rgba(0,0,0,0.28)]"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </span>
        )}
      </span>
    );
  }

  return (
    <span className="relative block h-[94px] w-[108px]" title={easterEgg ? `${team} - ${easterEgg.player}` : team}>
      <span className="absolute left-0 top-3 rounded-xl bg-gradient-to-br from-brand-yellow via-white to-brand-green p-[3px] shadow-lg shadow-brand-yellow/20">
        <span className="absolute inset-0 rounded-xl border border-white/70 pointer-events-none" />
        <span className="relative grid h-[72px] w-[108px] place-items-center overflow-hidden rounded-lg border border-brand-dark/10 bg-white shadow-sm">
          <img src={heroFlagFor(team)} alt={`Bandeira de ${team}`} className="h-full w-full object-cover" loading="eager" decoding="async" />
        </span>
      </span>
      {easterEgg && (
        <span className={`absolute ${playerPosition} z-10 h-[94px] w-[78px]`}>
          <img
            src={easterEgg.src}
            alt=""
            aria-hidden="true"
            className="h-full w-full animate-player-pulse object-contain drop-shadow-[0_12px_14px_rgba(0,0,0,0.35)]"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </span>
      )}
    </span>
  );
};

const ScoreInput: React.FC<{
  label: string;
  value: number | null;
  disabled?: boolean;
  onChange: (value: number | null) => void;
}> = ({ label, value, disabled = false, onChange }) => (
  <label className="grid gap-1 text-center">
    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-dark/40">{label}</span>
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={2}
      value={value ?? ''}
      disabled={disabled}
      onChange={(event) => {
        const next = event.target.value.replace(/\D/g, '').slice(0, 2);
        onChange(next === '' ? null : Number(next));
      }}
      className="h-12 w-12 rounded-lg border border-brand-dark/10 bg-white text-center font-montserrat text-2xl font-black text-brand-dark shadow-sm outline-none transition focus:border-brand-green focus:ring-4 focus:ring-brand-green/10 disabled:opacity-50"
      aria-label={label}
    />
  </label>
);

const TeamBadge: React.FC<{ team: string; seed?: string; compact?: boolean }> = ({ team, seed, compact = false }) => (
  <div className={`flex min-w-0 items-center gap-3 ${compact ? '' : 'flex-1'}`}>
    <span
      className="grid h-10 w-10 flex-none place-items-center overflow-hidden rounded-lg border border-brand-dark/10 bg-white"
      style={{ boxShadow: `inset 0 -3px 0 ${teamAccent(team)}33` }}
    >
      <img src={flagFor(team)} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
    </span>
    <span className="min-w-0">
      <strong className="block truncate font-montserrat text-sm font-black uppercase leading-tight text-brand-dark">
        {team}
      </strong>
      {seed && <small className="block text-[10px] font-bold uppercase tracking-[0.12em] text-brand-dark/40">{seed}</small>}
    </span>
  </div>
);

const MatchCard: React.FC<{
  match: CupMatch;
  prediction: MatchPrediction;
  disabled: boolean;
  winnerVerb?: string;
  onScore: (match: CupMatch, side: 'homeGoals' | 'awayGoals', value: number | null) => void;
  onPenalty: (match: CupMatch, team: string) => void;
}> = ({ match, prediction, disabled, winnerVerb = 'avança', onScore, onPenalty }) => {
  const tied = hasScore(prediction) && prediction.homeGoals === prediction.awayGoals;
  const winner = resolvedWinner(match, prediction);
  const needsPenalty = match.stage !== 'groups' && tied;

  return (
    <article className="rounded-lg border border-brand-dark/10 bg-white p-4 shadow-sm transition hover:border-brand-green/30 hover:shadow-md">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-brand-dark/10 pb-3">
        <div>
          <span className="font-montserrat text-[10px] font-black uppercase tracking-[0.18em] text-brand-green">
            {match.label}
          </span>
          {match.date && <p className="mt-1 text-xs font-semibold text-brand-dark/50">{formatDate(match.date)}</p>}
        </div>
        {(match.time || match.venue) && (
          <div className="flex flex-wrap justify-end gap-2 text-[10px] font-bold uppercase tracking-[0.08em] text-brand-dark/40">
            {match.time && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3 text-brand-green" />
                {shortTime(match.time)}
              </span>
            )}
            {match.venue && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3 text-brand-green" />
                {shortVenue(match.venue)}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
        <TeamBadge team={match.homeTeam} seed={match.homeSeed} />
        <div className="grid justify-items-center gap-2">
          <ScoreInput
            label="A"
            value={prediction.homeGoals}
            disabled={disabled}
            onChange={(value) => onScore(match, 'homeGoals', value)}
          />
          <span className="font-montserrat text-xs font-black uppercase text-brand-dark/30">x</span>
          <ScoreInput
            label="B"
            value={prediction.awayGoals}
            disabled={disabled}
            onChange={(value) => onScore(match, 'awayGoals', value)}
          />
        </div>
        <div className="flex justify-end">
          <TeamBadge team={match.awayTeam} seed={match.awaySeed} compact />
        </div>
      </div>

      {match.stage === 'groups' && (
        <div className="mt-4 grid grid-cols-3 overflow-hidden rounded-lg border border-brand-dark/10 text-center text-[10px] font-black uppercase tracking-[0.08em]">
          <span className="bg-brand-green/10 px-2 py-2 text-brand-green">{match.homeProbability}</span>
          <span className="bg-brand-dark/5 px-2 py-2 text-brand-dark/45">{match.drawProbability}</span>
          <span className="bg-brand-blue/10 px-2 py-2 text-brand-blue">{match.awayProbability}</span>
        </div>
      )}

      {needsPenalty && (
        <div className="mt-4 rounded-lg border border-brand-yellow/40 bg-brand-yellow/10 p-3">
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-brand-dark/50">
            Desempate nos pênaltis
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[match.homeTeam, match.awayTeam].map((team) => (
              <button
                key={team}
                type="button"
                disabled={disabled}
                onClick={() => onPenalty(match, team)}
                className={`rounded-lg px-3 py-2 text-xs font-black uppercase transition ${
                  prediction.penaltyWinner === team
                    ? 'bg-brand-green text-white'
                    : 'bg-white text-brand-dark hover:bg-brand-green/10'
                }`}
              >
                {team}
              </button>
            ))}
          </div>
        </div>
      )}

      {winner && (
        <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-green/10 px-3 py-2 text-xs font-black uppercase text-brand-green">
          <CheckCircle2 className="h-4 w-4" />
          {winner} {winnerVerb}
        </div>
      )}
    </article>
  );
};

const StandingsTable: React.FC<{ rows: StandingRow[] }> = ({ rows }) => (
  <div className="overflow-x-auto rounded-lg border border-brand-dark/10 bg-white">
    <table className="w-full min-w-[620px] border-collapse text-left">
      <thead className="bg-brand-dark text-[10px] font-black uppercase tracking-[0.14em] text-white">
        <tr>
          <th className="px-3 py-3">#</th>
          <th className="px-3 py-3">Seleção</th>
          <th className="px-3 py-3 text-center">Pts</th>
          <th className="px-3 py-3 text-center">PJ</th>
          <th className="px-3 py-3 text-center">V</th>
          <th className="px-3 py-3 text-center">E</th>
          <th className="px-3 py-3 text-center">D</th>
          <th className="px-3 py-3 text-center">GP</th>
          <th className="px-3 py-3 text-center">GC</th>
          <th className="px-3 py-3 text-center">SG</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-brand-dark/10">
        {rows.map((row, index) => (
          <tr key={row.team} className={index < 2 ? 'bg-brand-green/5' : index === 2 ? 'bg-brand-yellow/10' : 'bg-white'}>
            <td className="px-3 py-3 text-xs font-black text-brand-dark/45">{index + 1}</td>
            <td className="px-3 py-3">
              <TeamBadge team={row.team} compact />
            </td>
            <td className="px-3 py-3 text-center font-montserrat font-black text-brand-dark">{row.points}</td>
            <td className="px-3 py-3 text-center text-sm font-bold text-brand-dark/55">{row.played}</td>
            <td className="px-3 py-3 text-center text-sm font-bold text-brand-dark/55">{row.wins}</td>
            <td className="px-3 py-3 text-center text-sm font-bold text-brand-dark/55">{row.draws}</td>
            <td className="px-3 py-3 text-center text-sm font-bold text-brand-dark/55">{row.losses}</td>
            <td className="px-3 py-3 text-center text-sm font-bold text-brand-dark/55">{row.goalsFor}</td>
            <td className="px-3 py-3 text-center text-sm font-bold text-brand-dark/55">{row.goalsAgainst}</td>
            <td className="px-3 py-3 text-center text-sm font-bold text-brand-dark/55">{row.goalDifference}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CompactScoreInput: React.FC<{
  label: string;
  value: number | null;
  disabled?: boolean;
  official?: boolean;
  inputKey?: string;
  onChange: (value: number | null) => void;
}> = ({ label, value, disabled = false, official = false, inputKey, onChange }) => (
  <input
    type="text"
    inputMode="numeric"
    pattern="[0-9]*"
    maxLength={2}
    value={value ?? ''}
    disabled={disabled || official}
    data-group-score-input={inputKey}
    onKeyDown={(event) => {
      if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        onChange(null);
      }
    }}
    onChange={(event) => {
      const next = event.target.value.replace(/\D/g, '').slice(-2);
      onChange(next === '' ? null : Number(next));
    }}
    className={`h-8 w-8 rounded-md border text-center font-montserrat text-sm font-black outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/15 sm:h-9 sm:w-9 ${
      official
        ? 'border-brand-green/50 bg-brand-green/10 text-brand-green disabled:opacity-100 cursor-not-allowed'
        : 'border-brand-dark/15 bg-white text-brand-dark disabled:opacity-50'
    }`}
    aria-label={label}
  />
);

const CompactFlag: React.FC<{ team: string; rectangular?: boolean; square?: boolean }> = ({ team, rectangular = false, square = false }) => (
  <span
    className={`grid flex-none place-items-center overflow-hidden rounded-md border border-brand-dark/10 bg-white ${
      square ? 'h-5 w-5' : rectangular ? 'h-4 w-6' : 'h-7 w-7 sm:h-8 sm:w-8'
    }`}
    title={team}
  >
    <img src={flagFor(team)} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
  </span>
);

// Tabela de classificação compacta e discreta (menos destaque que a coluna de jogos).
const CompactStandings: React.FC<{ rows: StandingRow[] }> = ({ rows }) => (
  <div className="min-w-0 rounded-lg border border-brand-dark/10 bg-brand-light/40 p-2.5 sm:p-3">
    <span className="mb-2 block font-montserrat text-[9px] font-black uppercase tracking-[0.16em] text-brand-dark/40">
      Classificação
    </span>
    <table className="w-full table-fixed border-collapse">
      <colgroup>
        <col className="w-[24px]" />
        <col />
        <col className="w-[30px]" />
        <col className="w-[24px]" />
        <col className="w-[24px]" />
        <col className="w-[24px]" />
        <col className="w-[24px]" />
        <col className="w-[26px]" />
        <col className="w-[26px]" />
        <col className="w-[26px]" />
      </colgroup>
      <thead>
        <tr className="text-[8px] font-black uppercase tracking-[0.08em] text-brand-dark/30">
          <th className="pb-1 text-left font-black">#</th>
          <th className="pb-1 text-left font-black">Seleção</th>
          <th className="pb-1 px-0.5 text-center font-black">Pts</th>
          <th className="pb-1 px-0.5 text-center font-black">J</th>
          <th className="pb-1 px-0.5 text-center font-black">V</th>
          <th className="pb-1 px-0.5 text-center font-black">E</th>
          <th className="pb-1 px-0.5 text-center font-black">D</th>
          <th className="pb-1 px-0.5 text-center font-black">GP</th>
          <th className="pb-1 px-0.5 text-center font-black">GC</th>
          <th className="pb-1 pl-0.5 text-center font-black">SG</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={row.team} className="border-t border-brand-dark/5">
            <td className="py-1.5">
              <span
                className={`grid h-4 w-4 place-items-center rounded text-[9px] font-black ${
                  index < 2
                    ? 'bg-brand-green/15 text-brand-green'
                    : index === 2
                    ? 'bg-brand-yellow/25 text-brand-dark/60'
                    : 'bg-brand-dark/5 text-brand-dark/40'
                }`}
              >
                {index + 1}
              </span>
            </td>
            <td className="min-w-0 py-1.5 pr-1">
              <span className="flex min-w-0 items-center gap-1.5">
                <CompactFlag team={row.team} rectangular />
                <span className={`truncate text-[10px] font-bold uppercase ${index < 2 ? 'text-brand-dark' : 'text-brand-dark/55'}`}>
                  {row.team}
                </span>
              </span>
            </td>
            <td className="py-1.5 px-0.5 text-center font-montserrat text-[11px] font-black text-brand-dark">{row.points}</td>
            <td className="py-1.5 px-0.5 text-center text-[10px] font-bold text-brand-dark/50">{row.played}</td>
            <td className="py-1.5 px-0.5 text-center text-[10px] font-bold text-brand-dark/50">{row.wins}</td>
            <td className="py-1.5 px-0.5 text-center text-[10px] font-bold text-brand-dark/50">{row.draws}</td>
            <td className="py-1.5 px-0.5 text-center text-[10px] font-bold text-brand-dark/50">{row.losses}</td>
            <td className="py-1.5 px-0.5 text-center text-[10px] font-bold text-brand-dark/50">{row.goalsFor}</td>
            <td className="py-1.5 px-0.5 text-center text-[10px] font-bold text-brand-dark/50">{row.goalsAgainst}</td>
            <td className="py-1.5 pl-0.5 text-center text-[10px] font-bold text-brand-dark/50">{row.goalDifference}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const KnockoutScoreInput: React.FC<{
  label: string;
  value: number | null;
  disabled?: boolean;
  onChange: (value: number | null) => void;
}> = ({ label, value, disabled = false, onChange }) => (
  <input
    type="text"
    inputMode="numeric"
    pattern="[0-9]*"
    maxLength={2}
    value={value ?? ''}
    disabled={disabled}
    onChange={(event) => {
      const next = event.target.value.replace(/\D/g, '').slice(0, 2);
      onChange(next === '' ? null : Number(next));
    }}
    className="h-[18px] w-5 rounded border border-brand-dark/15 bg-white text-center font-montserrat text-[11px] font-black leading-none text-brand-dark outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/15 disabled:opacity-50"
    aria-label={label}
  />
);

const GroupMatchRow: React.FC<{
  match: CupMatch;
  prediction: MatchPrediction;
  disabled: boolean;
  homeInputKey: string;
  awayInputKey: string;
  onScore: (match: CupMatch, side: 'homeGoals' | 'awayGoals', value: number | null) => void;
}> = ({ match, prediction, disabled, homeInputKey, awayInputKey, onScore }) => {
  const locked = isLockedMatch(match.id);
  return (
    <div
      className={`grid grid-cols-[minmax(0,1fr)_28px_32px_12px_32px_28px_minmax(0,1fr)] items-center gap-1.5 border-t border-brand-dark/8 py-2 first:border-t-0 sm:grid-cols-[minmax(0,1fr)_32px_36px_14px_36px_32px_minmax(0,1fr)] sm:gap-2 ${
        locked ? 'rounded-md bg-brand-green/5' : ''
      }`}
      title={locked ? 'Resultado oficial — jogo já encerrado' : undefined}
    >
      <span className="min-w-0 text-right text-[10px] font-bold uppercase leading-tight text-brand-dark [overflow-wrap:anywhere] sm:text-[11px]">
        {match.homeTeam}
      </span>
      <CompactFlag team={match.homeTeam} />
      <CompactScoreInput
        label={`${match.homeTeam} gols`}
        value={prediction.homeGoals}
        disabled={disabled}
        official={locked}
        inputKey={homeInputKey}
        onChange={(value) => onScore(match, 'homeGoals', value)}
      />
      {locked ? (
        <Lock className="mx-auto h-3 w-3 text-brand-green" aria-label="Resultado oficial" />
      ) : (
        <span className="text-center font-montserrat text-[10px] font-black uppercase text-brand-dark/35">x</span>
      )}
      <CompactScoreInput
        label={`${match.awayTeam} gols`}
        value={prediction.awayGoals}
        disabled={disabled}
        official={locked}
        inputKey={awayInputKey}
        onChange={(value) => onScore(match, 'awayGoals', value)}
      />
      <CompactFlag team={match.awayTeam} />
      <span className="min-w-0 text-left text-[10px] font-bold uppercase leading-tight text-brand-dark [overflow-wrap:anywhere] sm:text-[11px]">
        {match.awayTeam}
      </span>
    </div>
  );
};

const GroupColumn: React.FC<{
  letter: string;
  matches: CupMatch[];
  predictions: Record<string, MatchPrediction>;
  disabled: boolean;
  getInputKey: (match: CupMatch, side: 'homeGoals' | 'awayGoals') => string;
  onScore: (match: CupMatch, side: 'homeGoals' | 'awayGoals', value: number | null) => void;
}> = ({ letter, matches, predictions, disabled, getInputKey, onScore }) => {
  const complete = matches.filter((match) => isResolved(match, predictions[match.id])).length;

  return (
    <section className="min-w-0 rounded-lg border border-brand-dark/10 bg-white px-3 py-3 shadow-sm">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h2 className="font-montserrat text-sm font-black uppercase text-brand-dark">Grupo {letter}</h2>
        <span className="rounded-md bg-brand-light px-2 py-1 font-montserrat text-[10px] font-black text-brand-dark/45">
          {complete}/{matches.length}
        </span>
      </div>

      <div>
        {matches.map((match) => (
          <GroupMatchRow
            key={match.id}
            match={match}
            prediction={getPrediction(predictions, match.id)}
            disabled={disabled}
            homeInputKey={getInputKey(match, 'homeGoals')}
            awayInputKey={getInputKey(match, 'awayGoals')}
            onScore={onScore}
          />
        ))}
      </div>
    </section>
  );
};

const KnockoutTeamRow: React.FC<{
  match: CupMatch;
  team: string;
  seed?: string;
  side: 'homeGoals' | 'awayGoals';
  prediction: MatchPrediction;
  winner: string | null;
  disabled: boolean;
  align: 'left' | 'right';
  advanceProbability?: number | null;
  onScore: (match: CupMatch, side: 'homeGoals' | 'awayGoals', value: number | null) => void;
  onPickWinner: (match: CupMatch, team: string) => void;
}> = ({ match, team, seed, side, prediction, winner, disabled, align, advanceProbability, onScore, onPickWinner }) => {
  const code = teamCode(team);
  const selected = winner === team;
  const probabilityLabel = advanceProbability == null ? null : formatProbability(advanceProbability);
  const displayLabel = probabilityLabel ?? code;
  const teamButton = (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onPickWinner(match, team)}
      title={`${team}${seed ? ` - ${seed}` : ''}`}
      className={`flex min-w-0 items-center gap-1 disabled:cursor-not-allowed transition hover:scale-[1.02] ${
        align === 'right' ? 'flex-row-reverse justify-start text-left' : 'justify-start text-left'
      }`}
    >
      {align === 'right' ? null : <CompactFlag team={team} square />}
      <span className={`min-w-0 truncate font-montserrat text-[9px] font-black uppercase ${probabilityLabel ? 'tabular-nums text-brand-dark/45' : 'text-brand-dark/70'}`}>
        {displayLabel}
      </span>
      {align === 'right' ? <CompactFlag team={team} square /> : null}
      {seed && <small className="sr-only">{seed}</small>}
      <span className="sr-only">{team}</span>
    </button>
  );
  const scoreInput = (
    <KnockoutScoreInput
      label={`${team} gols`}
      value={prediction[side]}
      disabled={disabled}
      onChange={(value) => onScore(match, side, value)}
    />
  );
  return (
    <div
      className={`grid min-w-0 items-center gap-1 rounded-md border px-1 py-0.5 transition-all duration-200 ${
        selected
          ? 'border-brand-green bg-brand-green/15 shadow-sm ring-1 ring-brand-green/20'
          : 'border-brand-dark/10 bg-white hover:border-brand-green/30 hover:bg-brand-green/[0.01]'
      } ${align === 'right' ? 'grid-cols-[20px_minmax(0,1fr)]' : 'grid-cols-[minmax(0,1fr)_20px]'}`}
    >
      {align === 'right' ? (
        <>
          {scoreInput}
          {teamButton}
        </>
      ) : (
        <>
          {teamButton}
          {scoreInput}
        </>
      )}
    </div>
  );
};

const BracketMatchCard: React.FC<{
  match?: CupMatch;
  stage: KnockoutStage;
  slot: number;
  predictions: Record<string, MatchPrediction>;
  disabled: boolean;
  align: 'left' | 'right';
  isFinal?: boolean;
  showProbabilities?: boolean;
  onScore: (match: CupMatch, side: 'homeGoals' | 'awayGoals', value: number | null) => void;
  onPenalty: (match: CupMatch, team: string) => void;
  onPickWinner: (match: CupMatch, team: string) => void;
}> = ({ match, stage, slot, predictions, disabled, align, isFinal = false, showProbabilities = false, onScore, onPenalty, onPickWinner }) => {
  if (!match) {
    return (
      <article className="grid min-h-[58px] place-items-center rounded-lg border border-dashed border-brand-dark/15 bg-white/40 px-2 py-1 text-center transition duration-200 hover:bg-white/60">
        <span className="text-[9px] font-bold uppercase tracking-wider text-brand-dark/30">Aguardando</span>
      </article>
    );
  }

  const prediction = getPrediction(predictions, match.id);
  const tied = hasScore(prediction) && prediction.homeGoals === prediction.awayGoals;
  const winner = resolvedWinner(match, prediction);
  const needsPenalty = tied && match.stage !== 'groups';
  const probabilities = showProbabilities ? knockoutProbabilities(match) : null;

  return (
    <article
      className={`relative rounded-lg border bg-white shadow-sm transition-all duration-300 hover:shadow-md ${
        winner ? 'border-brand-green/45 bg-brand-green/[0.01] hover:border-brand-green/60' : 'border-brand-dark/10 hover:border-brand-green/25'
      } ${isFinal ? 'p-2' : 'p-1'}`}
    >
      <span className="sr-only">
        {stage === 'thirdPlace' || stage === 'final'
          ? stageMeta[stage].title
          : `${stageMeta[stage].title} ${slot + 1}`}
      </span>
      <div className="grid gap-1">
        <KnockoutTeamRow
          match={match}
          team={match.homeTeam}
          seed={match.homeSeed}
          side="homeGoals"
          prediction={prediction}
          winner={winner}
          disabled={disabled}
          align={align}
          advanceProbability={probabilities?.advanceHome ?? null}
          onScore={onScore}
          onPickWinner={onPickWinner}
        />
        <KnockoutTeamRow
          match={match}
          team={match.awayTeam}
          seed={match.awaySeed}
          side="awayGoals"
          prediction={prediction}
          winner={winner}
          disabled={disabled}
          align={align}
          advanceProbability={probabilities?.advanceAway ?? null}
          onScore={onScore}
          onPickWinner={onPickWinner}
        />
      </div>

      {needsPenalty && (
        <div className="mt-2 grid grid-cols-2 gap-1 rounded-md bg-brand-yellow/10 p-1 border border-brand-yellow/20">
          {[match.homeTeam, match.awayTeam].map((team) => (
            <button
              key={team}
              type="button"
              disabled={disabled}
              onClick={() => onPenalty(match, team)}
              className={`truncate rounded-md px-1 py-1 text-[8px] font-black uppercase tracking-wider transition-all duration-200 ${
                prediction.penaltyWinner === team
                  ? 'bg-brand-green text-white shadow-sm'
                  : 'bg-white text-brand-dark/60 hover:text-brand-green hover:bg-brand-green/5'
              }`}
            >
              {teamCode(team)}
            </button>
          ))}
        </div>
      )}
    </article>
  );
};

const BracketRoundColumn: React.FC<{
  stage: KnockoutStage;
  matches: CupMatch[];
  predictions: Record<string, MatchPrediction>;
  disabled: boolean;
  align: 'left' | 'right';
  showProbabilities: boolean;
  onScore: (match: CupMatch, side: 'homeGoals' | 'awayGoals', value: number | null) => void;
  onPenalty: (match: CupMatch, team: string) => void;
  onPickWinner: (match: CupMatch, team: string) => void;
}> = ({ stage, matches, predictions, disabled, align, showProbabilities, onScore, onPenalty, onPickWinner }) => {
  const slots = roundSlots[stage] / 2;
  const completed = matches.filter((match) => isResolved(match, predictions[match.id])).length;

  return (
    <section className="flex flex-col min-w-[96px] h-full rounded-xl border border-brand-dark/10 bg-white/60 p-1.5 shadow-sm relative z-10">
      <div className={`flex items-end justify-between gap-2 mb-2 pb-1.5 border-b border-brand-dark/5 ${align === 'right' ? 'flex-row-reverse text-right' : ''}`}>
        <div>
          <span className="font-montserrat text-[8px] font-black uppercase tracking-[0.14em] text-brand-dark/40">
            {stageMeta[stage].title}
          </span>
          <strong className="block font-montserrat text-xs font-black text-brand-dark leading-none mt-0.5">
            {completed}/{matches.length || slots}
          </strong>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-around gap-2">
        {Array.from({ length: slots }).map((_, index) => {
          const half = roundSlots[stage] / 2;
          const absoluteIndex = align === 'left' ? index : half + index;
          const slotId = `ko-${stage}-${absoluteIndex + 1}`;
          return (
            <div key={index} data-match-card-id={slotId} className="w-full">
              <BracketMatchCard
                match={matches[index]}
                stage={stage}
                slot={index}
                predictions={predictions}
                disabled={disabled}
                align={align}
                showProbabilities={showProbabilities}
                onScore={onScore}
                onPenalty={onPenalty}
                onPickWinner={onPickWinner}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

interface Connection {
  fromId: string;
  toId: string;
  side: 'left' | 'right';
  isBronze?: boolean;
}

const CONNECTIONS: Connection[] = [
  // Left side connections
  { fromId: 'ko-roundOf32-1', toId: 'ko-roundOf16-1', side: 'left' },
  { fromId: 'ko-roundOf32-2', toId: 'ko-roundOf16-1', side: 'left' },
  { fromId: 'ko-roundOf32-3', toId: 'ko-roundOf16-2', side: 'left' },
  { fromId: 'ko-roundOf32-4', toId: 'ko-roundOf16-2', side: 'left' },
  { fromId: 'ko-roundOf32-5', toId: 'ko-roundOf16-3', side: 'left' },
  { fromId: 'ko-roundOf32-6', toId: 'ko-roundOf16-3', side: 'left' },
  { fromId: 'ko-roundOf32-7', toId: 'ko-roundOf16-4', side: 'left' },
  { fromId: 'ko-roundOf32-8', toId: 'ko-roundOf16-4', side: 'left' },

  { fromId: 'ko-roundOf16-1', toId: 'ko-quarterfinals-1', side: 'left' },
  { fromId: 'ko-roundOf16-2', toId: 'ko-quarterfinals-1', side: 'left' },
  { fromId: 'ko-roundOf16-3', toId: 'ko-quarterfinals-2', side: 'left' },
  { fromId: 'ko-roundOf16-4', toId: 'ko-quarterfinals-2', side: 'left' },

  { fromId: 'ko-quarterfinals-1', toId: 'ko-semifinals-1', side: 'left' },
  { fromId: 'ko-quarterfinals-2', toId: 'ko-semifinals-1', side: 'left' },

  { fromId: 'ko-semifinals-1', toId: 'ko-final-1', side: 'left' },
  { fromId: 'ko-semifinals-1', toId: 'ko-thirdPlace-1', side: 'left', isBronze: true },

  // Right side connections
  { fromId: 'ko-roundOf32-9', toId: 'ko-roundOf16-5', side: 'right' },
  { fromId: 'ko-roundOf32-10', toId: 'ko-roundOf16-5', side: 'right' },
  { fromId: 'ko-roundOf32-11', toId: 'ko-roundOf16-6', side: 'right' },
  { fromId: 'ko-roundOf32-12', toId: 'ko-roundOf16-6', side: 'right' },
  { fromId: 'ko-roundOf32-13', toId: 'ko-roundOf16-7', side: 'right' },
  { fromId: 'ko-roundOf32-14', toId: 'ko-roundOf16-7', side: 'right' },
  { fromId: 'ko-roundOf32-15', toId: 'ko-roundOf16-8', side: 'right' },
  { fromId: 'ko-roundOf32-16', toId: 'ko-roundOf16-8', side: 'right' },

  { fromId: 'ko-roundOf16-5', toId: 'ko-quarterfinals-3', side: 'right' },
  { fromId: 'ko-roundOf16-6', toId: 'ko-quarterfinals-3', side: 'right' },
  { fromId: 'ko-roundOf16-7', toId: 'ko-quarterfinals-4', side: 'right' },
  { fromId: 'ko-roundOf16-8', toId: 'ko-quarterfinals-4', side: 'right' },

  { fromId: 'ko-quarterfinals-3', toId: 'ko-semifinals-2', side: 'right' },
  { fromId: 'ko-quarterfinals-4', toId: 'ko-semifinals-2', side: 'right' },

  { fromId: 'ko-semifinals-2', toId: 'ko-final-1', side: 'right' },
  { fromId: 'ko-semifinals-2', toId: 'ko-thirdPlace-1', side: 'right', isBronze: true },
];

const BRACKET_BASE_WIDTH = 1180;
const BRACKET_BASE_HEIGHT = 680;
const BRACKET_MOBILE_MIN_ZOOM = 0.55;
const BRACKET_DESKTOP_MAX_ZOOM = 1.45;
const BRACKET_ZOOM_STEP = 0.15;
const BRACKET_DESKTOP_QUERY = '(min-width: 768px)';

const knockoutMatchIdPrefixes = knockoutStages.map((stage) => `ko-${stage}`);

const isKnockoutMatchId = (matchId: string) =>
  knockoutMatchIdPrefixes.some((prefix) => matchId.startsWith(prefix));

const downstreamMatchIds = (matchId: string) => {
  const visited = new Set<string>();
  const queue = [matchId];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;

    CONNECTIONS.filter((connection) => connection.fromId === current).forEach((connection) => {
      if (visited.has(connection.toId)) return;
      visited.add(connection.toId);
      queue.push(connection.toId);
    });
  }

  return visited;
};

// Final em destaque: standoff horizontal de bandeiras (uma contra a outra),
// um pouco maior que os demais confrontos do chaveamento.
const FinalStandoff: React.FC<{
  match?: CupMatch;
  prediction: MatchPrediction;
  disabled: boolean;
  showProbabilities: boolean;
  onScore: (match: CupMatch, side: 'homeGoals' | 'awayGoals', value: number | null) => void;
  onPenalty: (match: CupMatch, team: string) => void;
  onPickWinner: (match: CupMatch, team: string) => void;
}> = ({ match, prediction, disabled, showProbabilities, onScore, onPenalty, onPickWinner }) => {
  if (!match) {
    return (
      <article className="grid min-h-[64px] place-items-center rounded-xl border border-dashed border-brand-yellow/30 bg-white/40 px-2 py-2 text-center">
        <span className="text-[9px] font-bold uppercase tracking-wider text-brand-dark/30">Aguardando finalistas</span>
      </article>
    );
  }

  const tied = hasScore(prediction) && prediction.homeGoals === prediction.awayGoals;
  const winner = resolvedWinner(match, prediction);
  const probabilities = showProbabilities ? knockoutProbabilities(match) : null;

  const teamButton = (team: string, seed?: string, advanceProbability?: number | null) => {
    const selected = winner === team;
    const probabilityLabel = advanceProbability == null ? null : formatProbability(advanceProbability);
    const displayLabel = probabilityLabel ?? teamCode(team);
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => onPickWinner(match, team)}
        title={`${team}${seed ? ` - ${seed}` : ''}`}
        className={`flex flex-col items-center gap-0.5 rounded-lg border px-1.5 py-1 transition disabled:cursor-not-allowed ${
          selected
            ? 'border-brand-green bg-brand-green/15 ring-1 ring-brand-green/20'
            : 'border-brand-dark/10 bg-white hover:border-brand-green/35 hover:bg-brand-green/[0.01]'
        }`}
      >
        <span className="grid h-8 w-12 place-items-center overflow-hidden rounded border border-brand-dark/10 bg-white">
          <img src={flagFor(team)} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
        </span>
        <span className={`font-montserrat text-[9px] font-black uppercase tracking-wide ${probabilityLabel ? 'tabular-nums text-brand-dark/45' : 'text-brand-dark/80'}`}>
          {displayLabel}
        </span>
      </button>
    );
  };

  const finalScoreInput = (label: string, value: number | null, side: 'homeGoals' | 'awayGoals') => (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={2}
      value={value ?? ''}
      disabled={disabled}
      onChange={(event) => {
        const next = event.target.value.replace(/\D/g, '').slice(0, 2);
        onScore(match, side, next === '' ? null : Number(next));
      }}
      className="h-6 w-6 rounded-md border border-brand-dark/15 bg-white text-center font-montserrat text-xs font-black text-brand-dark outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/15 disabled:opacity-50"
      aria-label={label}
    />
  );

  return (
    <article
      className={`rounded-xl border p-1.5 shadow-sm transition-all duration-300 ${
        winner ? 'border-brand-green/45 bg-brand-green/[0.01] shadow-md' : 'border-brand-yellow/30 bg-white'
      }`}
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1">
        {teamButton(match.homeTeam, match.homeSeed, probabilities?.advanceHome ?? null)}
        <div className="flex items-center gap-0.5">
          {finalScoreInput(`${match.homeTeam} gols`, prediction.homeGoals, 'homeGoals')}
          <span className="font-montserrat text-[10px] font-black uppercase text-brand-dark/30">x</span>
          {finalScoreInput(`${match.awayTeam} gols`, prediction.awayGoals, 'awayGoals')}
        </div>
        {teamButton(match.awayTeam, match.awaySeed, probabilities?.advanceAway ?? null)}
      </div>

      {tied && (
        <div className="mt-1.5 grid grid-cols-2 gap-1 rounded-md border border-brand-yellow/20 bg-brand-yellow/5 p-1">
          {[match.homeTeam, match.awayTeam].map((team) => (
            <button
              key={team}
              type="button"
              disabled={disabled}
              onClick={() => onPenalty(match, team)}
              className={`truncate rounded py-0.5 text-[8px] font-black uppercase tracking-wider transition ${
                prediction.penaltyWinner === team
                  ? 'bg-brand-green text-white shadow-sm'
                  : 'bg-white text-brand-dark/60 hover:bg-brand-green/5 hover:text-brand-green'
              }`}
            >
              {teamCode(team)} (pên)
            </button>
          ))}
        </div>
      )}
    </article>
  );
};

const KnockoutBracket: React.FC<{
  bracket: Partial<Record<KnockoutStage, CupMatch[]>>;
  predictions: Record<string, MatchPrediction>;
  champion: string | null;
  disabled: boolean;
  showProbabilities: boolean;
  onToggleProbabilities: () => void;
  onScore: (match: CupMatch, side: 'homeGoals' | 'awayGoals', value: number | null) => void;
  onPenalty: (match: CupMatch, team: string) => void;
  onPickWinner: (match: CupMatch, team: string) => void;
}> = ({ bracket, predictions, champion, disabled, showProbabilities, onToggleProbabilities, onScore, onPenalty, onPickWinner }) => {
  const leftStages: KnockoutStage[] = ['roundOf32', 'roundOf16', 'quarterfinals', 'semifinals'];
  const rightStages: KnockoutStage[] = ['semifinals', 'quarterfinals', 'roundOf16', 'roundOf32'];
  const [zoom, setZoom] = useState(1);
  const [isDesktopBracket, setIsDesktopBracket] = useState(() =>
    typeof window === 'undefined' ? true : window.matchMedia(BRACKET_DESKTOP_QUERY).matches
  );
  const minZoom = isDesktopBracket ? 1 : BRACKET_MOBILE_MIN_ZOOM;
  const maxZoom = isDesktopBracket ? BRACKET_DESKTOP_MAX_ZOOM : 1;
  const stageMatches = (stage: KnockoutStage, side: 'left' | 'right') => {
    const matches = bracket[stage] ?? [];
    const half = Math.ceil(roundSlots[stage] / 2);
    return side === 'left' ? matches.slice(0, half) : matches.slice(half);
  };
  const finalMatch = bracket.final?.[0];

  const parentRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Record<string, { leftX: number; rightX: number; y: number }>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(BRACKET_DESKTOP_QUERY);
    const syncDesktopState = () => setIsDesktopBracket(mediaQuery.matches);

    syncDesktopState();
    mediaQuery.addEventListener('change', syncDesktopState);
    return () => mediaQuery.removeEventListener('change', syncDesktopState);
  }, []);

  useEffect(() => {
    setZoom((current) => Math.min(maxZoom, Math.max(minZoom, current)));
  }, [maxZoom, minZoom]);

  useLayoutEffect(() => {
    const measure = () => {
      if (!parentRef.current) return;
      const parentRect = parentRef.current.getBoundingClientRect();
      const pos: Record<string, { leftX: number; rightX: number; y: number }> = {};
      const cards = parentRef.current.querySelectorAll('[data-match-card-id]');
      
      cards.forEach((el) => {
        const id = el.getAttribute('data-match-card-id');
        if (id) {
          const rect = el.getBoundingClientRect();
          pos[id] = {
            leftX: (rect.left - parentRect.left) / zoom,
            rightX: (rect.right - parentRect.left) / zoom,
            y: (rect.top - parentRect.top + rect.height / 2) / zoom,
          };
        }
      });

      setPositions((prev) => {
        const keys1 = Object.keys(prev);
        const keys2 = Object.keys(pos);
        if (keys1.length !== keys2.length) return pos;
        const hasChanged = keys2.some(
          (k) =>
            !prev[k] ||
            Math.abs(prev[k].leftX - pos[k].leftX) > 0.5 ||
            Math.abs(prev[k].rightX - pos[k].rightX) > 0.5 ||
            Math.abs(prev[k].y - pos[k].y) > 0.5
        );
        return hasChanged ? pos : prev;
      });
    };

    measure();
    
    const observer = new ResizeObserver(measure);
    if (parentRef.current) {
      observer.observe(parentRef.current);
    }
    window.addEventListener('resize', measure);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [bracket, predictions, zoom, showProbabilities]);

  const changeZoom = (direction: -1 | 1) => {
    setZoom((current) => {
      const next = current + direction * BRACKET_ZOOM_STEP;
      return Math.min(maxZoom, Math.max(minZoom, Number(next.toFixed(2))));
    });
  };
  // Desktop sem zoom: deixa o bracket crescer livremente (min-height em vez de altura
  // fixa). Assim, quando os painéis de pênalti abrem e empurram um card para baixo, o
  // canvas inteiro cresce, o viewport (altura auto) acompanha e nada fica cortado — sem
  // o scroll vertical de 1-2px da altura fixa. Os conectores SVG são remedidos do DOM,
  // então se realinham sozinhos. Com zoom > 1 mantém a altura limitada + scroll.
  const growBracketVertically = isDesktopBracket && zoom === 1;
  const viewportHeight = isDesktopBracket
    ? zoom === 1
      ? 'auto'
      : `min(${BRACKET_BASE_HEIGHT}px, 72vh)`
    : zoom === 1
      ? BRACKET_BASE_HEIGHT
      : Math.ceil(BRACKET_BASE_HEIGHT * zoom);
  const bracketViewportClassName = isDesktopBracket
    ? zoom === 1
      ? 'relative mt-2 min-w-0 max-w-full overflow-x-auto overflow-y-hidden overscroll-x-contain rounded-lg'
      : 'relative mt-2 min-w-0 max-w-full overflow-auto overscroll-contain rounded-lg'
    : 'relative mt-2 min-w-0 max-w-full overflow-x-auto overflow-y-hidden overscroll-x-contain rounded-lg';
  const bracketViewportStyle: React.CSSProperties = isDesktopBracket
    ? { height: viewportHeight, touchAction: 'pan-x pan-y' }
    : { touchAction: 'pan-x pan-y' };

  const getMatchWinner = (matchId: string) => {
    let match: CupMatch | undefined;
    for (const stage of Object.keys(bracket) as KnockoutStage[]) {
      const found = bracket[stage]?.find((m) => m?.id === matchId);
      if (found) {
        match = found;
        break;
      }
    }
    if (!match) return null;
    const prediction = predictions[matchId];
    return resolvedWinner(match, prediction);
  };

  const isPathActive = (fromId: string, toId: string) => {
    const fromWinner = getMatchWinner(fromId);
    if (!fromWinner) return false;
    // Só acende quando a seleção que saiu do confronto-filho também venceu o
    // confronto-pai: traça o caminho contínuo de quem está avançando e para
    // exatamente onde o time foi eliminado.
    return getMatchWinner(toId) === fromWinner;
  };

  const isBronzePathActive = (fromId: string, toId: string) => {
    let match: CupMatch | undefined;
    for (const stage of Object.keys(bracket) as KnockoutStage[]) {
      const found = bracket[stage]?.find((m) => m?.id === fromId);
      if (found) {
        match = found;
        break;
      }
    }
    if (!match) return false;
    const prediction = predictions[fromId];
    if (!hasScore(prediction)) return false;
    const winner = resolvedWinner(match, prediction);
    if (!winner) return false;
    const loser = winner === match.homeTeam ? match.awayTeam : match.homeTeam;
    return getMatchWinner(toId) === loser;
  };

  const renderConnection = (conn: Connection, idx: number) => {
    const fromPos = positions[conn.fromId];
    const toPos = positions[conn.toId];
    if (!fromPos || !toPos) return null;

    const xStart = conn.side === 'left' ? fromPos.rightX : fromPos.leftX;
    const yStart = fromPos.y;
    const xEnd = conn.side === 'left' ? toPos.leftX : toPos.rightX;
    
    // Force straight horizontal lines from Semifinals to Final by setting yEnd = yStart
    const isToFinal = conn.toId === 'ko-final-1';
    const yEnd = isToFinal ? yStart : toPos.y;

    let xMid = (xStart + xEnd) / 2;
    if (conn.isBronze && positions['ko-final-1']) {
      const finalPos = positions['ko-final-1'];
      if (conn.side === 'left') {
        xMid = (xStart + finalPos.leftX) / 2;
      } else {
        xMid = (finalPos.rightX + xStart) / 2;
      }
    }
    const active = conn.isBronze 
      ? isBronzePathActive(conn.fromId, conn.toId) 
      : isPathActive(conn.fromId, conn.toId);
    
    const pathData = yStart === yEnd 
      ? `M ${xStart} ${yStart} L ${xEnd} ${yEnd}`
      : `M ${xStart} ${yStart} L ${xMid} ${yStart} L ${xMid} ${yEnd} L ${xEnd} ${yEnd}`;

    let strokeColor = '#2E2E2E';
    let strokeWidth = 1.5;
    let strokeOpacity = 0.12;

    if (conn.isBronze) {
      strokeColor = '#209927'; // green as requested
      strokeWidth = active ? 1.0 : 0.6; // much thinner
      strokeOpacity = active ? 0.75 : 0.15; // very subtle when inactive
    } else {
      strokeColor = active ? '#209927' : '#2E2E2E';
      strokeWidth = active ? 2.5 : 1.5;
      strokeOpacity = active ? 1 : 0.12;
    }

    return (
      <path
        key={`${conn.fromId}-${conn.toId}-${idx}`}
        d={pathData}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeOpacity={strokeOpacity}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-350 ease-in-out"
        style={{
          filter: active && !conn.isBronze 
            ? 'drop-shadow(0px 0px 3px rgba(32, 153, 39, 0.4))' 
            : active && conn.isBronze 
              ? 'drop-shadow(0px 0px 2px rgba(32, 153, 39, 0.25))' 
              : 'none'
        }}
      />
    );
  };

  return (
    <div className="min-w-0 max-w-full">
      <div className="mb-2 flex flex-wrap items-center justify-end gap-1">
        <button
          type="button"
          onClick={onToggleProbabilities}
          className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-md border px-2.5 font-montserrat text-[10px] font-black uppercase tracking-[0.08em] transition ${
            showProbabilities
              ? 'border-brand-dark/20 bg-brand-dark/5 text-brand-dark/60'
              : 'border-brand-dark/10 bg-white text-brand-dark/50 hover:border-brand-green/35 hover:text-brand-green'
          }`}
          aria-pressed={showProbabilities}
          aria-label={showProbabilities ? 'Ocultar probabilidades do mata-mata' : 'Incluir probabilidades no mata-mata'}
          title={showProbabilities ? 'Ocultar probabilidades' : 'Incluir probabilidades'}
        >
          <Percent className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Probabilidades</span>
        </button>
        <button
          type="button"
          onClick={() => changeZoom(-1)}
          disabled={zoom <= minZoom}
          className="grid h-8 w-8 place-items-center rounded-md border border-brand-dark/10 bg-white text-brand-dark/60 transition hover:border-brand-green/40 hover:text-brand-green disabled:opacity-40"
          aria-label="Diminuir zoom do mata-mata"
          title="Diminuir zoom"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <span className="min-w-[3.5rem] rounded-md bg-white px-2 py-1 text-center font-montserrat text-[10px] font-black text-brand-dark/50">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={() => changeZoom(1)}
          disabled={zoom >= maxZoom}
          className="grid h-8 w-8 place-items-center rounded-md border border-brand-dark/10 bg-white text-brand-dark/60 transition hover:border-brand-green/40 hover:text-brand-green disabled:opacity-40"
          aria-label="Aumentar zoom do mata-mata"
          title="Aumentar zoom"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoom(1)}
          disabled={zoom === 1}
          className="grid h-8 w-8 place-items-center rounded-md border border-brand-dark/10 bg-white text-brand-dark/60 transition hover:border-brand-green/40 hover:text-brand-green disabled:opacity-40"
          aria-label="Restaurar zoom do mata-mata"
          title="Restaurar zoom"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      <div
        className={bracketViewportClassName}
        style={bracketViewportStyle}
      >
        <div
          className="relative"
          style={{
            width: `${zoom * 100}%`,
            minWidth: BRACKET_BASE_WIDTH * zoom,
            ...(growBracketVertically
              ? { minHeight: BRACKET_BASE_HEIGHT * zoom }
              : { height: BRACKET_BASE_HEIGHT * zoom }),
          }}
        >
          <div
            ref={parentRef}
            className={`relative ${growBracketVertically ? 'min-h-[680px]' : 'h-[680px]'} origin-top-left px-2`}
            style={{
              width: `${100 / zoom}%`,
              minWidth: BRACKET_BASE_WIDTH,
              transform: `scale(${zoom})`,
            }}
          >
        {/* SVG Conectores no fundo */}
        <svg className="absolute inset-0 pointer-events-none w-full h-full z-0">
          {CONNECTIONS.map((conn, idx) => renderConnection(conn, idx))}
        </svg>

        {/* Chave de Colunas */}
        <div className={`grid grid-cols-[repeat(4,minmax(105px,1fr))_minmax(220px,1.5fr)_repeat(4,minmax(105px,1fr))] items-stretch gap-x-3 ${growBracketVertically ? 'min-h-[680px]' : 'h-full'} relative z-10`}>
          {leftStages.map((stage) => (
            <BracketRoundColumn
              key={`left-${stage}`}
              stage={stage}
              matches={stageMatches(stage, 'left')}
              predictions={predictions}
              disabled={disabled}
              align="left"
              showProbabilities={showProbabilities}
              onScore={onScore}
              onPenalty={onPenalty}
              onPickWinner={onPickWinner}
            />
          ))}

          {/* Coluna Central: Campeão, Final e 3º Lugar */}
          {/* Coluna Central: Campeão, Final e 3º Lugar */}
          <section className="flex flex-col min-w-[220px] h-full p-1.5 relative z-10">
            {/* Header spacer to match the height and spacing of BracketRoundColumn headers */}
            <div className="h-[22px] mb-2 pb-1.5 border-b border-transparent" />
            
            {/* Cards container: flex-1 grid-rows-3 to guarantee perfect centering of the middle row */}
            <div className="flex-1 grid grid-rows-3 py-1">
              
              {/* Linha 1 (Topo): Destaque do Campeão */}
              <div className="flex items-center justify-center w-full">
                <div className={`w-full flex flex-col items-center p-4 rounded-2xl border shadow-md relative overflow-hidden transition-all duration-300 ${
                  champion 
                    ? 'border-brand-yellow/40 bg-white ring-1 ring-brand-yellow/20 shadow-xl shadow-brand-yellow/10 scale-[1.02]' 
                    : 'border-brand-dark/10 bg-white/90'
                } hover:border-brand-green/30 hover:shadow-lg`}>
                  {champion && (
                    <div className="absolute -inset-10 bg-gradient-to-tr from-brand-yellow/10 via-transparent to-brand-green/10 opacity-40 pointer-events-none" />
                  )}
                  
                  <div className="flex flex-col items-center text-center relative z-10 w-full">
                    <span className="flex items-center gap-1.5 font-montserrat text-[10px] font-black uppercase tracking-[0.16em] text-brand-green">
                      <Trophy className={`h-5 w-5 ${champion ? 'text-brand-yellow animate-bounce' : 'text-brand-dark/30'}`} />
                      Campeão
                    </span>
                    
                    {champion ? (
                      <div className="mt-3 flex flex-col items-center w-full">
                        <ChampionFlagBadge team={champion} />
                        <strong className="mt-3 block font-montserrat text-sm font-black text-brand-dark uppercase tracking-wider truncate max-w-full">
                          {champion}
                        </strong>
                      </div>
                    ) : (
                      <div className="mt-3 flex flex-col items-center opacity-40">
                        <div className="grid h-14 w-14 place-items-center rounded-full border-2 border-dashed border-brand-dark/30 bg-brand-light">
                          <Trophy className="h-7 w-7 text-brand-dark/40" />
                        </div>
                        <span className="mt-2 block font-montserrat text-[9px] font-bold text-brand-dark/65 uppercase tracking-wider">
                          Em Aberto
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Linha 2 (Centro): Card da Grande Final — standoff horizontal */}
              <div className="flex flex-col items-center justify-center w-full">
                <div className="text-center mb-1">
                  <span className="font-montserrat text-[9px] font-black uppercase tracking-[0.16em] text-brand-yellow">
                    Grande Final
                  </span>
                </div>
                <div data-match-card-id="ko-final-1" className="w-full">
                  <FinalStandoff
                    match={finalMatch}
                    prediction={finalMatch ? predictions[finalMatch.id] ?? emptyPrediction() : emptyPrediction()}
                    disabled={disabled}
                    showProbabilities={showProbabilities}
                    onScore={onScore}
                    onPenalty={onPenalty}
                    onPickWinner={onPickWinner}
                  />
                </div>
              </div>

              {/* Linha 3 (Base): Card da Disputa de 3º Lugar */}
              <div className="flex flex-col items-center justify-center w-full">
                <div className="text-center mb-1">
                  <span className="font-montserrat text-[9px] font-black uppercase tracking-[0.16em] text-brand-dark/40">
                    Disputa de 3º Lugar
                  </span>
                </div>
                <div data-match-card-id="ko-thirdPlace-1" className="w-[140px]">
                  <BracketMatchCard
                    match={bracket.thirdPlace?.[0]}
                    stage="thirdPlace"
                    slot={0}
                    predictions={predictions}
                    disabled={disabled}
                    align="left"
                    showProbabilities={showProbabilities}
                    onScore={onScore}
                    onPenalty={onPenalty}
                    onPickWinner={onPickWinner}
                  />
                </div>
              </div>

            </div>
          </section>

          {rightStages.map((stage) => (
            <BracketRoundColumn
              key={`right-${stage}`}
              stage={stage}
              matches={stageMatches(stage, 'right')}
              predictions={predictions}
              disabled={disabled}
              align="right"
              showProbabilities={showProbabilities}
              onScore={onScore}
              onPenalty={onPenalty}
              onPickWinner={onPickWinner}
            />
          ))}
        </div>
          </div>
      </div>
    </div>
    </div>
  );
};

// Cabeçalho padrão das subseções (primeira fase, segunda fase, envio).
// Quando `disabled`, fica em cinza "desativado" mostrando que a etapa abre depois.
const SectionHeader: React.FC<{
  eyebrow: string;
  title: string;
  disabled?: boolean;
  hint?: string;
  children?: React.ReactNode;
}> = ({ eyebrow, title, disabled = false, hint, children }) => (
  <div className={`rounded-lg border border-brand-dark/10 bg-white p-4 shadow-sm ${disabled ? 'opacity-60' : ''}`}>
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <span
          className={`font-montserrat text-[10px] font-black uppercase tracking-[0.18em] ${
            disabled ? 'text-brand-dark/35' : 'text-brand-green'
          }`}
        >
          {eyebrow}
        </span>
        <h2 className={`mt-1 text-3xl font-black ${disabled ? 'text-brand-dark/40' : 'text-brand-dark'}`}>{title}</h2>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {disabled ? (
          <span className="inline-flex items-center gap-1 rounded-lg bg-brand-light px-3 py-2 text-xs font-black uppercase text-brand-dark/40">
            <Lock className="h-3 w-3" />
            Bloqueado
          </span>
        ) : (
          children
        )}
      </div>
    </div>
    {disabled && hint && (
      <p className="mt-3 rounded-lg bg-brand-light p-3 text-sm font-semibold leading-relaxed text-brand-dark/45">{hint}</p>
    )}
  </div>
);

// Contador de progresso reutilizável (jogos preenchidos / total da etapa).
const ProgressPill: React.FC<{ label: string; done: number; total: number }> = ({ label, done, total }) => (
  <div className="flex flex-none items-center gap-3 rounded-md border border-brand-dark/10 bg-brand-light/60 px-3 py-2">
    <div className="flex flex-col leading-none">
      <span className="text-[9px] font-black uppercase tracking-[0.14em] text-brand-dark/40">{label}</span>
      <strong className={`mt-0.5 font-montserrat text-lg font-black leading-none ${done === total ? 'text-brand-dark/65' : 'text-brand-dark/40'}`}>
        {done}
        <span className="text-brand-dark/65">/{total}</span>
      </strong>
    </div>
    <span className="h-2 w-24 overflow-hidden rounded-full bg-brand-dark/20">
      <span
        className="block h-full rounded-full bg-brand-green transition-all"
        style={{ width: `${total ? Math.min(100, (done / total) * 100) : 0}%` }}
      />
    </span>
  </div>
);

const BolaoPage: React.FC = () => {
  const [draft, setDraft] = useState<BolaoDraft>(() => {
    const base = typeof window === 'undefined'
      ? createInitialDraft()
      : localBolaoRepository.loadDraft() ?? createInitialDraft();
    // Jogos já encerrados entram travados com o placar oficial, mesmo em rascunhos antigos.
    return {
      ...base,
      predictions: withOfficialResults(base.predictions),
      predictionSources: withOfficialSources(base.predictionSources),
    };
  });
  const [selectedGroup, setSelectedGroup] = useState('A');
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [modalState, setModalState] = useState<'none' | 'sending' | 'success' | 'error'>('none');
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [legalModal, setLegalModal] = useState<{ open: boolean; tab: LegalTab }>({ open: false, tab: 'terms' });
  const [showKnockoutProbabilities, setShowKnockoutProbabilities] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);
  const [cardPng, setCardPng] = useState<string | null>(null);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [cardError, setCardError] = useState(false);
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const prevKnockoutRef = useRef<boolean | null>(null);
  const cardPopupSeenRef = useRef(false);
  const lastGenHtmlRef = useRef('');

  const openLegal = (tab: LegalTab) => setLegalModal({ open: true, tab });

  useEffect(() => {
    localBolaoRepository.saveDraft({ ...draft, lastSavedAt: new Date().toISOString() });
  }, [draft]);

  const standings = useMemo(() => calculateAllStandings(draft.predictions), [draft.predictions]);
  const selectedGroupIndex = Math.max(0, GROUP_ORDER.indexOf(selectedGroup));
  const previousGroup = GROUP_ORDER[(selectedGroupIndex - 1 + GROUP_ORDER.length) % GROUP_ORDER.length];
  const nextGroup = GROUP_ORDER[(selectedGroupIndex + 1) % GROUP_ORDER.length];
  const groupMatches = groupMatchesByLetter[selectedGroup] ?? [];
  const selectedStandings = standings[selectedGroup] ?? [];
  const groupsComplete = GROUP_MATCHES.every((match) => isResolved(match, draft.predictions[match.id]));
  const qualifiers = useMemo(() => (groupsComplete ? calculateQualifiers(standings) : []), [groupsComplete, standings]);
  const bracket = useMemo(() => buildBracket(standings, draft.predictions), [standings, draft.predictions]);
  const bracketMatches = useMemo(() => Object.values(bracket).flat(), [bracket]);
  const allVisibleMatches = useMemo(() => [...GROUP_MATCHES, ...bracketMatches], [bracketMatches]);
  const completedMatches = allVisibleMatches.filter((match) => isResolved(match, draft.predictions[match.id])).length;
  const groupCompleted = GROUP_MATCHES.filter((match) => isResolved(match, draft.predictions[match.id])).length;
  const finalMatch = bracket.final?.[0] ?? null;
  const thirdPlaceMatch = bracket.thirdPlace?.[0] ?? null;
  const champion = finalMatch ? resolvedWinner(finalMatch, draft.predictions[finalMatch.id]) : null;
  const isSubmitted = draft.submittedAt !== null;

  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const nameValid = draft.participant.name.trim().length >= 2;
  const emailValid = isEmailValid(draft.participant.email.trim());
  const researchQuestionsValid =
    Boolean(draft.participant.expertiseLevel) &&
    Boolean(draft.participant.footballFollowFrequency);
  const nameError = nameTouched && !nameValid;
  const emailError = emailTouched && !emailValid;

  const canSubmit =
    completedMatches === TOTAL_MATCHES &&
    champion !== null &&
    nameValid &&
    emailValid &&
    researchQuestionsValid &&
    acceptedTerms;

  // Fases empilhadas sequencialmente: o mata-mata só renderiza quando os grupos
  // estão completos e o bilhete quando o mata-mata (campeão) está definido e todos os jogos preenchidos.
  const knockoutComplete = champion !== null && completedMatches === TOTAL_MATCHES;
  const groupsRef = useRef<HTMLElement>(null);

  // ----- Card compartilhável (baixar minha simulação) -----
  const shareCardData = useMemo<ShareCardData | null>(() => {
    if (!knockoutComplete || !finalMatch || !champion) return null;
    const isoFor = (team: string) => FLAGCDN_CODE_OVERRIDES[normalizedTeamName(team)] ?? 'un';
    const matchN = (id: string) => Number(id.match(/-(\d+)$/)?.[1] ?? 0);
    const sortByN = (arr: CupMatch[]) => [...arr].sort((a, b) => matchN(a.id) - matchN(b.id));
    const toSc = (m: CupMatch): SCMatch => ({
      home: m.homeTeam,
      away: m.awayTeam,
      homeIso: isoFor(m.homeTeam),
      awayIso: isoFor(m.awayTeam),
      winner: resolvedWinner(m, getPrediction(draft.predictions, m.id)),
    });
    const finalPred = getPrediction(draft.predictions, finalMatch.id);
    const champIsHome = champion === finalMatch.homeTeam;
    const g = (v: number | null) => (v == null ? '' : String(v));
    const finalScore: [string, string] = champIsHome
      ? [g(finalPred.homeGoals), g(finalPred.awayGoals)]
      : [g(finalPred.awayGoals), g(finalPred.homeGoals)];
    let third: ShareCardData['third'] = null;
    if (thirdPlaceMatch) {
      const tw = resolvedWinner(thirdPlaceMatch, getPrediction(draft.predictions, thirdPlaceMatch.id));
      if (tw) {
        const tl = tw === thirdPlaceMatch.homeTeam ? thirdPlaceMatch.awayTeam : thirdPlaceMatch.homeTeam;
        third = { winner: tw, winnerIso: isoFor(tw), loser: tl, loserIso: isoFor(tl) };
      }
    }
    return {
      roundOf32: sortByN(bracket.roundOf32 ?? []).map(toSc),
      roundOf16: sortByN(bracket.roundOf16 ?? []).map(toSc),
      quarterfinals: sortByN(bracket.quarterfinals ?? []).map(toSc),
      semifinals: sortByN(bracket.semifinals ?? []).map(toSc),
      final: toSc(finalMatch),
      finalScore,
      third,
      champion,
      championIso: isoFor(champion),
      participantName: draft.participant.name,
    };
  }, [knockoutComplete, bracket, draft.predictions, draft.participant.name, champion, finalMatch, thirdPlaceMatch]);

  const shareCardHtml = useMemo(() => (shareCardData ? buildShareCardInnerHTML(shareCardData) : ''), [shareCardData]);

  // Gera o PNG do card (sem baixar). Mostrado no popup e na coluna do card.
  const generateCard = async () => {
    if (!shareCardRef.current) return;
    setIsGeneratingCard(true);
    setCardError(false);
    try {
      const fonts = (document as { fonts?: { ready?: Promise<unknown> } }).fonts;
      if (fonts?.ready) { try { await fonts.ready; } catch { /* ignore */ } }
      const fontEmbedCSS = await getMontserratEmbedCSS();
      // pixelRatio 1 = 1122x1402 nativo (4:5, tamanho da arte)
      const opts = { width: CARD_W, height: CARD_H, pixelRatio: 1, backgroundColor: '#ffffff', fontEmbedCSS, skipFonts: !fontEmbedCSS };
      const dataUrl = await toPng(shareCardRef.current, opts);
      setCardPng(dataUrl);
    } catch (err) {
      console.error('Erro ao gerar o card da simulação:', err);
      setCardError(true);
    } finally {
      setIsGeneratingCard(false);
    }
  };

  // Baixa o card já gerado.
  const downloadCard = () => {
    if (!cardPng) return;
    const link = document.createElement('a');
    link.download = `minha-simulacao-${normalizeSlug(draft.participant.name || 'copa-2026')}.png`;
    link.href = cardPng;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Ao concluir o mata-mata (transição), abre o popup do card uma vez por sessão.
  useEffect(() => {
    const prev = prevKnockoutRef.current;
    prevKnockoutRef.current = knockoutComplete;
    if (prev === null) return; // 1º render: não abre popup mesmo se já estava completo
    if (knockoutComplete && !prev && !cardPopupSeenRef.current) {
      setCardModalOpen(true);
      cardPopupSeenRef.current = true;
    }
  }, [knockoutComplete]);

  // Gera/atualiza o card sempre que o chaveamento muda (estando completo).
  useEffect(() => {
    if (!knockoutComplete || !shareCardHtml || isGeneratingCard) return;
    if (shareCardHtml === lastGenHtmlRef.current) return;
    lastGenHtmlRef.current = shareCardHtml;
    void generateCard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [knockoutComplete, shareCardHtml, isGeneratingCard]);

  const updateDraft = (updater: (draft: BolaoDraft) => BolaoDraft) => {
    setDraft((current) => ({ ...updater(current), lastSavedAt: new Date().toISOString() }));
  };

  const updateParticipant = (patch: Partial<Participant>) => {
    updateDraft((current) => ({
      ...current,
      participant: {
        ...current.participant,
        ...patch,
      },
    }));
  };

  const groupScoreInputKey = (match: CupMatch, side: 'homeGoals' | 'awayGoals') => `${match.id}-${side}`;

  const focusGroupScoreInput = (inputKey: string) => {
    if (typeof window === 'undefined') return;
    window.setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>(`[data-group-score-input="${inputKey}"]`);
      input?.focus();
      input?.select();
    }, 0);
  };

  const firstGroupScoreInputKey = (letter: string) => {
    const matches = groupMatchesByLetter[letter] ?? [];
    for (const match of matches) {
      const prediction = getPrediction(draft.predictions, match.id);
      if (prediction.homeGoals === null) return groupScoreInputKey(match, 'homeGoals');
      if (prediction.awayGoals === null) return groupScoreInputKey(match, 'awayGoals');
    }
    const firstMatch = matches[0];
    return firstMatch ? groupScoreInputKey(firstMatch, 'homeGoals') : null;
  };

  useEffect(() => {
    if (isSubmitted) return;
    const inputKey = firstGroupScoreInputKey(selectedGroup);
    if (inputKey) focusGroupScoreInput(inputKey);
  }, [selectedGroup, isSubmitted]);

  const removeOrphanPredictionSources = (
    sources: Record<string, PredictionSource>,
    predictions: Record<string, MatchPrediction>,
  ) => {
    const next = { ...sources };
    Object.keys(next).forEach((matchId) => {
      if (!predictions[matchId]) delete next[matchId];
    });
    return next;
  };

  const clearKnockoutPredictions = (predictions: Record<string, MatchPrediction>) => {
    const next = { ...predictions };
    Object.keys(next).forEach((matchId) => {
      if (isKnockoutMatchId(matchId)) delete next[matchId];
    });
    return next;
  };

  const resetDownstream = (predictions: Record<string, MatchPrediction>, match: CupMatch) => {
    if (match.stage === 'groups') return clearKnockoutPredictions(predictions);

    const next = { ...predictions };
    downstreamMatchIds(match.id).forEach((matchId) => {
      delete next[matchId];
    });
    return next;
  };

  const setScore = (match: CupMatch, side: 'homeGoals' | 'awayGoals', value: number | null) => {
    if (isSubmitted || isLockedMatch(match.id)) return;
    updateDraft((current) => {
      const predictions = resetDownstream(current.predictions, match);
      let predictionSources = removeOrphanPredictionSources(current.predictionSources, predictions);
      const currentPrediction = predictions[match.id] ?? emptyPrediction();
      const nextPrediction = {
        ...currentPrediction,
        [side]: value,
        penaltyWinner: null,
      };
      predictions[match.id] = nextPrediction;
      if (nextPrediction.homeGoals === null && nextPrediction.awayGoals === null) {
        delete predictionSources[match.id];
      } else {
        predictionSources[match.id] = 'manual';
      }
      return { ...current, predictions, predictionSources };
    });
  };

  const advanceGroupScoreFocus = (match: CupMatch, side: 'homeGoals' | 'awayGoals') => {
    const group = groupLetter(match.group ?? '');
    if (!group) return;

    const matches = groupMatchesByLetter[group] ?? [];
    const currentMatchIndex = matches.findIndex((candidate) => candidate.id === match.id);
    if (currentMatchIndex === -1) return;

    const inputKeys = matches.flatMap((candidate) => [
      groupScoreInputKey(candidate, 'homeGoals'),
      groupScoreInputKey(candidate, 'awayGoals'),
    ]);
    const currentInputIndex = currentMatchIndex * 2 + (side === 'homeGoals' ? 0 : 1);
    const nextInputKey = inputKeys[currentInputIndex + 1];

    if (nextInputKey) {
      focusGroupScoreInput(nextInputKey);
      return;
    }

    const nextGroupIndex = GROUP_ORDER.indexOf(group) + 1;
    const nextGroupLetter = GROUP_ORDER[nextGroupIndex];
    if (nextGroupLetter) {
      setSelectedGroup(nextGroupLetter);
    }
  };

  const setGroupScore = (match: CupMatch, side: 'homeGoals' | 'awayGoals', value: number | null) => {
    setScore(match, side, value);
    if (value !== null) {
      advanceGroupScoreFocus(match, side);
    }
  };

  const setPenalty = (match: CupMatch, team: string) => {
    if (isSubmitted || isLockedMatch(match.id)) return;
    updateDraft((current) => {
      const predictions = resetDownstream(current.predictions, match);
      const predictionSources = removeOrphanPredictionSources(current.predictionSources, predictions);
      predictions[match.id] = {
        ...(predictions[match.id] ?? emptyPrediction()),
        penaltyWinner: team,
      };
      predictionSources[match.id] = 'manual';
      return { ...current, predictions, predictionSources };
    });
  };

  const setKnockoutWinner = (match: CupMatch, team: string) => {
    if (isSubmitted || match.stage === 'groups') return;
    updateDraft((current) => {
      const predictions = resetDownstream(current.predictions, match);
      const predictionSources = removeOrphanPredictionSources(current.predictionSources, predictions);
      predictions[match.id] = randomKnockoutScoreForWinner(match, team);
      predictionSources[match.id] = 'manual';
      return { ...current, predictions, predictionSources };
    });
  };

  // Preenche aleatoriamente a próxima etapa disponível do mata-mata (uma por clique):
  // 16-avos → oitavas → ... → final, conforme as rodadas vão sendo liberadas.
  const fillNextKnockoutRound = () => {
    if (isSubmitted || !groupsComplete) return;
    const stage = knockoutStages.find((s) => {
      const matches = (bracket[s] ?? []).filter(Boolean) as CupMatch[];
      return matches.length > 0 && matches.some((m) => !isResolved(m, draft.predictions[m.id]));
    });
    if (!stage) return;
    const matches = (bracket[stage] ?? []).filter(Boolean) as CupMatch[];
    updateDraft((current) => {
      let predictions = { ...current.predictions };
      matches.forEach((match) => {
        if (isResolved(match, predictions[match.id])) return;
        predictions = resetDownstream(predictions, match);
        predictions[match.id] = randomKnockoutScore(match);
      });
      const predictionSources = removeOrphanPredictionSources(current.predictionSources, predictions);
      matches.forEach((match) => {
        if (isResolved(match, predictions[match.id])) predictionSources[match.id] = 'manual';
      });
      return { ...current, predictions, predictionSources };
    });
  };

  const fillGroup = (letter: string) => {
    if (isSubmitted) return;
    updateDraft((current) => {
      const predictions = clearKnockoutPredictions(current.predictions);
      const predictionSources = removeOrphanPredictionSources(current.predictionSources, predictions);
      (groupMatchesByLetter[letter] ?? []).forEach((match) => {
        if (isLockedMatch(match.id)) return; // jogo encerrado: placar oficial permanece
        predictions[match.id] = suggestedScore(match);
        delete predictionSources[match.id];
      });
      return { ...current, predictions, predictionSources };
    });
  };

  const fillAllGroups = () => {
    if (isSubmitted) return;
    updateDraft((current) => {
      const predictions = clearKnockoutPredictions(current.predictions);
      const predictionSources = removeOrphanPredictionSources(current.predictionSources, predictions);
      GROUP_MATCHES.forEach((match) => {
        if (isLockedMatch(match.id)) return; // jogo encerrado: placar oficial permanece
        predictions[match.id] = suggestedScore(match);
        delete predictionSources[match.id];
      });
      return { ...current, predictions, predictionSources };
    });
  };

  const fillSelectedGroupRandomly = () => {
    if (isSubmitted) return;
    updateDraft((current) => {
      const predictions = clearKnockoutPredictions(current.predictions);
      const predictionSources = removeOrphanPredictionSources(current.predictionSources, predictions);
      (groupMatchesByLetter[selectedGroup] ?? []).forEach((match) => {
        if (isLockedMatch(match.id)) return; // jogo encerrado: placar oficial permanece
        predictions[match.id] = randomGroupScore(match);
        predictionSources[match.id] = 'randomGroup';
      });
      return { ...current, predictions, predictionSources };
    });
  };

  const clearGroup = (letter: string) => {
    if (isSubmitted) return;
    updateDraft((current) => {
      const predictions = clearKnockoutPredictions(current.predictions);
      const predictionSources = removeOrphanPredictionSources(current.predictionSources, predictions);
      (groupMatchesByLetter[letter] ?? []).forEach((match) => {
        if (isLockedMatch(match.id)) return; // jogo encerrado: placar oficial permanece
        delete predictions[match.id];
        delete predictionSources[match.id];
      });
      return { ...current, predictions, predictionSources };
    });
  };

  const clearAll = () => {
    if (isSubmitted) return;
    // Limpa os palpites, mas mantém os resultados oficiais travados.
    updateDraft((current) => ({
      ...current,
      predictions: withOfficialResults({}),
      predictionSources: withOfficialSources({}),
      submittedAt: null,
    }));
    setNameTouched(false);
    setEmailTouched(false);
  };

  const startNewTicket = () => {
    updateDraft(() => ({
      participant: createInitialParticipant(),
      predictions: {},
      predictionSources: {},
      submittedAt: null,
      lastSavedAt: new Date().toISOString()
    }));
    setNameTouched(false);
    setEmailTouched(false);
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  const submitTicket = async () => {
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);
    setModalState('sending');

    const emailKey = draft.participant.email.trim().toLowerCase();
    const fillMetadata = buildFillMetadata(draft.predictionSources);
    const payload = {
      participant: {
        name: draft.participant.name.trim(),
        email: draft.participant.email.trim(),
        expertiseLevel: draft.participant.expertiseLevel,
        footballFollowFrequency: draft.participant.footballFollowFrequency,
        cupPoolExperience: draft.participant.cupPoolExperience,
        favoriteTeam: draft.participant.favoriteTeam.trim(),
      },
      submittedAt: new Date().toISOString(),
      champion,
      fillMetadata,
      predictions: allVisibleMatches.map((match) => ({
        matchId: match.id,
        stage: match.stage,
        label: match.label,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        prediction: getPrediction(draft.predictions, match.id),
      })),
    };

    try {
      await setDoc(doc(db, 'bolao2026', emailKey), payload);
      setSubmitSuccess(true);
      setModalState('success');
    } catch (err: any) {
      console.error('Erro ao enviar palpite:', err);
      let errMsg = 'Não foi possível enviar seus palpites. Verifique sua conexão e tente novamente.';
      if (err.code === 'permission-denied') {
        errMsg = 'Este e-mail já possui palpites cadastrados no bolão. Apenas um envio é permitido por participante.';
      }
      setSubmitError(errMsg);
      setModalState('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light pb-16 font-opensans text-brand-dark">
      <section className="hidden">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-brand-green/30 bg-brand-green/15 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-brand-neon">
              Bolão Copa 2026
            </div>
            <h1 className="max-w-4xl text-3xl font-black uppercase leading-none tracking-tight md:text-5xl">
              Simulador de palpites
            </h1>
            <p className="mt-3 max-w-2xl text-sm font-semibold uppercase tracking-[0.12em] text-white/45">
              Copa do Mundo 2026
            </p>
          </div>

          <div className="grid gap-3 rounded-lg border border-white/10 bg-white/8 p-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-white/10 p-2.5">
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/45">Progresso</span>
                <strong className="mt-1 block font-montserrat text-2xl font-black">{completedMatches}/{TOTAL_MATCHES}</strong>
              </div>
              <div className="rounded-lg bg-white/10 p-2.5">
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/45">Grupos</span>
                <strong className="mt-1 block font-montserrat text-2xl font-black">{groupsComplete ? 'OK' : 'Aberto'}</strong>
              </div>
              <div className="rounded-lg bg-white/10 p-2.5">
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/45">Campeão</span>
                <strong className="mt-1 block truncate font-montserrat text-lg font-black">{champion ?? '-'}</strong>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <span
                className="block h-full rounded-full bg-brand-green transition-all"
                style={{ width: `${Math.min(100, (completedMatches / TOTAL_MATCHES) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section ref={groupsRef} className="mx-auto max-w-7xl scroll-mt-40 px-3 py-6 sm:px-4">
        <div className="mb-4">
          <SectionHeader eyebrow="Primeira fase — fase de grupos" title="Palpites dos grupos">
            <ProgressPill label="Jogos da 1ª fase" done={groupCompleted} total={GROUP_MATCHES.length} />
            {isSubmitted && (
              <span className="inline-flex flex-none items-center gap-1 rounded-md bg-brand-green/10 px-2 py-1 text-[10px] font-black uppercase text-brand-green">
                <Lock className="h-3 w-3" />
                Oficial
              </span>
            )}
          </SectionHeader>
        </div>

        <div className="mx-auto grid max-w-7xl gap-4">
          {/* Barra de grupos: fica apenas aqui, logo após o cabeçalho, sem ficar fixa ao rolar. */}
          <div className="rounded-lg border border-brand-dark/10 bg-white px-3 py-2 shadow-sm">
            <div className="overflow-x-auto">
              <div className="grid grid-cols-6 gap-1 sm:grid-cols-12">
                {GROUP_ORDER.map((letter) => {
                  const total = groupMatchesByLetter[letter]?.length ?? 0;
                  const complete = (groupMatchesByLetter[letter] ?? []).filter((match) => isResolved(match, draft.predictions[match.id])).length;
                  return (
                    <button
                      key={letter}
                      type="button"
                      onClick={() => setSelectedGroup(letter)}
                      className={`h-11 rounded-md border px-2 text-center transition ${
                        selectedGroup === letter
                          ? 'border-brand-green bg-brand-green text-white'
                          : 'border-brand-dark/10 bg-white text-brand-dark hover:border-brand-green/40'
                      }`}
                      aria-label={`Selecionar grupo ${letter}`}
                    >
                      <strong className="block font-montserrat text-sm font-black leading-none">{letter}</strong>
                      <span className="mt-1 block text-[9px] font-bold leading-none opacity-65">{complete}/{total}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-start">
          <div className="min-w-0">
            <GroupColumn
              letter={selectedGroup}
              matches={groupMatchesByLetter[selectedGroup] ?? []}
              predictions={draft.predictions}
              disabled={isSubmitted}
              getInputKey={groupScoreInputKey}
              onScore={setGroupScore}
            />
          </div>

          <div className="grid gap-3">
            <CompactStandings rows={selectedStandings} />

            <div className="flex items-stretch gap-2">
              <button
                type="button"
                onClick={() => setSelectedGroup(previousGroup)}
                className="inline-flex flex-none items-center justify-center rounded-md border border-brand-dark/10 bg-white px-3 py-2 font-montserrat text-base font-black text-brand-dark transition hover:border-brand-green/40 hover:text-brand-green"
                aria-label={`Grupo anterior: ${previousGroup}`}
              >
                ←
              </button>
              <button
                type="button"
                disabled={isSubmitted}
                onClick={fillSelectedGroupRandomly}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-brand-green px-4 py-3 text-sm font-black uppercase text-white transition hover:bg-brand-grad2 disabled:opacity-50"
              >
                <Sparkles className="h-5 w-5" />
                Preencher Grupo
              </button>
              <button
                type="button"
                onClick={() => setSelectedGroup(nextGroup)}
                className="inline-flex flex-none items-center justify-center rounded-md border border-brand-dark/10 bg-white px-3 py-2 font-montserrat text-base font-black text-brand-dark transition hover:border-brand-green/40 hover:text-brand-green"
                aria-label={`Próximo grupo: ${nextGroup}`}
              >
                →
              </button>
            </div>
            <button
              type="button"
              disabled={isSubmitted}
              onClick={() => clearGroup(selectedGroup)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-brand-dark/10 bg-white px-4 py-2.5 text-xs font-black uppercase text-brand-dark transition hover:border-red-400/60 hover:text-red-500 disabled:opacity-50"
            >
              <Eraser className="h-4 w-4" />
              Limpar Grupo
            </button>
          </div>
          </div>
        </div>
      </section>

      {false && (
        <section className="hidden">
          <aside className="grid content-start gap-4">
            <div className="rounded-lg border border-brand-dark/10 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <span className="font-montserrat text-[10px] font-black uppercase tracking-[0.18em] text-brand-green">
                    Selecione o grupo
                  </span>
                  <h2 className="mt-1 text-2xl font-black">Grupo {selectedGroup}</h2>
                </div>
                <CalendarDays className="h-5 w-5 text-brand-dark/30" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {GROUP_ORDER.map((letter) => {
                  const total = groupMatchesByLetter[letter]?.length ?? 0;
                  const complete = (groupMatchesByLetter[letter] ?? []).filter((match) => isResolved(match, draft.predictions[match.id])).length;
                  return (
                    <button
                      key={letter}
                      type="button"
                      onClick={() => setSelectedGroup(letter)}
                      className={`rounded-lg border px-2 py-3 text-center transition ${
                        selectedGroup === letter
                          ? 'border-brand-green bg-brand-green text-white shadow-md'
                          : 'border-brand-dark/10 bg-white text-brand-dark hover:border-brand-green/40'
                      }`}
                    >
                      <strong className="block font-montserrat text-lg font-black">{letter}</strong>
                      <span className="text-[10px] font-bold opacity-70">{complete}/{total}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <StandingsTable rows={selectedStandings} />

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isSubmitted}
                onClick={() => fillGroup(selectedGroup)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-green px-4 py-3 text-xs font-black uppercase text-white transition hover:bg-brand-grad2 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                Modelo
              </button>
              <button
                type="button"
                disabled={isSubmitted}
                onClick={() => clearGroup(selectedGroup)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-brand-dark/10 bg-white px-4 py-3 text-xs font-black uppercase text-brand-dark transition hover:border-brand-red/40 hover:text-brand-red disabled:opacity-50"
              >
                <Eraser className="h-4 w-4" />
                Limpar
              </button>
            </div>
          </aside>

          <div className="grid content-start gap-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="font-montserrat text-[10px] font-black uppercase tracking-[0.18em] text-brand-green">
                  Palpites da fase de grupos
                </span>
                <h2 className="mt-1 text-3xl font-black">Confrontos do Grupo {selectedGroup}</h2>
              </div>
              <button
                type="button"
                disabled={isSubmitted}
                onClick={clearAll}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-brand-dark/10 bg-white px-4 py-3 text-xs font-black uppercase text-brand-dark transition hover:border-brand-red/40 hover:text-brand-red disabled:opacity-50"
              >
                <Eraser className="h-4 w-4" />
                Limpar tudo
              </button>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {groupMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  prediction={getPrediction(draft.predictions, match.id)}
                  disabled={isSubmitted}
                  onScore={setScore}
                  onPenalty={setPenalty}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {groupsComplete && (
        <section className="mx-auto max-w-7xl scroll-mt-40 border-t-4 border-brand-green/20 px-4 py-8">
          {(
            <div className="grid gap-6">
              <SectionHeader eyebrow="Segunda fase — mata-mata" title="Rumo até a Final">
                <ProgressPill label="Jogos até a final" done={completedMatches} total={TOTAL_MATCHES} />
                <button
                  type="button"
                  disabled={isSubmitted || completedMatches === TOTAL_MATCHES}
                  onClick={fillNextKnockoutRound}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-green px-3 py-2 text-xs font-black uppercase text-white transition hover:bg-brand-grad2 disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                  Preencher rodada
                </button>
                <button
                  type="button"
                  disabled={isSubmitted}
                  onClick={() => {
                    updateDraft((current) => {
                      const predictions = clearKnockoutPredictions(current.predictions);
                      return {
                        ...current,
                        predictions,
                        predictionSources: removeOrphanPredictionSources(current.predictionSources, predictions),
                      };
                    });
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-brand-dark/10 bg-white px-3 py-2 text-xs font-black uppercase text-brand-dark transition hover:border-brand-red/40 hover:text-brand-red disabled:opacity-50"
                >
                  <Eraser className="h-4 w-4" />
                  Limpar mata-mata
                </button>
              </SectionHeader>

              <KnockoutBracket
                bracket={bracket}
                predictions={draft.predictions}
                champion={champion}
                disabled={isSubmitted}
                showProbabilities={showKnockoutProbabilities}
                onToggleProbabilities={() => setShowKnockoutProbabilities((current) => !current)}
                onScore={setScore}
                onPenalty={setPenalty}
                onPickWinner={setKnockoutWinner}
              />

              <div className="hidden">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="font-montserrat text-[10px] font-black uppercase tracking-[0.18em] text-brand-green">
                      Chave projetada
                    </span>
                    <h2 className="mt-1 text-3xl font-black">Classificados por seed</h2>
                  </div>
                  <span className="rounded-lg bg-brand-light px-3 py-2 text-xs font-bold text-brand-dark/55">
                    32 seleções
                  </span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {qualifiers.map((team) => (
                    <div key={`${team.seedLabel}-${team.team}`} className="flex items-center gap-3 rounded-lg border border-brand-dark/10 bg-brand-light/60 p-2">
                      <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-brand-dark font-montserrat text-xs font-black text-white">
                        {team.seedRank}
                      </span>
                      <TeamBadge team={team.team} seed={team.seedLabel} compact />
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden">
                {(['roundOf32', 'roundOf16', 'quarterfinals', 'semifinals', 'final'] as Exclude<MatchStage, 'groups'>[]).map((stage) => {
                  const matches = bracket[stage] ?? [];
                  const locked = matches.length === 0;

                  return (
                    <section key={stage} className="rounded-lg border border-brand-dark/10 bg-white p-4 shadow-sm">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <span className="font-montserrat text-[10px] font-black uppercase tracking-[0.18em] text-brand-green">
                            {stageMeta[stage].title}
                          </span>
                          <h3 className="mt-1 text-2xl font-black">{matches.length || '-'} jogos</h3>
                        </div>
                        {locked ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-brand-light px-3 py-2 text-xs font-black uppercase text-brand-dark/40">
                            <Lock className="h-3 w-3" />
                            Bloqueado
                          </span>
                        ) : (
                          <ChevronRight className="h-5 w-5 text-brand-green" />
                        )}
                      </div>

                      {locked ? (
                        <p className="rounded-lg bg-brand-light p-4 text-sm text-brand-dark/50">
                          Resolva a fase anterior para liberar estes confrontos.
                        </p>
                      ) : (
                        <div className="grid gap-4 xl:grid-cols-2">
                          {matches.map((match) => (
                            <MatchCard
                              key={match.id}
                              match={match}
                              prediction={getPrediction(draft.predictions, match.id)}
                              disabled={isSubmitted}
                              onScore={setScore}
                              onPenalty={setPenalty}
                            />
                          ))}
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Cabeçalho desativado: mostra que o mata-mata abre depois de fechar os grupos. */}
      {!groupsComplete && (
        <section className="mx-auto max-w-7xl scroll-mt-40 border-t-4 border-brand-dark/5 px-4 py-8">
          <SectionHeader
            eyebrow="Segunda fase — mata-mata"
            title="Rumo até a Final"
            disabled
            hint="Termine de preencher todos os jogos da fase de grupos para liberar o chaveamento do mata-mata, das 16 avos até a grande final."
          />
        </section>
      )}

      {/* Cabeçalho desativado: mostra que o envio abre depois de definir o campeão. */}
      {!knockoutComplete && (
        <section className="mx-auto max-w-7xl scroll-mt-40 border-t-4 border-brand-dark/5 px-4 py-8">
          <SectionHeader
            eyebrow="Envio dos palpites"
            title="Confirme os seus palpites"
            disabled
            hint="Conclua o mata-mata e escolha o campeão para liberar o envio. É aqui que você confere seus palpites e entra na disputa do bolão."
          />
        </section>
      )}

      {knockoutComplete && !cardModalOpen && (
        <section className="mx-auto max-w-7xl scroll-mt-40 border-t-4 border-brand-yellow/30 px-4 py-8">
          <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
            {/* Coluna 1 (proporção 1): o card gerado do mata-mata */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl border-2 border-brand-green/30 bg-gradient-to-br from-brand-green/5 via-white to-brand-yellow/10 p-5 shadow-lg">
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-green/10 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-brand-green">
                  <Share2 className="h-3.5 w-3.5" /> Seu card pra compartilhar
                </span>
                <div className="mt-4 overflow-hidden rounded-xl border border-brand-dark/10 shadow-2xl">
                  {cardPng ? (
                    <img src={cardPng} alt="Card da minha simulação do mata-mata" className="block w-full" />
                  ) : (
                    <div className="flex aspect-[1122/1402] w-full items-center justify-center bg-brand-light">
                      <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={downloadCard}
                  disabled={!cardPng || isGeneratingCard}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green px-5 py-3.5 text-sm font-black uppercase tracking-wide text-white shadow-lg shadow-brand-green/25 transition hover:bg-brand-grad2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Download className="h-5 w-5" /> Baixar imagem
                </button>
                {cardError && (
                  <p className="mt-2 text-center text-xs font-bold text-red-600">
                    Erro ao gerar o card.{' '}
                    <button type="button" onClick={generateCard} className="underline underline-offset-2">Tentar de novo</button>
                  </p>
                )}
              </div>
            </div>

            {/* Coluna 2 (proporção 2): confirmar e enviar os palpites */}
            <div className="grid content-start gap-6 lg:col-span-2">
              <SectionHeader eyebrow="Envio dos palpites" title="Confirme os seus palpites">
                <ProgressPill label="Palpites preenchidos" done={completedMatches} total={TOTAL_MATCHES} />
                {isSubmitted && (
                  <span className="inline-flex flex-none items-center gap-1 rounded-md bg-brand-green/10 px-2 py-1 text-[10px] font-black uppercase text-brand-green">
                    <Lock className="h-3 w-3" />
                    Oficial
                  </span>
                )}
              </SectionHeader>

              <p className="text-sm leading-relaxed text-brand-dark/70">
                Confira tudo com calma e envie: seus palpites passam a valer na disputa pela caixa de bombons Sonho de Valsa 🍫 — e, com o seu consentimento, ajudam de forma anonimizada a nossa pesquisa de previsão estatística no esporte.
              </p>

              <div className="rounded-lg border border-brand-dark/10 bg-white p-5 shadow-sm">
            <span className="font-montserrat text-[10px] font-black uppercase tracking-[0.18em] text-brand-green">
              Dados do participante
            </span>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-brand-dark/45">Nome</span>
                <input
                  value={draft.participant.name}
                  disabled={isSubmitted}
                  onBlur={() => setNameTouched(true)}
                  onChange={(event) => {
                    updateParticipant({ name: event.target.value });
                    if (!nameTouched) setNameTouched(true);
                  }}
                  className={`rounded-lg border px-4 py-3 text-sm font-semibold outline-none transition focus:ring-4 disabled:opacity-50 ${
                    nameTouched
                      ? nameValid
                        ? 'border-brand-green bg-brand-green/[0.02] focus:border-brand-green focus:ring-brand-green/10'
                        : 'border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-red-500/10'
                      : 'border-brand-dark/10 bg-brand-light focus:border-brand-green focus:bg-white focus:ring-brand-green/10'
                  }`}
                  placeholder="Seu nome"
                />
                {nameError && (
                  <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    O nome deve conter pelo menos 2 caracteres.
                  </span>
                )}
                {nameTouched && nameValid && (
                  <span className="text-[10px] font-bold text-brand-green flex items-center gap-1 mt-1">
                    <Check className="h-3.5 w-3.5" />
                    Nome preenchido!
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-brand-dark/45">E-mail</span>
                <input
                  type="email"
                  value={draft.participant.email}
                  disabled={isSubmitted}
                  onBlur={() => setEmailTouched(true)}
                  onChange={(event) => {
                    updateParticipant({ email: event.target.value });
                    if (!emailTouched) setEmailTouched(true);
                  }}
                  className={`rounded-lg border px-4 py-3 text-sm font-semibold outline-none transition focus:ring-4 disabled:opacity-50 ${
                    emailTouched
                      ? emailValid
                        ? 'border-brand-green bg-brand-green/[0.02] focus:border-brand-green focus:ring-brand-green/10'
                        : 'border-red-500 bg-red-500/[0.02] focus:border-red-500 focus:ring-red-500/10'
                      : 'border-brand-dark/10 bg-brand-light focus:border-brand-green focus:bg-white focus:ring-brand-green/10'
                  }`}
                  placeholder="voce@email.com"
                />
                {emailError && (
                  <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Insira um e-mail válido (ex: seu@email.com).
                  </span>
                )}
                {emailTouched && emailValid && (
                  <span className="text-[10px] font-bold text-brand-green flex items-center gap-1 mt-1">
                    <Check className="h-3.5 w-3.5" />
                    E-mail válido!
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-brand-dark/45">Quanto você entende de futebol?</span>
                <select
                  value={draft.participant.expertiseLevel}
                  onChange={(event) => updateParticipant({ expertiseLevel: event.target.value })}
                  className="rounded-lg border border-brand-dark/10 bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-brand-green focus:ring-4 focus:ring-brand-green/10"
                >
                  <option value="">Selecione</option>
                  <option value="none">Não entendo nada</option>
                  <option value="little">Entendo pouco</option>
                  <option value="regular">Entendo razoavelmente</option>
                  <option value="expert">Me considero especialista</option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-brand-dark/45">Com que frequência acompanha futebol?</span>
                <select
                  value={draft.participant.footballFollowFrequency}
                  onChange={(event) => updateParticipant({ footballFollowFrequency: event.target.value })}
                  className="rounded-lg border border-brand-dark/10 bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-brand-green focus:ring-4 focus:ring-brand-green/10"
                >
                  <option value="">Selecione</option>
                  <option value="never">Nunca</option>
                  <option value="rarely">Quase nunca</option>
                  <option value="sometimes">Algumas vezes por mês</option>
                  <option value="weekly">Toda semana</option>
                </select>
              </label>
            </div>
            </div>

            {submitError && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-xs font-semibold leading-relaxed text-red-700 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 flex-none text-red-500" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="rounded-lg border border-brand-dark/10 bg-white p-4">
              <div className="flex items-start gap-3">
                <input
                  id="acceptTerms"
                  type="checkbox"
                  checked={acceptedTerms}
                  disabled={isSubmitted}
                  onChange={(event) => setAcceptedTerms(event.target.checked)}
                  className="mt-0.5 h-4 w-4 flex-none cursor-pointer accent-brand-green disabled:opacity-50"
                />
                <p className="text-xs leading-relaxed text-brand-dark/65">
                  Li e aceito os{' '}
                  <button
                    type="button"
                    onClick={() => openLegal('terms')}
                    className="font-bold text-brand-green underline underline-offset-2 hover:text-brand-grad2"
                  >
                    Termos de Uso
                  </button>{' '}
                  e a{' '}
                  <button
                    type="button"
                    onClick={() => openLegal('privacy')}
                    className="font-bold text-brand-green underline underline-offset-2 hover:text-brand-grad2"
                  >
                    Política de Privacidade
                  </button>{' '}
                  e autorizo o uso dos meus dados no bolão e na pesquisa.
                </p>
              </div>
              {!acceptedTerms && (
                <p className="mt-2 flex items-center gap-1 text-[10px] font-bold text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  É necessário aceitar os termos para enviar os palpites.
                </p>
              )}
            </div>

            <button
              type="button"
              disabled={!canSubmit || isSubmitted || isSubmitting}
              onClick={submitTicket}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-green px-5 py-4 text-sm font-black uppercase text-white shadow-md transition hover:bg-brand-grad2 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-5 w-5" />
              )}
              {isSubmitting ? 'Enviando...' : isSubmitted ? 'Palpites enviados' : 'Enviar e entrar no bolão'}
            </button>
            </div>
          </div>
        </section>
      )}

      {/* Popup do card: aparece ao concluir o mata-mata; ao fechar, libera a seção de baixo. */}
      {cardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-md animate-fade-in">
          <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes zoomIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
            .animate-zoom-in { animation: zoomIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
          `}</style>
          <div className="relative max-h-[92vh] w-full max-w-sm overflow-y-auto rounded-2xl border border-brand-dark/10 bg-white p-6 shadow-2xl animate-zoom-in">
            <button
              type="button"
              onClick={() => setCardModalOpen(false)}
              aria-label="Fechar"
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-brand-dark/5 text-brand-dark/60 transition hover:bg-brand-dark/10 hover:text-brand-dark"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-green/10 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-brand-green">
                <Sparkles className="h-3.5 w-3.5" /> Sua simulação está pronta
              </span>
              <h3 className="mt-3 font-montserrat text-xl font-black uppercase tracking-wide text-brand-dark md:text-2xl">
                Compartilhe nas suas redes sociais
              </h3>
            </div>

            <div className="mt-5 overflow-hidden rounded-xl border border-brand-dark/10 shadow-xl">
              {cardPng ? (
                <img src={cardPng} alt="Card da minha simulação do mata-mata" className="block w-full" />
              ) : (
                <div className="flex aspect-[1122/1402] w-full flex-col items-center justify-center gap-3 bg-brand-light">
                  <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
                  <span className="text-xs font-bold uppercase tracking-wide text-brand-dark/50">Gerando seu card...</span>
                </div>
              )}
            </div>

            {cardError && (
              <p className="mt-3 text-center text-xs font-bold text-red-600">
                Não foi possível gerar o card.{' '}
                <button type="button" onClick={generateCard} className="underline underline-offset-2">Tentar de novo</button>
              </p>
            )}

            <button
              type="button"
              onClick={downloadCard}
              disabled={!cardPng || isGeneratingCard}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green px-6 py-4 text-base font-black uppercase tracking-wide text-white shadow-xl shadow-brand-green/30 transition hover:scale-[1.02] hover:bg-brand-grad2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download className="h-5 w-5" /> Baixar imagem
            </button>

            <button
              type="button"
              onClick={() => setCardModalOpen(false)}
              className="mt-3 w-full text-center text-xs font-bold uppercase tracking-wide text-brand-dark/50 transition hover:text-brand-dark"
            >
              Continuar para o envio
            </button>
          </div>
        </div>
      )}

      {modalState !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-md animate-fade-in">
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes zoomIn {
              from { transform: scale(0.95); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            .animate-fade-in {
              animation: fadeIn 0.2s ease-out forwards;
            }
            .animate-zoom-in {
              animation: zoomIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
          `}</style>
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-brand-dark/10 bg-white p-6 shadow-2xl transition-all animate-zoom-in">
            
            {/* Modal de Envio (Carregamento) */}
            {modalState === 'sending' && (
              <div className="flex flex-col items-center py-6 text-center">
                <div className="relative flex items-center justify-center h-20 w-20 mb-5">
                  <div className="absolute inset-0 rounded-full border-4 border-brand-green/20 animate-ping" />
                  <Loader2 className="h-10 w-10 text-brand-green animate-spin relative z-10" />
                </div>
                <h3 className="font-montserrat text-xl font-black uppercase tracking-wide text-brand-dark">
                  Enviando palpites...
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-dark/60 max-w-xs">
                  Estamos registrando seus palpites no banco de dados. Por favor, não feche esta página.
                </p>
              </div>
            )}

            {/* Modal de Sucesso */}
            {modalState === 'success' && (
              <div className="flex flex-col items-center py-4 text-center">
                <div className="relative flex items-center justify-center h-20 w-20 rounded-full bg-brand-green/10 text-brand-green mb-5">
                  <div className="absolute inset-0 rounded-full bg-brand-green/20 animate-pulse" />
                  <CheckCircle2 className="h-12 w-12 relative z-10" />
                </div>
                <h3 className="font-montserrat text-2xl font-black uppercase tracking-wide text-brand-green">
                  Palpites Enviados!
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-dark/70 font-semibold">
                  Seus palpites foram registrados com sucesso no bolão 2026.
                </p>
                <p className="mt-2 text-xs leading-relaxed text-brand-dark/50 italic max-w-xs">
                  "Desejamos muita sorte na disputa! Que a ciência e a intuição estejam com você. Boa sorte!" 🏆⚽
                </p>
                <button
                  type="button"
                  onClick={() => setModalState('none')}
                  className="mt-6 w-full rounded-lg bg-brand-green py-3 text-sm font-black uppercase text-white shadow-md transition hover:bg-brand-grad2"
                >
                  Entendido
                </button>
              </div>
            )}

            {/* Modal de Erro */}
            {modalState === 'error' && (
              <div className="flex flex-col items-center py-4 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 mb-5">
                  <AlertCircle className="h-12 w-12" />
                </div>
                <h3 className="font-montserrat text-xl font-black uppercase tracking-wide text-red-600">
                  Falha no envio
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-dark/70 px-2">
                  {submitError || 'Ocorreu um erro ao processar sua submissão. Tente novamente.'}
                </p>
                <div className="mt-6 flex w-full gap-3">
                  <button
                    type="button"
                    onClick={() => setModalState('none')}
                    className="flex-1 rounded-lg border border-brand-dark/10 bg-white py-3 text-sm font-black uppercase text-brand-dark transition hover:bg-brand-light"
                  >
                    Fechar
                  </button>
                  {!isSubmitted && (
                    <button
                      type="button"
                      onClick={submitTicket}
                      className="flex-1 rounded-lg bg-brand-green py-3 text-sm font-black uppercase text-white shadow-md transition hover:bg-brand-grad2"
                    >
                      Tentar de Novo
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      <LegalModal
        open={legalModal.open}
        initialTab={legalModal.tab}
        onClose={() => setLegalModal((prev) => ({ ...prev, open: false }))}
      />

      {/* Card do mata-mata renderizado fora da tela; serve de fonte para o PNG.
          A arte fixa (template) é o fundo; o chaveamento entra num palco posicionado. */}
      {shareCardHtml && (
        <div aria-hidden="true" style={{ position: 'fixed', top: 0, left: '-20000px', width: CARD_W, height: CARD_H, pointerEvents: 'none', zIndex: -1 }}>
          <div
            ref={shareCardRef}
            style={{ width: CARD_W, height: CARD_H, position: 'relative', overflow: 'hidden', fontFamily: 'Montserrat, Arial, sans-serif', background: '#ffffff' }}
          >
            <img
              src="/assets/card-template.webp"
              alt=""
              crossOrigin="anonymous"
              style={{ position: 'absolute', top: 0, left: 0, width: CARD_W, height: CARD_H, zIndex: 0, display: 'block' }}
            />
            <div
              style={{ position: 'absolute', left: STAGE_OFFSET_X, top: STAGE_OFFSET_Y, width: STAGE_W, height: STAGE_H, zIndex: 1 }}
              dangerouslySetInnerHTML={{ __html: shareCardHtml }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BolaoPage;
