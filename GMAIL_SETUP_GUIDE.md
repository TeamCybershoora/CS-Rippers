# Gmail App Password Setup Guide - CS Rippers

## 🚨 समस्या (Problem)
```
Invalid login: 535-5.7.8 Username and Password not accepted. 
For more information, go to https://support.google.com/mail/?p=BadCredentials
```

## ✅ समाधान (Solution)

### Step 1: Gmail में 2-Step Verification Enable करें

1. **Gmail में login करें** (teamcybershoora@gmail.com)
2. **Google Account Settings** पर जाएं
3. **Security** tab पर click करें
4. **2-Step Verification** को **ON** करें
5. अपना phone number verify करें

### Step 2: App Password Generate करें

1. **Security** page पर **App passwords** पर click करें
2. **Select app** dropdown में **Mail** चुनें
3. **Select device** dropdown में **Other** चुनें
4. **Custom name** में "CS Rippers" लिखें
5. **Generate** button पर click करें
6. **16-character password** copy करें (जैसे: `abcd efgh ijkl mnop`)

### Step 3: Vercel Environment Variables Set करें

1. **Vercel Dashboard** में जाएं
2. **Your Project** → **Settings** → **Environment Variables**
3. निम्नलिखित variables add करें:

```env
EMAIL_USER=teamcybershoora@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop  # आपका App Password (spaces के साथ)
ADMIN_EMAIL=admin@csrippers.com
ADMIN_PASSWORD=CSRippers@2024!
ADMIN_SECRET_KEY=csr_admin_secret_key_2024
```

4. **Production, Preview, Development** सभी environments के लिए set करें
5. **Save** करें

### Step 4: Application Redeploy करें

1. **Vercel Dashboard** में **Deployments** tab पर जाएं
2. **Redeploy** button पर click करें
3. Deployment complete होने का wait करें

### Step 5: Test करें

#### Environment Variables Check:
```bash
curl https://your-app.vercel.app/api/check-env
```

#### Email Configuration Test:
```bash
curl https://your-app.vercel.app/api/test-email
```

#### Admin Login Test:
1. Browser में `https://your-app.vercel.app/admin` जाएं
2. Admin credentials enter करें
3. OTP email check करें

## 🔧 Troubleshooting

### Issue 1: "App passwords not available"
**Solution:** 2-Step Verification enable करें

### Issue 2: "Invalid app password"
**Solution:** 
- App password को spaces के साथ copy करें
- Regular Gmail password नहीं, App password use करें

### Issue 3: "Environment variables not found"
**Solution:**
- Vercel dashboard में variables properly set करें
- Redeploy करें

### Issue 4: "Connection timeout"
**Solution:**
- Gmail service का इस्तेमाल करें
- TLS settings check करें

## 📧 Email Configuration Details

### Gmail SMTP Settings:
- **Host:** smtp.gmail.com
- **Port:** 587 (TLS) या 465 (SSL)
- **Username:** teamcybershoora@gmail.com
- **Password:** App Password (16 characters with spaces)

### Security Requirements:
- ✅ 2-Step Verification: ON
- ✅ App Passwords: Generated
- ✅ Less secure app access: OFF (App password use करने से automatically handle हो जाता है)

## 🎯 Success Indicators

जब सब कुछ सही setup हो जाएगा तो:

1. ✅ `/api/check-env` shows all variables set
2. ✅ `/api/test-email` sends email successfully
3. ✅ Admin login sends OTP email
4. ✅ No errors in Vercel logs

## 📞 Support

अगर अभी भी problem है तो:

1. **Vercel Logs** check करें
2. **Environment variables** verify करें
3. **Gmail App Password** regenerate करें
4. **Application redeploy** करें

---

**Note:** यह guide Gmail App Password के लिए है। Regular Gmail password काम नहीं करेगा क्योंकि Google ने security के लिए App Passwords mandatory कर दिया है। 