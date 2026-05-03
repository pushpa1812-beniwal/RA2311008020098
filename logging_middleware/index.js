const axios = require('axios');

async function Log(stack, level, pkg, message) {
  const allowedStacks = ['backend', 'frontend'];
  const allowedLevels = ['debug', 'info', 'warn', 'error', 'fatal'];

  if (!allowedStacks.includes(stack)) return;
  if (!allowedLevels.includes(level)) return;
  if (!pkg || typeof pkg !== 'string') return;
  if (!message || typeof message !== 'string') return;

  const logPayload = {
    stack,
    level,
    package: pkg,
    message,
    timestamp: new Date().toISOString()
  };

  const logApiUrl = process.env.LOG_API_URL;

  if (!logApiUrl) return;

  try {
    await axios.post(logApiUrl, logPayload);
  } catch (err) {
    // Silently ignore as per constraints
  }
}

module.exports = { Log };
