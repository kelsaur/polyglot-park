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
  Frog,
  Deer,
  Owl,
  Campfire,
  Tent,
  Moon,
} from "./Models";
import { Clouds } from "./Clouds";
import { ParkScene } from "./ParkScene";
import { Suspense } from "react";
import ProgressBar from "../ui/ProgressBar";
import { NIGHT_VOCABULARY } from "../../data/vocabulary";
import CompletionPopup from "../ui/CompletionPopup";
import { Fireflies } from "./Fireflies";

const TOTAL_WORDS = Object.keys(NIGHT_VOCABULARY).length;
const INITIAL_ZOOM = 60;
const INITIAL_TARGET = new THREE.Vector3(0.05, 2, 0);
const INITIAL_POSITION = new THREE.Vector3(10, 10, 10);

export default function NightScene({
  onStartOver,
}: {
  onStartOver: () => void;
}): JSX.Element {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const cancelFocusRef = useRef<(() => void) | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    const audio = new Audio("/audio/ambience-night.mp3");
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
        className="scene-canvas-night"
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
          <ambientLight intensity={1} />
          {/*<directionalLight intensity={2} position={[10, 20, 10]} castShadow />*/}

          <Environment files="/hdri/hdr-night.hdr" />

          {/* Light position helper */}
          {/* <mesh position={[3, 0.5, -3]}>
            <sphereGeometry args={[0.1]} />
            <meshBasicMaterial color="yellow" />
          </mesh>*/}

          {/* Point light 1 - trees back*/}
          <pointLight
            position={[-0.7, 0.5, -2]}
            intensity={1}
            color="#ff5500"
            decay={2}
          />

          {/* Point light 2 - owl*/}
          <pointLight
            position={[-0.2, 1.3, -1.4]}
            intensity={0.5}
            color="#ff5500"
            decay={2}
          />

          {/* Point light 3 - mountains*/}
          <pointLight
            position={[-2, 0.5, 0]}
            intensity={1}
            color="#ffbb00"
            decay={1}
          />

          {/* Point light 4 - trees right*/}
          <pointLight
            position={[2, 1, -3]}
            intensity={1}
            color="#ff9500"
            decay={1}
          />

          {/* Point light 5 - campfire*/}
          <pointLight
            position={[1.78, 0.15, 2.33]}
            intensity={1}
            color="#ff2200"
            decay={2}
          />

          {/* Point light 6 - fence grass*/}
          <pointLight
            position={[-3, 0.5, 2.7]}
            intensity={1}
            color="#ffbf00"
            decay={2}
          />

          {/* Point light 7 - lake*/}
          <pointLight
            position={[1.5, 0.2, -0.2]}
            intensity={0.8}
            color="#00ffbf"
            decay={1}
            distance={4}
          />

          {/* Point light 8 - flowers front*/}
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

          <Fireflies count={10} />

          {/* interactive models */}
          <HoverMesh
            word="frog"
            onSelect={setSelected}
            isVisited={visited.has("frog")}
            isAnySelected={!!selected || showCompletion}
          >
            <Frog />
          </HoverMesh>
          <HoverMesh
            word="deer"
            onSelect={setSelected}
            isVisited={visited.has("deer")}
            isAnySelected={!!selected || showCompletion}
          >
            <Deer />
          </HoverMesh>
          <HoverMesh
            word="owl"
            onSelect={setSelected}
            isVisited={visited.has("owl")}
            isAnySelected={!!selected || showCompletion}
          >
            <Owl />
          </HoverMesh>
          <HoverMesh
            word="campfire"
            onSelect={setSelected}
            isVisited={visited.has("campfire")}
            isAnySelected={!!selected || showCompletion}
          >
            <Campfire />
          </HoverMesh>
          <HoverMesh
            word="tent"
            onSelect={setSelected}
            isVisited={visited.has("tent")}
            isAnySelected={!!selected || showCompletion}
          >
            <Tent />
          </HoverMesh>
          <HoverMesh
            word="moon"
            onSelect={setSelected}
            isVisited={visited.has("moon")}
            isAnySelected={!!selected || showCompletion}
          >
            <Moon position={[-3, 6.5, 1]} rotation={[0, -0.5, 0.5]} />
          </HoverMesh>
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
          vocabulary={NIGHT_VOCABULARY}
        />
      )}

      {showCompletion && <CompletionPopup onStartOver={onStartOver} />}
    </div>
  );
}
