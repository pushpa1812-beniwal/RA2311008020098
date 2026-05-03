const notificationService = require('../services/notificationService');
const Log = require('../utils/logger');

const getNotifications = async (req, res) => {
  try {
    const data = await notificationService.getAllNotifications();
    await Log('backend', 'info', 'controller', 'Successfully fetched all notifications');
    res.json(data);
  } catch (error) {
    await Log('backend', 'error', 'controller', 'Error fetching notifications');
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createNotification = async (req, res) => {
  try {
    const { type, message } = req.body;
    if (!type || !message) {
      await Log('backend', 'warn', 'controller', 'Invalid request payload for creating notification');
      return res.status(400).json({ error: 'Type and message are required' });
    }
    const newNotif = await notificationService.addNotification({ type, message });
    await Log('backend', 'info', 'controller', 'Successfully created notification');
    res.status(201).json(newNotif);
  } catch (error) {
    await Log('backend', 'error', 'controller', 'Error creating notification');
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTopNotifications = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const data = await notificationService.getTopNotifications(limit);
    await Log('backend', 'info', 'controller', 'Successfully fetched top notifications');
    res.json(data);
  } catch (error) {
    await Log('backend', 'error', 'controller', 'Error fetching top notifications');
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getNotifications,
  createNotification,
  getTopNotifications
};
