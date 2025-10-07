import React, { useState, useEffect } from 'react';
import { albums } from '@/data/audio';

interface AlbumSelectorProps {
  className?: string;
}

const AlbumSelector: React.FC<AlbumSelectorProps> = ({ className = '' }) => {
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('fractured');
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

  // Update featured album display when selection changes
  useEffect(() => {
    // Set data attribute for FeaturedAlbum to read
    document.body.setAttribute('data-selected-album', selectedAlbumId);
  }, [selectedAlbumId]);

  const handleAlbumSelect = (albumId: string) => {
    setSelectedAlbumId(albumId);

    // On mobile, scroll to featured album area when an album is selected
    if (isMobile) {
      setTimeout(() => {
        const featuredAlbumElement = document.getElementById(
          'featured-album-cover'
        );
        if (featuredAlbumElement) {
          featuredAlbumElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }, 100);
    }
  };

  return (
    <div className={className} data-album-list>
      {/* Album List */}
      <div className="space-y-8 lg:space-y-12">
        {albums.map(album => (
          <div
            key={album.id}
            className="group cursor-pointer border-b border-gray-100 pb-6 transition-colors duration-500 hover:border-gray-200 lg:pb-8"
            onClick={() => handleAlbumSelect(album.id)}
            role="button"
            tabIndex={0}
            aria-label={`Select ${album.title} album`}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleAlbumSelect(album.id);
              }
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="mb-2 text-xl font-extralight tracking-wide text-black transition-colors duration-500 group-hover:text-gray-700 lg:text-2xl">
                  {album.title}
                </h4>
                <p className="text-sm font-light text-gray-600 lg:text-base">
                  {album.year} • {album.certification} • {album.genre}
                </p>
                <p className="mt-2 text-xs font-light leading-relaxed text-gray-500 lg:text-sm">
                  {album.description}
                </p>
              </div>
              <div className="ml-4 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200/50 bg-gray-50 transition-all duration-500 group-hover:bg-gray-100 lg:h-16 lg:w-16">
                <svg
                  className="h-4 w-4 text-gray-600 lg:h-6 lg:w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumSelector;
