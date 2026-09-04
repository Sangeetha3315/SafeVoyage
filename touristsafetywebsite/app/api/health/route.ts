import { apiSuccess } from "@/lib/api/response"

export const dynamic = "force-dynamic"

export function GET() {
  return apiSuccess({
    status: "ok",
    service: "safevoyage",
    timestamp: new Date().toISOString(),
  })
}
