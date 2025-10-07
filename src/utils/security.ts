/**
 * Enhanced Security Utilities
 * Additional security measures beyond existing validation
 */

import crypto from 'crypto';

// CSRF Token Generation
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Request Signing for API endpoints
export function signRequest(data: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('hex');
}

// Verify request signature
export function verifyRequestSignature(
  data: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = signRequest(data, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

// Content Security Policy monitoring
export function validateCSPViolation(violation: unknown): boolean {
  // Log CSP violations for monitoring
  if (process.env.NODE_ENV === 'development') {
    import('@/utils/logger').then(({ logSecurity }) => {
      logSecurity('CSP Violation detected', {
        component: 'Security',
        action: 'validateCSPViolation',
        metadata: { violation }
      });
    });
  }
  
  // Send to Sentry for monitoring
  if (typeof window !== 'undefined' && window.Sentry) {
    window.Sentry.addBreadcrumb({
      category: 'security',
      message: 'CSP Violation detected',
      level: 'warning',
      data: violation,
    });
  }
  
  return true;
}

// Rate limiting enhancement
export function getEnhancedRateLimit(_ip: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  reason?: string;
} {
  // Enhanced rate limiting with different limits for different actions
  const limits = {
    contact: { max: 3, window: 15 * 60 * 1000 }, // 3 contact forms per 15 minutes
    newsletter: { max: 5, window: 15 * 60 * 1000 }, // 5 newsletter signups per 15 minutes
    general: { max: 10, window: 15 * 60 * 1000 }, // 10 general requests per 15 minutes
  };
  
  // For now, use general limits
  const limit = limits.general;
  const now = Date.now();
  
  // This would integrate with your existing rate limiting
  // For now, return a basic response
  return {
    allowed: true,
    remaining: limit.max,
    resetTime: now + limit.window,
  };
}

// Input sanitization enhancement
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 2000); // Limit length
}

// Security headers validation
export function validateSecurityHeaders(headers: Record<string, string>): {
  valid: boolean;
  missing: string[];
  recommendations: string[];
} {
  const requiredHeaders = [
    'X-Content-Type-Options',
    'X-Frame-Options',
    'X-XSS-Protection',
    'Referrer-Policy',
  ];
  
  const recommendedHeaders = [
    'Content-Security-Policy',
    'Strict-Transport-Security',
    'Permissions-Policy',
  ];
  
  const missing = requiredHeaders.filter(header => !headers[header]);
  const recommendations = recommendedHeaders.filter(header => !headers[header]);
  
  return {
    valid: missing.length === 0,
    missing,
    recommendations,
  };
}