import React, { useState } from 'react';
import { SceneConfig, PetInstance, SceneId, InventorySlot, WildPetSpawn } from '../types/game';
import { SCENES_DATA } from '../data/scenes';
import { PET_SPECIES } from '../data/species';
import { ITEMS_DATA } from '../data/items';
import { PetAvatar } from './PetAvatar';
import { PlayerAvatar, NpcAvatar } from './PlayerAvatar';
import { sound } from '../utils/audio';
import {
  MapPin,
  Sparkles,
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
  Award,
} from 'lucide-react';

interface SceneViewProps {
  currentScene: SceneConfig;
  playerParty: PetInstance[];
  activeLeaderIndex: number;
  playerCoins: number;
  playerBadges: string[];
  openedChestIds: string[];
  onOpenChest: (chestId: string, coins: number, itemId?: string, itemCount?: number) => void;
  onEnterBattle: (enemyPet: PetInstance, isWild: boolean) => void;
  onTeleportToScene: (sceneId: SceneId) => void;
  onOpenPetBag: () => void;
  onOpenPokedex: () => void;
  onOpenShop: () => void;
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
  onOpenChest,
  onEnterBattle,
  onTeleportToScene,
  onOpenPetBag,
  onOpenPokedex,
  onOpenShop,
  onHealParty,
  soundEnabled,
  onToggleSound,
}) => {
  // Player position in percentage (0 - 100%)
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 50, y: 65 });
  const [playerDirection, setPlayerDirection] = useState<'left' | 'right'>('right');
  const [isMoving, setIsMoving] = useState<boolean>(false);

  // Active dialogue popup state
  const [activeDialogue, setActiveDialogue] = useState<{ name: string; text: string; actionType?: string } | null>(null);

  // World map fast travel modal
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);

  // Healing animation state
  const [healNotice, setHealNotice] = useState<string | null>(null);

  const leaderPet = playerParty[activeLeaderIndex] || playerParty[0];

  // Handle clicking on the map canvas to walk
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Bounds clamp (15% to 85%)
    const targetX = Math.max(15, Math.min(85, clickX));
    const targetY = Math.max(25, Math.min(85, clickY));

    if (targetX < playerPos.x) {
      setPlayerDirection('left');
    } else {
      setPlayerDirection('right');
    }

    sound.playClick();
    setIsMoving(true);
    setPlayerPos({ x: targetX, y: targetY });
    setTimeout(() => {
      setIsMoving(false);
    }, 400);
  };

  // Click on wild pet roaming in scene
  const handleWildPetClick = (speciesId: string, minLvl: number, maxLvl: number) => {
    sound.playAttackHit();
    const lvl = Math.floor(minLvl + Math.random() * (maxLvl - minLvl + 1));
    const wildInstance: PetInstance = {
      uid: `wild_${Date.now()}`,
      speciesId,
      nickname: PET_SPECIES[speciesId].name,
      level: lvl,
      exp: 0,
      maxExp: 100,
      currentHp: 1, // Will be calculated properly in engine
      stats: { hp: 100, atk: 50, def: 50, spAtk: 50, spDef: 50, speed: 50 },
      moves: [],
      statusEffect: null,
      statusTurns: 0,
      nature: '坦率',
      statStages: { atk: 0, def: 0, spAtk: 0, spDef: 0, speed: 0 },
    };
    onEnterBattle(wildInstance, true);
  };

  // Click on NPC
  const handleNpcClick = (npc: (typeof currentScene.npcs)[0]) => {
    sound.playClick();
    const randomSpeech = npc.dialogue[Math.floor(Math.random() * npc.dialogue.length)];
    setActiveDialogue({
      name: `${npc.name} (${npc.role})`,
      text: randomSpeech,
      actionType: npc.actionType,
    });
  };

  const handleNpcAction = (actionType?: string) => {
    setActiveDialogue(null);
    if (actionType === 'HEAL') {
      sound.playHeal();
      onHealParty();
      setHealNotice('九转神泉甘霖降临！全队幻灵气血与招式灵力已完全回复满状态！');
      setTimeout(() => setHealNotice(null), 3000);
    } else if (actionType === 'SHOP') {
      onOpenShop();
    } else if (actionType === 'ARENA_CHALLENGE') {
      sound.playAttackHit(true);
      // Initiate Elite Boss Fight with Thunder Beast Leiwenhou Lv.20
      const bossPet: PetInstance = {
        uid: `boss_leiwenhou_${Date.now()}`,
        speciesId: 'leiwenhou',
        nickname: '天门镇守 · 雷纹吼',
        level: 20,
        exp: 0,
        maxExp: 500,
        currentHp: 1,
        stats: { hp: 160, atk: 95, def: 75, spAtk: 105, spDef: 75, speed: 100 },
        moves: [],
        statusEffect: null,
        statusTurns: 0,
        nature: '狂傲',
        statStages: { atk: 0, def: 0, spAtk: 0, spDef: 0, speed: 0 },
      };
      onEnterBattle(bossPet, false);
    }
  };

  // Scene Background Decor Gradients
  const getSceneGradients = () => {
    switch (currentScene.id) {
      case 'PRAIRIE':
        return 'from-emerald-900 via-green-950 to-teal-950 border-emerald-500/30';
      case 'VOLCANO':
        return 'from-rose-950 via-amber-950 to-stone-950 border-rose-500/30';
      case 'BAY':
        return 'from-cyan-950 via-sky-950 to-blue-950 border-cyan-500/30';
      case 'HOSPITAL':
        return 'from-pink-950 via-slate-900 to-rose-950 border-pink-500/30';
      case 'SHOP':
        return 'from-amber-950 via-stone-900 to-yellow-950 border-amber-500/30';
      case 'ARENA':
        return 'from-purple-950 via-indigo-950 to-violet-950 border-purple-500/30';
      case 'ACADEMY':
      default:
        return 'from-indigo-950 via-slate-900 to-blue-950 border-indigo-500/30';
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto flex flex-col gap-3">
      {/* Top HUD: Realm Location, Coins, Badges & Quick Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span className="font-black text-sm text-white tracking-wide">{currentScene.name}</span>
            <span className="text-xs text-slate-400 font-mono">[{currentScene.region}]</span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setIsMapModalOpen(true);
            }}
            className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>传送大地图</span>
          </button>
        </div>

        {/* Right Info: Coins, Badges, Sound */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/40 border border-amber-400/20 text-xs font-mono font-bold text-amber-300">
            <Coins className="w-3.5 h-3.5" />
            <span>{playerCoins} 灵石</span>
          </div>

          {playerBadges.length > 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-950/60 border border-purple-400/30 text-xs font-bold text-purple-300">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{playerBadges.length} 枚徽章</span>
            </div>
          )}

          <button
            onClick={onToggleSound}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={soundEnabled ? '音效开启' : '音效静音'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main 2D Interactive Scene Stage */}
      <div
        onClick={handleMapClick}
        className={`relative w-full h-[520px] rounded-3xl overflow-hidden border shadow-2xl bg-gradient-to-b ${getSceneGradients()} select-none cursor-crosshair`}
      >
        {/* Subtle Decorative Scene Backdrop Art */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl" />
        </div>

        {/* Ambient Ground Pathway / Circle */}
        <div className="absolute inset-x-8 bottom-6 h-36 rounded-full border border-white/5 bg-black/20 pointer-events-none" />

        {/* Floating Heal Notice Alert */}
        {healNotice && (
          <div className="absolute top-6 inset-x-0 mx-auto w-fit z-40 bg-emerald-950/90 border border-emerald-400 px-6 py-2.5 rounded-2xl shadow-2xl text-emerald-200 text-xs font-bold flex items-center gap-2 animate-bounce">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span>{healNotice}</span>
          </div>
        )}

        {/* Scene NPCs */}
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
            <div className="bg-black/70 border border-amber-400/40 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 shadow group-hover:scale-110 transition-transform whitespace-nowrap">
              {npc.name}
            </div>
            <NpcAvatar type={npc.avatarSvg} size={64} />
          </div>
        ))}

        {/* Roaming Wild Spirits */}
        {currentScene.wildPets.map((wp, index) => {
          const sp = PET_SPECIES[wp.speciesId];
          if (!sp) return null;
          // Position wild spirits dynamically around the scene
          const xPos = 20 + ((index * 35 + 25) % 65);
          const yPos = 40 + ((index * 25 + 20) % 35);

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
              <div className="bg-black/80 border border-cyan-400/50 text-cyan-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full mb-1 shadow group-hover:scale-110 transition-transform whitespace-nowrap flex items-center gap-1">
                <Swords className="w-2.5 h-2.5 text-rose-400" />
                <span>野生 Lv.{wp.minLevel}~{wp.maxLevel}</span>
              </div>
              <PetAvatar speciesId={wp.speciesId} size={58} />
              <div className="w-10 h-2 bg-black/40 rounded-full blur-xs mt-0.5" />
            </div>
          );
        })}

        {/* Scene Treasure Chests */}
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
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center ${
                isOpened ? 'opacity-40 cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'
              }`}
            >
              <div className="text-[10px] font-mono text-amber-300 font-bold bg-black/60 px-2 py-0.5 rounded-md mb-1">
                {isOpened ? '已开启' : '灵藏宝箱'}
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-xl">
                <Gift className="w-5 h-5 animate-pulse" />
              </div>
            </div>
          );
        })}

        {/* Player Avatar & Companion Spirit */}
        <div
          style={{
            left: `${playerPos.x}%`,
            top: `${playerPos.y}%`,
            transition: 'all 450ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center z-30 pointer-events-none"
        >
          {/* Active Companion Spirit Bouncing Behind */}
          {leaderPet && (
            <div className="mr-2 transform -scale-x-100 flex flex-col items-center animate-bounce">
              <span className="text-[9px] font-bold text-amber-300 bg-black/60 px-1.5 py-0.2 rounded whitespace-nowrap mb-0.5">
                {leaderPet.nickname}
              </span>
              <PetAvatar speciesId={leaderPet.speciesId} size={42} />
            </div>
          )}

          {/* Player Avatar */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-white bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-700 whitespace-nowrap mb-0.5 shadow">
              灵契使
            </span>
            <PlayerAvatar size={56} isMoving={isMoving} direction={playerDirection} />
          </div>
        </div>

        {/* Walking Tip Notice Bottom Left */}
        <div className="absolute bottom-3 left-4 text-[11px] text-slate-400 bg-black/50 px-3 py-1 rounded-xl backdrop-blur-xs pointer-events-none flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>点击地面漫步 · 靠近野生幻灵开启对战 · 与NPC对话触发事件</span>
        </div>
      </div>

      {/* NPC Dialogue Box Popup */}
      {activeDialogue && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-150">
          <div className="space-y-1 text-left w-full sm:w-auto">
            <div className="text-xs font-black text-amber-300">{activeDialogue.name}</div>
            <p className="text-xs text-slate-200 leading-relaxed">{activeDialogue.text}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            {activeDialogue.actionType === 'HEAL' && (
              <button
                onClick={() => handleNpcAction('HEAL')}
                className="py-2 px-4 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>免费全队治愈</span>
              </button>
            )}

            {activeDialogue.actionType === 'SHOP' && (
              <button
                onClick={() => handleNpcAction('SHOP')}
                className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>进入万象宝阁</span>
              </button>
            )}

            {activeDialogue.actionType === 'ARENA_CHALLENGE' && (
              <button
                onClick={() => handleNpcAction('ARENA_CHALLENGE')}
                className="py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>接受天罡试炼</span>
              </button>
            )}

            <button
              onClick={() => setActiveDialogue(null)}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
            >
              稍后再聊
            </button>
          </div>
        </div>
      )}

      {/* World Map Fast-Travel Modal */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-6 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <Compass className="w-6 h-6 text-amber-300" />
                <div>
                  <h3 className="text-xl font-black text-amber-300">《幻灵秘境》· 世界全图传送</h3>
                  <p className="text-xs text-slate-400">选择目标秘境圣地，即刻瞬间传送</p>
                </div>
              </div>
              <button
                onClick={() => setIsMapModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.values(SCENES_DATA).map((scene) => {
                const isCurrent = currentScene.id === scene.id;
                return (
                  <button
                    key={scene.id}
                    disabled={isCurrent}
                    onClick={() => {
                      sound.playClick();
                      setIsMapModalOpen(false);
                      onTeleportToScene(scene.id);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isCurrent
                        ? 'bg-amber-950/60 border-amber-400 text-amber-300 ring-1 ring-amber-400'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-600 hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-white">{scene.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{scene.region}</div>
                    </div>
                    {isCurrent ? (
                      <span className="text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                        当前所在
                      </span>
                    ) : (
                      <span className="text-xs text-cyan-400 underline">立即传送</span>
                    )}
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
