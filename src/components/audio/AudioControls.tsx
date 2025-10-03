import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface AudioControlsProps {
  isPlaying: boolean;
  onTogglePlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  onVolumeClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  isPlaying,
  onTogglePlayPause,
  onPrevious,
  onNext,
  volume,
  isMuted,
  onVolumeChange,
  onMuteToggle,
  onVolumeClick,
}) => {
  return (
    <div className="mb-6 flex items-center justify-between sm:mb-8">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button
          onClick={onPrevious}
          className="p-2 text-white/60 transition-colors duration-300 hover:text-white"
          aria-label="Previous track"
        >
          <SkipBack size={18} className="sm:h-5 sm:w-5" />
        </button>

        <button
          onClick={onTogglePlayPause}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-all duration-300 hover:bg-white/90 sm:h-12 sm:w-12"
          aria-label={isPlaying ? 'Pause track' : 'Play track'}
        >
          {isPlaying ? (
            <Pause size={18} className="sm:h-5 sm:w-5" />
          ) : (
            <Play size={18} className="ml-0.5 sm:h-5 sm:w-5" />
          )}
        </button>

        <button
          onClick={onNext}
          className="p-2 text-white/60 transition-colors duration-300 hover:text-white"
          aria-label="Next track"
        >
          <SkipForward size={18} className="sm:h-5 sm:w-5" />
        </button>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3">
        <button
          onClick={onMuteToggle}
          className="p-2 text-white/60 transition-colors duration-300 hover:text-white"
          aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
        >
          {isMuted ? (
            <VolumeX size={18} className="sm:h-5 sm:w-5" />
          ) : (
            <Volume2 size={18} className="sm:h-5 sm:w-5" />
          )}
        </button>

        <div
          className="h-1 w-16 cursor-pointer rounded-full bg-white/20 transition-colors duration-200 hover:bg-white/30 sm:w-20"
          onClick={onVolumeClick}
          role="slider"
          aria-label="Volume control"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round((isMuted ? 0 : volume) * 100)}
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
              e.preventDefault();
              const newVolume =
                e.key === 'ArrowLeft'
                  ? Math.max(0, volume - 0.1)
                  : Math.min(1, volume + 0.1);
              onVolumeChange(newVolume);
            }
          }}
        >
          <div
            className="h-full rounded-full bg-white transition-all duration-200"
            style={{ width: `${isMuted ? 0 : volume * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioControls;
