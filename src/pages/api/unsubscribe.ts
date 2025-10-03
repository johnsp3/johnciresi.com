/**
 * Newsletter Unsubscribe API Endpoint
 * Handles newsletter unsubscriptions with secure token validation
 */

import type { APIRoute } from 'astro';
import { sendUnsubscribeConfirmation, isEmailServiceConfigured } from '../../utils/emailService.js';
import { unsubscribeByToken } from '../../utils/newsletterStorage.js';
import { logError } from '../../utils/errorTracking.js';
import { applySecurityHeaders, validateOrigin } from '../../utils/securityHeaders.js';

export const GET: APIRoute = async ({ request, url }) => {
  try {
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

    // Get token from query parameters
    const token = url.searchParams.get('token');

    if (!token) {
      const response = new Response(
        JSON.stringify({
          success: false,
          error: 'Unsubscribe token is required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return applySecurityHeaders(response, 'api');
    }

    // Validate token format (should be 64 character hex string)
    if (!/^[a-f0-9]{64}$/.test(token)) {
      const response = new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid unsubscribe token format',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return applySecurityHeaders(response, 'api');
    }

    // Unsubscribe using token
    let subscriber;
    try {
      subscriber = await unsubscribeByToken(token);
    } catch (storageError) {
      logError(
        storageError instanceof Error ? storageError : new Error(String(storageError)),
        { 
          component: 'unsubscribe-api', 
          action: 'storage-error', 
          metadata: { 
            endpoint: '/api/unsubscribe',
            token: token.substring(0, 8) + '...' // Log only first 8 chars for security
          } 
        },
        'high'
      );

      const response = new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to process unsubscribe request. Please try again later.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return applySecurityHeaders(response, 'api');
    }

    if (!subscriber) {
      const response = new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid or expired unsubscribe token',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return applySecurityHeaders(response, 'api');
    }

    // Send unsubscribe confirmation email
    if (isEmailServiceConfigured()) {
      try {
        await sendUnsubscribeConfirmation({
          email: subscriber.email,
          name: subscriber.name,
        });
      } catch (emailError) {
        logError(
          emailError instanceof Error ? emailError : new Error(String(emailError)),
          { 
            component: 'unsubscribe-api', 
            action: 'email-sending', 
            metadata: { 
              endpoint: '/api/unsubscribe',
              email: subscriber.email,
              subscriberId: subscriber.id
            } 
          },
          'medium'
        );
        // Note: We don't fail the request here because the unsubscribe was successful
      }
    }

    // Success response
    const response = new Response(
      JSON.stringify({
        success: true,
        message: 'Successfully unsubscribed from the newsletter.',
        email: subscriber.email,
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
        component: 'unsubscribe-api', 
        action: 'unsubscribe', 
        metadata: { endpoint: '/api/unsubscribe' } 
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

export const POST: APIRoute = async ({ request }) => {
  try {
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

    // Parse request body
    const body = await request.json();
    const { token } = body;

    if (!token) {
      const response = new Response(
        JSON.stringify({
          success: false,
          error: 'Unsubscribe token is required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return applySecurityHeaders(response, 'api');
    }

    // Validate token format
    if (!/^[a-f0-9]{64}$/.test(token)) {
      const response = new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid unsubscribe token format',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return applySecurityHeaders(response, 'api');
    }

    // Unsubscribe using token
    let subscriber;
    try {
      subscriber = await unsubscribeByToken(token);
    } catch (storageError) {
      logError(
        storageError instanceof Error ? storageError : new Error(String(storageError)),
        { 
          component: 'unsubscribe-api', 
          action: 'storage-error', 
          metadata: { 
            endpoint: '/api/unsubscribe',
            token: token.substring(0, 8) + '...'
          } 
        },
        'high'
      );

      const response = new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to process unsubscribe request. Please try again later.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return applySecurityHeaders(response, 'api');
    }

    if (!subscriber) {
      const response = new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid or expired unsubscribe token',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return applySecurityHeaders(response, 'api');
    }

    // Send unsubscribe confirmation email
    if (isEmailServiceConfigured()) {
      try {
        await sendUnsubscribeConfirmation({
          email: subscriber.email,
          name: subscriber.name,
        });
      } catch (emailError) {
        logError(
          emailError instanceof Error ? emailError : new Error(String(emailError)),
          { 
            component: 'unsubscribe-api', 
            action: 'email-sending', 
            metadata: { 
              endpoint: '/api/unsubscribe',
              email: subscriber.email,
              subscriberId: subscriber.id
            } 
          },
          'medium'
        );
      }
    }

    // Success response
    const response = new Response(
      JSON.stringify({
        success: true,
        message: 'Successfully unsubscribed from the newsletter.',
        email: subscriber.email,
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
        component: 'unsubscribe-api', 
        action: 'unsubscribe', 
        metadata: { endpoint: '/api/unsubscribe' } 
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
  return applySecurityHeaders(response, 'api');
};
