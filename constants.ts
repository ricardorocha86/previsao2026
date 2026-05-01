

import { Team, Researcher, Publication, MediaMention, NewsItem } from './types';

// A subset of likely teams for WC 2026 simulation with added colors and stats
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

export const MOCK_NEWS: NewsItem[] = [
  {
    title: "FIFA define regras do sorteio para 2026",
    source: "FIFA Official",
    url: "#",
    snippet: "O novo formato com 48 seleções exigirá um sistema de potes inédito baseado no Ranking FIFA atualizado."
  },
  {
    title: "Sedes confirmadas: Logística da Copa",
    source: "CNN Sports",
    url: "#",
    snippet: "Com jogos nos EUA, México e Canadá, o desgaste de viagem será um fator chave na análise de desempenho."
  },
  {
    title: "Brasil busca o Hexa em território norte-americano",
    source: "Globo Esporte",
    url: "#",
    snippet: "Análise histórica mostra bom desempenho da seleção em copas realizadas nas Américas."
  },
  {
    title: "Expansão para 48 times muda a matemática",
    source: "Analytics FC",
    url: "#",
    snippet: "A introdução da fase de 32 avos aumenta a probabilidade de zebras estatísticas em 15%."
  }
];

export const RESEARCHERS: Researcher[] = [
  // Coordenação
  {
    id: '2', name: 'Ricardo Rocha', coord: true,
    affiliation: 'UFBA', image: '/assets/fotos/ricardo-rocha.webp',
    linkedin: 'https://www.linkedin.com/in/ricardorocha86/',
    lattes: 'http://lattes.cnpq.br/0676420269735630',
  },
  {
    id: '3', name: 'Paulo Henrique Ferreira da Silva', coord: true,
    affiliation: 'UFBA', image: '/assets/fotos/paulo-henrique.webp',
    linkedin: 'https://www.linkedin.com/in/paulo-henrique-3294658a',
    lattes: 'http://lattes.cnpq.br/8538524597034643',
  },
  {
    id: '4', name: 'Lilia Carolina Carneiro da Costa', coord: true,
    affiliation: 'UFBA', image: '/assets/fotos/lilia-costa.webp',
    linkedin: 'https://www.linkedin.com/in/lilia-costa-76513b212/',
    lattes: 'http://lattes.cnpq.br/7905206547630006',
  },
  {
    id: '21', name: 'Francisco Louzada Neto', coord: true,
    affiliation: 'USP', image: '/assets/fotos/francisco-louzada.webp',
    linkedin: 'https://www.linkedin.com/in/francisco-louzada-639048b7',
    lattes: 'http://lattes.cnpq.br/0994050156415890',
  },
  {
    id: '24', name: 'Adriano Kamimura Suzuki', coord: true,
    affiliation: 'USP', image: '/assets/fotos/adriano-suzuki.webp',
    linkedin: 'https://br.linkedin.com/in/adriano-kamimura-suzuki-04b248a6',
    lattes: 'http://lattes.cnpq.br/4579497412852854',
  },
  {
    id: '25', name: 'Luis Ernesto Bueno Salasar', coord: true,
    affiliation: 'UFSCar', image: '/assets/fotos/luis-ernesto-salasar.webp',
    lattes: 'http://lattes.cnpq.br/5464564215528609',
  },
  // Membros
  {
    id: '1', name: 'Fernando Humberto de Almeida Moraes Neto',
    affiliation: 'UFMT', image: '/assets/fotos/fernando-humberto.webp',
    linkedin: 'https://www.linkedin.com/in/fernandomoraesds/',
    lattes: 'http://lattes.cnpq.br/5446300739482164',
  },
  {
    id: '5', name: 'David Franco Regalado',
    affiliation: 'UFBA / Senai-Cimatec', image: '/assets/fotos/david-franco.webp',
    linkedin: 'https://br.linkedin.com/in/davidfrancoregalado/pt',
    lattes: 'http://lattes.cnpq.br/3531775633812851',
  },
  {
    id: '6', name: 'Hugo Ribeiro Santana',
    affiliation: 'UFRJ', image: '/assets/fotos/hugo-santana.webp',
    lattes: 'http://lattes.cnpq.br/4875747507272694',
  },
  {
    id: '7', name: 'Joice Chaves dos Santos',
    affiliation: 'UFBA', image: '/assets/fotos/joice-chaves.webp',
    linkedin: 'https://www.linkedin.com/in/joice-chaves-3bb314194',
    lattes: 'https://wwws.cnpq.br/cvlattesweb/PKG_MENU.menu?f_cod=3E7AB3CAE43F946656BE6076373563BA',
  },
  {
    id: '8', name: 'Gabriel Gomes Ribeiro',
    affiliation: 'Horus CDA', image: '/assets/fotos/gabriel-gomes.webp',
    linkedin: 'https://www.linkedin.com/in/gabriel-gomes-ribeiro-a1375a269',
    lattes: 'https://wwws.cnpq.br/cvlattesweb/PKG_MENU.menu?f_cod=55B4DADA7AF347C9CDA618D5A89F39A9',
  },
  {
    id: '9', name: 'Juliano Bortolini',
    affiliation: 'UFMT', image: '/assets/fotos/juliano-bortolini.webp',
    lattes: 'http://lattes.cnpq.br/6210909768845403',
  },
  {
    id: '10', name: 'João Paulo Sardo Madi',
    affiliation: 'UFMT', image: '/assets/fotos/joao-paulo.webp',
    lattes: 'http://lattes.cnpq.br/8850927226945171',
  },
  {
    id: '11', name: 'Hudson José da Silva Macedo',
    affiliation: 'UFMT', image: '/assets/fotos/hudson-macedo.webp',
    linkedin: 'https://www.linkedin.com/in/hudson-macedo41',
    lattes: 'http://lattes.cnpq.br/9046947078043148',
  },
  {
    id: '12', name: 'Caio Vinicius Costa dos Anjos',
    affiliation: 'UFBA', image: '/assets/fotos/caio-vinicius.webp',
    linkedin: 'https://www.linkedin.com/in/caioviniciusanjos',
  },
  {
    id: '13', name: 'Nailton Santos dos Prazeres',
    affiliation: 'UFBA', image: '/assets/fotos/nailton-santos.webp',
    linkedin: 'https://www.linkedin.com/in/nailton-santos-5420a3355/',
    lattes: 'http://lattes.cnpq.br/2356216890935968',
  },
  {
    id: '14', name: 'Amanda Mota Passos',
    affiliation: 'UFBA', image: '/assets/fotos/amanda-passos.webp',
    linkedin: 'https://www.linkedin.com/in/amanda-mota-passos/',
    lattes: 'http://lattes.cnpq.br/0574903512327729',
  },
  {
    id: '15', name: 'Victor Alessandry Sousa dos Santos',
    affiliation: 'UFBA', image: '/assets/fotos/victor-alessandry.webp',
    linkedin: 'https://www.linkedin.com/in/victor-alessandry-7b36b62ba',
    lattes: 'http://lattes.cnpq.br/6554265104646709',
  },
  {
    id: '16', name: 'Tainara Vitória Santos da Costa',
    affiliation: 'UFBA', image: '/assets/fotos/tainara-vitoria.webp',
    linkedin: 'https://www.linkedin.com/in/tainara-costa-270403209',
    lattes: 'http://lattes.cnpq.br/4434417633702996',
  },
  {
    id: '17', name: 'Isabel de Lima Santos da Silva',
    affiliation: 'UFBA', image: '/assets/fotos/isabel-lima.webp',
    linkedin: 'https://www.linkedin.com/in/isabel-de-lima-a63b74234/',
    lattes: 'http://lattes.cnpq.br/4098121796970711',
  },
  {
    id: '18', name: 'Thiago de Almeida Silva',
    affiliation: 'UFBA', image: '/assets/fotos/thiago-silva.webp',
  },
  {
    id: '19', name: 'Matheus Conceição dos Santos',
    affiliation: 'UFBA', image: '/assets/fotos/matheus-conceicao.webp',
    linkedin: 'https://www.linkedin.com/in/matheusconceicao1/',
    lattes: 'http://lattes.cnpq.br/3655440095066898',
  },
  {
    id: '20', name: 'Leonardo Rodrigues',
    affiliation: 'UFBA', image: '/assets/fotos/leonardo-rodrigues.webp',
  },
  {
    id: '22', name: 'ANDERSON LUIZ ARA SOUZA',
    affiliation: 'UFPR', image: '/assets/fotos/anderson-ara.webp',
    linkedin: 'https://www.linkedin.com/in/andersonara',
    lattes: 'http://lattes.cnpq.br/8916772290938469',
  },
  {
    id: '23', name: 'Diego Carvalho do Nascimento',
    affiliation: 'NEOMA Business School', image: '/assets/fotos/diego-nascimento.webp',
    linkedin: 'https://www.linkedin.com/in/dnascimento05/',
    lattes: 'http://lattes.cnpq.br/9348789538818546',
  },
];

