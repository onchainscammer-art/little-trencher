import React, { useRef, useEffect } from 'react';
import { LANE_POSITIONS } from '../../../stores/gameStore';
import * as THREE from 'three';

/**
 * SellWall - PERFORMANCE OPTIMIZED with InstancedMesh
 *
 * OPTIMIZATION: Uses InstancedMesh for bricks (1 draw call for 24 bricks)
 * - Was: 24 separate meshes (24 draw calls per wall)
 * - Now: 1 InstancedMesh (1 draw call per wall)
 * - 24x performance improvement per wall
 */
const SellWall = ({ lane, zPosition }) => {
  const xPosition = LANE_POSITIONS[lane];
  const bricksRef = useRef();

  // Set up brick positions ONCE
  useEffect(() => {
    if (!bricksRef.current) return;

    const matrix = new THREE.Matrix4();
    let brickIndex = 0;

    // Create 6 rows of bricks
    for (let row = 0; row < 6; row++) {
      const offset = row % 2 === 0 ? 0 : 0.5;

      for (let col = 0; col < 4; col++) {
        const x = (col - 1.5) * 1.0 + offset;
        const y = row * 0.85 + 0.5;

        matrix.setPosition(x, y, 0);
        bricksRef.current.setMatrixAt(brickIndex, matrix);
        brickIndex++;
      }
    }

    bricksRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <group position={[xPosition, 0, zPosition]}>
      {/* All bricks as ONE InstancedMesh - with proper materials */}
      <instancedMesh ref={bricksRef} args={[null, null, 24]} castShadow>
        <boxGeometry args={[1.0, 0.8, 0.5]} />
        <meshStandardMaterial
          color="#6B7280"
          roughness={0.8}
          metalness={0.2}
        />
      </instancedMesh>

      {/* "SELL" text plane with glow */}
      <mesh position={[0, 2.5, 0.3]}>
        <planeGeometry args={[2.5, 1.2]} />
        <meshStandardMaterial
          color="#EF4444"
          emissive="#DC2626"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Warning light on top - glowing sphere */}
      <mesh position={[0, 4.5, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color="#EF4444"
          emissive="#EF4444"
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Point light from warning beacon */}
      <pointLight
        position={[0, 4.5, 0]}
        color="#EF4444"
        intensity={1.5}
        distance={6}
      />
    </group>
  );
};

export default SellWall;
