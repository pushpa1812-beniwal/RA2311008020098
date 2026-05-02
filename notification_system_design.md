# Notification System Design

## Architecture Approach

The system is designed as a lightweight microservice using Node.js, Express, and TypeScript. The goal is to efficiently fetch, prioritize, and return notifications without persisting them to a local database. 

### Key Components

1. **Logging Middleware (`logging_middleware`)**:
   - A standalone, reusable module developed strictly according to constraints.
   - It intercepts logs, formats them with required fields (`stack`, `level`, `package`, `message`), and sends them to an external Log API using `axios`.
   - `console.log` is completely avoided in the backend to ensure all logs pass through this audited middleware.

2. **Authentication Service (`auth.service.ts`)**:
   - Handles obtaining initial client credentials (if not present) from the Registration API.
   - Generates an access token using the Auth API.
   - Implements basic token caching and checks token expiration to minimize redundant network requests.

3. **Notification Service (`notification.service.ts`)**:
   - Acts as a proxy to the protected Notification API.
   - Securely passes the access token in the `Authorization` header.
   - Fetches raw notifications as an array without saving to any local or external database.

4. **Prioritization Logic (`utils/priority.ts`)**:
   - Sorts incoming notifications based on two criteria:
     1. **Type Weight**: Placement (3) > Result (2) > Event (1).
     2. **Recency**: If two notifications have the same type, the one with the higher timestamp (more recent) is placed first.
   - Uses an efficient, in-memory `.sort()` function since data isn't stored locally.
   - Slices the sorted array to return only the Top N notifications (e.g., Top 10) back to the client.

## Design Decisions & Trade-offs

- **Statelessness**: Since the requirements prohibit storing data in a database, the service operates entirely statelessly. Every request fetches fresh data from the Notification API. While this ensures data is always up-to-date, it increases latency and dependency on the upstream API.
- **Error Handling & Resilience**: The logging middleware silently swallows network errors if the Log API is down, preventing a non-critical system (logging) from taking down the core notification service. 
- **Modular Structure**: The `logging_middleware` is separated into its own package (`package.json`) and linked locally. This mimics a real-world scenario where the middleware might be published to a private npm registry and shared across multiple microservices.

## Extensibility
- **Caching**: If the upstream Notification API cannot handle the load, an in-memory cache (like Redis or node-cache) could be implemented for short durations (e.g., 5-10 seconds) to reduce external API calls while technically remaining stateless.
- **Pagination**: The `/api/notifications/top` endpoint currently returns a limited array, but could be extended to support cursor-based pagination if needed.
