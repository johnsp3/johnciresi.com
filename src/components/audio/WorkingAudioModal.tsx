import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

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
  onTrackChange 
}: WorkingAudioModalProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(propCurrentTrackIndex);
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
    const newIndex = currentTrackIndex < tracks.length - 1 ? currentTrackIndex + 1 : 0;
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

  const handlePrevious = () => {
    const newIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : tracks.length - 1;
    setCurrentTrackIndex(newIndex);
    onTrackChange?.(newIndex);
    setIsPlaying(false);
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
      <div className="relative w-full max-w-2xl bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 sm:p-6 lg:p-8 mx-4 sm:mx-6">
        <audio ref={audioRef} preload="metadata" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 id="audio-modal-title" className="text-xl sm:text-2xl font-extralight tracking-wide text-white">
              {albumTitle}
            </h2>
            <p id="audio-modal-description" className="text-white/60 font-light text-xs sm:text-sm tracking-wide">
              {tracks.length} track{tracks.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white transition-colors duration-300 rounded-full hover:bg-white/10"
            aria-label="Close audio player"
          >
            <X size={24} />
          </button>
        </div>

        {/* Track Info */}
        <div className="flex items-center space-x-4 sm:space-x-6 mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-800 to-black rounded-xl flex items-center justify-center flex-shrink-0">
            {currentTrack.cover ? (
              <img 
                src={currentTrack.cover} 
                alt={currentTrack.title}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <div className="text-white/60 text-2xl">🎵</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-light text-base sm:text-lg tracking-wide truncate">
              {currentTrack.title}
            </h3>
            <p className="text-white/60 font-light text-xs sm:text-sm tracking-wide truncate">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div 
            className="w-full h-1 bg-white/20 rounded-full cursor-pointer group"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-white rounded-full transition-all duration-200 group-hover:bg-white/80"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          <div className="flex justify-between text-white/60 text-xs font-light mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={handlePrevious}
              className="p-2 text-white/60 hover:text-white transition-colors duration-300"
              aria-label="Previous track"
            >
              <SkipBack size={18} className="sm:w-5 sm:h-5" />
            </button>
            
            <button
              onClick={togglePlayPause}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-white/90 transition-all duration-300"
              aria-label={isPlaying ? "Pause track" : "Play track"}
            >
              {isPlaying ? (
                <Pause size={18} className="sm:w-5 sm:h-5" />
              ) : (
                <Play size={18} className="ml-0.5 sm:w-5 sm:h-5" />
              )}
            </button>
            
            <button
              onClick={handleNext}
              className="p-2 text-white/60 hover:text-white transition-colors duration-300"
              aria-label="Next track"
            >
              <SkipForward size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 text-white/60 hover:text-white transition-colors duration-300"
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            >
              {isMuted ? <VolumeX size={18} className="sm:w-5 sm:h-5" /> : <Volume2 size={18} className="sm:w-5 sm:h-5" />}
            </button>
            
            <div 
              className="w-16 sm:w-20 h-1 bg-white/20 rounded-full cursor-pointer hover:bg-white/30 transition-colors duration-200"
              onClick={handleVolumeClick}
              role="slider"
              aria-label="Volume control"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round((isMuted ? 0 : volume) * 100)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                  e.preventDefault();
                  const newVolume = e.key === 'ArrowLeft' 
                    ? Math.max(0, volume - 0.1)
                    : Math.min(1, volume + 0.1);
                  setVolume(newVolume);
                  setIsMuted(false);
                }
              }}
            >
              <div 
                className="h-full bg-white rounded-full transition-all duration-200"
                style={{ width: `${isMuted ? 0 : volume * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Track List */}
        {tracks.length > 1 && (
          <div className="pt-6 border-t border-white/10">
            <h4 className="text-white/80 font-light text-sm tracking-wide mb-4 uppercase">
              Track List
            </h4>
            <div className="space-y-2">
              {tracks.map((track, index) => (
                <button
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(index);
                    onTrackChange?.(index);
                    setIsPlaying(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                    index === currentTrackIndex 
                      ? 'bg-white/10 text-white' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-light text-sm tracking-wide">{track.title}</p>
                      <p className="text-xs text-white/50">{track.artist}</p>
                    </div>
                    <span className="text-xs text-white/50">
                      {formatTime(track.duration)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
