/**
 * Security Utilities
 * Handles rate limiting, validation, and spam protection
 */

import { RATE_LIMIT_CONFIG, EMAIL_REGEX, MESSAGE_LIMITS } from './env.js';

// In-memory rate limiting store (for production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limiting implementation
 */
export function checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = `rate_limit_${identifier}`;
  
  const current = rateLimitStore.get(key);
  
  if (!current || now > current.resetTime) {
    // Reset or create new entry
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs,
    });
    
    return {
      allowed: true,
      remaining: RATE_LIMIT_CONFIG.maxRequests - 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs,
    };
  }
  
  if (current.count >= RATE_LIMIT_CONFIG.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: current.resetTime,
    };
  }
  
  // Increment count
  current.count++;
  rateLimitStore.set(key, current);
  
  return {
    allowed: true,
    remaining: RATE_LIMIT_CONFIG.maxRequests - current.count,
    resetTime: current.resetTime,
  };
}

/**
 * Input validation and sanitization
 */
export function validateContactForm(data: any): { valid: boolean; errors: string[]; sanitized?: any } {
  const errors: string[] = [];
  
  // Check required fields
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Name is required');
  }
  
  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
  }
  
  if (!data.message || typeof data.message !== 'string') {
    errors.push('Message is required');
  }
  
  // Check honeypot field (should be empty)
  if (data.website && data.website.trim() !== '') {
    errors.push('Spam detected');
  }
  
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  // Sanitize and validate
  const sanitized = {
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    message: data.message.trim(),
  };
  
  // Validate name
  if (sanitized.name.length < MESSAGE_LIMITS.name.min || sanitized.name.length > MESSAGE_LIMITS.name.max) {
    errors.push(`Name must be between ${MESSAGE_LIMITS.name.min} and ${MESSAGE_LIMITS.name.max} characters`);
  }
  
  // Validate email
  if (!EMAIL_REGEX.test(sanitized.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (sanitized.email.length < MESSAGE_LIMITS.email.min || sanitized.email.length > MESSAGE_LIMITS.email.max) {
    errors.push(`Email must be between ${MESSAGE_LIMITS.email.min} and ${MESSAGE_LIMITS.email.max} characters`);
  }
  
  // Validate message
  if (sanitized.message.length < MESSAGE_LIMITS.message.min || sanitized.message.length > MESSAGE_LIMITS.message.max) {
    errors.push(`Message must be between ${MESSAGE_LIMITS.message.min} and ${MESSAGE_LIMITS.message.max} characters`);
  }
  
  // Check for suspicious content
  const suspiciousPatterns = [
    /http[s]?:\/\/[^\s]+/gi, // URLs
    /[A-Z]{5,}/g, // Excessive caps
    /(.)\1{4,}/g, // Repeated characters
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(sanitized.message)) {
      errors.push('Message contains suspicious content');
      break;
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    sanitized: errors.length === 0 ? sanitized : undefined,
  };
}

/**
 * Newsletter validation
 */
export function validateNewsletterForm(data: any): { valid: boolean; errors: string[]; sanitized?: any } {
  const errors: string[] = [];
  
  // Check required fields
  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
  }
  
  // Check honeypot field
  if (data.website && data.website.trim() !== '') {
    errors.push('Spam detected');
  }
  
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  // Sanitize and validate
  const sanitized = {
    email: data.email.trim().toLowerCase(),
  };
  
  // Validate email
  if (!EMAIL_REGEX.test(sanitized.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (sanitized.email.length < MESSAGE_LIMITS.email.min || sanitized.email.length > MESSAGE_LIMITS.email.max) {
    errors.push(`Email must be between ${MESSAGE_LIMITS.email.min} and ${MESSAGE_LIMITS.email.max} characters`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    sanitized: errors.length === 0 ? sanitized : undefined,
  };
}

/**
 * Get client IP address for rate limiting
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  return 'unknown';
}
