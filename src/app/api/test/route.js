export async function GET() {
  return new Response(JSON.stringify({
    success: true,
    message: 'API is working',
    timestamp: new Date().toISOString(),
    env: {
      adminEmail: process.env.ADMIN_EMAIL ? 'Set' : 'Not set',
      adminPassword: process.env.ADMIN_PASSWORD ? 'Set' : 'Not set',
      emailUser: process.env.EMAIL_USER ? 'Set' : 'Not set',
      emailPass: process.env.EMAIL_PASS ? 'Set' : 'Not set',
      adminSecretKey: process.env.ADMIN_SECRET_KEY ? 'Set' : 'Not set'
    }
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    return new Response(JSON.stringify({
      success: true,
      message: 'POST request received',
      receivedData: body,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}