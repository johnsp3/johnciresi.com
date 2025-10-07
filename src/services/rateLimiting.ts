/**
 * Distributed Rate Limiting Service using Vercel KV
 * Enterprise-grade rate limiting that works across serverless functions
 */

import { kv } from '@vercel/kv';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60; // 15 minutes in seconds
const RATE_LIMIT_MAX_REQUESTS = 5;

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  reason?: string;
}

/**
 * Check rate limit for an IP address using Vercel KV
 * 
 * This function implements distributed rate limiting using Vercel KV storage.
 * It tracks requests per IP address and action type within a sliding window.
 * 
 * @param ip - The IP address to check
 * @param action - The action being rate limited (e.g., 'contact', 'newsletter', 'general')
 * @returns Promise<RateLimitResult> - Object containing allowed status, remaining requests, reset time, and optional reason
 * 
 * @example
 * ```typescript
 * const result = await checkRateLimit('192.168.1.1', 'contact');
 * if (!result.allowed) {
 *   return new Response('Rate limit exceeded', { status: 429 });
 * }
 * ```
 */
export async function checkRateLimit(
  ip: string, 
  action: string = 'general'
): Promise<RateLimitResult> {
  try {
    const key = `rate_limit:${action}:${ip}`;
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - RATE_LIMIT_WINDOW;

    // Get current requests for this IP and action
    const requests = await kv.lrange(key, 0, -1) as number[];
    
    // Filter out old requests (outside the window)
    const validRequests = requests.filter(timestamp => timestamp > windowStart);
    
    // Check if limit exceeded
    if (validRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: validRequests[0] + RATE_LIMIT_WINDOW,
        reason: `Rate limit exceeded for ${action}. Try again in ${Math.ceil((validRequests[0] + RATE_LIMIT_WINDOW - now) / 60)} minutes.`
      };
    }

    // Add current request
    await kv.lpush(key, now);
    
    // Set expiration for the key (cleanup)
    await kv.expire(key, RATE_LIMIT_WINDOW);

    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX_REQUESTS - validRequests.length - 1,
      resetTime: now + RATE_LIMIT_WINDOW
    };

  } catch (error) {
    // Fallback: allow request if KV is unavailable
    import('@/utils/logger').then(({ logError }) => {
      logError('Rate limiting error', { 
        component: 'RateLimiting',
        action: 'checkRateLimit',
        metadata: { error: error instanceof Error ? error.message : String(error) }
      });
    });
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX_REQUESTS,
      resetTime: Math.floor(Date.now() / 1000) + RATE_LIMIT_WINDOW,
      reason: 'Rate limiting temporarily unavailable'
    };
  }
}

/**
 * Get rate limit status for an IP without incrementing the counter
 * 
 * This function checks the current rate limit status without adding a new request.
 * Useful for checking if a request would be allowed before processing.
 * 
 * @param ip - The IP address to check
 * @param action - The action to check (e.g., 'contact', 'newsletter', 'general')
 * @returns Promise<RateLimitResult> - Current rate limit status
 * 
 * @example
 * ```typescript
 * const status = await getRateLimitStatus('192.168.1.1', 'contact');
 * console.log(`Remaining requests: ${status.remaining}`);
 * ```
 */
export async function getRateLimitStatus(
  ip: string, 
  action: string = 'general'
): Promise<RateLimitResult> {
  try {
    const key = `rate_limit:${action}:${ip}`;
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - RATE_LIMIT_WINDOW;

    const requests = await kv.lrange(key, 0, -1) as number[];
    const validRequests = requests.filter(timestamp => timestamp > windowStart);
    
    return {
      allowed: validRequests.length < RATE_LIMIT_MAX_REQUESTS,
      remaining: Math.max(0, RATE_LIMIT_MAX_REQUESTS - validRequests.length),
      resetTime: validRequests.length > 0 ? validRequests[0] + RATE_LIMIT_WINDOW : now + RATE_LIMIT_WINDOW
    };

  } catch (error) {
    import('@/utils/logger').then(({ logError }) => {
      logError('Rate limit status error', { 
        component: 'RateLimiting',
        action: 'getRateLimitStatus',
        metadata: { error: error instanceof Error ? error.message : String(error) }
      });
    });
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX_REQUESTS,
      resetTime: Math.floor(Date.now() / 1000) + RATE_LIMIT_WINDOW
    };
  }
}

/**
 * Clear rate limit for an IP address (admin function)
 * 
 * This function removes all rate limit data for a specific IP and action.
 * Should only be used by administrators to reset rate limits.
 * 
 * @param ip - The IP address to clear
 * @param action - The action to clear (e.g., 'contact', 'newsletter', 'general')
 * @returns Promise<void>
 * 
 * @example
 * ```typescript
 * // Clear rate limit for a specific IP and action
 * await clearRateLimit('192.168.1.1', 'contact');
 * 
 * // Clear all rate limits for an IP
 * await clearRateLimit('192.168.1.1', 'general');
 * ```
 */
export async function clearRateLimit(ip: string, action: string = 'general'): Promise<void> {
  try {
    const key = `rate_limit:${action}:${ip}`;
    await kv.del(key);
  } catch (error) {
    import('@/utils/logger').then(({ logError }) => {
      logError('Clear rate limit error', { 
        component: 'RateLimiting',
        action: 'clearRateLimit',
        metadata: { error: error instanceof Error ? error.message : String(error) }
      });
    });
  }
}
