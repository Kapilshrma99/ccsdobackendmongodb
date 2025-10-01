const { z } = require("zod");
const sanitizeInput = require("../utils/sanitize");

const donationSchema = z.object({
  name: z.string()
    .min(2, "Name required")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .transform(sanitizeInput),

  email: z.string()
    .email("Invalid email")
    .transform(val => sanitizeInput(val.toLowerCase())),

  mobile: z.string()
    .regex(/^\d{10}$/, "Mobile must be 10 digits")
    .transform(sanitizeInput),

  dob: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .optional()
    .transform(val => val ? sanitizeInput(val) : val),

  pan: z.string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN")
    .length(10)
    .optional()
    .transform(val => val ? sanitizeInput(val.toUpperCase()) : val),

  // country: z.string().min(2, "Country required").transform(sanitizeInput),
  state: z.string().min(2, "State required").transform(sanitizeInput),
  city: z.string().min(2, "City required").transform(sanitizeInput),
  address: z.string().min(5, "Address required").transform(sanitizeInput),

  pincode: z.string()
    .regex(/^\d{6}$/, "Invalid pincode")
    .transform(sanitizeInput),

  donationAmount: z.union([z.string(), z.number()])
    .transform(val => Number(sanitizeInput(val)))
    .refine(val => !isNaN(val) && val > 0, "Amount must be positive")
    .optional(),

  customAmount: z.union([z.string(), z.number()])
    .transform(val => Number(sanitizeInput(val)))
    .refine(val => !isNaN(val) && val > 0, "Amount must be positive")
    .optional(),
});


module.exports = donationSchema;
