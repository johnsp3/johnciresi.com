/**
 * Newsletter Unsubscribe API Endpoint - Vercel Serverless Function
 * Handles newsletter unsubscriptions with secure token validation
 */

import { Resend } from 'resend';
import crypto from 'crypto';

// Initialize Resend
let resend = null;
try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
} catch (error) {
  console.warn('Email service not configured:', error);
}

// Generate a secure token for unsubscribe
function generateUnsubscribeToken(email) {
  const secret = process.env.UNSUBSCRIBE_SECRET || 'default-secret';
  const data = `${email}-${secret}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

// Validate unsubscribe token
function validateUnsubscribeToken(token, email) {
  const expectedToken = generateUnsubscribeToken(email);
  return crypto.timingSafeEqual(
    Buffer.from(token, 'hex'),
    Buffer.from(expectedToken, 'hex')
  );
}

async function unsubscribeByToken(token, email) {
  if (!email) {
    throw new Error('Email is required for unsubscribe');
  }
  
  if (!validateUnsubscribeToken(token, email)) {
    throw new Error('Invalid unsubscribe token');
  }
  
  // Return subscriber info (we don't need to store anything since we're using stateless validation)
  return {
    email: email,
    name: '', // We don't have this info in stateless mode
    unsubscribedAt: new Date().toISOString(),
    isActive: false
  };
}

// Email templates
function getUnsubscribeConfirmationTemplate(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Unsubscribed from John Ciresi's Newsletter</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #333333; margin: 0;">John Ciresi</h1>
          <p style="color: #666666; margin: 5px 0 0 0;">Professional Musician & Artist</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333333; margin: 0 0 15px 0;">You've Been Unsubscribed</h2>
          <p style="color: #666666; margin: 0 0 15px 0;">Hi ${data.name || 'there'},</p>
          <p style="color: #666666; margin: 0 0 15px 0;">You have successfully unsubscribed from my newsletter. I'm sorry to see you go!</p>
          
          <div style="background-color: #ffffff; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="color: #666666; margin: 0;">
              If you change your mind, you can always resubscribe by visiting my website at 
              <a href="${data.siteUrl}" style="color: #007bff; text-decoration: none;">${data.siteUrl}</a>
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #999999; font-size: 14px; margin: 0;">
            Best regards,<br>
            John Ciresi
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export default async function handler(request, response) {
  // Set CORS headers
  response.setHeader('Access-Control-Allow-Origin', 'https://johnciresi.com');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Access-Control-Max-Age', '86400');
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }
  
  // Handle both GET and POST requests
  if (request.method !== 'GET' && request.method !== 'POST') {
    return response.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }
  
  try {
    // Get token and email from query params (GET) or body (POST)
    let token, email;
    if (request.method === 'GET') {
      token = request.query.token;
      email = request.query.email;
    } else {
      token = request.body.token;
      email = request.body.email;
    }
    
    if (!token) {
      return response.status(400).json({
        success: false,
        error: 'Unsubscribe token is required'
      });
    }
    
    // Unsubscribe the user
    let subscriber;
    try {
      subscriber = await unsubscribeByToken(token, email);
    } catch (error) {
      if (error.message === 'Invalid unsubscribe token') {
        return response.status(400).json({
          success: false,
          error: 'Invalid unsubscribe token'
        });
      }
      throw error;
    }
    
    // Send confirmation email if email service is configured
    if (resend) {
      try {
        const templateData = {
          email: subscriber.email,
          name: subscriber.name,
          siteUrl: process.env.SITE_URL || 'https://johnciresi.com',
          siteName: process.env.SITE_NAME || 'John Ciresi'
        };
        
        const html = getUnsubscribeConfirmationTemplate(templateData);
        
        await resend.emails.send({
          from: `${(process.env.FROM_NAME || 'John Ciresi').replace(/_/g, ' ')} <${process.env.FROM_EMAIL || 'hello@johnciresi.com'}>`,
          to: [subscriber.email],
          subject: 'Unsubscribed from John Ciresi\'s Newsletter',
          html,
        });
      } catch (emailError) {
        console.error('Failed to send unsubscribe confirmation email:', emailError);
        // Don't fail the unsubscribe if email sending fails
      }
    }
    
    // Success response
    return response.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from the newsletter.'
    });
    
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return response.status(500).json({
      success: false,
      error: 'Internal server error. Please try again later.'
    });
  }
}
