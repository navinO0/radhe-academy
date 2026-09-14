/**
 * Standardized API error and response utilities
 */
import { logger } from "@/lib/logger";

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public readonly errors?: Record<string, string[]>
  ) {
    super(message, 422, "VALIDATION_ERROR");
  }
}

export class AuthError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, "CONFLICT");
  }
}

export class RateLimitError extends AppError {
  constructor(
    message = "Too many requests",
    public readonly retryAfter?: number
  ) {
    super(message, 429, "RATE_LIMITED");
  }
}

// ---- API Response shapes ----

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  };
  requestId?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    errors?: Record<string, string[]>;
  };
  requestId?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export function successResponse<T>(
  data: T,
  meta?: ApiSuccess<T>["meta"],
  requestId?: string
): ApiSuccess<T> {
  return {
    success: true,
    data,
    meta,
    ...(requestId ? { requestId } : {}),
  };
}

export function errorResponse(
  code: string,
  message: string,
  errors?: Record<string, string[]>,
  requestId?: string
): ApiError {
  return {
    success: false,
    error: { code, message, errors },
    ...(requestId ? { requestId } : {}),
  };
}

/**
 * Safe error handler — never leaks stack traces or SQL errors to clients in production
 */
export function handleApiError(
  err: unknown,
  requestId?: string
): {
  status: number;
  body: ApiError;
} {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error(
        { err, code: err.code, statusCode: err.statusCode, requestId },
        "[AppError] Internal service error"
      );
    } else {
      logger.warn(
        { code: err.code, statusCode: err.statusCode, message: err.message, requestId },
        "[AppError] Handled operational error"
      );
    }

    return {
      status: err.statusCode,
      body: errorResponse(
        err.code ?? "ERROR",
        err.message,
        err instanceof ValidationError ? err.errors : undefined,
        requestId
      ),
    };
  }

  // Log full structured error server-side with stack trace, return generic message to client
  logger.error({ err, requestId }, "[API Error] Unexpected exception");
  return {
    status: 500,
    body: errorResponse("INTERNAL_ERROR", "An unexpected error occurred", undefined, requestId),
  };
}

// ---- Server Action result types ----

export type ActionResult<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; errors?: Record<string, string[]> };

export function actionSuccess<T>(data: T, message?: string): ActionResult<T> {
  return { success: true, data, message };
}

export function actionError<T>(
  error: string,
  errors?: Record<string, string[]>
): ActionResult<T> {
  return { success: false, error, errors };
}
