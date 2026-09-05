import { NextResponse } from "next/server"
import { getSessionUser, requireRole } from "@/lib/auth/server"
import { prisma } from "@/lib/db/prisma"
import { listIncidents } from "@/lib/incidents"
import { incidentCreateSchema } from "@/lib/validation/incident"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const user = await requireRole(["TOURIST", "AUTHORITY", "ADMIN"])
    return NextResponse.json({ incidents: await listIncidents(user.id, user.role) })
  } catch (error) {
    console.error("Incident list failed", error)
    return NextResponse.json({ error: "Unable to load incidents." }, { status: 503 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireRole(["TOURIST"])
    const parsed = incidentCreateSchema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ error: "Please correct the incident fields.", fields: parsed.error.flatten().fieldErrors }, { status: 400 })
    const incident = await prisma.incident.create({ data: { ...parsed.data, touristId: user.id } })
    return NextResponse.json({ incident }, { status: 201 })
  } catch (error) {
    console.error("Incident creation failed", error)
    return NextResponse.json({ error: "Unable to save incident." }, { status: 503 })
  }
}