export const PUBLICATIONS: Publication[] = [
  {
    id: '1',
    year: 2025,
    title: 'A Bayesian approach to predict performance in football: a case study',
    journal: 'Frontiers in Sports and Active Living',
    authors: 'Paulo H. Ferreira, Lilia C. Costa, Diego Nascimento',
    link: 'https://doi.org/10.3389/fspor.2025.1486928',
    abstract: ''
  },
  {
    id: '2',
    year: 2025,
    title: 'An analysis of goal timing in South American Football: Effects of the COVID-19 pandemic and tournament context',
    journal: 'Communications in Statistics: Case Studies, Data Analysis and Applications',
    authors: 'Francisco Louzada, Paulo H. Ferreira, Adriano Suzuki',
    link: 'https://doi.org/10.1080/23737484.2025.2522362',
    abstract: ''
  },
  {
    id: '3',
    year: 2021,
    title: 'Is Football/Soccer Purely Stochastic, Made Out of Luck, or Maybe Predictable? How Does Bayesian Reasoning Assess Sports?',
    journal: 'Axioms',
    authors: 'Paulo H. Ferreira, Francisco Louzada, Diego Nascimento',
    link: 'https://doi.org/10.3390/axioms10040276',
    abstract: ''
  },
  {
    id: '4',
    year: 2016,
    title: 'iSports: A web-oriented expert system for talent identification in soccer',
    journal: 'Expert Systems with Applications',
    authors: 'Francisco Louzada, Anderson Ara',
    link: 'https://doi.org/10.1016/j.eswa.2015.09.007',
    abstract: ''
  },
  {
    id: '5',
    year: 2016,
    title: 'Predicting football scores via Poisson regression model: applications to the National Football League',
    journal: 'Communications for Statistical Applications and Methods',
    authors: 'Francisco Louzada, Adriano Suzuki',
    link: 'https://doi.org/10.5351/CSAM.2016.23.4.297',
    abstract: ''
  },
  {
    id: '6',
    year: 2015,
    title: 'A Bayesian Approach to Predicting Football Match Outcomes Considering Time Effect Weight',
    journal: 'Springer Proceedings in Mathematics & Statistics',
    authors: 'Francisco Louzada, Adriano Suzuki, Anderson Ara',
    link: 'https://doi.org/10.1007/978-3-319-12454-4_12',
    abstract: ''
  },
  {
    id: '7',
    year: 2014,
    title: 'Predicting Match Outcomes in the English Premier League: Which Will Be the Final Rank?',
    journal: 'Journal of Data Science',
    authors: 'Francisco Louzada, Adriano Suzuki',
    link: 'https://doi.org/10.6339/JDS.201404_12(2).0002',
    abstract: ''
  }
];

