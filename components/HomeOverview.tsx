import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  TrendingUp, 
  MapPin, 
  BookOpen, 
  Award, 
  GraduationCap, 
  Newspaper, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  Instagram, 
  ArrowUpRight,
  Network
} from 'lucide-react';

type ViewState = 'home' | 'copa' | 'mapa' | 'simulador' | 'bolao' | 'team' | 'science' | 'media' | 'methodology';

interface HomeOverviewProps {
  onNavigate: (view: ViewState) => void;
}

const HomeOverview: React.FC<HomeOverviewProps> = ({ onNavigate }) => {
  const [methodology, setMethodology] = useState<1 | 2>(1);
  const [activeCard, setActiveCard] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);

  const cards = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => 
      methodology === 1 
        ? `/assets/cards/card_${i + 1}.webp`
        : `/assets/cards/card_m2_${i + 1}.webp`
    );
  }, [methodology]);

  const nextCard = () => {
    setSlideDirection(1);
    setActiveCard((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setSlideDirection(-1);
    setActiveCard((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const goToCard = (index: number) => {
    if (index === activeCard) return;
    const forwardDistance = (index - activeCard + cards.length) % cards.length;
    setSlideDirection(forwardDistance <= cards.length / 2 ? 1 : -1);
    setActiveCard(index);
  };

  const getCardOffset = (index: number) => {
    const rawOffset = index - activeCard;
    if (rawOffset > cards.length / 2) return rawOffset - cards.length;
    if (rawOffset < -cards.length / 2) return rawOffset + cards.length;
    return rawOffset;
  };

  const previousCard = cards[(activeCard - 1 + cards.length) % cards.length];
  const nextPreviewCard = cards[(activeCard + 1) % cards.length];

  const theme = useMemo(() => {
    if (methodology === 1) {
      return {
        accent: '#209927',
        accentBg: 'bg-brand-green',
        accentText: 'text-brand-green',
        accentBorder: 'border-brand-green/20 hover:border-brand-green/40',
        badgeBg: 'bg-brand-green/10 text-brand-green',
      };
    } else {
      return {
        accent: '#005C53',
        accentBg: 'bg-teal-600',
        accentText: 'text-teal-600',
        accentBorder: 'border-teal-600/20 hover:border-teal-600/40',
        badgeBg: 'bg-teal-600/10 text-teal-600',
      };
    }
  }, [methodology]);

  return (
    <div className="bg-brand-light pb-24 font-opensans">
      {/* CORE FEATURES GRID */}
      <section className="max-w-[1080px] mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-montserrat text-xs font-bold uppercase tracking-widest text-brand-green mb-3">
            Explore o site
          </p>
          <h2 className="text-3xl md:text-5xl font-montserrat font-black uppercase tracking-tight text-brand-dark leading-none">
            Análises e Simulações
          </h2>
          <p className="mt-4 text-base md:text-lg text-brand-dark/60 leading-relaxed">
            Acompanhe o caminho das seleções e teste cenários interativos com base em nossos modelos matemáticos.
          </p>
        </div>

        {/* PRIMARY HIGHLIGHT: PREVISÕES COPA 2026 */}
        <div 
          onClick={() => onNavigate('copa')}
          className="group relative overflow-hidden rounded-[2.5rem] border-2 border-brand-green bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] cursor-pointer mb-10"
        >
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-0 items-stretch min-h-[380px]">
            {/* TEXT INFO */}
            <div className="p-8 md:p-12 flex flex-col justify-between relative z-10">
              <div className="absolute top-0 left-0 w-48 h-48 bg-brand-green/5 rounded-full blur-3xl -ml-20 -mt-20 group-hover:bg-brand-green/10 transition-colors duration-500" />
              
              <div className="relative">
                <div className="inline-flex items-center gap-2 text-brand-green font-montserrat text-xs font-black uppercase tracking-widest bg-brand-green/10 px-4 py-2 rounded-full mb-6">
                  <Trophy className="w-4 h-4 text-brand-yellow" />
                  Destaque Principal
                </div>
                
                <h3 className="font-montserrat font-black text-3xl md:text-5xl text-brand-dark uppercase tracking-tight leading-none group-hover:text-brand-green transition-colors duration-500">
                  Previsões Copa 2026
                </h3>
                
                <p className="mt-4 text-sm md:text-base text-brand-dark/65 leading-relaxed max-w-xl">
                  Acompanhe as probabilidades estatísticas de cada seleção nas fases de grupos e no chaveamento final. Nosso modelo simula a Copa do Mundo 1 milhão de vezes para calcular as chances reais de classificação e título.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-2.5 font-montserrat font-bold text-xs uppercase tracking-widest text-brand-green">
                <span>Ver Previsões da Copa</span>
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </div>

            {/* DECORATIVE IMAGE */}
            <div className="relative bg-brand-dark overflow-hidden min-h-[260px] lg:min-h-full">
              <img 
                src="/assets/copa_previsoes_hero.webp"
                alt="Previsões Copa 2026" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-white via-white/10 to-transparent lg:from-white lg:via-white/5 lg:to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* SECONDARY HIGHLIGHT GRID */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          {/* SIMULADOR INTERATIVO */}
          <div 
            onClick={() => onNavigate('simulador')}
            className="group relative overflow-hidden rounded-[2rem] border-2 border-brand-dark/5 hover:border-brand-green bg-white hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[400px]"
          >
            <div>
              {/* IMAGE CONTAINER */}
              <div className="h-[180px] bg-brand-dark overflow-hidden relative border-b border-brand-dark/5">
                <img 
                  src="/assets/simulator_ui_mockup.webp"
                  alt="Simulador Interativo" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 px-3 py-1 text-[9px] font-black font-montserrat uppercase tracking-widest bg-brand-green/20 text-brand-green backdrop-blur-md rounded-full border border-brand-green/30">
                  Simulação
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-montserrat font-black text-xl text-brand-dark uppercase tracking-tight leading-none group-hover:text-brand-green transition-colors duration-500">
                  Simulador Interativo
                </h3>
                <p className="mt-3 text-xs md:text-sm text-brand-dark/60 leading-relaxed">
                  Replique nossas simulações ou teste seus próprios parâmetros para prever as partidas da copa.
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 flex items-center gap-2 font-montserrat font-bold text-[10px] uppercase tracking-widest text-brand-dark/55 group-hover:text-brand-green transition-colors">
              <span>Iniciar Simulador</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* BOLÃO COPA 2026 */}
          <div 
            onClick={() => onNavigate('bolao')}
            className="group relative overflow-hidden rounded-[2rem] border-2 border-brand-dark/5 hover:border-brand-green bg-white hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[400px]"
          >
            <div>
              {/* IMAGE CONTAINER */}
              <div className="h-[180px] bg-brand-dark overflow-hidden relative border-b border-brand-dark/5">
                <img 
                  src="/assets/bracket_tournament_illustration.webp"
                  alt="Bolão Copa 2026" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 px-3 py-1 text-[9px] font-black font-montserrat uppercase tracking-widest bg-brand-green/20 text-brand-green backdrop-blur-md rounded-full border border-brand-green/30">
                  Palpites
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-montserrat font-black text-xl text-brand-dark uppercase tracking-tight leading-none group-hover:text-brand-green transition-colors duration-500">
                  Bolão Copa 2026
                </h3>
                <p className="mt-3 text-xs md:text-sm text-brand-dark/60 leading-relaxed">
                  Crie seus palpites para os confrontos de brackets e acompanhe o chaveamento de forma visual.
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 flex items-center gap-2 font-montserrat font-bold text-[10px] uppercase tracking-widest text-brand-dark/55 group-hover:text-brand-green transition-colors">
              <span>Jogar Bolão</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* MAPA DE SELEÇÕES */}
          <div 
            onClick={() => onNavigate('mapa')}
            className="group relative overflow-hidden rounded-[2rem] border-2 border-brand-dark/5 hover:border-brand-green bg-white hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[400px]"
          >
            <div>
              {/* IMAGE CONTAINER */}
              <div className="h-[180px] bg-brand-dark overflow-hidden relative border-b border-brand-dark/5">
                <img 
                  src="/assets/world_map_soccer.webp"
                  alt="Mapa de Seleções" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 px-3 py-1 text-[9px] font-black font-montserrat uppercase tracking-widest bg-brand-green/20 text-brand-green backdrop-blur-md rounded-full border border-brand-green/30">
                  Geografia
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-montserrat font-black text-xl text-brand-dark uppercase tracking-tight leading-none group-hover:text-brand-green transition-colors duration-500">
                  Mapa de Seleções
                </h3>
                <p className="mt-3 text-xs md:text-sm text-brand-dark/60 leading-relaxed">
                  Explore dados das 48 seleções classificadas navegando de forma interativa por nosso mapa.
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 flex items-center gap-2 font-montserrat font-bold text-[10px] uppercase tracking-widest text-brand-dark/55 group-hover:text-brand-green transition-colors">
              <span>Abrir Mapa</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* INSTAGRAM CAROUSEL SECTION */}
      <section className="bg-brand-dark text-white py-20 px-4 border-t border-b border-white/5 relative overflow-hidden">
        <div className="max-w-[1080px] mx-auto relative z-20">
          <div className="grid lg:grid-cols-[1.1fr_1.9fr] gap-12 items-center">
            
            {/* TEXT AND CTA */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-brand-green font-montserrat text-xs font-black uppercase tracking-widest bg-brand-green/10 px-4 py-2 rounded-full border border-brand-green/20">
                <Instagram className="w-4 h-4 text-brand-yellow" />
                Destaque no Instagram
              </div>

              <h2 className="text-4xl md:text-5xl font-montserrat font-black uppercase tracking-tight leading-none">
                Análises e <br />
                <span className="text-brand-green italic">Insights</span>
              </h2>

              <p className="text-white/60 leading-relaxed text-sm md:text-base font-light">
                Publicamos informativos e análises detalhadas das seleções diretamente no Instagram. 
                Alternando os modelos abaixo, você pode verificar o card correspondente à metodologia preditiva selecionada.
              </p>

              {/* METHODOLOGY SWITCHER */}
              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={() => {
                    setMethodology(1);
                    setActiveCard(0);
                  }}
                  className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-300 ${
                    methodology === 1
                      ? 'bg-brand-green border-brand-green text-white shadow-lg scale-[1.02]'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${methodology === 1 ? 'bg-white/20 text-white' : 'bg-brand-green/10 text-brand-green'}`}>
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-montserrat text-[10px] font-bold uppercase tracking-widest block opacity-70">Metodologia 1</span>
                    <span className="font-montserrat font-bold text-sm uppercase block">Modelo de Força</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setMethodology(2);
                    setActiveCard(0);
                  }}
                  className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-300 ${
                    methodology === 2
                      ? 'bg-teal-600 border-teal-600 text-white shadow-lg scale-[1.02]'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${methodology === 2 ? 'bg-white/20 text-white' : 'bg-teal-600/10 text-teal-600'}`}>
                    <Network className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-montserrat text-[10px] font-bold uppercase tracking-widest block opacity-70">Metodologia 2</span>
                    <span className="font-montserrat font-bold text-sm uppercase block">Edição Bayesiana</span>
                  </div>
                </button>
              </div>

              {/* INSTAGRAM CTA BUTTON */}
              <div className="pt-6">
                <a
                  href="https://www.instagram.com/previsaoesportiva/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 w-full sm:w-auto justify-center bg-white text-brand-dark px-8 py-4 font-montserrat font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-brand-green hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                >
                  <Instagram className="w-4 h-4 text-brand-green group-hover:text-white" />
                  Seguir @previsaoesportiva
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* CAROUSEL */}
            <div className="relative overflow-hidden rounded-3xl bg-black/40 border border-white/10 p-3 md:p-4 min-h-[460px] md:min-h-[580px] flex flex-col justify-between">
              
              {/* BACKDROP BLURRED IMAGES */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl z-0">
                <img
                  key={`prev-bg-${previousCard}`}
                  src={previousCard}
                  alt=""
                  className="absolute inset-y-0 left-0 h-full w-1/2 object-cover opacity-25 blur-2xl scale-125 transition-opacity duration-700"
                />
                <img
                  key={`next-bg-${nextPreviewCard}`}
                  src={nextPreviewCard}
                  alt=""
                  className="absolute inset-y-0 right-0 h-full w-1/2 object-cover opacity-35 blur-2xl scale-125 transition-opacity duration-700"
                />
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[3px]" />
              </div>

              {/* SLIDES CONTAINER */}
              <div className="relative flex-grow flex items-center justify-center perspective-[1200px] z-10 py-10">
                <button 
                  onClick={prevCard} 
                  aria-label="Card anterior"
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-40 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/10 group shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                </button>
                
                <button 
                  onClick={nextCard} 
                  aria-label="Próximo card"
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-40 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/10 group shadow-lg"
                >
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {cards.map((card, i) => {
                  const offset = getCardOffset(i);
                  const isActive = offset === 0;
                  const isAdjacent = Math.abs(offset) === 1;
                  const hiddenDirection = offset === 0 ? slideDirection : Math.sign(offset || slideDirection);
                  const transformClass = isActive
                    ? 'translate-x-0 translate-y-0 rotate-0 scale-100 opacity-100 z-30 blur-0'
                    : isAdjacent
                      ? `${offset < 0 ? '-translate-x-[48%] -rotate-[4deg]' : 'translate-x-[48%] rotate-[4deg]'} translate-y-2 scale-[0.80] opacity-25 z-20 blur-[2px] saturate-75 brightness-75`
                      : `${hiddenDirection < 0 ? '-translate-x-[90%]' : 'translate-x-[90%]'} translate-y-6 scale-75 opacity-0 z-10 blur-md pointer-events-none`;

                  return (
                    <button
                      key={card}
                      type="button"
                      onClick={() => isAdjacent && goToCard(i)}
                      aria-label={`Abrir card ${i + 1}`}
                      className={`absolute top-4 bottom-14 w-[85%] max-w-[420px] transition-all duration-700 ease-[cubic-bezier(0.2,0.85,0.25,1)] ${transformClass} ${isAdjacent ? 'cursor-pointer' : 'pointer-events-none'}`}
                    >
                      <img
                        src={card}
                        alt={`Insight ${i + 1}`}
                        className={`h-full w-full object-contain transition-all duration-700 ${isActive ? 'drop-shadow-[0_25px_50px_rgba(0,0,0,0.65)]' : 'drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]'}`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* DOTS */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-40 rounded-full bg-black/35 px-2.5 py-1.5 backdrop-blur-md border border-white/5">
                {cards.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToCard(i)}
                    aria-label={`Ir para card ${i + 1}`}
                    className={`h-1 rounded-full transition-all duration-500 ${i === activeCard ? `w-8 md:w-10 ${theme.accentBg}` : 'w-2 bg-white/30 hover:bg-white/50'}`}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ABOUT THE PROJECT SECTION */}
      <section className="max-w-[1080px] mx-auto px-4 py-20 border-t border-brand-dark/10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="mb-3 font-montserrat text-xs font-bold uppercase tracking-widest text-brand-green">
            Sobre o Projeto
          </p>
          <h2 className="text-3xl md:text-5xl font-montserrat font-black uppercase leading-tight text-brand-dark">
            Divulgação Científica e Metodologia
          </h2>
          <p className="mt-4 text-base text-brand-dark/60 leading-relaxed">
            Conheça as bases acadêmicas, a repercussão pública, os pesquisadores envolvidos e a fundamentação teórica de nossas previsões.
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* SCIENCE CARD */}
          <button
            onClick={() => onNavigate('science')}
            type="button"
            className="group flex flex-col items-center text-center bg-white border border-brand-dark/5 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-brand-green/20 hover:-translate-y-1 transition-all duration-300 w-full min-h-[280px] justify-between"
          >
            <div className="p-5 bg-brand-green/5 text-brand-green rounded-2xl group-hover:scale-110 group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
              <GraduationCap className="w-10 h-10" />
            </div>
            <div className="my-4">
              <span className="font-montserrat font-bold text-sm uppercase text-brand-dark group-hover:text-brand-green transition-colors block">
                Produção Científica
              </span>
              <span className="text-xs text-brand-dark/50 block mt-2 leading-relaxed">
                Artigos, preprints e materiais acadêmicos do grupo.
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold font-montserrat uppercase tracking-wider text-brand-dark/40 group-hover:text-brand-green">
              Acessar Artigos <ArrowUpRight className="h-3.5 h-3.5" />
            </span>
          </button>

          {/* MEDIA CARD */}
          <button
            onClick={() => onNavigate('media')}
            type="button"
            className="group flex flex-col items-center text-center bg-white border border-brand-dark/5 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-brand-green/20 hover:-translate-y-1 transition-all duration-300 w-full min-h-[280px] justify-between"
          >
            <div className="p-5 bg-brand-green/5 text-brand-green rounded-2xl group-hover:scale-110 group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
              <Newspaper className="w-10 h-10" />
            </div>
            <div className="my-4">
              <span className="font-montserrat font-bold text-sm uppercase text-brand-dark group-hover:text-brand-green transition-colors block">
                Na Mídia
              </span>
              <span className="text-xs text-brand-dark/50 block mt-2 leading-relaxed">
                Reportagens e registros de divulgação pública na imprensa.
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold font-montserrat uppercase tracking-wider text-brand-dark/40 group-hover:text-brand-green">
              Ver Destaques <ArrowUpRight className="h-3.5 h-3.5" />
            </span>
          </button>

          {/* TEAM CARD */}
          <button
            onClick={() => onNavigate('team')}
            type="button"
            className="group flex flex-col items-center text-center bg-white border border-brand-dark/5 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-brand-green/20 hover:-translate-y-1 transition-all duration-300 w-full min-h-[280px] justify-between"
          >
            <div className="p-5 bg-brand-green/5 text-brand-green rounded-2xl group-hover:scale-110 group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
              <Users className="w-10 h-10" />
            </div>
            <div className="my-4">
              <span className="font-montserrat font-bold text-sm uppercase text-brand-dark group-hover:text-brand-green transition-colors block">
                Equipe de Pesquisa
              </span>
              <span className="text-xs text-brand-dark/50 block mt-2 leading-relaxed">
                Membros, professores e as instituições parceiras envolvidas.
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold font-montserrat uppercase tracking-wider text-brand-dark/40 group-hover:text-brand-green">
              Conhecer Equipe <ArrowUpRight className="h-3.5 h-3.5" />
            </span>
          </button>

          {/* METODOLOGIA CARD */}
          <button
            onClick={() => onNavigate('methodology')}
            type="button"
            className="group flex flex-col items-center text-center bg-white border border-brand-dark/5 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-brand-green/20 hover:-translate-y-1 transition-all duration-300 w-full min-h-[280px] justify-between"
          >
            <div className="p-5 bg-brand-green/5 text-brand-green rounded-2xl group-hover:scale-110 group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
              <BookOpen className="w-10 h-10" />
            </div>
            <div className="my-4">
              <span className="font-montserrat font-bold text-sm uppercase text-brand-dark group-hover:text-brand-green transition-colors block">
                Metodologia
              </span>
              <span className="text-xs text-brand-dark/50 block mt-2 leading-relaxed">
                Modelos matemáticos de simulação (FIFA ELO e Bayes).
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold font-montserrat uppercase tracking-wider text-brand-dark/40 group-hover:text-brand-green">
              Ver Detalhes <ArrowUpRight className="h-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomeOverview;
