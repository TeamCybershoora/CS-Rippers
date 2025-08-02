import { verifyEmailConfig, sendEmailWithRetry, emailTemplates } from '@/lib/email';

export async function GET() {
  try {
    console.log('Testing email configuration...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');

    // First verify email configuration
    const verificationResult = await verifyEmailConfig();
    if (!verificationResult.success) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Email configuration verification failed',
        details: verificationResult.details
      }), { status: 500 });
    }

    // Send test email using the utility function
    const template = emailTemplates.test();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to self for testing
      subject: template.subject,
      html: template.html
    };

    const result = await sendEmailWithRetry(mailOptions);
    console.log('Test email sent successfully:', result.messageId);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Email configuration is working properly',
      messageId: result.messageId,
      timestamp: new Date().toISOString()
    }), { status: 200 });

  } catch (error) {
    console.error('Email test failed:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      details: {
        stack: error.stack,
        code: error.code,
        command: error.command
      }
    }), { status: 500 });
  }
}