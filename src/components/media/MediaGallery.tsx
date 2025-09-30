import React, { useCallback, useState, useEffect } from 'react';
import GalleryGrid from './GalleryGrid';
import GalleryModal from './GalleryModal';
import { galleryCategories, type GalleryCategory } from '@/data/galleryData';

interface MediaGalleryProps {
  className?: string;
}

// Main Media Gallery Component
const MediaGallery: React.FC<MediaGalleryProps> = ({ className = '' }) => {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobilePopup, setShowMobilePopup] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const openGallery = useCallback((category: GalleryCategory) => {
    // Prevent any navigation conflicts
    console.log('Opening gallery for category:', category.title);
    
    if (isMobile) {
      // On mobile, show popup instead of full gallery
      setSelectedCategory(category);
      setShowMobilePopup(true);
    } else {
      // On desktop, open full gallery
      setSelectedCategory(category);
      setCurrentImageIndex(0);
    }
  }, [isMobile]);

  const closeGallery = useCallback(() => {
    setSelectedCategory(null);
    setCurrentImageIndex(0);
    setShowMobilePopup(false);
  }, []);

  const closeMobilePopup = useCallback(() => {
    setShowMobilePopup(false);
    setSelectedCategory(null);
  }, []);

  const goToNext = useCallback(() => {
    if (selectedCategory && currentImageIndex < selectedCategory.items.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  }, [selectedCategory, currentImageIndex]);

  const goToPrev = useCallback(() => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  }, [currentImageIndex]);

  return (
    <div className={`w-full ${className}`}>
      {/* Gallery Grid */}
      <GalleryGrid 
        categories={galleryCategories}
        onCategoryClick={openGallery}
      />

      {/* Gallery Modal - Desktop Only */}
      {!isMobile && (
        <GalleryModal
          category={selectedCategory}
          isOpen={!!selectedCategory}
          onClose={closeGallery}
          onNext={goToNext}
          onPrev={goToPrev}
          hasNext={selectedCategory ? currentImageIndex < selectedCategory.items.length - 1 : false}
          hasPrev={currentImageIndex > 0}
          currentIndex={currentImageIndex}
        />
      )}

      {/* Mobile Popup */}
      {isMobile && showMobilePopup && selectedCategory && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-sm mx-6 bg-black/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            {/* Close button */}
            <button
              onClick={closeMobilePopup}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200"
              aria-label="Close popup"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <h4 className="text-xl font-extralight tracking-wide text-white mb-3 pr-8">
              {selectedCategory.title}
            </h4>
            <p className="text-white/70 font-light leading-relaxed text-sm mb-4">
              {selectedCategory.description}
            </p>
            
            {/* View Gallery Button */}
            <button
              onClick={() => {
                setShowMobilePopup(false);
                setCurrentImageIndex(0);
                // Open full gallery on mobile
              }}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 border border-white/20"
            >
              View Gallery ({selectedCategory.items.length} photos)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGallery;