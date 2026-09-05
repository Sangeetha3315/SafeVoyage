import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getIncident } from "@/lib/incidents"
import { getSessionUser, requireRole } from "@/lib/auth/server"
import { incidentStatusSchema } from "@/lib/validation/incident"

export const dynamic = "force-dynamic"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(["TOURIST", "AUTHORITY", "ADMIN"])
    const incident = await getIncident(params.id)
    if (!incident || (user.role === "TOURIST" && incident.touristId !== user.id)) return NextResponse.json({ error: "Incident not found." }, { status: 404 })
    return NextResponse.json({ incident })
  } catch {
    return NextResponse.json({ error: "Unable to load incident." }, { status: 503 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireRole(["AUTHORITY", "ADMIN"])
    const parsed = incidentStatusSchema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ error: "Invalid incident status." }, { status: 400 })
    const incident = await prisma.incident.update({ where: { id: params.id }, data: { status: parsed.data.status } })
    return NextResponse.json({ incident })
  } catch {
    return NextResponse.json({ error: "Unable to update incident." }, { status: 503 })
  }
}