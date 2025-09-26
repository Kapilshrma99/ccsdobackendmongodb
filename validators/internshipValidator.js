const { z } = require("zod");

const sanitizeString = (str) => str?.trim();

const internshipSchema = z.object({
  fname: z.string().min(2, "First name is required").transform(sanitizeString),
  lname: z.string().min(2, "Last name is required").transform(sanitizeString),
  email: z.string().email("Invalid email").transform(sanitizeString).transform(s => s.toLowerCase()),
  phone: z.string().min(10, "Phone must be 10 digits").max(10, "Phone must be 10 digits").transform(sanitizeString),
  college: z.string().min(5, "College is required").transform(sanitizeString),
  course: z.string().min(3, "Course is required").transform(sanitizeString),
  duration: z.string().min(1, "Duration is required").transform(sanitizeString),
  area: z.string().min(1, "Area of interest is required").transform(sanitizeString),
  message: z.string().optional().transform(sanitizeString)
});

module.exports = internshipSchema;
