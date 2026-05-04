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
    <header className="bg-brand-dark py-20 px-4 text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#209927_1px,transparent_1px)] [background-size:40px_40px]" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-brand-green/20 border border-brand-green/30 rounded-lg mb-8">
          <Icon className="w-4 h-4 text-brand-neon" />
          <span className="text-[10px] font-black text-brand-neon uppercase tracking-[0.3em]">
            {eyebrow}
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-montserrat font-black text-white uppercase tracking-tighter mb-6 leading-[0.95]">
          {title}{accent && (
            <>
              {noBreak ? ' ' : <br />}
              <span className="text-brand-green italic">{accent}</span>
            </>
          )}
        </h1>

        {description && (
          <p className="text-white/40 max-w-2xl mx-auto text-lg md:text-xl font-light font-opensans">
            {description}
          </p>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
