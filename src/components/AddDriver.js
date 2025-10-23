import React, { useState } from 'react';
import './AddDriver.css';

const AddDriver = ({ onClose, onAddDriver, editMode = false, driverToEdit = null }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [newDriver, setNewDriver] = useState(() => {
    if (editMode && driverToEdit) {
      return {
        // Personal Details
        name: driverToEdit.name || '',
        phone: driverToEdit.phone || '',
        otp: '',
        dob: driverToEdit.dob || '',
        gender: driverToEdit.gender || '',
        // Emergency Contact
        emergencyName: driverToEdit.emergencyName || '',
        emergencyRelationship: driverToEdit.emergencyRelationship || '',
        emergencyPhone: driverToEdit.emergencyPhone || '',
        // Vehicle Details
        vehicleType: driverToEdit.vehicleType || '',
        vehicleNumber: driverToEdit.vehicleNumber || '',
        // Documents
        aadharCard: driverToEdit.documents?.aadharCard || null,
        panCard: driverToEdit.documents?.panCard || null,
        driverLicense: driverToEdit.documents?.driverLicense || null,
        rcVehicle: driverToEdit.documents?.rcVehicle || null,
        insuranceVehicle: driverToEdit.documents?.insuranceVehicle || null
      };
    }
    return {
      // Personal Details
      name: '',
      phone: '',
      otp: '',
      dob: '',
      gender: '',
      // Emergency Contact
      emergencyName: '',
      emergencyRelationship: '',
      emergencyPhone: '',
      // Vehicle Details
      vehicleType: '',
      vehicleNumber: '',
      // Documents
      aadharCard: null,
      panCard: null,
      driverLicense: null,
      rcVehicle: null,
      insuranceVehicle: null
    };
  });

  const handleAddDriver = () => {
    if (newDriver.name && newDriver.phone && newDriver.vehicleType && newDriver.vehicleNumber) {
      const driver = {
        id: editMode ? driverToEdit.id : Date.now(), // Keep existing ID in edit mode
        name: newDriver.name,
        phone: newDriver.phone,
        email: `${newDriver.name.toLowerCase().replace(' ', '.')}@email.com`,
        license: `DL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        status: 'active',
        experience: 'New Driver',
        vehicleType: newDriver.vehicleType,
        vehicleNumber: newDriver.vehicleNumber,
        dob: newDriver.dob,
        gender: newDriver.gender,
        emergencyName: newDriver.emergencyName,
        emergencyRelationship: newDriver.emergencyRelationship,
        emergencyPhone: newDriver.emergencyPhone,
        // Document uploads with base64 data for persistence
        documents: {
          aadharCard: newDriver.aadharCard ? {
            name: newDriver.aadharCard.name,
            data: newDriver.aadharCard.data,
            type: newDriver.aadharCard.type,
            size: newDriver.aadharCard.size
          } : null,
          panCard: newDriver.panCard ? {
            name: newDriver.panCard.name,
            data: newDriver.panCard.data,
            type: newDriver.panCard.type,
            size: newDriver.panCard.size
          } : null,
          driverLicense: newDriver.driverLicense ? {
            name: newDriver.driverLicense.name,
            data: newDriver.driverLicense.data,
            type: newDriver.driverLicense.type,
            size: newDriver.driverLicense.size
          } : null,
          rcVehicle: newDriver.rcVehicle ? {
            name: newDriver.rcVehicle.name,
            data: newDriver.rcVehicle.data,
            type: newDriver.rcVehicle.type,
            size: newDriver.rcVehicle.size
          } : null,
          insuranceVehicle: newDriver.insuranceVehicle ? {
            name: newDriver.insuranceVehicle.name,
            data: newDriver.insuranceVehicle.data,
            type: newDriver.insuranceVehicle.type,
            size: newDriver.insuranceVehicle.size
          } : null
        },
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      const existingDrivers = JSON.parse(localStorage.getItem('drivers') || '[]');
      let updatedDrivers;
      
      if (editMode) {
        // Update existing driver
        updatedDrivers = existingDrivers.map(d => d.id === driver.id ? driver : d);
      } else {
        // Add new driver
        updatedDrivers = [...existingDrivers, driver];
      }
      
      localStorage.setItem('drivers', JSON.stringify(updatedDrivers));

      // Also save individual driver data
      localStorage.setItem(`driver_${driver.id}`, JSON.stringify(driver));
      
      // Debug: Log document storage
      console.log('Driver saved with documents:', driver.documents);
      console.log('Total drivers in localStorage:', updatedDrivers.length);
      
      // Verify documents are stored correctly
      const savedDriver = JSON.parse(localStorage.getItem(`driver_${driver.id}`));
      console.log('Verification - saved driver documents:', savedDriver.documents);

      onAddDriver(driver);
      onClose();
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = (field, file) => {
    if (file) {
      console.log(`Uploading ${field}:`, file.name, file.type, file.size);
      // Convert file to base64 for persistent storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = {
          name: file.name,
          data: e.target.result, // Base64 data for persistence
          type: file.type,
          size: file.size
        };
        console.log(`File converted to base64 for ${field}:`, fileData.name);
        setNewDriver({
          ...newDriver, 
          [field]: fileData
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate a random 6-digit OTP
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Send OTP functionality
  const handleSendOTP = () => {
    if (!newDriver.phone) {
      alert('Please enter a phone number first');
      return;
    }

    // Generate OTP
    const otp = generateOTP();
    setGeneratedOtp(otp);
    setOtpSent(true);
    setOtpVerified(false);
    
    // Start timer (60 seconds)
    setOtpTimer(60);
    const timer = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Simulate sending OTP (in real app, this would be an API call)
    console.log(`OTP sent to ${newDriver.phone}: ${otp}`);
    
    // Show success message
    alert(`OTP sent to ${newDriver.phone}\n\nOTP: ${otp}\n\nNote: In a real application, this would be sent via SMS.`);
  };

  // Verify OTP functionality
  const handleVerifyOTP = () => {
    if (!newDriver.otp) {
      alert('Please enter the OTP');
      return;
    }

    if (newDriver.otp === generatedOtp) {
      setOtpVerified(true);
      alert('OTP verified successfully!');
    } else {
      alert('Invalid OTP. Please try again.');
      setNewDriver({...newDriver, otp: ''});
    }
  };

  // Resend OTP functionality
  const handleResendOTP = () => {
    if (otpTimer > 0) {
      alert(`Please wait ${otpTimer} seconds before requesting a new OTP`);
      return;
    }

    const otp = generateOTP();
    setGeneratedOtp(otp);
    setOtpTimer(60);
    
    const timer = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    console.log(`OTP resent to ${newDriver.phone}: ${otp}`);
    alert(`OTP resent to ${newDriver.phone}\n\nOTP: ${otp}`);
  };

  const handleClose = () => {
    setCurrentStep(1);
    setNewDriver({
      name: '', phone: '', otp: '', dob: '', gender: '',
      emergencyName: '', emergencyRelationship: '', emergencyPhone: '',
      vehicleType: '', vehicleNumber: '',
      aadharCard: null, panCard: null, driverLicense: null, rcVehicle: null, insuranceVehicle: null
    });
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
          Step {currentStep} of 3
        </div>

        {/* Step 1: Personal Details */}
        {currentStep === 1 && (
          <div className="form-step">
            <h4>Personal Details</h4>
            <div className="form-group">
              <label>Driver Name *</label>
              <input
                type="text"
                placeholder="Enter full name"
                value={newDriver.name}
                onChange={(e) => setNewDriver({...newDriver, name: e.target.value})}
              />
            </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <div className="phone-input-group">
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      value={newDriver.phone}
                      onChange={(e) => setNewDriver({...newDriver, phone: e.target.value})}
                    />
                    <button 
                      className={`otp-btn ${otpSent ? 'otp-sent' : ''}`}
                      onClick={handleSendOTP}
                      disabled={otpSent && otpTimer > 0}
                    >
                      {otpSent ? `Resend (${otpTimer}s)` : 'Send OTP'}
                    </button>
                  </div>
                  {otpSent && (
                    <div className="otp-status">
                      <span className={`status-indicator ${otpVerified ? 'verified' : 'pending'}`}>
                        {otpVerified ? '✅ Verified' : '⏳ Pending'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>Verify OTP</label>
                  <div className="otp-input-group">
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={newDriver.otp}
                      onChange={(e) => setNewDriver({...newDriver, otp: e.target.value})}
                      maxLength="6"
                      disabled={otpVerified}
                    />
                    <button 
                      className="verify-otp-btn"
                      onClick={handleVerifyOTP}
                      disabled={otpVerified || !otpSent}
                    >
                      {otpVerified ? '✅ Verified' : 'Verify'}
                    </button>
                  </div>
                  {otpSent && !otpVerified && (
                    <div className="otp-help">
                      <p>Enter the 6-digit OTP sent to {newDriver.phone}</p>
                      <button 
                        className="resend-otp-btn"
                        onClick={handleResendOTP}
                        disabled={otpTimer > 0}
                      >
                        {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend OTP'}
                      </button>
                    </div>
                  )}
                </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={newDriver.dob}
                  onChange={(e) => setNewDriver({...newDriver, dob: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select
                  value={newDriver.gender}
                  onChange={(e) => setNewDriver({...newDriver, gender: e.target.value})}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Emergency Contact & Vehicle Details */}
        {currentStep === 2 && (
          <div className="form-step">
            <h4>Emergency Contact & Vehicle Details</h4>
            
            {/* Emergency Contact Section */}
            <div className="section-header">
              <h5>Emergency Contact</h5>
            </div>
            <div className="form-group">
              <label>Reference Name *</label>
              <input
                type="text"
                placeholder="Enter reference name"
                value={newDriver.emergencyName}
                onChange={(e) => setNewDriver({...newDriver, emergencyName: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Relationship *</label>
              <select
                value={newDriver.emergencyRelationship}
                onChange={(e) => setNewDriver({...newDriver, emergencyRelationship: e.target.value})}
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
              <label>Phone Number *</label>
              <input
                type="tel"
                placeholder="Enter emergency contact number"
                value={newDriver.emergencyPhone}
                onChange={(e) => setNewDriver({...newDriver, emergencyPhone: e.target.value})}
              />
            </div>

            {/* Vehicle Details Section */}
            <div className="section-header">
              <h5>Vehicle Details</h5>
            </div>
            <div className="form-group">
              <label>Vehicle Type *</label>
              <div className="vehicle-type-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="vehicleType"
                    value="bike"
                    checked={newDriver.vehicleType === 'bike'}
                    onChange={(e) => setNewDriver({...newDriver, vehicleType: e.target.value})}
                  />
                  <span>🏍️ Bike</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="vehicleType"
                    value="truck"
                    checked={newDriver.vehicleType === 'truck'}
                    onChange={(e) => setNewDriver({...newDriver, vehicleType: e.target.value})}
                  />
                  <span>🚛 Truck</span>
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Vehicle Number *</label>
              <input
                type="text"
                placeholder="Enter vehicle registration number"
                value={newDriver.vehicleNumber}
                onChange={(e) => setNewDriver({...newDriver, vehicleNumber: e.target.value})}
              />
            </div>
          </div>
        )}

        {/* Step 3: Documents Upload */}
        {currentStep === 3 && (
          <div className="form-step">
            <h4>Documents Upload</h4>
            <div className="document-upload-grid">
              <div className="document-item">
                <label>Aadhar Card *</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload('aadharCard', e.target.files[0])}
                />
                {newDriver.aadharCard && <span className="file-name">✓ {newDriver.aadharCard.name}</span>}
              </div>
              <div className="document-item">
                <label>PAN Card *</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload('panCard', e.target.files[0])}
                />
                {newDriver.panCard && <span className="file-name">✓ {newDriver.panCard.name}</span>}
              </div>
              <div className="document-item">
                <label>Driver License *</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload('driverLicense', e.target.files[0])}
                />
                {newDriver.driverLicense && <span className="file-name">✓ {newDriver.driverLicense.name}</span>}
              </div>
              <div className="document-item">
                <label>RC Vehicle *</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload('rcVehicle', e.target.files[0])}
                />
                {newDriver.rcVehicle && <span className="file-name">✓ {newDriver.rcVehicle.name}</span>}
              </div>
              <div className="document-item">
                <label>Insurance Vehicle *</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload('insuranceVehicle', e.target.files[0])}
                />
                {newDriver.insuranceVehicle && <span className="file-name">✓ {newDriver.insuranceVehicle.name}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="form-navigation">
          {currentStep > 1 && (
            <button className="nav-btn prev-btn" onClick={handlePrevious}>
              Previous
            </button>
          )}
          {currentStep < 3 ? (
            <button className="nav-btn next-btn" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button className="submit-btn" onClick={handleAddDriver}>
              {editMode ? 'Update Driver' : 'Submit'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddDriver;
