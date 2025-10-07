/**
 * Animation Utilities - FRAMER MOTION PLATINUM STANDARDS
 * 
 * Provides:
 * - GPU-accelerated animations
 * - Accessibility support (respects prefers-reduced-motion)
 * - Performance optimization
 * - Smooth 60fps transitions
 * - Consistent easing functions
 */

import { Variants, Transition } from 'framer-motion';

// ============================================================================
// ACCESSIBILITY UTILITIES
// ============================================================================

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get reduced motion variants that respect user preferences
 */
export function getReducedMotionVariants(variants: Variants): Variants {
  if (prefersReducedMotion()) {
    // Return minimal animations for reduced motion preference
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    };
  }
  return variants;
}

// ============================================================================
// PERFORMANCE-OPTIMIZED TRANSITIONS
// ============================================================================

/**
 * GPU-accelerated transition with optimal performance
 */
export const gpuAcceleratedTransition: Transition = {
  type: 'tween',
  ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic-bezier for smooth motion
  duration: 0.3,
};

/**
 * Spring transition for natural motion
 */
export const springTransition: Transition = {
  type: 'spring',
  damping: 25,
  stiffness: 300,
  mass: 0.8,
};

/**
 * Stagger transition for sequential animations
 */
export const staggerTransition: Transition = {
  type: 'spring',
  damping: 20,
  stiffness: 300,
  staggerChildren: 0.1,
  delayChildren: 0.1,
};

// ============================================================================
// COMMON ANIMATION VARIANTS
// ============================================================================

/**
 * Fade in animation with GPU acceleration
 */
export const fadeInVariants: Variants = {
  initial: { 
    opacity: 0,
    filter: 'blur(4px)',
  },
  animate: { 
    opacity: 1,
    filter: 'blur(0px)',
    transition: gpuAcceleratedTransition,
  },
  exit: { 
    opacity: 0,
    filter: 'blur(4px)',
    transition: gpuAcceleratedTransition,
  },
};

/**
 * Scale animation with GPU acceleration
 */
export const scaleVariants: Variants = {
  initial: { 
    scale: 0.8,
    opacity: 0,
  },
  animate: { 
    scale: 1,
    opacity: 1,
    transition: springTransition,
  },
  exit: { 
    scale: 0.8,
    opacity: 0,
    transition: gpuAcceleratedTransition,
  },
};

/**
 * Slide up animation with GPU acceleration
 */
export const slideUpVariants: Variants = {
  initial: { 
    y: 50,
    opacity: 0,
  },
  animate: { 
    y: 0,
    opacity: 1,
    transition: springTransition,
  },
  exit: { 
    y: -50,
    opacity: 0,
    transition: gpuAcceleratedTransition,
  },
};

/**
 * Slide in from left animation
 */
export const slideInLeftVariants: Variants = {
  initial: { 
    x: -100,
    opacity: 0,
  },
  animate: { 
    x: 0,
    opacity: 1,
    transition: springTransition,
  },
  exit: { 
    x: -100,
    opacity: 0,
    transition: gpuAcceleratedTransition,
  },
};

/**
 * Slide in from right animation
 */
export const slideInRightVariants: Variants = {
  initial: { 
    x: 100,
    opacity: 0,
  },
  animate: { 
    x: 0,
    opacity: 1,
    transition: springTransition,
  },
  exit: { 
    x: 100,
    opacity: 0,
    transition: gpuAcceleratedTransition,
  },
};

// ============================================================================
// HOVER ANIMATIONS
// ============================================================================

/**
 * Hover scale animation with GPU acceleration
 */
export const hoverScaleVariants: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 400,
    },
  },
  tap: { 
    scale: 0.95,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 400,
    },
  },
};

/**
 * Hover lift animation with shadow
 */
export const hoverLiftVariants: Variants = {
  initial: { 
    y: 0,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  hover: { 
    y: -8,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: springTransition,
  },
  tap: { 
    y: -4,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 400,
    },
  },
};

