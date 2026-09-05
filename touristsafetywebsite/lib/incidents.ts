import "server-only"
import { prisma } from "@/lib/db/prisma"
import type { Role } from "@prisma/client"

export async function listIncidents(userId: string, role: Role) {
  return prisma.incident.findMany({
    where: role === "TOURIST" ? { touristId: userId } : undefined,
    include: { tourist: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  })
}

export async function getIncident(id: string) {
  return prisma.incident.findUnique({ include: { tourist: { select: { id: true, name: true, email: true } } }, where: { id } })
}