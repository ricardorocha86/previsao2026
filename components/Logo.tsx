import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-10" }) => {
  return (
    <div className={`${className}`}>
      {/* Official Brand Logo Image */}
      <img 
        src="/assets/LogoMPrevisao.png" 
        alt="Previsão Esportiva Logo" 
        className="h-full w-auto object-contain"
      />
    </div>
  );
};