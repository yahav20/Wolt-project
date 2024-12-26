const express = require('express');
const router = express.Router();
const userService = require('../services/user'); // Adjust the path as needed

// Render the login page
router.get('/', (req, res) => {
    res.render('login.ejs'); // Assuming your EJS file is named `login.ejs`
});

// Handle login form submission
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userService.authenticateUser(email, password);
        if (user) {
            // Set up session or token logic
            req.session.userId = user._id; // Example using sessions
            res.redirect('/dashboard'); // Redirect to a dashboard or other authenticated page
        } else {
            res.render('login.ejs', { error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).render('login.ejs', { error: 'An unexpected error occurred' });
    }
});

module.exports = router;
