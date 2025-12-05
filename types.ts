
export interface Team {
  id: string;
  name: string;
  flag: string;
  region: string;
  tier: 'Top' | 'High' | 'Mid' | 'Low';
  ranking: number; // FIFA Ranking
  titles: number; // World Cups won
  bestResult: string; // e.g. "Campeão (1958)"
  starPlayer: string;
  attack: number; // 0-100
  defense: number; // 0-100
}

export interface PredictionResult {
  homeWinProbability: number;
  drawProbability: number;
  awayWinProbability: number;
  predictedScore: string;
  reasoning: string;
  keyFactors: string[];
}

export interface NewsItem {
  title: string;
  source: string;
  url: string;
  snippet: string;
}

export enum SimulationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface Researcher {
  id: string;
  name: string;
  role: string;
  affiliation: string;
  image: string;
  bio: string;
  link: string;
}

export interface Publication {
  id: string;
  title: string;
  journal: string;
  year: number;
  authors: string;
  link: string;
  abstract: string;
}

export interface MediaMention {
  id: string;
  outlet: string;
  logo: string; // text representation or url
  date: string;
  title: string;
  link: string;
  imageUrl: string; // Added for the cover layout
}