import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Link } from 'react-router-dom';
import useGameStore, { LANE_POSITIONS } from '../stores/gameStore';
import * as THREE from 'three';

// Game components
import GameLoop from '../components/game/core/GameLoop';
import SolanaToken from '../components/game/collectibles/SolanaToken';
import RedCandle from '../components/game/obstacles/RedCandle';
import SellWall from '../components/game/obstacles/SellWall';
import RugPit from '../components/game/obstacles/RugPit';
import ObstacleSpawner from '../components/game/obstacles/ObstacleSpawner';
import TrackFloor from '../components/game/environment/TrackFloor';

const WorldRenderer = () => {
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.6} />

      {/* Main directional light - simplified shadows */}
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-camera-far={50}
      />

      {/* Fill light - single light instead of two */}
      <directionalLight position={[-10, 10, -10]} intensity={0.5} color="#60A5FA" />

      {/* Infinite Track Floor with Rails, Ties & Barriers */}
      <TrackFloor />

      {/* Fog */}
      <fog attach="fog" args={['#0f172a', 15, 50]} />

      {/* Sky color */}
      <color attach="background" args={['#0f172a']} />
    </>
  );
};

const Trencher = ({ lane }) => {
  const groupRef = useRef();
  const smokeTime = useRef(0);
  // DO NOT subscribe to playerZ - it changes 60 times/sec and causes re-renders

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Get playerZ directly without subscription
    const playerZ = useGameStore.getState().playerZ;

    // Smooth lane transition using lerp
    const targetX = LANE_POSITIONS[lane];
    const currentX = groupRef.current.position.x;
    const newX = THREE.MathUtils.lerp(currentX, targetX, Math.min(delta * 10, 1));

    groupRef.current.position.x = newX;
    groupRef.current.position.z = playerZ; // Train moves with player!

    smokeTime.current += delta;
  });

  return (
    <group ref={groupRef} position={[0, 0.5, 0]}>
      {/* Main train body - larger and more detailed */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2, 1.2, 2.5]} />
        <meshStandardMaterial
          color="#3B82F6"
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>

      {/* Front nose/cowcatcher */}
      <mesh position={[0, -0.3, 1.5]} castShadow>
        <boxGeometry args={[1.8, 0.3, 0.5]} />
        <meshStandardMaterial
          color="#1E40AF"
          metalness={0.6}
          roughness={0.5}
        />
      </mesh>

      {/* Cabin top */}
      <mesh position={[0, 0.8, -0.3]} castShadow>
        <boxGeometry args={[1.6, 0.8, 1.5]} />
        <meshStandardMaterial
          color="#60A5FA"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Smokestack - taller and more prominent */}
      <mesh position={[0, 1.8, 0.3]} castShadow>
        <cylinderGeometry args={[0.25, 0.3, 1, 12]} />
        <meshStandardMaterial
          color="#1E40AF"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Smokestack top rim */}
      <mesh position={[0, 2.35, 0.3]} castShadow>
        <cylinderGeometry args={[0.32, 0.25, 0.1, 12]} />
        <meshStandardMaterial
          color="#1E293B"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Smoke puffs */}
      <mesh position={[0, 2.8, 0.3]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial
          color="#E2E8F0"
          transparent
          opacity={0.7}
          emissive="#94A3B8"
          emissiveIntensity={0.3}
          roughness={1.0}
        />
      </mesh>

      {/* Big eyes - more prominent */}
      <mesh position={[-0.5, 0.4, 1.3]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial color="white" />
      </mesh>
      <mesh position={[0.5, 0.4, 1.3]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial color="white" />
      </mesh>

      {/* Pupils */}
      <mesh position={[-0.5, 0.4, 1.5]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#1E40AF" />
      </mesh>
      <mesh position={[0.5, 0.4, 1.5]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#1E40AF" />
      </mesh>

      {/* Eye shine highlights */}
      <mesh position={[-0.45, 0.45, 1.52]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="white" />
      </mesh>
      <mesh position={[0.55, 0.45, 1.52]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="white" />
      </mesh>

      {/* Wheels - 4 visible wheels with detail */}
      {[-0.7, 0.7].map((x, i) => (
        <group key={`wheel-${i}`}>
          {/* Front wheel */}
          <mesh position={[x, -0.8, 0.8]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
            <meshStandardMaterial
              color="#1F2937"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          {/* Front wheel inner detail */}
          <mesh position={[x, -0.8, 0.8]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.32, 16]} />
            <meshStandardMaterial
              color="#374151"
              metalness={0.5}
              roughness={0.4}
            />
          </mesh>

          {/* Back wheel */}
          <mesh position={[x, -0.8, -0.8]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
            <meshStandardMaterial
              color="#1F2937"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          {/* Back wheel inner detail */}
          <mesh position={[x, -0.8, -0.8]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.32, 16]} />
            <meshStandardMaterial
              color="#374151"
              metalness={0.5}
              roughness={0.4}
            />
          </mesh>
        </group>
      ))}

      {/* Headlight */}
      <mesh position={[0, 0.2, 1.6]}>
        <cylinderGeometry args={[0.15, 0.2, 0.2, 12]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial
          color="#FCD34D"
          emissive="#FCD34D"
          emissiveIntensity={1.0}
          metalness={0.1}
          roughness={0.2}
        />
      </mesh>

      {/* Headlight beam */}
      <spotLight
        position={[0, 0.2, 1.8]}
        angle={0.5}
        penumbra={0.5}
        intensity={1}
        distance={15}
        color="#FCD34D"
        target-position={[0, 0, 10]}
      />
    </group>
  );
};

const CameraController = () => {
  // DO NOT subscribe to playerZ or lane - access directly to avoid re-renders

  useFrame(({ camera }) => {
    // Get state directly without subscription
    const { playerZ, lane } = useGameStore.getState();

    // Camera follows the train's lane position
    const targetX = LANE_POSITIONS[lane]; // Follow train horizontally
    const targetY = 4; // Above the train

    // Smooth follow for X and Y, locked Z
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.15);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.1);
    camera.position.z = playerZ - 8; // LOCKED to player (no lerp = no rubber-banding)

    // Look at point ahead of the train in the same lane
    camera.lookAt(targetX, 0, playerZ + 5);
  });

  return null;
};

// Obstacle renderer - Let Three.js handle frustum culling, no manual filtering
const ObstacleRenderer = React.memo(() => {
  const activeObstacles = useGameStore(state => state.activeObstacles);
  // DO NOT subscribe to playerZ - causes 60 re-renders/sec
  // Three.js has built-in frustum culling, we don't need manual filtering

  return (
    <>
      {activeObstacles.map((obstacle) => {
        switch (obstacle.type) {
          case 'RedCandle':
            return <RedCandle key={obstacle.id} lane={obstacle.lane} zPosition={obstacle.zPosition} />;
          case 'SellWall':
            return <SellWall key={obstacle.id} lane={obstacle.lane} zPosition={obstacle.zPosition} />;
          case 'RugPit':
            return <RugPit key={obstacle.id} lane={obstacle.lane} zPosition={obstacle.zPosition} />;
          default:
            return null;
        }
      })}
    </>
  );
});

// Token renderer - Let Three.js handle frustum culling, no manual filtering
const TokenRenderer = React.memo(() => {
  const activeTokens = useGameStore(state => state.activeTokens);
  // DO NOT subscribe to playerZ - causes 60 re-renders/sec
  // Three.js has built-in frustum culling, we don't need manual filtering

  return (
    <>
      {activeTokens.map((token) => (
        <SolanaToken
          key={token.id}
          id={token.id}
          lane={token.lane}
          zPosition={token.zPosition}
        />
      ))}
    </>
  );
});

const GameHUD = () => {
  const bag = useGameStore(state => state.bag);
  // DO NOT subscribe to distance - it updates 60fps causing DOM thrashing
  const distanceRef = useRef(null);

  // Update distance text directly via DOM manipulation (bypasses React)
  useEffect(() => {
    const interval = setInterval(() => {
      if (distanceRef.current) {
        const distance = useGameStore.getState().distance;
        distanceRef.current.textContent = `${Math.floor(distance)}m`;
      }
    }, 100); // Update 10 times/sec instead of 60

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-16 left-0 right-0 z-40 pointer-events-none">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-start">
          {/* BAG counter */}
          <div className="bg-slate-900/90 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-green-500 shadow-lg">
            <div className="text-green-400 font-mono text-xl md:text-2xl font-bold">
              BAG: {bag.toFixed(1)} SOL
            </div>
          </div>

          {/* Distance - updated via direct DOM manipulation */}
          <div className="bg-slate-900/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-blue-500/50 shadow-lg">
            <div ref={distanceRef} className="text-blue-400 font-mono text-sm">
              0m
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StartScreen = () => {
  const startGame = useGameStore(state => state.startGame);
  const highScore = useGameStore(state => state.highScore);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="text-center px-4 max-w-2xl w-full">
        <h1 className="text-3xl md:text-4xl font-mono text-green-400 mb-6 font-bold mt-16">
          The Train Game
        </h1>

        <div className="bg-slate-800 p-6 rounded-lg border-2 border-green-500 mb-8">
          <p className="text-xl md:text-2xl text-slate-300 font-mono mb-4">
            Collect <span className="text-purple-400">0.1 SOL</span> tokens
          </p>
          <p className="text-xl md:text-2xl text-slate-300 font-mono mb-4">
            Avoid <span className="text-red-400">Red Candles</span> and <span className="text-slate-400">Sell Walls</span>
          </p>
        </div>

        {/* Controls */}
        <div className="bg-slate-800 p-6 rounded-lg border-2 border-blue-500 mb-8">
          <h3 className="text-2xl font-mono text-blue-400 mb-4">CONTROLS</h3>

          {/* Desktop controls */}
          <div className="hidden md:block mb-4">
            <p className="text-lg text-slate-300 font-mono">
              <span className="text-green-400">←</span> Left Lane • <span className="text-green-400">→</span> Right Lane
            </p>
          </div>

          {/* Mobile controls */}
          <div className="md:hidden">
            <p className="text-lg text-slate-300 font-mono mb-2">
              Tap <span className="text-green-400">LEFT</span> or <span className="text-green-400">RIGHT</span> to switch lanes
            </p>
          </div>
        </div>

        {/* High score */}
        {highScore > 0 && (
          <div className="bg-slate-800 p-4 rounded-lg border-2 border-yellow-500 mb-8">
            <p className="text-lg text-yellow-400 font-mono">
              HIGH SCORE: {highScore.toFixed(1)} SOL
            </p>
          </div>
        )}

        {/* Start button */}
        <button
          onClick={startGame}
          className="px-12 py-4 bg-green-600 hover:bg-green-500 text-white text-2xl font-mono rounded-lg transition-colors pointer-events-auto border-2 border-green-400"
        >
          START GAME
        </button>

        {/* Back link */}
        <div className="mt-8">
          <Link
            to="/"
            className="text-slate-400 hover:text-slate-300 font-mono pointer-events-auto"
          >
            Back to Story
          </Link>
        </div>
      </div>
    </div>
  );
};

const GameOverScreen = () => {
  const bag = useGameStore(state => state.bag);
  const distance = useGameStore(state => state.distance);
  const deathMessage = useGameStore(state => state.deathMessage);
  const highScore = useGameStore(state => state.highScore);
  const resetGame = useGameStore(state => state.resetGame);

  const isNewHighScore = bag === highScore && bag > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="text-center px-4 max-w-2xl w-full">
        <h1 className="text-3xl md:text-5xl font-mono text-red-400 mb-6 font-bold">
          {deathMessage}
        </h1>

        <div className="bg-slate-800 p-8 rounded-lg border-2 border-red-500 mb-8">
          <div className="mb-6">
            <p className="text-2xl text-slate-300 font-mono mb-2">
              FINAL BAG
            </p>
            <p className="text-5xl text-green-400 font-mono font-bold">
              {bag.toFixed(1)} SOL
            </p>
          </div>

          <div className="mb-6">
            <p className="text-lg text-slate-400 font-mono">
              Distance: {Math.floor(distance)}m
            </p>
          </div>

          {isNewHighScore && (
            <div className="bg-yellow-600/20 border-2 border-yellow-400 rounded-lg p-4 mb-4">
              <p className="text-2xl text-yellow-400 font-mono font-bold">
                🏆 NEW HIGH SCORE! 🏆
              </p>
            </div>
          )}

          {!isNewHighScore && highScore > 0 && (
            <div className="text-slate-500 font-mono text-sm">
              High Score: {highScore.toFixed(1)} SOL
            </div>
          )}
        </div>

        {/* Retry button */}
        <button
          onClick={resetGame}
          className="px-12 py-4 bg-green-600 hover:bg-green-500 text-white text-2xl font-mono rounded-lg transition-colors pointer-events-auto border-2 border-green-400 mb-4"
        >
          TRY AGAIN
        </button>

        {/* Back link */}
        <div className="mt-4">
          <Link
            to="/"
            className="text-slate-400 hover:text-slate-300 font-mono pointer-events-auto"
          >
            Back to Story
          </Link>
        </div>
      </div>
    </div>
  );
};

const Game = () => {
  const gameState = useGameStore(state => state.gameState);
  const lane = useGameStore(state => state.lane);
  const switchLane = useGameStore(state => state.switchLane);
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);

  // Detect if this is a touch device
  React.useEffect(() => {
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(hasTouchScreen);
  }, []);

  // Keyboard controls
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return;

      if (e.key === 'ArrowLeft') {
        switchLane(1); // Move LEFT (direction inverted to fix controls)
      } else if (e.key === 'ArrowRight') {
        switchLane(-1); // Move RIGHT (direction inverted to fix controls)
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, switchLane]);

  // Touch controls - MOBILE ONLY, swipe in direction you want to go
  const handleTouch = (e) => {
    if (gameState !== 'playing') return;

    // CRITICAL: Only handle actual touch events on touch devices
    // Ignore mouse clicks on desktop (even if they trigger touchstart)
    if (e.type === 'touchstart') {
      // This is a real touch event
      if (!e.touches || e.touches.length === 0) return;

      const touch = e.touches[0];
      const screenWidth = window.innerWidth;
      const x = touch.clientX;

      if (x < screenWidth / 2) {
        switchLane(-1); // Left half = move LEFT
      } else {
        switchLane(1); // Right half = move RIGHT
      }
    }
    // Ignore all other event types (mousedown, pointerdown, etc.)
  };

  return (
    <div className="w-screen h-screen bg-slate-900 flex flex-col relative overflow-hidden">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-green-500/30">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="font-mono text-xl text-green-400 break-words max-w-[60vw]">
            The Train Game
          </h1>
          <Link
            to="/"
            className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors font-mono text-sm"
          >
            Back
          </Link>
        </div>
      </nav>

      {/* Touch handler (invisible, touch devices only) */}
      {gameState === 'playing' && isTouchDevice && (
        <div
          className="fixed inset-0 z-30"
          onTouchStart={handleTouch}
          style={{ touchAction: 'none' }}
        />
      )}

      {/* 3D Canvas - FULL SCREEN */}
      <div className="absolute inset-0 w-full h-full">
        <Canvas
          shadows={{ type: 'basic' }}
          camera={{ position: [0, 4, -8], fov: 70 }}
          dpr={[1, 1.5]}
          performance={{ min: 0.5 }}
          gl={{
            antialias: false,
            powerPreference: 'high-performance',
            alpha: false
          }}
          style={{ width: '100%', height: '100%', touchAction: 'none' }}
        >
          <Suspense fallback={null}>
            <WorldRenderer />

            {gameState === 'playing' && (
              <>
                <CameraController />
                <Trencher lane={lane} />
                <GameLoop />
                <ObstacleSpawner />
                <ObstacleRenderer />
                <TokenRenderer />
              </>
            )}
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlays */}
      {gameState === 'playing' && <GameHUD />}
      {gameState === 'menu' && <StartScreen />}
      {gameState === 'gameOver' && <GameOverScreen />}
    </div>
  );
};

export default Game;
