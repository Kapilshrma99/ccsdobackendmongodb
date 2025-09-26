const { z } = require("zod");
const sanitizeInput = require("../utils/sanitize");

const applicationSchema = z.object({
  name: z.string().min(2).transform(sanitizeInput),
  phone: z.string().regex(/^\d{10}$/).transform(sanitizeInput),
  email: z.string().email().transform(val => sanitizeInput(val.toLowerCase())),
  statement: z.string().min(10).transform(sanitizeInput), // safe text only
});

module.exports = applicationSchema;