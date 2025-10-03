import React from 'react';

interface FeaturedAlbumProps {
  className?: string;
}

const FeaturedAlbum: React.FC<FeaturedAlbumProps> = ({ className = '' }) => {
  const handleOpenPlayer = () => {
    if (window.openAudioPlayer) {
      // Get the currently selected album ID from the AlbumSelector
      const selectedAlbumElement = document.querySelector(
        '[data-selected-album]'
      );
      const selectedAlbumId =
        selectedAlbumElement?.getAttribute('data-selected-album') ||
        'fractured';
      window.openAudioPlayer(selectedAlbumId);
    } else {
      // Log warning for debugging in development only
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          'Audio player not available. Make sure WorkingAudioHandler is loaded.'
        );
      }
    }
  };

  return (
    <div className={className}>
      {/* Featured Album Display */}
      <div
        className="group cursor-pointer"
        onClick={handleOpenPlayer}
        role="button"
        tabIndex={0}
        aria-label="Open audio player"
      >
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-200/20">
          <img
            id="featured-album-cover"
            src="/images/albums/Fractured 2024 Album Cover.png"
            alt="Featured Album Cover"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 transition-all duration-700 group-hover:bg-black/10"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-700 group-hover:scale-110">
              <svg
                className="ml-1 h-10 w-10 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100"></div>
        </div>
        <div className="mt-8 lg:mt-12">
          <h3
            className="mb-4 text-2xl font-extralight tracking-wide text-black lg:text-3xl"
            id="featured-album-title"
          >
            Fractured
          </h3>
          <p
            className="mb-4 text-base font-light tracking-wide text-gray-600 lg:mb-6 lg:text-lg"
            id="featured-album-year"
          >
            Latest studio album • 2024
          </p>
          <p
            className="text-sm font-light leading-relaxed text-gray-500 lg:text-base"
            id="featured-album-description"
          >
            Hard-hitting rock with raw energy and powerful vocals. This album
            captures the intensity and passion of modern rock music.
          </p>
          <p
            className="mt-4 text-xs font-light italic text-gray-400 lg:text-sm"
            id="featured-album-artwork-credit"
          >
            Artwork by John Ciresi
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeaturedAlbum;
