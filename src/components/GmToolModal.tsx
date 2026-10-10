import React, { useState } from 'react';
import {
  Wrench,
  Coins,
  Sparkles,
  Zap,
  Package,
  Compass,
  BookOpen,
  CheckCircle2,
  Trash2,
  Copy,
  RotateCcw,
  Check,
  X,
  Plus,
  Flame,
  Droplets,
  Leaf,
  Wind,
  ShieldCheck,
  Layers,
  Award,
  Download,
  Upload,
  AlertCircle
} from 'lucide-react';
import { PetInstance, InventorySlot, SceneId, Quest } from '../types/game';
import { PET_SPECIES } from '../data/species';
import { ITEMS_DATA } from '../data/items';
import { SCENES_DATA } from '../data/scenes';
import { createPetInstance, NATURES } from '../utils/battleEngine';
import { sound } from '../utils/audio';

interface GmToolModalProps {
  party: PetInstance[];
  playerCoins: number;
  inventory: InventorySlot[];
  currentSceneId: SceneId;
  unlockedSpeciesIds: string[];
  quests: Quest[];
  spiritShards: number;
  playerName: string;
  onSetCoins: (coins: number) => void;
  onSetSpiritShards: (shards: number) => void;
  onAddItem: (itemId: string, count: number) => void;
  onSetParty: (party: PetInstance[]) => void;
  onTeleport: (sceneId: SceneId) => void;
  onUnlockAllSpecies: () => void;
  onCompleteAllQuests: () => void;
  onHealAll: () => void;
  onOpenPrologue: () => void;
  onResetSave: () => void;
  onImportSave: (jsonStr: string) => boolean;
  onClose: () => void;
}

type TabType = 'ASSETS' | 'SPAWNER' | 'ITEMS' | 'PROGRESS' | 'SAVEFILE';

