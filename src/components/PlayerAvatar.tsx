import React from 'react';

export interface PlayerAvatarProps {
  size?: number;
  isMoving?: boolean;
  direction?: 'left' | 'right';
  className?: string;
}

/**
 * 灵契师主角 (Celestial Spirit Cultivator / Tamer)
 * High-definition Eastern Fantasy Cultivator illustration:
 * - Flowing celestial Daoist robes with deep cyan, twilight indigo, and golden cloud trim
 * - Celestial hair topknot with jade pin & flowing azure ribbon
 * - Radiance spirit halo and floating celestial spirit talisman / spirit orb
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
        className="w-full h-full drop-shadow-[0_6px_16px_rgba(30,58,138,0.5)] overflow-visible"
      >
        <defs>
          {/* Celestial Base Halo */}
          <radialGradient id="playerCelestialAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="55%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
          </radialGradient>

          {/* Robe Gradient */}
          <linearGradient id="playerRobeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="50%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>

          {/* Golden Trigram Trim */}
          <linearGradient id="playerGoldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Hair Gradient */}
          <linearGradient id="playerHairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Skin Tone */}
          <linearGradient id="playerSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="100%" stopColor="#fed7aa" />
          </linearGradient>
        </defs>

        {/* 1. Celestial Ripple Circle */}
        <ellipse cx="50" cy="94" rx="34" ry="6" fill="url(#playerCelestialAura)" />
        <ellipse cx="50" cy="94" rx="22" ry="3.5" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 3" opacity="0.8" />

        {/* 2. Celestial Boots */}
        <g transform="translate(38, 84)">
          <ellipse cx="5" cy="8" rx="6" ry="4" fill="#1e1b4b" stroke="#0284c7" strokeWidth="1" />
          <ellipse cx="19" cy="8" rx="6" ry="4" fill="#1e1b4b" stroke="#0284c7" strokeWidth="1" />
          <rect x="2" y="0" width="6" height="8" rx="2" fill="#0f172a" />
          <rect x="16" y="0" width="6" height="8" rx="2" fill="#0f172a" />
        </g>

        {/* 3. Lower Celestial Robe & Pleats */}
        <path d="M 32 64 L 26 86 L 74 86 L 68 64 Z" fill="url(#playerRobeGrad)" stroke="#1e3a8a" strokeWidth="1" />
        <path d="M 26 86 L 74 86" stroke="url(#playerGoldTrim)" strokeWidth="2" fill="none" />
        <line x1="50" y1="64" x2="50" y2="86" stroke="#ffffff" strokeWidth="1.2" opacity="0.8" />

        {/* 4. Upper Robe with Cross Collar */}
        <path
          d="M 26 48 Q 18 68 24 82 Q 50 86 76 82 Q 82 68 74 48 Z"
          fill="url(#playerRobeGrad)"
          stroke="#1e3a8a"
          strokeWidth="1.2"
        />
        {/* Cross Collar (White & Sky Blue) */}
        <polygon points="44,46 50,58 56,46" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
        <polygon points="42,48 50,60 46,62" fill="#0284c7" />

        {/* 5. Cloud Pattern Belt & Spiritual Jade Talisman */}
        <rect x="34" y="62" width="32" height="4.5" rx="1.5" fill="#1e1b4b" stroke="url(#playerGoldTrim)" strokeWidth="1" />
        {/* Jade Pendant hanging on belt */}
        <circle cx="50" cy="64" r="2.5" fill="#a7f3d0" stroke="#059669" strokeWidth="0.8" filter="drop-shadow(0 0 4px #34d399)" />
        <line x1="50" y1="66.5" x2="50" y2="73" stroke="#38bdf8" strokeWidth="1" />

        {/* 6. Hand with Floating Spirit Pearl */}
        <g transform="translate(74, 58)">
          <circle cx="5" cy="5" r="4" fill="#38bdf8" filter="drop-shadow(0 0 6px #38bdf8)" />
          <circle cx="5" cy="5" r="1.8" fill="#ffffff" />
          <circle cx="5" cy="5" r="7" fill="none" stroke="#fde047" strokeWidth="0.8" strokeDasharray="3 2" className="animate-spin" />
        </g>

        {/* 7. Face & Flowing Starlight Hair */}
        <ellipse cx="50" cy="38" rx="16" ry="16" fill="url(#playerSkinGrad)" />

        {/* Side Locks & Bangs */}
        <path
          d="M 34 32 Q 42 24 50 24 Q 58 24 66 32 Q 62 38 56 34 Q 50 40 44 33 Q 38 40 34 32 Z"
          fill="url(#playerHairGrad)"
        />
        <path d="M 34 34 Q 30 46 34 52" stroke="url(#playerHairGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 66 34 Q 70 46 66 52" stroke="url(#playerHairGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Celestial Eyes */}
        <ellipse cx="44" cy="39" rx="2.8" ry="3.8" fill="#0f172a" />
        <circle cx="43" cy="37.5" r="1.2" fill="#ffffff" />
        <circle cx="44.8" cy="39.5" r="0.8" fill="#38bdf8" />
        <ellipse cx="56" cy="39" rx="2.8" ry="3.8" fill="#0f172a" />
        <circle cx="55" cy="37.5" r="1.2" fill="#ffffff" />
        <circle cx="56.8" cy="39.5" r="0.8" fill="#38bdf8" />

        {/* Rosy Cheeks */}
        <ellipse cx="40" cy="43" rx="2.5" ry="1.2" fill="#f43f5e" opacity="0.4" />
        <ellipse cx="60" cy="43" rx="2.5" ry="1.2" fill="#f43f5e" opacity="0.4" />

        {/* Forehead Spirit Mark */}
        <polygon points="50,29 51.5,32 50,34 48.5,32" fill="#38bdf8" filter="drop-shadow(0 0 2px #38bdf8)" />

        {/* Gentle Smile */}
        <path d="M 47 44 Q 50 46 53 44" stroke="#b45309" strokeWidth="1" fill="none" strokeLinecap="round" />

        {/* 8. Taoist Hair Crown & Ribbon */}
        <g transform="translate(50, 16)">
          <rect x="-7" y="-5" width="14" height="7" rx="2" fill="#0284c7" stroke="url(#playerGoldTrim)" strokeWidth="1" />
          <polygon points="-4,-5 0,-10 4,-5" fill="url(#playerGoldTrim)" />
          <line x1="-10" y1="-2" x2="10" y2="-2" stroke="#e0f2fe" strokeWidth="1.5" strokeLinecap="round" />
          {/* Azure Ribbons */}
          <path d="M -5 -2 C -10 6 -14 14 -18 20" stroke="#38bdf8" strokeWidth="1.2" fill="none" />
          <path d="M 5 -2 C 10 6 14 14 18 20" stroke="#38bdf8" strokeWidth="1.2" fill="none" />
        </g>
      </svg>
    </div>
  );
};

