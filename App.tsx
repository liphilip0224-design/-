
import React, { useState, useMemo, useEffect, ReactNode } from 'react';
import { QUESTIONS } from './constants/questions';
import { calculateScores } from './utils/analysis';
import { STATIC_CODES, isValidPattern } from './constants/codes';
import Report from './components/Report';
import { auth, googleProvider, signInWithPopup, onAuthStateChanged, db, User } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ErrorBoundary } from 'react-error-boundary';

// Error Fallback Component
const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-rose-50 text-center">
      <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 mb-6">
        <i className="fa-solid fa-triangle-exclamation text-4xl"></i>
      </div>
      <h1 className="text-2xl font-black text-slate-900 mb-4">抱歉，程序出现了错误</h1>
      <p className="text-slate-600 mb-8 max-w-md">
        {error?.message.includes('{') 
          ? "数据库连接或权限验证失败，请刷新页面重试。" 
          : "我们遇到了一些技术问题，请稍后再试。"}
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
      >
        刷新页面
      </button>
    </div>
  );
};

const AppContent: React.FC = () => {
  const [step, setStep] = useState<'home' | 'quiz' | 'report'>('home');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Login failed:", err);
      setError('登录失败，请重试');
    }
  };

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

  const handleAnswer = async (value: string) => {
    const question = QUESTIONS[currentIndex];
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const finalScores = calculateScores(newAnswers);
      // If logged in, save to Firestore
      if (user) {
        try {
          await addDoc(collection(db, 'user_assessments'), {
            uid: user.uid,
            email: user.email,
            answers: newAnswers,
            scores: finalScores,
            createdAt: serverTimestamp()
          });
        } catch (err) {
          console.error("Failed to save assessment:", err);
          // We still show the report even if saving fails
        }
      }
      setStep('report');
    }
  };

  const currentQuestion = QUESTIONS[currentIndex];

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
          <p className="text-slate-400 text-xs font-black tracking-widest uppercase">正在加载配置...</p>
        </div>
      </div>
    );
  }

  if (step === 'home') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[20%] right-[10%] w-24 h-24 bg-brand-accent/10 rounded-full blur-xl"></div>
        
        <div className="max-w-2xl w-full text-center bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-brand-primary/10 border border-white relative z-10">
          {user && (
            <div className="absolute top-8 right-8 flex items-center gap-3 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50 shadow-sm">
              <img src={user.photoURL || ''} alt="" className="w-6 h-6 rounded-full" />
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">{user.displayName?.split(' ')[0]}</span>
              <button onClick={() => auth.signOut()} className="text-slate-300 hover:text-rose-500 transition-colors">
                <i className="fa-solid fa-right-from-bracket text-[10px]"></i>
              </button>
            </div>
          )}

          <div className="mb-6 flex justify-center">
            {/* Logo Section - Prominent Official Image Logo */}
            <div className="w-64 h-64 flex items-center justify-center transition-all duration-700 relative group">
              {!logoError ? (
                <img 
                  src="https://raw.githubusercontent.com/Antigravity-AI/logos/main/fangzai_logo.png" 
                  alt="方载LOGO" 
                  className={`max-w-full max-h-full object-contain transition-all duration-500 relative z-10 ${isSuccess ? 'scale-110' : 'group-hover:scale-105'}`}
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="text-6xl font-black text-slate-900 tracking-tighter relative z-10">方载</div>
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
            <div className="space-y-4">
              {!user && (
                <button 
                  onClick={handleLogin}
                  className="w-full max-w-xs py-4 bg-white border-2 border-slate-100 text-slate-700 text-sm font-bold rounded-2xl hover:border-brand-primary hover:bg-brand-primary/5 transition-all flex items-center justify-center gap-3 mx-auto shadow-sm"
                >
                  <img src="https://www.google.com/favicon.ico" alt="" className="w-4 h-4" />
                  使用 Google 账号登录以保存结果
                </button>
              )}
              <button 
                onClick={handleVerify}
                disabled={isVerifying}
                className="w-full max-w-xs py-5 bg-slate-900 text-white text-lg font-black rounded-2xl hover:bg-brand-primary transition-all shadow-xl hover:shadow-brand-primary/30 active:scale-95 disabled:opacity-50 relative overflow-hidden group mx-auto block"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                <span className="relative z-10">{isVerifying ? '核验中...' : '立即验证身份'}</span>
              </button>
            </div>
          )}

          <div className="mt-16 pt-10 border-t border-slate-100">
            <div className="flex justify-center gap-12 text-[10px] text-slate-400 font-black tracking-widest uppercase">
              <div className="flex flex-col items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors">
                  <i className="fa-solid fa-layer-group text-lg"></i>
                </div>
                <span>方载团队评估项目模型九类之一</span>
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
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">请选择第一印象的答案</div>
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
      <Report scores={finalScores} onRestart={() => {
        setStep('home');
        setIsSuccess(false);
        setInputCode('');
        setError('');
      }} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AppContent />
    </ErrorBoundary>
  );
};

export default App;
