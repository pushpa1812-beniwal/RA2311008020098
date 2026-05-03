import axios from 'axios';

const API_URL = 'http://localhost:3000/notifications';

export const getTopNotifications = async (limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/top?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};
