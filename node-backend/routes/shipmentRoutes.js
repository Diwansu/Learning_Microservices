const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const shipmentController = require('../controllers/shipmentController');

/**
 * Shipment & Disruption Routes
 */

// Fetch all shipments
router.get('/shipments', shipmentController.getAllShipments);

// Create a new shipment (Admin Protected)
router.post('/shipments', verifyToken, isAdmin, shipmentController.createShipment);

// Fetch disruption log by shipment ID
router.get('/disruptions/:shipmentId', shipmentController.getDisruptionByShipmentId);

// Trigger AI disruption analysis (Admin Protected)
router.post('/shipments/disrupt', verifyToken, isAdmin, shipmentController.analyzeDisruption);

// Delete a shipment manifest (Admin Protected)
router.delete('/shipments/:id', verifyToken, isAdmin, shipmentController.deleteShipment);

module.exports = router;
