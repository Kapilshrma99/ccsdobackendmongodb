const rateLimit = require("express-rate-limit");

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 50, // limit each IP to 50 requests per 15 min
  message: "Too many requests, please try again later."
});

module.exports = globalLimiter;
