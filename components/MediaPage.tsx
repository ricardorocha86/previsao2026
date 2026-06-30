import React, { useState } from 'react';
import { MEDIA_MENTIONS, FEATURED_ARTICLE, TVE_VIDEO_FEATURE } from '../data/mediaMentions';
import { ExternalLink, Newspaper, TrendingUp, Play, Tv, MonitorPlay, Sparkles, CalendarDays, ArrowUpRight } from 'lucide-react';
import { MediaMention, MediaEdition } from '../types';
import PageHeader from './PageHeader';

const G1_LINK = 'https://g1.globo.com/sp/sao-paulo/bom-dia-sp/video/grupo-usa-inteligencia-artificial-para-simular-resultados-da-copa-11178283.ghtml';
const G1_THUMBNAIL = '/assets/g1-destaque.webp';

const EDITION_ORDER: MediaEdition[] = ['2026', '2022', '2018', '2014', '2010', 'projeto'];
const EDITION_LABELS: Record<MediaEdition, string> = {
  '2026': 'Copa do Mundo 2026',
  '2022': 'Copa do Mundo 2022 · Catar',
  '2018': 'Copa do Mundo 2018 · Rússia',
  '2014': 'Copa do Mundo 2014 · Brasil',
  '2010': 'Copa do Mundo 2010 · África do Sul',
  projeto: 'Cobertura do projeto',
};

interface MediaCardProps {
  item: MediaMention;
}

const MediaCard: React.FC<MediaCardProps> = ({ item }) => {
  const [imgError, setImgError] = useState(false);
  const showImage = Boolean(item.imageUrl) && !imgError;

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex min-h-[116px] items-stretch bg-white rounded-2xl overflow-hidden shadow-sm border border-brand-dark/8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-green/10 hover:border-brand-green/40"
    >
      {/* FOTO DA MATÉRIA (OG) OU INDICADOR DA FONTE À ESQUERDA */}
      <div className="relative w-28 sm:w-36 flex-shrink-0 overflow-hidden bg-gradient-to-br from-brand-dark via-brand-dark to-[#0b2a11]">
        {showImage ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <>
            <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_25%_20%,white,transparent_45%)]" />
            <div className="relative flex h-full flex-col items-center justify-center gap-1.5 px-2 py-5 text-center">
              <Newspaper className="h-5 w-5 sm:h-6 sm:w-6 text-brand-green" />
              <span className="font-montserrat text-[9px] sm:text-[11px] font-black uppercase tracking-tight text-white leading-tight line-clamp-2">
                {item.outlet}
              </span>
            </div>
          </>
        )}
      </div>

      {/* INSTITUIÇÃO + TÍTULO + LINK À DIREITA */}
      <div className="flex flex-1 min-w-0 flex-col justify-center gap-1.5 p-4 sm:px-5 sm:py-4">
        <div className="flex items-center gap-1.5 text-[10px] font-montserrat font-bold text-brand-green uppercase tracking-widest">
          <TrendingUp className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{item.outlet}</span>
        </div>
        <h3 className="text-sm font-montserrat font-bold leading-snug text-brand-dark group-hover:text-brand-grad2 transition-colors line-clamp-2">
          {item.title}
        </h3>
        <span className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-dark/40 group-hover:text-brand-green transition-colors">
          Abrir matéria
          <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </a>
  );
};

