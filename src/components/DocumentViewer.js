import React, { useState } from 'react';
import './DocumentViewer.css';

const DocumentViewer = ({ document, onClose }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!document) return null;

  const { type, fileName, fileData, fallbackSources = [] } = document;

  const getDocumentIcon = (fileName) => {
    if (fileName.toLowerCase().includes('.pdf')) {
      return '📄';
    } else if (fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) {
      return '🖼️';
    } else {
      return '📋';
    }
  };

  const getDocumentTypeName = (type) => {
    return type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  const handleDownload = () => {
    // Create a download link for the document
    const link = document.createElement('a');
    link.href = fileData || '#';
    link.download = fileName;
    link.click();
  };

  const handlePrint = () => {
    // Open print dialog for the document
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print ${fileName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .document-info { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${getDocumentTypeName(type)}</h1>
            <p>Driver Document</p>
          </div>
          <div class="document-info">
            <p><strong>Document Type:</strong> ${getDocumentTypeName(type)}</p>
            <p><strong>File Name:</strong> ${fileName}</p>
            <p><strong>Status:</strong> Uploaded</p>
          </div>
          <p>Document content would be displayed here in a real application.</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="document-viewer-modal">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Document Viewer</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="document-viewer-content">
          {/* Document Image Only */}
          <div className="document-preview">
            {fileData && !imageError ? (
              <div className="document-image-container">
                {imageLoading && (
                  <div className="image-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading document...</p>
                  </div>
                )}
                <img 
                  src={fileData} 
                  alt={getDocumentTypeName(type)}
                  className="document-image"
                  style={{ display: imageLoading ? 'none' : 'block' }}
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    // Try fallback sources if available
                    if (fallbackSources && fallbackSources.length > 0 && currentImageIndex < fallbackSources.length - 1) {
                      const nextIndex = currentImageIndex + 1;
                      setCurrentImageIndex(nextIndex);
                      // Update the image source to the next fallback
                      const img = document.querySelector('.document-image');
                      if (img) {
                        img.src = fallbackSources[nextIndex];
                        setImageLoading(true);
                      }
                    } else {
                      setImageError(true);
                      setImageLoading(false);
                    }
                  }}
                />
              </div>
            ) : (
              <div className="preview-placeholder">
                <div className="preview-icon">
                  {getDocumentIcon(fileName)}
                </div>
                <h3>{imageError ? 'Unable to load document' : 'No document available'}</h3>
                <p>{imageError ? 'Please try again or contact support' : 'Document not found'}</p>
                {imageError && (
                  <button 
                    className="retry-btn" 
                    onClick={() => {
                      setImageError(false);
                      setImageLoading(true);
                      setCurrentImageIndex(0);
                    }}
                  >
                    🔄 Retry
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="close-viewer-btn" onClick={onClose}>
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
