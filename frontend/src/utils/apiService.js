/**
 * API Service
 * Centralized service for making API requests
 */

import axios from 'axios';
import { API_ENDPOINTS, createAuthHeader, createMultipartAuthHeader, checkApiAvailability } from '../config/api';

// Create axios instance with default config
const apiClient = axios.create({
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Check API availability on startup
(async () => {
  try {
    const activeUrl = await checkApiAvailability();
    console.log('Using API URL:', activeUrl);
    // Update the API endpoints with the active URL
    Object.keys(API_ENDPOINTS).forEach(key => {
      if (typeof API_ENDPOINTS[key] === 'string') {
        API_ENDPOINTS[key] = API_ENDPOINTS[key].replace(window.ACTIVE_API_URL, activeUrl);
      }
    });
    window.ACTIVE_API_URL = activeUrl;
  } catch (error) {
    console.error('Error checking API availability:', error);
  }
})();

// Add a request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');

      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API service object
const apiService = {
  // Auth methods
  auth: {
    login: async (credentials) => {
      try {
        console.log('API call to:', API_ENDPOINTS.LOGIN);
        console.log('Login credentials:', { email: credentials.email, password: '********' });
        const response = await axios.post(API_ENDPOINTS.LOGIN, credentials);
        console.log('Raw API response:', response);
        return response.data;
      } catch (error) {
        console.error('API login error:', error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
          throw error.response.data || { message: `Server error: ${error.response.status}` };
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
          throw { message: 'No response from server. Please check your connection.' };
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Request setup error:', error.message);
          throw { message: error.message };
        }
      }
    },

    register: async (userData) => {
      try {
        console.log('API call to:', API_ENDPOINTS.REGISTER);
        const response = await axios.post(API_ENDPOINTS.REGISTER, userData);
        console.log('Raw API response:', response);
        return response.data;
      } catch (error) {
        console.error('API register error:', error);
        if (error.response) {
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);

          // Handle specific error types from the backend
          if (error.response.data && error.response.data.name === 'SequelizeUniqueConstraintError') {
            // Extract validation errors
            const validationErrors = error.response.data.errors || [];
            throw {
              message: 'Registration failed due to validation errors',
              errors: validationErrors
            };
          } else if (error.response.data && error.response.data.message) {
            // Use the error message from the backend
            throw { message: error.response.data.message };
          } else {
            // Generic error with status code
            throw { message: `Server error: ${error.response.status}` };
          }
        } else if (error.request) {
          console.error('No response received:', error.request);
          throw { message: 'No response from server. Please check your connection.' };
        } else {
          console.error('Request setup error:', error.message);
          throw { message: error.message };
        }
      }
    },
  },

  // User methods
  user: {
    getProfile: async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.USER_PROFILE);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },

    updateProfile: async (profileData) => {
      try {
        // Handle multipart form data for profile image
        if (profileData instanceof FormData) {
          const token = localStorage.getItem('token');
          const config = createMultipartAuthHeader(token);
          const response = await axios.put(API_ENDPOINTS.UPDATE_PROFILE, profileData, config);
          return response.data;
        } else {
          const response = await apiClient.put(API_ENDPOINTS.UPDATE_PROFILE, profileData);
          return response.data;
        }
      } catch (error) {
        throw error.response?.data || error;
      }
    },

    changePassword: async (passwordData) => {
      try {
        const response = await apiClient.put(API_ENDPOINTS.CHANGE_PASSWORD, passwordData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
  },

  // Campaign methods
  campaigns: {
    getAll: async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.CAMPAIGNS);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },

    getById: async (id) => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.CAMPAIGN_DETAILS(id));
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },

    getUserCampaigns: async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.USER_CAMPAIGNS);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },

    create: async (campaignData) => {
      try {
        // Handle multipart form data for campaign images
        if (campaignData instanceof FormData) {
          const token = localStorage.getItem('token');

          // Log the form data for debugging
          console.log('Form data entries:');
          for (let pair of campaignData.entries()) {
            // Don't log the actual file content, just the field name and file name
            if (pair[1] instanceof File) {
              console.log(pair[0], pair[1].name);
            } else {
              console.log(pair[0], pair[1]);
            }
          }

          // Create config with proper headers
          const config = {
            headers: {
              'Authorization': `Bearer ${token}`,
              // Let the browser set the correct Content-Type with boundary
              'Content-Type': 'multipart/form-data'
            }
          };

          // Make the API call
          const response = await axios.post(API_ENDPOINTS.CREATE_CAMPAIGN, campaignData, config);
          return response.data;
        } else {
          const response = await apiClient.post(API_ENDPOINTS.CREATE_CAMPAIGN, campaignData);
          return response.data;
        }
      } catch (error) {
        console.error('Campaign creation error:', error.response?.data || error);
        throw error.response?.data || error;
      }
    },

    update: async (id, campaignData) => {
      try {
        // Handle multipart form data for campaign images
        if (campaignData instanceof FormData) {
          const token = localStorage.getItem('token');

          // Log the form data for debugging
          console.log('Form data entries for update:');
          for (let pair of campaignData.entries()) {
            // Don't log the actual file content, just the field name and file name
            if (pair[1] instanceof File) {
              console.log(pair[0], pair[1].name);
            } else {
              console.log(pair[0], pair[1]);
            }
          }

          // Create config with proper headers
          const config = {
            headers: {
              'Authorization': `Bearer ${token}`,
              // Let the browser set the correct Content-Type with boundary
              'Content-Type': 'multipart/form-data'
            }
          };

          const response = await axios.put(API_ENDPOINTS.UPDATE_CAMPAIGN(id), campaignData, config);
          return response.data;
        } else {
          const response = await apiClient.put(API_ENDPOINTS.UPDATE_CAMPAIGN(id), campaignData);
          return response.data;
        }
      } catch (error) {
        console.error('Campaign update error:', error.response?.data || error);
        throw error.response?.data || error;
      }
    },

    delete: async (id) => {
      try {
        const response = await apiClient.delete(API_ENDPOINTS.DELETE_CAMPAIGN(id));
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
  },

  // Transaction methods
  transactions: {
    getAll: async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.TRANSACTIONS);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },

    getUserTransactions: async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.USER_TRANSACTIONS);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },

    create: async (transactionData) => {
      try {
        const response = await apiClient.post(API_ENDPOINTS.CREATE_TRANSACTION, transactionData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
  },
};

export default apiService;
