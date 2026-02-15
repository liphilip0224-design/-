
import React from 'react';
import { Scores } from '../types';
import { DIMENSION_DESCRIPTIONS, INTEGRATIONS, RISKS } from '../constants/reportData';
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

// 坐标偏向条组件
const PolarBar: React.FC<{ left: string; right: string; lVal: number; rVal: number }> = ({ left, right, lVal, rVal }) => {
  const total = (lVal + rVal) || 1;
  const lPerc = (lVal / total) * 100;
  const rPerc = (rVal / total) * 100;
  
  return (
    <div className="my-4">
      <div className="flex justify-between text-xs font-bold text-slate-500 mb-1 px-1">
        <span>{left}</span>
        <span>{right}</span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full flex overflow-hidden border border-slate-200">
        <div className="h-full bg-indigo-500 transition-all" style={{ width: `${lPerc}%` }}></div>
        <div className="w-0.5 h-full bg-white z-10"></div>
        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${rPerc}%` }}></div>
      </div>
    </div>
  );
};

// 维度解读卡片
const DimensionCard: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8 transition-all hover:shadow-md">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
      <div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-indigo-500 font-medium">{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
);

const Report: React.FC<Props> = ({ scores, onRestart }) => {
  const portrait = getOneSentencePortrait(scores);

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

  // 计算百分比偏向
  const biasPerc = ((scores['直觉型认知'] || 0) / ((scores['系统性认知'] || 0) + (scores['直觉型认知'] || 0) || 1)) * 100;
  const careerPerc = ((scores['内在激励'] || 0) / ((scores['外在激励'] || 0) + (scores['内在激励'] || 0) || 1)) * 100;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 bg-slate-50 min-h-screen">
      {/* 头部：一句话总画像 */}
      <header className="text-center mb-16">
        <div className="inline-block px-4 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-full mb-4 tracking-widest uppercase">
          Career Path Assessment Report
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">「{portrait}」</h1>
        <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
          基于方载职业心理五维模型，您表现出显著的偏向性。本报告旨在为您提供清晰的“倾向解读”而非“诊断结论”，帮助您在适配的环境中发挥最大效能。
        </p>
      </header>

      {/* 二、全景总览 (16主题) - 按百分比展示 */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 mb-12 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-8 flex items-center gap-2 text-indigo-400">
            <i className="fa-solid fa-chart-bar"></i> 五维度全景图 (16核心主题强度)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {Object.entries(dims).map(([key, list]) => (
              <div key={key} className="space-y-3">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-1">
                  {key === 'career' ? '职业管理' : 
                   key === 'bias' ? '行为偏好' : 
                   key === 'learning' ? '学习取向' : 
                   key === 'culture' ? '文化价值' : '自我取向'}
                </div>
                {list.map(sub => {
                  const val = scores[sub] || 0;
                  const max = MAX_SCORES[sub] || 5;
                  const perc = Math.round((val / max) * 100);
                  return (
                    <div key={sub} className="group">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="opacity-70 group-hover:opacity-100 transition-opacity">{sub}</span>
                        <span className="font-bold text-indigo-400">{perc}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(129,140,248,0.3)]" 
                          style={{ width: `${perc}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </section>

      {/* 三、维度深度解释 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 mb-8 px-2">维度解读：倾向与适配</h2>

        {/* 维度一 */}
        <DimensionCard title="职业管理动机" subtitle="动力来源：外部回报 ↔ 内在满足">
          <p className="text-sm text-slate-600 mb-4 italic">
            「你更容易被【{getBias(scores, '外在激励', '内在激励') === '内在激励' ? '成长感 / 兴趣' : '高回报 / 认可'}】驱动，这会直接影响你对工作的选择和坚持程度。」
          </p>
          <PolarBar left="外部激励" right="内部激励" lVal={scores['外在激励'] || 0} rVal={scores['内在激励'] || 0} />
          <div className="grid grid-cols-2 gap-4 mt-6 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="font-bold text-slate-900 block mb-1">行为关键词</span>
              <ul className="list-disc list-inside text-slate-500">
                {getBias(scores, '外在激励', '内在激励') === '内在激励' ? 
                  ['技能发展', '工作趣味', '自我实现', '社会积极影响'] : 
                  ['经济回报', '社会地位', '他人认可', '成就展示']}
              </ul>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl">
              <span className="font-bold text-indigo-900 block mb-1">应用提示</span>
              <p className="text-indigo-700 opacity-80">
                应围绕【{getBias(scores, '外在激励', '内在激励') === '内在激励' ? '长期成长空间' : '明确的激励反馈'}】进行职业规划，避免长期在【动机错配】环境下工作。
              </p>
            </div>
          </div>
        </DimensionCard>

        {/* 维度二 */}
        <DimensionCard title="行为偏好与策略导向" subtitle="决策方式：系统规划型 ↔ 直觉反应型">
          <p className="text-sm text-slate-600 mb-4 italic">
            「你在面对问题时，更依赖【{getBias(scores, '系统性认知', '直觉型认知') === '系统性认知' ? '结构化分析' : '快速判断与感觉'}】。」
          </p>
          <PolarBar left="系统型" right="直觉型" lVal={scores['系统性认知'] || 0} rVal={scores['直觉型认知'] || 0} />
          <div className="grid grid-cols-2 gap-4 mt-6 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="font-bold text-slate-900 block mb-1">行为倾向</span>
              <ul className="list-disc list-inside text-slate-500">
                {getBias(scores, '系统性认知', '直觉型认知') === '系统性认知' ? 
                  ['详尽规划', '风险控制', '逻辑推演', '有条理'] : 
                  ['快速试错', '灵活应变', '捕捉机会', '情感驱动']}
              </ul>
            </div>
            <div className="p-3 bg-slate-900 text-white rounded-xl">
              <span className="font-bold block mb-1">团队角色提示</span>
              <p className="opacity-80">
                你通常是团队中的【{getBias(scores, '系统性认知', '直觉型认知') === '系统性认知' ? '秩序维护者' : '变局响应者'}】。
              </p>
            </div>
          </div>
        </DimensionCard>

        {/* 维度三 */}
        <DimensionCard title="学习与知识导向" subtitle="成长方式：四象限组合">
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl mb-4">
            <p className="text-xs text-amber-800 font-medium">
              <i className="fa-solid fa-circle-info mr-1"></i>
              你的学习优势集中在「{learningTop[0]} + {learningTop[1]}」的组合，而不是单一类型。换对方式 > 更努力。
            </p>
          </div>
          <div className="space-y-3">
             {learningTop.slice(0, 2).map(type => (
               <div key={type} className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                 <div className="flex-1">
                   <div className="text-sm font-bold text-slate-800">{type}</div>
                   <div className="text-[10px] text-slate-500">重点通过{type.includes('经验') ? '实际操作' : type.includes('尝试') ? '实验探索' : type.includes('概念') ? '逻辑思考' : '观察反思'}来巩固知识。</div>
                 </div>
               </div>
             ))}
          </div>
        </DimensionCard>

        {/* 维度四 */}
        <DimensionCard title="文化氛围与价值观" subtitle="核心环境诉求">
           <p className="text-sm text-slate-600 mb-4 italic">
            「相比其他因素，你更难忍受【{cultureTop[0] === '舒适度安全性' ? '环境动荡/不稳定' : cultureTop[0] === '能力与成长' ? '技能停滞/无成长' : '缺乏尊重/无话语权'}】的工作环境。」
          </p>
          <div className="flex gap-2">
            {cultureTop.slice(0, 2).map(item => (
              <span key={item} className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-200">{item}</span>
            ))}
          </div>
        </DimensionCard>

        {/* 维度五 */}
        <DimensionCard title="自我取向" subtitle="主导驱动力 + 次级驱动力">
           <div className="bg-indigo-900 p-5 rounded-2xl text-white">
              <div className="mb-4">
                <span className="text-[10px] opacity-60 uppercase block">主导驱动：{selfTop[0]}</span>
                <p className="text-sm opacity-90 leading-relaxed">当你的主导驱动力长期得不到满足，即使其他条件不错，你也会逐渐失去动力。</p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <span className="text-[10px] opacity-60 uppercase block">次级驱动：{selfTop[1]}</span>
                <p className="text-xs opacity-80 mt-1">作为辅助动力，为你提供额外的职业满足感。</p>
              </div>
           </div>
        </DimensionCard>
      </section>

      {/* 四、最终整合建议页 */}
      <section className="mt-20 border-t-2 border-slate-200 pt-16">
        <h2 className="text-3xl font-black text-slate-900 mb-10 text-center uppercase tracking-widest">整合建议：路径匹配指南</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* 适配方案 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
             <h3 className="text-lg font-black text-indigo-600 mb-6 flex items-center gap-2">
               <i className="fa-solid fa-check-double"></i> 综合来看，你更适合：
             </h3>
             <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase block mb-2">职业类型</span>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">适合能够发挥「{biasPerc > 50 ? '灵活应变' : '严谨分析'}」特质，且满足「{careerPerc > 50 ? '内在成长' : '外部回馈'}」诉求的专业技术或管理岗位。</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase block mb-2">组织环境</span>
                  <p className="text-sm text-slate-700 leading-relaxed">{INTEGRATIONS[3]}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase block mb-2">成长方式</span>
                  <p className="text-sm text-slate-700 leading-relaxed">{INTEGRATIONS[2]}</p>
                </div>
             </div>
          </div>

          {/* 风险提醒 */}
          <div className="bg-rose-50 rounded-3xl p-8 border border-rose-100">
             <h3 className="text-lg font-black text-rose-600 mb-6 flex items-center gap-2">
               <i className="fa-solid fa-circle-exclamation"></i> 风险预警
             </h3>
             <ul className="space-y-4">
               {RISKS.slice(0, 2).map((risk, idx) => (
                 <li key={idx} className="flex gap-3 text-sm text-rose-800 leading-relaxed">
                   <span className="w-5 h-5 rounded-full bg-rose-200 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">!</span>
                   {risk}
                 </li>
               ))}
               <li className="flex gap-3 text-sm text-rose-800 leading-relaxed">
                 <span className="w-5 h-5 rounded-full bg-rose-200 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">!</span>
                 过度关注短期安全或外部期待，可能会牺牲基于「{selfTop[0]}」的长期发展。
               </li>
             </ul>
          </div>
        </div>

        {/* 底部寄语 */}
        <div className="bg-slate-900 text-slate-400 p-8 rounded-3xl text-center text-xs">
          <p className="mb-4 text-white opacity-80 leading-relaxed">
            "{INTEGRATIONS[4]}"
          </p>
          <div className="flex justify-center gap-8 border-t border-white/5 pt-6">
            <span>方载 (Fangzai) 团队 · 官方分析</span>
            <span>职业成长路径五维模型 V1.0</span>
          </div>
        </div>
      </section>

      <div className="mt-16 text-center">
        <button 
          onClick={onRestart}
          className="px-12 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all hover:scale-105 shadow-xl shadow-indigo-100"
        >
          重新测评
        </button>
      </div>
    </div>
  );
};

export default Report;
