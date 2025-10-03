# Email System Testing Guide

## Prerequisites

1. **Get Resend API Key**:
   - Go to https://resend.com
   - Sign up/login to your account
   - Go to API Keys section
   - Create a new API key
   - Copy the key (starts with `re_`)

2. **Update .env file**:
   - Replace `your_resend_api_key_here` with your actual Resend API key
   - The .env file is already created with all necessary variables

## Local Testing

### 1. Start Development Server
```bash
npm run dev
```

### 2. Test Contact Form
- Go to http://localhost:3000
- Scroll to the contact section
- Fill out the contact form with:
  - **Name**: Test User
  - **Email**: your-email@example.com (use a real email you can check)
  - **Message**: This is a test message from the contact form
- Click Submit

**Expected Results**:
- ✅ Form submits successfully
- ✅ You receive a confirmation email
- ✅ You (admin) receive a notification email at `media@johnciresi.com`

### 3. Test Newsletter Subscription
- Go to the newsletter section
- Fill out the newsletter form with:
  - **Email**: your-email@example.com
  - **Name**: Test User (optional)
- Click Subscribe

**Expected Results**:
- ✅ Subscription successful
- ✅ You receive a welcome email with unsubscribe link
- ✅ Subscriber is stored in `data/newsletter-subscribers.json`

### 4. Test Unsubscribe
- Open the welcome email
- Click the unsubscribe link
- Or manually test: `http://localhost:3000/api/unsubscribe?token=SUBSCRIBE_TOKEN`

**Expected Results**:
- ✅ Unsubscribe successful
- ✅ You receive an unsubscribe confirmation email
- ✅ Subscriber is marked as inactive in storage

## Test Email Templates

### Contact Form Confirmation Email
- **Subject**: "Message Received - John Ciresi"
- **Content**: Beautiful HTML template with your message
- **Features**: Professional design, confirmation message, next steps

### Contact Form Notification Email (to Admin)
- **Subject**: "New Contact Form Submission from [Name]"
- **Content**: Admin notification with contact details
- **Features**: Contact info table, message display, reply button

### Newsletter Welcome Email
- **Subject**: "Welcome to John Ciresi's Newsletter! 🎵"
- **Content**: Welcome message with what to expect
- **Features**: Unsubscribe link, social media links, professional design

### Unsubscribe Confirmation Email
- **Subject**: "Unsubscribed from John Ciresi's Newsletter"
- **Content**: Confirmation of unsubscription
- **Features**: Social media links, website link, professional design

## API Endpoint Testing

### Test Contact API
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message"
  }'
```

### Test Newsletter API
```bash
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User"
  }'
```

### Test Unsubscribe API
```bash
curl "http://localhost:3000/api/unsubscribe?token=SUBSCRIBE_TOKEN"
```

## Production Testing (After Vercel Deployment)

### 1. Add Environment Variables to Vercel
- Follow the instructions in `VERCEL_ENVIRONMENT_VARIABLES.md`
- Add your Resend API key and other variables

### 2. Test on Live Site
- Go to https://johnciresi.vercel.app
- Test contact form and newsletter subscription
- Verify emails are sent and received

### 3. Monitor Logs
```bash
vercel logs --follow
```

## Troubleshooting

### Common Issues

1. **"Email service not configured" error**:
   - Check if RESEND_API_KEY is set correctly
   - Verify the API key is valid and active

2. **Emails not being sent**:
   - Check Resend dashboard for delivery status
   - Verify FROM_EMAIL domain is verified in Resend
   - Check spam folder

3. **Rate limiting errors**:
   - Wait 15 minutes between requests
   - Check if you're making too many requests

4. **Invalid form data errors**:
   - Ensure all required fields are filled
   - Check email format is valid
   - Verify honeypot field is empty

### Debug Mode

Add this to your .env file for detailed logging:
```
NODE_ENV=development
```

## Security Testing

1. **Test Rate Limiting**:
   - Submit multiple forms quickly
   - Should get rate limit error after 3 requests

2. **Test Honeypot**:
   - Fill out the hidden honeypot field
   - Should be rejected

3. **Test Input Validation**:
   - Try invalid email formats
   - Try very long messages
   - Try XSS attempts

## Performance Testing

1. **Test Email Delivery Speed**:
   - Time how long emails take to arrive
   - Should be under 30 seconds

2. **Test Concurrent Requests**:
   - Submit multiple forms simultaneously
   - System should handle gracefully

## Success Criteria

✅ **Contact Form**:
- Sends confirmation to user
- Sends notification to admin
- Handles errors gracefully

✅ **Newsletter**:
- Stores subscriber data
- Sends welcome email
- Provides unsubscribe functionality

✅ **Security**:
- Rate limiting works
- Input validation works
- Honeypot protection works

✅ **Email Templates**:
- Beautiful HTML design
- Works in all email clients
- Includes proper unsubscribe links

## Next Steps After Testing

1. **Set up custom domain** (optional)
2. **Configure email analytics** in Resend
3. **Set up email monitoring** for delivery issues
4. **Create email templates** for other use cases
