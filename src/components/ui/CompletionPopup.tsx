import "./CompletionPopup.css";

interface CompletionPopupProps {
  onNightMode?: () => void;
  onStartOver: () => void;
}

export default function CompletionPopup({
  onNightMode,
  onStartOver,
}: CompletionPopupProps) {
  return (
    <div className="completion-backdrop">
      <div className="completion-card" onClick={(e) => e.stopPropagation()}>
        <div className="completion-star">🌟</div>
        <h2 className="completion-title">Great job!</h2>
        <p className="completion-description">
          You've discovered every word in the park!
        </p>
        {onNightMode && (
          <button className="completion-startover-btn" onClick={onNightMode}>
            Explore at night
          </button>
        )}
        <button className="completion-startover-btn" onClick={onStartOver}>
          Start over
        </button>
      </div>
    </div>
  );
}
