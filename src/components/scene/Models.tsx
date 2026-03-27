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

function Path() {
  const { scene } = useGLTF("/models/path.glb");
  return <primitive object={scene} />;
}

function Frog() {
  const { scene } = useGLTF("/models/frog.glb");
  return <primitive object={scene} />;
}

function Deer() {
  const { scene } = useGLTF("/models/deer.glb");
  return <primitive object={scene} />;
}

function Owl() {
  const { scene } = useGLTF("/models/owl.glb");
  return <primitive object={scene} />;
}

function Campfire() {
  const { scene } = useGLTF("/models/campfire.glb");
  return <primitive object={scene} />;
}

function Tent() {
  const { scene } = useGLTF("/models/tent.glb");
  return <primitive object={scene} />;
}

function Moon({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const { scene } = useGLTF("/models/moon.glb");

  return <primitive object={scene} position={position} rotation={rotation} />;
}

export {
  Bench,
  Canoe,
  Fence,
  Flowers,
  Lake,
  Mushrooms,
  Stone,
  Tree,
  Path,
  Frog,
  Deer,
  Owl,
  Campfire,
  Tent,
  Moon,
};
