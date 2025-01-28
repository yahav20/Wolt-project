const jwt = require('jsonwebtoken');
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
    req.user = decoded; // Set user for internal use
    req.headers['x-user-id'] = decoded.userId;
    next();
  });
}

function isAuthenticatedRedirect(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.redirect('/login');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.redirect('/login');
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.redirect('/login');
    }
    req.user = decoded; // Attach the decoded user info for internal use
    req.headers['x-user-id'] = decoded.userId;
    next();
  });
}

module.exports = {isAuthenticated, isAuthenticatedRedirect}