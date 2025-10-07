import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logger, logError, logWarn, logInfo, logDebug, logPerformance, logSecurity } from '../logger';

// Mock console methods
const mockConsole = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  log: vi.fn(),
};

Object.defineProperty(console, 'debug', { value: mockConsole.debug });
Object.defineProperty(console, 'info', { value: mockConsole.info });
Object.defineProperty(console, 'warn', { value: mockConsole.warn });
Object.defineProperty(console, 'error', { value: mockConsole.error });
Object.defineProperty(console, 'log', { value: mockConsole.log });

describe('Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset NODE_ENV to test
    vi.stubEnv('NODE_ENV', 'test');
  });

  describe('in development mode', () => {
    beforeEach(() => {
      vi.stubEnv('NODE_ENV', 'development');
    });

    it('logs debug messages in development', () => {
      logger.debug('Debug message', { component: 'Test' });
      expect(mockConsole.debug).toHaveBeenCalledWith(
        expect.stringContaining('DEBUG')
      );
    });

    it('logs info messages in development', () => {
      logger.info('Info message', { component: 'Test' });
      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringContaining('INFO')
      );
    });

    it('logs warn messages in development', () => {
      logger.warn('Warning message', { component: 'Test' });
      expect(mockConsole.warn).toHaveBeenCalledWith(
        expect.stringContaining('WARN')
      );
    });

    it('logs error messages in development', () => {
      logger.error('Error message', { component: 'Test' });
      expect(mockConsole.error).toHaveBeenCalledWith(
        expect.stringContaining('ERROR')
      );
    });
  });

  describe('in production mode', () => {
    beforeEach(() => {
      vi.stubEnv('NODE_ENV', 'production');
    });

    it('does not log debug messages in production', () => {
      logger.debug('Debug message', { component: 'Test' });
      expect(mockConsole.debug).not.toHaveBeenCalled();
    });

    it('does not log info messages in production', () => {
      logger.info('Info message', { component: 'Test' });
      expect(mockConsole.info).not.toHaveBeenCalled();
    });

    it('logs warn messages in production', () => {
      logger.warn('Warning message', { component: 'Test' });
      expect(mockConsole.warn).toHaveBeenCalled();
    });

    it('logs error messages in production', () => {
      logger.error('Error message', { component: 'Test' });
      expect(mockConsole.error).toHaveBeenCalled();
    });
  });

  describe('convenience functions', () => {
    it('logError calls logger.error', () => {
      logError('Test error', { component: 'Test' });
      expect(mockConsole.error).toHaveBeenCalled();
    });

    it('logWarn calls logger.warn', () => {
      logWarn('Test warning', { component: 'Test' });
      expect(mockConsole.warn).toHaveBeenCalled();
    });

    it('logInfo calls logger.info', () => {
      logInfo('Test info', { component: 'Test' });
      expect(mockConsole.info).toHaveBeenCalled();
    });

    it('logDebug calls logger.debug', () => {
      logDebug('Test debug', { component: 'Test' });
      expect(mockConsole.debug).toHaveBeenCalled();
    });

    it('logPerformance calls logger.performance', () => {
      logPerformance('LCP', 1200, { component: 'Test' });
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('[PERF] LCP: 1200ms')
      );
    });

    it('logSecurity calls logger.security', () => {
      logSecurity('Security event', { component: 'Test' });
      expect(mockConsole.warn).toHaveBeenCalledWith(
        expect.stringContaining('SECURITY: Security event')
      );
    });
  });

  describe('message formatting', () => {
    it('includes timestamp in messages', () => {
      logger.info('Test message');
      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/)
      );
    });

    it('includes component context when provided', () => {
      logger.info('Test message', { component: 'TestComponent' });
      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringContaining('[TestComponent]')
      );
    });

    it('includes action context when provided', () => {
      logger.info('Test message', { component: 'TestComponent', action: 'testAction' });
      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringContaining('[TestComponent]')
      );
    });
  });
});
