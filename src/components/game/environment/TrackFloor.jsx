import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { LANE_POSITIONS } from '../../../stores/gameStore';

/**
 * TrackFloor - PERFORMANCE OPTIMIZED with InstancedMesh
 *
 * OPTIMIZATIONS:
 * - Uses InstancedMesh for ties (1 draw call instead of 500)
 * - Reduced tie count to 500 (was 1000)
 * - No shadows on ties (performance killer)
 * - Minimal shadows on rails
 * - Static geometry (set up ONCE, never updated)
 */

const TRACK_LENGTH = 2000;
const TIE_SPACING = 4; // Increased from 2 (fewer ties)
const NUM_TIES = Math.floor(TRACK_LENGTH / TIE_SPACING); // 500 ties instead of 1000

const TrackFloor = () => {
  const tiesRef = useRef();

  // Set up instanced mesh positions ONCE on mount
  useEffect(() => {
    if (tiesRef.current) {
      const matrix = new THREE.Matrix4();
      for (let i = 0; i < NUM_TIES; i++) {
        const z = -TRACK_LENGTH / 2 + i * TIE_SPACING;
        matrix.setPosition(0, -1.35, z);
        tiesRef.current.setMatrixAt(i, matrix);
      }
      tiesRef.current.instanceMatrix.needsUpdate = true;
    }
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* Ground plane - STATIC */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[30, TRACK_LENGTH]} />
        <meshBasicMaterial color="#1E293B" />
      </mesh>

      {/* Rails - 2 per lane (6 total), minimal shadows */}
      {LANE_POSITIONS.map((laneX, laneIdx) => (
        <group key={`lane-${laneIdx}`}>
          {/* Left rail */}
          <mesh position={[laneX - 0.8, -1.25, 0]}>
            <boxGeometry args={[0.25, 0.25, TRACK_LENGTH]} />
            <meshBasicMaterial color="#71717A" />
          </mesh>

          {/* Right rail */}
          <mesh position={[laneX + 0.8, -1.25, 0]}>
            <boxGeometry args={[0.25, 0.25, TRACK_LENGTH]} />
            <meshBasicMaterial color="#71717A" />
          </mesh>
        </group>
      ))}

      {/* Wooden ties - INSTANCED (1 draw call for all 500 ties) */}
      <instancedMesh ref={tiesRef} args={[null, null, NUM_TIES]} frustumCulled={false}>
        <boxGeometry args={[12, 0.15, 0.4]} />
        <meshBasicMaterial color="#92400E" />
      </instancedMesh>

      {/* Side barriers - STATIC walls */}
      <mesh position={[-12, 2, 0]}>
        <boxGeometry args={[1, 6, TRACK_LENGTH]} />
        <meshBasicMaterial color="#0F172A" />
      </mesh>
      <mesh position={[12, 2, 0]}>
        <boxGeometry args={[1, 6, TRACK_LENGTH]} />
        <meshBasicMaterial color="#0F172A" />
      </mesh>
    </group>
  );
};

export default TrackFloor;
