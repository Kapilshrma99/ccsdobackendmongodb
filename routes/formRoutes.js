const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require('dotenv').config();


const ContactForm = require("../models/ContactForm");
const DonationForm = require("../models/DonationForm");
const ApplicationForm = require("../models/ApplicationForm");
const VolunteerForm = require("../models/VolunteerForm");
const InternshipForm = require("../models/InternshipForm");
const CareerForm = require("../models/CareerForm");
const DonationOrder = require("../models/DonationOrders");


const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");



const contactSchema = require("../validators/contactValidator");
const donationSchema = require("../validators/donationValidator");
const applicationSchema = require("../validators/applicationValidator");
const volunteerSchema = require("../validators/volunteerValidator");
const internshipSchema = require("../validators/internshipValidator");
const careerSchema = require("../validators/careerValidator");
const { emailTextforcareer } = require("../emailtext");
// const adminSchema = require("../validators/adminValidator");

const transporter = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    user: "THpuykwQRKS4KIA6bJVzgw",   // literally the word "apikey"
    pass: process.env.SENDGRID_API_KEY,
  },
});
// const transporter = nodemailer.createTransport({
//   host: "smtp.hostinger.com",
//   // port:587,
//   port: 465,
//   // secure:false,        // SSL port
//   secure: true, 
//   auth: {
//     user: process.env.EMAIL_USER, 
//     pass: process.env.EMAIL_PASS, 
//   },
// });

async function mail(subject, text) {
try {
  console.log("mail sending")
   const res= await transporter.sendMail({
      // from: process.env.EMAIL_USER,
      from:"kapilsharma09311@gmail.com",
      to: process.env.OWNER_EMAIL, // where emails go
      subject: subject,
      text: text,

    });
    console.log("mail sent",res)

  } catch (error) {
    console.error(error);
 
  }

}

// Career Form
router.post("/career", validate(careerSchema), async (req, res) => {
  try {
    const newCareer = new CareerForm(req.body);
    await newCareer.save();
    const emailText = emailTextforcareer(newCareer,"career");
    mail(`New career form`,emailText);
          
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
      const emailText = emailTextforcareer(newInternship,"internship");
    mail(`New internship form`,emailText);
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
        const emailText = emailTextforcareer(newVolunteer,"volunteer");
    mail(`New volunteer form`,emailText);
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
        const emailText = emailTextforcareer(newContact,"contact");
    mail(`New contact form`,emailText);
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
        const emailText = emailTextforcareer(newDonation,"donation");
    mail(`New donation form`,emailText);
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
        const emailText = emailTextforcareer(newApp,"application");
    mail(`New application form`,emailText); 
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
      payments
    ] = await Promise.all([
      ContactForm.find(),
      DonationForm.find(),
      ApplicationForm.find(),
      VolunteerForm.find(),
      InternshipForm.find(),
      CareerForm.find(),
      DonationOrder.find()
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
        payments
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
