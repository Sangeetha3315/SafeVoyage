import { NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth/service"
import { createSession } from "@/lib/auth/server"
import { loginSchema } from "@/lib/validation/auth"

export async function POST(request: Request) {
  try {
    const parsed = loginSchema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 })
    const user = await authenticateUser(parsed.data.email, parsed.data.password)
    if (!user) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 })
    await createSession(user.id)
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (error) {
    console.error("Login failed", error)
    return NextResponse.json({ error: "Database authentication is not configured." }, { status: 503 })
  }
}