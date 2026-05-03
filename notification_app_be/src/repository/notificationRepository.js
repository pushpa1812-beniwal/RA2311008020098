const Log = require('../utils/logger');

// In-memory DB
let notifications = [
  { id: 1, type: 'Event', message: 'Annual sports day next week.', timestamp: new Date(Date.now() - 100000).toISOString() },
  { id: 2, type: 'Placement', message: 'Tech Corp visiting campus.', timestamp: new Date(Date.now() - 50000).toISOString() },
  { id: 3, type: 'Result', message: 'Semester 4 results out.', timestamp: new Date(Date.now() - 20000).toISOString() },
];
let nextId = 4;

const findAll = async () => {
  await Log('backend', 'debug', 'repository', 'Fetching all notifications from DB');
  return notifications;
};

const save = async (data) => {
  const newNotif = {
    id: nextId++,
    type: data.type,
    message: data.message,
    timestamp: new Date().toISOString()
  };
  notifications.push(newNotif);
  await Log('backend', 'info', 'repository', `Saved new notification ${newNotif.id}`);
  return newNotif;
};

module.exports = {
  findAll,
  save
};
