
import React, { useState, useEffect } from 'react';
import { Home, RotateCcw, Save, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';
import { soundManager } from '../utils/audio';
import { dataManager } from '../utils/dataManager';
import { CharacterId } from '../types';

interface GameOverProps {
  score: number;
  onRestart: () => void;
  onHome: () => void;
  currentSkin?: CharacterId; // Added prop to know which skin was used
}

export const GameOver: React.FC<GameOverProps> = ({ score, onRestart, onHome, currentSkin = 'boy' }) => {
  const [name, setName] = useState('');
  const [saveStatus, setSaveStatus] = useState<'none' | 'cloud' | 'local'>('none');
  const [isSaving, setIsSaving] = useState(false);

  // Try to pre-fill name if we have it locally
  useEffect(() => {
      const lastPlayer = localStorage.getItem('falling_money_last_player');
      if (lastPlayer) setName(lastPlayer);
  }, []);

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    soundManager.play('click');
    
    // Save last player name for convenience
    localStorage.setItem('falling_money_last_player', name.trim());

    // Call dataManager and wait for result
    // Pass the currentSkin so we know who achieved this score!
    const result = await dataManager.saveScore(name.trim().substring(0, 10), score, currentSkin);
    
    // Also try to save skin preference since we have a name now
    await dataManager.saveSkinPreference(name.trim(), currentSkin);

    setIsSaving(false);
    
    // Set status based on whether cloud save succeeded
    setSaveStatus(result.success ? 'cloud' : 'local');
    
    soundManager.play('coin'); // Success sound
  };

  const handleRestart = () => {
    soundManager.play('click');
    onRestart();
  };

  const handleHome = () => {
    soundManager.play('click');
    onHome();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-red-50/90 backdrop-blur-sm z-50 absolute inset-0">
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full border-4 border-red-100 animate-in zoom-in duration-300">
        <div className="text-center mb-8">
          <h2 className="text-5xl mb-2">💥</h2>
          <h1 className="text-3xl font-black text-gray-800 mb-2">游戏结束!</h1>
          <div className="text-gray-500">最终得分</div>
          <div className="text-5xl font-mono font-bold text-green-600 my-2">${score}</div>
        </div>

        {saveStatus === 'none' ? (
          <div className="mb-6 bg-gray-50 p-4 rounded-xl">
            <label className="block text-sm font-medium text-gray-700 mb-2">记录你的战绩</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="输入你的名字"
                className="flex-1 border-gray-300 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                maxLength={10}
              />
              <button 
                onClick={handleSave}
                disabled={!name.trim() || isSaving}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 font-medium flex items-center justify-center min-w-[3rem]"
              >
                {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                    <Save className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className={`mb-6 text-center font-bold p-3 rounded-xl border flex items-center justify-center gap-2 ${
              saveStatus === 'cloud' 
              ? 'bg-green-50 border-green-100 text-green-600' 
              : 'bg-yellow-50 border-yellow-100 text-yellow-700'
          }`}>
            {saveStatus === 'cloud' ? (
                <>
                    <CheckCircle2 className="w-5 h-5" />
                    成绩已保存!
                </>
            ) : (
                <>
                    <AlertTriangle className="w-5 h-5" />
                    已保存到本地 (云端同步失败)
                </>
            )}
          </div>
        )}

        <div className="space-y-3">
          <Button onClick={handleRestart} className="w-full">
            <RotateCcw className="w-5 h-5" /> 再玩一次
          </Button>
          <Button onClick={handleHome} variant="secondary" className="w-full">
            <Home className="w-5 h-5" /> 返回主菜单
          </Button>
        </div>
      </div>
    </div>
  );
}
