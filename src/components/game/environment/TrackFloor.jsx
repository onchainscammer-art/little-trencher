import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { LANE_POSITIONS } from '../../../stores/gameStore';

/**
 * TrackFloor - SIMPLE STATIONARY INFINITE TRACK
 *
 * APPROACH:
 * - ONE long track (10km) positioned starting at z=0
 * - Track never moves - player moves through it
 * - Camera follows player so track appears to scroll
 * - Long enough for any reasonable game session
 * - NO React state updates = smooth 60fps
 */

const TRACK_LENGTH = 10000; // 10km track
const TIE_SPACING = 4;
const NUM_TIES = Math.floor(TRACK_LENGTH / TIE_SPACING);

const TrackFloor = () => {
  const tiesRef = useRef();

  // Set up instanced mesh positions ONCE on mount
  useEffect(() => {
    if (tiesRef.current) {
      const matrix = new THREE.Matrix4();
      for (let i = 0; i < NUM_TIES; i++) {
        const z = i * TIE_SPACING; // 0 to 10000
        matrix.setPosition(0, -1.35, z);
        tiesRef.current.setMatrixAt(i, matrix);
      }
      tiesRef.current.instanceMatrix.needsUpdate = true;
    }
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* Ground plane - positioned from 0 to TRACK_LENGTH */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, TRACK_LENGTH / 2]} receiveShadow>
        <planeGeometry args={[30, TRACK_LENGTH]} />
        <meshStandardMaterial
          color="#1a2332"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* Rails - 2 per lane (6 total) */}
      {LANE_POSITIONS.map((laneX, laneIdx) => (
        <group key={`lane-${laneIdx}`}>
          {/* Left rail */}
          <mesh position={[laneX - 0.8, -1.25, TRACK_LENGTH / 2]}>
            <boxGeometry args={[0.25, 0.25, TRACK_LENGTH]} />
            <meshStandardMaterial
              color="#71717A"
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>

          {/* Right rail */}
          <mesh position={[laneX + 0.8, -1.25, TRACK_LENGTH / 2]}>
            <boxGeometry args={[0.25, 0.25, TRACK_LENGTH]} />
            <meshStandardMaterial
              color="#71717A"
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>
        </group>
      ))}

      {/* Wooden ties - INSTANCED (1 draw call for all ties) */}
      <instancedMesh ref={tiesRef} args={[null, null, NUM_TIES]} frustumCulled={false}>
        <boxGeometry args={[12, 0.15, 0.4]} />
        <meshStandardMaterial
          color="#78350f"
          roughness={0.9}
          metalness={0.0}
        />
      </instancedMesh>

      {/* Side barriers */}
      <mesh position={[-12, 2, TRACK_LENGTH / 2]} receiveShadow>
        <boxGeometry args={[1, 6, TRACK_LENGTH]} />
        <meshStandardMaterial
          color="#0F172A"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[12, 2, TRACK_LENGTH / 2]} receiveShadow>
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
