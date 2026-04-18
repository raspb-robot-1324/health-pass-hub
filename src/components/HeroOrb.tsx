import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";

function PulseOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Heartbeat scale: two quick beats then rest
    const beat = Math.sin(t * 2) * 0.5 + 0.5;
    const pulse = 1 + Math.pow(beat, 8) * 0.08;
    if (meshRef.current) {
      meshRef.current.scale.setScalar(pulse);
      meshRef.current.rotation.y = t * 0.2;
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.1;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.2) * 0.1;
    }
  });

  return (
    <>
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.6, 32]} />
          <MeshDistortMaterial
            color="#4fb8e8"
            emissive="#1a4a8a"
            emissiveIntensity={0.4}
            roughness={0.15}
            metalness={0.7}
            distort={0.45}
            speed={1.5}
          />
        </mesh>
      </Float>
      <mesh ref={ringRef}>
        <torusGeometry args={[2.4, 0.012, 16, 200]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.8, 0.008, 16, 200]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.4} />
      </mesh>
    </>
  );
}

export function HeroOrb() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#7dd3fc" />
      <pointLight position={[-5, -3, 2]} intensity={1} color="#c4b5fd" />
      <Suspense fallback={null}>
        <PulseOrb />
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}
