import React, { useState, useRef, useEffect, useCallback, type FC } from 'react';

interface Track {
  id: string;
  title: string;
  duration: number;
  url: string;
}

interface Album {
  id: string;
  title: string;
  year: number;
  coverImage: string;
  tracks: Track[];
}

interface TrackWithDuration extends Track {
  actualDuration?: number;
  durationLoaded?: boolean;
}

interface AudioPlayerProps {
  album?: Album | null;
  onClose?: () => void;
  initialTrackIndex?: number;
  isOpen?: boolean;
}

const AudioPlayer: FC<AudioPlayerProps> = ({
  album = null,
  onClose = () => {},
  initialTrackIndex = 0,
  isOpen = true,
}) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(initialTrackIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [tracksWithDuration, setTracksWithDuration] = useState<TrackWithDuration[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Next Track
  const handleNext = useCallback(() => {
    if (album && currentTrackIndex < album.tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
      setIsPlaying(true);
    } else if (album) {
      setCurrentTrackIndex(0);
      setIsPlaying(false);
    }
  }, [album, currentTrackIndex]);

  // Load actual durations for all tracks
  useEffect(() => {
    if (!album || !album.tracks) return;

    const loadTrackDurations = async () => {
      const tracksWithDurations: TrackWithDuration[] = await Promise.all(
        album.tracks.map(async (track) => {
          try {
            const audio = new Audio(track.url);
            const duration = await new Promise<number>((resolve) => {
              audio.addEventListener('loadedmetadata', () => {
                resolve(Math.round(audio.duration));
              });
              audio.addEventListener('error', () => {
                resolve(track.duration); // Fallback to original duration
              });
              audio.load();
            });

            return {
              ...track,
              actualDuration: duration,
              durationLoaded: true,
            };
          } catch (_error) {
            return {
              ...track,
              actualDuration: track.duration,
              durationLoaded: false,
            };
          }
        })
      );

      setTracksWithDuration(tracksWithDurations);
    };

    loadTrackDurations();
  }, [album]);

  // Audio Event Handlers
  useEffect(() => {
    if (!album || !album.tracks || album.tracks.length === 0) return;
    
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => handleNext();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, handleNext, album]);

  // Early return for SSR or when album is not available
  if (!album || !album.tracks || album.tracks.length === 0) {
    return null;
  }

  // Only render AudioPlayer when we have an album and modal is open
  if (!isOpen || !album) {
    return null;
  }

  const currentTrack = album.tracks[currentTrackIndex];

  // Play/Pause Toggle
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Previous Track
  const handlePrevious = () => {
    if (currentTime > 3 && audioRef.current) {
      audioRef.current.currentTime = 0;
    } else if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
      setIsPlaying(true);
    }
  };

  // Seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Volume Control
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume > 0) setIsMuted(false);
  };

  // Toggle Mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  // Format Time
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get display duration for a track
  const getTrackDuration = (index: number): string => {
    if (tracksWithDuration[index]?.durationLoaded && tracksWithDuration[index]?.actualDuration) {
      return formatTime(tracksWithDuration[index].actualDuration!);
    }
    return formatTime(album.tracks[index].duration);
  };

  // Track Selection
  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-dark-bg/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
      {/* ARIA Live Region for Audio Player Status */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        id="audio-player-status"
      >
        {album && `Now playing: ${album.tracks[currentTrackIndex]?.title || 'Unknown track'} from ${album.title}`}
      </div>
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 shadow-lg"
        aria-label="Close player"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Player Container */}
      <div className="glass w-full max-w-6xl max-h-[90vh] bg-dark-elevated/50 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col">
        <div className="grid md:grid-cols-2 gap-0 flex-1 md:overflow-hidden">
          {/* Left Side - Album Art & Controls */}
          <div className="p-6 md:p-12 flex flex-col justify-between bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 max-h-[45vh] md:max-h-none overflow-y-auto md:overflow-visible">
            {/* Album Art */}
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl mb-8 group">
              <img
                src={album.coverImage}
                alt={`${album.title} cover`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 to-transparent" />

              {/* Now Playing Badge */}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-accent-primary/90 backdrop-blur-sm">
                <span className="text-xs text-white font-medium">Now Playing</span>
              </div>
            </div>

            {/* Track Info */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-text-primary mb-2 line-clamp-1">
                {currentTrack.title}
              </h2>
              <p className="text-text-secondary text-lg">
                {album.title} • {album.year}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between mt-2 text-sm text-text-secondary">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              {/* Previous */}
              <button
                onClick={handlePrevious}
                disabled={currentTrackIndex === 0 && currentTime < 3}
                className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 hover:scale-105"
                aria-label="Previous track"
              >
                <svg className="w-6 h-6 text-text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>

              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-accent-primary hover:bg-accent-primary/90 flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(30,64,175,0.5)]"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Next */}
              <button
                onClick={handleNext}
                disabled={currentTrackIndex === album.tracks.length - 1}
                className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 hover:scale-105"
                aria-label="Next track"
              >
                <svg className="w-6 h-6 text-text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 18h2V6h-2v12zM6 18l8.5-6L6 6v12z" />
                </svg>
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3">
              <button onClick={toggleMute} className="text-text-secondary hover:text-text-primary transition-colors" aria-label={isMuted ? 'Unmute' : 'Mute'}>
                {isMuted || volume === 0 ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer slider-sm"
              />
            </div>
          </div>

          {/* Right Side - Track List */}
          <div className="p-6 md:p-12 bg-dark-elevated/30 flex flex-col max-h-[45vh] md:max-h-none">
            <div className="flex items-center justify-between mb-4 md:mb-6 flex-shrink-0">
              <h3 className="text-xl font-bold text-text-primary">Track List</h3>
              {album.tracks.length > 1 && (
                <span className="text-xs text-text-secondary md:hidden animate-pulse">
                  Scroll for more ↓
                </span>
              )}
            </div>
            <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
              {album.tracks.map((track, index) => (
                <button
                  key={track.id}
                  onClick={() => selectTrack(index)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-300 group ${
                    index === currentTrackIndex
                      ? 'bg-accent-primary/20 border border-accent-primary/50'
                      : 'bg-white/5 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Track Number / Playing Indicator */}
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                      {index === currentTrackIndex && isPlaying ? (
                        <div className="flex gap-0.5 items-end h-4">
                          <div className="w-0.5 bg-accent-primary animate-audio-bar" style={{ animationDelay: '0s' }}></div>
                          <div className="w-0.5 bg-accent-primary animate-audio-bar" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-0.5 bg-accent-primary animate-audio-bar" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      ) : (
                        <span className={`text-sm font-medium ${index === currentTrackIndex ? 'text-accent-primary' : ''}`} style={index !== currentTrackIndex ? { color: '#AEAEB2' } : {}}>
                          {index + 1}
                        </span>
                      )}
                    </div>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${
                        index === currentTrackIndex ? 'text-accent-primary' : ''
                      }`} style={index !== currentTrackIndex ? { color: '#F2F2F7' } : {}}>
                        {track.title}
                      </p>
                    </div>

                    {/* Duration */}
                    <span className={`text-sm flex-shrink-0 ${index === currentTrackIndex ? 'text-accent-primary/80' : ''}`} style={index !== currentTrackIndex ? { color: '#AEAEB2' } : {}}>
                      {getTrackDuration(index)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.url}
        autoPlay={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default AudioPlayer;

// Inline styles for range sliders
const styles = `
  .slider::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    background: #0066CC;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s;
  }

  .slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 0 20px rgba(0, 102, 204, 0.3);
  }

  .slider-sm::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    background: #0066CC;
    border-radius: 50%;
    cursor: pointer;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(0, 102, 204, 0.15);
    border-radius: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 102, 204, 0.25);
  }

  @keyframes audio-bar {
    0%, 100% { height: 4px; }
    50% { height: 16px; }
  }

  .animate-audio-bar {
    animation: audio-bar 0.8s ease-in-out infinite;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
