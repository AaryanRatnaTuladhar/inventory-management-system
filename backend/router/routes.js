const express = require("express");
const router = express.Router();

const userController = require('../controller/userController');
const productController = require('../controller/productController');
const saleController = require('../controller/saleController');

// User Routes
router.post('/register', userController.createUser);
router.post('/login', userController.login);
router.delete('/deleteuser', userController.deleteUser);
router.get("/getuser", userController.getUserByAuth);
router.get("/getAllUsers", userController.getAllUsers);

// Product Routes
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);
router.get('/dashboard/product-stats', productController.getProductStats);

// Sales Routes
router.get('/sales', saleController.getAllSales);
router.get('/sales/stats', saleController.getSalesStats);
router.get('/sales/:id', saleController.getSaleById);
router.post('/sales', saleController.createSale);
router.put('/sales/:id', saleController.updateSale);
router.put('/sales/:id/cancel', saleController.cancelSale);

module.exports = router;