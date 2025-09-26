const { z } = require("zod");
const sanitizeInput = require("../utils/sanitize");


const adminSchema = z.object({
  
  email: z.string().email().transform(val => sanitizeInput(val.toLowerCase())),
  password: z.string().min(6),
});


module.exports = adminSchema;