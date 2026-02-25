
import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer 
} from 'recharts';
import { Scores } from '../types';
import { INTEGRATIONS } from '../constants/reportData';
import { getOneSentencePortrait, getSortedSubDims, getBias } from '../utils/analysis';

interface Props {
  scores: Scores;
  onRestart: () => void;
}

// 子维度最高分精确映射表
const MAX_SCORES: Record<string, number> = {
  '外在激励': 9, '内在激励': 9,
  '系统性认知': 5, '直觉型认知': 5,
  '具体经验': 6, '主动尝试': 6, '抽象概念化': 6, '反思性观察': 6,
  '舒适度安全性': 10, '能力与成长': 10, '地位与独立性': 10,
  '功利导向': 4, '内在偏好': 6, '人际和谐': 6, '创新导向': 8, '长期发展': 6
};

// 归一化计算函数：使一组维度的百分比之和为100%
const normalizeScores = (scores: Scores, keys: string[]) => {
  const total = keys.reduce((acc, key) => acc + (scores[key] || 0), 0) || 1;
  return keys.map(key => ({
    name: key,
    value: scores[key] || 0,
    percentage: Math.round(((scores[key] || 0) / total) * 100)
  }));
};

// 雷达图组件
const RadarChartComponent: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="h-64 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
        <Radar
          name="分布"
          dataKey="percentage"
          stroke="#357B79"
          fill="#357B79"
          fillOpacity={0.4}
        />
      </RadarChart>
    </ResponsiveContainer>
  </div>
);

// 维度解读卡片
const DimensionCard: React.FC<{ 
  title: string; 
  subtitle: string; 
  summary: string;
  leftTitle: string;
  leftContent: React.ReactNode;
  rightTitle: string;
  rightContent: React.ReactNode;
  hint?: string; 
  isVertical?: boolean;
}> = ({ title, subtitle, summary, leftTitle, leftContent, rightTitle, rightContent, hint, isVertical }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8 transition-all hover:shadow-md">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-1.5 h-6 bg-brand-primary rounded-full"></div>
      <div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-brand-primary font-medium">{subtitle}</p>
      </div>
    </div>
    
    {/* 黄色摘要框 */}
    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6 flex items-start gap-3">
      <i className="fa-solid fa-circle-info text-brand-accent mt-0.5"></i>
      <p className="text-sm text-amber-900 font-medium leading-relaxed">{summary}</p>
    </div>

    {/* 对比栏/上下栏 */}
    <div className={`grid grid-cols-1 ${isVertical ? '' : 'md:grid-cols-2'} gap-4 mb-6`}>
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{leftTitle}</span>
        </div>
        <div className="text-sm text-slate-700">{leftContent}</div>
      </div>
      <div className="p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-primary"></div>
          <span className="text-xs font-black text-brand-primary uppercase tracking-widest">{rightTitle}</span>
        </div>
        <div className="text-sm text-slate-700">{rightContent}</div>
      </div>
    </div>

    {hint && (
      <div className="mt-6 p-4 bg-brand-secondary/5 border-l-4 border-brand-secondary rounded-r-xl">
        <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest block mb-1">结构条件提示</span>
        <div className="text-sm text-slate-700 leading-relaxed">{hint}</div>
      </div>
    )}
  </div>
);

