import React, { useState, useEffect } from 'react';
import { SceneConfig, PetInstance, SceneId, InventorySlot } from '../types/game';
import { SCENES_DATA } from '../data/scenes';
import { PET_SPECIES } from '../data/species';
import { PetAvatar } from './PetAvatar';
import { PlayerAvatar, NpcAvatar } from './PlayerAvatar';
import { SceneBackground } from './SceneBackground';
import { createPetInstance } from '../utils/battleEngine';
import { sound } from '../utils/audio';
import {
  Compass,
  Coins,
  Volume2,
  VolumeX,
  Swords,
  Heart,
  ShoppingBag,
  BookOpen,
  Backpack,
  Gift,
  X,
  Sparkles,
  MapPin,
  ChevronRight,
  Shield,
  Zap,
  MessageSquare,
  Radio,
  Flame,
  Droplets,
  Trees,
  Maximize2,
  Send,
  HelpCircle,
  Award,
} from 'lucide-react';

interface SceneViewProps {
  currentScene: SceneConfig;
  playerParty: PetInstance[];
  activeLeaderIndex: number;
  playerCoins: number;
  playerBadges: string[];
  openedChestIds: string[];
  playerName: string;
  onOpenChest: (chestId: string, coins: number, itemId?: string, itemCount?: number) => void;
  onEnterBattle: (enemyPet: PetInstance, isWild: boolean) => void;
  onTeleportToScene: (sceneId: SceneId) => void;
  onOpenPetBag: () => void;
  onOpenPokedex: () => void;
  onOpenShop: () => void;
  onOpenQuestLog?: () => void;
  onOpenDailyEvents?: () => void;
  onOpenPetTrain?: () => void;
  onHealParty: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const SceneView: React.FC<SceneViewProps> = ({
  currentScene,
  playerParty,
  activeLeaderIndex,
  playerCoins,
  playerBadges,
  openedChestIds,
  playerName,
  onOpenChest,
  onEnterBattle,
  onTeleportToScene,
  onOpenPetBag,
  onOpenPokedex,
  onOpenShop,
  onOpenQuestLog,
  onOpenDailyEvents,
  onOpenPetTrain,
  onHealParty,
  soundEnabled,
  onToggleSound,
}) => {
  // Player coordinate on map canvas (in percentage 0-100%)
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 50, y: 65 });
  const [playerDirection, setPlayerDirection] = useState<'left' | 'right'>('right');
  const [isMoving, setIsMoving] = useState<boolean>(false);

  // Click target ripple feedback
  const [clickTarget, setClickTarget] = useState<{ x: number; y: number; id: number } | null>(null);

  // NPC dialogue popup
  const [activeDialogue, setActiveDialogue] = useState<{ name: string; text: string; actionType?: string } | null>(null);

  // World map fast travel modal
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);

  // Healing notification alert
  const [healNotice, setHealNotice] = useState<string | null>(null);

  // Shaking bush interactive feedback
  const [bushShaking, setBushShaking] = useState<boolean>(false);

  // Simulated MMO other players roaming
  const otherPlayers = [
    { name: '青云剑仙', level: 28, title: '天阶灵契使', petId: 'zhuoyuying', x: 22, y: 45, dir: 'right' as const },
    { name: '紫霄仙子', level: 35, title: '神霄阁主', petId: 'canglanjiao', x: 78, y: 52, dir: 'left' as const },
  ];

  // Chat system state (Classic Flash Web Game World Channel Ticker & Chat Box)
  const [chatChannel, setChatChannel] = useState<'ALL' | 'WORLD' | 'RUMOR' | 'SYSTEM'>('ALL');
  const [chatInput, setChatInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<
    { sender: string; channel: string; text: string; time: string; isSelf?: boolean }[]
  >([
    {
      sender: '【系统传音】',
      channel: 'SYSTEM',
      text: '欢迎踏入《幻灵秘境》！契约天地异兽，问鼎无上至尊！',
      time: '12:00',
    },
    {
      sender: '青云剑仙 [Lv.28]',
      channel: 'WORLD',
      text: '苍炎熔渊刚刷新了高资质赤焰雀，有同门一起组队抓宠吗？',
      time: '12:01',
    },
    {
      sender: '【万象商盟】葛阁主',
      channel: 'RUMOR',
      text: '今日万象宝阁进货了一批天阶破界晶，捕获概率大幅暴涨！',
      time: '12:03',
    },
  ]);

  const leaderPet = playerParty[activeLeaderIndex] || playerParty[0];

  // Handle clicking ground to walk with golden crosshair ripple
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const targetX = Math.max(12, Math.min(88, clickX));
    const targetY = Math.max(28, Math.min(84, clickY));

    if (targetX < playerPos.x) {
      setPlayerDirection('left');
    } else {
      setPlayerDirection('right');
    }

    sound.playClick();
    setClickTarget({ x: clickX, y: clickY, id: Date.now() });
    setIsMoving(true);
    setPlayerPos({ x: targetX, y: targetY });

    setTimeout(() => {
      setIsMoving(false);
    }, 450);
  };

  // Click wild spirit
  const handleWildPetClick = (speciesId: string, minLvl: number, maxLvl: number) => {
    sound.playAttackHit();
    const lvl = Math.floor(minLvl + Math.random() * (maxLvl - minLvl + 1));
    const wildInstance = createPetInstance(speciesId, lvl);
    onEnterBattle(wildInstance, true);
  };

  // Click mysterious shaking bush
  const handleBushClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playAttackHit();
    setBushShaking(true);
    setTimeout(() => setBushShaking(false), 600);

    // Random wild pet jump out!
    if (currentScene.wildPets.length > 0) {
      const randomWp = currentScene.wildPets[Math.floor(Math.random() * currentScene.wildPets.length)];
      handleWildPetClick(randomWp.speciesId, randomWp.minLevel, randomWp.maxLevel);
    }
  };

  // Click NPC
  const handleNpcClick = (npc: (typeof currentScene.npcs)[0]) => {
    sound.playClick();
    const speech = npc.dialogue[Math.floor(Math.random() * npc.dialogue.length)];
    setActiveDialogue({
      name: `${npc.name} · ${npc.role}`,
      text: speech,
      actionType: npc.actionType,
    });
  };

  const handleNpcAction = (actionType?: string) => {
    setActiveDialogue(null);
    if (actionType === 'HEAL') {
      sound.playHeal();
      onHealParty();
      setHealNotice('✨ 天医甘露洗礼！全队幻灵气血与招式灵力已全部回复满状态！');
      setTimeout(() => setHealNotice(null), 3000);
    } else if (actionType === 'SHOP') {
      onOpenShop();
    } else if (actionType === 'ARENA_CHALLENGE') {
      sound.playAttackHit(true);
      const boss = createPetInstance('leiwenhou', 25);
      boss.nickname = '【战皇】天罡雷纹吼';
      onEnterBattle(boss, false);
    }
  };

  // Handle Send Chat
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sound.playClick();
    const newMsg = {
      sender: `${playerName} [Lv.15]`,
      channel: 'WORLD',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
    };
    setChatMessages((prev) => [...prev.slice(-15), newMsg]);
    setChatInput('');
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center select-none">
      {/* 1. Classic Flash Game Console Outer Frame */}
      <div className="w-full flash-viewport-wrapper rounded-2xl overflow-hidden relative flex flex-col">
        {/* Decorative Gilded Corner Brackets */}
        <div className="corner-ornament-tl" />
        <div className="corner-ornament-tr" />
        <div className="corner-ornament-bl" />
        <div className="corner-ornament-br" />

        {/* Top Console Title Bar (Seer / Roco Kingdom / Aochi Legend Top Header) */}
        <div className="h-14 flash-top-console px-4 flex items-center justify-between z-30">
          {/* Left: Player Avatar Badge & Vitality */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer">
              <div className="w-11 h-11 rounded-full border-2 border-amber-400 bg-gradient-to-b from-indigo-900 to-slate-950 p-0.5 shadow-md flex items-center justify-center overflow-hidden ring-2 ring-amber-500/30">
                <PlayerAvatar size={38} />
              </div>
              <div className="absolute -top-1.5 -left-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-[9px] font-black px-1.5 rounded-sm shadow-md border border-yellow-200">
                VIP 8
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 rounded-full border border-amber-300">
                Lv.25
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-amber-300 tracking-wide game-title-font">
                  {playerName}
                </span>
                <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.2 rounded border border-amber-400/50 font-bold shadow-xs">
                  【天命灵契使】
                </span>
              </div>
              {/* Vitality / Energy Meter */}
              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-300 font-mono">
                <span className="text-amber-400 font-bold">⚡ 灵力 28,600</span>
                <span className="text-slate-600">|</span>
                <span>精力 100/100</span>
              </div>
            </div>
          </div>

          {/* Center: Realm Plaque Banner */}
          <div className="flex items-center gap-2">
            <div className="px-5 py-1 rounded-xl bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-2 border-amber-400 shadow-md flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span className="font-black text-sm text-white tracking-widest game-title-font">
                {currentScene.name}
              </span>
              <span className="text-[10px] text-amber-300/80 font-mono">[{currentScene.region}]</span>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setIsMapModalOpen(true);
              }}
              className="flash-gold-btn px-3 py-1 rounded-lg text-xs cursor-pointer flex items-center gap-1"
            >
              <Compass className="w-3.5 h-3.5 text-slate-950" />
              <span>大地图</span>
            </button>
          </div>

          {/* Right: Currencies & Top Quick Utilities */}
          <div className="flex items-center gap-2.5">
            {/* Spirit Gold Coins */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/60 border border-amber-400/50 text-xs font-mono font-bold text-amber-300 shadow-inner">
              <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{playerCoins}</span>
              <span className="text-[10px] text-slate-400 font-normal">灵石</span>
            </div>

            {/* Spirit Diamonds */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/60 border border-cyan-400/50 text-xs font-mono font-bold text-cyan-300 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
              <span>50</span>
              <span className="text-[10px] text-slate-400 font-normal">灵晶</span>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={onToggleSound}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
              title={soundEnabled ? '音效开启' : '音效静音'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 2. Main 2D Scene Canvas Stage (Interactive Playground) */}
        <div
          onClick={handleMapClick}
          className="relative w-full h-[530px] bg-slate-950 select-none overflow-hidden cursor-crosshair"
        >
          {/* Rich 2D Vector Scenery for each Zone */}
          <SceneBackground sceneId={currentScene.id} />

          {/* Floating Web Game Event Activity Badges (Top-Left) */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            {onOpenDailyEvents && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playClick();
                  onOpenDailyEvents();
                }}
                className="flash-event-badge group"
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-600 border-2 border-white flex items-center justify-center shadow-lg group-hover:shadow-[0_0_15px_rgba(245,158,11,0.8)]">
                  <Gift className="w-5 h-5 text-slate-950 animate-bounce" />
                </div>
                <span className="text-[10px] font-black text-amber-300 bg-black/80 px-1.5 py-0.2 rounded border border-amber-400/50 mt-1 game-title-font">
                  七日盛典
                </span>
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                if (onOpenDailyEvents) onOpenDailyEvents();
              }}
              className="flash-event-badge group"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-b from-rose-500 to-rose-700 border-2 border-white flex items-center justify-center shadow-lg group-hover:shadow-[0_0_15px_rgba(244,63,94,0.8)]">
                <Zap className="w-5 h-5 text-white animate-pulse" />
              </div>
              <span className="text-[10px] font-black text-rose-300 bg-black/80 px-1.5 py-0.2 rounded border border-rose-400/50 mt-1 game-title-font">
                神兽试炼
              </span>
            </button>
          </div>

          {/* Top-Right Quick Quest & Fast Guide */}
          {onOpenQuestLog && (
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playClick();
                  onOpenQuestLog();
                }}
                className="flash-event-badge group"
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-b from-amber-400 to-orange-600 border-2 border-white flex items-center justify-center shadow-lg group-hover:shadow-[0_0_15px_rgba(251,146,60,0.8)]">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] font-black text-orange-300 bg-black/80 px-1.5 py-0.2 rounded border border-amber-400/50 mt-1 game-title-font">
                  历练卷轴
                </span>
              </button>
            </div>
          )}

          {/* Click-to-Move Ripple Effect (Classic Flash Golden Ring Target) */}
          {clickTarget && (
            <div
              key={clickTarget.id}
              style={{ left: `${clickTarget.x}%`, top: `${clickTarget.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
            >
              <div className="w-10 h-10 rounded-full border-2 border-amber-400 animate-target-ripple" />
              <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-amber-300" />
            </div>
          )}

          {/* Floating Heal Notice Alert */}
          {healNotice && (
            <div className="absolute top-6 inset-x-0 mx-auto w-fit z-40 bg-emerald-950/95 border-2 border-emerald-400 px-6 py-2 rounded-2xl shadow-2xl text-emerald-200 text-xs font-bold flex items-center gap-2 animate-bounce">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
              <span>{healNotice}</span>
            </div>
          )}

          {/* Shaking Bush (草丛探索 - Click to encounter wild spirits!) */}
          <div
            onClick={handleBushClick}
            style={{ left: '16%', top: '72%' }}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group ${
              bushShaking ? 'animate-[wiggle_0.2s_ease-in-out_infinite]' : ''
            }`}
            title="灵气草丛：点击惊动隐匿幻灵！"
          >
            <div className="bg-emerald-950/90 text-emerald-300 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/40 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
              🌿 灵气草丛
            </div>
            <div className="w-12 h-10 bg-gradient-to-t from-emerald-900 to-emerald-600 rounded-t-full border border-emerald-400/60 shadow-lg flex items-center justify-center">
              <Trees className="w-6 h-6 text-emerald-200" />
            </div>
          </div>

          {/* Interactive Treasure Chest (远古灵宝箱) */}
          {currentScene.chests.map((chest) => {
            const isOpened = openedChestIds.includes(chest.id);
            return (
              <div
                key={chest.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isOpened) {
                    sound.playCatchSuccess();
                    onOpenChest(chest.id, chest.coins, chest.itemId, chest.itemCount);
                  }
                }}
                style={{ left: `${chest.x}%`, top: `${chest.y}%` }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group ${
                  isOpened ? 'opacity-40 cursor-default' : 'animate-bounce'
                }`}
              >
                {!isOpened && (
                  <div className="bg-amber-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full shadow border border-amber-200 mb-1">
                    ✨ 探索宝箱
                  </div>
                )}
                <div
                  className={`w-11 h-9 rounded-lg border-2 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                    isOpened
                      ? 'bg-stone-800 border-stone-600 text-stone-500'
                      : 'bg-gradient-to-b from-amber-400 to-amber-600 border-amber-200 text-slate-950'
                  }`}
                >
                  <Gift className="w-5 h-5" />
                </div>
              </div>
            );
          })}

          {/* Scene NPCs with Floating Dialogue Badges, Role Titles & Golden Arcane Ring */}
          {currentScene.npcs.map((npc) => (
            <div
              key={npc.id}
              onClick={(e) => {
                e.stopPropagation();
                handleNpcClick(npc);
              }}
              style={{ left: `${npc.x}%`, top: `${npc.y}%` }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group flex flex-col items-center z-20"
            >
              {/* NPC Animated Exclamation Quest Beacon */}
              <div className="relative mb-0.5 animate-bounce">
                <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shadow-md border-2 border-yellow-200">
                  !
                </div>
              </div>

              {/* NPC Quest / Dialogue Marker Bubble & Role Title */}
              <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-lg border border-amber-200 mb-1 flex items-center gap-1 group-hover:scale-110 transition-transform">
                <Sparkles className="w-3 h-3 text-slate-950" />
                <span>{npc.name}</span>
                <span className="text-[9px] font-normal text-slate-900 border-l border-slate-900/30 pl-1">
                  {npc.role}
                </span>
              </div>

              <div className="relative">
                <NpcAvatar type={npc.avatarSvg} size={72} />
                {/* Golden Arcane Base Circle */}
                <div className="w-16 h-4 border border-amber-400/60 bg-amber-500/20 rounded-full blur-2xs mx-auto -mt-2 animate-pulse" />
              </div>
            </div>
          ))}

          {/* Roaming Wild Spirits with Elemental Aura, Level Plate and Battle Swords */}
          {currentScene.wildPets.map((wp, index) => {
            const sp = PET_SPECIES[wp.speciesId];
            if (!sp) return null;
            const xPos = 20 + ((index * 36 + 24) % 65);
            const yPos = 38 + ((index * 26 + 18) % 36);

            // Elemental aura colors
            const auraColor =
              sp.type === 'FIRE'
                ? 'border-orange-500/80 bg-orange-500/25 shadow-orange-500/50'
                : sp.type === 'WATER'
                ? 'border-cyan-400/80 bg-cyan-500/25 shadow-cyan-400/50'
                : sp.type === 'GRASS'
                ? 'border-emerald-400/80 bg-emerald-500/25 shadow-emerald-400/50'
                : sp.type === 'ELECTRIC'
                ? 'border-yellow-400/80 bg-yellow-500/25 shadow-yellow-400/50'
                : sp.type === 'ICE'
                ? 'border-sky-300/80 bg-sky-400/25 shadow-sky-300/50'
                : 'border-slate-400/80 bg-slate-500/25 shadow-slate-400/50';

            return (
              <div
                key={`${wp.speciesId}_${index}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleWildPetClick(wp.speciesId, wp.minLevel, wp.maxLevel);
                }}
                style={{ left: `${xPos}%`, top: `${yPos}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group flex flex-col items-center z-20 animate-bounce"
              >
                {/* Level Tag & Swords Trigger Badge with Rarity Star */}
                <div className="flex items-center gap-1 bg-slate-950/95 px-2.5 py-0.5 rounded-full border border-amber-400 text-[10px] text-amber-300 font-bold mb-1 shadow-lg group-hover:scale-110 group-hover:border-amber-200 transition-transform">
                  <Swords className="w-3 h-3 text-rose-400" />
                  <span>
                    {sp.name} Lv.{wp.minLevel}
                  </span>
                  <span className="text-[9px] text-amber-400 font-black">
                    {sp.rarity === 'LEGENDARY' ? '★传世' : sp.rarity === 'EPIC' ? '★史诗' : '★灵兽'}
                  </span>
                </div>

                <div className="relative">
                  <PetAvatar speciesId={wp.speciesId} size={62} />
                  {/* Dynamic Pulsing Elemental Floor Aura */}
                  <div className={`w-16 h-4 rounded-full border shadow-md blur-2xs mx-auto -mt-2 animate-pulse ${auraColor}`} />
                </div>
              </div>
            );
          })}

          {/* Simulated MMO Other Online Players */}
          {otherPlayers.map((op, idx) => (
            <div
              key={idx}
              style={{ left: `${op.x}%`, top: `${op.y}%` }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-end gap-1.5 opacity-85 pointer-events-none z-15"
            >
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-bold text-cyan-300 bg-slate-950/90 px-1.5 py-0.2 rounded border border-cyan-400/40 whitespace-nowrap mb-0.5">
                  [天枢] {op.name}
                </span>
                <PlayerAvatar size={50} direction={op.dir} />
              </div>
              <div className="flex flex-col items-center mb-1">
                <PetAvatar speciesId={op.petId} size={36} />
              </div>
            </div>
          ))}

          {/* 3. The Player Character & Following Companion Pet (跟随宠物) */}
          <div
            style={{
              left: `${playerPos.x}%`,
              top: `${playerPos.y}%`,
              transition: 'left 0.45s ease-out, top 0.45s ease-out',
            }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-25 flex items-end gap-2 pointer-events-none"
          >
            {/* Following Pet Companion (跟随幻灵) with Heart Bubble and Elemental Aura */}
            {leaderPet && (
              <div
                className={`flex flex-col items-center transition-all ${
                  playerDirection === 'left' ? 'order-last' : 'order-first'
                } animate-bounce`}
              >
                <div className="flex items-center gap-1 bg-slate-950/95 text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded-full border border-amber-400 shadow-md mb-0.5">
                  <Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400 animate-pulse" />
                  <span>{leaderPet.nickname}</span>
                  <span className="text-slate-400 text-[8px]">Lv.{leaderPet.level}</span>
                </div>
                <div className="relative">
                  <PetAvatar speciesId={leaderPet.speciesId} size={48} />
                  <div className="w-12 h-3.5 bg-amber-400/30 border border-amber-400/50 rounded-full blur-2xs mx-auto -mt-1.5 animate-pulse" />
                </div>
              </div>
            )}

            {/* Player Avatar */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-amber-300 bg-slate-950/95 px-2 py-0.5 rounded border border-amber-400 whitespace-nowrap mb-0.5 shadow-md game-title-font">
                👑 {playerName}
              </span>
              <div className="relative">
                <PlayerAvatar size={62} isMoving={isMoving} direction={playerDirection} />
                <div className="w-14 h-4 bg-blue-500/25 border border-blue-400/40 rounded-full blur-2xs mx-auto -mt-1.5" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. The Classic Flash Web Game Bottom Dock Toolbar (洛克王国 / 奥奇传说 / 赛尔号 标志性底栏) */}
        <div className="h-20 flash-bottom-dock px-4 flex items-center justify-between z-30 shadow-2xl">
          {/* Left: Interactive Real-Time Web Game Chat Window */}
          <div className="hidden lg:flex flex-col w-72 bg-slate-950/90 rounded-xl border border-amber-500/40 p-1.5 shadow-inner">
            {/* Channel Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-800 pb-1 mb-1 text-[10px] font-bold">
              {(['ALL', 'WORLD', 'RUMOR', 'SYSTEM'] as const).map((ch) => (
                <button
                  key={ch}
                  onClick={() => setChatChannel(ch)}
                  className={`px-1.5 py-0.2 rounded cursor-pointer ${
                    chatChannel === ch ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {ch === 'ALL' ? '综合' : ch === 'WORLD' ? '世界' : ch === 'RUMOR' ? '传闻' : '系统'}
                </button>
              ))}
            </div>

            {/* Chat Messages Log */}
            <div className="h-7 overflow-y-auto space-y-0.5 text-[10px] pr-1">
              {chatMessages.slice(-2).map((msg, i) => (
                <div key={i} className="truncate">
                  <span className="text-amber-400 font-bold">{msg.sender}: </span>
                  <span className="text-slate-200">{msg.text}</span>
                </div>
              ))}
            </div>

            {/* Quick Send Input Form */}
            <form onSubmit={handleSendChat} className="flex items-center gap-1 mt-1 pt-1 border-t border-slate-800">
              <input
                type="text"
                placeholder="发送世界发言..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-white focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded cursor-pointer hover:bg-amber-400 flex items-center gap-0.5"
              >
                <Send className="w-2.5 h-2.5" />
                <span>发</span>
              </button>
            </form>
          </div>

          {/* Center-Right: Big Classic Skeuomorphic 3D Orb Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-4 mx-auto lg:mx-0">
            {/* 1. Spirit Party (随行幻灵背包) */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenPetBag();
              }}
              className="flash-dock-btn group"
            >
              <div className="w-13 h-13 flash-orb bg-gradient-to-b from-cyan-400 via-blue-500 to-blue-700 border-2 border-cyan-200 flex items-center justify-center text-white text-cyan-400">
                <Backpack className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full border border-white">
                  {playerParty.length}/6
                </span>
              </div>
              <span className="text-[11px] font-bold text-cyan-200 mt-1 game-title-font">随行幻灵</span>
            </button>

            {/* 2. Spirit Codex (幻灵图鉴) */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenPokedex();
              }}
              className="flash-dock-btn group"
            >
              <div className="w-13 h-13 flash-orb bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 border-2 border-yellow-200 flex items-center justify-center text-slate-950 text-amber-400">
                <BookOpen className="w-6 h-6 text-slate-950" />
              </div>
              <span className="text-[11px] font-bold text-amber-200 mt-1 game-title-font">幻灵图鉴</span>
            </button>

            {/* 3. Pet Cultivation / Evolution (幻灵修炼) */}
            {onOpenPetTrain && (
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenPetTrain();
                }}
                className="flash-dock-btn group"
              >
                <div className="w-13 h-13 flash-orb bg-gradient-to-b from-purple-400 via-purple-600 to-indigo-800 border-2 border-purple-200 flex items-center justify-center text-white text-purple-400">
                  <Zap className="w-6 h-6 text-amber-300" />
                </div>
                <span className="text-[11px] font-bold text-purple-200 mt-1 game-title-font">幻灵修炼</span>
              </button>
            )}

            {/* 4. Treasure Shop (万象宝阁) */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenShop();
              }}
              className="flash-dock-btn group"
            >
              <div className="w-13 h-13 flash-orb bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-700 border-2 border-emerald-200 flex items-center justify-center text-white text-emerald-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-emerald-200 mt-1 game-title-font">万象宝阁</span>
            </button>

            {/* 5. Full Heal (快速调息) */}
            <button
              onClick={() => {
                sound.playHeal();
                onHealParty();
                setHealNotice('✨ 医圣仙泉！全队幻灵气血与招式灵力已全部回复满状态！');
                setTimeout(() => setHealNotice(null), 3000);
              }}
              className="flash-dock-btn group"
            >
              <div className="w-13 h-13 flash-orb bg-gradient-to-b from-pink-400 via-rose-500 to-rose-700 border-2 border-pink-200 flex items-center justify-center text-white text-rose-400">
                <Heart className="w-6 h-6 fill-white" />
              </div>
              <span className="text-[11px] font-bold text-pink-200 mt-1 game-title-font">快速调息</span>
            </button>

            {/* 6. Quest Log (历练任务) */}
            {onOpenQuestLog && (
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenQuestLog();
                }}
                className="flash-dock-btn group"
              >
                <div className="w-13 h-13 flash-orb bg-gradient-to-b from-amber-400 via-orange-500 to-amber-700 border-2 border-amber-200 flex items-center justify-center text-white text-orange-400">
                  <Award className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-orange-200 mt-1 game-title-font">历练任务</span>
              </button>
            )}

            {/* 7. World Map (世界地图) */}
            <button
              onClick={() => {
                sound.playClick();
                setIsMapModalOpen(true);
              }}
              className="flash-dock-btn group"
            >
              <div className="w-13 h-13 flash-orb bg-gradient-to-b from-indigo-400 via-indigo-600 to-slate-900 border-2 border-indigo-200 flex items-center justify-center text-white text-indigo-400">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-indigo-200 mt-1 game-title-font">世界地图</span>
            </button>
          </div>
        </div>
      </div>

      {/* NPC Dialogue Interactive Modal */}
      {activeDialogue && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-400 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-amber-500/30 pb-3 mb-4">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-black text-amber-300 text-base game-title-font">
                {activeDialogue.name}
              </h3>
            </div>

            <p className="text-slate-200 text-sm leading-relaxed mb-6 font-medium">
              “{activeDialogue.text}”
            </p>

            <div className="flex items-center justify-end gap-3">
              {activeDialogue.actionType && (
                <button
                  onClick={() => handleNpcAction(activeDialogue.actionType)}
                  className="flash-gold-btn px-5 py-2 rounded-xl text-xs font-black cursor-pointer shadow-md"
                >
                  {activeDialogue.actionType === 'HEAL'
                    ? '接受疗伤甘霖'
                    : activeDialogue.actionType === 'SHOP'
                    ? '浏览商阁宝物'
                    : '接受巅峰挑战'}
                </button>
              )}
              <button
                onClick={() => setActiveDialogue(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-colors"
              >
                告辞离去
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fast Travel Illustrated World Map Modal */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-amber-500 rounded-2xl p-6 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-400 animate-spin" />
                <h3 className="font-black text-amber-300 text-base game-title-font">
                  幻灵秘境 · 九州大陆传送古阵
                </h3>
              </div>
              <button
                onClick={() => setIsMapModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-2 max-h-[60vh] overflow-y-auto p-1">
              {Object.values(SCENES_DATA).map((scene) => {
                const isCurrent = scene.id === currentScene.id;
                return (
                  <button
                    key={scene.id}
                    disabled={isCurrent}
                    onClick={() => {
                      sound.playClick();
                      onTeleportToScene(scene.id);
                      setIsMapModalOpen(false);
                    }}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-950/70 border-amber-400 shadow-md ring-2 ring-amber-400/50'
                        : 'bg-slate-950 hover:bg-slate-850 border-slate-800 hover:border-amber-400/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-sm text-amber-300 game-title-font">
                          {scene.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-black">
                            当前位置
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        [{scene.region}]
                      </span>
                      <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                        {scene.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-amber-400/90 font-mono">
                      <span>野外幻灵: {scene.wildPets.length}种</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
