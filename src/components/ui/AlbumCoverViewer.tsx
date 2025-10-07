import React from 'react';

interface AlbumCoverViewerProps {
  albumTitle: string;
  fullCoverImage: string;
  className?: string;
}

/**
 * Modular component for viewing full album covers
 * Follows Astro best practices: isolated, reusable, responsive
 */
const AlbumCoverViewer: React.FC<AlbumCoverViewerProps> = ({
  albumTitle,
  fullCoverImage,
  className = '',
}) => {
  const handleOpenFullSize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Open the full-size image in a new tab
    window.open(fullCoverImage, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleOpenFullSize}
      className={`text-xs font-light italic text-gray-400 transition-colors duration-300 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 lg:text-sm ${className}`}
      aria-label={`View full cover art for ${albumTitle}`}
      type="button"
    >
      View Full Cover
    </button>
  );
};

export default AlbumCoverViewer;
