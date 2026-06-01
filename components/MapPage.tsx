import React, { useEffect, useRef, useState } from 'react';
import { Globe2 } from 'lucide-react';
import PageHeader from './PageHeader';
import dados from '../assets/dados_copa2026.json';

const D3_SRC = 'https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js';
const TOPOJSON_SRC = 'https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js';
const WORLD_ATLAS = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`) as (HTMLScriptElement & { _loaded?: boolean }) | null;
    if (existing) {
      if (existing._loaded) return resolve();
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('failed ' + src)));
      return;
    }
    const s = document.createElement('script') as HTMLScriptElement & { _loaded?: boolean };
    s.src = src;
    s.async = true;
    s.onload = () => { s._loaded = true; resolve(); };
    s.onerror = () => reject(new Error('failed ' + src));
    document.head.appendChild(s);
  });
}

const escurece = (hex: string, f: number) => {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round((n >> 16) * (1 - f));
  const gg = Math.round(((n >> 8) & 255) * (1 - f));
  const b = Math.round((n & 255) * (1 - f));
  return '#' + (1 << 24 | r << 16 | gg << 8 | b).toString(16).slice(1);
};
const confKey = (conf: string) => conf.split(' (')[0];

const MapPage: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};

    (async () => {
      try {
        await Promise.all([loadScript(D3_SRC), loadScript(TOPOJSON_SRC)]);
      } catch {
        if (!cancelled) setStatus('error');
        return;
      }
      if (cancelled) return;

      const d3 = (window as any).d3;
      const topojson = (window as any).topojson;
      const wrap = wrapRef.current!;
      const svgEl = svgRef.current!;
      const card = cardRef.current!;
      const isMobile = () => window.matchMedia('(max-width:640px)').matches;

      const svg = d3.select(svgEl);
      svg.selectAll('*').remove();

      const TEAMS: Record<string, any> = (dados as any).selecoes;
      const CONF: Record<string, any> = (dados as any).confederacoes;
      const MAXPROB = Math.max(...Object.values(TEAMS).map((t: any) => +t.prob || 0), 1);

      let width = wrap.clientWidth;
      let height = wrap.clientHeight;

      const projection = d3.geoNaturalEarth1();
      const path = d3.geoPath(projection);
      const g = svg.append('g');

      const defs = svg.append('defs');
      const og = defs.append('radialGradient').attr('id', 'mp-ocean')
        .attr('cx', '50%').attr('cy', '40%').attr('r', '75%');
      og.append('stop').attr('offset', '0%').attr('stop-color', '#16344a');
      og.append('stop').attr('offset', '100%').attr('stop-color', '#0a141c');

      const f = defs.append('filter').attr('id', 'mp-glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
      f.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'b');
      const merge = f.append('feMerge');
      merge.append('feMergeNode').attr('in', 'b');
      merge.append('feMergeNode').attr('in', 'SourceGraphic');

      const cf = defs.append('filter').attr('id', 'mp-champGlow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
      cf.append('feDropShadow').attr('dx', 0).attr('dy', 0).attr('stdDeviation', 2.2)
        .attr('flood-color', '#fff6cf').attr('flood-opacity', 0.95);

      for (const [k, c] of Object.entries(CONF)) {
        const lg = defs.append('linearGradient').attr('id', 'mp-g-' + k)
          .attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%');
        lg.append('stop').attr('offset', '0%').attr('stop-color', (c as any).cor);
        lg.append('stop').attr('offset', '100%').attr('stop-color', escurece((c as any).cor, 0.28));
      }

      g.append('path').attr('class', 'mp-sphere').attr('d', path({ type: 'Sphere' }));
      const graticule = d3.geoGraticule10();
      g.append('path').attr('class', 'mp-graticule').attr('d', path(graticule));

      const zoom = d3.zoom().scaleExtent([1, 8]).on('zoom', (e: any) => {
        g.attr('transform', e.transform);
        g.selectAll('.mp-country').attr('stroke-width', 0.4 / Math.sqrt(e.transform.k));
      });
      svg.call(zoom);

      const fit = () => {
        width = wrap.clientWidth;
        height = wrap.clientHeight;
        svg.attr('width', width).attr('height', height);
        projection.fitExtent([[10, 20], [width - 10, height - 20]], { type: 'Sphere' });
        g.select('.mp-sphere').attr('d', path({ type: 'Sphere' }));
        g.select('.mp-graticule').attr('d', path(graticule));
        g.selectAll('.mp-country').attr('d', path);
      };

      const all = () => g.selectAll('.mp-country');

      const fillCard = (t: any) => {
        const q = (sel: string) => card.querySelector(sel) as HTMLElement;
        (q('[data-c="flag"]') as HTMLImageElement).src = `https://flagcdn.com/w160/${t.iso2}.png`;
        q('[data-c="name"]').textContent = t.nome;
        const cb = q('[data-c="conf"]');
        cb.textContent = t.conf;
        const cor = (CONF[confKey(t.conf)] || {}).cor || '#9fb3c0';
        cb.style.background = cor + '33';
        cb.style.color = cor;
        const prob = +t.prob || 0;
        q('[data-c="prob"]').textContent = prob.toFixed(1).replace('.', ',') + '%';
        const fill = q('[data-c="prob-fill"]');
        fill.style.width = '0%';
        void fill.offsetWidth;
        fill.style.width = Math.max(3, (prob / MAXPROB) * 100) + '%';
        q('[data-c="part"]').textContent = t.part + 'x';
        q('[data-c="gols"]').textContent = t.gols;
        q('[data-c="art"]').textContent = t.art;
        q('[data-c="best"]').textContent = t.best;
        const stars = q('[data-c="stars"]');
        stars.textContent = t.titulos > 0 ? '★'.repeat(t.titulos) : '';
        stars.style.color = '#f4c430';
        (card.querySelector('.mp-card-top') as HTMLElement).style.backgroundImage =
          `url(https://flagcdn.com/w320/${t.iso2}.png)`;
        const st = q('[data-c="status"]');
        if (t.titulos > 0) {
          st.className = 'mp-badge-status mp-badge-champ';
          st.style.background = '';
          st.style.color = '';
          st.textContent = `★ Campeão Mundial ${t.titulos}x`;
        } else {
          st.className = 'mp-badge-status';
          st.style.background = cor + '26';
          st.style.color = cor;
          st.textContent = 'Classificada para 2026';
        }
      };

      function onEnter(this: any, _event: any, d: any) {
        const t = TEAMS[d.id];
        if (!t) return;
        all().classed('mp-dim', (n: any) => !TEAMS[n.id]);
        d3.select(this).raise().classed('mp-hl', true);
        fillCard(t);
        card.classList.add('mp-show');
      }
      function onMove(event: any) {
        if (isMobile()) return;
        const rect = wrap.getBoundingClientRect();
        const pad = 18, w = 320, h = card.offsetHeight || 300;
        let x = event.clientX - rect.left + pad;
        let y = event.clientY - rect.top + pad;
        if (x + w > rect.width) x = event.clientX - rect.left - w - pad;
        if (y + h > rect.height) y = event.clientY - rect.top - h - pad;
        card.style.left = Math.max(8, x) + 'px';
        card.style.top = Math.max(8, y) + 'px';
      }
      function onLeave(this: any) {
        d3.select(this).classed('mp-hl', false);
        all().classed('mp-dim', false);
        card.classList.remove('mp-show');
      }
      function onClick(this: any, _event: any, d: any) {
        const t = TEAMS[d.id];
        if (!t) return;
        if (isMobile()) {
          all().classed('mp-dim', (n: any) => !TEAMS[n.id]).classed('mp-hl', false);
          d3.select(this).raise().classed('mp-hl', true);
          fillCard(t);
          card.classList.add('mp-show');
        }
        const [[x0, y0], [x1, y1]] = path.bounds(d);
        const dx = x1 - x0, dy = y1 - y0, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
        const k = Math.min(8, 0.65 / Math.max(dx / width, dy / height));
        svg.transition().duration(800).call(
          zoom.transform,
          d3.zoomIdentity.translate(width / 2, height / 2).scale(k).translate(-cx, -cy)
        );
      }

      svg.on('click', function (event: any) {
        if (event.target.tagName === 'svg' || event.target.classList.contains('mp-sphere')) {
          svg.transition().duration(700).call(zoom.transform, d3.zoomIdentity);
          all().classed('mp-dim', false).classed('mp-hl', false);
          card.classList.remove('mp-show');
        }
      });

      const buildLegend = () => {
        const el = legendRef.current!;
        let html = '';
        for (const c of Object.values(CONF)) {
          html += `<div class="mp-item"><span class="mp-swatch" style="background:${(c as any).cor}"></span>${(c as any).nome}</div>`;
        }
        html += `<div class="mp-item"><span class="mp-swatch mp-sw-champ"></span>★ Campeão mundial</div>`;
        html += `<div class="mp-item"><span class="mp-swatch mp-sw-grey"></span>Não classificada</div>`;
        el.innerHTML = html;
      };

      let world: any;
      try {
        world = await d3.json(WORLD_ATLAS);
      } catch {
        if (!cancelled) setStatus('error');
        return;
      }
      if (cancelled) return;

      buildLegend();

      const countries = topojson.feature(world, world.objects.countries).features;

      const EUROPA = [[-12, 35], [30, 60]];
      const SO_EUROPA: Record<string, number[][]> = { '250': EUROPA, '528': EUROPA };
      const centroideAnel = (r: any[]) => { let x = 0, y = 0; for (const p of r) { x += p[0]; y += p[1]; } return [x / r.length, y / r.length]; };
      const dentro = (c: number[], b: number[][]) => c[0] >= b[0][0] && c[0] <= b[1][0] && c[1] >= b[0][1] && c[1] <= b[1][1];
      for (const ft of countries) {
        const box = SO_EUROPA[String(ft.id).padStart(3, '0')];
        if (box && ft.geometry.type === 'MultiPolygon') {
          ft.geometry.coordinates = ft.geometry.coordinates.filter((poly: any) => dentro(centroideAnel(poly[0]), box));
        }
      }

      g.selectAll('.mp-country')
        .data(countries)
        .join('path')
        .attr('class', (d: any) => {
          const t = TEAMS[d.id];
          if (!t) return 'mp-country';
          return t.titulos > 0 ? 'mp-country mp-team mp-champion' : 'mp-country mp-team';
        })
        .style('fill', (d: any) => {
          const t = TEAMS[d.id];
          return t ? `url(#mp-g-${confKey(t.conf)})` : null;
        })
        .attr('d', path)
        .on('mouseenter', onEnter)
        .on('mousemove', onMove)
        .on('mouseleave', onLeave)
        .on('click', onClick);

      fit();
      if (!cancelled) setStatus('ready');

      const ro = new ResizeObserver(() => fit());
      ro.observe(wrap);
      window.addEventListener('resize', fit);

      cleanup = () => {
        ro.disconnect();
        window.removeEventListener('resize', fit);
        svg.on('.zoom', null);
        svg.selectAll('*').remove();
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <div className="min-h-screen bg-brand-light pb-24 font-opensans">
      <style>{MAP_CSS}</style>
      <PageHeader
        icon={Globe2}
        eyebrow="Copa do Mundo FIFA 2026"
        title="Mapa das"
        accent="48 Seleções"
        description="Mapa interativo das seleções classificadas para a Copa do Mundo de 2026, com a chance estimada de cada uma ser campeã segundo a simulação pré-torneio da Previsão Esportiva."
      />

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div ref={wrapRef} className="mp-wrap relative w-full h-[78vh] min-h-[520px] max-h-[860px] rounded-[1.75rem] overflow-hidden border border-white/10 shadow-2xl">
          <svg ref={svgRef} className="mp-map" />

          <div ref={cardRef} className="mp-card">
            <div className="mp-card-top">
              <img className="mp-flag" data-c="flag" alt="" />
              <div className="mp-name-block">
                <div className="mp-pais" data-c="name" />
                <span className="mp-conf-badge" data-c="conf" />
              </div>
              <div className="mp-stars" data-c="stars" />
            </div>
            <div className="mp-card-body">
              <div className="mp-prob">
                <div className="mp-prob-head"><span className="mp-k">Chance de ser campeã</span><span className="mp-v" data-c="prob" /></div>
                <div className="mp-prob-bar"><i data-c="prob-fill" /></div>
              </div>
              <div className="mp-row"><span className="mp-k">Participações</span><span className="mp-v" data-c="part" /></div>
              <div className="mp-row"><span className="mp-k">Gols na história</span><span className="mp-v" data-c="gols" /></div>
              <div className="mp-row"><span className="mp-k">Maior artilheiro</span><span className="mp-v" data-c="art" /></div>
              <div className="mp-row"><span className="mp-k">Melhor campanha</span><span className="mp-v" data-c="best" /></div>
              <div className="mp-badge-status" data-c="status" />
            </div>
          </div>

          <div ref={legendRef} className="mp-legend" />

          <div className="mp-hint">Passe o mouse para ver a seleção · <b>clique</b> para dar zoom · clique no mar para voltar</div>

          {status !== 'ready' && (
            <div className="mp-loading">
              {status === 'error' ? 'Erro ao carregar o mapa. Verifique a conexão.' : 'CARREGANDO O MUNDO…'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MAP_CSS = `
.mp-wrap{
  --gold:#f4c430; --gold-2:#d99e1f; --grey:#2f3a44; --grey-line:#46555f;
  --ocean-1:#0a141c; --ocean-2:#122230; --card-bg:rgba(15,24,32,0.92);
  background:
    radial-gradient(1200px 700px at 70% -10%, #1b3a4f 0%, transparent 60%),
    radial-gradient(900px 600px at 10% 110%, #16313f 0%, transparent 55%),
    linear-gradient(160deg, var(--ocean-1), var(--ocean-2));
  color:#e9eef2;
}
.mp-map{position:absolute; inset:0; width:100%; height:100%; display:block}
.mp-country{fill:var(--grey); stroke:var(--grey-line); stroke-width:.4px;
  transition:fill .25s ease, opacity .25s ease; cursor:default}
.mp-country.mp-team{cursor:pointer}
.mp-country.mp-champion{stroke:#fff; stroke-width:1.1px; filter:url(#mp-champGlow)}
.mp-country.mp-dim{opacity:.32}
.mp-country.mp-hl{stroke:#fff; stroke-width:1.5px; filter:url(#mp-glow)}
.mp-sphere{fill:url(#mp-ocean)}
.mp-graticule{fill:none; stroke:rgba(255,255,255,.05); stroke-width:.5px}

.mp-legend{
  position:absolute; z-index:20; right:16px; bottom:16px;
  display:flex; flex-direction:column; gap:8px;
  padding:13px 15px; border-radius:14px;
  background:rgba(7,12,16,.62); backdrop-filter:blur(8px);
  border:1px solid rgba(255,255,255,.07); box-shadow:0 12px 34px rgba(0,0,0,.45);
}
.mp-legend .mp-item{display:flex; align-items:center; gap:8px; font-size:12.5px; font-weight:500; color:#cdd9e2}
.mp-swatch{width:13px; height:13px; border-radius:4px; flex:0 0 auto; box-shadow:0 0 0 1px rgba(255,255,255,.15)}
.mp-sw-champ{background:var(--grey); box-shadow:0 0 0 2px #fff, 0 0 9px rgba(255,255,255,.7)}
.mp-sw-grey{background:var(--grey)}

.mp-card{
  position:absolute; z-index:30; top:0; left:0;
  width:320px; pointer-events:none; opacity:0; transform:translateY(8px) scale(.97);
  transition:opacity .18s ease, transform .18s ease;
  background:var(--card-bg); border:1px solid rgba(255,255,255,.08);
  border-radius:18px; backdrop-filter:blur(10px);
  box-shadow:0 24px 60px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.03) inset;
  overflow:hidden;
}
.mp-card.mp-show{opacity:1; transform:translateY(0) scale(1)}
.mp-card-top{position:relative; height:96px; display:flex; align-items:flex-end;
  padding:14px 18px; background-size:cover; background-position:center}
.mp-card-top::after{content:''; position:absolute; inset:0;
  background:linear-gradient(180deg, rgba(8,14,18,.15), rgba(8,14,18,.92))}
.mp-flag{position:relative; z-index:2; width:62px; height:42px; border-radius:7px;
  object-fit:cover; box-shadow:0 6px 18px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.25)}
.mp-name-block{position:relative; z-index:2; margin-left:14px; padding-bottom:2px}
.mp-name-block .mp-pais{font-family:'Anton',sans-serif; font-size:25px; letter-spacing:.5px; line-height:1}
.mp-conf-badge{display:inline-block; margin-top:6px; padding:3px 9px; border-radius:99px;
  font-size:10.5px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase;
  background:rgba(255,255,255,.12); color:#dfe9f0}
.mp-stars{position:absolute; top:14px; right:16px; z-index:2; font-size:15px; letter-spacing:2px;
  filter:drop-shadow(0 1px 4px rgba(0,0,0,.6))}
.mp-card-body{padding:14px 18px 18px}
.mp-prob{margin-bottom:6px}
.mp-prob-head{display:flex; justify-content:space-between; align-items:baseline; margin-bottom:7px}
.mp-prob-head .mp-k{color:#90a2af; font-weight:500; font-size:13.5px}
.mp-prob-head .mp-v{font-family:'Anton',sans-serif; font-size:20px; line-height:1;
  background:linear-gradient(90deg,var(--gold),var(--gold-2));
  -webkit-background-clip:text; background-clip:text; color:transparent}
.mp-prob-bar{height:8px; border-radius:99px; background:rgba(255,255,255,.08); overflow:hidden}
.mp-prob-bar i{display:block; height:100%; width:0; border-radius:99px;
  background:linear-gradient(90deg,var(--gold-2),var(--gold));
  box-shadow:0 0 12px rgba(244,196,48,.5);
  transition:width .5s cubic-bezier(.2,.8,.2,1)}
.mp-row{display:flex; justify-content:space-between; align-items:center; padding:7px 0;
  border-bottom:1px solid rgba(255,255,255,.06); font-size:13.5px}
.mp-row:last-child{border-bottom:none}
.mp-row .mp-k{color:#90a2af; font-weight:500}
.mp-row .mp-v{color:#f1f6f9; font-weight:700; text-align:right; max-width:62%}
.mp-badge-status{display:inline-block; margin-top:12px; width:100%; text-align:center;
  padding:9px; border-radius:11px; font-weight:800; font-size:12.5px; letter-spacing:1px;
  text-transform:uppercase}
.mp-badge-champ{background:linear-gradient(135deg,var(--gold),var(--gold-2)); color:#3a2a00;
  box-shadow:0 6px 20px rgba(244,196,48,.35)}

.mp-hint{position:absolute; bottom:16px; left:50%; transform:translateX(-50%); z-index:20;
  font-size:12px; color:#7e93a1; letter-spacing:.3px; text-align:center;
  background:rgba(7,12,16,.5); padding:7px 16px; border-radius:99px;
  border:1px solid rgba(255,255,255,.06)}
.mp-hint b{color:#b9c9d4}
.mp-loading{position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
  z-index:40; font-family:'Anton',sans-serif; font-size:20px; letter-spacing:2px;
  text-align:center; padding:0 24px; color:#9fb3c0; background:var(--ocean-1)}

@media (max-width:640px){
  .mp-legend{left:10px; right:10px; bottom:auto; top:12px;
    flex-direction:row; flex-wrap:wrap; gap:7px 14px; padding:9px 12px}
  .mp-card{left:0 !important; right:0; top:auto !important; bottom:0;
    width:100%; border-radius:20px 20px 0 0; transform:translateY(100%);
    transition:transform .28s ease, opacity .2s ease}
  .mp-card.mp-show{transform:translateY(0)}
  .mp-hint{display:none}
}
`;

export default MapPage;
