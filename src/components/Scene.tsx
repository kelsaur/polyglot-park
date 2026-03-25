import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF, Html } from "@react-three/drei";
import type { JSX } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useRef, useEffect, useState } from "react";
import "../Scene.css";

const VOCABULARY: Record<
  string,
  { estonian: string; english: string; audio?: string }
> = {
  bench: {
    estonian: "pink",
    english: "bench",
    audio: "/audio/pink.mp3",
  },
  canoe: {
    estonian: "kanuu",
    english: "canoe",
    audio: "/audio/kanuu.mp3",
  },
  flowers: {
    estonian: "lilled",
    english: "flowers",
    audio: "/audio/lilled.mp3",
  },
  mushrooms: {
    estonian: "seened",
    english: "mushrooms",
    audio: "/audio/seened.mp3",
  },
  stone: {
    estonian: "kivi",
    english: "stone",
    audio: "/audio/kivi.mp3",
  },
  tree: {
    estonian: "puu",
    english: "tree",
    audio: "/audio/puu.mp3",
  },
  fence: {
    estonian: "aed",
    english: "fence",
    audio: "/audio/aed.mp3",
  },
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
  isVisited = false,
  isAnySelected = false,
}: {
  children: React.ReactNode;
  hitPadding?: number;
  word: string;
  onSelect: (word: string) => void;
  isVisited?: boolean;
  isAnySelected?: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const hitRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [meshTop, setMeshTop] = useState<THREE.Vector3>(
    new THREE.Vector3(0, 4, 0),
  );

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

  //resize hitbox + calculate mesh top for checkmark
  useEffect(() => {
    if (!ref.current || !hitRef.current) return;
    const box = new THREE.Box3().setFromObject(ref.current);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    //hitbox
    hitRef.current.scale.set(
      size.x + hitPadding,
      size.y + hitPadding,
      size.z + hitPadding,
    );
    hitRef.current.position.copy(center);

    //checkmark position: top of mesh center + 1 unit above
    setMeshTop(new THREE.Vector3(center.x, box.max.y + 1, center.z));
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
      {/* checkmark above mesh, only when visited */}
      {isVisited && !isAnySelected && (
        <Html
          position={[meshTop.x, meshTop.y, meshTop.z]}
          center
          transform
          sprite
        >
          <div className="checkmark">✓</div>
        </Html>
      )}

      {/* invisible hitbox */}
      <mesh
        ref={hitRef}
        visible={false}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerUp={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
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

//word overlay shown when user clicks an object
function WordOverlay({ word, onClose }: { word: string; onClose: () => void }) {
  const entry = VOCABULARY[word];
  if (!entry) return null;

  function playAudio() {
    if (!entry.audio) return;
    const audio = new Audio(entry.audio);
    audio.play();
  }

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="overlay-card" onClick={(e) => e.stopPropagation()}>
        <p className="overlay-estonian">{entry.estonian}</p>
        <p className="overlay-english">{entry.english}</p>
        <button className="overlay-audio" onClick={playAudio}>
          🔊
        </button>
        <button className="overlay-close" onClick={onClose}>
          close
        </button>
      </div>
    </div>
  );
}

export default function Scene(): JSX.Element {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [visited, setVisited] = useState<Set<string>>(new Set());

  //mark as visited when overlay is closed
  function handleClose() {
    if (selected) setVisited((prev) => new Set(prev).add(selected));
    setSelected(null);
  }

  return (
    <div className="scene-wrapper">
      <Canvas
        className="scene-canvas"
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
        <HoverMesh
          word="bench"
          onSelect={setSelected}
          isVisited={visited.has("bench")}
          isAnySelected={!!selected}
        >
          <Bench />
        </HoverMesh>
        <HoverMesh
          word="canoe"
          onSelect={setSelected}
          isVisited={visited.has("canoe")}
          isAnySelected={!!selected}
        >
          <Canoe />
        </HoverMesh>
        <HoverMesh
          word="fence"
          onSelect={setSelected}
          isVisited={visited.has("fence")}
          isAnySelected={!!selected}
        >
          <Fence />
        </HoverMesh>
        <HoverMesh
          word="flowers"
          onSelect={setSelected}
          isVisited={visited.has("flowers")}
          isAnySelected={!!selected}
        >
          <Flowers />
        </HoverMesh>
        <Lake />
        <HoverMesh
          word="mushrooms"
          onSelect={setSelected}
          isVisited={visited.has("mushrooms")}
          isAnySelected={!!selected}
        >
          <Mushrooms />
        </HoverMesh>
        <HoverMesh
          word="stone"
          onSelect={setSelected}
          isVisited={visited.has("stone")}
          isAnySelected={!!selected}
        >
          <Stone />
        </HoverMesh>
        <HoverMesh
          word="tree"
          onSelect={setSelected}
          isVisited={visited.has("tree")}
          isAnySelected={!!selected}
        >
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
        <Clouds
          path="/models/cloud2.glb"
          position={[3, 6.6, -1]}
          offset={0.5}
        />
      </Canvas>

      {selected && <WordOverlay word={selected} onClose={handleClose} />}
    </div>
  );
}
