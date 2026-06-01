import React from 'react';
import { ExternalLink } from 'lucide-react';

const STREAMLIT_URL = 'https://previsao2026.streamlit.app/?embed=true';
const STREAMLIT_URL_RAW = 'https://previsao2026.streamlit.app';

const SimulatorPage: React.FC = () => {
  return (
    <div className="relative w-full h-[calc(100dvh-81px)] bg-brand-light">
      <iframe
        src={STREAMLIT_URL}
        title="Simulador Previsão Esportiva"
        className="absolute inset-0 h-full w-full border-0"
        allow="clipboard-read; clipboard-write; fullscreen"
        loading="lazy"
      />
      <a
        href={STREAMLIT_URL_RAW}
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-brand-dark/80 px-3 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur transition hover:bg-brand-dark"
      >
        Abrir em nova aba <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
};

export default SimulatorPage;
