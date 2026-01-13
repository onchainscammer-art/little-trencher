import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import useGameStore from '../../../stores/gameStore';

/**
 * ObstacleSpawner - Procedural generation of obstacles and tokens
 *
 * FIXED: Token spacing reduced to 15 units (was 40)
 * FIXED: Cluster spawn rate increased to 70% (was 30%)
 * FIXED: Added defensive checks to prevent NaN values
 */
const ObstacleSpawner = () => {
  // Subscribe to functions (stable, no re-renders) and gameState (changes rarely)
  const spawnObstacle = useGameStore(state => state.spawnObstacle);
  const spawnToken = useGameStore(state => state.spawnToken);
  // DO NOT subscribe to playerZ or speed (they change every frame)

  const lastObstacleZ = useRef(0);
  const lastTokenZ = useRef(0);
  const obstacleCounter = useRef(0);
  const tokenCounter = useRef(0);
  const lastGameState = useRef('menu');
  const debugFrameCounter = useRef(0);
  const gameStartFrame = useRef(0); // Track when game started

  // Reset spawn positions when game starts
  useEffect(() => {
    const currentGameState = useGameStore.getState().gameState;
    if (currentGameState === 'playing' && lastGameState.current !== 'playing') {
      const store = useGameStore.getState();
      // Initialize spawn positions ahead of player
      lastObstacleZ.current = (store.playerZ || 20) + 30; // Start spawning 30 units ahead
      lastTokenZ.current = (store.playerZ || 20) + 20; // Tokens spawn closer
      gameStartFrame.current = 0; // Reset frame counter
    }
    lastGameState.current = currentGameState;
  });

  // Obstacle types with weights (RugPit REMOVED for stability)
  const obstacleTypes = [
    { type: 'RedCandle', weight: 50 },
    { type: 'SellWall', weight: 50 }
  ];

  const getRandomObstacleType = () => {
    const totalWeight = obstacleTypes.reduce((sum, obj) => sum + obj.weight, 0);
    let random = Math.random() * totalWeight;

    for (const obstacle of obstacleTypes) {
      random -= obstacle.weight;
      if (random <= 0) return obstacle.type;
    }

    return obstacleTypes[0].type;
  };

  const getRandomLane = () => Math.floor(Math.random() * 3);

  useFrame(() => {
    // Get only the VALUES we need without subscribing (functions already subscribed above)
    const { gameState: currentGameState, playerZ, speed } = useGameStore.getState();

    if (currentGameState !== 'playing') return;

    // Wait 10 frames after game start to let everything initialize
    gameStartFrame.current++;
    if (gameStartFrame.current < 10) return;

    // Defensive: Ensure playerZ is valid
    const safePlayerZ = typeof playerZ === 'number' && !isNaN(playerZ) ? playerZ : 20;
    const spawnDistance = 50; // Spawn obstacles this far ahead

    // Spawn obstacles
    const obstacleSpacing = Math.max(12, 20 - speed * 10);

    // Debug: Log spawn conditions every 120 frames (~2 seconds)
    debugFrameCounter.current++;
    if (debugFrameCounter.current % 120 === 0) {
      console.log('[ObstacleSpawner] Debug state:', {
        gameState: currentGameState,
        playerZ: safePlayerZ,
        speed,
        lastObstacleZ: lastObstacleZ.current,
        spawnDistance,
        obstacleSpacing,
        shouldSpawn: safePlayerZ + spawnDistance > lastObstacleZ.current + obstacleSpacing,
        activeObstacles: useGameStore.getState().activeObstacles.length
      });
    }

    // Ensure we always spawn ahead of player
    if (lastObstacleZ.current < safePlayerZ) {
      lastObstacleZ.current = safePlayerZ;
    }

    if (safePlayerZ + spawnDistance > lastObstacleZ.current + obstacleSpacing) {
      const zPosition = Math.max(
        lastObstacleZ.current + obstacleSpacing,
        safePlayerZ + spawnDistance - 10
      );

      // Defensive: Ensure zPosition is valid
      if (typeof zPosition === 'number' && !isNaN(zPosition)) {
        const lane = getRandomLane();
        const type = getRandomObstacleType();

        const obstacleData = {
          id: `obstacle-${obstacleCounter.current++}`,
          type,
          lane,
          zPosition
        };

        console.log('[ObstacleSpawner] Spawning obstacle:', obstacleData);
        spawnObstacle(obstacleData);

        lastObstacleZ.current = zPosition;
      }
    }

    // Spawn tokens (FIXED: Reduced spacing from 40 to 15, increased spawn rate from 30% to 70%)
    const tokenSpacing = 15; // More frequent spawning

    // Ensure we always spawn ahead of player
    if (lastTokenZ.current < safePlayerZ) {
      lastTokenZ.current = safePlayerZ;
    }

    if (safePlayerZ + spawnDistance > lastTokenZ.current + tokenSpacing) {
      const zPosition = lastTokenZ.current + tokenSpacing;

      // Defensive: Ensure zPosition is valid
      if (typeof zPosition === 'number' && !isNaN(zPosition)) {
        // 70% chance of spawning a cluster (increased from 30%)
        if (Math.random() < 0.7) {
          const numTokens = Math.floor(Math.random() * 3) + 3; // 3-5 tokens
          const clusterLane = getRandomLane();

          // Spawn tokens in a tight cluster across lanes
          for (let i = 0; i < numTokens; i++) {
            const lane = (clusterLane + Math.floor(i / 2)) % 3;
            const offsetZ = (i % 2) * 1.5;

            spawnToken({
              id: `token-${tokenCounter.current++}`,
              lane,
              zPosition: zPosition + offsetZ
            });
          }
        }

        lastTokenZ.current = zPosition;
      }
    }
  });

  return null;
};

export default ObstacleSpawner;
