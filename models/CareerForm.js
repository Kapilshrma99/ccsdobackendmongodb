const mongoose = require("mongoose");

const careerSchema = new mongoose.Schema({
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
  position: {
    type: String, // Job position applied for
    required: true,
    trim: true
  },
  experience: {
    type: String, // e.g., "2 years", "5+ years"
    required: true,
    trim: true
  },
  employment_type: {
    type: String, // e.g., "Full-time", "Part-time", "Internship"
    required: true,
    trim: true
  },
  message: {
    type: String, // optional cover letter or note
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model("CareerForm", careerSchema);
