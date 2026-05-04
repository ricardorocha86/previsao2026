
import React, { useState } from 'react';
import { PUBLICATIONS } from '../data/publications';
import { ArrowUpRight, BookOpen, FileText } from 'lucide-react';
import PageHeader from './PageHeader';

const SciencePage: React.FC = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="bg-brand-light min-h-screen font-opensans text-brand-dark">

      <PageHeader
        icon={BookOpen}
        eyebrow="Biblioteca Acadêmica"
        title="Produção"
        accent="Científica"
        description="Publicações que fundamentam a metodologia estatística do projeto."
      />

      {/* LIST */}
      <div className="max-w-5xl mx-auto px-4">

        {PUBLICATIONS.map((pub, i) => {
          const isHovered = hovered === pub.id;
          const idx = String(i + 1).padStart(2, '0');

          return (
            <a
              key={pub.id}
              href={pub.link}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHovered(pub.id)}
              onMouseLeave={() => setHovered(null)}
              className="group relative block border-b border-brand-dark/10 py-10 transition-all duration-300"
            >
              {/* Left green accent on hover */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-brand-green transition-all duration-300 rounded-full ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

              <div className="pl-6 grid grid-cols-[auto_1fr] gap-x-6 md:gap-x-10 items-start">

                {/* Article icon */}
                <div className={`mt-1 p-3 rounded-xl border transition-all duration-300 ${isHovered ? 'bg-brand-green border-brand-green text-white' : 'bg-white border-brand-dark/10 text-brand-dark/30'}`}>
                  <FileText className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="min-w-0">

                  {/* Journal — destaque */}
                  <p className={`text-xs font-black uppercase tracking-[0.15em] mb-1 transition-colors duration-200 ${isHovered ? 'text-brand-green' : 'text-brand-dark/50'}`}>
                    {pub.journal}
                  </p>

                  {/* Title */}
                  <h3 className={`font-montserrat font-black text-lg md:text-xl leading-snug tracking-tight transition-colors duration-200 ${isHovered ? 'text-brand-green' : 'text-brand-dark'}`}>
                    {pub.title}
                  </h3>

                  {/* Authors — destaque */}
                  <p className="text-brand-dark/60 text-sm mt-2 font-opensans font-semibold">
                    {pub.authors}
                  </p>

                  {/* Year + CTA */}
                  <div className="flex items-center gap-4 mt-3">
                    <span className="font-mono font-black text-xs text-brand-dark/30">{pub.year}</span>
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

        {/* Footer */}
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
