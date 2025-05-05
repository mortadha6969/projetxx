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

// API version
const API_VERSION = 'v1';
const API_PREFIX = `/api/${API_VERSION}`;

// API endpoints object
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${ACTIVE_API_URL}${API_PREFIX}/users/login`,
  REGISTER: `${ACTIVE_API_URL}${API_PREFIX}/users/register`,

  // User endpoints
  USER_PROFILE: `${ACTIVE_API_URL}${API_PREFIX}/users/profile`,
  UPDATE_PROFILE: `${ACTIVE_API_URL}${API_PREFIX}/users/profile`,
  CHANGE_PASSWORD: `${ACTIVE_API_URL}${API_PREFIX}/users/change-password`,
  USER_DONATE: `${ACTIVE_API_URL}${API_PREFIX}/users/donate`,

  // Campaign endpoints
  CAMPAIGNS: `${ACTIVE_API_URL}${API_PREFIX}/campaigns`,
  CAMPAIGN_DETAILS: (id) => `${ACTIVE_API_URL}${API_PREFIX}/campaigns/${id}`,
  USER_CAMPAIGNS: `${ACTIVE_API_URL}${API_PREFIX}/campaigns/user`,
  CREATE_CAMPAIGN: `${ACTIVE_API_URL}${API_PREFIX}/campaigns`,
  UPDATE_CAMPAIGN: (id) => `${ACTIVE_API_URL}${API_PREFIX}/campaigns/${id}`,
  DELETE_CAMPAIGN: (id) => `${ACTIVE_API_URL}${API_PREFIX}/campaigns/${id}`,

  // Transaction endpoints
  TRANSACTIONS: `${ACTIVE_API_URL}${API_PREFIX}/transactions`,
  USER_TRANSACTIONS: `${ACTIVE_API_URL}${API_PREFIX}/transactions/user`,
  CREATE_TRANSACTION: `${ACTIVE_API_URL}${API_PREFIX}/transactions`,

  // Withdrawal endpoints
  REQUEST_WITHDRAWAL: `${ACTIVE_API_URL}${API_PREFIX}/withdrawals/request`,
  CHECK_WITHDRAWAL_ELIGIBILITY: (campaignId) => `${ACTIVE_API_URL}${API_PREFIX}/withdrawals/check/${campaignId}`,

  // Konnect payment endpoints
  KONNECT_INIT_PAYMENT: `${ACTIVE_API_URL}${API_PREFIX}/konnect/init-payment`,
  KONNECT_PAYMENT_DETAILS: (paymentRef) => `${ACTIVE_API_URL}${API_PREFIX}/konnect/payment/${paymentRef}`,
  KONNECT_VERIFY_PAYMENT: (paymentRef) => `${ACTIVE_API_URL}${API_PREFIX}/konnect/verify/${paymentRef}`,

  // File uploads
  UPLOADS: `${ACTIVE_API_URL}/uploads`, // This stays the same as it's a static path

  // Health check
  HEALTH_CHECK: `${ACTIVE_API_URL}/health-check`, // This stays the same for compatibility

  // Admin endpoints
  ADMIN_USERS: `${ACTIVE_API_URL}${API_PREFIX}/admin/users`,
  ADMIN_USER_DETAILS: (id) => `${ACTIVE_API_URL}${API_PREFIX}/admin/users/${id}`,
  ADMIN_CAMPAIGNS: `${ACTIVE_API_URL}${API_PREFIX}/admin/campaigns`,
  ADMIN_CAMPAIGN_DETAILS: (id) => `${ACTIVE_API_URL}${API_PREFIX}/admin/campaigns/${id}`,
  ADMIN_DASHBOARD: `${ACTIVE_API_URL}${API_PREFIX}/admin/dashboard`,

  // Debug admin endpoints (no authentication required)
  DEBUG_ADMIN_USERS: `${ACTIVE_API_URL}/debug-admin/users`, // These stay the same as they're for debugging
  DEBUG_ADMIN_CAMPAIGNS: `${ACTIVE_API_URL}/debug-admin/campaigns`,
  DEBUG_ADMIN_DASHBOARD: `${ACTIVE_API_URL}/debug-admin/dashboard`,

  // Legacy endpoints (for backward compatibility)
  LEGACY: {
    LOGIN: `${ACTIVE_API_URL}/users/login`,
    REGISTER: `${ACTIVE_API_URL}/users/register`,
    USER_PROFILE: `${ACTIVE_API_URL}/users/profile`,
    CAMPAIGNS: `${ACTIVE_API_URL}/campaigns`,
    ADMIN_DASHBOARD: `${ACTIVE_API_URL}/admin/dashboard`
  }
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
