import "server-only"
import bcrypt from "bcryptjs"
import crypto from "node:crypto"
import { prisma } from "@/lib/db/prisma"
import type { RegisterInput } from "@/lib/validation/auth"

export async function registerTourist(input: RegisterInput) {
  const email = input.email.toLowerCase()
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return null

  const passwordHash = await bcrypt.hash(input.password, 12)
  return prisma.$transaction(async (transaction) => {
    const user = await transaction.user.create({
      data: {
        name: input.name,
        email,
        passwordHash,
        phone: input.phone,
        role: "TOURIST",
        touristProfile: {
          create: {
            digitalTouristId: `SV-${crypto.randomBytes(6).toString("hex").toUpperCase()}`,
            nationality: input.nationality,
            emergencyContacts: { create: { name: input.emergencyContactName, phone: input.emergencyContactPhone, relationship: input.relationship } },
          },
        },
      },
      select: { id: true, name: true, email: true, role: true },
    })
    await transaction.auditLog.create({ data: { userId: user.id, action: "REGISTER", resource: "User", resourceId: user.id } })
    return user
  })
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return null
  await prisma.auditLog.create({ data: { userId: user.id, action: "LOGIN", resource: "Session", metadata: { method: "password" } } })
  return user
}