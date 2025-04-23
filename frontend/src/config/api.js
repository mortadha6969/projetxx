/**
 * API Endpoints Configuration
 * This file contains all the API endpoints used in the application
 */

const API_BASE_URL = 'http://localhost:3001';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/users/login`,
  REGISTER: `${API_BASE_URL}/users/register`,
  
  // User endpoints
  USER_PROFILE: `${API_BASE_URL}/users/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
  CHANGE_PASSWORD: `${API_BASE_URL}/users/change-password`,
  
  // Campaign endpoints
  CAMPAIGNS: `${API_BASE_URL}/campaigns`,
  CAMPAIGN_DETAILS: (id) => `${API_BASE_URL}/campaigns/${id}`,
  USER_CAMPAIGNS: `${API_BASE_URL}/campaigns/user`,
  
  // Transaction endpoints
  TRANSACTIONS: `${API_BASE_URL}/transactions`,
  USER_TRANSACTIONS: `${API_BASE_URL}/transactions/user`,
  
  // File uploads
  UPLOADS: `${API_BASE_URL}/uploads`
};

export default API_ENDPOINTS;
