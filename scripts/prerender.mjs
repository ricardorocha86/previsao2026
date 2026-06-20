/**
 * Prerender estático pós-build (Node puro, sem headless browser).
 *
 * Por quê: o site é um SPA React renderizado no cliente. O HTML servido é só
 * `<div id="root"></div>`, então o Google (e crawlers de preview) recebem uma
 * página vazia na primeira leitura. Este script gera um `index.html` por rota
 * com:
 *   - <title>, description, canonical e tags Open Graph/Twitter CORRETAS por rota
 *   - um bloco de conteúdo textual indexável (H1 + parágrafos) dentro de #root
 *   - links <a href> internos para todas as rotas (crawlability — a navegação
 *     do app é feita só com <button>, então não há links para o robô seguir)
 *
 * O bloco em #root é substituído pelo React assim que o app monta, então o
 * usuário continua vendo a SPA normal; ele existe para os robôs.
 *
 * É a ÚNICA fonte de verdade do sitemap.xml — adicionar/alterar rota aqui
 * mantém HTML e sitemap em sincronia automaticamente.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const ORIGIN = 'https://www.previsaoesportiva.com.br';
const OG_IMAGE = `${ORIGIN}/assets/copa_previsoes_hero.webp`;

/** Fonte de verdade das rotas. Espelha ROUTES/PAGE_META em App.tsx. */
const routes = [
  {
    path: '/',
    changefreq: 'daily',
    priority: '1.0',
    linkLabel: 'Início',
    title: 'Previsão Esportiva - Copa do Mundo 2026 🏆',
    description:
      'Previsões probabilísticas para a Copa do Mundo 2026 com metodologia científica. Projeto acadêmico de pesquisa e divulgação científica em modelagem estatística do futebol.',
    h1: 'Previsão Esportiva — probabilidades da Copa do Mundo 2026',
    body: [
      'O Previsão Esportiva é um projeto acadêmico de divulgação científica que calcula, com modelagem estatística, as probabilidades de cada seleção avançar de fase e ser campeã da Copa do Mundo de 2026.',
      'Explore as previsões da Copa 2026, o mapa interativo das 48 seleções, o simulador de partidas, o bolão e a metodologia científica por trás de cada número.',
    ],
  },
  {
    path: '/copa-2026',
    changefreq: 'daily',
    priority: '0.9',
    linkLabel: 'Previsões Copa 2026',
    title: 'Previsões Copa do Mundo 2026 | Previsão Esportiva',
    description:
      'Probabilidades de cada seleção avançar de fase e ser campeã da Copa do Mundo 2026, a partir de simulação estatística do torneio.',
    h1: 'Previsões da Copa do Mundo 2026',
    body: [
      'Veja as probabilidades atualizadas de cada uma das 48 seleções avançar de fase e conquistar o título da Copa do Mundo de 2026, calculadas a partir de milhões de simulações estatísticas do torneio.',
      'As estimativas combinam a força das seleções, rankings e dados de mercado, e são recalculadas a cada rodada.',
    ],
  },
  {
    path: '/bolao',
    changefreq: 'weekly',
    priority: '0.8',
    linkLabel: 'Bolão',
    title: 'Bolão Copa do Mundo 2026 | Previsão Esportiva',
    description:
      'Faça seus palpites para a Copa do Mundo 2026 e participe do bolão do projeto Previsão Esportiva.',
    h1: 'Bolão da Copa do Mundo 2026',
    body: [
      'Participe do bolão do Previsão Esportiva: faça seus palpites para os jogos da Copa do Mundo de 2026 e acompanhe como você se sai diante do modelo estatístico.',
    ],
  },
  {
    path: '/mapa',
    changefreq: 'weekly',
    priority: '0.6',
    linkLabel: 'Mapa das seleções',
    title: 'Mapa das Seleções | Previsão Esportiva',
    description:
      'Explore dados das 48 seleções classificadas para a Copa do Mundo 2026 em um mapa interativo.',
    h1: 'Mapa das seleções da Copa do Mundo 2026',
    body: [
      'Explore as 48 seleções classificadas para a Copa do Mundo de 2026 em um mapa interativo, com dados e probabilidades de cada país.',
    ],
  },
  {
    path: '/simulador',
    changefreq: 'weekly',
    priority: '0.7',
    linkLabel: 'Simulador',
    title: 'Simulador Interativo | Previsão Esportiva',
    description:
      'Simule partidas e cenários da Copa do Mundo 2026 com os modelos estatísticos do Previsão Esportiva.',
    h1: 'Simulador da Copa do Mundo 2026',
    body: [
      'Simule partidas e cenários da Copa do Mundo de 2026 com os modelos estatísticos do Previsão Esportiva e veja como cada resultado altera as chances de título de cada seleção.',
    ],
  },
  {
    path: '/metodologia',
    changefreq: 'monthly',
    priority: '0.6',
    linkLabel: 'Metodologia',
    title: 'Metodologia | Previsão Esportiva',
    description:
      'Como transformamos dados de seleções em probabilidades: o modelo estatístico do Previsão Esportiva, passo a passo.',
    h1: 'Metodologia científica do Previsão Esportiva',
    body: [
      'Entenda, passo a passo, como transformamos dados das seleções em probabilidades: o modelo estatístico baseado na distribuição de Poisson, a estimativa de força das equipes e a calibração ao mercado.',
    ],
  },
  {
    path: '/pesquisa',
    changefreq: 'monthly',
    priority: '0.6',
    linkLabel: 'Artigos científicos',
    title: 'Artigos Científicos | Previsão Esportiva',
    description:
      'Publicações acadêmicas que fundamentam a metodologia estatística do projeto Previsão Esportiva.',
    h1: 'Artigos científicos e pesquisa',
    body: [
      'Publicações acadêmicas e artigos científicos que fundamentam a metodologia estatística do projeto Previsão Esportiva.',
    ],
  },
  {
    path: '/midia',
    changefreq: 'monthly',
    priority: '0.6',
    linkLabel: 'Na mídia',
    title: 'Na Mídia | Previsão Esportiva',
    description:
      'Cobertura jornalística e repercussão pública das previsões científicas do projeto Previsão Esportiva.',
    h1: 'Previsão Esportiva na mídia',
    body: [
      'Cobertura jornalística e repercussão pública das previsões científicas do projeto Previsão Esportiva.',
    ],
  },
  {
    path: '/equipe',
    changefreq: 'monthly',
    priority: '0.5',
    linkLabel: 'Equipe',
    title: 'Equipe de Pesquisa | Previsão Esportiva',
    description:
      'Conheça os pesquisadores e as instituições por trás do projeto Previsão Esportiva.',
    h1: 'Equipe de pesquisa',
    body: [
      'Conheça os pesquisadores e as instituições por trás do projeto Previsão Esportiva.',
    ],
  },
  {
    path: '/caminho-do-hexa',
    changefreq: 'weekly',
    priority: '0.8',
    linkLabel: 'Hexa — análise atual',
    title: 'A Copa Mudou de Rosto | Previsão Esportiva',
    description:
      'O que a primeira rodada da Copa do Mundo de 2026 mudou nas probabilidades: França assume a ponta, Brasil recua e novas forças entram no mapa.',
    h1: 'A Copa Mudou de Rosto',
    body: [
      'Depois dos 24 jogos da primeira rodada, comparamos um milhão de novas simulações com o retrato anterior ao início da Copa do Mundo de 2026.',
      'A França assumiu a liderança, Argentina e Inglaterra avançaram, Espanha perdeu a ponta e o Brasil recuou de 8,3% para 6,6% de chance de título.',
    ],
  },
  {
    path: '/caminho-do-hexa/inicio-da-copa',
    changefreq: 'monthly',
    priority: '0.6',
    linkLabel: 'Hexa — início da Copa',
    title: 'O Caminho Rumo ao Hexa 🇧🇷 | Previsão Esportiva',
    description:
      'O retrato de um milhão de simulações antes de a bola rolar na Copa do Mundo de 2026.',
    h1: 'O caminho do Brasil rumo ao Hexa antes da Copa',
    body: [
      'Rodamos a Copa do Mundo de 2026 um milhão de vezes antes de a bola rolar. Esta edição preserva o retrato original do caminho do Brasil rumo ao hexa.',
    ],
  },
];

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const escapeAttr = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

