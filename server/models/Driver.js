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
    required: false
  },
  dob: {
    type: String
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  experience_yrs: {
    type: Number
  },
  emergency_contact: {
    name: String,
    relationship: String,
    phone: String
  },
  vehicle: {
    type: {
      type: String,
      enum: ['bike', 'truck'],
      required: true
    },
    model_name: String,
    number: String
  },
  documents: {
    aadhar_url: String,
    pan_url: String,
    driver_license_url: String,
    rc_vehicle_url: String,
    insurance_vehicle_url: String,
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Driver', driverSchema);

