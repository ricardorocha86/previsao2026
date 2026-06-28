import React from 'react';
import { ArrowRight, Trophy } from 'lucide-react';
import HexaArt from './HexaArt';

interface HexaCalloutProps {
  onNavigate: () => void;
}

const HexaCallout: React.FC<HexaCalloutProps> = ({ onNavigate }) => {
  return (
    <section className="relative overflow-hidden bg-brand-dark">
      {/* textura + brilho de fundo */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.10] bg-[radial-gradient(#68E70F_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="pointer-events-none absolute -left-32 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-brand-green/20 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-[1180px] items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:py-20">
        {/* TEXTO */}
        <div className="order-2 lg:order-1">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-neon/30 bg-brand-neon/10 px-4 py-1.5">
            <Trophy className="h-4 w-4 text-brand-neon" />
            <span className="font-montserrat text-[10px] font-black uppercase tracking-[0.25em] text-brand-neon">
              Análise Especial · Copa 2026
            </span>
          </div>

          <h2 className="font-montserrat text-4xl font-black uppercase leading-[0.92] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Agora é
            <span className="block text-brand-neon">
              Mata-Mata. <span className="align-middle">🇧🇷</span>
            </span>
          </h2>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
            Depois de 72 jogos, rodamos a Copa novamente <strong className="font-semibold text-white">um milhão de vezes</strong>.
            O Brasil enfrenta o Japão nos 16-avos, enquanto França e Argentina abrem distância na
            nova corrida pelo título.
          </p>

          <button
            type="button"
            onClick={onNavigate}
            className="group mt-9 inline-flex items-center gap-3 rounded-xl bg-brand-green px-8 py-5 font-montserrat text-base font-bold uppercase tracking-wide text-white shadow-[0_20px_45px_-12px_rgba(32,153,39,0.55)] transition hover:bg-brand-grad1"
          >
            Ler a análise completa
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* ARTE */}
        <button
          type="button"
          onClick={onNavigate}
          aria-label="Abrir a análise Agora é Mata-Mata"
          className="group order-1 block w-full overflow-hidden rounded-3xl border border-brand-neon/20 shadow-2xl transition-transform duration-500 hover:scale-[1.02] lg:order-2"
        >
          <HexaArt className="block w-full" />
        </button>
      </div>
    </section>
  );
};

export default HexaCallout;
