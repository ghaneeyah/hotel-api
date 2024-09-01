const Payment = require('../models/payment');
const axios = require('axios'); 


const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL;

exports.createPayment = async (req, res) => {
  try {
    const { userId, bookingId, amount, email, phone, userName } = req.body;

    if (!userId || !bookingId || !amount || !email || !phone || !userName) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const payment = new Payment({
      userId,
      bookingId,
      amount,
      paymentStatus: 'pending',
      paymentReference: `booking-${bookingId}`
    });

    const savedPayment = await payment.save();

    const payload = {
      tx_ref: savedPayment.paymentReference,
      amount,
      currency: 'NGN',
      redirect_url: `${FRONTEND_URL}/thank-you`,
      meta: {
        booking_id: bookingId
      },
      customer: {
        email,
        phonenumber: phone,
        name: userName
      },
      customizations: {
        title: 'Hotel Booking Payment',
        description: 'Payment for Hotel Reservation',
        logo: 'https://yourhotellogo.com/logo.png'
      }
    };

    const response = await axios.post('https://api.flutterwave.com/v3/payments', payload, {
      headers: {
        Authorization: `Bearer ${FLW_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.status === "success") {
      res.json({ status: "success", data: { link: response.data.data.link } });
    } else {
      res.status(400).json({ status: "error", message: "Payment Initiation Failed", error: response.data.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.verifyPayment = async (req, res) => {
  const { transaction_id, tx_ref } = req.query;
  try {
    console.log('Verifying transaction:', transaction_id, 'with tx_ref:', tx_ref);

    const payment = await Payment.findOne({ paymentReference: tx_ref });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    const response = await axios.get(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
      headers: {
        Authorization: `Bearer ${FLW_SECRET_KEY}`
      }
    });

    const data = response.data;
    console.log('Flutterwave response:', data);

    if (data.status === "success" && data.data.status === "successful") {
      payment.paymentStatus = 'completed';
      await payment.save();

      res.redirect(`${FRONTEND_URL}/payment/success`);
    } else {
      payment.paymentStatus = 'failed';
      await payment.save();

      res.redirect(`${FRONTEND_URL}/payment/failure`);
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while verifying the payment'
    });
  }
};