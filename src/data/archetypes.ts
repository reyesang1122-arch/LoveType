export type ArchetypeId =
  | "guardian"
  | "dreamer"
  | "pursuer"
  | "independent"
  | "healer"
  | "challenger"
  | "mediator"
  | "builder";

export interface Archetype {
  id: ArchetypeId;
  name: string; // English name
  nameZh: string; // Chinese name
  emoji: string;
  /** Anime character card in /public (350x561) */
  avatar: string;
  /** Spirit-animal display name, e.g. "守护狐" (used on landing for virality) */
  spiritName: string;
  /** English animal name, e.g. "Guardian Fox" */
  animalName: string;
  /** Animal emoji, e.g. "🦊" */
  animalEmoji: string;
  /** One-line identity statement for the landing grid */
  identity: string;
  /** One-line personality description, used on the share card */
  tagline: string;
  /** Longer paragraph for the result page */
  description: string;
  strengths: string[];
  blindSpots: string[];
  /** Ideal-match archetype id */
  idealMatch: ArchetypeId;
  /** Why this match works (one line) */
  matchReason: string;
  /** Tailwind gradient + accent colors used across UI and the share card */
  theme: {
    from: string; // hex
    via: string; // hex
    to: string; // hex
    accent: string; // hex, for chips / progress
    text: string; // readable text color on the gradient
  };
}

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  guardian: {
    id: "guardian",
    name: "Guardian",
    nameZh: "守护者",
    emoji: "🛡️",
    avatar: "/guardian_fox.png",
    spiritName: "守护狐",
    animalName: "Guardian Fox",
    animalEmoji: "🦊",
    identity: "总把别人放在自己前面",
    tagline: "我用稳定与忠诚，把爱守成一座港湾。",
    description:
      "你是关系里的定海神针。你重视承诺、责任与安全感，愿意为所爱的人筑起一道墙，挡住外面的风雨。你的爱不张扬，却厚重可靠——当别人慌乱时，你是那个还站得稳的人。",
    strengths: ["忠诚可靠，说到做到", "在冲突中保持冷静与稳定", "愿意为关系长期付出", "给伴侣强烈的安全感"],
    blindSpots: ["容易把责任扛成压力，不懂求助", "习惯压抑自己的需求", "面对变化时会过度防御"],
    idealMatch: "dreamer",
    matchReason: "梦想鹿为你的稳定注入色彩，你为它的浪漫托住底。",
    theme: { from: "#2b5876", via: "#4e7ea8", to: "#7db9d6", accent: "#3a7bd5", text: "#ffffff" },
  },
  dreamer: {
    id: "dreamer",
    name: "Dreamer",
    nameZh: "梦想家",
    emoji: "✨",
    avatar: "/dream_deer.png",
    spiritName: "梦想鹿",
    animalName: "Dream Deer",
    animalEmoji: "🦌",
    identity: "相信爱情可以改变世界",
    tagline: "我相信爱可以很美，也愿意为它造梦。",
    description:
      "你天生浪漫，对爱情有画面感。你能在平凡日子里看见诗意，也愿意把心交付给一段值得期待的关系。你的世界柔软而辽阔，能让身边的人重新相信美好。",
    strengths: ["富有想象力与浪漫感", "情感细腻，懂得制造惊喜", "对未来充满希望", "能让关系保持新鲜与心动"],
    blindSpots: ["容易把人理想化，落差时受伤", "回避现实中的琐碎与冲突", "情绪起伏较大"],
    idealMatch: "guardian",
    matchReason: "守护狐把你的梦稳稳接住，让浪漫有了落地的根。",
    theme: { from: "#c471ed", via: "#d98fe8", to: "#f6a6d3", accent: "#b24bd8", text: "#ffffff" },
  },
  pursuer: {
    id: "pursuer",
    name: "Pursuer",
    nameZh: "追求者",
    emoji: "🔥",
    avatar: "/pursuer_otter.png",
    spiritName: "追寻獭",
    animalName: "Pursuer Otter",
    animalEmoji: "🦦",
    identity: "渴望被回应",
    tagline: "认定了，我就会全力以赴去爱。",
    description:
      "你热烈、主动、敢爱敢表达。一旦心动，你不会被动等待，而是勇敢靠近、直球出击。你的热情像火，能点燃一段关系的开始，也能在低谷时给对方往前走的力气。",
    strengths: ["主动表达，敢于争取", "热情有感染力", "推动关系向前发展", "在低潮中给予能量"],
    blindSpots: ["节奏太快，容易给对方压力", "得不到回应时易焦虑", "把胜负心带进感情"],
    idealMatch: "independent",
    matchReason: "独行猫的留白让你的热情有呼吸，你为它带来靠近的勇气。",
    theme: { from: "#ff512f", via: "#f7642f", to: "#f09819", accent: "#f5482b", text: "#ffffff" },
  },
  independent: {
    id: "independent",
    name: "Independent",
    nameZh: "独行者",
    emoji: "🌙",
    avatar: "/independent_cat.png",
    spiritName: "独行猫",
    animalName: "Independent Cat",
    animalEmoji: "🐱",
    identity: "爱你，也需要空间",
    tagline: "我先完整，再与你并肩。",
    description:
      "你珍惜自我与空间，相信好的关系不是彼此吞没，而是两个独立的人互相照亮。你冷静、清醒，不轻易依赖，也因此能给对方足够的自由。你的爱安静，却有分量。",
    strengths: ["独立自主，有清晰边界", "尊重彼此的空间", "理性冷静，不情绪绑架", "关系中保持自我成长"],
    blindSpots: ["习惯性回避亲密与脆弱", "需要时不愿开口求助", "可能让对方觉得难以靠近"],
    idealMatch: "pursuer",
    matchReason: "追寻獭主动跨过你的距离，你教会它什么叫尊重的爱。",
    theme: { from: "#3a1c71", via: "#4b3b8f", to: "#6d5bba", accent: "#5b4bb8", text: "#ffffff" },
  },
  healer: {
    id: "healer",
    name: "Healer",
    nameZh: "治愈者",
    emoji: "💗",
    avatar: "/healer_rabbit.png",
    spiritName: "治愈兔",
    animalName: "Healer Rabbit",
    animalEmoji: "🐰",
    identity: "最懂别人感受",
    tagline: "我愿意接住你的情绪，也接住你的脆弱。",
    description:
      "你共情力极强，总能敏锐地察觉对方的情绪。你温柔、包容，是身边人的情感避风港。你懂得倾听，也懂得安慰，能让一段关系充满被理解的温度。",
    strengths: ["共情力强，善于倾听", "温柔包容，给人安全感", "懂得照顾对方情绪", "化解关系中的伤口"],
    blindSpots: ["过度付出，忽略自己的需要", "容易吸收对方的负面情绪", "难以拒绝，界限模糊"],
    idealMatch: "challenger",
    matchReason: "挑战狼推你向前成长，你为它的锋芒注入温柔。",
    theme: { from: "#ff5f9e", via: "#ff7eb3", to: "#ffb6c8", accent: "#ff4f93", text: "#ffffff" },
  },
  challenger: {
    id: "challenger",
    name: "Challenger",
    nameZh: "挑战者",
    emoji: "⚡",
    avatar: "/challenger_wolf.png",
    spiritName: "挑战狼",
    animalName: "Challenger Wolf",
    animalEmoji: "🐺",
    identity: "有话直接说",
    tagline: "我爱你，所以希望我们一起变得更好。",
    description:
      "你直接、坦诚，不喜欢回避问题。你把关系看作共同成长的旅程，敢于指出问题，也敢于面对自己的不足。你的爱有张力，能推动两个人不断进化。",
    strengths: ["坦诚直接，不回避冲突", "推动彼此成长", "有主见与行动力", "敢于面对真实的问题"],
    blindSpots: ["语气太直，容易伤人", "把成长变成要求与压力", "缺少柔软的表达"],
    idealMatch: "healer",
    matchReason: "治愈兔软化你的棱角，你为它带来向上的方向。",
    theme: { from: "#0f9b8e", via: "#2bbbad", to: "#5fd6c8", accent: "#11998e", text: "#ffffff" },
  },
  mediator: {
    id: "mediator",
    name: "Mediator",
    nameZh: "调停者",
    emoji: "🕊️",
    avatar: "/mediator_owl.png",
    spiritName: "调停鸮",
    animalName: "Mediator Owl",
    animalEmoji: "🦉",
    identity: "讨厌冲突",
    tagline: "我擅长把误解，翻译成理解。",
    description:
      "你天生懂得平衡与协调。在关系里，你能看见双方的立场，化解对立，找到那条让彼此都舒服的中间路。你温和而有智慧，是让关系长治久安的黏合剂。",
    strengths: ["善于沟通与化解矛盾", "能看见双方立场", "情绪稳定，懂得让步", "维系关系的和谐"],
    blindSpots: ["为了和谐压抑真实想法", "回避必要的冲突", "委屈自己成全别人"],
    idealMatch: "builder",
    matchReason: "建设熊把你的和谐变成稳固的结构，你为关系保留弹性。",
    theme: { from: "#5691c8", via: "#74b0d8", to: "#8fd3c6", accent: "#457fca", text: "#ffffff" },
  },
  builder: {
    id: "builder",
    name: "Builder",
    nameZh: "建设者",
    emoji: "🏗️",
    avatar: "/builder_bear.png",
    spiritName: "建设熊",
    animalName: "Builder Bear",
    animalEmoji: "🐻",
    identity: "爱是行动",
    tagline: "我把爱，过成一起规划的未来。",
    description:
      "你务实、有计划，相信感情需要经营。你不空谈浪漫，而是用行动一砖一瓦地搭建共同生活。你重视成长、规划与落地，是那个能把『我们』变成真实未来的人。",
    strengths: ["务实可靠，重视行动", "擅长规划共同未来", "稳定持续地经营关系", "把承诺落到实处"],
    blindSpots: ["容易忽略情绪与浪漫", "把关系当项目来管理", "不善表达柔软的需求"],
    idealMatch: "mediator",
    matchReason: "调停鸮为你的规划注入温度，你为关系搭起可靠的骨架。",
    theme: { from: "#e0a44e", via: "#d98e3a", to: "#c97b2c", accent: "#d98e3a", text: "#ffffff" },
  },
};

export const ARCHETYPE_IDS = Object.keys(ARCHETYPES) as ArchetypeId[];

export function getArchetype(id: string | null | undefined): Archetype | null {
  if (!id) return null;
  return (ARCHETYPES as Record<string, Archetype>)[id] ?? null;
}
