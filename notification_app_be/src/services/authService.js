const axios = require('axios');
const config = require('../config');

let clientId = null;
let clientSecret = null;
let accessToken = null;
let tokenExpiry = null;

const getTestServerUrl = () => config.TEST_SERVER_URL;

const registerClient = async () => {
  try {
    const response = await axios.post(`${getTestServerUrl()}/evaluation-service/register`, {
      name: 'Campus Notifications Backend',
      purpose: 'Backend API implementation'
    });
    
    if (response.data && response.data.clientId && response.data.clientSecret) {
      clientId = response.data.clientId;
      clientSecret = response.data.clientSecret;
      return true;
    }
    return false;
  } catch (error) {
    // Cannot use log here if log relies on auth.
    return false;
  }
};

const authenticate = async () => {
  if (!clientId || !clientSecret) {
    const registered = await registerClient();
    if (!registered) return false;
  }

  try {
    const response = await axios.post(`${getTestServerUrl()}/evaluation-service/auth`, {
      clientId,
      clientSecret
    });

    if (response.data && response.data.access_token) {
      accessToken = response.data.access_token;
      // Assume a 1 hour expiry if not provided
      const expiresIn = response.data.expires_in || 3600;
      tokenExpiry = Date.now() + (expiresIn * 1000) - 60000; // 1 min buffer
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const getAccessToken = async () => {
  if (!accessToken || Date.now() >= tokenExpiry) {
    await authenticate();
  }
  return accessToken;
};

module.exports = {
  getAccessToken,
  authenticate,
  registerClient
};
