const repository = require('../repository/notificationRepository');
const Log = require('../utils/logger');

const priorityMap = {
  'Placement': 3,
  'Result': 2,
  'Event': 1
};

const getAllNotifications = async () => {
  await Log('backend', 'debug', 'service', 'Service layer fetching all notifications');
  return repository.findAll();
};

const addNotification = async (data) => {
  await Log('backend', 'info', 'service', 'Service layer creating notification');
  return repository.save(data);
};

const getTopNotifications = async (limit) => {
  await Log('backend', 'debug', 'service', `Service layer fetching top ${limit} notifications`);
  const allNotifs = await repository.findAll();
  
  const sorted = [...allNotifs].sort((a, b) => {
    const pA = priorityMap[a.type] || 0;
    const pB = priorityMap[b.type] || 0;
    if (pA !== pB) {
      return pB - pA;
    }
    return new Date(b.timestamp) - new Date(a.timestamp);
  });
  
  return sorted.slice(0, limit);
};

module.exports = {
  getAllNotifications,
  addNotification,
  getTopNotifications
};
