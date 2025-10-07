/**
 * Animation Utilities Tests - PLATINUM STANDARDS
 * 
 * Comprehensive unit tests for animation utilities
 * Following React 18 and TypeScript best practices
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  prefersReducedMotion,
  getReducedMotionVariants,
  gpuAcceleratedTransition,
  springTransition,
  staggerTransition,
  fadeInVariants,
  scaleVariants,
  slideUpVariants,
  hoverScaleVariants,
  createOptimizedTransition,
  createStaggeredAnimation,
  createResponsiveAnimation,
  createReducedMotionAnimation,
  getOptimizedMotionProps,
  getGPUAcceleratedTransform,
} from '../animations';

// Mock window.matchMedia
const mockMatchMedia = vi.fn();

describe('Accessibility Utilities', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should detect reduced motion preference', () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
    });

    expect(prefersReducedMotion()).toBe(true);
  });

  it('should detect no reduced motion preference', () => {
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
    });

    expect(prefersReducedMotion()).toBe(false);
  });

  it('should handle server-side rendering', () => {
    // Mock undefined window
    const originalWindow = global.window;
    // @ts-ignore
    delete global.window;

    expect(prefersReducedMotion()).toBe(false);

    // Restore window
    global.window = originalWindow;
  });

  it('should return reduced motion variants when preferred', () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
    });

    const originalVariants = {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0, opacity: 0 },
    };

    const result = getReducedMotionVariants(originalVariants);

    expect(result).toEqual({
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    });
  });

  it('should return original variants when no reduced motion preference', () => {
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
    });

    const originalVariants = {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0, opacity: 0 },
    };

    const result = getReducedMotionVariants(originalVariants);

    expect(result).toEqual(originalVariants);
  });
});

describe('Transition Objects', () => {
  it('should have correct GPU accelerated transition properties', () => {
    expect(gpuAcceleratedTransition).toEqual({
      type: 'tween',
      ease: [0.25, 0.46, 0.45, 0.94],
      duration: 0.3,
    });
  });

  it('should have correct spring transition properties', () => {
    expect(springTransition).toEqual({
      type: 'spring',
      damping: 25,
      stiffness: 300,
      mass: 0.8,
    });
  });

  it('should have correct stagger transition properties', () => {
    expect(staggerTransition).toEqual({
      type: 'spring',
      damping: 20,
      stiffness: 300,
      staggerChildren: 0.1,
      delayChildren: 0.1,
    });
  });
});

describe('Animation Variants', () => {
  it('should have correct fade in variants', () => {
    expect(fadeInVariants).toHaveProperty('initial');
    expect(fadeInVariants).toHaveProperty('animate');
    expect(fadeInVariants).toHaveProperty('exit');
    expect(fadeInVariants.initial).toHaveProperty('opacity', 0);
    expect(fadeInVariants.animate).toHaveProperty('opacity', 1);
    expect(fadeInVariants.exit).toHaveProperty('opacity', 0);
  });

  it('should have correct scale variants', () => {
    expect(scaleVariants).toHaveProperty('initial');
    expect(scaleVariants).toHaveProperty('animate');
    expect(scaleVariants).toHaveProperty('exit');
    expect(scaleVariants.initial).toHaveProperty('scale', 0.8);
    expect(scaleVariants.animate).toHaveProperty('scale', 1);
    expect(scaleVariants.exit).toHaveProperty('scale', 0.8);
  });

  it('should have correct slide up variants', () => {
    expect(slideUpVariants).toHaveProperty('initial');
    expect(slideUpVariants).toHaveProperty('animate');
    expect(slideUpVariants).toHaveProperty('exit');
    expect(slideUpVariants.initial).toHaveProperty('y', 50);
    expect(slideUpVariants.animate).toHaveProperty('y', 0);
    expect(slideUpVariants.exit).toHaveProperty('y', -50);
  });

  it('should have correct hover scale variants', () => {
    expect(hoverScaleVariants).toHaveProperty('initial');
    expect(hoverScaleVariants).toHaveProperty('hover');
    expect(hoverScaleVariants).toHaveProperty('tap');
    expect(hoverScaleVariants.initial).toHaveProperty('scale', 1);
    expect(hoverScaleVariants.hover).toHaveProperty('scale', 1.05);
    expect(hoverScaleVariants.tap).toHaveProperty('scale', 0.95);
  });
});

describe('Utility Functions', () => {
  it('should create optimized transition with custom duration', () => {
    const transition = createOptimizedTransition(0.5);
    
    expect(transition).toEqual({
      type: 'tween',
      ease: [0.25, 0.46, 0.45, 0.94],
      duration: 0.5,
    });
  });

  it('should create optimized transition with custom ease', () => {
    const customEase = 'easeInOut';
    const transition = createOptimizedTransition(0.3, customEase);
    
    expect(transition).toEqual({
      type: 'tween',
      ease: customEase,
      duration: 0.3,
    });
  });

  it('should create staggered animation', () => {
    const animation = createStaggeredAnimation(0.2, 0.3);
    
    expect(animation).toEqual({
      initial: {},
      animate: {
        transition: {
          staggerChildren: 0.2,
          delayChildren: 0.3,
        },
      },
    });
  });

  it('should create responsive animation for mobile', () => {
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    const mobileVariants = { initial: { x: -100 }, animate: { x: 0 } };
    const desktopVariants = { initial: { x: -200 }, animate: { x: 0 } };

    const result = createResponsiveAnimation(mobileVariants, desktopVariants);

    expect(result).toEqual(mobileVariants);
  });

  it('should create responsive animation for desktop', () => {
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const mobileVariants = { initial: { x: -100 }, animate: { x: 0 } };
    const desktopVariants = { initial: { x: -200 }, animate: { x: 0 } };

    const result = createResponsiveAnimation(mobileVariants, desktopVariants);

    expect(result).toEqual(desktopVariants);
  });

  it('should handle server-side rendering for responsive animation', () => {
    // Mock undefined window
    const originalWindow = global.window;
    // @ts-ignore
    delete global.window;

    const mobileVariants = { initial: { x: -100 }, animate: { x: 0 } };
    const desktopVariants = { initial: { x: -200 }, animate: { x: 0 } };

    const result = createResponsiveAnimation(mobileVariants, desktopVariants);

    expect(result).toEqual(desktopVariants);

    // Restore window
    global.window = originalWindow;
  });

  it('should create reduced motion animation when preferred', () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
    });

    const fullVariants = {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0, opacity: 0 },
    };

    const result = createReducedMotionAnimation(fullVariants);

    expect(result).toEqual({
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    });
  });

  it('should create reduced motion animation with custom reduced variants', () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
    });

    const fullVariants = {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0, opacity: 0 },
    };

    const customReducedVariants = {
      initial: { opacity: 0 },
      animate: { opacity: 0.5 },
      exit: { opacity: 0 },
    };

    const result = createReducedMotionAnimation(fullVariants, customReducedVariants);

    expect(result).toEqual(customReducedVariants);
  });

  it('should return original variants when no reduced motion preference', () => {
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
    });

    const fullVariants = {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0, opacity: 0 },
    };

    const result = createReducedMotionAnimation(fullVariants);

    expect(result).toEqual(fullVariants);
  });
});

describe('Performance Optimization', () => {
  it('should return optimized motion props', () => {
    const props = getOptimizedMotionProps();

    expect(props).toEqual({
      style: {
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
        perspective: 1000,
      },
    });
  });

  it('should return GPU accelerated transform', () => {
    const transform = getGPUAcceleratedTransform();

    expect(transform).toEqual({
      transform: 'translateZ(0)',
      willChange: 'transform',
      backfaceVisibility: 'hidden',
    });
  });
});
