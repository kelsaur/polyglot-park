import "./index.css";
import { useState } from "react";
import StartScreen from "./components/ui/StartScreen";
import DayScene from "./components/scene/DayScene";
import NightScene from "./components/scene/NightScene";

export default function App() {
  const [started, setStarted] = useState(false);
  const [isNight, setIsNight] = useState(false);

  function handleStartOver() {
    setIsNight(false);
  }

  if (!started) return <StartScreen onStart={() => setStarted(true)} />;
  if (isNight) return <NightScene onStartOver={handleStartOver} />;
  return (
    <DayScene
      onNightMode={() => setIsNight(true)}
      onStartOver={handleStartOver}
    />
  );
}
