
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Pause, Play, LogOut, Volume2, VolumeX, Zap } from 'lucide-react';
import { GameItem, Particle, ItemType, CharacterId } from '../types';
import { GAME_CONSTANTS } from '../constants';
import { Button } from './Button';
import { soundManager } from '../utils/audio';
import { Player } from './Player';

interface GameEngineProps {
  onGameOver: (score: number) => void;
  onExit: () => void;
  characterSkin: CharacterId;
}

export const GameEngine: React.FC<GameEngineProps> = ({ onGameOver, onExit, characterSkin }) => {
  // Game State
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.isMuted());
  const [speedBoostActive, setSpeedBoostActive] = useState(false);
  const [isCatching, setIsCatching] = useState(false);
  
  // Refs for loop performance & logic
  const playerXRef = useRef(50); // 0-100%
  const prevPlayerXRef = useRef(50); // For animation detection
  const itemsRef = useRef<GameItem[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const lastTimeRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);
  const gameActiveRef = useRef(false);
  const scoreRef = useRef(0);
  const speedBoostTimerRef = useRef<number>(0);
  const isPausedRef = useRef(false); // Ref to track pause state inside event listeners
  const catchTimerRef = useRef<number | null>(null);
  
  // DOM Refs
  const playerElementRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Sync Ref with State ---
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // --- Controls ---

  const togglePause = useCallback(() => {
    soundManager.play('click');
    setIsPaused(prev => {
      const next = !prev;
      isPausedRef.current = next; // Update ref immediately for logic that might run before effect
      if (!next) {
        lastTimeRef.current = performance.now();
      }
      return next;
    });
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (isPausedRef.current || !gameActiveRef.current) return;
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    playerXRef.current = percentage;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent | React.TouchEvent) => {
    if (isPausedRef.current || !gameActiveRef.current) return;
    const container = containerRef.current;
    if (!container) return;
    
    const touch = e.touches[0];
    const rect = container.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    playerXRef.current = percentage;
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Pause functionality on Escape
    if (e.key === 'Escape') {
      if (gameActiveRef.current) {
        togglePause();
      }
      return;
    }

    if (isPausedRef.current || !gameActiveRef.current) return;
    
    // Base speed + Boost Multiplier for PLAYER
    const baseSpeed = 4;
    const multiplier = speedBoostTimerRef.current > 0 ? GAME_CONSTANTS.SPEED_BOOST_MULTIPLIER : 1;
    const speed = baseSpeed * multiplier;

    if (e.key === 'ArrowLeft' || e.key === 'a') {
      playerXRef.current = Math.max(0, playerXRef.current - speed);
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
      playerXRef.current = Math.min(100, playerXRef.current + speed);
    }
  }, [togglePause]);

  // --- Game Logic ---

  const getSpawnedItemType = (): ItemType => {
    const rand = Math.random();
    // Simple cumulative probability
    if (rand < GAME_CONSTANTS.CHANCE_BOMB) return 'bomb';
    if (rand < GAME_CONSTANTS.CHANCE_BOMB + GAME_CONSTANTS.CHANCE_GOLDBAG) return 'goldbag';
    if (rand < GAME_CONSTANTS.CHANCE_BOMB + GAME_CONSTANTS.CHANCE_GOLDBAG + GAME_CONSTANTS.CHANCE_DIAMOND) return 'diamond';
    if (rand < GAME_CONSTANTS.CHANCE_BOMB + GAME_CONSTANTS.CHANCE_GOLDBAG + GAME_CONSTANTS.CHANCE_DIAMOND + GAME_CONSTANTS.CHANCE_SPEED_BOOST) return 'speed_boost';
    
    return 'money';
  };

  const spawnItem = () => {
    const type = getSpawnedItemType();
    
    // Difficulty Progression: "Layer by layer"
    const scoreTier = Math.floor(scoreRef.current / 50);
    const speedIncrease = Math.min(10, scoreTier * 0.5); // Cap extra speed at 10

    const minSpeed = GAME_CONSTANTS.MIN_SPEED + speedIncrease;
    const maxSpeed = GAME_CONSTANTS.MAX_SPEED + speedIncrease;

    const newItem: GameItem = {
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * 90 + 5, // Avoid extreme edges
      y: -80,
      type,
      speed: minSpeed + Math.random() * (maxSpeed - minSpeed), 
      rotation: Math.random() * 360,
    };
    itemsRef.current.push(newItem);
  };

  const createExplosion = (x: number, y: number, color: string) => {
    for (let i = 0; i < 15; i++) {
      particlesRef.current.push({
        id: Math.random().toString(),
        x,
        y,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        life: 1.0,
        color
      });
    }
  };

  const triggerCatchAnimation = () => {
      setIsCatching(true);
      if (catchTimerRef.current) clearTimeout(catchTimerRef.current);
      catchTimerRef.current = window.setTimeout(() => {
          setIsCatching(false);
      }, 300); // match css animation duration
  };

  const checkCollisions = (containerHeight: number, containerWidth: number) => {
    const playerWidthPx = (containerWidth * GAME_CONSTANTS.PLAYER_WIDTH_PERCENT) / 100;
    const playerXPx = (containerWidth * playerXRef.current) / 100;
    const playerYPx = containerHeight - GAME_CONSTANTS.PLAYER_Y_OFFSET_PX; 
    const playerHitboxSize = playerWidthPx * 0.6;

    itemsRef.current = itemsRef.current.filter(item => {
      // Adjusted collision height window for better feeling with new models
      if (item.y > playerYPx - 60 && item.y < playerYPx + 60) {
        const itemXPx = (containerWidth * item.x) / 100;
        
        if (Math.abs(itemXPx - playerXPx) < playerHitboxSize) {
          // Collision Handler
          if (item.type === 'bomb') {
            createExplosion(item.x, item.y, 'red');
            soundManager.play('bomb');
            gameOver();
            return false;
          } 
          
          if (item.type === 'speed_boost') {
            speedBoostTimerRef.current = GAME_CONSTANTS.SPEED_BOOST_DURATION;
            setSpeedBoostActive(true); 
            createExplosion(item.x, item.y, '#3b82f6'); // Blue
            soundManager.play('powerup');
            return false;
          }

          // Scoring Items
          let points = GAME_CONSTANTS.POINTS_MONEY;
          let color = '#86efac';
          let sound: 'coin' | 'goldbag' | 'diamond' = 'coin';

          if (item.type === 'goldbag') {
            points = GAME_CONSTANTS.POINTS_GOLDBAG;
            color = '#fbbf24';
            sound = 'goldbag';
          } else if (item.type === 'diamond') {
            points = GAME_CONSTANTS.POINTS_DIAMOND;
            color = '#60a5fa'; // Blueish
            sound = 'diamond';
          }

          scoreRef.current += points;
          setScore(scoreRef.current);
          createExplosion(item.x, item.y, color);
          soundManager.play(sound);
          triggerCatchAnimation(); // Trigger player visual reaction
          return false; 
        }
      }
      
      if (item.y > containerHeight + 100) return false;
      return true;
    });
  };

  const gameOver = () => {
    gameActiveRef.current = false;
    soundManager.play('gameover');
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    setTimeout(() => {
      onGameOver(scoreRef.current);
    }, 500);
  };

  const update = (time: number) => {
    if (!gameActiveRef.current || isPausedRef.current) {
      animationFrameRef.current = requestAnimationFrame(update);
      return;
    }

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    // 0. Update Boost Timer
    if (speedBoostTimerRef.current > 0) {
      speedBoostTimerRef.current -= deltaTime;
      if (speedBoostTimerRef.current <= 0) {
        setSpeedBoostActive(false);
      }
    }

    // 1. Spawning Logic
    spawnTimerRef.current += deltaTime;
    const scoreSpawnMod = Math.min(200, scoreRef.current * 0.2); 
    const currentSpawnRate = Math.max(200, GAME_CONSTANTS.SPAWN_RATE_MS - scoreSpawnMod);
    
    if (spawnTimerRef.current > currentSpawnRate) {
      spawnItem();
      spawnTimerRef.current = 0;
    }

    // 2. Move Items
    const containerHeight = containerRef.current?.clientHeight || window.innerHeight;
    const containerWidth = containerRef.current?.clientWidth || window.innerWidth;

    // Apply falling speed boost multiplier if active (1.5x speed)
    const fallingSpeedMultiplier = speedBoostTimerRef.current > 0 ? 1.5 : 1;

    itemsRef.current.forEach(item => {
      item.y += item.speed * fallingSpeedMultiplier * (deltaTime / 16);
      item.rotation += 2;
    });

    // 3. Move Particles
    particlesRef.current = particlesRef.current.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.03;
      return p.life > 0;
    });

    // 4. Collision
    checkCollisions(containerHeight, containerWidth);

    // 5. Update DOM & Animation State
    if (playerElementRef.current) {
      playerElementRef.current.style.left = `${playerXRef.current}%`;
      
      const deltaX = Math.abs(playerXRef.current - prevPlayerXRef.current);
      if (deltaX > 0.1) {
        if (!playerElementRef.current.classList.contains('walking')) {
          playerElementRef.current.classList.add('walking');
          playerElementRef.current.classList.remove('idle');
        }
      } else {
        if (playerElementRef.current.classList.contains('walking')) {
          playerElementRef.current.classList.remove('walking');
          playerElementRef.current.classList.add('idle');
        }
      }
      prevPlayerXRef.current = playerXRef.current;
    }
    
    // Force re-render for items
    setRenderTick(t => t + 1);

    animationFrameRef.current = requestAnimationFrame(update);
  };

  const [, setRenderTick] = useState(0);

  // --- Lifecycle ---

  useEffect(() => {
    // Initial Setup
    window.addEventListener('keydown', handleKeyDown);
    scoreRef.current = 0;
    setScore(0);
    
    // Start game immediately
    gameActiveRef.current = true;
    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
    // Re-bind if handleKeyDown changes (e.g. if we used state instead of refs)
  }, [handleKeyDown]);

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    soundManager.setMuted(newState);
    if (!newState) soundManager.play('click');
  };

  const handleExit = () => {
      soundManager.play('click');
      onExit();
  }

  const getItemIcon = (type: ItemType) => {
    switch (type) {
      case 'bomb': return '💣';
      case 'goldbag': return '💰';
      case 'diamond': return '💎';
      case 'speed_boost': return '⚡';
      default: return '💵';
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-sky-100 overflow-hidden cursor-none select-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* Background Animated Clouds */}
      <div className="cloud" style={{ top: '10%', left: '-10%', width: '150px', animationDuration: '40s' }}>
         <svg viewBox="0 0 100 60" className="w-full text-white fill-current opacity-80"><path d="M10,40 Q20,20 40,30 Q50,10 70,30 Q90,30 90,50 Q90,60 10,60 Z" /></svg>
      </div>
      <div className="cloud" style={{ top: '25%', left: '-10%', width: '100px', animationDuration: '30s', animationDelay: '5s' }}>
         <svg viewBox="0 0 100 60" className="w-full text-white fill-current opacity-60"><path d="M10,40 Q20,20 40,30 Q50,10 70,30 Q90,30 90,50 Q90,60 10,60 Z" /></svg>
      </div>
      <div className="cloud" style={{ top: '15%', left: '-10%', width: '180px', animationDuration: '55s', animationDelay: '15s' }}>
         <svg viewBox="0 0 100 60" className="w-full text-white fill-current opacity-70"><path d="M10,40 Q20,20 40,30 Q50,10 70,30 Q90,30 90,50 Q90,60 10,60 Z" /></svg>
      </div>
       <div className="cloud" style={{ top: '40%', left: '-10%', width: '120px', animationDuration: '45s', animationDelay: '25s' }}>
         <svg viewBox="0 0 100 60" className="w-full text-white fill-current opacity-50"><path d="M10,40 Q20,20 40,30 Q50,10 70,30 Q90,30 90,50 Q90,60 10,60 Z" /></svg>
      </div>

      {/* Game Stats & Controls */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20 pointer-events-none">
        <div className="flex flex-col gap-2">
            <div className="bg-white/80 backdrop-blur rounded-xl px-4 py-2 shadow-lg border border-green-200">
                <span className="text-sm text-gray-500 block">Score</span>
                <span className="text-3xl font-mono font-bold text-green-600">${score}</span>
            </div>
            {speedBoostActive && (
                <div className="bg-blue-100/90 backdrop-blur rounded-full px-3 py-1 shadow-lg border border-blue-300 flex items-center gap-1 animate-pulse">
                    <Zap className="w-4 h-4 text-blue-600 fill-current" />
                    <span className="text-xs font-bold text-blue-700">加速中!</span>
                </div>
            )}
        </div>
        
        <div className="flex gap-2 pointer-events-auto">
          <button onClick={toggleMute} className="bg-white/80 p-3 rounded-full shadow hover:bg-white active:scale-95 transition">
             {isMuted ? <VolumeX className="w-6 h-6 text-gray-500" /> : <Volume2 className="w-6 h-6 text-blue-600" />}
          </button>
          <button onClick={togglePause} className="bg-white/80 p-3 rounded-full shadow hover:bg-white active:scale-95 transition">
             {isPaused ? <Play className="w-6 h-6 text-green-600" /> : <Pause className="w-6 h-6 text-blue-600" />}
          </button>
        </div>
      </div>

      {/* Pause Menu */}
      {isPaused && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-40 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col gap-4 items-center animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-gray-700">游戏暂停</h2>
            <Button onClick={togglePause} className="w-48">
              <Play className="w-5 h-5" /> 继续游戏
            </Button>
            <Button onClick={handleExit} variant="danger" className="w-48">
              <LogOut className="w-5 h-5" /> 退出游戏
            </Button>
          </div>
        </div>
      )}

      {/* Player Character */}
      <div 
        ref={playerElementRef}
        className="absolute bottom-2 transform -translate-x-1/2 transition-transform duration-75 ease-out will-change-transform z-10 idle"
        style={{ 
          left: '50%',
          width: `${GAME_CONSTANTS.PLAYER_WIDTH_PERCENT}%`,
        }}
      >
        <div className="relative flex flex-col items-center">
             <Player 
                skin={characterSkin} 
                isSpeedBoostActive={speedBoostActive} 
                isCatching={isCatching}
             />
        </div>
      </div>

      {/* Falling Items */}
      {itemsRef.current.map(item => (
        <div
          key={item.id}
          className="absolute flex items-center justify-center pointer-events-none falling-item"
          style={{
            transform: `translate(${window.innerWidth * (item.x / 100)}px, ${item.y}px) rotate(${item.rotation}deg)`,
            fontSize: item.type === 'money' ? '2.5rem' : item.type === 'goldbag' ? '3rem' : '2.5rem',
            left: 0, 
            top: 0,
            width: '50px',
            height: '50px',
            marginLeft: '-25px', 
            marginTop: '-25px'
          }}
        >
          <span className="filter drop-shadow-md">{getItemIcon(item.type)}</span>
        </div>
      ))}

      {/* Particles (Explosions) */}
      {particlesRef.current.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${(window.innerWidth * (p.x / 100))}px`,
            top: `${p.y}px`,
            width: '10px',
            height: '10px',
            backgroundColor: p.color,
            opacity: p.life,
            transform: 'scale(' + p.life + ') translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
};
