export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
  LEADERBOARD = 'LEADERBOARD',
}

export type ItemType = 'money' | 'bomb' | 'goldbag' | 'diamond' | 'speed_boost';

export type CharacterId = 'boy' | 'girl' | 'cat' | 'robot' | 'dog' | 'alien';

export interface GameItem {
  id: string;
  x: number; // Percentage 0-100
  y: number; // Pixel position from top
  type: ItemType;
  speed: number;
  rotation: number;
}

export interface Player {
  x: number; // Percentage 0-100 (center of player)
  width: number; // Percentage of screen width
}

export interface ScoreEntry {
  id: string;
  name: string;
  score: number;
  date: string;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}