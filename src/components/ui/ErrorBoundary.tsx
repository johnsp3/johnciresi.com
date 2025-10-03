import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { createErrorBoundaryHandler } from '@/utils/errorTracking';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Use enterprise error tracking system
    const errorHandler = createErrorBoundaryHandler('ErrorBoundary');
    errorHandler(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center rounded-xl border border-error-200 bg-error-50 p-8 dark:border-error-800 dark:bg-error-950">
            <div className="text-center">
              <div className="mb-2 text-lg font-medium text-error-600 dark:text-error-400">
                Something went wrong
              </div>
              <div className="text-sm text-error-500 dark:text-error-500">
                Please refresh the page to try again
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
