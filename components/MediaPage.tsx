import React, { useState } from 'react';
import { MEDIA_MENTIONS } from '../constants';
import { ExternalLink, Newspaper, TrendingUp, Calendar, Play, Tv, MonitorPlay } from 'lucide-react';
import { MediaMention } from '../types';
import PageHeader from './PageHeader';

const G1_LINK = 'https://g1.globo.com/sp/sao-paulo/bom-dia-sp/video/grupo-usa-inteligencia-artificial-para-simular-resultados-da-copa-11178283.ghtml';
const G1_THUMBNAIL = '/assets/g1-destaque.jpg';

interface MediaCardProps {
  item: MediaMention;
}

const MediaCard: React.FC<MediaCardProps> = ({ item }) => {
  const [imgError, setImgError] = useState(false);
  const showImage = item.imageUrl && !imgError;

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-green/10 border border-brand-dark/8 hover:border-brand-green/40"
    >
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        {showImage ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-brand-light via-white to-brand-light">
            <Newspaper className="w-10 h-10 text-brand-green/25 mb-2" />
            <span className="text-xs text-brand-dark/25 uppercase tracking-widest font-montserrat">{item.outlet}</span>
          </div>
        )}

        <div className="absolute top-3 left-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-sm border border-brand-green/20 rounded-full text-[10px] font-bold uppercase tracking-wider text-brand-green shadow-sm">
            <TrendingUp className="w-3 h-3" />
            {item.outlet}
          </div>
        </div>

        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-brand-dark/60 border border-brand-dark/10 shadow-sm">
            <ExternalLink className="w-3 h-3" />
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 mb-3 text-[10px] font-montserrat text-brand-green/80 uppercase tracking-widest">
          <Calendar className="w-3 h-3" />
          {item.date}
        </div>
        <h3 className="text-sm font-montserrat font-bold leading-snug text-brand-dark group-hover:text-brand-grad2 transition-colors line-clamp-3 flex-1">
          {item.title}
        </h3>
        <div className="mt-4 w-6 h-0.5 bg-brand-green rounded-full transform origin-left group-hover:scale-x-[2.5] transition-transform duration-300"></div>
      </div>
    </a>
  );
};

const MediaPage: React.FC = () => {
  const [featuredImageError, setFeaturedImageError] = useState(false);

  return (
    <div className="bg-brand-light min-h-screen pb-24 text-brand-dark">
      <PageHeader
        icon={Tv}
        eyebrow="Repercussão na imprensa"
        title="Na"
        accent="Mídia"
        description="Cobertura jornalística e participações públicas sobre as previsões científicas do projeto."
      />

      <section className="w-full bg-white border-y border-brand-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
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
                    Matéria em destaque
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

      <div className="max-w-7xl mx-auto px-4 pt-16">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MEDIA_MENTIONS.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaPage;
