import React, { useState, useRef, useEffect } from 'react';
import AudioInfo from './AudioInfo';
import ProgressBar from './ProgressBar';
import AudioControls from './AudioControls';
import TrackList from './TrackList';

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

export default function WorkingAudioModal({
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  // Sync internal state with prop when it changes
  useEffect(() => {
    setCurrentTrackIndex(propCurrentTrackIndex);
  }, [propCurrentTrackIndex]);

  // Reset playing state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsPlaying(false);
    }
  }, [isOpen]);

  const handleNext = () => {
    const newIndex =
      currentTrackIndex < tracks.length - 1 ? currentTrackIndex + 1 : 0;
    setCurrentTrackIndex(newIndex);
    onTrackChange?.(newIndex);
    setIsPlaying(false);
  };

  const handlePrevious = () => {
    const newIndex =
      currentTrackIndex > 0 ? currentTrackIndex - 1 : tracks.length - 1;
    setCurrentTrackIndex(newIndex);
    onTrackChange?.(newIndex);
    setIsPlaying(false);
  };

  // Load track and set up event listeners when it changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    // Set up event listeners
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      handleNext();
    };

    // Add event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    // Load the track
    audio.src = currentTrack.url;
    audio.load();
    setCurrentTime(0);
    setDuration(0);

    // Cleanup function
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, currentTrack]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newVolume = Math.max(0, Math.min(1, clickX / width));

    setVolume(newVolume);
    setIsMuted(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTrackSelect = (index: number) => {
    setCurrentTrackIndex(index);
    onTrackChange?.(index);
    setIsPlaying(false);
  };

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

        {/* Track List */}
        <TrackList
          tracks={tracks}
          currentTrackIndex={currentTrackIndex}
          onTrackSelect={handleTrackSelect}
          formatTime={formatTime}
        />
      </div>
    </div>
  );
}
