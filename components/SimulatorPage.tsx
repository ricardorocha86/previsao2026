import React from 'react';
import { Dices, ExternalLink } from 'lucide-react';
import PageHeader from './PageHeader';

const STREAMLIT_URL = 'https://previsao2026.streamlit.app/?embed=true';
const STREAMLIT_URL_RAW = 'https://previsao2026.streamlit.app';

const SimulatorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-light pb-24 font-opensans">
      <PageHeader
        icon={Dices}
        eyebrow="Aplicativo interativo"
        title="Simulador"
        accent="Copa do Mundo 2026"
        description="Explore o aplicativo interativo da Previsão Esportiva para simular cenários e probabilidades da Copa do Mundo de 2026."
      />

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="relative w-full h-[85vh] min-h-[680px] rounded-[1.75rem] overflow-hidden border border-brand-dark/10 shadow-2xl bg-white">
          <iframe
            src={STREAMLIT_URL}
            title="Simulador Previsão Esportiva"
            className="absolute inset-0 h-full w-full border-0"
            allow="clipboard-read; clipboard-write; fullscreen"
            loading="lazy"
          />
        </div>

        <p className="mt-5 text-center text-sm text-brand-dark/50">
          O aplicativo não carregou ou está iniciando?{' '}
          <a
            href={STREAMLIT_URL_RAW}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-bold text-brand-green hover:underline"
          >
            Abrir em nova aba <ExternalLink className="h-4 w-4" />
          </a>
        </p>
      </div>
    </div>
  );
};

export default SimulatorPage;
