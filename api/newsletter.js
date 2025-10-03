/**
 * Newsletter Subscription API Endpoint - Vercel Serverless Function
 * Handles newsletter subscriptions with enterprise-grade security and validation
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

// In-memory storage for demo (in production, use a proper database)
const subscribers = new Map();

// Generate a secure token for unsubscribe (same method as unsubscribe API)
function generateUnsubscribeToken(email) {
  const secret = process.env.UNSUBSCRIBE_SECRET || 'default-secret';
  const data = `${email}-${secret}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

async function addSubscriber(email, name) {
  // Check if email already exists
  if (subscribers.has(email)) {
    throw new Error('Email already subscribed');
  }
  
  // Generate unsubscribe token using the same method as unsubscribe API
  const unsubscribeToken = generateUnsubscribeToken(email);
  
  const newSubscriber = {
    email,
    name: name || '',
    subscribedAt: new Date().toISOString(),
    unsubscribeToken,
    isActive: true
  };
  
  subscribers.set(email, newSubscriber);
  
  return newSubscriber;
}

// Email templates
function getNewsletterWelcomeTemplate(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to John Ciresi's Newsletter!</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #333333; margin: 0;">John Ciresi</h1>
          <p style="color: #666666; margin: 5px 0 0 0;">Professional Musician & Artist</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333333; margin: 0 0 15px 0;">Welcome to My Newsletter! 🎵</h2>
          <p style="color: #666666; margin: 0 0 15px 0;">Hi ${data.name || 'there'},</p>
          <p style="color: #666666; margin: 0 0 15px 0;">Thank you for subscribing to my newsletter! I'm excited to share my latest music, updates, and behind-the-scenes content with you.</p>
          
          <div style="background-color: #ffffff; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h3 style="color: #333333; margin: 0 0 10px 0;">What to expect:</h3>
            <ul style="color: #666666; margin: 0; padding-left: 20px;">
              <li>Latest album releases and singles</li>
              <li>Exclusive behind-the-scenes content</li>
              <li>Upcoming concert and event announcements</li>
              <li>Personal insights and stories</li>
            </ul>
          </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.unsubscribeUrl}" style="color: #999999; font-size: 12px; text-decoration: none;">
            Unsubscribe from this newsletter
          </a>
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

// Rate limiting (simple in-memory store for demo)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 3;

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

function validateNewsletterForm(data) {
  const errors = [];
  
  if (!data.email || typeof data.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Valid email address is required');
  }
  
  if (data.name && typeof data.name === 'string' && data.name.length > 100) {
    errors.push('Name must be less than 100 characters');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    sanitized: errors.length === 0 ? {
      email: data.email.trim().toLowerCase(),
      name: data.name ? data.name.trim() : undefined
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
    const validation = validateNewsletterForm(body);
    if (!validation.valid) {
      return response.status(400).json({
        success: false,
        error: 'Invalid form data',
        details: validation.errors
      });
    }
    
    const { sanitized } = validation;
    
    // Add subscriber to storage
    let subscriber;
    try {
      subscriber = await addSubscriber(sanitized.email, sanitized.name);
    } catch (storageError) {
      if (storageError.message === 'Email already subscribed') {
        return response.status(400).json({
          success: false,
          error: 'This email is already subscribed to the newsletter.'
        });
      }
      throw storageError;
    }
    
    // Send welcome email
    try {
        const templateData = {
          email: subscriber.email,
          name: subscriber.name,
          siteUrl: process.env.SITE_URL || 'https://johnciresi.com',
          siteName: process.env.SITE_NAME || 'John Ciresi',
          unsubscribeUrl: `https://johnciresi.com/api/unsubscribe?token=${subscriber.unsubscribeToken}&email=${encodeURIComponent(subscriber.email)}`
        };
      
      const html = getNewsletterWelcomeTemplate(templateData);
      
      await resend.emails.send({
        from: `${(process.env.FROM_NAME || 'John Ciresi').replace(/_/g, ' ')} <${process.env.FROM_EMAIL || 'hello@johnciresi.com'}>`,
        to: [subscriber.email],
        subject: 'Welcome to John Ciresi\'s Newsletter! 🎵',
        html,
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      return response.status(500).json({
        success: false,
        error: 'Failed to send welcome email. Please try again later.'
      });
    }
    
    // Success response
    return response.status(200).json({
      success: true,
      message: 'Successfully subscribed! Check your email for a welcome message.'
    });
    
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return response.status(500).json({
      success: false,
      error: 'Internal server error. Please try again later.'
    });
  }
}
