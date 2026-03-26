import * as THREE from "three";
import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export function Clouds({
  path,
  position,
  offset = 0,
  rotation = [0, 0, 0],
}: {
  path: string;
  position: [number, number, number];
  offset?: number;
  rotation?: [number, number, number];
}) {
  const ref = useRef<THREE.Group>(null);
  const { scene } = useGLTF(path);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y =
      position[1] + Math.sin(clock.getElapsedTime() + offset) * 0.3;
  });

  return (
    <primitive
      ref={ref}
      object={scene.clone()}
      position={position}
      rotation={rotation}
    />
  );
}
