import React, { useState } from 'react';
import { Quest, SceneId } from '../types/game';
import { ITEMS_DATA } from '../data/items';
import { sound } from '../utils/audio';
import {
  ScrollText,
  Compass,
  CheckCircle2,
  Clock,
  Lock,
  Gift,
  ChevronRight,
  X,
  Sparkles,
  Award,
} from 'lucide-react';

interface QuestTrackerProps {
  quests: Quest[];
  onClaimReward: (questId: string) => void;
  onNavigateToLocation?: (sceneId: SceneId) => void;
}

export const QuestTracker: React.FC<QuestTrackerProps> = ({
  quests,
  onClaimReward,
  onNavigateToLocation,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedQuestId, setSelectedQuestId] = useState<string>(() => {
    const active = quests.find((q) => q.status === 'ACTIVE' || q.status === 'COMPLETED');
    return active ? active.id : quests[0]?.id;
  });

  // Find the primary active or claimable quest for the mini HUD
  const currentActiveQuest =
    quests.find((q) => q.status === 'COMPLETED') ||
    quests.find((q) => q.status === 'ACTIVE') ||
    quests[quests.length - 1];

  const selectedQuest = quests.find((q) => q.id === selectedQuestId) || currentActiveQuest;

  return (
    <>
      {/* 1. HUD Floating Mini Tracker (Top-Right under Nav) */}
      <div className="relative z-30">
        <button
          onClick={() => {
            sound.playClick();
            setIsModalOpen(true);
          }}
          className={`group flex items-center gap-3 p-2.5 px-3.5 rounded-xl border backdrop-blur-md shadow-xl transition-all cursor-pointer text-left ${
            currentActiveQuest?.status === 'COMPLETED'
              ? 'bg-amber-950/80 border-amber-400/80 hover:bg-amber-900/90 ring-1 ring-amber-400/40 animate-pulse'
              : 'bg-slate-900/80 border-slate-700/80 hover:bg-slate-800/90'
          }`}
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              currentActiveQuest?.status === 'COMPLETED'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30'
            }`}
          >
            {currentActiveQuest?.status === 'COMPLETED' ? (
              <Gift className="w-4 h-4 animate-bounce" />
            ) : (
              <ScrollText className="w-4 h-4" />
            )}
          </div>

          <div className="max-w-[210px] truncate">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400">
              <span>{currentActiveQuest?.chapter}</span>
              {currentActiveQuest?.status === 'COMPLETED' && (
                <span className="bg-amber-400 text-slate-950 px-1 rounded font-bold">可领奖</span>
              )}
            </div>
            <div className="font-bold text-xs text-white truncate">{currentActiveQuest?.title}</div>
            <div className="text-[10px] text-slate-400 truncate">
              {currentActiveQuest?.status === 'COMPLETED'
                ? '已达成！点击领取奖励'
                : `目标: ${currentActiveQuest?.targetLocationName}`}
            </div>
          </div>

          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-300 transition-colors shrink-0 ml-1" />
        </button>
      </div>

      {/* 2. Full Quest Log / Adventure Diary Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 md:p-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl h-[88vh] max-h-[760px] flex flex-col shadow-2xl overflow-hidden text-slate-100">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                  <ScrollText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-amber-300 tracking-wide flex items-center gap-2">
                    洛克冒险手札 <span className="text-xs text-slate-400 font-normal">Quest Log</span>
                  </h2>
                  <p className="text-xs text-slate-400">跟随主线剧情，解开洛克王国暗黑危机与元素奥秘</p>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  setIsModalOpen(false);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content: Left Quest List / Right Details */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
              {/* Left: Quest Chapters List (5 cols) */}
              <div className="md:col-span-5 border-r border-slate-800 p-4 overflow-y-auto space-y-2 bg-slate-950/20">
                {quests.map((q) => {
                  const isSelected = selectedQuestId === q.id;
                  const isCompleted = q.status === 'COMPLETED';
                  const isClaimed = q.status === 'CLAIMED';
                  const isActive = q.status === 'ACTIVE';
                  const isLocked = q.status === 'LOCKED';

                  return (
                    <button
                      key={q.id}
                      disabled={isLocked}
                      onClick={() => {
                        sound.playClick();
                        setSelectedQuestId(q.id);
                      }}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-950/40 border-amber-400 shadow-md ring-1 ring-amber-400/40'
                          : isCompleted
                          ? 'bg-emerald-950/30 border-emerald-500/40 hover:bg-emerald-900/30'
                          : isClaimed
                          ? 'bg-slate-900/60 border-slate-800 text-slate-400'
                          : isActive
                          ? 'bg-slate-900 border-slate-700 hover:border-slate-500'
                          : 'bg-slate-950 border-slate-900 opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <div className="space-y-1 max-w-[230px]">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-amber-400/90 font-semibold">{q.chapter}</span>
                          {isCompleted && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-amber-400 text-slate-950">
                              可领奖
                            </span>
                          )}
                          {isClaimed && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded text-emerald-400 font-mono">已完成</span>
                          )}
                        </div>
                        <div className="font-bold text-xs text-white truncate">{q.title}</div>
                      </div>

                      <div className="shrink-0 ml-2">
                        {isClaimed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : isCompleted ? (
                          <Gift className="w-4 h-4 text-amber-400 animate-bounce" />
                        ) : isActive ? (
                          <Clock className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right: Quest Detail Dossier (7 cols) */}
              <div className="md:col-span-7 p-6 overflow-y-auto bg-slate-900/60 flex flex-col justify-between">
                {selectedQuest ? (
                  <div className="space-y-6">
                    {/* Chapter & Title */}
                    <div className="space-y-2 border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{selectedQuest.chapter}</span>
                      </div>
                      <h3 className="text-xl font-black text-white">{selectedQuest.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>目标地点: {selectedQuest.targetLocationName}</span>
                        <span>·</span>
                        <span
                          className={`font-semibold ${
                            selectedQuest.status === 'COMPLETED'
                              ? 'text-amber-400'
                              : selectedQuest.status === 'CLAIMED'
                              ? 'text-emerald-400'
                              : 'text-cyan-400'
                          }`}
                        >
                          状态: {selectedQuest.status === 'COMPLETED' ? '已达成 (待领取)' : selectedQuest.status === 'CLAIMED' ? '已圆满完成' : '进行中'}
                        </span>
                      </div>
                    </div>

                    {/* Narrative Prose */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <div className="text-xs font-bold text-slate-300">剧情故事与背景</div>
                      <p className="text-xs text-slate-300 leading-relaxed indent-4">
                        {selectedQuest.description}
                      </p>
                    </div>

                    {/* Objective Guide */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
                        <div className="flex items-center gap-2">
                          <Compass className="w-4 h-4" />
                          <span>任务指引与进度</span>
                        </div>
                        <span className="font-mono">
                          {selectedQuest.currentCount} / {selectedQuest.targetCount}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 pl-6">{selectedQuest.hint}</p>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mt-2">
                        <div
                          className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(100, (selectedQuest.currentCount / selectedQuest.targetCount) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Rewards Card */}
                    <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-3">
                      <div className="text-xs font-bold text-amber-300 flex items-center gap-2">
                        <Gift className="w-4 h-4" />
                        <span>任务达成奖励</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="px-3 py-1.5 rounded-lg bg-black/40 border border-amber-400/20 text-xs font-mono font-bold text-amber-300">
                          +{selectedQuest.rewards.coins} 洛克贝
                        </div>
                        {selectedQuest.rewards.items?.map((itemSlot) => {
                          const item = ITEMS_DATA[itemSlot.itemId];
                          if (!item) return null;
                          return (
                            <div
                              key={itemSlot.itemId}
                              className="px-3 py-1.5 rounded-lg bg-black/40 border border-slate-700 text-xs font-mono text-cyan-300"
                            >
                              {item.name} x{itemSlot.count}
                            </div>
                          );
                        })}
                        {selectedQuest.rewards.badge && (
                          <div className="px-3 py-1.5 rounded-lg bg-purple-900/40 border border-purple-400/40 text-xs font-bold text-purple-300 flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5" />
                            <span>荣誉: {selectedQuest.rewards.badge}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Button */}
                    <div className="pt-2 flex items-center justify-end gap-3">
                      {selectedQuest.status === 'COMPLETED' ? (
                        <button
                          onClick={() => {
                            sound.playCatchSuccess();
                            onClaimReward(selectedQuest.id);
                          }}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Gift className="w-4 h-4" />
                          <span>领取任务奖励并解锁下一章</span>
                        </button>
                      ) : selectedQuest.status === 'ACTIVE' ? (
                        <button
                          onClick={() => {
                            sound.playClick();
                            setIsModalOpen(false);
                            onNavigateToLocation?.(selectedQuest.targetLocationId);
                          }}
                          className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 border border-slate-700"
                        >
                          <Compass className="w-4 h-4" />
                          <span>前往目标场景: {selectedQuest.targetLocationName}</span>
                        </button>
                      ) : (
                        <div className="text-xs text-slate-500 text-center w-full py-2">
                          {selectedQuest.status === 'CLAIMED' ? '该任务奖励已领讫' : '任务尚未解锁'}
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
