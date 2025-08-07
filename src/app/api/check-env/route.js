export async function GET() {
  try {
    const envCheck = {
      success: true,
      message: 'Environment variables check',
      variables: {
        EMAIL_USER: {
          set: !!process.env.EMAIL_USER,
          value: process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 3)}...${process.env.EMAIL_USER.substring(process.env.EMAIL_USER.length - 10)}` : 'Not set',
          length: process.env.EMAIL_USER?.length || 0
        },
        EMAIL_PASS: {
          set: !!process.env.EMAIL_PASS,
          value: process.env.EMAIL_PASS ? 'Set (hidden)' : 'Not set',
          length: process.env.EMAIL_PASS?.length || 0,
          isAppPassword: process.env.EMAIL_PASS?.includes(' ') || false
        },
        ADMIN_EMAIL: {
          set: !!process.env.ADMIN_EMAIL,
          value: process.env.ADMIN_EMAIL || 'Not set'
        },
        ADMIN_PASSWORD: {
          set: !!process.env.ADMIN_PASSWORD,
          value: process.env.ADMIN_PASSWORD ? 'Set (hidden)' : 'Not set'
        },
        ADMIN_SECRET_KEY: {
          set: !!process.env.ADMIN_SECRET_KEY,
          value: process.env.ADMIN_SECRET_KEY ? 'Set (hidden)' : 'Not set'
        },
        NODE_ENV: {
          set: !!process.env.NODE_ENV,
          value: process.env.NODE_ENV || 'Not set'
        }
      },
      recommendations: []
    };

    // Add recommendations based on current state
    if (!process.env.EMAIL_USER) {
      envCheck.recommendations.push('EMAIL_USER is not set. Please set your Gmail address.');
    }

    if (!process.env.EMAIL_PASS) {
      envCheck.recommendations.push('EMAIL_PASS is not set. Please generate a Gmail App Password.');
    } else if (!process.env.EMAIL_PASS.includes(' ')) {
      envCheck.recommendations.push('EMAIL_PASS should be a Gmail App Password (16 characters with spaces), not your regular password.');
    }

    if (!process.env.ADMIN_EMAIL) {
      envCheck.recommendations.push('ADMIN_EMAIL is not set for admin panel access.');
    }

    if (!process.env.ADMIN_PASSWORD) {
      envCheck.recommendations.push('ADMIN_PASSWORD is not set for admin panel access.');
    }

    if (!process.env.ADMIN_SECRET_KEY) {
      envCheck.recommendations.push('ADMIN_SECRET_KEY is not set for admin panel security.');
    }

    // Check if all required variables are set
    const requiredVars = ['EMAIL_USER', 'EMAIL_PASS'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      envCheck.success = false;
      envCheck.message = `Missing required environment variables: ${missingVars.join(', ')}`;
    }

    return new Response(JSON.stringify(envCheck, null, 2), {
      status: envCheck.success ? 200 : 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Environment check failed:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      message: 'Failed to check environment variables'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}