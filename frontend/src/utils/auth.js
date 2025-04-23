// src/utils/auth.js

// This function checks if the user is logged in by checking the token in localStorage
export const isAuthenticated = () => {
    return !!localStorage.getItem('token'); // Returns true if the token exists
  };
  