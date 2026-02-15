
import { Question, Dimension } from '../types';

export const QUESTIONS: Question[] = [
  // 1. 职业管理 (9题)
  { id: 1, dimension: Dimension.CareerManagement, text: "如果只能选择一个，你更看重：", options: [
    { label: "在职业中获得经济回报", subDimension: "外在激励", value: "A" },
    { label: "在职业生涯中不断学习和成长", subDimension: "内在激励", value: "B" }
  ]},
  { id: 2, dimension: Dimension.CareerManagement, text: "在职业选择中，你希望：", options: [
    { label: "成为他人眼中的成功人士", subDimension: "外在激励", value: "A" },
    { label: "从事有意思的工作", subDimension: "内在激励", value: "B" }
  ]},
  { id: 3, dimension: Dimension.CareerManagement, text: "如果只能选择一个，你更希望：", options: [
    { label: "在公司里被大家看成是一个能干的人", subDimension: "外在激励", value: "A" },
    { label: "通过参与广泛而多样的工作任务获得经验", subDimension: "内在激励", value: "B" }
  ]},
  { id: 4, dimension: Dimension.CareerManagement, text: "在工作中，你更在乎：", options: [
    { label: "享有高社会地位的职业", subDimension: "外在激励", value: "A" },
    { label: "发展自己的技能", subDimension: "内在激励", value: "B" }
  ]},
  { id: 5, dimension: Dimension.CareerManagement, text: "对你来说，职业中更重要的是：", options: [
    { label: "获得经济回报和认可", subDimension: "外在激励", value: "A" },
    { label: "对他人或社会问题产生积极的影响", subDimension: "内在激励", value: "B" }
  ]},
  { id: 6, dimension: Dimension.CareerManagement, text: "在选择职业时，你更关心：", options: [
    { label: "工作能带来高薪酬", subDimension: "外在激励", value: "A" },
    { label: "工作能提供有意思的工作机会", subDimension: "内在激励", value: "B" }
  ]},
  { id: 7, dimension: Dimension.CareerManagement, text: "如果只能选择一个，你希望：", options: [
    { label: "在职业中被大家看成是成功的人", subDimension: "外在激励", value: "A" },
    { label: "通过广泛工作任务获得丰富经验", subDimension: "内在激励", value: "B" }
  ]},
  { id: 8, dimension: Dimension.CareerManagement, text: "在职业生涯中，你更注重：", options: [
    { label: "获得社会地位和他人尊重", subDimension: "外在激励", value: "A" },
    { label: "通过工作不断发展自己的技能", subDimension: "内在激励", value: "B" }
  ]},
  { id: 9, dimension: Dimension.CareerManagement, text: "对你来说，职业中更重要的是：", options: [
    { label: "经济回报和社会地位", subDimension: "外在激励", value: "A" },
    { label: "对社会产生积极影响和工作兴趣", subDimension: "内在激励", value: "B" }
  ]},

  // 2. 行为偏好与认知风格 (5题)
  { id: 10, dimension: Dimension.BehavioralBias, text: "在面对一个重要决策时，你更倾向于：", options: [
    { label: "仔细规划你的行动方案", subDimension: "系统性认知", value: "A" },
    { label: "追随你的直觉", subDimension: "直觉型认知", value: "B" }
  ]},
  { id: 11, dimension: Dimension.BehavioralBias, text: "在开展一项新工作前，你会：", options: [
    { label: "收集好所有所需信息", subDimension: "系统性认知", value: "A" },
    { label: "如果感觉某个方式是对的，就认为那个做事方式适合你", subDimension: "直觉型认知", value: "B" }
  ]},
  { id: 12, dimension: Dimension.BehavioralBias, text: "当你做一些非常重要的工作时，你会：", options: [
    { label: "尽量严格按照你的工作计划行事", subDimension: "系统性认知", value: "A" },
    { label: "通常在没有明确想法的时候先开始做起来", subDimension: "直觉型认知", value: "B" }
  ]},
  { id: 13, dimension: Dimension.BehavioralBias, text: "在决定如何行动时，你更倾向于：", options: [
    { label: "通过系统的、有序的方式做出决定", subDimension: "系统性认知", value: "A" },
    { label: "遵循内心的感觉和情感", subDimension: "直觉型认知", value: "B" }
  ]},
  { id: 14, dimension: Dimension.BehavioralBias, text: "当不得不在各种方案之间做出选择时，你会：", options: [
    { label: "分析每个方案，然后选择最好的那个", subDimension: "系统性认知", value: "A" },
    { label: "经常在做了一个好的决策后还不知道自己是怎么做到的", subDimension: "直觉型认知", value: "B" }
  ]},

  // 3. 学习取向 (12题)
  { id: 15, dimension: Dimension.LearningOrientation, text: "学习时，你更喜欢：", options: [
    { label: "边做边学，从实际操作中学习", subDimension: "具体经验", value: "A" },
    { label: "做各种尝试和实验", subDimension: "主动尝试", value: "B" }
  ]},
  { id: 16, dimension: Dimension.LearningOrientation, text: "学习时，你更倾向于：", options: [
    { label: "从个人经验中学到的最多", subDimension: "具体经验", value: "A" },
    { label: "从尝试与实践中学到的最多", subDimension: "主动尝试", value: "B" }
  ]},
  { id: 17, dimension: Dimension.LearningOrientation, text: "学习时，你更倾向于：", options: [
    { label: "从实际操作中学习", subDimension: "具体经验", value: "A" },
    { label: "通过思考来学习", subDimension: "抽象概念化", value: "B" }
  ]},
  { id: 18, dimension: Dimension.LearningOrientation, text: "学习时，你更重视：", options: [
    { label: "新的经验和实际操作", subDimension: "具体经验", value: "A" },
    { label: "逻辑和评估", subDimension: "抽象概念化", value: "B" }
  ]},
  { id: 19, dimension: Dimension.LearningOrientation, text: "学习时，你更倾向于：", options: [
    { label: "边做边学，从实际操作中学习", subDimension: "具体经验", value: "A" },
    { label: "通过观察别人来学习", subDimension: "反思性观察", value: "B" }
  ]},
  { id: 20, dimension: Dimension.LearningOrientation, text: "学习时，你更喜欢：", options: [
    { label: "从个人经验中学到的最多", subDimension: "具体经验", value: "A" },
    { label: "通过仔细观察学到最多", subDimension: "反思性观察", value: "B" }
  ]},
  { id: 21, dimension: Dimension.LearningOrientation, text: "学习时，你更喜欢：", options: [
    { label: "做各种尝试和实验", subDimension: "主动尝试", value: "A" },
    { label: "通过思考和逻辑来学习", subDimension: "抽象概念化", value: "B" }
  ]},
  { id: 22, dimension: Dimension.LearningOrientation, text: "学习时，你更重视：", options: [
    { label: "尝试与实践", subDimension: "主动尝试", value: "A" },
    { label: "分析和评估", subDimension: "抽象概念化", value: "B" }
  ]},
  { id: 23, dimension: Dimension.LearningOrientation, text: "学习时，你更倾向于：", options: [
    { label: "通过做实验来学习", subDimension: "主动尝试", value: "A" },
    { label: "通过观察来学习", subDimension: "反思性观察", value: "B" }
  ]},
  { id: 24, dimension: Dimension.LearningOrientation, text: "学习时，你更喜欢：", options: [
    { label: "做各种尝试和实践", subDimension: "主动尝试", value: "A" },
    { label: "通过仔细观察别人来学习", subDimension: "反思性观察", value: "B" }
  ]},
  { id: 25, dimension: Dimension.LearningOrientation, text: "学习时，你更重视：", options: [
    { label: "通过逻辑和评估来学习", subDimension: "抽象概念化", value: "A" },
    { label: "通过观察和反思来学习", subDimension: "反思性观察", value: "B" }
  ]},
  { id: 26, dimension: Dimension.LearningOrientation, text: "学习时，你更倾向于：", options: [
    { label: "分析和思考", subDimension: "抽象概念化", value: "A" },
    { label: "观察和反思", subDimension: "反思性观察", value: "B" }
  ]},

  // 4. 文化氛围与价值观 (10题)
  { id: 27, dimension: Dimension.CulturalValues, text: "在选择工作时，你更重视：", options: [
    { label: "常态的工作时间和地点", subDimension: "舒适度安全性", value: "A" },
    { label: "需要与很多其他人见面和交谈", subDimension: "能力与成长", value: "B" },
    { label: "允许拥有更高管理职责", subDimension: "地位与独立性", value: "C" }
  ]},
  { id: 28, dimension: Dimension.CulturalValues, text: "在工作中，你更喜欢：", options: [
    { label: "提供工作保障", subDimension: "舒适度安全性", value: "A" },
    { label: "激发智力", subDimension: "能力与成长", value: "B" },
    { label: "提供赚取高收入的机会", subDimension: "地位与独立性", value: "C" }
  ]},
  { id: 29, dimension: Dimension.CulturalValues, text: "工作时，你更倾向于：", options: [
    { label: "有可遵循的明确规则和程序", subDimension: "舒适度安全性", value: "A" },
    { label: "需要有原创性和创造性", subDimension: "能力与成长", value: "B" },
    { label: "需要监督管理别人", subDimension: "地位与独立性", value: "C" }
  ]},
  { id: 30, dimension: Dimension.CulturalValues, text: "在职业选择中，你更看重：", options: [
    { label: "工作后有充足的业余时间", subDimension: "舒适度安全性", value: "A" },
    { label: "通过你的工作做出社会贡献", subDimension: "能力与成长", value: "B" },
    { label: "允许独立工作", subDimension: "地位与独立性", value: "C" }
  ]},
  { id: 31, dimension: Dimension.CulturalValues, text: "在工作环境中，你更在乎：", options: [
    { label: "提供舒适的工作环境", subDimension: "舒适度安全性", value: "A" },
    { label: "满足你的文化和审美情趣", subDimension: "能力与成长", value: "B" },
    { label: "受人尊重", subDimension: "地位与独立性", value: "C" }
  ]},
  { id: 32, dimension: Dimension.CulturalValues, text: "在工作中，你更重视（再次确认倾向）：", options: [
    { label: "常态的工作时间和地点", subDimension: "舒适度安全性", value: "A" },
    { label: "需要与很多其他人见面和交谈", subDimension: "能力与成长", value: "B" },
    { label: "允许拥有更高管理职责", subDimension: "地位与独立性", value: "C" }
  ]},
  { id: 33, dimension: Dimension.CulturalValues, text: "在工作中，你更看重（核心需求）：", options: [
    { label: "提供工作保障", subDimension: "舒适度安全性", value: "A" },
    { label: "激发智力", subDimension: "能力与成长", value: "B" },
    { label: "提供赚取高收入的机会", subDimension: "地位与独立性", value: "C" }
  ]},
  { id: 34, dimension: Dimension.CulturalValues, text: "在工作中，你更喜欢（执行偏好）：", options: [
    { label: "有可遵循的明确规则和程序", subDimension: "舒适度安全性", value: "A" },
    { label: "需要有原创性和创造性", subDimension: "能力与成长", value: "B" },
    { label: "需要监督管理别人", subDimension: "地位与独立性", value: "C" }
  ]},
  { id: 35, dimension: Dimension.CulturalValues, text: "在职业选择中，你更倾向于：", options: [
    { label: "工作后有充足的业余时间", subDimension: "舒适度安全性", value: "A" },
    { label: "通过你的工作做出社会贡献", subDimension: "能力与成长", value: "B" },
    { label: "允许独立工作", subDimension: "地位与独立性", value: "C" }
  ]},
  { id: 36, dimension: Dimension.CulturalValues, text: "在工作环境中，你更在乎：", options: [
    { label: "提供舒适的工作环境", subDimension: "舒适度安全性", value: "A" },
    { label: "满足你的文化和审美情趣", subDimension: "能力与成长", value: "B" },
    { label: "受人尊重", subDimension: "地位与独立性", value: "C" }
  ]},

  // 5. 自我/新生代价值观 (10题)
  { id: 37, dimension: Dimension.SelfValues, text: "在选择工作时，你更看重：", options: [
    { label: "较好的薪酬福利", subDimension: "功利导向", value: "A" },
    { label: "工作符合自己的兴趣爱好", subDimension: "内在偏好", value: "B" },
    { label: "融洽的工作氛围", subDimension: "人际和谐", value: "C" }
  ]},
  { id: 38, dimension: Dimension.SelfValues, text: "在工作中，你更在意：", options: [
    { label: "不断增长的薪酬", subDimension: "功利导向", value: "A" },
    { label: "工作是有价值和重要的", subDimension: "内在偏好", value: "B" },
    { label: "同事之间互相尊重", subDimension: "人际和谐", value: "C" }
  ]},
  { id: 39, dimension: Dimension.SelfValues, text: "在职业选择中，你更重视：", options: [
    { label: "努力付出会有等价回报", subDimension: "功利导向", value: "A" },
    { label: "富有挑战性的工作", subDimension: "创新导向", value: "B" },
    { label: "良好的职业发展规划", subDimension: "长期发展", value: "C" }
  ]},
  { id: 40, dimension: Dimension.SelfValues, text: "在工作中，你更喜欢：", options: [
    { label: "不断增长的薪酬", subDimension: "功利导向", value: "A" },
    { label: "创新的工作", subDimension: "创新导向", value: "B" },
    { label: "良好的发展空间", subDimension: "长期发展", value: "C" }
  ]},
  { id: 41, dimension: Dimension.SelfValues, text: "在工作中，你更看重：", options: [
    { label: "工作符合自己的兴趣爱好", subDimension: "内在偏好", value: "A" },
    { label: "领导平易近人", subDimension: "人际和谐", value: "B" },
    { label: "创造性的工作理念", subDimension: "创新导向", value: "C" }
  ]},
  { id: 42, dimension: Dimension.SelfValues, text: "在工作环境中，你更在意：", options: [
    { label: "工作有趣味性", subDimension: "内在偏好", value: "A" },
    { label: "团队有平等的人际关系", subDimension: "人际和谐", value: "B" },
    { label: "富有挑战性的工作", subDimension: "创新导向", value: "C" }
  ]},
  { id: 43, dimension: Dimension.SelfValues, text: "在工作中，你更喜欢：", options: [
    { label: "工作有趣味性", subDimension: "内在偏好", value: "A" },
    { label: "创新的工作", subDimension: "创新导向", value: "B" },
    { label: "不错的发展前景", subDimension: "长期发展", value: "C" }
  ]},
  { id: 44, dimension: Dimension.SelfValues, text: "在职业选择中，你更重视：", options: [
    { label: "工作是有价值和重要的", subDimension: "内在偏好", value: "A" },
    { label: "创造性的工作理念", subDimension: "创新导向", value: "B" },
    { label: "良好的职业发展规划", subDimension: "长期发展", value: "C" }
  ]},
  { id: 45, dimension: Dimension.SelfValues, text: "在工作环境中，你更喜欢：", options: [
    { label: "融洽的工作氛围", subDimension: "人际和谐", value: "A" },
    { label: "富有挑战性的工作", subDimension: "创新导向", value: "B" },
    { label: "良好的发展空间", subDimension: "长期发展", value: "C" }
  ]},
  { id: 46, dimension: Dimension.SelfValues, text: "在职业选择中，你更在意：", options: [
    { label: "领导平易近人", subDimension: "人际和谐", value: "A" },
    { label: "不是墨守成规的工作", subDimension: "创新导向", value: "B" },
    { label: "良好的晋升机会", subDimension: "长期发展", value: "C" }
  ]}
];
