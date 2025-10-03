# Vercel Environment Variables Setup

## Required Environment Variables

Add these environment variables in your Vercel dashboard:

### 1. Resend API Configuration
```
RESEND_API_KEY=your_actual_resend_api_key_here
```

### 2. Email Configuration
```
FROM_EMAIL=hello@johnciresi.com
TO_EMAIL=media@johnciresi.com
FROM_NAME=John Ciresi
```

### 3. Security Secrets
```
UNSUBSCRIBE_SECRET=8d955b8479521604127ec4fd43745f72aa82f87170bce15b89d8b86f51fc661e
```

### 4. Site Configuration
```
SITE_URL=https://johnciresi.vercel.app
SITE_NAME=John Ciresi
```

### 5. Environment
```
NODE_ENV=production
```

## How to Add Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project (`johnciresi`)
3. Go to **Settings** → **Environment Variables**
4. Add each variable above:
   - **Name**: The variable name (e.g., `RESEND_API_KEY`)
   - **Value**: The variable value (e.g., your actual Resend API key)
   - **Environment**: Select `Production`, `Preview`, and `Development`
5. Click **Save**

## Important Notes

- **RESEND_API_KEY**: Get this from your Resend dashboard at https://resend.com/api-keys
- **UNSUBSCRIBE_SECRET**: This is a secure random string for unsubscribe token validation
- **SITE_URL**: Update this to your custom domain when you set it up
- **TO_EMAIL**: This is where contact form submissions will be sent

## After Adding Variables

1. **Redeploy** your site (Vercel will automatically redeploy when you add environment variables)
2. **Test** the contact form and newsletter subscription
3. **Verify** emails are being sent and received

## Security

- Never commit your `.env` file to Git
- Keep your Resend API key secure
- The `UNSUBSCRIBE_SECRET` is already generated and secure
