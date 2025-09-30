import React from 'react';

interface FeaturedAlbumProps {
  className?: string;
}

const FeaturedAlbum: React.FC<FeaturedAlbumProps> = ({ className = '' }) => {
  const handleOpenPlayer = () => {
    if (window.openAudioPlayer) {
      // Get the currently selected album ID from the AlbumSelector
      const selectedAlbumElement = document.querySelector('[data-selected-album]');
      const selectedAlbumId = selectedAlbumElement?.getAttribute('data-selected-album') || 'fractured';
      window.openAudioPlayer(selectedAlbumId);
    } else {
      console.warn('Audio player not available. Make sure WorkingAudioHandler is loaded.');
    }
  };

  return (
    <div className={className}>
      {/* Featured Album Display */}
      <div className="group cursor-pointer" onClick={handleOpenPlayer} role="button" tabIndex={0} aria-label="Open audio player">
        <div className="aspect-square relative overflow-hidden border border-gray-200/20 rounded-2xl">
          <img 
            id="featured-album-cover"
            src="/images/albums/Fractured 2024 Album Cover.png" 
            alt="Featured Album Cover"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-700"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-700 border border-white/20 backdrop-blur-sm">
              <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        </div>
        <div className="mt-8 lg:mt-12">
          <h3 className="text-2xl lg:text-3xl font-extralight tracking-wide text-black mb-4" id="featured-album-title">
            Fractured
          </h3>
          <p className="text-gray-600 font-light tracking-wide mb-4 lg:mb-6 text-base lg:text-lg" id="featured-album-year">
            Latest studio album • 2024
          </p>
          <p className="text-gray-500 font-light leading-relaxed text-sm lg:text-base" id="featured-album-description">
            Hard-hitting rock with raw energy and powerful vocals. This album captures the intensity and passion of modern rock music.
          </p>
          <p className="text-gray-400 font-light text-xs lg:text-sm mt-4 italic" id="featured-album-artwork-credit">
            Artwork by John Chezik
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeaturedAlbum;
