import React from 'react';
import { ArrowUpRight, CalendarDays, Check, Newspaper } from 'lucide-react';

type EditionId = 'pos-rodada2' | 'pos-rodada1' | 'inicio-copa';

const EDITIONS: Array<{
  id: EditionId;
  title: string;
  date: string;
  description: string;
  href: string;
  number: string;
}> = [
  {
    id: 'pos-rodada2',
    title: 'O Hexa Ficou Mais Difícil',
    date: '24/06/2026',
    description: 'O retrato depois da segunda rodada',
    href: '/caminho-do-hexa',
    number: '03',
  },
  {
    id: 'pos-rodada1',
    title: 'A Copa Mudou de Rosto',
    date: '18/06/2026',
    description: 'O retrato depois da primeira rodada',
    href: '/a-copa-mudou-de-rosto',
    number: '02',
  },
  {
    id: 'inicio-copa',
    title: 'O Caminho Rumo ao Hexa',
    date: '11/06/2026',
    description: 'A análise publicada antes de a bola rolar',
    href: '/caminho-do-hexa/inicio-da-copa',
    number: '01',
  },
];

const ReportEditionSelector: React.FC<{ current: EditionId }> = ({ current }) => (
  <section className="border-b border-brand-dark/10 bg-[#F3F1EC]">
    <div className="mx-auto grid max-w-[1080px] gap-4 px-4 py-8 lg:grid-cols-[220px_minmax(0,1fr)]">
      <div className="relative overflow-hidden rounded-3xl bg-brand-dark p-6 text-white shadow-xl">
        <div className="pointer-events-none absolute -right-3 -top-10 font-montserrat text-[8rem] font-black leading-none text-white/[0.045]">
          03
        </div>
        <div className="relative">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-neon/25 bg-brand-neon/10">
            <Newspaper className="h-7 w-7 text-brand-neon" />
          </div>
          <p className="mt-5 font-montserrat text-[9px] font-black uppercase tracking-[0.24em] text-brand-neon">
            Especial Copa 2026
          </p>
          <h2 className="mt-2 font-montserrat text-xl font-black uppercase leading-none">
            Arquivo de reportagens
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-white/50">
            Três retratos do torneio, atualizados conforme a bola muda as probabilidades.
          </p>
        </div>
      </div>

      <div className="flex min-w-0 flex-col">
        <div className="mb-3 flex items-end justify-between gap-4 px-1">
          <div>
            <p className="font-montserrat text-[9px] font-black uppercase tracking-[0.22em] text-brand-green">
              Série especial
            </p>
            <p className="mt-1 font-montserrat text-sm font-black uppercase text-brand-dark">
              Escolha uma edição
            </p>
          </div>
          <span className="hidden font-montserrat text-[9px] font-bold uppercase tracking-widest text-brand-dark/35 sm:block">
            3 edições publicadas
          </span>
        </div>

        <div className="grid flex-1 gap-3 md:grid-cols-3">
          {EDITIONS.map((edition) => {
            const selected = edition.id === current;
            return (
              <a
                key={edition.id}
                href={edition.href}
                aria-current={selected ? 'page' : undefined}
                className={`group relative flex min-h-[168px] flex-col overflow-hidden rounded-2xl border bg-white p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                  selected
                    ? 'border-brand-green shadow-lg shadow-brand-green/10 ring-1 ring-brand-green/15'
                    : 'border-brand-dark/10 hover:border-brand-green/35'
                }`}
              >
                <div className={`absolute inset-x-0 top-0 h-1 ${selected ? 'bg-brand-green' : 'bg-brand-dark/10 group-hover:bg-brand-green/50'}`} />

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className={`font-montserrat text-[9px] font-black uppercase tracking-[0.2em] ${selected ? 'text-brand-green' : 'text-brand-dark/30'}`}>
                      Edição {edition.number}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-brand-dark/40">
                      <CalendarDays className="h-3 w-3" />
                      {edition.date}
                    </div>
                  </div>

                  {selected ? (
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-green text-white shadow-sm">
                      <Check className="h-4 w-4" />
                    </span>
                  ) : (
                    <span className="font-montserrat text-4xl font-black leading-none text-brand-dark/[0.07] transition-colors group-hover:text-brand-green/15">
                      {edition.number}
                    </span>
                  )}
                </div>

                <p className={`mt-4 font-montserrat text-[15px] font-black uppercase leading-tight ${selected ? 'text-brand-green' : 'text-brand-dark group-hover:text-brand-green'}`}>
                  {edition.title}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-brand-dark/45">{edition.description}</p>

                <div className="mt-auto flex items-center justify-between border-t border-brand-dark/8 pt-3">
                  <span className={`font-montserrat text-[9px] font-black uppercase tracking-widest ${selected ? 'text-brand-green' : 'text-brand-dark/35 group-hover:text-brand-green'}`}>
                    {selected ? 'Edição atual' : 'Ler reportagem'}
                  </span>
                  <ArrowUpRight className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${selected ? 'text-brand-green' : 'text-brand-dark/25 group-hover:text-brand-green'}`} />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

export default ReportEditionSelector;
