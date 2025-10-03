/**
 * Enterprise Error Tracking System
 * Provides centralized error logging and tracking for production monitoring
 */

import type { ErrorInfo } from 'react';

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
  timestamp?: number;
  component?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

export interface ErrorReport {
  message: string;
  stack?: string;
  context: ErrorContext;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'javascript' | 'network' | 'validation' | 'api' | 'performance';
}

class ErrorTracker {
  private isProduction: boolean;
  private errorQueue: ErrorReport[] = [];
  private maxQueueSize = 50;

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
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
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      },
      severity,
      category,
    };

    // Add to queue
    this.errorQueue.push(errorReport);
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift(); // Remove oldest error
    }

    // Log to console in development
    if (!this.isProduction) {
      console.error('Error tracked:', errorReport);
    }

    // In production, send to error tracking service
    if (this.isProduction) {
      this.sendToErrorService(errorReport);
    }
  }

  /**
   * Log a performance issue
   */
  logPerformanceIssue(
    metric: string,
    value: number,
    threshold: number,
    context: ErrorContext = {}
  ): void {
    this.logError(
      `Performance issue: ${metric} (${value}ms) exceeds threshold (${threshold}ms)`,
      context,
      'medium',
      'performance'
    );
  }

  /**
   * Log a network error
   */
  logNetworkError(
    url: string,
    status: number,
    message: string,
    context: ErrorContext = {}
  ): void {
    this.logError(
      `Network error: ${status} ${message} for ${url}`,
      { ...context, url },
      status >= 500 ? 'high' : 'medium',
      'network'
    );
  }

  /**
   * Log a validation error
   */
  logValidationError(
    field: string,
    value: unknown,
    rule: string,
    context: ErrorContext = {}
  ): void {
    this.logError(
      `Validation error: ${field} failed ${rule} (value: ${JSON.stringify(value)})`,
      { ...context, metadata: { field, value, rule } },
      'low',
      'validation'
    );
  }

  /**
   * Send error to external error tracking service
   * In a real implementation, this would send to Sentry, LogRocket, etc.
   */
  private async sendToErrorService(errorReport: ErrorReport): Promise<void> {
    try {
      // In a real implementation, you would send to your error tracking service
      // For now, we'll just log it (in production, you'd replace this with actual service calls)
      
      // Example for Sentry:
      // Sentry.captureException(new Error(errorReport.message), {
      //   tags: {
      //     category: errorReport.category,
      //     severity: errorReport.severity,
      //   },
      //   extra: errorReport.context,
      // });

      // Example for custom API:
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport),
      // });

      // For now, we'll just store in localStorage for debugging
      if (typeof window !== 'undefined') {
        const existingErrors = JSON.parse(
          localStorage.getItem('errorLogs') || '[]'
        );
        existingErrors.push(errorReport);
        localStorage.setItem('errorLogs', JSON.stringify(existingErrors.slice(-10))); // Keep last 10
      }
    } catch (sendError) {
      // Fallback: log to console if error service fails
      console.error('Failed to send error to tracking service:', sendError);
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
) => errorTracker.logPerformanceIssue(metric, value, threshold, context);

export const logNetworkError = (
  url: string,
  status: number,
  message: string,
  context?: ErrorContext
) => errorTracker.logNetworkError(url, status, message, context);

export const logValidationError = (
  field: string,
  value: unknown,
  rule: string,
  context?: ErrorContext
) => errorTracker.logValidationError(field, value, rule, context);

/**
 * Global error handler for unhandled errors
 */
export function setupGlobalErrorHandling(): void {
  if (typeof window === 'undefined') return;

  // Handle unhandled JavaScript errors
  window.addEventListener('error', (event) => {
    errorTracker.logError(
      event.error || event.message,
      {
        component: 'global',
        action: 'unhandled-error',
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      },
      'high'
    );
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    errorTracker.logError(
      event.reason,
      {
        component: 'global',
        action: 'unhandled-promise-rejection',
      },
      'high'
    );
  });
}

/**
 * React Error Boundary integration
 */
export function createErrorBoundaryHandler(componentName: string) {
  return (error: Error, errorInfo: ErrorInfo) => {
    errorTracker.logError(error, {
      component: componentName,
      action: 'error-boundary',
      metadata: {
        componentStack: errorInfo.componentStack,
      },
    }, 'high');
  };
}
