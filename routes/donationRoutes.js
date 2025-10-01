require('dotenv').config();
const express = require('express');
// const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const DonationOrder = require("../models/DonationOrders"); // adjust path
const nodemailer = require("nodemailer");
const { emailTextfordonationcreation, emailTextfordonationverification } = require('../emailtext');
const router = express.Router();
 
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,        // SSL port
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

let emailText = "";
router.post('/create-order', async (req, res) => {
  try {
    const { donation_type, amount, donor, meta } = req.body;
// console.log(donation_type)
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });
    const amountPaise = Math.round(Number(amount) * 100); // convert INR to paise
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


        emailText = emailTextfordonationcreation(req.body,order);
      try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.OWNER_EMAIL, // where emails go
      subject: `New donation created: ${donor?.first_name || ''} ${donor?.last_name || ''}`,
      text: emailText,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending mail");
  }
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
emailText = emailTextfordonationverification(req.body,record);
 try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.OWNER_EMAIL, // where emails go
      subject: `congratulation donation verified : ${donation_payload.donor.first_name || ''} ${donation_payload.donor.last_name || ''}`,
      text: emailText,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending mail");
  }

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