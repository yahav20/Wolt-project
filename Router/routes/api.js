const express = require('express');
const router = express.Router();
const usersRoutes = require('./api/users.js')

router.use('/users', usersRoutes)
module.exports = router;
