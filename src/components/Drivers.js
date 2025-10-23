import React, { useState, useEffect } from 'react';
import AddDriver from './AddDriver';
import DriverDetails from './DriverDetails';
import './Drivers.css';

const Drivers = () => {
  // Default sample drivers
  const defaultDrivers = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+91 9902456789',
      license: 'DL-123456789',
      status: 'active',
      experience: '5 years'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+91 7975907878',
      license: 'DL-987654321',
      status: 'active',
      experience: '3 years'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike.wilson@email.com',
      phone: '+91 9908765432',
      license: 'DL-456789123',
      status: 'inactive',
      experience: '7 years'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+91 9907897868',
      license: 'DL-789123456',
      status: 'active',
      experience: '2 years'
    }
  ];

  const [drivers, setDrivers] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDriverDetails, setShowDriverDetails] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // Load drivers from localStorage on component mount
  useEffect(() => {
    const loadDrivers = () => {
      try {
        const savedDrivers = localStorage.getItem('drivers');
        if (savedDrivers) {
          const parsedDrivers = JSON.parse(savedDrivers);
          setDrivers(parsedDrivers);
        } else {
          // If no saved drivers, use default drivers and save them
          setDrivers(defaultDrivers);
          localStorage.setItem('drivers', JSON.stringify(defaultDrivers));
        }
      } catch (error) {
        console.error('Error loading drivers from localStorage:', error);
        setDrivers(defaultDrivers);
      }
    };

    loadDrivers();
  }, []);

  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddDriver = (driver) => {
    console.log('Adding new driver:', driver);
    console.log('Current drivers before adding:', drivers);
    
    const updatedDrivers = [...drivers, driver];
    console.log('Updated drivers list:', updatedDrivers);
    
    setDrivers(updatedDrivers);
    
    // Update localStorage with the new driver list
    try {
      localStorage.setItem('drivers', JSON.stringify(updatedDrivers));
      console.log('Driver saved to localStorage:', driver);
      console.log('Total drivers now:', updatedDrivers.length);
    } catch (error) {
      console.error('Error saving driver to localStorage:', error);
    }
    
    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
    
    setShowAddForm(false);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
    setEditingDriver(null);
  };

  const handleDriverClick = (driver) => {
    setSelectedDriver(driver);
    setShowDriverDetails(true);
  };

  const handleCloseDriverDetails = () => {
    setShowDriverDetails(false);
    setSelectedDriver(null);
  };

  const handleEditDriver = (driver) => {
    console.log('Edit driver:', driver);
    setEditingDriver(driver);
    setShowEditForm(true);
    setShowDriverDetails(false); // Close details modal
  };

  const handleUpdateDriver = (updatedDriver) => {
    console.log('Updating driver:', updatedDriver);
    
    // Update the drivers list with the updated driver
    const updatedDrivers = drivers.map(d => 
      d.id === updatedDriver.id ? updatedDriver : d
    );
    
    setDrivers(updatedDrivers);
    
    // Update localStorage
    try {
      localStorage.setItem('drivers', JSON.stringify(updatedDrivers));
      console.log('Driver updated in localStorage:', updatedDriver);
    } catch (error) {
      console.error('Error updating driver in localStorage:', error);
    }
    
    // Update the selected driver if it's the same one
    if (selectedDriver && selectedDriver.id === updatedDriver.id) {
      setSelectedDriver(updatedDriver);
    }
    
    // Close edit form and show success message
    setShowEditForm(false);
    setEditingDriver(null);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleDeleteDriver = (driverId) => {
    console.log('Delete driver:', driverId);
    const updatedDrivers = drivers.filter(driver => driver.id !== driverId);
    setDrivers(updatedDrivers);
    
    // Update localStorage
    try {
      localStorage.setItem('drivers', JSON.stringify(updatedDrivers));
      console.log('Driver deleted from localStorage');
    } catch (error) {
      console.error('Error updating localStorage:', error);
    }
    
    // Close the details modal
    setShowDriverDetails(false);
    setSelectedDriver(null);
  };


  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="drivers-container">
      <div className="page-container">
        <h2 className="page-title">Drivers ({drivers.length})</h2>
        
        <div className="action-buttons">
          <button 
            className="add-driver-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : '+ Add Driver'}
          </button>
          
        </div>

        {showSuccessMessage && (
          <div className="success-message">
            ✅ {editingDriver ? 'Driver updated successfully!' : 'Driver added successfully! The new driver has been saved to the list.'}
          </div>
        )}

        {showAddForm && (
          <AddDriver 
            onClose={handleCloseAddForm}
            onAddDriver={handleAddDriver}
          />
        )}

        {showEditForm && editingDriver && (
          <AddDriver 
            onClose={handleCloseEditForm}
            onAddDriver={handleUpdateDriver}
            editMode={true}
            driverToEdit={editingDriver}
          />
        )}

        <div className="driver-list">
          {drivers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <p>No drivers found</p>
            </div>
          ) : (
            drivers.map(driver => (
              <div 
                key={driver.id} 
                className="driver-card"
                onClick={() => handleDriverClick(driver)}
              >
                <div className="driver-info">
                  <div className="driver-avatar">
                    {getInitials(driver.name)}
                  </div>
                  <div className="driver-details">
                    <h3>{driver.name}</h3>
                    <p>📧 {driver.email}</p>
                    <p>📞 {driver.phone}</p>
                    <p>🆔 License: {driver.license}</p>
                    <p>⏰ Experience: {driver.experience}</p>
                    <span className={`driver-status status-${driver.status}`}>
                      {driver.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="click-hint">
                  👆 Click to view details
                </div>
              </div>
            ))
          )}
        </div>

        {showDriverDetails && selectedDriver && (
          <DriverDetails 
            driver={selectedDriver}
            onClose={handleCloseDriverDetails}
            onEdit={handleEditDriver}
            onDelete={handleDeleteDriver}
          />
        )}
      </div>
    </div>
  );
};

export default Drivers;
