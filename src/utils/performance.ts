/**
 * Performance Monitoring Utilities
 * Enterprise-level performance tracking for John Ciresi website
 */

import { logPerformanceIssue } from './errorTracking.js';

// Core Web Vitals tracking
export interface WebVitals {
  CLS: number;
  FID: number;
  FCP: number;
  LCP: number;
  TTFB: number;
}

// Performance metrics storage
const performanceMetrics: Partial<WebVitals> = {};

/**
 * Track Core Web Vitals
 */
export function trackWebVitals() {
  if (typeof window === 'undefined') return;

  // Track Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    const lcpObserver = new PerformanceObserver(list => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry;
      performanceMetrics.LCP = lastEntry.startTime;

      // Log for development
      if (process.env.NODE_ENV === 'development') {
        console.log('LCP:', lastEntry.startTime);
      }
    });

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (_e) {
      // Fallback for browsers that don't support LCP
    }
  }

  // Track First Contentful Paint (FCP)
  if ('PerformanceObserver' in window) {
    const fcpObserver = new PerformanceObserver(list => {
      const entries = list.getEntries();
      const fcpEntry = entries.find(
        entry => entry.name === 'first-contentful-paint'
      ) as PerformanceEntry;
      if (fcpEntry) {
        performanceMetrics.FCP = fcpEntry.startTime;

        if (process.env.NODE_ENV === 'development') {
          console.log('FCP:', fcpEntry.startTime);
        }
      }
    });

    try {
      fcpObserver.observe({ entryTypes: ['paint'] });
    } catch (_e) {
      // Fallback for browsers that don't support FCP
    }
  }

  // Track Time to First Byte (TTFB)
  if ('PerformanceObserver' in window) {
    const ttfbObserver = new PerformanceObserver(list => {
      const entries = list.getEntries();
      const navigationEntry = entries.find(
        entry => entry.entryType === 'navigation'
      ) as PerformanceNavigationTiming;
      if (navigationEntry) {
        performanceMetrics.TTFB =
          navigationEntry.responseStart - navigationEntry.requestStart;

        if (process.env.NODE_ENV === 'development') {
          console.log('TTFB:', performanceMetrics.TTFB);
        }
      }
    });

    try {
      ttfbObserver.observe({ entryTypes: ['navigation'] });
    } catch (_e) {
      // Fallback for browsers that don't support TTFB
    }
  }
}

/**
 * Track Cumulative Layout Shift (CLS)
 */
export function trackCLS() {
  if (typeof window === 'undefined') return;

  let clsValue = 0;
  const clsEntries: PerformanceEntry[] = [];

  if ('PerformanceObserver' in window) {
    const clsObserver = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        if (
          !(entry as PerformanceEntry & { hadRecentInput?: boolean })
            .hadRecentInput
        ) {
          clsEntries.push(entry);
          clsValue += (entry as PerformanceEntry & { value: number }).value;
        }
      }

      performanceMetrics.CLS = clsValue;

      if (process.env.NODE_ENV === 'development') {
        console.log('CLS:', clsValue);
      }
    });

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (_e) {
      // Fallback for browsers that don't support CLS
    }
  }
}

/**
 * Track First Input Delay (FID)
 */
export function trackFID() {
  if (typeof window === 'undefined') return;

  if ('PerformanceObserver' in window) {
    const fidObserver = new PerformanceObserver(list => {
      const entries = list.getEntries();
      const fidEntry = entries[0] as PerformanceEventTiming;
      if (fidEntry) {
        performanceMetrics.FID = fidEntry.processingStart - fidEntry.startTime;

        if (process.env.NODE_ENV === 'development') {
          console.log('FID:', performanceMetrics.FID);
        }
      }
    });

    try {
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (_e) {
      // Fallback for browsers that don't support FID
    }
  }
}

/**
 * Get current performance metrics
 */
export function getPerformanceMetrics(): Partial<WebVitals> {
  return { ...performanceMetrics };
}

/**
 * Initialize performance tracking
 */
export function initPerformanceTracking() {
  if (typeof window === 'undefined') return;

  // Track all Core Web Vitals
  trackWebVitals();
  trackCLS();
  trackFID();

  // Track page load performance
  window.addEventListener('load', () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Page loaded. Performance metrics:', getPerformanceMetrics());
    }
  });
}

/**
 * Performance budget monitoring
 */
export const PERFORMANCE_BUDGETS = {
  LCP: 2500, // 2.5 seconds
  FID: 100, // 100 milliseconds
  CLS: 0.1, // 0.1
  FCP: 1800, // 1.8 seconds
  TTFB: 600, // 600 milliseconds
} as const;

/**
 * Check if performance metrics meet budget
 */
export function checkPerformanceBudget(): {
  passed: boolean;
  violations: string[];
} {
  const metrics = getPerformanceMetrics();
  const violations: string[] = [];

  Object.entries(PERFORMANCE_BUDGETS).forEach(([metric, budget]) => {
    const value = metrics[metric as keyof WebVitals];
    if (value !== undefined && value > budget) {
      violations.push(`${metric}: ${value}ms (budget: ${budget}ms)`);
      
      // Log performance issue to error tracking system
      logPerformanceIssue(
        metric,
        value,
        budget,
        {
          component: 'performance-monitor',
          action: 'budget-check',
          metadata: { metric, value, budget }
        }
      );
    }
  });

  return {
    passed: violations.length === 0,
    violations,
  };
}
