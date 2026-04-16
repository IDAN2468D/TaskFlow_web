async function testBridge() {
  try {
    const response = await fetch('http://localhost:3000/bridge/decompose', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: 'Clean the kitchen and buy milk'
      })
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log('Success:', JSON.stringify(data, null, 2));
    } else {
      console.error('Error Response:', response.status, data);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testBridge();
