import React from 'react';

export type CelestialAtmosphereMode = 'PURPLE_MIST' | 'STARRY_NIGHT' | 'CYAN_AURORA';

interface PokedexBackgroundProps {
  className?: string;
  activeElementType?: string;
  atmosphereMode?: CelestialAtmosphereMode;
}

/**
 * 星灵王国皇家魔兽图鉴 · 专属魔幻蓝紫色调星空背景 (Astra Kingdom Magic Codex Background)
 * Perfectly adheres to Western Fantasy Magic aesthetics for 《星灵王国》:
 * - Deep twilight indigo, sapphire blue, and imperial amethyst/purple palette
 * - Multi-layered swirling magical clouds & nebula with fluid parallax drift
 * - Floating mystical peaks, castle silhouettes, and magic academy towers
 * - Luminous arcane moon with magic circle astrolabe rings
 * - Starlight constellation paths and floating arcane motes
 */
export const PokedexBackground: React.FC<PokedexBackgroundProps> = ({
  className = '',
  activeElementType = 'ALL',
  atmosphereMode = 'PURPLE_MIST',
}) => {
  // Base atmosphere background gradient based on selected mode
  const getAtmosphereBase = () => {
    switch (atmosphereMode) {
      case 'STARRY_NIGHT':
        return 'from-[#040612] via-[#080d24] via-50% to-[#110926]';
      case 'CYAN_AURORA':
        return 'from-[#040c1a] via-[#091530] via-45% to-[#150f2e]';
      case 'PURPLE_MIST':
      default:
        return 'from-[#070b1a] via-[#0d1433] via-45% to-[#190e38]';
    }
  };

  // Elemental ambient tint overlay based on current active tab
  const getElementTint = () => {
    switch (activeElementType) {
      case 'FIRE':
        return 'from-rose-950/30 via-indigo-950/35 to-purple-950/45';
      case 'WATER':
        return 'from-cyan-950/30 via-blue-950/40 to-indigo-950/45';
      case 'GRASS':
        return 'from-emerald-950/25 via-teal-950/35 to-indigo-950/45';
      case 'ELECTRIC':
        return 'from-amber-950/25 via-violet-950/35 to-purple-950/45';
      case 'ROCK':
        return 'from-stone-950/30 via-indigo-950/30 to-amber-950/35';
      case 'ICE':
        return 'from-sky-950/30 via-cyan-950/35 to-indigo-950/45';
      default:
        return 'from-indigo-950/35 via-slate-950/45 to-purple-950/40';
    }
  };

  return (
    <div className={`absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden ${className}`}>
      {/* 1. Deep Midnight Blue-Violet Celestial Gradient Base */}
      <div className={`absolute inset-0 bg-gradient-to-b ${getAtmosphereBase()} transition-colors duration-1000`} />

      {/* 2. Shimmering Spirit Auroras & Nebulae with soft breathing blur */}
      <div className="absolute -top-32 -left-24 w-[150%] h-[75%] bg-gradient-to-r from-blue-600/18 via-purple-600/22 to-cyan-500/18 blur-3xl animate-pulse pointer-events-none" style={{ animationDuration: '8s' }} />
      <div className="absolute top-1/4 -right-24 w-[85%] h-[65%] bg-gradient-to-l from-indigo-500/22 via-purple-700/18 to-transparent blur-3xl pointer-events-none" />
      <div className={`absolute inset-0 bg-gradient-to-tr ${getElementTint()} transition-colors duration-700 pointer-events-none`} />

      {/* 3. Master High-Definition Eastern Xianxia SVG Landscape */}
      <svg
        viewBox="0 0 1200 700"
        className="absolute inset-0 w-full h-full object-cover opacity-95"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Luminous Spirit Moon Halo Radial Gradient */}
          <radialGradient id="pokedexMoonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#a5b4fc" stopOpacity="0.5" />
            <stop offset="65%" stopColor="#6366f1" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#312e81" stopOpacity="0" />
          </radialGradient>

          {/* Distant Mountains Indigo Gradient */}
          <linearGradient id="mtnGradFar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#0f172a" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.98" />
          </linearGradient>

          {/* Mid-range Floating Mountain Peak Gradient */}
          <linearGradient id="mtnGradMid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#312e81" stopOpacity="0.92" />
            <stop offset="50%" stopColor="#1e1b4b" stopOpacity="0.96" />
            <stop offset="100%" stopColor="#0c0f24" stopOpacity="1" />
          </linearGradient>

          {/* Near Crag Cliff Gradient */}
          <linearGradient id="mtnGradNear" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4338ca" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#1e1b4b" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#070a1e" stopOpacity="1" />
          </linearGradient>

          {/* Ethereal Mist Gradient: Cyan, Lavender, Violet */}
          <linearGradient id="mistGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0" />
            <stop offset="20%" stopColor="#c084fc" stopOpacity="0.28" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.38" />
            <stop offset="80%" stopColor="#a855f7" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
          </linearGradient>

          {/* Low Floor Mist Gradient */}
          <linearGradient id="floorMistGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#070a1e" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#1e1b4b" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
          </linearGradient>

          {/* Pagoda Pavilion Gradient */}
          <linearGradient id="pagodaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#312e81" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
        </defs>

        {/* 1. Luminous Spirit Moon (太阴皎月) & Bagua Astrolabe Celestial Rings */}
        <g transform="translate(960, 130)">
          {/* Luminous Lunar Glow */}
          <circle cx="0" cy="0" r="90" fill="url(#pokedexMoonGlow)" />
          {/* Solid Crescent Moon */}
          <circle cx="0" cy="0" r="40" fill="#e0e7ff" opacity="0.92" filter="drop-shadow(0 0 20px #818cf8)" />
          <circle cx="9" cy="-7" r="36" fill="#1e1b4b" opacity="0.88" />

          {/* Astrological Bagua Celestial Rings with Rotation */}
          <circle
            cx="0"
            cy="0"
            r="115"
            fill="none"
            stroke="#818cf8"
            strokeWidth="1.2"
            strokeDasharray="6 8"
            opacity="0.45"
            className="animate-[spin_60s_linear_infinite]"
          />
          <circle
            cx="0"
            cy="0"
            r="145"
            fill="none"
            stroke="#c084fc"
            strokeWidth="0.8"
            strokeDasharray="4 10"
            opacity="0.35"
            className="animate-[spin_45s_linear_infinite_reverse]"
          />
          <line x1="-160" y1="0" x2="160" y2="0" stroke="#818cf8" strokeWidth="0.8" strokeDasharray="8 6" opacity="0.3" />
          <line x1="0" y1="-160" x2="0" y2="160" stroke="#818cf8" strokeWidth="0.8" strokeDasharray="8 6" opacity="0.3" />

          {/* Orbiting Starlight Nodes */}
          <circle cx="0" cy="-115" r="2.5" fill="#fde047" filter="drop-shadow(0 0 6px #fde047)" />
          <circle cx="115" cy="0" r="2" fill="#38bdf8" filter="drop-shadow(0 0 4px #38bdf8)" />
          <circle cx="-115" cy="0" r="2" fill="#c084fc" filter="drop-shadow(0 0 4px #c084fc)" />
        </g>

        {/* 2. Twenty-Eight Mansions / Northern Dipper Constellation Stars (二十八星宿) */}
        <g opacity="0.8">
          <polyline
            points="110,80 170,60 240,90 310,85 360,130 450,110 510,150"
            fill="none"
            stroke="#818cf8"
            strokeWidth="0.9"
            strokeDasharray="5 4"
            opacity="0.45"
          />
          {[
            { cx: 110, cy: 80, r: 2.4, color: '#ffffff' },
            { cx: 170, cy: 60, r: 2.0, color: '#e0e7ff' },
            { cx: 240, cy: 90, r: 2.6, color: '#ffffff' },
            { cx: 310, cy: 85, r: 2.0, color: '#c7d2fe' },
            { cx: 360, cy: 130, r: 3.0, color: '#fef08a' },
            { cx: 450, cy: 110, r: 2.2, color: '#ffffff' },
            { cx: 510, cy: 150, r: 3.2, color: '#38bdf8' },
            { cx: 620, cy: 75, r: 1.8, color: '#ffffff' },
            { cx: 700, cy: 125, r: 2.5, color: '#e0e7ff' },
            { cx: 780, cy: 65, r: 2.0, color: '#c084fc' },
            { cx: 200, cy: 185, r: 1.6, color: '#ffffff' },
            { cx: 320, cy: 215, r: 2.2, color: '#38bdf8' },
            { cx: 60, cy: 155, r: 1.8, color: '#ffffff' },
          ].map((st, i) => (
            <circle
              key={i}
              cx={st.cx}
              cy={st.cy}
              r={st.r}
              fill={st.color}
              filter="drop-shadow(0 0 5px #a5b4fc)"
              className="animate-pulse"
              style={{ animationDuration: `${2.2 + (i % 4) * 0.8}s` }}
            />
          ))}
        </g>

        {/* 3. Deep Distant Celestial Mountain Silhouettes (远山叠嶂) */}
        <path
          d="M 0 310 Q 180 190, 380 250 T 780 200 T 1200 260 L 1200 700 L 0 700 Z"
          fill="url(#mtnGradFar)"
          opacity="0.8"
        />

        {/* 4. Mid-Ground Floating Peaks & Magic Academy Spires (浮空魔法群峰 · 皇家魔导高塔) */}
        <g>
          {/* Left Floating Island Peak */}
          <path
            d="M 30 420 Q 80 270, 150 250 Q 230 270, 280 440 Q 190 480, 30 420 Z"
            fill="url(#mtnGradMid)"
          />
          {/* Ancient Spirit Pavilion on Left Peak */}
          <g transform="translate(135, 220)" opacity="0.9">
            {/* Pagoda Roof */}
            <path d="M 0 20 Q 15 14, 32 20 L 26 14 Q 15 11, 4 14 Z" fill="#c084fc" />
            <polygon points="5,14 16,3 27,14" fill="url(#pagodaGrad)" />
            {/* Curled Eaves */}
            <path d="M -3 21 Q 16 13, 35 21" stroke="#fbcfe8" strokeWidth="1.2" fill="none" />
            {/* Pillars & Glow */}
            <rect x="9" y="20" width="14" height="15" fill="#1e1b4b" />
            <circle cx="16" cy="2" r="2.8" fill="#fde047" filter="drop-shadow(0 0 5px #fde047)" />
          </g>

          {/* Central Distant Crag */}
          <path
            d="M 410 460 Q 510 280, 590 310 Q 680 340, 770 480 Z"
            fill="url(#mtnGradMid)"
            opacity="0.85"
          />

          {/* Right Grand Magic Peak (皇家魔导主峰) */}
          <path
            d="M 810 480 Q 910 210, 1010 230 Q 1110 290, 1200 430 L 1200 700 L 810 700 Z"
            fill="url(#mtnGradMid)"
          />
          {/* Multi-Tier Grand Magic Citadel Spire (王国通天魔导塔) */}
          <g transform="translate(970, 170)" opacity="0.92">
            {/* Upper Tier Roof */}
            <path d="M -5 20 Q 20 12, 45 20 L 38 14 Q 20 10, 2 14 Z" fill="#818cf8" />
            <polygon points="5,14 20,2 35,14" fill="#312e81" stroke="#c084fc" strokeWidth="0.8" />
            {/* Middle Tier Roof */}
            <path d="M -12 36 Q 20 25, 52 36 L 44 28 Q 20 22, -4 28 Z" fill="#6366f1" />
            <rect x="6" y="20" width="28" height="12" fill="#1e1b4b" />
            {/* Lower Tier Roof */}
            <path d="M -18 54 Q 20 40, 58 54 L 50 44 Q 20 36, -10 44 Z" fill="#4f46e5" />
            <rect x="0" y="36" width="40" height="16" fill="#1e1b4b" />
            {/* Pagoda Base Foundation */}
            <rect x="-8" y="54" width="56" height="20" fill="#0f172a" />
            {/* Spire Pinnacle & Luminous Spirit Orb */}
            <line x1="20" y1="2" x2="20" y2="-12" stroke="#fde047" strokeWidth="2.2" />
            <circle cx="20" cy="-12" r="4" fill="#fef08a" filter="drop-shadow(0 0 10px #fde047)" />
          </g>
        </g>

        {/* 5. Flowing River of Swirling Immortal Clouds & Celestial Mist (云雾缭绕) */}
        {/* Layer 1: Ethereal High Swirling Mist Band */}
        <g fill="url(#mistGrad)">
          <path
            d="M -50 350 C 150 310, 300 400, 520 340 C 740 280, 920 370, 1250 320 L 1250 430 C 950 480, 750 400, 520 450 C 280 500, 120 420, -50 440 Z"
            filter="blur(7px)"
          />
          <path
            d="M -20 430 C 220 370, 440 470, 700 410 C 960 350, 1100 430, 1220 400 L 1220 510 C 1020 550, 840 470, 600 520 C 360 570, 140 480, -20 500 Z"
            filter="blur(9px)"
          />
        </g>

        {/* 6. Foreground Misty Crags & Ancient Pine Silhouettes (皇家古木 · 魔导悬崖) */}
        <g>
          {/* Left Foreground Cliff Crag */}
          <path
            d="M -40 510 Q 80 430, 180 480 Q 260 550, 180 700 L -40 700 Z"
            fill="url(#mtnGradNear)"
          />
          {/* Ancient Immortal Gnarled Pine on Left Cliff */}
          <g stroke="#080c1d" fill="#080c1d" strokeLinecap="round">
            {/* Trunk with twisting branches */}
            <path d="M 55 510 Q 70 470, 105 450 Q 135 435, 165 440" strokeWidth="8.5" fill="none" />
            <path d="M 105 450 Q 90 430, 85 410" strokeWidth="5" fill="none" />
            <path d="M 135 435 Q 160 415, 180 420" strokeWidth="4.5" fill="none" />
            {/* Pine Needle Tufts */}
            <ellipse cx="85" cy="408" rx="22" ry="8" />
            <ellipse cx="110" cy="425" rx="24" ry="9" />
            <ellipse cx="165" cy="415" rx="28" ry="10" />
            <ellipse cx="190" cy="425" rx="22" ry="8" />
          </g>

          {/* Right Foreground Cliff Crag */}
          <path
            d="M 1030 510 Q 1110 450, 1240 500 L 1240 700 L 970 700 Z"
            fill="url(#mtnGradNear)"
          />
          {/* Right Pine Silhouette */}
          <g stroke="#080c1d" fill="#080c1d" strokeLinecap="round">
            <path d="M 1110 510 Q 1090 470, 1060 455 Q 1030 445, 1010 450" strokeWidth="7.5" fill="none" />
            <ellipse cx="1010" cy="448" rx="24" ry="9" />
            <ellipse cx="1055" cy="442" rx="26" ry="9" />
          </g>
        </g>

        {/* 7. Low Rolling Immortal Fog Blanket (低空灵云海) */}
        <path
          d="M -50 550 Q 200 490, 480 530 Q 760 470, 1020 520 Q 1140 500, 1250 540 L 1250 700 L -50 700 Z"
          fill="url(#mistGrad)"
          filter="blur(16px)"
          opacity="0.85"
        />
        <path
          d="M -50 610 Q 300 570, 600 600 Q 900 560, 1250 600 L 1250 700 L -50 700 Z"
          fill="url(#floorMistGrad)"
        />

        {/* 8. Pairs of Flying Magic Eagles & Floating Spirit Essence Motes (苍穹飞禽 · 魔法光粒) */}
        <g opacity="0.7">
          {/* Distant Pair of Flying Immortal Cranes */}
          <g transform="translate(470, 200) scale(0.85)">
            <path d="M 0 0 Q 10 -7, 20 -2 Q 30 -7, 40 0 Q 25 3, 20 8 Q 15 3, 0 0 Z" fill="#e0e7ff" />
          </g>
          <g transform="translate(515, 220) scale(0.65)">
            <path d="M 0 0 Q 10 -7, 20 -2 Q 30 -7, 40 0 Q 25 3, 20 8 Q 15 3, 0 0 Z" fill="#e0e7ff" />
          </g>
          <g transform="translate(560, 190) scale(0.5)">
            <path d="M 0 0 Q 10 -7, 20 -2 Q 30 -7, 40 0 Q 25 3, 20 8 Q 15 3, 0 0 Z" fill="#e0e7ff" />
          </g>

          {/* Floating Spirit Light Orbs / Ethereal Fireflies */}
          <circle cx="210" cy="370" r="2.8" fill="#38bdf8" filter="drop-shadow(0 0 7px #38bdf8)" className="animate-ping" style={{ animationDuration: '4s' }} />
          <circle cx="350" cy="410" r="3.2" fill="#c084fc" filter="drop-shadow(0 0 7px #c084fc)" className="animate-pulse" />
          <circle cx="670" cy="350" r="2.2" fill="#818cf8" filter="drop-shadow(0 0 6px #818cf8)" className="animate-ping" style={{ animationDuration: '5s' }} />
          <circle cx="850" cy="400" r="3.2" fill="#38bdf8" filter="drop-shadow(0 0 7px #38bdf8)" className="animate-pulse" />
          <circle cx="750" cy="470" r="2.8" fill="#fde047" filter="drop-shadow(0 0 7px #fde047)" className="animate-pulse" />
          <circle cx="140" cy="480" r="2" fill="#a7f3d0" filter="drop-shadow(0 0 5px #34d399)" className="animate-pulse" />
        </g>
      </svg>

      {/* 4. Fine Atmospheric Vignette & Ethereal Grain Overlay */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#070b1a]/30 to-[#03050c]/85 pointer-events-none" />
    </div>
  );
};
