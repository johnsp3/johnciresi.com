import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

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
}

// Gallery Modal Component
const GalleryModal: React.FC<GalleryModalProps> = ({ 
  category, 
  isOpen, 
  onClose, 
  onNext, 
  onPrev, 
  hasNext, 
  hasPrev, 
  currentIndex 
}) => {
  useEffect(() => {
    if (isOpen) {
      // Prevent navigation when gallery is open
      const preventNavigation = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      };

      // Prevent all navigation links from working when gallery is open
      const navigationLinks = document.querySelectorAll('a[href^="#"]');
      navigationLinks.forEach(link => {
        link.addEventListener('click', preventNavigation, true);
      });

      const keyHandler = (e: KeyboardEvent) => {
        switch (e.key) {
          case 'Escape':
            onClose();
            break;
          case 'ArrowLeft':
            if (hasPrev) onPrev();
            break;
          case 'ArrowRight':
            if (hasNext) onNext();
            break;
        }
      };
      
      // Focus management for accessibility
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusableElement = focusableElements[0] as HTMLElement;
      const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      // Store the previously focused element
      const previouslyFocusedElement = document.activeElement as HTMLElement;
      
      // Focus the first focusable element in the modal
      if (firstFocusableElement) {
        firstFocusableElement.focus();
      }
      
      // Trap focus within the modal
      const trapFocus = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
              lastFocusableElement?.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastFocusableElement) {
              firstFocusableElement?.focus();
              e.preventDefault();
            }
          }
        }
      };
      
      document.addEventListener('keydown', keyHandler);
      document.addEventListener('keydown', trapFocus);
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Remove navigation prevention
        navigationLinks.forEach(link => {
          link.removeEventListener('click', preventNavigation, true);
        });
        
        document.removeEventListener('keydown', keyHandler);
        document.removeEventListener('keydown', trapFocus);
        document.body.style.overflow = 'unset';
        // Restore focus to previously focused element
        previouslyFocusedElement?.focus();
      };
    }
  }, [isOpen, onClose, onNext, onPrev, hasNext, hasPrev]);

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
            zIndex: 99999
          }}
          onClick={(e) => {
            // Only close if clicking the backdrop, not the image or controls
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="gallery-modal-title"
          aria-describedby="gallery-modal-description"
        >
          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-6 right-6 z-[100000] p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20"
            aria-label="Close gallery"
          >
            <X className="w-6 h-6 text-white" />
          </motion.button>

          {/* Navigation Buttons */}
          {hasPrev && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-[10000] p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </motion.button>
          )}

          {hasNext && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-[10000] p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </motion.button>
          )}

          {/* Image Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-7xl max-h-[90vh] mx-6 z-[100001]"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {/* Image */}
            <img
              src={currentItem.src}
              alt={`${currentItem.alt} - Image ${currentIndex + 1} of ${category.items.length} in ${category.title} gallery`}
              className="max-w-full max-h-[90vh] object-contain rounded-2xl"
              loading="eager"
              decoding="async"
            />

            {/* Image Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-6 left-6 right-6 bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              <h3 id="gallery-modal-title" className="text-2xl font-extralight tracking-wide text-white mb-2">
                {currentItem.title}
              </h3>
              <p id="gallery-modal-description" className="text-white/70 font-light leading-relaxed mb-2">
                {currentItem.description}
              </p>
              <p className="text-white/50 text-sm font-light">
                {currentIndex + 1} of {category.items.length} • {category.title}
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GalleryModal;
