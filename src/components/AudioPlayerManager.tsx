import { useState, useEffect } from 'react';
import AudioPlayer from './AudioPlayer';

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

interface AudioPlayerEvent extends CustomEvent {
  detail: {
    album: Album;
    trackIndex?: number;
  };
}

/**
 * AudioPlayerManager Component
 *
 * This component manages the audio player state and acts as a bridge between
 * AlbumCard clicks and the AudioPlayer modal. It's designed to be SSR-safe
 * by handling all client-side interactions through custom events.
 *
 * Usage in Astro:
 * <AudioPlayerManager client:only="react" />
 */
const AudioPlayerManager = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
  const [initialTrackIndex, setInitialTrackIndex] = useState(0);

  useEffect(() => {
    // Listen for custom event from AlbumCard clicks
    const handleOpenPlayer = (event: Event) => {
      const audioEvent = event as AudioPlayerEvent;
      const { album, trackIndex = 0 } = audioEvent.detail;

      if (album) {
        setCurrentAlbum(album);
        setInitialTrackIndex(trackIndex);
        setIsOpen(true);
      }
    };

    // Add event listener
    window.addEventListener('openAudioPlayer', handleOpenPlayer);

    // Cleanup
    return () => {
      window.removeEventListener('openAudioPlayer', handleOpenPlayer);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);

    // Emit event to notify that player closed
    window.dispatchEvent(new CustomEvent('audioPlayerClosed'));

    // Keep album data for smooth animations, but clear after transition
    setTimeout(() => {
      setCurrentAlbum(null);
      setInitialTrackIndex(0);
    }, 300);
  };

  // Only render AudioPlayer when we have an album and modal is open
  if (!isOpen || !currentAlbum) {
    return null;
  }

  return (
    <AudioPlayer
      album={currentAlbum}
      onClose={handleClose}
      initialTrackIndex={initialTrackIndex}
    />
  );
};

export default AudioPlayerManager;
