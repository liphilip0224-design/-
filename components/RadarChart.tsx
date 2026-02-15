
import React from 'react';
import { Radar, RadarChart as ReRadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from 'recharts';
import { Scores } from '../types';

interface Props {
  scores: Scores;
}

const RadarChart: React.FC<Props> = ({ scores }) => {
  // 聚合五大主维度得分 (取各子维度最大值或平均值作为强度参考)
  const data = [
    { subject: '职业管理', A: Math.max(scores['外在激励'] || 0, scores['内在激励'] || 0), full: 9 },
    { subject: '行为偏好', A: Math.max(scores['系统性认知'] || 0, scores['直觉型认知'] || 0), full: 5 },
    { subject: '学习取向', A: Math.max(scores['具体经验']||0, scores['主动尝试']||0, scores['抽象概念化']||0, scores['反思性观察']||0), full: 6 },
    { subject: '文化价值', A: Math.max(scores['舒适度安全性']||0, scores['能力与成长']||0, scores['地位与独立性']||0), full: 6 },
    { subject: '自我/新生代', A: Math.max(scores['功利导向']||0, scores['内在偏好']||0, scores['人际和谐']||0, scores['创新导向']||0, scores['长期发展']||0), full: 4 },
  ];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ReRadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 9]} tick={false} axisLine={false} />
          <Radar
            name="强度"
            dataKey="A"
            stroke="#4338ca"
            fill="#4338ca"
            fillOpacity={0.5}
          />
        </ReRadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChart;
