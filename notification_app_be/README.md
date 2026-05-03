# Campus Notifications Microservice Backend

This project contains a production-ready, strict-compliant backend for the Campus Notifications Microservice.

## Features
- **Clean Architecture**: Divided into `controllers`, `services`, `repository`, and `utils`.
- **Remote Authentication**: Automatically registers and fetches an `access_token` from a remote test server.
- **Strict Logging**: A compliant, reusable logger that validates strict enums for `stack`, `level`, and `package`, and hits an external `/evaluation-service/logs` endpoint with the authorization token.
- **Zero Console Logs**: Strict compliance by enforcing zero usage of built-in console logging.

## Setup Instructions

1. Navigate to the backend directory:
   ```bash
   cd notification_app_be
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the example environment variables and adjust the test server URL:
   ```bash
   cp .env.example .env
   ```
4. Start the server:
   ```bash
   npm start
   ```
   *Note: For development, `npm run dev` is available if nodemon is installed.*

## API Examples (Postman-Ready)

You can import these into Postman by converting them to cURL commands.

### 1. Get All Notifications
```bash
curl -X GET http://localhost:3000/notifications
```

### 2. Create a Notification
```bash
curl -X POST http://localhost:3000/notifications \
-H "Content-Type: application/json" \
-d '{"type": "Event", "message": "Hackathon registration opens tomorrow."}'
```

### 3. Get Top Notifications (Priority Sorted)
```bash
curl -X GET "http://localhost:3000/notifications/top?limit=10"
```