/** Navegação com links reais para todas as rotas (crawlability). */
const navLinks = routes
  .map(
    (r) =>
      `<a href="${escapeAttr(r.path)}" style="color:#209927;font-weight:600;text-decoration:none;">${escapeHtml(
        r.linkLabel,
      )}</a>`,
  )
  .join('');

/** Conteúdo indexável injetado em #root (o React substitui ao montar). */
const seoBlock = (r) =>
  `<div id="seo-fallback" style="max-width:48rem;margin:0 auto;padding:3rem 1.5rem;font-family:'Open Sans',system-ui,sans-serif;color:#1a1a1a;">` +
  `<h1 style="font-family:'Anton',system-ui,sans-serif;font-size:2rem;line-height:1.1;color:#209927;margin:0 0 1rem;">${escapeHtml(
    r.h1,
  )}</h1>` +
  r.body
    .map((p) => `<p style="margin:1rem 0;line-height:1.6;">${escapeHtml(p)}</p>`)
    .join('') +
  `<nav aria-label="Seções do site" style="margin-top:2rem;display:flex;flex-wrap:wrap;gap:1rem;">${navLinks}</nav>` +
  `</div>`;

const template = readFileSync(join(DIST, 'index.html'), 'utf8');

const buildHtml = (r) => {
  const url = r.path === '/' ? `${ORIGIN}/` : `${ORIGIN}${r.path}`;
  const title = escapeHtml(r.title);
  const descAttr = escapeAttr(r.description);
  let html = template;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  html = html.replace(
    /<meta\s+name="description"[\s\S]*?\/>/,
    `<meta name="description" content="${descAttr}" />`,
  );
  html = html.replace(
    /<link rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${escapeAttr(url)}" />`,
  );
  html = html.replace(
    /<meta property="og:url"[^>]*>/,
    `<meta property="og:url" content="${escapeAttr(url)}" />`,
  );
  html = html.replace(
    /<meta property="og:title"[^>]*>/,
    `<meta property="og:title" content="${title}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:description"[\s\S]*?\/>/,
    `<meta property="og:description" content="${descAttr}" />`,
  );
  html = html.replace(
    /<meta property="og:image"[^>]*>/,
    `<meta property="og:image" content="${escapeAttr(OG_IMAGE)}" />`,
  );
  html = html.replace(
    /<meta name="twitter:title"[^>]*>/,
    `<meta name="twitter:title" content="${title}" />`,
  );
  html = html.replace(
    /<meta\s+name="twitter:description"[\s\S]*?\/>/,
    `<meta name="twitter:description" content="${descAttr}" />`,
  );
  html = html.replace(
    /<div id="root">\s*<\/div>/,
    `<div id="root">${seoBlock(r)}</div>`,
  );
  return html;
};

for (const r of routes) {
  const html = buildHtml(r);
  const outPath =
    r.path === '/'
      ? join(DIST, 'index.html')
      : join(DIST, r.path.replace(/^\//, ''), 'index.html');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, 'utf8');
}

// Sitemap regenerado a partir da MESMA lista de rotas (nunca diverge).
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes
    .map((r) => {
      const loc = r.path === '/' ? `${ORIGIN}/` : `${ORIGIN}${r.path}`;
      return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`;
    })
    .join('\n') +
  `\n</urlset>\n`;
writeFileSync(join(DIST, 'sitemap.xml'), sitemap, 'utf8');

console.log(`✓ prerender: ${routes.length} rotas + sitemap.xml geradas em dist/`);
