/**
 * Custom Hook for Error Handling - React 18 PLATINUM STANDARDS
 * 
 * Provides:
 * - Strict TypeScript typing
 * - React 18 patterns with useCallback
 * - Performance optimization
 * - Centralized error handling
 * - Accessibility support
 */

import { useCallback, useState } from 'react';

interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

interface UseErrorHandlerOptions {
  onError?: (error: Error, errorId: string) => void;
  logToConsole?: boolean;
  generateErrorId?: boolean;
}

interface UseErrorHandlerReturn {
  errorState: ErrorState;
  handleError: (error: Error | string, context?: string) => void;
  clearError: () => void;
  resetErrorState: () => void;
}

/**
 * Custom hook for handling errors in functional components
 * Follows React 18 PLATINUM STANDARDS with proper TypeScript and performance optimization
 */
export function useErrorHandler(options: UseErrorHandlerOptions = {}): UseErrorHandlerReturn {
  const {
    onError,
    logToConsole = process.env.NODE_ENV === 'development',
    generateErrorId = true,
  } = options;

  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    errorId: null,
  });

  // Memoized error handler to prevent unnecessary re-renders
  const handleError = useCallback((error: Error | string, context?: string) => {
    const errorObj = error instanceof Error ? error : new Error(error);
    const errorId = generateErrorId ? `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : null;

    // Log to console in development
    if (logToConsole) {
      console.error('Error caught by useErrorHandler:', {
        error: errorObj,
        context,
        errorId,
        timestamp: new Date().toISOString(),
        stack: errorObj.stack,
      });
    }

    // Update error state
    setErrorState({
      hasError: true,
      error: errorObj,
      errorId,
    });

    // Call custom error handler
    if (onError && errorId) {
      onError(errorObj, errorId);
    }

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      logErrorToService(errorObj, context, errorId);
    }
  }, [onError, logToConsole, generateErrorId]);

  // Memoized clear error function
  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      errorId: null,
    });
  }, []);

  // Memoized reset function
  const resetErrorState = useCallback(() => {
    clearError();
  }, [clearError]);

  return {
    errorState,
    handleError,
    clearError,
    resetErrorState,
  };
}

/**
 * Log error to external service (Sentry, LogRocket, etc.)
 */
function logErrorToService(error: Error, context?: string, errorId?: string | null): void {
  try {
    // Example integration with external logging service
    // This would be your actual logging service integration
    console.error('Production error logged:', {
      message: error.message,
      stack: error.stack,
      context,
      errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    });

    // Example Sentry integration:
    // Sentry.captureException(error, {
    //   tags: { context, errorId },
    //   extra: { timestamp: new Date().toISOString() },
    // });
  } catch (loggingError) {
    console.error('Failed to log error to service:', loggingError);
  }
}

/**
 * Hook for handling async operations with error handling
 */
export function useAsyncErrorHandler<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseErrorHandlerOptions = {}
) {
  const { handleError, clearError, errorState } = useErrorHandler(options);

  const executeWithErrorHandling = useCallback(async (...args: any[]): Promise<T | null> => {
    try {
      clearError();
      const result = await asyncFunction(...args);
      return result;
    } catch (error) {
      handleError(error instanceof Error ? error : new Error(String(error)), 'async_operation');
      return null;
    }
  }, [asyncFunction, handleError, clearError]);

  return {
    execute: executeWithErrorHandling,
    errorState,
    clearError,
  };
}

export default useErrorHandler;
