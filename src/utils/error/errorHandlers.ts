/**
 * Error Handler Functions
 * Specific error handling functions for different error types
 */

import type { ErrorInfo } from 'react';
import type { ErrorContext, ErrorReport } from './errorTypes';

/**
 * Log a performance issue
 */
export function logPerformanceIssue(
  metric: string,
  value: number,
  threshold: number,
  context: ErrorContext = {},
  logError: (error: Error | string, context?: ErrorContext, severity?: ErrorReport['severity']) => void
): void {
  logError(
    `Performance issue: ${metric} (${value}ms) exceeds threshold (${threshold}ms)`,
    context,
    'medium'
  );
}

/**
 * Log a network error
 */
export function logNetworkError(
  url: string,
  status: number,
  message: string,
  context: ErrorContext = {},
  logError: (error: Error | string, context?: ErrorContext, severity?: ErrorReport['severity']) => void
): void {
  logError(
    `Network error: ${status} ${message} for ${url}`,
    { ...context, url },
    status >= 500 ? 'high' : 'medium'
  );
}

/**
 * Log a validation error
 */
export function logValidationError(
  field: string,
  value: unknown,
  rule: string,
  context: ErrorContext = {},
  logError: (error: Error | string, context?: ErrorContext, severity?: ErrorReport['severity']) => void
): void {
  logError(
    `Validation error: ${field} failed ${rule} (value: ${JSON.stringify(value)})`,
    { ...context, metadata: { field, value, rule } },
    'low'
  );
}

/**
 * Global error handler for unhandled errors
 */
export function setupGlobalErrorHandling(
  logError: (error: Error | string, context?: ErrorContext, severity?: ErrorReport['severity']) => void
): void {
  if (typeof window === 'undefined') return;

  // Handle unhandled JavaScript errors
  window.addEventListener('error', (event: ErrorEvent) => {
    logError(
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
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    logError(
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
export function createErrorBoundaryHandler(
  componentName: string,
  logError: (error: Error | string, context?: ErrorContext, severity?: ErrorReport['severity']) => void
) {
  return (error: Error, errorInfo: ErrorInfo) => {
    logError(
      error,
      {
        component: componentName,
        action: 'error-boundary',
        metadata: {
          componentStack: errorInfo.componentStack,
        },
      },
      'high'
    );
  };
}

/**
 * Send error to external error tracking service
 * In a real implementation, this would send to Sentry, LogRocket, etc.
 */
export async function sendToErrorService(errorReport: ErrorReport): Promise<void> {
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
      localStorage.setItem(
        'errorLogs',
        JSON.stringify(existingErrors.slice(-10))
      ); // Keep last 10
    }
  } catch (sendError) {
    // Fallback: log to console if error service fails
    import('@/utils/logger').then(({ logError }) => {
      logError('Failed to send error to tracking service', {
        component: 'ErrorHandlers',
        action: 'sendToErrorService',
        metadata: { sendError }
      });
    });
  }
}
