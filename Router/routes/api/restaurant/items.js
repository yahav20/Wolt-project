const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const {isAuthenticated} = require('../../../controllers/auth')
const router = express.Router();
const RESTAURANT_SERVICE = process.env.RESTAURANT_SERVICE;

router.use(
    '/',
    createProxyMiddleware({
      target: `${RESTAURANT_SERVICE}/api/item`, // Base target URL for item-related operations
      changeOrigin: true,
      pathRewrite: (path, req) => {
        const categoryId = req.params.categoryId;
  
        // Rewrite path for GET, POST, DELETE routes
        if (path.startsWith(`/${categoryId}/item`)) {
          // For `getItemByName`
          return `/${categoryId}/item`;
        } else if (path.startsWith(`/${categoryId}`)) {
          // For other operations (add, delete, get items)
          return `/${categoryId}`;
        }
  
        return path; // Default case (future-proofing)
      },
    })
  );

  module.exports = router;
