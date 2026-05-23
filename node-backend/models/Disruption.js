const mongoose = require('mongoose');

/**
 * Mongoose Schema representing AI Disruption Logs
 */
const DisruptionSchema = new mongoose.Schema({
  shipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shipment',
    required: true,
  },
  triggerReason: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    required: true,
  },
  aiResearchSummary: {
    type: String,
    required: true,
  },
  alternativeRoutes: [{
    mode: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    extra_cost: {
      type: Number,
      required: true,
    },
    time_days: {
      type: Number,
      required: true,
    }
  }],
  draftedEmail: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Disruption', DisruptionSchema);
