import nodemailer from 'nodemailer';

export async function GET() {
  try {
    console.log('=== Direct Email Test ===');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Environment variables missing',
        details: {
          EMAIL_USER: !!process.env.EMAIL_USER,
          EMAIL_PASS: !!process.env.EMAIL_PASS
        }
      }), { status: 500 });
    }

    // Create transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      debug: true,
      logger: true
    });

    console.log('Testing transporter verification...');
    
    // Test verification with timeout
    const verifyPromise = transporter.verify();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Verification timeout')), 10000)
    );
    
    await Promise.race([verifyPromise, timeoutPromise]);
    console.log('✅ Verification successful!');

    // Try to send a test email
    console.log('Sending test email...');
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Test Email - CS Rippers',
      text: 'This is a test email from CS Rippers application.',
      html: '<h1>Test Email</h1><p>This is a test email from CS Rippers application.</p>'
    });

    console.log('✅ Email sent successfully:', result.messageId);

    return new Response(JSON.stringify({
      success: true,
      message: 'Email sent successfully',
      messageId: result.messageId,
      details: {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        timestamp: new Date().toISOString()
      }
    }), { status: 200 });

  } catch (error) {
    console.error('❌ Direct email test failed:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      stack: error.stack
    }), { status: 500 });
  }
}