const mongoose = require('mongoose');
const Booking = require('../models/bookingModel')

exports.createBooking = async (req, res) => {
  try {
    console.log('Request Body:', req.body);

    const { userId, hotelId, roomType, checkInDate, checkOutDate, totalPrice, guests, userName, email, phone } = req.body;

   
    if (!userId || !hotelId || totalPrice === undefined || !checkInDate || !checkOutDate) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Validate hotelId and userId format
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(hotelId)) {
      return res.status(400).json({ success: false, message: 'Invalid hotelId or userId format' });
    }

    // Validate date range
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    if (checkOut <= checkIn) {
      return res.status(400).json({ success: false, message: 'Check-out date must be after check-in date' });
    }

    // Convert userId and hotelId to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const hotelObjectId = new mongoose.Types.ObjectId(hotelId);

    // Convert guests and totalPrice to numbers
    const numberOfGuests = parseInt(guests, 10);
    const price = Number(totalPrice);

    const booking = new Booking({
      userId: userObjectId,
      hotelId: hotelObjectId,
      roomType,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalPrice: price,
      guests: numberOfGuests,
      userName,
      email,
      phone
    });

    const savedBooking = await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: savedBooking
    });
  } catch (error) {
    console.error('Error creating booking:', error.message);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the booking',
      error: error.message
    });
  }
};


exports.fetchUserBookings = async (req, res) => {
  try {
      const userId = req.user._id || req.query.userId || req.body.userId;

      if (!userId) {
          return res.status(401).json({ success: false, message: 'Unauthorized access' });
      }

      const bookings = await Booking.find({ userId }).populate('hotelId');

      res.status(200).json({
          success: true,
          bookings
      });
  } catch (error) {
      console.error('Error fetching user bookings:', error);
      res.status(500).json({
          success: false,
          message: 'An error occurred while fetching bookings',
          error: error.message
      });
  }
};
