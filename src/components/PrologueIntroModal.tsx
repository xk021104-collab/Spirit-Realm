import React, { useState } from 'react';
import { PetInstance } from '../types/game';
import { PET_SPECIES } from '../data/species';
import { createPetInstance } from '../utils/battleEngine';
import { PetAvatar, ELEMENT_COLORS } from './PetAvatar';
import { NpcAvatar } from './PlayerAvatar';
import { sound } from '../utils/audio';
import { Sparkles, Flame, Droplets, Trees, ChevronRight, Award, Compass, Shield } from 'lucide-react';

interface PrologueIntroModalProps {
  onCompletePrologue: (starterPet: PetInstance, playerName: string) => void;
}

export const PrologueIntroModal: React.FC<PrologueIntroModalProps> = ({ onCompletePrologue }) => {
  const [step, setStep] = useState<'STORY' | 'CHOOSE_STARTER'>('STORY');
  const [selectedStarterId, setSelectedStarterId] = useState<'chiyanque' | 'bishuiling' | 'qingmulu'>('chiyanque');
  const [playerName, setPlayerName] = useState<string>('云游灵契师');

  const starterOptions = [
    {
      id: 'chiyanque' as const,
      icon: Flame,
      color: 'text-rose-400',
      bg: 'bg-rose-950/50 border-rose-500/50',
      activeBg: 'bg-rose-900/80 border-rose-400 ring-2 ring-rose-400/80 shadow-[0_0_20px_rgba(244,63,94,0.4)]',
      trait: '极致物攻 · 极速突袭 · 烈火涅槃',
    },
    {
      id: 'bishuiling' as const,
      icon: Droplets,
      color: 'text-cyan-400',
      bg: 'bg-cyan-950/50 border-cyan-500/50',
      activeBg: 'bg-cyan-900/80 border-cyan-400 ring-2 ring-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.4)]',
      trait: '稳固物防 · 特防出众 · 碧海波涛',
    },
    {
      id: 'qingmulu' as const,
      icon: Trees,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/50 border-emerald-500/50',
      activeBg: 'bg-emerald-900/80 border-emerald-400 ring-2 ring-emerald-400/80 shadow-[0_0_20px_rgba(16,185,129,0.4)]',
      trait: '生机回复 · 均衡成长 · 万木归一',
    },
  ];

  const currentSpecies = PET_SPECIES[selectedStarterId];

  const handleConfirmStarter = () => {
    sound.playCatchSuccess();
    const starterPet = createPetInstance(selectedStarterId, 5, currentSpecies.name);
    onCompletePrologue(starterPet, playerName.trim() || '灵契使徒');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="flash-frame rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col text-slate-100">
        {/* Step 1: Epic Opening Narrative */}
        {step === 'STORY' && (
          <div className="p-8 md:p-10 flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-amber-400 bg-gradient-to-b from-indigo-950 to-slate-900 p-1 shadow-2xl flex items-center justify-center">
                <NpcAvatar type="griffin" size={82} />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-yellow-200 shadow">
                圣殿大长老
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                《幻灵秘境》· 启程序章
              </span>
              <h2 className="text-3xl font-black text-amber-300 tracking-tight game-title-font">
                天极异动 · 灵契降临
              </h2>
            </div>

            <div className="p-6 rounded-2xl flash-panel text-xs md:text-sm text-slate-200 leading-relaxed text-left space-y-3 max-w-xl border-2 border-amber-500/60 shadow-inner">
              <p className="indent-6">
                “年轻的灵契师，欢迎踏入<strong>《幻灵秘境》</strong>的大陆腹地。”
              </p>
              <p className="indent-6">
                “自远古纪元以来，圣殿悬浮的九彩灵晶调和着天地五行灵脉，飞禽走兽皆化为天地幻灵，与人同修。然而近日，地脉裂缝隐现，各界野外幻灵躁动不安……”
              </p>
              <p className="indent-6 text-amber-300 font-semibold">
                “吾观你神魂清澈、灵觉通透，今日特在此赐予你初始灵契令，去寻觅与你命格相合的第一只本命幻灵吧！”
              </p>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setStep('CHOOSE_STARTER');
              }}
              className="flash-gold-btn py-3.5 px-8 rounded-2xl text-base cursor-pointer flex items-center gap-2 shadow-xl"
            >
              <span>恭领圣命 · 前往挑选本命幻灵</span>
              <ChevronRight className="w-5 h-5 text-slate-950" />
            </button>
          </div>
        )}

        {/* Step 2: Choose Starter Phantom Spirit */}
        {step === 'CHOOSE_STARTER' && (
          <div className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-2xl font-black text-amber-300 game-title-font">缔结契约 · 挑选御三家本命幻灵</h3>
              <p className="text-xs text-slate-400">选择跟随你一生的初始伙伴，它将伴随你成长并在 Lv.16 与 Lv.36 完成华丽化形蜕变！</p>
            </div>

            {/* Three Starter Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {starterOptions.map((opt) => {
                const sp = PET_SPECIES[opt.id];
                const isSelected = selectedStarterId === opt.id;
                const elColor = ELEMENT_COLORS[sp.type];

                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedStarterId(opt.id);
                    }}
                    className={`p-4 rounded-2xl border-2 text-center flex flex-col items-center justify-between transition-all cursor-pointer relative ${
                      isSelected ? opt.activeBg : `${opt.bg} hover:border-amber-400/60`
                    }`}
                  >
                    <div className="w-full flex items-center justify-between text-[11px] mb-2">
                      <span className={`px-2 py-0.5 rounded font-bold ${elColor.bg} ${elColor.text}`}>
                        {elColor.label}系
                      </span>
                      <span className="text-amber-300 font-mono text-[10px] font-bold">御三家初阶</span>
                    </div>

                    <div className="py-2">
                      <PetAvatar speciesId={sp.id} size={82} />
                    </div>

                    <div className="w-full mt-2">
                      <div className="font-black text-base text-white game-title-font">{sp.name}</div>
                      <div className="text-[10px] text-amber-300/90 font-medium mt-0.5">{sp.title}</div>
                      <p className="text-[11px] text-slate-300 mt-2 line-clamp-2 leading-relaxed">{sp.description}</p>
                      <div className="text-[10px] text-amber-200 font-mono bg-black/50 py-1 px-2 rounded-lg mt-3 border border-amber-500/20">
                        {opt.trait}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Player Name Input & Bestowal Details */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl flash-panel">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-xs text-amber-300 font-bold whitespace-nowrap">灵契师尊号:</span>
                <input
                  type="text"
                  maxLength={8}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="输入你的名字..."
                  className="px-3 py-1.5 bg-slate-950 border border-amber-500/50 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 w-full sm:w-44 font-bold"
                />
              </div>

              <div className="text-right text-xs text-slate-300">
                契约礼赠: <span className="text-amber-300 font-bold font-mono">1000 灵石</span> ·{' '}
                <span className="text-cyan-300 font-bold font-mono">初阶灵契晶 x5</span>
              </div>
            </div>

            {/* Confirmation CTA */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep('STORY')}
                className="text-xs text-slate-400 hover:text-white cursor-pointer underline"
              >
                返回查看序言
              </button>

              <button
                onClick={handleConfirmStarter}
                className="flash-gold-btn py-3 px-8 rounded-2xl text-sm cursor-pointer flex items-center gap-2 shadow-xl"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>与【{currentSpecies.name}】缔结契约 · 开启冒险</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
