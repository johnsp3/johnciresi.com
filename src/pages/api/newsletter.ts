/**
 * Newsletter API Endpoint
 * Handles newsletter subscriptions with security and validation
 */

import type { APIRoute } from 'astro';
import { sendNewsletterWelcome } from '../../utils/emailService.js';
import { checkRateLimit, validateNewsletterForm, getClientIP } from '../../utils/security.js';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check if request is POST
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Method not allowed' 
      }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get client IP for rate limiting
    const clientIP = getClientIP(request);
    
    // Check rate limit
    const rateLimit = checkRateLimit(clientIP);
    if (!rateLimit.allowed) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
      }), {
        status: 429,
        headers: { 
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString()
        }
      });
    }

    // Parse form data
    const formData = await request.formData();
    const data = {
      email: formData.get('email') as string,
      website: formData.get('website') as string, // Honeypot field
    };

    // Validate and sanitize input
    const validation = validateNewsletterForm(data);
    if (!validation.valid) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Send welcome email
    await sendNewsletterWelcome(validation.sanitized!);

    // Return success response
    return new Response(JSON.stringify({
      success: true,
      message: 'Successfully subscribed! Check your email for a welcome message.',
      remaining: rateLimit.remaining
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error. Please try again later.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Handle preflight requests for CORS
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
};
