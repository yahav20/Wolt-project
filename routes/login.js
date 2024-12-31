const express = require('express');
const router = express.Router();
const userService = require('../services/user'); 

router.get('/', (req, res) => {
    res.render('login.ejs'); 
});

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userService.authenticateUser(email, password);
        if (user) {
            req.session.userId = user._id; 
            res.redirect('/dashboard');
        } else {
            res.render('login.ejs', { error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).render('login.ejs', { error: 'An unexpected error occurred' });
    }
});

module.exports = router;
