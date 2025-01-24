const express = require('express');
const router = express.Router();
const userService = require('../services/user'); 
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'SUPER_SECRET_KEY';
// GET endpoint for health check or API documentation
router.get('/', (req, res) => {
    res.json({ message: 'Login API is working' });
});

// POST endpoint for login
router.post('/', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await userService.authenticateUser(email, password);
      console.log(user, '1');
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      console.log(user, '2');
      // Create JWT
      const token = jwt.sign(
        { userId: user._id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: '1h' } // token expiration
      );
  
      return res.json({
        success: true,
        message: 'Login successful',
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });

module.exports = router;
