import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import type { JSX } from "react";
import { useRef } from "react";

function ParkScene() {
  const { scene } = useGLTF("/models/parkscene.glb");
  return <primitive object={scene} />;
}

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

function Clouds({
  path,
  position,
  offset = 0,
}: {
  path: string;
  position: [number, number, number];
  offset?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const { scene } = useGLTF(path);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y =
      position[1] + Math.sin(clock.getElapsedTime() + offset) * 0.3;
  });

  return <primitive ref={ref} object={scene.clone()} position={position} />;
}

export default function Scene(): JSX.Element {
  return (
    <Canvas
      onCreated={({ scene }) => {
        scene.environmentIntensity = 0.5;
      }}
      orthographic
      camera={{
        position: [10, 10, 10],
        zoom: 60,
        near: 0.1,
        far: 1000,
      }}
      style={{ height: "100vh", width: "100vw", background: "#a8c6d8" }}
    >
      <OrbitControls
        target={[0.05, 1, 0]}
        enableRotate={true}
        enableZoom={true}
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
      />

      {/* lighting */}
      <ambientLight intensity={0.5} />
      {/*<directionalLight intensity={2} position={[10, 20, 10]} castShadow />*/}

      <Environment files="/hdri/env3.hdr" />
      {/*<pointLight position={[-1, 0, -2]} intensity={5} color="#ff0000" />

      <mesh position={[-1, 0, -2]}>
        <sphereGeometry args={[0.1]} />
        <meshBasicMaterial color="yellow" />
      </mesh>*/}

      {/* models */}
      <ParkScene />
      <Bench />
      <Canoe />
      <Fence />
      <Flowers />
      <Lake />
      <Mushrooms />
      <Stone />
      <Tree />
      <Clouds path="/models/cloud1.glb" position={[3, 3, -3]} offset={0} />
      <Clouds path="/models/cloud2.glb" position={[-1, 5, 5]} offset={2} />
      <Clouds path="/models/cloud3.glb" position={[-3, 2, -6]} offset={3} />
      <Clouds path="/models/cloud1.glb" position={[-3, 4, -1]} offset={1} />
      <Clouds path="/models/cloud2.glb" position={[0, 7, 0]} offset={4} />
    </Canvas>
  );
}