// ============================================================================
// STAGGER ANIMATIONS
// ============================================================================

/**
 * Stagger children animation
 */
export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

/**
 * Stagger item animation
 */
export const staggerItemVariants: Variants = {
  initial: { 
    y: 20,
    opacity: 0,
  },
  animate: { 
    y: 0,
    opacity: 1,
    transition: springTransition,
  },
  exit: { 
    y: -20,
    opacity: 0,
    transition: gpuAcceleratedTransition,
  },
};

// ============================================================================
// MODAL ANIMATIONS
// ============================================================================

/**
 * Modal backdrop animation
 */
export const modalBackdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: gpuAcceleratedTransition,
  },
  exit: { 
    opacity: 0,
    transition: gpuAcceleratedTransition,
  },
};

/**
 * Modal content animation
 */
export const modalContentVariants: Variants = {
  initial: { 
    scale: 0.8,
    opacity: 0,
    y: 50,
  },
  animate: { 
    scale: 1,
    opacity: 1,
    y: 0,
    transition: springTransition,
  },
  exit: { 
    scale: 0.8,
    opacity: 0,
    y: 50,
    transition: gpuAcceleratedTransition,
  },
};

// ============================================================================
// LOADING ANIMATIONS
// ============================================================================

/**
 * Loading spinner animation
 */
export const loadingSpinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

/**
 * Pulse animation for loading states
 */
export const pulseVariants: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create a custom transition with performance optimization
 */
export function createOptimizedTransition(
  duration: number = 0.3,
  ease: string | number[] = [0.25, 0.46, 0.45, 0.94]
): Transition {
  return {
    type: 'tween',
    ease,
    duration,
  };
}

/**
 * Create staggered animation with custom delay
 */
export function createStaggeredAnimation(
  staggerDelay: number = 0.1,
  childDelay: number = 0.1
): Variants {
  return {
    initial: {},
    animate: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: childDelay,
      },
    },
  };
}

/**
 * Create responsive animation that adapts to screen size
 */
export function createResponsiveAnimation(
  mobileVariants: Variants,
  desktopVariants: Variants
): Variants {
  if (typeof window === 'undefined') return desktopVariants;
  
  const isMobile = window.innerWidth < 768;
  return isMobile ? mobileVariants : desktopVariants;
}

/**
 * Create reduced motion animation
 */
export function createReducedMotionAnimation(
  fullVariants: Variants,
  reducedVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  }
): Variants {
  return prefersReducedMotion() ? reducedVariants : fullVariants;
}

// ============================================================================
// PERFORMANCE OPTIMIZATION
// ============================================================================

/**
 * Optimize motion component props for performance
 */
export function getOptimizedMotionProps() {
  return {
    style: {
      willChange: 'transform, opacity',
      backfaceVisibility: 'hidden' as const,
      perspective: 1000,
    },
  };
}

/**
 * Get GPU-accelerated transform properties
 */
export function getGPUAcceleratedTransform() {
  return {
    transform: 'translateZ(0)',
    willChange: 'transform',
    backfaceVisibility: 'hidden' as const,
  };
}

export default {
  prefersReducedMotion,
  getReducedMotionVariants,
  gpuAcceleratedTransition,
  springTransition,
  staggerTransition,
  fadeInVariants,
  scaleVariants,
  slideUpVariants,
  slideInLeftVariants,
  slideInRightVariants,
  hoverScaleVariants,
  hoverLiftVariants,
  staggerContainerVariants,
  staggerItemVariants,
  modalBackdropVariants,
  modalContentVariants,
  loadingSpinnerVariants,
  pulseVariants,
  createOptimizedTransition,
  createStaggeredAnimation,
  createResponsiveAnimation,
  createReducedMotionAnimation,
  getOptimizedMotionProps,
  getGPUAcceleratedTransform,
};
