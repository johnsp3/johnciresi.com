/**
 * Security Headers Configuration
 * Enterprise-grade security headers for production deployment
 */

export interface SecurityHeaders {
  [key: string]: string | string[];
}

/**
 * Get comprehensive security headers for production
 */
export function getSecurityHeaders(): SecurityHeaders {
  return {
    // Content Security Policy - Prevents XSS attacks
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://vercel.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "media-src 'self' data: https: blob:",
      "connect-src 'self' https://api.resend.com https://vercel.live",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      'upgrade-insecure-requests',
    ].join('; '),

    // X-Frame-Options - Prevents clickjacking
    'X-Frame-Options': 'DENY',

    // X-Content-Type-Options - Prevents MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

    // X-XSS-Protection - Legacy XSS protection
    'X-XSS-Protection': '1; mode=block',

    // Referrer Policy - Controls referrer information
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // Permissions Policy - Controls browser features
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'interest-cohort=()',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()',
    ].join(', '),

    // Strict-Transport-Security - Forces HTTPS
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

    // Cross-Origin Embedder Policy
    'Cross-Origin-Embedder-Policy': 'require-corp',

    // Cross-Origin Opener Policy
    'Cross-Origin-Opener-Policy': 'same-origin',

    // Cross-Origin Resource Policy
    'Cross-Origin-Resource-Policy': 'same-origin',

    // Cache Control for sensitive pages
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  };
}

/**
 * Get security headers for API endpoints
 */
export function getAPISecurityHeaders(): SecurityHeaders {
  return {
    ...getSecurityHeaders(),

    // Additional API-specific headers
    'Access-Control-Allow-Origin': 'https://johnciresi.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',

    // API-specific CSP
    'Content-Security-Policy': [
      "default-src 'none'",
      "script-src 'none'",
      "style-src 'none'",
      "img-src 'none'",
      "connect-src 'self' https://api.resend.com",
      "frame-ancestors 'none'",
      "base-uri 'none'",
      "form-action 'none'",
      "object-src 'none'",
    ].join('; '),
  };
}

/**
 * Get security headers for static assets
 */
export function getStaticAssetSecurityHeaders(): SecurityHeaders {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Cache-Control': 'public, max-age=31536000, immutable',
  };
}

/**
 * Apply security headers to a Response
 */
export function applySecurityHeaders(
  response: Response,
  type: 'page' | 'api' | 'static' = 'page'
): Response {
  const headers = new Headers(response.headers);
  const securityHeaders =
    type === 'api'
      ? getAPISecurityHeaders()
      : type === 'static'
        ? getStaticAssetSecurityHeaders()
        : getSecurityHeaders();

  Object.entries(securityHeaders).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      headers.set(key, value.join(', '));
    } else {
      headers.set(key, value);
    }
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * Validate request origin for CSRF protection
 */
export function validateOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  const allowedOrigins = [
    'https://johnciresi.com',
    'https://www.johnciresi.com',
    'http://localhost:3000', // For development
    'http://localhost:4321', // For Astro dev server
  ];

  if (origin) {
    return allowedOrigins.includes(origin);
  }

  if (referer) {
    try {
      const refererUrl = new URL(referer);
      return allowedOrigins.some(allowed => {
        try {
          const allowedUrl = new URL(allowed);
          return refererUrl.origin === allowedUrl.origin;
        } catch {
          return false;
        }
      });
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(
  token: string,
  sessionToken: string
): boolean {
  if (!token || !sessionToken) return false;
  return token === sessionToken;
}
