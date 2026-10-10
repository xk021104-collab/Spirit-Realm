import { SceneConfig } from '../types/game';

export const SCENES_DATA: Record<string, SceneConfig> = {
  ACADEMY: {
    id: 'ACADEMY',
    name: '幻灵奥术学院',
    region: '皇家主城',
    description: '幻灵世界培养杰出魔法使的圣殿，阿尔弗雷德院长与导师们在此指引每一位初入大陆的年轻学员。',
    themeColor: '#3b82f6',
    wildPets: [
      { speciesId: 'jiguangxuehu', minLevel: 3, maxLevel: 6, chance: 0.4 },
      { speciesId: 'rongfengtu', minLevel: 2, maxLevel: 5, chance: 0.6 },
    ],
    npcs: [
      {
        id: 'npc_griffin',
        name: '阿尔弗雷德院长',
        role: '皇家奥术学院大魔导',
        x: 50,
        y: 30,
        avatarSvg: 'griffin',
        dialogue: [
          '欢迎来到幻灵世界，充满智慧与勇气的年轻小魔法师！',
          '魔法的真谛在于善良与守护。带上你的初始幻灵伙伴，去探索广阔的幻灵大陆吧！',
          '在野外遇到喜爱的野生幻灵，使用幻灵球就能与它们缔结友谊契约！',
        ],
        actionType: 'STARTER_GIFT',
      },
      {
        id: 'npc_volker',
        name: '魔法导师 艾德里安',
        role: '皇家进阶魔法导师',
        x: 82,
        y: 46,
        avatarSvg: 'student',
        dialogue: [
          '年轻的法师好！牢记四大元素相生相克：水克火、火燃草、草吸水，电击雷系克制沧海流水！',
          '冒险受伤时，记得前往【爱心护理所】找莉莉娅护士，魔法泉水能免费治愈全队宠物的精力与招式魔力（PP）！',
        ],
      },
    ],
    chests: [
      { id: 'chest_acad_1', x: 15, y: 72, coins: 300, itemId: 'gulu_normal', itemCount: 3 },
    ],
  },

  PRAIRIE: {
    id: 'PRAIRIE',
    name: '翡翠平原',
    region: '微风原野',
    description: '和风轻拂的翠绿原野与繁花草甸，风车在微风中轻转，青木鹿与草系萌宠在花间快乐嬉戏。',
    themeColor: '#16a34a',
    wildPets: [
      { speciesId: 'rongfengtu', minLevel: 3, maxLevel: 8, chance: 0.6 },
      { speciesId: 'qingmulu', minLevel: 5, maxLevel: 10, chance: 0.4 },
    ],
    npcs: [
      {
        id: 'npc_wood_ranger',
        name: '护林员 罗宾',
        role: '王国皇家巡逻骑士',
        x: 65,
        y: 40,
        avatarSvg: 'ranger',
        dialogue: [
          '翡翠平原是草系幻灵的乐园，仔细观察晃动的草丛，经常能发现稀有的小萌宠！',
          '将野外幻灵体力削弱后，投掷幻灵球能大幅提升捕捉成功率！',
        ],
      },
    ],
    chests: [
      { id: 'chest_prairie_1', x: 82, y: 75, coins: 500, itemId: 'gulu_mid', itemCount: 2 },
    ],
  },

  VOLCANO: {
    id: 'VOLCANO',
    name: '烈焰峡谷',
    region: '地心熔岩区',
    description: '奔流着炽热熔岩的地心火山峡谷，赤焰雀与火系魔兽在炽热的岩浆与黑曜石古堡中栖息。',
    themeColor: '#ea580c',
    wildPets: [
      { speciesId: 'jingjiaxuangui', minLevel: 6, maxLevel: 12, chance: 0.5 },
      { speciesId: 'chiyanque', minLevel: 8, maxLevel: 14, chance: 0.5 },
    ],
    npcs: [
      {
        id: 'npc_fire_smith',
        name: '探险家 托比',
        role: '皇家地质探险学者',
        x: 35,
        y: 45,
        avatarSvg: 'smith',
        dialogue: [
          '烈焰峡谷到处都是炽热的火晶石，这里的火系宠物如果历经蜕变，将化身浴火涅槃的神凰！',
          '用水系宠物对抗烈火强敌，能够打出克制双倍伤害！',
        ],
      },
    ],
    chests: [
      { id: 'chest_volc_1', x: 78, y: 30, coins: 800, itemId: 'potion_mid', itemCount: 3 },
    ],
  },

  BAY: {
    id: 'BAY',
    name: '蔚蓝海湾',
    region: '海螺沙滩',
    description: '阳光洒满金色沙滩，清澈的海浪拍打着发光珊瑚礁，碧水灵在浅海浪花中跃动，传说通往失落潮汐遗迹。',
    themeColor: '#0284c7',
    wildPets: [
      { speciesId: 'bishuiling', minLevel: 6, maxLevel: 12, chance: 0.7 },
      { speciesId: 'jiguangxuehu', minLevel: 8, maxLevel: 13, chance: 0.3 },
    ],
    npcs: [
      {
        id: 'npc_sea_voyager',
        name: '水手 沃尔特',
        role: '皇家远洋探险船长',
        x: 25,
        y: 50,
        avatarSvg: 'sailor',
        dialogue: [
          '蔚蓝海湾的水系宠物非常温顺亲切，碧水灵正是水系御三家的至宝伙伴！',
          '草系技能可以有效克制奔涌的水流，多搭配不同属性的宠物才能百战百胜！',
        ],
      },
    ],
    chests: [
      { id: 'chest_bay_1', x: 70, y: 70, coins: 600, itemId: 'elixir_pp', itemCount: 2 },
    ],
  },

  HOSPITAL: {
    id: 'HOSPITAL',
    name: '爱心护理所',
    region: '爱心诊所',
    description: '充满温馨药剂香气的王国爱心诊所，温柔的莉莉娅护士用圣水泉免费为所有受伤宠物恢复满精力与技能魔力（PP）！',
    themeColor: '#ec4899',
    wildPets: [],
    npcs: [
      {
        id: 'npc_nurse_yunxi',
        name: '莉莉娅护士',
        role: '爱心医疗天使',
        x: 50,
        y: 40,
        avatarSvg: 'nurse',
        dialogue: [
          '小魔法师辛苦啦！冒险旅途中幻灵一定累坏了吧？',
          '请把幻灵球交给我，魔法圣水会让所有伙伴满精力复活、招式魔力（PP）全部回满哦！',
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
    name: '幻灵集市',
    region: '商业街区',
    description: '幻灵世界最热闹的魔导商品集市，各级幻灵球、进阶治疗药剂与珍贵进化药水应有尽有。',
    themeColor: '#d97706',
    wildPets: [],
    npcs: [
      {
        id: 'npc_merchant_geqian',
        name: '商人 巴纳比',
        role: '幻灵集市大掌柜',
        x: 50,
        y: 42,
        avatarSvg: 'merchant',
        dialogue: [
          '欢迎光临幻灵集市！这里有全大陆品质最好的幻灵球和魔力药水！',
          '用冒险赚到的幻灵金币选购心仪的道具，开启你的大魔法师之旅吧！',
        ],
        actionType: 'SHOP',
      },
    ],
    chests: [],
  },

  ARENA: {
    id: 'ARENA',
    name: '幻灵竞技场',
    region: '荣耀擂台',
    description: '幻灵世界顶尖魔法师切磋决斗的最高殿堂，战旗飘扬，王者天梯擂台等待真正勇者的挑战！',
    themeColor: '#7c3aed',
    wildPets: [
      { speciesId: 'leiwenhou', minLevel: 14, maxLevel: 20, chance: 0.55 },
      { speciesId: 'jiguangxuehu', minLevel: 15, maxLevel: 22, chance: 0.45 },
    ],
    npcs: [
      {
        id: 'npc_champion_tianheng',
        name: '骑士团长 兰斯洛',
        role: '幻灵竞技场总裁判',
        x: 50,
        y: 38,
        avatarSvg: 'knight',
        dialogue: [
          '只有智慧、勇气兼备的魔法师，才能在幻灵竞技场登顶天梯之巅！',
          '来吧！证明你与幻灵伙伴之间的羁绊，击败我的战宠赢取幻灵大师勋章！',
        ],
        actionType: 'ARENA_CHALLENGE',
      },
    ],
    chests: [
      { id: 'chest_arena_1', x: 85, y: 70, coins: 1500, itemId: 'gulu_king', itemCount: 1 },
    ],
  },
};
