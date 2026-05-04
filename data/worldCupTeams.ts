import { Team } from '../types';

export const WC_TEAMS: (Team & { color: string })[] = [
  { 
    id: 'BRA', name: 'Brasil', flag: '🇧🇷', region: 'CONMEBOL', tier: 'Top', color: '#FFDF00',
    ranking: 5, titles: 5, bestResult: 'Campeão (5x)', starPlayer: 'Vini Jr.', attack: 94, defense: 86
  },
  { 
    id: 'ARG', name: 'Argentina', flag: '🇦🇷', region: 'CONMEBOL', tier: 'Top', color: '#75AADB',
    ranking: 1, titles: 3, bestResult: 'Campeão (3x)', starPlayer: 'Lionel Messi', attack: 92, defense: 90
  },
  { 
    id: 'FRA', name: 'França', flag: '🇫🇷', region: 'UEFA', tier: 'Top', color: '#002395',
    ranking: 2, titles: 2, bestResult: 'Campeão (2x)', starPlayer: 'Kylian Mbappé', attack: 96, defense: 89
  },
  { 
    id: 'ENG', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', region: 'UEFA', tier: 'Top', color: '#CE1124',
    ranking: 3, titles: 1, bestResult: 'Campeão (1966)', starPlayer: 'Jude Bellingham', attack: 90, defense: 88
  },
  { 
    id: 'ESP', name: 'Espanha', flag: '🇪🇸', region: 'UEFA', tier: 'Top', color: '#AA151B',
    ranking: 8, titles: 1, bestResult: 'Campeão (2010)', starPlayer: 'Lamine Yamal', attack: 89, defense: 85
  },
  { 
    id: 'GER', name: 'Alemanha', flag: '🇩🇪', region: 'UEFA', tier: 'High', color: '#000000',
    ranking: 16, titles: 4, bestResult: 'Campeão (4x)', starPlayer: 'Jamal Musiala', attack: 88, defense: 84
  },
  { 
    id: 'POR', name: 'Portugal', flag: '🇵🇹', region: 'UEFA', tier: 'High', color: '#E42518',
    ranking: 6, titles: 0, bestResult: '3º Lugar (1966)', starPlayer: 'Rafael Leão', attack: 87, defense: 85
  },
  { 
    id: 'ITA', name: 'Itália', flag: '🇮🇹', region: 'UEFA', tier: 'High', color: '#0064AA',
    ranking: 9, titles: 4, bestResult: 'Campeão (4x)', starPlayer: 'Nicolò Barella', attack: 82, defense: 91
  },
  { 
    id: 'USA', name: 'EUA', flag: '🇺🇸', region: 'CONCACAF', tier: 'Mid', color: '#3C3B6E',
    ranking: 11, titles: 0, bestResult: '3º Lugar (1930)', starPlayer: 'C. Pulisic', attack: 79, defense: 78
  },
  { 
    id: 'MEX', name: 'México', flag: '🇲🇽', region: 'CONCACAF', tier: 'Mid', color: '#006847',
    ranking: 15, titles: 0, bestResult: 'Quartas (1970)', starPlayer: 'Santiago Giménez', attack: 76, defense: 75
  },
  { 
    id: 'CAN', name: 'Canadá', flag: '🇨🇦', region: 'CONCACAF', tier: 'Mid', color: '#C5281C',
    ranking: 48, titles: 0, bestResult: 'Fase de Grupos', starPlayer: 'Alphonso Davies', attack: 78, defense: 72
  },
  { 
    id: 'URU', name: 'Uruguai', flag: '🇺🇾', region: 'CONMEBOL', tier: 'High', color: '#5BA4D4',
    ranking: 14, titles: 2, bestResult: 'Campeão (2x)', starPlayer: 'Fede Valverde', attack: 84, defense: 86
  },
  { 
    id: 'COL', name: 'Colômbia', flag: '🇨🇴', region: 'CONMEBOL', tier: 'Mid', color: '#FCD116',
    ranking: 12, titles: 0, bestResult: 'Quartas (2014)', starPlayer: 'Luis Díaz', attack: 83, defense: 80
  },
  { 
    id: 'JPN', name: 'Japão', flag: '🇯🇵', region: 'AFC', tier: 'Mid', color: '#000555',
    ranking: 18, titles: 0, bestResult: 'Oitavas (4x)', starPlayer: 'Kaoru Mitoma', attack: 79, defense: 81
  },
  { 
    id: 'KOR', name: 'Coreia do Sul', flag: '🇰🇷', region: 'AFC', tier: 'Mid', color: '#EC0F47',
    ranking: 23, titles: 0, bestResult: '4º Lugar (2002)', starPlayer: 'Son Heung-min', attack: 80, defense: 76
  },
  { 
    id: 'MAR', name: 'Marrocos', flag: '🇲🇦', region: 'CAF', tier: 'Mid', color: '#C1272D',
    ranking: 13, titles: 0, bestResult: '4º Lugar (2022)', starPlayer: 'Achraf Hakimi', attack: 78, defense: 88
  },
  { 
    id: 'SEN', name: 'Senegal', flag: '🇸🇳', region: 'CAF', tier: 'Mid', color: '#00853F',
    ranking: 17, titles: 0, bestResult: 'Quartas (2002)', starPlayer: 'Sadio Mané', attack: 79, defense: 79
  },
  { 
    id: 'CRO', name: 'Croácia', flag: '🇭🇷', region: 'UEFA', tier: 'High', color: '#FF0000',
    ranking: 10, titles: 0, bestResult: 'Vice (2018)', starPlayer: 'Luka Modrić', attack: 78, defense: 85
  },
  { 
    id: 'NED', name: 'Holanda', flag: '🇳🇱', region: 'UEFA', tier: 'High', color: '#F36C21',
    ranking: 7, titles: 0, bestResult: 'Vice (3x)', starPlayer: 'Virgil van Dijk', attack: 86, defense: 88
  },
  { 
    id: 'BEL', name: 'Bélgica', flag: '🇧🇪', region: 'UEFA', tier: 'High', color: '#E30613',
    ranking: 4, titles: 0, bestResult: '3º Lugar (2018)', starPlayer: 'Kevin De Bruyne', attack: 85, defense: 79
  }
];
