import React from 'react';
import { LANE_POSITIONS } from '../../../stores/gameStore';

/**
 * RedCandle - Tall red cylinder obstacle
 *
 * Visual:
 * - Red cylinder body (height 6)
 * - Black wick on top
 * - Glowing red light at tip
 * - Yellow warning sign at base
 */
const RedCandle = ({ lane, zPosition }) => {
  const xPosition = LANE_POSITIONS[lane];

  return (
    <group position={[xPosition, 0, zPosition]}>
      {/* Main candle body - no shadows for performance */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 6, 8]} />
        <meshBasicMaterial color="#DC2626" />
      </mesh>

      {/* Wick - reduced geometry */}
      <mesh position={[0, 5.2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 6]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Flame glow */}
      <pointLight
        position={[0, 5.5, 0]}
        intensity={1}
        distance={4}
        color="#EF4444"
      />

      {/* Warning sign at base */}
      <mesh position={[0, 0.1, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshBasicMaterial color="#FCD34D" />
      </mesh>

      {/* Warning symbol (!) */}
      <mesh position={[0, 0.11, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, 0.2, 16]} />
        <meshBasicMaterial color="#DC2626" />
      </mesh>
    </group>
  );
};

export default RedCandle;
