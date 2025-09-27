const express = require("express");
const router = express.Router();

const ContactForm = require("../models/ContactForm");
const DonationForm = require("../models/DonationForm");
const ApplicationForm = require("../models/ApplicationForm");
const VolunteerForm = require("../models/VolunteerForm");
const InternshipForm = require("../models/InternshipForm");
const CareerForm = require("../models/CareerForm");


const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");



const contactSchema = require("../validators/contactValidator");
const donationSchema = require("../validators/donationValidator");
const applicationSchema = require("../validators/applicationValidator");
const volunteerSchema = require("../validators/volunteerValidator");
const internshipSchema = require("../validators/internshipValidator");
const careerSchema = require("../validators/careerValidator");
// const adminSchema = require("../validators/adminValidator");

// Career Form
router.post("/career", validate(careerSchema), async (req, res) => {
  try {
    const newCareer = new CareerForm(req.body);
    await newCareer.save();
    res.status(201).json({ success: true, message: "Career form saved!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  } 
});

// Internship Form
router.post("/internship", validate(internshipSchema), async (req, res) => {
  try {
    const newInternship = new InternshipForm(req.body); 
    await newInternship.save();
    res.status(201).json({ success: true, message: "Internship form saved!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  } 
});

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
// Contact Form
router.post("/contact", validate(contactSchema),async (req, res) => {
  try {
    const newContact = new ContactForm(req.body);
    await newContact.save();
    res.status(201).json({ success: true, message: "Contact form saved!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Donation Form
router.post("/donation", validate(donationSchema), async (req, res) => {
  try {
    const newDonation = new DonationForm(req.body);
    await newDonation.save();
    res.status(201).json({ success: true, message: "Donation form saved!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Application Form
router.post("/application", validate(applicationSchema), async (req, res) => {
  try {
    const newApp = new ApplicationForm(req.body);
    await newApp.save();
    res.status(201).json({ success: true, message: "Application form saved!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


//fetches all data from mongodb
router.get("/all-forms",auth, async (req, res) => {
  try {
    // Fetch data in parallel for better performance
    const [
      contacts,
      donations,
      applications,
      volunteers,
      internships,
      careers,
    ] = await Promise.all([
      ContactForm.find(),
      DonationForm.find(),
      ApplicationForm.find(),
      VolunteerForm.find(),
      InternshipForm.find(),
      CareerForm.find(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        contacts,
        donations,
        applications,
        volunteers,
        internships,
        careers,
      },
    });
  } catch (err) {
    console.error("Error fetching forms:", err.message);
    res.status(500).json({
      success: false,
      error: "Server error while fetching forms",
    });
  }
});
module.exports = router;
