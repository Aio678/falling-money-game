
import React, { useState, useEffect } from 'react';
import { MainMenu } from './components/MainMenu';
import { GameEngine } from './components/GameEngine';
import { GameOver } from './components/GameOver';
import { Leaderboard } from './components/Leaderboard';
import { GameState, CharacterId } from './types';
import { dataManager } from './utils/dataManager';

function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [finalScore, setFinalScore] = useState(0);
  const [characterSkin, setCharacterSkin] = useState<CharacterId>('boy');

  useEffect(() => {
    // Load saved skin (hybrid check)
    const loadSkin = async () => {
        const skin = await dataManager.getSkinPreference(''); // Empty name = only local check usually
        if (skin) {
            setCharacterSkin(skin);
        }
    };
    loadSkin();
  }, []);

  const handleSetSkin = (skin: CharacterId) => {
    setCharacterSkin(skin);
    // Save preference (locally mainly, server syncs when name is provided in Game Over)
    dataManager.saveSkinPreference('', skin);
  };

  const startGame = () => {
    setGameState(GameState.PLAYING);
    setFinalScore(0);
  };

  const handleGameOver = (score: number) => {
    setFinalScore(score);
    setGameState(GameState.GAME_OVER);
  };

  const goToMenu = () => {
    setGameState(GameState.MENU);
  };

  return (
    <div className="w-full h-screen overflow-hidden font-sans text-slate-800 selection:bg-green-200">
      {gameState === GameState.MENU && (
        <MainMenu 
          onStart={startGame} 
          onShowLeaderboard={() => setGameState(GameState.LEADERBOARD)}
          currentSkin={characterSkin}
          onSelectSkin={handleSetSkin}
        />
      )}

      {gameState === GameState.PLAYING && (
        <GameEngine 
          onGameOver={handleGameOver} 
          onExit={goToMenu} 
          characterSkin={characterSkin}
        />
      )}

      {gameState === GameState.GAME_OVER && (
        <GameOver 
          score={finalScore} 
          onRestart={startGame} 
          onHome={goToMenu} 
          currentSkin={characterSkin}
        />
      )}

      {gameState === GameState.LEADERBOARD && (
        <Leaderboard onBack={goToMenu} />
      )}
    </div>
  );
}

export default App;
