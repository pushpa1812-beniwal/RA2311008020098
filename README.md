# Campus Notification Microservice

This is a complete Campus Notification Microservice system consisting of a Node.js Express backend and a React frontend.

## Features
- In-memory notification storage.
- Priority sorting: Placement > Result > Event.
- Latest timestamp tie-breaker.
- Custom logging middleware using Axios.
- Simple React UI for displaying notifications.

## Run Instructions

### Backend

1. Navigate to the backend directory:
   ```bash
   cd notification_app_be
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to the frontend directory (in a new terminal):
   ```bash
   cd notification_app_fe
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the application:
   ```bash
   npm start
   ```

The backend runs on `http://localhost:3000` and the frontend runs on the port specified by Vite (usually `http://localhost:5173`).