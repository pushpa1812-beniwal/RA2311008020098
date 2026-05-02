import express from 'express';
import dotenv from 'dotenv';
import { getTopNotifications } from './controllers/notification.controller';
import { Log } from 'logging_middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/notifications/top', getTopNotifications);

app.listen(PORT, async () => {
    await Log('backend', 'info', 'server', `Server is running on port ${PORT}`);
});
