const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const router = express.Router();
require('custom-env').env(process.env.NODE_ENV,'./config');
USERS_SERVICE = process.env.USERS_SERVICE;
console.log(USERS_SERVICE, `${USERS_SERVICE}/login`)

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

module.exports = router;
