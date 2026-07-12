import React from 'react';

const STARS = [
  { x: 170, y: 232, size: 40, delay: '0s' },
  { x: 231, y: 173, size: 38, delay: '.5s' },
  { x: 292, y: 140, size: 44, delay: '1s' },
  { x: 344, y: 140, size: 44, delay: '1.3s' },
  { x: 411, y: 173, size: 38, delay: '.8s' },
  { x: 470, y: 232, size: 40, delay: '.3s' },
];
const STAR_GLOWS = [
  { cx: 190, cy: 252, r: 22 }, { cx: 250, cy: 192, r: 21 },
  { cx: 314, cy: 162, r: 24 }, { cx: 366, cy: 162, r: 24 },
  { cx: 430, cy: 192, r: 21 }, { cx: 490, cy: 252, r: 22 },
];
const CONFETTI: Array<
  | { t: 'r'; x: number; y: number; w: number; h: number; fill: string; rot: number }
  | { t: 'c'; cx: number; cy: number; r: number; fill: string }
> = [
  { t: 'r', x: 92, y: 118, w: 11, h: 17, fill: '#68E70F', rot: 24 },
  { t: 'c', cx: 150, cy: 92, r: 6, fill: '#FFCF26' },
  { t: 'r', x: 556, y: 104, w: 11, h: 17, fill: '#035C88', rot: -18 },
  { t: 'c', cx: 602, cy: 158, r: 5, fill: '#68E70F' },
  { t: 'r', x: 112, y: 300, w: 10, h: 16, fill: '#FFCF26', rot: 40 },
  { t: 'r', x: 588, y: 298, w: 10, h: 16, fill: '#209927', rot: -30 },
  { t: 'c', cx: 84, cy: 404, r: 6, fill: '#035C88' },
  { t: 'r', x: 604, y: 408, w: 11, h: 17, fill: '#FFCF26', rot: 16 },
  { t: 'c', cx: 210, cy: 104, r: 5, fill: '#68E70F' },
  { t: 'r', x: 476, y: 92, w: 10, h: 15, fill: '#209927', rot: -22 },
  { t: 'c', cx: 520, cy: 214, r: 5, fill: '#FFCF26' },
  { t: 'r', x: 150, y: 360, w: 10, h: 15, fill: '#035C88', rot: 28 },
  { t: 'c', cx: 440, cy: 300, r: 4, fill: '#68E70F' },
  { t: 'c', cx: 300, cy: 82, r: 5, fill: '#FFCF26' },
];

const STAR_PATH = 'M12 2 L14.94 8.26 L21.82 9.02 L16.7 13.64 L18.09 20.42 L12 16.9 L5.91 20.42 L7.3 13.64 L2.18 9.02 L9.06 8.26 Z';

