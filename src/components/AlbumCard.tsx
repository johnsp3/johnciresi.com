import { useState, useCallback, useMemo, memo } from 'react';
import type { FC } from 'react';

interface Track {
  id: string;
  title: string;
  duration: string;
  url: string;
}

interface AlbumCardProps {
  id: string;
  title: string;
  year: number;
  coverImage: string;
  tracks: Track[];
  onPlay?: (albumId: string) => void;
}

const AlbumCard: FC<AlbumCardProps> = memo(({
  id,
  title,
  year,
  coverImage,
  tracks,
  onPlay,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Memoize click handler to prevent unnecessary re-renders
  const handleClick = useCallback(() => {
    // Emit custom event for AudioPlayerManager to listen to
    const event = new CustomEvent('openAudioPlayer', {
      detail: {
        album: {
          id,
          title,
          year,
          coverImage,
          tracks,
        },
        trackIndex: 0,
      },
    });
    window.dispatchEvent(event);

    // Also call the callback if provided (for backward compatibility)
    if (onPlay) {
      onPlay(id);
    }
  }, [id, title, year, coverImage, tracks, onPlay]);

  // Memoize hover handlers
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  // Memoize track preview items to prevent unnecessary re-renders
  const trackPreviewItems = useMemo(() => 
    tracks.slice(0, 3).map((track, index) => (
      <div
        key={track.id}
        className="flex items-center gap-2 text-xs transition-colors"
        style={{ color: '#AEAEB2' }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#F2F2F7'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#AEAEB2'}
      >
        <span className="text-accent-primary/70">{index + 1}.</span>
        <span className="flex-1 truncate">{track.title}</span>
        <span style={{ color: '#8E8E93' }}>{track.duration}</span>
      </div>
    )),
    [tracks]
  );

  return (
    <div
      className="card-premium group relative bg-dark-elevated rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(30,64,175,0.3)] cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-gold rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />

      {/* Card Content */}
      <div className="relative">
        {/* Album Cover */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={coverImage}
            alt={`${title} album cover`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-elevated via-dark-elevated/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Play Button Overlay */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button
              className="w-16 h-16 rounded-full bg-accent-primary/90 backdrop-blur-sm flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:bg-accent-primary shadow-[0_0_30px_rgba(30,64,175,0.6)] animate-pulse-glow"
              aria-label={`Play ${title}`}
            >
              <svg
                className="w-8 h-8 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>

          {/* Track Count Badge */}
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-dark-elevated/80 backdrop-blur-sm border border-white/10">
            <span className="text-xs font-medium" style={{ color: '#AEAEB2' }}>
              {tracks.length} tracks
            </span>
          </div>
        </div>

        {/* Album Info */}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-1 line-clamp-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-accent-primary group-hover:to-accent-secondary group-hover:bg-clip-text transition-all duration-300" style={{ color: '#F2F2F7' }}>
            {title}
          </h3>
          <p className="text-sm mb-3" style={{ color: '#AEAEB2' }}>{year}</p>

          {/* Track Preview (on hover) */}
          <div
            className={`overflow-hidden transition-all duration-500 ${
              isHovered ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="pt-3 border-t border-white/5">
              <p className="text-xs uppercase tracking-wider mb-2" style={{ color: '#8E8E93' }}>
                Featured Tracks
              </p>
              <div className="space-y-1">
                {trackPreviewItems}
                {tracks.length > 3 && (
                  <p className="text-xs text-accent-primary/80 mt-2">
                    +{tracks.length - 3} more tracks
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div
            className={`transition-all duration-300 ${
              isHovered ? 'mt-4' : 'mt-0'
            }`}
          >
            <button className="w-full py-2 px-4 rounded-lg bg-white/5 hover:bg-accent-primary/20 hover:text-accent-primary text-sm font-medium transition-all duration-300 border border-white/10 hover:border-accent-primary/50" style={{ color: '#AEAEB2' }}>
              Listen Now
            </button>
          </div>
        </div>
      </div>

      {/* Animated Border */}
      <div className="absolute inset-0 rounded-2xl border border-white/5 group-hover:border-accent-primary/30 transition-colors duration-500 pointer-events-none" />
    </div>
  );
});

AlbumCard.displayName = 'AlbumCard';

export default AlbumCard;
