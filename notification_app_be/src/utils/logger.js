const axios = require('axios');
const authService = require('../services/authService');
const config = require('../config');

const ALLOWED_STACKS = ['backend', 'frontend'];
const ALLOWED_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];
const ALLOWED_PACKAGES = [
  'cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 
  'route', 'service', 'auth', 'config', 'middleware', 'utils', 'api', 'component', 'hook', 'page', 'state', 'style'
];

/**
 * Reusable Logging Middleware
 * Must strictly follow enum values
 */
const Log = async (stack, level, pkg, message) => {
  // Validate constraints silently
  if (!ALLOWED_STACKS.includes(stack)) return;
  if (!ALLOWED_LEVELS.includes(level)) return;
  if (!ALLOWED_PACKAGES.includes(pkg)) return;

  try {
    const token = await authService.getAccessToken();
    if (!token) return; // Cannot log without token

    await axios.post(
      `${config.TEST_SERVER_URL}/evaluation-service/logs`,
      { stack, level, package: pkg, message },
      { headers: { Authorization: `Bearer ${token}` } }
    ).catch(() => {
      // Suppress HTTP errors
    });
  } catch (err) {
    // Absolute suppression as per requirements: DO NOT use console.log
  }
};

module.exports = Log;
