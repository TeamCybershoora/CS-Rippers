import nodemailer from 'nodemailer';

export async function GET() {
  try {
    console.log('=== Simple Email Test ===');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS length:', process.env.EMAIL_PASS?.length);
    console.log('EMAIL_PASS (first 4 chars):', process.env.EMAIL_PASS?.substring(0, 4));

    // Create transporter with minimal config
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log('Transporter created, testing verification...');
    
    // Test verification
    await transporter.verify();
    console.log('✅ Verification successful!');

    return new Response(JSON.stringify({
      success: true,
      message: 'Email configuration verified successfully',
      details: {
        emailUser: process.env.EMAIL_USER,
        passwordLength: process.env.EMAIL_PASS?.length,
        passwordPreview: process.env.EMAIL_PASS?.substring(0, 4) + '...'
      }
    }), { status: 200 });

  } catch (error) {
    console.error('❌ Email test failed:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      details: {
        emailUser: process.env.EMAIL_USER,
        passwordLength: process.env.EMAIL_PASS?.length,
        passwordSet: !!process.env.EMAIL_PASS
      }
    }), { status: 500 });
  }
}