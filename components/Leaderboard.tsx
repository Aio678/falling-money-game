
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Medal, WifiOff } from 'lucide-react';
import { ScoreEntry } from '../types';
import { dataManager } from '../utils/dataManager';

interface LeaderboardProps {
  onBack: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onBack }) => {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    setLoading(true);
    const data = await dataManager.getLeaderboard();
    setScores(data);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center h-full w-full bg-indigo-50 p-6 pt-12 overflow-hidden">
      <div className="max-w-md w-full flex flex-col h-full bg-white rounded-3xl shadow-xl overflow-hidden border border-indigo-100">
        <div className="p-6 bg-indigo-600 text-white flex justify-between items-center shadow-md">
          <button onClick={onBack} className="p-2 hover:bg-indigo-500 rounded-full transition">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Medal className="w-6 h-6 text-yellow-300" />
            富豪榜
          </h2>
          <div className="w-10"></div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-64 text-indigo-300">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
                <p>加载数据中...</p>
             </div>
          ) : scores.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <span className="text-6xl mb-4">📜</span>
              <p>暂无记录，快去赚钱吧！</p>
            </div>
          ) : (
            scores.map((entry, index) => (
              <div 
                key={entry.id || index}
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  index === 0 ? 'bg-yellow-50 border-yellow-200' :
                  index === 1 ? 'bg-gray-50 border-gray-200' :
                  index === 2 ? 'bg-orange-50 border-orange-200' :
                  'bg-white border-slate-100'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-8 h-8 flex items-center justify-center rounded-full font-bold
                    ${index === 0 ? 'bg-yellow-400 text-yellow-900' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-orange-400 text-white' :
                      'bg-slate-100 text-slate-500'}
                  `}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">{entry.name}</div>
                    <div className="text-xs text-gray-400">{new Date(entry.date).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="font-mono font-bold text-xl text-indigo-600">
                  ${entry.score}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-center bg-gray-50 items-center">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            * 混合存储模式 (API + Local)
          </span>
        </div>
      </div>
    </div>
  );
};
