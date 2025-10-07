/**
 * Enterprise Error Tracking System
 * Main error tracking class and convenience functions
 */

import type { ErrorContext, ErrorReport, ErrorTrackerConfig } from './errorTypes';
import { 
  sendToErrorService,
  logPerformanceIssue as logPerf,
  logNetworkError as logNet,
  logValidationError as logVal,
  setupGlobalErrorHandling as setupGlobal,
  createErrorBoundaryHandler as createBoundary
} from './errorHandlers';

class ErrorTracker {
  private config: ErrorTrackerConfig;
  private errorQueue: ErrorReport[] = [];

  constructor(config?: Partial<ErrorTrackerConfig>) {
    this.config = {
      isProduction: process.env.NODE_ENV === 'production',
      maxQueueSize: 50,
      ...config,
    };
  }

  /**
   * Log an error with context and severity
   */
  logError(
    error: Error | string,
    context: ErrorContext = {},
    severity: ErrorReport['severity'] = 'medium',
    category: ErrorReport['category'] = 'javascript'
  ): void {
    const errorReport: ErrorReport = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' && error.stack ? error.stack : undefined,
      context: {
        ...context,
        timestamp: Date.now(),
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent:
          typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      },
      severity,
      category,
    };

    // Add to queue
    this.errorQueue.push(errorReport);
    if (this.errorQueue.length > this.config.maxQueueSize) {
      this.errorQueue.shift(); // Remove oldest error
    }

    // Log to console in development
    if (!this.config.isProduction) {
      // Use proper logging utility instead of direct console
      import('@/utils/logger').then(({ logError }) => {
        logError('Error tracked', { 
          component: 'ErrorTracker',
          action: 'logError',
          metadata: { errorReport }
        });
      });
    }

    // In production, send to error tracking service
    if (this.config.isProduction) {
      sendToErrorService(errorReport);
    }
  }

  /**
   * Get recent errors for debugging
   */
  getRecentErrors(): ErrorReport[] {
    return [...this.errorQueue];
  }

  /**
   * Clear error queue
   */
  clearErrors(): void {
    this.errorQueue = [];
  }

  /**
   * Get configuration
   */
  getConfig(): ErrorTrackerConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<ErrorTrackerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Create singleton instance
export const errorTracker = new ErrorTracker();

/**
 * Convenience functions for common error scenarios
 */
export const logError = (
  error: Error | string,
  context?: ErrorContext,
  severity?: ErrorReport['severity']
) => errorTracker.logError(error, context, severity);

export const logPerformanceIssue = (
  metric: string,
  value: number,
  threshold: number,
  context?: ErrorContext
) => {
  logPerf(metric, value, threshold, context, logError);
};

export const logNetworkError = (
  url: string,
  status: number,
  message: string,
  context?: ErrorContext
) => {
  logNet(url, status, message, context, logError);
};

export const logValidationError = (
  field: string,
  value: unknown,
  rule: string,
  context?: ErrorContext
) => {
  logVal(field, value, rule, context, logError);
};

/**
 * Global error handler setup
 */
export function setupGlobalErrorHandling(): void {
  setupGlobal(logError);
}

/**
 * React Error Boundary integration
 */
export function createErrorBoundaryHandler(componentName: string) {
  return createBoundary(componentName, logError);
}

// Export types and main class
export type { ErrorContext, ErrorReport, ErrorTrackerConfig } from './errorTypes';
export { ErrorTracker };
