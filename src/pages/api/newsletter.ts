/**
 * Newsletter Subscription API Endpoint
 * Handles newsletter subscriptions with enterprise-grade security and validation
 */

import type { APIRoute } from 'astro';
import { sendNewsletterWelcome, isEmailServiceConfigured } from '../../utils/emailService.js';
import { checkRateLimit, validateNewsletterForm, getClientIP } from '../../utils/security.js';
import { addSubscriber } from '../../utils/newsletterStorage.js';
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
    const validation = validateNewsletterForm(formData);

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

    // Add subscriber to storage
    let subscriber;
    try {
      subscriber = await addSubscriber(sanitized!.email, sanitized!.name);
    } catch (storageError) {
      if (storageError instanceof Error && storageError.message === 'Email is already subscribed') {
        const response = new Response(
          JSON.stringify({
            success: false,
            error: 'This email is already subscribed to our newsletter.',
          }),
          {
            status: 409,
            headers: { 'Content-Type': 'application/json' },
          }
        );
        return applySecurityHeaders(response, 'api');
      }

      logError(
        storageError instanceof Error ? storageError : new Error(String(storageError)),
        { 
          component: 'newsletter-api', 
          action: 'storage-error', 
          metadata: { 
            endpoint: '/api/newsletter',
            email: sanitized!.email
          } 
        },
        'high'
      );

      const response = new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to process subscription. Please try again later.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return applySecurityHeaders(response, 'api');
    }

    // Send welcome email
    try {
      await sendNewsletterWelcome({
        email: subscriber.email,
        name: subscriber.name,
      }, subscriber.unsubscribeToken);
    } catch (emailError) {
      logError(
        emailError instanceof Error ? emailError : new Error(String(emailError)),
        { 
          component: 'newsletter-api', 
          action: 'email-sending', 
          metadata: { 
            endpoint: '/api/newsletter',
            email: subscriber.email,
            subscriberId: subscriber.id
          } 
        },
        'high'
      );

      // Note: We don't fail the request here because the subscription was successful
      // The user is subscribed even if the welcome email fails
    }

    // Success response
    const response = new Response(
      JSON.stringify({
        success: true,
        message: 'Successfully subscribed! Check your email for a welcome message.',
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
        component: 'newsletter-api', 
        action: 'subscription', 
        metadata: { endpoint: '/api/newsletter' } 
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