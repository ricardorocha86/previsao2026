import React, { useState } from 'react';
import { PUBLICATIONS } from '../data/publications';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import PageHeader from './PageHeader';

const SciencePage: React.FC = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="bg-brand-light min-h-screen font-opensans text-brand-dark">
      <PageHeader
        icon={BookOpen}
        eyebrow="Biblioteca Acadêmica"
        title="Artigos"
        accent="Científicos"
        description="Publicações que fundamentam a metodologia estatística do projeto."
      />

      <div className="max-w-5xl mx-auto px-4">
        {PUBLICATIONS.map((pub) => {
          const isHovered = hovered === pub.id;

          return (
            <a
              key={pub.id}
              href={pub.link}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHovered(pub.id)}
              onMouseLeave={() => setHovered(null)}
              className="group relative block border-b border-brand-dark/10 py-8 md:py-10 transition-all duration-300"
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-brand-green transition-all duration-300 rounded-full ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

              <div className="pl-6 grid gap-6 md:grid-cols-[190px_1fr] md:gap-x-10 items-center">
                <div className={`w-full max-w-[230px] md:max-w-none justify-self-start rounded-lg border bg-white p-4 shadow-sm transition-all duration-300 ${isHovered ? 'border-brand-green/40 shadow-md -translate-y-1' : 'border-brand-dark/10'}`}>
                  {pub.publisherLogo ? (
                    <img
                      src={pub.publisherLogo}
                      alt={`Logo ${pub.publisher}`}
                      className="h-16 w-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-16 items-center justify-center text-center font-montserrat text-sm font-black text-brand-dark/45">
                      {pub.publisher}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] transition-colors duration-200 ${isHovered ? 'border-brand-green bg-brand-green text-white' : 'border-brand-dark/10 bg-white text-brand-dark/55'}`}>
                      {pub.year}
                    </span>
                  </div>

                  <h3 className={`font-montserrat font-black text-xl md:text-2xl leading-snug tracking-tight transition-colors duration-200 ${isHovered ? 'text-brand-green' : 'text-brand-dark'}`}>
                    {pub.title}
                  </h3>

                  <p className="text-brand-dark text-base md:text-[17px] mt-4 font-opensans font-bold leading-relaxed">
                    {pub.authors}
                  </p>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-dark/35">
                        Revista
                      </p>
                      <p className={`font-montserrat text-sm md:text-base font-black leading-snug transition-colors duration-200 ${isHovered ? 'text-brand-green' : 'text-brand-blue'}`}>
                        {pub.journal}
                      </p>
                    </div>
                    <div className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-brand-green transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                      <span>Acessar artigo</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            </a>
          );
        })}

        <div className="py-12 text-center">
          <p className="text-[10px] text-brand-dark/20 uppercase tracking-[0.3em] font-black">
            DOI System · Digital Object Identifier
          </p>
        </div>
      </div>
    </div>
  );
};

export default SciencePage;
