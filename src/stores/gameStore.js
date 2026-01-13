import { create } from 'zustand';

// Lane positions for collision detection
export const LANE_POSITIONS = [-5, 0, 5]; // X coordinates for left/center/right (WIDENED for visibility)
export const LANE_WIDTH = 3;
export const COLLISION_DISTANCE = 2;

// Game constants
export const INITIAL_SPEED = 0.2;
export const MAX_SPEED = 0.35; // Capped at 0.35 for stable performance
export const SPEED_INCREMENT = 0.0005; // Gradual speed increase (slower than before)
export const TOKEN_VALUE = 0.1; // SOL per token

// Death messages
const DEATH_MESSAGES = {
  RedCandle: "LIQUIDATED BY RED CANDLE",
  SellWall: "CRUSHED BY SELL WALL",
  RugPit: "RUGGED INTO THE VOID",
  default: "REKT"
};

const useGameStore = create((set, get) => ({
  // Core game state
  gameState: 'menu', // 'menu' | 'playing' | 'gameOver'
  bag: 0.0, // SOL collected
  lane: 1, // 0=left, 1=center, 2=right
  speed: INITIAL_SPEED,
  playerZ: 0, // Forward position
  distance: 0, // Total distance traveled (for scoring)

  // Obstacles and collectibles
  activeObstacles: [], // [{ id, type, lane, zPosition }]
  activeTokens: [], // [{ id, lane, zPosition }]

  // Game over state
  deathMessage: '',

  // High score (persisted to localStorage)
  highScore: parseFloat(localStorage.getItem('trencher-high-score') || '0'),

  // Actions
  startGame: async () => {
    // Start background music
    if (typeof window !== 'undefined') {
      try {
        const audioModule = await import('../utils/audioManager');
        await audioModule.default.init();
        audioModule.default.startBackgroundMusic();
      } catch (error) {
        console.warn('Audio failed to start:', error);
      }
    }
    
    set({
      gameState: 'playing',
      bag: 0.0,
      lane: 1,
      speed: INITIAL_SPEED,
      playerZ: 20, // Start ahead so camera (at playerZ-8) is within track bounds
      distance: 0,
      activeObstacles: [],
      activeTokens: [],
      deathMessage: ''
    });
  },

  resetGame: () => {
    // Stop background music
    if (typeof window !== 'undefined') {
      import('../utils/audioManager').then(module => {
        module.default.stopBackgroundMusic();
      });
    }
    
    set({
      gameState: 'menu',
      bag: 0.0,
      lane: 1,
      speed: INITIAL_SPEED,
      playerZ: 0,
      distance: 0,
      activeObstacles: [],
      activeTokens: [],
      deathMessage: ''
    });
  },

  // Lane switching with bounds checking
  switchLane: (direction) => {
    const currentLane = get().lane;
    const newLane = Math.max(0, Math.min(2, currentLane + direction));
    if (newLane !== currentLane) {
      set({ lane: newLane });
    }
  },

  // Collect token - increment bag by 0.1 SOL
  collectToken: (tokenId) => {
    const currentBag = get().bag;
    const newBag = parseFloat((currentBag + TOKEN_VALUE).toFixed(1));

    // Remove token from active tokens
    set(state => ({
      bag: newBag,
      activeTokens: state.activeTokens.filter(t => t.id !== tokenId)
    }));

    // Play coin pickup sound (non-blocking)
    if (typeof window !== 'undefined') {
      import('../utils/audioManager').then(module => {
        module.default.playCoinSound();
      }).catch(() => {
        // Silently fail if audio not available
      });
    }

    // Update high score if needed
    const highScore = get().highScore;
    if (newBag > highScore) {
      localStorage.setItem('trencher-high-score', newBag.toString());
      set({ highScore: newBag });
    }
  },

  // Increase speed (FOMO curve acceleration)
  increaseSpeed: () => {
    const currentSpeed = get().speed;
    if (currentSpeed < MAX_SPEED) {
      set({ speed: Math.min(MAX_SPEED, currentSpeed + SPEED_INCREMENT) });
    }
  },

  // Update player forward position
  updatePlayerZ: (deltaZ) => {
    set(state => ({
      playerZ: state.playerZ + deltaZ,
      distance: state.distance + deltaZ
    }));
  },

  // Trigger game over
  triggerGameOver: (obstacleType = 'default') => {
    const message = DEATH_MESSAGES[obstacleType] || DEATH_MESSAGES.default;
    const finalBag = get().bag;
    const highScore = get().highScore;

    // Update high score if needed
    if (finalBag > highScore) {
      localStorage.setItem('trencher-high-score', finalBag.toString());
      set({ highScore: finalBag });
    }

    set({
      gameState: 'gameOver',
      deathMessage: message
    });
  },

  // Obstacle management
  spawnObstacle: (obstacle) => {
    set(state => ({
      activeObstacles: [...state.activeObstacles, obstacle]
    }));
  },

  removeObstacle: (obstacleId) => {
    set(state => ({
      activeObstacles: state.activeObstacles.filter(o => o.id !== obstacleId)
    }));
  },

  cleanupObstacles: (behindDistance = 20) => {
    const { playerZ, activeObstacles } = get();
    const filtered = activeObstacles.filter(
      o => o.zPosition > playerZ - behindDistance
    );
    // Only update state if something was actually removed
    if (filtered.length !== activeObstacles.length) {
      set({ activeObstacles: filtered });
    }
  },

  // Token management
  spawnToken: (token) => {
    set(state => ({
      activeTokens: [...state.activeTokens, token]
    }));
  },

  removeToken: (tokenId) => {
    set(state => ({
      activeTokens: state.activeTokens.filter(t => t.id !== tokenId)
    }));
  },

  cleanupTokens: (behindDistance = 20) => {
    const { playerZ, activeTokens } = get();
    const filtered = activeTokens.filter(
      t => t.zPosition > playerZ - behindDistance
    );
    // Only update state if something was actually removed
    if (filtered.length !== activeTokens.length) {
      set({ activeTokens: filtered });
    }
  },

  // Collision detection helper
  checkCollisionWithObstacle: (obstacle) => {
    const { playerZ, lane } = get();
    const zOverlap = Math.abs(playerZ - obstacle.zPosition) < COLLISION_DISTANCE;
    const xOverlap = lane === obstacle.lane;
    return zOverlap && xOverlap;
  },

  checkCollisionWithToken: (token) => {
    const { playerZ, lane } = get();
    // STRICT collision - must be in same lane
    const zOverlap = Math.abs(playerZ - token.zPosition) < COLLISION_DISTANCE * 1.5;
    const xOverlap = lane === token.lane; // STRICT: Must be exact lane match
    return zOverlap && xOverlap;
  }
}));

export default useGameStore;
