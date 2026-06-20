import React from 'react';
import { Institution } from '../data/institutions';

type InstitutionLogosProps = {
  institutions: Institution[];
  compact?: boolean;
};

const InstitutionLogos: React.FC<InstitutionLogosProps> = ({ institutions, compact = false }) => {
  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-x-6 gap-y-5">
        {institutions.map((institution) => (
          <a
            key={institution.abbr}
            href={institution.url}
            target="_blank"
            rel="noopener noreferrer"
            title={institution.name}
            aria-label={institution.name}
            className="flex h-9 min-w-[72px] max-w-[112px] items-center justify-center opacity-45 grayscale transition hover:opacity-75"
          >
            <img
              src={institution.logo}
              alt={institution.abbr}
              loading="lazy"
              className="max-h-9 max-w-full object-contain"
              style={institution.monochrome ? { filter: 'brightness(0)' } : undefined}
            />
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {institutions.map((institution) => (
        <a
          key={institution.abbr}
          href={institution.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex min-h-[142px] flex-col items-center justify-center gap-4 rounded-xl border border-gray-100 bg-white px-5 py-6 text-center transition hover:border-brand-green/55 hover:shadow-sm"
        >
          <div className="flex h-14 w-full items-center justify-center">
            <img
              src={institution.logo}
              alt={`Logo ${institution.abbr}`}
              loading="lazy"
              className="max-h-14 max-w-[180px] object-contain transition group-hover:scale-[1.03]"
              style={institution.monochrome ? { filter: 'brightness(0)' } : undefined}
            />
          </div>
          <span className="max-w-[210px] font-opensans text-xs leading-relaxed text-gray-400">
            {institution.name}
          </span>
        </a>
      ))}
    </div>
  );
};

export default InstitutionLogos;
