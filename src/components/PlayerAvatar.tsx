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
 * 洛克小魔法师 (Young Wizard Apprentice - Authentic Roco Kingdom Chibi Character)
 * 纯正 2010s 洛克王国 Flash 页游灵动萌系美术风格
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
        return { c1: '#93c5fd', c2: '#2563eb', c3: '#1e3a8a', stroke: '#0f172a', sheen: '#bfdbfe' };
      case 'hair_sakura_twintails':
        return { c1: '#fbcfe8', c2: '#f472b6', c3: '#db2777', stroke: '#9d174d', sheen: '#fdf2f8' };
      case 'hair_silver_frost':
        return { c1: '#ffffff', c2: '#cbd5e1', c3: '#64748b', stroke: '#334155', sheen: '#ffffff' };
      case 'hair_crimson_wild':
        return { c1: '#fca5a5', c2: '#ef4444', c3: '#b91c1c', stroke: '#7f1d1d', sheen: '#fee2e2' };
      case 'hair_golden_fluffy':
      default:
        return { c1: '#fef08a', c2: '#facc15', c3: '#d97706', stroke: '#92400e', sheen: '#fffbeb' };
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
        className="w-full h-full drop-shadow-[0_4px_12px_rgba(30,58,138,0.45)] overflow-visible"
      >
        <defs>
          {/* Dynamic Hair Gradient */}
          <linearGradient id="dynHairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={hair.c1} />
            <stop offset="45%" stopColor={hair.c2} />
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
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#facc15" stopOpacity="0.6" />
            <stop offset="85%" stopColor="#d97706" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
          </radialGradient>

          {/* Classic Wizard Navy Gradient */}
          <linearGradient id="wizHatNavy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="35%" stopColor="#1d4ed8" />
            <stop offset="85%" stopColor="#172554" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Paladin Silver Plate Gradient */}
          <linearGradient id="paladinSilver" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#e2e8f0" />
            <stop offset="75%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
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
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="45%" stopColor="#4338ca" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>

          {/* Gold Trim Foil */}
          <linearGradient id="goldTrimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="45%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>

          {/* Skin Soft Shading */}
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff7ed" />
            <stop offset="85%" stopColor="#ffedd5" />
            <stop offset="100%" stopColor="#fed7aa" />
          </linearGradient>
        </defs>

        {/* ========================================================
            1. GROUND MAGIC DISC / AURA (AURA SLOT)
            ======================================================== */}
        {auraId === 'aura_blazing_fire' ? (
          <g>
            <ellipse cx="50" cy="94" rx="30" ry="7" fill="url(#auraFlame)" />
            <ellipse cx="50" cy="94" rx="20" ry="4" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />
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
            <ellipse cx="50" cy="94" rx="28" ry="6" fill="url(#auraStarlight)" />
            <ellipse cx="50" cy="94" rx="18" ry="3.5" fill="none" stroke="#67e8f9" strokeWidth="1" strokeDasharray="3 2" opacity="0.8" />
          </g>
        )}

        {/* ========================================================
            2. WINGS / BACK APPAREL (WINGS SLOT)
            ======================================================== */}
        {wingsId === 'wings_seraph_light' && (
          <g filter="drop-shadow(0 0 6px rgba(254,240,138,0.75))">
            <path
              d="M 32 60 C 10 40 4 18 16 12 C 24 8 30 24 30 38 C 22 28 26 46 36 54 Z"
              fill="#ffffff"
              stroke="#facc15"
              strokeWidth="1.2"
            />
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
            <path d="M 28 58 L 6 36 L 14 30 L 32 50 Z" fill="#b45309" stroke="#78350f" strokeWidth="1.2" />
            <path d="M 72 58 L 94 36 L 86 30 L 68 50 Z" fill="#b45309" stroke="#78350f" strokeWidth="1.2" />
            <circle cx="50" cy="62" r="7" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
            <circle cx="50" cy="62" r="3" fill="#78350f" />
          </g>
        )}

        {wingsId === 'wings_shadow_demon' && (
          <g filter="drop-shadow(0 0 6px rgba(168,85,247,0.65))">
            <path d="M 32 58 C 14 42 10 24 18 18 C 22 26 24 38 18 48 C 26 44 28 52 34 54 Z" fill="#3b0764" stroke="#c084fc" strokeWidth="1.2" />
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

        {/* Back Hair Tufts (behind head & torso) */}
        <g>
          <path d="M 30 42 C 24 50 24 64 28 72 C 32 66 32 54 36 46 Z" fill="url(#dynHairGrad)" stroke={hair.stroke} strokeWidth="0.8" />
          <path d="M 70 42 C 76 50 76 64 72 72 C 68 66 68 54 64 46 Z" fill="url(#dynHairGrad)" stroke={hair.stroke} strokeWidth="0.8" />
        </g>

        {/* ========================================================
            3. BACK CAPE & LOWER BODY (ROBE SLOT)
            ======================================================== */}
        {robeId === 'robe_paladin_armor' ? (
          <g>
            {/* White/Gold Paladin Cape */}
            <path d="M 30 52 C 14 65 14 88 22 92 C 34 85 45 86 52 88 Z" fill="#f8fafc" stroke="#d4af37" strokeWidth="1.2" />
            {/* Greaves & Boots */}
            <path d="M 38 78 L 38 90 C 38 93 46 93 46 90 L 46 78 Z" fill="#64748b" stroke="#334155" strokeWidth="1" />
            <path d="M 54 78 L 54 90 C 54 93 62 93 62 90 L 62 78 Z" fill="#64748b" stroke="#334155" strokeWidth="1" />
            <ellipse cx="42" cy="91" rx="5" ry="3" fill="#cbd5e1" stroke="#334155" strokeWidth="1" />
            <ellipse cx="58" cy="91" rx="5" ry="3" fill="#cbd5e1" stroke="#334155" strokeWidth="1" />
            {/* Breastplate */}
            <path d="M 35 55 C 33 66 34 78 36 82 C 45 85 55 85 64 82 C 66 78 67 66 65 55 Z" fill="url(#paladinSilver)" stroke="#d4af37" strokeWidth="1.2" />
            {/* Gold Cross Emblem */}
            <rect x="47" y="60" width="6" height="15" rx="1" fill="#facc15" />
            <rect x="42" y="64" width="16" height="6" rx="1" fill="#facc15" />
          </g>
        ) : robeId === 'robe_flame_archmage' ? (
          <g>
            {/* Fiery Cape */}
            <path d="M 30 52 C 12 65 12 88 22 92 C 34 85 45 86 52 88 Z" fill="url(#flameRobeGrad)" stroke="#f59e0b" strokeWidth="1.2" />
            {/* Red Boots */}
            <path d="M 38 78 L 38 90 C 38 93 46 93 46 90 L 46 78 Z" fill="#7f1d1d" stroke="#450a0a" strokeWidth="1" />
            <path d="M 54 78 L 54 90 C 54 93 62 93 62 90 L 62 78 Z" fill="#7f1d1d" stroke="#450a0a" strokeWidth="1" />
            <ellipse cx="42" cy="91" rx="5" ry="3" fill="#b91c1c" stroke="#450a0a" strokeWidth="1" />
            <ellipse cx="58" cy="91" rx="5" ry="3" fill="#b91c1c" stroke="#450a0a" strokeWidth="1" />
            {/* Crimson Robe */}
            <path d="M 35 55 C 33 66 34 78 36 82 C 45 85 55 85 64 82 C 66 78 67 66 65 55 Z" fill="url(#flameRobeGrad)" stroke="#f59e0b" strokeWidth="1.2" />
            <path d="M 50 56 L 44 80 M 50 56 L 56 80" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="50" cy="62" r="2.5" fill="#fef08a" />
          </g>
        ) : robeId === 'robe_ocean_mermaid' ? (
          <g>
            {/* Aqua Cape */}
            <path d="M 30 52 C 14 65 14 88 22 92 C 34 85 45 86 52 88 Z" fill="url(#oceanRobeGrad)" stroke="#38bdf8" strokeWidth="1.2" />
            <path d="M 38 78 L 38 90 C 38 93 46 93 46 90 L 46 78 Z" fill="#082f49" stroke="#0e7490" strokeWidth="1" />
            <path d="M 54 78 L 54 90 C 54 93 62 93 62 90 L 62 78 Z" fill="#082f49" stroke="#0e7490" strokeWidth="1" />
            <ellipse cx="42" cy="91" rx="5" ry="3" fill="#0284c7" stroke="#0e7490" strokeWidth="1" />
            <ellipse cx="58" cy="91" rx="5" ry="3" fill="#0284c7" stroke="#0e7490" strokeWidth="1" />
            <path d="M 35 55 C 33 66 34 78 36 82 C 45 85 55 85 64 82 C 66 78 67 66 65 55 Z" fill="url(#oceanRobeGrad)" stroke="#38bdf8" strokeWidth="1.2" />
            <circle cx="50" cy="67" r="3.5" fill="#e0f2fe" stroke="#0284c7" strokeWidth="0.8" />
          </g>
        ) : robeId === 'robe_starlight_tuxedo' ? (
          <g>
            {/* Midnight Violet Tuxedo */}
            <path d="M 30 52 C 14 65 14 88 22 92 C 34 85 45 86 52 88 Z" fill="url(#tuxedoGrad)" stroke="#c084fc" strokeWidth="1.2" />
            <path d="M 38 78 L 38 90 C 38 93 46 93 46 90 L 46 78 Z" fill="#1e1b4b" stroke="#09090b" strokeWidth="1" />
            <path d="M 54 78 L 54 90 C 54 93 62 93 62 90 L 62 78 Z" fill="#1e1b4b" stroke="#09090b" strokeWidth="1" />
            <ellipse cx="42" cy="91" rx="5" ry="3" fill="#0f172a" stroke="#09090b" strokeWidth="1" />
            <ellipse cx="58" cy="91" rx="5" ry="3" fill="#0f172a" stroke="#09090b" strokeWidth="1" />
            <path d="M 35 55 C 33 66 34 78 36 82 C 45 85 55 85 64 82 C 66 78 67 66 65 55 Z" fill="url(#tuxedoGrad)" stroke="#c084fc" strokeWidth="1.2" />
            <polygon points="46,55 50,64 54,55" fill="#ffffff" />
            <circle cx="50" cy="68" r="1.5" fill="#facc15" />
            <circle cx="50" cy="74" r="1.5" fill="#facc15" />
          </g>
        ) : (
          <g>
            {/* Default Classic Academy Robe */}
            <path d="M 30 52 C 14 65 16 88 24 92 C 34 85 45 86 52 88 Z" fill="url(#wizHatNavy)" stroke="#1e3a8a" strokeWidth="1" />
            <path d="M 28 54 C 18 68 20 84 26 88" stroke="url(#goldTrimGrad)" strokeWidth="1.2" fill="none" />
            {/* Legs and Cute Leather Wizard Boots */}
            <path d="M 38 78 L 38 90 C 38 93 46 93 46 90 L 46 78 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
            <path d="M 54 78 L 54 90 C 54 93 62 93 62 90 L 62 78 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
            <ellipse cx="42" cy="91" rx="5.5" ry="3.5" fill="#78350f" stroke="#451a03" strokeWidth="1" />
            <ellipse cx="58" cy="91" rx="5.5" ry="3.5" fill="#78350f" stroke="#451a03" strokeWidth="1" />
            {/* Front Tunic */}
            <path d="M 35 55 C 33 66 34 78 36 82 C 45 85 55 85 64 82 C 66 78 67 66 65 55 Z" fill="#b91c1c" stroke="#991b1b" strokeWidth="1" />
            {/* White Cravat & Gold Star Buttons */}
            <polygon points="44,55 50,65 56,55" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
            <circle cx="50" cy="68" r="1.5" fill="#facc15" />
            <circle cx="50" cy="74" r="1.5" fill="#facc15" />
            {/* Gold Hemline */}
            <path d="M 36 81 Q 50 85 64 81" stroke="url(#goldTrimGrad)" strokeWidth="1.5" fill="none" />
          </g>
        )}

        {/* Belt & Gulu Ball Charm */}
        <g>
          <rect x="36" y="74" width="28" height="4" rx="1.5" fill="#78350f" stroke="#451a03" strokeWidth="0.8" />
          <rect x="48" y="73" width="4" height="6" rx="1" fill="#facc15" stroke="#78350f" strokeWidth="0.8" />
          <circle cx="41" cy="79" r="2.5" fill="#ef4444" stroke="#7f1d1d" strokeWidth="0.6" />
          <path d="M 38.5 79 A 2.5 2.5 0 0 0 43.5 79 Z" fill="#ffffff" />
          <circle cx="41" cy="79" r="0.8" fill="#0f172a" />
        </g>

        {/* Sleeves & Cute Chibi Hands */}
        <g>
          {/* Right Sleeve & Hand */}
          <path d="M 64 56 C 70 60 74 68 70 74 C 66 76 62 70 60 64 Z" fill="url(#wizHatNavy)" stroke="#1e3a8a" strokeWidth="1" />
          <circle cx="70" cy="73" r="3" fill="#ffedd5" stroke="#fed7aa" strokeWidth="0.8" />
          {/* Left Sleeve & Hand (holding wand) */}
          <path d="M 36 56 C 30 60 26 68 30 74 C 34 76 38 70 40 64 Z" fill="url(#wizHatNavy)" stroke="#1e3a8a" strokeWidth="1" />
          <circle cx="30" cy="73" r="3" fill="#ffedd5" stroke="#fed7aa" strokeWidth="0.8" />
        </g>

        {/* ========================================================
            4. HANDHELD / WEAPON (HANDHELD SLOT)
            ======================================================== */}
        <g transform="translate(18, 56)">
          {handheldId === 'wand_oath_blade' ? (
            <g>
              <line x1="12" y1="20" x2="-2" y2="-10" stroke="#facc15" strokeWidth="3.5" strokeLinecap="round" />
              <polygon points="-2,-10 2,-15 -4,-15" fill="#ffffff" stroke="#ca8a04" strokeWidth="1" />
              <line x1="6" y1="12" x2="16" y2="8" stroke="#ca8a04" strokeWidth="3" strokeLinecap="round" />
            </g>
          ) : handheldId === 'wand_aurora_staff' ? (
            <g>
              <line x1="12" y1="22" x2="-2" y2="-14" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
              <polygon points="-2,-14 3,-19 -2,-24 -7,-19" fill="#a5f3fc" stroke="#0891b2" strokeWidth="1" filter="drop-shadow(0 0 5px #67e8f9)" />
            </g>
          ) : handheldId === 'wand_phoenix_fan' ? (
            <g>
              <path d="M 12 18 L 0 -4 Q 10 -12 18 -4 Z" fill="#ea580c" stroke="#facc15" strokeWidth="1" filter="drop-shadow(0 0 4px #f59e0b)" />
            </g>
          ) : handheldId === 'wand_carrot_wand' ? (
            <g>
              <line x1="12" y1="20" x2="2" y2="-4" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round" />
              <polygon points="2,-4 5,-9 -1,-9" fill="#22c55e" />
              <circle cx="2" cy="-9" r="2" fill="#facc15" filter="drop-shadow(0 0 3px #fde047)" />
            </g>
          ) : (
            <g>
              <line x1="12" y1="20" x2="0" y2="-6" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
              <polygon points="0,-6 4,-10 0,-14 -4,-10" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" filter="drop-shadow(0 0 5px #67e8f9)" />
              <circle cx="0" cy="-10" r="1.5" fill="#ffffff" />
            </g>
          )}
        </g>

        {/* ========================================================
            5. CHIBI FACE & SPARKLING ANIME EYES
            ======================================================== */}
        {/* Soft Chibi Head Shape with Ears */}
        <g>
          {/* Left Ear */}
          <ellipse cx="30" cy="48" rx="3.5" ry="4.5" fill="#fff7ed" stroke="#fdba74" strokeWidth="0.8" />
          <ellipse cx="30" cy="48" rx="2" ry="2.5" fill="#fca5a5" opacity="0.6" />
          {/* Right Ear */}
          <ellipse cx="70" cy="48" rx="3.5" ry="4.5" fill="#fff7ed" stroke="#fdba74" strokeWidth="0.8" />
          <ellipse cx="70" cy="48" rx="2" ry="2.5" fill="#fca5a5" opacity="0.6" />

          {/* Main Face Contour */}
          <ellipse cx="50" cy="47" rx="20" ry="17.5" fill="url(#skinGrad)" stroke="#fdba74" strokeWidth="1" />
        </g>

        {/* Rosy Anime Cheeks */}
        <g>
          <ellipse cx="35" cy="51" rx="3.5" ry="2" fill="#f43f5e" opacity="0.38" />
          <line x1="33" y1="50" x2="37" y2="52" stroke="#e11d48" strokeWidth="0.6" opacity="0.4" />
          <ellipse cx="65" cy="51" rx="3.5" ry="2" fill="#f43f5e" opacity="0.38" />
          <line x1="63" y1="50" x2="67" y2="52" stroke="#e11d48" strokeWidth="0.6" opacity="0.4" />
        </g>

        {/* Sparkling Anime Eyes (Classic Roco Chibi Style) */}
        <g>
          {/* Left Eye */}
          <ellipse cx="40" cy="45" rx="4.2" ry="6" fill="#172554" />
          <ellipse cx="40" cy="46" rx="3.8" ry="4.5" fill="#1d4ed8" />
          <ellipse cx="40" cy="48" rx="3" ry="2.5" fill="#38bdf8" />
          {/* Catchlight Glints */}
          <circle cx="38.5" cy="42.5" r="1.8" fill="#ffffff" />
          <circle cx="41.5" cy="47.5" r="0.9" fill="#ffffff" />
          {/* Eyelash */}
          <path d="M 35 41 Q 40 38.5 45 42" stroke="#0f172a" strokeWidth="1.3" strokeLinecap="round" fill="none" />

          {/* Right Eye */}
          <ellipse cx="60" cy="45" rx="4.2" ry="6" fill="#172554" />
          <ellipse cx="60" cy="46" rx="3.8" ry="4.5" fill="#1d4ed8" />
          <ellipse cx="60" cy="48" rx="3" ry="2.5" fill="#38bdf8" />
          {/* Catchlight Glints */}
          <circle cx="58.5" cy="42.5" r="1.8" fill="#ffffff" />
          <circle cx="61.5" cy="47.5" r="0.9" fill="#ffffff" />
          {/* Eyelash */}
          <path d="M 55 42 Q 60 38.5 65 41" stroke="#0f172a" strokeWidth="1.3" strokeLinecap="round" fill="none" />

          {/* Sweet Anime Mouth */}
          <path d="M 47 53 Q 50 56 53 53" stroke="#ea580c" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        </g>

        {/* ========================================================
            6. HAIR BANGS & SIDE HAIR (HAIR SLOT)
            ======================================================== */}
        {hairId === 'hair_sakura_twintails' && (
          <g>
            {/* Cute Twintail Buns */}
            <circle cx="24" cy="44" r="8" fill="url(#dynHairGrad)" stroke={hair.stroke} strokeWidth="1" />
            <circle cx="76" cy="44" r="8" fill="url(#dynHairGrad)" stroke={hair.stroke} strokeWidth="1" />
            <circle cx="24" cy="40" r="2.5" fill="#ec4899" />
            <circle cx="76" cy="40" r="2.5" fill="#ec4899" />
          </g>
        )}

        {/* Front Hair Bangs with Natural Layering */}
        <g>
          <path
            d="M 28 38 C 34 46 38 48 42 41 C 45 49 50 49 54 41 C 58 48 64 46 72 38 C 68 30 50 28 28 38 Z"
            fill="url(#dynHairGrad)"
            stroke={hair.stroke}
            strokeWidth="1"
          />
          {/* Hair Sheen Highlight Curve */}
          <path d="M 32 35 Q 50 32 68 35" stroke={hair.sheen} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8" />
          {/* Sideburns */}
          <path d="M 28 38 C 26 44 28 50 30 52 C 30 46 30 42 32 40 Z" fill="url(#dynHairGrad)" />
          <path d="M 72 38 C 74 44 72 50 70 52 C 70 46 70 42 68 40 Z" fill="url(#dynHairGrad)" />
        </g>

        {/* ========================================================
            7. HAT / HEADWEAR (HAT SLOT)
            ======================================================== */}
        {hatId === 'hat_knight_helm' ? (
          <g>
            <path d="M 24 34 C 24 14 38 4 62 4 C 76 12 76 24 76 34 Z" fill="url(#paladinSilver)" stroke="#d4af37" strokeWidth="1.5" />
            <rect x="34" y="24" width="32" height="4" rx="2" fill="#0f172a" />
            <path d="M 50 4 C 44 -8 56 -8 50 4" fill="#facc15" stroke="#ca8a04" strokeWidth="1.2" />
            <circle cx="50" cy="14" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
          </g>
        ) : hatId === 'hat_flame_crown' ? (
          <g>
            <path d="M 32 32 L 36 18 L 44 26 L 50 12 L 56 26 L 64 18 L 68 32 Z" fill="#ef4444" stroke="#facc15" strokeWidth="1.2" filter="drop-shadow(0 0 4px #f59e0b)" />
            <circle cx="50" cy="24" r="3" fill="#fef08a" />
            <ellipse cx="50" cy="32" rx="20" ry="4" fill="#b91c1c" stroke="#facc15" strokeWidth="1" />
          </g>
        ) : hatId === 'hat_academy_beret' ? (
          <g>
            <ellipse cx="48" cy="28" rx="25" ry="9" fill="#0284c7" stroke="#facc15" strokeWidth="1.2" transform="rotate(-6 48 28)" />
            <circle cx="48" cy="22" r="2.5" fill="#facc15" />
            <path d="M 64 26 C 70 18 72 12 70 8 C 66 12 64 20 64 26" fill="#f8fafc" stroke="#38bdf8" strokeWidth="0.8" />
          </g>
        ) : hatId === 'hat_bunny_hood' ? (
          <g>
            <ellipse cx="50" cy="30" rx="22" ry="8" fill="#fdf2f8" stroke="#f472b6" strokeWidth="1.2" />
            <path d="M 38 28 C 30 14 32 -2 40 4 C 44 8 44 20 42 28 Z" fill="#ffffff" stroke="#f472b6" strokeWidth="1.2" />
            <path d="M 38 24 C 34 14 35 4 39 8 C 41 12 41 18 40 24 Z" fill="#fbcfe8" />
            <path d="M 58 28 C 56 16 62 -2 70 4 C 72 10 68 20 62 28 Z" fill="#ffffff" stroke="#f472b6" strokeWidth="1.2" />
            <path d="M 60 24 C 59 14 63 4 67 8 C 68 12 66 18 62 24 Z" fill="#fbcfe8" />
          </g>
        ) : hatId === 'hat_astrologer_hood' ? (
          <g>
            <path d="M 28 34 C 30 14 42 6 56 4 C 70 8 72 20 72 34 Z" fill="url(#tuxedoGrad)" stroke="#c084fc" strokeWidth="1.5" />
            <circle cx="50" cy="18" r="2.5" fill="#fde047" filter="drop-shadow(0 0 3px #fde047)" />
            <polygon points="50,14 51,17 54,17 51.5,19 52.5,22 50,20 47.5,22 48.5,19 46,17 49,17" fill="#ffffff" />
          </g>
        ) : (
          <g>
            {/* Iconic Pointy Wizard Hat with Curled Tip */}
            <ellipse cx="50" cy="33" rx="27" ry="8.5" fill="url(#wizHatNavy)" stroke="#1e3a8a" strokeWidth="1.2" />
            <ellipse cx="50" cy="33" rx="24" ry="7" fill="none" stroke="url(#goldTrimGrad)" strokeWidth="1" />
            {/* Cone with natural fabric folds */}
            <path
              d="M 30 32 C 32 20 44 8 64 3 C 60 8 56 14 68 18 C 74 20 73 26 70 32 Z"
              fill="url(#wizHatNavy)"
              stroke="#1e3a8a"
              strokeWidth="1.2"
            />
            {/* Gold Belt & Star Buckle */}
            <path d="M 31 32 Q 50 35 69 32" stroke="url(#goldTrimGrad)" strokeWidth="3" fill="none" />
            <polygon
              points="50,28 51.5,31 54.5,31.5 52,33.5 53,36.5 50,35 47,36.5 48,33.5 45.5,31.5 48.5,31"
              fill="url(#goldTrimGrad)"
              stroke="#78350f"
              strokeWidth="0.8"
              filter="drop-shadow(0 0 3px #fde047)"
            />
            <circle cx="50" cy="32.5" r="1" fill="#38bdf8" />
          </g>
        )}
      </svg>
    </div>
  );
};

/**
 * 洛克王国经典全手绘 NPC 立绘 (Authentic Roco Kingdom World NPCs)
 * 告别死板几何体，全面采用灵动唯美的 Flash 西幻页游画风！
 */
export const NpcAvatar: React.FC<{ type?: string; size?: number; className?: string }> = ({
  type = 'student',
  size = 64,
  className = '',
}) => {
  // 1. 阿尔弗雷德 / 格里芬院长 (Headmaster Griffin)
  if (type === 'griffin') {
    return (
      <div style={{ width: `${size}px`, height: `${size}px` }} className={`relative inline-flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_6px_18px_rgba(168,85,247,0.65)] overflow-visible">
          <defs>
            <linearGradient id="grfCape" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7e22ce" />
              <stop offset="50%" stopColor="#4c1d95" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
            <linearGradient id="grfBeard" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <radialGradient id="grfStaffOrb" cx="40%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#a5f3fc" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0369a1" />
            </radialGradient>
          </defs>

          {/* Starlight Aura */}
          <ellipse cx="50" cy="94" rx="28" ry="6" fill="#a855f7" opacity="0.3" filter="blur(2px)" />

          {/* Starlight Archmage Robe */}
          <path d="M 22 54 C 18 68 14 90 20 94 C 35 91 65 91 80 94 C 86 90 82 68 78 54 Z" fill="url(#grfCape)" stroke="#d4af37" strokeWidth="1.5" />
          <path d="M 50 54 L 50 94" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
          <circle cx="50" cy="62" r="2" fill="#fde047" />
          <circle cx="50" cy="74" r="2" fill="#fde047" />

          {/* Grand Archmage Hat */}
          <ellipse cx="50" cy="27" rx="30" ry="9" fill="#3b0764" stroke="#d4af37" strokeWidth="1.5" />
          <ellipse cx="50" cy="27" rx="27" ry="7" fill="none" stroke="#facc15" strokeWidth="0.8" opacity="0.7" />
          <path d="M 26 27 C 30 10 44 2 66 1 C 58 7 52 14 68 18 C 76 22 74 25 74 27 Z" fill="#581c87" stroke="#d4af37" strokeWidth="1.5" />
          <circle cx="48" cy="13" r="3" fill="#facc15" filter="drop-shadow(0 0 3px #fde047)" />
          <polygon points="56,18 57.5,21 60.5,21 58,23 59,26 56,24.5 53,26 54,23 51.5,21 54.5,21" fill="#fde047" />

          {/* Archmage Face with Monocle */}
          <ellipse cx="50" cy="38" rx="16" ry="14" fill="#fff7ed" stroke="#fdba74" strokeWidth="1" />
          {/* Eyebrows & Eyes */}
          <path d="M 38 32 Q 44 30 48 33" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 54 33 Q 58 30 64 32" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="43" cy="36" rx="2.5" ry="3" fill="#1e1b4b" />
          <ellipse cx="57" cy="36" rx="2.5" ry="3" fill="#1e1b4b" />
          <circle cx="42" cy="35" r="1" fill="#ffffff" />
          <circle cx="56" cy="35" r="1" fill="#ffffff" />
          {/* Golden Monocle */}
          <circle cx="43" cy="36" r="4.5" fill="none" stroke="#facc15" strokeWidth="1.5" />
          <path d="M 47.5 36 Q 50 42 50 48" stroke="#ca8a04" strokeWidth="0.8" fill="none" />

          {/* Grand Flowing White Beard */}
          <path d="M 32 40 C 30 58 40 82 50 86 C 60 82 70 58 68 40 Q 50 44 32 40 Z" fill="url(#grfBeard)" stroke="#cbd5e1" strokeWidth="1" />
          <path d="M 50 44 Q 42 52 38 48 M 50 44 Q 58 52 62 48" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinecap="round" />

          {/* Celestial Starlight Staff */}
          <g transform="translate(76, 32)">
            <line x1="0" y1="58" x2="0" y2="4" stroke="#d4af37" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="0" cy="0" r="7" fill="url(#grfStaffOrb)" stroke="#e0f2fe" strokeWidth="1.5" filter="drop-shadow(0 0 6px #38bdf8)" />
            <ellipse cx="0" cy="0" rx="10" ry="3.5" fill="none" stroke="#facc15" strokeWidth="1" transform="rotate(-25)" />
          </g>
        </svg>
      </div>
    );
  }

  // 2. 萌萌护士 莉莉娅 (Nurse Lily)
  if (type === 'nurse') {
    return (
      <div style={{ width: `${size}px`, height: `${size}px` }} className={`relative inline-flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_16px_rgba(244,63,94,0.55)] overflow-visible">
          <defs>
            <linearGradient id="nurseHair" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fbcfe8" />
              <stop offset="50%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>
            <linearGradient id="nurseDress" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#ffe4e6" />
            </linearGradient>
          </defs>

          {/* Healing Heart Ground Glow */}
          <ellipse cx="50" cy="94" rx="26" ry="6" fill="#f43f5e" opacity="0.3" filter="blur(2px)" />

          {/* Twin Pink Hair Buns */}
          <circle cx="26" cy="42" r="9" fill="url(#nurseHair)" stroke="#be185d" strokeWidth="1" />
          <circle cx="74" cy="42" r="9" fill="url(#nurseHair)" stroke="#be185d" strokeWidth="1" />
          <circle cx="26" cy="38" r="3" fill="#f43f5e" />
          <circle cx="74" cy="38" r="3" fill="#f43f5e" />

          {/* Nurse Dress & Apron */}
          <path d="M 32 54 C 28 66 26 84 32 90 C 44 93 56 93 68 90 C 74 84 72 66 68 54 Z" fill="url(#nurseDress)" stroke="#fb7185" strokeWidth="1.2" />
          <path d="M 38 60 L 62 60 L 60 84 L 40 84 Z" fill="#fff1f2" stroke="#fda4af" strokeWidth="1" />
          {/* Heart Emblem on Apron */}
          <path d="M 50 67 C 48 64 44 65 44 69 C 44 73 50 77 50 77 C 50 77 56 73 56 69 C 56 65 52 64 50 67 Z" fill="#ef4444" />

          {/* White Little Boots */}
          <ellipse cx="42" cy="91" rx="5" ry="3" fill="#ffffff" stroke="#fda4af" strokeWidth="1" />
          <ellipse cx="58" cy="91" rx="5" ry="3" fill="#ffffff" stroke="#fda4af" strokeWidth="1" />

          {/* Cute Sleeves & Hands */}
          <circle cx="28" cy="72" r="3.5" fill="#ffedd5" stroke="#fbcfe8" strokeWidth="0.8" />
          <circle cx="72" cy="72" r="3.5" fill="#ffedd5" stroke="#fbcfe8" strokeWidth="0.8" />

          {/* Face */}
          <ellipse cx="50" cy="45" rx="19" ry="16.5" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1" />
          <ellipse cx="36" cy="49" rx="3.5" ry="2" fill="#f43f5e" opacity="0.4" />
          <ellipse cx="64" cy="49" rx="3.5" ry="2" fill="#f43f5e" opacity="0.4" />

          {/* Sparkling Emerald Eyes */}
          <ellipse cx="41" cy="44" rx="4" ry="5.5" fill="#065f46" />
          <ellipse cx="41" cy="45" rx="3.5" ry="4" fill="#10b981" />
          <circle cx="39.5" cy="42" r="1.6" fill="#ffffff" />
          <circle cx="42.5" cy="46" r="0.8" fill="#ffffff" />

          <ellipse cx="59" cy="44" rx="4" ry="5.5" fill="#065f46" />
          <ellipse cx="59" cy="45" rx="3.5" ry="4" fill="#10b981" />
          <circle cx="57.5" cy="42" r="1.6" fill="#ffffff" />
          <circle cx="60.5" cy="46" r="0.8" fill="#ffffff" />

          <path d="M 47 51 Q 50 54 53 51" stroke="#f43f5e" strokeWidth="1.4" fill="none" strokeLinecap="round" />

          {/* Front Bangs */}
          <path d="M 32 38 C 38 46 44 46 48 40 C 52 46 58 46 68 38 C 62 30 38 30 32 38 Z" fill="url(#nurseHair)" stroke="#be185d" strokeWidth="1" />

          {/* Nurse Cap */}
          <path d="M 36 28 C 42 22 58 22 64 28 L 62 33 L 38 33 Z" fill="#ffffff" stroke="#fda4af" strokeWidth="1.2" filter="drop-shadow(0 2px 4px rgba(244,63,94,0.3))" />
          <path d="M 50 25 C 48.5 23 45.5 24 45.5 26.5 C 45.5 29.5 50 32 50 32 C 50 32 54.5 29.5 54.5 26.5 C 54.5 24 51.5 23 50 25 Z" fill="#ef4444" />
        </svg>
      </div>
    );
  }

  // 3. 皇家骑士团长 兰斯洛特 (Paladin Captain Lancelot)
  if (type === 'knight') {
    return (
      <div style={{ width: `${size}px`, height: `${size}px` }} className={`relative inline-flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_16px_rgba(59,130,246,0.6)] overflow-visible">
          <defs>
            <linearGradient id="paladinCape" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
            <linearGradient id="kArmor" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
          </defs>

          {/* Royal Azure Cape */}
          <path d="M 26 50 C 14 65 14 88 20 94 C 35 91 65 91 80 94 C 86 88 86 65 74 50 Z" fill="url(#paladinCape)" stroke="#facc15" strokeWidth="1.2" />

          {/* Silver Boots */}
          <ellipse cx="40" cy="91" rx="6" ry="3.5" fill="#64748b" stroke="#334155" strokeWidth="1" />
          <ellipse cx="60" cy="91" rx="6" ry="3.5" fill="#64748b" stroke="#334155" strokeWidth="1" />

          {/* Silver Plate Body */}
          <path d="M 34 54 C 32 66 33 78 36 82 C 45 85 55 85 64 82 C 67 78 68 66 66 54 Z" fill="url(#kArmor)" stroke="#d4af37" strokeWidth="1.4" />
          {/* Golden Lion Shield on Chest */}
          <polygon points="50,60 56,64 54,72 50,76 46,72 44,64" fill="#facc15" stroke="#78350f" strokeWidth="1" />

          {/* Knight Heater Shield on Left Hand */}
          <g transform="translate(18, 54)">
            <path d="M 0 0 L 14 0 C 14 16 7 24 7 24 C 7 24 0 16 0 0 Z" fill="#1d4ed8" stroke="#facc15" strokeWidth="1.5" />
            <polygon points="7,4 9,8 13,8 10,11 11,15 7,12 3,15 4,11 1,8 5,8" fill="#facc15" />
          </g>

          {/* Sword Pommel on Right Hand */}
          <g transform="translate(76, 56)">
            <line x1="0" y1="20" x2="0" y2="-6" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
            <line x1="-5" y1="2" x2="5" y2="2" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
            <circle cx="0" cy="-6" r="2.5" fill="#facc15" />
          </g>

          {/* Heroic Knight Head */}
          <ellipse cx="50" cy="44" rx="18" ry="16" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1" />
          {/* Confident Eyes */}
          <ellipse cx="42" cy="43" rx="3.5" ry="4.5" fill="#1e3a8a" />
          <circle cx="41" cy="41" r="1.5" fill="#ffffff" />
          <ellipse cx="58" cy="43" rx="3.5" ry="4.5" fill="#1e3a8a" />
          <circle cx="57" cy="41" r="1.5" fill="#ffffff" />
          <path d="M 46 50 Q 50 53 54 50" stroke="#b45309" strokeWidth="1.2" fill="none" strokeLinecap="round" />

          {/* Paladin Winged Helmet with White Plume */}
          <path d="M 28 36 C 28 16 40 6 60 6 C 72 12 72 26 72 36 Z" fill="url(#kArmor)" stroke="#d4af37" strokeWidth="1.5" />
          <path d="M 50 6 C 44 -10 56 -10 50 6" fill="#ffffff" stroke="#facc15" strokeWidth="1.5" />
          <circle cx="50" cy="14" r="3.5" fill="#facc15" stroke="#78350f" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  // 4. 护林员 罗宾 (Ranger Robin)
  if (type === 'ranger') {
    return (
      <div style={{ width: `${size}px`, height: `${size}px` }} className={`relative inline-flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_16px_rgba(22,163,74,0.55)] overflow-visible">
          {/* Ranger Green Hooded Cape */}
          <path d="M 28 52 C 16 66 16 88 22 92 C 34 89 66 89 78 92 C 84 88 84 66 72 52 Z" fill="#15803d" stroke="#14532d" strokeWidth="1.2" />
          <ellipse cx="42" cy="91" rx="5" ry="3" fill="#78350f" stroke="#451a03" strokeWidth="1" />
          <ellipse cx="58" cy="91" rx="5" ry="3" fill="#78350f" stroke="#451a03" strokeWidth="1" />

          {/* Leather Jerkin */}
          <path d="M 35 55 C 33 66 34 78 36 82 C 45 85 55 85 64 82 C 66 78 67 66 65 55 Z" fill="#854d0e" stroke="#713f12" strokeWidth="1.2" />
          {/* Silver Leaf Brooch */}
          <path d="M 50 56 C 46 54 46 62 50 65 C 54 62 54 54 50 56 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />

          {/* Composite Bow on Back */}
          <path d="M 22 26 Q 16 54 26 84" stroke="#a16207" strokeWidth="3" fill="none" strokeLinecap="round" />
          <line x1="22" y1="26" x2="26" y2="84" stroke="#fef08a" strokeWidth="0.8" opacity="0.8" />

          {/* Face */}
          <ellipse cx="50" cy="44" rx="18" ry="16" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1" />
          <ellipse cx="42" cy="43" rx="3.5" ry="4.5" fill="#713f12" />
          <circle cx="41" cy="41" r="1.5" fill="#ffffff" />
          <ellipse cx="58" cy="43" rx="3.5" ry="4.5" fill="#713f12" />
          <circle cx="57" cy="41" r="1.5" fill="#ffffff" />
          <path d="M 46 50 Q 50 53 54 50" stroke="#b45309" strokeWidth="1.2" fill="none" strokeLinecap="round" />

          {/* Chestnut Hair */}
          <path d="M 32 38 C 38 46 44 46 48 40 C 52 46 58 46 68 38 C 62 30 38 30 32 38 Z" fill="#a16207" stroke="#713f12" strokeWidth="1" />

          {/* Green Ranger Cap with Red Feather */}
          <path d="M 30 32 C 34 16 50 14 70 20 C 66 26 62 32 30 32 Z" fill="#16a34a" stroke="#15803d" strokeWidth="1.2" />
          <path d="M 64 22 C 72 12 76 6 72 2 C 68 8 66 16 64 22" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.8" />
        </svg>
      </div>
    );
  }

  // 5. 铁匠 托尔 (Blacksmith Thor)
  if (type === 'smith') {
    return (
      <div style={{ width: `${size}px`, height: `${size}px` }} className={`relative inline-flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_16px_rgba(234,88,12,0.6)] overflow-visible">
          {/* Heavy Apron */}
          <path d="M 32 54 L 32 86 L 68 86 L 68 54 Z" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
          <ellipse cx="42" cy="91" rx="6" ry="3.5" fill="#1c1917" stroke="#0c0a09" strokeWidth="1" />
          <ellipse cx="58" cy="91" rx="6" ry="3.5" fill="#1c1917" stroke="#0c0a09" strokeWidth="1" />

          {/* Forge Hammer */}
          <g transform="translate(76, 42)">
            <line x1="0" y1="46" x2="0" y2="4" stroke="#a16207" strokeWidth="4" strokeLinecap="round" />
            <rect x="-8" y="-4" width="16" height="12" rx="2" fill="#64748b" stroke="#334155" strokeWidth="1.2" />
            <circle cx="-6" cy="2" r="2" fill="#facc15" filter="drop-shadow(0 0 3px #f59e0b)" />
          </g>

          {/* Face */}
          <ellipse cx="50" cy="40" rx="18" ry="16" fill="#fed7aa" stroke="#ea580c" strokeWidth="1" />
          <ellipse cx="42" cy="38" rx="3" ry="4" fill="#1c1917" />
          <ellipse cx="58" cy="38" rx="3" ry="4" fill="#1c1917" />

          {/* Thick Braided Auburn Beard */}
          <path d="M 32 44 C 30 62 42 78 50 82 C 58 78 70 62 68 44 Q 50 48 32 44 Z" fill="#c2410c" stroke="#7c2d12" strokeWidth="1.2" />
          <circle cx="50" cy="72" r="3.5" fill="#facc15" stroke="#78350f" strokeWidth="1" />

          {/* Brass Welding Goggles on Forehead */}
          <circle cx="42" cy="28" r="6" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
          <circle cx="42" cy="28" r="4" fill="#38bdf8" opacity="0.8" />
          <circle cx="58" cy="28" r="6" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
          <circle cx="58" cy="28" r="4" fill="#38bdf8" opacity="0.8" />
          <line x1="48" y1="28" x2="52" y2="28" stroke="#78350f" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  // 6. 老水手 摩根 (Sailor Morgan)
  if (type === 'sailor') {
    return (
      <div style={{ width: `${size}px`, height: `${size}px` }} className={`relative inline-flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_16px_rgba(2,132,199,0.55)] overflow-visible">
          {/* Captain Navy Coat & Striped Shirt */}
          <path d="M 28 52 C 16 66 16 88 22 92 C 34 89 66 89 78 92 C 84 88 84 66 72 52 Z" fill="#0369a1" stroke="#075985" strokeWidth="1.2" />
          <path d="M 36 56 L 64 56 L 62 82 L 38 82 Z" fill="#ffffff" />
          <line x1="37" y1="62" x2="63" y2="62" stroke="#0284c7" strokeWidth="2" />
          <line x1="37" y1="70" x2="63" y2="70" stroke="#0284c7" strokeWidth="2" />
          <line x1="38" y1="78" x2="62" y2="78" stroke="#0284c7" strokeWidth="2" />
          <ellipse cx="42" cy="91" rx="5" ry="3" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
          <ellipse cx="58" cy="91" rx="5" ry="3" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />

          {/* Face */}
          <ellipse cx="50" cy="44" rx="18" ry="16" fill="#ffedd5" stroke="#fed7aa" strokeWidth="1" />
          {/* Left Eye with Eyepatch */}
          <circle cx="42" cy="42" r="5" fill="#0f172a" />
          <path d="M 34 38 L 52 46" stroke="#0f172a" strokeWidth="1.5" />
          <polygon points="42,40 43,42 45,42 43.5,43 44,45 42,44 40,45 40.5,43 39,42 41,42" fill="#facc15" />
          {/* Right Keen Eye */}
          <ellipse cx="58" cy="42" rx="3.5" ry="4.5" fill="#075985" />
          <circle cx="57" cy="40" r="1.5" fill="#ffffff" />

          {/* Gray Sailor Beard */}
          <path d="M 36 46 C 34 60 42 70 50 72 C 58 70 66 60 64 46 Q 50 50 36 46 Z" fill="#94a3b8" stroke="#64748b" strokeWidth="1" />

          {/* Captain Tricorn Hat with Anchor Crest */}
          <path d="M 20 32 L 50 14 L 80 32 C 70 38 30 38 20 32 Z" fill="#0f172a" stroke="#facc15" strokeWidth="1.5" />
          {/* Anchor Pin */}
          <circle cx="50" cy="26" r="3.5" fill="#facc15" stroke="#78350f" strokeWidth="0.8" />
        </svg>
      </div>
    );
  }

  // 7. 商人 罗伦斯 (Merchant Lawrence)
  if (type === 'merchant') {
    return (
      <div style={{ width: `${size}px`, height: `${size}px` }} className={`relative inline-flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_16px_rgba(234,179,8,0.6)] overflow-visible">
          {/* Giant Traveler Pack */}
          <path d="M 18 42 C 14 56 16 84 26 90 L 74 90 C 84 84 86 56 82 42 Z" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
          <circle cx="26" cy="46" r="5" fill="#38bdf8" filter="drop-shadow(0 0 4px #38bdf8)" />
          <circle cx="74" cy="46" r="5" fill="#ef4444" filter="drop-shadow(0 0 4px #f87171)" />

          {/* Merchant Silk Vest */}
          <path d="M 35 55 C 33 66 34 78 36 82 C 45 85 55 85 64 82 C 66 78 67 66 65 55 Z" fill="#7c3aed" stroke="#facc15" strokeWidth="1.5" />
          <circle cx="50" cy="64" r="2" fill="#facc15" />
          <circle cx="50" cy="72" r="2" fill="#facc15" />
          <ellipse cx="42" cy="91" rx="5" ry="3" fill="#451a03" stroke="#1c1917" strokeWidth="1" />
          <ellipse cx="58" cy="91" rx="5" ry="3" fill="#451a03" stroke="#1c1917" strokeWidth="1" />

          {/* Holding Shiny Gold Coin */}
          <g transform="translate(74, 58)">
            <circle cx="0" cy="0" r="6" fill="#facc15" stroke="#b45309" strokeWidth="1" filter="drop-shadow(0 0 4px #fde047)" />
            <polygon points="0,-3 1,0 4,0 2,2 3,5 0,3 -3,5 -2,2 -4,0 -1,0" fill="#fffbeb" />
          </g>

          {/* Face */}
          <ellipse cx="50" cy="44" rx="18" ry="16" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1" />
          {/* Winking Friendly Face */}
          <ellipse cx="42" cy="42" rx="3.5" ry="4.5" fill="#713f12" />
          <circle cx="41" cy="40" r="1.5" fill="#ffffff" />
          {/* Winking Right Eye */}
          <path d="M 55 42 Q 59 39 63 43" stroke="#713f12" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Dapper Curly Mustache */}
          <path d="M 42 49 Q 50 48 50 51 Q 50 48 58 49 C 62 48 64 53 60 54 Q 50 53 50 51 Q 50 53 40 54 C 36 53 38 48 42 49 Z" fill="#713f12" />

          {/* Velvet Merchant Beret with Peacock Plume */}
          <ellipse cx="48" cy="30" rx="26" ry="10" fill="#6d28d9" stroke="#facc15" strokeWidth="1.4" transform="rotate(-6 48 30)" />
          <path d="M 66 26 C 76 16 80 8 76 2 C 70 6 68 16 66 26" fill="#10b981" stroke="#047857" strokeWidth="1" />
          <circle cx="74" cy="8" r="2.5" fill="#38bdf8" />
        </svg>
      </div>
    );
  }

  // 8. 魔法导师 艾德里安 / 沃尔克 (Adrian / Volker - Academic Magic Instructor)
  // [Default NPC for all others]: Iconic handsome, dashing young wizard tutor with crimson cape and golden blonde wavy hair
  return (
    <div style={{ width: `${size}px`, height: `${size}px` }} className={`relative inline-flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_6px_18px_rgba(239,68,68,0.55)] overflow-visible">
        <defs>
          <linearGradient id="vkCape" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="45%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>
          <linearGradient id="vkHair" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="40%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
          <linearGradient id="vkTunic" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="50%" stopColor="#172554" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>

        {/* Starlight Ground Rune */}
        <ellipse cx="50" cy="94" rx="28" ry="6.5" fill="#f59e0b" opacity="0.35" filter="blur(2px)" />

        {/* Magnificent Flowing Crimson Wizard Cape with Gold Trim */}
        <path
          d="M 24 50 C 12 66 12 88 18 94 C 34 90 66 90 82 94 C 88 88 88 66 76 50 Z"
          fill="url(#vkCape)"
          stroke="#facc15"
          strokeWidth="1.5"
        />
        {/* Gold Trim Piping */}
        <path d="M 22 52 C 16 68 16 86 20 92" stroke="#fde047" strokeWidth="1.5" fill="none" />
        <path d="M 78 52 C 84 68 84 86 80 92" stroke="#fde047" strokeWidth="1.5" fill="none" />

        {/* Boots with Gold Buckles */}
        <path d="M 37 80 L 37 90 C 37 93 45 93 45 90 L 45 80 Z" fill="#78350f" stroke="#451a03" strokeWidth="1" />
        <path d="M 55 80 L 55 90 C 55 93 63 93 63 90 L 63 80 Z" fill="#78350f" stroke="#451a03" strokeWidth="1" />
        <ellipse cx="41" cy="91" rx="5.5" ry="3.5" fill="#92400e" stroke="#451a03" strokeWidth="1" />
        <ellipse cx="59" cy="91" rx="5.5" ry="3.5" fill="#92400e" stroke="#451a03" strokeWidth="1" />

        {/* Royal Scholar Tunic / Double-breasted Vest */}
        <path d="M 34 54 C 32 66 33 78 36 82 C 45 85 55 85 64 82 C 67 78 68 66 66 54 Z" fill="url(#vkTunic)" stroke="#d4af37" strokeWidth="1.4" />
        {/* Gold Frogging Buttons */}
        <circle cx="45" cy="62" r="1.5" fill="#facc15" />
        <circle cx="55" cy="62" r="1.5" fill="#facc15" />
        <circle cx="45" cy="70" r="1.5" fill="#facc15" />
        <circle cx="55" cy="70" r="1.5" fill="#facc15" />
        {/* White Ascot Cravat with Ruby Jewel */}
        <polygon points="46,54 50,62 54,54" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
        <circle cx="50" cy="57" r="1.8" fill="#ef4444" stroke="#facc15" strokeWidth="0.6" />

        {/* Left Hand: Floating Magic Spellbook */}
        <g transform="translate(18, 54)">
          <path d="M 0 4 Q 8 2 16 6 L 16 20 Q 8 16 0 18 Z" fill="#991b1b" stroke="#facc15" strokeWidth="1.2" />
          <path d="M 16 6 Q 24 2 32 4 L 32 18 Q 24 16 16 20 Z" fill="#991b1b" stroke="#facc15" strokeWidth="1.2" />
          <path d="M 2 6 Q 8 4 14 7 L 14 18 Q 8 15 2 17 Z" fill="#fef3c7" />
          <path d="M 18 7 Q 24 4 30 6 L 30 17 Q 24 15 18 18 Z" fill="#fef3c7" />
          {/* Magic Rune Sparkles */}
          <circle cx="16" cy="0" r="2" fill="#fde047" filter="drop-shadow(0 0 4px #facc15)" />
        </g>

        {/* Right Hand: Golden Starlight Wand */}
        <g transform="translate(76, 52)">
          <line x1="0" y1="26" x2="6" y2="-8" stroke="#ca8a04" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="6,-8 11,-12 6,-16 1,-12" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" filter="drop-shadow(0 0 5px #67e8f9)" />
          <circle cx="6" cy="-12" r="1.5" fill="#ffffff" />
          {/* Floating stardust */}
          <polygon points="12,-20 13,-18 15,-18 13.5,-17 14,-15 12,-16 10,-15 10.5,-17 9,-18 11,-18" fill="#fde047" />
        </g>

        {/* Charming Face */}
        <ellipse cx="50" cy="42" rx="19" ry="16.5" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1" />
        <ellipse cx="36" cy="46" rx="3.5" ry="2" fill="#f43f5e" opacity="0.35" />
        <ellipse cx="64" cy="46" rx="3.5" ry="2" fill="#f43f5e" opacity="0.35" />

        {/* Handsome Anime Eyes */}
        <ellipse cx="41" cy="41" rx="4" ry="5.5" fill="#172554" />
        <ellipse cx="41" cy="42" rx="3.5" ry="4" fill="#2563eb" />
        <ellipse cx="41" cy="44" rx="2.5" ry="2" fill="#60a5fa" />
        <circle cx="39.5" cy="38.5" r="1.6" fill="#ffffff" />
        <circle cx="42.5" cy="43" r="0.8" fill="#ffffff" />

        <ellipse cx="59" cy="41" rx="4" ry="5.5" fill="#172554" />
        <ellipse cx="59" cy="42" rx="3.5" ry="4" fill="#2563eb" />
        <ellipse cx="59" cy="44" rx="2.5" ry="2" fill="#60a5fa" />
        <circle cx="57.5" cy="38.5" r="1.6" fill="#ffffff" />
        <circle cx="60.5" cy="43" r="0.8" fill="#ffffff" />

        {/* Gentle Smiling Mouth */}
        <path d="M 47 48 Q 50 51 53 48" stroke="#ea580c" strokeWidth="1.3" fill="none" strokeLinecap="round" />

        {/* Golden Blonde Wavy Bangs & Locks */}
        <path
          d="M 28 35 C 34 44 40 45 44 38 C 48 46 54 46 58 38 C 64 45 70 42 72 35 C 68 26 44 24 28 35 Z"
          fill="url(#vkHair)"
          stroke="#ca8a04"
          strokeWidth="1"
        />
        <path d="M 26 36 C 24 44 26 50 28 52 C 29 46 29 42 30 38 Z" fill="url(#vkHair)" />
        <path d="M 74 36 C 76 44 74 50 72 52 C 71 46 71 42 70 38 Z" fill="url(#vkHair)" />

        {/* Classic Crimson & Gold Magician Hat */}
        <ellipse cx="50" cy="30" rx="27" ry="8.5" fill="#dc2626" stroke="#991b1b" strokeWidth="1.2" />
        <ellipse cx="50" cy="30" rx="24" ry="7" fill="none" stroke="#facc15" strokeWidth="1" />
        {/* Curled Pointy Hat Cone */}
        <path
          d="M 30 29 C 32 18 44 6 64 2 C 60 7 56 12 68 16 C 74 18 73 24 70 29 Z"
          fill="#dc2626"
          stroke="#991b1b"
          strokeWidth="1.2"
        />
        {/* Gold Belt & Star Buckle */}
        <path d="M 31 29 Q 50 32 69 29" stroke="#facc15" strokeWidth="3" fill="none" />
        <polygon
          points="50,25 51.5,28 54.5,28.5 52,30.5 53,33.5 50,32 47,33.5 48,30.5 45.5,28.5 48.5,28"
          fill="#fde047"
          stroke="#78350f"
          strokeWidth="0.8"
          filter="drop-shadow(0 0 3px #fde047)"
        />
        {/* Dangling Gold Star at the Hat Tip */}
        <polygon points="66,1 67,3 69,3 67.5,4.5 68,6.5 66,5.5 64,6.5 64.5,4.5 63,3 65,3" fill="#fde047" />
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
