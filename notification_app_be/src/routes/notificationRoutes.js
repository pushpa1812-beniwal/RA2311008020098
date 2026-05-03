const express = require('express');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

router.get('/', notificationController.getNotifications);
router.post('/', notificationController.createNotification);
router.get('/top', notificationController.getTopNotifications);

module.exports = router;
