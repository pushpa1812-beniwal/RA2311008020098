// In-memory storage
let notifications = [
  { id: 1, type: 'Event', message: 'Annual sports day next week.', timestamp: new Date(Date.now() - 100000).toISOString() },
  { id: 2, type: 'Placement', message: 'TCS visiting campus.', timestamp: new Date(Date.now() - 50000).toISOString() },
  { id: 3, type: 'Result', message: 'Semester 4 results out.', timestamp: new Date(Date.now() - 20000).toISOString() },
  { id: 4, type: 'Placement', message: 'Google internship drive.', timestamp: new Date(Date.now() - 10000).toISOString() },
  { id: 5, type: 'Event', message: 'Tech symposium tomorrow.', timestamp: new Date(Date.now() - 5000).toISOString() }
];

let nextId = 6;

const priorityMap = {
  'Placement': 3,
  'Result': 2,
  'Event': 1
};

const getAllNotifications = () => {
  return notifications;
};

const addNotification = (data) => {
  const newNotif = {
    id: nextId++,
    type: data.type,
    message: data.message,
    timestamp: new Date().toISOString()
  };
  notifications.push(newNotif);
  return newNotif;
};

const getTopNotifications = (limit) => {
  const sorted = [...notifications].sort((a, b) => {
    const pA = priorityMap[a.type] || 0;
    const pB = priorityMap[b.type] || 0;
    if (pA !== pB) {
      return pB - pA; // Descending priority
    }
    // Tie-breaker: latest timestamp
    return new Date(b.timestamp) - new Date(a.timestamp);
  });
  
  return sorted.slice(0, limit);
};

module.exports = {
  getAllNotifications,
  addNotification,
  getTopNotifications
};
