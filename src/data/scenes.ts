import { SceneConfig } from '../types/game';

export const SCENES_DATA: Record<string, SceneConfig> = {
  ACADEMY: {
    id: 'ACADEMY',
    name: '万古仙门',
    region: '九霄圣境',
    description: '幻灵秘境培养御灵仙师的至高仙门，圣殿大长老玄冥与引道执事在此指引初入仙途者。',
    themeColor: '#3b82f6',
    wildPets: [
      { speciesId: 'jiguangxuehu', minLevel: 3, maxLevel: 6, chance: 0.4 },
      { speciesId: 'rongfengtu', minLevel: 2, maxLevel: 5, chance: 0.6 },
    ],
    npcs: [
      {
        id: 'npc_xuanming',
        name: '大长老 玄冥',
        role: '仙门圣殿大长老',
        x: 50,
        y: 30,
        avatarSvg: 'griffin',
        dialogue: [
          '福生无量！欢迎踏入《幻灵秘境》，初悟大道的年轻御灵仙师！',
          '天地百种幻灵乃乾坤灵气所化，与本命幻灵心意相通，方能感悟无上五行道法。',
          '且往青翠灵谷与熔渊烈峰历练，以灵契晶石结识天地神秀、收服心仪灵宠！',
        ],
        actionType: 'STARTER_GIFT',
      },
      {
        id: 'npc_senior_disciple',
        name: '引道执事 清羽',
        role: '仙门道法传功长老',
        x: 82,
        y: 46,
        avatarSvg: 'student',
        dialogue: [
          '师弟好！五行相克乃御灵对决之至理：炽火焚木、瀚水熄火、苍木汲水，九霄神雷克制沧溟水系！',
          '斗法折损灵力时，切记前往【瑶池杏林医阁】寻云夕医仙，引瑶池灵泉涤荡灵体。',
        ],
      },
    ],
    chests: [
      { id: 'chest_acad_1', x: 15, y: 72, coins: 300, itemId: 'gulu_normal', itemCount: 3 },
    ],
  },

  PRAIRIE: {
    id: 'PRAIRIE',
    name: '青翠灵谷',
    region: '碧木灵墟',
    description: '仙风拂照的万木灵谷与百花胜境，苍木生息，青木鹿与温顺的木系灵宠在灵草花海间吐纳嬉戏。',
    themeColor: '#16a34a',
    wildPets: [
      { speciesId: 'rongfengtu', minLevel: 3, maxLevel: 8, chance: 0.6 },
      { speciesId: 'qingmulu', minLevel: 5, maxLevel: 10, chance: 0.4 },
    ],
    npcs: [
      {
        id: 'npc_wood_ranger',
        name: '巡山仙长 木岚',
        role: '灵谷护道仙使',
        x: 65,
        y: 40,
        avatarSvg: 'ranger',
        dialogue: [
          '灵谷草木承蒙天地滋养生生不息，乃御三家青木鹿与幼灵结缘的最佳洞天。',
          '将野外幻灵削弱至残血，掷出灵契晶石方能稳固缔结仙契！',
        ],
      },
    ],
    chests: [
      { id: 'chest_prairie_1', x: 82, y: 75, coins: 500, itemId: 'gulu_mid', itemCount: 2 },
    ],
  },

  VOLCANO: {
    id: 'VOLCANO',
    name: '熔渊烈峰',
    region: '地心熔火',
    description: '九幽地心熔岩炽烈翻涌的烈焰仙山，赤焰雀与火系灵兽在此吐纳真火，空气温热激荡。',
    themeColor: '#ea580c',
    wildPets: [
      { speciesId: 'jingjiaxuangui', minLevel: 6, maxLevel: 12, chance: 0.5 },
      { speciesId: 'chiyanque', minLevel: 8, maxLevel: 14, chance: 0.5 },
    ],
    npcs: [
      {
        id: 'npc_fire_smith',
        name: '铸剑仙 炎烈',
        role: '离火炼器宗师',
        x: 35,
        y: 45,
        avatarSvg: 'smith',
        dialogue: [
          '此峰所栖的赤焰雀若历经天劫进阶，将化作羽翼垂天、焚尽八荒的涅槃神凰！',
          '以水系幻灵对战离火强敌，可借水克火之势打出双倍暴击克制之威！',
        ],
      },
    ],
    chests: [
      { id: 'chest_volc_1', x: 78, y: 30, coins: 800, itemId: 'potion_mid', itemCount: 3 },
    ],
  },

  BAY: {
    id: 'BAY',
    name: '碧海灵汐湾',
    region: '沧溟仙海',
    description: '澄澈如万顷琉璃的浩瀚仙海湾，浅海泛着鲛珠明光，碧水灵跃动于灵潮浪花之上，通往远古归墟龙宫。',
    themeColor: '#0284c7',
    wildPets: [
      { speciesId: 'bishuiling', minLevel: 6, maxLevel: 12, chance: 0.7 },
      { speciesId: 'jiguangxuehu', minLevel: 8, maxLevel: 13, chance: 0.3 },
    ],
    npcs: [
      {
        id: 'npc_sea_voyager',
        name: '渡海仙翁 莫离',
        role: '沧溟领航引渡人',
        x: 25,
        y: 50,
        avatarSvg: 'sailor',
        dialogue: [
          '碧海灵汐湾蕴藏无数上古海神传说，碧水灵性情至纯至善，乃御三家水系至宝。',
          '草木灵诀可生克浩瀚水势，亦是克制水系幻灵的最佳法门。',
        ],
      },
    ],
    chests: [
      { id: 'chest_bay_1', x: 70, y: 70, coins: 600, itemId: 'elixir_pp', itemCount: 2 },
    ],
  },

  HOSPITAL: {
    id: 'HOSPITAL',
    name: '瑶池杏林医阁',
    region: '瑶池仙境',
    description: '灵雾弥漫、药香四溢的疗愈仙居，妙手医仙云夕引瑶池圣泉，免费涤荡治愈全队幻灵的生命与仙道灵力（PP）！',
    themeColor: '#ec4899',
    wildPets: [],
    npcs: [
      {
        id: 'npc_nurse_yunxi',
        name: '妙手医仙 云夕',
        role: '百草堂主治仙医',
        x: 50,
        y: 40,
        avatarSvg: 'nurse',
        dialogue: [
          '御灵仙师历经四方征战，一路辛苦了！幻灵乃通灵之伙伴，身心俱疲时当好生休养。',
          '请将灵契法印交由妾身，引瑶池灵泉便可让全队幻灵气血充盈、道法技能灵力瞬间尽数回满！',
        ],
        actionType: 'HEAL',
      },
    ],
    chests: [
      { id: 'chest_hosp_1', x: 85, y: 65, coins: 200, itemId: 'potion_small', itemCount: 5 },
    ],
  },

  SHOP: {
    id: 'SHOP',
    name: '太虚万宝阁',
    region: '太虚仙市',
    description: '幻灵大陆最为繁华喧闹的仙市宝坊，各阶灵契晶石、高阶回春仙丹与通玄奇珍应有尽有。',
    themeColor: '#d97706',
    wildPets: [],
    npcs: [
      {
        id: 'npc_merchant_geqian',
        name: '万宝掌柜 葛乾',
        role: '太虚多宝楼楼主',
        x: 50,
        y: 42,
        avatarSvg: 'merchant',
        dialogue: [
          '太虚万宝阁，童叟无欺！玄阶凝灵晶、九转回魂丹、补天灵药无一不精！',
          '以游历所得之灵石购置宝物，定保仙师畅游大千秘境、仙运亨通！',
        ],
        actionType: 'SHOP',
      },
    ],
    chests: [],
  },

  ARENA: {
    id: 'ARENA',
    name: '九霄战仙擂',
    region: '雷霆之巅',
    description: '悬浮于九重神霄万劫天雷之上的远古通天擂台，唯有道法通玄的大修士方能在此问鼎天梯封神试炼！',
    themeColor: '#7c3aed',
    wildPets: [
      { speciesId: 'leiwenhou', minLevel: 14, maxLevel: 20, chance: 0.55 },
      { speciesId: 'jiguangxuehu', minLevel: 15, maxLevel: 22, chance: 0.45 },
    ],
    npcs: [
      {
        id: 'npc_champion_tianheng',
        name: '天梯擂主 陆天衡',
        role: '九霄试炼战神',
        x: 50,
        y: 38,
        avatarSvg: 'knight',
        dialogue: [
          '九天雷动，战意滔天！唯有身经百战的御灵真仙，方能承受九霄劫雷的轰鸣！',
          '若能击败本尊的本命雷兽，你将获赐秘境至高【九天战仙勋印】与混元圣皇晶！',
        ],
        actionType: 'ARENA_CHALLENGE',
      },
    ],
    chests: [
      { id: 'chest_arena_1', x: 85, y: 70, coins: 1500, itemId: 'gulu_king', itemCount: 1 },
    ],
  },
};
