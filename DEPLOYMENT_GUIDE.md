# Deployment Guide - John Chezik Website

## 🚀 Vercel Deployment Instructions

### Prerequisites
- Vercel account
- GitHub repository with the code
- Environment variables configured

### Step 1: Environment Variables Setup

In your Vercel dashboard, add these environment variables:

```bash
# Resend Configuration
RESEND_API_KEY=re_ATnzc1qj_FeEQaa9GLbjTPK2JXtf9FpgS
RESEND_FROM_EMAIL=noreply@chezik.eu
RESEND_FROM_NAME="John Chezik"

# Site Configuration
NEXT_PUBLIC_BASE_URL=https://chezik.eu
NEXT_PUBLIC_SITE_NAME="John Chezik"
FROM_EMAIL=noreply@chezik.eu
CONTACT_EMAIL=media@chezik.eu

# Security Keys
EMAIL_SECRET=jc_2024_secure_email_validation_key_7f8a9b2c
UNSUBSCRIBE_SECRET=jc_2024_unsubscribe_token_4e5d6f7a
PREFERENCES_SECRET=jc_2024_preferences_auth_1b3c5e8f

# Environment
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### Step 2: Deploy to Vercel

1. **Connect GitHub Repository**
   - Go to Vercel dashboard
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework: Astro
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Test the live site

### Step 3: Domain Configuration

1. **Add Custom Domain**
   - In Vercel dashboard, go to your project
   - Navigate to "Domains"
   - Add `chezik.eu` as custom domain

2. **DNS Configuration**
   - Point your domain to Vercel's nameservers
   - Or add CNAME record pointing to your Vercel deployment

### Step 4: Post-Deployment Testing

Test these features on the live site:

1. **Contact Form**
   - Fill out and submit the contact form
   - Check that you receive the email at `media@chezik.eu`
   - Verify the user receives a confirmation email

2. **Newsletter Signup**
   - Subscribe to the newsletter
   - Check that the user receives a welcome email
   - Verify the subscription works

3. **Rate Limiting**
   - Test rate limiting by submitting forms multiple times quickly
   - Verify proper error messages are shown

4. **Security Features**
   - Test honeypot fields (should be hidden)
   - Verify spam protection is working
   - Check that validation errors are properly displayed

### Step 5: Monitoring

1. **Vercel Analytics**
   - Enable Vercel Analytics for performance monitoring
   - Monitor API endpoint performance

2. **Error Monitoring**
   - Check Vercel function logs for any errors
   - Monitor email delivery success rates

## 🔧 Local Development

To test locally with environment variables:

1. Create `.env.local` file in project root
2. Add all environment variables from Step 1
3. Run `npm run dev`
4. Test forms at `http://localhost:3000`

## 📧 Email Configuration

### Resend Setup
- API key is already configured
- From email: `noreply@chezik.eu`
- Contact email: `media@chezik.eu`

### Email Templates
- Contact form sends to admin + confirmation to user
- Newsletter sends welcome email to subscriber
- All emails use professional HTML templates

## 🛡️ Security Features

### Implemented Security Measures
- Rate limiting (3 requests per 15 minutes)
- Honeypot fields for spam protection
- Input validation and sanitization
- CORS headers for API endpoints
- Security headers via Vercel configuration

### Validation Rules
- Name: 1-100 characters
- Email: Valid email format, 5-254 characters
- Message: 10-2000 characters
- Spam detection for suspicious content

## 🚨 Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check Resend API key is correct
   - Verify environment variables are set
   - Check Vercel function logs

2. **Rate limiting too strict**
   - Adjust `RATE_LIMIT_CONFIG` in `src/utils/env.ts`
   - Redeploy to Vercel

3. **Form validation errors**
   - Check validation rules in `src/utils/security.ts`
   - Verify form field names match API expectations

4. **Build failures**
   - Check for TypeScript errors
   - Verify all dependencies are installed
   - Check Vercel build logs

### Support
- Check Vercel function logs for detailed error messages
- Monitor Resend dashboard for email delivery status
- Use browser developer tools to debug form submissions

## ✅ Success Checklist

- [ ] Environment variables configured in Vercel
- [ ] Custom domain connected
- [ ] Contact form working and sending emails
- [ ] Newsletter signup working and sending welcome emails
- [ ] Rate limiting functioning properly
- [ ] Security features working (honeypot, validation)
- [ ] Site loads correctly on all devices
- [ ] All forms show proper success/error messages
- [ ] No console errors or warnings
- [ ] Performance is acceptable (check Vercel Analytics)

---

**Last Updated**: December 19, 2024  
**Version**: 1.0.0  
**Status**: Ready for Production
