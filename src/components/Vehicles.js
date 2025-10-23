import React, { useState } from 'react';
import './Vehicles.css';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      licensePlate: 'ABC-1234',
      color: 'Silver',
      status: 'available',
      mileage: '15,000 miles'
    },
    {
      id: 2,
      make: 'Honda',
      model: 'Civic',
      year: 2021,
      licensePlate: 'XYZ-5678',
      color: 'White',
      status: 'in-use',
      mileage: '25,000 miles'
    },
    {
      id: 3,
      make: 'Ford',
      model: 'Focus',
      year: 2023,
      licensePlate: 'DEF-9012',
      color: 'Blue',
      status: 'maintenance',
      mileage: '8,000 miles'
    },
    {
      id: 4,
      make: 'Nissan',
      model: 'Altima',
      year: 2020,
      licensePlate: 'GHI-3456',
      color: 'Black',
      status: 'available',
      mileage: '35,000 miles'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    year: '',
    licensePlate: '',
    color: '',
    mileage: ''
  });

  const handleAddVehicle = () => {
    if (newVehicle.make && newVehicle.model && newVehicle.year && newVehicle.licensePlate) {
      const vehicle = {
        id: vehicles.length + 1,
        ...newVehicle,
        status: 'available'
      };
      setVehicles([...vehicles, vehicle]);
      setNewVehicle({ make: '', model: '', year: '', licensePlate: '', color: '', mileage: '' });
      setShowAddForm(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return '#4caf50';
      case 'in-use':
        return '#ff9800';
      case 'maintenance':
        return '#f44336';
      default:
        return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'in-use':
        return 'In Use';
      case 'maintenance':
        return 'Maintenance';
      default:
        return status;
    }
  };

  return (
    <div className="vehicles-container">
      <div className="page-container">
        <h2 className="page-title">Vehicles</h2>
        
        <button 
          className="add-vehicle-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Add Vehicle'}
        </button>

        {showAddForm && (
          <div className="add-vehicle-form">
            <h3>Add New Vehicle</h3>
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Make (e.g., Toyota)"
                  value={newVehicle.make}
                  onChange={(e) => setNewVehicle({...newVehicle, make: e.target.value})}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Model (e.g., Camry)"
                  value={newVehicle.model}
                  onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <input
                  type="number"
                  placeholder="Year"
                  value={newVehicle.year}
                  onChange={(e) => setNewVehicle({...newVehicle, year: e.target.value})}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="License Plate"
                  value={newVehicle.licensePlate}
                  onChange={(e) => setNewVehicle({...newVehicle, licensePlate: e.target.value})}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Color"
                  value={newVehicle.color}
                  onChange={(e) => setNewVehicle({...newVehicle, color: e.target.value})}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Mileage"
                  value={newVehicle.mileage}
                  onChange={(e) => setNewVehicle({...newVehicle, mileage: e.target.value})}
                />
              </div>
            </div>
            <button className="submit-btn" onClick={handleAddVehicle}>
              Add Vehicle
            </button>
          </div>
        )}

        <div className="vehicle-list">
          {vehicles.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🚗</div>
              <p>No vehicles found</p>
            </div>
          ) : (
            vehicles.map(vehicle => (
              <div key={vehicle.id} className="vehicle-card">
                <div className="vehicle-info">
                  <div className="vehicle-icon">
                    🚗
                  </div>
                  <div className="vehicle-details">
                    <h3>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                    <p>🆔 {vehicle.licensePlate}</p>
                    <p>🎨 {vehicle.color}</p>
                    <p>📊 {vehicle.mileage}</p>
                    <span 
                      className="vehicle-status"
                      style={{ color: getStatusColor(vehicle.status) }}
                    >
                      {getStatusText(vehicle.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Vehicles;
