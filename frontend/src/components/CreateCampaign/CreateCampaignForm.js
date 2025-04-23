import React, { useState } from 'react';
import axios from 'axios';
import './CreateCampaignForm.css';

const CreateCampaignForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target: '', // Renamed from goalAmount to target
    status: 'PENDING',
    balance: '',
    imageUrl: '',
  });

  const [files, setFiles] = useState([]); // ← Keep files here

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files); // ← Files are stored here
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('User not authenticated!');
        return;
      }

      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('target', formData.target);  // Changed goalAmount to target
      payload.append('status', formData.status);
      payload.append('balance', formData.balance);
      payload.append('imageUrl', formData.imageUrl);

      if (files.length > 0) {
        Array.from(files).forEach((file) => {
          payload.append('files', file); // Backend expects files to be appended here
        });
      }

      const response = await axios.post('http://localhost:3000/campaigns', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Campaign created successfully:', response.data);
      // Optionally redirect or show success message
    } catch (error) {
      console.error('Error creating campaign:', error.response?.data || error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-campaign-form">
      <h2>Create Your Campaign</h2>

      <div className="form-group">
        <label htmlFor="title">Campaign Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
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
        />
      </div>

      <div className="form-group">
        <label htmlFor="target">Target Amount</label> {/* Renamed from goalAmount to target */}
        <input
          type="number"
          id="target"
          name="target"
          value={formData.target}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="PENDING">PENDING</option>
          <option value="ACTIVE">ACTIVE</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="balance">Balance</label>
        <input
          type="number"
          id="balance"
          name="balance"
          value={formData.balance}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="imageUrl">Campaign Image URL</label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="files">Upload Files</label>
        <input
          type="file"
          id="files"
          name="files"
          multiple
          onChange={handleFileChange}
        />
      </div>

      <button type="submit" className="submit-btn">Create Campaign</button>
    </form>
  );
};

export default CreateCampaignForm;
