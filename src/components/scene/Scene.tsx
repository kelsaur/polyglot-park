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
import { DAY_VOCABULARY, NIGHT_VOCABULARY } from "../../data/vocabulary";
import CompletionPopup from "../ui/CompletionPopup";
import { Fireflies } from "./Fireflies";
import { Stars } from "./Stars";

const INITIAL_ZOOM = 60;
const INITIAL_TARGET = new THREE.Vector3(0.05, 2, 0);
const INITIAL_POSITION = new THREE.Vector3(10, 10, 10);

export default function Scene({
  isNight,
  onNightMode,
  onStartOver,
}: {
  isNight: boolean;
  onNightMode: () => void;
  onStartOver: () => void;
}): JSX.Element {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const cancelFocusRef = useRef<(() => void) | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [showCompletion, setShowCompletion] = useState(false);

  const vocabulary = isNight ? NIGHT_VOCABULARY : DAY_VOCABULARY;
  const TOTAL_WORDS = Object.keys(vocabulary).length;

  //ambient audio
  useEffect(() => {
    const audio = new Audio(
      isNight ? "/audio/ambience-night.mp3" : "/audio/ambience-day.mp3",
    );
    audio.loop = true;
    audio.volume = 0.3;
    audio.play();

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [isNight]);

  //reset visited when switching between day and night
  useEffect(() => {
    setVisited(new Set());
    setShowCompletion(false);
    setSelected(null);
  }, [isNight]);

  //reset camera view
  function handleResetView() {
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
        className={isNight ? "scene-canvas-night" : "scene-canvas-day"}
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

          {/* shared lighting */}
          <ambientLight intensity={isNight ? 1 : 0.5} />
          <Environment
            files={isNight ? "/hdri/hdr-night.hdr" : "/hdri/hdr-day.hdr"}
          />

          {/* day lighting */}
          {!isNight && (
            <>
              <pointLight
                position={[-0.7, 0.5, -2]}
                intensity={1}
                color="#ff5500"
                decay={3}
              />
              <pointLight
                position={[-3, 0.3, 2.7]}
                intensity={0.5}
                color="#ffcc88"
                decay={2}
              />
              <pointLight
                position={[1.5, 0.2, -0.2]}
                intensity={0.8}
                color="#aaddff"
                decay={0.5}
                distance={5}
              />
              <pointLight
                position={[3, 0.4, 3]}
                intensity={0.5}
                color="#ff6135"
                decay={2}
              />
            </>
          )}

          {/* night lighting */}
          {isNight && (
            <>
              <pointLight
                position={[-0.7, 0.5, -2]}
                intensity={1}
                color="#ff5500"
                decay={2}
              />
              <pointLight
                position={[-0.2, 1.3, -1.4]}
                intensity={0.5}
                color="#ff5500"
                decay={2}
              />
              <pointLight
                position={[-2, 0.5, 0]}
                intensity={1}
                color="#ffbb00"
                decay={1}
              />
              <pointLight
                position={[2, 1, -3]}
                intensity={1}
                color="#ff9500"
                decay={1}
              />
              <pointLight
                position={[1.78, 0.15, 2.33]}
                intensity={1}
                color="#ff2200"
                decay={2}
              />
              <pointLight
                position={[-3, 0.5, 2.7]}
                intensity={1}
                color="#ffbf00"
                decay={2}
              />
              <pointLight
                position={[1.5, 0.2, -0.2]}
                intensity={0.8}
                color="#00ffbf"
                decay={1}
                distance={4}
              />
              <pointLight
                position={[3, 0.4, 3]}
                intensity={0.5}
                color="#ff6135"
                decay={2}
              />
              <pointLight
                position={[-3, 6.5, 2]}
                intensity={1}
                color="#ffffaa"
                decay={1}
                distance={5}
              />
            </>
          )}

          {/* shared models */}
          <ParkScene />
          <Lake />

          {/* day only */}
          {!isNight && (
            <>
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
              <Clouds
                path="/models/cloud3.glb"
                position={[0, 9, 0]}
                offset={4}
              />
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
            </>
          )}

          {/* night only */}
          {isNight && (
            <>
              {/* night environment */}
              <Stars count={300} />
              <Fireflies count={10} />
              {/* non-interactive day models still visible at night */}
              <Bench />
              <Canoe />
              <Fence />
              <Flowers />
              <Mushrooms />
              <Stone />
              <Tree />

              {/* night interactive models */}
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
                <Moon
                  position={[-3, 6.5, 1]}
                  rotation={[0, -0.5, 0.5]}
                  scale={[1.5, 1.5, 1.5]}
                />
              </HoverMesh>
            </>
          )}
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
          vocabulary={vocabulary}
        />
      )}

      {showCompletion && (
        <CompletionPopup
          onNightMode={isNight ? undefined : onNightMode}
          onStartOver={onStartOver}
        />
      )}
    </div>
  );
}
