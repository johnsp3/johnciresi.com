import { useState, useEffect } from 'react';
import WorkingAudioModal from './WorkingAudioModal';
import { albums, type Album } from '@/data/audio';

export default function WorkingAudioHandler() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    
    // On mobile, scroll back down to album list when player is closed
    if (isMobile) {
      setTimeout(() => {
        // Find the album list container (the second column in the discography grid)
        const albumListElement = document.querySelector('[data-album-list]');
        if (albumListElement) {
          albumListElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        } else {
          // Fallback: scroll to the discography section
          const discographySection = document.getElementById('music');
          if (discographySection) {
            discographySection.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            });
          }
        }
      }, 100);
    }
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
