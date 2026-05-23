const mongoose = require('mongoose');

const ShipmentSchema = new mongoose.Schema({
  shipmentNumber: {
    type: String,
    required: true,
    unique: true, 
    trim: true,
  },
  origin: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['On Time', 'Delayed', 'Critical', 'Low', 'Medium', 'High'],
    required: true,
  },
  carrierEmail : {
    type : String,
    required: true,
    lowercase: true,
  },
  clientEmail: {
    type: String,
    required: true,
    lowercase: true
  }
}, {
  timestamps: true 
});


const Shipment = mongoose.model('Shipment',ShipmentSchema);
module.exports = Shipment;
