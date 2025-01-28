const express = require('express');
const path = require('path');
const { isAuthenticatedRedirect } = require('../controllers/auth');
const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'login.html'));
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'login.html'));
});

router.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'signup.html'));
});

router.get('/restaurantsPage', isAuthenticatedRedirect , (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'restaurantsPage.html'));
});


router.get('/order', isAuthenticatedRedirect, (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'order.html'));
});

router.get('/track', isAuthenticatedRedirect, (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'track.html'));
});

module.exports = router;
