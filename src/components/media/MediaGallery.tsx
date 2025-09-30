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
    
    // On both mobile and desktop, open full gallery directly
    setSelectedCategory(category);
    setCurrentImageIndex(0);
    setShowMobilePopup(false);
  }, []);

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

      {/* Gallery Modal - Works on both mobile and desktop */}
      <GalleryModal
        category={selectedCategory}
        isOpen={!!selectedCategory}
        onClose={closeGallery}
        onNext={goToNext}
        onPrev={goToPrev}
        hasNext={selectedCategory ? currentImageIndex < selectedCategory.items.length - 1 : false}
        hasPrev={currentImageIndex > 0}
        currentIndex={currentImageIndex}
        isMobile={isMobile}
      />
    </div>
  );
};

export default MediaGallery;