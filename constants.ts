
export const GAME_CONSTANTS = {
  PLAYER_WIDTH_PERCENT: 8, // Reduced from 15 to 8 for better desktop scaling
  PLAYER_MIN_WIDTH_PX: 80, // Minimum width in pixels to prevent tiny character on mobile
  PLAYER_Y_OFFSET_PX: 110, // Distance of the catch zone from bottom
  SPAWN_RATE_MS: 450, // Initial spawn rate
  MIN_SPEED: 4, // Initial base speed (slightly lower to start)
  MAX_SPEED: 7, // Initial max base speed
  
  // Item Chances (Weights)
  CHANCE_BOMB: 0.15,
  CHANCE_GOLDBAG: 0.08,
  CHANCE_DIAMOND: 0.02, // Rare
  CHANCE_SPEED_BOOST: 0.03, // Occasional
  
  // Points
  POINTS_MONEY: 10,
  POINTS_GOLDBAG: 50,
  POINTS_DIAMOND: 100,
  
  // Powerups
  SPEED_BOOST_DURATION: 5000, // 5 seconds
  SPEED_BOOST_MULTIPLIER: 1.8,
  
  STORAGE_KEY: 'falling_money_leaderboard',
};