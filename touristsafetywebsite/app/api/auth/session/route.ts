import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ user: null }, { status: 401 })
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (error) {
    console.error("Session lookup failed", error)
    return NextResponse.json({ error: "Database authentication is temporarily unavailable." }, { status: 503 })
  }
}