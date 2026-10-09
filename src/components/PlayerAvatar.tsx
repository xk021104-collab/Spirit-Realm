import React from 'react';

interface PlayerAvatarProps {
  size?: number;
  isMoving?: boolean;
  direction?: 'left' | 'right';
  className?: string;
}

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
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        {/* Wizard Cape */}
        <path d="M 28 50 Q 15 70 20 85 Q 50 90 75 85 Q 82 70 72 50 Z" fill="#3b82f6" />
        <path d="M 32 52 Q 22 70 26 82 Q 50 86 70 82 Q 76 70 68 52 Z" fill="#1d4ed8" />

        {/* Wizard Hat Base & Cone */}
        <ellipse cx="50" cy="40" rx="30" ry="10" fill="#7e22ce" stroke="#581c87" strokeWidth="2" />
        <path d="M 26 40 Q 50 -5 74 40 Z" fill="#8b5cf6" />
        <path d="M 32 40 Q 50 5 68 40 Z" fill="#7e22ce" />
        {/* Hat Band & Star */}
        <ellipse cx="50" cy="38" rx="20" ry="6" fill="#fbbf24" />
        <polygon points="50,33 52,37 56,37 53,39 54,43 50,40 46,43 47,39 44,37 48,37" fill="#fef08a" />

        {/* Face */}
        <circle cx="50" cy="50" r="15" fill="#fde68a" />
        {/* Hair Bangs */}
        <path d="M 36 44 Q 50 52 64 44 Q 50 38 36 44 Z" fill="#92400e" />

        {/* Eyes */}
        <ellipse cx="45" cy="51" rx="2.5" ry="3.5" fill="#1e1b4b" />
        <circle cx="46" cy="50" r="1" fill="#ffffff" />
        <ellipse cx="55" cy="51" rx="2.5" ry="3.5" fill="#1e1b4b" />
        <circle cx="56" cy="50" r="1" fill="#ffffff" />

        {/* Blush & Smile */}
        <circle cx="40" cy="56" r="2.5" fill="#f87171" opacity="0.6" />
        <circle cx="60" cy="56" r="2.5" fill="#f87171" opacity="0.6" />
        <path d="M 47 55 Q 50 58 53 55" stroke="#92400e" strokeWidth="1.2" fill="none" strokeLinecap="round" />

        {/* Magic Wand in Hand */}
        <line x1="70" y1="58" x2="88" y2="46" stroke="#ca8a04" strokeWidth="3" strokeLinecap="round" />
        <polygon points="88,46 90,43 94,45 92,48 94,52 90,50 87,53 87,49 83,47 87,46" fill="#fde047" />

        {/* Boots */}
        <ellipse cx="42" cy="88" rx="6" ry="4" fill="#6b21a8" />
        <ellipse cx="58" cy="88" rx="6" ry="4" fill="#6b21a8" />
      </svg>
    </div>
  );
};

export const NpcAvatar: React.FC<{ type: string; size?: number }> = ({ type, size = 64 }) => {
  return (
    <div style={{ width: `${size}px`, height: `${size}px` }} className="relative inline-flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        {type === 'griffin' ? (
          // Dean Griffin: White beard, golden robe, archmage hat
          <>
            <path d="M 25 50 Q 15 90 25 95 Q 50 98 75 95 Q 85 90 75 50 Z" fill="#ca8a04" />
            <ellipse cx="50" cy="35" rx="32" ry="10" fill="#1e1b4b" />
            <path d="M 25 35 Q 50 -10 75 35 Z" fill="#312e81" />
            <circle cx="50" cy="45" r="16" fill="#fef08a" />
            {/* Long majestic white beard */}
            <path d="M 38 52 Q 50 85 62 52 Q 50 92 38 52 Z" fill="#ffffff" />
            <circle cx="44" cy="44" r="2.5" fill="#1e293b" />
            <circle cx="56" cy="44" r="2.5" fill="#1e293b" />
            <polygon points="50,28 53,34 58,34 54,37 56,42 50,39 44,42 46,37 42,34 47,34" fill="#facc15" />
          </>
        ) : type === 'nurse' ? (
          // Nurse Moemoe: Pink nurse cap, green cross, cheerful hair
          <>
            <path d="M 28 55 Q 18 85 24 92 Q 50 95 76 92 Q 82 85 72 55 Z" fill="#f43f5e" />
            <circle cx="50" cy="44" r="18" fill="#ffe4e6" />
            {/* Pink hair bun */}
            <circle cx="34" cy="36" r="8" fill="#fda4af" />
            <circle cx="66" cy="36" r="8" fill="#fda4af" />
            {/* Nurse hat with green cross */}
            <path d="M 38 30 L 62 30 L 58 20 L 42 20 Z" fill="#ffffff" />
            <rect x="48" y="22" width="4" height="6" fill="#10b981" />
            <rect x="47" y="23" width="6" height="4" fill="#10b981" />
            <ellipse cx="44" cy="44" rx="2.5" ry="3.5" fill="#1e293b" />
            <ellipse cx="56" cy="44" rx="2.5" ry="3.5" fill="#1e293b" />
            <circle cx="40" cy="50" r="3" fill="#f43f5e" opacity="0.6" />
            <circle cx="60" cy="50" r="3" fill="#f43f5e" opacity="0.6" />
          </>
        ) : type === 'merchant' ? (
          // Merchant Pupu: Green coin bag, merchant turban
          <>
            <path d="M 25 50 Q 15 85 22 92 Q 50 95 78 92 Q 85 85 75 50 Z" fill="#047857" />
            <circle cx="50" cy="44" r="18" fill="#fed7aa" />
            {/* Turban */}
            <ellipse cx="50" cy="32" rx="26" ry="12" fill="#059669" />
            <circle cx="50" cy="28" r="5" fill="#facc15" />
            {/* Merchant mustache */}
            <path d="M 40 52 Q 46 55 50 51 Q 54 55 60 52" stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <circle cx="44" cy="42" r="2.5" fill="#1e293b" />
            <circle cx="56" cy="42" r="2.5" fill="#1e293b" />
          </>
        ) : (
          // Knight / Champion Maxwell
          <>
            <path d="M 24 50 Q 15 85 22 92 Q 50 95 78 92 Q 85 85 76 50 Z" fill="#475569" />
            <circle cx="50" cy="42" r="18" fill="#e2e8f0" />
            {/* Knight Helmet & Red Plume */}
            <path d="M 30 35 Q 50 15 70 35 L 70 48 Q 50 55 30 48 Z" fill="#94a3b8" />
            <path d="M 48 18 Q 50 -2 58 8 Q 52 16 48 18 Z" fill="#ef4444" />
            {/* Visor slit */}
            <rect x="38" y="38" width="24" height="4" rx="2" fill="#0f172a" />
          </>
        )}
      </svg>
    </div>
  );
};
