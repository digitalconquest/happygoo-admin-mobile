const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

// GET all vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicles',
      error: error.message
    });
  }
});

// GET single vehicle by ID
router.get('/:id', async (req, res) => {
  try {
    // Validate MongoDB ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vehicle ID format'
      });
    }
    
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }
    res.json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicle',
      error: error.message
    });
  }
});

// POST create new vehicle
router.post('/', async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    const savedVehicle = await vehicle.save();
    
    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: savedVehicle
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating vehicle',
      error: error.message
    });
  }
});

// PUT update vehicle
router.put('/:id', async (req, res) => {
  try {
    // Validate MongoDB ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vehicle ID format'
      });
    }
    
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Vehicle updated successfully',
      data: vehicle
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating vehicle',
      error: error.message
    });
  }
});

// DELETE vehicle
router.delete('/:id', async (req, res) => {
  try {
    // Validate MongoDB ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vehicle ID format'
      });
    }
    
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Vehicle deleted successfully',
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting vehicle',
      error: error.message
    });
  }
});

module.exports = router;

