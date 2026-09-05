import { NextResponse } from "next/server"
import { registerTourist } from "@/lib/auth/service"
import { createSession } from "@/lib/auth/server"
import { registerSchema } from "@/lib/validation/auth"

export async function POST(request: Request) {
  try {
    const parsed = registerSchema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ error: "Please correct the highlighted fields.", fields: parsed.error.flatten().fieldErrors }, { status: 400 })
    const user = await registerTourist(parsed.data)
    if (!user) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 })
    await createSession(user.id)
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } }, { status: 201 })
  } catch (error) {
    console.error("Registration failed", error)
    return NextResponse.json({ error: "Registration is temporarily unavailable." }, { status: 503 })
  }
}