import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, isLoading, error: authError } = useAuth();

  // Pre-fill with test data for easier testing
  // Generate a unique username and email with a timestamp to avoid conflicts
  const timestamp = new Date().getTime().toString().slice(-6);
  const [formData, setFormData] = useState({
    username: `user${timestamp}`,
    email: `user${timestamp}@gmail.com`,
    phone: '12345678',
    birthdate: '1990-01-01',
    password: 'Password123!',
    confirmPassword: 'Password123!'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Update local error state when auth error changes
  useEffect(() => {
    if (authError) {
      setErrors(prev => ({ ...prev, server: authError }));
    }
  }, [authError]);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{8}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number (8 digits required)';
    }

    // Birthdate validation
    if (!formData.birthdate) {
      newErrors.birthdate = 'Birthdate is required';
    } else {
      const birthDate = new Date(formData.birthdate);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      if (age < 13) {
        newErrors.birthdate = 'You must be at least 13 years old';
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must contain: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char';
    }

    // Confirm Password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        console.log('Attempting registration with:', {
          username: formData.username,
          email: formData.email,
          // Don't log the password
        });

        // Prepare the data for registration
        const userData = {
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          birthdate: formData.birthdate,
          password: formData.password
        };

        // Use the register function from auth context
        const result = await register(userData);

        if (result) {
          console.log('Registration successful:', result);
          setIsSubmitted(true);
          setFormData({
            username: '',
            email: '',
            phone: '',
            birthdate: '',
            password: '',
            confirmPassword: ''
          });

          // Redirect to login after a delay
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } catch (error) {
        console.error('Error submitting form:', error);

        // Handle specific error types
        if (error && error.errors) {
          // Handle validation errors
          const newErrors = {};
          error.errors.forEach(err => {
            if (err.path === 'username') {
              newErrors.username = 'This username is already taken. Please choose another.';
            } else if (err.path === 'email') {
              newErrors.email = 'This email is already registered. Please use another email or login.';
            } else {
              newErrors[err.path] = err.message;
            }
          });
          setErrors(prev => ({ ...prev, ...newErrors }));
        } else if (error && error.message) {
          // Handle general error message
          setErrors(prev => ({ ...prev, server: error.message }));
        } else {
          // Handle unknown error
          setErrors(prev => ({ ...prev, server: 'Registration failed. Please try again.' }));
        }
      }
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="auth-container">
      <h1>Sign up</h1>
      <h2>Create Your TrueFunding Account</h2>
      {isSubmitted ? (
        <div className="success-message">
          <h3>🎉 Registration Successful!</h3>
          <p>Welcome to TrueFunding! Check your email to verify your account.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {errors.username && <span className="error">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}

              required
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label>Birthdate:</label>
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              required
            />
            {errors.birthdate && <span className="error">{errors.birthdate}</span>}
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <span className="error">{errors.password}</span>}
            <div className="password-strength">
              <span>Password must contain:</span>
              <ul>
                <li className={formData.password.length >= 8 ? 'valid' : ''}>8+ characters</li>
                <li className={/[A-Z]/.test(formData.password) ? 'valid' : ''}>Uppercase letter</li>
                <li className={/[a-z]/.test(formData.password) ? 'valid' : ''}>Lowercase letter</li>
                <li className={/\d/.test(formData.password) ? 'valid' : ''}>Number</li>
                <li className={/[@$!%*?&]/.test(formData.password) ? 'valid' : ''}>Special character</li>
              </ul>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          {errors.server && <div className="error server-error">{errors.server}</div>}

          <div className="login-prompt">
            Already have an account? <a href="/login">Log in here</a>
          </div>
        </form>
      )}
    </div>
  );
};

export default Register;