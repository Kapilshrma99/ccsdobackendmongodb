const { ZodError } = require("zod");

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body); // parse + validate
    next();
  } catch (err) {
     if (err instanceof ZodError && Array.isArray(err.errors)) {
      const formattedErrors = err.errors.map(e => ({
        field: e.path.join('.') || 'unknown',
        message: e.message || 'Invalid value'
      }));

      return res.status(400).json({
        success: false,
        errors: formattedErrors
      });
    }
    // Other errors (unexpected ones)
    return res.status(500).json({
      success: false,
      error: err.message || "Something went wrong",
    });
  }
};

module.exports = validate;
