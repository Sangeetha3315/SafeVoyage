import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { requireRole } from "@/lib/auth/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    await requireRole(["ADMIN"])
    const [totalIncidents, openIncidents, resolvedIncidents, tourists] = await Promise.all([
      prisma.incident.count(),
      prisma.incident.count({ where: { status: { not: "RESOLVED" } } }),
      prisma.incident.count({ where: { status: "RESOLVED" } }),
      prisma.user.count({ where: { role: "TOURIST" } }),
    ])
    return NextResponse.json({ stats: { totalIncidents, openIncidents, resolvedIncidents, tourists, activeSos: 0 } })
  } catch {
    return NextResponse.json({ error: "Unable to load admin overview." }, { status: 503 })
  }
}
