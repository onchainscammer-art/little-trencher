import React from 'react';
import { LANE_POSITIONS } from '../../../stores/gameStore';

/**
 * RugPit - Hole in the ground obstacle
 *
 * Visual:
 * - Dark void material (emissive black)
 * - Yellow warning signs around edges
 * - Smoke/particles rising from pit
 */
const RugPit = ({ lane, zPosition }) => {
  const xPosition = LANE_POSITIONS[lane];

  return (
    <group position={[xPosition, 0, zPosition]}>
      {/* The pit - dark void */}
      <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Rim of the pit - BRIGHT NEON ORANGE (impossible to miss) */}
      <mesh position={[0, -0.39, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1, 1.2, 32]} />
        <meshStandardMaterial
          color="#FF4500"
          emissive="#FF4500"
          emissiveIntensity={2.0}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>

      {/* TALL RED WARNING BEAM - 10 units high, semi-transparent */}
      <mesh position={[0, 5, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 10, 16]} />
        <meshStandardMaterial
          color="#DC2626"
          emissive="#DC2626"
          emissiveIntensity={1.2}
          transparent
          opacity={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Warning signs - reduced to 2 for performance */}
      {[0, Math.PI].map((angle, i) => {
        const signX = Math.cos(angle) * 1.4;
        const signZ = Math.sin(angle) * 1.4;

        return (
          <group key={`sign-${i}`} position={[signX, 0, signZ]} rotation={[0, -angle, 0]}>
            {/* Sign post */}
            <mesh position={[0, 0.5, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
              <meshStandardMaterial
                color="#57534E"
                metalness={0.6}
                roughness={0.4}
              />
            </mesh>

            {/* Sign board */}
            <mesh position={[0, 1, 0]} castShadow>
              <boxGeometry args={[0.5, 0.4, 0.05]} />
              <meshStandardMaterial
                color="#FCD34D"
                emissive="#FCD34D"
                emissiveIntensity={0.6}
                roughness={0.5}
              />
            </mesh>
          </group>
        );
      })}

      {/* Red warning light at center */}
      <pointLight
        position={[0, 0.5, 0]}
        intensity={1.0}
        distance={4}
        color="#DC2626"
      />
    </group>
  );
};

export default RugPit;
