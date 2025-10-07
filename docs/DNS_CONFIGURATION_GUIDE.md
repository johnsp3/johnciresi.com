# DNS Configuration for johnciresi.com

## Current Status

- **Domain**: johnciresi.com
- **Resend Status**: not_started
- **Issue**: DNS records not properly configured

## Required DNS Records

Add these EXACT records to your GoDaddy DNS settings:

### 1. SPF Record (TXT)

```
Type: TXT
Name: send
Value: v=spf1 include:amazonses.com ~all
TTL: Auto (or 3600)
```

### 2. DKIM Record (TXT)

```
Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDI/RIXPyHtE43cviSCJQ3+zkY8t81SjOlZQq9RA8mqziqLf+JQlHxaNYZjhfcDy0FizC5BN4kZcz5YszrGdbKOtj66JS9OUDp5jxcPn2jkOOjksASINExOraDMOgumVqo7Xb3Pv4MZDRZuwdGw0k3zrJhn/e2lHus8qvVk6Y3GZQIDAQAB
TTL: Auto (or 3600)
```

### 3. MX Record (Optional but recommended)

```
Type: MX
Name: send
Value: feedback-smtp.eu-west-1.amazonses.com
Priority: 10
TTL: Auto (or 3600)
```

## GoDaddy DNS Configuration Steps

1. **Login to GoDaddy**
2. **Go to DNS Management**
3. **Add each record above**
4. **Save changes**
5. **Wait 5-60 minutes for propagation**

## Verification

After adding the records, check status with:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" https://api.resend.com/domains/3e181f4e-6d19-4f59-bac3-30b7f4b3c871
```

Look for `"status": "verified"` in the response.

## Current Domain ID

- **Domain ID**: 3e181f4e-6d19-4f59-bac3-30b7f4b3c871
- **Region**: eu-west-1
