import React, { useState } from 'react';
import { SceneConfig, PetInstance, SceneId, Friend, CharacterOutfit } from '../types/game';
import { SCENES_DATA } from '../data/scenes';
import { PET_SPECIES } from '../data/species';
import { PetAvatar, ELEMENT_COLORS } from './PetAvatar';
import { PlayerAvatar, NpcAvatar, FriendAvatar } from './PlayerAvatar';
import { SceneBackground } from './SceneBackground';
import { ArtGalleryModal } from './ArtGalleryModal';
import { WorldMapView } from './WorldMapView';
import { CharacterDetailModal } from './CharacterDetailModal';
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
  X,
  Sparkles,
  MapPin,
  ChevronRight,
  Shield,
  Zap,
  Award,
  Users,
  Gift,
  User,
} from 'lucide-react';
import {
  IconGuluBall,
  IconRocoCoin,
  IconMagicBag,
  IconSpellbook,
  IconMagicShop,
  IconKingdomMap,
  IconColiseum,
  IconMagicPotion,
  IconMagicMail,
} from './GameIcons';

interface SceneViewProps {
  currentScene: SceneConfig;
  playerParty: PetInstance[];
  activeLeaderIndex: number;
  playerCoins: number;
  playerBadges: string[];
  openedChestIds: string[];
  playerName: string;
  friends?: Friend[];
  onOpenFriends?: () => void;
  onGiftFriend?: (friendId: string) => void;
  onClaimFromFriend?: (friendId: string) => void;
  onToggleFollowInScene?: (friendId: string) => void;
  claimableShardsCount?: number;
  playerOutfit?: CharacterOutfit;
  onOpenWardrobe?: () => void;
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
  openedChestIds,
  playerName,
  friends = [],
  onOpenFriends,
  onGiftFriend,
  onClaimFromFriend,
  onToggleFollowInScene,
  claimableShardsCount = 0,
  playerOutfit,
  onOpenWardrobe,
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

  // Active friend dialogue card popup
  const [activeFriendCard, setActiveFriendCard] = useState<{ friend: Friend; petReaction?: string } | null>(null);

  // Click target ripple feedback
  const [clickTarget, setClickTarget] = useState<{ x: number; y: number; id: number } | null>(null);

  // NPC dialogue popup
  const [activeDialogue, setActiveDialogue] = useState<{ name: string; text: string; actionType?: string } | null>(null);

