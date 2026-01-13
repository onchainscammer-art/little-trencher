import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { LANE_POSITIONS } from '../../../stores/gameStore';

/**
 * SolanaToken - 0.1 SOL collectible with purple-to-green gradient
 *
 * OPTIMIZED: Geometry reuse via useMemo (single geometry instance shared by all tokens)
 * FIXED: Text z-fighting by positioning text well above the token bars
 *
 * Design:
 * - Three angled bars forming Solana logo
 * - Purple (#9945FF) top, Green (#14F195) bottom
 * - Gentle rotation and bob animation
 * - Glow halo effect
 */

// Shared geometries and materials (created once, reused by all token instances)
const sharedGeometries = {
  outerGlow: new THREE.SphereGeometry(1.2, 8, 8),
  innerGlow: new THREE.SphereGeometry(0.8, 8, 8),
  topBar: new THREE.BoxGeometry(1.4, 0.25, 0.15),
  midBar: new THREE.BoxGeometry(1.0, 0.25, 0.15),
  botBar: new THREE.BoxGeometry(1.4, 0.25, 0.15)
};

const sharedMaterials = {
  outerGlow: new THREE.MeshBasicMaterial({
    color: '#9945FF',
    transparent: true,
    opacity: 0.2
  }),
  innerGlow: new THREE.MeshBasicMaterial({
    color: '#9945FF',
    transparent: true,
    opacity: 0.4
  }),
  topBar: new THREE.MeshStandardMaterial({
    color: '#9945FF',
    emissive: '#9945FF',
    emissiveIntensity: 0.6,
    metalness: 0.3
  }),
  midBar: new THREE.MeshStandardMaterial({
    color: '#7B3FD7',
    emissive: '#7B3FD7',
    emissiveIntensity: 0.6,
    metalness: 0.3
  }),
  botBar: new THREE.MeshStandardMaterial({
    color: '#14F195',
    emissive: '#14F195',
    emissiveIntensity: 0.6,
    metalness: 0.3
  })
};

const SolanaToken = ({ lane, zPosition, id }) => {
  const groupRef = useRef();
  const time = useRef(Math.random() * Math.PI * 2); // Random start time for variation

  const xPosition = LANE_POSITIONS[lane];

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    time.current += delta;

    // Gentle Y-axis rotation
    groupRef.current.rotation.y += delta * 1.5;

    // Bob up and down
    groupRef.current.position.y = 2 + Math.sin(time.current * 2) * 0.2;
  });

  return (
    <group ref={groupRef} position={[xPosition, 2, zPosition]}>
      {/* Outer glow halo - OPTIMIZED: Reused geometry */}
      <mesh position={[0, 0, -0.3]} geometry={sharedGeometries.outerGlow} material={sharedMaterials.outerGlow} />

      {/* Inner glow - OPTIMIZED: Reused geometry */}
      <mesh position={[0, 0, -0.2]} geometry={sharedGeometries.innerGlow} material={sharedMaterials.innerGlow} />

      {/* Top bar (purple) - angled - OPTIMIZED: Reused geometry */}
      <mesh rotation={[0, 0, 0.2]} position={[0, 0.5, 0]} geometry={sharedGeometries.topBar} material={sharedMaterials.topBar} />

      {/* Middle bar (gradient center) - OPTIMIZED: Reused geometry */}
      <mesh rotation={[0, 0, 0]} position={[0, 0, 0]} geometry={sharedGeometries.midBar} material={sharedMaterials.midBar} />

      {/* Bottom bar (green) - angled opposite - OPTIMIZED: Reused geometry */}
      <mesh rotation={[0, 0, -0.2]} position={[0, -0.5, 0]} geometry={sharedGeometries.botBar} material={sharedMaterials.botBar} />

      {/* Point light for extra glow */}
      <pointLight
        position={[0, 0, 0.5]}
        intensity={1.0}
        distance={4}
        color="#9945FF"
      />

      {/* .1 SOL label - FIXED: Positioned well above bars to prevent z-fighting */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.5}
        color="#14F195"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
        renderOrder={100}
      >
        .1
      </Text>
    </group>
  );
};

export default React.memo(SolanaToken);
