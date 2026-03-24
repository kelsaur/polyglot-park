import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import type { JSX } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useRef, useEffect, useState } from "react";

const VOCABULARY: Record<string, { estonian: string; english: string }> = {
  bench: { estonian: "pink", english: "bench" },
  canoe: { estonian: "kanuu", english: "canoe" },
  flowers: { estonian: "lilled", english: "flowers" },
  mushrooms: { estonian: "seened", english: "mushrooms" },
  stone: { estonian: "kivi", english: "stone" },
  tree: { estonian: "puu", english: "tree" },
  fence: { estonian: "aed", english: "fence" },
};

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

function ClickToFocus({
  controlsRef,
}: {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
  const zoomRef = useRef<number | null>(null);
  const downPos = useRef<{ x: number; y: number } | null>(null);
  const dragged = useRef(false);

  //smoothly move camera target to click point
  useFrame(() => {
    if (!zoomRef.current || !controlsRef.current) return;

    const cam = controlsRef.current.object;
    cam.zoom += (zoomRef.current - cam.zoom) * 0.05;
    cam.updateProjectionMatrix();

    if (Math.abs(cam.zoom - zoomRef.current) < 0.1) {
      cam.zoom = zoomRef.current;
      zoomRef.current = null;
    }
  });

  return (
    //invisible plane on the ground to catch clicks
    <mesh
      rotation-x={-Math.PI / 2}
      position={[0, 0, 0]}
      onPointerDown={(e) => {
        downPos.current = { x: e.clientX, y: e.clientY };
        dragged.current = false;
      }}
      onPointerMove={(e) => {
        if (!downPos.current) return;
        const dx = e.clientX - downPos.current.x;
        const dy = e.clientY - downPos.current.y;
        if (dx * dx + dy * dy > 25) dragged.current = true;
      }}
      onPointerUp={() => {
        if (dragged.current) return; //was a drag/rotate, skip zoom
        if (!controlsRef.current) return;
        const cam = controlsRef.current.object;
        zoomRef.current = Math.min(cam.zoom * 1.5, 200);
      }}
    >
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial transparent opacity={0} />
    </mesh>
  );
}

function HoverMesh({
  children,
  hitPadding = 0.3,
  word,
  onSelect,
}: {
  children: React.ReactNode;
  hitPadding?: number;
  word: string;
  onSelect: (word: string) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const hitRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  //set emissive to 0 on mount so it doesn't flash
  useEffect(() => {
    if (!ref.current) return;
    ref.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.emissive = new THREE.Color("#ffffff");
        child.material.emissiveIntensity = 0;
      }
    });
  }, []);

  //resize hitbox to match model bounds + padding
  useEffect(() => {
    if (!ref.current || !hitRef.current) return;
    const box = new THREE.Box3().setFromObject(ref.current);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    hitRef.current.scale.set(
      size.x + hitPadding,
      size.y + hitPadding,
      size.z + hitPadding,
    );
    hitRef.current.position.copy(center);
  }, [hitPadding]);

  //cursor pointer
  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  //smooth scale + emissive
  useFrame(() => {
    if (!ref.current) return;

    const targetScale = hovered ? 1.1 : 1.0;
    ref.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.05,
    );

    ref.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const targetIntensity = hovered ? 0.1 : 0;
        child.material.emissive = new THREE.Color("#ffffff");
        child.material.emissiveIntensity +=
          (targetIntensity - child.material.emissiveIntensity) * 0.1;
      }
    });
  });

  return (
    <group>
      {/* invisible hitbox a little bigger than model */}
      <mesh
        ref={hitRef}
        visible={false}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerUp={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation(); //stops click reaching ClickToFocus plane below
          onSelect(word);
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* actual model */}
      <group ref={ref}>{children}</group>
    </group>
  );
}

export default function Scene(): JSX.Element {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  //log mesh name user clicked
  function handleSelect(word: string) {
    console.log("clicked:", word, "->", VOCABULARY[word].estonian);
  }

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
        ref={controlsRef}
        target={[0.05, 2, 0]}
        enableRotate={true}
        enableZoom={true}
        enablePan={true}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
      />

      <ClickToFocus controlsRef={controlsRef} />

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
      <HoverMesh word="bench" onSelect={handleSelect}>
        <Bench />
      </HoverMesh>
      <HoverMesh word="canoe" onSelect={handleSelect}>
        <Canoe />
      </HoverMesh>
      <HoverMesh word="fence" onSelect={handleSelect}>
        <Fence />
      </HoverMesh>
      <HoverMesh word="flowers" onSelect={handleSelect}>
        <Flowers />
      </HoverMesh>
      <Lake />
      <HoverMesh word="mushrooms" onSelect={handleSelect}>
        <Mushrooms />
      </HoverMesh>
      <HoverMesh word="stone" onSelect={handleSelect}>
        <Stone />
      </HoverMesh>
      <HoverMesh word="tree" onSelect={handleSelect}>
        <Tree />
      </HoverMesh>
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
