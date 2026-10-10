import React from 'react';
import { CultivatorPortrait } from './CultivatorPortrait';
import { sound } from '../utils/audio';
import { IconGuluBall, IconRocoCoin, IconSpellbook } from './GameIcons';
import { X, Sparkles, Award, Shield, Zap } from 'lucide-react';

interface CharacterDetailModalProps {
  playerName: string;
  playerLevel?: number;
  playerTitle?: string;
  coins?: number;
  currentGold?: number;
  spiritGems?: number;
  partyCount?: number;
  onClose: () => void;
}

/**
 * 皇家学院 · 小魔法师档案 (Young Wizard Dossier Modal)
 * 100% Western Fantasy Roco Kingdom Style:
 * - Academy Wizard Rank, Magic Power EXP, Royal Equipment & Badges
 */
export const CharacterDetailModal: React.FC<CharacterDetailModalProps> = ({
  playerName,
  playerLevel = 25,
  playerTitle = '见习魔法使 · 皇家学者',
  coins,
  currentGold = 3280,
  spiritGems = 168,
  partyCount = 1,
  onClose,
}) => {
  const displayGold = coins ?? currentGold;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#0a1829] via-[#06121f] to-[#040c17] rounded-3xl border-2 border-[#b8860b]/50 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Decorative Gilded Corner Brackets */}
        <div className="corner-ornament-tl" />
        <div className="corner-ornament-tr" />
        <div className="corner-ornament-bl" />
        <div className="corner-ornament-br" />

        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#b8860b]/40 bg-gradient-to-b from-[#081a2e]/95 via-[#061426]/90 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/30 border-2 border-[#d4af37]/60 flex items-center justify-center text-amber-300 shadow-md">
              <IconSpellbook size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black roco-gold-text roco-title-font flex items-center gap-2">
                  <span>皇家学院 · 小魔法师档案</span>
                </h2>
                <span className="roco-seal text-[10px] px-1.5 py-0.2 font-bold tracking-wider">
                  魔法
                </span>
                <span className="text-[10px] bg-blue-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-400/40">
                  皇家学员
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">王国星辰星图 · 记录小洛克的奇幻成长历程</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="roco-close-btn shrink-0"
            title="关闭档案"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Body (2 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 overflow-y-auto flex-1">
          {/* Left Column: Full-height Character Artwork */}
          <div className="md:col-span-5 flex flex-col items-center justify-center relative p-4 rounded-2xl bg-gradient-to-b from-blue-950/30 via-slate-950/60 to-black/80 border border-cyan-500/25 shadow-inner">
            {/* Background Halo */}
            <div className="absolute w-56 h-56 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

            <CultivatorPortrait mode="full" className="w-full max-w-[280px]" />

            <div className="mt-2 text-center">
              <span className="text-xs font-bold text-amber-300 bg-blue-950/80 border border-amber-500/40 px-3 py-1 rounded-full shadow-md">
                ✦ {playerName} · 魔法学院二年级
              </span>
            </div>
          </div>

          {/* Right Column: Magic Stats & Equipment */}
          <div className="md:col-span-7 space-y-4">
            {/* 1. Basic Stats Card */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-base font-black text-white">{playerName}</div>
                  <div className="text-xs text-cyan-400 font-medium">称号：{playerTitle}</div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black font-mono text-amber-300">Lv.{playerLevel}</span>
                  <div className="text-[10px] text-slate-400">皇家骑士团预备役 · {partyCount} 只随行魔灵</div>
                </div>
              </div>

              {/* Cultivation Energy Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300 font-mono">
                  <span>学院魔力成长进度:</span>
                  <span className="text-amber-300 font-bold">18,500 / 20,000</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden p-0.5 border border-cyan-500/30">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-amber-400 rounded-full"
                    style={{ width: '92.5%' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">魔力灵性</div>
                  <div className="text-sm font-bold text-emerald-300">245</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">知识奥秘</div>
                  <div className="text-sm font-bold text-cyan-300">320</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center justify-center">
                  <div className="text-[10px] text-slate-400">洛克贝</div>
                  <div className="text-sm font-bold text-amber-300 font-mono flex items-center gap-1">
                    <IconRocoCoin size={14} />
                    <span>{displayGold}</span>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">洛克魔晶</div>
                  <div className="text-sm font-bold text-cyan-400 font-mono">{spiritGems}</div>
                </div>
              </div>
            </div>

            {/* 2. Bound Equipment */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/30 space-y-2.5">
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>佩戴学院魔法装备 · 皇家秘宝</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-blue-950/40 border border-cyan-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center font-bold text-amber-300 text-xs">
                      杖
                    </div>
                    <div>
                      <div className="font-bold text-cyan-200">星辰法杖 (格里芬院长亲授)</div>
                      <div className="text-[10px] text-slate-400">蕴含群星奥术能量，全元素技能威力提升</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 border border-cyan-500/40 px-2 py-0.5 rounded">
                    魔攻加成 +35%
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-400 flex items-center justify-center font-bold text-teal-300 text-xs">
                      袍
                    </div>
                    <div>
                      <div className="font-bold text-slate-200">皇家学院金边魔导袍</div>
                      <div className="text-[10px] text-slate-400">皇家工坊高级附魔编织，抵御野外魔灵突袭</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 border border-cyan-500/40 px-2 py-0.5 rounded">
                    魔抗防护 +28
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400 flex items-center justify-center font-bold text-amber-300 text-xs">
                      球
                    </div>
                    <div>
                      <div className="font-bold text-slate-200">国王咕噜球徽章</div>
                      <div className="text-[10px] text-slate-400">皇家骑士团荣誉，大幅提升野外捕捉概率</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
                    捕捉率 +15%
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Little Wizard Honors */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-950/50 to-blue-950/30 border border-[#b8860b]/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-slate-300">洛克王国格言：</span>
                <span className="text-amber-200 font-bold italic">“善良、勇敢与智慧是魔法的真谛。”</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
