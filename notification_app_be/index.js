require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { Log } = require('logging_middleware'); // This will now properly resolve to ../logging_middleware/index.js

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Global vars for auth
let clientID = null;
let clientSecret = null;
let accessToken = null;
let tokenExpiry = null;

// Auth Helper
async function getAccessToken() {
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    // Register if no client credentials
    if (!clientID || !clientSecret) {
      const regUrl = process.env.REGISTRATION_API_URL;
      if (regUrl) {
        const regPayload = {
          companyName: "CampusApp",
          clientID: "1234",
          ownerName: "Student",
          ownerEmail: "student@example.com",
          rollNo: "RA2311008020098"
        };
        const regResponse = await axios.post(regUrl, regPayload);
        clientID = regResponse.data.clientID;
        clientSecret = regResponse.data.clientSecret;
        await Log("backend", "info", "auth_service", "Successfully registered client");
      }
    }

    // Authenticate
    const authUrl = process.env.AUTH_API_URL;
    if (authUrl && clientID && clientSecret) {
      const authPayload = {
        companyName: "CampusApp",
        clientID,
        clientSecret,
        ownerEmail: "student@example.com",
        rollNo: "RA2311008020098"
      };
      const authResponse = await axios.post(authUrl, authPayload);
      accessToken = authResponse.data.access_token;
      const expiresIn = authResponse.data.expires_in || 3600;
      tokenExpiry = Date.now() + (expiresIn * 1000) - 60000;
      await Log("backend", "info", "auth_service", "Successfully obtained access token");
    }
  } catch (error) {
    await Log("backend", "error", "auth_service", `Auth failed: ${error.message}`);
  }

  return accessToken;
}

// Priority Logic
const weights = {
  Placement: 3,
  Result: 2,
  Event: 1
};

// GET /api/notifications/top Endpoint
app.get('/api/notifications/top', async (req, res) => {
  try {
    await Log("backend", "info", "notification_controller", "Fetching notifications");

    // Input Validation
    let limit = parseInt(req.query.limit, 10);
    if (!limit || isNaN(limit)) limit = 10;
    limit = Math.min(limit, 50);

    const token = await getAccessToken();
    const notificationUrl = process.env.NOTIFICATION_API_URL;

    if (!notificationUrl) {
      return res.status(500).json({ error: "NOTIFICATION_API_URL not configured" });
    }

    // Fetch Notifications
    const response = await axios.get(notificationUrl, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    let notifications = Array.isArray(response.data) ? response.data : [];

    // Apply Priority Sort
    notifications.sort((a, b) => {
      const weightA = weights[a.type] || 0;
      const weightB = weights[b.type] || 0;
      if (weightA !== weightB) {
        return weightB - weightA;
      }
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    const topNotifications = notifications.slice(0, limit);

    res.status(200).json({
      success: true,
      count: topNotifications.length,
      data: topNotifications
    });

  } catch (error) {
    await Log("backend", "error", "notification_controller", `API failure: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start Server
app.listen(PORT, async () => {
  await Log("backend", "info", "server", `Server is running on port ${PORT}`);
});
