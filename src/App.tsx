import { useState } from "react";
import StartScreen from "./components/ui/StartScreen";
import Scene from "./components/scene/Scene";

export default function App() {
  const [started, setStarted] = useState(false);
  const [isNight, setIsNight] = useState(false);

  function handleStartOver() {
    setIsNight(false);
  }

  if (!started) return <StartScreen onStart={() => setStarted(true)} />;

  return (
    <Scene
      isNight={isNight}
      onNightMode={() => setIsNight(true)}
      onStartOver={handleStartOver}
    />
  );
}