/**
 * 圣殿诸仙与宗门名宿 (Ethereal Eastern Fantasy NPCs)
 * Complete overhaul with high-fidelity Xianxia / Donghua art style.
 */
export const NpcAvatar: React.FC<{ type: string; size?: number }> = ({ type, size = 64 }) => {
  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className="relative inline-flex items-center justify-center select-none"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)] overflow-visible"
      >
        <defs>
          <radialGradient id="haloGold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fde047" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="haloThunder" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.75" />
            <stop offset="60%" stopColor="#9333ea" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b0764" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="daoistRobesElder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#312e81" />
            <stop offset="50%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="goldTrimsNpc" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* 1. 圣殿大长老 玄冥 (Sage Arch-Elder Xuanming) - The Celestial Venerable */}
        {type === 'griffin' ? (
          <g>
            {/* Sacred Taiji Bagua Celestial Halo */}
            <circle cx="50" cy="38" r="36" fill="url(#haloGold)" />
            <circle
              cx="50"
              cy="38"
              r="30"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="1.2"
              strokeDasharray="6 3"
              opacity="0.8"
            />
            {/* Bagua Trigram Accents around halo */}
            <line x1="20" y1="38" x2="25" y2="38" stroke="#fde047" strokeWidth="2" />
            <line x1="75" y1="38" x2="80" y2="38" stroke="#fde047" strokeWidth="2" />
            <line x1="50" y1="8" x2="50" y2="13" stroke="#fde047" strokeWidth="2" />

            {/* Majestic Archmage Daoist Robe */}
            <path
              d="M 22 52 Q 10 76 16 94 Q 50 97 84 94 Q 90 76 78 52 Z"
              fill="url(#daoistRobesElder)"
              stroke="#fbbf24"
              strokeWidth="1.2"
            />
            {/* Cloud Embroidery at Hem */}
            <path d="M 16 94 Q 50 97 84 94" stroke="#f59e0b" strokeWidth="2" fill="none" />
            <path d="M 32 54 L 26 92 L 36 94 L 42 62 Z" fill="#312e81" />
            <path d="M 68 54 L 74 92 L 64 94 L 58 62 Z" fill="#312e81" />

            {/* Central Yin-Yang Medallion */}
            <circle cx="50" cy="62" r="6.5" fill="#f8fafc" stroke="#fbbf24" strokeWidth="1" />
            <path d="M 50 55.5 A 3.25 3.25 0 0 1 50 62 A 3.25 3.25 0 0 0 50 68.5 A 6.5 6.5 0 0 1 50 55.5 Z" fill="#0f172a" />
            <circle cx="50" cy="58.75" r="1.1" fill="#f8fafc" />
            <circle cx="50" cy="65.25" r="1.1" fill="#0f172a" />

            {/* Venerable Elder Face */}
            <circle cx="50" cy="38" r="15" fill="#fef3c7" />

            {/* Flowing Snowy White Sage Beard */}
            <path
              d="M 36 42 Q 50 82 64 42 Q 58 58 50 64 Q 42 58 36 42 Z"
              fill="#ffffff"
              stroke="#e2e8f0"
              strokeWidth="0.8"
            />

            {/* Benevolent Sage Eyes & Eyebrows */}
            <path d="M 39 33 Q 44 28 48 33" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 52 33 Q 56 28 61 33" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 41 36 Q 44 38 47 36" stroke="#1e293b" strokeWidth="1.5" fill="none" />
            <path d="M 53 36 Q 56 38 59 36" stroke="#1e293b" strokeWidth="1.5" fill="none" />

            {/* Daoist Sage Crown (九梁道冠) */}
            <rect x="42" y="20" width="16" height="10" rx="3" fill="#1e1b4b" stroke="#fbbf24" strokeWidth="1.2" />
            <line x1="36" y1="25" x2="64" y2="25" stroke="#fde047" strokeWidth="2" strokeLinecap="round" />
            <circle cx="50" cy="18" r="3.5" fill="#38bdf8" stroke="#fbbf24" strokeWidth="0.8" />

            {/* Celestial Whisk in Hand (拂尘) */}
            <g transform="translate(74, 52)">
              <line x1="0" y1="40" x2="0" y2="10" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
              <path d="M 0 10 Q -15 20 -10 38" stroke="#ffffff" strokeWidth="2.5" fill="none" opacity="0.9" />
              <path d="M 0 10 Q -6 22 2 40" stroke="#f1f5f9" strokeWidth="2" fill="none" opacity="0.9" />
              <circle cx="0" cy="10" r="3" fill="#fbbf24" />
            </g>
          </g>
        ) : type === 'student' ? (
          // 2. 仙门引道执事 清羽 (Deacon Qingyu) - Celestial Disciple
          <g>
            {/* Azure Daoist Disciple Halo */}
            <circle cx="50" cy="46" r="36" fill="none" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />

            {/* Disciple Celestial Robes */}
            <path
              d="M 24 50 Q 14 78 20 94 Q 50 97 80 94 Q 86 78 76 50 Z"
              fill="#1e40af"
              stroke="#60a5fa"
              strokeWidth="1.2"
            />
            <path d="M 34 52 L 26 92 L 34 93 L 42 60 Z" fill="#172554" />
            <path d="M 66 52 L 74 92 L 66 93 L 58 60 Z" fill="#172554" />
            
            {/* Cross Collar (White silk) */}
            <polygon points="44,50 50,58 56,50" fill="#ffffff" />
            <circle cx="50" cy="58" r="2" fill="#a7f3d0" stroke="#059669" strokeWidth="0.6" />

            {/* Refined Disciple Face */}
            <circle cx="50" cy="38" r="15" fill="#fed7aa" />
            {/* Focused Cultivator Eyes */}
            <ellipse cx="44" cy="37" rx="2.8" ry="3.8" fill="#0f172a" />
            <circle cx="43" cy="35.5" r="1.1" fill="#ffffff" />
            <ellipse cx="56" cy="37" rx="2.8" ry="3.8" fill="#0f172a" />
            <circle cx="55" cy="35.5" r="1.1" fill="#ffffff" />

            {/* Disciple Hair Bun & Jade Hairpin */}
            <ellipse cx="50" cy="27" rx="10" ry="8" fill="#0f172a" />
            <line x1="38" y1="26" x2="62" y2="26" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            <circle cx="61" cy="26" r="2" fill="#fde047" />

            {/* Daoist Jade Scripture Scroll in Hand (玄门玉简) */}
            <g transform="translate(68, 62) rotate(15)">
              <rect x="0" y="0" width="16" height="22" rx="2" fill="#065f46" stroke="#34d399" strokeWidth="1" />
              <rect x="2" y="2" width="12" height="18" fill="#a7f3d0" />
              <line x1="4" y1="6" x2="12" y2="6" stroke="#047857" strokeWidth="1" />
              <line x1="4" y1="10" x2="12" y2="10" stroke="#047857" strokeWidth="1" />
              <line x1="4" y1="14" x2="10" y2="14" stroke="#047857" strokeWidth="1" />
            </g>
          </g>
        ) : type === 'ranger' ? (
          // 3. 古原巡游者 木岚 (Forest Guardian Mu Lan) - Verdant Spirit Ranger
          <g>
            {/* Verdant Living Leaves Aura */}
            <circle cx="50" cy="46" r="38" fill="none" stroke="#22c55e" strokeWidth="1" strokeDasharray="5 3" opacity="0.6" />

            {/* Living Willow Spirit Bow at Back (生机古木弓) */}
            <path d="M 76 92 Q 94 48 78 12" stroke="#78350f" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <line x1="78" y1="14" x2="76" y2="90" stroke="#86efac" strokeWidth="0.8" opacity="0.8" />
            <circle cx="78" cy="12" r="3.5" fill="#22c55e" />
            <circle cx="76" cy="92" r="3.5" fill="#22c55e" />

            {/* Emerald Hunter Robes & Leaf Epaulets */}
            <path
              d="M 24 48 Q 14 78 20 94 Q 50 97 80 94 Q 86 78 76 48 Z"
              fill="#15803d"
              stroke="#86efac"
              strokeWidth="1"
            />
            <path d="M 34 50 Q 26 80 28 92 Q 50 95 72 92 Q 74 80 66 50 Z" fill="#14532d" />
            {/* Leaf Collar */}
            <path d="M 32 46 Q 50 56 68 46 L 50 62 Z" fill="#22c55e" stroke="#16a34a" strokeWidth="0.8" />

            {/* Ranger Head & Leaf Tiara */}
            <circle cx="50" cy="38" r="14.5" fill="#fed7aa" />
            <ellipse cx="44" cy="37" rx="2.5" ry="3.5" fill="#14532d" />
            <circle cx="43" cy="35.5" r="1.1" fill="#ffffff" />
            <ellipse cx="56" cy="37" rx="2.5" ry="3.5" fill="#14532d" />
            <circle cx="55" cy="35.5" r="1.1" fill="#ffffff" />

            {/* Leaf Tiara on Brow */}
            <path d="M 34 32 Q 50 24 66 32 Q 58 22 50 22 Q 42 22 34 32 Z" fill="#166534" />
            <polygon points="50,20 53,26 58,26 54,29 56,34 50,31 44,34 46,29 42,26 47,26" fill="#4ade80" />
            <circle cx="50" cy="27" r="1.8" fill="#fde047" />

            {/* Floating Spore Motes */}
            <circle cx="26" cy="38" r="1.5" fill="#86efac" opacity="0.8" />
            <circle cx="70" cy="32" r="1.2" fill="#86efac" opacity="0.8" />
          </g>
        ) : type === 'smith' ? (
          // 4. 铸晶圣手 炎烈 (Forge Master Yan Lie) - Divine Magma Blacksmith
          <g>
            {/* Fiery Molten Flame Aura */}
            <circle cx="50" cy="46" r="38" fill="none" stroke="#ea580c" strokeWidth="1.2" strokeDasharray="6 3" opacity="0.7" />

            {/* Blazing Runic Smithing Hammer (九幽离火神锤) */}
            <line x1="20" y1="92" x2="20" y2="34" stroke="#78350f" strokeWidth="4.5" strokeLinecap="round" />
            <rect x="8" y="28" width="24" height="15" rx="3" fill="#292524" stroke="#ea580c" strokeWidth="1.5" />
            {/* Flaming Runes on Hammer Head */}
            <line x1="12" y1="35" x2="28" y2="35" stroke="#fde047" strokeWidth="1.8" />
            <circle cx="20" cy="35" r="2.5" fill="#f97316" />

            {/* Obsidian & Magma Battle Apron */}
            <path
              d="M 24 50 Q 16 78 22 94 Q 50 97 78 94 Q 84 78 76 50 Z"
              fill="#78350f"
              stroke="#f97316"
              strokeWidth="1.2"
            />
            <rect x="34" y="56" width="32" height="36" rx="3" fill="#1c1917" stroke="#ea580c" strokeWidth="1.2" />

            {/* Flaming Crimson Wild Hair */}
            <path d="M 28 34 Q 14 14 38 22 Q 48 2 60 18 Q 80 10 74 34 Z" fill="#ef4444" />
            {/* Bronze Headband with Magma Gem */}
            <ellipse cx="50" cy="32" rx="22" ry="6.5" fill="#ea580c" stroke="#facc15" strokeWidth="1.2" />
            <circle cx="50" cy="32" r="3" fill="#fde047" />

            {/* Tough Rugged Face & Goggles */}
            <circle cx="50" cy="44" r="15" fill="#fed7aa" />
            {/* Brass Goggles Pushed Up to Forehead */}
            <circle cx="42" cy="32" r="4.5" fill="#1c1917" stroke="#f59e0b" strokeWidth="1.8" />
            <circle cx="42" cy="32" r="2.2" fill="#38bdf8" />
            <circle cx="58" cy="32" r="4.5" fill="#1c1917" stroke="#f59e0b" strokeWidth="1.8" />
            <circle cx="58" cy="32" r="2.2" fill="#38bdf8" />

            {/* Resolute Eyes & Beard */}
            <ellipse cx="44" cy="43" rx="2.5" ry="2.5" fill="#1c1917" />
            <ellipse cx="56" cy="43" rx="2.5" ry="2.5" fill="#1c1917" />
            <path d="M 40 51 Q 50 56 60 51" stroke="#991b1b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        ) : type === 'sailor' ? (
          // 5. 瀚海隐叟 莫离 (Abyssal Sea Sage Mo Li) - Immortal Angler
          <g>
            {/* Nautical Azure Wave Aura */}
            <circle cx="50" cy="46" r="38" fill="none" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="5 4" opacity="0.6" />

            {/* Bamboo Fishing Rod & Ethereal Spirit Koi (垂钓虚空金鲤) */}
            <path d="M 78 94 Q 86 52 88 10" stroke="#a16207" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 88 10 Q 98 32 90 62" stroke="#e0f2fe" strokeWidth="0.8" fill="none" />
            {/* Floating Celestial Golden Koi */}
            <g transform="translate(90, 62) rotate(-20)">
              <ellipse cx="0" cy="0" rx="6" ry="3.5" fill="#f59e0b" />
              <polygon points="5,0 9,-3.5 9,3.5" fill="#fbbf24" />
              <circle cx="-3" cy="-1" r="0.8" fill="#ffffff" />
            </g>

            {/* Conical Bamboo Hat (青竹斗笠) */}
            <polygon points="50,14 10,36 90,36" fill="#ca8a04" stroke="#854d0e" strokeWidth="1.5" />
            <line x1="50" y1="14" x2="50" y2="36" stroke="#854d0e" strokeWidth="1" />
            <circle cx="50" cy="14" r="3" fill="#10b981" />

            {/* Azure Nautical Robes & Hemp Belt */}
            <path
              d="M 24 50 Q 14 78 20 94 Q 50 97 80 94 Q 86 78 76 50 Z"
              fill="#0284c7"
              stroke="#38bdf8"
              strokeWidth="1.2"
            />
            <path d="M 34 52 L 24 92 L 32 94 L 40 58 Z" fill="#0369a1" />
            <path d="M 66 52 L 76 92 L 68 94 L 60 58 Z" fill="#0369a1" />

            {/* Friendly Smiling Weathered Face & White Mustache */}
            <circle cx="50" cy="44" r="14.5" fill="#fed7aa" />
            {/* Squinting Smiling Eyes */}
            <path d="M 41 41 Q 44 38 47 41" stroke="#1e293b" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M 53 41 Q 56 38 59 41" stroke="#1e293b" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            {/* Wispy White Mustache */}
            <path
              d="M 38 48 Q 45 52 50 49 Q 55 52 62 48"
              stroke="#f8fafc"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        ) : type === 'nurse' ? (
          // 6. 万灵医仙 云曦 (Celestial Fairy Healer Yunxi) - Lotus Maiden
          <g>
            {/* Floating Soft Pink & Mint Blossom Aura */}
            <circle cx="50" cy="44" r="38" fill="none" stroke="#f472b6" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />

            {/* Floating Gossamer Pink Silk Ribbons (轻纱天绫) */}
            <path
              d="M 12 34 Q 4 62 14 86 Q 24 64 22 42 Z"
              fill="#f472b6"
              opacity="0.8"
            />
            <path
              d="M 88 34 Q 96 62 86 86 Q 76 64 78 42 Z"
              fill="#f472b6"
              opacity="0.8"
            />

            {/* White & Blossom Fairy Gown */}
            <path
              d="M 26 48 Q 16 78 22 94 Q 50 97 78 94 Q 84 78 74 48 Z"
              fill="#fff1f2"
              stroke="#fb7185"
              strokeWidth="1.2"
            />
            <path d="M 36 50 L 28 92 L 36 93 L 42 58 Z" fill="#fb7185" opacity="0.85" />
            <path d="M 64 50 L 72 92 L 64 93 L 58 58 Z" fill="#fb7185" opacity="0.85" />

            {/* Floating Jade Healing Gourd (碧玉灵葫) */}
            <g transform="translate(76, 54)">
              <circle cx="0" cy="0" r="5" fill="#10b981" />
              <circle cx="0" cy="7" r="7.5" fill="#059669" />
              <rect x="-2" y="-7" width="4" height="4" rx="1" fill="#fde047" />
              {/* Droplets */}
              <circle cx="5" cy="-2" r="1.5" fill="#67e8f9" opacity="0.8" />
            </g>

            {/* Beautiful Maiden Face */}
            <circle cx="50" cy="38" r="14.5" fill="#fff1f2" />

            {/* Elegant Twin Buns (双鬟仙髻) */}
            <circle cx="34" cy="26" r="8" fill="#1e1b4b" />
            <circle cx="66" cy="26" r="8" fill="#1e1b4b" />
            <circle cx="34" cy="26" r="2.8" fill="#fb7185" />
            <circle cx="66" cy="26" r="2.8" fill="#fb7185" />
            <path d="M 34 32 Q 50 20 66 32 Q 50 18 34 32 Z" fill="#1e1b4b" />

            {/* Big Luminous Gentle Eyes */}
            <ellipse cx="44" cy="38" rx="2.6" ry="3.8" fill="#0f172a" />
            <circle cx="43" cy="36.5" r="1.2" fill="#ffffff" />
            <ellipse cx="56" cy="38" rx="2.6" ry="3.8" fill="#0f172a" />
            <circle cx="55" cy="36.5" r="1.2" fill="#ffffff" />

            {/* Delicate Blush & Gentle Smile */}
            <ellipse cx="38" cy="42" rx="2.5" ry="1.2" fill="#f43f5e" opacity="0.6" />
            <ellipse cx="62" cy="42" rx="2.5" ry="1.2" fill="#f43f5e" opacity="0.6" />
            <path d="M 47.5 44 Q 50 46 52.5 44" stroke="#e11d48" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </g>
        ) : type === 'merchant' ? (
          // 7. 万象阁主 葛乾 (Grand Merchant Ge Qian) - Opulent Lord
          <g>
            {/* Opulent Gold Coin Halo */}
            <circle cx="50" cy="46" r="38" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.75" />

            {/* Regal Purple & Gold Damask Robes */}
            <path
              d="M 22 48 Q 12 78 18 94 Q 50 97 82 94 Q 88 78 78 48 Z"
              fill="#4a044e"
              stroke="#fbbf24"
              strokeWidth="1.8"
            />
            {/* Plush Fur Collar */}
            <path d="M 30 46 Q 50 62 70 46 Q 50 40 30 46 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
            <polygon points="50,56 60,94 40,94" fill="#a21caf" />

            {/* Floating Golden Abacus (九章金算盘) */}
            <g transform="translate(76, 52)">
              <rect x="0" y="0" width="16" height="22" rx="2" fill="#78350f" stroke="#fbbf24" strokeWidth="1.2" />
              <line x1="0" y1="7" x2="16" y2="7" stroke="#fbbf24" strokeWidth="1" />
              <circle cx="4" cy="4" r="1.2" fill="#fde047" />
              <circle cx="8" cy="4" r="1.2" fill="#fde047" />
              <circle cx="12" cy="4" r="1.2" fill="#fde047" />
              <circle cx="4" cy="12" r="1.2" fill="#fde047" />
              <circle cx="8" cy="12" r="1.2" fill="#fde047" />
              <circle cx="12" cy="12" r="1.2" fill="#fde047" />
            </g>

            {/* Golden Merchant Crown (万宝金元冠) */}
            <path d="M 34 26 Q 50 14 66 26 L 62 32 Q 50 24 38 32 Z" fill="#f59e0b" stroke="#ca8a04" strokeWidth="1.2" />
            <circle cx="50" cy="20" r="3.5" fill="#dc2626" stroke="#fbbf24" strokeWidth="0.8" />

            {/* Chubby Joyful Aristocratic Face */}
            <circle cx="50" cy="42" r="15.5" fill="#fed7aa" />
            <ellipse cx="44" cy="40" rx="2.5" ry="3" fill="#1e1b4b" />
            <ellipse cx="56" cy="40" rx="2.5" ry="3" fill="#1e1b4b" />
            {/* Merchant Mustache */}
            <path
              d="M 38 47 Q 45 51 50 48 Q 55 51 62 47"
              stroke="#78350f"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        ) : type === 'taoist' ? (
          // 9. 丹青符师 / 仙童 (Daoist Youth / Talisman Adept)
          <g>
            {/* Yin-Yang Jade Ring Halo */}
            <circle cx="50" cy="44" r="38" fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="5 3" opacity="0.75" />
            
            {/* Floating Golden Talisman Scrolls (玄天悬浮神符) */}
            <g transform="translate(14, 40) rotate(-15)">
              <rect x="0" y="0" width="10" height="20" rx="2" fill="#fef08a" stroke="#ea580c" strokeWidth="1" />
              <line x1="2" y1="5" x2="8" y2="5" stroke="#dc2626" strokeWidth="1.2" />
              <line x1="2" y1="10" x2="8" y2="10" stroke="#dc2626" strokeWidth="1.2" />
              <line x1="5" y1="12" x2="5" y2="17" stroke="#dc2626" strokeWidth="1" />
            </g>
            <g transform="translate(76, 44) rotate(12)">
              <rect x="0" y="0" width="10" height="20" rx="2" fill="#fef08a" stroke="#ea580c" strokeWidth="1" />
              <line x1="2" y1="5" x2="8" y2="5" stroke="#dc2626" strokeWidth="1.2" />
              <line x1="2" y1="10" x2="8" y2="10" stroke="#dc2626" strokeWidth="1.2" />
            </g>

            {/* Cyan Daoist Silk Robes (青玉法袍) */}
            <path
              d="M 24 48 Q 14 78 20 94 Q 50 97 80 94 Q 86 78 76 48 Z"
              fill="#0f172a"
              stroke="#38bdf8"
              strokeWidth="1.2"
            />
            <path d="M 34 50 L 24 92 L 32 94 L 40 58 Z" fill="#0284c7" />
            <path d="M 66 50 L 76 92 L 68 94 L 60 58 Z" fill="#0284c7" />
            {/* White Lapel & Jade Belt */}
            <polygon points="50,48 42,64 58,64" fill="#f8fafc" />
            <rect x="34" y="62" width="32" height="5" rx="1.5" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
            <circle cx="50" cy="64.5" r="2.5" fill="#10b981" />

            {/* Youth Face */}
            <circle cx="50" cy="38" r="14.5" fill="#ffedd5" />
            <ellipse cx="44" cy="37" rx="2.5" ry="3.5" fill="#0f172a" />
            <circle cx="43" cy="35.5" r="1.1" fill="#ffffff" />
            <ellipse cx="56" cy="37" rx="2.5" ry="3.5" fill="#0f172a" />
            <circle cx="55" cy="35.5" r="1.1" fill="#ffffff" />
            <ellipse cx="38" cy="41" rx="2" ry="1.2" fill="#fb7185" opacity="0.5" />
            <ellipse cx="62" cy="41" rx="2" ry="1.2" fill="#fb7185" opacity="0.5" />
            <path d="M 47.5 43 Q 50 45 52.5 43" stroke="#b45309" strokeWidth="1.1" fill="none" strokeLinecap="round" />

            {/* Neat Daoist Bun with Wooden Pin (混元髻) */}
            <circle cx="50" cy="20" r="7.5" fill="#0f172a" />
            <line x1="36" y1="20" x2="64" y2="20" stroke="#ca8a04" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 34 32 Q 50 24 66 32 Q 58 20 50 20 Q 42 20 34 32 Z" fill="#0f172a" />
          </g>
        ) : (
          // 8. 天武战皇 陆天衡 (Celestial War God Lu Tianheng) - Arena Champion
          <g>
            {/* Crackling Violet Thunder Halo */}
            <circle cx="50" cy="44" r="42" fill="url(#haloThunder)" />
            <circle
              cx="50"
              cy="44"
              r="38"
              fill="none"
              stroke="#c084fc"
              strokeWidth="1.5"
              strokeDasharray="8 4"
              opacity="0.8"
            />

            {/* Colossal Thunder-Cleaving Greatsword on Shoulder */}
            <g transform="rotate(24 82 20)">
              <rect x="80" y="8" width="6" height="84" rx="1.5" fill="#94a3b8" stroke="#a855f7" strokeWidth="1" />
              <polygon points="80,8 86,2 83,12" fill="#e9d5ff" />
              <rect x="76" y="28" width="14" height="5" rx="1" fill="#f59e0b" />
            </g>

            {/* Obsidian & Celestial Gold War Armor */}
            <path
              d="M 22 48 Q 12 78 18 94 Q 50 97 82 94 Q 88 78 78 48 Z"
              fill="#0f172a"
              stroke="#f59e0b"
              strokeWidth="1.8"
            />
            {/* Golden Dragon Chest Crest */}
            <polygon points="50,54 64,68 50,86 36,68" fill="#ca8a04" stroke="#fef08a" strokeWidth="1" />
            <circle cx="50" cy="68" r="4" fill="#a855f7" />

            {/* Crimson Royal War Cape */}
            <path d="M 16 52 Q 6 76 12 94 L 24 92 Q 22 74 22 56 Z" fill="#dc2626" />
            <path d="M 84 52 Q 94 76 88 94 L 76 92 Q 78 74 78 56 Z" fill="#dc2626" />

            {/* Dragon-Horned Battle Helmet */}
            <path d="M 26 36 Q 50 12 74 36 L 72 48 Q 50 56 28 48 Z" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.8" />
            {/* Golden Horns */}
            <polygon points="26,34 12,16 28,24" fill="#f59e0b" stroke="#ca8a04" strokeWidth="1" />
            <polygon points="74,34 88,16 72,24" fill="#f59e0b" stroke="#ca8a04" strokeWidth="1" />

            {/* Glowing Violet Runic Visor Slit */}
            <rect x="34" y="38" width="32" height="5.5" rx="2.5" fill="#020617" />
            <circle cx="43" cy="40.8" r="2.2" fill="#c084fc" />
            <circle cx="57" cy="40.8" r="2.2" fill="#c084fc" />
          </g>
        )}
      </svg>
    </div>
  );
};

export interface FriendAvatarProps {
  style: 'fairy' | 'swordsman' | 'scholar' | 'taoist' | 'wizard' | 'knight';
  size?: number;
  className?: string;
}

export const FriendAvatar: React.FC<FriendAvatarProps> = ({ style, size = 52, className = '' }) => {
  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
    >
      {style === 'fairy' ? (
        <NpcAvatar type="nurse" size={size} />
      ) : style === 'swordsman' ? (
        <NpcAvatar type="student" size={size} />
      ) : style === 'scholar' ? (
        <NpcAvatar type="sailor" size={size} />
      ) : style === 'taoist' ? (
        <NpcAvatar type="taoist" size={size} />
      ) : style === 'wizard' ? (
        <NpcAvatar type="merchant" size={size} />
      ) : (
        <NpcAvatar type="arena_champion" size={size} />
      )}
    </div>
  );
};
