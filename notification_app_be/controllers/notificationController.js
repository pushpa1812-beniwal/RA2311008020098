const notificationService = require('../services/notificationService');
const Log = require('../logging_middleware');

const getNotifications = async (req, res) => {
  try {
    const data = notificationService.getAllNotifications();
    await Log('notificationController.getNotifications', 'INFO', 'notification_app_be', 'Fetched all notifications');
    res.json(data);
  } catch (error) {
    await Log('notificationController.getNotifications', 'ERROR', 'notification_app_be', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createNotification = async (req, res) => {
  try {
    const { type, message } = req.body;
    if (!type || !message) {
      await Log('notificationController.createNotification', 'WARN', 'notification_app_be', 'Missing type or message');
      return res.status(400).json({ error: 'Type and message are required' });
    }
    const newNotif = notificationService.addNotification({ type, message });
    await Log('notificationController.createNotification', 'INFO', 'notification_app_be', `Created notification ${newNotif.id}`);
    res.status(201).json(newNotif);
  } catch (error) {
    await Log('notificationController.createNotification', 'ERROR', 'notification_app_be', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTopNotifications = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const data = notificationService.getTopNotifications(limit);
    await Log('notificationController.getTopNotifications', 'INFO', 'notification_app_be', `Fetched top ${limit} notifications`);
    res.json(data);
  } catch (error) {
    await Log('notificationController.getTopNotifications', 'ERROR', 'notification_app_be', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getNotifications,
  createNotification,
  getTopNotifications
};
