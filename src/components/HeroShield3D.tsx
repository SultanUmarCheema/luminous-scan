import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

const WireframeShape = () => {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const particlePositions = useMemo(() => {
    const count = 120;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 0.5;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.08;
      groupRef.current.rotation.x = Math.sin(t * 0.12) * 0.15;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x = t * 0.3;
      innerRef.current.rotation.z = t * 0.2;
    }
    if (outerRef.current) {
      outerRef.current.rotation.y = -t * 0.15;
      outerRef.current.rotation.z = t * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.2) * 0.3;
      ringRef.current.rotation.z = t * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Floating particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={120} array={particlePositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.015} color="#bfff00" transparent opacity={0.4} sizeAttenuation />
      </points>

      {/* Inner icosahedron - wireframe */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.8, 0]} />
        <meshBasicMaterial color="#bfff00" wireframe transparent opacity={0.6} />
      </mesh>

      {/* Outer dodecahedron - wireframe */}
      <mesh ref={outerRef}>
        <dodecahedronGeometry args={[1.4, 0]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.08} />
      </mesh>

      {/* Orbital ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.8, 0.008, 16, 128]} />
        <meshBasicMaterial color="#bfff00" transparent opacity={0.25} />
      </mesh>

      {/* Second orbital ring */}
      <mesh rotation={[1.2, 0.5, 0]}>
        <torusGeometry args={[2.0, 0.005, 16, 128]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.06} />
      </mesh>
    </group>
  );
};

const HeroShield3D = () => (
  <div className="w-full h-full">
    <Canvas
      camera={{ position: [0, 0, 5], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#bfff00" />
      <pointLight position={[-5, -3, 3]} intensity={0.3} color="#ffffff" />
      <WireframeShape />
    </Canvas>
  </div>
);

export default HeroShield3D;
