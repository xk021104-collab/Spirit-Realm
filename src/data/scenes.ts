import { SceneConfig } from '../types/game';

export const SCENES_DATA: Record<string, SceneConfig> = {
  ACADEMY: {
    id: 'ACADEMY',
    name: '幻灵圣殿',
    region: '大陆圣境核心',
    description: '诸灵汇聚的崇高圣殿，九彩灵晶高悬虚空，大长老玄冥在此引领导引新一代灵契师。',
    themeColor: '#4f46e5',
    wildPets: [
      { speciesId: 'jiguangxuehu', minLevel: 3, maxLevel: 6, chance: 0.4 },
      { speciesId: 'rongfengtu', minLevel: 2, maxLevel: 5, chance: 0.6 },
    ],
    npcs: [
      {
        id: 'npc_xuanming',
        name: '大长老 玄冥',
        role: '圣殿守护长',
        x: 48,
        y: 35,
        avatarSvg: 'griffin',
        dialogue: [
          '欢迎来到《幻灵秘境》，初出茅庐的年轻灵契师！',
          '天地万物皆有灵性，与你的幻灵心神合一，方能参悟至高的大道法则。',
          '去云梦古原与苍炎熔渊历练吧，以灵契晶石缔结更多本命伙伴！',
        ],
        actionType: 'STARTER_GIFT',
      },
      {
        id: 'npc_senior_disciple',
        name: '师兄 楚风',
        role: '圣殿执事弟子',
        x: 75,
        y: 60,
        avatarSvg: 'student',
        dialogue: [
          '师弟好！五行相克乃是秘境至理：火克草、水克火、草克水，雷动波涛！',
          '幻灵负伤消耗灵力时，切记前往【灵木医庐】请云曦仙子施针救治。',
        ],
      },
    ],
    chests: [
      { id: 'chest_acad_1', x: 20, y: 70, coins: 300, itemId: 'gulu_normal', itemCount: 3 },
    ],
  },

  PRAIRIE: {
    id: 'PRAIRIE',
    name: '云梦古原',
    region: '苍木灵域',
    description: '灵木繁茂、云雾缭绕的万古原野，微风携着草木清香，绒风兔与青木鹿在花海间追逐。',
    themeColor: '#16a34a',
    wildPets: [
      { speciesId: 'rongfengtu', minLevel: 3, maxLevel: 8, chance: 0.6 },
      { speciesId: 'qingmulu', minLevel: 5, maxLevel: 10, chance: 0.4 },
    ],
    npcs: [
      {
        id: 'npc_wood_ranger',
        name: '守林尊者 木岚',
        role: '古原巡游者',
        x: 65,
        y: 40,
        avatarSvg: 'ranger',
        dialogue: [
          '云梦古原沉睡着太古苍木灵脉，生生不息。',
          '将野生幻灵削弱至残血，投掷灵契晶石才更易成功契约！',
        ],
      },
    ],
    chests: [
      { id: 'chest_prairie_1', x: 82, y: 75, coins: 500, itemId: 'gulu_mid', itemCount: 2 },
    ],
  },

  VOLCANO: {
    id: 'VOLCANO',
    name: '苍炎熔渊',
    region: '炽焱绝境',
    description: '地心熔火喷涌激荡的赤红险境，地炎灵晶与火属性幻灵在此栖居，空气炽热如焚。',
    themeColor: '#ea580c',
    wildPets: [
      { speciesId: 'jingjiaxuangui', minLevel: 6, maxLevel: 12, chance: 0.5 },
      { speciesId: 'chiyanque', minLevel: 8, maxLevel: 14, chance: 0.5 },
    ],
    npcs: [
      {
        id: 'npc_fire_smith',
        name: '铸晶圣手 炎烈',
        role: '地火炼器师',
        x: 35,
        y: 45,
        avatarSvg: 'smith',
        dialogue: [
          '常人难抵熔渊高温，但这里的赤焰雀若是觉醒为焚天凰，当有焚天灭地之能！',
          '若用水系术法对付地心火兽，可事半功倍！',
        ],
      },
    ],
    chests: [
      { id: 'chest_volc_1', x: 78, y: 30, coins: 800, itemId: 'potion_mid', itemCount: 3 },
    ],
  },

  BAY: {
    id: 'BAY',
    name: '星辰碧海',
    region: '无垠瀚海',
    description: '澄澈如琉璃的无垠碧海，海天相接之处泛着星辰光辉，碧水灵跃动于潮汐之上。',
    themeColor: '#0284c7',
    wildPets: [
      { speciesId: 'bishuiling', minLevel: 6, maxLevel: 12, chance: 0.7 },
      { speciesId: 'jiguangxuehu', minLevel: 8, maxLevel: 13, chance: 0.3 },
    ],
    npcs: [
      {
        id: 'npc_sea_voyager',
        name: '瀚海钓翁 莫离',
        role: '避世隐士',
        x: 25,
        y: 50,
        avatarSvg: 'sailor',
        dialogue: [
          '海中藏着万千奥秘，碧水灵是性情最纯善的水之宠儿。',
          '雷电之威最惧深海，雷克水也是颠扑不破的秘术法则。',
        ],
      },
    ],
    chests: [
      { id: 'chest_bay_1', x: 70, y: 70, coins: 600, itemId: 'elixir_pp', itemCount: 2 },
    ],
  },

  HOSPITAL: {
    id: 'HOSPITAL',
    name: '灵木医庐',
    region: '圣殿偏殿药圃',
    description: '药香四溢的宁静庭院，医圣传人云曦仙子施展九转回春秘法，免费治愈随行所有幻灵！',
    themeColor: '#ec4899',
    wildPets: [],
    npcs: [
      {
        id: 'npc_nurse_yunxi',
        name: '医圣仙子 云曦',
        role: '万灵医官',
        x: 50,
        y: 40,
        avatarSvg: 'nurse',
        dialogue: [
          '小灵契师一路辛苦了。幻灵也是有知觉的生灵，疲累时要好好休养。',
          '将幻灵伙伴交予我吧，圣水甘霖能使全队生命与招式灵力（PP）瞬间尽数恢复！',
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
    name: '万象珍宝阁',
    region: '天墉坊市中心',
    description: '秘境中奇珍异宝汇聚之所，各阶灵契晶石、造化灵丹一应俱全。',
    themeColor: '#d97706',
    wildPets: [],
    npcs: [
      {
        id: 'npc_merchant_geqian',
        name: '阁主 葛乾',
        role: '万象商盟掌柜',
        x: 50,
        y: 42,
        avatarSvg: 'merchant',
        dialogue: [
          '万象珍宝，童叟无欺！无论是天阶破界晶，还是起死回生的还魂草，本店应有尽有！',
          '灵石换宝物，包你闯荡秘境无往不利！',
        ],
        actionType: 'SHOP',
      },
    ],
    chests: [],
  },

  ARENA: {
    id: 'ARENA',
    name: '凌霄试炼台',
    region: '天穹之巅',
    description: '悬浮于九重云海之上的远古雷霆战台，唯有真正的大师才能在此接受天穹试炼！',
    themeColor: '#7c3aed',
    wildPets: [
      { speciesId: 'leiwenhou', minLevel: 14, maxLevel: 20, chance: 0.55 },
      { speciesId: 'jiguangxuehu', minLevel: 15, maxLevel: 22, chance: 0.45 },
    ],
    npcs: [
      {
        id: 'npc_champion_tianheng',
        name: '天罡战皇 陆天衡',
        role: '圣境天武战神',
        x: 50,
        y: 38,
        avatarSvg: 'knight',
        dialogue: [
          '战道漫漫，唯力破之！',
          '击败我的本命雷兽与冰狐战阵，你将登顶凌霄，斩获至高【天穹天命徽章】与混元圣皇晶！',
        ],
        actionType: 'ARENA_CHALLENGE',
      },
    ],
    chests: [
      { id: 'chest_arena_1', x: 85, y: 70, coins: 1500, itemId: 'gulu_king', itemCount: 1 },
    ],
  },
};
