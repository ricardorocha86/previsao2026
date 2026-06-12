import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-10" }) => {
  return (
    <div className={`${className}`}>
      {/* Official Brand Logo Image */}
      <img 
        src="/assets/LogoMPrevisao.webp"
        alt="Previsão Esportiva Logo" 
        className="h-full w-auto object-contain"
        decoding="async"
      />
    </div>
  );
};
