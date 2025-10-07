/**
 * Custom hook for audio player functionality
 * Handles all audio state and logic for the WorkingAudioModal
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { TrackWithDuration } from '../../utils/audioDuration';

// interface Track {
//   id: string;
//   title: string;
//   artist: string;
//   duration: number;
//   url: string;
//   cover?: string;
// }

interface UseAudioPlayerProps {
  tracks: TrackWithDuration[];
  currentTrackIndex: number;
  onTrackChange?: (index: number) => void;
}

export function useAudioPlayer({
  tracks,
  currentTrackIndex,
  onTrackChange,
}: UseAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = tracks[currentTrackIndex];

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
      const newIndex =
        currentTrackIndex < tracks.length - 1 ? currentTrackIndex + 1 : 0;
      onTrackChange?.(newIndex);
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
  }, [currentTrackIndex, currentTrack, tracks.length, onTrackChange]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleNext = useCallback(() => {
    const newIndex =
      currentTrackIndex < tracks.length - 1 ? currentTrackIndex + 1 : 0;
    onTrackChange?.(newIndex);
    setIsPlaying(false);
  }, [currentTrackIndex, tracks.length, onTrackChange]);


  const handlePrevious = useCallback(() => {
    const newIndex =
      currentTrackIndex > 0 ? currentTrackIndex - 1 : tracks.length - 1;
    onTrackChange?.(newIndex);
    setIsPlaying(false);
  }, [currentTrackIndex, tracks.length, onTrackChange]);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((error) => {
        import('@/utils/logger').then(({ logError }) => {
          logError('Error playing audio', { 
            component: 'AudioPlayer',
            action: 'play',
            metadata: { error: error instanceof Error ? error.message : String(error) }
          });
        });
        setIsPlaying(false);
      });
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  }, [duration]);

  const handleVolumeClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newVolume = Math.max(0, Math.min(1, clickX / width));

    setVolume(newVolume);
    setIsMuted(false);
  }, []);

  const handleTrackSelect = useCallback((index: number) => {
    onTrackChange?.(index);
    setIsPlaying(false);
  }, [onTrackChange]);

  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  return {
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
  };
}
