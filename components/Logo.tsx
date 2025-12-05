import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-10" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Blue Flame + Ball Scientific Logo */}
      <svg className="h-full w-auto aspect-square" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="flameGradient" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Outer Flame Shape */}
        <path d="M50 5C50 5 85 30 85 60C85 82.0914 69.33 100 50 100C30.67 100 15 82.0914 15 60C15 30 50 5 50 5Z" fill="url(#flameGradient)" />
        
        {/* Inner Flame/Negative Space */}
        <path d="M50 20C50 20 70 40 70 60C70 75 62 88 50 88C38 88 30 75 30 60C30 40 50 20 50 20Z" fill="#1e293b" opacity="0.3" />

        {/* Soccer Ball (Scientific Abstract) */}
        <circle cx="50" cy="62" r="18" fill="white" />
        <path d="M50 50L56 56L66 54L63 64L66 74L56 70L50 78L44 70L34 74L37 64L34 54L44 56L50 50Z" fill="#1E3A8A" />
      </svg>
      
      <div className="flex flex-col justify-center">
        <span className="font-oswald font-bold text-lg tracking-tight leading-none text-slate-900 dark:text-white">PREVISÃO</span>
        <span className="font-oswald font-bold text-lg tracking-widest leading-none text-blue-600">ESPORTIVA</span>
      </div>
    </div>
  );
};