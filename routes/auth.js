const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const adminSchema = require("../validators/adminValidator");
const validate = require("../middlewares/validate");

const router = express.Router();

// Admin registration (only once – after that, disable it)
router.post("/register", validate(adminSchema),async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, password: hashedPassword });
    await admin.save();

    res.status(201).json({ success: true, message: "Admin registered" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin login
router.post("/login", validate(adminSchema),async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ success: false, message: "Incorrect email" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Incorrect password" });

    // Create JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // token valid for 1 hour
    );

    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
