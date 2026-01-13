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
      {/* Main candle body - with lighting */}
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.4, 6, 12]} />
        <meshStandardMaterial
          color="#DC2626"
          emissive="#991B1B"
          emissiveIntensity={0.3}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Wick */}
      <mesh position={[0, 5.2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#000000" roughness={0.9} />
      </mesh>

      {/* Flame glow sphere */}
      <mesh position={[0, 5.5, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial
          color="#FCD34D"
          emissive="#F59E0B"
          emissiveIntensity={1.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Flame point light */}
      <pointLight
        position={[0, 5.5, 0]}
        intensity={1.5}
        distance={5}
        color="#F59E0B"
      />

      {/* Warning sign at base */}
      <mesh position={[0, 0.1, 0.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.8, 0.8]} />
        <meshStandardMaterial
          color="#FCD34D"
          emissive="#FCD34D"
          emissiveIntensity={0.4}
          roughness={0.5}
        />
      </mesh>

      {/* Warning symbol (!) */}
      <mesh position={[0, 0.11, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, 0.2, 16]} />
        <meshStandardMaterial
          color="#DC2626"
          emissive="#DC2626"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
};

export default RedCandle;
