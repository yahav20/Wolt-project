const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const {isAuthenticated} = require('../../../controllers/auth')
const router = express.Router();
const RESTAURANT_SERVICE = process.env.RESTAURANT_SERVICE;


router.use(
  '/menu/filtered',
  createProxyMiddleware({
    target: `${RESTAURANT_SERVICE}/api/restaurants/menu/filtered`, 
    changeOrigin: true,
    pathRewrite: (path, req) => path, 
  })
);

router.use(
  '/',
  createProxyMiddleware({
    target: `${RESTAURANT_SERVICE}/api/restaurants`,
    changeOrigin: true,
    pathRewrite: (path, req) => path,
  })
);

router.use(
  '/id/:id',
  createProxyMiddleware({
    target: `${RESTAURANT_SERVICE}/api/restaurants`,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      const restaurantId = req.params.id;
      return `/${restaurantId}`;
    },
  })
);

module.exports = router;
