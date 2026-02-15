
import React, { useState, useMemo } from 'react';
import { QUESTIONS } from './constants/questions';
import { calculateScores } from './utils/analysis';
import Report from './components/Report';

const App: React.FC = () => {
  const [step, setStep] = useState<'home' | 'quiz' | 'report'>('home');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const progress = useMemo(() => {
    return Math.round(((currentIndex) / QUESTIONS.length) * 100);
  }, [currentIndex]);

  const handleStart = () => {
    setStep('quiz');
    setCurrentIndex(0);
    setAnswers({});
  };

  const handleAnswer = (value: string) => {
    const question = QUESTIONS[currentIndex];
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setStep('report');
    }
  };

  const currentQuestion = QUESTIONS[currentIndex];

  if (step === 'home') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-50 via-white to-slate-50">
        <div className="max-w-2xl w-full text-center bg-white p-12 rounded-3xl shadow-xl border border-slate-100">
          <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg rotate-3">
            <i className="fa-solid fa-chart-line text-white text-3xl"></i>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">方载：职业偏好与成长路径测评</h1>
          <p className="text-slate-600 text-lg mb-10 leading-relaxed">
            基于职业管理、行为偏好、学习取向、文化价值观和自我取向五维模型。
            帮助您识别职场底层动机，定位核心成长路径，预测职业风险。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <i className="fa-solid fa-clock"></i> 预计用时 8 分钟
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <i className="fa-solid fa-list-check"></i> 共 46 道精选题
            </div>
          </div>
          <button 
            onClick={handleStart}
            className="mt-12 px-12 py-4 bg-indigo-600 text-white text-lg font-bold rounded-2xl hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-200"
          >
            开始测评
          </button>
        </div>
      </div>
    );
  }

  if (step === 'quiz') {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-6">
        <div className="max-w-xl mx-auto">
          {/* Progress Header */}
          <div className="mb-10">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold text-indigo-600">进度: {progress}%</span>
              <span className="text-xs text-slate-400">题库：{currentIndex + 1} / {QUESTIONS.length}</span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 mb-6">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">
              维度：{currentQuestion.dimension.replace('_', ' ')}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-10 leading-snug">
              {currentQuestion.text}
            </h2>

            <div className="space-y-4">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  className="w-full text-left p-6 rounded-2xl border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all group flex items-center justify-between"
                >
                  <span className="text-slate-700 font-medium group-hover:text-indigo-700">{opt.label}</span>
                  <div className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-indigo-600 group-hover:bg-indigo-600 flex items-center justify-center transition-all">
                    <div className="w-2 h-2 rounded-full bg-white opacity-0 group-hover:opacity-100"></div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center">
             <button 
               onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
               className="text-sm text-slate-400 hover:text-indigo-600 underline"
             >
               返回上一题
             </button>
          </div>
        </div>
      </div>
    );
  }

  const finalScores = calculateScores(answers);

  return (
    <div className="min-h-screen bg-white">
      <Report scores={finalScores} onRestart={() => setStep('home')} />
    </div>
  );
};

export default App;
