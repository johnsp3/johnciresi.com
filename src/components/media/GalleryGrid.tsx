import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize2 } from 'lucide-react';

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
  placeholder: string;
}

interface GalleryGridProps {
  categories: GalleryCategory[];
  onCategoryClick: (category: GalleryCategory) => void;
}

// Gallery Grid Component
const GalleryGrid: React.FC<GalleryGridProps> = ({ categories, onCategoryClick }) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [visibleImages, setVisibleImages] = useState<Set<string>>(new Set());
  const imageRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const handleImageLoad = (categoryId: string) => {
    setLoadedImages(prev => new Set(prev).add(categoryId));
  };

  // Intersection Observer for better performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const categoryId = entry.target.getAttribute('data-category-id');
            if (categoryId) {
              setVisibleImages(prev => new Set(prev).add(categoryId));
            }
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    );

    // Observe all current refs
    const currentRefs = Array.from(imageRefs.current.values());
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [categories.length]); // Only depend on categories length, not the full array

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.5,
            delay: index * 0.1,
            type: "spring",
            damping: 25,
            stiffness: 300
          }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
          className="group cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCategoryClick(category);
          }}
          role="button"
          tabIndex={0}
          aria-label={`View ${category.title} gallery`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              onCategoryClick(category);
            }
          }}
        >
          <div 
            ref={(el) => {
              if (el) imageRefs.current.set(category.id, el);
            }}
            data-category-id={category.id}
            className="aspect-[4/5] relative overflow-hidden border border-gray-200/20 rounded-2xl"
          >
            {/* Loading Skeleton */}
            {!loadedImages.has(category.id) && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-300/50 to-gray-400/50"></div>
              </div>
            )}
            
            {/* Background Image */}
            {visibleImages.has(category.id) && (
              <img 
                src={category.placeholder || '/images/gallery/placeholder.png'}
                alt={`${category.title} gallery preview - ${category.description}. Click to view full gallery.`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  loadedImages.has(category.id) ? 'opacity-100' : 'opacity-0'
                }`}
                loading="lazy"
                decoding="async"
                onLoad={() => handleImageLoad(category.id)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/gallery/placeholder.png';
                  handleImageLoad(category.id);
                }}
              />
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-700"></div>
            
            {/* Text Background Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
            
            {/* Content */}
            <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-4 sm:left-6 lg:left-8 right-4 sm:right-6 lg:right-8">
              <h3 className="text-white font-extralight tracking-wide text-lg sm:text-xl mb-2 sm:mb-3 group-hover:text-white/90 transition-colors duration-500">
                {category.title}
              </h3>
              <p className="text-white/70 text-xs sm:text-sm font-light leading-relaxed">
                {category.description}
              </p>
            </div>
            
            {/* Artwork Credit */}
            <div className="absolute bottom-4 right-4">
              <p className="text-white/60 text-xs font-light tracking-wide">
                Artwork by John Chezik
              </p>
            </div>
            
            {/* Hover Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Maximize Icon */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                <Maximize2 className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default GalleryGrid;
