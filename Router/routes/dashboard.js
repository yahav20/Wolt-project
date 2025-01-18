const express = require('express');
const router = express.Router();
const {isAuthenticated} = require('../controllers/auth')

router.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard.ejs');
});

router.get('/login', (req, res) => {
    res.render('login.ejs');
  });


router.get('/signup', (req, res) => {
    res.render('signup.ejs');
});

module.exports = router;
