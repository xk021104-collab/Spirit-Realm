import React from 'react';
import { SceneId } from '../types/game';

interface SceneBackgroundProps {
  sceneId: SceneId;
}

export const SceneBackground: React.FC<SceneBackgroundProps> = ({ sceneId }) => {
  switch (sceneId) {
    // 1. 天灵圣殿 (Celestial Sanctuary) - Ethereal floating starlight temples, auroras, glowing crystals
    case 'ACADEMY':
      return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none bg-slate-950">
          {/* Deep Space & Aurora Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#060b1c] via-[#0b1536] to-[#040817]" />

          {/* Shimmering Cosmic Auroras */}
          <div className="absolute -top-1/4 -left-1/4 w-[150%] h-[80%] bg-gradient-to-r from-cyan-600/15 via-indigo-500/20 to-purple-600/15 blur-3xl animate-aurora pointer-events-none" />
          <div className="absolute top-10 left-1/3 w-[60%] h-[40%] bg-gradient-to-b from-sky-400/10 to-teal-400/10 blur-2xl pointer-events-none" />

          {/* Radiant Distant Celestial Crescent Moon & Starfield */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="acadMoonGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.4" />
                <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="acadPillarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#1e293b" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="acadFloorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0f172a" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#1e1b4b" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#090d16" stopOpacity="0.98" />
              </linearGradient>
              <linearGradient id="acadStreamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#818cf8" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Distant Crescent Moon */}
            <circle cx="85%" cy="18%" r="48" fill="url(#acadMoonGlow)" />
            <path
              d="M 85% 10% A 25 25 0 1 0 85% 26% A 20 20 0 1 1 85% 10% Z"
              fill="#e0f2fe"
              opacity="0.85"
              filter="drop-shadow(0 0 12px #38bdf8)"
            />

            {/* Twinkling Star Clusters */}
            {[
              { x: 12, y: 15, r: 1.5, o: 0.8 },
              { x: 28, y: 22, r: 1.2, o: 0.6 },
              { x: 42, y: 12, r: 2.0, o: 0.9 },
              { x: 65, y: 18, r: 1.4, o: 0.7 },
              { x: 74, y: 8, r: 1.8, o: 0.85 },
              { x: 92, y: 28, r: 1.2, o: 0.5 },
              { x: 18, y: 32, r: 1.6, o: 0.75 },
              { x: 52, y: 28, r: 1.3, o: 0.6 },
            ].map((s, idx) => (
              <circle
                key={idx}
                cx={`${s.x}%`}
                cy={`${s.y}%`}
                r={s.r}
                fill="#ffffff"
                opacity={s.o}
                className="animate-pulse"
              />
            ))}

            {/* Distant Misty Mountain Ridges */}
            <path
              d="M 0 260 Q 200 180, 420 230 T 800 190 T 1200 240 L 1200 600 L 0 600 Z"
              fill="#080e22"
              opacity="0.75"
            />
            <path
              d="M 0 290 Q 300 240, 600 270 T 1200 250 L 1200 600 L 0 600 Z"
              fill="#0d1733"
              opacity="0.85"
            />

            {/* Floating Celestial Sanctuary Pillars & Spires */}
            <g opacity="0.65">
              {/* Left Spire */}
              <polygon points="120,380 135,160 150,380" fill="url(#acadPillarGrad)" />
              <polygon points="135,140 130,160 140,160" fill="#38bdf8" />
              <circle cx="135" cy="140" r="4" fill="#e0f2fe" filter="drop-shadow(0 0 6px #38bdf8)" />

              {/* Right Spire */}
              <polygon points="850,380 865,170 880,380" fill="url(#acadPillarGrad)" />
              <polygon points="865,150 860,170 870,170" fill="#38bdf8" />
              <circle cx="865" cy="150" r="4" fill="#e0f2fe" filter="drop-shadow(0 0 6px #38bdf8)" />

              {/* Floating Island Platforms */}
              <ellipse cx="220" cy="220" rx="60" ry="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
              <ellipse cx="780" cy="230" rx="75" ry="16" fill="#0f172a" stroke="#818cf8" strokeWidth="1" strokeOpacity="0.4" />
            </g>

            {/* Sanctuary Sacred Ground Terrace */}
            <path
              d="M 0 340 Q 500 310, 1000 340 L 1000 600 L 0 600 Z"
              fill="url(#acadFloorGrad)"
            />

            {/* Luminous Celestial Arcane Stream */}
            <path
              d="M 120 370 Q 500 330, 880 370"
              stroke="url(#acadStreamGrad)"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
              filter="drop-shadow(0 0 8px #38bdf8)"
            />

            {/* Sacred Concentric Runic Floor Arrays (Center Stage) */}
            <ellipse cx="50%" cy="66%" rx="360" ry="110" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.3" />
            <ellipse cx="50%" cy="66%" rx="260" ry="80" fill="none" stroke="#818cf8" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="8 6" />
            <ellipse cx="50%" cy="66%" rx="160" ry="50" fill="none" stroke="#c084fc" strokeWidth="1.5" strokeOpacity="0.5" />
            <ellipse cx="50%" cy="66%" rx="70" ry="22" fill="#38bdf8" fillOpacity="0.08" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.8" filter="drop-shadow(0 0 10px #38bdf8)" />
          </svg>

          {/* Center Floating Monolith Crystal */}
          <div className="absolute top-[28%] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none animate-float">
            <div className="w-10 h-20 bg-gradient-to-t from-cyan-400 via-sky-300 to-white clip-polygon-crystal shadow-[0_0_35px_rgba(56,189,248,0.8)] opacity-90" />
            <div className="w-24 h-4 bg-cyan-400/30 rounded-full blur-md -mt-2" />
          </div>

          {/* Ambient Stardust Fireflies */}
          <div className="absolute bottom-16 left-1/4 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#38bdf8] animate-ping" />
          <div className="absolute bottom-24 right-1/3 w-1.5 h-1.5 rounded-full bg-indigo-300 shadow-[0_0_8px_#818cf8] animate-pulse" />
        </div>
      );

    // 2. 苍木幽林 (Bioluminescent Whispering Grove - exactly matching user's stag reference art)
    case 'PRAIRIE':
      return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none bg-[#020b14]">
          {/* Night Sky & Deep Forest Canopy Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#020914] via-[#041624] to-[#020d18]" />

          {/* Bioluminescent Starlight & Emerald Aurora Waves */}
          <div className="absolute -top-1/4 left-10 w-[120%] h-[70%] bg-gradient-to-r from-teal-500/15 via-cyan-500/20 to-emerald-500/15 blur-3xl animate-aurora" />

          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="forestMoon" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.5" />
                <stop offset="70%" stopColor="#059669" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#022c22" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.5" />
              </linearGradient>
            </defs>

            {/* Glowing Celestial Full Moon */}
            <circle cx="20%" cy="16%" r="55" fill="url(#forestMoon)" />
            <circle cx="20%" cy="16%" r="28" fill="#e6fffa" opacity="0.9" filter="drop-shadow(0 0 16px #2dd4bf)" />

            {/* Starry Night Sky Motes */}
            {[
              { x: 35, y: 10, r: 1.5 },
              { x: 48, y: 16, r: 1.8 },
              { x: 62, y: 8, r: 1.3 },
              { x: 78, y: 14, r: 2.0 },
              { x: 88, y: 22, r: 1.2 },
              { x: 12, y: 25, r: 1.4 },
            ].map((s, idx) => (
              <circle key={idx} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="#ecfdf5" opacity="0.85" className="animate-pulse" />
            ))}

            {/* Distant Mountain Silhouettes & Bioluminescent Ancient Trees */}
            <path d="M 0 240 Q 250 170, 500 220 T 1000 180 L 1000 600 L 0 600 Z" fill="#031622" opacity="0.7" />
            <path d="M 0 280 Q 350 230, 700 270 T 1000 250 L 1000 600 L 0 600 Z" fill="#04202b" opacity="0.85" />

            {/* Great World Spirit Tree Trunk & Glowing Ancient Branches (Left) */}
            <path
              d="M -30 180 Q 80 280, 110 500 L -40 500 Z"
              fill="#061f2d"
            />
            {/* Glowing bioluminescent branch arches */}
            <path
              d="M 60 260 Q 180 180, 320 220"
              stroke="#2dd4bf"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
              filter="drop-shadow(0 0 8px #2dd4bf)"
            />
            <path
              d="M 850 240 Q 750 170, 620 230"
              stroke="#38bdf8"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
              filter="drop-shadow(0 0 8px #38bdf8)"
            />

            {/* Luminous Bioluminescent Forest Stream (winding towards distance) */}
            <path
              d="M 480 300 Q 520 380, 460 440 T 360 600 L 460 600 Q 580 460, 560 380 T 520 300 Z"
              fill="url(#riverGrad)"
              opacity="0.6"
              filter="drop-shadow(0 0 12px #2dd4bf)"
            />

            {/* Mossy Enchanted Forest Floor */}
            <path
              d="M 0 350 Q 500 320, 1000 350 L 1000 600 L 0 600 Z"
              fill="#031726"
              opacity="0.95"
            />

            {/* Natural Spirit Stone Circle Stage */}
            <ellipse cx="50%" cy="68%" rx="350" ry="110" fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeOpacity="0.4" />
            <ellipse cx="50%" cy="68%" rx="240" ry="75" fill="none" stroke="#34d399" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="6 6" />
            <ellipse cx="50%" cy="68%" rx="130" ry="40" fill="#2dd4bf" fillOpacity="0.08" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.6" filter="drop-shadow(0 0 12px #2dd4bf)" />
          </svg>

          {/* Bioluminescent Bluebell Flora & Spores along edges */}
          <div className="absolute bottom-12 left-10 flex items-center gap-2 pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
            <div className="w-3 h-3 rounded-full bg-teal-300 shadow-[0_0_14px_#2dd4bf] animate-ping" />
          </div>
          <div className="absolute bottom-14 right-16 flex items-center gap-2 pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-[0_0_12px_#2dd4bf] animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_10px_#38bdf8]" />
          </div>
        </div>
      );

    // 3. 炎天炽渊 (Crimson Dragon Caldera)
    case 'VOLCANO':
      return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none bg-[#0f0404]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a0505] via-[#240808] to-[#0a0202]" />

          {/* Deep Magma Embers & Crimson Aura */}
          <div className="absolute -top-1/4 left-1/4 w-[120%] h-[70%] bg-gradient-to-r from-orange-600/15 via-red-600/20 to-amber-600/15 blur-3xl animate-aurora" />

          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lavaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#ef4444" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.7" />
              </linearGradient>
            </defs>

            {/* Jagged Obsidian Peaks */}
            <polygon points="80,340 220,160 360,340" fill="#1f0a0a" />
            <polygon points="320,350 480,180 640,350" fill="#140606" />
            <polygon points="600,340 760,150 920,340" fill="#1c0808" />

            {/* Glowing Magma Caldera Veins */}
            <path
              d="M 120 380 Q 300 340, 500 370 T 900 360"
              stroke="url(#lavaGrad)"
              strokeWidth="3"
              fill="none"
              filter="drop-shadow(0 0 12px #f97316)"
            />

            {/* Obsidian Stage Terrace */}
            <path d="M 0 350 Q 500 320, 1000 350 L 1000 600 L 0 600 Z" fill="#0d0404" />

            {/* Flaming Sacred Arena Rings */}
            <ellipse cx="50%" cy="68%" rx="350" ry="110" fill="none" stroke="#f97316" strokeWidth="1.5" strokeOpacity="0.4" />
            <ellipse cx="50%" cy="68%" rx="240" ry="75" fill="none" stroke="#ef4444" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="6 6" />
            <ellipse cx="50%" cy="68%" rx="130" ry="40" fill="#f97316" fillOpacity="0.08" stroke="#f59e0b" strokeWidth="2" strokeOpacity="0.7" filter="drop-shadow(0 0 14px #f97316)" />
          </svg>

          {/* Floating Sacred Fire Embers */}
          <div className="absolute bottom-20 left-1/3 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_12px_#f59e0b] animate-bounce" />
          <div className="absolute bottom-32 right-1/4 w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_8px_#ef4444] animate-pulse" />
        </div>
      );

    // 4. 星辰碧海 (Shimmering Twilight Bay)
    case 'BAY':
      return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none bg-[#030d1a]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#031124] via-[#041d38] to-[#020b18]" />
          <div className="absolute -top-1/4 left-0 w-[120%] h-[70%] bg-gradient-to-r from-sky-500/15 via-teal-500/20 to-blue-500/15 blur-3xl animate-aurora" />

          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="baySeaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                <stop offset="60%" stopColor="#0f766e" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#082f49" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Glowing Moon over Sea */}
            <circle cx="80%" cy="16%" r="35" fill="#bae6fd" opacity="0.85" filter="drop-shadow(0 0 16px #38bdf8)" />

            {/* Distant Sea Horizon & Coral Islands */}
            <path d="M 0 280 Q 500 270, 1000 280 L 1000 450 L 0 450 Z" fill="url(#baySeaGrad)" />

            {/* Shimmering Bioluminescent Sand Shore */}
            <path d="M 0 350 Q 500 320, 1000 350 L 1000 600 L 0 600 Z" fill="#041829" />

            {/* Rippling Sea Rings */}
            <ellipse cx="50%" cy="68%" rx="350" ry="110" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.4" />
            <ellipse cx="50%" cy="68%" rx="240" ry="75" fill="none" stroke="#2dd4bf" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="6 6" />
            <ellipse cx="50%" cy="68%" rx="130" ry="40" fill="#38bdf8" fillOpacity="0.08" stroke="#0ea5e9" strokeWidth="2" strokeOpacity="0.7" filter="drop-shadow(0 0 14px #38bdf8)" />
          </svg>
        </div>
      );

    // 5. 灵木医庐 (Celestial Healing Herb Arbor)
    case 'HOSPITAL':
      return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none bg-[#091512]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1b16] via-[#0f2d24] to-[#06120e]" />
          {/* Gentle Jade Vitality Aurora */}
          <div className="absolute -top-1/4 left-1/4 w-[120%] h-[70%] bg-gradient-to-r from-emerald-500/15 via-teal-400/20 to-rose-400/10 blur-3xl animate-aurora" />

          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="hospSpringGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#059669" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#064e3b" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="hospRoofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#047857" />
                <stop offset="100%" stopColor="#064e3b" />
              </linearGradient>
            </defs>

            {/* Distant Serene Moon with Peach Blossom Petals */}
            <circle cx="82%" cy="18%" r="42" fill="#dcfce7" opacity="0.6" filter="drop-shadow(0 0 20px #34d399)" />

            {/* Sacred Ancient Healing Willow & Peach Tree (Left) */}
            <path d="M 0 150 Q 80 240, 110 520 L -30 520 Z" fill="#08281d" />
            <path d="M 60 220 Q 180 140, 260 170" stroke="#34d399" strokeWidth="3" fill="none" opacity="0.7" filter="drop-shadow(0 0 6px #34d399)" />
            {/* Hanging Healing Gourd Lanterns */}
            <g filter="drop-shadow(0 0 8px #a7f3d0)">
              <circle cx="210" cy="180" r="4.5" fill="#fef08a" />
              <path d="M 210 185 Q 212 195 210 202 Q 208 195 210 185 Z" fill="#4ade80" />
              <line x1="210" y1="165" x2="210" y2="180" stroke="#34d399" strokeWidth="1" />
            </g>

            {/* Ancient Medicine Pavilion Roof (Right) with Flying Eaves */}
            <g opacity="0.75">
              <path d="M 720 220 Q 840 180, 960 230 L 980 250 Q 840 200, 700 240 Z" fill="url(#hospRoofGrad)" />
              <line x1="740" y1="240" x2="740" y2="380" stroke="#064e3b" strokeWidth="4" />
              <line x1="920" y1="240" x2="920" y2="380" stroke="#064e3b" strokeWidth="4" />
              {/* Warm Medicine Lamp */}
              <circle cx="830" cy="240" r="12" fill="#fef08a" opacity="0.8" filter="drop-shadow(0 0 12px #facc15)" />
            </g>

            {/* Healing Spring Pool (Center Terrace) */}
            <path d="M 0 350 Q 500 320, 1000 350 L 1000 600 L 0 600 Z" fill="#071d15" />
            <ellipse cx="50%" cy="68%" rx="350" ry="110" fill="none" stroke="#34d399" strokeWidth="1.5" strokeOpacity="0.4" />
            <ellipse cx="50%" cy="68%" rx="240" ry="75" fill="none" stroke="#2dd4bf" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="6 6" />
            <ellipse cx="50%" cy="68%" rx="140" ry="42" fill="url(#hospSpringGrad)" stroke="#6ee7b7" strokeWidth="2" strokeOpacity="0.8" filter="drop-shadow(0 0 16px #34d399)" />
          </svg>

          {/* Floating Pink Peach Blossom Petals */}
          <div className="absolute top-28 left-1/3 w-2.5 h-1.5 rounded-full bg-pink-300 opacity-70 rotate-45 shadow-[0_0_8px_#f472b6] animate-pulse" />
          <div className="absolute top-44 left-1/2 w-2 h-1.5 rounded-full bg-pink-200 opacity-80 -rotate-12 shadow-[0_0_6px_#f472b6] animate-bounce" />
          <div className="absolute bottom-28 right-1/4 w-3 h-2 rounded-full bg-pink-300 opacity-60 rotate-25 shadow-[0_0_8px_#f472b6] animate-pulse" />
        </div>
      );

    // 6. 万象珍宝阁 (Celestial Treasure Bazaar Pavilion)
    case 'SHOP':
      return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none bg-[#120803]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1c0c05] via-[#281308] to-[#0e0502]" />
          {/* Wealth & Fortune Golden Aura */}
          <div className="absolute -top-1/4 left-1/4 w-[120%] h-[70%] bg-gradient-to-r from-amber-500/15 via-red-500/15 to-yellow-400/20 blur-3xl animate-aurora" />

          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="shopGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id="shopRoofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
            </defs>

            {/* Grand Eastern Treasure Tower (Center Background Pagoda) */}
            <g opacity="0.65">
              {/* Upper Roof */}
              <path d="M 400 160 Q 500 130, 600 160 L 620 180 Q 500 150, 380 180 Z" fill="url(#shopRoofGrad)" stroke="#fef08a" strokeWidth="1" />
              {/* Mid Roof */}
              <path d="M 340 220 Q 500 180, 660 220 L 680 240 Q 500 200, 320 240 Z" fill="url(#shopRoofGrad)" stroke="#fef08a" strokeWidth="1" />
              {/* Lower Roof */}
              <path d="M 280 280 Q 500 230, 720 280 L 740 300 Q 500 250, 260 300 Z" fill="url(#shopRoofGrad)" stroke="#fef08a" strokeWidth="1.5" />

              {/* Spire with Luminous Fortune Pearl */}
              <line x1="500" y1="130" x2="500" y2="80" stroke="#f59e0b" strokeWidth="3" />
              <circle cx="500" cy="76" r="9" fill="#fef08a" filter="drop-shadow(0 0 14px #facc15)" />
            </g>

            {/* Red & Gold Festive Celestial Lanterns on Strings */}
            <path d="M 80 180 Q 300 240, 500 200 Q 700 240, 920 180" stroke="#78350f" strokeWidth="1.5" fill="none" opacity="0.8" />
            {[180, 320, 680, 820].map((lx, idx) => (
              <g key={idx} filter="drop-shadow(0 0 8px #f59e0b)">
                <ellipse cx={lx} cy={idx % 2 === 0 ? 215 : 225} rx={9} ry={13} fill="#ef4444" stroke="#fef08a" strokeWidth="1.2" />
                <circle cx={lx} cy={idx % 2 === 0 ? 215 : 225} r={3} fill="#fef08a" />
              </g>
            ))}

            {/* Marble Treasure Stage Terrace */}
            <path d="M 0 350 Q 500 320, 1000 350 L 1000 600 L 0 600 Z" fill="#170a04" />

            {/* Golden Fortune Floor Mandala */}
            <ellipse cx="50%" cy="68%" rx="350" ry="110" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.4" />
            <ellipse cx="50%" cy="68%" rx="240" ry="75" fill="none" stroke="#ef4444" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="6 6" />
            <ellipse cx="50%" cy="68%" rx="130" ry="40" fill="url(#shopGoldGrad)" fillOpacity="0.1" stroke="#facc15" strokeWidth="2" strokeOpacity="0.8" filter="drop-shadow(0 0 16px #f59e0b)" />
          </svg>

          {/* Floating Treasure Coins & Stardust */}
          <div className="absolute top-44 left-1/4 w-3.5 h-3.5 rounded-full border-2 border-amber-300 bg-amber-400/80 shadow-[0_0_12px_#fbbf24] animate-bounce" />
          <div className="absolute top-52 right-1/4 w-3 h-3 rounded-full border-2 border-amber-300 bg-amber-400/80 shadow-[0_0_12px_#fbbf24] animate-pulse" />
        </div>
      );

    // 7. 凌霄试炼台 (Nine Heavens Celestial Thunder Arena)
    case 'ARENA':
    default:
      return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none bg-[#090616]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c0822] via-[#150d38] to-[#060412]" />
          <div className="absolute -top-1/4 left-1/4 w-[120%] h-[70%] bg-gradient-to-r from-purple-500/20 via-indigo-500/25 to-sky-500/15 blur-3xl animate-aurora" />

          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="arenaPillarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#4c1d95" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </linearGradient>
            </defs>

            {/* Sea of Celestial Clouds Underneath */}
            <path d="M 0 320 Q 250 280, 500 310 T 1000 290 L 1000 420 L 0 420 Z" fill="#1e1b4b" opacity="0.6" />

            {/* 4 Majestic Dragon Lightning Pillars */}
            <g opacity="0.8">
              {/* Left Pillars */}
              <polygon points="110,380 125,120 140,380" fill="url(#arenaPillarGrad)" stroke="#c084fc" strokeWidth="1" />
              <circle cx="125" cy="115" r="7" fill="#facc15" filter="drop-shadow(0 0 12px #eab308)" />

              <polygon points="240,360 250,150 260,360" fill="url(#arenaPillarGrad)" stroke="#818cf8" strokeWidth="1" />
              <circle cx="250" cy="145" r="5" fill="#facc15" filter="drop-shadow(0 0 8px #eab308)" />

              {/* Right Pillars */}
              <polygon points="860,380 875,120 890,380" fill="url(#arenaPillarGrad)" stroke="#c084fc" strokeWidth="1" />
              <circle cx="875" cy="115" r="7" fill="#facc15" filter="drop-shadow(0 0 12px #eab308)" />

              <polygon points="740,360 750,150 760,360" fill="url(#arenaPillarGrad)" stroke="#818cf8" strokeWidth="1" />
              <circle cx="750" cy="145" r="5" fill="#facc15" filter="drop-shadow(0 0 8px #eab308)" />
            </g>

            {/* Floating Thunder Arena Stage */}
            <path d="M 0 350 Q 500 320, 1000 350 L 1000 600 L 0 600 Z" fill="#0d0822" />

            {/* Grand Celestial Trial Runic Concentric Array */}
            <ellipse cx="50%" cy="68%" rx="360" ry="115" fill="none" stroke="#c084fc" strokeWidth="1.5" strokeOpacity="0.5" />
            <ellipse cx="50%" cy="68%" rx="250" ry="80" fill="none" stroke="#818cf8" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="8 6" />
            <ellipse cx="50%" cy="68%" rx="140" ry="45" fill="#a855f7" fillOpacity="0.09" stroke="#e879f9" strokeWidth="2" strokeOpacity="0.7" filter="drop-shadow(0 0 16px #c084fc)" />
          </svg>

          {/* Crackling Thunder Sparks */}
          <div className="absolute top-28 left-1/4 w-2 h-2 rounded-full bg-yellow-300 shadow-[0_0_12px_#fde047] animate-ping" />
          <div className="absolute top-36 right-1/3 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#67e8f9] animate-pulse" />
        </div>
      );
  }
};
