import React from 'react';

interface WizardPortraitProps {
  mode?: 'avatar' | 'full' | 'bust';
  size?: number;
  className?: string;
}

/**
 * 洛克小魔法师 · 西幻手绘级角色立绘 (Young Wizard Apprentice Character Portrait)
 * 100% Authentic Western Fantasy Magic World Aesthetic:
 * - Iconic Pointy Wizard Hat with star gem & golden buckle
 * - Sparkling anime eyes, golden hair, royal navy blue wizard cape
 * - Magic wand casting swirling starlight & Gulu capture sphere on belt
 */
export const CultivatorPortrait: React.FC<WizardPortraitProps> = ({
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
            <radialGradient id="avWizGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="60%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#0a0f1d" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="50" fill="url(#avWizGlow)" />
          {/* Hat Brim */}
          <ellipse cx="50" cy="40" rx="36" ry="12" fill="#1e40af" stroke="#facc15" strokeWidth="1.5" />
          <path d="M 22 40 C 26 15 45 4 68 2 C 60 8 52 18 68 25 C 78 30 76 38 78 40 Z" fill="#1e3a8a" stroke="#facc15" strokeWidth="1.5" />
          {/* Face */}
          <ellipse cx="50" cy="58" rx="22" ry="18" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1" />
          {/* Eyes */}
          <ellipse cx="40" cy="56" rx="4" ry="6" fill="#1e3a8a" />
          <circle cx="39" cy="54" r="1.8" fill="#ffffff" />
          <ellipse cx="60" cy="56" rx="4" ry="6" fill="#1e3a8a" />
          <circle cx="59" cy="54" r="1.8" fill="#ffffff" />
          {/* Smile */}
          <path d="M 46 64 Q 50 67 54 64" stroke="#ea580c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Robe */}
          <path d="M 22 100 L 38 74 L 62 74 L 78 100 Z" fill="#2563eb" stroke="#d4af37" strokeWidth="1.2" />
        </svg>
      </div>
    );
  }

  // Full Body High-Definition Wizard Portrait
  return (
    <div className={`relative w-full flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 280 380"
        className="w-full h-auto max-h-[380px] drop-shadow-[0_12px_36px_rgba(37,99,235,0.45)] overflow-visible"
      >
        <defs>
          {/* Magic Array Concentric Disc */}
          <radialGradient id="wizFullAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#818cf8" stopOpacity="0.4" />
            <stop offset="85%" stopColor="#1e1b4b" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="wizFullHatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="40%" stopColor="#1d4ed8" />
            <stop offset="85%" stopColor="#172554" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="wizFullCape" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="60%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#172554" />
          </linearGradient>
          <linearGradient id="wizFullHair" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#facc15" />
            <stop offset="85%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="wizFullGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="50%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* 1. Background Magic Astrolabe & Runic Halo */}
        <circle cx="140" cy="180" r="115" fill="url(#wizFullAura)" />
        <circle cx="140" cy="180" r="105" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="12 6" opacity="0.6" />
        <circle cx="140" cy="180" r="85" fill="none" stroke="#facc15" strokeWidth="1" strokeDasharray="6 4" opacity="0.7" />
        {/* Magic Runes Star */}
        <polygon points="140,80 160,150 230,140 180,185 210,250 140,215 70,250 100,185 50,140 120,150" fill="none" stroke="#818cf8" strokeWidth="0.8" opacity="0.4" />

        {/* 2. Flowing Wizard Cloak (Back) */}
        <path d="M 80 180 C 40 230 45 320 65 345 C 95 330 140 335 155 340 C 200 335 240 325 245 280 C 240 220 205 180 185 175 Z" fill="url(#wizFullCape)" stroke="#1e3a8a" strokeWidth="2" />
        <path d="M 75 190 C 50 240 55 310 70 340" stroke="url(#wizFullGold)" strokeWidth="2.5" fill="none" />
        <path d="M 205 190 C 230 240 230 300 215 335" stroke="url(#wizFullGold)" strokeWidth="2.5" fill="none" />

        {/* 3. Wizard Boots */}
        <g>
          <ellipse cx="118" cy="348" rx="14" ry="7" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
          <ellipse cx="162" cy="348" rx="14" ry="7" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
          <rect x="110" y="325" width="16" height="20" rx="3" fill="#92400e" stroke="#451a03" strokeWidth="1.2" />
          <rect x="154" y="325" width="16" height="20" rx="3" fill="#92400e" stroke="#451a03" strokeWidth="1.2" />
        </g>

        {/* 4. Wizard Pants & Tunic */}
        <rect x="108" y="270" width="64" height="60" rx="6" fill="#1e293b" />
        {/* Red Vest / Waistcoat */}
        <path d="M 102 195 L 98 275 L 182 275 L 178 195 Z" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5" />
        <polygon points="126,195 140,218 154,195" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
        {/* Golden Buttons */}
        <circle cx="140" cy="235" r="3" fill="#fde047" stroke="#b45309" strokeWidth="1" />
        <circle cx="140" cy="255" r="3" fill="#fde047" stroke="#b45309" strokeWidth="1" />

        {/* 5. Leather Belt with Mini Gulu Ball & Potion Vial */}
        <rect x="94" y="270" width="92" height="12" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
        <rect x="132" y="267" width="16" height="18" rx="2" fill="url(#wizFullGold)" stroke="#78350f" strokeWidth="1.5" />
        {/* Belt Pouch: Gulu Ball */}
        <g transform="translate(100, 280) scale(0.45)">
          <circle cx="24" cy="24" r="18" fill="#ef4444" stroke="#7f1d1d" strokeWidth="2" />
          <path d="M 6 24 A 18 18 0 0 0 42 24 Z" fill="#ffffff" />
          <circle cx="24" cy="24" r="6" fill="#0f172a" stroke="#d4af37" strokeWidth="2" />
        </g>
        {/* Belt Pouch: Potion Flask */}
        <g transform="translate(162, 280) scale(0.42)">
          <path d="M 10 30 C 10 20 20 18 20 10 L 28 10 C 28 18 38 20 38 30 C 38 40 28 44 24 44 C 20 44 10 40 10 30 Z" fill="#06b6d4" stroke="#083344" strokeWidth="2" />
          <rect x="22" y="6" width="4" height="5" fill="#92400e" />
        </g>

        {/* 6. Right Arm Holding Magic Star Staff */}
        <g>
          {/* Wand Staff */}
          <line x1="190" y1="260" x2="225" y2="85" stroke="#78350f" strokeWidth="5.5" strokeLinecap="round" />
          <line x1="190" y1="260" x2="225" y2="85" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />
          {/* Wand Star Tip */}
          <g transform="translate(225, 85)">
            <polygon points="0,-16 5,-4 16,0 5,4 0,16 -5,4 -16,0 -5,-4" fill="#67e8f9" stroke="#0284c7" strokeWidth="1.5" filter="drop-shadow(0 0 8px #38bdf8)" />
            <circle cx="0" cy="0" r="5" fill="#ffffff" />
            {/* Swirling Sparkles */}
            <circle cx="-12" cy="-14" r="2.5" fill="#fde047" className="animate-ping" />
            <circle cx="16" cy="12" r="2" fill="#38bdf8" />
          </g>
          {/* Right Glove Hand */}
          <circle cx="195" cy="235" r="9" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
        </g>

        {/* 7. Cute Chibi Face */}
        <ellipse cx="140" cy="165" rx="44" ry="38" fill="#fff7ed" stroke="#fed7aa" strokeWidth="2" />
        {/* Rosy Cheeks */}
        <circle cx="110" cy="175" r="7" fill="#f43f5e" opacity="0.3" />
        <circle cx="170" cy="175" r="7" fill="#f43f5e" opacity="0.3" />

        {/* Big Sparkling Anime Eyes */}
        <g>
          {/* Left Eye */}
          <ellipse cx="118" cy="162" rx="9" ry="13" fill="#1e3a8a" />
          <ellipse cx="118" cy="159" rx="7" ry="10" fill="#0284c7" />
          <circle cx="116" cy="156" r="3.8" fill="#ffffff" />
          <circle cx="121" cy="164" r="1.8" fill="#ffffff" />
          {/* Right Eye */}
          <ellipse cx="162" cy="162" rx="9" ry="13" fill="#1e3a8a" />
          <ellipse cx="162" cy="159" rx="7" ry="10" fill="#0284c7" />
          <circle cx="160" cy="156" r="3.8" fill="#ffffff" />
          <circle cx="165" cy="164" r="1.8" fill="#ffffff" />
          {/* Cheerful Mouth */}
          <path d="M 132 180 Q 140 188 148 180" stroke="#ea580c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>

        {/* 8. Fluffy Golden Hair */}
        <path d="M 95 145 C 110 170 125 150 140 172 C 155 150 170 170 185 145 C 180 120 150 115 140 115 C 130 115 100 120 95 145 Z" fill="url(#wizFullHair)" stroke="#b45309" strokeWidth="2" />

        {/* 9. Iconic Wide-Brim Pointy Wizard Hat with Curved Crown */}
        {/* Wide Brim */}
        <ellipse cx="140" cy="135" rx="64" ry="20" fill="url(#wizFullHatGrad)" stroke="#1e3a8a" strokeWidth="2.5" />
        <ellipse cx="140" cy="135" rx="58" ry="16" fill="none" stroke="url(#wizFullGold)" strokeWidth="2" />
        {/* Hat Crown Curving Sharply to Upper Right */}
        <path
          d="M 90 132 C 95 95 125 45 175 22 C 160 38 145 60 185 75 C 210 85 205 110 200 132 Z"
          fill="url(#wizFullHatGrad)"
          stroke="#1e3a8a"
          strokeWidth="2.5"
        />
        {/* Hat Gold Ribbon */}
        <path d="M 92 132 Q 140 142 198 132" stroke="url(#wizFullGold)" strokeWidth="6" fill="none" />
        {/* Gold Star Brooch */}
        <polygon
          points="140,110 145,122 158,124 148,133 151,146 140,138 129,146 132,133 122,124 135,122"
          fill="url(#wizFullGold)"
          stroke="#78350f"
          strokeWidth="1.5"
          filter="drop-shadow(0 0 6px #fde047)"
        />
        <circle cx="140,128" r="3.5" fill="#38bdf8" />
      </svg>
    </div>
  );
};
