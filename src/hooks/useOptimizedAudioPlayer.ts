/**
 * Optimized Audio Player Hook - React 18 PLATINUM STANDARDS
 * 
 * Provides:
 * - Strict TypeScript typing
 * - React 18 patterns with useCallback, useMemo
 * - Performance optimization
 * - Error handling
 * - Accessibility support
 * - Memory management
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import type { Track } from '../utils/validation';

interface UseOptimizedAudioPlayerProps {
  tracks: Track[];
  currentTrackIndex: number;
  onTrackChange?: (index: number) => void;
  autoPlay?: boolean;
  loop?: boolean;
  shuffle?: boolean;
}

interface UseOptimizedAudioPlayerReturn {
  // Audio state
  audioRef: React.RefObject<HTMLAudioElement>;
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  hasError: boolean;
  
  // Playback controls
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  stop: () => void;
  
  // Navigation
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  selectTrack: (index: number) => void;
  
  // Volume controls
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  
  // Utility functions
  formatTime: (time: number) => string;
  getProgress: () => number;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

/**
 * Optimized audio player hook with React 18 PLATINUM STANDARDS
 */
export function useOptimizedAudioPlayer({
  tracks,
  currentTrackIndex,
  onTrackChange,
  autoPlay = false,
  loop = false,
  shuffle = false,
}: UseOptimizedAudioPlayerProps): UseOptimizedAudioPlayerReturn {
  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Memoized current track
  const currentTrack = useMemo(() => {
    return tracks[currentTrackIndex] || null;
  }, [tracks, currentTrackIndex]);

  // Memoized navigation state
  const canGoNext = useMemo(() => {
    return currentTrackIndex < tracks.length - 1;
  }, [currentTrackIndex, tracks.length]);

  const canGoPrevious = useMemo(() => {
    return currentTrackIndex > 0;
  }, [currentTrackIndex]);

  // Memoized progress calculation
  const getProgress = useCallback(() => {
    if (duration === 0) return 0;
    return (currentTime / duration) * 100;
  }, [currentTime, duration]);

  // Memoized time formatter
  const formatTime = useCallback((time: number): string => {
    if (isNaN(time) || !isFinite(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Audio event handlers
  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoading(false);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    
    if (loop) {
      // Restart current track
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else if (canGoNext) {
      // Go to next track
      next();
    }
  }, [loop, canGoNext]);

  const handleError = useCallback((event: Event) => {
    console.error('Audio error:', event);
    setHasError(true);
    setIsLoading(false);
    setIsPlaying(false);
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    setHasError(false);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // Playback controls
  const play = useCallback(() => {
    if (audioRef.current && !hasError) {
      audioRef.current.play().catch((error) => {
        console.error('Play failed:', error);
        setHasError(true);
      });
    }
  }, [hasError]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, []);

  // Navigation controls
  const next = useCallback(() => {
    if (canGoNext) {
      const nextIndex = currentTrackIndex + 1;
      onTrackChange?.(nextIndex);
    }
  }, [canGoNext, currentTrackIndex, onTrackChange]);

  const previous = useCallback(() => {
    if (canGoPrevious) {
      const prevIndex = currentTrackIndex - 1;
      onTrackChange?.(prevIndex);
    }
  }, [canGoPrevious, currentTrackIndex, onTrackChange]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const selectTrack = useCallback((index: number) => {
    if (index >= 0 && index < tracks.length) {
      onTrackChange?.(index);
    }
  }, [tracks.length, onTrackChange]);

  // Volume controls
  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  }, [isMuted, volume]);

  // Setup audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Add event listeners
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // Set initial volume
    audio.volume = volume;

    // Cleanup
    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [
    handleLoadStart,
    handleLoadedMetadata,
    handleTimeUpdate,
    handleEnded,
    handleError,
    handlePlay,
    handlePause,
    volume,
  ]);

  // Handle track changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.url;
      audioRef.current.load();
      
      if (autoPlay) {
        play();
      }
    }
  }, [currentTrack, autoPlay, play]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current && !isMuted) {
      audioRef.current.volume = volume;
    }
  }, [volume, isMuted]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when audio element is focused or no other element is focused
      if (event.target !== document.body && event.target !== document.documentElement) {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowRight':
          event.preventDefault();
          next();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          previous();
          break;
        case 'ArrowUp':
          event.preventDefault();
          setVolume(Math.min(1, volume + 0.1));
          break;
        case 'ArrowDown':
          event.preventDefault();
          setVolume(Math.max(0, volume - 0.1));
          break;
        case 'KeyM':
          event.preventDefault();
          toggleMute();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, next, previous, setVolume, volume, toggleMute]);

  return {
    // Audio state
    audioRef,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoading,
    hasError,
    
    // Playback controls
    play,
    pause,
    togglePlayPause,
    stop,
    
    // Navigation
    next,
    previous,
    seek,
    selectTrack,
    
    // Volume controls
    setVolume,
    toggleMute,
    
    // Utility functions
    formatTime,
    getProgress,
    canGoNext,
    canGoPrevious,
  };
}

export default useOptimizedAudioPlayer;