  // World map fast travel modal (Image 3)
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);

  // Character detail modal (Image 2)
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState<boolean>(false);

  // High-definition Art Gallery modal
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);

  // Healing notification alert
  const [healNotice, setHealNotice] = useState<string | null>(null);

  // Shaking bush interactive feedback
  const [bushShaking, setBushShaking] = useState<boolean>(false);

  const leaderPet = playerParty[activeLeaderIndex] || playerParty[0];

  // Handle clicking ground to walk with starlight ripple
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
      setHealNotice('✨ 宠物医院爱心护理！全队宠物精力与技能 PP 已全部回满！');
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

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center select-none">
      {/* 1. Celestial Fantasy Viewport Frame */}
      <div className="w-full rounded-2xl overflow-hidden relative flex flex-col shadow-2xl border-2 border-[#b8860b]/40 bg-[#06111f]">
        {/* Top Scene Ribbon Bar (幻灵世界经典场景金卷轴与快捷操作) */}
        <div className="h-13 bg-gradient-to-r from-[#061426] via-[#091b30] to-[#061426] border-b border-[#b8860b]/40 px-3 sm:px-4 flex items-center justify-between z-30 gap-2">
          {/* Left: Classic Scene Ribbon Banner */}
          <div className="flex items-center gap-2">
            <div className="roco-scene-ribbon">
              <MapPin className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
              <div className="flex items-center gap-1.5">
                <span className="roco-title-font font-black text-xs sm:text-sm text-amber-200 tracking-wider">
                  {currentScene.name}
                </span>
                <span className="text-[10px] text-amber-300/70 hidden sm:inline font-mono">
                  · {currentScene.region}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setIsMapModalOpen(true);
              }}
              className="roco-action-pill text-[11px] py-1 px-3 shadow-md"
              title="查看王国世界地图并快速传送"
            >
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden xs:inline">大地图</span>
            </button>
          </div>

          {/* Right: Quick Full Heal, Wealth & Sound Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick Heal Party Button */}
            <button
              onClick={() => {
                sound.playHeal();
                onHealParty();
                setHealNotice('✨ 宠物医院爱心护理！全队宠物精力与技能 PP 已全部回满！');
                setTimeout(() => setHealNotice(null), 3000);
              }}
              className="roco-action-pill bg-gradient-to-b from-rose-950/80 to-rose-900/60 text-rose-200 hover:text-white border-rose-500/50"
              title="爱心护理 · 秒回全队宠物满精力满 PP"
            >
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500/30" />
              <span className="hidden sm:inline">爱心回血</span>
            </button>

            {/* Roco Coins Display */}
            <div className="roco-currency-badge" title="流通货币：幻灵金币">
              <IconRocoCoin size={20} />
              <span className="font-mono text-xs font-bold text-amber-300">
                {playerCoins.toLocaleString()}
              </span>
              <span className="text-[10px] text-amber-400 font-bold hidden sm:inline">幻灵金币</span>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={onToggleSound}
              className="p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700/60"
              title={soundEnabled ? '音效开启' : '音效静音'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-300" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 2. Main 2D Scene Canvas Stage */}
        <div
          onClick={handleMapClick}
          className="relative w-full h-[480px] sm:h-[510px] bg-slate-950 select-none overflow-hidden cursor-crosshair"
        >
          {/* Ethereal Scene Scenery Background */}
          <SceneBackground sceneId={currentScene.id} />

          {/* Click-to-Move Starlight Target Ripple */}
          {clickTarget && (
            <div
              key={clickTarget.id}
              style={{ left: `${clickTarget.x}%`, top: `${clickTarget.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
            >
              <div className="w-8 h-8 rounded-full border-2 border-cyan-400 animate-target-ripple shadow-[0_0_12px_#38bdf8]" />
              <div className="w-2 h-2 rounded-full bg-cyan-300 mx-auto -mt-5 animate-ping" />
            </div>
          )}

          {/* Healing Notice Notification Toast */}
          {healNotice && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 border border-emerald-400/80 text-emerald-300 px-4 py-2 rounded-xl text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{healNotice}</span>
            </div>
          )}

          {/* Shaking Mystic Herb Bush */}
          <div
            onClick={handleBushClick}
            style={{ left: '10%', top: '55%' }}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-15 ${
              bushShaking ? 'animate-screen-shake' : ''
            }`}
            title="点击探索灌木丛（可能惊醒潜伏的野生宠物）"
          >
            <div className="relative">
              <svg viewBox="0 0 60 50" className="w-12 h-10 drop-shadow-md">
                <path
                  d="M 10 40 C 2 30 5 15 18 18 C 24 6 42 6 48 18 C 58 16 60 32 50 42 C 45 48 15 48 10 40 Z"
                  fill="#064e3b"
                  opacity="0.9"
                />
                <path
                  d="M 14 38 C 8 28 12 18 22 22 C 28 10 40 10 44 20 C 52 20 54 32 46 40 Z"
                  fill="#10b981"
                  opacity="0.8"
                />
                {/* Glowing Flowers */}
                <circle cx="24" cy="22" r="2.5" fill="#38bdf8" className="animate-pulse" />
                <circle cx="36" cy="28" r="2.5" fill="#a855f7" />
              </svg>
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 absolute top-2 right-2 animate-ping shadow-[0_0_8px_#38bdf8]" />
            </div>
            <span className="text-[9px] text-teal-300/80 bg-slate-950/80 px-1.5 py-0.2 rounded border border-teal-500/30 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              幽林灌木
            </span>
          </div>

          {/* Scene Treasure Chest */}
          {currentScene.chests.map((chest) => {
            const isOpened = openedChestIds.includes(chest.id);
            return (
              <div
                key={chest.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isOpened) {
                    sound.playVictory();
                    onOpenChest(chest.id, chest.coins, chest.itemId, chest.itemCount);
                  }
                }}
                style={{ left: `${chest.x}%`, top: `${chest.y}%` }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-15 ${
                  isOpened ? 'opacity-40 cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'
                }`}
                title={isOpened ? '宝箱已被拾取' : '点击开启灵境宝箱'}
              >
                <div
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-lg transition-all ${
                    isOpened
                      ? 'bg-slate-900 border-slate-700 text-slate-500'
                      : 'bg-gradient-to-b from-cyan-950 to-indigo-950 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                </div>
                {!isOpened && (
                  <span className="text-[9px] text-cyan-300 bg-slate-950/90 px-1.5 py-0.2 rounded-full border border-cyan-400/40 whitespace-nowrap block text-center mt-0.5">
                    秘境宝箱
                  </span>
                )}
              </div>
            );
          })}

          {/* Scene NPCs with Roco Kingdom Quest Beacon & Nameplate */}
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
              {/* NPC Quest Beacon (经典金感叹号/任务标记) */}
              <div className="flex flex-col items-center mb-1 group-hover:scale-105 transition-transform">
                <div className="roco-npc-marker w-6 h-6 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-600 border-2 border-yellow-100 flex items-center justify-center text-slate-950 font-black text-xs shadow-lg mb-0.5">
                  !
                </div>
                <div className="roco-roamer-tag">
                  <span className="roco-title-font font-bold text-amber-200 text-[10px]">{npc.name}</span>
                  <span className="text-[9px] text-slate-400 border-l border-amber-500/40 pl-1 font-normal">
                    {npc.role}
                  </span>
                </div>
              </div>

              <div className="relative">
                <NpcAvatar type={npc.avatarSvg} size={64} />
                <div className="w-14 h-3.5 border border-cyan-400/30 bg-cyan-500/10 rounded-full blur-2xs mx-auto -mt-1.5 animate-pulse" />
              </div>
            </div>
          ))}

          {/* Roaming Wild Spirits Spaced Out with Overhead Capsule (野生幻灵血条标牌) */}
          {currentScene.wildPets.map((wp, index) => {
            const sp = PET_SPECIES[wp.speciesId];
            if (!sp) return null;
            const xPos = index === 0 ? 25 : 72;
            const yPos = index === 0 ? 52 : 68;
            const elColor = ELEMENT_COLORS[sp.type];

            const auraColor =
              sp.type === 'FIRE'
                ? 'border-orange-500/60 bg-orange-500/20 shadow-orange-500/40'
                : sp.type === 'WATER'
                ? 'border-cyan-400/60 bg-cyan-500/20 shadow-cyan-400/40'
                : sp.type === 'GRASS'
                ? 'border-emerald-400/60 bg-emerald-500/20 shadow-emerald-400/40'
                : sp.type === 'ELECTRIC'
                ? 'border-amber-400/60 bg-amber-500/20 shadow-amber-400/40'
                : sp.type === 'ICE'
                ? 'border-sky-300/60 bg-sky-400/20 shadow-sky-300/40'
                : 'border-slate-400/60 bg-slate-500/20 shadow-slate-400/40';

            return (
              <div
                key={`${wp.speciesId}_${index}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleWildPetClick(wp.speciesId, wp.minLevel, wp.maxLevel);
                }}
                style={{ left: `${xPos}%`, top: `${yPos}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group flex flex-col items-center z-20 roco-pet-float"
              >
                {/* Roco Kingdom Classic Wild Pet Overhead Pill */}
                <div className="roco-roamer-tag mb-1 group-hover:scale-110 transition-all">
                  {/* Element Badge */}
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-black ${elColor.bg} ${elColor.text} border border-amber-400/60`}>
                    {elColor.label}
                  </span>
                  {/* Pet Name & Level */}
                  <span className="roco-title-font font-bold text-[10px] text-slate-100">
                    {sp.name}
                  </span>
                  <span className="font-mono text-[9px] text-amber-300 font-bold">
                    Lv.{wp.minLevel}
                  </span>
                  {/* Mini HP Track */}
                  <div className="w-8 roco-gauge-track h-1.5 hidden sm:block">
                    <div className="roco-gauge-hp" style={{ width: '100%' }} />
                  </div>
                  {/* Hover prompt */}
                  <span className="hidden group-hover:inline text-[8px] text-amber-400 font-bold pl-0.5 animate-pulse">
                    ⚔ 对决
                  </span>
                </div>

                <div className="relative">
                  <PetAvatar speciesId={wp.speciesId} size={58} />
                  <div className={`w-14 h-3.5 rounded-full border shadow-md blur-2xs mx-auto -mt-1.5 animate-pulse ${auraColor}`} />
                </div>
              </div>
            );
          })}

          {/* 3. The Player Character & Following Companion Pet */}
          <div
            style={{
              left: `${playerPos.x}%`,
              top: `${playerPos.y}%`,
              transition: 'left 0.45s ease-out, top 0.45s ease-out',
            }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-25 flex items-end gap-1.5 pointer-events-none"
          >
            {/* Following Pet Companion */}
            {leaderPet && (
              <div
                className={`flex flex-col items-center transition-all ${
                  playerDirection === 'left' ? 'order-last' : 'order-first'
                } animate-bounce`}
              >
                <div className="flex items-center gap-1 bg-slate-900/90 text-cyan-200 text-[8px] font-medium px-2 py-0.2 rounded-full border border-cyan-500/30 shadow-xs mb-0.5 backdrop-blur-md">
                  <Heart className="w-2 h-2 text-rose-400 fill-rose-400" />
                  <span>{leaderPet.nickname}</span>
                </div>
                <div className="relative">
                  <PetAvatar speciesId={leaderPet.speciesId} size={42} />
                  <div className="w-10 h-3 bg-cyan-400/20 border border-cyan-400/30 rounded-full blur-2xs mx-auto -mt-1" />
                </div>
              </div>
            )}

            {/* Player Avatar */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold text-white bg-slate-900/90 px-2 py-0.2 rounded-full border border-cyan-500/40 whitespace-nowrap mb-0.5 shadow-xs backdrop-blur-md">
                ✦ {playerName}
              </span>
              <div className="relative">
                <PlayerAvatar size={56} isMoving={isMoving} direction={playerDirection} outfit={playerOutfit} />
                <div className="w-12 h-3.5 bg-blue-500/20 border border-blue-400/30 rounded-full blur-2xs mx-auto -mt-1" />
              </div>
            </div>
          </div>

          {/* 4. Visiting Friends & Following Spirit Companions */}
          {friends
            .filter((f) => f.isFollowingInScene || f.locationId === currentScene.id)
            .map((friend, fIdx) => {
              const fX = friend.x ?? (fIdx === 0 ? 34 : 66);
              const fY = friend.y ?? (fIdx === 0 ? 68 : 74);
              const comp = PET_SPECIES[friend.companionPet.speciesId];
              const elem = comp ? ELEMENT_COLORS[comp.type] : null;

              return (
                <div
                  key={friend.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playClick();
                    setActiveFriendCard({ friend });
                  }}
                  style={{
                    left: `${fX}%`,
                    top: `${fY}%`,
                  }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-22 flex items-end gap-2 cursor-pointer group hover:scale-105 transition-transform"
                  title="点击与学院好友交流、互赠友谊碎片或抚摸其跟随宠物"
                >
                  {/* Friend's Spirit Companion Following Closely */}
                  <div className="flex flex-col items-center animate-bounce" style={{ animationDuration: '2.8s' }}>
                    <div className="flex items-center gap-1 bg-slate-900/90 text-cyan-200 text-[8px] font-bold px-2 py-0.2 rounded-full border border-cyan-400/40 shadow-md mb-0.5 whitespace-nowrap backdrop-blur-md">
                      <Sparkles className="w-2 h-2 text-cyan-300 animate-pulse" />
                      <span>{friend.companionPet.nickname}</span>
                      <span className="text-[7px] text-slate-400 font-normal">Lv.{friend.companionPet.level}</span>
                    </div>
                    <div className="relative">
                      <PetAvatar speciesId={friend.companionPet.speciesId} size={44} />
                      <div className="w-10 h-3 bg-cyan-400/30 border border-cyan-400/40 rounded-full blur-2xs mx-auto -mt-1 shadow-[0_0_8px_rgba(56,189,248,0.5)] animate-pulse" />
                    </div>
                  </div>

                  {/* Friend Cultivator Character */}
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 bg-slate-900/90 px-2 py-0.5 rounded-full border border-indigo-400/50 shadow-md text-[9px] mb-0.5 whitespace-nowrap backdrop-blur-md">
                      <Users className="w-2.5 h-2.5 text-indigo-400" />
                      <span className="font-bold text-slate-100">{friend.name}</span>
                      {friend.canClaimFromFriend && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shadow-[0_0_6px_#38bdf8]" />
                      )}
                    </div>
                    <div className="relative">
                      <FriendAvatar style={friend.avatarStyle} size={52} />
                      <div className="w-11 h-3 bg-indigo-500/20 border border-indigo-400/30 rounded-full blur-2xs mx-auto -mt-1" />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* 3. Authentic Magic Navigation Dock (幻灵世界标志性底部魔法操作台) */}
        <div className="roco-dock-bar py-2 px-3 sm:px-6 flex items-center justify-around sm:justify-center sm:gap-4 md:gap-5 z-30 shadow-2xl backdrop-blur-xl">
          {/* 1. Spirit Party with 6 Mini Slots Preview (魔法行囊) */}
          <div
            onClick={() => {
              sound.playClick();
              onOpenPetBag();
            }}
            className="roco-dock-btn group"
            title="点击打开魔法背包 · 随行宠物与道具"
          >
            <div className="relative">
              <div className="roco-dock-icon-circle border-[#facc15] shadow-[0_0_12px_rgba(250,204,21,0.5)]">
                <IconMagicBag size={30} />
              </div>
              <span className="absolute -top-1 -right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full border border-yellow-200 shadow font-mono">
                {playerParty.length}/6
              </span>
            </div>
            {/* 6 Mini Party Orbs Preview Indicator (幻灵世界特色6宠血量状态点) */}
            <div className="flex items-center gap-0.5 mt-1 pointer-events-none">
              {Array.from({ length: 6 }).map((_, i) => {
                const pet = playerParty[i];
                return (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full border transition-all ${
                      pet
                        ? pet.currentHp > 0
                          ? 'bg-emerald-400 border-yellow-300 shadow-[0_0_4px_#34d399]'
                          : 'bg-rose-500 border-rose-300'
                        : 'bg-slate-800/80 border-slate-700'
                    }`}
                  />
                );
              })}
            </div>
            <span className="text-[11px] font-bold text-amber-200 group-hover:text-amber-100 roco-title-font tracking-wider mt-0.5">
              魔法行囊
            </span>
          </div>

          {/* 2. World Map (王国大地图) */}
          <button
            onClick={() => {
              sound.playClick();
              setIsMapModalOpen(true);
            }}
            className="roco-dock-btn group"
            title="打开幻灵世界全域地图"
          >
            <div className="roco-dock-icon-circle">
              <IconKingdomMap size={26} />
            </div>
            <span className="text-[11px] font-bold text-slate-200 group-hover:text-amber-200 roco-title-font tracking-wider mt-1">
              世界地图
            </span>
          </button>

          {/* 3. Illustrated Pet Codex (魔兽图鉴) */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenPokedex();
            }}
            className="roco-dock-btn group"
            title="查看幻灵世界图鉴"
          >
            <div className="roco-dock-icon-circle">
              <IconSpellbook size={26} />
            </div>
            <span className="text-[11px] font-bold text-slate-200 group-hover:text-indigo-200 roco-title-font tracking-wider mt-1">
              幻灵图鉴
            </span>
          </button>

          {/* 4. Cultivation & Evolution (幻灵培养室) */}
          {onOpenPetTrain && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenPetTrain();
              }}
              className="roco-dock-btn group"
              title="幻灵培养室 · 学习招式与等级进阶"
            >
              <div className="roco-dock-icon-circle">
                <IconGuluBall size={26} />
              </div>
              <span className="text-[11px] font-bold text-slate-200 group-hover:text-amber-300 roco-title-font tracking-wider mt-1">
                幻灵培养
              </span>
            </button>
          )}

          {/* 5. Magic Bazaar Shop (幻灵集市) */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenShop();
            }}
            className="roco-dock-btn group"
            title="前往幻灵集市购买道具与幻灵球"
          >
            <div className="roco-dock-icon-circle">
              <IconMagicShop size={26} />
            </div>
            <span className="text-[11px] font-bold text-slate-200 group-hover:text-emerald-200 roco-title-font tracking-wider mt-1">
              幻灵集市
            </span>
          </button>

          {/* 6. Friends & Social (魔法好友) */}
          {onOpenFriends && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenFriends();
              }}
              className="roco-dock-btn group relative"
              title="魔法好友录与星光碎片互赠"
            >
              <div className="relative">
                <div className="roco-dock-icon-circle">
                  <PlayerAvatar size={26} />
                </div>
                {claimableShardsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full animate-bounce shadow-md">
                    {claimableShardsCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-bold text-slate-200 group-hover:text-teal-200 roco-title-font tracking-wider mt-1">
                魔法好友
              </span>
            </button>
          )}

          {/* 7. Quest Journal (学院手札) */}
          {onOpenQuestLog && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenQuestLog();
              }}
              className="roco-dock-btn group"
              title="王国学院主线任务手札"
            >
              <div className="roco-dock-icon-circle">
                <IconMagicMail size={26} />
              </div>
              <span className="text-[11px] font-bold text-slate-200 group-hover:text-sky-200 roco-title-font tracking-wider mt-1">
                学院手札
              </span>
            </button>
          )}

          {/* 8. Full Heal (爱心治疗) */}
          <button
            onClick={() => {
              sound.playHeal();
              onHealParty();
              setHealNotice('✨ 萌萌护士爱心治疗！全队宠物精力与招式魔力（PP）已全部恢复满状态！');
              setTimeout(() => setHealNotice(null), 3000);
            }}
            className="roco-dock-btn group"
            title="宠物爱心治疗 · 全队恢复满生命与PP"
          >
            <div className="roco-dock-icon-circle">
              <IconMagicPotion size={26} />
            </div>
            <span className="text-[11px] font-bold text-slate-200 group-hover:text-rose-200 roco-title-font tracking-wider mt-1">
              爱心治疗
            </span>
          </button>

          {/* 9. Player Character Detail (小魔法师档案) */}
          <button
            onClick={() => {
              sound.playClick();
              setIsCharacterModalOpen(true);
            }}
            className="roco-dock-btn group"
            title="查看小魔法师个人档案与装备"
          >
            <div className="roco-dock-icon-circle overflow-hidden">
              <PlayerAvatar size={28} outfit={playerOutfit} />
            </div>
            <span className="text-[11px] font-bold text-slate-200 group-hover:text-sky-300 roco-title-font tracking-wider mt-1">
              法师档案
            </span>
          </button>

          {/* 10. Magic Wardrobe Salon (魔力衣橱) */}
          {onOpenWardrobe && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenWardrobe();
              }}
              className="roco-dock-btn group"
              title="皮卡魔力衣橱 · 魔法服饰换装与发型装扮"
            >
              <div className="roco-dock-icon-circle border-pink-400 shadow-[0_0_12px_rgba(244,114,182,0.4)]">
                <Sparkles className="w-5 h-5 text-pink-300 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <span className="text-[11px] font-bold text-slate-200 group-hover:text-pink-300 roco-title-font tracking-wider mt-1">
                魔力衣橱
              </span>
            </button>
          )}
        </div>
      </div>


      {/* JRPG Visual Novel Style NPC Dialogue Modal */}
      {activeDialogue && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg celestial-glass rounded-2xl p-6 shadow-2xl border border-cyan-500/30">
            <div className="flex items-center gap-3 border-b border-cyan-500/20 pb-3 mb-4">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-cyan-200 text-base">
                {activeDialogue.name}
              </h3>
            </div>

            <p className="text-slate-200 text-sm leading-relaxed mb-6 font-normal">
              “{activeDialogue.text}”
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800/80">
              {activeDialogue.actionType === 'HEAL' && (
                <button
                  onClick={() => handleNpcAction('HEAL')}
                  className="celestial-btn-primary px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>祈求圣泉甘露（全队回满）</span>
                </button>
              )}

              {activeDialogue.actionType === 'SHOP' && (
                <button
                  onClick={() => handleNpcAction('SHOP')}
                  className="celestial-btn-gold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>浏览万象阁宝物</span>
                </button>
              )}

              {activeDialogue.actionType === 'ARENA_CHALLENGE' && (
                <button
                  onClick={() => handleNpcAction('ARENA_CHALLENGE')}
                  className="bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-500/30"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>发起天罡切磋决斗</span>
                </button>
              )}

              <button
                onClick={() => setActiveDialogue(null)}
                className="celestial-btn-ghost px-4 py-2 rounded-xl text-xs cursor-pointer"
              >
                辞别告退
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Friend & Spirit Companion Modal Popover */}
      {activeFriendCard && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#070e1c] rounded-2xl p-6 shadow-2xl border border-cyan-500/40 text-slate-100">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-cyan-400/40 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                  <FriendAvatar style={activeFriendCard.friend.avatarStyle} size={46} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-100 text-base">
                      {activeFriendCard.friend.name}
                    </h3>
                    <span className="text-[10px] text-cyan-300 font-bold px-2 py-0.2 rounded-full bg-cyan-950/60 border border-cyan-500/30">
                      Lv.{activeFriendCard.friend.level}
                    </span>
                  </div>
                  <p className="text-xs text-cyan-400/90 font-medium">
                    {activeFriendCard.friend.title} · {activeFriendCard.friend.locationName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveFriendCard(null)}
                className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Friend Voice & Greeting */}
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 mb-4">
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed italic">
                “{activeFriendCard.friend.greeting}”
              </p>
            </div>

            {/* Friend's Following Spirit Companion Spotlight Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-indigo-950/40 border border-cyan-500/30 flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <PetAvatar speciesId={activeFriendCard.friend.companionPet.speciesId} size={54} />
                  <div className="w-12 h-3 bg-cyan-400/30 rounded-full blur-2xs mx-auto -mt-1.5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-cyan-100">
                      {activeFriendCard.friend.companionPet.nickname}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Lv.{activeFriendCard.friend.companionPet.level}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    学院好友跟随宠物 · 亲密陪伴
                  </p>
                  {activeFriendCard.petReaction && (
                    <p className="text-xs text-rose-300 mt-1 font-medium animate-fadeIn">
                      {activeFriendCard.petReaction}
                    </p>
                  )}
                </div>
              </div>

              {/* Pet Interaction Button */}
              <button
                onClick={() => {
                  sound.playCatchSuccess();
                  const compName = activeFriendCard.friend.companionPet.nickname;
                  const reactions = [
                    `✨【${compName}】亲昵地蹭了蹭你的手心，周身泛起温润星光！`,
                    `💖【${compName}】发出了欢快的鸣响，好感度提升！`,
                    `🌟【${compName}】舒展魔羽，向你轻洒下一阵祥和的魔法光尘！`,
                  ];
                  const chosen = reactions[Math.floor(Math.random() * reactions.length)];
                  setActiveFriendCard((prev) => (prev ? { ...prev, petReaction: chosen } : null));
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-medium transition-all cursor-pointer flex items-center gap-1 shadow-sm shrink-0"
              >
                <Heart className="w-3.5 h-3.5 fill-rose-400/40" />
                <span>抚摸宠物</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                {/* Gift Shard */}
                {onGiftFriend && (
                  <button
                    disabled={activeFriendCard.friend.hasGiftedToday}
                    onClick={() => {
                      sound.playCatchSuccess();
                      onGiftFriend(activeFriendCard.friend.id);
                      setActiveFriendCard((prev) =>
                        prev ? { ...prev, friend: { ...prev.friend, hasGiftedToday: true } } : null
                      );
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1 ${
                      activeFriendCard.friend.hasGiftedToday
                        ? 'bg-slate-800/40 text-slate-500 border border-slate-800 cursor-not-allowed'
                        : 'bg-indigo-600/40 hover:bg-indigo-600/60 text-indigo-200 border border-indigo-500/50 cursor-pointer shadow-md'
                    }`}
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>{activeFriendCard.friend.hasGiftedToday ? '今日已赠' : '赠送友谊碎片'}</span>
                  </button>
                )}

                {/* Claim Shard */}
                {onClaimFromFriend && (
                  <button
                    disabled={!activeFriendCard.friend.canClaimFromFriend}
                    onClick={() => {
                      sound.playCatchSuccess();
                      onClaimFromFriend(activeFriendCard.friend.id);
                      setActiveFriendCard((prev) =>
                        prev ? { ...prev, friend: { ...prev.friend, canClaimFromFriend: false } } : null
                      );
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1 ${
                      activeFriendCard.friend.canClaimFromFriend
                        ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md cursor-pointer animate-pulse'
                        : 'bg-slate-800/30 text-slate-500 border border-slate-800 cursor-not-allowed'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{activeFriendCard.friend.canClaimFromFriend ? '收取友谊碎片' : '碎片已收'}</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {onToggleFollowInScene && (
                  <button
                    onClick={() => {
                      sound.playClick();
                      onToggleFollowInScene(activeFriendCard.friend.id);
                      setActiveFriendCard((prev) =>
                        prev
                          ? {
                              ...prev,
                              friend: {
                                ...prev.friend,
                                isFollowingInScene: !prev.friend.isFollowingInScene,
                              },
                            }
                          : null
                      );
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer border border-slate-700"
                  >
                    {activeFriendCard.friend.isFollowingInScene ? '取消场景同游' : '邀请同游此境'}
                  </button>
                )}

                {onOpenFriends && (
                  <button
                    onClick={() => {
                      setActiveFriendCard(null);
                      onOpenFriends();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 text-xs font-medium cursor-pointer"
                  >
                    打开好友录
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}


      {/* World Map Fast Travel Modal (Image 3) */}
      {isMapModalOpen && (
        <WorldMapView
          currentSceneId={currentScene.id}
          onSelectScene={(sceneId) => {
            onTeleportToScene(sceneId as SceneId);
            setIsMapModalOpen(false);
          }}
          onClose={() => setIsMapModalOpen(false)}
          playerName={playerName}
          gold={playerCoins}
          onOpenBag={onOpenPetBag}
          onOpenShop={onOpenShop}
          onOpenCharacter={() => {
            setIsMapModalOpen(false);
            setIsCharacterModalOpen(true);
          }}
          onOpenFriends={onOpenFriends}
        />
      )}

      {/* Character Detail & High-Definition Cultivator Portrait Modal (Image 2) */}
      {isCharacterModalOpen && (
        <CharacterDetailModal
          playerName={playerName}
          playerLevel={25}
          playerTitle="见习魔法使 · 皇家学者"
          coins={playerCoins}
          spiritGems={480}
          partyCount={playerParty.length}
          outfit={playerOutfit}
          onOpenWardrobe={() => {
            setIsCharacterModalOpen(false);
            onOpenWardrobe?.();
          }}
          onClose={() => setIsCharacterModalOpen(false)}
        />
      )}

      {/* Full HD Eastern Fantasy Illustration Gallery Popup */}
      {isGalleryOpen && (
        <ArtGalleryModal
          initialSpeciesId={playerParty[activeLeaderIndex]?.speciesId || 'chiyanque'}
          onClose={() => setIsGalleryOpen(false)}
        />
      )}
    </div>
  );
};
