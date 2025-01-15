const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const {isAuthenticated} = require('../../controllers/auth')
const router = express.Router();
require('custom-env').env(process.env.NODE_ENV,'./config');
ORDERS_SERVICE = process.env.ORDERS_SERVICE;


router.use(isAuthenticated);
router.use(
  '/login',
  createProxyMiddleware({
    target: `${USERS_SERVICE}/login`,
    changeOrigin: true,
  })
);

router.use(
  '/signup',
  createProxyMiddleware({
    target: `${USERS_SERVICE}/signup`,
    changeOrigin: true,
  })
);
router.use(
  '/id/:id', isAuthenticated,
  createProxyMiddleware({
    target: USERS_SERVICE,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      // Rewrite the path to include the :id parameter in the target URL
      const userId = req.params.id;
      return `/users/${userId}`;
    },
  })
);

module.exports = router;