/**
 * Web Vitals Tracking Utility
 * Monitors Core Web Vitals for performance optimization
 */

import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

interface WebVitalsData {
  name: string;
  value: number;
  delta: number;
  id: string;
  navigationType: string;
}

function sendToAnalytics(metric: WebVitalsData) {
  // Send to Sentry for performance monitoring
  if (typeof window !== 'undefined' && window.Sentry) {
    window.Sentry.addBreadcrumb({
      category: 'web-vitals',
      message: `${metric.name}: ${metric.value}`,
      level: 'info',
    });
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    import('@/utils/logger').then(({ logPerformance }) => {
      logPerformance(metric.name, metric.value, { component: 'WebVitals' });
    });
  }
}

export function initWebVitals() {
  if (typeof window === 'undefined') return;

  onCLS(sendToAnalytics);
  onINP(sendToAnalytics); // INP replaces FID in newer web-vitals versions
  onFCP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}
