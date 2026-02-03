import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import type { JSX } from "react";

function Ground(): JSX.Element {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="lightgreen" />
    </mesh>
  );
}

export default function Scene(): JSX.Element {
  return (
    <Canvas
      camera={{ position: [0, 4, 10], fov: 50 }}
      style={{ height: "100vh", width: "100vw" }}
    >
      {/* lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight intensity={1} position={[5, 10, 5]} />

      {/* ground */}
      <Ground />

      {/* cube */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="brown" />
      </mesh>

      {/* contact shadow under the object */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.5}
        scale={5}
        blur={5}
        far={20}
        resolution={512}
      />
    </Canvas>
  );
}
