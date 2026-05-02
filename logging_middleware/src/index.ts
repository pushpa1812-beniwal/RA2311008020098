import axios from 'axios';

type Stack = 'backend' | 'frontend';
type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

/**
 * Reusable Logging Middleware
 * Replaces console.log and sends logs to the provided Log API.
 * 
 * @param stack - 'backend' or 'frontend'
 * @param level - 'debug', 'info', 'warn', 'error', 'fatal'
 * @param pkg - The package or module name where the log originates
 * @param message - The log message
 */
export async function Log(
  stack: Stack,
  level: LogLevel,
  pkg: string,
  message: string
): Promise<void> {
  const allowedStacks: Stack[] = ['backend', 'frontend'];
  const allowedLevels: LogLevel[] = ['debug', 'info', 'warn', 'error', 'fatal'];

  if (!allowedStacks.includes(stack)) {
    throw new Error(`Invalid stack value. Allowed values: ${allowedStacks.join(', ')}`);
  }

  if (!allowedLevels.includes(level)) {
    throw new Error(`Invalid level value. Allowed values: ${allowedLevels.join(', ')}`);
  }

  if (!pkg || typeof pkg !== 'string') {
    throw new Error('Package name is required and must be a string.');
  }

  if (!message || typeof message !== 'string') {
    throw new Error('Message is required and must be a string.');
  }

  const logPayload = {
    stack,
    level,
    package: pkg,
    message,
    timestamp: new Date().toISOString()
  };

  const logApiUrl = process.env.LOG_API_URL;

  if (!logApiUrl) {
    // Fallback if URL is not provided in environment, usually you shouldn't use console.log
    // but without URL we can't send it anywhere.
    // However, the problem explicitly states: "no console.log allowed"
    // So we silently ignore or throw, but here we can just write to stderr for catastrophic failures
    // Let's just return to strictly avoid console.log.
    return;
  }

  try {
    await axios.post(logApiUrl, logPayload);
  } catch (err) {
    // Silently handle log sending failure to avoid breaking the main application
    // and to strictly comply with "no console.log allowed"
  }
}
