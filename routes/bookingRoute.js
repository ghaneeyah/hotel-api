const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/Auth');

 
router.post('/create', bookingController.createBooking);
router.get('/bookings',auth, bookingController.fetchUserBookings);

module.exports = router;

