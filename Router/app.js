const express = require('express');
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 4000;
app.use(morgan('combined'));
const JWT_SECRET = 'SUPER_SECRET_KEY';

function isAuthenticated(req, res, next) {

  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'No token found' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token found' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.user = decoded; 
    next();
  });
}

app.get('/', (req, res) => {
  res.json({ message: 'API Gateway is running' });
});

app.get('/secure', isAuthenticated, (req, res) => {
  res.json({
    message: 'You have accessed a protected route!',
    user: req.user,
  });
});


app.use(
  '/api/users/login',
  createProxyMiddleware({
    target: 'http://localhost:3000/login',
    changeOrigin: true,
  })
);

app.use(
  '/api/users/signup',
  createProxyMiddleware({
    target: 'http://localhost:3000/signup',
    changeOrigin: true,
  })
);

app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});