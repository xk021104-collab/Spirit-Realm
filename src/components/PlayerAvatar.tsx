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
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
        {/* Magic Aura Ring under player */}
        <ellipse cx="50" cy="90" rx="32" ry="7" fill="#3b82f6" opacity="0.35" className="animate-pulse" />

        {/* Dynamic Wizard Cape with Gold Trim */}
        <path d="M 24 48 Q 10 70 16 86 Q 50 92 82 86 Q 88 70 76 48 Z" fill="#2563eb" />
        <path d="M 28 50 Q 18 70 22 84 Q 50 88 78 84 Q 82 70 72 50 Z" fill="#1d4ed8" />
        <path d="M 16 86 Q 50 92 82 86" stroke="#fbbf24" strokeWidth="2.5" fill="none" />

        {/* Wizard Robe Sleeves & Body */}
        <path d="M 32 52 L 24 74 L 38 72 L 42 56 Z" fill="#3b82f6" />
        <path d="M 68 52 L 78 68 L 66 70 L 60 56 Z" fill="#3b82f6" />
        <rect x="36" y="52" width="28" height="30" rx="4" fill="#1e40af" />
        {/* Belt with Spirit Gem */}
        <rect x="35" y="66" width="30" height="5" fill="#ca8a04" />
        <polygon points="50,65 53,68.5 50,72 47,68.5" fill="#38bdf8" />

        {/* Wizard Hat Base & Pointy Brim */}
        <ellipse cx="50" cy="38" rx="34" ry="11" fill="#6b21a8" stroke="#4c1d95" strokeWidth="2" />
        <path d="M 24 38 Q 48 -8 76 38 Z" fill="#7c3aed" />
        <path d="M 30 38 Q 48 2 70 38 Z" fill="#6b21a8" />
        {/* Golden Hat Band & Mystic Star Brooch */}
        <ellipse cx="50" cy="36" rx="22" ry="7" fill="#fbbf24" />
        <polygon points="50,30 52.5,35 58,35 53.5,38 55.5,43 50,40 44.5,43 46.5,38 42,35 47.5,35" fill="#fef08a" />

        {/* Character Face & Hair */}
        <circle cx="50" cy="48" r="16" fill="#fde68a" />
        {/* Anime Hair Bangs */}
        <path d="M 34 42 Q 50 50 66 42 Q 58 35 50 36 Q 42 35 34 42 Z" fill="#78350f" />
        <path d="M 34 42 L 36 50 L 40 44 Z" fill="#78350f" />
        <path d="M 66 42 L 64 50 L 60 44 Z" fill="#78350f" />

        {/* Big Bright Anime Eyes */}
        <ellipse cx="44" cy="49" rx="3" ry="4.5" fill="#1e1b4b" />
        <circle cx="45" cy="47.5" r="1.3" fill="#ffffff" />
        <ellipse cx="56" cy="49" rx="3" ry="4.5" fill="#1e1b4b" />
        <circle cx="57" cy="47.5" r="1.3" fill="#ffffff" />

        {/* Cheerful Blush & Smile */}
        <ellipse cx="39" cy="54" rx="2.5" ry="1.5" fill="#f87171" opacity="0.7" />
        <ellipse cx="61" cy="54" rx="2.5" ry="1.5" fill="#f87171" opacity="0.7" />
        <path d="M 47 53 Q 50 56 53 53" stroke="#92400e" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Magic Arcane Wand in Right Hand with Celestial Star */}
        <line x1="72" y1="62" x2="90" y2="40" stroke="#d97706" strokeWidth="3.5" strokeLinecap="round" />
        <polygon points="90,40 92,34 97,36 94,40 97,45 92,43 89,47 88,42 83,40 88,38" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
        <circle cx="90" cy="40" r="3" fill="#38bdf8" />

        {/* Shiny Shoes */}
        <ellipse cx="41" cy="85" rx="7" ry="4" fill="#581c87" />
        <ellipse cx="59" cy="85" rx="7" ry="4" fill="#581c87" />
      </svg>
    </div>
  );
};

