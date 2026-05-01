
import React, { useState } from 'react';
import { RESEARCHERS } from '../constants';
import { Researcher } from '../types';
import { Users } from 'lucide-react';
import PageHeader from './PageHeader';

const INSTITUTIONS = [
  { abbr: 'USP', name: 'Universidade de São Paulo' },
  { abbr: 'UFBA', name: 'Universidade Federal da Bahia' },
  { abbr: 'UFSCar', name: 'Universidade Federal de São Carlos' },
  { abbr: 'UFMT', name: 'Universidade Federal de Mato Grosso' },
  { abbr: 'UFRJ', name: 'Universidade Federal do Rio de Janeiro' },
  { abbr: 'UFPR', name: 'Universidade Federal do Paraná' },
  { abbr: 'NEOMA', name: 'NEOMA Business School' },
];

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const LattesIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
  </svg>
);

const MemberCard: React.FC<{ researcher: Researcher }> = ({ researcher }) => {
  const [imgFailed, setImgFailed] = useState(false);

  const initials = researcher.name
    .split(' ')
    .filter((_, i, arr) => i === 0 || i === arr.length - 1)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-brand-green transition-all duration-200 flex flex-col">
        {/* Photo */}
      <div
        className="relative w-full bg-gray-100 shrink-0 overflow-hidden"
        style={{ aspectRatio: '1 / 1' }}
      >
        <div className="block w-full pb-[100%]" />
        {researcher.image && !imgFailed ? (
          <img
            src={researcher.image}
            alt={researcher.name}
            onError={() => setImgFailed(true)}
            className="absolute inset-0 bg-gray-100"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
            }}
          />
        ) : (
          <div
            className="absolute inset-0 w-full h-full flex items-center justify-center text-white text-4xl font-montserrat font-bold"
            style={{ background: 'linear-gradient(135deg, #68E70F, #209927)' }}
          >
            {initials}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-4 py-3 flex flex-col gap-1 flex-1">
        <p className="font-montserrat font-bold text-brand-dark text-sm uppercase leading-tight">
          {researcher.name}
        </p>
        <p className="font-opensans text-gray-400 text-xs">
          {researcher.affiliation}
        </p>

        {/* Links */}
        {(researcher.linkedin || researcher.lattes) && (
          <div className="flex gap-3 mt-auto pt-2">
            {researcher.linkedin && (
              <a
                href={researcher.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-gray-400 hover:text-brand-green transition-colors text-xs font-opensans"
              >
                <LinkedinIcon />
                LinkedIn
              </a>
            )}
            {researcher.lattes && (
              <a
                href={researcher.lattes}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-gray-400 hover:text-brand-green transition-colors text-xs font-opensans"
              >
                <LattesIcon />
                Lattes
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const TeamPage: React.FC = () => {
  const sortByName = (a: Researcher, b: Researcher) =>
    a.name.localeCompare(b.name, 'pt-BR');

  const coords = RESEARCHERS.filter((r) => r.coord).sort(sortByName);
  const members = RESEARCHERS.filter((r) => !r.coord).sort(sortByName);

  return (
    <div className="bg-brand-light min-h-screen">
      <PageHeader
        icon={Users}
        eyebrow="Conheça os integrantes"
        title="Nossa"
        accent="Equipe"
        noBreak
        description="Profissionais dedicados à modelagem estatística e ciência de dados aplicada ao esporte."
      />

      <div className="max-w-6xl mx-auto px-4 py-20">

        {/* Coordenação */}
        <div className="mb-12">
          <h3 className="font-exo-italic text-brand-green text-base mb-1 uppercase tracking-widest">Coordenação</h3>
          <div className="w-10 h-0.5 bg-brand-green mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {coords.map((r) => <MemberCard key={r.id} researcher={r} />)}
          </div>
        </div>

        {/* Membros */}
        <div className="mb-20">
          <h3 className="font-exo-italic text-brand-green text-base mb-1 uppercase tracking-widest">Membros</h3>
          <div className="w-10 h-0.5 bg-brand-green mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {members.map((r) => <MemberCard key={r.id} researcher={r} />)}
          </div>
        </div>

        {/* Instituições */}
        <div>
          <div className="w-full h-px bg-gray-200 mb-10" />
          <p className="font-exo-italic text-brand-green text-base mb-1 uppercase tracking-widest">Parceiros</p>
          <div className="w-10 h-0.5 bg-brand-green mb-8" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
            {INSTITUTIONS.map((inst) => (
              <div
                key={inst.abbr}
                className="flex min-h-[118px] flex-col items-center justify-center gap-1 bg-white px-3 py-4 text-center border border-gray-100 rounded-xl hover:border-brand-green transition-colors"
              >
                <span className="font-montserrat font-bold text-brand-dark text-lg uppercase">
                  {inst.abbr}
                </span>
                <span className="font-opensans text-gray-400 text-xs text-center max-w-[140px]">
                  {inst.name}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TeamPage;
