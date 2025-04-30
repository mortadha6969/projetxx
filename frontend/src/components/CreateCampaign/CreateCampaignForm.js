import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../utils/apiService';
import { useAuth } from '../../utils/AuthContext';
import LoadingSpinner from '../UI/LoadingSpinner';
import './CreateCampaignForm.css';

const CreateCampaignForm = ({ campaignId, isEditing }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Initialize with empty form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target: '',
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 30 days from now
    category: 'General'
  });

  const [files, setFiles] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [existingFiles, setExistingFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCampaign, setFetchingCampaign] = useState(isEditing);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch campaign data if in editing mode
  useEffect(() => {
    const fetchCampaignData = async () => {
      if (isEditing && campaignId) {
        try {
          setFetchingCampaign(true);
          const campaignData = await apiService.campaigns.getById(campaignId);
          console.log('Fetched campaign data for editing:', campaignData);

          // Format the date to YYYY-MM-DD for the input field
          const formattedEndDate = campaignData.endDate
            ? new Date(campaignData.endDate).toISOString().split('T')[0]
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

          setFormData({
            title: campaignData.title || '',
            description: campaignData.description || '',
            target: campaignData.target?.toString() || '',
            endDate: formattedEndDate,
            category: campaignData.category || 'General'
          });

          // Set existing files if any
          if (campaignData.files && Array.isArray(campaignData.files)) {
            setExistingFiles(campaignData.files);
          }

          // If there's a document URL, show it in the UI
          if (campaignData.documentUrl) {
            console.log('Campaign has a PDF document:', campaignData.documentUrl);
            // We can't set the actual file, but we can indicate that a document exists
            setPdfFile({ name: 'Existing document.pdf', size: 0, isExisting: true });
          }
        } catch (err) {
          console.error('Error fetching campaign data:', err);
          setError('Failed to load campaign data. Please try again.');
        } finally {
          setFetchingCampaign(false);
        }
      }
    };

    fetchCampaignData();
  }, [isEditing, campaignId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files); // ← Files are stored here
  };

  const handlePdfChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setPdfFile(e.target.files[0]); // Store only the first PDF file
    } else {
      setPdfFile(null);
    }
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
        // Use the first file as the main image
        campaignData.append('image', files[0]);

        // Add additional images if available
        if (files.length > 1) {
          // Use the rest of the files as additional images
          for (let i = 1; i < files.length && i <= 4; i++) {
            // Make sure we're using the exact field name expected by the backend
            campaignData.append('additionalImages', files[i]);
          }
        }
      }

      // Add PDF document if available
      if (pdfFile) {
        // Use 'additionalImages' field for PDF files as well
        // The backend will handle it based on the file type
        campaignData.append('additionalImages', pdfFile);
      }

      let response;

      if (isEditing && campaignId) {
        console.log(`Updating campaign ${campaignId} with files:`, files.length);
        // Update existing campaign
        response = await apiService.campaigns.update(campaignId, campaignData);
        console.log('Campaign updated successfully:', response);
        setSuccess(true);

        // Redirect to the campaign page after a delay
        setTimeout(() => {
          navigate(`/campaign/${campaignId}`);
        }, 2000);
      } else {
        console.log('Creating new campaign with files:', files.length);
        // Create new campaign
        response = await apiService.campaigns.create(campaignData);
        console.log('Campaign created successfully:', response);
        setSuccess(true);

        // Reset form for new campaign creation
        setFormData({
          title: '',
          description: '',
          target: '',
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          category: 'General'
        });
        setFiles([]);

        // Redirect to campaigns page after a delay
        setTimeout(() => {
          navigate('/campaigns');
        }, 2000);
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} campaign:`, error);
      setError(error.message || `Failed to ${isEditing ? 'update' : 'create'} campaign. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while fetching campaign data
  if (fetchingCampaign) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="create-campaign-container">
      {success ? (
        <div className="success-message">
          <h2>{isEditing ? 'Campaign Updated Successfully!' : 'Campaign Created Successfully!'}</h2>
          <p>
            {isEditing
              ? 'Your campaign has been updated.'
              : 'Your campaign has been created and is pending approval.'
            }
          </p>
          <p>Redirecting {isEditing ? 'to campaign page' : 'to campaigns page'}...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="create-campaign-form">
          <h2>{isEditing ? 'Update Your Campaign' : 'Create Your Campaign'}</h2>

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
            <label htmlFor="target">Target Amount (DT)</label>
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
            <label htmlFor="files">Campaign Images (Up to 5 images)</label>
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
              Upload up to 5 images for your campaign. The first image will be used as the main image, and the rest will be shown as additional images.
            </small>
            {files.length > 0 && (
              <div className="selected-files">
                <p>Selected {files.length} image(s):</p>
                <ul>
                  {Array.from(files).map((file, index) => (
                    <li key={index}>
                      {index === 0 ? '🌟 ' : '📷 '}
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="pdfDocument">Campaign Document (PDF)</label>
            <input
              type="file"
              id="pdfDocument"
              name="additionalImages"
              accept=".pdf"
              onChange={handlePdfChange}
              disabled={loading}
            />
            <small className="form-text">
              Upload a PDF document with additional information about your campaign (optional).
            </small>
            {pdfFile && (
              <div className="selected-files">
                <p>Selected PDF document:</p>
                <ul>
                  <li>
                    📄 {pdfFile.name}
                    {pdfFile.isExisting ? (
                      <span> (Existing document)</span>
                    ) : (
                      <span> ({(pdfFile.size / 1024).toFixed(1)} KB)</span>
                    )}
                  </li>
                </ul>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading
              ? (isEditing ? 'Updating Campaign...' : 'Creating Campaign...')
              : (isEditing ? 'Update Campaign' : 'Create Campaign')
            }
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateCampaignForm;
