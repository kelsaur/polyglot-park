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

export default function Scene(): JSX.Element {
  return (
    <Canvas
      onCreated={({ scene }) => {
        scene.environmentIntensity = 0.5;
        scene.environmentRotation.y = Math.PI / 5;
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
        target={[0.05, 2, 0]}
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
      {/* Point light 1 - trees back*/}
      <pointLight
        position={[-0.7, 0.5, -2]}
        intensity={1}
        color="#ff5500"
        decay={3}
      />

      {/*<mesh position={[-0.7, 0.5, -2]}>
        <sphereGeometry args={[0.1]} />
        <meshBasicMaterial color="yellow" />
      </mesh>*/}

      {/* Point light 2 - left grass*/}
      <pointLight
        position={[-3, 0.3, 2.7]}
        intensity={0.5}
        color="#ffcc88"
        decay={2}
      />

      {/* Point light 3 - lake*/}
      <pointLight
        position={[1.5, 0.2, -0.2]}
        intensity={0.8}
        color="#aaddff"
        decay={0.5}
        distance={5}
      />

      {/* Point light 4 - flowers front*/}
      <pointLight
        position={[3, 0.4, 3]}
        intensity={0.5}
        color="#ff6135"
        decay={2}
      />

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
      <Clouds path="/models/cloud1.glb" position={[3, 5, -3]} offset={0} />
      <Clouds
        path="/models/cloud2.glb"
        position={[-1, 7, 5]}
        offset={2}
        rotation={[0, Math.PI / 8, 0]}
      />
      <Clouds
        path="/models/cloud3.glb"
        position={[-3, 4, -3]}
        offset={3}
        rotation={[0, Math.PI / -6, 0]}
      />
      <Clouds path="/models/cloud3.glb" position={[0, 9, 0]} offset={4} />
      <Clouds path="/models/cloud1.glb" position={[0, 10, 5]} offset={3.4} />
      <Clouds path="/models/cloud2.glb" position={[3, 6.6, -1]} offset={0.5} />
    </Canvas>
  );
}
