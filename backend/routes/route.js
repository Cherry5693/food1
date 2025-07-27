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

// Orders
router.post('/orders', auth, controller.createOrder);
router.get('/orders', auth, controller.getOrders);

module.exports = router; 