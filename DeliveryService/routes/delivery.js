const express = require("express");
const DeliveryController = require("../controllers/deliveryController");

const router = express.Router();

// Endpoint to add a delivery person
router.post("/delivery-personnel", DeliveryController.addDeliveryPersonHandler);

// Endpoint to receive an order and start delivery
router.post("/", DeliveryController.receiveOrderHandler);

// Endpoint to get all delivery personnel
router.get("/personnel", DeliveryController.getAllDeliveryPersonnelHandler);

module.exports = router;
