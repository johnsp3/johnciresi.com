/**
 * Enterprise-Grade Email Templates
 * Beautiful HTML email templates with inline CSS for maximum compatibility
 */

export interface EmailTemplateData {
  name?: string;
  email: string;
  message?: string;
  unsubscribeUrl?: string;
  siteUrl: string;
  siteName: string;
}

/**
 * Base email template with professional styling
 */
function getBaseTemplate(content: string, title: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; line-height: 1.6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8fafc;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                John Ciresi
              </h1>
              <p style="margin: 8px 0 0 0; color: #e2e8f0; font-size: 16px; font-weight: 400;">
                Professional Musician & Artist
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 16px 0; color: #64748b; font-size: 14px;">
                © 2024 John Ciresi. All rights reserved.
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                This email was sent from <a href="https://johnciresi.com" style="color: #667eea; text-decoration: none;">johnciresi.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Newsletter Welcome Email Template
 */
export function getNewsletterWelcomeTemplate(data: EmailTemplateData): string {
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
        <span style="color: #ffffff; font-size: 32px; font-weight: bold;">🎵</span>
      </div>
      <h2 style="margin: 0 0 16px 0; color: #1e293b; font-size: 24px; font-weight: 600;">
        Welcome to the Music!
      </h2>
      <p style="margin: 0; color: #64748b; font-size: 16px;">
        Thank you for subscribing to my newsletter, ${data.name || 'friend'}!
      </p>
    </div>
    
    <div style="background-color: #f8fafc; padding: 24px; border-radius: 8px; margin-bottom: 30px;">
      <h3 style="margin: 0 0 16px 0; color: #1e293b; font-size: 18px; font-weight: 600;">
        What to Expect:
      </h3>
      <ul style="margin: 0; padding-left: 20px; color: #475569;">
        <li style="margin-bottom: 8px;">Exclusive new music releases</li>
        <li style="margin-bottom: 8px;">Behind-the-scenes content</li>
        <li style="margin-bottom: 8px;">Upcoming shows and events</li>
        <li style="margin-bottom: 8px;">Special offers and merchandise</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin-bottom: 30px;">
      <a href="${data.siteUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: 0.5px;">
        Explore My Music
      </a>
    </div>
    
    <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; text-align: center;">
      <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">
        You can unsubscribe at any time:
      </p>
      <a href="${data.unsubscribeUrl}" style="color: #667eea; text-decoration: none; font-size: 14px;">
        Unsubscribe from this newsletter
      </a>
    </div>
  `;
  
  return getBaseTemplate(content, 'Welcome to John Ciresi\'s Newsletter');
}

/**
 * Contact Form Confirmation Email Template
 */
export function getContactConfirmationTemplate(data: EmailTemplateData): string {
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
        <span style="color: #ffffff; font-size: 32px; font-weight: bold;">✓</span>
      </div>
      <h2 style="margin: 0 0 16px 0; color: #1e293b; font-size: 24px; font-weight: 600;">
        Message Received!
      </h2>
      <p style="margin: 0; color: #64748b; font-size: 16px;">
        Thank you for reaching out, ${data.name || 'friend'}!
      </p>
    </div>
    
    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 24px; border-radius: 8px; margin-bottom: 30px;">
      <h3 style="margin: 0 0 16px 0; color: #166534; font-size: 18px; font-weight: 600;">
        Your Message:
      </h3>
      <p style="margin: 0; color: #15803d; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${data.message || ''}</p>
    </div>
    
    <div style="background-color: #f8fafc; padding: 24px; border-radius: 8px; margin-bottom: 30px;">
      <h3 style="margin: 0 0 16px 0; color: #1e293b; font-size: 18px; font-weight: 600;">
        What Happens Next:
      </h3>
      <p style="margin: 0 0 12px 0; color: #475569; font-size: 16px;">
        • I'll review your message within 24 hours
      </p>
      <p style="margin: 0 0 12px 0; color: #475569; font-size: 16px;">
        • You'll receive a personal response from me
      </p>
      <p style="margin: 0; color: #475569; font-size: 16px;">
        • For urgent matters, feel free to follow up
      </p>
    </div>
    
    <div style="text-align: center;">
      <a href="${data.siteUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: 0.5px;">
        Visit My Website
      </a>
    </div>
  `;
  
  return getBaseTemplate(content, 'Message Received - John Ciresi');
}

/**
 * Contact Form Notification Email Template (to admin)
 */
export function getContactNotificationTemplate(data: EmailTemplateData): string {
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
        <span style="color: #ffffff; font-size: 32px; font-weight: bold;">📧</span>
      </div>
      <h2 style="margin: 0 0 16px 0; color: #1e293b; font-size: 24px; font-weight: 600;">
        New Contact Form Submission
      </h2>
      <p style="margin: 0; color: #64748b; font-size: 16px;">
        You have received a new message through your website contact form.
      </p>
    </div>
    
    <div style="background-color: #f8fafc; padding: 24px; border-radius: 8px; margin-bottom: 30px;">
      <h3 style="margin: 0 0 20px 0; color: #1e293b; font-size: 18px; font-weight: 600;">
        Contact Details:
      </h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 120px;">Name:</td>
          <td style="padding: 8px 0; color: #1e293b;">${data.name || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Email:</td>
          <td style="padding: 8px 0; color: #1e293b;">
            <a href="mailto:${data.email}" style="color: #667eea; text-decoration: none;">${data.email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Date:</td>
          <td style="padding: 8px 0; color: #1e293b;">${new Date().toLocaleString()}</td>
        </tr>
      </table>
    </div>
    
    <div style="background-color: #fef3c7; border: 1px solid #fcd34d; padding: 24px; border-radius: 8px; margin-bottom: 30px;">
      <h3 style="margin: 0 0 16px 0; color: #92400e; font-size: 18px; font-weight: 600;">
        Message:
      </h3>
      <p style="margin: 0; color: #b45309; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${data.message || 'No message provided'}</p>
    </div>
    
    <div style="text-align: center;">
      <a href="mailto:${data.email}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: 0.5px; margin-right: 12px;">
        Reply to ${data.name || 'Contact'}
      </a>
      <a href="${data.siteUrl}" style="display: inline-block; background-color: #f8fafc; color: #667eea; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: 0.5px; border: 2px solid #667eea;">
        View Website
      </a>
    </div>
  `;
  
  return getBaseTemplate(content, 'New Contact Form Submission - John Ciresi');
}

/**
 * Newsletter Unsubscribe Confirmation Template
 */
export function getUnsubscribeConfirmationTemplate(data: EmailTemplateData): string {
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
        <span style="color: #ffffff; font-size: 32px; font-weight: bold;">👋</span>
      </div>
      <h2 style="margin: 0 0 16px 0; color: #1e293b; font-size: 24px; font-weight: 600;">
        You're Unsubscribed
      </h2>
      <p style="margin: 0; color: #64748b; font-size: 16px;">
        Sorry to see you go, ${data.name || 'friend'}!
      </p>
    </div>
    
    <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 24px; border-radius: 8px; margin-bottom: 30px;">
      <h3 style="margin: 0 0 16px 0; color: #991b1b; font-size: 18px; font-weight: 600;">
        Unsubscribe Confirmed
      </h3>
      <p style="margin: 0; color: #b91c1c; font-size: 16px;">
        You have been successfully unsubscribed from John Ciresi's newsletter. 
        You will no longer receive promotional emails from us.
      </p>
    </div>
    
    <div style="background-color: #f8fafc; padding: 24px; border-radius: 8px; margin-bottom: 30px;">
      <h3 style="margin: 0 0 16px 0; color: #1e293b; font-size: 18px; font-weight: 600;">
        Still Want to Stay Connected?
      </h3>
      <p style="margin: 0 0 16px 0; color: #475569; font-size: 16px;">
        You can still follow me on social media for updates:
      </p>
      <div style="text-align: center;">
        <a href="https://twitter.com/johnciresi" style="display: inline-block; background-color: #1da1f2; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px; margin: 0 8px;">
          Twitter
        </a>
        <a href="https://instagram.com/johnciresi" style="display: inline-block; background-color: #e4405f; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px; margin: 0 8px;">
          Instagram
        </a>
      </div>
    </div>
    
    <div style="text-align: center;">
      <a href="${data.siteUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: 0.5px;">
        Visit My Website
      </a>
    </div>
  `;
  
  return getBaseTemplate(content, 'Unsubscribed - John Ciresi');
}
