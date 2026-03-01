import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

const ShieldMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return positions;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(t * 0.3) * 0.3;
      meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
      meshRef.current.position.y = Math.sin(t * 0.5) * 0.2;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y = -t * 0.15;
      glowRef.current.rotation.z = t * 0.1;
      const s = 1.8 + Math.sin(t * 2) * 0.1;
      glowRef.current.scale.set(s, s, s);
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.05;
      particlesRef.current.rotation.x = t * 0.03;
    }
  });

  const shieldShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 1.2);
    shape.bezierCurveTo(0.8, 1.0, 1.0, 0.6, 1.0, 0);
    shape.bezierCurveTo(1.0, -0.6, 0.5, -1.0, 0, -1.3);
    shape.bezierCurveTo(-0.5, -1.0, -1.0, -0.6, -1.0, 0);
    shape.bezierCurveTo(-1.0, 0.6, -0.8, 1.0, 0, 1.2);
    return shape;
  }, []);

  return (
    <group>
      {/* Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={200}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.02} color="#00d9ff" transparent opacity={0.6} sizeAttenuation />
      </points>

      {/* Outer glow ring */}
      <mesh ref={glowRef}>
        <torusGeometry args={[1.6, 0.02, 16, 100]} />
        <meshBasicMaterial color="#00d9ff" transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.01, 16, 100]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.2} />
      </mesh>

      {/* Shield */}
      <mesh ref={meshRef}>
        <extrudeGeometry
          args={[shieldShape, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 5 }]}
        />
        <meshPhysicalMaterial
          color="#0a1628"
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={2}
          emissive="#00d9ff"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Checkmark on shield */}
      <mesh position={[0, -0.05, 0.15]}>
        <torusGeometry args={[0.35, 0.04, 8, 32, Math.PI * 1.5]} />
        <meshBasicMaterial color="#00d9ff" />
      </mesh>
    </group>
  );
};

const HeroShield3D = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#00d9ff" />
        <pointLight position={[-5, -3, 3]} intensity={0.5} color="#8b5cf6" />
        <spotLight position={[0, 5, 5]} angle={0.3} penumbra={1} intensity={1} color="#ffffff" />
        <ShieldMesh />
      </Canvas>
    </div>
  );
};

export default HeroShield3D;
