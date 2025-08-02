import nodemailer from 'nodemailer';

export async function GET() {
  try {
    console.log('=== SMTP Configuration Test ===');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS length:', process.env.EMAIL_PASS?.length);
    
    // Try with explicit SMTP configuration
    const transporter = nodemailer.createTransporter({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log('Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified!');

    return new Response(JSON.stringify({
      success: true,
      message: 'SMTP configuration working',
      config: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        user: process.env.EMAIL_USER
      }
    }), { status: 200 });

  } catch (error) {
    console.error('❌ SMTP test failed:', error);
    
    // Try alternative configuration
    try {
      console.log('Trying alternative SMTP config...');
      const altTransporter = nodemailer.createTransporter({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      
      await altTransporter.verify();
      console.log('✅ Alternative SMTP config working!');
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Alternative SMTP configuration working',
        config: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          user: process.env.EMAIL_USER
        }
      }), { status: 200 });
      
    } catch (altError) {
      console.error('❌ Alternative SMTP also failed:', altError);
      
      return new Response(JSON.stringify({
        success: false,
        error: error.message,
        alternativeError: altError.message,
        details: {
          code: error.code,
          command: error.command,
          response: error.response,
          emailUser: process.env.EMAIL_USER,
          passwordLength: process.env.EMAIL_PASS?.length
        }
      }), { status: 500 });
    }
  }
}