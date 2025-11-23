const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');

// GET profile (or create default if doesn't exist)
router.get('/', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    
    if (!profile) {
      // Create default profile
      profile = new Profile({
        name: 'Admin User',
        email: 'admin@driverapp.com',
        phone: '+1 (555) 000-0000',
        role: 'Fleet Manager',
        department: 'Transportation',
        joinDate: 'January 2024',
        totalDrivers: 0,
        totalVehicles: 0,
        activeTrips: 0
      });
      await profile.save();
    }
    
    // Update stats from actual data
    const driverCount = await Driver.countDocuments();
    const vehicleCount = await Vehicle.countDocuments();
    
    profile.totalDrivers = driverCount;
    profile.totalVehicles = vehicleCount;
    
    // Save updated stats
    await profile.save();
    
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
});

// PUT update profile
router.put('/', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    
    if (!profile) {
      // Create new profile if doesn't exist
      profile = new Profile(req.body);
    } else {
      // Update existing profile
      Object.assign(profile, req.body);
      profile.updatedAt = new Date();
    }
    
    const savedProfile = await profile.save();
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: savedProfile
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

module.exports = router;

