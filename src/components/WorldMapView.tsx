import React, { useState } from 'react';
import { CultivatorPortrait } from './CultivatorPortrait';
import { sound } from '../utils/audio';
import {
  Compass,
  X,
  Sparkles,
  Flame,
  Droplets,
  Trees,
  Search,
  Mic,
  Mail,
  Gift,
  Plus,
  Minus,
  Sun,
  Moon,
  ChevronRight,
  Shield,
  Award,
  Coins,
  Gem,
  Backpack,
  User,
  ShoppingBag,
  MapPin,
  CheckCircle,
} from 'lucide-react';

interface WorldMapViewProps {
  currentSceneId: string;
  onSelectScene: (sceneId: string) => void;
  onClose: () => void;
  playerName: string;
  gold: number;
  onOpenBag?: () => void;
  onOpenShop?: () => void;
  onOpenCharacter?: () => void;
  onOpenFriends?: () => void;
}

interface MapRealmNode {
  id: string;
  name: string;
  sceneId: string; // Map to SCENES_DATA
  x: number; // percentage
  y: number; // percentage
  description: string;
  spiritTypes: string[];
  climate: string;
  levelRange: string;
  tag: string;
}

export const WorldMapView: React.FC<WorldMapViewProps> = ({
  currentSceneId,
  onSelectScene,
  onClose,
  playerName,
  gold,
  onOpenBag,
  onOpenShop,
  onOpenCharacter,
  onOpenFriends,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('crystal_lake');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDayTime, setIsDayTime] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // 7 Map Nodes corresponding to authentic Xianxia Huan Ling Mi Jing fantasy continent
  const realmNodes: MapRealmNode[] = [
    {
      id: 'ancient_forest',
      name: '青翠灵谷',
      sceneId: 'PRAIRIE',
      x: 23,
      y: 45,
      description: '仙风拂照的万木灵谷，万古灵木繁茂，青木鹿与木系天地灵宠长居吐纳于此。',
      spiritTypes: ['木系', '灵木'],
      climate: '灵风和煦 · 繁花生机',
      levelRange: 'Lv.5 - 15',
      tag: '初阶道场',
    },
    {
      id: 'crystal_lake',
      name: '碧海灵汐湾',
      sceneId: 'BAY',
      x: 48,
      y: 53,
      description: '浩瀚万顷的沧溟仙海湾，碧波荡漾泛鲛珠华光，碧水灵跃动于归墟潮汐浪花间。',
      spiritTypes: ['水系', '沧海'],
      climate: '碧水温澜 · 鲛珠潮汐',
      levelRange: 'Lv.10 - 20',
      tag: '沧溟圣所',
    },
    {
      id: 'celestial_island',
      name: '万古仙门',
      sceneId: 'ACADEMY',
      x: 62,
      y: 26,
      description: '悬浮九天的九霄仙门圣殿，大长老玄冥与引道执事在此指引御灵仙师登堂入室。',
      spiritTypes: ['仙道', '九霄'],
      climate: '浮岛紫霞 · 仙鹤凌空',
      levelRange: 'Lv.1 - 100',
      tag: '宗门圣殿',
    },
    {
      id: 'ancient_city',
      name: '太虚万宝阁',
      sceneId: 'SHOP',
      x: 32,
      y: 70,
      description: '太虚仙墟最为繁华浩大的仙家坊市，万宝掌柜葛乾坐镇，通玄灵契晶石一应俱全。',
      spiritTypes: ['仙市', '奇珍'],
      climate: '宝光冲霄 · 万商云集',
      levelRange: '安全仙坊',
      tag: '仙墟都会',
    },
    {
      id: 'volcano',
      name: '熔渊烈峰',
      sceneId: 'VOLCANO',
      x: 74,
      y: 52,
      description: '九幽地心熔火炽烈翻涌的烈焰仙山，赤焰雀与火系灵兽在此淬炼真火神芒。',
      spiritTypes: ['火系', '地心'],
      climate: '烈火熔金 · 离火天罡',
      levelRange: 'Lv.15 - 30',
      tag: '离火熔穴',
    },
    {
      id: 'snow_mountain',
      name: '瑶池杏林阁',
      sceneId: 'HOSPITAL',
      x: 82,
      y: 78,
      description: '云雾氤氲的瑶池药香仙境，医仙云夕引长生灵泉，涤荡伤疲、尽复灵宠生机。',
      spiritTypes: ['仙医', '疗愈'],
      climate: '灵雾仙香 · 圣泉涤心',
      levelRange: 'Lv.20 - 35',
      tag: '疗愈仙泉',
    },
    {
      id: 'desert_ruins',
      name: '九霄战仙擂',
      sceneId: 'ARENA',
      x: 58,
      y: 74,
      description: '九天神霄劫雷轰鸣的悬空通天战台，试炼神将陆天衡设下封神天梯决斗擂台。',
      spiritTypes: ['雷系', '战仙'],
      climate: '紫电奔涌 · 万劫战意',
      levelRange: 'Lv.25 - 45',
      tag: '天梯决仙台',
    },
  ];

  const selectedNode = realmNodes.find((n) => n.id === selectedNodeId) || realmNodes[0];

  const handleTravelToNode = (node: MapRealmNode) => {
    sound.playCatchSuccess();
    onSelectScene(node.sceneId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 md:p-4 select-none">
      <div className="relative w-full max-w-6xl aspect-[16/9] max-h-[96vh] rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] border-4 border-[#b48a52] flex flex-col text-slate-900 bg-[#e8dbbd]">
        {/* =========================================================================
            1. TOP BAR: Player HUD, Title Logo with Halo, Time, Wealth & Close
            ========================================================================= */}
        <div className="relative z-30 h-16 w-full px-4 md:px-6 flex items-center justify-between border-b border-[#a37943]/40 bg-gradient-to-b from-[#f2e6cb]/95 via-[#eeddbb]/90 to-[#e2cda5]/80 shadow-md">
          {/* Top-Left: Player Profile Plaque (Image 3) */}
          <div
            onClick={() => {
              sound.playClick();
              if (onOpenCharacter) onOpenCharacter();
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              {/* Circular Cultivator Avatar */}
              <div className="w-12 h-12 rounded-full border-2 border-[#b48a52] bg-emerald-950 p-0.5 shadow-md flex items-center justify-center overflow-hidden ring-2 ring-amber-400/60 group-hover:scale-105 transition-transform">
                <CultivatorPortrait mode="avatar" size={44} />
              </div>
              <span className="absolute -bottom-1 -left-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-emerald-300 shadow">
                Lv.25
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-[#45260f] tracking-wide">
                  天命之人 · {playerName}
                </span>
                <span className="text-[10px] text-[#855325] font-serif border border-[#855325]/40 px-1 py-0.2 rounded">
                  御灵仙师
                </span>
              </div>
              {/* HP & MP Dual Bars */}
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-bold text-red-700 font-mono">HP</span>
                  <div className="w-16 h-2 rounded-full bg-slate-800/20 overflow-hidden border border-red-500/50 p-0.2">
                    <div className="w-full h-full bg-gradient-to-r from-red-600 to-rose-400 rounded-full" />
                  </div>
                  <span className="text-[8px] font-mono text-slate-700">250/250</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-bold text-cyan-800 font-mono">MP</span>
                  <div className="w-14 h-2 rounded-full bg-slate-800/20 overflow-hidden border border-cyan-500/50 p-0.2">
                    <div className="w-full h-full bg-gradient-to-r from-cyan-600 to-sky-400 rounded-full" />
                  </div>
                  <span className="text-[8px] font-mono text-slate-700">250/250</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top-Center: Game Logo with Radiant Celestial Halo + Clock (Image 3) */}
          <div className="flex flex-col items-center">
            {/* Celestial Halo & Calligraphy */}
            <div className="relative flex items-center justify-center">
              <div className="absolute w-44 h-10 rounded-full bg-amber-400/35 blur-md -top-1 pointer-events-none" />
              <h1 className="relative font-black text-2xl md:text-3xl tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#2563eb] via-[#1d4ed8] to-[#1e3a8a] drop-shadow-[0_2px_4px_rgba(245,158,11,0.8)] font-serif">
                幻灵秘境
              </h1>
            </div>

            {/* Sun/Moon Day-Night Widget */}
            <div
              onClick={() => setIsDayTime(!isDayTime)}
              className="flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#3d2714]/80 text-amber-200 text-[10px] font-mono font-bold -mt-0.5 shadow-sm cursor-pointer hover:bg-[#3d2714]"
            >
              {isDayTime ? (
                <Sun className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '16s' }} />
              ) : (
                <Moon className="w-3 h-3 text-cyan-300" />
              )}
              <span>{isDayTime ? '13:00' : '21:00'}</span>
            </div>
          </div>

          {/* Top-Right: Currencies & Close Window */}
          <div className="flex items-center gap-3">
            {/* Gold */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#2a1a0d]/80 text-amber-300 border border-[#b48a52]/60 shadow-sm text-xs font-mono font-bold">
              <div className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px]">
                金
              </div>
              <span>{gold.toLocaleString()}</span>
              <button className="text-amber-400 hover:text-white font-bold ml-0.5">+</button>
            </div>

            {/* Diamonds */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#2a1a0d]/80 text-cyan-300 border border-[#b48a52]/60 shadow-sm text-xs font-mono font-bold">
              <div className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-[10px]">
                晶
              </div>
              <span>90</span>
              <button className="text-cyan-400 hover:text-white font-bold ml-0.5">+</button>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="w-8 h-8 rounded-xl bg-[#4a2e16] hover:bg-[#6b4220] text-amber-200 border border-[#b48a52] flex items-center justify-center cursor-pointer shadow-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            2. MAIN MAP CANVAS: Illustrated Realms, Travel Routes, Nodes & Tracker
            ========================================================================= */}
        <div className="relative flex-1 w-full overflow-hidden bg-[#e0ceaa]">
          {/* Parchment Map Illustration Canvas (SVG Render of Image 3's Realm Landscape) */}
          <div
            className="absolute inset-0 w-full h-full transition-transform duration-300 origin-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <svg
              viewBox="0 0 1000 560"
              className="w-full h-full object-cover"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                {/* Parchment Paper Texture Filter */}
                <radialGradient id="mapVignette" cx="50%" cy="50%" r="65%">
                  <stop offset="0%" stopColor="#f4ecd8" stopOpacity="0.2" />
                  <stop offset="70%" stopColor="#d5bf92" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#8d683a" stopOpacity="0.75" />
                </radialGradient>

                {/* Lake Water Gradient */}
                <radialGradient id="lakeWaterGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#67e8f9" />
                  <stop offset="60%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#0891b2" />
                </radialGradient>

                {/* Volcano Magma Gradient */}
                <linearGradient id="volcanoMagma" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="50%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#7f1d1d" />
                </linearGradient>

                {/* Snow Glacier Gradient */}
                <linearGradient id="glacierGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="60%" stopColor="#bae6fd" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>

                {/* Golden Road Glow Filter */}
                <filter id="goldenRouteGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.8" />
                </filter>
              </defs>

              {/* Background Antique Realm Texture */}
              <rect width="1000" height="560" fill="#e8d8b6" />

              {/* 1. ANCIENT BIOLUMINESCENT FOREST (古古森林) - Top Left */}
              <g id="realm_ancient_forest">
                {/* Forest Canopy Masses with Glowing Blue Mushrooms */}
                <path
                  d="M 60 220 Q 90 140 160 120 Q 230 110 270 170 Q 320 180 340 250 Q 280 320 180 330 Q 90 320 60 220 Z"
                  fill="#1b4d3e"
                  opacity="0.85"
                />
                <path
                  d="M 100 240 Q 140 160 210 160 Q 260 180 290 230 Q 250 280 160 280 Z"
                  fill="#065f46"
                  opacity="0.9"
                />
                {/* Glowing Turquoise Spirit Foliage & Crystals */}
                <circle cx="140" cy="200" r="16" fill="#38bdf8" opacity="0.8" filter="blur(4px)" />
                <circle cx="230" cy="190" r="14" fill="#38bdf8" opacity="0.8" filter="blur(4px)" />
                <circle cx="280" cy="240" r="12" fill="#22d3ee" opacity="0.7" filter="blur(3px)" />

                {/* Stylized Tree Trunks */}
                <path d="M 140 260 L 140 310" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
                <path d="M 220 250 L 220 310" stroke="#78350f" strokeWidth="7" strokeLinecap="round" />
                <path d="M 280 260 L 280 310" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />
              </g>

              {/* 2. CRYSTAL ROCK LAKE (水晶石湖) - Center */}
              <g id="realm_crystal_lake">
                {/* Turquoise Sacred Lake */}
                <ellipse cx="480" cy="295" rx="110" ry="55" fill="url(#lakeWaterGrad)" stroke="#0e7490" strokeWidth="2.5" />
                <ellipse cx="480" cy="295" rx="90" ry="42" fill="#a5f3fc" opacity="0.4" />

                {/* Giant Glowing Cyan Crystals in Lake Center */}
                <polygon points="480,240 470,290 490,290" fill="#67e8f9" stroke="#0891b2" strokeWidth="1.5" />
                <polygon points="465,255 450,295 475,295" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.2" />
                <polygon points="495,250 480,295 510,295" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.2" />
                <polygon points="450,270 440,298 460,298" fill="#e0f2fe" />
                <polygon points="510,268 498,298 522,298" fill="#e0f2fe" />
                {/* Crystal Radiance Glow */}
                <circle cx="480" cy="270" r="28" fill="#a5f3fc" opacity="0.5" filter="blur(6px)" />
              </g>

              {/* 3. FLOATING SKY ISLAND (神山岛 / 灵灵岛) - Top Center */}
              <g id="realm_floating_island">
                {/* Clouds */}
                <ellipse cx="620" cy="175" rx="60" ry="16" fill="#ffffff" opacity="0.6" />
                <ellipse cx="580" cy="180" rx="35" ry="12" fill="#ffffff" opacity="0.5" />

                {/* Floating Island Rock Bottom */}
                <polygon points="570,140 670,140 640,195 600,195" fill="#475569" stroke="#334155" strokeWidth="1.5" />
                {/* Green Grass Top on Island */}
                <ellipse cx="620" cy="140" rx="52" ry="14" fill="#15803d" stroke="#166534" strokeWidth="1.2" />
                {/* Floating Cyan Diamond Crystal above Island */}
                <polygon points="620,95 628,115 620,130 612,115" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" filter="drop-shadow(0 0 6px #38bdf8)" />
                {/* Miniature Celestial Sky Waterfall */}
                <path d="M 640 145 Q 644 185 642 210" stroke="#bae6fd" strokeWidth="2.5" fill="none" opacity="0.75" />
              </g>

              {/* 4. ANCIENT IMPERIAL CITADEL (古中城) - Bottom Left */}
              <g id="realm_ancient_city">
                {/* Fortress Rampart Platform */}
                <polygon points="180,410 320,380 380,440 240,470" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
                {/* Royal Pagoda Tier 1 */}
                <rect x="230" y="380" width="70" height="35" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1" />
                {/* Glazed Blue Curved Tile Roof Tier 1 */}
                <polygon points="215,380 315,380 295,360 235,360" fill="#0284c7" stroke="#0369a1" strokeWidth="1.2" />
                {/* Royal Pagoda Tier 2 */}
                <rect x="245" y="340" width="40" height="22" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1" />
                <polygon points="235,340 295,340 280,324 250,324" fill="#0284c7" stroke="#f59e0b" strokeWidth="1.2" />
                {/* Pagoda Finial */}
                <line x1="265" y1="324" x2="265" y2="310" stroke="#f59e0b" strokeWidth="2" />
              </g>

              {/* 5. BLAZING VOLCANO (火火山) - Middle Right */}
              <g id="realm_volcano">
                {/* Dark Volcanic Mountain Base */}
                <polygon points="660,370 770,170 880,370" fill="#292524" stroke="#1c1917" strokeWidth="2" />
                <polygon points="680,370 740,240 810,370" fill="#44403c" />
                {/* Magma Caldera Peak */}
                <polygon points="750,195 770,165 790,195" fill="#f97316" />
                {/* Cascading Lava Rivers */}
                <path d="M 770 190 Q 750 250 710 320 Q 730 350 780 365" stroke="url(#volcanoMagma)" strokeWidth="6" fill="none" strokeLinecap="round" />
                <path d="M 770 190 Q 790 260 830 330" stroke="url(#volcanoMagma)" strokeWidth="4" fill="none" strokeLinecap="round" />
              </g>

              {/* 6. SNOW MOUNTAIN GORGE (雪山峡) - Bottom Right */}
              <g id="realm_snow_mountain">
                {/* Icy Mountain Ridges */}
                <polygon points="740,490 850,390 940,490" fill="#64748b" />
                <polygon points="770,490 850,390 890,490" fill="url(#glacierGrad)" stroke="#38bdf8" strokeWidth="1" />
                <polygon points="860,490 920,420 960,490" fill="url(#glacierGrad)" stroke="#38bdf8" strokeWidth="1" />
              </g>

              {/* 7. DESERT RUINS (湖沙地) - Bottom Center */}
              <g id="realm_desert_ruins">
                {/* Sand Dunes */}
                <path d="M 460,450 Q 560,410 650,450 Q 580,480 460,450 Z" fill="#d97706" opacity="0.65" />
                {/* Ruined Columns */}
                <rect x="540" y="405" width="6" height="28" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
                <rect x="555" y="410" width="6" height="23" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
                <rect x="570" y="415" width="6" height="18" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
                <rect x="535" y="402" width="46" height="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
              </g>

              {/* 8. GOLDEN CONNECTING ROUTE PATHWAYS (Image 3 Road Network) */}
              <g filter="url(#goldenRouteGlow)">
                {/* Forest -> Crystal Lake */}
                <path d="M 230 250 Q 340 220 480 295" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 4" fill="none" />
                {/* Crystal Lake -> Volcano */}
                <path d="M 480 295 Q 610 270 740 290" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 4" fill="none" />
                {/* Volcano -> Snow Mountain */}
                <path d="M 740 290 Q 770 380 820 440" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 4" fill="none" />
                {/* Ancient City -> Crystal Lake */}
                <path d="M 320 390 Q 400 350 480 295" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 4" fill="none" />
                {/* Ancient City -> Desert Ruins -> Snow Mountain */}
                <path d="M 320 390 Q 450 440 580 415" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 4" fill="none" />
                <path d="M 580 415 Q 700 450 820 440" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 4" fill="none" />
                {/* Crystal Lake -> Floating Sky Island */}
                <path d="M 480 295 Q 560 220 620 150" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 4" fill="none" />
              </g>

              {/* 9. Golden Compass Rose (Image 3 Left Corner) */}
              <g transform="translate(100, 420)">
                <circle cx="0" cy="0" r="28" fill="none" stroke="#b48a52" strokeWidth="1.5" strokeDasharray="4 2" />
                <polygon points="0,-24 5,-6 0,0 -5,-6" fill="#b91c1c" />
                <polygon points="0,24 5,6 0,0 -5,6" fill="#78350f" />
                <polygon points="-24,0 -6,-5 0,0 -6,5" fill="#78350f" />
                <polygon points="24,0 6,-5 0,0 6,5" fill="#78350f" />
                <text x="0" y="-28" fill="#451a03" fontSize="12" fontWeight="bold" textAnchor="middle">
                  N
                </text>
              </g>

              {/* Vignette Overlay for Antique Feel */}
              <rect width="1000" height="560" fill="url(#mapVignette)" pointerEvents="none" />
            </svg>

            {/* Interactive Milestone Beacon Pins (Image 3 Waypoints) */}
            {realmNodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isCurrent = currentSceneId === node.sceneId;

              return (
                <div
                  key={node.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playClick();
                    setSelectedNodeId(node.id);
                  }}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                >
                  {/* Outer Concentric Animated Ring */}
                  {isSelected && (
                    <div className="absolute -inset-3 rounded-full border-2 border-amber-400 bg-amber-400/20 animate-ping pointer-events-none" />
                  )}

                  {/* Node Pin Button */}
                  <div
                    className={`relative px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg border-2 transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-white ring-2 ring-amber-400 scale-110 font-black'
                        : isCurrent
                        ? 'bg-emerald-700 text-white border-emerald-300 ring-2 ring-emerald-400/60 font-bold'
                        : 'bg-[#45260f]/90 hover:bg-[#5c3314] text-amber-100 border-[#d4af37] font-bold hover:scale-105'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        isSelected ? 'bg-slate-950 text-amber-300' : 'bg-amber-400 text-slate-950'
                      }`}
                    >
                      <MapPin className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-xs whitespace-nowrap">{node.name}</span>

                    {isCurrent && (
                      <span className="text-[9px] bg-emerald-400 text-emerald-950 font-bold px-1 rounded-full">
                        现
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* =========================================================================
              3. RIGHT QUEST TRACKER (Exact Card from Image 3)
              ========================================================================= */}
          <div className="absolute right-4 top-4 z-30 w-56 md:w-64 rounded-2xl p-3.5 bg-gradient-to-b from-[#1e3a5f]/95 via-[#172554]/95 to-[#0f172a]/95 text-slate-100 border-2 border-[#b48a52] shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-amber-400/30 pb-2 mb-2">
              <span className="text-xs font-black text-amber-300 tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>Quest Tracker</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">游历诸天</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2 rounded-xl bg-slate-900/60 border border-amber-500/30">
                <div className="flex items-center gap-1 text-amber-300 font-bold">
                  <span className="text-[10px] bg-amber-500 text-slate-950 px-1 py-0.2 rounded font-black">
                    主线
                  </span>
                  <span>寻找上古遗迹</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">前往【水晶石湖】探查天极蓝晶异象</p>
              </div>

              <div className="p-2 rounded-xl bg-slate-900/60 border border-emerald-500/30">
                <div className="flex items-center justify-between text-emerald-300 font-bold">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] bg-emerald-600 text-white px-1 py-0.2 rounded font-black">
                      支线
                    </span>
                    <span>收集青灵果</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">3/10</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">古古森林野外采撷仙果</p>
              </div>

              <div className="p-2 rounded-xl bg-slate-900/60 border border-cyan-500/30">
                <div className="flex items-center gap-1 text-cyan-300 font-bold">
                  <span className="text-[10px] bg-cyan-600 text-white px-1 py-0.2 rounded font-black">
                    支线
                  </span>
                  <span>打败风狼首领</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">降伏雪山峡躁动的风啸灵兽</p>
              </div>
            </div>
          </div>

          {/* =========================================================================
              4. BOTTOM-LEFT INSET MINI-MAP & SEARCH WIDGET (Image 3)
              ========================================================================= */}
          <div className="absolute left-4 bottom-16 z-30 flex items-end gap-3">
            {/* Inset Mini-map Frame with Zoom Controls */}
            <div className="w-36 h-24 rounded-xl border-2 border-[#b48a52] bg-[#f2e6cb] shadow-xl overflow-hidden relative flex flex-col justify-between p-1">
              {/* Mini-map Thumbnail */}
              <div className="absolute inset-0 bg-[#e0ceaa] opacity-70" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-8 rounded border border-amber-600/70 bg-amber-400/20" />
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[8px] font-bold text-[#5c3314]">全景舆图</span>
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                    className="w-4 h-4 rounded bg-[#45260f] text-white flex items-center justify-center text-[10px] cursor-pointer"
                  >
                    <Plus className="w-2.5 h-2.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
                    className="w-4 h-4 rounded bg-[#45260f] text-white flex items-center justify-center text-[10px] cursor-pointer"
                  >
                    <Minus className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-between text-[8px] text-[#5c3314]">
                <Mail className="w-3 h-3 text-[#5c3314]" />
                <Gift className="w-3 h-3 text-[#5c3314]" />
              </div>
            </div>

            {/* Quick Search & Voice Bar */}
            <div className="h-9 px-3 rounded-full bg-[#2a1a0d]/90 border border-[#b48a52] text-white flex items-center gap-2 shadow-lg text-xs">
              <Search className="w-3.5 h-3.5 text-amber-300" />
              <input
                type="text"
                placeholder="搜索秘境、遗迹或灵兽..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-36"
              />
              <Mic className="w-3.5 h-3.5 text-cyan-300 cursor-pointer" />
            </div>
          </div>

          {/* =========================================================================
              5. SELECTED REALM FLOATING TELEPORT CARD (Center-Bottom)
              ========================================================================= */}
          {selectedNode && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-16 z-30 w-full max-w-md px-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#172554]/95 to-[#0f172a]/95 text-white border-2 border-amber-400 shadow-2xl flex items-center justify-between gap-4 backdrop-blur-md">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-amber-300 font-serif">
                      【{selectedNode.name}】
                    </span>
                    <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                      {selectedNode.levelRange}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-1 leading-relaxed">
                    {selectedNode.description}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-amber-200">
                    <span>气象: {selectedNode.climate}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleTravelToNode(selectedNode)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-lg transition-all cursor-pointer flex items-center gap-1.5 shrink-0 hover:scale-105 active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>御剑前往</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            6. BOTTOM DOCK (Circular Ornate Buttons from Image 3)
            ========================================================================= */}
        <div className="h-16 w-full px-6 flex items-center justify-between border-t border-[#a37943]/40 bg-gradient-to-t from-[#2a1a0d] via-[#3d2714] to-[#45260f] shadow-2xl z-30">
          {/* Circular Ornate Blue & Gold Icon Buttons matching Image 3 */}
          <div className="flex items-center justify-around w-full max-w-3xl mx-auto gap-2">
            {/* 1. 菜单 (Menu) */}
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] border-2 border-amber-400 flex items-center justify-center text-amber-200 shadow-md group-hover:scale-110 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-amber-200 mt-0.5">返回场景</span>
            </button>

            {/* 2. 世界 (World) */}
            <button
              onClick={() => sound.playClick()}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] border-2 border-amber-400 flex items-center justify-center text-cyan-300 shadow-md group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-amber-200 mt-0.5">世界</span>
            </button>

            {/* 3. 团队 (Team / Friends) */}
            <button
              onClick={() => {
                sound.playClick();
                if (onOpenFriends) onOpenFriends();
              }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] border-2 border-amber-400 flex items-center justify-center text-emerald-300 shadow-md group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-amber-200 mt-0.5">仙友团队</span>
            </button>

            {/* 4. 地图 (Map active) */}
            <button
              onClick={() => sound.playClick()}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full bg-gradient-to-b from-amber-500 to-amber-700 border-2 border-white flex items-center justify-center text-slate-950 shadow-lg scale-105 font-black">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-amber-300 mt-0.5">大千舆图</span>
            </button>

            {/* 5. 背包 (Bag) */}
            <button
              onClick={() => {
                sound.playClick();
                if (onOpenBag) onOpenBag();
              }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-md group-hover:scale-110 transition-transform">
                <Backpack className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-amber-200 mt-0.5">储物袋</span>
            </button>

            {/* 6. 角色 (Character - Opens Image 2 Cultivator Showcase) */}
            <button
              onClick={() => {
                sound.playClick();
                if (onOpenCharacter) onOpenCharacter();
              }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-md group-hover:scale-110 transition-transform">
                <User className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-amber-200 mt-0.5">仙师法相</span>
            </button>

            {/* 7. 商店 (Shop) */}
            <button
              onClick={() => {
                sound.playClick();
                if (onOpenShop) onOpenShop();
              }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] border-2 border-amber-400 flex items-center justify-center text-rose-300 shadow-md group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-amber-200 mt-0.5">万宝商阁</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
