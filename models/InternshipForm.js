const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
    trim: true
  },
  lname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  college: {
    type: String,
    required: true,
    trim: true
  },
  course: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String, // e.g., "3 months", "6 months"
    required: true,
    trim: true
  },
  area: {
    type: String, // area of interest
    required: true,
    trim: true
  },
  message: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model("InternshipForm", internshipSchema);
