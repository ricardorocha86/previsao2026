import React, { useState } from 'react';
import { ArrowUpRight, CalendarDays, ExternalLink, Newspaper, Sparkles } from 'lucide-react';
import { FEATURED_ARTICLE } from '../data/mediaMentions';

interface MediaHighlightProps {
  /** Navega para a página "Na Mídia" com todos os destaques. */
  onNavigate: () => void;
}

const MediaHighlight: React.FC<MediaHighlightProps> = ({ onNavigate }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="bg-brand-light">
      <div className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6">
        <a
          href={FEATURED_ARTICLE.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group grid overflow-hidden rounded-3xl border border-brand-dark/10 bg-white shadow-xl shadow-brand-dark/5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-2xl hover:shadow-brand-green/10 md:grid-cols-[0.95fr_1.05fr]"
        >
          {/* IMAGEM */}
          <div className="relative min-h-[220px] bg-brand-dark md:min-h-full">
            {!imageError ? (
              <img
                src={FEATURED_ARTICLE.image}
                alt={FEATURED_ARTICLE.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-dark p-8 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center border border-white/20 bg-white/10 text-white">
                  <Newspaper className="h-7 w-7" />
                </div>
                <div className="font-montserrat text-lg font-bold uppercase text-white">G1 · Educação</div>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent" />
            <div className="absolute left-5 top-5 bg-brand-red px-3 py-1.5 text-xs font-montserrat font-bold uppercase tracking-widest text-white">
              G1
            </div>
            <div className="absolute right-5 top-5 inline-flex items-center gap-1.5 bg-brand-neon px-3 py-1.5 text-xs font-montserrat font-black uppercase tracking-widest text-brand-dark shadow-lg">
              <Sparkles className="h-3.5 w-3.5" />
              Novo
            </div>
          </div>

          {/* TEXTO */}
          <div className="flex flex-col justify-between gap-6 p-6 sm:p-8 lg:p-10">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-green/10 px-3 py-1.5 text-[10px] font-montserrat font-black uppercase tracking-[0.2em] text-brand-green">
                  <Newspaper className="h-3.5 w-3.5" />
                  Na mídia
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-montserrat uppercase tracking-widest text-brand-dark/45">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {FEATURED_ARTICLE.outlet} · {FEATURED_ARTICLE.date}
                </span>
              </div>

              <h2 className="font-montserrat text-2xl font-black leading-[1.08] tracking-tight text-brand-dark transition-colors group-hover:text-brand-green sm:text-3xl">
                {FEATURED_ARTICLE.title}
              </h2>

              <p className="text-sm leading-relaxed text-brand-dark/65 sm:text-base">
                {FEATURED_ARTICLE.summary}
              </p>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-brand-dark/10 pt-5">
              <span className="inline-flex items-center gap-2 font-montserrat text-sm font-bold uppercase tracking-wider text-brand-green">
                Ler matéria no G1
                <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </div>
        </a>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onNavigate}
            className="inline-flex items-center gap-1.5 font-montserrat text-[11px] font-bold uppercase tracking-widest text-brand-dark/45 transition-colors hover:text-brand-green"
          >
            Ver todos os destaques na mídia
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default MediaHighlight;
