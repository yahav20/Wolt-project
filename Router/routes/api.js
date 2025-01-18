const express = require('express');
const router = express.Router();
const usersRoutes = require('./api/users.js')
const restaurantRoutes = require('./api/restaurant/restaurant')
const {isAuthenticated} = require('../controllers/auth')
const itemsRoutes = require('./api/restaurant/items')
const categoryRoutes = require('./api/restaurant/categoryItems')
const ordersRoutes = require('./api/orders') 

router.use('/users', usersRoutes)
router.use('/restaurants', isAuthenticated, restaurantRoutes)
router.use('/item', itemsRoutes)
router.use('/categoryItems', categoryRoutes)
router.use('/orders', ordersRoutes)

module.exports = router;
