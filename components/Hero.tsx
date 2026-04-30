import React from 'react';
import { Trophy, GraduationCap } from 'lucide-react';
import bannerImage from '../assets/banner2.png';
import logoImage from '../assets/LogoMPrevisao.png';

type HomeViewTarget = 'copa' | 'methodology' | 'science' | 'media' | 'team';

interface HeroProps {
  onNavigate: (view: HomeViewTarget) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative overflow-hidden bg-brand-light text-brand-dark">
      <div className="absolute inset-0">
        <img
          src={bannerImage}
          alt=""
          className="h-full w-full object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(241,241,241,0.96)_0%,rgba(241,241,241,0.88)_34%,rgba(241,241,241,0.45)_62%,rgba(241,241,241,0.20)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(241,241,241,0.05)_0%,rgba(241,241,241,0.65)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-14 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-3 border border-brand-dark/10 bg-white/60 px-4 py-2 text-[11px] font-bold uppercase text-brand-dark/70 backdrop-blur-md">
            <GraduationCap className="h-4 w-4 text-brand-yellow" />
            Projeto acadêmico de previsão esportiva
          </div>

          <div className="flex items-center">
            <img 
              src={logoImage} 
              alt="Previsão Esportiva" 
              className="h-40 md:h-60 w-auto object-contain drop-shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
            />
          </div>

          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-brand-dark/75 md:text-xl">
            Uma iniciativa de pesquisa e divulgação científica dedicada à análise probabilística do futebol,
            reunindo resultados, metodologia, produção acadêmica e repercussão pública em um ambiente aberto.
          </p>

          <div className="mt-10 flex">
            <button
              type="button"
              onClick={() => onNavigate('copa')}
              className="inline-flex items-center justify-center gap-4 bg-brand-green px-8 py-5 font-montserrat text-base font-bold uppercase text-white transition hover:bg-brand-grad2 shadow-[0_20px_40px_-12px_rgba(32,153,39,0.30)]"
              style={{ borderRadius: 12 }}
            >
              Ver Previsões Copa 2026
              <Trophy className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
