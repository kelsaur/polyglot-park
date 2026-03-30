import * as THREE from "three";
import type { JSX } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Canvas } from "@react-three/fiber";
import { useRef, useState, useEffect, Suspense } from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import { DAY_VOCABULARY, NIGHT_VOCABULARY } from "../../data/vocabulary";
import "../../styles/Scene.css";
import ProgressBar from "../ui/ProgressBar";
import CompletionPopup from "../ui/CompletionPopup";
import { WordOverlay } from "../ui/WordOverlay";
import { ClickToFocus } from "../ui/ClickToFocus";
import { Lake, ParkScene } from "./models/Models";
import { DayModels } from "./models/DayModels";
import { NightModels } from "./models/NightModels";

const INITIAL_ZOOM = 60;
const INITIAL_TARGET = new THREE.Vector3(0.05, 2, 0);
const INITIAL_POSITION = new THREE.Vector3(10, 10, 10);

interface SceneProps {
  isNight: boolean;
  onNightMode: () => void;
  onStartOver: () => void;
}

export default function Scene({
  isNight,
  onNightMode,
  onStartOver,
}: SceneProps): JSX.Element {
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

  //mark word as visited, check if all words are found, and close word overlay
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
        {/* suspend rendering until all GLB models are loaded */}
        <Suspense fallback={null}>
          {/* camera controls - rotate, zoom, pan */}
          <OrbitControls
            ref={controlsRef}
            target={INITIAL_TARGET.toArray()}
            enableRotate={true}
            enableZoom={true}
            enablePan={true}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.5}
          />

          {/* double click to zoom and focus */}
          <ClickToFocus controlsRef={controlsRef} cancelRef={cancelFocusRef} />
          {/* shared lighting */}
          <ambientLight intensity={isNight ? 1 : 0.5} />
          {/* environment lighting */}
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
          {/* day only models*/}
          {!isNight && (
            <>
              <DayModels
                selected={selected}
                showCompletion={showCompletion}
                visited={visited}
                onSelect={setSelected}
              />
            </>
          )}
          {/* night only models */}
          {isNight && (
            <>
              <NightModels
                selected={selected}
                showCompletion={showCompletion}
                visited={visited}
                onSelect={setSelected}
              />
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
