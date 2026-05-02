import axios from 'axios';
import { getAccessToken } from './auth.service';
import { Log } from 'logging_middleware';
import { Notification } from '../utils/priority';

export const fetchNotifications = async (): Promise<Notification[]> => {
    try {
        const token = await getAccessToken();
        if (!token) {
            throw new Error('No access token available');
        }

        const notificationUrl = process.env.NOTIFICATION_API_URL;
        if (!notificationUrl) {
            throw new Error('NOTIFICATION_API_URL is missing in env');
        }

        const response = await axios.get(notificationUrl, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        await Log('backend', 'info', 'notification.service', `Successfully fetched ${response.data?.length || 0} notifications`);
        
        // Ensure data is an array
        return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
        await Log('backend', 'error', 'notification.service', `Failed to fetch notifications: ${error.message}`);
        throw error;
    }
};
