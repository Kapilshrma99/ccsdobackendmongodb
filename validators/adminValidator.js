const { z } = require("zod");
const sanitizeInput = require("../utils/sanitize");


const adminSchema = z.object({
  
  email: z.string().email().transform(val => sanitizeInput(val.toLowerCase())),
  password: z.string().min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/[a-z]/, "Must contain a lowercase letter")
  .regex(/[0-9]/, "Must contain a number")
  .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
});


module.exports = adminSchema;