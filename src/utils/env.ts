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
 * Throws error if required variables are missing
 */
export function getEnvConfig(): EnvConfig {
  const requiredVars = {
    resendApiKey: process.env.RESEND_API_KEY,
    resendFromEmail: process.env.RESEND_FROM_EMAIL,
    resendFromName: process.env.RESEND_FROM_NAME,
    contactEmail: process.env.CONTACT_EMAIL,
    fromEmail: process.env.FROM_EMAIL,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: process.env.NEXT_PUBLIC_SITE_NAME,
    emailSecret: process.env.EMAIL_SECRET,
    unsubscribeSecret: process.env.UNSUBSCRIBE_SECRET,
    preferencesSecret: process.env.PREFERENCES_SECRET,
    nodeEnv: process.env.NODE_ENV,
  };

  // Check for missing required variables
  const missingVars = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
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
