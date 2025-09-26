const { z } = require("zod");

const sanitizeString = (str) => str?.trim();

const careerSchema = z.object({
  fname: z.string().min(1, "First name is required").transform(sanitizeString),
  lname: z.string().min(1, "Last name is required").transform(sanitizeString),
  email: z.string().email("Invalid email").transform(sanitizeString).transform(s => s.toLowerCase()),
  phone: z.string().min(10, "Phone must be 10 digits").max(10, "Phone must be 10 digits").transform(sanitizeString),
  position: z.string().min(1, "Position is required").transform(sanitizeString),
  experience: z.string().min(1, "Experience is required").transform(sanitizeString),
  employment_type: z.string().min(1, "Employment type is required").transform(sanitizeString),
  message: z.string().optional().transform(sanitizeString)
});

module.exports = careerSchema;
