/**
 * Contact Form API Endpoint
 * Handles contact form submissions with enterprise-grade security and validation
 */

import { config } from 'dotenv';
import type { APIRoute } from 'astro';

// Load environment variables
config();
import { sendContactConfirmation, sendContactNotification, isEmailServiceConfigured } from '../../utils/emailService.js';
import { checkRateLimit, validateContactForm, getClientIP } from '../../utils/security.js';
import { logError } from '../../utils/errorTracking.js';
import { applySecurityHeaders, validateOrigin } from '../../utils/securityHeaders.js';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check if request is POST
    if (request.method !== 'POST') {
      const response = new Response(
        JSON.stringify({
          success: false,
          error: 'Method not allowed',
        }),
        {
          status: 405,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return applySecurityHeaders(response, 'api');
    }

    // Validate origin
    if (!validateOrigin(request)) {
      const response = new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid origin',
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return applySecurityHeaders(response, 'api');
    }

    // Rate limiting
    const clientIP = getClientIP(request);
    if (!(await checkRateLimit(clientIP))) {
      const response = new Response(
        JSON.stringify({
          success: false,
          error: 'Too many requests. Please try again later.',
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return applySecurityHeaders(response, 'api');
    }

    // Parse and validate form data
    const formData = await request.json();
    const validation = validateContactForm(formData);

    if (!validation.valid) {
      const response = new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid form data',
          details: validation.errors,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return applySecurityHeaders(response, 'api');
    }

    const { sanitized } = validation;

    // Check if email service is configured
    if (!isEmailServiceConfigured()) {
      const response = new Response(
        JSON.stringify({
          success: false,
          error: 'Email service not configured. Please try again later.',
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return applySecurityHeaders(response, 'api');
    }

    // Send emails
    try {
      // Send confirmation to user
      await sendContactConfirmation(sanitized!);
      
      // Send notification to admin
      await sendContactNotification(sanitized!);
    } catch (emailError) {
      logError(
        emailError instanceof Error ? emailError : new Error(String(emailError)),
        { 
          component: 'contact-api', 
          action: 'email-sending', 
          metadata: { 
            endpoint: '/api/contact',
            email: sanitized!.email,
            name: sanitized!.name
          } 
        },
        'high'
      );

      const response = new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to send email. Please try again later.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return applySecurityHeaders(response, 'api');
    }

    // Success response
    const response = new Response(
      JSON.stringify({
        success: true,
        message: 'Message sent successfully! You will receive a confirmation email shortly.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return applySecurityHeaders(response, 'api');

  } catch (error) {
    logError(
      error instanceof Error ? error : new Error(String(error)),
      { 
        component: 'contact-api', 
        action: 'form-submission', 
        metadata: { endpoint: '/api/contact' } 
      },
      'high'
    );

    const response = new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error. Please try again later.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return applySecurityHeaders(response, 'api');
  }
};

export const OPTIONS: APIRoute = async () => {
  const response = new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.SITE_URL || 'https://johnciresi.com',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
  return applySecurityHeaders(response, 'api');
};