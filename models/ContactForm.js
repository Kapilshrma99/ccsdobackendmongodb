const mongoose = require("mongoose");

const contactFormSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  phone: String,
  message: String,
}, { timestamps: true });

module.exports = mongoose.model("ContactForm", contactFormSchema);
