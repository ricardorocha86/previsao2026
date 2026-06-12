
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
  publisher: string;
  publisherLogo?: string;
  link: string;
  abstract: string;
}

export type MediaEdition = '2026' | '2022' | '2018' | '2014' | 'projeto';

export interface MediaMention {
  id: string;
  outlet: string;
  logo: string; // text representation or url
  title: string;
  link: string;
  edition: MediaEdition;
  imageUrl?: string; // imagem de divulgação (og:image) da matéria; ausente => usa o indicador
}
