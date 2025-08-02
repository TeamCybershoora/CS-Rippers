import nodemailer from 'nodemailer';

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendAdminOtpEmail(email, otp) {
  console.log('Attempting to send OTP email to:', email);
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
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
  };

  const result = await transporter.sendMail(mailOptions);
  console.log('Admin OTP email sent successfully to:', email);
  return result;
}

// Store OTPs temporarily (in production, use Redis or database)
const adminOtpStore = new Map();

export async function POST(request) {
  try {
    console.log('Admin auth request received');
    const body = await request.json();
    const { email, password, otp, action } = body;
    
    console.log('Request data:', { email, action, hasPassword: !!password, hasOtp: !!otp });

    if (action === 'login') {
      console.log('Processing login request');
      console.log('Environment check:', {
        adminEmail: process.env.ADMIN_EMAIL ? 'Set' : 'Not set',
        adminPassword: process.env.ADMIN_PASSWORD ? 'Set' : 'Not set',
        emailUser: process.env.EMAIL_USER ? 'Set' : 'Not set',
        emailPass: process.env.EMAIL_PASS ? 'Set' : 'Not set'
      });

      // Validate admin credentials
      if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
        console.log('Invalid credentials provided');
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Invalid admin credentials' 
        }), { status: 401 });
      }

      // Generate and send OTP
      const generatedOtp = generateOtp();
      console.log('Generated OTP:', generatedOtp);
      
      adminOtpStore.set(email, {
        otp: generatedOtp,
        timestamp: Date.now(),
        attempts: 0
      });

      try {
        await sendAdminOtpEmail(email, generatedOtp);
        console.log('Admin OTP sent successfully to email');
      } catch (emailError) {
        console.error('Failed to send admin OTP email:', emailError);
        // Remove OTP from store since email failed
        adminOtpStore.delete(email);
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Failed to send OTP email. Please check your email configuration or try again later.' 
        }), { status: 500 });
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'OTP sent to admin email',
        requiresOtp: true
      }), { status: 200 });
    }

    if (action === 'verify-otp') {
      console.log('Processing OTP verification');
      const storedData = adminOtpStore.get(email);
      
      if (!storedData) {
        console.log('No stored OTP data found for email:', email);
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'OTP expired or not found' 
        }), { status: 400 });
      }

      console.log('Stored OTP data:', { 
        hasOtp: !!storedData.otp, 
        timestamp: storedData.timestamp, 
        attempts: storedData.attempts 
      });

      // Check if OTP is expired (10 minutes)
      if (Date.now() - storedData.timestamp > 10 * 60 * 1000) {
        console.log('OTP expired');
        adminOtpStore.delete(email);
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'OTP expired' 
        }), { status: 400 });
      }

      // Check attempts
      if (storedData.attempts >= 3) {
        console.log('Too many failed attempts');
        adminOtpStore.delete(email);
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Too many failed attempts' 
        }), { status: 429 });
      }

      if (storedData.otp !== otp) {
        console.log('Invalid OTP provided. Expected:', storedData.otp, 'Got:', otp);
        storedData.attempts++;
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Invalid OTP',
          attemptsLeft: 3 - storedData.attempts
        }), { status: 400 });
      }

      // OTP verified successfully
      console.log('OTP verified successfully');
      adminOtpStore.delete(email);
      
      // Generate admin session token
      const adminToken = Buffer.from(`${email}:${Date.now()}:${process.env.ADMIN_SECRET_KEY}`).toString('base64');

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Admin authenticated successfully',
        token: adminToken,
        admin: {
          email: email,
          role: 'admin',
          loginTime: new Date().toISOString()
        }
      }), { status: 200 });
    }

    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Invalid action' 
    }), { status: 400 });

  } catch (error) {
    console.error('Admin auth error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    }), { status: 500 });
  }
}

// Verify admin token
export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'No token provided' 
      }), { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [email, timestamp, secretKey] = decoded.split(':');

    if (email !== process.env.ADMIN_EMAIL || secretKey !== process.env.ADMIN_SECRET_KEY) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid token' 
      }), { status: 401 });
    }

    // Check if token is expired (24 hours)
    if (Date.now() - parseInt(timestamp) > 24 * 60 * 60 * 1000) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Token expired' 
      }), { status: 401 });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      admin: {
        email: email,
        role: 'admin',
        loginTime: new Date(parseInt(timestamp)).toISOString()
      }
    }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Invalid token format' 
    }), { status: 401 });
  }
}