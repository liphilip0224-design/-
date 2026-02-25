
import React, { useState, useMemo } from 'react';
import { QUESTIONS } from './constants/questions';
import { calculateScores } from './utils/analysis';
import { STATIC_CODES, isValidPattern } from './constants/codes';
import Report from './components/Report';

const App: React.FC = () => {
  const [step, setStep] = useState<'home' | 'quiz' | 'report'>('home');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  
  // 兑换码相关状态
  const [inputCode, setInputCode] = useState('');
  const [logoError, setLogoError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isShake, setIsShake] = useState(false);

  const progress = useMemo(() => {
    return Math.round(((currentIndex) / QUESTIONS.length) * 100);
  }, [currentIndex]);

  const handleVerify = () => {
    const code = inputCode.trim().toUpperCase();
    if (!code) {
      setError('请输入兑换码');
      triggerShake();
      return;
    }

    setIsVerifying(true);
    setError('');

    // 模拟核验动画
    setTimeout(() => {
      const isStaticValid = STATIC_CODES.includes(code);
      const isPatternValid = isValidPattern(code);

      if (isStaticValid || isPatternValid) {
        setIsSuccess(true);
        // 成功后延迟进入题目，增强仪式感
        setTimeout(() => {
          setStep('quiz');
          setCurrentIndex(0);
          setAnswers({});
        }, 800);
      } else {
        setError('兑换码无效或已过期');
        triggerShake();
      }
      setIsVerifying(false);
    }, 600);
  };

  const triggerShake = () => {
    setIsShake(true);
    setTimeout(() => setIsShake(false), 500);
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
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[20%] right-[10%] w-24 h-24 bg-brand-accent/10 rounded-full blur-xl"></div>
        
        <div className="max-w-2xl w-full text-center bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-brand-primary/10 border border-white relative z-10">
          <div className="mb-10 flex justify-center">
            {/* Logo Section - Shrunken Official Image Logo */}
            <div className="w-44 h-44 flex items-center justify-center transition-all duration-700 bg-white rounded-[2.5rem] p-6 shadow-xl shadow-brand-primary/5 border border-slate-50 relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {!logoError ? (
                <img 
                  src="https://raw.githubusercontent.com/Antigravity-AI/logos/main/fangzai_logo.png" 
                  alt="方载LOGO" 
                  className={`max-w-full max-h-full object-contain transition-all duration-500 relative z-10 ${isSuccess ? 'scale-110' : 'group-hover:scale-105'}`}
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="text-4xl font-black text-slate-900 tracking-tighter relative z-10">方载</div>
              )}
            </div>
          </div>
          
          <div className="space-y-2 mb-12">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">职业成长路径行动模型</h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-brand-accent/30"></div>
              <p className="text-brand-primary text-sm font-black tracking-[0.3em] uppercase">深度分析工具</p>
              <div className="h-px w-8 bg-brand-accent/30"></div>
            </div>
          </div>

          <div className={`max-w-xs mx-auto mb-10 transition-all ${isShake ? 'animate-shake' : ''}`}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary/20 via-brand-accent/20 to-brand-secondary/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative">
                <input
                  type="text"
                  disabled={isVerifying || isSuccess}
                  value={inputCode}
                  onChange={(e) => {
                    setInputCode(e.target.value);
                    setError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                  placeholder="输入授权码"
                  className={`w-full px-6 py-5 bg-white border-2 rounded-2xl text-center text-xl font-mono font-bold tracking-[0.2em] transition-all focus:outline-none relative z-10 ${
                    isSuccess ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-inner' :
                    error ? 'border-rose-400 text-rose-600 shadow-inner' : 'border-slate-100 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 shadow-sm'
                  }`}
                />
                {isVerifying && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
                    <i className="fa-solid fa-spinner fa-spin text-brand-primary"></i>
                  </div>
                )}
              </div>
            </div>
            {error && <p className="text-rose-500 text-xs mt-4 font-bold flex items-center justify-center gap-1 animate-bounce">
              <i className="fa-solid fa-triangle-exclamation"></i> {error}
            </p>}
            {isSuccess && <p className="text-emerald-600 text-xs mt-4 font-bold flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              授权成功，正在为您开启...
            </p>}
          </div>

          {!isSuccess && (
            <button 
              onClick={handleVerify}
              disabled={isVerifying}
              className="w-full max-w-xs py-5 bg-slate-900 text-white text-lg font-black rounded-2xl hover:bg-brand-primary transition-all shadow-xl hover:shadow-brand-primary/30 active:scale-95 disabled:opacity-50 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
              <span className="relative z-10">{isVerifying ? '核验中...' : '立即验证身份'}</span>
            </button>
          )}

          <div className="mt-16 pt-10 border-t border-slate-100">
            <div className="flex justify-center gap-12 text-[10px] text-slate-400 font-black tracking-widest uppercase">
              <div className="flex flex-col items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors">
                  <i className="fa-solid fa-layer-group text-lg"></i>
                </div>
                <span>评估项目模型九类之一</span>
              </div>
              <div className="flex flex-col items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-brand-accent/10 group-hover:text-brand-accent transition-colors">
                  <i className="fa-solid fa-microscope text-lg"></i>
                </div>
                <span>科学量表支持</span>
              </div>
            </div>
          </div>
        </div>
        
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-10px); }
            40% { transform: translateX(10px); }
            60% { transform: translateX(-10px); }
            80% { transform: translateX(10px); }
          }
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
          .animate-shake { animation: shake 0.4s ease-in-out; }
          .animate-shimmer { animation: shimmer 1.5s infinite; }
        `}} />
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
              <span className="text-sm font-black text-brand-primary">进度: {progress}%</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">第 {currentIndex + 1} 题 / 共 {QUESTIONS.length} 题</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-primary transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-12 leading-tight tracking-tight">
              {currentQuestion.text}
            </h2>

            <div className="space-y-4">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  className="w-full text-left p-6 rounded-2xl border-2 border-slate-50 bg-slate-50/50 hover:border-brand-primary hover:bg-white hover:shadow-lg transition-all group flex items-center justify-between"
                >
                  <span className="text-slate-700 font-bold group-hover:text-brand-primary">{opt.label}</span>
                  <div className="w-8 h-8 rounded-full border-2 border-slate-200 group-hover:border-brand-primary group-hover:bg-brand-primary flex items-center justify-center transition-all">
                    <i className="fa-solid fa-arrow-right text-transparent group-hover:text-white text-xs"></i>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center">
             <button 
               onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
               className="text-[10px] font-black text-slate-300 hover:text-indigo-600 uppercase tracking-widest transition-colors"
             >
               <i className="fa-solid fa-chevron-left mr-1"></i> Previous Question
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
