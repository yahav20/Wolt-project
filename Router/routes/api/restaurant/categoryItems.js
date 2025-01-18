const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const {isAuthenticated} = require('../../../controllers/auth')
const router = express.Router();
const RESTAURANT_SERVICE = process.env.RESTAURANT_SERVICE;
console.log(RESTAURANT_SERVICE, "aa");
router.use(
    '/',
    createProxyMiddleware({
      target: `${RESTAURANT_SERVICE}/api/categoryItems`, // Base target URL for category items
      changeOrigin: true,
      pathRewrite: (path, req) => {
        // Rewrites the path to match the target service's structure
        const restaurantId = req.params.restaurantId;
        const categoryId = req.params.categoryId;
  
        if (path.startsWith('/' + restaurantId + '/' + categoryId)) {
          // Path for delete route
          return `/${restaurantId}/${categoryId}`;
        } else if (path.startsWith('/' + restaurantId)) {
          // Path for get or post routes
          return `/${restaurantId}`;
        }
  
        return path; // Default case (if additional paths are added later)
      },
    })
  );
  
  module.exports = router;
  