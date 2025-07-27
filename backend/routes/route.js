// route.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');
const auth = require('../middleware/middleware');

// Auth
router.post('/register', controller.register);
router.post('/login', controller.login);

// Users
router.get('/users', auth, controller.getUsers);

// Products
router.post('/products', auth, controller.createProduct);
router.get('/products', controller.getProducts);

// Group Orders
router.post('/group-orders', auth, controller.createGroupOrder); 
router.post('/group-orders/join', auth, controller.joinGroupOrder); 
router.get('/group-orders', auth, controller.getGroupOrders); 

// Regular Orders
router.post('/orders', auth, controller.createOrder);
router.get('/orders', auth, controller.getOrders);

// NEW: Routes for Order Tracking and Modification
// Add these two lines to your router
router.get('/orders/:orderId/track', auth, controller.getOrderTracking);
router.put('/orders/:orderId/modify', auth, controller.modifyOrder);

module.exports = router;