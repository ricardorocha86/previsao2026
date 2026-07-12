import React, { useEffect, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';

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
    detail: 'Conheça a Pós-graduação em Estatística e Ciência de Dados da UFBA',
    href: 'https://pgecd.ufba.br/',
    cta: 'Conheça a pós',
    tone: 'bg-white',
    logo: '/assets/ads/logo-pgecd.jpeg',
    logoClassName: 'max-h-5 max-w-[3.8rem] object-contain sm:max-h-8 sm:max-w-[6.5rem]',
  },
  {
    id: 'enialabs',
    label: 'Enialabs',
    title: 'Consultoria em engenharia de IA',
    detail: 'Treinamentos para empresas e soluções personalizadas',
    href: 'https://enialabs.com/para-empresas',
    cta: 'Quero conhecer',
    tone: 'bg-white',
    logo: '/assets/ads/logo-enialabs-horizontal-branco.png',
    logoClassName: 'max-h-5 max-w-[3.8rem] object-contain sm:max-h-8 sm:max-w-[6.5rem]',
  },
];

const SponsorBar: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const rotation = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % SPONSORS.length);
    }, 6500);

    return () => window.clearInterval(rotation);
  }, []);

  useEffect(() => {
    const autoClose = window.setTimeout(() => setIsClosing(true), 30000);

    return () => window.clearTimeout(autoClose);
  }, []);

  useEffect(() => {
    if (!isClosing) {
      return;
    }

    const removeAfterFade = window.setTimeout(() => setIsVisible(false), 500);

    return () => window.clearTimeout(removeAfterFade);
  }, [isClosing]);

  const sponsor = SPONSORS[activeIndex];

  if (!isVisible) {
    return null;
  }

  return (
    <aside
      className="fixed inset-x-0 bottom-0 z-[60] px-2 pb-2 sm:px-4 sm:pb-3 print:hidden"
      aria-label="Patrocinio"
    >
      <div className="mx-auto w-full max-w-[760px] md:w-[50vw]">
        <div
          className={`relative transition-all duration-500 ease-out ${
            isClosing ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
          }`}
        >
          <a
            href={sponsor.href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="group flex min-h-[46px] items-center gap-1 rounded-xl border border-brand-dark/20 bg-white px-1.5 py-1.5 text-brand-dark shadow-[0_14px_42px_rgba(0,0,0,0.20)] transition hover:-translate-y-0.5 hover:border-brand-green/35 hover:shadow-[0_18px_52px_rgba(0,0,0,0.24)] sm:min-h-[54px] sm:gap-3 sm:px-3 sm:py-2"
          >
            <span
              className={`flex h-7 w-[4.25rem] flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-brand-dark/10 ${sponsor.tone} shadow-sm sm:h-9 sm:w-28`}
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
              <span className="block truncate font-montserrat text-[10.5px] font-black uppercase leading-tight text-brand-dark sm:text-sm">
                {sponsor.title}
              </span>
              <span className="mt-0.5 block truncate text-[9.5px] leading-snug text-brand-dark/62 sm:text-xs">
                {sponsor.detail}
              </span>
            </span>

            <span className="inline-flex w-16 flex-shrink-0 items-center justify-center gap-0.5 rounded-lg bg-brand-green px-1 py-1.5 font-montserrat text-[7px] font-black uppercase leading-[0.95] tracking-normal text-white transition group-hover:bg-brand-grad2 sm:w-auto sm:gap-1 sm:px-3 sm:text-[10px] sm:leading-normal sm:tracking-wider">
              <span className="max-w-full whitespace-normal text-center">
                {sponsor.cta}
              </span>
              <ArrowUpRight className="hidden h-3.5 w-3.5 sm:block" />
            </span>
          </a>
          <button
            type="button"
            aria-label="Fechar anúncio"
            title="Fechar anúncio"
            onClick={() => setIsClosing(true)}
            className="absolute right-1 top-1 z-10 inline-flex h-3 w-3 items-center justify-center rounded-full border border-brand-dark/20 bg-white/45 text-brand-dark/45 shadow-sm transition hover:border-brand-dark/30 hover:bg-white/75 hover:text-brand-dark/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/35 sm:h-3.5 sm:w-3.5"
          >
            <X className="h-2.5 w-2.5 stroke-[1.5] sm:h-3 sm:w-3" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SponsorBar;
