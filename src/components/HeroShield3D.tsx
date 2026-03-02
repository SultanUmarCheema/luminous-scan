import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

const WireframeShape = () => {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  const particlePositions = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.8 + Math.random() * 1.2;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.06;
      groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.12;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x = t * 0.25;
      innerRef.current.rotation.z = t * 0.15;
    }
    if (outerRef.current) {
      outerRef.current.rotation.y = -t * 0.12;
      outerRef.current.rotation.z = t * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.15) * 0.3;
      ringRef.current.rotation.z = t * 0.08;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = Math.PI / 3 + Math.cos(t * 0.12) * 0.2;
      ring2Ref.current.rotation.y = t * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={200} array={particlePositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.02} color="#00d9ff" transparent opacity={0.5} sizeAttenuation />
      </points>

      {/* Inner icosahedron */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshBasicMaterial color="#00d9ff" wireframe transparent opacity={0.5} />
      </mesh>

      {/* Core glow */}
      <mesh>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.15} />
      </mesh>

      {/* Outer dodecahedron */}
      <mesh ref={outerRef}>
        <dodecahedronGeometry args={[1.3, 0]} />
        <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.12} />
      </mesh>

      {/* Rings */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.7, 0.01, 16, 128]} />
        <meshBasicMaterial color="#00d9ff" transparent opacity={0.3} />
      </mesh>

      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.0, 0.006, 16, 128]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.15} />
      </mesh>

      <mesh rotation={[0.8, 0.3, 0]}>
        <torusGeometry args={[2.3, 0.004, 16, 128]} />
        <meshBasicMaterial color="#00d9ff" transparent opacity={0.08} />
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
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={0.6} color="#00d9ff" />
      <pointLight position={[-5, -3, 3]} intensity={0.3} color="#8b5cf6" />
      <pointLight position={[0, -5, 0]} intensity={0.2} color="#00d9ff" />
      <WireframeShape />
    </Canvas>
  </div>
);

export default HeroShield3D;