const Report: React.FC<Props> = ({ scores, onRestart }) => {
  const portrait = getOneSentencePortrait(scores);

  const BAR_COLORS = [
    'bg-brand-primary',
    'bg-brand-accent',
    'bg-brand-warm',
    'bg-brand-tan',
    'bg-brand-secondary',
    'bg-slate-400'
  ];

  // 各维度分组
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

  // 归一化后的数据
  const normalizedData = {
    career: normalizeScores(scores, dims.career),
    bias: normalizeScores(scores, dims.bias),
    learning: normalizeScores(scores, dims.learning),
    culture: normalizeScores(scores, dims.culture),
    self: normalizeScores(scores, dims.self)
  };

  // 结构提示逻辑
  const getStructureHint = (dimension: string) => {
    switch (dimension) {
      case 'career':
        return (scores['内在激励'] || 0) > (scores['外在激励'] || 0) 
          ? <p><strong>核心功能型工作</strong>：您的偏好会被放大，因为您更关注事情本身的价值；但在<strong>购买决策型工作</strong>中，您可能因过度关注理想而忽略成本风险。</p>
          : <p><strong>购买决策型工作</strong>：您的偏好会被放大，因为您对回报和风险敏感；但在<strong>核心功能型工作</strong>中，若缺乏即时反馈，您的动力可能会受限。</p>;
      case 'bias':
        return (scores['系统性认知'] || 0) > (scores['直觉型认知'] || 0)
          ? <p><strong>核心功能型工作</strong>或<strong>购买决策型工作</strong>：您的优势会被放大，因为您擅长严谨规划；但在<strong>关联扩展型工作</strong>这种需要高度协同的结构中，风险会提高。</p>
          : <p><strong>关联扩展型工作</strong>或<strong>情感与社会型工作</strong>：您的优势会被放大，因为您反应敏锐且灵活；但在<strong>购买决策型工作</strong>这种需要严密逻辑的结构中，风险会提高。</p>;
      case 'learning':
        const topL = learningTop[0];
        if (topL === '具体经验') return <p><strong>核心功能型工作</strong>：您的实干能力是核心优势，能通过实际产出快速建立壁垒。</p>;
        if (topL === '主动尝试') return <p><strong>关联扩展型工作</strong>：您的探索精神能带动系统创新，适配多变的项目环境。</p>;
        if (topL === '抽象概念化') return <p><strong>购买决策型工作</strong>：您的逻辑分析能有效控制风险，在复杂决策中保持清醒。</p>;
        return <p><strong>消费支持型工作</strong>：您的细致观察能提升服务质量，在长期运维中发现优化点。</p>;
      case 'culture':
        const topC = cultureTop[0];
        if (topC === '舒适度安全性') return <p><strong>消费支持型工作</strong>：您的稳健是长期运维的保障；但在高竞争结构中，您的偏好会被抑制。</p>;
        if (topC === '能力与成长') return <p><strong>核心功能型工作</strong>：您的成长诉求与专业深耕高度适配，能获得极高的职业成就感。</p>;
        return <p><strong>情感与社会型工作</strong>：您的领导力潜质能获得更好的发挥空间，通过影响力驱动团队。</p>;
      case 'self':
        const topS = selfTop[0];
        if (topS === '创新导向') return <p><strong>关联扩展型工作</strong>：您的突破性思维是适配的利器，能解决非标准化的复杂问题。</p>;
        if (topS === '人际和谐') return <p><strong>情感与社会型工作</strong>：您的亲和力能极大提高团队凝聚力，是组织润滑剂。</p>;
        if (topS === '功利导向') return <p><strong>购买决策型工作</strong>：您的务实能确保投入产出比，在资源配置中表现卓越。</p>;
        return <p><strong>消费支持型工作</strong>：您的远见有助于建立持久的体系，在长期主义中获得回报。</p>;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 bg-slate-50 min-h-screen">
      {/* 头部：一句话总画像 */}
      <header className="text-center mb-16">
        <div className="inline-block px-4 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-black rounded-full mb-4 tracking-widest uppercase">
          职业成长路径行动画像
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">「{portrait}」</h1>
        <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed font-medium">
          此亦为您倾向的工作人格，用于判断适合的结构与风险
        </p>
      </header>

      {/* 二、全景总览 - 行动全景图 */}
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

      {/* 新增：工作类型定义框 */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 mb-12 shadow-2xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-brand-secondary mb-1">
            <i className="fa-solid fa-layer-group"></i> 职场行动结构定义
          </h2>
          <p className="text-[10px] text-slate-400 opacity-80">
            本测评基于 Jobs-to-be-Done（JTBD）理论，根据真实工作场景，划分为五类核心工作类型，用于匹配不同的角色分工和决策。
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[
            { name: "核心功能型工作", desc: "专业技术岗位（工程、研究、设计、分析）、一线执行岗位、明确目标、明确交付的任务" },
            { name: "关联扩展型工作", desc: "项目管理（PM）、产品设计 / 服务设计、系统搭建、流程优化" },
            { name: "情感与社会型工作", desc: "团队管理 / 领导岗位、对外沟通、公共事务、教育、辅导、社群角色" },
            { name: "消费支持型工作", desc: "运维、支持、后台管理、教育培训、长期陪伴、体系维护、持续改进" },
            { name: "购买决策型工作", desc: "负责人 / 决策者、投资、预算、资源配置、项目立项、采购决策" }
          ].map((type, idx) => (
            <div key={idx} className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="w-1.5 h-full bg-brand-secondary rounded-full shrink-0"></div>
              <div>
                <div className="text-sm font-bold text-brand-secondary mb-1">{type.name}</div>
                <div className="text-xs text-slate-400 leading-relaxed">{type.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 三、维度深度解释 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 mb-8 px-2">维度解读：倾向与适配</h2>

        {/* 维度一 */}
        <DimensionCard 
          title="职业管理动机" 
          subtitle="动力来源：外部回报 ↔ 内在满足"
          summary={`在工作环境中，你更容易被【${getBias(scores, '外在激励', '内在激励') === '内在激励' ? '成长感 / 兴趣' : '高回报 / 认可'}】驱动，这会直接影响你对工作的选择和坚持程度。`}
          leftTitle="行为倾向分布"
          leftContent={
            <div className="space-y-4">
              {normalizedData.career.map(item => (
                <div key={item.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold">{item.name}</span>
                    <span>{item.percentage}%</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-2">
                    {item.name === '外在激励' ? '关注薪酬、职位、社会地位及他人的显性认可。' : '关注工作本身的趣味、个人成长空间及自我价值实现。'}
                  </p>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-primary" style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          }
          rightTitle="应用提示"
          rightContent={
            <p>应围绕【{getBias(scores, '外在激励', '内在激励') === '内在激励' ? '长期成长空间' : '明确的激励反馈'}】进行职业规划。</p>
          }
          hint={getStructureHint('career')}
        />

        {/* 维度二 */}
        <DimensionCard 
          title="行为偏好与策略导向" 
          subtitle="决策方式：系统规划型 ↔ 直觉反应型"
          summary={`在工作环境中，你在面对问题时，更依赖【${getBias(scores, '系统性认知', '直觉型认知') === '系统性认知' ? '结构化分析' : '快速判断与感觉'}】。`}
          leftTitle="行为倾向分布"
          leftContent={
            <div className="space-y-4">
              {normalizedData.bias.map(item => (
                <div key={item.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold">{item.name}</span>
                    <span>{item.percentage}%</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-2">
                    {item.name === '系统性认知' ? '依赖逻辑推演、详尽规划和风险控制，追求秩序感。' : '依赖快速反应、直觉捕捉机会和灵活应变，追求效能。'}
                  </p>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-primary" style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          }
          rightTitle="应用提示"
          rightContent={
            <p>你通常是团队中的【{getBias(scores, '系统性认知', '直觉型认知') === '系统性认知' ? '秩序维护者' : '变局响应者'}】。</p>
          }
          hint={getStructureHint('bias')}
        />

        {/* 维度三 */}
        <DimensionCard 
          title="学习与知识导向" 
          subtitle="成长方式：四象限分布"
          summary={`在工作环境中，你的学习优势集中在「${learningTop[0]} + ${learningTop[1]}」的组合。`}
          leftTitle="学习偏好雷达图"
          isVertical={true}
          leftContent={
            <div className="space-y-4">
              <RadarChartComponent data={normalizedData.learning} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {normalizedData.learning.map(item => (
                  <div key={item.name} className="text-[10px] text-slate-500 bg-white p-2 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-900 block mb-1">{item.name} ({item.percentage}%)</span>
                    {item.name === '具体经验' ? '通过实际操作和亲身体验来巩固知识。' : 
                     item.name === '主动尝试' ? '通过实验探索和不断试错来获取新知。' : 
                     item.name === '抽象概念化' ? '通过逻辑思考、理论分析来理解系统。' : 
                     '通过仔细观察和深度反思来改进策略。'}
                  </div>
                ))}
              </div>
            </div>
          }
          rightTitle="应用提示"
          rightContent={
            <div className="p-2">
              <p className="font-bold text-brand-primary mb-2">针对您的学习风格建议：</p>
              <p className="leading-relaxed">换对方式比更努力重要。由于您的主导学习方式是「{learningTop[0]}」，建议在适配的学习情境中积累能力。{
                learningTop[0] === '具体经验' ? '您更适合在实战中学习，通过解决具体问题来掌握新技能。' :
                learningTop[0] === '主动尝试' ? '您更适合探索性学习，通过实验和试错来发现规律。' :
                learningTop[0] === '抽象概念化' ? '您更适合系统性学习，通过阅读理论和逻辑推演来构建知识体系。' :
                '您更适合观察式学习，通过复盘和深度思考来提炼经验。'
              }</p>
            </div>
          }
          hint={getStructureHint('learning')}
        />

        {/* 维度四 */}
        <DimensionCard 
          title="文化氛围与价值观" 
          subtitle="核心环境诉求分布"
          summary={`在工作环境中，你更难忍受【${cultureTop[0] === '舒适度安全性' ? '环境动荡/不稳定' : cultureTop[0] === '能力与成长' ? '技能停滞/无成长' : '缺乏尊重/无话语权'}】的工作环境。`}
          leftTitle="价值诉求雷达图"
          isVertical={true}
          leftContent={
            <div className="space-y-4">
              <RadarChartComponent data={normalizedData.culture} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {normalizedData.culture.map(item => (
                  <div key={item.name} className="text-[10px] text-slate-500 bg-white p-2 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-900 block mb-1">{item.name} ({item.percentage}%)</span>
                    {item.name === '舒适度安全性' ? '追求稳定保障、明确规则和舒适的物理环境。' : 
                     item.name === '能力与成长' ? '追求智力挑战、个人技能提升和社会贡献。' : 
                     '追求管理职责、独立决策权和显赫的社会地位。'}
                  </div>
                ))}
              </div>
            </div>
          }
          rightTitle="应用提示"
          rightContent={
            <div className="p-2">
              <p className="font-bold text-brand-primary mb-2">针对您的文化诉求建议：</p>
              <p className="leading-relaxed">优先评估组织文化是否支持您的核心诉求「{cultureTop[0]}」。{
                cultureTop[0] === '舒适度安全性' ? '您在稳定的环境中表现更佳，应避开高风险、高波动的初创型组织。' :
                cultureTop[0] === '能力与成长' ? '您需要不断的智力刺激，应选择重视培训和技术深耕的专业型组织。' :
                '您有较强的管理和独立诉求，应选择扁平化或提供明确晋升路径的组织。'
              } 避免价值观冲突带来的内耗。</p>
            </div>
          }
          hint={getStructureHint('culture')}
        />

        {/* 维度五 */}
        <DimensionCard 
          title="自我取向" 
          subtitle="主导驱动力分布"
          summary={`在工作环境中，当你的主导驱动力【${selfTop[0]}】长期得不到满足，即使其他条件不错，你也会逐渐失去动力。`}
          leftTitle="自我驱动雷达图"
          isVertical={true}
          leftContent={
            <div className="space-y-4">
              <RadarChartComponent data={normalizedData.self} />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {normalizedData.self.map(item => (
                  <div key={item.name} className="text-[10px] text-slate-500 bg-white p-2 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-900 block mb-1">{item.name} ({item.percentage}%)</span>
                    {item.name === '功利导向' ? '追求物质回报与付出的等价交换。' : 
                     item.name === '内在偏好' ? '追求工作内容与个人兴趣的高度契合。' : 
                     item.name === '人际和谐' ? '追求平等、尊重且融洽的团队氛围。' : 
                     item.name === '创新导向' ? '追求多样性，讨厌墨守成规的挑战。' : 
                     '追求组织及个人的长远晋升与发展空间。'}
                  </div>
                ))}
              </div>
            </div>
          }
          rightTitle="应用提示"
          rightContent={
            <div className="p-2">
              <p className="font-bold text-brand-primary mb-2">针对您的自我驱动建议：</p>
              <p className="leading-relaxed">围绕核心优势「{selfTop[0]}」逐步优化路径。{
                selfTop[0] === '功利导向' ? '您是非常务实的执行者，建议选择绩效导向明确、回报丰厚的行业。' :
                selfTop[0] === '内在偏好' ? '您的动力源于热爱，建议将职业与个人兴趣深度结合，避免枯燥的重复性劳动。' :
                selfTop[0] === '人际和谐' ? '团队氛围对您至关重要，建议在入职前深度考察团队文化，避开高内耗环境。' :
                selfTop[0] === '创新导向' ? '您讨厌平庸，应选择鼓励创新、允许试错的关联扩展型或研发型岗位。' :
                '您是长期主义者，应选择有深厚底蕴、能提供长期发展确定性的平台。'
              } 清楚自己“为什么而做”是保持长期动力的关键。</p>
            </div>
          }
          hint={getStructureHint('self')}
        />
      </section>

      {/* 四、最终整合建议页 */}
      <section className="mt-20 border-t-2 border-slate-200 pt-16">
        <h2 className="text-3xl font-black text-slate-900 mb-10 text-center uppercase tracking-widest">整合建议：路径匹配指南</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* 适配方案 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
             <h3 className="text-lg font-black text-brand-primary mb-6 flex items-center gap-2">
               <i className="fa-solid fa-check-double"></i> 在以下行动结构中，适配度较高：
             </h3>
             <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold shrink-0">1</div>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">适合能够发挥「{getBias(scores, '系统性认知', '直觉型认知') === '直觉型认知' ? '灵活应变' : '严谨分析'}」特质的岗位，在「{learningTop[0].includes('尝试') || learningTop[0].includes('经验') ? '关联扩展型' : '核心功能型'}」结构中表现更佳。</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold shrink-0">2</div>
                  <p className="text-sm text-slate-700 leading-relaxed">在需要「{selfTop[0]}」作为核心驱动的环境中，您的长期投入度和稳定性将达到峰值。</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold shrink-0">3</div>
                  <p className="text-sm text-slate-700 leading-relaxed">匹配「{cultureTop[0]}」导向的组织文化，能极大降低您的心理内耗，提升行动效能。</p>
                </div>
             </div>
          </div>

          {/* 风险提醒 */}
          <div className="bg-brand-accent/5 rounded-3xl p-8 border border-brand-accent/20">
             <h3 className="text-lg font-black text-brand-accent mb-6 flex items-center gap-2">
               <i className="fa-solid fa-circle-exclamation"></i> 结构性行动风险提示：
             </h3>
             <ul className="space-y-6">
               <li className="flex gap-4">
                 <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold shrink-0">1</div>
                 <p className="text-sm text-slate-700 leading-relaxed">若处于「{getBias(scores, '系统性认知', '直觉型认知') === '直觉型认知' ? '购买决策型' : '关联扩展型'}」结构，您的「{getBias(scores, '系统性认知', '直觉型认知') === '直觉型认知' ? '直觉导向' : '系统规划'}」可能会因环境错配而导致决策风险或沟通成本增加。</p>
               </li>
               <li className="flex gap-4">
                 <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold shrink-0">2</div>
                 <p className="text-sm text-slate-700 leading-relaxed">长期在缺乏「{cultureTop[0]}」支持的结构中行动，会显著提高您的职业倦怠风险，影响专业产出。</p>
               </li>
               <li className="flex gap-4">
                 <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold shrink-0">3</div>
                 <p className="text-sm text-slate-700 leading-relaxed">过度关注短期外部期待，可能会牺牲基于「{selfTop[0]}」的长期发展路径，导致中后期动力不足。</p>
               </li>
             </ul>
          </div>
        </div>

        {/* 核心寄语 */}
        <div className="mt-16 mb-12 text-center">
          <p className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed italic max-w-3xl mx-auto">
            "与其频繁调整方向，不如围绕核心优势与长期诉求逐步优化路径。清楚自己“为什么而做”，往往比“现在做什么”更重要。"
          </p>
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
