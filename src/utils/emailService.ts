/**
 * Email Service Utilities
 * Handles email sending with Resend API
 */

import { Resend } from 'resend';
import { getEnvConfig } from './env.js';

const env = getEnvConfig();
const resend = env.resendApiKey !== 'not-configured' ? new Resend(env.resendApiKey) : null;

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface NewsletterData {
  email: string;
}

/**
 * Sends contact form email to admin and confirmation to user
 */
export async function sendContactEmail(data: ContactFormData): Promise<void> {
  if (!resend) {
    throw new Error('Email service not configured. Please add RESEND_API_KEY to environment variables.');
  }

  const { name, email, message } = data;

  // Email to admin (media@johnciresi.com)
  const adminEmail = await resend.emails.send({
    from: `${env.resendFromName} <${env.resendFromEmail}>`,
    to: [env.contactEmail],
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #333;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          This message was sent from the contact form on ${env.siteName} website.
        </p>
      </div>
    `,
  });

  // Confirmation email to user
  const userEmail = await resend.emails.send({
    from: `${env.resendFromName} <${env.resendFromEmail}>`,
    to: [email],
    subject: `Thank you for contacting John Ciresi`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 10px;">
          Thank You for Your Message
        </h2>
        
        <p>Hi ${name},</p>
        
        <p>Thank you for reaching out! I've received your message and will get back to you as soon as possible.</p>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Your message:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #333;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
        
        <p>I appreciate your interest and look forward to connecting with you.</p>
        
        <p>Best regards,<br>
        John Ciresi</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          This is an automated confirmation. Please do not reply to this email.
        </p>
      </div>
    `,
  });

  if (adminEmail.error || userEmail.error) {
    throw new Error(
      `Failed to send emails: ${adminEmail.error || userEmail.error}`
    );
  }
}

/**
 * Sends newsletter welcome email
 */
export async function sendNewsletterWelcome(
  data: NewsletterData
): Promise<void> {
  if (!resend) {
    throw new Error('Email service not configured. Please add RESEND_API_KEY to environment variables.');
  }

  const { email } = data;

  const welcomeEmail = await resend.emails.send({
    from: `${env.resendFromName} <${env.resendFromEmail}>`,
    to: [email],
    subject: `Welcome to John Ciresi's Newsletter`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 10px;">
          Welcome to My Newsletter!
        </h2>
        
        <p>Thank you for subscribing to my newsletter!</p>
        
        <p>You'll now receive updates on:</p>
        <ul>
          <li>New music releases and projects</li>
          <li>Exclusive behind-the-scenes content</li>
          <li>Upcoming shows and events</li>
          <li>Personal insights and stories</li>
        </ul>
        
        <p>I'm excited to share my musical journey with you and keep you connected to what's happening in my world.</p>
        
        <p>Thank you for your support!</p>
        
        <p>Best regards,<br>
        John Ciresi</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          You can unsubscribe at any time by clicking the link in any newsletter email.
        </p>
      </div>
    `,
  });

  if (welcomeEmail.error) {
    throw new Error(`Failed to send welcome email: ${welcomeEmail.error}`);
  }
}
