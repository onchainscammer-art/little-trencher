import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useGameStore from '../../../stores/gameStore';
import { LANE_POSITIONS } from '../../../stores/gameStore';

/**
 * TrackFloor - PERFORMANCE OPTIMIZED with InstancedMesh
 *
 * OPTIMIZATIONS:
 * - Uses InstancedMesh for ties (1 draw call instead of 500)
 * - Track teleports ahead when player approaches end (infinite effect)
 * - No shadows on ties (performance killer)
 * - Minimal shadows on rails
 */

const TRACK_LENGTH = 2000;
const TIE_SPACING = 4;
const NUM_TIES = Math.floor(TRACK_LENGTH / TIE_SPACING);
const TELEPORT_THRESHOLD = 1200; // Teleport when player is halfway through track for seamless transition

const TrackFloor = () => {
  const tiesRef = useRef();
  const groupRef = useRef();
  const trackOffsetRef = useRef(0); // How many times we've teleported

  // Set up instanced mesh positions ONCE on mount (centered around 0)
  useEffect(() => {
    if (tiesRef.current) {
      const matrix = new THREE.Matrix4();
      for (let i = 0; i < NUM_TIES; i++) {
        const z = -TRACK_LENGTH / 2 + i * TIE_SPACING; // Centered
        matrix.setPosition(0, -1.35, z);
        tiesRef.current.setMatrixAt(i, matrix);
      }
      tiesRef.current.instanceMatrix.needsUpdate = true;
    }
  }, []);

  // Keep track centered on player for infinite effect
  useFrame(() => {
    if (!groupRef.current) return;

    const playerZ = useGameStore.getState().playerZ;

    // Directly match player position - camera moves with player so this looks smooth
    groupRef.current.position.z = playerZ;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Ground plane - textured dark ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[30, TRACK_LENGTH]} />
        <meshStandardMaterial
          color="#1a2332"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* Rails - 2 per lane (6 total), no shadows for performance */}
      {LANE_POSITIONS.map((laneX, laneIdx) => (
        <group key={`lane-${laneIdx}`}>
          {/* Left rail */}
          <mesh position={[laneX - 0.8, -1.25, 0]}>
            <boxGeometry args={[0.25, 0.25, TRACK_LENGTH]} />
            <meshStandardMaterial
              color="#71717A"
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>

          {/* Right rail */}
          <mesh position={[laneX + 0.8, -1.25, 0]}>
            <boxGeometry args={[0.25, 0.25, TRACK_LENGTH]} />
            <meshStandardMaterial
              color="#71717A"
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>
        </group>
      ))}

      {/* Wooden ties - INSTANCED (1 draw call for all 500 ties) */}
      <instancedMesh ref={tiesRef} args={[null, null, NUM_TIES]} frustumCulled={false}>
        <boxGeometry args={[12, 0.15, 0.4]} />
        <meshStandardMaterial
          color="#78350f"
          roughness={0.9}
          metalness={0.0}
        />
      </instancedMesh>

      {/* Side barriers - dark walls with subtle reflection */}
      <mesh position={[-12, 2, 0]} receiveShadow>
        <boxGeometry args={[1, 6, TRACK_LENGTH]} />
        <meshStandardMaterial
          color="#0F172A"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[12, 2, 0]} receiveShadow>
        <boxGeometry args={[1, 6, TRACK_LENGTH]} />
        <meshStandardMaterial
          color="#0F172A"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
};

export default TrackFloor;
