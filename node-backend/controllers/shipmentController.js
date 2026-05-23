const axios = require('axios');
const Shipment = require('../models/Shipment');
const Disruption = require('../models/Disruption');

/**
 * Controller: Get all active shipments
 */
exports.getAllShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find().sort({ createdAt: -1 });
    res.json(shipments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Controller: Register a new shipment manifest
 */
exports.createShipment = async (req, res) => {
  try {
    const shipment = new Shipment(req.body);
    await shipment.save();
    res.status(201).json(shipment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Controller: Get disruption logs for a specific shipment
 */
exports.getDisruptionByShipmentId = async (req, res) => {
  try {
    const disruption = await Disruption.findOne({ shipmentId: req.params.shipmentId }).sort({ createdAt: -1 });
    if (!disruption) {
      return res.status(404).json({ error: 'No disruption logged for this shipment' });
    }
    res.json(disruption);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Controller: Forward parameters to Python AI, save disruption log, and update shipment status
 */
exports.analyzeDisruption = async (req, res) => {
  const { shipmentId, triggerReason } = req.body;

  if (!shipmentId || !triggerReason) {
    return res.status(400).json({ error: 'shipmentId and triggerReason are required' });
  }

  try {
    // 1. Fetch the shipment
    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    // 2. Prepare parameters
    const payload = {
      shipmentNumber: shipment.shipmentNumber,
      origin: shipment.origin,
      destination: shipment.destination,
      triggerReason: triggerReason,
      carrierEmail: shipment.carrierEmail,
      clientEmail: shipment.clientEmail
    };

    console.log(`Forwarding request to FastAPI: ${process.env.PYTHON_BACKEND_URL}/analyze-disruption`);

    // 3. Make post request with 35 seconds timeout config
    const response = await axios.post(
      `${process.env.PYTHON_BACKEND_URL}/analyze-disruption`,
      payload,
      { timeout: 35000 }
    );
    
    const aiData = response.data;

    // 4. Save disruption log
    const disruption = new Disruption({
      shipmentId: shipment._id,
      triggerReason: aiData.triggerReason,
      severity: aiData.severity,
      aiResearchSummary: aiData.aiResearchSummary,
      alternativeRoutes: aiData.alternativeRoutes,
      draftedEmail: aiData.draftedEmail
    });
    await disruption.save();

    // 5. Update shipment status
    shipment.status = aiData.severity;
    await shipment.save();

    res.json({
      message: 'Disruption analyzed and logged successfully',
      shipmentStatus: shipment.status,
      disruption
    });

  } catch (error) {
    console.error('Error handling disruption in controller:', error.message);
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({ error: 'Gateway Timeout: FastAPI microservice took too long to respond' });
    }
    if (error.response) {
      return res.status(error.response.status).json({
        error: `FastAPI error: ${JSON.stringify(error.response.data)}`
      });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Controller: Delete a shipment manifest and its disruption log (Admin only)
 */
exports.deleteShipment = async (req, res) => {
  const { id } = req.params;
  try {
    const shipment = await Shipment.findByIdAndDelete(id);
    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    // Clean up associated disruption logs
    await Disruption.deleteMany({ shipmentId: id });

    res.json({ message: 'Shipment manifest and associated disruption logs deleted successfully', deletedId: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
