import React, { useState } from 'react';
import { GameMail, InventorySlot, PetInstance } from '../types/game';
import { ITEMS_DATA } from '../data/items';
import { PET_SPECIES } from '../data/species';
import { PetAvatar } from './PetAvatar';
import { sound } from '../utils/audio';
import {
  Mail,
  Gift,
  CheckCircle2,
  Trash2,
  X,
  Coins,
  Sparkles,
  Inbox,
  Clock,
  Check
} from 'lucide-react';

interface MailboxModalProps {
  mails: GameMail[];
  onClaimMail: (mailId: string) => void;
  onClaimAllMails: () => void;
  onDeleteReadMails: () => void;
  onClose: () => void;
}

export const MailboxModal: React.FC<MailboxModalProps> = ({
  mails,
  onClaimMail,
  onClaimAllMails,
  onDeleteReadMails,
  onClose,
}) => {
  const [selectedMailId, setSelectedMailId] = useState<string>(mails[0]?.id || '');
  const selectedMail = mails.find((m) => m.id === selectedMailId) || mails[0];

  const unreadCount = mails.filter((m) => !m.isClaimed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 md:p-6 animate-in fade-in duration-200 select-none">
      <div className="relative rounded-3xl w-full max-w-4xl h-[86vh] max-h-[720px] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.9)] border-2 border-[#b8860b]/50 bg-gradient-to-b from-[#0a1829] via-[#06121f] to-[#040c17] overflow-hidden text-slate-100">
        
        {/* Decorative Gilded Corner Brackets */}
        <div className="corner-ornament-tl" />
        <div className="corner-ornament-tr" />
        <div className="corner-ornament-bl" />
        <div className="corner-ornament-br" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-[#081a2e]/95 via-[#061426]/90 to-transparent border-b border-[#b8860b]/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/30 border-2 border-[#d4af37]/60 flex items-center justify-center text-amber-300 shadow-md">
              <Mail className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black roco-gold-text tracking-wide flex items-center gap-2 roco-title-font">
                  王国猫头鹰 · 皇家传信箱
                </h2>
                <span className="roco-seal text-[10px] px-1.5 py-0.2 font-bold tracking-wider">
                  信箱
                </span>
                <span className="text-xs text-amber-300/60 font-mono font-bold tracking-widest">— ROYAL MAGIC MAILBOX —</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                全服魔法诏令、学院福利礼赠与王国运营补偿 · 未领奖励 ({unreadCount} 封)
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="roco-close-btn shrink-0"
            title="关闭信箱"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Grid */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 p-4 gap-4">
          
          {/* Left: Mail List (5 Cols) */}
          <div className="md:col-span-5 flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <span className="text-xs font-bold text-amber-300">收件箱 ({mails.length})</span>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={unreadCount === 0}
                  onClick={() => {
                    sound.playCatchSuccess();
                    onClaimAllMails();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 disabled:opacity-40 border border-amber-500/40 text-amber-300 text-[11px] font-bold cursor-pointer transition-colors"
                >
                  一键全领
                </button>
              </div>
            </div>

            {mails.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs p-6 space-y-2">
                <Inbox className="w-10 h-10 text-slate-600 animate-pulse" />
                <p>暂无新邮件</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {mails.map((m) => {
                  const isSelected = selectedMail?.id === m.id;
                  const hasReward =
                    (m.rewards.coins && m.rewards.coins > 0) ||
                    (m.rewards.items && m.rewards.items.length > 0) ||
                    m.rewards.petSpeciesId;

                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedMailId(m.id);
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 shadow-md'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          {!m.isClaimed && hasReward && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                          )}
                          <span className="text-xs font-bold text-slate-200 truncate">
                            {m.title}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">{m.content}</p>
                        <span className="text-[9px] text-slate-500 font-mono block">
                          {new Date(m.sentAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {hasReward && (
                          <span
                            className={`p-1.5 rounded-lg text-xs ${
                              m.isClaimed
                                ? 'bg-slate-900 text-slate-500'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}
                          >
                            <Gift className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Mail Content & Rewards (7 Cols) */}
          <div className="md:col-span-7 flex flex-col bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 overflow-y-auto justify-between space-y-4">
            {selectedMail ? (
              <>
                <div className="space-y-4">
                  {/* Title & Metadata */}
                  <div className="border-b border-slate-800 pb-3 space-y-1">
                    <h3 className="text-base font-bold text-amber-200">{selectedMail.title}</h3>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>发件人: <strong className="text-slate-300">星灵王国皇家事务司</strong></span>
                      <span>·</span>
                      <span className="font-mono">{new Date(selectedMail.sentAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Body Text */}
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                    {selectedMail.content}
                  </div>

                  {/* Rewards Section */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5" /> 附赠魔法物资
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      {selectedMail.rewards.coins && (
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                          <Coins className="w-5 h-5 text-amber-400" />
                          <div>
                            <div className="text-[10px] text-slate-400">星辉金币</div>
                            <div className="text-xs font-bold font-mono text-amber-300">
                              +{selectedMail.rewards.coins.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedMail.rewards.gems && (
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-cyan-400" />
                          <div>
                            <div className="text-[10px] text-slate-400">璀璨星钻</div>
                            <div className="text-xs font-bold font-mono text-cyan-300">
                              +{selectedMail.rewards.gems}
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedMail.rewards.items?.map((it) => {
                        const itemInfo = ITEMS_DATA[it.itemId];
                        return (
                          <div
                            key={it.itemId}
                            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2"
                          >
                            <Gift className="w-4 h-4 text-purple-400" />
                            <div>
                              <div className="text-[10px] text-slate-300 truncate">
                                {itemInfo?.name || it.itemId}
                              </div>
                              <div className="text-xs font-bold font-mono text-purple-300">
                                x{it.count}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {selectedMail.rewards.petSpeciesId && (
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/40 flex items-center gap-2 col-span-2">
                          <PetAvatar speciesId={selectedMail.rewards.petSpeciesId} size={36} />
                          <div>
                            <div className="text-[10px] text-amber-300 font-bold">特赠稀有魔法宠物</div>
                            <div className="text-xs font-bold text-slate-200">
                              {PET_SPECIES[selectedMail.rewards.petSpeciesId]?.name || selectedMail.rewards.petSpeciesId}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Claim Button */}
                <div className="pt-3 border-t border-slate-800 flex justify-end">
                  {selectedMail.isClaimed ? (
                    <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 text-xs">
                      <Check className="w-4 h-4" />
                      <span>已成功领取该邮件物资</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        sound.playCatchSuccess();
                        onClaimMail(selectedMail.id);
                      }}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-black text-xs shadow-lg cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      <Gift className="w-4 h-4" />
                      立即领取附件奖励
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center text-slate-500 text-xs my-auto">
                请点击左侧邮件查阅详情
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
