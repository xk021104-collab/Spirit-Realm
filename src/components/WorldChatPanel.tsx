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
      <div className="w-full bg-slate-950/85 backdrop-blur-md border-t border-slate-800/80 transition-all duration-300">
        
        {/* Collapsed Bar */}
        <div className="px-3 py-2 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 overflow-hidden flex-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-750 text-cyan-300 border border-cyan-800/40 text-[11px] font-bold cursor-pointer transition-colors shrink-0"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>世界传音</span>
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </button>

            {/* Latest Message Preview */}
            <div className="text-[11px] text-slate-300 truncate">
              {messages.length > 0 ? (
                <>
                  <span className="text-amber-300 font-bold">
                    【{messages[messages.length - 1].senderName}】:
                  </span>{' '}
                  <span className="text-slate-300">{messages[messages.length - 1].content}</span>
                </>
              ) : (
                <span className="text-slate-500">九洲灵音静谧，暂无传音...</span>
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
          <div className="p-3 border-t border-slate-800/60 space-y-2.5 animate-in slide-in-from-bottom-2 duration-200">
            {/* Channel Tabs */}
            <div className="flex items-center gap-2 text-[11px]">
              <button
                onClick={() => setChannel('WORLD')}
                className={`px-2.5 py-1 rounded-md font-bold cursor-pointer transition-colors ${
                  channel === 'WORLD'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                全服世界
              </button>
              <button
                onClick={() => setChannel('SCENE')}
                className={`px-2.5 py-1 rounded-md font-bold cursor-pointer transition-colors ${
                  channel === 'SCENE'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                当前洞天
              </button>
              <span className="text-[10px] text-slate-500 ml-auto font-mono">
                RabbitMQ 广播总线同步
              </span>
            </div>

            {/* Messages Scroll Area */}
            <div className="h-44 overflow-y-auto space-y-1.5 p-2 bg-slate-900/70 border border-slate-800/80 rounded-xl text-xs font-sans">
              {messages.map((msg) => (
                <div key={msg.id} className="leading-relaxed">
                  <span className="text-[10px] font-mono text-slate-500 mr-1.5">
                    [{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded mr-1.5 ${
                      msg.channel === 'SYSTEM'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {msg.channel === 'SYSTEM' ? '天道' : '世界'}
                  </span>
                  <span className="font-bold text-amber-200 mr-1">
                    {msg.senderName}
                  </span>
                  <span className="text-slate-300">{msg.content}</span>
                </div>
              ))}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                placeholder={cooldownSeconds > 0 ? `传音冷却中 (${cooldownSeconds}s)...` : "输入传音道法，向全服修仙者发话..."}
                disabled={cooldownSeconds > 0}
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
                maxLength={60}
                className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={cooldownSeconds > 0 || !inputContent.trim()}
                className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-slate-950 font-bold text-xs cursor-pointer transition-colors shadow flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>发音</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
