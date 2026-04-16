
const register = async () => {
  try {
    const response = await fetch('http://localhost:3000/bridge/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test' + Date.now() + '@example.com',
        password: 'password123',
        name: 'Test User'
      }),
    });
    const data = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response Data:', data);
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

register();
