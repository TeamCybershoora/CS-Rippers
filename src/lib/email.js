import nodemailer from 'nodemailer';

// Email configuration utility
export function createEmailTransporter() {
  console.log('Creating email transporter...');
  
  // Check if required environment variables are set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email configuration missing: EMAIL_USER and EMAIL_PASS must be set');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    },
    // Enable debug logs only in development
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development'
  });

  return transporter;
}

// Verify email configuration
export async function verifyEmailConfig() {
  try {
    const transporter = createEmailTransporter();
    await transporter.verify();
    console.log('✅ Email configuration verified successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Email configuration verification failed:', error);
    return { 
      success: false, 
      error: error.message,
      details: {
        code: error.code,
        command: error.command,
        response: error.response
      }
    };
  }
}

// Send email with retry logic
export async function sendEmailWithRetry(mailOptions, maxRetries = 3) {
  const transporter = createEmailTransporter();
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📧 Sending email (attempt ${attempt}/${maxRetries})...`);
      
      // Verify before sending
      await transporter.verify();
      
      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', result.messageId);
      return result;
      
    } catch (error) {
      console.error(`❌ Email send attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        throw new Error(`Failed to send email after ${maxRetries} attempts: ${error.message}`);
      }
      
      // Wait before retry (exponential backoff)
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`⏳ Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Email templates
export const emailTemplates = {
  adminOtp: (otp) => ({
    subject: '🔐 CS Rippers Admin Panel - Security Verification',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 16px;">
        <div style="background: rgba(255, 255, 255, 0.95); padding: 30px; border-radius: 12px; text-align: center;">
          <h1 style="color: #333; margin-bottom: 20px; font-size: 24px; font-weight: 600;">Admin Panel Access</h1>
          <p style="color: #666; font-size: 16px; margin-bottom: 30px;">Your secure access code for CS Rippers Admin Panel:</p>
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 32px; font-weight: bold; padding: 20px; border-radius: 8px; letter-spacing: 4px; margin: 20px 0;">${otp}</div>
          <p style="color: #888; font-size: 14px; margin-top: 20px;">This code expires in 10 minutes. Do not share this code with anyone.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">CS Rippers Admin Security System</p>
          </div>
        </div>
      </div>
    `
  }),
  
  test: () => ({
    subject: 'CS Rippers - Email Configuration Test',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333;">✅ Email Configuration Test</h1>
        <p>This is a test email from CS Rippers application.</p>
        <p><strong>Status:</strong> Email configuration is working properly!</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">CS Rippers Email System</p>
      </div>
    `
  })
};