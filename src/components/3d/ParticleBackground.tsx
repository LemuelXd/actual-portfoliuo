import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticlesProps {
  count?: number;
}

function Particles({ count = 100 }: ParticlesProps) {
  const mesh = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 20;
      pos[i3 + 1] = (Math.random() - 0.5) * 20;
      pos[i3 + 2] = (Math.random() - 0.5) * 10;

      vel[i3] = (Math.random() - 0.5) * 0.01;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.01;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.005;
    }

    return [pos, vel];
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;

    const positionAttribute = mesh.current.geometry.attributes.position;
    const positionArray = positionAttribute.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      positionArray[i3] += velocities[i3];
      positionArray[i3 + 1] += velocities[i3 + 1];
      positionArray[i3 + 2] += velocities[i3 + 2];

      // Mouse interaction
      const dx = mouseRef.current.x * 5 - positionArray[i3];
      const dy = mouseRef.current.y * 5 - positionArray[i3 + 1];
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 3) {
        positionArray[i3] -= dx * 0.01;
        positionArray[i3 + 1] -= dy * 0.01;
      }

      // Boundary check
      if (Math.abs(positionArray[i3]) > 10) velocities[i3] *= -1;
      if (Math.abs(positionArray[i3 + 1]) > 10) velocities[i3 + 1] *= -1;
      if (Math.abs(positionArray[i3 + 2]) > 5) velocities[i3 + 2] *= -1;
    }

    positionAttribute.needsUpdate = true;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  return (
    <points ref={mesh} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        color="#00ffff"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ConnectionLines({ count = 100 }: ParticlesProps) {
  const linesRef = useRef<THREE.LineSegments>(null);
  const particlePositions = useRef<Float32Array | null>(null);

  useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 20;
      pos[i3 + 1] = (Math.random() - 0.5) * 20;
      pos[i3 + 2] = (Math.random() - 0.5) * 10;
    }
    particlePositions.current = pos;
  }, [count]);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(count * count * 6);
    geometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    return geometry;
  }, [count]);

  useFrame(() => {
    if (!linesRef.current || !particlePositions.current) return;

    const linePositions = linesRef.current.geometry.attributes.position.array as Float32Array;
    let lineIndex = 0;
    const maxDistance = 2;

    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const i3 = i * 3;
        const j3 = j * 3;

        const dx = particlePositions.current[i3] - particlePositions.current[j3];
        const dy = particlePositions.current[i3 + 1] - particlePositions.current[j3 + 1];
        const dz = particlePositions.current[i3 + 2] - particlePositions.current[j3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDistance && lineIndex < linePositions.length - 6) {
          linePositions[lineIndex++] = particlePositions.current[i3];
          linePositions[lineIndex++] = particlePositions.current[i3 + 1];
          linePositions[lineIndex++] = particlePositions.current[i3 + 2];
          linePositions[lineIndex++] = particlePositions.current[j3];
          linePositions[lineIndex++] = particlePositions.current[j3 + 1];
          linePositions[lineIndex++] = particlePositions.current[j3 + 2];
        }
      }
    }

    // Clear remaining positions
    for (let i = lineIndex; i < linePositions.length; i++) {
      linePositions[i] = 0;
    }

    linesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments ref={linesRef} geometry={lineGeometry}>
      <lineBasicMaterial color="#00ffff" transparent opacity={0.1} blending={THREE.AdditiveBlending} />
    </lineSegments>
  );
}

function FloatingCube() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5;
  });

  return (
    <mesh ref={meshRef} position={[5, 0, -5]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.3} />
    </mesh>
  );
}

function FloatingPyramid() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.25;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8 + 2) * 0.5;
  });

  return (
    <mesh ref={meshRef} position={[-5, 2, -3]}>
      <coneGeometry args={[0.8, 1.5, 4]} />
      <meshBasicMaterial color="#0080ff" wireframe transparent opacity={0.3} />
    </mesh>
  );
}

export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <Particles count={80} />
        <ConnectionLines count={80} />
        <FloatingCube />
        <FloatingPyramid />
      </Canvas>
    </div>
  );
}
