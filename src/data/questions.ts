import type { ArchetypeId } from "./archetypes";

export interface QuestionOption {
  text: string;
  /** Points contributed to multiple archetypes */
  scores: Partial<Record<ArchetypeId, number>>;
}

export interface Question {
  id: number;
  text: string;
  options: QuestionOption[];
}

/**
 * 20 questions. Every option contributes points to 2-3 archetypes so the
 * final profile is a blend rather than a single bucket.
 */
export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "刚开始喜欢一个人时，你通常会？",
    options: [
      { text: "主动出击，让对方感受到我的心意", scores: { pursuer: 3, challenger: 1 } },
      { text: "默默观察，先把自己稳住", scores: { independent: 3, guardian: 1 } },
      { text: "幻想我们在一起的各种画面", scores: { dreamer: 3, healer: 1 } },
      { text: "先了解我们是否真的合适、能走长远", scores: { builder: 3, guardian: 1 } },
    ],
  },
  {
    id: 2,
    text: "当伴侣情绪低落时，你的第一反应是？",
    options: [
      { text: "陪着他，让他知道我一直都在", scores: { healer: 3, guardian: 1 } },
      { text: "帮他分析问题，找到解决办法", scores: { challenger: 2, builder: 2 } },
      { text: "给他一点空间，不勉强他说", scores: { independent: 3, mediator: 1 } },
      { text: "想办法逗他开心，转移注意力", scores: { dreamer: 2, pursuer: 2 } },
    ],
  },
  {
    id: 3,
    text: "关系里你最看重的是？",
    options: [
      { text: "安全感与忠诚", scores: { guardian: 3, builder: 1 } },
      { text: "心动与浪漫", scores: { dreamer: 3, pursuer: 1 } },
      { text: "彼此独立又互相尊重", scores: { independent: 3, mediator: 1 } },
      { text: "一起成长、变成更好的人", scores: { challenger: 3, builder: 1 } },
    ],
  },
  {
    id: 4,
    text: "和伴侣意见不合时，你更倾向？",
    options: [
      { text: "把话讲开，问题不能拖", scores: { challenger: 3, pursuer: 1 } },
      { text: "先冷静，找个都舒服的折中点", scores: { mediator: 3, independent: 1 } },
      { text: "先让一步，维持和谐再说", scores: { mediator: 2, healer: 2 } },
      { text: "守住底线，但不会轻易翻脸", scores: { guardian: 3, builder: 1 } },
    ],
  },
  {
    id: 5,
    text: "你理想中的周末约会是？",
    options: [
      { text: "一场有惊喜、有仪式感的约会", scores: { dreamer: 3, pursuer: 1 } },
      { text: "各做各的，晚上再分享彼此的一天", scores: { independent: 3, mediator: 1 } },
      { text: "一起做顿饭、布置家，经营小日子", scores: { builder: 3, guardian: 1 } },
      { text: "去尝试一件我们都没做过的新事", scores: { challenger: 2, pursuer: 2 } },
    ],
  },
  {
    id: 6,
    text: "对方做错事让你受伤时，你会？",
    options: [
      { text: "直接说出来，让他知道我的感受", scores: { challenger: 3, pursuer: 1 } },
      { text: "忍一忍，不想破坏气氛", scores: { mediator: 2, healer: 2 } },
      { text: "先消化情绪，再决定怎么沟通", scores: { independent: 2, guardian: 2 } },
      { text: "试着理解他背后的原因", scores: { healer: 3, mediator: 1 } },
    ],
  },
  {
    id: 7,
    text: "你觉得自己在关系里更像？",
    options: [
      { text: "守护对方的那座墙", scores: { guardian: 3, healer: 1 } },
      { text: "点燃气氛的那把火", scores: { pursuer: 3, dreamer: 1 } },
      { text: "维持平衡的那个人", scores: { mediator: 3, builder: 1 } },
      { text: "推动我们往前的那双手", scores: { challenger: 2, builder: 2 } },
    ],
  },
  {
    id: 8,
    text: "你怎么表达爱？",
    options: [
      { text: "用行动默默付出，照顾好他的生活", scores: { guardian: 2, builder: 2 } },
      { text: "用言语和惊喜让他时刻感受到", scores: { pursuer: 2, dreamer: 2 } },
      { text: "用倾听和理解让他被看见", scores: { healer: 3, mediator: 1 } },
      { text: "给他自由，也尊重他的节奏", scores: { independent: 3, mediator: 1 } },
    ],
  },
  {
    id: 9,
    text: "面对未来，你更常想的是？",
    options: [
      { text: "我们要怎么一步步把生活搭起来", scores: { builder: 3, guardian: 1 } },
      { text: "我们会一起经历多少浪漫的故事", scores: { dreamer: 3, pursuer: 1 } },
      { text: "我能不能在关系里依然做自己", scores: { independent: 3, challenger: 1 } },
      { text: "我们能不能一起变得更成熟", scores: { challenger: 3, healer: 1 } },
    ],
  },
  {
    id: 10,
    text: "伴侣需要空间的时候，你会？",
    options: [
      { text: "完全理解，我也需要自己的时间", scores: { independent: 3, mediator: 1 } },
      { text: "尊重他，但会有点担心和不安", scores: { pursuer: 2, healer: 2 } },
      { text: "默默守着，等他想回来", scores: { guardian: 3, builder: 1 } },
      { text: "趁机各自成长，回来再分享", scores: { challenger: 2, independent: 2 } },
    ],
  },
  {
    id: 11,
    text: "你最害怕关系里出现？",
    options: [
      { text: "背叛与不忠", scores: { guardian: 3, pursuer: 1 } },
      { text: "失去激情，变得平淡", scores: { dreamer: 2, pursuer: 2 } },
      { text: "被束缚、失去自我", scores: { independent: 3, challenger: 1 } },
      { text: "停滞不前，两个人都不成长", scores: { challenger: 3, builder: 1 } },
    ],
  },
  {
    id: 12,
    text: "朋友形容你在感情里是个？",
    options: [
      { text: "靠谱、让人安心的人", scores: { guardian: 2, builder: 2 } },
      { text: "浪漫、有点理想主义的人", scores: { dreamer: 3, pursuer: 1 } },
      { text: "温柔、特别会照顾人的人", scores: { healer: 3, mediator: 1 } },
      { text: "清醒、独立有主见的人", scores: { independent: 2, challenger: 2 } },
    ],
  },
  {
    id: 13,
    text: "当关系遇到瓶颈，你倾向？",
    options: [
      { text: "坐下来好好谈，把问题摊开", scores: { challenger: 3, mediator: 1 } },
      { text: "用心经营，做些改变让它变好", scores: { builder: 3, healer: 1 } },
      { text: "给彼此时间，让情绪先沉淀", scores: { independent: 2, mediator: 2 } },
      { text: "更主动靠近，把热度找回来", scores: { pursuer: 3, dreamer: 1 } },
    ],
  },
  {
    id: 14,
    text: "你更容易被哪种人吸引？",
    options: [
      { text: "稳重可靠、给我安全感的人", scores: { guardian: 2, builder: 2 } },
      { text: "有趣浪漫、让我心动的人", scores: { dreamer: 2, pursuer: 2 } },
      { text: "温暖体贴、懂我情绪的人", scores: { healer: 3, mediator: 1 } },
      { text: "独立有想法、能带我成长的人", scores: { independent: 2, challenger: 2 } },
    ],
  },
  {
    id: 15,
    text: "伴侣和别人走得近时，你会？",
    options: [
      { text: "直接问清楚，不喜欢猜", scores: { challenger: 2, pursuer: 2 } },
      { text: "相信他，但会守住自己的界限", scores: { independent: 2, guardian: 2 } },
      { text: "有点吃醋，但会换位想想", scores: { healer: 2, mediator: 2 } },
      { text: "用更好的相处把他留在身边", scores: { builder: 2, dreamer: 2 } },
    ],
  },
  {
    id: 16,
    text: "做重要决定时，你和伴侣会？",
    options: [
      { text: "一起规划，把利弊都算清楚", scores: { builder: 3, challenger: 1 } },
      { text: "尊重彼此，各自保留选择权", scores: { independent: 3, mediator: 1 } },
      { text: "以两个人的感受为优先", scores: { healer: 2, mediator: 2 } },
      { text: "跟着心走，相信我们的直觉", scores: { dreamer: 3, pursuer: 1 } },
    ],
  },
  {
    id: 17,
    text: "你心里『好的爱情』是？",
    options: [
      { text: "一辈子的承诺与陪伴", scores: { guardian: 3, builder: 1 } },
      { text: "一直心动、永远新鲜", scores: { dreamer: 3, pursuer: 1 } },
      { text: "两个完整的人，互相成就", scores: { independent: 2, challenger: 2 } },
      { text: "彼此被理解、被温柔接住", scores: { healer: 3, mediator: 1 } },
    ],
  },
  {
    id: 18,
    text: "吵架之后，你通常是？",
    options: [
      { text: "先低头的那个，不想冷战", scores: { healer: 2, mediator: 2 } },
      { text: "要把事情讲清楚才能翻篇", scores: { challenger: 3, pursuer: 1 } },
      { text: "需要独处冷静一下", scores: { independent: 3, guardian: 1 } },
      { text: "用行动和好，比如做顿饭、买点小东西", scores: { builder: 2, dreamer: 2 } },
    ],
  },
  {
    id: 19,
    text: "你希望伴侣怎么爱你？",
    options: [
      { text: "稳稳地守着我，不让我担心", scores: { guardian: 3, healer: 1 } },
      { text: "热烈地追我、宠我", scores: { pursuer: 3, dreamer: 1 } },
      { text: "给我空间，也愿意懂我", scores: { independent: 2, healer: 2 } },
      { text: "和我并肩，一起把日子越过越好", scores: { builder: 3, challenger: 1 } },
    ],
  },
  {
    id: 20,
    text: "用一句话形容你对爱情的态度？",
    options: [
      { text: "认定了就好好守护", scores: { guardian: 2, builder: 2 } },
      { text: "爱要轰轰烈烈、用力去追", scores: { pursuer: 2, dreamer: 2 } },
      { text: "先爱自己，再好好爱你", scores: { independent: 2, challenger: 2 } },
      { text: "愿意理解，也愿意被理解", scores: { healer: 2, mediator: 2 } },
    ],
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;
