const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  make: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  licensePlate: {
    type: String,
    required: true,
    unique: true
  },
  color: {
    type: String
  },
  status: {
    type: String,
    enum: ['available', 'in-use', 'maintenance'],
    default: 'available'
  },
  mileage: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);

