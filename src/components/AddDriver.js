import React, { useState, useEffect } from 'react';
import './AddDriver.css';

const AddDriver = ({ onClose, onAddDriver, editMode = false, driverToEdit = null }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize driver data structure matching server model
  const [driverData, setDriverData] = useState(() => {
    if (editMode && driverToEdit) {
      return {
        name: driverToEdit.name || '',
        phone: driverToEdit.phone || '',
        email: driverToEdit.email || '',
        dob: driverToEdit.dob || '',
        gender: driverToEdit.gender || '',
        experience_yrs: driverToEdit.experience_yrs || '',
        emergency_contact: {
          name: driverToEdit.emergency_contact?.name || '',
          phone: driverToEdit.emergency_contact?.phone || '',
          relationship: driverToEdit.emergency_contact?.relationship || ''
        },
        vehicle: {
          type: driverToEdit.vehicle?.type || '',
          model_name: driverToEdit.vehicle?.model_name || '',
          number: driverToEdit.vehicle?.number || ''
        },
        documents: {
          aadhar_url: driverToEdit.documents?.aadhar_url || null,
          pan_url: driverToEdit.documents?.pan_url || null,
          driver_license_url: driverToEdit.documents?.driver_license_url || null,
          rc_vehicle_url: driverToEdit.documents?.rc_vehicle_url || null,
          insurance_vehicle_url: driverToEdit.documents?.insurance_vehicle_url || null
        }
      };
    }
    // Try to load from localStorage first
    const savedData = localStorage.getItem('driver_draft');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error('Error parsing saved driver data:', e);
      }
    }
    // Default empty structure
    return {
      name: '',
      phone: '',
      email: '',
      dob: '',
      gender: '',
      experience_yrs: '',
      emergency_contact: {
        name: '',
        phone: '',
        relationship: ''
      },
      vehicle: {
        type: '',
        model_name: '',
        number: ''
      },
      documents: {
        aadhar_url: null,
        pan_url: null,
        driver_license_url: null,
        rc_vehicle_url: null,
        insurance_vehicle_url: null
      }
    };
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!editMode) {
      localStorage.setItem('driver_draft', JSON.stringify(driverData));
    }
  }, [driverData, editMode]);

  const updateDriverData = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setDriverData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setDriverData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleFileUpload = (field, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Store as data URL (base64) - in production, this would be uploaded to server and URL stored
        updateDriverData(`documents.${field}`, e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      if (!driverData.name || !driverData.phone) {
        alert('Name and phone number are required');
        return;
      }
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!driverData.name || !driverData.phone) {
      alert('Name and phone number are required');
      return;
    }

    if (!driverData.vehicle.type) {
      alert('Vehicle type is required');
      return;
    }

    // Validate required documents
    if (!driverData.documents.aadhar_url || !driverData.documents.pan_url || !driverData.documents.driver_license_url) {
      alert('Aadhar Card, PAN Card, and Driver License are required documents');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API
      const submitData = {
        name: driverData.name,
        phone: driverData.phone,
        email: driverData.email || undefined,
        dob: driverData.dob || undefined,
        gender: driverData.gender || undefined,
        experience_yrs: driverData.experience_yrs ? parseInt(driverData.experience_yrs) : undefined,
        emergency_contact: {
          name: driverData.emergency_contact.name || undefined,
          phone: driverData.emergency_contact.phone || undefined,
          relationship: driverData.emergency_contact.relationship || undefined
        },
        vehicle: {
          type: driverData.vehicle.type,
          model_name: driverData.vehicle.model_name || undefined,
          number: driverData.vehicle.number || undefined
        },
        documents: {
          aadhar_url: driverData.documents.aadhar_url,
          pan_url: driverData.documents.pan_url,
          driver_license_url: driverData.documents.driver_license_url,
          rc_vehicle_url: driverData.documents.rc_vehicle_url || undefined,
          insurance_vehicle_url: driverData.documents.insurance_vehicle_url || undefined
        }
      };

      // Make API call
      const response = await fetch('http://localhost:5000/api/drivers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create driver');
      }

      const result = await response.json();
      
      // Clear draft from localStorage
      localStorage.removeItem('driver_draft');
      
      // Call parent callback
      onAddDriver(result.data);
      onClose();
    } catch (error) {
      console.error('Error creating driver:', error);
      alert(`Error creating driver: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Optionally clear draft on close (or keep it for next time)
    // localStorage.removeItem('driver_draft');
    onClose();
  };

  return (
    <div className="add-driver-modal">
      <div className="modal-backdrop" onClick={handleClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h3>{editMode ? 'Edit Driver' : 'Add New Driver'}</h3>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>

        <div className="step-indicator">
          Step {currentStep} of 4
        </div>

        {/* Step 1: Personal Details */}
        {currentStep === 1 && (
          <div className="form-step">
            <h4>Personal Details</h4>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                placeholder="Enter full name"
                value={driverData.name}
                onChange={(e) => updateDriverData('name', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={driverData.phone}
                onChange={(e) => updateDriverData('phone', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter email (optional)"
                value={driverData.email}
                onChange={(e) => updateDriverData('email', e.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={driverData.dob}
                  onChange={(e) => updateDriverData('dob', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select
                  value={driverData.gender}
                  onChange={(e) => updateDriverData('gender', e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Experience (Years)</label>
              <input
                type="number"
                placeholder="Enter years of experience"
                value={driverData.experience_yrs}
                onChange={(e) => updateDriverData('experience_yrs', e.target.value)}
                min="0"
              />
            </div>
          </div>
        )}

        {/* Step 2: Emergency Contact */}
        {currentStep === 2 && (
          <div className="form-step">
            <h4>Emergency Contact</h4>
            <div className="form-group">
              <label>Contact Name</label>
              <input
                type="text"
                placeholder="Enter emergency contact name"
                value={driverData.emergency_contact.name}
                onChange={(e) => updateDriverData('emergency_contact.name', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Relationship</label>
              <select
                value={driverData.emergency_contact.relationship}
                onChange={(e) => updateDriverData('emergency_contact.relationship', e.target.value)}
              >
                <option value="">Select Relationship</option>
                <option value="spouse">Spouse</option>
                <option value="parent">Parent</option>
                <option value="sibling">Sibling</option>
                <option value="friend">Friend</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Contact Phone</label>
              <input
                type="tel"
                placeholder="Enter emergency contact phone"
                value={driverData.emergency_contact.phone}
                onChange={(e) => updateDriverData('emergency_contact.phone', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 3: Vehicle Details */}
        {currentStep === 3 && (
          <div className="form-step">
            <h4>Vehicle Details</h4>
            <div className="form-group">
              <label>Vehicle Type *</label>
              <div className="vehicle-type-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="vehicleType"
                    value="bike"
                    checked={driverData.vehicle.type === 'bike'}
                    onChange={(e) => updateDriverData('vehicle.type', e.target.value)}
                  />
                  <span>🏍️ Bike</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="vehicleType"
                    value="truck"
                    checked={driverData.vehicle.type === 'truck'}
                    onChange={(e) => updateDriverData('vehicle.type', e.target.value)}
                  />
                  <span>🚛 Truck</span>
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Vehicle Model Name</label>
              <input
                type="text"
                placeholder="Enter vehicle model name"
                value={driverData.vehicle.model_name}
                onChange={(e) => updateDriverData('vehicle.model_name', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Vehicle Number</label>
              <input
                type="text"
                placeholder="Enter vehicle registration number"
                value={driverData.vehicle.number}
                onChange={(e) => updateDriverData('vehicle.number', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 4: Documents Upload */}
        {currentStep === 4 && (
          <div className="form-step">
            <h4>Documents Upload</h4>
            <div className="document-upload-grid">
              <div className="document-item">
                <label>Aadhar Card *</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload('aadhar_url', e.target.files[0])}
                />
                {driverData.documents.aadhar_url && (
                  <span className="file-name">✓ Document uploaded</span>
                )}
              </div>
              <div className="document-item">
                <label>PAN Card *</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload('pan_url', e.target.files[0])}
                />
                {driverData.documents.pan_url && (
                  <span className="file-name">✓ Document uploaded</span>
                )}
              </div>
              <div className="document-item">
                <label>Driver License *</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload('driver_license_url', e.target.files[0])}
                />
                {driverData.documents.driver_license_url && (
                  <span className="file-name">✓ Document uploaded</span>
                )}
              </div>
              <div className="document-item">
                <label>RC Vehicle</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload('rc_vehicle_url', e.target.files[0])}
                />
                {driverData.documents.rc_vehicle_url && (
                  <span className="file-name">✓ Document uploaded</span>
                )}
              </div>
              <div className="document-item">
                <label>Insurance Vehicle</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload('insurance_vehicle_url', e.target.files[0])}
                />
                {driverData.documents.insurance_vehicle_url && (
                  <span className="file-name">✓ Document uploaded</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="form-navigation">
          {currentStep > 1 && (
            <button className="nav-btn prev-btn" onClick={handlePrevious} disabled={isSubmitting}>
              Previous
            </button>
          )}
          {currentStep < 4 ? (
            <button className="nav-btn next-btn" onClick={handleNext} disabled={isSubmitting}>
              Next
            </button>
          ) : (
            <button 
              className="submit-btn" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : (editMode ? 'Update Driver' : 'Submit')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddDriver;
