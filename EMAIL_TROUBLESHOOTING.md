# Email Configuration Troubleshooting Guide

## समस्या: "Failed to send OTP email" Vercel पर

### मुख्य कारण और समाधान:

## 1. Gmail App Password Setup (सबसे महत्वपूर्ण)

### Steps:
1. Gmail account में login करें
2. Google Account Settings → Security
3. 2-Step Verification enable करें
4. App passwords generate करें:
   - Select app: "Mail"
   - Select device: "Other" → "CS Rippers"
   - Generated password को copy करें

### Environment Variables Update:
```env
EMAIL_USER=teamcybershoora@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx  # App password (16 characters with spaces)
```

## 2. Vercel Environment Variables

### Vercel Dashboard में:
1. Project Settings → Environment Variables
2. सभी variables add करें:
   - `EMAIL_USER`
   - `EMAIL_PASS` (App Password)
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `ADMIN_SECRET_KEY`

### Production, Preview, Development सभी के लिए set करें

## 3. Gmail Security Settings

### Required Settings:
- ✅ 2-Step Verification: ON
- ✅ App Passwords: Generated
- ✅ Less secure app access: OFF (App password use करने से यह automatically handle हो जाता है)

## 4. Testing Commands

### Local Testing:
```bash
# Environment variables check
curl http://localhost:3000/api/check-env

# Email configuration test
curl http://localhost:3000/api/test-email
```

### Production Testing:
```bash
# Environment variables check
curl https://your-app.vercel.app/api/check-env

# Email configuration test
curl https://your-app.vercel.app/api/test-email
```

## 5. Common Issues और Solutions

### Issue 1: "Invalid login: 535-5.7.8 Username and Password not accepted"
**Solution:** App Password use करें, regular password नहीं

### Issue 2: "Connection timeout"
**Solution:** 
- Gmail service का इस्तेमाल करें
- TLS settings check करें

### Issue 3: "Environment variables not found"
**Solution:**
- Vercel dashboard में variables properly set करें
- Redeploy करें

### Issue 4: "SMTP connection failed"
**Solution:**
```javascript
// Enhanced configuration
{
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password
  },
  tls: {
    rejectUnauthorized: false
  }
}
```

## 6. Debug Steps

### Step 1: Check Environment Variables
```bash
curl https://your-app.vercel.app/api/check-env
```

### Step 2: Test Email Configuration
```bash
curl https://your-app.vercel.app/api/test-email
```

### Step 3: Check Vercel Logs
```bash
vercel logs your-app-url
```

### Step 4: Local vs Production Test
```javascript
// Local test
npm run dev
// Test: http://localhost:3000/api/test-email

// Production test
// Test: https://your-app.vercel.app/api/test-email
```

## 7. Updated Code Features

### ✅ Retry Logic
- 3 attempts with exponential backoff
- Better error handling

### ✅ Email Verification
- Transporter verification before sending
- Detailed error logging

### ✅ Environment Validation
- Check all required variables
- Clear error messages

### ✅ Debug Logging
- Comprehensive logging
- Error details with codes

## 8. Deployment Checklist

### Before Deploy:
- [ ] Gmail App Password generated
- [ ] All environment variables set in Vercel
- [ ] Local testing successful
- [ ] Code updated with new email utility

### After Deploy:
- [ ] Test `/api/check-env` endpoint
- [ ] Test `/api/test-email` endpoint
- [ ] Test admin login flow
- [ ] Check Vercel function logs

## 9. Alternative Email Services

### If Gmail issues persist:

#### SendGrid:
```javascript
{
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
}
```

#### Mailgun:
```javascript
{
  host: 'smtp.mailgun.org',
  port: 587,
  auth: {
    user: process.env.MAILGUN_SMTP_LOGIN,
    pass: process.env.MAILGUN_SMTP_PASSWORD
  }
}
```

## 10. Final Steps

1. **Generate Gmail App Password**
2. **Update Vercel Environment Variables**
3. **Redeploy Application**
4. **Test Email Functionality**

### Success Indicators:
- ✅ `/api/check-env` shows all variables set
- ✅ `/api/test-email` sends email successfully
- ✅ Admin login sends OTP email
- ✅ No errors in Vercel logs