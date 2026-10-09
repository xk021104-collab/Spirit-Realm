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
      // 001 赤焰雀 (Chiyanque - Fire Starter)
      case 'chiyanque':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Ember Tail Feathers */}
            <path d="M 22 62 Q 5 65 12 45 Q 26 50 28 58 Z" fill="#f97316" />
            <path d="M 20 60 Q 8 52 16 42 Q 24 48 26 55 Z" fill="#facc15" />
            {/* Body */}
            <ellipse cx="50" cy="58" rx="22" ry="19" fill="#ef4444" />
            {/* Warm Golden Chest */}
            <ellipse cx="54" cy="62" rx="14" ry="12" fill="#fed7aa" />
            {/* Head */}
            <circle cx="58" cy="38" r="18" fill="#ef4444" />
            {/* Phoenix Crest Feathers */}
            <path d="M 52 24 Q 44 8 56 12 Q 58 22 56 26 Z" fill="#f97316" />
            <path d="M 60 22 Q 62 6 72 12 Q 66 22 62 26 Z" fill="#fbbf24" />
            {/* Bird Beak */}
            <polygon points="74,38 88,40 74,44" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
            {/* Bright Eyes */}
            <ellipse cx="64" cy="35" rx="3.5" ry="5.5" fill="#1e1b4b" />
            <circle cx="65" cy="33" r="1.5" fill="#ffffff" />
            {/* Little Wing */}
            <path d="M 38 52 Q 28 66 45 68 Q 48 58 44 52 Z" fill="#dc2626" />
            {/* Little Claws */}
            <ellipse cx="44" cy="77" rx="5" ry="3" fill="#d97706" />
            <ellipse cx="58" cy="77" rx="5" ry="3" fill="#d97706" />
          </svg>
        );

      // 002 灼羽鹰 (Zhuoyuying - Fire Mid Evo)
      case 'zhuoyuying':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
            {/* Broad Flame Wings */}
            <path d="M 32 45 Q 8 18 2 38 Q 12 60 28 58 Z" fill="#ea580c" />
            <path d="M 28 46 Q 14 26 10 40 Q 18 54 26 54 Z" fill="#facc15" />
            {/* Fierce Body */}
            <ellipse cx="52" cy="56" rx="22" ry="22" fill="#dc2626" />
            <ellipse cx="56" cy="58" rx="14" ry="14" fill="#ffedd5" />
            {/* Raptor Head */}
            <circle cx="62" cy="34" r="18" fill="#dc2626" />
            {/* Sharp Crown Feathers */}
            <polygon points="54,20 45,4 62,16" fill="#f97316" />
            <polygon points="62,18 68,2 72,18" fill="#ea580c" />
            {/* Raptor Beak */}
            <path d="M 78 32 Q 94 36 88 44 Q 80 40 78 38 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
            {/* Sharp Fierce Eyes */}
            <polygon points="64,30 74,32 68,36" fill="#18181b" />
            <circle cx="69" cy="33" r="1.2" fill="#ffffff" />
            {/* Fiery Talons */}
            <ellipse cx="42" cy="78" rx="8" ry="4" fill="#b45309" />
            <ellipse cx="62" cy="78" rx="8" ry="4" fill="#b45309" />
          </svg>
        );

      // 003 焚天凰 (Fentianhuang - Fire Ultimate Sovereign)
      case 'fentianhuang':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
            {/* Golden Solar Halo Ring */}
            <circle cx="50" cy="46" r="44" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="8 6" opacity="0.6" />
            {/* Majestic Wings */}
            <path d="M 30 46 Q 2 12 0 36 Q 10 65 28 62 Z" fill="#b91c1c" />
            <path d="M 70 46 Q 98 12 100 36 Q 90 65 72 62 Z" fill="#b91c1c" />
            <path d="M 28 48 Q 10 24 10 40 Q 18 58 26 58 Z" fill="#f59e0b" />
            <path d="M 72 48 Q 90 24 90 40 Q 82 58 74 58 Z" fill="#f59e0b" />
            {/* Phoenix Torso */}
            <ellipse cx="50" cy="58" rx="20" ry="24" fill="#991b1b" />
            <ellipse cx="50" cy="60" rx="12" ry="15" fill="#fef08a" />
            {/* Head */}
            <circle cx="50" cy="32" r="17" fill="#b91c1c" />
            {/* Celestial Phoenix Tiara */}
            <polygon points="40,16 32,0 46,14" fill="#facc15" />
            <polygon points="50,14 50,-2 55,14" fill="#ef4444" />
            <polygon points="60,16 68,0 54,14" fill="#facc15" />
            {/* Mystic Eyes */}
            <polygon points="42,30 48,31 45,34" fill="#fef08a" />
            <polygon points="58,30 52,31 55,34" fill="#fef08a" />
            {/* Phoenix Plume Tails */}
            <path d="M 36 78 Q 20 95 32 98 Q 42 88 40 78 Z" fill="#ea580c" />
            <path d="M 64 78 Q 80 95 68 98 Q 58 88 60 78 Z" fill="#ea580c" />
          </svg>
        );

      // 004 碧水灵 (Bishuiling - Water Starter)
      case 'bishuiling':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Water Pearl Crest Antenna */}
            <circle cx="50" cy="10" r="5" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
            <path d="M 50 16 Q 46 25 50 28" stroke="#38bdf8" strokeWidth="3" fill="none" />
            {/* Water Body */}
            <path d="M 50 24 C 74 24 82 52 78 74 C 74 88 26 88 22 74 C 18 52 26 24 50 24 Z" fill="#0ea5e9" />
            <ellipse cx="50" cy="66" rx="18" ry="14" fill="#bae6fd" />
            {/* Translucent Water Ripple Ring */}
            <ellipse cx="50" cy="78" rx="34" ry="8" fill="none" stroke="#7dd3fc" strokeWidth="2" opacity="0.6" />
            {/* Crystal Droplet Eyes */}
            <ellipse cx="40" cy="48" rx="4.5" ry="7" fill="#0369a1" />
            <circle cx="42" cy="45" r="2.5" fill="#ffffff" />
            <ellipse cx="60" cy="48" rx="4.5" ry="7" fill="#0369a1" />
            <circle cx="62" cy="45" r="2.5" fill="#ffffff" />
            {/* Cute Smile */}
            <circle cx="34" cy="56" r="3" fill="#f43f5e" opacity="0.4" />
            <circle cx="66" cy="56" r="3" fill="#f43f5e" opacity="0.4" />
            <path d="M 46 56 Q 50 60 54 56" stroke="#0369a1" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        );

      // 005 渊潮兽 (Yuanchaoshou - Water Mid Evo)
      case 'yuanchaoshou':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
            {/* Coral Horns */}
            <path d="M 38 22 Q 25 10 32 4 Q 40 12 42 20 Z" fill="#38bdf8" />
            <path d="M 62 22 Q 75 10 68 4 Q 60 12 58 20 Z" fill="#38bdf8" />
            {/* Tidal Beast Body */}
            <path d="M 50 22 C 78 22 84 56 80 76 C 75 90 25 90 20 76 C 16 56 22 22 50 22 Z" fill="#0284c7" />
            <ellipse cx="50" cy="65" rx="20" ry="16" fill="#e0f2fe" />
            {/* Ocean Fins */}
            <path d="M 16 58 Q 0 65 14 78 Z" fill="#0ea5e9" />
            <path d="M 84 58 Q 100 65 86 78 Z" fill="#0ea5e9" />
            {/* Majestic Sapphire Eyes */}
            <ellipse cx="40" cy="45" rx="5" ry="7.5" fill="#082f49" />
            <circle cx="42" cy="42" r="3" fill="#ffffff" />
            <ellipse cx="60" cy="45" rx="5" ry="7.5" fill="#082f49" />
            <circle cx="62" cy="42" r="3" fill="#ffffff" />
          </svg>
        );

      // 006 幻海灵尊 (Huanhailingzun - Water Ultimate Sovereign)
      case 'huanhailingzun':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
            {/* Ethereal Tidal Halo */}
            <circle cx="50" cy="50" r="42" fill="none" stroke="#38bdf8" strokeWidth="3" strokeDasharray="6 6" opacity="0.8" />
            <circle cx="15" cy="30" r="5" fill="#7dd3fc" />
            <circle cx="85" cy="30" r="5" fill="#7dd3fc" />
            {/* Ocean Sovereign Body */}
            <path d="M 50 18 C 76 18 82 50 78 78 C 75 92 25 92 22 78 C 18 50 24 18 50 18 Z" fill="#0369a1" />
            <ellipse cx="50" cy="68" rx="22" ry="18" fill="#f0f9ff" />
            {/* Crown of Deep Abyssal Pearl */}
            <polygon points="50,6 42,16 58,16" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />
            <circle cx="50" cy="12" r="3" fill="#0ea5e9" />
            {/* Regal Blue Eyes */}
            <ellipse cx="41" cy="42" rx="5" ry="7" fill="#082f49" />
            <circle cx="42" cy="40" r="2.5" fill="#7dd3fc" />
            <ellipse cx="59" cy="42" rx="5" ry="7" fill="#082f49" />
            <circle cx="60" cy="40" r="2.5" fill="#7dd3fc" />
          </svg>
        );

      // 007 青木鹿 (Qingmulu - Grass Starter)
      case 'qingmulu':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Sprout Antlers */}
            <path d="M 44 26 Q 35 12 30 14 Q 38 20 40 26 Z" fill="#15803d" />
            <ellipse cx="28" cy="13" rx="4" ry="2.5" fill="#4ade80" />
            <path d="M 58 26 Q 66 12 72 14 Q 64 20 62 26 Z" fill="#15803d" />
            <ellipse cx="74" cy="13" rx="4" ry="2.5" fill="#4ade80" />
            {/* Fawn Body */}
            <ellipse cx="50" cy="62" rx="24" ry="20" fill="#22c55e" />
            <ellipse cx="52" cy="64" rx="14" ry="13" fill="#dcfce7" />
            {/* Head */}
            <circle cx="52" cy="38" r="19" fill="#22c55e" />
            {/* Big Emerald Eyes */}
            <ellipse cx="45" cy="36" rx="4" ry="6" fill="#052e16" />
            <circle cx="46" cy="34" r="2" fill="#ffffff" />
            <ellipse cx="59" cy="36" rx="4" ry="6" fill="#052e16" />
            <circle cx="60" cy="34" r="2" fill="#ffffff" />
            {/* Little Nose & Smile */}
            <circle cx="52" cy="43" r="2" fill="#14532d" />
            <circle cx="38" cy="44" r="2.5" fill="#f472b6" opacity="0.6" />
            <circle cx="66" cy="44" r="2.5" fill="#f472b6" opacity="0.6" />
            {/* Little Hooves */}
            <ellipse cx="42" cy="80" rx="6" ry="4" fill="#166534" />
            <ellipse cx="60" cy="80" rx="6" ry="4" fill="#166534" />
          </svg>
        );

      // 008 翡翠角鹿 (Feicuijiaolu - Grass Mid Evo)
      case 'feicuijiaolu':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
            {/* Jade Crystal Antlers */}
            <path d="M 42 24 Q 28 6 22 10 Q 32 18 38 24 Z" fill="#059669" />
            <circle cx="20" cy="10" r="4" fill="#f472b6" />
            <path d="M 60 24 Q 74 6 80 10 Q 70 18 64 24 Z" fill="#059669" />
            <circle cx="82" cy="10" r="4" fill="#f472b6" />
            {/* Stag Body */}
            <ellipse cx="50" cy="60" rx="26" ry="22" fill="#16a34a" />
            <ellipse cx="52" cy="62" rx="16" ry="15" fill="#f0fdf4" />
            {/* Head */}
            <circle cx="52" cy="36" r="20" fill="#16a34a" />
            {/* Emerald Eyes */}
            <ellipse cx="45" cy="34" rx="4.5" ry="6.5" fill="#064e3b" />
            <circle cx="46" cy="32" r="2" fill="#ffffff" />
            <ellipse cx="59" cy="34" rx="4.5" ry="6.5" fill="#064e3b" />
            <circle cx="60" cy="32" r="2" fill="#ffffff" />
          </svg>
        );

      // 009 苍林神尊 (Canglinshenzun - Grass Ultimate Sovereign)
      case 'canglinshenzun':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
            {/* Canopy Antlers with Golden Fruit */}
            <path d="M 40 24 Q 18 2 10 10 Q 25 18 36 24 Z" fill="#047857" />
            <circle cx="10" cy="10" r="5" fill="#facc15" stroke="#ca8a04" />
            <circle cx="20" cy="4" r="4" fill="#4ade80" />
            <path d="M 62 24 Q 84 2 92 10 Q 77 18 66 24 Z" fill="#047857" />
            <circle cx="92" cy="10" r="5" fill="#facc15" stroke="#ca8a04" />
            <circle cx="82" cy="4" r="4" fill="#4ade80" />
            {/* Primordial Forest Body */}
            <ellipse cx="50" cy="62" rx="28" ry="24" fill="#15803d" />
            <ellipse cx="50" cy="64" rx="18" ry="16" fill="#f0fdf4" />
            {/* Head */}
            <circle cx="51" cy="34" r="22" fill="#15803d" />
            {/* Nature Crown */}
            <polygon points="42,16 51,6 60,16" fill="#facc15" stroke="#eab308" />
            {/* Divine Green Eyes */}
            <ellipse cx="44" cy="34" rx="5" ry="7" fill="#022c22" />
            <circle cx="45" cy="32" r="2.5" fill="#4ade80" />
            <ellipse cx="58" cy="34" rx="5" ry="7" fill="#022c22" />
            <circle cx="59" cy="32" r="2.5" fill="#4ade80" />
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
