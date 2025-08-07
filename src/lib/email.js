import nodemailer from 'nodemailer';

// Email configuration utility
export function createEmailTransporter() {
  console.log('Creating email transporter...');
  
  // Check if required environment variables are set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email configuration missing: EMAIL_USER and EMAIL_PASS must be set');
  }

  // Enhanced Gmail configuration with multiple fallback options
  const configs = [
    // Primary configuration
    {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    },
    // Fallback 1: Explicit SMTP with port 587
    {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    },
    // Fallback 2: Explicit SMTP with port 465
    {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    }
  ];

  // Try each configuration until one works
  for (let i = 0; i < configs.length; i++) {
    try {
      console.log(`Trying email config ${i + 1}/${configs.length}...`);
      const transporter = nodemailer.createTransport(configs[i]);
      
      // Enable debug logs only in development
      if (process.env.NODE_ENV === 'development') {
        transporter.options.debug = true;
        transporter.options.logger = true;
      }
      
      return transporter;
    } catch (error) {
      console.error(`Config ${i + 1} failed:`, error.message);
      if (i === configs.length - 1) {
        throw new Error(`All email configurations failed: ${error.message}`);
      }
    }
  }
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
        response: error.response,
        emailUser: process.env.EMAIL_USER,
        passwordLength: process.env.EMAIL_PASS?.length
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
  otp: (otp, type = 'login') => ({
    subject: `Your CS Rippers ${type === 'login' ? 'Login' : 'Registration'} OTP`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h1 style="color: #333; text-align: center; margin-bottom: 30px;">CS Rippers</h1>
          <h2 style="color: #00b4db; text-align: center; margin-bottom: 20px;">${type === 'login' ? 'Login' : 'Registration'} Verification</h2>
          <p style="color: #666; text-align: center; margin-bottom: 30px;">Your verification code is:</p>
          <div style="text-align: center; margin-bottom: 30px;">
            <span style="font-size: 3rem; font-weight: bold; color: #00b4db; letter-spacing: 5px; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">${otp}</span>
          </div>
          <p style="color: #666; text-align: center; font-size: 14px;">Enter this code to complete your ${type === 'login' ? 'login' : 'registration'}.</p>
          <p style="color: #999; text-align: center; font-size: 12px; margin-top: 30px;">This code will expire in 10 minutes.</p>
        </div>
      </div>
    `
  }),
  
  test: () => ({
    subject: 'CS Rippers - Email Test',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333;">✅ Email Test</h1>
        <p>This is a test email from CS Rippers application.</p>
        <p><strong>Status:</strong> Email configuration is working properly!</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">CS Rippers Email System</p>
      </div>
    `
  })
};