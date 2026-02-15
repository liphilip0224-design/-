
import { Scores, Dimension } from '../types';
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

// 一句话总画像生成逻辑
export const getOneSentencePortrait = (scores: Scores): string => {
  const isInternal = (scores['内在激励'] || 0) > (scores['外在激励'] || 0);
  const isSystematic = (scores['系统性认知'] || 0) > (scores['直觉型认知'] || 0);
  
  if (isInternal && isSystematic) return "严谨深耕的自驱型专家";
  if (isInternal && !isSystematic) return "灵动敏锐的内在开拓者";
  if (!isInternal && isSystematic) return "稳健务实的秩序达成者";
  return "高效灵活的结果实干家";
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
