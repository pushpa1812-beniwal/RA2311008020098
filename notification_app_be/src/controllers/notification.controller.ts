import { Request, Response } from 'express';
import { fetchNotifications } from '../services/notification.service';
import { prioritizeNotifications } from '../utils/priority';
import { Log } from 'logging_middleware';

export const getTopNotifications = async (req: Request, res: Response) => {
    try {
        await Log('backend', 'info', 'notification.controller', 'Received request for top notifications');

        const limitStr = req.query.limit as string;
        const limit = limitStr ? parseInt(limitStr, 10) : 10;
        
        const notifications = await fetchNotifications();
        const prioritized = prioritizeNotifications(notifications, limit);

        res.status(200).json({
            success: true,
            count: prioritized.length,
            data: prioritized
        });
    } catch (error: any) {
        await Log('backend', 'error', 'notification.controller', `Error serving top notifications: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching notifications'
        });
    }
};
