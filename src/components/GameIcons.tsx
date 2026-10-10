import React from 'react';

interface IconProps {
  size?: number | string;
  className?: string;
}

/**
 * 洛克王国经典 咕噜球 (Gulu Magic Capture Sphere)
 */
export const IconGuluBall: React.FC<IconProps> = ({ size = 28, className = '' }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={`inline-block filter drop-shadow-[0_2px_6px_rgba(239,68,68,0.45)] ${className}`}
  >
    <defs>
      <radialGradient id="gbTopGrad" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#fca5a5" />
        <stop offset="35%" stopColor="#ef4444" />
        <stop offset="75%" stopColor="#b91c1c" />
        <stop offset="100%" stopColor="#7f1d1d" />
      </radialGradient>
      <radialGradient id="gbBotGrad" cx="35%" cy="70%" r="65%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#e2e8f0" />
        <stop offset="85%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#475569" />
      </radialGradient>
      <linearGradient id="gbBand" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1e293b" />
        <stop offset="50%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
      <radialGradient id="gbButtonGlow" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="45%" stopColor="#38bdf8" />
        <stop offset="90%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#0369a1" />
      </radialGradient>
    </defs>
    {/* Outer Shadow Ring */}
    <circle cx="24" cy="24" r="22" fill="#0b1324" />
    {/* Top Red Hemisphere */}
    <path d="M 4 24 A 20 20 0 0 1 44 24 Z" fill="url(#gbTopGrad)" />
    {/* Top Specular Glint */}
    <ellipse cx="16" cy="12" rx="7" ry="3.5" fill="#ffffff" opacity="0.55" transform="rotate(-25 16 12)" />
    {/* Bottom White Hemisphere */}
    <path d="M 4 24 A 20 20 0 0 0 44 24 Z" fill="url(#gbBotGrad)" />
    {/* Central Black Equator Belt */}
    <rect x="3.5" y="22" width="41" height="4" fill="url(#gbBand)" rx="1" />
    <line x1="4" y1="22" x2="44" y2="22" stroke="#facc15" strokeWidth="0.8" opacity="0.6" />
    <line x1="4" y1="26" x2="44" y2="26" stroke="#facc15" strokeWidth="0.8" opacity="0.6" />
    {/* Center Button Housing */}
    <circle cx="24" cy="24" r="7.5" fill="#0f172a" stroke="#d4af37" strokeWidth="1.5" />
    {/* Center Glowing Magic Gem / Release Button */}
    <circle cx="24" cy="24" r="4.5" fill="url(#gbButtonGlow)" />
    <circle cx="22.5" cy="22.5" r="1.5" fill="#ffffff" opacity="0.85" />
  </svg>
);

/**
 * 洛克王国 洛克贝金币 (Roco Coin - Embossed Crown Gold Coin)
 */
export const IconRocoCoin: React.FC<IconProps> = ({ size = 26, className = '' }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={`inline-block filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.55)] ${className}`}
  >
    <defs>
      <radialGradient id="rcCoinGrad" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="35%" stopColor="#facc15" />
        <stop offset="75%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#b45309" />
      </radialGradient>
      <linearGradient id="rcRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef9c3" />
        <stop offset="50%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
    </defs>
    {/* Outer Rim */}
    <circle cx="24" cy="24" r="22" fill="url(#rcRimGrad)" />
    <circle cx="24" cy="24" r="20" fill="url(#rcCoinGrad)" stroke="#78350f" strokeWidth="1" />
    {/* Inner Inscribed Beaded Ring */}
    <circle cx="24" cy="24" r="16.5" fill="none" stroke="#ca8a04" strokeWidth="1" strokeDasharray="2 1.5" />
    {/* Royal Crown Embossment */}
    <path
      d="M 14 27 L 16 19 L 20 23 L 24 16 L 28 23 L 32 19 L 34 27 Z"
      fill="#fffbeb"
      stroke="#78350f"
      strokeWidth="1.2"
      filter="drop-shadow(0 1px 1px rgba(0,0,0,0.4))"
    />
    <rect x="14" y="27" width="20" height="3" rx="1.5" fill="#fde047" stroke="#78350f" strokeWidth="1" />
    {/* Crown Jewels */}
    <circle cx="16" cy="19" r="1.2" fill="#ef4444" />
    <circle cx="24" cy="16" r="1.5" fill="#38bdf8" />
    <circle cx="32" cy="19" r="1.2" fill="#10b981" />
    {/* Coin Specular Highlight */}
    <path d="M 10 16 A 18 18 0 0 1 20 7" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
  </svg>
);