export const NpcAvatar: React.FC<{ type: string; size?: number }> = ({ type, size = 64 }) => {
  return (
    <div style={{ width: `${size}px`, height: `${size}px` }} className="relative inline-flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
        {/* 1. Dean Xuanming (大长老 玄冥 - 圣殿守护长 / Celestial Archmage) */}
        {type === 'griffin' ? (
          <>
            {/* Sacred Wisdom Halo */}
            <circle cx="50" cy="40" r="42" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.7" />
            <circle cx="50" cy="40" r="36" fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.6" />

            {/* Nine-colored Archmage Robes */}
            <path d="M 22 52 Q 10 90 20 96 Q 50 99 80 96 Q 90 90 78 52 Z" fill="#1e1b4b" />
            <path d="M 32 54 L 20 96 L 28 97 L 38 60 Z" fill="#ca8a04" />
            <path d="M 68 54 L 80 96 L 72 97 L 62 60 Z" fill="#ca8a04" />
            <polygon points="50,54 62,96 38,96" fill="#312e81" />

            {/* Grand Archmage Pointy Hat */}
            <ellipse cx="50" cy="33" rx="34" ry="11" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="2" />
            <path d="M 22 33 Q 50 -14 78 33 Z" fill="#312e81" />
            <polygon points="50,22 54,28 60,28 55,32 57,38 50,34 43,38 45,32 40,28 46,28" fill="#facc15" />

            {/* Sage Face & Dignified Eyes */}
            <circle cx="50" cy="44" r="16" fill="#fef08a" />
            <circle cx="44" cy="42" r="2.5" fill="#1e293b" />
            <circle cx="56" cy="42" r="2.5" fill="#1e293b" />
            <path d="M 40 38 Q 45 36 48 39" stroke="#92400e" strokeWidth="1.5" fill="none" />
            <path d="M 60 38 Q 55 36 52 39" stroke="#92400e" strokeWidth="1.5" fill="none" />

            {/* Flowing Daoist White Beard */}
            <path d="M 34 50 Q 50 94 66 50 Q 58 75 50 82 Q 42 75 34 50 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />

            {/* Arcane Crystal Staff */}
            <line x1="84" y1="96" x2="84" y2="20" stroke="#ca8a04" strokeWidth="4" strokeLinecap="round" />
            <circle cx="84" cy="18" r="9" fill="#38bdf8" stroke="#facc15" strokeWidth="2" />
            <polygon points="84,12 87,17 92,18 88,22 89,26 84,24 79,26 80,22 76,18 81,17" fill="#ffffff" />
          </>
        ) : type === 'student' ? (
          // 2. Chu Feng (师兄 楚风 - 圣殿执事弟子 / Cultivation Prodigy Disciple)
          <>
            {/* Flying Sword on Back */}
            <rect x="68" y="10" width="4" height="60" fill="#94a3b8" transform="rotate(25 68 10)" />
            <polygon points="68,10 74,4 72,14" fill="#38bdf8" transform="rotate(25 68 10)" />
            <rect x="64" y="24" width="12" height="4" rx="1" fill="#f59e0b" transform="rotate(25 68 10)" />

            {/* White & Cyan Disciple Robes */}
            <path d="M 26 50 Q 18 86 24 94 Q 50 97 76 94 Q 82 86 74 50 Z" fill="#f8fafc" stroke="#0ea5e9" strokeWidth="1.5" />
            <path d="M 38 52 L 28 92 L 36 93 L 44 58 Z" fill="#0284c7" />
            <path d="M 62 52 L 72 92 L 64 93 L 56 58 Z" fill="#0284c7" />
            <rect x="36" y="66" width="28" height="4" fill="#0284c7" />

            {/* Head & Youthful Hair Topknot */}
            <circle cx="50" cy="42" r="16" fill="#fed7aa" />
            {/* Daoist Topknot with Jade Hairpin */}
            <circle cx="50" cy="22" r="8" fill="#18181b" />
            <line x1="38" y1="22" x2="62" y2="22" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
            <path d="M 34 36 Q 50 44 66 36 Q 60 28 50 28 Q 40 28 34 36 Z" fill="#18181b" />

            {/* Energetic Eyes & Confident Smile */}
            <ellipse cx="44" cy="42" rx="2.5" ry="3.5" fill="#0f172a" />
            <circle cx="45" cy="41" r="1" fill="#ffffff" />
            <ellipse cx="56" cy="42" rx="2.5" ry="3.5" fill="#0f172a" />
            <circle cx="57" cy="41" r="1" fill="#ffffff" />
            <path d="M 46 48 Q 50 52 54 48" stroke="#c2410c" strokeWidth="1.5" fill="none" strokeLinecap="round" />

            {/* Spirit Talisman Scroll in Hand */}
            <rect x="20" y="60" width="8" height="14" rx="2" fill="#fef08a" stroke="#ea580c" strokeWidth="1" />
            <line x1="22" y1="64" x2="26" y2="64" stroke="#dc2626" strokeWidth="1" />
            <line x1="22" y1="68" x2="26" y2="68" stroke="#dc2626" strokeWidth="1" />
          </>
        ) : type === 'ranger' ? (
          // 3. Mu Lan (守林尊者 木岚 - 古原巡游者 / Wood Forest Ranger)
          <>
            {/* Emerald Leaves Cloak */}
            <path d="M 22 48 Q 12 86 20 94 Q 50 97 80 94 Q 88 86 78 48 Z" fill="#15803d" />
            <path d="M 32 50 Q 24 80 26 92 Q 50 95 74 92 Q 76 80 68 50 Z" fill="#166534" />

            {/* Ranger Hood & Leaf Circlet */}
            <path d="M 30 40 Q 50 16 70 40 L 68 52 Q 50 58 32 52 Z" fill="#166534" stroke="#15803d" strokeWidth="1.5" />
            <ellipse cx="50" cy="36" rx="22" ry="7" fill="#10b981" />
            <polygon points="50,28 53,34 58,34 54,37 56,42 50,39 44,42 46,37 42,34 47,34" fill="#34d399" />

            {/* Face & Sharp Tracker Eyes */}
            <circle cx="50" cy="44" r="14" fill="#fed7aa" />
            <ellipse cx="44" cy="44" rx="2.5" ry="3" fill="#14532d" />
            <circle cx="45" cy="43" r="1" fill="#ffffff" />
            <ellipse cx="56" cy="44" rx="2.5" ry="3" fill="#14532d" />
            <circle cx="57" cy="43" r="1" fill="#ffffff" />

            {/* Living Branch Staff with Green Sprout */}
            <path d="M 82 94 Q 85 50 80 18" stroke="#78350f" strokeWidth="4.5" fill="none" strokeLinecap="round" />
            <circle cx="80" cy="16" r="6" fill="#22c55e" stroke="#16a34a" strokeWidth="1.5" />
            <ellipse cx="76" cy="12" rx="4" ry="2" fill="#86efac" transform="rotate(-30 76 12)" />
            <ellipse cx="84" cy="12" rx="4" ry="2" fill="#86efac" transform="rotate(30 84 12)" />
          </>
        ) : type === 'smith' ? (
          // 4. Yan Lie (铸晶圣手 炎烈 - 地火炼器师 / Fiery Magma Blacksmith)
          <>
            {/* Magma Smelter Apron */}
            <path d="M 22 52 Q 15 88 22 95 Q 50 98 78 95 Q 85 88 78 52 Z" fill="#78350f" />
            <rect x="34" y="56" width="32" height="36" rx="3" fill="#44403c" stroke="#ea580c" strokeWidth="2" />

            {/* Flame-Red Wild Hair & Headband */}
            <path d="M 28 36 Q 16 16 38 24 Q 48 4 60 20 Q 78 12 72 36 Z" fill="#ef4444" />
            <ellipse cx="50" cy="34" rx="24" ry="7" fill="#ea580c" stroke="#facc15" strokeWidth="1.5" />

            {/* Sturdy Face & Magma Goggles on Forehead */}
            <circle cx="50" cy="45" r="16" fill="#fbcfe8" />
            <circle cx="42" cy="32" r="5" fill="#1c1917" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="42" cy="32" r="3" fill="#38bdf8" />
            <circle cx="58" cy="32" r="5" fill="#1c1917" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="58" cy="32" r="3" fill="#38bdf8" />
            <line x1="47" y1="32" x2="53" y2="32" stroke="#f59e0b" strokeWidth="2" />

            {/* Resolute Eyes & Beard */}
            <ellipse cx="44" cy="44" rx="2.5" ry="2.5" fill="#1c1917" />
            <ellipse cx="56" cy="44" rx="2.5" ry="2.5" fill="#1c1917" />
            <path d="M 40 52 Q 50 58 60 52" stroke="#991b1b" strokeWidth="3" fill="none" strokeLinecap="round" />

            {/* Blazing Runic Smithing Hammer */}
            <line x1="16" y1="92" x2="16" y2="40" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />
            <rect x="6" y="34" width="20" height="14" rx="2" fill="#292524" stroke="#f97316" strokeWidth="2" />
            <line x1="8" y1="41" x2="24" y2="41" stroke="#fde047" strokeWidth="2" />
          </>
        ) : type === 'sailor' ? (
          // 5. Mo Li (瀚海钓翁 莫离 - 避世隐士 / Elder Sea Angler)
          <>
            {/* Azure Nautical Robes */}
            <path d="M 22 52 Q 14 88 20 95 Q 50 98 80 95 Q 86 88 78 52 Z" fill="#0284c7" />
            <path d="M 32 54 L 22 94 L 32 95 L 40 60 Z" fill="#0369a1" />
            <path d="M 68 54 L 78 94 L 68 95 L 60 60 Z" fill="#0369a1" />

            {/* Woven Conical Bamboo Hat (斗笠) with Jade Bead */}
            <polygon points="50,14 12,38 88,38" fill="#ca8a04" stroke="#a16207" strokeWidth="2" />
            <line x1="50" y1="14" x2="50" y2="38" stroke="#a16207" strokeWidth="1" />
            <circle cx="50" cy="14" r="3" fill="#10b981" />

            {/* Weathered Friendly Sage Face */}
            <circle cx="50" cy="46" r="15" fill="#fed7aa" />
            <ellipse cx="44" cy="44" rx="2" ry="2" fill="#1e293b" />
            <ellipse cx="56" cy="44" rx="2" ry="2" fill="#1e293b" />
            {/* White Wispy Mustache */}
            <path d="M 40 50 Q 45 54 50 51 Q 55 54 60 50" stroke="#f1f5f9" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Bamboo Fishing Rod hooked to a Golden Koi */}
            <line x1="82" y1="94" x2="88" y2="10" stroke="#a16207" strokeWidth="3" strokeLinecap="round" />
            <path d="M 88 10 Q 98 30 92 60" stroke="#e0f2fe" strokeWidth="1" fill="none" />
            {/* Glowing Golden Spirit Koi Fish at End of Line */}
            <ellipse cx="92" cy="62" rx="5" ry="3" fill="#f59e0b" />
            <polygon points="96,62 100,59 100,65" fill="#fbbf24" />
          </>
        ) : type === 'nurse' ? (
          // 6. Fairy Yunxi (医圣仙子 云曦 - 万灵医官 / Celestial Lotus Healer)
          <>
            {/* Floating Celestial Silk Ribbons */}
            <path d="M 12 36 Q 6 60 14 84 Q 24 60 22 42 Z" fill="#f472b6" opacity="0.8" />
            <path d="M 88 36 Q 94 60 86 84 Q 76 60 78 42 Z" fill="#f472b6" opacity="0.8" />

            {/* White & Pink Lotus Fairy Robes */}
            <path d="M 26 50 Q 18 86 24 94 Q 50 97 76 94 Q 82 86 74 50 Z" fill="#fff1f2" stroke="#f43f5e" strokeWidth="1.5" />
            <path d="M 36 52 L 28 92 L 36 93 L 42 58 Z" fill="#f43f5e" />
            <path d="M 64 52 L 72 92 L 64 93 L 58 58 Z" fill="#f43f5e" />

            {/* Beautiful Fairy Hair with Emerald Lotus Hairpin */}
            <circle cx="50" cy="40" r="16" fill="#ffe4e6" />
            {/* Twin Buns */}
            <circle cx="34" cy="30" r="9" fill="#1e1b4b" />
            <circle cx="66" cy="30" r="9" fill="#1e1b4b" />
            <path d="M 34 34 Q 50 26 66 34 Q 50 22 34 34 Z" fill="#1e1b4b" />
            <circle cx="34" cy="30" r="3" fill="#34d399" />
            <circle cx="66" cy="30" r="3" fill="#34d399" />

            {/* Bright Gentle Eyes & Cheerful Smile */}
            <ellipse cx="44" cy="41" rx="2.5" ry="3.5" fill="#1e1b4b" />
            <circle cx="45.5" cy="39.5" r="1.2" fill="#ffffff" />
            <ellipse cx="56" cy="41" rx="2.5" ry="3.5" fill="#1e1b4b" />
            <circle cx="57.5" cy="39.5" r="1.2" fill="#ffffff" />
            <ellipse cx="38" cy="46" rx="2.5" ry="1.5" fill="#fb7185" opacity="0.6" />
            <ellipse cx="62" cy="46" rx="2.5" ry="1.5" fill="#fb7185" opacity="0.6" />
            <path d="M 47 46 Q 50 49 53 46" stroke="#e11d48" strokeWidth="1.5" fill="none" strokeLinecap="round" />

            {/* Floating Jade Healing Gourd */}
            <circle cx="78" cy="58" r="5" fill="#10b981" />
            <circle cx="78" cy="66" r="7" fill="#059669" />
            <rect x="76" y="51" width="4" height="4" fill="#ca8a04" />
          </>
        ) : type === 'merchant' ? (
          // 7. Merchant Ge Qian (阁主 葛乾 - 万象商盟掌柜 / Opulent Bazaar Lord)
          <>
            {/* Opulent Royal Purple & Gold Robes */}
            <path d="M 22 48 Q 12 86 20 94 Q 50 97 80 94 Q 88 86 78 48 Z" fill="#4a044e" stroke="#d97706" strokeWidth="2" />
            <path d="M 34 50 L 24 92 L 32 94 L 40 56 Z" fill="#ca8a04" />
            <path d="M 66 50 L 76 92 L 68 94 L 60 56 Z" fill="#ca8a04" />
            <polygon points="50,54 60,94 40,94" fill="#a21caf" />

            {/* Merchant Gold Ingot Crown (金元宝冠) */}
            <path d="M 32 30 Q 50 16 68 30 L 64 36 Q 50 28 36 36 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
            <polygon points="50,18 42,26 58,26" fill="#fde047" />
            <circle cx="50" cy="22" r="2.5" fill="#dc2626" />

            {/* Chubby Joyful Merchant Face & Mustache */}
            <circle cx="50" cy="44" r="17" fill="#fed7aa" />
            <ellipse cx="44" cy="42" rx="2.5" ry="3" fill="#1e1b4b" />
            <circle cx="45" cy="41" r="1" fill="#ffffff" />
            <ellipse cx="56" cy="42" rx="2.5" ry="3" fill="#1e1b4b" />
            <circle cx="57" cy="41" r="1" fill="#ffffff" />
            {/* Aristocratic Merchant Mustache */}
            <path d="M 38 49 Q 45 53 50 49 Q 55 53 62 49" stroke="#78350f" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 46 54 Q 50 57 54 54" stroke="#991b1b" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Golden Abacus (算盘) in Hand */}
            <rect x="76" y="56" width="16" height="22" rx="2" fill="#78350f" stroke="#f59e0b" strokeWidth="1.5" />
            <line x1="76" y1="63" x2="92" y2="63" stroke="#f59e0b" strokeWidth="1" />
            <circle cx="80" cy="60" r="1.5" fill="#fde047" />
            <circle cx="84" cy="60" r="1.5" fill="#fde047" />
            <circle cx="88" cy="60" r="1.5" fill="#fde047" />
            <circle cx="80" cy="67" r="1.5" fill="#fde047" />
            <circle cx="84" cy="67" r="1.5" fill="#fde047" />
            <circle cx="88" cy="67" r="1.5" fill="#fde047" />
          </>
        ) : (
          // 8. Lu Tianheng (天罡战皇 陆天衡 - 圣境天武战神 / Celestial Thunder Sovereign Knight)
          <>
            {/* Crackling Thunder Aura Rings */}
            <circle cx="50" cy="46" r="44" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="8 6" opacity="0.6" className="animate-pulse" />

            {/* Majestic Obsidian & Gold Heavy War Armor */}
            <path d="M 22 50 Q 12 86 18 95 Q 50 98 82 95 Q 88 86 78 50 Z" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
            {/* Golden Imperial Chest Crest */}
            <polygon points="50,56 64,68 50,86 36,68" fill="#ca8a04" stroke="#fef08a" strokeWidth="1" />
            <circle cx="50" cy="70" r="4" fill="#a855f7" />

            {/* Flowing Crimson Royal War Cape */}
            <path d="M 16 54 Q 6 80 12 96 L 24 94 Q 22 75 22 56 Z" fill="#dc2626" />
            <path d="M 84 54 Q 94 80 88 96 L 76 94 Q 78 75 78 56 Z" fill="#dc2626" />

            {/* Majestic Dragon-Horned War Helmet */}
            <path d="M 26 38 Q 50 12 74 38 L 72 52 Q 50 60 28 52 Z" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
            {/* Golden Dragon Horns on Helmet */}
            <polygon points="26,36 12,18 28,26" fill="#f59e0b" stroke="#ca8a04" strokeWidth="1" />
            <polygon points="74,36 88,18 72,26" fill="#f59e0b" stroke="#ca8a04" strokeWidth="1" />
            {/* Crimson Helmet Plume */}
            <path d="M 48 18 Q 50 -4 60 8 Q 54 18 48 18 Z" fill="#ef4444" />

            {/* Glowing Violet Runic Visor Slit */}
            <rect x="34" y="40" width="32" height="5" rx="2.5" fill="#020617" />
            <circle cx="43" cy="42.5" r="2" fill="#c084fc" />
            <circle cx="57" cy="42.5" r="2" fill="#c084fc" />

            {/* Heavy Thunder Greatsword on Shoulder */}
            <line x1="84" y1="96" x2="88" y2="16" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
            <line x1="88" y1="16" x2="88" y2="30" stroke="#f59e0b" strokeWidth="4" />
            <polygon points="88,12 84,20 92,20" fill="#a855f7" />
          </>
        )}
      </svg>
    </div>
  );
};
