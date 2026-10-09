import React from 'react';
import { SceneId } from '../types/game';

interface SceneBackgroundProps {
  sceneId: SceneId;
}

export const SceneBackground: React.FC<SceneBackgroundProps> = ({ sceneId }) => {
  switch (sceneId) {
    // 1. 幻灵圣殿 (Sanctuary of Spirits) - Roco Magic Academy / Seer Space Station / Aochi Sacred Hall Style
    case 'ACADEMY':
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Deep Arcane Astral Sky */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#090a1f] via-[#101438] to-[#1e1b4b] opacity-95" />

          {/* Shimmering Starlight Layer */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent" />

          {/* Grand Celestial Vector Architecture */}
          <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full preserve-3d" preserveAspectRatio="none">
            <defs>
              <linearGradient id="acadSkyGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="acadFloorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#090d16" />
              </linearGradient>
              <radialGradient id="crystalGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Distant Nebulae & Spire Citadels */}
            <path d="M 0 140 Q 140 100 280 140 Q 420 110 560 140 Q 700 100 840 140 Q 940 110 1000 140 L 1000 500 L 0 500 Z" fill="#13132e" opacity="0.6" />
            <path d="M 0 190 Q 180 150 360 190 Q 540 160 720 190 Q 900 150 1000 190 L 1000 500 L 0 500 Z" fill="#1b1c42" opacity="0.7" />

            {/* Distant Floating Celestial Isles */}
            {/* Left Isle with Mini Astral Tower */}
            <path d="M 60 170 Q 140 150 220 170 Q 180 220 140 230 Q 100 220 60 170 Z" fill="#1e293b" stroke="#6366f1" strokeWidth="1" />
            <polygon points="120,170 140,95 160,170" fill="#3b82f6" />
            <rect x="130" y="130" width="20" height="40" fill="#e0e7ff" />
            <polygon points="90,170 105,120 120,170" fill="#818cf8" />
            <circle cx="140" cy="90" r="4" fill="#facc15" />

            {/* Right Isle with Mystic Pagoda */}
            <path d="M 760 150 Q 860 130 940 150 Q 900 210 850 220 Q 800 210 760 150 Z" fill="#1e293b" stroke="#6366f1" strokeWidth="1" />
            <polygon points="830,150 850,75 870,150" fill="#3b82f6" />
            <rect x="840" y="110" width="20" height="40" fill="#e0e7ff" />
            <circle cx="850" cy="70" r="4" fill="#38bdf8" />

            {/* Sacred Central 9-Color Giant Spirit Monolith Crystal (九彩天元晶) */}
            <circle cx="500" cy="180" r="90" fill="url(#crystalGlow)" />
            {/* Floating Diamond Crystal Polyhedra */}
            <polygon points="500,100 535,170 500,240 465,170" fill="#38bdf8" opacity="0.85" stroke="#fef08a" strokeWidth="2" />
            <polygon points="500,100 535,170 500,240" fill="#60a5fa" opacity="0.9" />
            <polygon points="500,120 525,170 500,220" fill="#fef08a" opacity="0.75" />
            {/* Satellite Mini Crystals Orbiting */}
            <polygon points="430,165 440,150 450,165 440,180" fill="#f43f5e" />
            <polygon points="560,155 570,140 580,155 570,170" fill="#a855f7" />
            <polygon points="495,75 505,65 515,75 505,85" fill="#facc15" />

            {/* Grand Marble Academy Floor Platform */}
            <path d="M 0 290 Q 500 260 1000 290 L 1000 500 L 0 500 Z" fill="url(#acadFloorGrad)" />
            <path d="M 0 340 Q 500 310 1000 340 L 1000 500 L 0 500 Z" fill="#0b0f19" />

            {/* Glowing Golden Arcane Floor Runes / Magic Summoning Circle (洛克王国魔法阵) */}
            <ellipse cx="500" cy="405" rx="380" ry="90" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="16 12" opacity="0.85" />
            <ellipse cx="500" cy="405" rx="280" ry="65" fill="none" stroke="#38bdf8" strokeWidth="3" opacity="0.75" />
            <ellipse cx="500" cy="405" rx="170" ry="40" fill="none" stroke="#fbbf24" strokeWidth="2.5" opacity="0.9" />

            {/* Arcane Pentagram Star inside magic circle */}
            <polygon points="500,365 585,405 550,442 450,442 415,405" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.6" />
            <polygon points="500,445 415,405 450,368 550,368 585,405" fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.5" />

            {/* Grand Academy Spire Pillars with Royal Gold & Dragon Carvings */}
            <g opacity="0.95">
              {/* Left Pillar */}
              <rect x="25" y="180" width="55" height="300" rx="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.5" />
              <polygon points="15,180 52,110 90,180" fill="#d97706" stroke="#fef08a" strokeWidth="1.5" />
              <circle cx="52.5" cy="225" r="14" fill="#38bdf8" stroke="#facc15" strokeWidth="2" />
              <rect x="42" y="270" width="21" height="180" fill="#0f172a" stroke="#ca8a04" strokeWidth="1" />

              {/* Right Pillar */}
              <rect x="920" y="180" width="55" height="300" rx="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.5" />
              <polygon points="910,180 947.5,110 985,180" fill="#d97706" stroke="#fef08a" strokeWidth="1.5" />
              <circle cx="947.5" cy="225" r="14" fill="#38bdf8" stroke="#facc15" strokeWidth="2" />
              <rect x="937" y="270" width="21" height="180" fill="#0f172a" stroke="#ca8a04" strokeWidth="1" />
            </g>
          </svg>

          {/* Floating magical light particles */}
          <div className="absolute top-20 left-1/4 w-3 h-3 rounded-full bg-amber-300 blur-2xs animate-ping" />
          <div className="absolute top-24 right-1/4 w-3.5 h-3.5 rounded-full bg-cyan-300 blur-2xs animate-pulse" />
          <div className="absolute top-36 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-400 blur-xs animate-bounce" />
          <div className="absolute bottom-28 left-1/3 w-2 h-2 rounded-full bg-purple-400 blur-2xs animate-ping" />
          <div className="absolute bottom-32 right-1/3 w-2.5 h-2.5 rounded-full bg-sky-300 blur-2xs animate-ping" />
        </div>
      );

    // 2. 云梦古原 (Cloud Dream Plains) - Vibrant Lush Emerald Green Prairie
    case 'PRAIRIE':
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Azure Sunny Sky Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#38bdf8] via-[#7dd3fc] to-[#dcfce7] opacity-95" />

          {/* Golden Sun Flare in Top Corner */}
          <div className="absolute top-4 right-12 w-32 h-32 rounded-full bg-amber-300/40 blur-2xl pointer-events-none" />

          {/* Animated SVG Prairie Landscape */}
          <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="prairieGrassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>
              <linearGradient id="prairieHillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#166534" />
              </linearGradient>
              <linearGradient id="riverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>

            {/* Fluffy White Clouds */}
            <path d="M 60 70 Q 100 40 140 70 Q 180 50 210 70 Q 230 90 200 100 L 70 100 Z" fill="#ffffff" opacity="0.9" />
            <path d="M 700 50 Q 740 20 780 50 Q 820 30 850 50 Q 880 70 850 80 L 710 80 Z" fill="#ffffff" opacity="0.9" />

            {/* Distant Emerald Cloud Mountains */}
            <polygon points="80,240 240,130 400,240" fill="#86efac" opacity="0.45" />
            <polygon points="320,250 520,110 720,250" fill="#4ade80" opacity="0.55" />
            <polygon points="640,240 820,120 980,240" fill="#86efac" opacity="0.45" />

            {/* Lush Rolling Prairie Hills */}
            <path d="M 0 260 Q 250 180 500 250 Q 750 190 1000 260 L 1000 500 L 0 500 Z" fill="url(#prairieGrassGrad)" />
            <path d="M 0 320 Q 300 260 600 320 Q 850 270 1000 330 L 1000 500 L 0 500 Z" fill="url(#prairieHillGrad)" />

            {/* Crystalline Spirit River winding across the prairie */}
            <path d="M 440 280 Q 480 340 380 400 Q 280 460 320 500 L 420 500 Q 390 450 490 400 Q 560 340 480 280 Z" fill="url(#riverGrad)" opacity="0.8" />
            <path d="M 455 295 Q 490 350 400 410 Q 310 465 345 500" stroke="#ffffff" strokeWidth="2.5" fill="none" opacity="0.75" />

            {/* Front Prairie Hill */}
            <path d="M 0 390 Q 400 330 800 400 L 1000 410 L 1000 500 L 0 500 Z" fill="#14532d" />

            {/* Sacred Ancient World Tree (太古神木) on Right Horizon */}
            <g>
              {/* Giant Trunk */}
              <path d="M 830 380 Q 845 280 825 210 Q 860 190 895 210 Q 875 280 890 380 Z" fill="#5c2c16" />
              {/* Massive Foliage Canopy */}
              <circle cx="860" cy="180" r="65" fill="#15803d" />
              <circle cx="820" cy="190" r="45" fill="#16a34a" />
              <circle cx="900" cy="190" r="45" fill="#16a34a" />
              <circle cx="860" cy="140" r="45" fill="#22c55e" />
              {/* Glowing Golden Spirit Fruits hanging */}
              <circle cx="835" cy="175" r="7" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
              <circle cx="885" cy="185" r="7" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
              <circle cx="855" cy="215" r="7" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
            </g>

            {/* Ancient Prairie Spirit Monolith (苍木灵碑) on Left */}
            <rect x="150" y="240" width="38" height="120" rx="8" fill="#334155" stroke="#10b981" strokeWidth="2.5" />
            <polygon points="140,240 169,190 198,240" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
            <ellipse cx="169" cy="275" rx="7" ry="16" fill="#34d399" opacity="0.9" />

            {/* Cartoon Tree on Left */}
            <rect x="65" y="290" width="16" height="70" fill="#78350f" />
            <circle cx="73" cy="280" r="34" fill="#15803d" />
            <circle cx="60" cy="270" r="24" fill="#22c55e" />
            <circle cx="85" cy="270" r="24" fill="#22c55e" />

            {/* Vibrant Wild Flowers */}
            <circle cx="280" cy="430" r="6" fill="#facc15" />
            <circle cx="490" cy="445" r="7" fill="#f43f5e" />
            <circle cx="680" cy="425" r="6" fill="#38bdf8" />
            <circle cx="760" cy="455" r="7" fill="#fbbf24" />
            <circle cx="560" cy="465" r="6" fill="#c084fc" />
          </svg>

          {/* Floating Butterfly / Pollen Motes */}
          <div className="absolute top-36 left-1/3 w-2.5 h-2.5 rounded-full bg-amber-300 blur-2xs animate-ping" />
          <div className="absolute top-48 right-1/4 w-3 h-3 rounded-full bg-emerald-300 blur-2xs animate-bounce" />
          <div className="absolute bottom-32 left-1/4 w-2 h-2 rounded-full bg-yellow-200 animate-pulse" />
        </div>
      );

    // 3. 苍炎熔渊 (Blazing Abyss) - Fiery Crimson Molten Lava Landscape
    case 'VOLCANO':
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Volcanic Smoke & Magma Sky */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1c0c08] via-[#431407] to-[#7f1d1d] opacity-95" />

          {/* Deep Pulsing Magma Glow */}
          <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-orange-600/30 to-transparent pointer-events-none" />

          {/* SVG Volcano & Magma Fissures */}
          <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lavaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="40%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
            </defs>

            {/* Giant Distant Smoking Volcanic Peak */}
            <polygon points="150,290 480,80 810,290" fill="#292524" />
            <polygon points="260,290 480,95 700,290" fill="#1c1917" />

            {/* Glowing Magma Crater at Volcano Peak */}
            <ellipse cx="480" cy="95" rx="55" ry="18" fill="#ea580c" />
            <ellipse cx="480" cy="95" rx="35" ry="10" fill="#fef08a" />

            {/* Magma Streams Flowing Down the Slopes */}
            <path d="M 480 100 Q 440 170 410 280" stroke="#f97316" strokeWidth="8" fill="none" />
            <path d="M 485 100 Q 535 180 570 280" stroke="#ef4444" strokeWidth="7" fill="none" />
            <path d="M 480 102 Q 442 170 412 280" stroke="#fef08a" strokeWidth="3" fill="none" />

            {/* Ancient Titan Dragon Horn Arch / Ribcage Silhouette */}
            <path d="M 180 300 Q 240 180 320 280" stroke="#78716c" strokeWidth="12" fill="none" opacity="0.6" strokeLinecap="round" />
            <path d="M 230 300 Q 280 200 350 280" stroke="#78716c" strokeWidth="10" fill="none" opacity="0.5" strokeLinecap="round" />

            {/* Dark Basalt Crags Platforms */}
            <path d="M 0 280 L 180 250 L 380 290 L 680 260 L 850 300 L 1000 270 L 1000 500 L 0 500 Z" fill="#1c1917" />
            <path d="M 0 340 L 250 310 L 500 350 L 780 320 L 1000 345 L 1000 500 L 0 500 Z" fill="#0c0a09" />

            {/* Surging Molten Lava River in Foreground */}
            <path d="M 0 410 Q 250 370 500 410 Q 750 450 1000 400 L 1000 480 Q 750 520 500 480 Q 250 440 0 490 Z" fill="url(#lavaGrad)" />
            <path d="M 30 425 Q 260 395 500 425 Q 740 465 970 420" stroke="#fef08a" strokeWidth="5" fill="none" opacity="0.9" />

            {/* Bubbling Lava Geysers */}
            <circle cx="280" cy="425" r="9" fill="#fde047" />
            <circle cx="720" cy="435" r="11" fill="#fde047" />

            {/* Basalt Fire Spires on Left and Right */}
            <rect x="50" y="210" width="36" height="170" rx="3" fill="#1c1917" stroke="#ea580c" strokeWidth="2.5" />
            <polygon points="40,210 68,150 96,210" fill="#44403c" stroke="#ea580c" strokeWidth="1.5" />
            <circle cx="68" cy="245" r="6" fill="#f97316" />

            <rect x="880" y="200" width="40" height="180" rx="3" fill="#1c1917" stroke="#ea580c" strokeWidth="2.5" />
            <polygon points="870,200 900,140 930,200" fill="#44403c" stroke="#ea580c" strokeWidth="1.5" />
            <circle cx="900" cy="240" r="6" fill="#f97316" />
          </svg>

          {/* Floating Magma Cinder Sparks */}
          <div className="absolute bottom-24 left-1/3 w-3 h-3 rounded-full bg-amber-400 blur-2xs animate-ping" />
          <div className="absolute bottom-40 right-1/4 w-2.5 h-2.5 rounded-full bg-rose-400 blur-2xs animate-ping" />
          <div className="absolute bottom-20 right-1/3 w-3.5 h-3.5 rounded-full bg-yellow-300 blur-2xs animate-bounce" />
          <div className="absolute top-44 left-1/2 w-2 h-2 rounded-full bg-orange-400 blur-2xs animate-pulse" />
        </div>
      );

    // 4. 星辰碧海 (Azure Bay) - Tropical Coral Coast & Crystal Waves
    case 'BAY':
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Tropical Sky with Turquoise Horizon */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0284c7] via-[#38bdf8] to-[#bae6fd] opacity-95" />

          {/* Shimmering Water Reflection Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-300/20 via-transparent to-transparent" />

          {/* SVG Ocean Waves & Beach */}
          <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="sandBeachGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
            </defs>

            {/* Distant Sea Horizon */}
            <rect x="0" y="210" width="1000" height="130" fill="#0284c7" />
            <path d="M 0 230 Q 250 220 500 230 Q 750 240 1000 230 L 1000 320 L 0 320 Z" fill="#0369a1" />

            {/* Distant Turtle Shell / Pirate Island Silhouette */}
            <polygon points="720,225 760,195 810,225" fill="#075985" />
            <rect x="755" y="180" width="3" height="18" fill="#0369a1" />

            {/* Rolling Blue Surf Waves with White Foam Crests */}
            <path d="M 0 295 Q 200 265 400 295 Q 600 325 800 285 Q 900 265 1000 295 L 1000 370 L 0 370 Z" fill="#0ea5e9" />
            <path d="M 0 300 Q 200 270 400 300 Q 600 330 800 290 Q 900 270 1000 300" stroke="#ffffff" strokeWidth="6" fill="none" opacity="0.85" />

            {/* Second Tier Waves */}
            <path d="M 0 340 Q 250 315 500 340 Q 750 365 1000 330 L 1000 420 L 0 420 Z" fill="#38bdf8" />
            <path d="M 0 345 Q 250 320 500 345 Q 750 370 1000 335" stroke="#ffffff" strokeWidth="4" fill="none" opacity="0.8" />

            {/* Golden Sand Beach Shore */}
            <path d="M 0 375 Q 300 345 600 375 Q 850 355 1000 385 L 1000 500 L 0 500 Z" fill="url(#sandBeachGrad)" />
            <path d="M 0 415 Q 400 395 800 425 L 1000 435 L 1000 500 L 0 500 Z" fill="#eab308" />

            {/* Coastal Ancient Reef Lighthouse on Left */}
            <rect x="110" y="150" width="28" height="120" fill="#ffffff" stroke="#ef4444" strokeWidth="3" strokeDasharray="24 24" />
            <polygon points="98,150 124,105 150,150" fill="#ef4444" />
            <circle cx="124" cy="135" r="9" fill="#fef08a" opacity="0.95" />

            {/* Giant Iridescent Clam Shell with Spirit Pearl on Beach */}
            <ellipse cx="260" cy="440" rx="35" ry="22" fill="#fda4af" stroke="#f43f5e" strokeWidth="2" />
            <ellipse cx="260" cy="435" rx="28" ry="16" fill="#fbcfe8" />
            <circle cx="260" cy="430" r="10" fill="#ffffff" stroke="#67e8f9" strokeWidth="2" className="animate-pulse" />

            {/* Tropical Palm Trees on Right Shore */}
            <path d="M 890 390 Q 865 290 840 230" stroke="#78350f" strokeWidth="14" fill="none" />
            {/* Swaying Palm Fronds */}
            <ellipse cx="795" cy="220" rx="50" ry="16" fill="#15803d" transform="rotate(-25 795 220)" />
            <ellipse cx="880" cy="215" rx="50" ry="16" fill="#22c55e" transform="rotate(30 880 215)" />
            <ellipse cx="845" cy="195" rx="45" ry="16" fill="#16a34a" transform="rotate(-65 845 195)" />

            {/* Coral Reef Clusters on Left Shore */}
            <path d="M 40 440 Q 60 405 80 440 Q 100 415 115 450" stroke="#f43f5e" strokeWidth="8" fill="none" strokeLinecap="round" />
            <circle cx="340" cy="460" r="7" fill="#fb7185" />
          </svg>

          {/* Sun Sparkles on Water */}
          <div className="absolute top-48 left-1/4 w-2 h-2 rounded-full bg-white blur-2xs animate-ping" />
          <div className="absolute top-52 right-1/3 w-3 h-3 rounded-full bg-cyan-200 blur-2xs animate-ping" />
        </div>
      );

    // 5. 灵木医庐 (Spring of Renewal) - Cherry Blossoms & Sacred Lotus Healing Pool
    case 'HOSPITAL':
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Gentle Twilight Garden Sky */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#2e1065] via-[#4c1d95] to-[#701a75] opacity-95" />

          {/* SVG Garden & Lotus Pond */}
          <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="healingWaterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0891b2" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Distant Misty Forest & Pagoda Roofs */}
            <path d="M 0 240 Q 250 190 500 230 Q 750 200 1000 240 L 1000 500 L 0 500 Z" fill="#3b0764" />
            <path d="M 0 300 Q 300 270 600 300 Q 850 270 1000 310 L 1000 500 L 0 500 Z" fill="#581c87" />

            {/* Traditional Ancient Chinese Healer Pavilion on Left */}
            <polygon points="180,240 280,180 380,240" fill="#b91c1c" stroke="#f59e0b" strokeWidth="2" />
            <path d="M 160 240 Q 280 220 400 240" stroke="#f59e0b" strokeWidth="4" fill="none" />
            <rect x="200" y="240" width="12" height="70" fill="#78350f" />
            <rect x="350" y="240" width="12" height="70" fill="#78350f" />
            <rect x="260" y="250" width="40" height="60" rx="3" fill="#fef08a" opacity="0.8" />

            {/* Sacred Crystal Healing Lotus Pool in Center */}
            <ellipse cx="500" cy="405" rx="310" ry="75" fill="url(#healingWaterGrad)" stroke="#f472b6" strokeWidth="4" />
            <ellipse cx="500" cy="405" rx="220" ry="52" fill="#06b6d4" opacity="0.6" />

            {/* Giant Glowing Lotus Flower in Pool Center */}
            <g transform="translate(0, -5)">
              <path d="M 470 405 Q 500 375 530 405 Q 500 420 470 405 Z" fill="#f43f5e" />
              <path d="M 485 395 Q 500 365 515 395 Q 500 410 485 395 Z" fill="#fb7185" />
              <circle cx="500" cy="400" r="7" fill="#facc15" className="animate-pulse" />
              {/* Swimming Koi Silhouettes */}
              <ellipse cx="440" cy="415" rx="10" ry="4" fill="#f97316" transform="rotate(20 440 415)" />
              <ellipse cx="560" cy="410" rx="9" ry="3.5" fill="#f87171" transform="rotate(-30 560 410)" />
            </g>

            {/* Japanese/Chinese Cherry Blossom Tree on Left */}
            <path d="M 100 400 Q 130 270 90 190" stroke="#451a03" strokeWidth="18" fill="none" />
            <circle cx="80" cy="170" r="50" fill="#f472b6" opacity="0.85" />
            <circle cx="130" cy="160" r="45" fill="#fb7185" opacity="0.85" />
            <circle cx="60" cy="200" r="40" fill="#fbcfe8" opacity="0.9" />

            {/* Wooden Arched Moon Bridge across Pool on Right */}
            <path d="M 680 380 Q 790 330 900 380" stroke="#78350f" strokeWidth="16" fill="none" />
            <path d="M 680 370 Q 790 320 900 370" stroke="#d97706" strokeWidth="5" fill="none" />
          </svg>

          {/* Falling Cherry Blossom Petals */}
          <div className="absolute top-24 left-1/4 w-3 h-4 rounded-full bg-pink-300 rotate-45 animate-pulse" />
          <div className="absolute top-36 left-1/3 w-2.5 h-3.5 rounded-full bg-pink-400 rotate-12 animate-bounce" />
          <div className="absolute top-44 left-1/2 w-3 h-4 rounded-full bg-rose-300 -rotate-30 animate-pulse" />
          <div className="absolute bottom-28 right-1/3 w-2.5 h-3.5 rounded-full bg-pink-200 rotate-45 animate-ping" />
        </div>
      );

    // 6. 万象宝阁 (Treasure Bazaar) - Opulent Royal Palace Interior
    case 'SHOP':
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Palace Interior Atmosphere */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1c1917] via-[#451a03] to-[#0c0a09] opacity-95" />

          {/* Grand Golden Spotlights */}
          <div className="absolute top-0 left-1/4 w-48 h-full bg-amber-400/10 blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-48 h-full bg-amber-400/10 blur-3xl pointer-events-none" />

          {/* SVG Palace Interior Pillars & Drapery */}
          <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            {/* Back Golden Display Shelves */}
            <rect x="180" y="130" width="640" height="200" fill="#292524" stroke="#d97706" strokeWidth="5" />
            <line x1="180" y1="195" x2="820" y2="195" stroke="#d97706" strokeWidth="3" />
            <line x1="180" y1="260" x2="820" y2="260" stroke="#d97706" strokeWidth="3" />

            {/* Glowing Jars, Urns & Mystical Crystals on Shelves */}
            <rect x="250" y="150" width="28" height="42" rx="4" fill="#06b6d4" stroke="#e0f2fe" strokeWidth="1.5" />
            <circle cx="380" cy="170" r="16" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
            <rect x="510" y="215" width="34" height="42" rx="4" fill="#a855f7" stroke="#f3e8ff" strokeWidth="1.5" />
            <rect x="680" y="215" width="32" height="42" rx="4" fill="#10b981" stroke="#d1fae5" strokeWidth="1.5" />
            <circle cx="750" cy="165" r="14" fill="#f43f5e" stroke="#fb7185" strokeWidth="2" />

            {/* Red Imperial Velvet Carpeted Floor */}
            <polygon points="80,500 340,320 660,320 920,500" fill="#991b1b" stroke="#f59e0b" strokeWidth="4" />
            <polygon points="180,500 380,320 620,320 820,500" fill="#b91c1c" />

            {/* Piles of Gold Ingots on Floor Sides */}
            <ellipse cx="250" cy="460" rx="30" ry="12" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" />
            <ellipse cx="280" cy="455" rx="25" ry="10" fill="#fde047" stroke="#b45309" strokeWidth="1.5" />
            <ellipse cx="730" cy="460" rx="30" ry="12" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" />

            {/* Grand Golden Imperial Dragon Columns on Sides */}
            <rect x="30" y="70" width="60" height="430" fill="#451a03" stroke="#f59e0b" strokeWidth="3.5" />
            <polygon points="20,70 60,15 100,70" fill="#d97706" stroke="#fef08a" strokeWidth="1.5" />
            <circle cx="60" cy="120" r="10" fill="#ef4444" stroke="#facc15" strokeWidth="1.5" />

            <rect x="910" y="70" width="60" height="430" fill="#451a03" stroke="#f59e0b" strokeWidth="3.5" />
            <polygon points="900,70 940,15 980,70" fill="#d97706" stroke="#fef08a" strokeWidth="1.5" />
            <circle cx="940" cy="120" r="10" fill="#ef4444" stroke="#facc15" strokeWidth="1.5" />

            {/* Hanging Royal Red & Gold Lanterns */}
            <line x1="160" y1="0" x2="160" y2="110" stroke="#d97706" strokeWidth="2.5" />
            <ellipse cx="160" cy="135" rx="26" ry="30" fill="#dc2626" stroke="#f59e0b" strokeWidth="2.5" />
            <circle cx="160" cy="135" r="12" fill="#fef08a" />

            <line x1="840" y1="0" x2="840" y2="110" stroke="#d97706" strokeWidth="2.5" />
            <ellipse cx="840" cy="135" rx="26" ry="30" fill="#dc2626" stroke="#f59e0b" strokeWidth="2.5" />
            <circle cx="840" cy="135" r="12" fill="#fef08a" />
          </svg>

          {/* Floating Gold Coin Glitter Sparks */}
          <div className="absolute top-36 left-1/3 w-3 h-3 rounded-full bg-yellow-300 blur-2xs animate-ping" />
          <div className="absolute top-44 right-1/3 w-2.5 h-2.5 rounded-full bg-amber-400 blur-2xs animate-pulse" />
        </div>
      );

    // 7. 凌霄试炼台 (Celestial Arena) - Duel Ring in the Thunderclouds
    case 'ARENA':
    default:
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Swirling Thunder Storm Sky */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1e1035] via-[#0f172a] to-[#2e1065] opacity-95" />

          {/* Storm Lightning Ambient Glow */}
          <div className="absolute top-0 inset-x-0 h-40 bg-purple-500/20 blur-3xl pointer-events-none" />

          {/* SVG Celestial Cloud Ring & Obelisks */}
          <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            {/* Swirling Violet Storm Clouds in Sky */}
            <path d="M 0 160 Q 250 100 500 140 Q 750 90 1000 150 L 1000 500 L 0 500 Z" fill="#3b0764" opacity="0.65" />

            {/* Distant Lightning Bolts crackling */}
            <polyline points="220,40 235,90 225,120 245,170" stroke="#c084fc" strokeWidth="3" fill="none" opacity="0.8" />
            <polyline points="780,30 765,80 775,110 755,160" stroke="#fde047" strokeWidth="3" fill="none" opacity="0.8" />

            {/* Massive Ancient Heavy Chains Suspending the Platform */}
            <line x1="80" y1="0" x2="240" y2="350" stroke="#475569" strokeWidth="7" strokeDasharray="14 10" />
            <line x1="920" y1="0" x2="760" y2="350" stroke="#475569" strokeWidth="7" strokeDasharray="14 10" />

            {/* Floating Stone Battle Dais (通天战台) */}
            <polygon points="180,435 340,295 660,295 820,435 500,475" fill="#1e1b4b" stroke="#a855f7" strokeWidth="4.5" />
            <polygon points="240,425 365,310 635,310 760,425 500,460" fill="#312e81" stroke="#facc15" strokeWidth="2.5" />

            {/* Thunder Elemental Rune Rings on Floor */}
            <ellipse cx="500" cy="385" rx="175" ry="50" fill="none" stroke="#facc15" strokeWidth="3.5" strokeDasharray="12 10" />
            <ellipse cx="500" cy="385" rx="110" ry="32" fill="none" stroke="#c084fc" strokeWidth="2" />

            {/* Crackling Lightning Monolith Obelisks on Sides */}
            <rect x="70" y="150" width="40" height="270" rx="3" fill="#1e1b4b" stroke="#a855f7" strokeWidth="2.5" />
            <polygon points="60,150 90,80 120,150" fill="#c084fc" stroke="#fef08a" strokeWidth="1.5" />
            <circle cx="90" cy="115" r="9" fill="#fef08a" />

            <rect x="890" y="150" width="40" height="270" rx="3" fill="#1e1b4b" stroke="#a855f7" strokeWidth="2.5" />
            <polygon points="880,150 910,80 940,150" fill="#c084fc" stroke="#fef08a" strokeWidth="1.5" />
            <circle cx="910" cy="115" r="9" fill="#fef08a" />
          </svg>

          {/* Electric Lightning Sparkles */}
          <div className="absolute top-24 left-1/3 w-3 h-3 rounded-full bg-yellow-300 blur-xs animate-ping" />
          <div className="absolute top-28 right-1/3 w-3 h-3 rounded-full bg-purple-300 blur-xs animate-ping" />
          <div className="absolute bottom-32 left-1/2 w-2.5 h-2.5 rounded-full bg-cyan-300 blur-xs animate-bounce" />
        </div>
      );
  }
};