export const GmToolModal: React.FC<GmToolModalProps> = ({
  party,
  playerCoins,
  inventory,
  currentSceneId,
  unlockedSpeciesIds,
  quests,
  spiritShards,
  playerName,
  onSetCoins,
  onSetSpiritShards,
  onAddItem,
  onSetParty,
  onTeleport,
  onUnlockAllSpecies,
  onCompleteAllQuests,
  onHealAll,
  onOpenPrologue,
  onResetSave,
  onImportSave,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('ASSETS');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Custom asset inputs
  const [customCoins, setCustomCoins] = useState<string>('50000');
  const [customShards, setCustomShards] = useState<string>('50');

  // Pet spawner inputs
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>('cangqiongshenglong');
  const [spawnLevel, setSpawnLevel] = useState<number>(50);
  const [isShiny, setIsShiny] = useState<boolean>(true);
  const [isPerfectTalent, setIsPerfectTalent] = useState<boolean>(true);
  const [selectedNature, setSelectedNature] = useState<string>(NATURES[0]);

  // Item spawner inputs
  const [customItemCount, setCustomItemCount] = useState<number>(10);
  const [itemCategoryFilter, setItemCategoryFilter] = useState<string>('ALL');

  // Savefile state
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [importError, setImportError] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const notify = (msg: string) => {
    setCopiedNotification(msg);
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  // 1. One-click Add Coins
  const handleAddCoins = (amount: number) => {
    onSetCoins(Math.max(0, playerCoins + amount));
    sound.playCatchSuccess();
    notify(`洛克贝 ${amount > 0 ? `+${amount.toLocaleString()}` : amount.toLocaleString()}`);
  };

  // 2. One-click Set Coins
  const handleSetCoinsSubmit = () => {
    const val = parseInt(customCoins, 10);
    if (!isNaN(val) && val >= 0) {
      onSetCoins(val);
      sound.playCatchSuccess();
      notify(`洛克贝已设定为 ${val.toLocaleString()}`);
    }
  };

  // 3. One-click Add Shards
  const handleAddShards = (amount: number) => {
    onSetSpiritShards(Math.max(0, spiritShards + amount));
    sound.playCatchSuccess();
    notify(`友谊魔法碎片 +${amount}`);
  };

  // 4. One-click Max Level for Party
  const handleMaxLevelParty = () => {
    if (party.length === 0) {
      notify('同行队伍中暂无宠物！');
      return;
    }
    const updated = party.map((pet) => {
      const spec = PET_SPECIES[pet.speciesId];
      const maxLvl = 100;
      const stats = spec
        ? {
            hp: Math.floor(spec.baseStats.hp * 2 + 110),
            atk: Math.floor(spec.baseStats.atk * 2 + 5),
            def: Math.floor(spec.baseStats.def * 2 + 5),
            spAtk: Math.floor(spec.baseStats.spAtk * 2 + 5),
            spDef: Math.floor(spec.baseStats.spDef * 2 + 5),
            speed: Math.floor(spec.baseStats.speed * 2 + 5),
          }
        : pet.stats;

      return {
        ...pet,
        level: maxLvl,
        exp: 0,
        currentHp: stats.hp,
        stats,
      };
    });
    onSetParty(updated);
    sound.playCatchSuccess();
    notify('队伍全员已直接跃升至 100 级满级！');
  };

  // 5. Spawn Custom Pet
  const handleSpawnPet = () => {
    try {
      const newPet = createPetInstance(selectedSpeciesId, spawnLevel);
      if (isPerfectTalent) {
        newPet.nickname = `${newPet.nickname}★极品`;
        // Boost stats slightly for perfect talent
        newPet.stats.hp = Math.floor(newPet.stats.hp * 1.15);
        newPet.stats.atk = Math.floor(newPet.stats.atk * 1.15);
        newPet.stats.def = Math.floor(newPet.stats.def * 1.15);
        newPet.stats.spAtk = Math.floor(newPet.stats.spAtk * 1.15);
        newPet.stats.spDef = Math.floor(newPet.stats.spDef * 1.15);
        newPet.stats.speed = Math.floor(newPet.stats.speed * 1.15);
        newPet.currentHp = newPet.stats.hp;
      }
      if (selectedNature) {
        newPet.nature = selectedNature;
      }

      if (party.length < 6) {
        onSetParty([...party, newPet]);
        notify(`成功制造并收服：Lv.${spawnLevel} ${newPet.nickname}！`);
      } else {
        // Replace leader or last
        const newParty = [...party];
        newParty[newParty.length - 1] = newPet;
        onSetParty(newParty);
        notify(`同行队伍已满，已替换末位宠物为 Lv.${spawnLevel} ${newPet.nickname}！`);
      }
      sound.playCatchSuccess();
    } catch (e: any) {
      notify(`生成失败: ${e.message}`);
    }
  };

  // 6. Export Savefile
  const handleExportSave = () => {
    const raw = localStorage.getItem('huanling_mijing_save_v1');
    if (raw) {
      navigator.clipboard.writeText(raw);
      notify('已成功将当前游戏存档 JSON 复制到剪贴板！');
    } else {
      notify('未找到本地存档数据');
    }
  };

  // 7. Import Savefile
  const handleImportSaveSubmit = () => {
    setImportError(null);
    if (!importJsonText.trim()) {
      setImportError('请输入或粘贴合法的 JSON 存档文本！');
      return;
    }
    const success = onImportSave(importJsonText.trim());
    if (success) {
      sound.playCatchSuccess();
      notify('存档导入成功并已即时生效！');
      setImportJsonText('');
    } else {
      setImportError('解析失败，请检查 JSON 数据格式是否符合规范！');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border-2 border-purple-500/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 font-sans">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border-b border-purple-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 shadow-inner">
              <Wrench className="w-5 h-5 text-purple-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-200 to-cyan-300">
                  魔法学院 · GM 开发者调试控制台
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-900/60 text-purple-300 border border-purple-500/40">
                  DEVELOPER MODE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                可快速调试魔法资产、稀有宠物、魔法百宝、场景瞬移与存档热更
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline-block">
              快捷键: <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-purple-300">~</kbd>
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Floating Notification */}
        {copiedNotification && (
          <div className="absolute top-16 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 text-xs shadow-lg animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{copiedNotification}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center px-6 pt-3 bg-slate-950/50 border-b border-slate-800 gap-2 overflow-x-auto">
          {[
            { id: 'ASSETS', label: '资产与状态', icon: Coins },
            { id: 'SPAWNER', label: '宠物召唤台', icon: Sparkles },
            { id: 'ITEMS', label: '魔法道具库', icon: Package },
            { id: 'PROGRESS', label: '世界与传送', icon: Compass },
            { id: 'SAVEFILE', label: '存档导出导入', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all cursor-pointer border-t border-x ${
                  active
                    ? 'bg-slate-900 border-purple-500/50 text-purple-300 shadow-md'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-purple-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: ASSETS */}
          {activeTab === 'ASSETS' && (
            <div className="space-y-6">
              {/* Quick Status Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/50 border border-amber-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">当前洛克贝 (金币)</span>
                    <div className="text-xl font-bold text-amber-400 font-mono">
                      {playerCoins.toLocaleString()}
                    </div>
                  </div>
                  <Coins className="w-8 h-8 text-amber-400/40" />
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-cyan-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">友谊魔法碎片 (社交)</span>
                    <div className="text-xl font-bold text-cyan-400 font-mono">{spiritShards}</div>
                  </div>
                  <Sparkles className="w-8 h-8 text-cyan-400/40" />
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-purple-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">随行同行宠物</span>
                    <div className="text-xl font-bold text-purple-300 font-mono">{party.length} / 6</div>
                  </div>
                  <Award className="w-8 h-8 text-purple-400/40" />
                </div>
              </div>

              {/* Coins Manipulation */}
              <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-4">
                <h3 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
                  <Coins className="w-4 h-4" /> 洛克贝财富调配
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleAddCoins(10000)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-medium cursor-pointer transition-colors"
                  >
                    +10,000 洛克贝
                  </button>
                  <button
                    onClick={() => handleAddCoins(50000)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-medium cursor-pointer transition-colors"
                  >
                    +50,000 洛克贝
                  </button>
                  <button
                    onClick={() => handleAddCoins(200000)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-medium cursor-pointer transition-colors"
                  >
                    +200,000 洛克贝
                  </button>
                  <button
                    onClick={() => handleAddCoins(-5000)}
                    className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-medium cursor-pointer transition-colors"
                  >
                    -5,000 洛克贝
                  </button>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs text-slate-400">精确设置数值:</span>
                  <input
                    type="number"
                    value={customCoins}
                    onChange={(e) => setCustomCoins(e.target.value)}
                    className="w-36 px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={handleSetCoinsSubmit}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-medium cursor-pointer transition-colors shadow"
                  >
                    确认设定
                  </button>
                </div>
              </div>

              {/* Shards & Party Recovery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-4">
                  <h3 className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> 友谊碎片下发
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleAddShards(10)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-medium cursor-pointer transition-colors"
                    >
                      +10 碎片
                    </button>
                    <button
                      onClick={() => handleAddShards(50)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-medium cursor-pointer transition-colors"
                    >
                      +50 碎片
                    </button>
                    <button
                      onClick={() => handleAddShards(100)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-medium cursor-pointer transition-colors"
                    >
                      +100 碎片
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-4">
                  <h3 className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
                    <Zap className="w-4 h-4" /> 队伍魔法指令
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        onHealAll();
                        sound.playCatchSuccess();
                        notify('全员精力与技能 PP 已 100% 满状态恢复！');
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 text-emerald-400" />
                      全员满精力满PP
                    </button>
                    <button
                      onClick={handleMaxLevelParty}
                      className="px-3.5 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5 text-purple-400" />
                      全队满级 100 级
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SPAWNER */}
          {activeTab === 'SPAWNER' && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-slate-800/40 border border-purple-500/30 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                  <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> 皇家魔导召唤台 (任意宠物一键召唤)
                  </h3>
                  <span className="text-xs text-slate-400">目前全大陆共收录 16 种魔法宠物</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Select Species */}
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">选择目标宠物原型</label>
                    <select
                      value={selectedSpeciesId}
                      onChange={(e) => setSelectedSpeciesId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-purple-200 focus:outline-none focus:border-purple-400"
                    >
                      {Object.values(PET_SPECIES).map((spec) => (
                        <option key={spec.id} value={spec.id}>
                          #{spec.pokedexNum} {spec.name} ({spec.type} - {spec.rarity})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Level Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs text-slate-400">造化等级</label>
                      <span className="text-xs font-mono font-bold text-amber-400">Lv. {spawnLevel}</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={100}
                      value={spawnLevel}
                      onChange={(e) => setSpawnLevel(parseInt(e.target.value, 10))}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nature Selection */}
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">先天天赋性格</label>
                    <select
                      value={selectedNature}
                      onChange={(e) => setSelectedNature(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-purple-400"
                    >
                      {NATURES.map((nat) => (
                        <option key={nat} value={nat}>
                          {nat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Checkbox Options */}
                  <div className="flex items-center gap-6 pt-5">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={isPerfectTalent}
                        onChange={(e) => setIsPerfectTalent(e.target.checked)}
                        className="rounded border-slate-700 text-purple-600 focus:ring-purple-500 accent-purple-500"
                      />
                      <span>满资质圣品 (+15% 极品属性)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-amber-300">
                      <input
                        type="checkbox"
                        checked={isShiny}
                        onChange={(e) => setIsShiny(e.target.checked)}
                        className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 accent-amber-500"
                      />
                      <span>闪光宠物 (稀有形态)</span>
                    </label>
                  </div>
                </div>

                {/* Confirm Spawn Button */}
                <div className="pt-2">
                  <button
                    onClick={handleSpawnPet}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-purple-900/40 cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    立即召唤并加入队伍
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ITEMS */}
          {activeTab === 'ITEMS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">分类过滤:</span>
                  {['ALL', 'BALL', 'POTION', 'PP', 'REVIVE'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setItemCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                        itemCategoryFilter === cat
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat === 'ALL' ? '全部' : cat === 'BALL' ? '晶石球' : cat === 'POTION' ? '灵药' : cat === 'PP' ? '回灵丹' : '起死回生草'}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">单次添加数量:</span>
                  <input
                    type="number"
                    min={1}
                    max={999}
                    value={customItemCount}
                    onChange={(e) => setCustomItemCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-16 px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-center text-purple-300"
                  />
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Object.values(ITEMS_DATA)
                  .filter((item) => {
                    if (itemCategoryFilter === 'ALL') return true;
                    if (itemCategoryFilter === 'BALL') return item.category === 'BALL';
                    if (itemCategoryFilter === 'POTION') return item.category === 'POTION';
                    if (itemCategoryFilter === 'PP') return item.category === 'PP';
                    if (itemCategoryFilter === 'REVIVE') return item.category === 'REVIVE';
                    return true;
                  })
                  .map((item) => {
                    const currentInBag = inventory.find((i) => i.itemId === item.id)?.count || 0;
                    return (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-purple-500/50 transition-all flex flex-col justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-200">{item.name}</span>
                            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
                              拥有: {currentInBag}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            onClick={() => {
                              onAddItem(item.id, customItemCount);
                              sound.playCatchSuccess();
                              notify(`成功添得 ${item.name} x${customItemCount}`);
                            }}
                            className="flex-1 py-1 rounded bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-300 text-xs font-medium cursor-pointer transition-colors"
                          >
                            +{customItemCount}
                          </button>
                          <button
                            onClick={() => {
                              onAddItem(item.id, 99);
                              sound.playCatchSuccess();
                              notify(`成功添得 ${item.name} x99`);
                            }}
                            className="px-2.5 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 text-xs font-medium cursor-pointer transition-colors"
                          >
                            +99
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB 4: PROGRESS & TELEPORT */}
          {activeTab === 'PROGRESS' && (
            <div className="space-y-6">
              {/* Teleportation */}
              <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                <h3 className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
                  <Compass className="w-4 h-4" /> 王国场景瞬移传送 (当前场景: {SCENES_DATA[currentSceneId]?.name || currentSceneId})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {Object.values(SCENES_DATA).map((scene) => (
                    <button
                      key={scene.id}
                      onClick={() => {
                        onTeleport(scene.id);
                        notify(`已瞬移传送至: ${scene.name}`);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer ${
                        currentSceneId === scene.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-semibold">{scene.name}</div>
                      <div className="text-[10px] text-slate-500">{scene.region}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Progression Fast Forward */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                  <h3 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> 万象图鉴全解锁
                  </h3>
                  <p className="text-xs text-slate-400">
                    当前已解锁 {unlockedSpeciesIds.length} / {Object.keys(PET_SPECIES).length} 种。一键点亮全部 16 种天地神兽图鉴！
                  </p>
                  <button
                    onClick={() => {
                      onUnlockAllSpecies();
                      sound.playCatchSuccess();
                      notify('全大陆 16 种神兽图鉴已全部点亮收录！');
                    }}
                    className="w-full py-2 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/50 text-amber-300 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    一键 100% 全图鉴解锁
                  </button>
                </div>

                <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                  <h3 className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> 主线历练任务速通
                  </h3>
                  <p className="text-xs text-slate-400">
                    一键推进当前进行中的所有主线任务至可领奖状态。
                  </p>
                  <button
                    onClick={() => {
                      onCompleteAllQuests();
                      sound.playCatchSuccess();
                      notify('所有主线历练任务进度已达成！');
                    }}
                    className="w-full py-2 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 text-emerald-300 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    一键达成全部任务
                  </button>
                </div>
              </div>

              {/* Re-trigger prologue */}
              <div className="p-4 rounded-xl bg-slate-900 border border-purple-500/20 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-purple-300">重现天命初醒序章</h4>
                  <p className="text-[11px] text-slate-400">重新呼出创世神兽起源故事与御三家授羽仪式</p>
                </div>
                <button
                  onClick={() => {
                    onOpenPrologue();
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-purple-700/40 hover:bg-purple-700/60 border border-purple-500/40 text-purple-200 text-xs cursor-pointer"
                >
                  呼出序章
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: SAVEFILE */}
          {activeTab === 'SAVEFILE' && (
            <div className="space-y-6">
              {/* Export & Copy */}
              <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                    <Download className="w-4 h-4" /> 导出当前游戏存档 (JSON)
                  </h3>
                  <button
                    onClick={handleExportSave}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-300 text-xs font-medium cursor-pointer transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" /> 复制存档文本
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  当前本地存储的完整数据快照，包含主角、洛克贝、图鉴、背包及全部宠物资质。
                </p>
              </div>

              {/* Import Custom JSON */}
              <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                <h3 className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
                  <Upload className="w-4 h-4" /> 导入自定义存档 JSON
                </h3>
                <textarea
                  rows={4}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder="在此粘贴 JSON 格式的游戏存档代码..."
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                {importError && (
                  <p className="text-xs text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> {importError}
                  </p>
                )}
                <button
                  onClick={handleImportSaveSubmit}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium cursor-pointer transition-colors"
                >
                  解析并应用该存档
                </button>
              </div>

              {/* Factory Reset */}
              <div className="p-5 rounded-xl bg-red-950/20 border border-red-500/30 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                    <Trash2 className="w-4 h-4" /> 清空存档 / 恢复初始状态
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    清空浏览器的 LocalStorage 存档，重置为新玩家初入大陆状态。
                  </p>
                </div>
                {showResetConfirm ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onResetSave();
                        setShowResetConfirm(false);
                        notify('存档已清空重置！');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer"
                    >
                      确认清空！
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs cursor-pointer"
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-900/70 border border-red-500/40 text-red-300 text-xs font-medium cursor-pointer transition-colors"
                  >
                    重置存档
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-400">GM 调试沙箱环境正常运行中</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer transition-colors"
          >
            关闭面板 (ESC)
          </button>
        </div>

      </div>
    </div>
  );
};
