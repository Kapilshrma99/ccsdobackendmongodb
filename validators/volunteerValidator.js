const { z } = require("zod");

// Helper function to trim and sanitize strings
const sanitizeString = (str) => str?.trim();

const volunteerSchema = z.object({
  fname: z.string().min(1, "First name is required").transform(sanitizeString),
  lname: z.string().min(1, "Last name is required").transform(sanitizeString),
  email: z.string().email("Invalid email").transform(sanitizeString).transform(s => s.toLowerCase()),
  phone: z.string().min(10, "Phone must be 10 digits").max(10, "Phone must be 10 digits").transform(sanitizeString),
  age: z.number().int().positive().optional(),
  availability: z.string().optional().transform(sanitizeString),
  interest_area: z.string().optional().transform(sanitizeString),
  mode: z.enum(["Online", "Offline"]).optional(),
  message: z.string().optional().transform(sanitizeString)
});

module.exports = volunteerSchema;
