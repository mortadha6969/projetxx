const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

async function testBackendConnection() {
  try {
    console.log('Testing connection to backend server...');
    const response = await axios.get(`${API_BASE_URL}/campaigns`);
    console.log('Connection successful!');
    console.log('Response status:', response.status);
    return true;
  } catch (error) {
    console.error('Connection failed!');
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Is the server running?');
    } else {
      console.error('Error:', error.message);
    }
    
    return false;
  }
}

testBackendConnection();
