import React from 'react';
import { CharacterOutfit } from '../types/game';
import { DEFAULT_CHARACTER_OUTFIT } from '../data/outfits';
import { PlayerAvatar } from './PlayerAvatar';

interface WizardPortraitProps {
  mode?: 'avatar' | 'full' | 'bust';
  size?: number;
  className?: string;
  outfit?: CharacterOutfit;
}

/**
 * 洛克小魔法师 · 西幻手绘级角色立绘 (Young Wizard Apprentice Character Portrait)
 * 支持 6 大部位动态换装立绘展示 (Hat, Hair, Robe, Handheld, Wings, Aura)
 */
export const CultivatorPortrait: React.FC<WizardPortraitProps> = ({
  mode = 'full',
  size,
  className = '',
  outfit = DEFAULT_CHARACTER_OUTFIT,
}) => {
  const currentOutfit = outfit || DEFAULT_CHARACTER_OUTFIT;
  const {
    hatId = 'hat_classic_wizard',
    hairId = 'hair_golden_fluffy',
    robeId = 'robe_academy_blue',
    handheldId = 'wand_star_crystal',
    wingsId = 'wings_none',
    auraId = 'aura_starlight',
  } = currentOutfit;

  if (mode === 'avatar') {
    const avatarSize = size || 44;
    return (
      <div
        style={{ width: `${avatarSize}px`, height: `${avatarSize}px` }}
        className={`relative inline-flex items-center justify-center rounded-full overflow-hidden select-none bg-[#091124] ${className}`}
      >
        <PlayerAvatar size={avatarSize} outfit={currentOutfit} />
      </div>
    );
  }

  // Hair color configuration
  const getHairColors = () => {
    switch (hairId) {
      case 'hair_deep_navy':
        return { c1: '#93c5fd', c2: '#2563eb', c3: '#1e3a8a', stroke: '#0f172a' };
      case 'hair_sakura_twintails':
        return { c1: '#fbcfe8', c2: '#f472b6', c3: '#db2777', stroke: '#9d174d' };
      case 'hair_silver_frost':
        return { c1: '#ffffff', c2: '#e2e8f0', c3: '#94a3b8', stroke: '#475569' };
      case 'hair_crimson_wild':
        return { c1: '#fca5a5', c2: '#ef4444', c3: '#b91c1c', stroke: '#7f1d1d' };
      case 'hair_golden_fluffy':
      default:
        return { c1: '#fef08a', c2: '#facc15', c3: '#d97706', stroke: '#b45309' };
    }
  };
  const hair = getHairColors();

  // Full Body High-Definition Wizard Portrait
  return (
    <div className={`relative w-full flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 280 380"
        className="w-full h-auto max-h-[380px] drop-shadow-[0_12px_36px_rgba(37,99,235,0.45)] overflow-visible"
      >
        <defs>
          {/* Dynamic Full Hair Gradient */}
          <linearGradient id="wizFullDynHair" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={hair.c1} />
            <stop offset="50%" stopColor={hair.c2} />
            <stop offset="100%" stopColor={hair.c3} />
          </linearGradient>

          {/* Starlight Aura */}
          <radialGradient id="wizFullAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#818cf8" stopOpacity="0.4" />
            <stop offset="85%" stopColor="#1e1b4b" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>

          {/* Flame Full Aura */}
          <radialGradient id="wizFullAuraFlame" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fde047" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#ef4444" stopOpacity="0.5" />
            <stop offset="85%" stopColor="#7f1d1d" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>

          {/* Golden Full Aura */}
          <radialGradient id="wizFullAuraGolden" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#facc15" stopOpacity="0.6" />
            <stop offset="85%" stopColor="#b45309" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>

          {/* Robe Gradients */}
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

          <linearGradient id="wizFullSilverPlate" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          <linearGradient id="wizFullFlameCape" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>

          <linearGradient id="wizFullGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="50%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* 1. Background Magic Astrolabe & Runic Halo (Aura Slot) */}
        {auraId === 'aura_blazing_fire' ? (
          <g>
            <circle cx="140" cy="180" r="115" fill="url(#wizFullAuraFlame)" />
            <circle cx="140" cy="180" r="105" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="10 5" opacity="0.8" />
            <circle cx="140" cy="180" r="85" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.7" />
          </g>
        ) : auraId === 'aura_golden_glory' ? (
          <g>
            <circle cx="140" cy="180" r="115" fill="url(#wizFullAuraGolden)" />
            <circle cx="140" cy="180" r="108" fill="none" stroke="#facc15" strokeWidth="2" strokeDasharray="14 4" opacity="0.9" />
            <circle cx="140" cy="180" r="88" fill="none" stroke="#eab308" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.8" />
          </g>
        ) : (
          <g>
            <circle cx="140" cy="180" r="115" fill="url(#wizFullAura)" />
            <circle cx="140" cy="180" r="105" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="12 6" opacity="0.6" />
            <circle cx="140" cy="180" r="85" fill="none" stroke="#facc15" strokeWidth="1" strokeDasharray="6 4" opacity="0.7" />
            <polygon points="140,80 160,150 230,140 180,185 210,250 140,215 70,250 100,185 50,140 120,150" fill="none" stroke="#818cf8" strokeWidth="0.8" opacity="0.4" />
          </g>
        )}

        {/* 2. Wings / Back Apparel (Wings Slot) */}
        {wingsId === 'wings_seraph_light' && (
          <g filter="drop-shadow(0 0 10px rgba(254,240,138,0.8))">
            {/* Left Big Feather Wing */}
            <path
              d="M 90 190 C 20 120 10 50 40 30 C 65 20 85 70 85 110 C 60 80 70 140 100 170 Z"
              fill="#ffffff"
              stroke="#facc15"
              strokeWidth="2.5"
            />
            {/* Right Big Feather Wing */}
            <path
              d="M 190 190 C 260 120 270 50 240 30 C 215 20 195 70 195 110 C 220 80 210 140 180 170 Z"
              fill="#ffffff"
              stroke="#facc15"
              strokeWidth="2.5"
            />
          </g>
        )}

        {wingsId === 'wings_shadow_demon' && (
          <g filter="drop-shadow(0 0 10px rgba(168,85,247,0.7))">
            <path d="M 90 180 C 30 130 15 70 45 50 C 60 70 65 110 50 140 C 70 125 75 155 95 170 Z" fill="#3b0764" stroke="#c084fc" strokeWidth="2.5" />
            <path d="M 190 180 C 250 130 265 70 235 50 C 220 70 215 110 230 140 C 210 125 205 155 185 170 Z" fill="#3b0764" stroke="#c084fc" strokeWidth="2.5" />
          </g>
        )}

        {wingsId === 'wings_astral_rings' && (
          <g>
            <ellipse cx="140" cy="180" r="105" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="16 8" opacity="0.8" transform="rotate(-15 140 180)" />
            <ellipse cx="140" cy="180" r="90" fill="none" stroke="#facc15" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.7" transform="rotate(20 140 180)" />
            <circle cx="55" cy="150" r="4.5" fill="#67e8f9" filter="drop-shadow(0 0 6px #67e8f9)" />
            <circle cx="225" cy="210" r="5" fill="#facc15" filter="drop-shadow(0 0 6px #fde047)" />
          </g>
        )}

        {/* 3. Flowing Wizard Robe / Cape (Robe Slot) */}
        {robeId === 'robe_paladin_armor' ? (
          <g>
            <path d="M 80 180 C 40 230 45 320 65 345 C 95 330 140 335 155 340 C 200 335 240 325 245 280 C 240 220 205 180 185 175 Z" fill="#f8fafc" stroke="#d4af37" strokeWidth="2" />
            <path d="M 75 190 C 50 240 55 310 70 340" stroke="url(#wizFullGold)" strokeWidth="2.5" fill="none" />
            <rect x="108" y="270" width="64" height="60" rx="6" fill="#475569" />
            <path d="M 102 195 L 98 275 L 182 275 L 178 195 Z" fill="url(#wizFullSilverPlate)" stroke="#d4af37" strokeWidth="2" />
            <rect x="136" y="205" width="8" height="35" rx="1.5" fill="#facc15" />
            <rect x="124" y="218" width="32" height="8" rx="1.5" fill="#facc15" />
          </g>
        ) : robeId === 'robe_flame_archmage' ? (
          <g>
            <path d="M 80 180 C 40 230 45 320 65 345 C 95 330 140 335 155 340 C 200 335 240 325 245 280 C 240 220 205 180 185 175 Z" fill="url(#wizFullFlameCape)" stroke="#f59e0b" strokeWidth="2" />
            <path d="M 75 190 C 50 240 55 310 70 340" stroke="url(#wizFullGold)" strokeWidth="2.5" fill="none" />
            <rect x="108" y="270" width="64" height="60" rx="6" fill="#18181b" />
            <path d="M 102 195 L 98 275 L 182 275 L 178 195 Z" fill="url(#wizFullFlameCape)" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="140" cy="235" r="4" fill="#fde047" />
          </g>
        ) : (
          <g>
            {/* Default Royal Academy Robe */}
            <path d="M 80 180 C 40 230 45 320 65 345 C 95 330 140 335 155 340 C 200 335 240 325 245 280 C 240 220 205 180 185 175 Z" fill="url(#wizFullCape)" stroke="#1e3a8a" strokeWidth="2" />
            <path d="M 75 190 C 50 240 55 310 70 340" stroke="url(#wizFullGold)" strokeWidth="2.5" fill="none" />
            <path d="M 205 190 C 230 240 230 300 215 335" stroke="url(#wizFullGold)" strokeWidth="2.5" fill="none" />
            <rect x="108" y="270" width="64" height="60" rx="6" fill="#1e293b" />
            <path d="M 102 195 L 98 275 L 182 275 L 178 195 Z" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5" />
            <polygon points="126,195 140,218 154,195" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <circle cx="140" cy="235" r="3" fill="#fde047" stroke="#b45309" strokeWidth="1" />
            <circle cx="140" cy="255" r="3" fill="#fde047" stroke="#b45309" strokeWidth="1" />
          </g>
        )}

        {/* 4. Wizard Boots */}
        <ellipse cx="118" cy="348" rx="14" ry="7" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
        <ellipse cx="162" cy="348" rx="14" ry="7" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
        <rect x="110" y="325" width="16" height="20" rx="3" fill="#92400e" stroke="#451a03" strokeWidth="1.2" />
        <rect x="154" y="325" width="16" height="20" rx="3" fill="#92400e" stroke="#451a03" strokeWidth="1.2" />

        {/* 5. Leather Belt with Mini Gulu Ball & Potion Vial */}
        <rect x="94" y="270" width="92" height="12" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
        <rect x="132" y="267" width="16" height="18" rx="2" fill="url(#wizFullGold)" stroke="#78350f" strokeWidth="1.5" />
        <g transform="translate(100, 280) scale(0.45)">
          <circle cx="24" cy="24" r="18" fill="#ef4444" stroke="#7f1d1d" strokeWidth="2" />
          <path d="M 6 24 A 18 18 0 0 0 42 24 Z" fill="#ffffff" />
          <circle cx="24" cy="24" r="6" fill="#0f172a" stroke="#d4af37" strokeWidth="2" />
        </g>
        <g transform="translate(162, 280) scale(0.42)">
          <path d="M 10 30 C 10 20 20 18 20 10 L 28 10 C 28 18 38 20 38 30 C 38 40 28 44 24 44 C 20 44 10 40 10 30 Z" fill="#06b6d4" stroke="#083344" strokeWidth="2" />
          <rect x="22" y="6" width="4" height="5" fill="#92400e" />
        </g>

        {/* 6. Handheld Weapon (Handheld Slot) */}
        <g>
          {handheldId === 'wand_oath_blade' ? (
            <g>
              <line x1="190" y1="260" x2="225" y2="70" stroke="#facc15" strokeWidth="6" strokeLinecap="round" />
              <polygon points="225,70 232,55 218,55" fill="#ffffff" stroke="#ca8a04" strokeWidth="1.5" />
              <line x1="175" y1="210" x2="205" y2="195" stroke="#ca8a04" strokeWidth="5" strokeLinecap="round" />
              <circle cx="195" cy="235" r="9" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
            </g>
          ) : handheldId === 'wand_aurora_staff' ? (
            <g>
              <line x1="190" y1="260" x2="225" y2="70" stroke="#0284c7" strokeWidth="5.5" strokeLinecap="round" />
              <polygon points="225,70 235,55 225,40 215,55" fill="#a5f3fc" stroke="#0891b2" strokeWidth="2" filter="drop-shadow(0 0 10px #67e8f9)" />
              <circle cx="195" cy="235" r="9" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
            </g>
          ) : handheldId === 'wand_phoenix_fan' ? (
            <g transform="translate(195, 235)">
              <path d="M 0 0 L 25 -90 Q 50 -105 70 -85 Z" fill="#ea580c" stroke="#facc15" strokeWidth="2" filter="drop-shadow(0 0 8px #f59e0b)" />
              <circle cx="0" cy="0" r="9" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
            </g>
          ) : (
            <g>
              {/* Default Magic Star Staff */}
              <line x1="190" y1="260" x2="225" y2="85" stroke="#78350f" strokeWidth="5.5" strokeLinecap="round" />
              <line x1="190" y1="260" x2="225" y2="85" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />
              <g transform="translate(225, 85)">
                <polygon points="0,-16 5,-4 16,0 5,4 0,16 -5,4 -16,0 -5,-4" fill="#67e8f9" stroke="#0284c7" strokeWidth="1.5" filter="drop-shadow(0 0 8px #38bdf8)" />
                <circle cx="0" cy="0" r="5" fill="#ffffff" />
                <circle cx="-12" cy="-14" r="2.5" fill="#fde047" className="animate-ping" />
                <circle cx="16" cy="12" r="2" fill="#38bdf8" />
              </g>
              <circle cx="195" cy="235" r="9" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
            </g>
          )}
        </g>

        {/* 7. Cute Chibi Face */}
        <ellipse cx="140" cy="165" rx="44" ry="38" fill="#fff7ed" stroke="#fed7aa" strokeWidth="2" />
        <circle cx="110" cy="175" r="7" fill="#f43f5e" opacity="0.3" />
        <circle cx="170" cy="175" r="7" fill="#f43f5e" opacity="0.3" />

        {/* Sparkling Anime Eyes */}
        <g>
          <ellipse cx="118" cy="162" rx="9" ry="13" fill="#1e3a8a" />
          <ellipse cx="118" cy="159" rx="7" ry="10" fill="#0284c7" />
          <circle cx="116" cy="156" r="3.8" fill="#ffffff" />
          <circle cx="121" cy="164" r="1.8" fill="#ffffff" />

          <ellipse cx="162" cy="162" rx="9" ry="13" fill="#1e3a8a" />
          <ellipse cx="162" cy="159" rx="7" ry="10" fill="#0284c7" />
          <circle cx="160" cy="156" r="3.8" fill="#ffffff" />
          <circle cx="165" cy="164" r="1.8" fill="#ffffff" />

          <path d="M 132 180 Q 140 188 148 180" stroke="#ea580c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>

        {/* 8. Hair Bangs (Hair Slot) */}
        {hairId === 'hair_sakura_twintails' && (
          <g>
            <circle cx="85" cy="160" r="15" fill="url(#wizFullDynHair)" stroke={hair.stroke} strokeWidth="2" />
            <circle cx="195" cy="160" r="15" fill="url(#wizFullDynHair)" stroke={hair.stroke} strokeWidth="2" />
          </g>
        )}
        <path d="M 95 145 C 110 170 125 150 140 172 C 155 150 170 170 185 145 C 180 120 150 115 140 115 C 130 115 100 120 95 145 Z" fill="url(#wizFullDynHair)" stroke={hair.stroke} strokeWidth="2" />

        {/* 9. Hat / Headwear (Hat Slot) */}
        {hatId === 'hat_knight_helm' ? (
          <g>
            <path d="M 85 136 C 85 80 110 40 155 40 C 190 60 195 95 195 136 Z" fill="url(#wizFullSilverPlate)" stroke="#d4af37" strokeWidth="3" />
            <rect x="105" y="105" width="70" height="10" rx="4" fill="#0f172a" />
            <path d="M 140 40 C 125 15 155 15 140 40" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
            <circle cx="140" cy="65" r="7" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
          </g>
        ) : hatId === 'hat_flame_crown' ? (
          <g>
            <path d="M 95 135 L 105 95 L 125 115 L 140 80 L 155 115 L 175 95 L 185 135 Z" fill="#ef4444" stroke="#facc15" strokeWidth="2.5" filter="drop-shadow(0 0 10px #f59e0b)" />
            <circle cx="140" cy="110" r="5" fill="#fef08a" />
            <ellipse cx="140" cy="135" rx="48" ry="10" fill="#b91c1c" stroke="#facc15" strokeWidth="2" />
          </g>
        ) : hatId === 'hat_academy_beret' ? (
          <g>
            <ellipse cx="135" cy="120" rx="55" ry="20" fill="#0284c7" stroke="#facc15" strokeWidth="2.5" transform="rotate(-6 135 120)" />
            <circle cx="135" cy="106" r="6" fill="#facc15" />
            <path d="M 175 115 C 190 95 195 80 190 70 C 180 80 175 100 175 115" fill="#f8fafc" stroke="#38bdf8" strokeWidth="1.5" />
          </g>
        ) : hatId === 'hat_bunny_hood' ? (
          <g>
            <ellipse cx="140" cy="125" rx="50" ry="20" fill="#fdf2f8" stroke="#f472b6" strokeWidth="2.5" />
            <path d="M 115 120 C 95 85 100 45 120 55 C 130 65 130 95 125 120 Z" fill="#ffffff" stroke="#f472b6" strokeWidth="2.5" />
            <path d="M 115 110 C 105 85 108 55 118 65 C 122 75 122 95 119 110 Z" fill="#fbcfe8" />
            <path d="M 165 120 C 160 90 170 45 190 55 C 195 70 185 95 175 120 Z" fill="#ffffff" stroke="#f472b6" strokeWidth="2.5" />
            <path d="M 170 110 C 167 90 175 55 185 65 C 188 75 182 95 174 110 Z" fill="#fbcfe8" />
          </g>
        ) : (
          <g>
            {/* Default Iconic Pointy Wizard Hat */}
            <ellipse cx="140" cy="135" rx="64" ry="20" fill="url(#wizFullHatGrad)" stroke="#1e3a8a" strokeWidth="2.5" />
            <ellipse cx="140" cy="135" rx="58" ry="16" fill="none" stroke="url(#wizFullGold)" strokeWidth="2" />
            <path
              d="M 90 132 C 95 95 125 45 175 22 C 160 38 145 60 185 75 C 210 85 205 110 200 132 Z"
              fill="url(#wizFullHatGrad)"
              stroke="#1e3a8a"
              strokeWidth="2.5"
            />
            <path d="M 92 132 Q 140 142 198 132" stroke="url(#wizFullGold)" strokeWidth="6" fill="none" />
            <polygon
              points="140,110 145,122 158,124 148,133 151,146 140,138 129,146 132,133 122,124 135,122"
              fill="url(#wizFullGold)"
              stroke="#78350f"
              strokeWidth="1.5"
              filter="drop-shadow(0 0 6px #fde047)"
            />
            <circle cx="140" cy="128" r="3.5" fill="#38bdf8" />
          </g>
        )}
      </svg>
    </div>
  );
};
