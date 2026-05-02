import axios from 'axios';
import { Log } from 'logging_middleware';

let clientID: string | null = null;
let clientSecret: string | null = null;
let accessToken: string | null = null;
let tokenExpiry: number = 0;

export const registerClient = async () => {
    try {
        const registrationUrl = process.env.REGISTRATION_API_URL;
        if (!registrationUrl) {
            await Log('backend', 'error', 'auth.service', 'REGISTRATION_API_URL is missing in env');
            return;
        }

        const payload = {
            companyName: "CampusApp",
            clientID: "1234", 
            ownerName: "Student",
            ownerEmail: "student@example.com",
            rollNo: "RA2311008020098"
        };

        const response = await axios.post(registrationUrl, payload);
        
        clientID = response.data.clientID;
        clientSecret = response.data.clientSecret;
        
        await Log('backend', 'info', 'auth.service', 'Client registered successfully');
    } catch (error: any) {
        await Log('backend', 'error', 'auth.service', `Registration failed: ${error.message}`);
    }
};

export const getAccessToken = async (): Promise<string | null> => {
    if (accessToken && Date.now() < tokenExpiry) {
        return accessToken;
    }

    if (!clientID || !clientSecret) {
        await registerClient();
    }

    try {
        const authUrl = process.env.AUTH_API_URL;
        if (!authUrl) {
            await Log('backend', 'error', 'auth.service', 'AUTH_API_URL is missing in env');
            return null;
        }

        const response = await axios.post(authUrl, {
            companyName: "CampusApp",
            clientID,
            clientSecret,
            ownerEmail: "student@example.com",
            rollNo: "RA2311008020098"
        });

        accessToken = response.data.access_token;
        const expiresIn = response.data.expires_in || 3600;
        tokenExpiry = Date.now() + (expiresIn * 1000) - 60000; // 1 minute buffer
        
        await Log('backend', 'info', 'auth.service', 'Access token obtained successfully');
        return accessToken;
    } catch (error: any) {
        await Log('backend', 'error', 'auth.service', `Auth failed: ${error.message}`);
        return null;
    }
};
