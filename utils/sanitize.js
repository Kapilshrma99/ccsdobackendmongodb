const xss = require("xss");

function sanitize(value) {
  if (typeof value === "string") {
    return xss(value.trim()); // trim + remove malicious scripts
  }
  return value;
}

module.exports = sanitize;
