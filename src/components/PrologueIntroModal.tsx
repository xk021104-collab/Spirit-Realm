import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PetInstance } from '../types/game';
import { PET_SPECIES } from '../data/species';
import { createPetInstance } from '../utils/battleEngine';
import { PetAvatar, ELEMENT_COLORS } from './PetAvatar';
import { NpcAvatar } from './PlayerAvatar';
import { sound } from '../utils/audio';
import { Sparkles, Flame, Droplets, Trees, ChevronRight, Award, Compass, Shield, Zap } from 'lucide-react';

interface PrologueIntroModalProps {
  onCompletePrologue: (starterPet: PetInstance, playerName: string) => void;
}

export const PrologueIntroModal: React.FC<PrologueIntroModalProps> = ({ onCompletePrologue }) => {
  const [step, setStep] = useState<'STORY' | 'CHOOSE_STARTER'>('STORY');
  const [selectedStarterId, setSelectedStarterId] = useState<'chiyanque' | 'bishuiling' | 'qingmulu'>('chiyanque');
  const [playerName, setPlayerName] = useState<string>('小魔法师');

  const starterOptions = [
    {
      id: 'chiyanque' as const,
      icon: Flame,
      color: 'text-rose-400',
      bg: 'bg-rose-950/40 border-rose-500/30',
      activeBg: 'bg-gradient-to-b from-rose-950/90 via-orange-950/70 to-slate-950 border-rose-400 ring-2 ring-rose-400/80 shadow-[0_0_32px_rgba(244,63,94,0.55)]',
      trait: '极致物攻 · 极速突袭 · 烈火燎原',
      glowColor: 'rgba(249, 115, 22, 0.75)',
      ringColor: 'border-orange-500/70 bg-orange-500/20 shadow-[0_0_18px_rgba(249,115,22,0.6)]',
      floatDuration: 3.0,
      breathDelay: 0,
      elementLabel: '火系 · 赤焰雀',
      loreBadge: '炽火魔羽',
    },
    {
      id: 'bishuiling' as const,
      icon: Droplets,
      color: 'text-cyan-400',
      bg: 'bg-cyan-950/40 border-cyan-500/30',
      activeBg: 'bg-gradient-to-b from-cyan-950/90 via-sky-950/70 to-slate-950 border-cyan-400 ring-2 ring-cyan-400/80 shadow-[0_0_32px_rgba(6,182,212,0.55)]',
      trait: '稳固物防 · 特防出众 · 碧海波涛',
      glowColor: 'rgba(56, 189, 248, 0.75)',
      ringColor: 'border-cyan-400/70 bg-cyan-500/20 shadow-[0_0_18px_rgba(6,182,212,0.6)]',
      floatDuration: 3.4,
      breathDelay: 0.35,
      elementLabel: '水系 · 碧水灵',
      loreBadge: '纯澈水韵',
    },
    {
      id: 'qingmulu' as const,
      icon: Trees,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/40 border-emerald-500/30',
      activeBg: 'bg-gradient-to-b from-emerald-950/90 via-teal-950/70 to-slate-950 border-emerald-400 ring-2 ring-emerald-400/80 shadow-[0_0_32px_rgba(16,185,129,0.55)]',
      trait: '生机回复 · 均衡成长 · 森林守护',
      glowColor: 'rgba(34, 197, 94, 0.75)',
      ringColor: 'border-emerald-400/70 bg-emerald-500/20 shadow-[0_0_18px_rgba(16,185,129,0.6)]',
      floatDuration: 3.2,
      breathDelay: 0.7,
      elementLabel: '草系 · 青木鹿',
      loreBadge: '自然生机',
    },
  ];

  const currentSpecies = PET_SPECIES[selectedStarterId];

  const handleConfirmStarter = () => {
    sound.playCatchSuccess();
    const starterPet = createPetInstance(selectedStarterId, 5, currentSpecies.name);
    onCompletePrologue(starterPet, playerName.trim() || '小魔法师');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative rounded-3xl w-full max-w-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col text-slate-100 border-2 border-[#b8860b]/50 bg-gradient-to-b from-[#0a1829] via-[#06121f] to-[#040c17]">
        {/* Decorative Gilded Corner Brackets */}
        <div className="corner-ornament-tl" />
        <div className="corner-ornament-tr" />
        <div className="corner-ornament-bl" />
        <div className="corner-ornament-br" />

        <AnimatePresence mode="wait">
          {/* Step 1: Epic Opening Narrative with Headmaster Griffin */}
          {step === 'STORY' && (
            <motion.div
              key="step-story"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="p-8 md:p-10 flex flex-col items-center text-center space-y-6"
            >
              {/* Beloved Headmaster Griffin with Floating Magic Starlight Aura */}
              <div className="relative">
                <motion.div
                  animate={{
                    y: [0, -6, 0],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative"
                >
                  {/* Floating Wisdom Aura Ring */}
                  <motion.div
                    animate={{
                      scale: [0.95, 1.08, 0.95],
                      opacity: [0.6, 0.95, 0.6],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute -inset-2.5 rounded-full bg-gradient-to-r from-amber-500/40 via-yellow-400/30 to-indigo-500/40 blur-md pointer-events-none"
                  />
                  <div className="relative w-26 h-26 rounded-full border-4 border-[#d4af37] bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 p-1 shadow-2xl flex items-center justify-center">
                    <NpcAvatar type="griffin" size={88} />
                  </div>
                </motion.div>
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-yellow-200 shadow-lg roco-title-font">
                  学院院长 · 阿尔弗雷德
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs font-mono font-bold tracking-widest text-amber-300 uppercase">
                    《星灵王国》· 魔法学徒启程
                  </span>
                  <span className="roco-seal text-[10px] px-1.5 py-0.2 font-bold tracking-wider">
                    序幕
                  </span>
                </div>
                <h2 className="text-3xl font-black roco-gold-text tracking-tight roco-title-font">
                  魔法学院 · 挑选初始宠物
                </h2>
              </div>

              <div className="p-6 rounded-2xl roco-panel text-xs md:text-sm text-slate-200 leading-relaxed text-left space-y-3 max-w-xl border border-[#b8860b]/50 shadow-inner">
                <p className="indent-6">
                  “你好，年轻的小魔法师！欢迎来到充满奇迹与冒险的<strong>《星灵王国》</strong>！”
                </p>
                <p className="indent-6">
                  “在广袤的魔法大陆上，生活着众多不可思议的魔法宠物。从蔚蓝海湾到炽热的烈焰峡谷，每一个角落都等待着勇敢的见习魔法师去探索！”
                </p>
                <p className="indent-6 text-amber-300 font-semibold">
                  “作为初入魔法学院的见习魔法师，你需要挑选一只忠诚的宠物作为你的第一位冒险伙伴。来吧，挑选属于你的初始伙伴，握紧魔杖，开启属于你的魔法传奇吧！”
                </p>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  setStep('CHOOSE_STARTER');
                }}
                className="roco-turn-capsule py-3 px-8 text-slate-950 text-sm font-black cursor-pointer flex items-center gap-2 shadow-xl hover:scale-105 transition-transform"
              >
                <span>聆听院长嘱托 · 挑选初始宠物</span>
                <ChevronRight className="w-5 h-5 text-slate-950" />
              </button>
            </motion.div>
          )}

          {/* Step 2: Choose Starter Phantom Spirit */}
          {step === 'CHOOSE_STARTER' && (
            <motion.div
              key="step-choose"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="p-6 md:p-8 space-y-6"
            >
              <div className="text-center space-y-1">
                <h3 className="text-2xl font-black text-amber-300 game-title-font">魔法契约 · 挑选御三家初始宠物</h3>
                <p className="text-xs text-slate-400">选择跟随你的初始伙伴，它将伴随你成长并在 Lv.16 与 Lv.36 完成华丽进化！</p>
              </div>

              {/* Three Starter Cards with Motion-powered Breathing & Hover */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {starterOptions.map((opt) => {
                  const sp = PET_SPECIES[opt.id];
                  const isSelected = selectedStarterId === opt.id;
                  const elColor = ELEMENT_COLORS[sp.type];

                  return (
                    <motion.button
                      key={opt.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedStarterId(opt.id);
                      }}
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className={`p-4 rounded-2xl border-2 text-center flex flex-col items-center justify-between transition-colors cursor-pointer relative overflow-hidden group ${
                        isSelected ? opt.activeBg : `${opt.bg} hover:border-amber-400/60`
                      }`}
                    >
                      {/* Active Radial Background Glow */}
                      {isSelected && (
                        <div
                          className="absolute inset-0 pointer-events-none opacity-40 blur-xl transition-opacity"
                          style={{
                            background: `radial-gradient(circle at 50% 40%, ${opt.glowColor} 0%, transparent 70%)`,
                          }}
                        />
                      )}

                      <div className="w-full flex items-center justify-between text-[11px] mb-2 relative z-10">
                        <span className={`px-2 py-0.5 rounded font-bold shadow-sm ${elColor.bg} ${elColor.text}`}>
                          {elColor.label}系
                        </span>
                        <span className="text-amber-300 font-mono text-[10px] font-bold">
                          {opt.loreBadge}
                        </span>
                      </div>

                      {/* Animated Breathing & Floating Spirit Pedestal */}
                      <div className="py-4 my-1 relative flex flex-col items-center justify-center w-full min-h-[140px]">
                        {/* Dynamic Ground Spiritual Qi Shadow (Synchronized Inverse Contraction) */}
                        <motion.div
                          animate={{
                            scaleX: [1.1, 0.82, 1.1],
                            scaleY: [1.1, 0.82, 1.1],
                            opacity: [0.65, 0.28, 0.65],
                          }}
                          transition={{
                            duration: opt.floatDuration,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: opt.breathDelay,
                          }}
                          className="absolute bottom-1 w-20 h-5 rounded-full bg-black/60 blur-xs pointer-events-none"
                        />

                        {/* Concentric Floating Elemental Aura Rings with Breathing Expansion */}
                        <motion.div
                          animate={{
                            scale: [0.92, 1.18, 0.92],
                            opacity: [0.35, 0.8, 0.35],
                          }}
                          transition={{
                            duration: opt.floatDuration * 0.9,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: opt.breathDelay,
                          }}
                          className={`absolute w-24 h-8 rounded-full border ${opt.ringColor} blur-xs bottom-1 pointer-events-none`}
                        />

                        {/* Floating & Breathing Sprite Container (Web Animation Library: motion) */}
                        <motion.div
                          animate={{
                            y: [0, -11, 0],
                            scale: isSelected ? [1.08, 1.14, 1.08] : [1, 1.055, 1],
                            rotate: [-1.2, 1.2, -1.2],
                          }}
                          transition={{
                            duration: opt.floatDuration,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: opt.breathDelay,
                          }}
                          className="relative z-10"
                        >
                          <div
                            className="transition-all duration-300"
                            style={{
                              filter: isSelected
                                ? `drop-shadow(0 10px 22px ${opt.glowColor})`
                                : 'drop-shadow(0 4px 10px rgba(0,0,0,0.4))',
                            }}
                          >
                            <PetAvatar speciesId={sp.id} size={96} />
                          </div>

                          {/* Floating Elemental Starlight Particles when Selected */}
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="absolute -top-1 -right-1 flex items-center gap-0.5"
                            >
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                              >
                                <Sparkles className="w-4 h-4 text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.9)]" />
                              </motion.div>
                            </motion.div>
                          )}
                        </motion.div>
                      </div>

                      <div className="w-full mt-2 relative z-10">
                        <div className="font-black text-base text-white game-title-font flex items-center justify-center gap-1.5">
                          <span>{sp.name}</span>
                          {isSelected && <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />}
                        </div>
                        <div className="text-[10px] text-amber-300/90 font-medium mt-0.5">{sp.title}</div>
                        <p className="text-[11px] text-slate-300 mt-2 line-clamp-2 leading-relaxed">{sp.description}</p>
                        <div className="text-[10px] text-amber-200 font-mono bg-black/60 py-1 px-2 rounded-lg mt-3 border border-amber-500/30 shadow-inner">
                          {opt.trait}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Player Name Input & Bestowal Details */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl roco-panel border border-[#b8860b]/40">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className="text-xs text-amber-300 font-bold whitespace-nowrap roco-title-font">魔法师姓名:</span>
                  <input
                    type="text"
                    maxLength={8}
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="输入你的魔法师昵称..."
                    className="px-3 py-1.5 bg-[#061426] border border-amber-500/50 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 w-full sm:w-44 font-bold shadow-inner"
                  />
                </div>

                <div className="text-right text-xs text-slate-300">
                  学院赠礼: <span className="text-amber-300 font-bold font-mono">1000 星辉金币</span> ·{' '}
                  <span className="text-cyan-300 font-bold font-mono">初级星灵球 x5</span>
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
                  className="roco-turn-capsule py-3 px-8 text-sm cursor-pointer flex items-center gap-2 shadow-xl hover:scale-105 transition-transform text-slate-950 font-black"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>收服【{currentSpecies.name}】· 开启王国冒险</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
