import React from 'react';
import { ArrowUpRight, CalendarDays, ExternalLink, Newspaper, Sparkles } from 'lucide-react';
import { HOME_MEDIA_ARTICLES } from '../data/mediaMentions';

interface MediaHighlightProps {
  /** Navega para a página "Na Mídia" com todos os destaques. */
  onNavigate: () => void;
}

const MediaHighlight: React.FC<MediaHighlightProps> = ({ onNavigate }) => {
  return (
    <section className="bg-brand-light">
      <div className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-green/10 px-3 py-1.5 font-montserrat text-[10px] font-black uppercase tracking-[0.2em] text-brand-green">
              <Newspaper className="h-3.5 w-3.5" />
              Na mídia
            </span>
            <h2 className="mt-3 font-montserrat text-2xl font-black leading-[1.08] tracking-tight text-brand-dark sm:text-3xl">
              Previsão Esportiva em destaque
            </h2>
          </div>

          <button
            type="button"
            onClick={onNavigate}
            className="inline-flex items-center gap-1.5 self-start font-montserrat text-[11px] font-bold uppercase tracking-widest text-brand-dark/45 transition-colors hover:text-brand-green sm:self-auto"
          >
            Ver todos os destaques
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {HOME_MEDIA_ARTICLES.map((article, index) => (
            <a
              key={article.link}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex overflow-hidden rounded-3xl border border-brand-dark/10 bg-white shadow-xl shadow-brand-dark/5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-2xl hover:shadow-brand-green/10"
            >
              <article className="flex w-full flex-col">
                <div className="relative min-h-[210px] overflow-hidden bg-brand-dark">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/65 via-brand-dark/10 to-transparent" />

                  <div className="absolute left-5 top-5 rounded-full border-2 border-white/90 bg-brand-green px-4 py-2 font-montserrat text-[11px] font-black uppercase tracking-[0.16em] text-white shadow-[0_8px_20px_rgba(0,0,0,0.32)]">
                    {article.badge}
                  </div>

                  {index === 0 && (
                    <div className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-brand-neon px-3 py-1.5 font-montserrat text-xs font-black uppercase tracking-widest text-brand-dark shadow-lg">
                      <Sparkles className="h-3.5 w-3.5" />
                      Novo
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between gap-5 p-6">
                  <div className="space-y-3">
                    <span className="inline-flex items-center gap-1.5 font-montserrat text-[11px] uppercase tracking-widest text-brand-dark/45">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {article.outlet} · {article.date}
                    </span>

                    <h3 className="font-montserrat text-lg font-black leading-tight text-brand-dark transition-colors group-hover:text-brand-green">
                      {article.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-brand-dark/65">
                      {article.summary}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-2 border-t border-brand-dark/10 pt-4 font-montserrat text-xs font-bold uppercase tracking-wider text-brand-green">
                    Ler reportagem
                    <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </article>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MediaHighlight;
