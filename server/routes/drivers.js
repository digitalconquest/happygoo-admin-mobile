const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');

// GET all drivers with optional filtering
router.get('/', async (req, res) => {
  try {
    const { status, vehicleType, search } = req.query;
    
    // Build query object
    const query = {};
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    // Filter by vehicle type
    if (vehicleType) {
      query['vehicle.type'] = vehicleType;
    }
    
    // Search by name, phone, or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const drivers = await Driver.find(query).sort({ created_at: -1 });
    
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
    if (!driverData.email && driverData.name) {
      driverData.email = `${driverData.name.toLowerCase().replace(/\s+/g, '.')}@email.com`;
    }
    
    // Ensure required fields are present
    if (!driverData.name || !driverData.phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone are required fields'
      });
    }
    
    // Ensure vehicle type is provided (required field)
    if (!driverData.vehicle || !driverData.vehicle.type) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle type is required'
      });
    }
    
    // Set timestamps
    driverData.created_at = new Date();
    driverData.updated_at = new Date();
    
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
    
    // Update the updated_at timestamp
    req.body.updated_at = new Date();
    
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

