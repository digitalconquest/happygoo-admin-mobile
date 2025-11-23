const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  license: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  experience: {
    type: String,
    default: 'New Driver'
  },
  vehicleType: {
    type: String,
    enum: ['bike', 'truck'],
    required: true
  },
  vehicleNumber: {
    type: String,
    required: true
  },
  dob: {
    type: String
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  emergencyName: {
    type: String
  },
  emergencyRelationship: {
    type: String
  },
  emergencyPhone: {
    type: String
  },
  documents: {
    aadharCard: {
      name: String,
      data: String,
      type: String,
      size: Number
    },
    panCard: {
      name: String,
      data: String,
      type: String,
      size: Number
    },
    driverLicense: {
      name: String,
      data: String,
      type: String,
      size: Number
    },
    rcVehicle: {
      name: String,
      data: String,
      type: String,
      size: Number
    },
    insuranceVehicle: {
      name: String,
      data: String,
      type: String,
      size: Number
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Driver', driverSchema);

