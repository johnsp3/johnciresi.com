import { useState, useEffect, useCallback } from 'react';
import { updateTrackDurations, getDurationDisplay, allDurationsLoaded, type TrackWithDuration } from '../../utils/audioDuration';
import type { Track } from '../../data/audio';

interface UseAudioDurationReturn {
  tracks: TrackWithDuration[];
  durationsLoaded: boolean;
  loadingProgress: number;
  refreshDurations: () => Promise<void>;
  getDisplayDuration: (track: TrackWithDuration) => string;
}

/**
 * Custom hook to manage automatic audio duration detection
 * Follows Astro best practices for client-side functionality
 */
export function useAudioDuration(initialTracks: Track[]): UseAudioDurationReturn {
  const [tracks, setTracks] = useState<TrackWithDuration[]>([]);
  const [durationsLoaded, setDurationsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Initialize tracks with default durations and load durations
  useEffect(() => {
    const initialTracksWithDuration: TrackWithDuration[] = initialTracks.map(track => ({
      ...track,
      actualDuration: track.duration,
      durationLoaded: false,
    }));
    setTracks(initialTracksWithDuration);
    
    // Reset loading state for new tracks
    setDurationsLoaded(false);
    setLoadingProgress(0);
  }, [initialTracks]);

  // Load durations for all tracks
  const loadDurations = useCallback(async (tracksToLoad: TrackWithDuration[]) => {
    if (tracksToLoad.length === 0) return;

    setDurationsLoaded(false);
    setLoadingProgress(0);

    try {
      // Update progress as we load each track
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const updatedTracks = await updateTrackDurations(tracksToLoad);

      clearInterval(progressInterval);
      setLoadingProgress(100);

      setTracks(updatedTracks);
      setDurationsLoaded(allDurationsLoaded(updatedTracks));
      
      // Reset progress after a short delay
      setTimeout(() => setLoadingProgress(0), 500);
    } catch (error) {
      import('@/utils/logger').then(({ logError }) => {
        logError('Failed to load track durations', { 
          component: 'AudioDuration',
          action: 'loadDurations',
          metadata: { error: error instanceof Error ? error.message : String(error) }
        });
      });
      setDurationsLoaded(false);
      setLoadingProgress(0);
    }
  }, []);

  // Auto-load durations when tracks change
  useEffect(() => {
    if (tracks.length > 0 && !durationsLoaded) {
      loadDurations(tracks);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks.length, durationsLoaded]);

  // Refresh durations manually
  const refreshDurations = useCallback(async () => {
    await loadDurations(tracks);
  }, [loadDurations, tracks]);

  // Get display duration for a track
  const getDisplayDuration = useCallback((track: TrackWithDuration): string => {
    return getDurationDisplay(track);
  }, []);

  return {
    tracks,
    durationsLoaded,
    loadingProgress,
    refreshDurations,
    getDisplayDuration,
  };
}
