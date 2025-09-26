const { z } = require("zod");
const sanitizeInput = require("../utils/sanitize");

const donationSchema = z.object({
  name: z.string()
    .min(2, "Name required")
    .transform(sanitizeInput),

  email: z.string()
    .email("Invalid email")
    .transform(val => sanitizeInput(val.toLowerCase())),

  mobile: z.string()
    .regex(/^\d{10}$/, "Mobile must be 10 digits")
    .transform(sanitizeInput),

  dob: z.string()
    .optional()
    .transform(val => val ? sanitizeInput(val) : val),

  pan: z.string()
    .regex(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, "Invalid PAN")
    .optional()
    .transform(val => val ? sanitizeInput(val.toUpperCase()) : val),

  country: z.string().transform(sanitizeInput),
  state: z.string().transform(sanitizeInput),
  city: z.string().transform(sanitizeInput),
  address: z.string().min(5, "Address required").transform(sanitizeInput),

  pincode: z.string()
    .regex(/^\d{6}$/, "Invalid pincode")
    .transform(sanitizeInput),

  donationAmount: z.union([z.string(), z.number()])
    .transform(val => Number(sanitizeInput(val)))
    .optional(),

  customAmount: z.union([z.string(), z.number()])
    .transform(val => Number(sanitizeInput(val)))
    .optional(),
});

module.exports = donationSchema;
