
import React from 'react';
import { Radar, RadarChart as ReRadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from 'recharts';
import { Scores } from '../types';

interface Props {
  scores: Scores;
}

const RadarChart: React.FC<Props> = ({ scores }) => {
  // 展示全部16个子维度
  const subDimensions = [
    { name: '外在激励', full: 9 }, { name: '内在激励', full: 9 },
    { name: '系统性认知', full: 5 }, { name: '直觉型认知', full: 5 },
    { name: '具体经验', full: 6 }, { name: '主动尝试', full: 6 },
    { name: '抽象概念化', full: 6 }, { name: '反思性观察', full: 6 },
    { name: '舒适度安全性', full: 10 }, { name: '能力与成长', full: 10 },
    { name: '地位与独立性', full: 10 }, { name: '功利导向', full: 4 },
    { name: '内在偏好', full: 6 }, { name: '人际和谐', full: 6 },
    { name: '创新导向', full: 8 }, { name: '长期发展', full: 6 }
  ];

  const data = subDimensions.map(sub => ({
    subject: sub.name,
    A: scores[sub.name] || 0,
    full: sub.full
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ReRadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9 }} />
          <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
          <Radar
            name="强度"
            dataKey="A"
            stroke="#357B79"
            fill="#357B79"
            fillOpacity={0.5}
          />
        </ReRadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChart;
