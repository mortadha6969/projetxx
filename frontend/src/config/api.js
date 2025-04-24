/**
 * API Endpoints Configuration
 * This file contains all the API endpoints used in the application
 */

// Get the API base URL from environment variables or use default
// The backend server is running on port 3001 or 3002 if 3001 is in use
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Function to check if the primary API is available, otherwise use the fallback
const checkApiAvailability = async () => {
  try {
    // Try the primary API URL
    const response = await fetch(`${API_BASE_URL}/health-check`, {
      method: 'HEAD',
      timeout: 2000
    });
    return API_BASE_URL;
  } catch (error) {
    console.log('Primary API not available, trying fallback...');
    // Try the fallback API URL
    const fallbackUrl = API_BASE_URL.replace('3001', '3002');
    try {
      await fetch(`${fallbackUrl}/health-check`, {
        method: 'HEAD',
        timeout: 2000
      });
      console.log('Using fallback API URL:', fallbackUrl);
      return fallbackUrl;
    } catch (fallbackError) {
      console.log('Fallback API not available either, using primary URL');
      return API_BASE_URL;
    }
  }
};

// Use the primary API URL for now, we'll check availability when making requests
let ACTIVE_API_URL = API_BASE_URL;

// Export the checkApiAvailability function
export { checkApiAvailability };

// API endpoints object
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${ACTIVE_API_URL}/users/login`,
  REGISTER: `${ACTIVE_API_URL}/users/register`,

  // User endpoints
  USER_PROFILE: `${ACTIVE_API_URL}/users/profile`,
  UPDATE_PROFILE: `${ACTIVE_API_URL}/users/profile`,
  CHANGE_PASSWORD: `${ACTIVE_API_URL}/users/change-password`,

  // Campaign endpoints
  CAMPAIGNS: `${ACTIVE_API_URL}/campaigns`,
  CAMPAIGN_DETAILS: (id) => `${ACTIVE_API_URL}/campaigns/${id}`,
  USER_CAMPAIGNS: `${ACTIVE_API_URL}/campaigns/user`,
  CREATE_CAMPAIGN: `${ACTIVE_API_URL}/campaigns`,
  UPDATE_CAMPAIGN: (id) => `${ACTIVE_API_URL}/campaigns/${id}`,
  DELETE_CAMPAIGN: (id) => `${ACTIVE_API_URL}/campaigns/${id}`,

  // Transaction endpoints
  TRANSACTIONS: `${ACTIVE_API_URL}/transactions`,
  USER_TRANSACTIONS: `${ACTIVE_API_URL}/transactions/user`,
  CREATE_TRANSACTION: `${ACTIVE_API_URL}/transactions`,

  // File uploads
  UPLOADS: `${ACTIVE_API_URL}/uploads`,

  // Health check
  HEALTH_CHECK: `${ACTIVE_API_URL}/health-check`,

  // Admin endpoints
  ADMIN_USERS: `${ACTIVE_API_URL}/admin/users`,
  ADMIN_USER_DETAILS: (id) => `${ACTIVE_API_URL}/admin/users/${id}`,
  ADMIN_CAMPAIGNS: `${ACTIVE_API_URL}/admin/campaigns`,
  ADMIN_CAMPAIGN_DETAILS: (id) => `${ACTIVE_API_URL}/admin/campaigns/${id}`,
  ADMIN_DASHBOARD: `${ACTIVE_API_URL}/admin/dashboard`,

  // Debug admin endpoints (no authentication required)
  DEBUG_ADMIN_USERS: `${ACTIVE_API_URL}/debug-admin/users`,
  DEBUG_ADMIN_CAMPAIGNS: `${ACTIVE_API_URL}/debug-admin/campaigns`,
  DEBUG_ADMIN_DASHBOARD: `${ACTIVE_API_URL}/debug-admin/dashboard`
};

// Helper function to create headers with authentication
export const createAuthHeader = (token) => {
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// Helper function to create multipart form headers with authentication
export const createMultipartAuthHeader = (token) => {
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  };
};

export default API_ENDPOINTS;
