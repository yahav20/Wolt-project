// signup.js
const express = require('express');
const router = express.Router();
const userService = require('../services/user'); // Your DB logic for creating users

// POST /signup - creates a user in the DB
router.post('/', async (req, res) => {
    const { name, email, password, address } = req.body;
    
    try {
        // Attempt to create a new user in the database
        const user = await userService.createUser(name, email, password, address);
        if (!user) {
            // Couldn’t create user
            return res.status(400).json({
                success: false,
                message: 'Unable to create user. Please try again.',
            });
        }
        
        // Created successfully
        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred.',
            error: error.message,
        });
    }
});

module.exports = router;
