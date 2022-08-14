import { useRef, useMemo } from 'react';
import { SpringValue } from '@react-spring/three';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { InstancedMesh } from 'three';

const roundedSquareWave = (t: number, delta: number, a: number, f: number) => {
  return ((2 * a) / Math.PI) * Math.atan(Math.sin(2 * Math.PI * t * f) / delta);
};

type WaveProps = {
  ticksSpring: SpringValue<number>;
  clickSpring: SpringValue<number>;
};

const Wave = ({ ticksSpring, clickSpring }: WaveProps) => {
  const meshRef = useRef<InstancedMesh>(null);

  const { vec, right, transform, vec3Mouse, focus, positions } = useMemo(() => {
    // Variables for intermediary calculations
    const vec = new THREE.Vector3();
    const transform = new THREE.Matrix4();

    // Vector pointing to the right (for angle calculations)
    const right = new THREE.Vector3(1, 0, 0);

    // True cursor position in 3D space
    const vec3Mouse = new THREE.Vector3();

    // Where the dots are clustered around
    const focus = new THREE.Vector3();

    // Precompute randomized initial positions (array of Vector3)
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
    return { vec, right, transform, vec3Mouse, focus, positions };
  }, []);
  useFrame(({ mouse, viewport }) => {
    if (!meshRef.current) {
      return;
    }

    // Convert mouse screen coords to 3D scene coords
    vec3Mouse.x = (mouse.x * viewport.width) / 2;
    vec3Mouse.y = (mouse.y * viewport.height) / 2;

    for (let i = 0; i < 10000; ++i) {
      // Drift focus to center as click is released
      focus.copy(vec3Mouse).multiplyScalar(clickSpring.get());

      // Vec holds the dot position relative to the focus point
      vec.copy(positions[i]).sub(focus);

      // Same distance calculation as original demo
      const dist = vec.length() + Math.cos(vec.angleTo(right) * 8) * 0.5;

      // This adjusts the wave input to set a suitable phase and frequency
      const t = ticksSpring.get() / 2 + 1 / 2 - dist / 100;
      const wave = roundedSquareWave(t, 0.15 + (0.2 * dist) / 72, 0.4, 1);

      // Scale dot position relative to the focus point
      vec.multiplyScalar(wave + 1.3).add(focus);

      // Set the instance's transformation matrix
      transform.setPosition(vec);
      meshRef.current.setMatrixAt(i, transform);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, 10000]}>
      <circleBufferGeometry args={[0.15]} />
      <meshBasicMaterial />
    </instancedMesh>
  );
};

export default Wave;
