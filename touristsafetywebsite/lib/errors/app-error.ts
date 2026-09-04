export type AppErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR"

export class AppError extends Error {
  readonly code: AppErrorCode
  readonly statusCode: number
  readonly expose: boolean

  constructor(code: AppErrorCode, message: string, statusCode = 500, expose = statusCode < 500) {
    super(message)
    this.name = "AppError"
    this.code = code
    this.statusCode = statusCode
    this.expose = expose
  }

  static validation(message = "The request could not be validated") {
    return new AppError("VALIDATION_ERROR", message, 400)
  }

  static unauthorized(message = "Authentication is required") {
    return new AppError("UNAUTHORIZED", message, 401)
  }

  static forbidden(message = "You do not have permission to perform this action") {
    return new AppError("FORBIDDEN", message, 403)
  }

  static notFound(message = "The requested resource was not found") {
    return new AppError("NOT_FOUND", message, 404)
  }

  static conflict(message = "The request conflicts with existing data") {
    return new AppError("CONFLICT", message, 409)
  }

  static rateLimited(message = "Too many requests") {
    return new AppError("RATE_LIMITED", message, 429)
  }
}
