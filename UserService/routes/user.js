const express = require('express');

var router = express.Router();
const userController = require('../controllers/user');


router.route('/').
    get(userController.getUsers)
    .post(userController.createUser)

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateHistory)

router.route('/id')
    .post(userController.getUserByToken);


module.exports = router;