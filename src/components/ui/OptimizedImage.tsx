import React, { useState, useCallback, useRef, useEffect, useMemo, memo } from 'react';
import { motion } from 'framer-motion';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  draggable?: boolean;
  onContextMenu?: (e: React.MouseEvent<HTMLImageElement>) => void;
  onDragStart?: (e: React.DragEvent<HTMLImageElement>) => void;
  overlayContent?: React.ReactNode;
  style?: React.CSSProperties;
  priority?: boolean;
  id?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = memo(({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  loading = 'lazy',
  draggable = false,
  onContextMenu,
  onDragStart,
  overlayContent,
  style,
  priority = false,
  id,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoaded(false);
  }, []);

  // Generate responsive srcset for better performance - memoized for performance
  const generateSrcSet = useCallback((baseSrc: string) => {
    const sizes = [320, 640, 768, 1024, 1280, 1536];
    return sizes
      .map(size => `${baseSrc}?w=${size} ${size}w`)
      .join(', ');
  }, []);

  // Memoize srcSet generation to prevent unnecessary recalculations
  const srcSet = useMemo(() => generateSrcSet(src), [src, generateSrcSet]);

  // Memoize image styles for performance
  const imageStyles = useMemo(() => ({
    willChange: 'transform' as const,
    backfaceVisibility: 'hidden' as const,
    transform: 'translateZ(0)',
  }), []);

  // Memoize sizes attribute
  const sizesAttribute = useMemo(() => 
    '(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, (max-width: 1280px) 1280px, 1536px',
    []
  );

  return (
    <div
      ref={imgRef}
      id={id}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-dark-elevated via-dark-muted to-dark-elevated bg-[length:200%_100%] animate-shimmer" />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-dark-elevated flex items-center justify-center">
          <div className="text-text-secondary text-center">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-sm">Failed to load image</p>
          </div>
        </div>
      )}

      {/* Actual image */}
      {isInView && (
        <motion.img
          src={src}
          srcSet={srcSet}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          draggable={draggable}
          onLoad={handleLoad}
          onError={handleError}
          onContextMenu={onContextMenu}
          onDragStart={onDragStart as React.DragEventHandler<HTMLImageElement>}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={imageStyles}
          sizes={sizesAttribute}
        />
      )}

      {/* Overlay content */}
      {overlayContent && (
        <div className="absolute inset-0 pointer-events-none">
          {overlayContent}
        </div>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;