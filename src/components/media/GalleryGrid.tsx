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
const GalleryGrid: React.FC<GalleryGridProps> = ({
  categories,
  onCategoryClick,
}) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [visibleImages, setVisibleImages] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const imageRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const handleImageLoad = (categoryId: string) => {
    setLoadedImages(prev => new Set(prev).add(categoryId));
  };

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Intersection Observer for better performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
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
        threshold: 0.1,
      }
    );

    // Observe all current refs
    const currentRefs = Array.from(imageRefs.current.values());
    currentRefs.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [categories.length]); // Only depend on categories length, not the full array

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            type: 'spring',
            damping: 25,
            stiffness: 300,
          }}
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.2 },
          }}
          className="group cursor-pointer"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            onCategoryClick(category);
          }}
          role="button"
          tabIndex={0}
          aria-label={`View ${category.title} gallery`}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              onCategoryClick(category);
            }
          }}
        >
          <div
            ref={el => {
              if (el) imageRefs.current.set(category.id, el);
            }}
            data-category-id={category.id}
            className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-gray-200/20"
          >
            {/* Loading Skeleton */}
            {!loadedImages.has(category.id) && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 to-gray-300">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-300/50 to-gray-400/50"></div>
              </div>
            )}

            {/* Background Image */}
            {visibleImages.has(category.id) && (
              <img
                src={category.placeholder || '/images/gallery/placeholder.png'}
                alt={`${category.title} gallery preview - ${category.description}. Click to view full gallery.`}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                  loadedImages.has(category.id) ? 'opacity-100' : 'opacity-0'
                }`}
                loading="lazy"
                decoding="async"
                onLoad={() => handleImageLoad(category.id)}
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/gallery/placeholder.png';
                  handleImageLoad(category.id);
                }}
              />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            <div className="absolute inset-0 bg-black/40 transition-all duration-700 group-hover:bg-black/30"></div>

            {/* Text Background Overlay - Only show on desktop or when mobile popup is open */}
            {!isMobile && (
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
            )}

            {/* Content - Desktop: Full text, Mobile: Just title + view more button */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 lg:bottom-8 lg:left-8 lg:right-8">
              <h3 className="mb-2 text-lg font-extralight tracking-wide text-white transition-colors duration-500 group-hover:text-white/90 sm:mb-3 sm:text-xl">
                {category.title}
              </h3>

              {/* Desktop: Full description */}
              {!isMobile && (
                <p className="text-xs font-light leading-relaxed text-white/70 sm:text-sm">
                  {category.description}
                </p>
              )}

              {/* Mobile: Just view more button */}
              {isMobile && (
                <button
                  className="text-xs font-medium text-white/90 underline transition-colors duration-200 hover:text-white"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    // For mobile, we'll show a popup instead of opening the gallery
                    // This will be handled by the parent component
                    onCategoryClick(category);
                  }}
                >
                  View more
                </button>
              )}
            </div>

            {/* Artwork Credit */}
            <div className="absolute bottom-4 right-4">
              <p className="text-xs font-light tracking-wide text-white/60">
                Artwork by John Ciresi
              </p>
            </div>

            {/* Hover Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100"></div>

            {/* Maximize Icon */}
            <div className="absolute right-4 top-4 translate-y-2 transform opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <div className="rounded-full border border-white/20 bg-white/10 p-2 backdrop-blur-sm">
                <Maximize2 className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default GalleryGrid;