const HexaArt: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 680 520"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Copa do Mundo 2026 nas semifinais</title>
    <desc>
      Troféu dourado coroado por seis estrelas, com raios de luz e confete nas cores do Brasil,
      usado como imagem da série especial de probabilidades da Copa.
    </desc>
    <defs>
      <linearGradient id="hexBgFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1d3b24" />
        <stop offset="55%" stopColor="#0e2614" />
        <stop offset="100%" stopColor="#06170c" />
      </linearGradient>
      <radialGradient id="hexHalo" cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#FFCF26" stopOpacity="0.55" />
        <stop offset="55%" stopColor="#FFCF26" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#FFCF26" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="hexGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFE9A8" />
        <stop offset="50%" stopColor="#F4C53A" />
        <stop offset="100%" stopColor="#C8860D" />
      </linearGradient>
      <linearGradient id="hexGoldDark" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#C9921A" />
        <stop offset="100%" stopColor="#8A5E0C" />
      </linearGradient>
      <linearGradient id="hexRibbon" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#209927" />
        <stop offset="100%" stopColor="#68E70F" />
      </linearGradient>
      <pattern id="hexDots" width="26" height="26" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.3" fill="#68E70F" />
      </pattern>
      <symbol id="hexStar" viewBox="0 0 24 24">
        <path d={STAR_PATH} />
      </symbol>
      <style>{`
        .hx-tw{animation:hx-tw 3s ease-in-out infinite}
        .hx-fl{animation:hx-fl 4.5s ease-in-out infinite;transform-origin:340px 280px}
        .hx-hl{animation:hx-hl 4s ease-in-out infinite}
        @keyframes hx-tw{0%,100%{opacity:1}50%{opacity:.55}}
        @keyframes hx-fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        @keyframes hx-hl{0%,100%{opacity:.85}50%{opacity:.4}}
        @media (prefers-reduced-motion: reduce){.hx-tw,.hx-fl,.hx-hl{animation:none}}
      `}</style>
    </defs>

    <rect x="0" y="0" width="680" height="520" rx="26" fill="url(#hexBgFill)" />
    <rect x="0" y="0" width="680" height="520" rx="26" fill="url(#hexDots)" opacity="0.10" />

    <g opacity="0.12" fill="#FFE9A8">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <polygon key={deg} points="340,250 331,96 349,96" transform={`rotate(${deg} 340 250)`} />
      ))}
    </g>

    <circle cx="340" cy="248" r="180" fill="url(#hexHalo)" className="hx-hl" />

    <g className="hx-hl">
      <rect x="86" y="466" width="20" height="34" rx="3" fill="url(#hexRibbon)" opacity="0.5" />
      <rect x="114" y="450" width="20" height="50" rx="3" fill="url(#hexRibbon)" opacity="0.5" />
      <rect x="142" y="430" width="20" height="70" rx="3" fill="url(#hexRibbon)" opacity="0.5" />
      <rect x="546" y="450" width="20" height="50" rx="3" fill="url(#hexRibbon)" opacity="0.4" />
      <rect x="574" y="466" width="20" height="34" rx="3" fill="url(#hexRibbon)" opacity="0.4" />
    </g>

    <g fill="#FFCF26" opacity="0.18">
      {STAR_GLOWS.map((g, i) => <circle key={i} cx={g.cx} cy={g.cy} r={g.r} />)}
    </g>
    {STARS.map((s, i) => (
      <use
        key={i}
        href="#hexStar"
        x={s.x}
        y={s.y}
        width={s.size}
        height={s.size}
        fill="url(#hexGold)"
        className="hx-tw"
        style={{ animationDelay: s.delay }}
      />
    ))}

    <g className="hx-fl">
      <ellipse cx="340" cy="356" rx="120" ry="12" fill="#FFCF26" opacity="0.16" />
      <path d="M268 205 C272 262 300 300 340 300 C380 300 408 262 412 205 Z" fill="url(#hexGold)" />
      <path d="M268 212 C238 214 232 250 266 266" fill="none" stroke="url(#hexGoldDark)" strokeWidth="10" strokeLinecap="round" />
      <path d="M412 212 C442 214 448 250 414 266" fill="none" stroke="url(#hexGoldDark)" strokeWidth="10" strokeLinecap="round" />
      <ellipse cx="340" cy="205" rx="73" ry="15" fill="#FFE9A8" />
      <ellipse cx="340" cy="205" rx="60" ry="10" fill="#C8860D" opacity="0.45" />
      <path d="M300 210 C302 250 316 285 332 296 C323 270 317 236 318 210 Z" fill="#FFF6CF" opacity="0.55" />
      <rect x="326" y="300" width="28" height="9" rx="3" fill="url(#hexGoldDark)" />
      <path d="M330 309 L350 309 L347 330 L333 330 Z" fill="url(#hexGold)" />
      <rect x="310" y="330" width="60" height="11" rx="3" fill="url(#hexGoldDark)" />
      <rect x="294" y="341" width="92" height="16" rx="5" fill="url(#hexGold)" />
      <rect x="294" y="341" width="92" height="5" rx="2" fill="#FFF6CF" opacity="0.5" />
    </g>

    <g>
      {CONFETTI.map((c, i) =>
        c.t === 'r' ? (
          <rect
            key={i}
            x={c.x}
            y={c.y}
            width={c.w}
            height={c.h}
            rx="2"
            fill={c.fill}
            transform={`rotate(${c.rot} ${c.x + c.w / 2} ${c.y + c.h / 2})`}
          />
        ) : (
          <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill={c.fill} />
        ),
      )}
    </g>
  </svg>
);

export default HexaArt;
