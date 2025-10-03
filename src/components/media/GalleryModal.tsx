import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GalleryImage from './GalleryImage';
import GalleryControls from './GalleryControls';
import GalleryDescription, {
  getGalleryOverlayContent,
} from './GalleryDescription';
import GalleryKeyboard from './GalleryKeyboard';

// Types
export interface MediaItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
}

export interface GalleryCategory {
  id: string;
  title: string;
  description: string;
  items: MediaItem[];
  gradient: string;
}

interface GalleryModalProps {
  category: GalleryCategory | null;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  currentIndex: number;
  isMobile?: boolean;
  onNavigate?: () => void;
  showDescriptionPopup?: boolean;
  onToggleDescriptionPopup?: (show: boolean) => void;
}

const GalleryModal: React.FC<GalleryModalProps> = ({
  category,
  isOpen,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  currentIndex,
  isMobile = false,
  onNavigate,
  showDescriptionPopup = false,
  onToggleDescriptionPopup,
}) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Minimum distance for swipe
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // On mobile, close description popup when swiping
    if (isMobile && showDescriptionPopup) {
      onToggleDescriptionPopup?.(false);
    }

    if (isLeftSwipe && hasNext && !isTransitioning) {
      setIsTransitioning(true);
      onNext();
      onNavigate?.();
      setTimeout(() => setIsTransitioning(false), 200);
    }
    if (isRightSwipe && hasPrev && !isTransitioning) {
      setIsTransitioning(true);
      onPrev();
      onNavigate?.();
      setTimeout(() => setIsTransitioning(false), 200);
    }
  };

  if (!category) return null;

  const currentItem = category.items[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-sm"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            isolation: 'isolate',
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
          onClick={e => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="gallery-modal-title"
          aria-describedby="gallery-modal-description"
        >
          {/* Keyboard and Focus Management */}
          <GalleryKeyboard
            isOpen={isOpen}
            onClose={onClose}
            onNext={onNext}
            onPrev={onPrev}
            hasNext={hasNext}
            hasPrev={hasPrev}
          />

          {/* Controls */}
          <GalleryControls
            onClose={onClose}
            onNext={onNext}
            onPrev={onPrev}
            hasNext={hasNext}
            hasPrev={hasPrev}
            isTransitioning={isTransitioning}
            onNavigate={onNavigate}
          />

          {/* Image with Overlay */}
          <GalleryImage
            currentItem={currentItem}
            currentIndex={currentIndex}
            totalItems={category.items.length}
            categoryTitle={category.title}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            overlayContent={getGalleryOverlayContent(
              currentItem,
              currentIndex,
              category.items.length,
              category.title,
              isMobile,
              onToggleDescriptionPopup || (() => {})
            )}
          />

          {/* Mobile Description Popup */}
          <GalleryDescription
            currentItem={currentItem}
            currentIndex={currentIndex}
            totalItems={category.items.length}
            categoryTitle={category.title}
            isMobile={isMobile}
            showDescriptionPopup={showDescriptionPopup}
            onToggleDescriptionPopup={onToggleDescriptionPopup || (() => {})}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GalleryModal;
