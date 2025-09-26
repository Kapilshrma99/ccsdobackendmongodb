const mongoose = require("mongoose");

const donationFormSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  dob: String,
  pan: String,
  country: String,
  state: String,
  city: String,
  address: String,
  pincode: String,
  donationAmount: Number,
  customAmount: Number,
}, { timestamps: true });

module.exports = mongoose.model("DonationForm", donationFormSchema);
