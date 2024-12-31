const express = require('express');
const router = express.Router();

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    res.redirect('/login');
};

const preventCache = (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
};

// Apply both middlewares to the dashboard route
router.get('/', isAuthenticated, preventCache, (req, res) => {
    res.render('dashboard.ejs'); // Assuming your EJS file is named `dashboard.ejs`
});

module.exports = router;
