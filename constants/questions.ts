import { Question, Dimension } from '../types';

export const QUESTIONS: Question[] = [
  // 1. 职业管理动机 (5题)
  { id: 1, dimension: Dimension.CareerManagement, text: "在以下两种情况中，你更倾向选择：", options: [
    { label: "A. 一个薪资更高、福利更好，但工作内容相对普通的岗位", subDimension: "外在激励", value: "A" },
    { label: "B. 一个薪资一般，但工作内容更有意义、让你更有成就感的岗位", subDimension: "内在激励", value: "B" }
  ]},
  { id: 2, dimension: Dimension.CareerManagement, text: "在以下两种情况中，你更倾向选择：", options: [
    { label: "A. 按照自己的节奏成长，不太在意他人的评价", subDimension: "内在激励", value: "A" },
    { label: "B. 被领导和同事认可，成为大家眼中的优秀员工", subDimension: "外在激励", value: "B" }
  ]},
  { id: 3, dimension: Dimension.CareerManagement, text: "在以下两种情况中，你更倾向选择：", options: [
    { label: "A. 专注一个方向持续深耕，形成自己的核心优势", subDimension: "内在激励", value: "A" },
    { label: "B. 尝试不同类型的工作或项目，积累多样经验", subDimension: "外在激励", value: "B" }
  ]},
  { id: 4, dimension: Dimension.CareerManagement, text: "在以下两种情况中，你更倾向选择：", options: [
    { label: "A. 一家知名度高、职位体面、对外有面子的公司", subDimension: "外在激励", value: "A" },
    { label: "B. 一份更适合自己、工作氛围和节奏更舒服的岗位", subDimension: "内在激励", value: "B" }
  ]},
  { id: 5, dimension: Dimension.CareerManagement, text: "在以下两种情况中，你更倾向选择：", options: [
    { label: "A. 能带来更高收入或个人回报的项目", subDimension: "外在激励", value: "A" },
    { label: "B. 能对他人或社会产生积极影响的项目", subDimension: "内在激励", value: "B" }
  ]},

  // 2. 行为偏好与策略导向 (5题)
  { id: 6, dimension: Dimension.BehavioralBias, text: "遇到需要判断和选择的时候，你通常会", options: [
    { label: "A. 仔细规划你的行动方案", subDimension: "系统性认知", value: "A" },
    { label: "B. 追随你的直觉", subDimension: "直觉型认知", value: "B" }
  ]},
  { id: 7, dimension: Dimension.BehavioralBias, text: "遇到需要判断和选择的时候，你通常会", options: [
    { label: "A. 收集好所有所需信息", subDimension: "系统性认知", value: "A" },
    { label: "B. 如果感觉某个方式是对的，就认为那个做事方式适合你", subDimension: "直觉型认知", value: "B" }
  ]},
  { id: 8, dimension: Dimension.BehavioralBias, text: "遇到需要判断和选择的时候，你通常会", options: [
    { label: "A. 尽量严格按照你的工作计划行事", subDimension: "系统性认知", value: "A" },
    { label: "B. 通常在没有明确想法的时候先开始做起来", subDimension: "直觉型认知", value: "B" }
  ]},
  { id: 9, dimension: Dimension.BehavioralBias, text: "遇到需要判断和选择的时候，你通常会", options: [
    { label: "A. 通过系统的、有序的方式做出决定", subDimension: "系统性认知", value: "A" },
    { label: "B. 遵循内心的感觉和情感", subDimension: "直觉型认知", value: "B" }
  ]},
  { id: 10, dimension: Dimension.BehavioralBias, text: "遇到需要判断和选择的时候，你通常会", options: [
    { label: "A. 分析每个方案，然后选择最好的那个", subDimension: "系统性认知", value: "A" },
    { label: "B. 经常在做了一个好的决策后还不知道自己是怎么做到的", subDimension: "直觉型认知", value: "B" }
  ]},

  // 3. 学习与知识导向 (6题)
  { id: 11, dimension: Dimension.LearningOrientation, text: "面对自己还不熟悉的内容时，你通常会", options: [
    { label: "A. 通过实际操作或尝试来理解", subDimension: "具体经验", value: "A" },
    { label: "B. 先通过思考和理解逻辑来掌握", subDimension: "抽象概念化", value: "B" }
  ]},
  { id: 12, dimension: Dimension.LearningOrientation, text: "面对自己还不熟悉的内容时，你通常会", options: [
    { label: "A. 先动手试一试，从实践中摸索", subDimension: "主动尝试", value: "A" },
    { label: "B. 先理清原理和框架，再开始行动", subDimension: "反思性观察", value: "B" }
  ]},
  { id: 13, dimension: Dimension.LearningOrientation, text: "面对自己还不熟悉的内容时，你通常会", options: [
    { label: "A. 是通过亲身经历和尝试学会的", subDimension: "具体经验", value: "A" },
    { label: "B. 是通过分析和总结理解的", subDimension: "反思性观察", value: "B" }
  ]},
  { id: 14, dimension: Dimension.LearningOrientation, text: "面对自己还不熟悉的内容时，你通常会", options: [
    { label: "A. 多尝试几种方法，找到可行路径", subDimension: "主动尝试", value: "A" },
    { label: "B. 分析问题结构，找到最优解法", subDimension: "抽象概念化", value: "B" }
  ]},
  { id: 15, dimension: Dimension.LearningOrientation, text: "面对自己还不熟悉的内容时，你通常会", options: [
    { label: "A. 直接参与或模仿去做", subDimension: "具体经验", value: "A" },
    { label: "B. 先观察和理解他人的做法", subDimension: "反思性观察", value: "B" }
  ]},
  { id: 16, dimension: Dimension.LearningOrientation, text: "面对自己还不熟悉的内容时，你通常会", options: [
    { label: "A. 通过不断尝试和调整来进步", subDimension: "主动尝试", value: "A" },
    { label: "B. 通过观察、总结和反思来进步", subDimension: "抽象概念化", value: "B" }
  ]},

  // 4. 文化氛围与价值观 (10题)
  { id: 17, dimension: Dimension.CulturalValues, text: "在以下三种工作特征中，你更看重", options: [
    { label: "A. 常态的工作时间和地点", subDimension: "舒适度安全性", value: "A" },
    { label: "B. 需要与很多其他人见面和交谈", subDimension: "能力与成长", value: "B" },
    { label: "C. 允许拥有更高管理职责", subDimension: "地位与独立性", value: "C" }
  ]},
  { id: 18, dimension: Dimension.CulturalValues, text: "在以下三种工作特征中，你更看重", options: [
    { label: "A. 提供工作保障", subDimension: "舒适度安全性", value: "A" },
    { label: "B. 激发智力", subDimension: "能力与成长", value: "B" },
    { label: "C. 提供赚取高收入的机会", subDimension: "地位与独立性", value: "C" }
  ]},
  { id: 19, dimension: Dimension.CulturalValues, text: "在以下三种工作特征中，你更看重", options: [
    { label: "A. 有可遵循的明确规则和程序", subDimension: "舒适度安全性", value: "A" },
    { label: "B. 需要有原创性和创造性", subDimension: "能力与成长", value: "B" },
    { label: "C. 需要监督管理别人", subDimension: "地位与独立性", value: "C" }
  ]},
  { id: 20, dimension: Dimension.CulturalValues, text: "在以下三种工作特征中，你更看重", options: [
    { label: "A. 工作后有充足的业余时间", subDimension: "舒适度安全性", value: "A" },
    { label: "B. 通过你的工作做出社会贡献", subDimension: "能力与成长", value: "B" },
    { label: "C. 允许独立工作", subDimension: "地位与独立性", value: "C" }
  ]},
  { id: 21, dimension: Dimension.CulturalValues, text: "在以下三种工作特征中，你更看重", options: [
    { label: "A. 提供舒适的工作环境", subDimension: "舒适度安全性", value: "A" },
    { label: "B. 满足你的文化和审美情趣", subDimension: "能力与成长", value: "B" },
    { label: "C. 受人尊重", subDimension: "地位与独立性", value: "C" }
  ]},
  { id: 22, dimension: Dimension.CulturalValues, text: "在以下三种工作特征中，你更看重", options: [
    { label: "A. 工作中能获得他人的认可", subDimension: "舒适度安全性", value: "A" },
    { label: "B. 能够不断学习新知识", subDimension: "能力与成长", value: "B" },
    { label: "C. 拥有决策权", subDimension: "地位与独立性", value: "C" }
  ]},
  { id: 23, dimension: Dimension.CulturalValues, text: "在以下三种工作特征中，你更看重", options: [
    { label: "A. 团队氛围和谐", subDimension: "舒适度安全性", value: "A" },
    { label: "B. 能够解决复杂问题", subDimension: "能力与成长", value: "B" },
    { label: "C. 职位晋升空间大", subDimension: "地位与独立性", value: "C" }
  ]},
  { id: 24, dimension: Dimension.CulturalValues, text: "在以下三种工作特征中，你更看重", options: [
    { label: "A. 工作节奏稳定", subDimension: "舒适度安全性", value: "A" },
    { label: "B. 能够发挥个人特长", subDimension: "能力与成长", value: "B" },
    { label: "C. 具有行业影响力", subDimension: "地位与独立性", value: "C" }
  ]},
  { id: 25, dimension: Dimension.CulturalValues, text: "在以下三种工作特征中，你更看重", options: [
    { label: "A. 办公地点便利", subDimension: "舒适度安全性", value: "A" },
    { label: "B. 能够接触前沿技术", subDimension: "能力与成长", value: "B" },
    { label: "C. 获得社会地位", subDimension: "地位与独立性", value: "C" }
  ]},
  { id: 26, dimension: Dimension.CulturalValues, text: "在以下三种工作特征中，你更看重", options: [
    { label: "A. 福利待遇完善", subDimension: "舒适度安全性", value: "A" },
    { label: "B. 能够实现自我价值", subDimension: "能力与成长", value: "B" },
    { label: "C. 拥有个人办公室", subDimension: "地位与独立性", value: "C" }
  ]},

  // 5. 自我取向 (10题)
  { id: 27, dimension: Dimension.SelfValues, text: "在以下几种情况中，你更看重", options: [
    { label: "A. 薪资更高、福利更好的岗位", subDimension: "功利导向", value: "A" },
    { label: "B. 做的事情更符合自己兴趣的岗位", subDimension: "内在偏好", value: "B" },
    { label: "C. 团队氛围很好、相处轻松的岗位", subDimension: "人际和谐", value: "C" }
  ]},
  { id: 28, dimension: Dimension.SelfValues, text: "在以下几种情况中，你更看重", options: [
    { label: "A. 薪酬是否持续提升", subDimension: "功利导向", value: "A" },
    { label: "B. 工作是否真正有意义、有价值", subDimension: "内在偏好", value: "B" },
    { label: "C. 同事之间是否互相尊重", subDimension: "人际和谐", value: "C" }
  ]},
  { id: 29, dimension: Dimension.SelfValues, text: "在以下几种情况中，你更看重", options: [
    { label: "A. 付出和回报是否成正比", subDimension: "功利导向", value: "A" },
    { label: "B. 是否具有挑战性、能突破自己", subDimension: "创新导向", value: "B" },
    { label: "C. 是否有清晰的发展路径", subDimension: "长期发展", value: "C" }
  ]},
  { id: 30, dimension: Dimension.SelfValues, text: "在以下几种情况中，你更看重", options: [
    { label: "A. 收入会持续增长的岗位", subDimension: "功利导向", value: "A" },
    { label: "B. 能不断尝试新方法、做创新事情的岗位", subDimension: "创新导向", value: "B" },
    { label: "C. 有明确晋升和成长空间的岗位", subDimension: "长期发展", value: "C" }
  ]},
  { id: 31, dimension: Dimension.SelfValues, text: "在以下几种情况中，你更看重", options: [
    { label: "A. 工作内容是否符合自己的兴趣", subDimension: "内在偏好", value: "A" },
    { label: "B. 领导是否好相处、沟通顺畅", subDimension: "人际和谐", value: "B" },
    { label: "C. 工作是否具有创造性", subDimension: "创新导向", value: "C" }
  ]},
  { id: 32, dimension: Dimension.SelfValues, text: "在以下几种情况中，你更看重", options: [
    { label: "A. 工作是否有趣、能保持投入", subDimension: "内在偏好", value: "A" },
    { label: "B. 团队关系是否平等、相处舒服", subDimension: "人际和谐", value: "B" },
    { label: "C. 工作是否具有挑战性", subDimension: "创新导向", value: "C" }
  ]},
  { id: 33, dimension: Dimension.SelfValues, text: "在以下几种情况中，你更看重", options: [
    { label: "A. 工作本身有趣、不会枯燥", subDimension: "内在偏好", value: "A" },
    { label: "B. 能不断尝试新方式、避免重复", subDimension: "创新导向", value: "B" },
    { label: "C. 有较好的未来发展前景", subDimension: "长期发展", value: "C" }
  ]},
  { id: 34, dimension: Dimension.SelfValues, text: "在以下几种情况中，你更看重", options: [
    { label: "A. 这份工作是否真正有意义", subDimension: "内在偏好", value: "A" },
    { label: "B. 是否鼓励新的想法和尝试", subDimension: "创新导向", value: "B" },
    { label: "C. 是否有清晰成长路径", subDimension: "长期发展", value: "C" }
  ]},
  { id: 35, dimension: Dimension.SelfValues, text: "在以下几种情况中，你更看重", options: [
    { label: "A. 团队氛围轻松、关系融洽", subDimension: "人际和谐", value: "A" },
    { label: "B. 工作内容有挑战、能不断突破", subDimension: "创新导向", value: "B" },
    { label: "C. 有稳定的发展空间", subDimension: "长期发展", value: "C" }
  ]},
  { id: 36, dimension: Dimension.SelfValues, text: "在以下几种情况中，你更看重", options: [
    { label: "A. 领导是否平易近人、好沟通", subDimension: "人际和谐", value: "A" },
    { label: "B. 工作是否不拘一格、鼓励创新", subDimension: "创新导向", value: "B" },
    { label: "C. 是否有明确晋升机会", subDimension: "长期发展", value: "C" }
  ]}
];
