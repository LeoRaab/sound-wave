import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { InstancedMesh } from 'three';

const roundedSquareWave = (t: number, delta: number, a: number, f: number) => {
  return ((2 * a) / Math.PI) * Math.atan(Math.sin(2 * Math.PI * t * f) / delta);
};

const Dots = () => {
  const meshRef = useRef<InstancedMesh>(null);
  const { vec, transform, positions, distances } = useMemo(() => {
    const vec = new THREE.Vector3();
    const transform = new THREE.Matrix4();
    const positions = [...Array(10000)].map((_, i) => {
      const position = new THREE.Vector3();
      // Place in a grid
      position.x = (i % 100) - 50;
      position.y = Math.floor(i / 100) - 50;

      // Offset every other column (hexagonal pattern)
      position.y += (i % 2) * 0.5;

      // Add some noise
      position.x += Math.random() * 0.3;
      position.y += Math.random() * 0.3;
      return position;
    });
    const distances = positions.map((pos) => pos.length());
    return { vec, transform, positions, distances };
  }, []);

  useFrame(({ clock }) => {
    for (let i = 0; i < 10000; ++i) {
      const t = clock.elapsedTime - distances[i] / 80;
      const wave = roundedSquareWave(t, 0.1, 1, 1 / 4);
      const scale = 1 + wave * 0.3;
      vec.copy(positions[i]).multiplyScalar(scale);
      transform.setPosition(vec);
      meshRef.current!.setMatrixAt(i, transform);
    }
    meshRef.current!.instanceMatrix!.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, 10000]}>
      <circleBufferGeometry args={[0.15]} />
      <meshBasicMaterial />
    </instancedMesh>
  );
};

export default Dots;
