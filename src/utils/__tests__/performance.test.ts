/**
 * Performance Utilities Tests - PLATINUM STANDARDS
 * 
 * Comprehensive unit tests for performance utilities
 * Following React 18 and TypeScript best practices
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce, throttle } from '../performanceEnhancements';

describe('Debounce Function', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should delay function execution', async () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should cancel previous calls when called multiple times', async () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    vi.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments correctly', async () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('arg1', 'arg2');
    vi.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should handle different delay times', async () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 200);

    debouncedFn();
    vi.advanceTimersByTime(100);
    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});

describe('Throttle Function', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should limit function execution frequency', async () => {
    const mockFn = vi.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(1);

    throttledFn();
    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should pass arguments correctly', async () => {
    const mockFn = vi.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn('arg1', 'arg2');
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should handle rapid successive calls', async () => {
    const mockFn = vi.fn();
    const throttledFn = throttle(mockFn, 100);

    // Call 10 times rapidly
    for (let i = 0; i < 10; i++) {
      throttledFn();
    }

    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should reset throttle after delay', async () => {
    const mockFn = vi.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});

describe('Performance Edge Cases', () => {
  it('should handle debounce with zero delay', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 0);

    debouncedFn();
    // With zero delay, setTimeout still executes asynchronously
    vi.advanceTimersByTime(0);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should handle throttle with zero delay', () => {
    const mockFn = vi.fn();
    const throttledFn = throttle(mockFn, 0);

    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(1);
    
    // With zero delay, throttle should allow immediate subsequent calls
    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should handle debounce with very large delay', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 10000);

    debouncedFn();
    expect(mockFn).not.toHaveBeenCalled();
  });

  it('should handle throttle with very large delay', () => {
    const mockFn = vi.fn();
    const throttledFn = throttle(mockFn, 10000);

    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(1);

    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
