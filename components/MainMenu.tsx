import React, { useState } from 'react';
import { Play, Trophy, UserCircle2 } from 'lucide-react';
import { Button } from './Button';
import { soundManager } from '../utils/audio';
import { CharacterSelector } from './CharacterSelector';
import { CharacterId } from '../types';
import { Player } from './Player';

interface MainMenuProps {
  onStart: () => void;
  onShowLeaderboard: () => void;
  currentSkin: CharacterId;
  onSelectSkin: (skin: CharacterId) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ 
  onStart, 
  onShowLeaderboard,
  currentSkin,
  onSelectSkin
}) => {
  const [showSkinSelector, setShowSkinSelector] = useState(false);

  const handleStart = () => {
    soundManager.init(); // Resume audio context
    soundManager.play('click');
    onStart();
  };

  const handleLeaderboard = () => {
    soundManager.init();
    soundManager.play('click');
    onShowLeaderboard();
  };

  const handleSkinSelect = (skin: CharacterId) => {
    soundManager.play('click');
    onSelectSkin(skin);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-b from-sky-300 to-blue-500 relative overflow-hidden">
      {/* Background clouds */}
      <div className="cloud" style={{ top: '10%', left: '-10%', width: '150px', animationDuration: '40s' }}>
         <svg viewBox="0 0 100 60" className="w-full text-white fill-current opacity-40"><path d="M10,40 Q20,20 40,30 Q50,10 70,30 Q90,30 90,50 Q90,60 10,60 Z" /></svg>
      </div>
      <div className="cloud" style={{ top: '25%', left: '-10%', width: '100px', animationDuration: '30s', animationDelay: '5s' }}>
         <svg viewBox="0 0 100 60" className="w-full text-white fill-current opacity-30"><path d="M10,40 Q20,20 40,30 Q50,10 70,30 Q90,30 90,50 Q90,60 10,60 Z" /></svg>
      </div>

      <div className="absolute top-10 left-10 text-6xl opacity-50 animate-bounce delay-100">💸</div>
      <div className="absolute top-20 right-20 text-5xl opacity-50 animate-bounce delay-700">💰</div>
      <div className="absolute bottom-20 left-1/4 text-7xl opacity-30 animate-pulse">💵</div>
      
      <div className="z-10 bg-white/95 backdrop-blur-md p-8 rounded-[2rem] shadow-2xl flex flex-col items-center gap-5 max-w-sm w-11/12 border border-white/60">
        
        <div className="text-center space-y-1 mb-2">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-800 tracking-tight">
            天上掉马内
          </h1>
          <p className="text-gray-500 text-sm font-medium">接住钞票，躲避炸弹！</p>
        </div>

        {/* Current Character Preview Box */}
        <div 
            onClick={() => setShowSkinSelector(true)}
            className="relative group cursor-pointer w-full flex justify-center"
        >
             <div className="w-48 h-48 bg-sky-50 rounded-2xl border-4 border-sky-200 group-hover:border-sky-400 transition-all duration-300 shadow-inner flex flex-col items-center justify-center relative overflow-hidden">
                {/* Dashed inner border */}
                <div className="absolute inset-3 border-2 border-dashed border-sky-200/60 rounded-xl pointer-events-none group-hover:border-sky-300/80 transition-colors" />
                
                {/* Character */}
                <div className="w-32 h-32 z-10 transform group-hover:scale-110 transition-transform duration-300 pb-4">
                   <Player skin={currentSkin} />
                </div>
                
                {/* Text Label */}
                <div className="absolute bottom-3 z-10 text-xs font-bold text-sky-500 bg-white/70 px-3 py-1 rounded-full backdrop-blur-sm group-hover:text-sky-600 group-hover:bg-white transition-colors shadow-sm">
                   点击更换角色
                </div>
             </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Button onClick={handleStart} size="lg" className="w-full shadow-lg shadow-green-200 text-lg py-3">
            <Play className="w-6 h-6 fill-current" />
            开始赚钱
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={handleLeaderboard} variant="secondary" size="md" className="flex-1 text-sm font-bold text-gray-600">
                <Trophy className="w-4 h-4 text-yellow-500" />
                排行榜
            </Button>
            <Button onClick={() => setShowSkinSelector(true)} variant="secondary" size="md" className="flex-1 text-sm font-bold text-gray-600">
                <UserCircle2 className="w-4 h-4 text-indigo-500" />
                角色
            </Button>
          </div>
        </div>
      </div>

      {showSkinSelector && (
        <CharacterSelector 
            currentSkin={currentSkin}
            onSelect={handleSkinSelect}
            onClose={() => setShowSkinSelector(false)}
        />
      )}
    </div>
  );
};