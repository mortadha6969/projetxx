import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!credentials.email || !credentials.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      
      // Make sure the URL is correct for your API endpoint
      const response = await axios.post('http://localhost:3000/users/login', {
        email: credentials.email,
        password: credentials.password
      });
      
      console.log(response);  // For debugging purposes, check the response

      // Store token and username in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.user.username);

      // Redirect to the profile page after successful login
      navigate('/');  // You can change this to your desired route
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
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
          <span>New user? <a href="/Register">Create account</a></span>
        </div>
      </form>
    </div>
  );
};

export default Login;
