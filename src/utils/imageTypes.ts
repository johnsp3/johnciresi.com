// Types for image optimization utilities
export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

export interface OptimizedImageResult {
  src: string;
  width: number;
  height: number;
  format: string;
  size: number;
  alt: string;
}

// Responsive breakpoints for different screen sizes
export const RESPONSIVE_BREAKPOINTS = {
  mobile: { width: 400, height: 300 },
  tablet: { width: 800, height: 600 },
  desktop: { width: 1200, height: 900 },
  large: { width: 1600, height: 1200 }
} as const;

// Default optimization settings
export const DEFAULT_OPTIONS: Required<ImageOptimizationOptions> = {
  width: 800,
  height: 600,
  quality: 85,
  format: 'webp',
  fit: 'cover'
};
