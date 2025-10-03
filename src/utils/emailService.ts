/**
 * Enterprise Email Service
 * Handles all email operations with Resend API
 */

import { config } from 'dotenv';
import { Resend } from 'resend';

// Load environment variables
config();
import { 
  getNewsletterWelcomeTemplate,
  getContactConfirmationTemplate,
  getContactNotificationTemplate,
  getUnsubscribeConfirmationTemplate,
  type EmailTemplateData
} from './emailTemplates.js';

// Initialize Resend
let resend: Resend | null = null;

try {
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey && apiKey !== 'your_resend_api_key_here') {
    resend = new Resend(apiKey);
  }
} catch (error) {
  console.warn('Email service not configured:', error);
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface NewsletterData {
  email: string;
  name?: string;
}

/**
 * Check if email service is configured
 */
export function isEmailServiceConfigured(): boolean {
  return resend !== null;
}

/**
 * Send newsletter welcome email
 */
export async function sendNewsletterWelcome(data: NewsletterData, unsubscribeToken?: string): Promise<void> {
  if (!resend) {
    throw new Error('Email service not configured. Please add RESEND_API_KEY to environment variables.');
  }

  const templateData: EmailTemplateData = {
    email: data.email,
    name: data.name,
    siteUrl: process.env.SITE_URL || 'https://johnciresi.com',
    siteName: process.env.SITE_NAME || 'John Ciresi',
    unsubscribeUrl: unsubscribeToken 
      ? `${process.env.SITE_URL || 'https://johnciresi.com'}/api/unsubscribe?token=${unsubscribeToken}`
      : `${process.env.SITE_URL || 'https://johnciresi.com'}/api/unsubscribe`
  };

  const html = getNewsletterWelcomeTemplate(templateData);

  const result = await resend.emails.send({
    from: `${process.env.FROM_NAME || 'John Ciresi'} <${process.env.FROM_EMAIL || 'hello@johnciresi.com'}>`,
    to: [data.email],
    subject: 'Welcome to John Ciresi\'s Newsletter! 🎵',
    html,
  });

  if (result.error) {
    throw new Error(`Failed to send newsletter welcome email: ${result.error.message}`);
  }
}

/**
 * Send contact form confirmation to user
 */
export async function sendContactConfirmation(data: ContactFormData): Promise<void> {
  if (!resend) {
    throw new Error('Email service not configured. Please add RESEND_API_KEY to environment variables.');
  }

  const templateData: EmailTemplateData = {
    email: data.email,
    name: data.name,
    message: data.message,
    siteUrl: process.env.SITE_URL || 'https://johnciresi.com',
    siteName: process.env.SITE_NAME || 'John Ciresi'
  };

  const html = getContactConfirmationTemplate(templateData);

  const result = await resend.emails.send({
    from: `${process.env.FROM_NAME || 'John Ciresi'} <${process.env.FROM_EMAIL || 'hello@johnciresi.com'}>`,
    to: [data.email],
    subject: 'Message Received - John Ciresi',
    html,
  });

  if (result.error) {
    throw new Error(`Failed to send contact confirmation: ${result.error.message}`);
  }
}

/**
 * Send contact form notification to admin
 */
export async function sendContactNotification(data: ContactFormData): Promise<void> {
  if (!resend) {
    throw new Error('Email service not configured. Please add RESEND_API_KEY to environment variables.');
  }

  const templateData: EmailTemplateData = {
    email: data.email,
    name: data.name,
    message: data.message,
    siteUrl: process.env.SITE_URL || 'https://johnciresi.com',
    siteName: process.env.SITE_NAME || 'John Ciresi'
  };

  const html = getContactNotificationTemplate(templateData);

  const result = await resend.emails.send({
    from: `${process.env.FROM_NAME || 'John Ciresi'} <${process.env.FROM_EMAIL || 'hello@johnciresi.com'}>`,
    to: [process.env.TO_EMAIL || 'media@johnciresi.com'],
    subject: `New Contact Form Submission from ${data.name}`,
    html,
  });

  if (result.error) {
    throw new Error(`Failed to send contact notification: ${result.error.message}`);
  }
}

/**
 * Send unsubscribe confirmation email
 */
export async function sendUnsubscribeConfirmation(data: NewsletterData): Promise<void> {
  if (!resend) {
    throw new Error('Email service not configured. Please add RESEND_API_KEY to environment variables.');
  }

  const templateData: EmailTemplateData = {
    email: data.email,
    name: data.name,
    siteUrl: process.env.SITE_URL || 'https://johnciresi.com',
    siteName: process.env.SITE_NAME || 'John Ciresi'
  };

  const html = getUnsubscribeConfirmationTemplate(templateData);

  const result = await resend.emails.send({
    from: `${process.env.FROM_NAME || 'John Ciresi'} <${process.env.FROM_EMAIL || 'hello@johnciresi.com'}>`,
    to: [data.email],
    subject: 'Unsubscribed from John Ciresi\'s Newsletter',
    html,
  });

  if (result.error) {
    throw new Error(`Failed to send unsubscribe confirmation: ${result.error.message}`);
  }
}