
import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, query, orderBy, Timestamp } from '../firebase';

interface AssessmentResult {
  id: string;
  email: string;
  timestamp: Timestamp;
  portrait: {
    title: string;
    subtitle: string;
  };
  scores: Record<string, number>;
}

interface AdminDashboardProps {
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const q = query(collection(db, 'results'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as AssessmentResult[];
        setResults(data);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError('无法加载数据，请检查权限。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-brand-primary mb-4"></i>
          <p className="text-slate-500 font-bold">正在加载后台数据...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900">方载测评 · 后台管理</h1>
            <p className="text-slate-500 text-sm mt-1">查看所有用户的测评结果与分布</p>
          </div>
          <button 
            onClick={onBack}
            className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all"
          >
            返回首页
          </button>
        </div>

        {error ? (
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl text-rose-600 text-center font-bold">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">用户邮箱</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">测评时间</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">工作人格</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">核心得分</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {results.map((res) => (
                      <tr key={res.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-slate-700">{res.email}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-slate-400">
                            {res.timestamp?.toDate().toLocaleString('zh-CN')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-brand-primary">{res.portrait.title}</span>
                            <span className="text-[10px] text-slate-400">{res.portrait.subtitle}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {Object.entries(res.scores).slice(0, 3).map(([key, val]) => (
                              <div key={key} className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500">
                                {key}: {val}
                              </div>
                            ))}
                            {Object.keys(res.scores).length > 3 && (
                              <span className="text-[10px] text-slate-300 flex items-center">...</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {results.length === 0 && (
                <div className="p-12 text-center text-slate-400 font-bold">
                  暂无测评数据
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
