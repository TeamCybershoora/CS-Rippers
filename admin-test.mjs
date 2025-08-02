// Admin login test script
import 'dotenv/config';
import fetch from 'node-fetch';

async function testAdminLogin() {
  console.log('Starting admin login test...');
  console.log('Admin configuration:', {
    adminEmail: process.env.ADMIN_EMAIL ? 'Set (hidden)' : 'Not set',
    adminPassword: process.env.ADMIN_PASSWORD ? 'Set (hidden)' : 'Not set',
    adminSecretKey: process.env.ADMIN_SECRET_KEY ? 'Set (hidden)' : 'Not set'
  });

  try {
    // Test admin login
    console.log('Testing admin login...');
    const loginResponse = await fetch('http://localhost:3000/api/admin/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        action: 'login'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);

    if (!loginData.success) {
      throw new Error(`Login failed: ${loginData.error}`);
    }

    console.log('✅ Admin login successful, OTP sent');
    return loginData;
  } catch (error) {
    console.error('❌ Admin login test failed:', error);
    throw error;
  }
}

// Run the test
testAdminLogin()
  .then(() => console.log('Test completed successfully'))
  .catch(err => console.log('Test failed with error:', err.message))
  .finally(() => process.exit());