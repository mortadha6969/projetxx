import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../utils/apiService';
import { useAuth } from '../../utils/AuthContext';
import './CreateCampaignForm.css';

const CreateCampaignForm = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();

  // Pre-fill with test data for easier testing
  const [formData, setFormData] = useState({
    title: 'Test Campaign',
    description: 'This is a test campaign created for demonstration purposes. It showcases the features of our crowdfunding platform.',
    target: '1000',
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 30 days from now
    category: 'Technology'
  });

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files); // ← Files are stored here
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset states
    setError(null);
    setSuccess(false);

    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);

      // Create FormData object
      const campaignData = new FormData();
      campaignData.append('title', formData.title);
      campaignData.append('description', formData.description);
      campaignData.append('target', formData.target);
      campaignData.append('endDate', formData.endDate);
      campaignData.append('category', formData.category);

      // Add main image if available
      if (files.length > 0) {
        campaignData.append('image', files[0]);

        // Add additional images if available
        if (files.length > 1) {
          for (let i = 1; i < files.length; i++) {
            campaignData.append('additionalImages', files[i]);
          }
        }
      }

      // Send request to create campaign
      const response = await apiService.campaigns.create(campaignData);

      console.log('Campaign created successfully:', response);
      setSuccess(true);

      // Reset form
      setFormData({
        title: '',
        description: '',
        target: '',
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        category: 'General'
      });
      setFiles([]);

      // Redirect to campaign page after a delay
      setTimeout(() => {
        navigate('/campaign');
      }, 2000);

    } catch (error) {
      console.error('Error creating campaign:', error);
      setError(error.message || 'Failed to create campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-campaign-container">
      {success ? (
        <div className="success-message">
          <h2>Campaign Created Successfully!</h2>
          <p>Your campaign has been created and is pending approval.</p>
          <p>Redirecting to campaigns page...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="create-campaign-form">
          <h2>Create Your Campaign</h2>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="title">Campaign Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Campaign Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              disabled={loading}
              rows="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="target">Target Amount ($)</label>
            <input
              type="number"
              id="target"
              name="target"
              value={formData.target}
              onChange={handleChange}
              required
              min="1"
              step="0.01"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="General">General</option>
              <option value="Technology">Technology</option>
              <option value="Education">Education</option>
              <option value="Medical">Medical</option>
              <option value="Community">Community</option>
              <option value="Creative">Creative</option>
              <option value="Business">Business</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="files">Campaign Images</label>
            <input
              type="file"
              id="files"
              name="files"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
            />
            <small className="form-text">
              Upload at least one image for your campaign. The first image will be used as the main image.
            </small>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating Campaign...' : 'Create Campaign'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateCampaignForm;
