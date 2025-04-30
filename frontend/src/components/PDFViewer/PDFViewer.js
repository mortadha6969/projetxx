import React, { useState } from 'react';
import { FiDownload, FiExternalLink, FiFile } from 'react-icons/fi';

const PDFViewer = ({ pdfUrl, title }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Get the API base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  
  // Helper function to get full URL
  const getFullUrl = (path) => {
    if (!path) return null;
    // If the path already starts with http, it's already a full URL
    if (path.startsWith('http')) return path;
    // If the path starts with /, it's a relative path from the API
    return `${API_BASE_URL}${path}`;
  };
  
  const fullPdfUrl = getFullUrl(pdfUrl);
  
  // Handle loading state
  const handleIframeLoad = () => {
    setIsLoading(false);
  };
  
  // Handle loading error
  const handleIframeError = () => {
    setIsLoading(false);
  };
  
  if (!pdfUrl) {
    return null;
  }
  
  return (
    <div className="pdf-viewer-container">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Campaign Document</h2>
        <div className="flex space-x-2">
          <a 
            href={fullPdfUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            title="Open in new tab"
          >
            <FiExternalLink className="mr-1" />
            <span>Open</span>
          </a>
          <a 
            href={fullPdfUrl} 
            download={`${title || 'campaign'}-document.pdf`}
            className="flex items-center px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            title="Download PDF"
          >
            <FiDownload className="mr-1" />
            <span>Download</span>
          </a>
        </div>
      </div>
      
      <div className="pdf-container relative border border-gray-300 rounded-lg overflow-hidden" style={{ height: '500px' }}>
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
            <p className="text-gray-600">Loading PDF document...</p>
          </div>
        )}
        
        <iframe
          src={`${fullPdfUrl}#toolbar=0&navpanes=0`}
          title="PDF Viewer"
          className="w-full h-full"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
        
        {/* Fallback for browsers that don't support PDF embedding */}
        <object
          data={fullPdfUrl}
          type="application/pdf"
          className="w-full h-full hidden"
        >
          <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-8">
            <FiFile className="text-5xl text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">
              Your browser doesn't support embedded PDFs. 
              You can download the PDF to view it:
            </p>
            <a 
              href={fullPdfUrl} 
              download={`${title || 'campaign'}-document.pdf`}
              className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
            >
              <FiDownload className="mr-2" />
              <span>Download PDF</span>
            </a>
          </div>
        </object>
      </div>
    </div>
  );
};

export default PDFViewer;
