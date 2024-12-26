const express = require('express');
const router = express.Router();
const userService = require('../services/user'); // Adjust the path to your user service

// Render the signup page
router.get('/', (req, res) => {
    res.render('signup.ejs'); // Render the signup EJS page
});

// Handle signup form submission
router.post('/', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await userService.createUser(name, email, password);
        if (user) {
            // Redirect to login after successful signup
            res.redirect('/login');
        } else {
            // If user creation fails, reload signup page with an error
            res.render('signup.ejs', { error: 'Unable to create account. Please try again.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).render('signup.ejs', { error: 'An unexpected error occurred.' });
    }
});

module.exports = router;
