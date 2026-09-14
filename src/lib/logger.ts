import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Sensitive fields to automatically redact across all log outputs.
 */
const REDACTED_PATHS = [
  "password",
  "*.password",
  "confirmPassword",
  "*.confirmPassword",
  "currentPassword",
  "*.currentPassword",
  "newPassword",
  "*.newPassword",
  "token",
  "*.token",
  "accessToken",
  "*.accessToken",
  "refreshToken",
  "*.refreshToken",
  "sessionToken",
  "*.sessionToken",
  "secret",
  "*.secret",
  "authorization",
  "*.authorization",
  "headers.authorization",
  "cookie",
  "*.cookie",
  "headers.cookie",
  "headers['set-cookie']",
  "better-auth.session_token",
  "*.better-auth.session_token",
  "raadhe.session_token",
  "*.raadhe.session_token",
  "BETTER_AUTH_SECRET",
  "DATABASE_URL",
  "creditCard",
  "*.creditCard",
  "cardNumber",
  "*.cardNumber",
  "cvv",
  "*.cvv",
  "otp",
  "*.otp",
  "pin",
  "*.pin",
];

/**
 * Configure transport:
 * - Production: writes directly to stdout as structured JSON (fast, no worker threads, HDD friendly).
 * - Development: formatted readable logs with pino-pretty.
 */
function createLogger(): pino.Logger {
  if (!isProduction) {
    try {
      return pino({
        level: "debug",
        redact: {
          paths: REDACTED_PATHS,
          censor: "[REDACTED]",
        },
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            ignore: "pid,hostname",
            translateTime: "HH:MM:ss.l",
          },
        },
      });
    } catch {
      // Fallback if pino-pretty transport cannot be initialized
      return pino({
        level: "debug",
        redact: {
          paths: REDACTED_PATHS,
          censor: "[REDACTED]",
        },
      });
    }
  }

  // Production configuration: JSON to stdout, structured error serializer, strict redaction
  return pino({
    level: "info",
    serializers: {
      err: pino.stdSerializers.err,
      error: pino.stdSerializers.err,
    },
    redact: {
      paths: REDACTED_PATHS,
      censor: "[REDACTED]",
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level(label) {
        return { level: label };
      },
    },
  });
}

/**
 * Centralized, shared application logger.
 */
export const logger = createLogger();

/**
 * Create a child logger with request context.
 */
export function createRequestLogger(requestId: string, extraContext: Record<string, unknown> = {}) {
  return logger.child({
    requestId,
    ...extraContext,
  });
}

export default logger;

