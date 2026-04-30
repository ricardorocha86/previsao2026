import React from 'react';
import { ArrowRight, BookOpen, GraduationCap } from 'lucide-react';
import bannerImage from '../assets/banner.png';
import logoImage from '../assets/LogoMPrevisao.png';

type HomeViewTarget = 'copa' | 'methodology' | 'science' | 'media' | 'team';

interface HeroProps {
  onNavigate: (view: HomeViewTarget) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative overflow-hidden bg-brand-dark text-white">
      <div className="absolute inset-0">
        <img
          src={bannerImage}
          alt=""
          className="h-full w-full object-cover object-center opacity-82"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,13,10,0.94)_0%,rgba(7,13,10,0.84)_34%,rgba(7,13,10,0.46)_62%,rgba(7,13,10,0.22)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,13,10,0.08)_0%,rgba(7,13,10,0.72)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-7 inline-flex items-center gap-3 border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase text-white/82 backdrop-blur-md">
            <GraduationCap className="h-4 w-4 text-brand-yellow" />
            Projeto acadêmico de previsão esportiva
          </div>

          <div className="flex items-center mb-6">
            <img 
              src={logoImage} 
              alt="Previsão Esportiva" 
              className="h-40 md:h-60 w-auto object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.35)]"
            />
          </div>

          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
            Uma iniciativa de pesquisa e divulgação científica dedicada à análise probabilística do futebol,
            reunindo resultados, metodologia, produção acadêmica e repercussão pública em um ambiente aberto.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => onNavigate('copa')}
              className="inline-flex items-center justify-center gap-3 bg-brand-green px-6 py-4 font-montserrat text-sm font-bold uppercase text-white transition hover:bg-brand-grad2"
              style={{ borderRadius: 8 }}
            >
              Consultar resultados
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('methodology')}
              className="inline-flex items-center justify-center gap-3 border border-white/24 bg-white/10 px-6 py-4 font-montserrat text-sm font-bold uppercase text-white backdrop-blur-md transition hover:bg-white hover:text-brand-dark"
              style={{ borderRadius: 8 }}
            >
              Entender o estudo
              <BookOpen className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
