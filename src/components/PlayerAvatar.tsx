import React from 'react';
import { CharacterOutfit } from '../types/game';
import { DEFAULT_CHARACTER_OUTFIT } from '../data/outfits';

export interface PlayerAvatarProps {
  size?: number;
  isMoving?: boolean;
  direction?: 'left' | 'right';
  className?: string;
  outfit?: CharacterOutfit;
}

/**
 * 洛克小魔法师 (Young Wizard Apprentice - Classic Roco Kingdom Chibi Character)
 * 支持 6 大部位动态装扮系统 (Hat, Hair, Robe, Handheld, Wings, Aura)
 */
export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  size = 56,
  isMoving = false,
  direction = 'right',
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
          {/* Dynamic Hair Gradient */}
          <linearGradient id="dynHairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={hair.c1} />
            <stop offset="50%" stopColor={hair.c2} />
            <stop offset="100%" stopColor={hair.c3} />
          </linearGradient>

          {/* Starlight Aura */}
          <radialGradient id="auraStarlight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#818cf8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
          </radialGradient>

          {/* Blazing Flame Aura */}
          <radialGradient id="auraFlame" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#facc15" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#ef4444" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0" />
          </radialGradient>

          {/* Azure Ripple Aura */}
          <radialGradient id="auraRipple" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#0284c7" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#082f49" stopOpacity="0" />
          </radialGradient>

          {/* Golden Glory Aura */}
          <radialGradient id="auraGolden" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#facc15" stopOpacity="0.6" />
            <stop offset="85%" stopColor="#d97706" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
          </radialGradient>

          {/* Classic Wizard Navy Gradient */}
          <linearGradient id="wizHatNavy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="40%" stopColor="#1d4ed8" />
            <stop offset="85%" stopColor="#172554" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Paladin Silver Plate Gradient */}
          <linearGradient id="paladinSilver" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          {/* Flame Robe Gradient */}
          <linearGradient id="flameRobeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="40%" stopColor="#ef4444" />
            <stop offset="85%" stopColor="#991b1b" />
            <stop offset="100%" stopColor="#450a0a" />
          </linearGradient>

          {/* Ocean Robe Gradient */}
          <linearGradient id="oceanRobeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Star Tuxedo Gradient */}
          <linearGradient id="tuxedoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="45%" stopColor="#312e81" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Gold Ingot Trim */}
          <linearGradient id="goldTrimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
        </defs>

        {/* ========================================================
            1. GROUND MAGIC DISC / AURA (AURA SLOT)
            ======================================================== */}
        {auraId === 'aura_blazing_fire' ? (
          <g>
            <ellipse cx="50" cy="94" rx="30" ry="7" fill="url(#auraFlame)" />
            <ellipse cx="50" cy="94" rx="20" ry="4" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />
            {/* Dancing Flame Sparks */}
            <circle cx="36" cy="92" r="1.5" fill="#facc15" opacity="0.8" />
            <circle cx="64" cy="92" r="1.5" fill="#facc15" opacity="0.8" />
            <polygon points="50,91 48,95 52,95" fill="#ef4444" />
          </g>
        ) : auraId === 'aura_azure_ripples' ? (
          <g>
            <ellipse cx="50" cy="94" rx="28" ry="6" fill="url(#auraRipple)" />
            <ellipse cx="50" cy="94" rx="22" ry="4.5" fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.8" />
            <ellipse cx="50" cy="94" rx="14" ry="2.5" fill="none" stroke="#67e8f9" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
          </g>
        ) : auraId === 'aura_golden_glory' ? (
          <g>
            <ellipse cx="50" cy="94" rx="32" ry="7.5" fill="url(#auraGolden)" />
            <ellipse cx="50" cy="94" rx="24" ry="5" fill="none" stroke="#facc15" strokeWidth="1.5" strokeDasharray="6 3" />
            <polygon points="50,88 52,91 55,91 53,93 54,96 50,94 46,96 47,93 45,91 48,91" fill="#facc15" />
          </g>
        ) : (
          <g>
            {/* Default Starlight Aura */}
            <ellipse cx="50" cy="94" rx="28" ry="6" fill="url(#auraStarlight)" />
            <ellipse cx="50" cy="94" rx="18" ry="3.5" fill="none" stroke="#67e8f9" strokeWidth="1" strokeDasharray="3 2" opacity="0.8" />
          </g>
        )}

        {/* ========================================================
            2. WINGS / BACK APPAREL (WINGS SLOT - Behind Character)
            ======================================================== */}
        {wingsId === 'wings_seraph_light' && (
          <g filter="drop-shadow(0 0 6px rgba(254,240,138,0.7))">
            {/* Left Angel Wing */}
            <path
              d="M 32 60 C 10 40 4 18 16 12 C 24 8 30 24 30 38 C 22 28 26 46 36 54 Z"
              fill="#ffffff"
              stroke="#facc15"
              strokeWidth="1.2"
            />
            {/* Right Angel Wing */}
            <path
              d="M 68 60 C 90 40 96 18 84 12 C 76 8 70 24 70 38 C 78 28 74 46 64 54 Z"
              fill="#ffffff"
              stroke="#facc15"
              strokeWidth="1.2"
            />
          </g>
        )}

        {wingsId === 'wings_steampunk_jet' && (
          <g>
            {/* Brass Gears & Glider Wings */}
            <path d="M 28 58 L 6 36 L 14 30 L 32 50 Z" fill="#b45309" stroke="#78350f" strokeWidth="1.2" />
            <path d="M 72 58 L 94 36 L 86 30 L 68 50 Z" fill="#b45309" stroke="#78350f" strokeWidth="1.2" />
            <circle cx="50" cy="62" r="7" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
            <circle cx="50" cy="62" r="3" fill="#78350f" />
          </g>
        )}

        {wingsId === 'wings_shadow_demon' && (
          <g filter="drop-shadow(0 0 6px rgba(168,85,247,0.6))">
            {/* Left Bat Wing */}
            <path d="M 32 58 C 14 42 10 24 18 18 C 22 26 24 38 18 48 C 26 44 28 52 34 54 Z" fill="#3b0764" stroke="#c084fc" strokeWidth="1.2" />
            {/* Right Bat Wing */}
            <path d="M 68 58 C 86 42 90 24 82 18 C 78 26 76 38 82 48 C 74 44 72 52 66 54 Z" fill="#3b0764" stroke="#c084fc" strokeWidth="1.2" />
          </g>
        )}

        {wingsId === 'wings_astral_rings' && (
          <g>
            <ellipse cx="50" cy="54" rx="36" ry="16" fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="8 4" opacity="0.8" transform="rotate(-15 50 54)" />
            <ellipse cx="50" cy="54" rx="32" ry="12" fill="none" stroke="#facc15" strokeWidth="0.8" opacity="0.6" transform="rotate(20 50 54)" />
            <circle cx="20" cy="46" r="2" fill="#67e8f9" filter="drop-shadow(0 0 3px #67e8f9)" />
            <circle cx="80" cy="62" r="2.5" fill="#facc15" filter="drop-shadow(0 0 3px #fde047)" />
          </g>
        )}

        {/* ========================================================
            3. BACK CAPE & LOWER BODY (ROBE SLOT)
            ======================================================== */}
        {robeId === 'robe_paladin_armor' ? (
          <g>
            {/* White/Gold Paladin Cape */}
            <path d="M 30 52 C 14 65 14 88 22 92 C 34 85 45 86 52 88 Z" fill="#f8fafc" stroke="#d4af37" strokeWidth="1.2" />
            {/* Silver Greaves */}
            <ellipse cx="42" cy="91" rx="5" ry="3" fill="#64748b" stroke="#334155" strokeWidth="1" />
            <ellipse cx="58" cy="91" rx="5" ry="3" fill="#64748b" stroke="#334155" strokeWidth="1" />
            {/* Armor Leggings */}
            <rect x="38" y="76" width="24" height="14" rx="3" fill="#475569" />
            {/* Breastplate */}
            <path d="M 36 56 L 36 78 L 64 78 L 64 56 Z" fill="url(#paladinSilver)" stroke="#d4af37" strokeWidth="1.5" />
            {/* Gold Cross Emblem */}
            <rect x="47" y="60" width="6" height="14" rx="1" fill="#facc15" />
            <rect x="43" y="64" width="14" height="6" rx="1" fill="#facc15" />
          </g>
        ) : robeId === 'robe_flame_archmage' ? (
          <g>
            {/* Fiery Cape */}
            <path d="M 30 52 C 12 65 12 88 22 92 C 34 85 45 86 52 88 Z" fill="url(#flameRobeGrad)" stroke="#f59e0b" strokeWidth="1.2" />
            {/* Red Boots */}
            <ellipse cx="42" cy="91" rx="5" ry="3" fill="#7f1d1d" stroke="#450a0a" strokeWidth="1" />
            <ellipse cx="58" cy="91" rx="5" ry="3" fill="#7f1d1d" stroke="#450a0a" strokeWidth="1" />
            {/* Crimson Robe */}
            <rect x="38" y="76" width="24" height="14" rx="3" fill="#18181b" />
            <path d="M 36 56 L 36 78 L 64 78 L 64 56 Z" fill="url(#flameRobeGrad)" stroke="#f59e0b" strokeWidth="1" />
            {/* Flame Ribbons */}
            <path d="M 50 56 L 44 76 M 50 56 L 56 76" stroke="#fef08a" strokeWidth="1.5" />
          </g>
        ) : robeId === 'robe_ocean_mermaid' ? (
          <g>
            {/* Aqua Cape */}
            <path d="M 30 52 C 14 65 14 88 22 92 C 34 85 45 86 52 88 Z" fill="url(#oceanRobeGrad)" stroke="#38bdf8" strokeWidth="1.2" />
            <ellipse cx="42" cy="91" rx="5" ry="3" fill="#083344" stroke="#0e7490" strokeWidth="1" />
            <ellipse cx="58" cy="91" rx="5" ry="3" fill="#083344" stroke="#0e7490" strokeWidth="1" />
            <rect x="38" y="76" width="24" height="14" rx="3" fill="#082f49" />
            <path d="M 36 56 L 36 78 L 64 78 L 64 56 Z" fill="url(#oceanRobeGrad)" stroke="#38bdf8" strokeWidth="1" />
            {/* Pearl Shell Pattern */}
            <circle cx="50" cy="67" r="3.5" fill="#e0f2fe" stroke="#0284c7" strokeWidth="0.8" />
          </g>
        ) : robeId === 'robe_starlight_tuxedo' ? (
          <g>
            {/* Midnight Violet Tuxedo */}
            <path d="M 30 52 C 14 65 14 88 22 92 C 34 85 45 86 52 88 Z" fill="url(#tuxedoGrad)" stroke="#c084fc" strokeWidth="1.2" />
            <ellipse cx="42" cy="91" rx="5" ry="3" fill="#18181b" stroke="#09090b" strokeWidth="1" />
            <ellipse cx="58" cy="91" rx="5" ry="3" fill="#18181b" stroke="#09090b" strokeWidth="1" />
            <rect x="38" y="76" width="24" height="14" rx="3" fill="#18181b" />
            <path d="M 36 56 L 36 78 L 64 78 L 64 56 Z" fill="url(#tuxedoGrad)" stroke="#c084fc" strokeWidth="1" />
            {/* White Cravat & Star Buttons */}
            <polygon points="46,56 50,64 54,56" fill="#ffffff" />
            <circle cx="50" cy="69" r="1.5" fill="#facc15" />
            <circle cx="50" cy="74" r="1.5" fill="#facc15" />
          </g>
        ) : (
          <g>
            {/* Default Classic Academy Robe */}
            <path d="M 30 52 C 14 65 16 88 24 92 C 34 85 45 86 52 88 Z" fill="url(#wizHatNavy)" stroke="#1e3a8a" strokeWidth="1" />
            <path d="M 28 54 C 18 68 20 84 26 88" stroke="url(#goldTrimGrad)" strokeWidth="1.2" fill="none" />
            <ellipse cx="42" cy="91" rx="5" ry="3" fill="#78350f" stroke="#451a03" strokeWidth="1" />
            <ellipse cx="58" cy="91" rx="5" ry="3" fill="#78350f" stroke="#451a03" strokeWidth="1" />
            <rect x="38" y="76" width="24" height="14" rx="3" fill="#1e293b" />
            <path d="M 36 56 L 36 78 L 64 78 L 64 56 Z" fill="#b91c1c" stroke="#991b1b" strokeWidth="1" />
            <polygon points="44,56 50,65 56,56" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
            <circle cx="50" cy="69" r="1.5" fill="#facc15" />
            <circle cx="50" cy="74" r="1.5" fill="#facc15" />
          </g>
        )}

        {/* ========================================================
            4. HANDHELD / WEAPON (HANDHELD SLOT)
            ======================================================== */}
        <g transform="translate(16, 56)">
          {handheldId === 'wand_oath_blade' ? (
            <g>
              {/* Golden Knight Blade */}
              <line x1="14" y1="20" x2="0" y2="-8" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
              <polygon points="0,-8 3,-12 -3,-12" fill="#ffffff" stroke="#ca8a04" strokeWidth="0.8" />
              <line x1="8" y1="12" x2="16" y2="8" stroke="#ca8a04" strokeWidth="3" strokeLinecap="round" />
              <circle cx="12" cy="18" r="4.5" fill="#fed7aa" stroke="#ea580c" strokeWidth="0.8" />
            </g>
          ) : handheldId === 'wand_aurora_staff' ? (
            <g>
              {/* Ice Aurora Staff */}
              <line x1="14" y1="22" x2="0" y2="-12" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
              <polygon points="0,-12 4,-16 0,-20 -4,-16" fill="#a5f3fc" stroke="#0891b2" strokeWidth="0.8" filter="drop-shadow(0 0 5px #67e8f9)" />
              <circle cx="12" cy="18" r="4.5" fill="#fed7aa" stroke="#ea580c" strokeWidth="0.8" />
            </g>
          ) : handheldId === 'wand_phoenix_fan' ? (
            <g>
              {/* Flame Feather Fan */}
              <path d="M 12 18 L 2 -4 Q 10 -10 18 -4 Z" fill="#ea580c" stroke="#facc15" strokeWidth="1" filter="drop-shadow(0 0 4px #f59e0b)" />
              <circle cx="12" cy="18" r="4.5" fill="#fed7aa" stroke="#ea580c" strokeWidth="0.8" />
            </g>
          ) : handheldId === 'wand_carrot_wand' ? (
            <g>
              {/* Magic Carrot Wand */}
              <line x1="12" y1="20" x2="2" y2="-4" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
              <polygon points="2,-4 5,-9 -1,-9" fill="#22c55e" />
              <circle cx="2" cy="-9" r="2" fill="#facc15" filter="drop-shadow(0 0 3px #fde047)" />
              <circle cx="12" cy="18" r="4.5" fill="#fed7aa" stroke="#ea580c" strokeWidth="0.8" />
            </g>
          ) : (
            <g>
              {/* Default Starlight Magic Wand */}
              <line x1="12" y1="20" x2="2" y2="-4" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
              <polygon points="2,-4 5,-7 2,-10 -1,-7" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" filter="drop-shadow(0 0 4px #67e8f9)" />
              <circle cx="12" cy="18" r="4.5" fill="#fed7aa" stroke="#ea580c" strokeWidth="0.8" />
            </g>
          )}
        </g>

        {/* ========================================================
            5. CHIBI FACE & SPARKLING ANIME EYES
            ======================================================== */}
        <ellipse cx="50" cy="46" rx="20" ry="17" fill="#fff7ed" stroke="#fdba74" strokeWidth="1" />
        {/* Rosy Cheeks */}
        <circle cx="36" cy="50" r="3" fill="#f43f5e" opacity="0.35" />
        <circle cx="64" cy="50" r="3" fill="#f43f5e" opacity="0.35" />

        {/* Eyes */}
        <g>
          <ellipse cx="40" cy="45" rx="4" ry="5.5" fill="#1e3a8a" />
          <ellipse cx="40" cy="43.5" rx="3" ry="4" fill="#0284c7" />
          <circle cx="39" cy="42" r="1.6" fill="#ffffff" />
          <circle cx="41.5" cy="45.5" r="0.8" fill="#ffffff" />

          <ellipse cx="60" cy="45" rx="4" ry="5.5" fill="#1e3a8a" />
          <ellipse cx="60" cy="43.5" rx="3" ry="4" fill="#0284c7" />
          <circle cx="59" cy="42" r="1.6" fill="#ffffff" />
          <circle cx="61.5" cy="45.5" r="0.8" fill="#ffffff" />

          <path d="M 47 52 Q 50 55 53 52" stroke="#ea580c" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </g>

        {/* ========================================================
            6. HAIR BANGS & SIDE HAIR (HAIR SLOT)
            ======================================================== */}
        {hairId === 'hair_sakura_twintails' && (
          <g>
            {/* Twintail Buns on sides */}
            <circle cx="26" cy="44" r="7" fill="url(#dynHairGrad)" stroke={hair.stroke} strokeWidth="1" />
            <circle cx="74" cy="44" r="7" fill="url(#dynHairGrad)" stroke={hair.stroke} strokeWidth="1" />
            <circle cx="26" cy="40" r="2" fill="#ec4899" />
            <circle cx="74" cy="40" r="2" fill="#ec4899" />
          </g>
        )}

        {/* Front Hair Bangs */}
        <path
          d="M 30 38 Q 38 48 44 40 Q 50 50 58 40 Q 64 48 70 38 Q 66 30 50 30 Q 34 30 30 38 Z"
          fill="url(#dynHairGrad)"
          stroke={hair.stroke}
          strokeWidth="1"
        />

        {/* ========================================================
            7. HAT / HEADWEAR (HAT SLOT)
            ======================================================== */}
        {hatId === 'hat_knight_helm' ? (
          <g>
            {/* Royal Knight Gilded Helm */}
            <path d="M 24 34 C 24 16 38 4 62 4 C 76 12 76 24 76 34 Z" fill="url(#paladinSilver)" stroke="#d4af37" strokeWidth="1.5" />
            {/* Visor Slit */}
            <rect x="34" y="24" width="32" height="4" rx="2" fill="#0f172a" />
            {/* Golden Feathers on Top */}
            <path d="M 50 4 C 44 -8 56 -8 50 4" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="50" cy="14" r="3" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
          </g>
        ) : hatId === 'hat_flame_crown' ? (
          <g>
            {/* Blazing Flame Crown */}
            <path d="M 32 32 L 36 18 L 44 26 L 50 12 L 56 26 L 64 18 L 68 32 Z" fill="#ef4444" stroke="#facc15" strokeWidth="1.2" filter="drop-shadow(0 0 4px #f59e0b)" />
            <circle cx="50" cy="24" r="2.5" fill="#fef08a" />
            <ellipse cx="50" cy="32" rx="20" ry="4" fill="#b91c1c" stroke="#facc15" strokeWidth="1" />
          </g>
        ) : hatId === 'hat_academy_beret' ? (
          <g>
            {/* Academy Beret */}
            <ellipse cx="48" cy="28" rx="25" ry="9" fill="#0284c7" stroke="#facc15" strokeWidth="1.2" transform="rotate(-6 48 28)" />
            <circle cx="48" cy="22" r="2.5" fill="#facc15" />
            {/* Quill Feather Pin */}
            <path d="M 64 26 C 70 18 72 12 70 8 C 66 12 64 20 64 26" fill="#f8fafc" stroke="#38bdf8" strokeWidth="0.8" />
          </g>
        ) : hatId === 'hat_bunny_hood' ? (
          <g>
            {/* Bunny Hood & Ears */}
            <ellipse cx="50" cy="30" rx="22" ry="8" fill="#fdf2f8" stroke="#f472b6" strokeWidth="1.2" />
            {/* Left Ear */}
            <path d="M 38 28 C 30 14 32 -2 40 4 C 44 8 44 20 42 28 Z" fill="#ffffff" stroke="#f472b6" strokeWidth="1.2" />
            <path d="M 38 24 C 34 14 35 4 39 8 C 41 12 41 18 40 24 Z" fill="#fbcfe8" />
            {/* Right Ear */}
            <path d="M 58 28 C 56 16 62 -2 70 4 C 72 10 68 20 62 28 Z" fill="#ffffff" stroke="#f472b6" strokeWidth="1.2" />
            <path d="M 60 24 C 59 14 63 4 67 8 C 68 12 66 18 62 24 Z" fill="#fbcfe8" />
          </g>
        ) : hatId === 'hat_astrologer_hood' ? (
          <g>
            {/* Astrologer Cowl */}
            <path d="M 28 34 C 30 14 42 6 56 4 C 70 8 72 20 72 34 Z" fill="url(#tuxedoGrad)" stroke="#c084fc" strokeWidth="1.5" />
            <circle cx="50" cy="18" r="2.5" fill="#fde047" filter="drop-shadow(0 0 3px #fde047)" />
            <polygon points="50,14 51,17 54,17 51.5,19 52.5,22 50,20 47.5,22 48.5,19 46,17 49,17" fill="#ffffff" />
          </g>
        ) : (
          <g>
            {/* Default Iconic Pointy Wizard Hat with Curved Tip */}
            <ellipse cx="50" cy="33" rx="27" ry="9" fill="url(#wizHatNavy)" stroke="#1e3a8a" strokeWidth="1.5" />
            <ellipse cx="50" cy="33" rx="24" ry="7" fill="none" stroke="url(#goldTrimGrad)" strokeWidth="1" />
            <path
              d="M 28 32 C 30 18 42 6 60 2 C 55 6 48 14 62 20 C 72 24 70 30 72 32 Z"
              fill="url(#wizHatNavy)"
              stroke="#1e3a8a"
              strokeWidth="1.5"
            />
            <path d="M 29 32 Q 50 36 71 32" stroke="url(#goldTrimGrad)" strokeWidth="3" fill="none" />
            <polygon
              points="50,23 52,28 57,28.5 53,32 54.5,37 50,34 45.5,37 47,32 43,28.5 48,28"
              fill="url(#goldTrimGrad)"
              stroke="#78350f"
              strokeWidth="0.8"
              filter="drop-shadow(0 0 3px #fde047)"
            />
            <circle cx="50" cy="30" r="1.5" fill="#38bdf8" />
          </g>
        )}
      </svg>
    </div>
  );
};

