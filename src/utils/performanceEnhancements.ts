/**
 * Enhanced Performance Monitoring and Optimizations
 * Gold standard performance utilities for John Ciresi website
 */

// Type definitions for browser APIs
interface NetworkInformation {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

// Performance budget thresholds (in milliseconds)
export const PERFORMANCE_BUDGETS = {
  LCP: 2500, // Largest Contentful Paint
  FID: 100,  // First Input Delay
  CLS: 0.1,  // Cumulative Layout Shift
  FCP: 1800, // First Contentful Paint
  TTFB: 600, // Time to First Byte
  INP: 200,  // Interaction to Next Paint
} as const;

// Device performance categories
export const DEVICE_PERFORMANCE = {
  HIGH_END: 'high-end',
  MID_RANGE: 'mid-range',
  LOW_END: 'low-end',
} as const;

/**
 * Detect device performance capabilities
 */
export function detectDevicePerformance(): string {
  if (typeof window === 'undefined') return DEVICE_PERFORMANCE.MID_RANGE;

  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  const memory = (performance as Performance & { memory?: MemoryInfo }).memory;
  const hardwareConcurrency = navigator.hardwareConcurrency || 1;

  // High-end device indicators
  if (
    hardwareConcurrency >= 8 &&
    memory && memory.jsHeapSizeLimit > 4 * 1024 * 1024 * 1024 && // 4GB
    (!connection || connection.effectiveType === '4g')
  ) {
    return DEVICE_PERFORMANCE.HIGH_END;
  }

  // Low-end device indicators
  if (
    hardwareConcurrency <= 2 ||
    (memory && memory.jsHeapSizeLimit < 1 * 1024 * 1024 * 1024) || // 1GB
    (connection && ['slow-2g', '2g'].includes(connection.effectiveType))
  ) {
    return DEVICE_PERFORMANCE.LOW_END;
  }

  return DEVICE_PERFORMANCE.MID_RANGE;
}

/**
 * Adaptive loading based on device performance
 */
export function getAdaptiveLoadingConfig() {
  const devicePerformance = detectDevicePerformance();

  switch (devicePerformance) {
    case DEVICE_PERFORMANCE.HIGH_END:
      return {
        imageQuality: 'high',
        animationDuration: 'normal',
        preloadImages: true,
        enableAdvancedFeatures: true,
        intersectionRootMargin: '200px',
      };
    case DEVICE_PERFORMANCE.LOW_END:
      return {
        imageQuality: 'low',
        animationDuration: 'reduced',
        preloadImages: false,
        enableAdvancedFeatures: false,
        intersectionRootMargin: '50px',
      };
    default:
      return {
        imageQuality: 'medium',
        animationDuration: 'normal',
        preloadImages: true,
        enableAdvancedFeatures: true,
        intersectionRootMargin: '100px',
      };
  }
}

/**
 * Enhanced resource hints for better performance
 */
export function addResourceHints() {
  if (typeof document === 'undefined') return;

  // Preconnect to critical domains
  const criticalDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ];

  criticalDomains.forEach(domain => {
    if (!document.querySelector(`link[rel="preconnect"][href="${domain}"]`)) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  });

  // DNS prefetch for non-critical domains
  const dnsPrefetchDomains = [
    'https://vercel.com',
    'https://sentry.io',
  ];

  dnsPrefetchDomains.forEach(domain => {
    if (!document.querySelector(`link[rel="dns-prefetch"][href="${domain}"]`)) {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    }
  });
}

/**
 * Optimize images based on device capabilities
 */
export function getOptimizedImageConfig() {
  const devicePerformance = detectDevicePerformance();
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;

  let quality = 80;
  let format = 'webp';

  // Adjust quality based on connection
  if (connection) {
    switch (connection.effectiveType) {
      case 'slow-2g':
      case '2g':
        quality = 60;
        format = 'jpeg';
        break;
      case '3g':
        quality = 70;
        break;
      case '4g':
        quality = 85;
        break;
    }
  }

  // Adjust based on device performance
  if (devicePerformance === DEVICE_PERFORMANCE.LOW_END) {
    quality = Math.min(quality, 70);
  } else if (devicePerformance === DEVICE_PERFORMANCE.HIGH_END) {
    quality = Math.min(quality, 95);
  }

  return { quality, format };
}

/**
 * Memory usage monitoring
 */
export function monitorMemoryUsage() {
  if (typeof window === 'undefined' || !(performance as Performance & { memory?: MemoryInfo }).memory) return;

  const memory = (performance as Performance & { memory?: MemoryInfo }).memory;
  if (!memory) return;
  
  const usage = {
    used: memory.usedJSHeapSize,
    total: memory.totalJSHeapSize,
    limit: memory.jsHeapSizeLimit,
    percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
  };

  // Log warning if memory usage is high
  if (usage.percentage > 80) {
      import('@/utils/logger').then(({ logWarn }) => {
        logWarn('High memory usage detected', { 
          component: 'Performance',
          action: 'monitorMemoryUsage',
          metadata: { usage }
        });
      });
  }

  return usage;
}

/**
 * Network-aware loading
 */
export function getNetworkAwareConfig() {
  if (typeof navigator === 'undefined') return {};

  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (!connection) return {};

  return {
    effectiveType: connection.effectiveType,
    downlink: connection.downlink,
    rtt: connection.rtt,
    saveData: connection.saveData,
  };
}

/**
 * Initialize all performance optimizations
 */
export function initPerformanceOptimizations() {
  if (typeof window === 'undefined') return;

  // Add resource hints
  addResourceHints();

  // Monitor memory usage periodically
  setInterval(monitorMemoryUsage, 30000); // Every 30 seconds

      // Log performance info in development
      if (process.env.NODE_ENV === 'development') {
        import('@/utils/logger').then(({ logInfo }) => {
          logInfo('Performance optimizations initialized', { 
            component: 'Performance',
            action: 'initPerformanceOptimizations',
            metadata: {
              devicePerformance: detectDevicePerformance(),
              loadingConfig: getAdaptiveLoadingConfig(),
              imageConfig: getOptimizedImageConfig(),
              networkConfig: getNetworkAwareConfig()
            }
          });
        });
      }
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
