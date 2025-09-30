import type { OptimizedImageResult } from './imageTypes';

/**
 * Generate srcset string for responsive images
 */
export function generateSrcSet(responsiveImages: Record<string, OptimizedImageResult>): string {
  return Object.entries(responsiveImages)
    .map(([_breakpoint, image]: [string, OptimizedImageResult]) => `${image.src} ${image.width}w`)
    .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizes(): string {
  return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
}

/**
 * Create optimized image component props
 */
export function createImageProps(
  responsiveImages: Record<string, OptimizedImageResult>,
  alt: string,
  placeholder?: string
): {
  src: string;
  srcSet: string;
  sizes: string;
  alt: string;
  placeholder?: string;
  loading: 'lazy';
  decoding: 'async';
} {
  return {
    src: responsiveImages.desktop?.src || '',
    srcSet: generateSrcSet(responsiveImages),
    sizes: generateSizes(),
    alt,
    placeholder,
    loading: 'lazy' as const,
    decoding: 'async' as const
  };
}
