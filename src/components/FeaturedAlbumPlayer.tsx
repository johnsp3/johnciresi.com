import { useState, useRef, useEffect } from 'react';
import type { FC } from 'react';

interface Track {
  id: string;
  title: string;
  duration: string;
  url: string;
}

interface Album {
  id: string;
  title: string;
  year: string;
  genre: string;
  coverImage: string;
  tracks: Track[];
}

interface FeaturedAlbumPlayerProps {
  albums: Album[];
}

const FeaturedAlbumPlayer: FC<FeaturedAlbumPlayerProps> = ({ albums }) => {
  const [selectedAlbumIndex, setSelectedAlbumIndex] = useState(0);
  const [showPlayHint, setShowPlayHint] = useState(false);
  const selectedAlbum = albums[selectedAlbumIndex];
  const albumCoverRef = useRef<HTMLDivElement>(null);
  const albumListRef = useRef<HTMLDivElement>(null);

  const handleAlbumClick = () => {
    // Emit custom event to open audio player
    const event = new CustomEvent('openAudioPlayer', {
      detail: {
        album: selectedAlbum,
        trackIndex: 0,
      },
    });
    window.dispatchEvent(event);
    setShowPlayHint(false);
  };

  const handleAlbumSelect = (index: number) => {
    setSelectedAlbumIndex(index);

    // On mobile, scroll to album cover after selection
    if (window.innerWidth < 1024 && albumCoverRef.current) {
      setTimeout(() => {
        albumCoverRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        // Show hint after scrolling
        setTimeout(() => setShowPlayHint(true), 800);
      }, 100);
    }
  };

  // Listen for audio player close event to scroll back to album list
  useEffect(() => {
    const handlePlayerClose = () => {
      if (window.innerWidth < 1024 && albumListRef.current) {
        setTimeout(() => {
          albumListRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 300);
      }
    };

    window.addEventListener('audioPlayerClosed', handlePlayerClose);
    return () => window.removeEventListener('audioPlayerClosed', handlePlayerClose);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
      {/* LEFT SIDE: Featured Album Cover (Large) */}
      <div ref={albumCoverRef} className="flex justify-center lg:justify-end order-2 lg:order-1">
        <div className="relative group animate-fade-in">
          {/* Album Cover - Hand Size (400x400) */}
          <div
            className="relative w-full max-w-md aspect-square cursor-pointer rounded-3xl overflow-hidden shadow-premium transition-all duration-500 hover:scale-105 hover:shadow-[0_0_60px_rgba(30,64,175,0.4)]"
            onClick={handleAlbumClick}
          >
            {/* Glow Effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-tertiary rounded-3xl opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500" />

            {/* Album Image */}
            <img
              src={selectedAlbum.coverImage}
              alt={`${selectedAlbum.title} album cover`}
              className="relative w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 via-dark-bg/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                className="w-24 h-24 rounded-full bg-accent-primary/95 backdrop-blur-sm flex items-center justify-center transform transition-all duration-300 hover:scale-110 shadow-[0_0_40px_rgba(30,64,175,0.8)] animate-pulse-glow"
                aria-label={`Play ${selectedAlbum.title}`}
              >
                <svg
                  className="w-12 h-12 text-white ml-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>

            {/* Album Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-dark-bg via-dark-bg/90 to-transparent transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <p className="text-xs text-accent-primary font-semibold uppercase tracking-wider mb-2">
                Now Featured
              </p>
              <h3 className="text-2xl font-bold mb-1" style={{ color: '#F2F2F7' }}>
                {selectedAlbum.title}
              </h3>
              <p style={{ color: '#AEAEB2' }}>
                {selectedAlbum.year} • {selectedAlbum.genre}
              </p>
            </div>
          </div>

          {/* Click to Play Hint */}
          <div className={`mt-6 text-center transition-all duration-500 ${showPlayHint ? 'opacity-100 scale-110' : 'opacity-60 group-hover:opacity-100'}`}>
            <p className={`text-sm ${showPlayHint ? 'text-accent-primary font-semibold' : ''}`} style={!showPlayHint ? { color: '#AEAEB2' } : {}}>
              <span className="inline-block mr-2">🎵</span>
              {showPlayHint ? 'Tap album cover to hear the songs!' : 'Click album cover to play'}
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Album List */}
      <div ref={albumListRef} className="animate-fade-in order-1 lg:order-2" style={{ animationDelay: '0.2s' }}>
        <div className="space-y-3">
          {albums.map((album, index) => (
            <button
              key={album.id}
              onClick={() => handleAlbumSelect(index)}
              className={`
                w-full text-left p-4 rounded-2xl transition-all duration-300
                ${
                  selectedAlbumIndex === index
                    ? 'bg-accent-primary/20 border-2 border-accent-primary shadow-glow'
                    : 'bg-dark-elevated border-2 border-dark-border hover:border-accent-primary/50 hover:bg-dark-muted'
                }
              `}
            >
              <div className="flex items-center gap-4">
                {/* Small Album Thumbnail */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={album.coverImage}
                    alt={album.title}
                    className="w-full h-full object-cover"
                  />
                  {selectedAlbumIndex === index && (
                    <div className="absolute inset-0 bg-accent-primary/40 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Album Info */}
                <div className="flex-1 min-w-0">
                  <h4
                    className={`font-semibold text-lg mb-1 truncate ${
                      selectedAlbumIndex === index
                        ? 'text-accent-primary'
                        : ''
                    }`}
                    style={selectedAlbumIndex !== index ? { color: '#F2F2F7' } : {}}
                  >
                    {album.title}
                  </h4>
                  <p className="text-sm" style={{ color: '#AEAEB2' }}>
                    {album.year} • {album.tracks.length} tracks
                  </p>
                </div>

                {/* Arrow Indicator */}
                <div
                  className={`transition-all duration-300 ${
                    selectedAlbumIndex === index
                      ? 'text-accent-primary opacity-100'
                      : 'opacity-0 group-hover:opacity-50'
                  }`}
                  style={selectedAlbumIndex !== index ? { color: '#8E8E93' } : {}}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Track Count Summary */}
        <div className="mt-8 p-4 bg-dark-elevated/50 rounded-2xl border border-dark-border">
          <p className="text-sm text-center" style={{ color: '#AEAEB2' }}>
            <span className="font-semibold text-accent-primary">
              {albums.reduce((sum, album) => sum + album.tracks.length, 0)} total tracks
            </span>
            {' '}across {albums.length} albums
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeaturedAlbumPlayer;
