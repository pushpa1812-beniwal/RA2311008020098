import React, { useEffect, useState } from 'react';
import { getTopNotifications } from '../api';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await getTopNotifications(10);
      setNotifications(data);
      setLoading(false);
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return <p>Loading notifications...</p>;
  }

  if (notifications.length === 0) {
    return <p>No notifications found.</p>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Campus Notifications</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {notifications.map((notif) => (
          <li key={notif.id} style={{
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '10px',
            marginBottom: '10px',
            backgroundColor: notif.type === 'Placement' ? '#e6f7ff' : notif.type === 'Result' ? '#f6ffed' : '#fffbe6'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <strong>{notif.type}</strong>
              <small>{new Date(notif.timestamp).toLocaleString()}</small>
            </div>
            <p style={{ margin: 0 }}>{notif.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;