export const MEDIA_MENTIONS: MediaMention[] = [
  { 
    id: '1', 
    outlet: 'UFSCar', 
    logo: 'SACI', 
    date: 'Dez 05, 2025', 
    title: 'Por meio do site Previsão Esportiva, a população pode conferir previsões semanais', 
    link: 'https://www.saci.ufscar.br/servico_clipping?id=28151',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800' // Data visualization
  },
  { 
    id: '2', 
    outlet: 'CeMEAI - USP', 
    logo: 'USP', 
    date: 'Dez 05, 2025', 
    title: 'Previsão esportiva: CeMEAI aplica ciência de dados no futebol', 
    link: 'https://cemeai.icmc.usp.br/previsao-esportiva/',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800' // Education/Math
  },
  { 
    id: '3', 
    outlet: 'Google Sites', 
    logo: 'GS', 
    date: 'Dez 05, 2025', 
    title: 'Equipe Previsão Esportiva: Conheça os pesquisadores por trás do projeto', 
    link: 'https://sites.google.com/view/previsaoesportiva/equipe-previs%C3%A3o-esportiva',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800' // Teamwork
  },
  { 
    id: '4', 
    outlet: 'São Carlos Agora', 
    logo: 'SCA', 
    date: 'Dez 05, 2025', 
    title: 'Projeto da UFSCar recebe palpites para Copa do Mundo', 
    link: 'https://www.saocarlosagora.com.br/esportes/projeto-da-ufscar-recebe-palpites-para-copa-do-mundo/102693/',
    imageUrl: 'https://images.unsplash.com/photo-1518605348416-72580200d3f8?auto=format&fit=crop&q=80&w=800' // Soccer Ball
  },
  { 
    id: '5', 
    outlet: 'ICMC USP', 
    logo: 'ICMC', 
    date: 'Jun 2014', 
    title: 'Seleção campeã da Copa é prevista por grupo de estatística da UFSCar e do ICMC', 
    link: 'http://icmc-usp.blogspot.com/2014/06/selecao-campea-da-copa-e-prevista-por.html',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bde9be2b?auto=format&fit=crop&q=80&w=800' // Analytics
  },
  { 
    id: '6', 
    outlet: 'UFPR', 
    logo: 'UFPR', 
    date: 'Dez 05, 2025', 
    title: 'Projeto realizado pela UFPR aponta a Argentina como provável campeã da Copa do Mundo 2022', 
    link: 'https://ufpr.br/projeto-realizado-pela-ufpr-aponta-a-argentina-como-provavel-campea-da-copa-do-mundo-2022/',
    imageUrl: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&q=80&w=800' // Argentina Colors/Soccer
  },
  { 
    id: '7', 
    outlet: 'USP Notícias', 
    logo: 'USP', 
    date: 'Dez 05, 2025', 
    title: 'Site sobre o Brasileirão usa modelo estatístico que acertou final da copa', 
    link: 'https://www5.usp.br/noticias/site-do-icmc-sobre-o-brasileirao-usa-modelo-estatistico-que-acertou-final-da-copa/',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800' // Charts
  },
  { 
    id: '8', 
    outlet: 'SACI - UFSCar', 
    logo: 'SACI', 
    date: 'Dez 05, 2025', 
    title: 'Brasil tem maior chance de vencer a Copa, diz estudo estatístico', 
    link: 'https://www.saci.ufscar.br/data/clipping/pdfs/30223_00.pdf',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800' // Brazil
  },
  { 
    id: '9', 
    outlet: 'Revista Veja', 
    logo: 'VEJA', 
    date: 'Dez 05, 2025', 
    title: 'Copa: Modelo matemático confirma favoritismo do Brasil, dizem cientistas', 
    link: 'https://veja.abril.com.br/ciencia/copa-modelo-matematico-confirma-favoritismo-do-brasil-dizem-cientistas/',
    imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800' // News/Reading
  },
  { 
    id: '10', 
    outlet: 'São Carlos Dia e Noite', 
    logo: 'SCDN', 
    date: 'Dez 05, 2025', 
    title: 'Estatísticos projetam: Brasil é o país com mais chances de vencer a Copa do Mundo', 
    link: 'https://saocarlosdiaenoite.com.br/noticia/75138/estatisticos-projetam-brasil-e-o-pais-com-mais-chances-de-vencer-a-copa-do-mundo',
    imageUrl: 'https://images.unsplash.com/photo-1556910638-6cdac58d675b?auto=format&fit=crop&q=80&w=800' // Brazil Flag/Soccer
  },
  { 
    id: '11', 
    outlet: 'Análise Real', 
    logo: 'AR', 
    date: 'Jun 15, 2014', 
    title: 'Previsões para a copa: USP e UFSCar x Nate Silver x Céticos', 
    link: 'https://analisereal.com/2014/06/15/previsoes-para-a-copa-usp-e-ufscar-x-nate-silver-x-ceticos/',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800' // Data Comparison
  },
  { 
    id: '12', 
    outlet: 'G1', 
    logo: 'G1', 
    date: 'Dez 31, 1969', 
    title: 'Brasil e Alemanha devem disputar final da Copa da Rússia, diz estatística da UFSCar', 
    link: 'https://g1.globo.com/sp/sao-carlos-regiao/noticia/brasil-e-alemanha-devem-disputar-final-da-copa-da-russia-diz-estatistica-da-ufscar.ghtml',
    imageUrl: 'https://images.unsplash.com/photo-1510051640316-54084b11492e?auto=format&fit=crop&q=80&w=800' // Russia/Soccer
  },
  { 
    id: '13', 
    outlet: 'CeMEAI', 
    logo: 'CeMEAI', 
    date: 'Dez 05, 2025', 
    title: 'Brasil e Alemanha devem disputar final da Copa da Rússia, diz estatística da UFSCar', 
    link: 'https://cemeai.icmc.usp.br/brasil-e-alemanha-devem-disputar-final-da-copa-da-russia-diz-estatistica-da-ufscar/',
    imageUrl: 'https://images.unsplash.com/photo-1516146544193-b54a65682f16?auto=format&fit=crop&q=80&w=800' // Tech
  },
  { 
    id: '14', 
    outlet: 'Jornal Grande Bahia', 
    logo: 'JGB', 
    date: 'Dez 05, 2025', 
    title: 'Reportagem Especial: Poder e Sociedade - A matemática da Copa', 
    link: 'https://jornalgrandebahia.com.br/category/poder-e-sociedade/reportagem-especial/page/153/?amp',
    imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=800' // Newspaper
  },
  { 
    id: '15', 
    outlet: 'Jornal Grande Bahia', 
    logo: 'JGB', 
    date: 'Jun 2018', 
    title: 'Estatísticos apontam Espanha como país vencedor da Copa do Mundo Rússia 2018', 
    link: 'https://jornalgrandebahia.com.br/2018/06/estatisticos-apontam-espanha-como-pais-vencedor-da-copa-do-mundo-russia-2018/',
    imageUrl: 'https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&q=80&w=800' // Spain/Soccer
  },
  { 
    id: '16', 
    outlet: 'FAPESP Na Mídia', 
    logo: 'FAPESP', 
    date: 'Dez 05, 2025', 
    title: 'Copa do Catar: favorito, Brasil tem 15% de chances de levar o hexa, aponta previsão', 
    link: 'https://namidia.fapesp.br/copa-do-catar-favorito-brasil-tem-15-de-chances-de-levar-o-hexa-aponta-previsao-de-estatisticos/411978',
    imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800' // Qatar
  },
  { 
    id: '17', 
    outlet: 'Agência FAPESP', 
    logo: 'FAPESP', 
    date: 'Dez 05, 2025', 
    title: 'Cientistas usam inteligência artificial e projetam que Brasil é favorito para vencer a Copa', 
    link: 'https://agencia.fapesp.br/cientistas-usam-inteligencia-artificial-e-projetam-que-brasil-e-favorito-para-vencer-a-copa-do-catar/40199',
    imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800' // AI/Chip
  },
  { 
    id: '18', 
    outlet: 'Ensaios e Notas', 
    logo: 'EN', 
    date: 'Dez 01, 2022', 
    title: 'Previsão para a final da Copa: Análise crítica', 
    link: 'https://ensaiosenotas.com/2022/12/01/previsao-para-a-final-da-copa/',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800' // Writing
  },
  { 
    id: '19', 
    outlet: 'Vitrine UFSCar', 
    logo: 'UFSCar', 
    date: 'Dez 05, 2025', 
    title: 'Vitrine UFSCar: Produção acadêmica em destaque', 
    link: 'https://vitrine.ufscar.br/docentes/702352',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800' // University/Graduation
  }
];
