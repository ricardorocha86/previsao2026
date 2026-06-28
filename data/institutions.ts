export type Institution = {
  abbr: string;
  name: string;
  logo: string;
  url: string;
  monochrome?: boolean;
};

export const RESEARCH_CENTERS: Institution[] = [
  {
    abbr: 'CeMEAI',
    name: 'Centro de Ciências Matemáticas Aplicadas à Indústria',
    logo: '/assets/instituicoes/cemeai.webp',
    url: 'https://cemeai.icmc.usp.br/',
  },
  {
    abbr: 'CER/UFBA',
    name: 'Centro de Estudos do Risco da Universidade Federal da Bahia',
    logo: '/assets/instituicoes/cer-ufba.webp',
    url: 'https://cer.ufba.br/',
  },
];

export const PARTNER_INSTITUTIONS: Institution[] = [
  {
    abbr: 'UFBA',
    name: 'Universidade Federal da Bahia',
    logo: '/assets/instituicoes/ufba-horizontal.svg',
    url: 'https://www.ufba.br/',
  },
  {
    abbr: 'USP',
    name: 'Universidade de São Paulo',
    logo: '/assets/instituicoes/usp.png',
    url: 'https://www.usp.br/',
    monochrome: true,
  },
  {
    abbr: 'UFMT',
    name: 'Universidade Federal de Mato Grosso',
    logo: '/assets/instituicoes/ufmt.png',
    url: 'https://www.ufmt.br/',
    monochrome: true,
  },
  {
    abbr: 'UFSCar',
    name: 'Universidade Federal de São Carlos',
    logo: '/assets/instituicoes/ufscar.svg',
    url: 'https://www.ufscar.br/',
    monochrome: true,
  },
  {
    abbr: 'UFRJ',
    name: 'Universidade Federal do Rio de Janeiro',
    logo: '/assets/instituicoes/ufrj.png',
    url: 'https://ufrj.br/',
    monochrome: true,
  },
  {
    abbr: 'NEOMA',
    name: 'NEOMA Business School',
    logo: '/assets/instituicoes/neoma.svg',
    url: 'https://neoma-bs.com/',
  },
];
