const { z } = require("zod");
const sanitizeInput = require("../utils/sanitize");
const contactSchema = z.object({
  fname: z.string().min(2, "First name is too short").transform(sanitizeInput),
  lname: z.string().min(2, "Last name is too short").transform(sanitizeInput),
  email: z.string().email().transform(val => sanitizeInput(val.toLowerCase())),
  phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits").transform(sanitizeInput),
  message: z.string().min(5, "Message too short").transform(sanitizeInput),
});

module.exports = contactSchema;
