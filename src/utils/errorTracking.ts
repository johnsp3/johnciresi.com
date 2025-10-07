/**
 * Enterprise Error Tracking System
 * Main entry point - re-exports from modular structure
 */

// Re-export everything from the modular error tracking system
export {
  errorTracker,
  logError,
  logPerformanceIssue,
  logNetworkError,
  logValidationError,
  setupGlobalErrorHandling,
  createErrorBoundaryHandler,
  ErrorTracker,
  type ErrorContext,
  type ErrorReport,
  type ErrorTrackerConfig,
} from './error/errorTracking';
