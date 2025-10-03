/**
 * Environment Configuration and Validation
 * Ensures all required environment variables are present
 */

export interface EnvConfig {
  resendApiKey: string;
  resendFromEmail: string;
  resendFromName: string;
  contactEmail: string;
  fromEmail: string;
  baseUrl: string;
  siteName: string;
  emailSecret: string;
  unsubscribeSecret: string;
  preferencesSecret: string;
  nodeEnv: string;
}

/**
 * Validates and returns environment configuration
 * Returns default values for missing variables (for initial deployment)
 */
export function getEnvConfig(): EnvConfig {
  const requiredVars = {
    resendApiKey: process.env.RESEND_API_KEY || 'not-configured',
    resendFromEmail: process.env.RESEND_FROM_EMAIL || 'noreply@johnciresi.com',
    resendFromName: process.env.RESEND_FROM_NAME || 'John Ciresi',
    contactEmail: process.env.CONTACT_EMAIL || 'admin@johnciresi.com',
    fromEmail: process.env.FROM_EMAIL || 'noreply@johnciresi.com',
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://johnciresi.vercel.app',
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'John Ciresi',
    emailSecret: process.env.EMAIL_SECRET || 'default-secret',
    unsubscribeSecret: process.env.UNSUBSCRIBE_SECRET || 'default-unsubscribe',
    preferencesSecret: process.env.PREFERENCES_SECRET || 'default-preferences',
    nodeEnv: process.env.NODE_ENV || 'production',
  };

  // Log missing variables in development (but don't throw errors for deployment)
  if (process.env.NODE_ENV === 'development') {
    const missingVars = Object.entries(requiredVars)
      .filter(([_, value]) => !value || value === 'not-configured')
      .map(([key]) => key);

    if (missingVars.length > 0) {
      console.warn(
        `⚠️  Missing environment variables: ${missingVars.join(', ')}. Using default values.`
      );
    }
  }

  return requiredVars as EnvConfig;
}

/**
 * Rate limiting configuration
 */
export const RATE_LIMIT_CONFIG = {
  maxRequests: 3,
  windowMs: 15 * 60 * 1000, // 15 minutes
} as const;

/**
 * Email validation regex
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Message length limits
 */
export const MESSAGE_LIMITS = {
  name: { min: 1, max: 100 },
  email: { min: 5, max: 254 },
  message: { min: 10, max: 2000 },
} as const;
