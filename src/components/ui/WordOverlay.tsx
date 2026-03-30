import type { Vocabulary } from "../../data/vocabulary";
import "./WordOverlay.css";

interface WordOverlayProps {
  word: string;
  onClose: () => void;
  vocabulary: Vocabulary;
}

export function WordOverlay({ word, onClose, vocabulary }: WordOverlayProps) {
  const entry = vocabulary[word];
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