/**
 * 经典西幻 NPC 立绘 (Western Fantasy Magic NPCs)
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
          <path d="M 38 34 Q 44 32 48 35" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 54 35 Q 58 32 64 34" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
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
        <path d="M 24 54 L 18 92 L 82 92 L 76 54 Z" fill="url(#tutCape)" stroke="#ca8a04" strokeWidth="1.5" />
        <ellipse cx="50" cy="42" rx="16" ry="14" fill="#fef3c7" />
        <ellipse cx="44" cy="40" rx="2.5" ry="3.5" fill="#1e293b" />
        <ellipse cx="56" cy="40" rx="2.5" ry="3.5" fill="#1e293b" />
        <circle cx="43" cy="39" r="1" fill="#ffffff" />
        <circle cx="55" cy="39" r="1" fill="#ffffff" />
        <path d="M 47 48 Q 50 51 53 48" stroke="#b45309" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M 34 35 Q 42 42 50 35 Q 58 42 66 35 C 64 25 50 24 34 35 Z" fill="#78350f" />
        <ellipse cx="50" cy="30" rx="25" ry="8" fill="#ea580c" stroke="#ca8a04" strokeWidth="1.2" />
        <polygon points="50,4 32,28 68,28" fill="#c2410c" stroke="#ca8a04" strokeWidth="1.2" />
        <polygon points="50,4 51,7 53,7 51.5,9 52,11 50,9.5 48,11 48.5,9 47,7 49,7" fill="#fde047" />
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
  outfit?: CharacterOutfit;
}> = ({
  size = 48,
  className = '',
  outfit,
}) => {
  return (
    <div style={{ width: `${size}px`, height: `${size}px` }} className={`relative inline-flex items-center justify-center ${className}`}>
      <PlayerAvatar size={size} outfit={outfit} />
    </div>
  );
};
