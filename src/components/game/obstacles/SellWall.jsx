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
      {/* All bricks as ONE InstancedMesh - massive performance boost */}
      <instancedMesh ref={bricksRef} args={[null, null, 24]}>
        <boxGeometry args={[1.0, 0.8, 0.5]} />
        <meshBasicMaterial color="#6B7280" />
      </instancedMesh>

      {/* "SELL" text plane */}
      <mesh position={[0, 2.5, 0.3]}>
        <planeGeometry args={[2.5, 1.2]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>

      {/* Warning light on top */}
      <mesh position={[0, 4.5, 0]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>
      <pointLight position={[0, 4.5, 0]} color="#EF4444" intensity={1.5} distance={6} />
    </group>
  );
};

export default SellWall;
