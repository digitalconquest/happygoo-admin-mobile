const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'Fleet Manager'
  },
  department: {
    type: String,
    default: 'Transportation'
  },
  joinDate: {
    type: String
  },
  totalDrivers: {
    type: Number,
    default: 0
  },
  totalVehicles: {
    type: Number,
    default: 0
  },
  activeTrips: {
    type: Number,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Profile', profileSchema);

