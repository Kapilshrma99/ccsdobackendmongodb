const { z } = require("zod");
const sanitizeInput = require("../utils/sanitize");

const applicationSchema = z.object({
  name: z.string().min(2).regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces").transform(sanitizeInput),
  phone: z.string().regex(/^\d{10}$/).transform(sanitizeInput),
  email: z.string().email().transform(val => sanitizeInput(val.toLowerCase())),
  statement: z.string().min(10, "Statement must be at least 10 characters")
  .max(500, "Statement cannot exceed 500 characters").transform(sanitizeInput), // safe text only
});

module.exports = applicationSchema;