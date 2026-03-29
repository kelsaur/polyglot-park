import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import type { JSX } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useRef, useState, useEffect } from "react";
import "../../styles/Scene.css";
import { WordOverlay } from "../ui/WordOverlay";
import { HoverMesh } from "../helpers/HoverMesh";
import { ClickToFocus } from "../ui/ClickToFocus";
import {
  Bench,
  Canoe,
  Fence,
  Flowers,
  Lake,
  Mushrooms,
  Stone,
  Tree,
  Path,
} from "./Models";
import { Clouds } from "./Clouds";
import { ParkScene } from "./ParkScene";
import { Suspense } from "react";
import ProgressBar from "../ui/ProgressBar";
import { DAY_VOCABULARY } from "../../data/vocabulary";
import CompletionPopup from "../ui/CompletionPopup";

const TOTAL_WORDS = Object.keys(DAY_VOCABULARY).length;
const INITIAL_ZOOM = 60;
const INITIAL_TARGET = new THREE.Vector3(0.05, 2, 0);
const INITIAL_POSITION = new THREE.Vector3(10, 10, 10);

export default function DayScene({
  onNightMode,
  onStartOver,
}: {
  onNightMode: () => void;
  onStartOver: () => void;
}): JSX.Element {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const cancelFocusRef = useRef<(() => void) | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    const audio = new Audio("/audio/ambience-day.mp3");
    audio.loop = true;
    audio.volume = 0.3;
    audio.play();

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  function handleResetView() {
    //cancel any ongoing zoom/pan animation first
    cancelFocusRef.current?.();

    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    const cam = controls.object;

    controls.target.copy(INITIAL_TARGET);
    cam.position.copy(INITIAL_POSITION);
    cam.zoom = INITIAL_ZOOM;
    cam.updateProjectionMatrix();
    controls.update();
  }

  //mark as visited when overlay is closed
  function handleClose() {
    if (selected) {
      const newVisited = new Set(visited).add(selected);
      setVisited(newVisited);
      if (newVisited.size === TOTAL_WORDS) {
        setShowCompletion(true);
      }
    }
    setSelected(null);
  }

  return (
    <div className="scene-wrapper">
      <Canvas
        className="scene-canvas-day"
        onCreated={({ scene }) => {
          scene.environmentIntensity = 0.5;
          scene.environmentRotation.y = Math.PI / 5;
        }}
        orthographic
        camera={{
          position: INITIAL_POSITION.toArray(),
          zoom: INITIAL_ZOOM,
          near: 0.1,
          far: 1000,
        }}
      >
        <Suspense fallback={null}>
          <OrbitControls
            ref={controlsRef}
            target={INITIAL_TARGET.toArray()}
            enableRotate={true}
            enableZoom={true}
            enablePan={true}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.5}
          />

          <ClickToFocus controlsRef={controlsRef} cancelRef={cancelFocusRef} />

          {/* lighting */}
          <ambientLight intensity={0.5} />
          {/*<directionalLight intensity={2} position={[10, 20, 10]} castShadow />*/}

          <Environment files="/hdri/hdr-day.hdr" />
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
            isAnySelected={!!selected || showCompletion}
          >
            <Bench />
          </HoverMesh>
          <HoverMesh
            word="canoe"
            onSelect={setSelected}
            isVisited={visited.has("canoe")}
            isAnySelected={!!selected || showCompletion}
          >
            <Canoe />
          </HoverMesh>
          <HoverMesh
            word="fence"
            onSelect={setSelected}
            isVisited={visited.has("fence")}
            isAnySelected={!!selected || showCompletion}
          >
            <Fence />
          </HoverMesh>
          <HoverMesh
            word="flowers"
            onSelect={setSelected}
            isVisited={visited.has("flowers")}
            isAnySelected={!!selected || showCompletion}
          >
            <Flowers />
          </HoverMesh>
          <Lake />
          <HoverMesh
            word="mushrooms"
            onSelect={setSelected}
            isVisited={visited.has("mushrooms")}
            isAnySelected={!!selected || showCompletion}
          >
            <Mushrooms />
          </HoverMesh>
          <HoverMesh
            word="stone"
            onSelect={setSelected}
            isVisited={visited.has("stone")}
            isAnySelected={!!selected || showCompletion}
          >
            <Stone />
          </HoverMesh>
          <HoverMesh
            word="tree"
            onSelect={setSelected}
            isVisited={visited.has("tree")}
            isAnySelected={!!selected || showCompletion}
          >
            <Tree />
          </HoverMesh>
          <HoverMesh
            word="path"
            onSelect={setSelected}
            isVisited={visited.has("path")}
            isAnySelected={!!selected || showCompletion}
          >
            <Path />
          </HoverMesh>
          <Clouds
            path="/models/cloud1.glb"
            position={[3, 5, -3]}
            offset={0}
            hoverSound="/audio/wind.mp3"
          />
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
            hoverSound="/audio/wind.mp3"
          />
          <Clouds path="/models/cloud3.glb" position={[0, 9, 0]} offset={4} />
          <Clouds
            path="/models/cloud1.glb"
            position={[0, 10, 5]}
            offset={3.4}
          />
          <Clouds
            path="/models/cloud2.glb"
            position={[3, 6.6, -1]}
            offset={0.5}
            hoverSound="/audio/wind.mp3"
          />
        </Suspense>
      </Canvas>

      <button className="reset-btn" onClick={handleResetView}>
        ⟳ Reset view
      </button>

      <ProgressBar visited={visited} total={TOTAL_WORDS} />

      {selected && (
        <WordOverlay
          word={selected}
          onClose={handleClose}
          vocabulary={DAY_VOCABULARY}
        />
      )}

      {showCompletion && (
        <CompletionPopup onNightMode={onNightMode} onStartOver={onStartOver} />
      )}
    </div>
  );
}
