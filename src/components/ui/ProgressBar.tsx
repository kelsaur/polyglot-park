import "./ProgressBar.css";

interface ProgressBarProps {
  visited: Set<string>;
  total: number;
}

export default function ProgressBar({ visited, total }: ProgressBarProps) {
  const count = visited.size;
  const percentage = (count / total) * 100;
  const allDone = count === total;

  return (
    <div className="progress-wrapper">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
      {allDone && <p className="progress-complete">All words found!</p>}
    </div>
  );
}
