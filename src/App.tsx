import "./index.css";
import { useState } from "react";
import StartScreen from "./components/ui/StartScreen";
//import Scene from "./components/scene/Scene";
import NightScene from "./components/scene/NightScene";

export default function App() {
  const [started, setStarted] = useState(false);

  if (!started) return <StartScreen onStart={() => setStarted(true)} />;
  return <NightScene />;
}