const MediaPage: React.FC = () => {
  const [featuredImageError, setFeaturedImageError] = useState(false);
  const [articleImageError, setArticleImageError] = useState(false);

  return (
    <div className="bg-brand-light min-h-screen pb-24 text-brand-dark">
      <PageHeader
        icon={Tv}
        eyebrow="Repercussão na imprensa"
        title="Destaques na"
        accent="Mídia"
        noBreak
        description="Cobertura jornalística e participações públicas sobre as previsões científicas do projeto."
      />

      <section className="w-full bg-white border-y border-brand-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-10">
          <article className="grid overflow-hidden bg-white border border-brand-dark/10 shadow-xl shadow-brand-dark/5 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
            <div className="relative bg-brand-dark">
              <video
                className="aspect-video h-full min-h-[260px] w-full bg-brand-dark object-cover"
                controls
                preload="metadata"
              >
                <source src={TVE_VIDEO_FEATURE.video} type="video/mp4" />
              </video>
            </div>

            <div className="flex flex-col justify-between gap-8 p-6 sm:p-8 lg:p-10">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 bg-brand-green px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white">
                    <Tv className="h-3.5 w-3.5" />
                    Vídeo em destaque
                  </span>
                  <span className="inline-flex items-center gap-2 text-[11px] font-montserrat uppercase tracking-widest text-brand-dark/45">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {TVE_VIDEO_FEATURE.outlet} - {TVE_VIDEO_FEATURE.date}
                  </span>
                </div>

                <div className="space-y-4">
                  <h2 className="max-w-3xl text-2xl font-montserrat font-bold leading-tight text-brand-dark sm:text-3xl lg:text-[2.5rem] lg:leading-[1.05]">
                    {TVE_VIDEO_FEATURE.title}
                  </h2>
                  <p className="max-w-2xl text-base leading-relaxed text-brand-dark/65">
                    {TVE_VIDEO_FEATURE.summary}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-brand-dark/10 pt-6">
                <span className="inline-flex items-center gap-2 text-sm font-montserrat font-bold uppercase tracking-wider text-brand-green">
                  <Play className="h-4 w-4 fill-brand-green" />
                  Assistir reportagem
                </span>
                <span className="text-xs font-semibold text-brand-dark/45">
                  Arquivo hospedado no site
                </span>
              </div>
            </div>
          </article>

          {/* MATÉRIA EM DESTAQUE (MAIS RECENTE) */}
          <a
            href={FEATURED_ARTICLE.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid overflow-hidden bg-white border border-brand-dark/10 shadow-xl shadow-brand-dark/5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-2xl hover:shadow-brand-green/10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,1fr)]"
          >
            <div className="flex flex-col justify-between gap-8 p-6 sm:p-8 lg:p-10">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 bg-brand-green px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white">
                    <Sparkles className="h-3.5 w-3.5" />
                    Matéria em destaque
                  </span>
                  <span className="inline-flex items-center gap-2 text-[11px] font-montserrat uppercase tracking-widest text-brand-dark/45">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {FEATURED_ARTICLE.outlet} · {FEATURED_ARTICLE.section} · {FEATURED_ARTICLE.date}
                  </span>
                </div>

                <div className="space-y-4">
                  <h2 className="max-w-3xl text-2xl font-montserrat font-bold leading-tight text-brand-dark sm:text-3xl lg:text-[2.6rem] lg:leading-[1.05]">
                    {FEATURED_ARTICLE.title}
                  </h2>
                  <p className="max-w-2xl text-base leading-relaxed text-brand-dark/65">
                    {FEATURED_ARTICLE.summary}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-brand-dark/10 pt-6">
                <span className="inline-flex items-center gap-2 text-sm font-montserrat font-bold uppercase tracking-wider text-brand-green">
                  Ler matéria no G1
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-brand-dark/45 transition-colors group-hover:text-brand-green">
                  Abrir matéria
                  <ExternalLink className="h-4 w-4" />
                </span>
              </div>
            </div>

            <div className="relative min-h-[260px] bg-brand-dark lg:min-h-full">
              {!articleImageError ? (
                <img
                  src={FEATURED_ARTICLE.image}
                  alt={FEATURED_ARTICLE.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  onError={() => setArticleImageError(true)}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-dark p-8 text-center">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center border border-white/20 bg-white/10 text-white">
                    <Newspaper className="h-8 w-8" />
                  </div>
                  <div className="font-montserrat text-xs font-bold uppercase tracking-widest text-white/60">Imagem indisponível</div>
                  <div className="mt-2 text-lg font-montserrat font-bold uppercase text-white">G1 · Educação</div>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-brand-dark/10 to-transparent"></div>
              <div className="absolute left-5 top-5 bg-brand-red px-3 py-1.5 text-xs font-montserrat font-bold uppercase tracking-widest text-white">
                G1
              </div>
              <div className="absolute right-5 top-5 inline-flex items-center gap-1.5 bg-brand-neon px-3 py-1.5 text-xs font-montserrat font-black uppercase tracking-widest text-brand-dark shadow-lg">
                <Sparkles className="h-3.5 w-3.5" />
                Novo
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-4 p-5">
                <span className="text-xs font-montserrat font-bold uppercase tracking-widest text-white">Reportagem</span>
                <span className="text-xs text-white/70">{FEATURED_ARTICLE.date}</span>
              </div>
            </div>
          </a>

          {/* VÍDEO EM DESTAQUE (TV GLOBO / BOM DIA SP) */}
          <a
            href={G1_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid overflow-hidden bg-white border border-brand-dark/10 shadow-xl shadow-brand-dark/5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-2xl hover:shadow-brand-green/10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,1fr)]"
          >
            <div className="flex flex-col justify-between gap-8 p-6 sm:p-8 lg:p-10">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 border border-brand-green/20 bg-brand-green/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-brand-green">
                    <Tv className="h-3.5 w-3.5" />
                    Vídeo em destaque
                  </span>
                  <span className="inline-flex items-center gap-2 text-[11px] font-montserrat uppercase tracking-widest text-brand-dark/45">
                    <MonitorPlay className="h-3.5 w-3.5" />
                    TV Globo / G1 / Bom Dia SP
                  </span>
                </div>

                <div className="space-y-4">
                  <h2 className="max-w-3xl text-2xl font-montserrat font-bold uppercase leading-tight text-brand-dark sm:text-3xl lg:text-4xl">
                    Grupo usa inteligência artificial para simular resultados da Copa
                  </h2>
                  <p className="max-w-2xl text-base leading-relaxed text-brand-dark/65">
                    A reportagem mostra pesquisadores usando modelos matemáticos para projetar cenários do mundial, conectando ciência de dados, futebol e previsão esportiva.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-brand-dark/10 pt-6">
                <span className="inline-flex items-center gap-2 text-sm font-montserrat font-bold uppercase tracking-wider text-brand-green">
                  <Play className="h-4 w-4 fill-brand-green" />
                  Assistir no G1
                </span>
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-brand-dark/45 transition-colors group-hover:text-brand-green">
                  Abrir matéria
                  <ExternalLink className="h-4 w-4" />
                </span>
              </div>
            </div>

            <div className="relative min-h-[260px] bg-brand-dark lg:min-h-full">
              {!featuredImageError ? (
                <img
                  src={G1_THUMBNAIL}
                  alt="Grupo usa inteligência artificial para simular resultados da Copa"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={() => setFeaturedImageError(true)}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-dark p-8 text-center">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center border border-white/20 bg-white/10 text-white">
                    <MonitorPlay className="h-8 w-8" />
                  </div>
                  <div className="font-montserrat text-xs font-bold uppercase tracking-widest text-white/60">Thumbnail indisponível</div>
                  <div className="mt-2 text-lg font-montserrat font-bold uppercase text-white">Bom Dia SP / G1</div>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/75 via-brand-dark/15 to-transparent"></div>
              <div className="absolute left-5 top-5 bg-brand-red px-3 py-1.5 text-xs font-montserrat font-bold uppercase tracking-widest text-white">
                G1
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-brand-green shadow-xl transition-transform duration-300 group-hover:scale-110">
                  <Play className="ml-1 h-6 w-6 fill-brand-green" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-4 p-5">
                <span className="text-xs font-montserrat font-bold uppercase tracking-widest text-white">Video</span>
                <span className="text-xs text-white/70">Publicado no G1</span>
              </div>
            </div>
          </a>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pt-16">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12 border-b border-brand-dark/10 pb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-green/10 text-brand-green rounded-xl border border-brand-green/20">
              <Newspaper className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-3xl font-montserrat font-bold uppercase tracking-tight text-brand-dark">Repercussão</h2>
            </div>
          </div>

          <div className="hidden md:block text-right">
            <div className="text-2xl font-bold font-montserrat text-brand-dark/30">{MEDIA_MENTIONS.length}</div>
            <div className="text-[10px] uppercase tracking-widest text-brand-dark/40 font-opensans">Arquivos Indexados</div>
          </div>
        </div>

        <div className="space-y-14">
          {EDITION_ORDER.map((ed) => {
            const items = MEDIA_MENTIONS.filter((m) => m.edition === ed);
            if (items.length === 0) return null;
            return (
              <section key={ed}>
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="font-montserrat text-lg font-black uppercase tracking-tight text-brand-dark">
                    {EDITION_LABELS[ed]}
                  </h3>
                  <span className="font-montserrat text-[11px] font-bold text-brand-dark/35">{items.length}</span>
                  <div className="h-px flex-1 bg-brand-dark/10" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {items.map((item) => (
                    <MediaCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MediaPage;
