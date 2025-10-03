import React from 'react';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  formatTime: (time: number) => string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onProgressClick,
  formatTime,
}) => {
  return (
    <div className="mb-6">
      <div
        className="group h-1 w-full cursor-pointer rounded-full bg-white/20"
        onClick={onProgressClick}
      >
        <div
          className="h-full rounded-full bg-white transition-all duration-200 group-hover:bg-white/80"
          style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs font-light text-white/60">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
