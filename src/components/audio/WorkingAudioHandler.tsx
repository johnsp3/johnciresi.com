import { useState, useEffect } from 'react';
import WorkingAudioModal from './WorkingAudioModal';
import { albums, type Album } from '@/data/audio';

export default function WorkingAudioHandler() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  useEffect(() => {
    // Global function to open audio player
    const openAudioPlayer = (albumId?: string) => {
      const album = albumId ? albums.find(a => a.id === albumId) : albums[0];
      if (album) {
        setCurrentAlbum(album);
        setCurrentTrackIndex(0); // Always start with the first track
        setIsOpen(true);
      }
    };

    // Make the function globally available
    window.openAudioPlayer = openAudioPlayer;

    return () => {
      delete window.openAudioPlayer;
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleTrackChange = (index: number) => {
    setCurrentTrackIndex(index);
  };

  if (!currentAlbum) return null;

  return (
    <WorkingAudioModal
      isOpen={isOpen}
      onClose={handleClose}
      tracks={currentAlbum.tracks}
      albumTitle={currentAlbum.title}
      currentTrackIndex={currentTrackIndex}
      onTrackChange={handleTrackChange}
    />
  );
}
