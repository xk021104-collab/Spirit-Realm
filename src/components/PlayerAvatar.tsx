import React from 'react';

export interface PlayerAvatarProps {
  size?: number;
  isMoving?: boolean;
  direction?: 'left' | 'right';
  className?: string;
}

/**
 * 洛克小魔法师 (Young Wizard Apprentice - Classic Roco Kingdom Chibi Character)
 * - Pointy deep navy blue wizard hat with curved tip & golden star brooch
 * - Cute fluffy golden-brown hair, sparkling big anime eyes
 * - Royal navy blue wizard cape with gold trim & red inner vest
 * - Little magic wand with glowing blue star gem
 */
export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  size = 56,
  isMoving = false,
  direction = 'right',
  className = '',
}) => {
  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`relative inline-flex items-center justify-center select-none ${
        direction === 'left' ? 'scale-x-[-1]' : ''
      } ${isMoving ? 'animate-bounce' : ''} ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-[0_4px_12px_rgba(30,58,138,0.55)] overflow-visible"
      >
        <defs>
          {/* Magic Starlight Ground Aura */}
          <radialGradient id="wizAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#818cf8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
          </radialGradient>
          {/* Wizard Hat Navy Gradient */}
          <linearGradient id="wizHatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="40%" stopColor="#1e40af" />
            <stop offset="85%" stopColor="#172554" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          {/* Hair Golden Gradient */}
          <linearGradient id="wizHairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="45%" stopColor="#facc15" />
            <stop offset="90%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          {/* Cape Crimson Inner */}
          <linearGradient id="wizCapeInner" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
          {/* Gold Star Brooch */}
          <linearGradient id="wizGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
        </defs>

        {/* 1. Ground Magic Foot Disc */}
        <ellipse cx="50" cy="94" rx="28" ry="6" fill="url(#wizAura)" />
        <ellipse cx="50" cy="94" rx="18" ry="3.5" fill="none" stroke="#67e8f9" strokeWidth="1" strokeDasharray="3 2" opacity="0.8" />

        {/* 2. Wizard Cape (Back Flowing Wing) */}
        <path d="M 30 52 C 14 65 16 88 24 92 C 34 85 45 86 52 88 Z" fill="url(#wizHatGrad)" stroke="#1e3a8a" strokeWidth="1" />
        <path d="M 28 54 C 18 68 20 84 26 88" stroke="url(#wizGold)" strokeWidth="1.2" fill="none" />

        {/* 3. Little Wizard Boots */}
        <ellipse cx="42" cy="91" rx="5" ry="3" fill="#78350f" stroke="#451a03" strokeWidth="1" />
        <ellipse cx="58" cy="91" rx="5" ry="3" fill="#78350f" stroke="#451a03" strokeWidth="1" />

        {/* 4. Wizard Trousers & Red Waistcoat */}
        <rect x="38" y="76" width="24" height="14" rx="3" fill="#1e293b" />
        <path d="M 36 56 L 36 78 L 64 78 L 64 56 Z" fill="url(#wizCapeInner)" stroke="#991b1b" strokeWidth="1" />
        {/* White Shirt Collar */}
        <polygon points="44,56 50,65 56,56" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
        {/* Yellow Vest Buttons */}
        <circle cx="50" cy="69" r="1.5" fill="#facc15" />
        <circle cx="50" cy="74" r="1.5" fill="#facc15" />

        {/* 5. Left Cute Hand Holding Magic Wand */}
        <g transform="translate(18, 56)">
          {/* Wand Shaft */}
          <line x1="12" y1="20" x2="2" y2="-4" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
          {/* Wand Crystal Tip */}
          <polygon points="2,-4 5,-7 2,-10 -1,-7" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" filter="drop-shadow(0 0 4px #67e8f9)" />
          {/* Little Glove Hand */}
          <circle cx="12" cy="18" r="4.5" fill="#fed7aa" stroke="#ea580c" strokeWidth="0.8" />
        </g>

        {/* 6. Cute Chubby Chibi Face */}
        <ellipse cx="50" cy="46" rx="20" ry="17" fill="#fff7ed" stroke="#fdba74" strokeWidth="1" />
        {/* Rosy Cheeks */}
        <circle cx="36" cy="50" r="3" fill="#f43f5e" opacity="0.35" />
        <circle cx="64" cy="50" r="3" fill="#f43f5e" opacity="0.35" />

        {/* Big Sparkling Anime Eyes */}
        <g>
          {/* Left Eye */}
          <ellipse cx="40" cy="45" rx="4" ry="5.5" fill="#1e3a8a" />
          <ellipse cx="40" cy="43.5" rx="3" ry="4" fill="#0284c7" />
          <circle cx="39" cy="42" r="1.6" fill="#ffffff" />
          <circle cx="41.5" cy="45.5" r="0.8" fill="#ffffff" />
          {/* Right Eye */}
          <ellipse cx="60" cy="45" rx="4" ry="5.5" fill="#1e3a8a" />
          <ellipse cx="60" cy="43.5" rx="3" ry="4" fill="#0284c7" />
          <circle cx="59" cy="42" r="1.6" fill="#ffffff" />
          <circle cx="61.5" cy="45.5" r="0.8" fill="#ffffff" />
          {/* Cute Smile */}
          <path d="M 47 52 Q 50 55 53 52" stroke="#ea580c" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </g>

        {/* 7. Fluffy Golden Hair Bangs */}
        <path d="M 30 38 Q 38 48 44 40 Q 50 50 58 40 Q 64 48 70 38 Q 66 30 50 30 Q 34 30 30 38 Z" fill="url(#wizHairGrad)" stroke="#b45309" strokeWidth="1" />

        {/* 8. Iconic Pointy Wizard Hat with Curved Tip (Roco Kingdom Style) */}
        {/* Hat Wide Brim */}
        <ellipse cx="50" cy="33" rx="27" ry="9" fill="url(#wizHatGrad)" stroke="#1e3a8a" strokeWidth="1.5" />
        <ellipse cx="50" cy="33" rx="24" ry="7" fill="none" stroke="url(#wizGold)" strokeWidth="1" />
        {/* Hat Conical Crown Curving to Right */}
        <path
          d="M 28 32 C 30 18 42 6 60 2 C 55 6 48 14 62 20 C 72 24 70 30 72 32 Z"
          fill="url(#wizHatGrad)"
          stroke="#1e3a8a"
          strokeWidth="1.5"
        />
        {/* Golden Hat Band */}
        <path d="M 29 32 Q 50 36 71 32" stroke="url(#wizGold)" strokeWidth="3" fill="none" />
        {/* Golden Five-Pointed Star Brooch on Hat */}
        <polygon
          points="50,23 52,28 57,28.5 53,32 54.5,37 50,34 45.5,37 47,32 43,28.5 48,28"
          fill="url(#wizGold)"
          stroke="#78350f"
          strokeWidth="0.8"
          filter="drop-shadow(0 0 3px #fde047)"
        />
        <circle cx="50" cy="30" r="1.5" fill="#38bdf8" />
      </svg>
    </div>
  );
};

/**
 * 经典西幻 NPC 立绘 (Western Fantasy Magic NPCs)
 * - griffin: 洛克王国 格里芬院长 (Headmaster Griffin - Majestic Archmage with Long White Beard)
 * - student / tutor: 魔法导师 沃尔克 (Instructor Volker with Magic Book)
 */
export const NpcAvatar: React.FC<{ type?: string; size?: number; className?: string }> = ({
  type = 'griffin',
  size = 64,
  className = '',
}) => {
  // Headmaster Griffin (格里芬院长)
  if (type === 'griffin') {
    return (
      <div style={{ width: `${size}px`, height: `${size}px` }} className={`relative inline-flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_16px_rgba(168,85,247,0.6)]">
          <defs>
            <radialGradient id="grfAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#6366f1" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="grfRobe" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#581c87" />
              <stop offset="60%" stopColor="#3b0764" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
            <linearGradient id="grfBeard" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
          </defs>

          {/* Majestic Archmage Robe */}
          <path d="M 22 56 L 16 94 L 84 94 L 78 56 Z" fill="url(#grfRobe)" stroke="#d4af37" strokeWidth="1.5" />
          <path d="M 50 56 L 50 94" stroke="#facc15" strokeWidth="2" />

          {/* Grand Archmage Hat */}
          <ellipse cx="50" cy="28" rx="30" ry="10" fill="#3b0764" stroke="#d4af37" strokeWidth="1.5" />
          <path d="M 26 28 C 30 10 44 2 64 0 C 58 6 52 14 66 18 C 74 22 72 26 74 28 Z" fill="#581c87" stroke="#d4af37" strokeWidth="1.5" />
          <circle cx="48" cy="14" r="3" fill="#facc15" />
          <circle cx="56" cy="20" r="2" fill="#fde047" />

          {/* Wise Face with Golden Monocle Spectacles */}
          <ellipse cx="50" cy="40" rx="16" ry="14" fill="#fef3c7" />
          {/* Eyebrows */}
          <path d="M 38 34 Q 44 32 48 35" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 54 35 Q 58 32 64 34" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          {/* Golden Spectacles */}
          <circle cx="42" cy="38" r="4" fill="none" stroke="#facc15" strokeWidth="1.5" />
          <circle cx="58" cy="38" r="4" fill="none" stroke="#facc15" strokeWidth="1.5" />
          <line x1="46" y1="38" x2="54" y2="38" stroke="#facc15" strokeWidth="1.5" />
          <circle cx="42" cy="38" r="1.5" fill="#1e1b4b" />
          <circle cx="58" cy="38" r="1.5" fill="#1e1b4b" />

          {/* Grand Flowing White Beard */}
          <path d="M 34 44 C 32 60 40 82 50 86 C 60 82 68 60 66 44 Q 50 48 34 44 Z" fill="url(#grfBeard)" stroke="#cbd5e1" strokeWidth="1" />
          <path d="M 50 48 Q 42 56 36 50 M 50 48 Q 58 56 64 50" stroke="#94a3b8" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
    );
  }

  // Magic Tutor / Instructor (沃尔克导师)
  return (
    <div style={{ width: `${size}px`, height: `${size}px` }} className={`relative inline-flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_14px_rgba(234,88,12,0.5)]">
        <defs>
          <linearGradient id="tutCape" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#9a3412" />
          </linearGradient>
        </defs>
        {/* Crimson Wizard Cape */}
        <path d="M 24 54 L 18 92 L 82 92 L 76 54 Z" fill="url(#tutCape)" stroke="#ca8a04" strokeWidth="1.5" />
        {/* Friendly Face */}
        <ellipse cx="50" cy="42" rx="16" ry="14" fill="#fef3c7" />
        <ellipse cx="44" cy="40" rx="2.5" ry="3.5" fill="#1e293b" />
        <ellipse cx="56" cy="40" rx="2.5" ry="3.5" fill="#1e293b" />
        <circle cx="43" cy="39" r="1" fill="#ffffff" />
        <circle cx="55" cy="39" r="1" fill="#ffffff" />
        <path d="M 47 48 Q 50 51 53 48" stroke="#b45309" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        {/* Brown Hair */}
        <path d="M 34 35 Q 42 42 50 35 Q 58 42 66 35 C 64 25 50 24 34 35 Z" fill="#78350f" />
        {/* Pointy Red Wizard Hat */}
        <ellipse cx="50" cy="30" rx="25" ry="8" fill="#ea580c" stroke="#ca8a04" strokeWidth="1.2" />
        <polygon points="50,4 32,28 68,28" fill="#c2410c" stroke="#ca8a04" strokeWidth="1.2" />
        <polygon points="50,4 51,7 53,7 51.5,9 52,11 50,9.5 48,11 48.5,9 47,7 49,7" fill="#fde047" />
        {/* Open Spellbook in Hand */}
        <rect x="36" y="68" width="28" height="18" rx="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
        <line x1="50" y1="68" x2="50" y2="86" stroke="#92400e" strokeWidth="1.5" />
      </svg>
    </div>
  );
};

/**
 * 魔法好友头像 (Wizard Companion Avatar)
 */
export const FriendAvatar: React.FC<{
  type?: string;
  style?: string;
  size?: number;
  className?: string;
}> = ({
  size = 48,
  className = '',
}) => {
  return (
    <div style={{ width: `${size}px`, height: `${size}px` }} className={`relative inline-flex items-center justify-center ${className}`}>
      <PlayerAvatar size={size} />
    </div>
  );
};
