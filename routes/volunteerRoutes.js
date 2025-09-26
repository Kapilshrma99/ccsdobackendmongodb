const express = require("express");
const router = express.Router();
const volunteerSchema = require("../validators/volunteerValidator");
const VolunteerForm = require("../models/VolunteerForm");
const validate = require("../middlewares/validate");

// Volunteer Form
router.post("/volunteer", validate(volunteerSchema),async (req, res) => {
  try {
    const newVolunteer = new VolunteerForm(req.body);
    await newVolunteer.save();
    res.status(201).json({ success: true, message: "Volunteer form saved!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;