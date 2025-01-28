const axios = require('axios');
const DeliveryService = require("../service/deliveryService");
const DeliveryPerson = require("../model/deliveryPerson");
const EventEmitter = require('events');
const orderEventEmitter = new EventEmitter();

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
    res.status(200).json({ 
      success: true, 
      order, 
      deliveryPerson 
    });
    // Progress order status with delivery person context
    await progressOrderStatus(order, deliveryPerson);
    
   
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function progressOrderStatus(order, deliveryPerson) {
  for (const status of ORDER_STATUSES) {
    try {
      const updatePayload = { 
        status, 
        deliveryPersonId: deliveryPerson._id 
      };
      
      axios.patch(
        process.env.ORDERS_SERVICE + `/api/orders/${order._id}/status`, 
        updatePayload
      );



      // Additional context-specific actions
      switch (status) {
        case 'COMPLETED':
          // Mark delivery person as available again
          await DeliveryPerson.findByIdAndUpdate(deliveryPerson._id, { 
            available: true,
            currentOrderId: null 
          });
          break;
      }
      
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