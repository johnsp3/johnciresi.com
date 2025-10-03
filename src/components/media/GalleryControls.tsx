import React from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryControlsProps {
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  isTransitioning: boolean;
  onNavigate?: () => void;
}

const GalleryControls: React.FC<GalleryControlsProps> = ({
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  isTransitioning,
  onNavigate,
}) => {
  return (
    <>
      {/* Close Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
        className="absolute right-6 top-6 z-[100000] rounded-full border border-white/20 bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
        aria-label="Close gallery"
      >
        <X className="h-6 w-6 text-white" />
      </motion.button>

      {/* Navigation Buttons */}
      {hasPrev && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            if (!isTransitioning) {
              onPrev();
              onNavigate?.();
            }
          }}
          className="absolute left-4 top-1/2 z-[10000] -translate-y-1/2 touch-manipulation rounded-full border border-white/20 bg-white/10 p-2 backdrop-blur-sm transition-all duration-200 hover:bg-white/20 sm:left-6 sm:p-3"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5 text-white sm:h-6 sm:w-6" />
        </motion.button>
      )}

      {hasNext && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            if (!isTransitioning) {
              onNext();
              onNavigate?.();
            }
          }}
          className="absolute right-4 top-1/2 z-[10000] -translate-y-1/2 touch-manipulation rounded-full border border-white/20 bg-white/10 p-2 backdrop-blur-sm transition-all duration-200 hover:bg-white/20 sm:right-6 sm:p-3"
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5 text-white sm:h-6 sm:w-6" />
        </motion.button>
      )}
    </>
  );
};

export default GalleryControls;