/**
 * 魔法行囊 / 背包 (Magic Adventurer Backpack)
 */
export const IconMagicBag: React.FC<IconProps> = ({ size = 26, className = '' }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={`inline-block filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] ${className}`}
  >
    <defs>
      <linearGradient id="mbLeather" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#b45309" />
        <stop offset="50%" stopColor="#92400e" />
        <stop offset="100%" stopColor="#713f12" />
      </linearGradient>
      <linearGradient id="mbFlap" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#854d0e" />
      </linearGradient>
      <radialGradient id="mbGem" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#e0e7ff" />
        <stop offset="50%" stopColor="#818cf8" />
        <stop offset="100%" stopColor="#4338ca" />
      </radialGradient>
    </defs>
    {/* Backpack Body */}
    <rect x="8" y="14" width="32" height="28" rx="8" fill="url(#mbLeather)" stroke="#451a03" strokeWidth="1.5" />
    {/* Side Pockets */}
    <rect x="4" y="24" width="6" height="14" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="1" />
    <rect x="38" y="24" width="6" height="14" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="1" />
    {/* Top Leather Flap */}
    <path d="M 8 16 Q 24 28 40 16 L 38 12 Q 24 10 10 12 Z" fill="url(#mbFlap)" stroke="#451a03" strokeWidth="1.2" />
    {/* Gold Straps & Buckles */}
    <rect x="15" y="16" width="3.5" height="24" rx="1.5" fill="#f59e0b" stroke="#78350f" strokeWidth="0.8" />
    <rect x="29.5" y="16" width="3.5" height="24" rx="1.5" fill="#f59e0b" stroke="#78350f" strokeWidth="0.8" />
    <rect x="14" y="26" width="5.5" height="4.5" rx="1" fill="#fef08a" stroke="#78350f" strokeWidth="1" />
    <rect x="28.5" y="26" width="5.5" height="4.5" rx="1" fill="#fef08a" stroke="#78350f" strokeWidth="1" />
    {/* Center Magic Star Clasp */}
    <circle cx="24" cy="20" r="5" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
    <polygon points="24,16 25.5,19 28.5,19.5 26,21.5 27,24.5 24,23 21,24.5 22,21.5 19.5,19.5 22.5,19" fill="url(#mbGem)" />
    {/* Top Handle Loop */}
    <path d="M 18 12 Q 24 5 30 12" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

/**
 * 魔法图鉴书 / 秘典 (Kingdom Spellbook / Pet Codex)
 */
export const IconSpellbook: React.FC<IconProps> = ({ size = 26, className = '' }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={`inline-block filter drop-shadow-[0_2px_6px_rgba(30,58,138,0.5)] ${className}`}
  >
    <defs>
      <linearGradient id="sbCover" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e3a8a" />
        <stop offset="50%" stopColor="#172554" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
      <linearGradient id="sbGold" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fde047" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
      <radialGradient id="sbGem" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#67e8f9" />
        <stop offset="50%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#0e7490" />
      </radialGradient>
    </defs>
    {/* Book Pages Thickness */}
    <path d="M 8 40 L 40 40 L 42 36 L 10 36 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
    <line x1="12" y1="38" x2="40" y2="38" stroke="#ca8a04" strokeWidth="0.8" opacity="0.6" />
    {/* Book Front Cover */}
    <rect x="7" y="8" width="34" height="29" rx="3" fill="url(#sbCover)" stroke="#09142e" strokeWidth="1.5" />
    {/* Book Spine (Left) */}
    <rect x="7" y="8" width="5.5" height="29" rx="2" fill="url(#sbGold)" stroke="#78350f" strokeWidth="1" />
    {/* Ornate Gold Corner Brackets */}
    <path d="M 32 8 L 41 8 L 41 17 Z" fill="url(#sbGold)" stroke="#78350f" strokeWidth="0.8" />
    <path d="M 32 37 L 41 37 L 41 28 Z" fill="url(#sbGold)" stroke="#78350f" strokeWidth="0.8" />
    {/* Front Emblem: Magic Hexagram & Glowing Crystal */}
    <circle cx="26" cy="22" r="9" fill="#0f172a" stroke="url(#sbGold)" strokeWidth="1.5" />
    <polygon points="26,14 28.5,19 34,20 30,24 31.5,29.5 26,26.5 20.5,29.5 22,24 18,20 23.5,19" fill="url(#sbGem)" stroke="#083344" strokeWidth="0.8" />
    <circle cx="26" cy="22" r="3" fill="#ffffff" opacity="0.8" />
    {/* Silk Bookmark Ribbon Hanging at Bottom */}
    <path d="M 28 37 L 28 45 L 31 43 L 34 45 L 34 37 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="0.8" />
  </svg>
);

/**
 * 魔法集市 / 商城 (Magic Shop / Tent & Treasure)
 */
export const IconMagicShop: React.FC<IconProps> = ({ size = 26, className = '' }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={`inline-block filter drop-shadow-[0_2px_6px_rgba(217,119,6,0.5)] ${className}`}
  >
    <defs>
      <linearGradient id="shStripeRed" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f87171" />
        <stop offset="100%" stopColor="#dc2626" />
      </linearGradient>
      <linearGradient id="shStripeGold" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="100%" stopColor="#eab308" />
      </linearGradient>
    </defs>
    {/* Shop Canopy Roof Awning (Striped) */}
    <path d="M 5 20 Q 24 10 43 20 L 40 12 Q 24 5 8 12 Z" fill="#991b1b" />
    {/* Awning Scallops */}
    <g>
      <path d="M 5 20 Q 8.5 25 12 20 Q 15.5 25 19 20 Q 22.5 25 26 20 Q 29.5 25 33 20 Q 36.5 25 40 20 Q 43 23 44 20 L 41 12 Q 24 6 7 12 Z" fill="url(#shStripeRed)" stroke="#7f1d1d" strokeWidth="1" />
      {/* Yellow stripes */}
      <path d="M 12 11 L 12 20 Q 15.5 25 19 20 L 19 10.5 Z" fill="url(#shStripeGold)" />
      <path d="M 26 10 L 26 20 Q 29.5 25 33 20 L 33 11 Z" fill="url(#shStripeGold)" />
    </g>
    {/* Shop Counter Table */}
    <rect x="9" y="24" width="30" height="17" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="1.2" />
    <rect x="7" y="22" width="34" height="4.5" rx="1.5" fill="#d97706" stroke="#78350f" strokeWidth="1" />
    {/* Counter Display: Potions & Gems */}
    <circle cx="15" cy="30" r="3" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
    <rect x="22" y="28" width="5" height="5" rx="1" fill="#ec4899" stroke="#9d174d" strokeWidth="1" transform="rotate(45 24.5 30.5)" />
    <circle cx="33" cy="30" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
    {/* Shop Sign Banner */}
    <circle cx="24" cy="6" r="3" fill="#fde047" stroke="#b45309" strokeWidth="1" />
    <line x1="24" y1="9" x2="24" y2="12" stroke="#b45309" strokeWidth="2" />
  </svg>
);

/**
 * 王国大地图 (World Kingdom Map & Compass)
 */
export const IconKingdomMap: React.FC<IconProps> = ({ size = 26, className = '' }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={`inline-block filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] ${className}`}
  >
    <defs>
      <linearGradient id="mpPaper" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef3c7" />
        <stop offset="50%" stopColor="#fde68a" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
    {/* Parchment Map Sheet (3 Folded Planes) */}
    <polygon points="6,12 17,8 17,38 6,42" fill="#fde68a" stroke="#b45309" strokeWidth="1.2" />
    <polygon points="17,8 31,12 31,42 17,38" fill="url(#mpPaper)" stroke="#b45309" strokeWidth="1.2" />
    <polygon points="31,12 42,8 42,38 31,42" fill="#fde68a" stroke="#b45309" strokeWidth="1.2" />
    {/* Map Terrain Markings: River, Mountain, Red X */}
    <path d="M 10 24 Q 14 20 17 25 T 26 22 T 38 26" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    <polygon points="12,18 15,14 18,18" fill="#15803d" />
    <polygon points="34,22 37,17 40,22" fill="#b91c1c" />
    {/* Treasure X Mark */}
    <path d="M 22 28 L 26 32 M 26 28 L 22 32" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
    {/* Compass Rose Star in Corner */}
    <polygon points="36,29 38,33 42,33 39,36 40,40 36,37 32,40 33,36 30,33 34,33" fill="#d97706" stroke="#78350f" strokeWidth="0.8" />
  </svg>
);

/**
 * 皇家宠物仓库 / 珍兽居 (Pet Sanctuary / Castle Tower)
 */
export const IconPetSanctuary: React.FC<IconProps> = ({ size = 26, className = '' }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={`inline-block filter drop-shadow-[0_2px_6px_rgba(16,185,129,0.5)] ${className}`}
  >
    <defs>
      <linearGradient id="psTower" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="50%" stopColor="#059669" />
        <stop offset="100%" stopColor="#064e3b" />
      </linearGradient>
    </defs>
    {/* Castle Wall Base */}
    <rect x="8" y="20" width="32" height="22" rx="3" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
    {/* Wall Battlements */}
    <rect x="8" y="16" width="6" height="5" fill="#334155" />
    <rect x="17" y="16" width="6" height="5" fill="#334155" />
    <rect x="25" y="16" width="6" height="5" fill="#334155" />
    <rect x="34" y="16" width="6" height="5" fill="#334155" />
    {/* Castle Conical Roof Tower */}
    <polygon points="24,4 14,17 34,17" fill="url(#psTower)" stroke="#022c22" strokeWidth="1.2" />
    <polygon points="24,2 23,4 25,4" fill="#facc15" />
    {/* Castle Gate (Arched Door) */}
    <path d="M 20 42 L 20 30 A 4 4 0 0 1 28 30 L 28 42 Z" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
    {/* Pet Paw Print on Tower Banner */}
    <circle cx="24" cy="23" r="2.5" fill="#34d399" />
    <circle cx="21" cy="20.5" r="1.2" fill="#34d399" />
    <circle cx="24" cy="19.5" r="1.2" fill="#34d399" />
    <circle cx="27" cy="20.5" r="1.2" fill="#34d399" />
  </svg>
);

/**
 * 皇家竞技场 (Coliseum / Crossed Swords & Winged Shield)
 */
export const IconColiseum: React.FC<IconProps> = ({ size = 26, className = '' }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={`inline-block filter drop-shadow-[0_2px_8px_rgba(239,68,68,0.5)] ${className}`}
  >
    <defs>
      <linearGradient id="coSword" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#64748b" />
      </linearGradient>
      <linearGradient id="coShield" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="50%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#92400e" />
      </linearGradient>
    </defs>
    {/* Left Sword */}
    <path d="M 8 8 L 12 6 L 36 34 L 38 40 L 32 38 L 6 12 Z" fill="url(#coSword)" stroke="#334155" strokeWidth="1" />
    <rect x="32" y="34" width="8" height="3" rx="1.5" fill="#ca8a04" transform="rotate(45 36 35.5)" />
    {/* Right Sword */}
    <path d="M 40 8 L 36 6 L 12 34 L 10 40 L 16 38 L 42 12 Z" fill="url(#coSword)" stroke="#334155" strokeWidth="1" />
    <rect x="8" y="34" width="8" height="3" rx="1.5" fill="#ca8a04" transform="rotate(-45 12 35.5)" />
    {/* Winged Golden Shield Centerpiece */}
    <path
      d="M 24 14 Q 32 14 34 20 Q 34 32 24 37 Q 14 32 14 20 Q 16 14 24 14 Z"
      fill="url(#coShield)"
      stroke="#78350f"
      strokeWidth="1.5"
    />
    <path
      d="M 24 17 Q 30 17 31 22 Q 31 30 24 34 Q 17 30 17 22 Q 18 17 24 17 Z"
      fill="#b91c1c"
      stroke="#fde047"
      strokeWidth="1"
    />
    {/* Golden Lion/Star on Shield */}
    <circle cx="24" cy="25" r="3.5" fill="#facc15" stroke="#78350f" strokeWidth="1" />
    <polygon points="24,22 25,24.5 27.5,25 25.5,26.5 26,29 24,27.5 22,29 22.5,26.5 20.5,25 23,24.5" fill="#ffffff" />
  </svg>
);

/**
 * 魔法药剂 (Health Potion Flask)
 */
export const IconMagicPotion: React.FC<IconProps> = ({ size = 26, className = '' }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={`inline-block filter drop-shadow-[0_2px_6px_rgba(244,63,94,0.5)] ${className}`}
  >
    <defs>
      <radialGradient id="ptFluid" cx="35%" cy="65%" r="65%">
        <stop offset="0%" stopColor="#fda4af" />
        <stop offset="40%" stopColor="#f43f5e" />
        <stop offset="80%" stopColor="#be123c" />
        <stop offset="100%" stopColor="#881337" />
      </radialGradient>
      <linearGradient id="ptGlass" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#0284c7" stopOpacity="0.5" />
      </linearGradient>
    </defs>
    {/* Glass Round Bottle */}
    <path
      d="M 20 14 L 20 8 L 28 8 L 28 14 C 36 18 39 26 37 34 C 34 42 22 45 13 39 C 7 32 9 20 20 14 Z"
      fill="#0f172a"
      opacity="0.6"
    />
    {/* Liquid Fill */}
    <path
      d="M 12 30 C 13 22 20 20 28 22 C 34 23 37 28 36 34 C 33 42 21 44 13 38 C 11 36 11 33 12 30 Z"
      fill="url(#ptFluid)"
    />
    {/* Bubbles in potion */}
    <circle cx="20" cy="30" r="2" fill="#ffffff" opacity="0.7" />
    <circle cx="28" cy="32" r="1.5" fill="#ffffff" opacity="0.6" />
    <circle cx="23" cy="36" r="2.5" fill="#ffffff" opacity="0.5" />
    {/* Glass Body Outline & Specular Highlight */}
    <path
      d="M 20 14 L 20 8 L 28 8 L 28 14 C 36 18 39 26 37 34 C 34 42 22 45 13 39 C 7 32 9 20 20 14 Z"
      fill="none"
      stroke="url(#ptGlass)"
      strokeWidth="2"
    />
    <path d="M 14 26 Q 12 33 16 38" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.6" fill="none" />
    {/* Wooden Cork Stopper */}
    <rect x="21" y="4" width="6" height="5" rx="1.5" fill="#92400e" stroke="#451a03" strokeWidth="1" />
  </svg>
);

/**
 * 魔法信件 (Royal Owl Mailbox Letter)
 */
export const IconMagicMail: React.FC<IconProps> = ({ size = 26, className = '' }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={`inline-block filter drop-shadow-[0_2px_6px_rgba(245,158,11,0.5)] ${className}`}
  >
    <defs>
      <linearGradient id="mlEnv" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fffbeb" />
        <stop offset="50%" stopColor="#fef3c7" />
        <stop offset="100%" stopColor="#fde68a" />
      </linearGradient>
    </defs>
    {/* Flying Little Angel Wings */}
    <path d="M 10 22 C 3 16 2 8 8 7 C 12 6 14 12 14 18 Z" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1" />
    <path d="M 38 22 C 45 16 46 8 40 7 C 36 6 34 12 34 18 Z" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1" />
    {/* Envelope Body */}
    <rect x="8" y="14" width="32" height="22" rx="3" fill="url(#mlEnv)" stroke="#b45309" strokeWidth="1.5" />
    {/* Envelope Flap Creases */}
    <path d="M 8 15 L 24 27 L 40 15" fill="none" stroke="#d97706" strokeWidth="1.5" />
    <path d="M 8 36 L 20 24 M 40 36 L 28 24" stroke="#d97706" strokeWidth="1" opacity="0.6" />
    {/* Red Wax Seal */}
    <circle cx="24" cy="27" r="5" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1" />
    <polygon points="24,24 25,26 27,26.5 25.5,28 26,30 24,29 22,30 22.5,28 21,26.5 23,26" fill="#fde047" />
  </svg>
);
