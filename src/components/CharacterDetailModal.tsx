import React from 'react';
import { CultivatorPortrait } from './CultivatorPortrait';
import { sound } from '../utils/audio';
import { X, Sparkles, Compass, Shield, Zap, Award } from 'lucide-react';

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
 * 天命之人 · 御灵仙师录 (Character Details Modal)
 * Authentic Xianxia / Eastern Fantasy aesthetic:
 * - Daoist Cultivation Rank, Five Elements Spiritual Roots, Sacred Talismans & Bagua Medallion
 * - 100% Genuine Huan Ling Mi Jing Eastern Fantasy Lore
 */
export const CharacterDetailModal: React.FC<CharacterDetailModalProps> = ({
  playerName,
  playerLevel = 25,
  playerTitle = '诸天巡游 · 灵契神师',
  coins,
  currentGold = 3280,
  spiritGems = 168,
  partyCount = 1,
  onClose,
}) => {
  const displayGold = coins ?? currentGold;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#0b172a] via-[#091124] to-[#040816] rounded-3xl border-2 border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/30 bg-indigo-950/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center">
              <Compass className="w-4 h-4 text-cyan-300 animate-spin" style={{ animationDuration: '20s' }} />
            </div>
            <div>
              <h2 className="text-lg font-black text-amber-200 game-title-font flex items-center gap-2">
                <span>天命之人 · 御灵仙师录</span>
                <span className="text-[10px] bg-cyan-600/60 text-cyan-200 px-2 py-0.5 rounded-full border border-cyan-400/50">
                  五行天灵根
                </span>
              </h2>
              <p className="text-[11px] text-cyan-300/80">八卦神霄罗盘 · 召唤本命玄天灵宠</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer border border-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
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
                ✦ {playerName} · 灵契神宗传人
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
                  <div className="text-xs text-cyan-400 font-medium">道号：{playerTitle}</div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black font-mono text-amber-300">Lv.{playerLevel}</span>
                  <div className="text-[10px] text-slate-400">凝神境后期 · {partyCount} 尊随行</div>
                </div>
              </div>

              {/* Cultivation Energy Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300 font-mono">
                  <span>仙道道行修积:</span>
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
                  <div className="text-[10px] text-slate-400">神识道韵</div>
                  <div className="text-sm font-bold text-emerald-300">245</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">天地通玄</div>
                  <div className="text-sm font-bold text-cyan-300">320</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">灵石储量</div>
                  <div className="text-sm font-bold text-amber-300 font-mono">{displayGold}</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">仙晶玉髓</div>
                  <div className="text-sm font-bold text-cyan-400 font-mono">{spiritGems}</div>
                </div>
              </div>
            </div>

            {/* 2. Bound Equipment */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/30 space-y-2.5">
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>佩戴本命灵宝 · 宗门赐宝</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-blue-950/40 border border-cyan-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center font-bold text-amber-300 text-xs">
                      佩
                    </div>
                    <div>
                      <div className="font-bold text-cyan-200">九天神霄灵玉 (宗门至宝)</div>
                      <div className="text-[10px] text-slate-400">圣殿大长老亲赐，佩戴时五行仙术威力提升</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 border border-cyan-500/40 px-2 py-0.5 rounded">
                    道法加成 +35%
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-400 flex items-center justify-center font-bold text-teal-300 text-xs">
                      袍
                    </div>
                    <div>
                      <div className="font-bold text-slate-200">流云乾坤法袍</div>
                      <div className="text-[10px] text-slate-400">天蚕九华灵丝织就，抵御天地风暴与罡煞</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 border border-cyan-500/40 px-2 py-0.5 rounded">
                    仙体防御 +28
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400 flex items-center justify-center font-bold text-amber-300 text-xs">
                      囊
                    </div>
                    <div>
                      <div className="font-bold text-slate-200">太虚灵契宝玉袋</div>
                      <div className="text-[10px] text-slate-400">内置乾坤芥子空间，大幅提升灵契捕获几率</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
                    缔契概率 +20%
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Elemental Alignment */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-slate-950/60 border border-cyan-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center -space-x-1">
                  <div className="w-6 h-6 rounded-full bg-rose-600/80 border border-rose-300 flex items-center justify-center text-[10px] text-white">火</div>
                  <div className="w-6 h-6 rounded-full bg-cyan-600/80 border border-cyan-300 flex items-center justify-center text-[10px] text-white">水</div>
                  <div className="w-6 h-6 rounded-full bg-emerald-600/80 border border-emerald-300 flex items-center justify-center text-[10px] text-white">木</div>
                  <div className="w-6 h-6 rounded-full bg-amber-600/80 border border-amber-300 flex items-center justify-center text-[10px] text-white">雷</div>
                </div>
                <div>
                  <div className="font-bold text-amber-200">五行灵根共鸣 · 天地贯通</div>
                  <div className="text-[10px] text-slate-400">所有系别本命幻灵随行时仙术威力提升 15%</div>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playCatchSuccess();
                }}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                感悟天道
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
