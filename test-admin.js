// Simple test to check admin authentication
const testAdminAuth = async () => {
  try {
    console.log('Testing admin authentication...');
    
    // Test login
    const loginResponse = await fetch('http://localhost:3000/api/admin/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'teamcybershoora@gmail.com',
        password: 'cybershoora2@26',
        action: 'login'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    if (loginData.success) {
      console.log('✅ Admin login successful - OTP sent');
      
      // Test users API
      const usersResponse = await fetch('http://localhost:3000/api/admin/users', {
        headers: {
          'Authorization': 'Bearer dummy-token-for-test'
        }
      });
      
      const usersData = await usersResponse.json();
      console.log('Users API response:', usersData);
      
    } else {
      console.log('❌ Admin login failed:', loginData.error);
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
};

// Run test if server is running
if (typeof window === 'undefined') {
  testAdminAuth();
}

module.exports = { testAdminAuth };