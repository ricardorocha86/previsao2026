import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  noBreak?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  icon: Icon,
  eyebrow,
  title,
  accent,
  description,
  noBreak = false,
}) => {
  return (
    <header className="relative overflow-hidden bg-brand-dark px-4 py-16 text-center sm:py-20">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#209927_1px,transparent_1px)] [background-size:40px_40px]" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="mb-8 inline-flex max-w-full items-center gap-2 rounded-lg border border-brand-green/30 bg-brand-green/20 px-4 py-2 sm:px-6">
          <Icon className="h-4 w-4 flex-none text-brand-neon" />
          <span className="text-center text-[9px] font-black uppercase leading-relaxed tracking-[0.16em] text-brand-neon sm:text-[10px] sm:tracking-[0.3em]">
            {eyebrow}
          </span>
        </div>

        <h1 className="mb-6 font-montserrat text-3xl font-black uppercase leading-[0.95] tracking-tighter text-white sm:text-4xl md:text-6xl lg:text-7xl">
          {title}{accent && (
            <>
              {noBreak ? ' ' : <br />}
              <span className="text-brand-green italic">{accent}</span>
            </>
          )}
        </h1>

        {description && (
          <p className="mx-auto max-w-2xl font-opensans text-base font-light leading-relaxed text-white/45 sm:text-lg md:text-xl">
            {description}
          </p>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
