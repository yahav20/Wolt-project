const express = require('express');
const router = express.Router();

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    res.redirect('/login');
};

// Render the dashboard page, only if authenticated
router.get('/', isAuthenticated, (req, res) => {
    res.render('dashboard.ejs'); // Assuming your EJS file is named `dashboard.ejs`
});

module.exports = router;
