const mongoose = require("mongoose");

const applicationFormSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  statement: String,
}, { timestamps: true });

module.exports = mongoose.model("ApplicationForm", applicationFormSchema);
