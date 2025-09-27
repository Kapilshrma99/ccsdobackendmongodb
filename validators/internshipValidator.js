const { z } = require("zod");
const sanitizeString = require("../utils/sanitize");


const internshipSchema = z.object({
  fname: z.string()
    .min(2, "First name is required")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces")
    .transform(sanitizeString),

  lname: z.string()
    .min(2, "Last name is required")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces")
    .transform(sanitizeString),

  email: z.string()
    .email("Invalid email")
    .transform(s => sanitizeString(s.toLowerCase())),

  phone: z.string()
    .regex(/^\d{10}$/, "Phone must be 10 digits")
    .transform(sanitizeString),

  college: z.string()
    .min(5, "College is required")
    .max(100, "College name too long")
    .transform(sanitizeString),

  course: z.string()
    .min(3, "Course is required")
    .max(50, "Course name too long")
    .transform(sanitizeString),

  duration: z.string()
    .min(1, "Duration is required")
    .max(50, "Duration too long")
    .transform(sanitizeString),

  area: z.string()
    .min(1, "Area of interest is required")
    .max(50, "Area too long")
    .transform(sanitizeString),

  message: z.string()
    .max(1000, "Message too long")
    .optional()
    .transform(sanitizeString),
});


module.exports = internshipSchema;
