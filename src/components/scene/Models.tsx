import { useGLTF } from "@react-three/drei";

function Bench() {
  const { scene } = useGLTF("/models/bench.glb");
  return <primitive object={scene} />;
}

function Canoe() {
  const { scene } = useGLTF("/models/canoe.glb");
  return <primitive object={scene} />;
}

function Fence() {
  const { scene } = useGLTF("/models/fence.glb");
  return <primitive object={scene} />;
}

function Flowers() {
  const { scene } = useGLTF("/models/flowers.glb");
  return <primitive object={scene} />;
}

function Lake() {
  const { scene } = useGLTF("/models/lake.glb");
  return <primitive object={scene} />;
}

function Mushrooms() {
  const { scene } = useGLTF("/models/mushrooms.glb");
  return <primitive object={scene} />;
}

function Stone() {
  const { scene } = useGLTF("/models/stone.glb");
  return <primitive object={scene} />;
}

function Tree() {
  const { scene } = useGLTF("/models/tree.glb");
  return <primitive object={scene} />;
}

export { Bench, Canoe, Fence, Flowers, Lake, Mushrooms, Stone, Tree };
