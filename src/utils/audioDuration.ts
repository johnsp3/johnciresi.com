/**
 * Audio Duration Detection Utility
 * Automatically detects MP3 file durations and updates track data
 */

export interface TrackWithDuration extends Track {
  duration: number;
  actualDuration?: number; // Real duration from file
  durationLoaded?: boolean; // Whether duration has been detected
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
}

/**
 * Get the actual duration of an audio file
 * @param audioUrl - URL of the audio file
 * @returns Promise<number> - Duration in seconds
 */
export async function getAudioDuration(audioUrl: string): Promise<number> {
  return new Promise((resolve) => {
    const audio = new Audio();
    
    // Set up event listeners
    audio.addEventListener('loadedmetadata', () => {
      const duration = Math.round(audio.duration);
      resolve(duration);
    });
    
    audio.addEventListener('error', (e) => {
      import('@/utils/logger').then(({ logWarn }) => {
        logWarn(`Failed to load audio metadata for ${audioUrl}`, { 
          component: 'AudioDuration',
          action: 'getAudioDuration',
          metadata: { audioUrl, error: e instanceof Error ? e.message : String(e) }
        });
      });
      // Return fallback duration (36 seconds for previews)
      resolve(36);
    });
    
    // Set timeout to prevent hanging
    const timeout = setTimeout(() => {
      import('@/utils/logger').then(({ logWarn }) => {
        logWarn(`Timeout loading audio metadata for ${audioUrl}`, { 
          component: 'AudioDuration',
          action: 'getAudioDuration',
          metadata: { audioUrl }
        });
      });
      resolve(36); // Fallback to 36 seconds
    }, 10000); // 10 second timeout
    
    // Clean up timeout when metadata loads
    audio.addEventListener('loadedmetadata', () => {
      clearTimeout(timeout);
    });
    
    // Load the audio file
    audio.src = audioUrl;
    audio.load();
  });
}

/**
 * Update track durations for all tracks in an album
 * @param tracks - Array of tracks to update
 * @returns Promise<TrackWithDuration[]> - Updated tracks with real durations
 */
export async function updateTrackDurations(tracks: Track[]): Promise<TrackWithDuration[]> {
  // const updatedTracks: TrackWithDuration[] = [];

  // Process tracks in parallel for better performance
  const durationPromises = tracks.map(async (track) => {
    try {
      const actualDuration = await getAudioDuration(track.url);
      return {
        ...track,
        actualDuration,
        durationLoaded: true,
        duration: actualDuration, // Update the main duration field
      };
    } catch (error) {
      import('@/utils/logger').then(({ logWarn }) => {
        logWarn(`Failed to get duration for track ${track.title}`, { 
          component: 'AudioDuration',
          action: 'getTrackDurations',
          metadata: { trackTitle: track.title, error: error instanceof Error ? error.message : String(error) }
        });
      });
      return {
        ...track,
        actualDuration: track.duration, // Keep original duration
        durationLoaded: false,
      };
    }
  });

  const results = await Promise.all(durationPromises);
  return results;
}

/**
 * Format duration in seconds to MM:SS format
 * @param seconds - Duration in seconds
 * @returns string - Formatted duration (e.g., "3:45")
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Get duration display text with loading state
 * @param track - Track with duration information
 * @returns string - Display text for duration
 */
export function getDurationDisplay(track: TrackWithDuration): string {
  if (track.durationLoaded) {
    return formatDuration(track.actualDuration || track.duration);
  }
  return formatDuration(track.duration);
}

/**
 * Check if all tracks in an album have loaded durations
 * @param tracks - Array of tracks
 * @returns boolean - True if all durations are loaded
 */
export function allDurationsLoaded(tracks: TrackWithDuration[]): boolean {
  return tracks.every(track => track.durationLoaded);
}
