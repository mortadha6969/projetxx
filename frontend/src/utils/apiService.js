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
    // Log the error for debugging
    console.error('API Error:', error);

    // Handle different types of errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);

      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear local storage and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('username');
          localStorage.removeItem('userRole');

          // Only redirect if we're not already on the login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;

        case 403:
          // Forbidden - user doesn't have permission
          console.error('Permission denied');
          break;

        case 404:
          // Not found
          console.error('Resource not found');
          break;

        case 422:
          // Validation error
          console.error('Validation error:', error.response.data);
          break;

        case 500:
          // Server error
          console.error('Server error');
          break;
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
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
        console.log('Fetching user profile...');
        const response = await apiClient.get(API_ENDPOINTS.USER_PROFILE);
        console.log('User profile response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching user profile:', error);
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

    donate: async (donationData) => {
      try {
        console.log('Making donation with data:', donationData);
        const response = await apiClient.post(API_ENDPOINTS.USER_DONATE, donationData);
        console.log('Donation response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error making donation:', error);
        throw error.response?.data || error;
      }
    },
  },

  // Campaign methods
  campaigns: {
    getAll: async (params = {}) => {
      try {
        console.log('API call to get campaigns with params:', params);
        console.log('API endpoint:', API_ENDPOINTS.CAMPAIGNS);

        // Try the versioned endpoint first
        try {
          const response = await apiClient.get(API_ENDPOINTS.CAMPAIGNS, { params });
          console.log('API response status:', response.status);
          return response.data;
        } catch (versionedError) {
          console.error('Error with versioned API, trying legacy endpoint:', versionedError);

          // If that fails, try the legacy endpoint
          if (API_ENDPOINTS.LEGACY && API_ENDPOINTS.LEGACY.CAMPAIGNS) {
            console.log('Trying legacy endpoint:', API_ENDPOINTS.LEGACY.CAMPAIGNS);
            const legacyResponse = await axios.get(API_ENDPOINTS.LEGACY.CAMPAIGNS, { params });
            return legacyResponse.data;
          } else {
            throw versionedError;
          }
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        // Provide more detailed error information
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
        console.error('Error details:', errorMessage);

        // Return empty array instead of throwing to prevent UI errors
        return [];
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
        console.log('Fetching user campaigns from:', API_ENDPOINTS.USER_CAMPAIGNS);
        const response = await apiClient.get(API_ENDPOINTS.USER_CAMPAIGNS);
        console.log('User campaigns response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching user campaigns:', error);
        throw error.response?.data || error;
      }
    },

    create: async (campaignData) => {
      try {
        // Handle multipart form data for campaign images
        if (campaignData instanceof FormData) {
          const token = localStorage.getItem('token');

          // Debug token
          console.log('Token exists:', !!token);
          if (token) {
            console.log('Token preview:', token.substring(0, 20) + '...');

            try {
              // Parse the token (just for debugging)
              const tokenParts = token.split('.');
              if (tokenParts.length === 3) {
                const payload = JSON.parse(atob(tokenParts[1]));
                console.log('Token payload:', payload);
                console.log('Token expiration:', new Date(payload.exp * 1000).toLocaleString());
              }
            } catch (e) {
              console.error('Error parsing token:', e);
            }
          }

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

          // Log the API endpoint for debugging
          console.log('Posting to campaign creation endpoint:', API_ENDPOINTS.CREATE_CAMPAIGN);

          // Try using the legacy endpoint if the versioned one fails
          try {
            // First try with the versioned endpoint
            const response = await axios.post(API_ENDPOINTS.CREATE_CAMPAIGN, campaignData, config);
            return response.data;
          } catch (error) {
            console.error('Error with versioned API, trying legacy endpoint:', error);

            // If that fails, try the legacy endpoint
            if (API_ENDPOINTS.LEGACY && API_ENDPOINTS.LEGACY.CAMPAIGNS) {
              console.log('Trying legacy endpoint:', API_ENDPOINTS.LEGACY.CAMPAIGNS);
              const legacyResponse = await axios.post(API_ENDPOINTS.LEGACY.CAMPAIGNS, campaignData, config);
              return legacyResponse.data;
            } else {
              throw error;
            }
          }
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

  // Konnect payment methods
  konnect: {
    initializePayment: async (paymentData) => {
      try {
        const response = await apiClient.post(API_ENDPOINTS.KONNECT_INIT_PAYMENT, paymentData);
        return response.data;
      } catch (error) {
        console.error('Error initializing Konnect payment:', error);
        throw error.response?.data || error;
      }
    },

    getPaymentDetails: async (paymentRef) => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.KONNECT_PAYMENT_DETAILS(paymentRef));
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },

    verifyPayment: async (paymentRef, campaignId, amount) => {
      try {
        let url = `${API_ENDPOINTS.KONNECT_VERIFY_PAYMENT(paymentRef)}?`;

        if (campaignId) {
          url += `campaign=${campaignId}`;
        }

        if (amount) {
          url += `${campaignId ? '&' : ''}amount=${amount}`;
        }

        console.log('Verification URL:', url);
        const response = await apiClient.get(url);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    }
  },

  // Admin methods
  admin: {
    getUsers: async () => {
      try {
        // Try the debug endpoint first
        try {
          console.log('Trying debug admin users endpoint...');
          const response = await axios.get(API_ENDPOINTS.DEBUG_ADMIN_USERS);
          console.log('Debug admin users response:', response.data);
          return response.data;
        } catch (debugError) {
          console.error('Debug admin users error:', debugError);
          // Fall back to the regular endpoint
          console.log('Falling back to regular admin users endpoint...');
          const response = await apiClient.get(API_ENDPOINTS.ADMIN_USERS);
          return response.data;
        }
      } catch (error) {
        console.error('Admin getUsers error:', error);
        throw error.response?.data || error;
      }
    },

    getUserById: async (id) => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.ADMIN_USER_DETAILS(id));
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },

    updateUser: async (id, userData) => {
      try {
        const response = await apiClient.put(API_ENDPOINTS.ADMIN_USER_DETAILS(id), userData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },

    deleteUser: async (id) => {
      try {
        const response = await apiClient.delete(API_ENDPOINTS.ADMIN_USER_DETAILS(id));
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },

    getCampaigns: async () => {
      try {
        // Try the debug endpoint first
        try {
          console.log('Trying debug admin campaigns endpoint...');
          const response = await axios.get(API_ENDPOINTS.DEBUG_ADMIN_CAMPAIGNS);
          console.log('Debug admin campaigns response:', response.data);
          return response.data;
        } catch (debugError) {
          console.error('Debug admin campaigns error:', debugError);
          // Fall back to the regular endpoint
          console.log('Falling back to regular admin campaigns endpoint...');
          const response = await apiClient.get(API_ENDPOINTS.ADMIN_CAMPAIGNS);
          return response.data;
        }
      } catch (error) {
        console.error('Admin getCampaigns error:', error);
        throw error.response?.data || error;
      }
    },

    deleteCampaign: async (id) => {
      try {
        const response = await apiClient.delete(API_ENDPOINTS.ADMIN_CAMPAIGN_DETAILS(id));
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },

    getDashboardStats: async () => {
      try {
        // Try the debug endpoint first
        try {
          console.log('Trying debug admin dashboard endpoint...');
          const response = await axios.get(API_ENDPOINTS.DEBUG_ADMIN_DASHBOARD);
          console.log('Debug admin dashboard response:', response.data);
          return response.data;
        } catch (debugError) {
          console.error('Debug admin dashboard error:', debugError);
          // Fall back to the regular endpoint
          console.log('Falling back to regular admin dashboard endpoint...');
          const response = await apiClient.get(API_ENDPOINTS.ADMIN_DASHBOARD);
          return response.data;
        }
      } catch (error) {
        console.error('Admin getDashboardStats error:', error);
        throw error.response?.data || error;
      }
    },
  },
};

export default apiService;
