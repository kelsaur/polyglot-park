import * as THREE from "three";
import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";

//function to create a GLB model component
function createModel(path: string) {
  return function Model() {
    const { scene } = useGLTF(path);
    return <primitive object={scene} />;
  };
}

export const Bench = createModel("/models/bench.glb");
export const Canoe = createModel("/models/canoe.glb");
export const Fence = createModel("/models/fence.glb");
export const Flowers = createModel("/models/flowers.glb");
export const Lake = createModel("/models/lake.glb");
export const Mushrooms = createModel("/models/mushrooms.glb");
export const Stone = createModel("/models/stone.glb");
export const Tree = createModel("/models/tree.glb");
export const Path = createModel("/models/path.glb");
export const Frog = createModel("/models/frog.glb");
export const Deer = createModel("/models/deer.glb");
export const Owl = createModel("/models/owl.glb");
export const Campfire = createModel("/models/campfire.glb");
export const Tent = createModel("/models/tent.glb");
export const ParkScene = createModel("/models/parkscene2.glb");

//Moon
interface MoonProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export function Moon({ position, rotation = [0, 0, 0], scale }: MoonProps) {
  const { scene } = useGLTF("/models/moon.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.emissive = new THREE.Color("#ffffaa");
        child.material.emissiveIntensity = 0.8;
      }
    });
  }, [scene]);

  return (
    <primitive
      object={scene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}
