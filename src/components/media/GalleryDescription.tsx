import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface MediaItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
}

interface GalleryDescriptionProps {
  currentItem: MediaItem;
  currentIndex: number;
  totalItems: number;
  categoryTitle: string;
  isMobile: boolean;
  showDescriptionPopup: boolean;
  onToggleDescriptionPopup: (show: boolean) => void;
}

// Function to get overlay content for GalleryImage
export const getGalleryOverlayContent = (
  currentItem: MediaItem,
  currentIndex: number,
  totalItems: number,
  categoryTitle: string,
  isMobile: boolean,
  onToggleDescriptionPopup: (show: boolean) => void
): React.ReactNode => {
  return (
    <>
      {/* Desktop: Full Image Info */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.2 }}
          className="pointer-events-auto absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-black/50 p-6 backdrop-blur-sm"
        >
          <h3
            id="gallery-modal-title"
            className="mb-2 text-2xl font-extralight tracking-wide text-white"
          >
            {currentItem.title}
          </h3>
          <p
            id="gallery-modal-description"
            className="mb-2 font-light leading-relaxed text-white/70"
          >
            {currentItem.description}
          </p>
          <p className="text-sm font-light text-white/50">
            {currentIndex + 1} of {totalItems} • {categoryTitle}
          </p>
        </motion.div>
      )}

      {/* Mobile: Small Read More Strip */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.2 }}
          className="pointer-events-auto absolute bottom-6 left-6 right-6"
        >
          <button
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onToggleDescriptionPopup(true);
            }}
            className="w-full rounded-lg border border-white/20 bg-black/30 p-3 backdrop-blur-sm transition-all duration-200 hover:bg-black/40"
          >
            <p className="text-center text-sm font-medium text-white/90">
              Read more
            </p>
          </button>
        </motion.div>
      )}
    </>
  );
};

const GalleryDescription: React.FC<GalleryDescriptionProps> = ({
  currentItem,
  isMobile,
  showDescriptionPopup,
  onToggleDescriptionPopup,
}) => {
  return (
    <>
      {/* Mobile Description Popup */}
      <AnimatePresence>
        {isMobile && showDescriptionPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100002] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={e => {
              if (e.target === e.currentTarget) {
                onToggleDescriptionPopup(false);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative mx-6 max-w-sm rounded-2xl border border-white/20 bg-black/70 p-6 backdrop-blur-sm"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {/* Close button */}
              <button
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleDescriptionPopup(false);
                }}
                className="absolute right-4 top-4 rounded-full bg-white/10 p-2 transition-all duration-200 hover:bg-white/20"
                aria-label="Close description"
              >
                <X className="h-4 w-4 text-white" />
              </button>

              {/* Content */}
              <h4 className="mb-3 pr-8 text-xl font-extralight tracking-wide text-white">
                {currentItem.title}
              </h4>
              <p className="text-sm font-light leading-relaxed text-white/70">
                {currentItem.description}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GalleryDescription;
