import React, { useState, useEffect } from 'react';
import { ChatMessage } from '../types/game';
import { sound } from '../utils/audio';
import { MessageSquare, Send, Bell, ChevronDown, ChevronUp, Sparkles, Volume2, Shield } from 'lucide-react';

interface WorldChatPanelProps {
  playerName: string;
  playerTitle: string;
  messages: ChatMessage[];
  onSendMessage: (content: string, channel: 'WORLD' | 'SCENE') => boolean;
  marqueeAnnouncement: string | null;
}

export const WorldChatPanel: React.FC<WorldChatPanelProps> = ({
  playerName,
  playerTitle,
  messages,
  onSendMessage,
  marqueeAnnouncement,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [channel, setChannel] = useState<'WORLD' | 'SCENE'>('WORLD');
  const [inputContent, setInputContent] = useState<string>('');
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);

  useEffect(() => {
    if (cooldownSeconds > 0) {
      const timer = setTimeout(() => setCooldownSeconds((s) => s - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownSeconds]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim() || cooldownSeconds > 0) return;

    const ok = onSendMessage(inputContent.trim(), channel);
    if (ok) {
      sound.playClick();
      setInputContent('');
      setCooldownSeconds(3); // 3s chat rate limit
    }
  };

  return (
    <div className="w-full flex flex-col pointer-events-auto">
      {/* 1. Golden Marquee Announcement Banner */}
      {marqueeAnnouncement && (
        <div className="w-full bg-gradient-to-r from-amber-950/90 via-[#1a0f02]/95 to-amber-950/90 border-y border-amber-500/50 px-4 py-1.5 flex items-center gap-2.5 shadow-lg text-xs animate-in fade-in duration-300">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
          <div className="overflow-hidden whitespace-nowrap w-full">
            <span className="inline-block animate-[marquee_18s_linear_infinite] text-amber-200 font-bold tracking-wide">
              ✦ {marqueeAnnouncement} ✦
            </span>
          </div>
        </div>
      )}

      {/* 2. Chat Box Bar */}
      <div className="w-full bg-[#061426]/90 backdrop-blur-md border-t border-[#b8860b]/40 transition-all duration-300">
        
        {/* Collapsed Bar */}
        <div className="px-3 py-2 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 overflow-hidden flex-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="roco-action-pill flex items-center gap-1.5 px-3 py-1 text-xs shrink-0 cursor-pointer shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
              <span>王国聊天</span>
              {isExpanded ? <ChevronDown className="w-3 h-3 text-amber-300" /> : <ChevronUp className="w-3 h-3 text-amber-300" />}
            </button>

            {/* Latest Message Preview */}
            <div className="text-[11px] text-slate-300 truncate">
              {messages.length > 0 ? (
                <>
                  <span className="text-amber-300 font-bold roco-title-font">
                    【{messages[messages.length - 1].senderName}】:
                  </span>{' '}
                  <span className="text-slate-200">{messages[messages.length - 1].content}</span>
                </>
              ) : (
                <span className="text-slate-400">洛克王国静谧祥和，暂无最新发言...</span>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-white p-1 cursor-pointer"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Expanded Chat Messages & Input */}
        {isExpanded && (
          <div className="p-3 border-t border-[#b8860b]/30 space-y-2.5 animate-in slide-in-from-bottom-2 duration-200 bg-[#040e1b]/80">
            {/* Channel Tabs */}
            <div className="flex items-center gap-2 text-[11px]">
              <button
                onClick={() => setChannel('WORLD')}
                className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition-all roco-title-font ${
                  channel === 'WORLD'
                    ? 'roco-turn-capsule text-slate-950 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                全服广播
              </button>
              <button
                onClick={() => setChannel('SCENE')}
                className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition-all roco-title-font ${
                  channel === 'SCENE'
                    ? 'roco-turn-capsule text-slate-950 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                当前场景
              </button>
              <span className="text-[10px] text-slate-400 ml-auto font-mono">
                王国即时广播信道
              </span>
            </div>

            {/* Messages Scroll Area */}
            <div className="h-44 overflow-y-auto space-y-1.5 p-2.5 bg-[#030914]/90 border border-[#b8860b]/25 rounded-2xl text-xs font-sans shadow-inner">
              {messages.map((msg) => (
                <div key={msg.id} className="leading-relaxed">
                  <span className="text-[10px] font-mono text-slate-400 mr-1.5">
                    [{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded mr-1.5 ${
                      msg.channel === 'SYSTEM'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-amber-950/80 text-amber-300 border border-amber-600/50'
                    }`}
                  >
                    {msg.channel === 'SYSTEM' ? '公告' : '王国'}
                  </span>
                  <span className="font-bold text-amber-300 mr-1 roco-title-font">
                    {msg.senderName}:
                  </span>
                  <span className="text-slate-200">{msg.content}</span>
                </div>
              ))}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                placeholder={cooldownSeconds > 0 ? `广播冷却中 (${cooldownSeconds}s)...` : "输入洛克喇叭广播，和小伙伴们畅快交流..."}
                disabled={cooldownSeconds > 0}
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
                maxLength={60}
                className="flex-1 px-3 py-1.5 bg-[#030914] border border-[#b8860b]/40 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={cooldownSeconds > 0 || !inputContent.trim()}
                className="px-4 py-1.5 rounded-xl roco-turn-capsule disabled:opacity-40 text-slate-950 font-bold text-xs cursor-pointer transition-all shadow flex items-center gap-1 roco-title-font"
              >
                <Send className="w-3.5 h-3.5" />
                <span>发送</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
