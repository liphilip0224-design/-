
import React from 'react';
import { Scores } from '../types';
import { getDetailedPortrait, getSortedSubDims } from '../utils/analysis';

interface Props {
  scores: Scores;
  onRestart: () => void;
}

// 归一化计算函数
const normalizeScores = (scores: Scores, keys: string[]) => {
  const total = keys.reduce((acc, key) => acc + (scores[key] || 0), 0) || 1;
  return keys.map(key => ({
    name: key,
    value: scores[key] || 0,
    percentage: Math.round(((scores[key] || 0) / total) * 100)
  }));
};

const Report: React.FC<Props> = ({ scores, onRestart }) => {
  const portrait = getDetailedPortrait(scores);

  const BAR_COLORS = [
    'bg-brand-primary',
    'bg-brand-accent',
    'bg-brand-warm',
    'bg-brand-tan',
    'bg-brand-secondary',
    'bg-slate-400'
  ];

  const dims = {
    career: ['外在激励', '内在激励'],
    bias: ['系统性认知', '直觉型认知'],
    learning: ['具体经验', '主动尝试', '抽象概念化', '反思性观察'],
    culture: ['舒适度安全性', '能力与成长', '地位与独立性'],
    self: ['功利导向', '内在偏好', '人际和谐', '创新导向', '长期发展']
  };

  const learningTop = getSortedSubDims(scores, dims.learning);
  const selfTop = getSortedSubDims(scores, dims.self);
  const cultureTop = getSortedSubDims(scores, dims.culture);

  const normalizedData = {
    career: normalizeScores(scores, dims.career),
    bias: normalizeScores(scores, dims.bias),
    learning: normalizeScores(scores, dims.learning),
    culture: normalizeScores(scores, dims.culture),
    self: normalizeScores(scores, dims.self)
  };

  const workTypes = [
    { name: "核心功能型工作", desc: "专业技术岗位（工程、研究、设计、分析）、一线执行岗位、明确目标、明确交付的任务", path: "深耕专业领域，通过技术壁垒获得话语权。" },
    { name: "关联扩展型工作", desc: "项目管理（PM）、产品设计 / 服务设计、系统搭建、流程优化", path: "跨部门协作与系统整合，通过解决复杂问题获得成长。" },
    { name: "情感与社会型工作", desc: "团队管理 / 领导岗位、对外沟通、公共事务、教育、辅导、社群角色", path: "驱动他人与组织，通过社会影响力和领导力实现价值。" },
    { name: "消费支持型工作", desc: "运维、支持、后台管理、教育培训、长期陪伴、体系维护、持续改进", path: "长期主义的体系维护，通过持续优化和稳定性获得回报。" },
    { name: "购买决策型工作", desc: "负责人 / 决策者、投资、预算、资源配置、项目立项、采购决策", path: "资源配置与风险博弈，通过决策质量和结果负责获得地位。" }
  ];

  interface MiniChartProps {
    dimKey: keyof typeof normalizedData;
  }

  const MiniChart: React.FC<MiniChartProps> = ({ dimKey }) => {
    const label = dimKey === 'career' ? '职业管理' : 
                 dimKey === 'bias' ? '行为偏好' : 
                 dimKey === 'learning' ? '学习取向' : 
                 dimKey === 'culture' ? '文化价值' : '自我取向';
    const normList = normalizedData[dimKey];
    return (
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        </div>
        <div className="flex h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          {normList.map((item, idx) => (
            <div 
              key={item.name}
              className={`h-full transition-all duration-1000 ${BAR_COLORS[idx % BAR_COLORS.length]}`}
              style={{ width: `${item.percentage}%` }}
            ></div>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {normList.map((item, idx) => (
            <div key={item.name} className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${BAR_COLORS[idx % BAR_COLORS.length]}`}></div>
              <span className="text-[9px] text-slate-500">{item.name} {item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 获取排序后的工作结构
  const getRankedStructures = () => {
    const isInternal = (scores['内在激励'] || 0) > (scores['外在激励'] || 0);
    const isSystematic = (scores['系统性认知'] || 0) > (scores['直觉型认知'] || 0);
    const topLearning = learningTop[0];
    const topCulture = cultureTop[0];
    const topSelf = selfTop[0];

    const ranked = workTypes.map(type => {
      let score = 0;
      // 基础匹配逻辑
      if (type.name === "核心功能型工作") {
        if (isInternal) score += 2;
        if (isSystematic) score += 2;
        if (topCulture === '能力与成长') score += 3;
        if (topLearning === '抽象概念化') score += 1;
      } else if (type.name === "购买决策型工作") {
        if (isSystematic) score += 3;
        if (topLearning === '抽象概念化') score += 3;
        if (topCulture === '地位与独立性') score += 2;
      } else if (type.name === "关联扩展型工作") {
        if (!isSystematic) score += 3;
        if (topLearning === '主动尝试') score += 3;
        if (topSelf === '创新导向') score += 2;
      } else if (type.name === "情感与社会型工作") {
        if (topSelf === '人际和谐') score += 3;
        if (topCulture === '地位与独立性') score += 3;
        if (!isInternal) score += 1;
      } else if (type.name === "消费支持型工作") {
        if (topCulture === '舒适度安全性') score += 3;
        if (topSelf === '长期发展') score += 3;
        if (isSystematic) score += 1;
      }
      
      // 行为化描述生成
      const situations = [
        isInternal 
          ? "在复杂任务中，你更倾向于挖掘其背后的深层意义，而非仅仅追求表面的KPI达成，这种自驱力让你在无人监督时也能保持高产出。"
          : "你对外部反馈和阶段性成果非常敏感，擅长在明确的激励机制下快速推进工作，这种结果导向让你在竞争环境中极具爆发力。",
        isSystematic
          ? "面对不确定性，你习惯于先建立逻辑模型或详细计划，通过拆解风险来获得掌控感，这种严谨性确保了交付物的高质量。"
          : "你具备极强的直觉捕捉能力，擅长在动态变化中寻找机会，不拘泥于既定流程，这种灵活性让你在初创或高频变动的环境中如鱼得水。",
        topCulture === '能力与成长'
          ? "你将工作视为自我进化的阶梯，极度渴望智力挑战和专业深耕，平庸且重复的任务会让你迅速产生职业倦怠。"
          : topCulture === '舒适度安全性'
          ? "你追求职场的确定性与安全感，在规则明确、环境稳定的组织中，你能发挥出最持久的专业效能。"
          : "你具备强烈的独立意识和影响力诉求，渴望在组织中拥有决策权或管理空间，这种领航特质驱动你不断向上突破。"
      ];

      let explanation = "";
      let reason = "";
      if (type.name === "核心功能型工作") {
        explanation = "你的专业深耕能力与自驱特质高度契合此类结构。你能在明确的目标下，通过持续的智力投入建立起难以被替代的专业壁垒。";
        reason = "这类工作对专业深度和长期专注有极高要求，若你倾向于快速变动或广泛协作，可能会感到枯燥或受限。";
      } else if (type.name === "购买决策型工作") {
        explanation = "在资源配置与风险博弈中，你的理性分析与系统思维能确保决策的质量。你擅长在复杂数据中寻找逻辑支撑，从而在关键时刻做出最具确定性的判断。";
        reason = "高风险、高逻辑要求的决策环境需要极强的心理承受力，若你更看重情感连接或直觉感悟，可能会面临巨大压力。";
      } else if (type.name === "关联扩展型工作") {
        explanation = "在多变的项目环境与复杂的系统整合中，你的灵活性与试错精神能有效驱动创新。你擅长在模糊的边界中寻找连接点，通过快速迭代解决非标准化问题。";
        reason = "这类工作需要极高的灵活性与对模糊性的容忍度，若你追求绝对秩序或明确回报，在缺乏标准流程的环境中会感到无所适从。";
      } else if (type.name === "情感与社会型工作") {
        explanation = "在团队领导或对外沟通中，你的社会感知力与影响力能有效凝聚资源。你擅长通过情感共鸣或愿景驱动他人，是组织中不可或缺的粘合剂或领航者。";
        reason = "这类工作涉及大量的人际博弈与情感劳动，若你更倾向于独立工作或纯技术钻研，频繁的社交互动会让你感到精疲力竭。";
      } else if (type.name === "消费支持型工作") {
        explanation = "在体系维护与长期服务中，你的稳健与耐心能确保系统的持续优化。你擅长在日常的琐碎中发现改进空间，通过长期主义的坚持创造持久价值。";
        reason = "这类工作需要长期的耐心与对规则的严守，若你追求直觉反应与内在兴趣的快速变现，枯燥的重复性劳动会迅速消耗你的创造力。";
      }

      return { 
        ...type, 
        score, 
        situations, 
        explanation, 
        reason,
        relevantDims: (type.name === "核心功能型工作" || type.name === "购买决策型工作") ? ['career', 'bias', 'culture'] as const : ['bias', 'learning', 'self'] as const
      };
    }).sort((a, b) => b.score - a.score);

    return {
      first: ranked[0],
      second: ranked[1],
      least: ranked[4]
    };
  };

  const { first, second, least } = getRankedStructures();

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 bg-slate-50 min-h-screen">
      {/* 头部：一句话总画像 */}
      <header className="text-center mb-16">
        <div className="inline-block px-4 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-black rounded-full mb-4 tracking-widest uppercase">
          职业成长路径行动画像·工作人格
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">「{portrait.title}」</h1>
        <p className="text-brand-primary font-bold text-lg mb-6">{portrait.subtitle}</p>
      </header>

      {/* 三个核心点板块 */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-brand-primary font-black text-xs mb-2 uppercase tracking-widest">你的主导驱动</div>
          <p className="text-sm text-slate-700 leading-relaxed">{portrait.mainDrive}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-brand-primary font-black text-xs mb-2 uppercase tracking-widest">你的执行框架</div>
          <p className="text-sm text-slate-700 leading-relaxed">{portrait.executionFramework}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-brand-primary font-black text-xs mb-2 uppercase tracking-widest">你的成长条件</div>
          <p className="text-sm text-slate-700 leading-relaxed">{portrait.growthConditions}</p>
        </div>
      </section>

      {/* 行动全景图 */}
      <section className="bg-white rounded-3xl p-8 mb-12 shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-8 flex items-center gap-2 text-brand-primary">
            <i className="fa-solid fa-compass"></i> 行动全景图
          </h2>
          <div className="space-y-6">
            {Object.entries(dims).map(([key, list]) => {
              const label = key === 'career' ? '职业管理' : 
                           key === 'bias' ? '行为偏好' : 
                           key === 'learning' ? '学习取向' : 
                           key === 'culture' ? '文化价值' : '自我取向';
              const normList = normalizedData[key as keyof typeof normalizedData];
              return (
                <div key={key} className="space-y-3">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">
                    {label} (分布占比)
                  </div>
                  <div className="flex h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    {normList.map((item, idx) => (
                      <div 
                        key={item.name}
                        className={`h-full transition-all duration-1000 ${BAR_COLORS[idx % BAR_COLORS.length]}`}
                        style={{ width: `${item.percentage}%` }}
                        title={`${item.name}: ${item.percentage}%`}
                      ></div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {normList.map((item, idx) => (
                      <div key={item.name} className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${BAR_COLORS[idx % BAR_COLORS.length]}`}></div>
                        <span className="text-[10px] text-slate-500">{item.name}</span>
                        <span className="text-[10px] font-bold text-slate-900">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 适合及不适合你的工作结构 */}
      <section className="space-y-8 mb-16">
        <h2 className="text-2xl font-black text-slate-900 mb-8 px-2">最适合及最不适合你的工作结构</h2>
        
        {/* 适合的工作结构 (第一 & 第二) */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-brand-primary rounded-full"></div>
              <h3 className="text-lg font-bold text-slate-900">最适合的工作结构分析</h3>
            </div>
            <span className="px-3 py-1 bg-brand-primary text-white text-[10px] font-black rounded-full uppercase tracking-widest">高度匹配</span>
          </div>

          <div className="space-y-10">
            {/* 第一适合 (70%) */}
            <div className="relative pl-6 border-l-2 border-brand-primary/20">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand-primary border-4 border-white shadow-sm"></div>
              <div className="mb-4">
                <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest block mb-1">第一匹配结构 (核心推荐)</span>
                <h4 className="text-xl font-black text-slate-900">{first.name}</h4>
              </div>
              <div className="p-6 bg-brand-primary/5 rounded-2xl border border-brand-primary/10 mb-6">
                <p className="text-sm text-slate-600 mb-4 leading-relaxed font-medium">{first.desc}</p>
                <p className="text-sm text-slate-700 leading-relaxed mb-4 italic">“{first.explanation}”</p>
                <div className="text-xs text-slate-700 bg-white/50 p-3 rounded-xl">
                  <span className="font-bold text-brand-primary">路径建议：</span>{first.path}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">核心维度表现：</div>
                  {first.relevantDims.map(d => <MiniChart key={d} dimKey={d} />)}
                </div>
                <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                  <span className="font-bold text-brand-primary block mb-4 text-xs uppercase tracking-widest">深度行为分析：</span>
                  <ul className="list-disc list-inside space-y-3 text-slate-600 text-sm leading-relaxed">
                    {first.situations.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            {/* 第二适合 (30%) */}
            <div className="relative pl-6 border-l-2 border-slate-200 opacity-80">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-300 border-4 border-white shadow-sm"></div>
              <div className="mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">第二匹配结构 (关联扩展)</span>
                <h4 className="text-lg font-bold text-slate-700">{second.name}</h4>
              </div>
              <div className="text-sm text-slate-600 leading-relaxed">
                <p className="mb-2">{second.desc}</p>
                <p className="text-xs text-slate-500 italic">匹配逻辑：{second.explanation.split('。')[0]}。</p>
              </div>
            </div>
          </div>
        </div>

        {/* 最不适合 */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-brand-accent rounded-full"></div>
              <h3 className="text-lg font-bold text-slate-900">最不适合的工作结构：{least.name}</h3>
            </div>
            <span className="px-3 py-1 bg-brand-accent text-white text-[10px] font-black rounded-full uppercase tracking-widest">风险预警</span>
          </div>

          <div className="p-6 bg-brand-accent/5 rounded-2xl border border-brand-accent/10 mb-6">
            <p className="text-sm text-slate-600 mb-3 leading-relaxed">{least.desc}</p>
            <div className="text-xs text-slate-700">
              <span className="font-bold text-brand-accent">错配影响：</span>{least.reason}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="text-xs font-bold text-brand-accent mb-2">关键风险维度图表：</div>
              {least.relevantDims.map(d => <MiniChart key={d} dimKey={d} />)}
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <span className="font-bold text-brand-accent block mb-4 text-sm">潜在冲突点：</span>
              <ul className="list-disc list-inside space-y-3 text-slate-700 text-sm leading-relaxed">
                {least.situations.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 整合建议 */}
      <section className="mt-20 border-t-2 border-slate-200 pt-16">
        <h2 className="text-3xl font-black text-slate-900 mb-10 text-center uppercase tracking-widest">整合建议：路径匹配指南</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* 90天行动计划 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
             <h3 className="text-lg font-black text-brand-primary mb-6 flex items-center gap-2">
               <i className="fa-solid fa-calendar-check"></i> 90天行动计划（接下来做什么）：
             </h3>
             <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold shrink-0">1</div>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    <span className="block text-brand-primary font-bold mb-1">环境对齐</span>
                    评估当前工作是否属于「{first.name}」，若不是，尝试在现有岗位中争取更多相关任务。
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold shrink-0">2</div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    <span className="block text-brand-primary font-bold mb-1">能力深耕</span>
                    基于你的「{learningTop[0]}」学习取向，制定一个专项提升计划，通过{learningTop[0].includes('经验') ? '实战项目' : learningTop[0].includes('尝试') ? '小步快跑的实验' : '系统化学习'}来强化核心竞争力。
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold shrink-0">3</div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    <span className="block text-brand-primary font-bold mb-1">反馈优化</span>
                    建立一个基于「{selfTop[0]}」的反馈机制，每周复盘一次，确保你的行动没有偏离长期价值。
                  </p>
                </div>
             </div>
          </div>

          {/* 结构性行动风险 */}
          <div className="bg-brand-accent/5 rounded-3xl p-8 border border-brand-accent/20">
             <h3 className="text-lg font-black text-brand-accent mb-6 flex items-center gap-2">
               <i className="fa-solid fa-shield-halved"></i> 结构性行动风险（警惕什么）：
             </h3>
             <ul className="space-y-6">
               <li className="flex gap-4">
                 <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold shrink-0">1</div>
                 <p className="text-sm text-slate-700 leading-relaxed">
                   <span className="block text-brand-accent font-bold mb-1">错配损耗</span>
                   警惕在「{least.name}」这种结构中长期停留，这会极大消耗你的心理能量，导致专业产出下降。
                 </p>
               </li>
               <li className="flex gap-4">
                 <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold shrink-0">2</div>
                 <p className="text-sm text-slate-700 leading-relaxed">
                   <span className="block text-brand-accent font-bold mb-1">动力缺失</span>
                   在缺乏「{cultureTop[0]}」支持的环境中，要警惕自己逐渐失去动力，避免陷入“习得性无助”。
                 </p>
               </li>
               <li className="flex gap-4">
                 <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold shrink-0">3</div>
                 <p className="text-sm text-slate-700 leading-relaxed">
                   <span className="block text-brand-accent font-bold mb-1">盲目跟风</span>
                   不要被外界的“热门岗位”诱惑，如果它不符合你的「{portrait.title}」人格，即便收入再高，也难以持久。
                 </p>
               </li>
             </ul>
          </div>
        </div>

        {/* 引用来源 */}
        <div className="mt-12 p-8 bg-slate-100 rounded-3xl text-[10px] text-slate-400 leading-relaxed space-y-2">
          <p className="font-bold text-slate-500 mb-2 uppercase tracking-widest">学术引用来源</p>
          <p>职业目标：Seibert S. E., Kraimer L., Holtom B. C. & Pierotti A. J. (2013). Even the best laidplans sometimes go askew：Career self-management processes, career shocks, and the decision to pursue graduate education. Journal of Applied Psychology, 98(1),169-182.</p>
          <p>行为偏好与策略导向：Sagiv L., Arieli S., Goldenberg J. & Goldschmidt A. (2010). Structure and freedom in creativity：The interplay between externally imposed structure and personal cognitive style. Journal of Organizational Behavior, 31(8), 1086-1110.</p>
          <p>学习与知识导向：Baum J. R., Bird B. J. & Singh S. (2011). The practical intelligence of entrepreneurs：Antecedents and a link with new venture growth. Personnel Psychology, 64(2), 397-425.</p>
          <p>文化氛围与价值观：Meyer J. P., Irving P. G. & Allen N. J. (1998). Examination of the combined effects</p>
          <p>自我：侯烜方，李燕萍，涂乙冬，新生代工作价值观结构、测量及对绩效影响，心理学报，2014，46(6):823-840. | England, G. W, Personal values systems of American managers, Academy of Management Journal, 1967(10):107-117. | Meglino, B, M,, Ravlin, E.C,, Adkins, C,L. A work values approach to corporate culture: a fieldtest of the value congruence process and its relationship to individual outcomes. Journal of Applied Psychology，1989，74(3):424-432.</p>
        </div>

        {/* 底部寄语 */}
        <div className="mt-8 bg-slate-900 text-slate-400 p-8 rounded-3xl text-center text-xs">
          <div className="flex justify-center gap-8 border-t border-white/5 pt-6">
            <span>方载 (Fangzai) 团队 · 官方分析</span>
            <span>职业成长路径行动模型V1.0</span>
          </div>
        </div>
      </section>

      <div className="mt-16 text-center">
        <button 
          onClick={onRestart}
          className="px-12 py-4 bg-brand-primary text-white font-black rounded-2xl hover:bg-brand-secondary transition-all hover:scale-105 shadow-xl shadow-brand-primary/20"
        >
          重新测评
        </button>
      </div>
    </div>
  );
};

export default Report;
