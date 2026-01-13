import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import useGameStore from '../../../stores/gameStore';

/**
 * GameLoop - Core game tick using useFrame
 *
 * EMERGENCY STABILIZATION:
 * - NO subscriptions to activeObstacles/activeTokens (prevents re-render hell)
 * - Access arrays directly via getState() inside useFrame
 * - Throttled cleanup (once per 60 frames)
 * - Proper cleanup distance (30 units BEHIND player)
 *
 * Handles:
 * - Forward movement (Z-axis progression)
 * - Collision detection with obstacles
 * - Token collection
 * - Speed ramping (FOMO curve)
 * - Cleanup of off-screen objects (throttled)
 */
const GameLoop = () => {
  // CRITICAL: Only subscribe to values that change infrequently
  // DO NOT subscribe to activeObstacles or activeTokens - they change constantly
  const gameState = useGameStore(state => state.gameState);

  // Throttle cleanup to prevent stuttering from frequent state updates
  const frameCount = useRef(0);
  const initFrameCount = useRef(0);

  useFrame((state, delta) => {
    // Only run game loop when playing
    if (gameState !== 'playing') {
      initFrameCount.current = 0; // Reset on state change
      return;
    }

    // Wait 5 frames after start to let everything initialize
    initFrameCount.current++;
    if (initFrameCount.current < 5) return;

    // Get current store state WITHOUT subscribing (no re-renders)
    const store = useGameStore.getState();
    const {
      speed,
      playerZ,
      activeObstacles,
      activeTokens,
      updatePlayerZ,
      increaseSpeed,
      triggerGameOver,
      collectToken,
      cleanupObstacles,
      cleanupTokens,
      checkCollisionWithObstacle,
      checkCollisionWithToken
    } = store;

    // DEFENSIVE: Cap delta time to prevent large jumps (e.g., tab switching)
    const cappedDelta = Math.min(delta, 0.1);

    // DEFENSIVE: Ensure speed is a valid number
    const safeSpeed = typeof speed === 'number' && !isNaN(speed) ? speed : 0.2;

    // Move player forward
    const moveAmount = safeSpeed * 60 * cappedDelta; // Normalize to 60 FPS

    // DEFENSIVE: Ensure moveAmount is valid before updating
    if (typeof moveAmount === 'number' && !isNaN(moveAmount) && moveAmount >= 0) {
      updatePlayerZ(moveAmount);
    }

    // Gradually increase speed (capped at 0.35 for performance)
    increaseSpeed();

    // Check collisions with obstacles
    if (Array.isArray(activeObstacles)) {
      for (const obstacle of activeObstacles) {
        if (obstacle && typeof obstacle.zPosition === 'number') {
          try {
            if (checkCollisionWithObstacle(obstacle)) {
              triggerGameOver(obstacle.type);
              return; // Stop processing after game over
            }
          } catch (error) {
            console.warn('Collision check failed:', error);
          }
        }
      }
    }

    // Check collisions with tokens
    if (Array.isArray(activeTokens)) {
      for (const token of activeTokens) {
        if (token && typeof token.zPosition === 'number') {
          try {
            if (checkCollisionWithToken(token)) {
              collectToken(token.id);
            }
          } catch (error) {
            console.warn('Token collection failed:', error);
          }
        }
      }
    }

    // Cleanup objects that are far BEHIND the player (THROTTLED to once per 60 frames)
    // Kill distance: playerZ - 30 (30 units behind player)
    frameCount.current++;
    if (frameCount.current % 60 === 0) {
      // DEFENSIVE: Ensure playerZ is valid before cleanup
      if (typeof playerZ === 'number' && !isNaN(playerZ)) {
        try {
          cleanupObstacles(30); // Remove obstacles 30 units BEHIND
          cleanupTokens(30);
        } catch (error) {
          console.warn('Cleanup failed:', error);
        }
      }
    }
  });

  // This component doesn't render anything visible
  return null;
};

export default GameLoop;
