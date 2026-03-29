
import { Scores, Dimension, DetailedPortrait } from '../types';
import { QUESTIONS } from '../constants/questions';

export const calculateScores = (answers: Record<number, string>): Scores => {
  const scores: Scores = {};
  QUESTIONS.forEach(q => {
    const selectedValue = answers[q.id];
    if (selectedValue) {
      const option = q.options.find(opt => opt.value === selectedValue);
      if (option) {
        scores[option.subDimension] = (scores[option.subDimension] || 0) + 1;
      }
    }
  });
  return scores;
};

// 增强版一句话总画像生成逻辑
export const getDetailedPortrait = (scores: Scores): DetailedPortrait => {
  // 1. 基础画像 (基于前两个维度)
  const isInternal = (scores['内在激励'] || 0) > (scores['外在激励'] || 0);
  const isSystematic = (scores['系统性认知'] || 0) > (scores['直觉型认知'] || 0);
  
  let base = "";
  let baseSub = "";
  if (isInternal && isSystematic) {
    base = "严谨自驱专家";
    baseSub = "逻辑严密的专家";
  } else if (isInternal && !isSystematic) {
    base = "灵动内在开拓者";
    baseSub = "内在开拓者";
  } else if (!isInternal && isSystematic) {
    base = "稳健秩序达成者";
    baseSub = "秩序达成者";
  } else {
    base = "高效结果实干者";
    baseSub = "结果实干家";
  }

  // 2. 寻找后三个维度中得分最高的子维度作为形容词
  const otherSubDims = [
    '具体经验', '主动尝试', '抽象概念化', '反思性观察',
    '舒适度安全性', '能力与成长', '地位与独立性',
    '功利导向', '内在偏好', '人际和谐', '创新导向', '长期发展'
  ];

  let topSubDim = otherSubDims[0];
  let maxScore = -1;
  otherSubDims.forEach(dim => {
    const score = scores[dim] || 0;
    if (score > maxScore) {
      maxScore = score;
      topSubDim = dim;
    }
  });

  // 3. 映射形容词 (2字)
  const adjMap: Record<string, string> = {
    '具体经验': '实践',
    '主动尝试': '探索',
    '抽象概念化': '逻辑',
    '反思性观察': '睿见',
    '舒适度安全性': '保险',
    '能力与成长': '进取',
    '地位与独立性': '领航',
    '功利导向': '务实',
    '内在偏好': '理想',
    '人际和谐': '亲和',
    '创新导向': '突破',
    '长期发展': '远见'
  };

  const adjSubMap: Record<string, string> = {
    '具体经验': '实践导向且注重体悟',
    '主动尝试': '勇于探索且敢于试错',
    '抽象概念化': '逻辑严密且擅长建模',
    '反思性观察': '洞察敏锐且深思熟虑',
    '舒适度安全性': '追求保险且注重保障',
    '能力与成长': '追求成长且渴望挑战',
    '地位与独立性': '追求卓越且渴望独立',
    '功利导向': '务实高效且关注回报',
    '内在偏好': '理想驱动且追求意义',
    '人际和谐': '亲和友善且注重协作',
    '创新导向': '敢于突破且拒绝平庸',
    '长期发展': '远见卓识且布局未来'
  };

  const adj = adjMap[topSubDim] || "全能";
  const adjSub = adjSubMap[topSubDim] || "全能发展";
  
  // 4. 三个核心点逻辑
  const mainDrive = isInternal ? "由内在成就感驱动，更关注工作本身的意义与价值。" : "由外在反馈驱动，更关注明确的回报与社会认可。";
  const executionFramework = isSystematic ? "倾向于通过逻辑分析和系统规划来推进工作，追求秩序。" : "倾向于通过直觉感知和灵活调整来应对变化，追求敏捷。";
  
  const topCulture = getSortedSubDims(scores, ['舒适度安全性', '能力与成长', '地位与独立性'])[0];
  const cultureMap: Record<string, string> = {
    '舒适度安全性': "需要稳定、可预测且有安全保障的工作环境。",
    '能力与成长': "需要充满挑战、能持续提升专业能力的成长空间。",
    '地位与独立性': "需要能够体现个人价值、拥有自主权和影响力的平台。"
  };
  const growthConditions = cultureMap[topCulture] || "需要多元包容、支持个人发展的职业环境。";

  return {
    title: `${adj}·${base}`,
    subtitle: `${adjSub}的${baseSub}`,
    mainDrive,
    executionFramework,
    growthConditions
  };
};

// 获取维度内排序
export const getSortedSubDims = (scores: Scores, list: string[]) => {
  return [...list].sort((a, b) => (scores[b] || 0) - (scores[a] || 0));
};

// 坐标极值计算
export const getBias = (scores: Scores, left: string, right: string) => {
  const l = scores[left] || 0;
  const r = scores[right] || 0;
  if (l === r) return '平衡';
  return l > r ? left : right;
};
