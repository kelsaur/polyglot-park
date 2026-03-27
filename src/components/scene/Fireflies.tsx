import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Fireflies({ count = 10 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);

  //generate random starting positions and offsets
  const fireflies = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 4 + 1.5, //x spread
        Math.random() * 3 + 0.5, //y height
        (Math.random() - 0.5) * 4 + -0.2, //z spread
      ),
      offsetX: Math.random() * Math.PI * 2,
      offsetY: Math.random() * Math.PI * 2,
      offsetZ: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.5,
    }));
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  //animation
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();

    fireflies.forEach((fly, i) => {
      dummy.position.set(
        fly.position.x + Math.sin(t * fly.speed + fly.offsetX) * 0.5,
        fly.position.y + Math.sin(t * fly.speed + fly.offsetY) * 0.3,
        fly.position.z + Math.cos(t * fly.speed + fly.offsetZ) * 0.5,
      );
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });

    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.04, 3, 3]} />
      <meshStandardMaterial
        emissive="#fffeaa"
        emissiveIntensity={1}
        color="#ff5900"
      />
    </instancedMesh>
  );
}
