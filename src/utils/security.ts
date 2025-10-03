/**
 * Security Utilities
 * Simplified security for musician website
 */

import { EMAIL_REGEX, MESSAGE_LIMITS } from './env.js';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  website?: string;
}

interface NewsletterData {
  email: string;
  website?: string;
}

// In-memory rate limiting store (for production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limiting implementation
 */
export function checkRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const key = `rate_limit_${identifier}`;

  const current = rateLimitStore.get(key);

  if (!current || now > current.resetTime) {
    // Reset or create new entry
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + 15 * 60 * 1000, // 15 minutes
    });

    return {
      allowed: true,
      remaining: 4, // 5 requests max
      resetTime: now + 15 * 60 * 1000,
    };
  }

  if (current.count >= 5) {
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
    remaining: 5 - current.count,
    resetTime: current.resetTime,
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

/**
 * Input validation and sanitization
 */
export function validateContactForm(data: unknown): {
  valid: boolean;
  errors: string[];
  sanitized?: ContactFormData;
} {
  const errors: string[] = [];

  // Type guard to ensure data is an object
  if (!data || typeof data !== 'object') {
    errors.push('Invalid form data');
    return { valid: false, errors };
  }

  const formData = data as Record<string, unknown>;

  // Check required fields
  if (!formData.name || typeof formData.name !== 'string') {
    errors.push('Name is required');
  }

  if (!formData.email || typeof formData.email !== 'string') {
    errors.push('Email is required');
  }

  if (!formData.message || typeof formData.message !== 'string') {
    errors.push('Message is required');
  }

  // Check honeypot field (should be empty)
  if (
    formData.website &&
    typeof formData.website === 'string' &&
    formData.website.trim() !== ''
  ) {
    errors.push('Spam detected');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Sanitize and validate
  const sanitized: ContactFormData = {
    name: (formData.name as string).trim(),
    email: (formData.email as string).trim().toLowerCase(),
    message: (formData.message as string).trim(),
  };

  // Validate name
  if (
    sanitized.name.length < MESSAGE_LIMITS.name.min ||
    sanitized.name.length > MESSAGE_LIMITS.name.max
  ) {
    errors.push(
      `Name must be between ${MESSAGE_LIMITS.name.min} and ${MESSAGE_LIMITS.name.max} characters`
    );
  }

  // Validate email
  if (!EMAIL_REGEX.test(sanitized.email)) {
    errors.push('Please enter a valid email address');
  }

  if (
    sanitized.email.length < MESSAGE_LIMITS.email.min ||
    sanitized.email.length > MESSAGE_LIMITS.email.max
  ) {
    errors.push(
      `Email must be between ${MESSAGE_LIMITS.email.min} and ${MESSAGE_LIMITS.email.max} characters`
    );
  }

  // Validate message
  if (
    sanitized.message.length < MESSAGE_LIMITS.message.min ||
    sanitized.message.length > MESSAGE_LIMITS.message.max
  ) {
    errors.push(
      `Message must be between ${MESSAGE_LIMITS.message.min} and ${MESSAGE_LIMITS.message.max} characters`
    );
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
export function validateNewsletterForm(data: unknown): {
  valid: boolean;
  errors: string[];
  sanitized?: NewsletterData;
} {
  const errors: string[] = [];

  // Type guard to ensure data is an object
  if (!data || typeof data !== 'object') {
    errors.push('Invalid form data');
    return { valid: false, errors };
  }

  const formData = data as Record<string, unknown>;

  // Check required fields
  if (!formData.email || typeof formData.email !== 'string') {
    errors.push('Email is required');
  }

  // Check honeypot field
  if (
    formData.website &&
    typeof formData.website === 'string' &&
    formData.website.trim() !== ''
  ) {
    errors.push('Spam detected');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Sanitize and validate
  const sanitized: NewsletterData = {
    email: (formData.email as string).trim().toLowerCase(),
  };

  // Validate email
  if (!EMAIL_REGEX.test(sanitized.email)) {
    errors.push('Please enter a valid email address');
  }

  if (
    sanitized.email.length < MESSAGE_LIMITS.email.min ||
    sanitized.email.length > MESSAGE_LIMITS.email.max
  ) {
    errors.push(
      `Email must be between ${MESSAGE_LIMITS.email.min} and ${MESSAGE_LIMITS.email.max} characters`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized: errors.length === 0 ? sanitized : undefined,
  };
}
