import React, { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

type Sponsor = {
  id: string;
  label: string;
  title: string;
  detail: string;
  href: string;
  cta: string;
  tone: string;
  logo: string;
  logoClassName: string;
};

const SPONSORS: Sponsor[] = [
  {
    id: 'pgecd',
    label: 'PGECD/UFBA',
    title: 'Pós-graduação em Estatística e Ciência de Dados',
    detail: 'Aluno(a) especial 2026.2: inscrições até 10/07',
    href: 'https://pgecd.ufba.br/',
    cta: 'Ver edital',
    tone: 'bg-white',
    logo: '/assets/ads/logo-pgecd.jpeg',
    logoClassName: 'max-h-7 max-w-[5.5rem] object-contain sm:max-h-8 sm:max-w-[6.5rem]',
  },
  {
    id: 'enialabs',
    label: 'Enialabs',
    title: 'Consultoria em engenharia de IA',
    detail: 'Treinamentos para empresas e soluções personalizadas',
    href: 'https://enialabs.com/para-empresas',
    cta: 'Ver soluções',
    tone: 'bg-white',
    logo: '/assets/ads/logo-enialabs-horizontal-branco.png',
    logoClassName: 'max-h-7 max-w-[5.5rem] object-contain sm:max-h-8 sm:max-w-[6.5rem]',
  },
];

const SponsorBar: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const rotation = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % SPONSORS.length);
    }, 6500);

    return () => window.clearInterval(rotation);
  }, []);

  const sponsor = SPONSORS[activeIndex];

  return (
    <aside
      className="fixed inset-x-0 bottom-0 z-[60] px-2 pb-2 sm:px-4 sm:pb-3 print:hidden"
      aria-label="Patrocinio"
    >
      <div className="mx-auto w-full max-w-[760px] md:w-[50vw]">
        <a
          href={sponsor.href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="group flex min-h-[48px] items-center gap-2.5 rounded-xl border border-brand-dark/20 bg-white px-2.5 py-2 text-brand-dark shadow-[0_14px_42px_rgba(0,0,0,0.20)] transition hover:-translate-y-0.5 hover:border-brand-green/35 hover:shadow-[0_18px_52px_rgba(0,0,0,0.24)] sm:min-h-[54px] sm:gap-3 sm:px-3"
        >
          <span
            className={`flex h-8 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-brand-dark/10 ${sponsor.tone} shadow-sm sm:h-9 sm:w-28`}
            aria-hidden="true"
          >
            <img
              src={sponsor.logo}
              alt=""
              className={sponsor.logoClassName}
              loading="lazy"
              decoding="async"
            />
          </span>

          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span className="font-montserrat text-[10px] font-black uppercase tracking-[0.18em] text-brand-green">
                {sponsor.label}
              </span>
            </span>

            <span className="mt-0.5 block truncate font-montserrat text-xs font-black uppercase leading-tight text-brand-dark sm:text-sm">
              {sponsor.title}
            </span>
            <span className="block truncate text-[11px] leading-snug text-brand-dark/62 sm:text-xs">
              {sponsor.detail}
            </span>
          </span>

          <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-lg bg-brand-green px-2.5 py-1.5 font-montserrat text-[9px] font-black uppercase tracking-wider text-white transition group-hover:bg-brand-grad2 sm:px-3 sm:text-[10px]">
            {sponsor.cta}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </a>
      </div>
    </aside>
  );
};

export default SponsorBar;
