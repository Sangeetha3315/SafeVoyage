import { NextResponse } from "next/server"
import { z } from "zod"
import { getDemoSafetyResponse } from "@/lib/assistant/safety-assistant"
import { getServerEnv } from "@/lib/config/env"
import { getSessionUser } from "@/lib/auth/server"

const requestSchema = z.object({ message: z.string().trim().min(1).max(1000), context: z.object({ location: z.string().optional(), safetyStatus: z.string().optional(), activeSos: z.boolean().optional() }).optional() })

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: "A question is required." }, { status: 400 })
  const user = await getSessionUser().catch(() => null)
  try {
    const env = getServerEnv()
    if (env.AI_API_KEY) {
      const baseUrl = process.env.AI_BASE_URL ?? "https://api.openai.com/v1"
      const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.AI_API_KEY}` }, body: JSON.stringify({ model: process.env.AI_MODEL ?? "gpt-4o-mini", temperature: 0.3, messages: [{ role: "system", content: "You are SafeVoyage Safety Assistant. Give concise, cautious travel safety guidance. Never claim to contact authorities, never fabricate locations or services, and recommend local emergency services for immediate danger." }, { role: "user", content: JSON.stringify({ question: parsed.data.message, context: parsed.data.context, touristRole: user?.role }) }] }), signal: AbortSignal.timeout(8000) })
      if (response.ok) { const data = await response.json(); const message = data.choices?.[0]?.message?.content; if (typeof message === "string" && message.trim()) return NextResponse.json({ message, mode: "AI Assistant" }) }
    }
  } catch (error) { console.warn("AI assistant provider unavailable; using demo fallback", error) }
  return NextResponse.json({ message: getDemoSafetyResponse(parsed.data.message, parsed.data.context), mode: "Demo Assistant" })
}