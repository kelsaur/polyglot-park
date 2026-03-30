import * as THREE from "three";
import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

interface CloudsProps {
  path: string;
  position: [number, number, number];
  offset?: number;
  rotation?: [number, number, number];
  hoverSound?: string;
}

export function Clouds({
  path,
  position,
  offset = 0,
  rotation = [0, 0, 0],
  hoverSound,
}: CloudsProps) {
  const ref = useRef<THREE.Group>(null);
  const { scene } = useGLTF(path);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y =
      position[1] + Math.sin(clock.getElapsedTime() + offset) * 0.3;
  });

  function playHoverSound() {
    if (!hoverSound) return;
    const audio = new Audio(hoverSound);
    audio.volume = 0.4;
    audio.play();
  }

  return (
    <primitive
      ref={ref}
      object={scene.clone()}
      position={position}
      rotation={rotation}
      onPointerOver={playHoverSound}
    />
  );
}
