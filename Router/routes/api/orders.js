const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const {isAuthenticated} = require('../../controllers/auth')
const router = express.Router();
const ORDERS_SERVICE = process.env.ORDERS_SERVICE + "/api/orders";


router.use(isAuthenticated);
router.use(
  '/',
  createProxyMiddleware({
    target: `${ORDERS_SERVICE}/`,
    changeOrigin: true,
  })
);

router.use(
  '/id/:id', isAuthenticated,
  createProxyMiddleware({
    target: ORDERS_SERVICE,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      const orderId = req.params.id;
      return `/${orderId}`;
    },
  })
);


router.use(
  '/:id/status',
  createProxyMiddleware({
    target: ORDERS_SERVICE,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      const orderId = req.params.id;
      return `/${orderId}/status`;
    },
  })
);

module.exports = router;
