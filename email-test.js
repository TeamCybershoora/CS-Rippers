// Simple email test script
const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  console.log('Starting email test...');
  console.log('Email configuration:', {
    user: process.env.EMAIL_USER ? 'Set (hidden)' : 'Not set',
    pass: process.env.EMAIL_PASS ? 'Set (hidden)' : 'Not set'
  });

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      },
      debug: true,
      logger: true
    });

    console.log('Verifying email configuration...');
    await transporter.verify();
    console.log('✅ Email configuration verified successfully');

    // Send test email
    console.log('Sending test email...');
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to self
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
    });

    console.log('✅ Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Email test failed:', error);
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      response: error.response
    });
    throw error;
  }
}

// Run the test
testEmail()
  .then(() => console.log('Test completed successfully'))
  .catch(err => console.log('Test failed with error:', err.message))
  .finally(() => process.exit());