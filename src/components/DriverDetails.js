import React, { useState } from 'react';
import DocumentViewer from './DocumentViewer';
import './DriverDetails.css';

const DriverDetails = ({ driver, onClose, onEdit, onDelete }) => {
  const [editingDocument, setEditingDocument] = useState(null);
  const [viewingDocument, setViewingDocument] = useState(null);

  if (!driver) return null;

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleEditDriver = () => {
    if (onEdit) {
      onEdit(driver);
    }
  };

  const handleDeleteDriver = () => {
    if (window.confirm(`Are you sure you want to delete ${driver.name}? This action cannot be undone.`)) {
      if (onDelete) {
        onDelete(driver.id);
      }
    }
  };

  const handleDocumentEdit = (documentType) => {
    setEditingDocument(documentType);
  };

  const handleDocumentUpload = (event, documentType) => {
    const file = event.target.files[0];
    if (file) {
      console.log(`Uploading ${documentType}:`, file.name);
      
      // Convert file to base64 for persistent storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedDriver = {
          ...driver,
          documents: {
            ...driver.documents,
            [documentType]: {
              name: file.name,
              data: e.target.result, // Base64 data for persistence
              type: file.type,
              size: file.size
            }
          }
        };
        
        // Update localStorage
        const existingDrivers = JSON.parse(localStorage.getItem('drivers') || '[]');
        const updatedDrivers = existingDrivers.map(d => 
          d.id === driver.id ? updatedDriver : d
        );
        localStorage.setItem('drivers', JSON.stringify(updatedDrivers));
        
        // Also save individual driver data
        localStorage.setItem(`driver_${driver.id}`, JSON.stringify(updatedDriver));
        
        console.log('Document updated:', documentType, file.name);
        console.log('Updated driver documents:', updatedDriver.documents);
        
        // Update the driver in the parent component
        if (onEdit) {
          onEdit(updatedDriver);
        }
        
        // Show success message
        alert(`Document "${file.name}" uploaded successfully!`);
        
        setEditingDocument(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleViewDocument = (documentType, documentData) => {
    console.log(`Viewing ${documentType}:`, documentData);
    
    // Use the actual uploaded file data
    if (documentData && documentData.data) {
      setViewingDocument({
        type: documentType,
        fileName: documentData.name,
        fileData: documentData.data, // Use base64 data for display
        fileType: documentData.type,
        fileSize: documentData.size
      });
    } else {
      // Fallback to placeholder if no file data
      const documentTypeName = documentType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      const randomId = Math.floor(Math.random() * 1000);
      
      const imageSources = [
        `https://picsum.photos/600/400?random=${randomId}`,
        `https://via.placeholder.com/600x400/2196f3/ffffff?text=${encodeURIComponent(documentTypeName)}`
      ];
      
      setViewingDocument({
        type: documentType,
        fileName: documentData?.name || 'Unknown',
        fileData: imageSources[0],
        fallbackSources: imageSources.slice(1)
      });
    }
  };

  const handleCloseDocumentViewer = () => {
    setViewingDocument(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="driver-details-modal">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Driver Details</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="driver-details-content">
          {/* Driver Avatar and Basic Info */}
          <div className="driver-header">
            <div className="driver-avatar-large">
              {getInitials(driver.name)}
            </div>
            <div className="driver-basic-info">
              <h2>{driver.name}</h2>
              <p className="driver-email">{driver.email}</p>
              <p className="driver-phone">{driver.phone}</p>
              <span className={`status-badge status-${driver.status}`}>
                {driver.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* Personal Information */}
          <div className="details-section">
            <h4>Personal Information</h4>
            <div className="details-grid">
              <div className="detail-item">
                <label>Full Name</label>
                <span>{driver.name}</span>
              </div>
              <div className="detail-item">
                <label>Email</label>
                <span>{driver.email}</span>
              </div>
              <div className="detail-item">
                <label>Phone</label>
                <span>{driver.phone}</span>
              </div>
              <div className="detail-item">
                <label>Date of Birth</label>
                <span>{formatDate(driver.dob)}</span>
              </div>
              <div className="detail-item">
                <label>Gender</label>
                <span>{driver.gender ? driver.gender.charAt(0).toUpperCase() + driver.gender.slice(1) : 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <label>License Number</label>
                <span>{driver.license}</span>
              </div>
              <div className="detail-item">
                <label>Experience</label>
                <span>{driver.experience}</span>
              </div>
              <div className="detail-item">
                <label>Status</label>
                <span className={`status-text status-${driver.status}`}>
                  {driver.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          {driver.emergencyName && (
            <div className="details-section">
              <h4>Emergency Contact</h4>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Reference Name</label>
                  <span>{driver.emergencyName}</span>
                </div>
                <div className="detail-item">
                  <label>Relationship</label>
                  <span>{driver.emergencyRelationship ? driver.emergencyRelationship.charAt(0).toUpperCase() + driver.emergencyRelationship.slice(1) : 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <label>Phone Number</label>
                  <span>{driver.emergencyPhone}</span>
                </div>
              </div>
            </div>
          )}

          {/* Vehicle Information */}
          {driver.vehicleType && (
            <div className="details-section">
              <h4>Vehicle Information</h4>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Vehicle Type</label>
                  <span>
                    {driver.vehicleType === 'bike' ? '🏍️ Bike' : '🚛 Truck'}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Vehicle Number</label>
                  <span>{driver.vehicleNumber}</span>
                </div>
              </div>
            </div>
          )}

          {/* Documents */}
          <div className="details-section">
            <h4>Documents</h4>
            <div className="documents-list">
              {driver.documents ? Object.entries(driver.documents).map(([key, value]) => (
                <div key={key} className="document-item">
                  <div className="document-info">
                    <span className="document-label">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                    </span>
                    <span className="document-value">
                      {value ? `✅ ${value.name}` : '❌ Not uploaded'}
                    </span>
                  </div>
                  <div className="document-actions">
                    {editingDocument === key ? (
                      <div className="document-upload">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleDocumentUpload(e, key)}
                          className="file-input"
                        />
                        <button 
                          className="cancel-edit-btn"
                          onClick={() => setEditingDocument(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="document-buttons">
                        {value && (
                          <button 
                            className="view-document-btn"
                            onClick={() => handleViewDocument(key, value)}
                            title={`View ${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}`}
                          >
                            👁️ View
                          </button>
                        )}
                        <button 
                          className="edit-document-btn"
                          onClick={() => handleDocumentEdit(key)}
                        >
                          📝 Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )) : (
                <div className="no-documents">
                  <p>No documents uploaded yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="details-section">
            <h4>Additional Information</h4>
            <div className="details-grid">
              <div className="detail-item">
                <label>Driver ID</label>
                <span>{driver.id}</span>
              </div>
              <div className="detail-item">
                <label>Created At</label>
                <span>{formatDate(driver.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div className="footer-buttons">
            <button className="edit-driver-btn" onClick={handleEditDriver}>
              ✏️ Edit Driver
            </button>
            <button className="delete-driver-btn" onClick={handleDeleteDriver}>
              🗑️ Delete Driver
            </button>
            <button className="close-details-btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>

        {viewingDocument && (
          <DocumentViewer 
            document={viewingDocument}
            onClose={handleCloseDocumentViewer}
          />
        )}
      </div>
    </div>
  );
};

export default DriverDetails;
