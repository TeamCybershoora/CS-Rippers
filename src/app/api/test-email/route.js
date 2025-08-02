import nodemailer from 'nodemailer';

export async function GET() {
  try {
    console.log('Testing email configuration...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify connection
    await transporter.verify();
    console.log('Email transporter verified successfully');

    // Send test email
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to self for testing
      subject: 'CS Rippers - Email Test',
      html: '<h1>Email configuration is working!</h1><p>This is a test email from CS Rippers.</p>'
    });

    console.log('Test email sent successfully:', result.messageId);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Email configuration is working properly',
      messageId: result.messageId
    }), { status: 200 });

  } catch (error) {
    console.error('Email test failed:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      details: error.toString()
    }), { status: 500 });
  }
}