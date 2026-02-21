import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import type { JSX } from "react";
import { useGLTF } from "@react-three/drei";
import { Environment } from "@react-three/drei";
import { OrbitControls } from "@react-three/drei";

{
  /*function Ground(): JSX.Element {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="lightgreen" />
    </mesh>
  );
}*/
}

function TestScene() {
  const { scene } = useGLTF("/models/testscene3.glb");
  console.log(scene);
  return <primitive object={scene} />;
}

/*function Stone() {
  const { scene } = useGLTF("/models/stone.glb");
  console.log(scene);
  return <primitive object={scene} />;
}*/

const basePolar = Math.PI / 2 - 0.1;
const wiggle = Math.PI / 30;

export default function Scene(): JSX.Element {
  return (
    <Canvas
      frameloop="always"
      camera={{ position: [0, 2, 8], fov: 40 }}
      onCreated={({ camera }) => camera.lookAt(0, 1, 0)}
      style={{ height: "100vh", width: "100vw" }}
    >
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.15}
        rotateSpeed={0.6}
        enablePan={false}
        enableZoom={false}
        target={[0, 4, 0]}
        //vertical limits (up/down)
        minPolarAngle={basePolar - wiggle}
        maxPolarAngle={basePolar + wiggle}
        //horizontal limits (left/right)
        minAzimuthAngle={-Math.PI / 30}
        maxAzimuthAngle={Math.PI / 30}
      />

      {/* lighting */}
      <ambientLight intensity={1} />
      <directionalLight intensity={1} position={[5, 10, 5]} />

      <Environment files="/hdri/env3.hdr" background />

      {/* ground */}
      {/*<Ground />*/}
      <TestScene />
      {/*<Stone />*/}

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
        blur={3}
        far={20}
        resolution={256}
      />
    </Canvas>
  );
}
