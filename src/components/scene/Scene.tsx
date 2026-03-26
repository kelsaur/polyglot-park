import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import type { JSX } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useRef, useState } from "react";
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
} from "./Models";
import { Clouds } from "./Clouds";
import { ParkScene } from "./ParkScene";
import { Suspense } from "react";
import ProgressBar from "../ui/ProgressBar";
import { VOCABULARY } from "../../data/vocabulary";
import CompletionPopup from "../ui/CompletionPopup";

const TOTAL_WORDS = Object.keys(VOCABULARY).length;

export default function Scene(): JSX.Element {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [showCompletion, setShowCompletion] = useState(false);

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

  // resets all visited words and hides completion popup
  function handleStartOver() {
    setVisited(new Set());
    setShowCompletion(false);
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
        <Suspense fallback={null}>
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
          <Clouds
            path="/models/cloud1.glb"
            position={[0, 10, 5]}
            offset={3.4}
          />
          <Clouds
            path="/models/cloud2.glb"
            position={[3, 6.6, -1]}
            offset={0.5}
          />
        </Suspense>
      </Canvas>

      <ProgressBar visited={visited} total={TOTAL_WORDS} />

      {selected && <WordOverlay word={selected} onClose={handleClose} />}

      {showCompletion && <CompletionPopup onStartOver={handleStartOver} />}
    </div>
  );
}
