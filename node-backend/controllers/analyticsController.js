const Shipment = require('../models/Shipment');
const Disruption = require('../models/Disruption');

/**
 * Controller: Compute dashboard supervisor metrics (Admin only)
 */
exports.getAnalytics = async (req, res) => {
  try {
    // 1. Total manifest count
    const totalShipments = await Shipment.countDocuments();

    // 2. Disrupted manifests (any status that is not "On Time")
    const disruptedShipments = await Shipment.countDocuments({ status: { $ne: 'On Time' } });

    // 3. Cumulative disruption overhead cost (Summing the cost of alternative option 1 for each disruption)
    const costResult = await Disruption.aggregate([
      {
        $project: {
          firstRoute: { $arrayElemAt: ["$alternativeRoutes", 0] }
        }
      },
      {
        $group: {
          _id: null,
          totalCost: { $sum: "$firstRoute.extra_cost" }
        }
      }
    ]);
    const totalExtraCost = costResult.length > 0 ? costResult[0].totalCost : 0;

    // 4. Severity breakdown count
    const severityResult = await Shipment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const severityBreakdown = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    severityResult.forEach(item => {
      // Map 'High' or 'Critical' to appropriate slots
      if (item._id === 'High') {
        severityBreakdown.High = item.count;
      } else if (item._id === 'Critical') {
        severityBreakdown.Critical = item.count;
      } else if (item._id === 'Medium') {
        severityBreakdown.Medium = item.count;
      } else if (item._id === 'Low') {
        severityBreakdown.Low = item.count;
      }
    });

    res.json({
      totalShipments,
      disruptedShipments,
      totalExtraCost,
      severityBreakdown
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
