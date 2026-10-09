import React from 'react';
import { ElementType } from '../types/game';

interface PetAvatarProps {
  speciesId: string;
  size?: number | string;
  className?: string;
  isFlipped?: boolean;
  isAttacking?: boolean;
  isHit?: boolean;
}

export const ELEMENT_COLORS: Record<ElementType, { bg: string; text: string; border: string; label: string }> = {
  FIRE: { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30', label: '火' },
  WATER: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30', label: '水' },
  GRASS: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', label: '木' },
  ELECTRIC: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30', label: '雷' },
  NORMAL: { bg: 'bg-slate-500/20', text: 'text-slate-300', border: 'border-slate-500/30', label: '风/凡' },
  ICE: { bg: 'bg-sky-400/20', text: 'text-sky-300', border: 'border-sky-400/30', label: '冰' },
  ROCK: { bg: 'bg-stone-500/20', text: 'text-stone-300', border: 'border-stone-500/30', label: '岩' },
};

export const PetAvatar: React.FC<PetAvatarProps> = ({
  speciesId,
  size = 96,
  className = '',
  isFlipped = false,
  isAttacking = false,
  isHit = false,
}) => {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;

  const renderPetSvg = () => {
    switch (speciesId) {
      // 001 赤焰雀 (Chiyanque - Vermilion Finch Chick)
      case 'chiyanque':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_4px_12px_rgba(239,68,68,0.45)]">
            <defs>
              <radialGradient id="cyqGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
                <stop offset="40%" stopColor="#f97316" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="cyqBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="45%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
              <linearGradient id="cyqBelly" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="60%" stopColor="#fed7aa" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
              <linearGradient id="cyqWing" x1="0%" y1="0%" x2="100%" y2="80%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="35%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </linearGradient>
              <linearGradient id="cyqFlamePlume" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#ea580c" />
                <stop offset="60%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
            </defs>

            {/* Fire Aura Ring */}
            <circle cx="60" cy="62" r="50" fill="url(#cyqGlow)" opacity="0.6" />
            <circle cx="60" cy="62" r="44" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" className="animate-[spin_20s_linear_infinite]" />

            {/* Tail Flame Feathers (Triple Plumes) */}
            <path d="M 28 72 C 10 78 2 64 8 46 C 18 56 26 62 34 68 Z" fill="url(#cyqWing)" />
            <path d="M 26 70 C 14 62 10 48 18 36 C 26 48 30 58 32 66 Z" fill="url(#cyqFlamePlume)" />
            <path d="M 32 78 C 18 90 10 82 12 70 C 22 72 28 76 34 76 Z" fill="#b91c1c" />

            {/* Main Chubby Bird Body */}
            <ellipse cx="62" cy="70" rx="28" ry="24" fill="url(#cyqBody)" />
            {/* Soft Warm Belly */}
            <ellipse cx="68" cy="74" rx="19" ry="16" fill="url(#cyqBelly)" />

            {/* Head */}
            <circle cx="70" cy="45" r="22" fill="url(#cyqBody)" />
            {/* White/Soft Brow Mask */}
            <path d="M 64 36 Q 74 32 86 38 Q 78 48 64 42 Z" fill="#fff1f2" opacity="0.4" />

            {/* Phoenix Crest Feathers (3 Flaming Crown Tufts) */}
            <path d="M 62 26 C 54 8 68 12 72 16 C 72 24 68 26 64 28 Z" fill="url(#cyqFlamePlume)" filter="drop-shadow(0 0 4px #fbbf24)" />
            <path d="M 72 24 C 74 4 88 8 84 16 C 80 22 76 24 72 26 Z" fill="#ef4444" />
            <path d="M 54 30 C 44 16 52 14 56 22 C 58 26 56 28 54 30 Z" fill="#f59e0b" />
            {/* Golden Jewel at Crown Base */}
            <polygon points="68,26 71,30 68,34 65,30" fill="#fef08a" stroke="#d97706" strokeWidth="0.8" />

            {/* Glowing Amber Eyes */}
            <ellipse cx="78" cy="43" rx="5" ry="7.5" fill="#450a0a" />
            <ellipse cx="78.5" cy="44" rx="4" ry="6" fill="#b91c1c" />
            <circle cx="79.5" cy="41" r="2.2" fill="#ffffff" />
            <circle cx="77" cy="46" r="1.2" fill="#fed7aa" />

            {/* Cute Golden Beak */}
            <path d="M 88 47 Q 104 51 90 56 Q 86 53 88 47 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="1" />
            <path d="M 88 51 L 96 52" stroke="#d97706" strokeWidth="1" />

            {/* Left Wing (Folded with layered feathers) */}
            <path d="M 46 62 C 34 76 44 88 60 88 C 64 78 58 66 46 62 Z" fill="url(#cyqWing)" />
            <path d="M 48 66 C 42 74 48 82 56 82 C 58 76 54 68 48 66 Z" fill="#fbbf24" opacity="0.8" />

            {/* Golden Claws with Embers */}
            <ellipse cx="54" cy="94" rx="6" ry="3.5" fill="#f59e0b" stroke="#78350f" strokeWidth="0.8" />
            <ellipse cx="72" cy="94" rx="6" ry="3.5" fill="#f59e0b" stroke="#78350f" strokeWidth="0.8" />

            {/* Floating Spirit Embers */}
            <circle cx="24" cy="42" r="1.5" fill="#fef08a" className="animate-ping" />
            <circle cx="94" cy="32" r="2" fill="#f97316" className="animate-pulse" />
          </svg>
        );

      // 002 灼羽鹰 (Zhuoyuying - Blazing Feather Raptor)
      case 'zhuoyuying':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_6px_16px_rgba(234,88,12,0.5)]">
            <defs>
              <linearGradient id="zyyWingL" x1="100%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#7f1d1d" />
                <stop offset="40%" stopColor="#dc2626" />
                <stop offset="80%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#fef08a" />
              </linearGradient>
              <linearGradient id="zyyTorso" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#991b1b" />
                <stop offset="100%" stopColor="#450a0a" />
              </linearGradient>
            </defs>

            {/* Solar Corona Rays */}
            <circle cx="60" cy="58" r="48" fill="none" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.5" className="animate-[spin_30s_linear_infinite]" />

            {/* Great Sweeping Left Wing */}
            <path
              d="M 40 55 C 15 25 -4 10 2 28 C 6 48 20 72 38 78 Z"
              fill="url(#zyyWingL)"
              filter="drop-shadow(0 0 6px #ea580c)"
            />
            {/* Wing Feather Layers */}
            <path d="M 36 50 C 18 28 6 22 10 36 C 14 52 26 68 36 72 Z" fill="#f97316" />
            <path d="M 32 46 C 22 30 16 28 18 38 C 22 48 28 60 34 64 Z" fill="#fef08a" opacity="0.9" />

            {/* Sweeping Right Wing Tip */}
            <path
              d="M 80 55 C 105 25 124 10 118 28 C 114 48 100 72 82 78 Z"
              fill="url(#zyyWingL)"
              transform="rotate(-5 80 55)"
            />

            {/* Sleek Muscular Torso */}
            <ellipse cx="60" cy="66" rx="24" ry="28" fill="url(#zyyTorso)" />
            {/* Golden Solar Chest Plate Plumes */}
            <path d="M 60 52 Q 68 64 66 78 Q 60 84 54 78 Q 52 64 60 52 Z" fill="#fef08a" stroke="#d97706" strokeWidth="1" />
            <circle cx="60" cy="65" r="4" fill="#ef4444" stroke="#f59e0b" strokeWidth="1" />

            {/* Raptor Head */}
            <circle cx="68" cy="38" r="19" fill="url(#zyyTorso)" />
            {/* Crown Crest Plumes */}
            <polygon points="62,22 48,4 66,16" fill="#f97316" filter="drop-shadow(0 0 4px #f97316)" />
            <polygon points="70,20 76,2 78,18" fill="#fef08a" />
            <polygon points="56,26 44,14 58,22" fill="#ef4444" />

            {/* Fierce Raptor Eyes with Black Eyeliner */}
            <polygon points="66,32 80,35 72,41" fill="#09090b" />
            <ellipse cx="72" cy="36" rx="3.5" ry="4" fill="#fbbf24" />
            <circle cx="73" cy="35" r="1.5" fill="#000000" />
            <circle cx="74" cy="34" r="0.8" fill="#ffffff" />

            {/* Hooked Sharp Beak */}
            <path d="M 84 37 Q 106 42 96 52 Q 88 47 84 44 Z" fill="#f59e0b" stroke="#78350f" strokeWidth="1.2" />

            {/* Powerful Volcanic Obsidian Talons */}
            <path d="M 46 88 L 40 102 M 50 88 L 48 104 M 54 88 L 56 102" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" />
            <path d="M 68 88 L 64 102 M 72 88 L 72 104 M 76 88 L 80 102" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="48" cy="100" rx="6" ry="3" fill="#18181b" />
            <ellipse cx="72" cy="100" rx="6" ry="3" fill="#18181b" />
          </svg>
        );

      // 003 焚天凰 (Fentianhuang - Heaven-Scorching Sovereign Fenghuang)
      case 'fentianhuang':
        return (
          <svg viewBox="0 0 140 140" className="w-full h-full drop-shadow-[0_8px_24px_rgba(239,68,68,0.7)] overflow-visible">
            <defs>
              <radialGradient id="fthSunHalo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#f97316" stopOpacity="0.5" />
                <stop offset="85%" stopColor="#dc2626" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="fthWingGradL" x1="100%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#450a0a" />
                <stop offset="25%" stopColor="#991b1b" />
                <stop offset="55%" stopColor="#ea580c" />
                <stop offset="80%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#fffbeb" />
              </linearGradient>
              <linearGradient id="fthTailGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="40%" stopColor="#ef4444" />
                <stop offset="80%" stopColor="#7f1d1d" />
                <stop offset="100%" stopColor="#310b0b" />
              </linearGradient>
            </defs>

            {/* Sacred Solar Mandala Disc with Radiant Flames */}
            <circle cx="70" cy="55" r="54" fill="url(#fthSunHalo)" />
            <circle cx="70" cy="55" r="48" fill="none" stroke="#fef08a" strokeWidth="2" strokeDasharray="10 8" opacity="0.8" className="animate-[spin_40s_linear_infinite]" />
            <circle cx="70" cy="55" r="38" fill="none" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.6" className="animate-[spin_25s_linear_infinite_reverse]" />

            {/* Imperial Fenghuang Tail Plumes (5 Cascading Phoenix Ribbons) */}
            <g filter="drop-shadow(0 0 6px rgba(249,115,22,0.8))">
              {/* Center Long Plume */}
              <path d="M 68 85 Q 70 115 62 138 Q 72 136 74 115 Q 72 95 72 85 Z" fill="url(#fthTailGrad)" />
              <circle cx="64" cy="132" r="5" fill="#fef08a" stroke="#b91c1c" strokeWidth="1.5" />
              <circle cx="64" cy="132" r="2.5" fill="#ef4444" />

              {/* Left Plume */}
              <path d="M 58 82 Q 38 108 26 130 Q 38 126 52 108 Q 62 92 62 82 Z" fill="url(#fthTailGrad)" />
              <circle cx="28" cy="126" r="4.5" fill="#fef08a" stroke="#b91c1c" strokeWidth="1.5" />
              <circle cx="28" cy="126" r="2" fill="#ef4444" />

              {/* Right Plume */}
              <path d="M 82 82 Q 102 108 114 130 Q 102 126 88 108 Q 78 92 78 82 Z" fill="url(#fthTailGrad)" />
              <circle cx="112" cy="126" r="4.5" fill="#fef08a" stroke="#b91c1c" strokeWidth="1.5" />
              <circle cx="112" cy="126" r="2" fill="#ef4444" />
            </g>

            {/* Grand Left Phoenix Wing (Outspread to the Cosmos) */}
            <path
              d="M 50 60 C 22 28 -8 12 0 34 C 4 56 16 82 46 86 Z"
              fill="url(#fthWingGradL)"
              filter="drop-shadow(0 0 8px #ef4444)"
            />
            <path d="M 46 54 C 24 30 6 20 12 36 C 18 54 28 74 44 80 Z" fill="#fbbf24" opacity="0.9" />

            {/* Grand Right Phoenix Wing */}
            <path
              d="M 90 60 C 118 28 148 12 140 34 C 136 56 124 82 94 86 Z"
              fill="url(#fthWingGradL)"
              filter="drop-shadow(0 0 8px #ef4444)"
            />
            <path d="M 94 54 C 116 30 134 20 128 36 C 122 54 112 74 96 80 Z" fill="#fbbf24" opacity="0.9" />

            {/* Divine Sovereign Body */}
            <ellipse cx="70" cy="70" rx="22" ry="26" fill="#7f1d1d" stroke="#f59e0b" strokeWidth="1.5" />
            {/* Golden Solar Throat & Breast */}
            <ellipse cx="70" cy="68" rx="14" ry="18" fill="#fef08a" />
            <polygon points="70,58 74,68 70,78 66,68" fill="#ef4444" stroke="#b45309" strokeWidth="1" />

            {/* Sovereign Head */}
            <circle cx="70" cy="40" r="18" fill="#991b1b" stroke="#f59e0b" strokeWidth="1.2" />

            {/* Imperial Triple Sun Phoenix Crown */}
            <polygon points="70,12 66,28 74,28" fill="#ffffff" filter="drop-shadow(0 0 6px #fef08a)" />
            <polygon points="56,18 64,30 60,30" fill="#fef08a" />
            <polygon points="84,18 76,30 80,30" fill="#fef08a" />
            <circle cx="70" cy="20" r="3.5" fill="#ef4444" stroke="#fef08a" strokeWidth="1" />

            {/* Mystic Divine Eyes */}
            <ellipse cx="64" cy="38" rx="3.5" ry="4.5" fill="#fef08a" />
            <circle cx="64" cy="38" r="2" fill="#450a0a" />
            <ellipse cx="76" cy="38" rx="3.5" ry="4.5" fill="#fef08a" />
            <circle cx="76" cy="38" r="2" fill="#450a0a" />

            {/* Sacred Golden Beak */}
            <polygon points="70,42 66,48 74,48" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />

            {/* Claws Resting on Sacred Lotus Flame */}
            <circle cx="70" cy="94" r="12" fill="#ea580c" opacity="0.8" />
            <polygon points="70,84 62,96 78,96" fill="#fef08a" opacity="0.7" />
          </svg>
        );

      // 004 碧水灵 (Bishuiling - Azure Water Sprite)
      case 'bishuiling':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_4px_16px_rgba(6,182,212,0.45)]">
            <defs>
              <radialGradient id="bslGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="bslBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#bae6fd" />
                <stop offset="40%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <linearGradient id="bslRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a5f3fc" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Swirling Water Halo */}
            <circle cx="60" cy="64" r="50" fill="url(#bslGlow)" />
            <ellipse cx="60" cy="94" rx="42" ry="12" fill="none" stroke="#7dd3fc" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.7" className="animate-[spin_16s_linear_infinite]" />

            {/* Orbiting Water Pearls */}
            <circle cx="24" cy="56" r="4.5" fill="#e0f2fe" filter="drop-shadow(0 0 6px #38bdf8)" className="animate-bounce" />
            <circle cx="96" cy="52" r="3.5" fill="#e0f2fe" filter="drop-shadow(0 0 6px #38bdf8)" className="animate-pulse" />
            <circle cx="60" cy="18" r="5" fill="#f0f9ff" stroke="#0284c7" strokeWidth="1.5" filter="drop-shadow(0 0 8px #7dd3fc)" />

            {/* Droplet Spirit Tail & Body */}
            <path
              d="M 60 26 C 88 26 98 58 92 84 C 86 98 34 98 28 84 C 22 58 32 26 60 26 Z"
              fill="url(#bslBody)"
              stroke="#bae6fd"
              strokeWidth="1.5"
            />
            {/* Luminous Inner Reflection */}
            <ellipse cx="60" cy="74" rx="22" ry="16" fill="#f0f9ff" opacity="0.75" />
            <ellipse cx="48" cy="46" rx="8" ry="12" fill="#ffffff" opacity="0.4" />

            {/* Flowing Water-Silk Celestial Ribbon (披帛) */}
            <path
              d="M 22 72 Q 10 50 30 42 Q 60 38 90 42 Q 110 50 98 72 Q 78 64 60 66 Q 42 64 22 72 Z"
              fill="url(#bslRibbon)"
              stroke="#38bdf8"
              strokeWidth="1"
            />

            {/* Forehead Teardrop Jewel Crest */}
            <path d="M 60 32 C 63 36 65 40 60 44 C 55 40 57 36 60 32 Z" fill="#0369a1" />

            {/* Sparkling Anime Eyes */}
            <ellipse cx="48" cy="58" rx="5.5" ry="8" fill="#082f49" />
            <ellipse cx="48" cy="59" rx="4.5" ry="6.5" fill="#0284c7" />
            <circle cx="50" cy="55" r="2.5" fill="#ffffff" />
            <circle cx="46.5" cy="62" r="1.2" fill="#bae6fd" />

            <ellipse cx="72" cy="58" rx="5.5" ry="8" fill="#082f49" />
            <ellipse cx="72" cy="59" rx="4.5" ry="6.5" fill="#0284c7" />
            <circle cx="74" cy="55" r="2.5" fill="#ffffff" />
            <circle cx="70.5" cy="62" r="1.2" fill="#bae6fd" />

            {/* Rosy Cheeks */}
            <circle cx="38" cy="68" r="3.5" fill="#f43f5e" opacity="0.35" />
            <circle cx="82" cy="68" r="3.5" fill="#f43f5e" opacity="0.35" />

            {/* Sweet Happy Smile */}
            <path d="M 56 68 Q 60 72 64 68" stroke="#0369a1" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </svg>
        );

      // 005 渊潮兽 (Yuanchaoshou - Abyssal Tidal Dragon-Beast)
      case 'yuanchaoshou':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_6px_20px_rgba(2,132,199,0.55)]">
            <defs>
              <linearGradient id="ycsSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="50%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0c4a6e" />
              </linearGradient>
              <linearGradient id="ycsBelly" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f0f9ff" />
                <stop offset="70%" stopColor="#bae6fd" />
                <stop offset="100%" stopColor="#7dd3fc" />
              </linearGradient>
            </defs>

            {/* Swirling Deep Sea Current Rings */}
            <ellipse cx="60" cy="70" r="48" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.6" className="animate-[spin_24s_linear_infinite]" />

            {/* Coral Crystal Horns on Brow */}
            <path d="M 44 32 Q 28 14 36 6 Q 48 18 48 30 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" filter="drop-shadow(0 0 6px #7dd3fc)" />
            <circle cx="34" cy="8" r="2.5" fill="#e0f2fe" />
            <path d="M 76 32 Q 92 14 84 6 Q 72 18 72 30 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" filter="drop-shadow(0 0 6px #7dd3fc)" />
            <circle cx="86" cy="8" r="2.5" fill="#e0f2fe" />

            {/* Graceful Aquatic Beast Body */}
            <path
              d="M 60 28 C 92 28 102 62 96 86 C 90 102 30 102 24 86 C 18 62 28 28 60 28 Z"
              fill="url(#ycsSkin)"
              stroke="#7dd3fc"
              strokeWidth="1.5"
            />
            {/* Luminous Belly Plate with Wave Lines */}
            <path d="M 42 66 Q 60 60 78 66 Q 80 88 60 92 Q 40 88 42 66 Z" fill="url(#ycsBelly)" />
            <path d="M 48 74 Q 60 70 72 74" stroke="#0284c7" strokeWidth="1" fill="none" />
            <path d="M 52 82 Q 60 78 68 82" stroke="#0284c7" strokeWidth="1" fill="none" />

            {/* Flowing Dorsal & Side Flippers */}
            <path d="M 20 68 Q 2 76 16 92 Q 26 84 22 70 Z" fill="#0ea5e9" stroke="#7dd3fc" strokeWidth="1" />
            <path d="M 100 68 Q 118 76 104 92 Q 94 84 98 70 Z" fill="#0ea5e9" stroke="#7dd3fc" strokeWidth="1" />

            {/* Dragon Pearl Crown on Forehead */}
            <circle cx="60" cy="38" r="4.5" fill="#e0f2fe" stroke="#0369a1" strokeWidth="1.2" filter="drop-shadow(0 0 8px #38bdf8)" />

            {/* Regal Sapphire Dragon Eyes */}
            <ellipse cx="46" cy="52" rx="5.5" ry="7.5" fill="#082f49" />
            <ellipse cx="46" cy="53" rx="4.5" ry="6" fill="#0284c7" />
            <circle cx="48" cy="50" r="2.5" fill="#ffffff" />
            <circle cx="44.5" cy="56" r="1.2" fill="#7dd3fc" />

            <ellipse cx="74" cy="52" rx="5.5" ry="7.5" fill="#082f49" />
            <ellipse cx="74" cy="53" rx="4.5" ry="6" fill="#0284c7" />
            <circle cx="76" cy="50" r="2.5" fill="#ffffff" />
            <circle cx="72.5" cy="56" r="1.2" fill="#7dd3fc" />

            {/* Whiskers & Noble Muzzle */}
            <path d="M 38 60 Q 22 66 18 78" stroke="#38bdf8" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M 82 60 Q 98 66 102 78" stroke="#38bdf8" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </svg>
        );

      // 006 幻海灵尊 (Huanhailingzun - Sovereign of the Mirage Ocean)
      case 'huanhailingzun':
        return (
          <svg viewBox="0 0 140 140" className="w-full h-full drop-shadow-[0_8px_26px_rgba(2,132,199,0.7)] overflow-visible">
            <defs>
              <radialGradient id="hhlzOceanHalo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#0284c7" stopOpacity="0.5" />
                <stop offset="85%" stopColor="#082f49" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#021422" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="hhlzDragon" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#082f49" />
              </linearGradient>
            </defs>

            {/* Sacred Celestial Tide Mandala Ring */}
            <circle cx="70" cy="65" r="58" fill="url(#hhlzOceanHalo)" />
            <circle cx="70" cy="65" r="52" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="12 8" opacity="0.8" className="animate-[spin_45s_linear_infinite]" />
            <circle cx="70" cy="65" r="42" fill="none" stroke="#7dd3fc" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.6" className="animate-[spin_30s_linear_infinite_reverse]" />

            {/* Branching Sacred Sapphire Antler Corals */}
            <path d="M 52 38 Q 30 18 36 4 Q 48 18 52 30 Z" fill="#7dd3fc" stroke="#0284c7" strokeWidth="1.5" filter="drop-shadow(0 0 8px #38bdf8)" />
            <path d="M 40 18 Q 24 12 28 6 Q 38 12 40 18 Z" fill="#bae6fd" />
            <circle cx="36" cy="4" r="3" fill="#ffffff" />

            <path d="M 88 38 Q 110 18 104 4 Q 92 18 88 30 Z" fill="#7dd3fc" stroke="#0284c7" strokeWidth="1.5" filter="drop-shadow(0 0 8px #38bdf8)" />
            <path d="M 100 18 Q 116 12 112 6 Q 102 12 100 18 Z" fill="#bae6fd" />
            <circle cx="104" cy="4" r="3" fill="#ffffff" />

            {/* Coiling Celestial Azure Dragon Sovereign Body */}
            <path
              d="M 70 32 C 105 32 120 70 110 100 C 100 118 40 118 30 100 C 20 70 35 32 70 32 Z"
              fill="url(#hhlzDragon)"
              stroke="#bae6fd"
              strokeWidth="2"
            />
            {/* Luminous Pearl Dragon Scales */}
            <ellipse cx="70" cy="85" rx="28" ry="22" fill="#f0f9ff" opacity="0.85" />
            <path d="M 54 75 Q 70 68 86 75" stroke="#0284c7" strokeWidth="1.5" fill="none" />
            <path d="M 50 85 Q 70 78 90 85" stroke="#0284c7" strokeWidth="1.5" fill="none" />
            <path d="M 56 95 Q 70 88 84 95" stroke="#0284c7" strokeWidth="1.5" fill="none" />

            {/* Flowing Water Silk Fins (Left & Right) */}
            <path d="M 24 72 Q 2 82 12 108 Q 30 98 28 78 Z" fill="#0ea5e9" stroke="#7dd3fc" strokeWidth="1.2" />
            <path d="M 116 72 Q 138 82 128 108 Q 110 98 112 78 Z" fill="#0ea5e9" stroke="#7dd3fc" strokeWidth="1.2" />

            {/* Hovering Sacred Dragon Water Pearl (水灵至尊宝珠) */}
            <circle cx="70" cy="20" r="8" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" filter="drop-shadow(0 0 12px #38bdf8)" className="animate-pulse" />
            <circle cx="70" cy="20" r="3" fill="#ffffff" />

            {/* Sovereign Dragon Head & Features */}
            <ellipse cx="70" cy="52" rx="22" ry="16" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.2" />

            {/* Regal Sapphire Sovereign Eyes */}
            <ellipse cx="58" cy="50" rx="5" ry="6.5" fill="#082f49" />
            <ellipse cx="58" cy="50" rx="4" ry="5.5" fill="#38bdf8" />
            <circle cx="59.5" cy="48" r="2" fill="#ffffff" />

            <ellipse cx="82" cy="50" rx="5" ry="6.5" fill="#082f49" />
            <ellipse cx="82" cy="50" rx="4" ry="5.5" fill="#38bdf8" />
            <circle cx="83.5" cy="48" r="2" fill="#ffffff" />

            {/* Long Sweeping Celestial Dragon Whiskers */}
            <path d="M 48 58 Q 20 64 8 82" stroke="#7dd3fc" strokeWidth="2.5" fill="none" strokeLinecap="round" filter="drop-shadow(0 0 4px #38bdf8)" />
            <path d="M 92 58 Q 120 64 132 82" stroke="#7dd3fc" strokeWidth="2.5" fill="none" strokeLinecap="round" filter="drop-shadow(0 0 4px #38bdf8)" />
          </svg>
        );

      // 007 青木鹿 (Qingmulu - Verdant Wood Fawn)
      case 'qingmulu':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_4px_16px_rgba(34,197,94,0.45)]">
            <defs>
              <radialGradient id="qmlGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#dcfce7" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#4ade80" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#15803d" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="qmlBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="50%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>
            </defs>

            {/* Verdant Flora Halo */}
            <circle cx="60" cy="65" r="50" fill="url(#qmlGlow)" />
            <circle cx="60" cy="65" r="44" fill="none" stroke="#4ade80" strokeWidth="1" strokeDasharray="5 5" opacity="0.5" className="animate-[spin_24s_linear_infinite]" />

            {/* Sprout Antlers with Blooming Pink Spirit Buds */}
            <path d="M 50 32 Q 34 14 26 18 Q 36 26 44 34 Z" fill="#15803d" stroke="#14532d" strokeWidth="1" />
            <ellipse cx="24" cy="16" rx="5" ry="3.5" fill="#4ade80" />
            <circle cx="22" cy="14" r="2.5" fill="#f472b6" filter="drop-shadow(0 0 4px #f472b6)" />

            <path d="M 70 32 Q 86 14 94 18 Q 84 26 76 34 Z" fill="#15803d" stroke="#14532d" strokeWidth="1" />
            <ellipse cx="96" cy="16" rx="5" ry="3.5" fill="#4ade80" />
            <circle cx="98" cy="14" r="2.5" fill="#f472b6" filter="drop-shadow(0 0 4px #f472b6)" />

            {/* Gentle Fawn Body */}
            <ellipse cx="60" cy="74" rx="28" ry="24" fill="url(#qmlBody)" />
            {/* White Soft Belly */}
            <ellipse cx="62" cy="76" rx="18" ry="16" fill="#f0fdf4" />
            {/* Starlight Fur Spots */}
            <circle cx="44" cy="70" r="2" fill="#ffffff" opacity="0.8" />
            <circle cx="50" cy="76" r="2.5" fill="#ffffff" opacity="0.8" />
            <circle cx="46" cy="82" r="1.8" fill="#ffffff" opacity="0.8" />

            {/* Fawn Head */}
            <circle cx="60" cy="46" r="22" fill="url(#qmlBody)" />
            {/* Cute Deer Ears */}
            <path d="M 40 40 Q 24 34 28 26 Q 38 32 42 38 Z" fill="#22c55e" />
            <ellipse cx="32" cy="32" rx="4" ry="2.5" fill="#dcfce7" />
            <path d="M 80 40 Q 96 34 92 26 Q 82 32 78 38 Z" fill="#22c55e" />
            <ellipse cx="88" cy="32" rx="4" ry="2.5" fill="#dcfce7" />

            {/* Big Gentle Celestial Emerald Eyes */}
            <ellipse cx="50" cy="44" rx="5.5" ry="7.5" fill="#052e16" />
            <ellipse cx="50" cy="45" rx="4.5" ry="6" fill="#16a34a" />
            <circle cx="52" cy="42" r="2.5" fill="#ffffff" />
            <circle cx="48.5" cy="48" r="1.2" fill="#dcfce7" />

            <ellipse cx="70" cy="44" rx="5.5" ry="7.5" fill="#052e16" />
            <ellipse cx="70" cy="45" rx="4.5" ry="6" fill="#16a34a" />
            <circle cx="72" cy="42" r="2.5" fill="#ffffff" />
            <circle cx="68.5" cy="48" r="1.2" fill="#dcfce7" />

            {/* Sweet Nose & Blush */}
            <ellipse cx="60" cy="52" rx="2.5" ry="1.5" fill="#14532d" />
            <circle cx="42" cy="52" r="3.5" fill="#f472b6" opacity="0.4" />
            <circle cx="78" cy="52" r="3.5" fill="#f472b6" opacity="0.4" />

            {/* Golden Hooves */}
            <ellipse cx="48" cy="98" rx="6" ry="4" fill="#ca8a04" stroke="#713f12" strokeWidth="1" />
            <ellipse cx="72" cy="98" rx="6" ry="4" fill="#ca8a04" stroke="#713f12" strokeWidth="1" />

            {/* Fluffy Little Tail */}
            <circle cx="88" cy="74" r="6" fill="#f0fdf4" stroke="#22c55e" strokeWidth="1" />
          </svg>
        );

      // 008 翡翠角鹿 (Feicuijiaolu - Jade Horned Stag)
      case 'feicuijiaolu':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_6px_20px_rgba(21,128,61,0.55)]">
            <defs>
              <linearGradient id="fcjlAntler" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#15803d" />
                <stop offset="50%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#ecfdf5" />
              </linearGradient>
              <linearGradient id="fcjlBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#16a34a" />
                <stop offset="60%" stopColor="#15803d" />
                <stop offset="100%" stopColor="#064e3b" />
              </linearGradient>
            </defs>

            {/* Jade Wind Circle */}
            <ellipse cx="60" cy="65" rx="52" ry="48" fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.6" className="animate-[spin_32s_linear_infinite]" />

            {/* Sprawling Towering Jade Crystal Antlers */}
            <path
              d="M 48 34 Q 24 10 12 18 Q 28 26 38 34 Q 20 28 14 36 Q 30 40 44 42 Z"
              fill="url(#fcjlAntler)"
              stroke="#065f46"
              strokeWidth="1.2"
              filter="drop-shadow(0 0 8px #34d399)"
            />
            <circle cx="12" cy="18" r="3.5" fill="#f472b6" filter="drop-shadow(0 0 4px #f472b6)" />
            <circle cx="14" cy="36" r="3" fill="#6ee7b7" />

            <path
              d="M 72 34 Q 96 10 108 18 Q 92 26 82 34 Q 100 28 106 36 Q 90 40 76 42 Z"
              fill="url(#fcjlAntler)"
              stroke="#065f46"
              strokeWidth="1.2"
              filter="drop-shadow(0 0 8px #34d399)"
            />
            <circle cx="108" cy="18" r="3.5" fill="#f472b6" filter="drop-shadow(0 0 4px #f472b6)" />
            <circle cx="106" cy="36" r="3" fill="#6ee7b7" />

            {/* Noble Stag Body */}
            <ellipse cx="60" cy="74" rx="28" ry="24" fill="url(#fcjlBody)" stroke="#34d399" strokeWidth="1.2" />
            <ellipse cx="60" cy="76" rx="16" ry="16" fill="#f0fdf4" />

            {/* Graceful Head */}
            <ellipse cx="60" cy="46" rx="18" ry="20" fill="url(#fcjlBody)" stroke="#34d399" strokeWidth="1" />

            {/* Majestic Jade Eyes */}
            <ellipse cx="50" cy="44" rx="5" ry="7" fill="#022c22" />
            <ellipse cx="50" cy="45" rx="4" ry="5.5" fill="#10b981" />
            <circle cx="52" cy="42" r="2.2" fill="#ffffff" />

            <ellipse cx="70" cy="44" rx="5" ry="7" fill="#022c22" />
            <ellipse cx="70" cy="45" rx="4" ry="5.5" fill="#10b981" />
            <circle cx="72" cy="42" r="2.2" fill="#ffffff" />

            {/* Golden Ley-line Markings */}
            <path d="M 60 52 L 60 62" stroke="#facc15" strokeWidth="1.5" />
            <polygon points="60,34 62,38 60,42 58,38" fill="#facc15" filter="drop-shadow(0 0 4px #fde047)" />

            {/* Elegant Hooves */}
            <ellipse cx="48" cy="98" rx="6" ry="4" fill="#15803d" stroke="#facc15" strokeWidth="1" />
            <ellipse cx="72" cy="98" rx="6" ry="4" fill="#15803d" stroke="#facc15" strokeWidth="1" />
          </svg>
        );

      // 009 苍林神尊 (Canglinshenzun - Primordial White Winged God Stag Sovereign)
      case 'canglinshenzun':
        return (
          <svg viewBox="0 0 140 140" className="w-full h-full drop-shadow-[0_8px_28px_rgba(56,189,248,0.7)] overflow-visible">
            <defs>
              <radialGradient id="clszHalo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="35%" stopColor="#bae6fd" stopOpacity="0.6" />
                <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Celestial Starlight Tree-of-Life Mandala Ring */}
            <circle cx="70" cy="65" r="58" fill="url(#clszHalo)" />
            <circle cx="70" cy="65" r="52" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="10 8" opacity="0.8" className="animate-[spin_40s_linear_infinite]" />
            <circle cx="70" cy="65" r="42" fill="none" stroke="#a5f3fc" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.6" className="animate-[spin_25s_linear_infinite_reverse]" />

            {/* Majestic Pure White Celestial Starlight Wings */}
            <g className="animate-pulse" opacity="0.95">
              {/* Left Wing */}
              <path
                d="M 44 65 C 16 38 -6 18 2 8 C 22 14 36 34 46 54 Z"
                fill="#f8fafc"
                stroke="#38bdf8"
                strokeWidth="1.8"
                filter="drop-shadow(0 0 10px rgba(56,189,248,0.8))"
              />
              <path d="M 38 60 C 18 40 8 28 16 20 C 26 26 36 42 42 52 Z" fill="#e0f2fe" />

              {/* Right Wing */}
              <path
                d="M 96 65 C 124 38 146 18 138 8 C 118 14 104 34 94 54 Z"
                fill="#f8fafc"
                stroke="#38bdf8"
                strokeWidth="1.8"
                filter="drop-shadow(0 0 10px rgba(56,189,248,0.8))"
              />
              <path d="M 102 60 C 122 40 132 28 124 20 C 114 26 104 42 98 52 Z" fill="#e0f2fe" />
            </g>

            {/* Sacred Crystal Blossom Antlers */}
            <path d="M 60 36 Q 38 14 24 16 Q 36 28 50 36 Z" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.2" />
            <path d="M 40 22 Q 30 6 22 8 Q 32 16 38 22 Z" fill="#7dd3fc" />
            <circle cx="22" cy="8" r="4.5" fill="#38bdf8" filter="drop-shadow(0 0 6px #38bdf8)" />
            <circle cx="24" cy="18" r="3.5" fill="#67e8f9" />

            <path d="M 80 36 Q 102 14 116 16 Q 104 28 90 36 Z" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.2" />
            <path d="M 100 22 Q 110 6 118 8 Q 108 16 102 22 Z" fill="#7dd3fc" />
            <circle cx="118" cy="8" r="4.5" fill="#38bdf8" filter="drop-shadow(0 0 6px #38bdf8)" />
            <circle cx="116" cy="18" r="3.5" fill="#67e8f9" />

            {/* Silken White God Stag Torso */}
            <ellipse cx="70" cy="82" rx="30" ry="26" fill="#ffffff" stroke="#bae6fd" strokeWidth="2" />
            <ellipse cx="70" cy="84" rx="18" ry="16" fill="#f0fdf4" opacity="0.9" />

            {/* Divine Stag Head */}
            <ellipse cx="70" cy="48" rx="20" ry="22" fill="#ffffff" stroke="#bae6fd" strokeWidth="1.8" />
            
            {/* Forehead Sunburst Diamond Crest */}
            <polygon points="70,32 73.5,38 70,42 66.5,38" fill="#38bdf8" filter="drop-shadow(0 0 8px #38bdf8)" />

            {/* Luminous Celestial Blue Eyes */}
            <ellipse cx="62" cy="46" rx="4.5" ry="6.5" fill="#0369a1" />
            <circle cx="63.5" cy="44" r="2" fill="#ffffff" />
            <ellipse cx="78" cy="46" rx="4.5" ry="6.5" fill="#0369a1" />
            <circle cx="79.5" cy="44" r="2" fill="#ffffff" />

            {/* Delicate Muzzle & Nose */}
            <path d="M 68 56 Q 70 58 72 56" stroke="#0284c7" strokeWidth="1.5" fill="none" strokeLinecap="round" />

            {/* Flowing Starlight Mane Tail & Cloud Hooves */}
            <ellipse cx="56" cy="108" rx="7" ry="4" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.2" />
            <ellipse cx="84" cy="108" rx="7" ry="4" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.2" />
          </svg>
        );

      // 010 绒风兔 (Rongfengtu - Wild Wind Bunny)
      case 'rongfengtu':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Bunny Ears */}
            <ellipse cx="40" cy="18" rx="6" ry="16" fill="#f8fafc" />
            <ellipse cx="40" cy="18" rx="3" ry="10" fill="#a7f3d0" />
            <ellipse cx="60" cy="18" rx="6" ry="16" fill="#f8fafc" />
            <ellipse cx="60" cy="18" rx="3" ry="10" fill="#a7f3d0" />
            {/* Fluffy Body */}
            <circle cx="50" cy="62" r="24" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
            {/* Head */}
            <circle cx="50" cy="40" r="18" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
            {/* Cute Eyes */}
            <circle cx="44" cy="38" r="3.5" fill="#065f46" />
            <circle cx="45" cy="36" r="1.5" fill="#ffffff" />
            <circle cx="56" cy="38" r="3.5" fill="#065f46" />
            <circle cx="57" cy="36" r="1.5" fill="#ffffff" />
            {/* Pink Nose & Blush */}
            <polygon points="50,42 48,40 52,40" fill="#f43f5e" />
            <circle cx="38" cy="44" r="3" fill="#fda4af" opacity="0.6" />
            <circle cx="62" cy="44" r="3" fill="#fda4af" opacity="0.6" />
            {/* Fluffy tail */}
            <circle cx="24" cy="66" r="7" fill="#f8fafc" />
          </svg>
        );

      // 011 影风灵兔 (Yingfenglingtu)
      case 'yingfenglingtu':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
            {/* Wind Blade Ears */}
            <polygon points="34,28 20,4 42,22" fill="#10b981" />
            <polygon points="66,28 80,4 58,22" fill="#10b981" />
            {/* Swift Body */}
            <ellipse cx="50" cy="58" rx="24" ry="20" fill="#047857" />
            <ellipse cx="52" cy="60" rx="14" ry="12" fill="#d1fae5" />
            {/* Head */}
            <circle cx="50" cy="36" r="18" fill="#047857" />
            {/* Sharp Eyes */}
            <polygon points="42,33 48,35 44,38" fill="#064e3b" />
            <polygon points="58,33 52,35 56,38" fill="#064e3b" />
          </svg>
        );

      // 012 雷纹吼 (Leiwenhou - Electric Wild)
      case 'leiwenhou':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
            {/* Thunder Sparks Aura */}
            <polygon points="50,2 55,16 68,10 62,22 78,22 68,34 82,44 68,48 78,64 62,60 65,80 50,70 35,80 38,60 22,64 32,48 18,44 32,34 22,22 38,22 32,10 45,16" fill="#fde047" opacity="0.5" />
            {/* Golden Beast Body */}
            <ellipse cx="50" cy="58" rx="25" ry="20" fill="#eab308" />
            {/* Head */}
            <circle cx="50" cy="36" r="22" fill="#ca8a04" />
            {/* Thunder Horns */}
            <polygon points="40,16 32,2 45,14" fill="#facc15" stroke="#713f12" strokeWidth="1" />
            <polygon points="60,16 68,2 55,14" fill="#facc15" stroke="#713f12" strokeWidth="1" />
            {/* Fierce Electric Eyes */}
            <ellipse cx="43" cy="34" rx="4" ry="5.5" fill="#422006" />
            <circle cx="44" cy="32" r="2" fill="#ffffff" />
            <ellipse cx="57" cy="34" rx="4" ry="5.5" fill="#422006" />
            <circle cx="58" cy="32" r="2" fill="#ffffff" />
            {/* Electric Cheek Lightning Marks */}
            <polygon points="34,42 40,40 38,46 44,44 38,52" fill="#ef4444" />
            <polygon points="66,42 60,40 62,46 56,44 62,52" fill="#ef4444" />
          </svg>
        );

      // 013 晶甲玄龟 (Jingjiaxuangui - Rock Wild)
      case 'jingjiaxuangui':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Crystal Shards on Shell */}
            <polygon points="42,32 50,18 58,32" fill="#a855f7" stroke="#6b21a8" />
            <polygon points="30,42 22,26 36,36" fill="#c084fc" stroke="#6b21a8" />
            <polygon points="70,42 78,26 64,36" fill="#c084fc" stroke="#6b21a8" />
            {/* Heavy Rock Shell */}
            <ellipse cx="50" cy="56" rx="34" ry="26" fill="#57534e" stroke="#292524" strokeWidth="3" />
            {/* Turtle Head */}
            <circle cx="50" cy="32" r="14" fill="#78716c" />
            {/* Eyes */}
            <circle cx="44" cy="30" r="3" fill="#1c1917" />
            <circle cx="56" cy="30" r="3" fill="#1c1917" />
            {/* Rock Legs */}
            <ellipse cx="20" cy="70" rx="8" ry="5" fill="#78716c" />
            <ellipse cx="80" cy="70" rx="8" ry="5" fill="#78716c" />
          </svg>
        );

      // 014 极光雪狐 (Jiguangxuehu - Ice Wild)
      default:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Ice Tail */}
            <path d="M 22 68 Q 2 50 12 36 Q 26 44 26 60 Z" fill="#bae6fd" stroke="#38bdf8" strokeWidth="1.5" />
            {/* Body */}
            <ellipse cx="50" cy="62" rx="22" ry="18" fill="#f8fafc" stroke="#e0f2fe" strokeWidth="1.5" />
            {/* Head */}
            <circle cx="52" cy="38" r="19" fill="#f8fafc" stroke="#e0f2fe" strokeWidth="1.5" />
            {/* Fox Ears */}
            <polygon points="38,24 32,8 46,20" fill="#bae6fd" />
            <polygon points="66,24 72,8 58,20" fill="#bae6fd" />
            {/* Crystal Forehead Mark */}
            <polygon points="52,26 48,32 52,38 56,32" fill="#0284c7" />
            {/* Ethereal Eyes */}
            <ellipse cx="45" cy="38" rx="3.5" ry="5.5" fill="#0369a1" />
            <circle cx="46" cy="36" r="1.5" fill="#ffffff" />
            <ellipse cx="59" cy="38" rx="3.5" ry="5.5" fill="#0369a1" />
            <circle cx="60" cy="36" r="1.5" fill="#ffffff" />
            {/* Cute nose */}
            <circle cx="52" cy="45" r="2" fill="#0c4a6e" />
          </svg>
        );
    }
  };

  return (
    <div
      style={{ width: pixelSize, height: pixelSize }}
      className={`relative inline-flex items-center justify-center select-none transition-transform duration-200 ${
        isFlipped ? 'scale-x-[-1]' : ''
      } ${isAttacking ? 'animate-bounce' : ''} ${isHit ? 'animate-ping brightness-150' : ''} ${className}`}
    >
      {renderPetSvg()}
    </div>
  );
};
