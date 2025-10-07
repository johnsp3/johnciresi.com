/**
 * Contact Email Templates
 */

export function getContactConfirmationTemplate(data: { name: string; message: string }) {
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

export function getContactNotificationTemplate(data: { name: string; email: string; message: string }) {
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
