import React from 'react';

interface CultivatorPortraitProps {
  mode?: 'avatar' | 'full' | 'bust';
  size?: number;
  className?: string;
}

/**
 * 天命御灵仙师 · 绝品国风仙侠手绘级角色立绘 (Celestial Spirit Cultivator Official Character Portrait)
 * 100% Authentic Xianxia Eastern Fantasy Style:
 * - Flowing celestial silk robes with deep cyan, twilight indigo, and imperial purple gradients
 * - Immortal Taoist hair crown (束发紫金玉冠) with flowing azure cloud ribbons
 * - Deep, clear spiritual eyes with starlight reflections
 * - Hand holding floating Taiji Bagua Spirit Pearl / Spirit Talisman (灵契仙符)
 * - Swirling celestial mist (云雾缭绕) and golden trigram runes
 */
export const CultivatorPortrait: React.FC<CultivatorPortraitProps> = ({
  mode = 'full',
  size,
  className = '',
}) => {
  if (mode === 'avatar') {
    const avatarSize = size || 44;
    return (
      <div
        style={{ width: `${avatarSize}px`, height: `${avatarSize}px` }}
        className={`relative inline-flex items-center justify-center rounded-full overflow-hidden select-none bg-[#091124] ${className}`}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full object-cover">
          <defs>
            <radialGradient id="avXianxiaGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#6366f1" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
            </radialGradient>
            <linearGradient id="avRobeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
            <linearGradient id="avHairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <linearGradient id="avSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="100%" stopColor="#fed7aa" />
            </linearGradient>
          </defs>

          {/* Background Aura */}
          <circle cx="50" cy="50" r="50" fill="url(#avXianxiaGlow)" />
          <circle cx="50" cy="50" r="46" fill="none" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />

          {/* Robe Collar */}
          <path d="M 20 100 L 40 68 L 60 68 L 80 100 Z" fill="url(#avRobeGrad)" stroke="#38bdf8" strokeWidth="1" />
          <polygon points="44,68 50,78 56,68" fill="#ffffff" />
          <line x1="50" y1="78" x2="50" y2="100" stroke="#fde047" strokeWidth="1.2" />

          {/* Face */}
          <ellipse cx="50" cy="48" rx="18" ry="19" fill="url(#avSkinGrad)" />

          {/* Handsome Windblown Hair */}
          <path
            d="M 30 46 C 26 30, 40 22, 50 22 C 60 22, 74 30, 70 46 C 66 38, 62 42, 56 36 C 50 42, 44 36, 40 44 C 36 38, 32 44, 30 46 Z"
            fill="url(#avHairGrad)"
          />
          {/* Side Locks */}
          <path d="M 32 46 C 30 58, 34 66, 36 72" stroke="url(#avHairGrad)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 68 46 C 70 58, 66 66, 64 72" stroke="url(#avHairGrad)" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* Taoist Hair Crown & Jade Pin */}
          <g transform="translate(50, 19)">
            <rect x="-8" y="-7" width="16" height="8" rx="2" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
            <polygon points="-5,-7 0,-13 5,-7" fill="#fde047" stroke="#b45309" strokeWidth="0.8" />
            <line x1="-12" y1="-3" x2="12" y2="-3" stroke="#e0f2fe" strokeWidth="1.5" strokeLinecap="round" />
            {/* Flowing Cloud Ribbon */}
            <path d="M -5 -3 C -10 6, -14 12, -18 16" stroke="#38bdf8" strokeWidth="1.2" fill="none" />
            <path d="M 5 -3 C 10 6, 14 12, 18 16" stroke="#38bdf8" strokeWidth="1.2" fill="none" />
          </g>

          {/* Eyes */}
          <ellipse cx="43" cy="48" rx="2.8" ry="3.5" fill="#0f172a" />
          <circle cx="42" cy="46.5" r="1.2" fill="#ffffff" />
          <circle cx="44.2" cy="49" r="0.8" fill="#38bdf8" />
          <ellipse cx="57" cy="48" rx="2.8" ry="3.5" fill="#0f172a" />
          <circle cx="56" cy="46.5" r="1.2" fill="#ffffff" />
          <circle cx="58.2" cy="49" r="0.8" fill="#38bdf8" />

          {/* Eyebrows */}
          <path d="M 39 42 Q 44 40 47 43" stroke="#0f172a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M 53 43 Q 56 40 61 42" stroke="#0f172a" strokeWidth="1.2" fill="none" strokeLinecap="round" />

          {/* Forehead Spirit Mark */}
          <polygon points="50,37 51.5,40 50,42 48.5,40" fill="#38bdf8" filter="drop-shadow(0 0 2px #38bdf8)" />

          {/* Gentle Smile */}
          <path d="M 47 57 Q 50 59 53 57" stroke="#b45309" strokeWidth="1" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Full-body High-definition Master Xianxia Artwork
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 320 440"
        className="w-full h-auto max-h-[460px] drop-shadow-[0_12px_32px_rgba(30,58,138,0.55)] overflow-visible"
      >
        <defs>
          {/* Celestial Halo Gradient */}
          <radialGradient id="xxGrandHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
            <stop offset="45%" stopColor="#818cf8" stopOpacity="0.25" />
            <stop offset="85%" stopColor="#4338ca" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
          </radialGradient>

          {/* Robe Silk Gradient: Deep Cyan to Imperial Indigo */}
          <linearGradient id="xxRobeSilk" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="35%" stopColor="#1e40af" />
            <stop offset="75%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Inner Robe Pure Celestial White */}
          <linearGradient id="xxInnerRobe" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          {/* Golden Trigram & Hem Trim */}
          <linearGradient id="xxGoldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Hair Dark Charcoal */}
          <linearGradient id="xxHairSilk" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Radiant Spirit Pearl Glow */}
          <radialGradient id="xxOrbGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="80%" stopColor="#6366f1" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#4338ca" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Celestial Astrolabe / Taiji Halo behind Head */}
        <g transform="translate(160, 110)">
          <circle cx="0" cy="0" r="88" fill="url(#xxGrandHalo)" />
          <circle cx="0" cy="0" r="74" fill="none" stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="6 4" opacity="0.6" className="animate-[spin_40s_linear_infinite]" />
          <circle cx="0" cy="0" r="60" fill="none" stroke="#c084fc" strokeWidth="0.8" strokeDasharray="3 6" opacity="0.5" className="animate-[spin_30s_linear_infinite_reverse]" />
          {/* Orbiting Starlight Runes */}
          <circle cx="0" cy="-74" r="2.5" fill="#fde047" filter="drop-shadow(0 0 6px #fde047)" />
          <circle cx="64" cy="37" r="2.5" fill="#38bdf8" filter="drop-shadow(0 0 6px #38bdf8)" />
          <circle cx="-64" cy="37" r="2" fill="#c084fc" filter="drop-shadow(0 0 6px #c084fc)" />
        </g>

        {/* 2. Swirling Cloud Pedestal beneath Feet */}
        <g transform="translate(160, 400)">
          <ellipse cx="0" cy="0" rx="95" ry="18" fill="#1e1b4b" opacity="0.4" />
          <ellipse cx="0" cy="0" rx="75" ry="12" fill="url(#xxGrandHalo)" />
          {/* Swirling Mist Paths */}
          <path
            d="M -70 5 Q -30 -12 0 -2 Q 40 -14 70 4 Q 30 14 -10 8 Q -45 16 -70 5 Z"
            fill="#38bdf8"
            opacity="0.3"
            filter="blur(3px)"
          />
          <path
            d="M -50 -4 Q -10 -16 25 -6 Q 55 -12 75 -2 Q 40 8 5 4 Q -30 10 -50 -4 Z"
            fill="#c084fc"
            opacity="0.25"
            filter="blur(2px)"
          />
        </g>

        {/* 3. Flowing Lower Robes (Xianxia Immortality Skirt / 仙裾) */}
        <path
          d="M 125 240 L 95 385 Q 160 410 225 385 L 195 240 Z"
          fill="url(#xxRobeSilk)"
          stroke="#1e3a8a"
          strokeWidth="1.5"
        />
        {/* Inner White Robe Pleats */}
        <path d="M 145 242 L 138 395 L 182 395 L 175 242 Z" fill="url(#xxInnerRobe)" />
        <line x1="160" y1="242" x2="160" y2="395" stroke="#cbd5e1" strokeWidth="1.2" />

        {/* Outer Hem Gold Embroidery */}
        <path d="M 95 385 Q 160 410 225 385" stroke="url(#xxGoldTrim)" strokeWidth="3" fill="none" />
        <path d="M 100 378 Q 160 402 220 378" stroke="#38bdf8" strokeWidth="1" strokeDasharray="5 3" fill="none" opacity="0.8" />

        {/* 4. Torso & Upper Celestial Robe */}
        <path
          d="M 115 150 L 105 245 Q 160 252 215 245 L 205 150 Z"
          fill="url(#xxRobeSilk)"
          stroke="#1e3a8a"
          strokeWidth="1.2"
        />
        {/* Daoist Cross Collar (交领右衽) */}
        <polygon points="142,142 160,185 178,142 160,152" fill="url(#xxInnerRobe)" stroke="#cbd5e1" strokeWidth="1" />
        <path d="M 135 142 L 160 200 L 168 190 L 145 142 Z" fill="#0284c7" stroke="url(#xxGoldTrim)" strokeWidth="1.2" />
        <path d="M 185 142 L 152 205 L 160 215 L 195 142 Z" fill="#1e3a8a" stroke="url(#xxGoldTrim)" strokeWidth="1.2" />

        {/* Waist Sash (云纹锦带) & Jade Medallion (双鱼佩) */}
        <g transform="translate(160, 236)">
          <rect x="-35" y="0" width="70" height="14" rx="3" fill="#1e1b4b" stroke="url(#xxGoldTrim)" strokeWidth="1.5" />
          <line x1="-35" y1="7" x2="35" y2="7" stroke="#38bdf8" strokeWidth="1" />
          {/* Central Jade Bi / Talisman */}
          <circle cx="0" cy="7" r="8" fill="#a7f3d0" stroke="#059669" strokeWidth="1.2" filter="drop-shadow(0 0 6px #34d399)" />
          <circle cx="0" cy="7" r="3" fill="#065f46" />
          {/* Flowing Jade Tassels */}
          <path d="M -3 15 L -6 45 L 0 52 L 6 45 L 3 15 Z" fill="#38bdf8" opacity="0.85" />
          <line x1="0" y1="15" x2="0" y2="52" stroke="#fde047" strokeWidth="1" />
        </g>

        {/* 5. Wide Floating Sleeve (Left - Hanging Naturally) */}
        <path
          d="M 115 150 Q 82 175 78 220 Q 80 270 105 285 Q 115 270 120 225 Q 124 185 125 155 Z"
          fill="url(#xxRobeSilk)"
          stroke="#1e3a8a"
          strokeWidth="1.2"
        />
        <path d="M 78 220 Q 80 270 105 285" stroke="url(#xxGoldTrim)" strokeWidth="2" fill="none" />

        {/* 6. Raised Right Arm Holding Floating Spirit Pearl (灵契引诀) */}
        <path
          d="M 205 150 Q 235 168 245 205 Q 235 245 210 255 Q 200 235 205 200 Q 205 175 198 152 Z"
          fill="url(#xxRobeSilk)"
          stroke="#1e3a8a"
          strokeWidth="1.2"
        />
        {/* Sleeve Opening Gold Hem */}
        <path d="M 245 205 Q 235 245 210 255" stroke="url(#xxGoldTrim)" strokeWidth="2" fill="none" />

        {/* Right Hand & Daoist Sword Mudra (剑指灵印) */}
        <g transform="translate(236, 185)">
          <ellipse cx="6" cy="6" rx="6" ry="7" fill="#fed7aa" />
          {/* Fingers in Celestial Mudra */}
          <rect x="5" y="-6" width="3.5" height="11" rx="1.5" fill="#fde68a" />
          <rect x="9" y="-4" width="3.2" height="9" rx="1.5" fill="#fde68a" />
          
          {/* Floating Luminous Spirit Pearl (本命灵珠 / 乾坤灵珠) */}
          <g transform="translate(18, -12)">
            <circle cx="0" cy="0" r="22" fill="url(#xxOrbGlow)" />
            <circle cx="0" cy="0" r="10" fill="#ffffff" filter="drop-shadow(0 0 10px #38bdf8)" />
            <circle cx="0" cy="0" r="14" fill="none" stroke="#fde047" strokeWidth="1" strokeDasharray="3 3" className="animate-spin" />
            {/* Swirling Elemental Particles around Pearl */}
            <circle cx="-12" cy="0" r="2.2" fill="#ef4444" filter="drop-shadow(0 0 4px #ef4444)" />
            <circle cx="10" cy="-8" r="2.2" fill="#38bdf8" filter="drop-shadow(0 0 4px #38bdf8)" />
            <circle cx="6" cy="11" r="2.2" fill="#22c55e" filter="drop-shadow(0 0 4px #22c55e)" />
          </g>
        </g>

        {/* 7. Windblown Celestial Ribbons (仙绫飘带) */}
        <path
          d="M 115 155 Q 60 190 45 250 Q 35 295 55 350 Q 65 310 60 265 Q 75 210 120 165 Z"
          fill="#38bdf8"
          opacity="0.6"
        />
        <path
          d="M 205 155 Q 260 190 275 250 Q 285 295 265 350 Q 255 310 260 265 Q 245 210 200 165 Z"
          fill="#818cf8"
          opacity="0.55"
        />

        {/* 8. Elegant Neck & Head */}
        <rect x="153" y="118" width="14" height="20" rx="3" fill="#fed7aa" />
        {/* Head Contour */}
        <ellipse cx="160" cy="108" rx="22" ry="24" fill="#fffbeb" />

        {/* Refined Facial Features */}
        {/* Soft Rosy Cheeks */}
        <ellipse cx="145" cy="114" rx="5" ry="2.5" fill="#fca5a5" opacity="0.4" />
        <ellipse cx="175" cy="114" rx="5" ry="2.5" fill="#fca5a5" opacity="0.4" />

        {/* Anime Xianxia Eyes (Deep Indigo Sapphire with Starlight Glow) */}
        <g>
          {/* Left Eye */}
          <ellipse cx="151" cy="108" rx="4.5" ry="5.5" fill="#1e1b4b" />
          <circle cx="149" cy="106" r="2" fill="#ffffff" />
          <circle cx="152.5" cy="109.5" r="1.3" fill="#38bdf8" />
          <path d="M 144 102 Q 151 98 157 102" stroke="#0f172a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          {/* Right Eye */}
          <ellipse cx="169" cy="108" rx="4.5" ry="5.5" fill="#1e1b4b" />
          <circle cx="167" cy="106" r="2" fill="#ffffff" />
          <circle cx="170.5" cy="109.5" r="1.3" fill="#38bdf8" />
          <path d="M 163 102 Q 169 98 176 102" stroke="#0f172a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>

        {/* Elegant Slender Nose & Gentle Smile */}
        <line x1="160" y1="110" x2="160" y2="116" stroke="#fed7aa" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 156 122 Q 160 125 164 122" stroke="#b45309" strokeWidth="1.4" fill="none" strokeLinecap="round" />

        {/* Celestial Forehead Taoist Flame Mark (额间朱砂灵印) */}
        <g transform="translate(160, 95)">
          <path d="M 0 -7 Q 3 -1 0 3 Q -3 -1 0 -7 Z" fill="#38bdf8" filter="drop-shadow(0 0 4px #38bdf8)" />
          <circle cx="0" cy="-1" r="1" fill="#ffffff" />
        </g>

        {/* 9. Flowing Black Hair (Long locks over shoulders & back) */}
        {/* Back Hair */}
        <path
          d="M 138 100 C 120 135 110 185 116 230 C 124 190 132 145 142 110 Z"
          fill="url(#xxHairSilk)"
        />
        <path
          d="M 182 100 C 200 135 210 185 204 230 C 196 190 188 145 178 110 Z"
          fill="url(#xxHairSilk)"
        />

        {/* Bangs & Forehead Hair */}
        <path
          d="M 136 102 C 144 80 160 76 172 80 C 184 84 186 102 184 105 C 178 94 172 98 166 90 C 160 98 152 90 146 100 C 140 94 136 98 136 102 Z"
          fill="url(#xxHairSilk)"
        />

        {/* 10. Taoist Jade Crown (束发紫金玉冠) */}
        <g transform="translate(160, 72)">
          {/* Golden Crown Base */}
          <rect x="-14" y="-8" width="28" height="12" rx="3" fill="#0284c7" stroke="url(#xxGoldTrim)" strokeWidth="1.8" />
          <polygon points="-8,-8 0,-18 8,-8" fill="url(#xxGoldTrim)" />
          {/* Luminous Center Jade Bead */}
          <circle cx="0" cy="-2" r="3.5" fill="#a7f3d0" stroke="#059669" strokeWidth="1" filter="drop-shadow(0 0 6px #34d399)" />
          {/* Cross Hairpin (碧玉通天簪) */}
          <line x1="-24" y1="-2" x2="24" y2="-2" stroke="#e0f2fe" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="23" cy="-2" r="2.5" fill="#fde047" />
          {/* Flowing Back Ribbons */}
          <path d="M -8 -2 C -18 12 -24 24 -30 36" stroke="#38bdf8" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 8 -2 C 18 12 24 24 30 36" stroke="#38bdf8" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};
