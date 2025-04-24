import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import './Login.css';

const Login = () => {
  // Pre-fill with test credentials for easier testing
  const [credentials, setCredentials] = useState({
    email: 'user@gmail.com',
    password: 'password123'
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get login function and loading state from auth context
  const { login, isAuthenticated, isLoading, error: authError } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to the page the user was trying to access, or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Update local error state when auth error changes
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!credentials.email || !credentials.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      console.log('Submitting login with credentials:', {
        email: credentials.email,
        password: '********' // Don't log actual password
      });

      // Use the login function from auth context
      await login(credentials);
      console.log('Login successful, redirect will happen via useEffect');

      // No need to manually redirect - the useEffect will handle it
    } catch (err) {
      // Most error handling is done through the auth context
      console.error('Login component caught error:', err);

      // If there's a specific error message we want to display
      if (err && err.message) {
        setError(err.message);
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        // Default error message
        setError('Login failed. Please check your credentials and try again.');
      }

      // Log additional debugging information
      if (err && err.status === 401) {
        console.log('Authentication failed. Please check your credentials.');
      } else if (err && err.status >= 500) {
        console.log('Server error. Please try again later.');
      }
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login on TrueFunding</h2>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              disabled={isLoading}
            />
            <button
              type="button"
              className="show-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          type="submit"
          className="login-button"
          disabled={isLoading}
        >
          {isLoading ? 'Authenticating...' : 'Sign In'}
        </button>

        <div className="additional-options">
          <a href="/forgot-password">Forgot Password?</a>
          <span>New user? <a href="/register">Create account</a></span>
        </div>
      </form>
    </div>
  );
};

export default Login;
