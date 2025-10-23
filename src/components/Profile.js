import React, { useState } from 'react';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@driverapp.com',
    phone: '+1 (555) 000-0000',
    role: 'Fleet Manager',
    department: 'Transportation',
    joinDate: 'January 2024',
    totalDrivers: 4,
    totalVehicles: 4,
    activeTrips: 2
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState(profile);

  const handleSave = () => {
    setProfile(editProfile);
    setIsEditing(false);
  };

  // const handleCancel = () => {
  //   setEditProfile(profile);
  //   setIsEditing(false);
  // };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="profile-container">
      <div className="page-container">
        <h2 className="page-title">Profile</h2>
        
        <div className="profile-avatar">
          {getInitials(profile.name)}
        </div>

        <div className="profile-info">
          <h2>{profile.name}</h2>
          
          <div className="profile-detail">
            <span>Email:</span>
            <span>{profile.email}</span>
          </div>
          
          <div className="profile-detail">
            <span>Phone:</span>
            <span>{profile.phone}</span>
          </div>
          
          <div className="profile-detail">
            <span>Role:</span>
            <span>{profile.role}</span>
          </div>
          
          <div className="profile-detail">
            <span>Department:</span>
            <span>{profile.department}</span>
          </div>
          
          <div className="profile-detail">
            <span>Join Date:</span>
            <span>{profile.joinDate}</span>
          </div>
        </div>

        <div className="stats-container">
          <h3>Fleet Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-value">{profile.totalDrivers}</div>
              <div className="stat-label">Total Drivers</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🚗</div>
              <div className="stat-value">{profile.totalVehicles}</div>
              <div className="stat-label">Total Vehicles</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🚀</div>
              <div className="stat-value">{profile.activeTrips}</div>
              <div className="stat-label">Active Trips</div>
            </div>
          </div>
        </div>

        <div className="actions-container">
          <button 
            className="edit-profile-btn"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
          
          {isEditing && (
            <button 
              className="save-profile-btn"
              onClick={handleSave}
            >
              Save Changes
            </button>
          )}
        </div>

        {isEditing && (
          <div className="edit-profile-form">
            <h3>Edit Profile Information</h3>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={editProfile.name}
                onChange={(e) => setEditProfile({...editProfile, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={editProfile.email}
                onChange={(e) => setEditProfile({...editProfile, email: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Phone:</label>
              <input
                type="tel"
                value={editProfile.phone}
                onChange={(e) => setEditProfile({...editProfile, phone: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Role:</label>
              <input
                type="text"
                value={editProfile.role}
                onChange={(e) => setEditProfile({...editProfile, role: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Department:</label>
              <input
                type="text"
                value={editProfile.department}
                onChange={(e) => setEditProfile({...editProfile, department: e.target.value})}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
