/**
 * Production-Safe Logging Utility
 * Replaces console statements with proper logging that respects environment
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  component?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

class Logger {
  private isProduction: boolean;
  private isDevelopment: boolean;

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private shouldLog(level: LogLevel): boolean {
    // In production, only log errors and warnings
    if (this.isProduction) {
      return level === 'error' || level === 'warn';
    }
    // In development, log everything
    return true;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` [${context.component || 'unknown'}]` : '';
    return `[${timestamp}] ${level.toUpperCase()}${contextStr}: ${message}`;
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message, context));
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, context));
    }
  }

  error(message: string, context?: LogContext): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, context));
    }
  }

  // Performance logging
  performance(metric: string, value: number | undefined, context?: LogContext): void {
    if (this.isDevelopment && value !== undefined) {
      console.log(`[PERF] ${metric}: ${value}ms`, context);
    }
  }

  // Security logging (always logged in production)
  security(message: string, context?: LogContext): void {
    const formattedMessage = this.formatMessage('warn', `SECURITY: ${message}`, context);
    console.warn(formattedMessage);
    
    // In production, also send to security monitoring
    if (this.isProduction && typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.addBreadcrumb({
        category: 'security',
        message,
        level: 'warning',
        data: context,
      });
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Convenience functions for common use cases
export const logError = (message: string, context?: LogContext) => logger.error(message, context);
export const logWarn = (message: string, context?: LogContext) => logger.warn(message, context);
export const logInfo = (message: string, context?: LogContext) => logger.info(message, context);
export const logDebug = (message: string, context?: LogContext) => logger.debug(message, context);
export const logPerformance = (metric: string, value: number | undefined, context?: LogContext) => 
  logger.performance(metric, value, context);
export const logSecurity = (message: string, context?: LogContext) => logger.security(message, context);
