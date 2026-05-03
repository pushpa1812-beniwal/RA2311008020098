const axios = require('axios');

/**
 * Reusable logging function
 * Must NOT use console.log
 * Should not crash app if logging fails
 */
const Log = async (stack, level, pkg, message) => {
  try {
    // Send log to a mock external logging service or self-endpoint
    // Assuming a self endpoint /internal/logs for demonstration, or an external URL
    // We'll use a dummy URL that won't crash if it fails
    await axios.post('http://localhost:3000/internal/logs', {
      stack,
      level,
      package: pkg,
      message,
      timestamp: new Date().toISOString()
    }).catch(() => {
      // Ignore errors to prevent app from crashing
    });
  } catch (error) {
    // Completely swallow the error to not crash the app, and NO console.log
  }
};

module.exports = Log;
