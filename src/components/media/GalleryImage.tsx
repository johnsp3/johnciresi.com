import React, { useRef } from 'react';
import { motion } from 'framer-motion';

export interface MediaItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
}

interface GalleryImageProps {
  currentItem: MediaItem;
  currentIndex: number;
  totalItems: number;
  categoryTitle: string;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  overlayContent?: React.ReactNode;
}

const GalleryImage: React.FC<GalleryImageProps> = ({
  currentItem,
  currentIndex,
  totalItems,
  categoryTitle,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  overlayContent,
}) => {
  const imageRef = useRef<HTMLImageElement>(null);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{
        type: 'spring',
        damping: 30,
        stiffness: 400,
        duration: 0.3,
      }}
      className="relative z-[100001] mx-6 flex max-h-[90vh] max-w-7xl items-center justify-center"
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Image Container with Shadow/Glow */}
      <div className="relative">
        <img
          ref={imageRef}
          src={currentItem.src}
          alt={`${currentItem.alt} - Image ${currentIndex + 1} of ${totalItems} in ${categoryTitle} gallery`}
          className="max-h-[90vh] max-w-full rounded-2xl object-contain shadow-2xl transition-all duration-300"
          loading="eager"
          decoding="async"
          style={{
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
            filter:
              'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 20px rgba(0, 0, 0, 0.3))',
          }}
        />

        {/* Overlay Container - positioned relative to image */}
        <div className="pointer-events-none absolute inset-0">
          {overlayContent}
        </div>
      </div>
    </motion.div>
  );
};

export default GalleryImage;
