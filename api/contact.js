/**
 * Contact Form API Endpoint - Vercel Serverless Function
 * Handles contact form submissions with enterprise-grade security and validation
 */

import { Resend } from 'resend';

// Initialize Resend
let resend = null;
try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
} catch (error) {
  console.warn('Email service not configured:', error);
}

// Email templates
function getContactConfirmationTemplate(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Message Received - John Ciresi</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #333333; margin: 0;">John Ciresi</h1>
          <p style="color: #666666; margin: 5px 0 0 0;">Professional Musician & Artist</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333333; margin: 0 0 15px 0;">Thank You for Your Message!</h2>
          <p style="color: #666666; margin: 0 0 15px 0;">Hi ${data.name},</p>
          <p style="color: #666666; margin: 0 0 15px 0;">Thank you for reaching out! I've received your message and will get back to you as soon as possible.</p>
          
          <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
            <h3 style="color: #333333; margin: 0 0 10px 0;">Your Message:</h3>
            <p style="color: #666666; margin: 0; white-space: pre-wrap;">${data.message}</p>
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

function getContactNotificationTemplate(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #333333; margin: 0;">New Contact Form Submission</h1>
          <p style="color: #666666; margin: 5px 0 0 0;">John Ciresi Website</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333333; margin: 0 0 20px 0;">Contact Details</h2>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #333333;">Name:</strong>
            <span style="color: #666666; margin-left: 10px;">${data.name}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #333333;">Email:</strong>
            <span style="color: #666666; margin-left: 10px;">${data.email}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #333333;">Message:</strong>
            <div style="background-color: #ffffff; padding: 15px; border-radius: 4px; margin-top: 10px;">
              <p style="color: #666666; margin: 0; white-space: pre-wrap;">${data.message}</p>
            </div>
          </div>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef;">
            <p style="color: #999999; font-size: 12px; margin: 0;">
              Received on: ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Rate limiting (simple in-memory store for demo)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5;

function checkRateLimit(ip) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  // Clean old entries
  for (const [key, timestamp] of rateLimitStore.entries()) {
    if (timestamp < windowStart) {
      rateLimitStore.delete(key);
    }
  }
  
  // Check current IP
  const requests = Array.from(rateLimitStore.entries())
    .filter(([key, timestamp]) => key.startsWith(ip) && timestamp > windowStart)
    .length;
  
  if (requests >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }
  
  // Add current request
  rateLimitStore.set(`${ip}-${now}`, now);
  
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - requests - 1 };
}

function validateContactForm(data) {
  const errors = [];
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  if (!data.email || typeof data.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Valid email address is required');
  }
  
  if (!data.message || typeof data.message !== 'string' || data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long');
  }
  
  if (data.name && data.name.length > 100) {
    errors.push('Name must be less than 100 characters');
  }
  
  if (data.message && data.message.length > 2000) {
    errors.push('Message must be less than 2000 characters');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    sanitized: errors.length === 0 ? {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      message: data.message.trim()
    } : null
  };
}

function getClientIP(request) {
  const forwarded = request.headers['x-forwarded-for'];
  const realIP = request.headers['x-real-ip'];
  const cfConnectingIP = request.headers['cf-connecting-ip'];
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  return 'unknown';
}

export default async function handler(request, response) {
  // Set CORS headers
  response.setHeader('Access-Control-Allow-Origin', 'https://johnciresi.com');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Access-Control-Max-Age', '86400');
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }
  
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }
  
  try {
    // Check if email service is configured
    if (!resend) {
      return response.status(500).json({
        success: false,
        error: 'Email service not configured. Please try again later.'
      });
    }
    
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP);
    if (!rateLimit.allowed) {
      return response.status(429).json({
        success: false,
        error: 'Too many requests. Please try again later.'
      });
    }
    
    // Parse request body
    const body = request.body;
    
    // Validate form data
    const validation = validateContactForm(body);
    if (!validation.valid) {
      return response.status(400).json({
        success: false,
        error: 'Invalid form data',
        details: validation.errors
      });
    }
    
    const { sanitized } = validation;
    
    // Send confirmation email to user
    try {
      const confirmationHtml = getContactConfirmationTemplate(sanitized);
      await resend.emails.send({
        from: `${(process.env.FROM_NAME || 'John Ciresi').replace(/_/g, ' ')} <${process.env.FROM_EMAIL || 'hello@johnciresi.com'}>`,
        to: [sanitized.email],
        subject: 'Message Received - John Ciresi',
        html: confirmationHtml,
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Continue with notification email even if confirmation fails
    }
    
    // Send notification email to admin
    try {
      const notificationHtml = getContactNotificationTemplate(sanitized);
      await resend.emails.send({
        from: `${(process.env.FROM_NAME || 'John Ciresi').replace(/_/g, ' ')} <${process.env.FROM_EMAIL || 'hello@johnciresi.com'}>`,
        to: [process.env.TO_EMAIL || 'media@johnciresi.com'],
        subject: `New Contact Form Submission from ${sanitized.name}`,
        html: notificationHtml,
      });
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
      return response.status(500).json({
        success: false,
        error: 'Failed to send email. Please try again later.'
      });
    }
    
    // Success response
    return response.status(200).json({
      success: true,
      message: 'Message sent successfully!'
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    return response.status(500).json({
      success: false,
      error: 'Internal server error. Please try again later.'
    });
  }
}
