import React from 'react';
import { CalendarDays, Check, Newspaper } from 'lucide-react';

type EditionId = 'pos-rodada1' | 'inicio-copa';

const EDITIONS: Array<{
  id: EditionId;
  title: string;
  date: string;
  description: string;
  href: string;
}> = [
  {
    id: 'pos-rodada1',
    title: 'A Copa Mudou de Rosto',
    date: '18/06/2026',
    description: 'O retrato depois da primeira rodada',
    href: '/caminho-do-hexa',
  },
  {
    id: 'inicio-copa',
    title: 'O Caminho Rumo ao Hexa',
    date: '11/06/2026',
    description: 'A análise publicada antes de a bola rolar',
    href: '/caminho-do-hexa/inicio-da-copa',
  },
];

const ReportEditionSelector: React.FC<{ current: EditionId }> = ({ current }) => (
  <section className="border-b border-brand-dark/10 bg-white">
    <div className="mx-auto max-w-[1080px] px-4 py-8">
      <div className="mb-4 flex items-center gap-2">
        <Newspaper className="h-4 w-4 text-brand-green" />
        <p className="font-montserrat text-[10px] font-black uppercase tracking-[0.22em] text-brand-dark/45">
          Escolha a edição da reportagem
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {EDITIONS.map((edition) => {
          const selected = edition.id === current;
          return (
            <a
              key={edition.id}
              href={edition.href}
              aria-current={selected ? 'page' : undefined}
              className={`group relative rounded-2xl border-2 p-5 transition ${
                selected
                  ? 'border-brand-green bg-brand-green text-white shadow-lg'
                  : 'border-brand-dark/10 bg-brand-light hover:border-brand-green/50 hover:bg-white'
              }`}
            >
              {selected && (
                <span className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-white text-brand-green">
                  <Check className="h-4 w-4" />
                </span>
              )}
              <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider ${selected ? 'text-white/60' : 'text-brand-dark/40'}`}>
                <CalendarDays className="h-3.5 w-3.5" />
                {edition.date}
              </div>
              <p className={`mt-3 pr-8 font-montserrat text-base font-black uppercase ${selected ? 'text-white' : 'text-brand-dark group-hover:text-brand-green'}`}>
                {edition.title}
              </p>
              <p className={`mt-1 text-sm ${selected ? 'text-white/65' : 'text-brand-dark/50'}`}>{edition.description}</p>
            </a>
          );
        })}
      </div>
    </div>
  </section>
);

export default ReportEditionSelector;
