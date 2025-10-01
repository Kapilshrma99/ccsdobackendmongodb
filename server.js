const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const globalLimiter = require("./utils/globalLimeter");

const formRoutes = require("./routes/formRoutes");
const authRoutes = require("./routes/auth");
const donationRoutes = require("./routes/donationRoutes");
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(globalLimiter);

// Routes
app.use("/api/forms", formRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/donation", donationRoutes);
// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
  })
  .catch(err => console.log(err));
