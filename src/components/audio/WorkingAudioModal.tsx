import { useState, useEffect, useCallback, memo } from 'react';
import AudioInfo from './AudioInfo';
import ProgressBar from './ProgressBar';
import AudioControls from './AudioControls';
import TrackList from './TrackList';
import { useAudioPlayer } from './useAudioPlayer';
import { useAudioDuration } from './useAudioDuration';
// import type { TrackWithDuration } from '../../utils/audioDuration';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
}

interface WorkingAudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: Track[];
  albumTitle: string;
  currentTrackIndex?: number;
  onTrackChange?: (index: number) => void;
}

const WorkingAudioModal = memo(function WorkingAudioModal({
  isOpen,
  onClose,
  tracks,
  albumTitle,
  currentTrackIndex: propCurrentTrackIndex = 0,
  onTrackChange,
}: WorkingAudioModalProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(
    propCurrentTrackIndex
  );

  // Use the duration detection hook
  const {
    tracks: tracksWithDuration,
    durationsLoaded,
    loadingProgress,
    getDisplayDuration,
  } = useAudioDuration(tracks);

  // Use the custom audio player hook with updated tracks
  const {
    audioRef,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    setIsPlaying,
    setIsMuted,
    setVolume,
    togglePlayPause,
    handleNext,
    handlePrevious,
    handleProgressClick,
    handleVolumeClick,
    handleTrackSelect,
    formatTime,
  } = useAudioPlayer({
    tracks: tracksWithDuration,
    currentTrackIndex,
    onTrackChange: handleTrackChange,
  });

  // Sync internal state with prop when it changes
  useEffect(() => {
    setCurrentTrackIndex(propCurrentTrackIndex);
  }, [propCurrentTrackIndex]);

  // Memoize track change handler
  const handleTrackChange = useCallback((index: number) => {
    setCurrentTrackIndex(index);
    onTrackChange?.(index);
  }, [onTrackChange]);

  // Reset playing state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsPlaying(false);
    }
  }, [isOpen, setIsPlaying]);

  if (!isOpen || !currentTrack) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="audio-modal-title"
      aria-describedby="audio-modal-description"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative mx-4 w-full max-w-2xl rounded-2xl border border-white/10 bg-black/90 p-4 backdrop-blur-2xl sm:mx-6 sm:p-6 lg:p-8">
        <audio ref={audioRef} preload="metadata" />

        {/* Audio Info */}
        <AudioInfo
          albumTitle={albumTitle}
          tracksCount={tracks.length}
          currentTrack={currentTrack}
          onClose={onClose}
        />

        {/* Progress Bar */}
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          onProgressClick={handleProgressClick}
          formatTime={formatTime}
        />

        {/* Controls */}
        <AudioControls
          isPlaying={isPlaying}
          onTogglePlayPause={togglePlayPause}
          onPrevious={handlePrevious}
          onNext={handleNext}
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={setVolume}
          onMuteToggle={() => setIsMuted(!isMuted)}
          onVolumeClick={handleVolumeClick}
        />

        {/* Duration Loading Indicator */}
        {!durationsLoaded && (
          <div className="mb-4 text-center">
            <div className="text-sm text-gray-400">
              Loading track durations... {loadingProgress}%
            </div>
            <div className="mt-2 h-1 w-full rounded-full bg-gray-700">
              <div
                className="h-1 rounded-full bg-blue-500 transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Track List */}
        <TrackList
          tracks={tracksWithDuration}
          currentTrackIndex={currentTrackIndex}
          onTrackSelect={handleTrackSelect}
          getDisplayDuration={getDisplayDuration}
        />
      </div>
    </div>
  );
});

WorkingAudioModal.displayName = 'WorkingAudioModal';

export default WorkingAudioModal;
