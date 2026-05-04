
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

export interface Researcher {
  id: string;
  name: string;
  affiliation: string;
  image: string;
  coord?: boolean;
  linkedin?: string;
  lattes?: string;
  /** @deprecated use linkedin */
  link?: string;
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
