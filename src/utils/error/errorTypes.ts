/**
 * Error Tracking Type Definitions
 * Centralized type definitions for the error tracking system
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

export interface ErrorTrackerConfig {
  isProduction: boolean;
  maxQueueSize: number;
  errorServiceEndpoint?: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  threshold: number;
  timestamp: number;
}

export interface NetworkError {
  url: string;
  status: number;
  message: string;
  timestamp: number;
}

export interface ValidationError {
  field: string;
  value: unknown;
  rule: string;
  timestamp: number;
}

export interface ErrorBoundaryInfo {
  componentName: string;
  error: Error;
  errorInfo: ErrorInfo;
}

export interface GlobalErrorEvent {
  type: 'error' | 'unhandledrejection';
  error: Error | string;
  filename?: string;
  lineno?: number;
  colno?: number;
  reason?: unknown;
}

export type ErrorSeverity = ErrorReport['severity'];
export type ErrorCategory = ErrorReport['category'];
