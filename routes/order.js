const express = require('express');
const router = express.Router();
const {checkToken} = require('../authantication/validate-token');
const orderController=require('../controllers/ordercontrollers');

// Get all orders
router.get('/getorders',orderController.getAllOrders);

// Create a new order
router.post('/createOrder',checkToken,orderController.createOrder);

// Delete an order
router.delete('/:id',checkToken,orderController.deleteOrder);

////////////////
module.exports = router;
