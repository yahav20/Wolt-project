const DeliveryService = require("../service/deliveryService");
const { updateOrderStatus } = require("../service/updateStatus");
const DeliveryPerson = require("../model/deliveryPerson");

async function receiveOrderHandler(req, res) {
    const order = req.body;
  
    try {
      const deliveryPerson = await DeliveryService.assignDelivery(order);
    //   await updateOrderStatus(order._id, "Out for Delivery");
  
      res.status(200).json({
        success: true,
        message: "Delivery process started",
        deliveryPerson,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
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
    getAllDeliveryPersonnelHandler
};
