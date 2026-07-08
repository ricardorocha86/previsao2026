import React from 'react';
import { ArrowRight, MessageSquareText } from 'lucide-react';

interface OpinionCalloutProps {
  eyebrow?: string;
  href?: string;
  onNavigate?: () => void;
  variant?: 'home' | 'report';
}

const excerpt =
  'Depois de uma eliminação do Brasil em Copa do Mundo, o país costuma procurar um culpado para demonizar. É quase um ritual: alguém precisa sair carregando sozinho uma derrota...';

const OpinionCallout: React.FC<OpinionCalloutProps> = ({
  eyebrow = 'Opinião',
  href,
  onNavigate,
  variant = 'home',
}) => {
  const isReport = variant === 'report';
  const className = `group block w-full rounded-lg border border-brand-dark/10 bg-white text-left shadow-sm transition hover:border-brand-green/35 hover:shadow-lg ${
    isReport ? '' : 'border-l-4 border-l-brand-green'
  }`;

  const content = (
    <div className={`flex flex-col justify-center p-8 md:p-12 ${isReport ? 'md:min-h-[250px]' : 'md:min-h-[320px]'}`}>
      <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-brand-green/10 px-3 py-1.5">
        <MessageSquareText className="h-4 w-4 text-brand-green" />
        <span className="font-montserrat text-[10px] font-black uppercase tracking-[0.22em] text-brand-green">
          {eyebrow}
        </span>
      </div>
      <h2 className="max-w-4xl font-montserrat text-3xl font-black uppercase leading-tight text-brand-dark md:text-4xl">
        O verdadeiro culpado pela eliminação do Brasil na Copa do Mundo
      </h2>
      <p className="mt-6 max-w-4xl text-base leading-relaxed text-brand-dark/70 md:text-lg">
        {isReport
          ? 'Depois dos números da eliminação, uma leitura editorial sobre pênaltis, escolhas, aleatoriedade e a pressa de transformar derrota em caça a culpados...'
          : excerpt}
        {' '}
        <span className="inline-flex items-center gap-2 whitespace-nowrap font-montserrat text-xs font-black uppercase tracking-widest text-brand-green">
          Ler mais
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </p>
    </div>
  );

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate();
    }
  };

  return (
    <section className={`${isReport ? 'border-b border-brand-dark/10 bg-brand-light' : 'border-y border-brand-dark/10 bg-white'}`}>
      <div className="mx-auto max-w-[1080px] px-4 py-10">
        {href ? (
          <a href={href} onClick={handleClick} className={className}>
            {content}
          </a>
        ) : (
          <button type="button" onClick={onNavigate} className={className}>
            {content}
          </button>
        )}
      </div>
    </section>
  );
};

export default OpinionCallout;
