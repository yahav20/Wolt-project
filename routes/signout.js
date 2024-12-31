const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // Destroy the session
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).send('An unexpected error occurred while signing out');
        }
        // Redirect to login page or homepage after sign-out
        res.redirect('/');
    });
});

module.exports = router;
