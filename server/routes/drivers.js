const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');

// GET all drivers
router.get('/', async (req, res) => {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: drivers.length,
      data: drivers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching drivers',
      error: error.message
    });
  }
});

// GET single driver by ID
router.get('/:id', async (req, res) => {
  try {
    // Validate MongoDB ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid driver ID format'
      });
    }
    
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }
    res.json({
      success: true,
      data: driver
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching driver',
      error: error.message
    });
  }
});

// POST create new driver
router.post('/', async (req, res) => {
  try {
    const driverData = req.body;
    
    // Generate email if not provided
    if (!driverData.email) {
      driverData.email = `${driverData.name.toLowerCase().replace(/\s+/g, '.')}@email.com`;
    }
    
    // Generate license if not provided
    if (!driverData.license) {
      driverData.license = `DL-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
    }
    
    const driver = new Driver(driverData);
    const savedDriver = await driver.save();
    
    res.status(201).json({
      success: true,
      message: 'Driver created successfully',
      data: savedDriver
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating driver',
      error: error.message
    });
  }
});

// PUT update driver
router.put('/:id', async (req, res) => {
  try {
    // Validate MongoDB ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid driver ID format'
      });
    }
    
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Driver updated successfully',
      data: driver
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating driver',
      error: error.message
    });
  }
});

// DELETE driver
router.delete('/:id', async (req, res) => {
  try {
    // Validate MongoDB ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid driver ID format'
      });
    }
    
    const driver = await Driver.findByIdAndDelete(req.params.id);
    
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Driver deleted successfully',
      data: driver
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting driver',
      error: error.message
    });
  }
});

module.exports = router;

