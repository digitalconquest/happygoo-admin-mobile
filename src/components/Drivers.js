import React, { useState, useEffect } from 'react';
import AddDriver from './AddDriver';
import DriverDetails from './DriverDetails';
import './Drivers.css';

const Drivers = () => {
  // Default sample drivers
  const defaultDrivers = [];

  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDriverDetails, setShowDriverDetails] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // Load drivers from localStorage on component mount
  useEffect(() => {
    const loadDrivers = () => {
      try {
        // First, try to load from the main 'drivers' array
        const savedDrivers = localStorage.getItem('drivers');
        let allDrivers = [];
        
        if (savedDrivers) {
          const parsedDrivers = JSON.parse(savedDrivers);
          allDrivers = [...parsedDrivers];
          console.log('Loading drivers from main array:', parsedDrivers.length);
        }
        
        // Also check for individual driver entries (driver_*)
        const individualDrivers = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('driver_') && key !== 'drivers') {
            try {
              const driverData = JSON.parse(localStorage.getItem(key));
              if (driverData && driverData.id) {
                individualDrivers.push(driverData);
              }
            } catch (error) {
              console.error(`Error parsing driver data for key ${key}:`, error);
            }
          }
        }
        
        console.log('Found individual drivers:', individualDrivers.length);
        
        // Merge all drivers and remove duplicates
        const mergedDrivers = [...allDrivers];
        individualDrivers.forEach(individualDriver => {
          const exists = mergedDrivers.some(driver => driver.id === individualDriver.id);
          if (!exists) {
            mergedDrivers.push(individualDriver);
          }
        });
        
        if (mergedDrivers.length > 0) {
          console.log('Total drivers loaded:', mergedDrivers.length);
          setDrivers(mergedDrivers);
          setFilteredDrivers(mergedDrivers);
          // Update the main drivers array with all drivers
          localStorage.setItem('drivers', JSON.stringify(mergedDrivers));
        } else {
          console.log('No drivers found, using defaults');
          setDrivers(defaultDrivers);
          setFilteredDrivers(defaultDrivers);
          localStorage.setItem('drivers', JSON.stringify(defaultDrivers));
        }
      } catch (error) {
        console.error('Error loading drivers from localStorage:', error);
        console.log('Falling back to default drivers');
        setDrivers(defaultDrivers);
        setFilteredDrivers(defaultDrivers);
        // Try to save defaults to localStorage
        try {
          localStorage.setItem('drivers', JSON.stringify(defaultDrivers));
        } catch (saveError) {
          console.error('Error saving default drivers to localStorage:', saveError);
        }
      }
    };

    loadDrivers();
  }, []);

  // Filter drivers based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDrivers(drivers);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = drivers.filter(driver => 
        driver.name?.toLowerCase().includes(query) ||
        driver.phone?.toLowerCase().includes(query) ||
        driver.email?.toLowerCase().includes(query) ||
        driver.vehicle?.number?.toLowerCase().includes(query)
      );
      setFilteredDrivers(filtered);
    }
  }, [searchQuery, drivers]);

  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddDriver = (driver) => {
    console.log('Adding new driver to UI:', driver);
    console.log('Current drivers before adding:', drivers);
    
    // Update the UI state
    const updatedDrivers = [...drivers, driver];
    console.log('Updated drivers list:', updatedDrivers);
    
    setDrivers(updatedDrivers);
    setFilteredDrivers(updatedDrivers);
    
    // Verify localStorage is already updated (should be done in AddDriver component)
    try {
      const savedDrivers = JSON.parse(localStorage.getItem('drivers') || '[]');
      console.log('Drivers in localStorage after add:', savedDrivers.length);
      
      // If localStorage doesn't match, update it
      if (savedDrivers.length !== updatedDrivers.length) {
        console.log('⚠️ localStorage mismatch detected, updating...');
        localStorage.setItem('drivers', JSON.stringify(updatedDrivers));
      }
      
      console.log('✅ Driver successfully added to UI');
      console.log('Total drivers now:', updatedDrivers.length);
    } catch (error) {
      console.error('Error verifying localStorage:', error);
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
    setFilteredDrivers(updatedDrivers);
    
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
    setFilteredDrivers(updatedDrivers);
    
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

  // Utility function to debug localStorage
  const debugLocalStorage = () => {
    try {
      const drivers = JSON.parse(localStorage.getItem('drivers') || '[]');
      console.log('🔍 localStorage Debug:');
      console.log('- Total drivers in localStorage:', drivers.length);
      console.log('- Driver IDs:', drivers.map(d => d.id));
      console.log('- Driver names:', drivers.map(d => d.name));
      return drivers;
    } catch (error) {
      console.error('❌ Error reading localStorage:', error);
      return [];
    }
  };

  // Function to remove Emily driver
  const removeEmilyDriver = () => {
    try {
      // Get current drivers
      const currentDrivers = JSON.parse(localStorage.getItem('drivers') || '[]');
      
      // Filter out Emily driver
      const driversWithoutEmily = currentDrivers.filter(driver => 
        !driver.name.toLowerCase().includes('emily')
      );
      
      // Update localStorage
      localStorage.setItem('drivers', JSON.stringify(driversWithoutEmily));
      
      // Update the UI
      setDrivers(driversWithoutEmily);
      
      console.log('✅ Emily driver removed from localStorage');
      console.log('Drivers remaining:', driversWithoutEmily.length);
    } catch (error) {
      console.error('❌ Error removing Emily driver:', error);
    }
  };

  return (
    <div className="drivers-container">
      <div className="page-container">
        <div className="drivers-top-bar">
          <input
            type="text"
            className="search-bar"
            placeholder="Search drivers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            className="add-driver-icon-btn"
            onClick={() => setShowAddForm(true)}
            title="Add Driver"
          >
            ➕
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

        <div className="drivers-list">
          {filteredDrivers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <p>{searchQuery ? 'No drivers found' : 'No drivers yet'}</p>
            </div>
          ) : (
            filteredDrivers.map(driver => (
              <div 
                key={driver.id || driver._id} 
                className="driver-card"
                onClick={() => handleDriverClick(driver)}
              >
                <div className="driver-avatar">
                  {getInitials(driver.name || 'N/A')}
                </div>
                <div className="driver-content">
                  <div className="driver-name-row">
                    <h3>{driver.name || 'Unknown'}</h3>
                    <span className={`status-badge status-${driver.status || 'pending'}`}>
                      {driver.status === 'pending' ? 'Pending' : 
                       driver.status === 'approved' ? 'Approved' : 
                       driver.status === 'rejected' ? 'Rejected' : 'Pending'}
                    </span>
                  </div>
                  {driver.phone && <p className="driver-info">📞 {driver.phone}</p>}
                  {driver.email && <p className="driver-info">📧 {driver.email}</p>}
                  {driver.vehicle?.type && (
                    <p className="driver-info">
                      {driver.vehicle.type === 'bike' ? '🏍️' : '🚛'} {driver.vehicle.type.charAt(0).toUpperCase() + driver.vehicle.type.slice(1)}
                      {driver.vehicle?.number && ` - ${driver.vehicle.number}`}
                    </p>
                  )}
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
