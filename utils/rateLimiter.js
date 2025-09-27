const rateLimit = require("express-rate-limit");

// Create a limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: {
    status: 429,
    error: "Too many login attempts, please try again after 15 minutes."
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,  // Disable deprecated headers
});
module.exports = loginLimiter;