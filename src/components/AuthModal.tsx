import React, { useState } from 'react';
import { CloudAccount } from '../types/game';
import { sound } from '../utils/audio';
import { User, Cloud, Upload, Download, KeyRound, ShieldCheck, Check, X, AlertCircle, RefreshCw } from 'lucide-react';

interface AuthModalProps {
  cloudAccount: CloudAccount;
  onLogin: (username: string) => boolean;
  onLogout: () => void;
  onSyncUpload: () => Promise<boolean>;
  onSyncDownload: () => Promise<boolean>;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  cloudAccount,
  onLogin,
  onLogout,
  onSyncUpload,
  onSyncDownload,
  onClose,
}) => {
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    sound.playCatchSuccess();
    const success = onLogin(usernameInput.trim());
    if (success) {
      setSyncStatus(`登录成功！已载入修仙道号【${usernameInput.trim()}】。`);
      setTimeout(() => setSyncStatus(null), 3000);
    }
  };

  const handleUpload = async () => {
    setIsSyncing(true);
    sound.playClick();
    const ok = await onSyncUpload();
    setIsSyncing(false);
    if (ok) {
      sound.playCatchSuccess();
      setSyncStatus('云端存档同步成功！已安全落盘至高可用持久化库。');
    } else {
      setSyncStatus('云端同步失败，请检查网络或后端服务端连接状态！');
    }
    setTimeout(() => setSyncStatus(null), 3500);
  };

  const handleDownload = async () => {
    setIsSyncing(true);
    sound.playClick();
    const ok = await onSyncDownload();
    setIsSyncing(false);
    if (ok) {
      sound.playCatchSuccess();
      setSyncStatus('已成功从云端拉取最新修为进度！');
    } else {
      setSyncStatus('云端拉取失败，请检查账号是否存在云端存档。');
    }
    setTimeout(() => setSyncStatus(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 md:p-6 animate-in fade-in duration-200 select-none">
      <div className="relative rounded-3xl w-full max-w-lg bg-gradient-to-b from-[#0a1829] via-[#06121f] to-[#040c17] border-2 border-[#b8860b]/50 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden text-slate-100 flex flex-col">
        
        {/* Decorative Gilded Corner Brackets */}
        <div className="corner-ornament-tl" />
        <div className="corner-ornament-tr" />
        <div className="corner-ornament-bl" />
        <div className="corner-ornament-br" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-[#081a2e]/95 via-[#061426]/90 to-transparent border-b border-[#b8860b]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/30 border-2 border-[#d4af37]/60 flex items-center justify-center text-amber-300 shadow-md">
              <Cloud className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-black roco-gold-text tracking-wide flex items-center gap-2 roco-title-font">
                天道云匣 · 账号与云存档
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                基于 PostgreSQL + Redis 的跨设备多端云存档同步体系
              </p>
            </div>
          </div>

          <button onClick={onClose} className="roco-close-btn shrink-0" title="关闭云匣">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {syncStatus && (
            <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2 animate-in fade-in">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{syncStatus}</span>
            </div>
          )}

          {/* Account Status Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
                <User className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">
                  {cloudAccount.isCloudLoggedIn ? cloudAccount.username : '本地游客道友 (未登云端)'}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  上次云端备份: {cloudAccount.lastSyncedAt ? new Date(cloudAccount.lastSyncedAt).toLocaleString() : '暂无'}
                </div>
              </div>
            </div>

            {cloudAccount.isCloudLoggedIn && (
              <button
                onClick={onLogout}
                className="px-3 py-1 rounded-lg bg-red-950 text-red-300 border border-red-800 text-xs cursor-pointer hover:bg-red-900"
              >
                登出
              </button>
            )}
          </div>

          {/* Login / Register Form (If not logged in) */}
          {!cloudAccount.isCloudLoggedIn && (
            <form onSubmit={handleLoginSubmit} className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs font-bold text-amber-300 block mb-1">
                登录或注册仙盟云端通行证
              </span>
              <div>
                <input
                  type="text"
                  placeholder="请输入道号 / 账号名..."
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="请输入仙符密文 (留空为快捷游历)..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-bold text-xs shadow cursor-pointer transition-all"
              >
                快速认证并登入天道云端
              </button>
            </form>
          )}

          {/* Cloud Sync Actions */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 block">云存档双向互通操作</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                disabled={isSyncing}
                onClick={handleUpload}
                className="p-3.5 rounded-xl bg-slate-950 border border-cyan-800 hover:border-cyan-500 text-cyan-300 text-xs font-bold flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors shadow"
              >
                <Upload className="w-5 h-5 text-cyan-400" />
                <span>备份至云端数据库</span>
              </button>

              <button
                disabled={isSyncing}
                onClick={handleDownload}
                className="p-3.5 rounded-xl bg-slate-950 border border-purple-800 hover:border-purple-500 text-purple-300 text-xs font-bold flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors shadow"
              >
                <Download className="w-5 h-5 text-purple-400" />
                <span>从云端拉取覆盖本地</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
