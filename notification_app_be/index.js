const express = require('express');
const cors = require('cors');
const notificationController = require('./controllers/notificationController');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.get('/notifications', notificationController.getNotifications);
app.post('/notifications', notificationController.createNotification);
app.get('/notifications/top', notificationController.getTopNotifications);

// Internal log sink to prevent the axios post from hitting a dead endpoint
app.post('/internal/logs', (req, res) => {
  // Silent log sink
  res.status(200).send('OK');
});

app.listen(PORT, () => {
  // The ONLY allowed console.log as per requirements
  console.log(`Server is running on port ${PORT}`);
});
