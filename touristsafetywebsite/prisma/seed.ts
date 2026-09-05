import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const accounts = [
    { email: "tourist@demo.safevoyage.app", password: "demo-tourist-2026", name: "Demo Tourist", role: Role.TOURIST, phone: "+1 555 010 2026" },
    { email: process.env.DEMO_AUTHORITY_EMAIL ?? "authority@demo.safevoyage.app", password: process.env.DEMO_AUTHORITY_PASSWORD ?? "demo-authority-2026", name: "Demo Authority", role: Role.AUTHORITY, phone: "" },
    { email: process.env.DEMO_ADMIN_EMAIL ?? "admin@demo.safevoyage.app", password: process.env.DEMO_ADMIN_PASSWORD ?? "demo-admin-2026", name: "Demo Administrator", role: Role.ADMIN, phone: "" },
  ]

  for (const account of accounts) {
    const user = await prisma.user.upsert({
      where: { email: account.email.toLowerCase() },
      update: { name: account.name, role: account.role, passwordHash: await bcrypt.hash(account.password, 12), phone: account.phone },
      create: { name: account.name, email: account.email.toLowerCase(), role: account.role, phone: account.phone, passwordHash: await bcrypt.hash(account.password, 12) },
    })

    if (account.role === Role.TOURIST) {
      const profile = await prisma.touristProfile.upsert({
        where: { userId: user.id },
        update: { nationality: "Demo", digitalTouristId: "SV-TOUR-2026-001" },
        create: { userId: user.id, nationality: "Demo", digitalTouristId: "SV-TOUR-2026-001" },
      })
      await prisma.emergencyContact.upsert({
        where: { id: "demo-tourist-emergency-contact" },
        update: { touristId: profile.id, name: "Demo Emergency Contact", phone: "+1 555 010 2027", relationship: "Friend" },
        create: { id: "demo-tourist-emergency-contact", touristId: profile.id, name: "Demo Emergency Contact", phone: "+1 555 010 2027", relationship: "Friend" },
      })
    }
  }
}

main().finally(() => prisma.$disconnect())