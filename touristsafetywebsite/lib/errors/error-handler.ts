import { NextResponse } from "next/server"
import { AppError } from "./app-error"
import { logger } from "@/lib/logging/logger"

export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    if (!error.expose) logger.error("Application error", { code: error.code })
    return NextResponse.json(
      { error: { code: error.code, message: error.expose ? error.message : "An internal error occurred" } },
      { status: error.statusCode },
    )
  }

  logger.error("Unhandled API error")
  return NextResponse.json(
    { error: { code: "INTERNAL_ERROR", message: "An internal error occurred" } },
    { status: 500 },
  )
}
