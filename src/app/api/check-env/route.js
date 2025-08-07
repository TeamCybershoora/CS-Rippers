export async function GET() {
  try {
    const envCheck = {
      EMAIL_USER: process.env.EMAIL_USER ? '✅ Set' : '❌ Missing',
      EMAIL_PASS: process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing',
      ADMIN_EMAIL: process.env.ADMIN_EMAIL ? '✅ Set' : '❌ Missing',
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? '✅ Set' : '❌ Missing',
      ADMIN_SECRET_KEY: process.env.ADMIN_SECRET_KEY ? '✅ Set' : '❌ Missing',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? '✅ Set' : '❌ Missing',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing',
      MONGODB_URI: process.env.MONGODB_URI ? '✅ Set' : '❌ Missing'
    };

    const missingVars = Object.entries(envCheck)
      .filter(([, value]) => value.includes('❌'))
      .map(([key]) => key);

    const allSet = missingVars.length === 0;

    console.log('Environment Variables Check:', envCheck);

    return new Response(JSON.stringify({
      success: allSet,
      message: allSet ? 'All environment variables are set' : `Missing environment variables: ${missingVars.join(', ')}`,
      variables: envCheck,
      missing: missingVars,
      timestamp: new Date().toISOString()
    }), { 
      status: allSet ? 200 : 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Environment check failed:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to check environment variables',
      details: error.message
    }), { status: 500 });
  }
}