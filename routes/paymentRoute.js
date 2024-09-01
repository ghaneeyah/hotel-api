const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const paymentAuthMiddleware = require('../middleware/paymentAuthMiddleware');


router.post('/create', paymentAuthMiddleware, paymentController.createPayment);
router.get('/verify/:paymentReference', paymentAuthMiddleware, paymentController.verifyPayment);

module.exports = router;

