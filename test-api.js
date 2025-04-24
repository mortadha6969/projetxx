/**
 * Test script to check the backend API directly
 * Run with: node test-api.js
 */

const axios = require('axios');

// API base URL
const API_BASE_URL = 'http://localhost:3001';

// Test login endpoint
async function testLogin() {
  console.log('Testing login endpoint...');
  
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login`, {
      email: 'test@example.com',
      password: 'Password123!'
    });
    
    console.log('Login successful!');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    return response.data.token;
  } catch (error) {
    console.error('Login failed!');
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Is the server running?');
    } else {
      console.error('Error:', error.message);
    }
    
    return null;
  }
}

// Test register endpoint
async function testRegister() {
  console.log('\nTesting register endpoint...');
  
  try {
    const response = await axios.post(`${API_BASE_URL}/users/register`, {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123!',
      phone: '12345678',
      birthdate: '1990-01-01'
    });
    
    console.log('Registration successful!');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    return response.data.token;
  } catch (error) {
    console.error('Registration failed!');
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Is the server running?');
    } else {
      console.error('Error:', error.message);
    }
    
    return null;
  }
}

// Test profile endpoint
async function testProfile(token) {
  if (!token) {
    console.error('\nSkipping profile test - no token available');
    return;
  }
  
  console.log('\nTesting profile endpoint...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Profile fetch successful!');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
  } catch (error) {
    console.error('Profile fetch failed!');
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Is the server running?');
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run the tests
async function runTests() {
  console.log('=== API TEST SCRIPT ===');
  console.log(`Testing API at: ${API_BASE_URL}`);
  console.log('======================\n');
  
  // First try to register a new user
  let token = await testRegister();
  
  // If registration fails (likely because user already exists), try login
  if (!token) {
    token = await testLogin();
  }
  
  // Test profile endpoint with the token
  await testProfile(token);
  
  console.log('\n=== TEST COMPLETE ===');
}

runTests();
