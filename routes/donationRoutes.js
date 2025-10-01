require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const DonationOrder = require("../models/DonationOrders"); // adjust path

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post('/create-order', async (req, res) => {
  try {
    const { donation_type, amount, donor, meta } = req.body;
// console.log(donation_type)
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

    const amountPaise = Math.round(Number(amount) * 100); // convert INR to paise
    // console.log(amountPaise)
    const receiptId = 'donation_' + Date.now();

    const orderOptions = {
      amount: amountPaise,
      currency: 'INR',
      receipt: receiptId,
      payment_capture: 1, // auto-capture
      notes: {
        donation_type: donation_type || 'one-time',
        donor_name: donor?.first_name + ' ' + donor?.last_name || '',
        donor_email: donor?.email || ''
      }
    };

    const order = await razorpay.orders.create(orderOptions);
    const donationOrder = new DonationOrder({
      razorpay_order_id: order.id,
      receipt: order.receipt,
      amount: order.amount,
      currency: order.currency,
      payment_capture: order.payment_capture,
      notes: order.notes,
      status: order.status, // usually "created"
    });
    await donationOrder.save();
    // Save order metadata in DB here (optional)
    return res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
      receiptId
    });
  } catch (err) {
    console.error('create-order error', err);
    return res.status(500).send('Server error creating order');
  }
});


router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donation_payload } = req.body;
    const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Payment verified: store transaction details + donation_payload in DB
      const record = {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        signature: razorpay_signature,
        donation_payload,
        verified_at: new Date()
      };
      // TODO: save `record` into your DB
      await DonationOrder.findOneAndUpdate(
  { razorpay_order_id },
  { 
    $set: { 
      payment_id: razorpay_payment_id, 
      status: "paid" 
    } 
  },
  { new: true }
);

      return res.json({ success: true, record });
    } else {
      return res.status(400).json({ success: false, error: 'Invalid signature' });
    }

    
  } catch (err) {
    console.error('verify-payment error', err);
    return res.status(500).json({ success: false, error: 'Server error verifying payment' });
  }
});

module.exports = router;