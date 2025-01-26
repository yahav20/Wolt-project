const DeliveryService = require("../service/deliveryService");
const { updateOrderStatus } = require("../service/updateStatus");
const DeliveryPerson = require("../model/deliveryPerson");

const ORDER_STATUSES = [
  'RECEIVED',
  'COOKING',
  'READY_FOR_PICKUP',
  'OUT_FOR_DELIVERY',
  'COMPLETED'
];

async function receiveOrderHandler(req, res) {
    const order = req.body;
    const orderId = order._id; 
    try {
      // Assign delivery person
      const deliveryPerson = await DeliveryService.assignDelivery(order);
      await progressOrderStatus(order, deliveryPerson);

    // return deliveryPerson;
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async function progressOrderStatus(order, deliveryPerson) {
    for (const status of ORDER_STATUSES) {
        try {
            const updatePayload = status;
                  await axios.patch(`http://order-service:PORT/api/orders/${order._id}/status`, updatePayload);
            
            // Wait 5 seconds before next status
            await new Promise(resolve => setTimeout(resolve, 5000));
        } catch (error) {
            console.error(`Status update failed for ${status}:`, error);
            break;
        }
    }
}

  async function addDeliveryPersonHandler(req, res) {
    const { name, speed, available } = req.body;
    try {
        // Create a new delivery person
        const deliveryPerson = await DeliveryPerson.create({
            name,
            speed,
            available
        });

        res.status(201).json({ success: true, deliveryPerson });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get all delivery personnel
async function getAllDeliveryPersonnelHandler(req, res) {
  try {
    const personnel = await DeliveryService.getAllDeliveryPersonnel();
    res.status(200).json({ success: true, personnel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
    receiveOrderHandler,
    addDeliveryPersonHandler,
    getAllDeliveryPersonnelHandler,
    progressOrderStatus
};
