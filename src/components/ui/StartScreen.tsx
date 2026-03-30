import "./StartScreen.css";

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="start-wrapper">
      <div className="start-content">
        <img
          src="/favicon.svg"
          width={56}
          height={56}
          alt="Polyglot Park logo"
          className="start-logo"
        />

        <h1 className="start-title">Polyglot Park</h1>
        <p className="start-description">Explore a 3D park. Learn Estonian.</p>

        <button className="start-button" onClick={onStart}>
          Start exploring
        </button>

        <div className="start-controls">
          <p className="start-controls-label">How to navigate</p>
          <div className="start-controls-grid">
            <div className="start-control-item">
              <kbd>scroll</kbd>
              <span>zoom in / out</span>
            </div>
            <div className="start-control-item">
              <kbd>left drag</kbd>
              <span>rotate view</span>
            </div>
            <div className="start-control-item">
              <kbd>right drag</kbd>
              <span>pan around</span>
            </div>
            <div className="start-control-item">
              <kbd>double click</kbd>
              <span>zoom to spot</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
