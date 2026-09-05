"use client"

import { FormEvent, useState } from "react"
import { Bot, Loader2, Send, ShieldCheck, User } from "lucide-react"
import { SAFETY_ASSISTANT_SUGGESTIONS } from "@/lib/assistant/safety-assistant"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Message { id: number; role: "assistant" | "user"; text: string }

export function SafetyAssistant() {
  const [messages, setMessages] = useState<Message[]>([{ id: 1, role: "assistant", text: "I can help you think through common travel-safety situations. What do you need right now?" }])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState("Demo Assistant")

  const ask = (question: string) => {
    const trimmed = question.trim()
    if (!trimmed || isLoading) return
    setInput("")
    setMessages((current) => [...current, { id: Date.now(), role: "user", text: trimmed }])
    setIsLoading(true)
    fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: trimmed }) })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error); setMode(data.mode ?? "Demo Assistant"); setMessages((current) => [...current, { id: Date.now() + 1, role: "assistant", text: data.message }]) })
      .catch(() => setMessages((current) => [...current, { id: Date.now() + 1, role: "assistant", text: "I could not reach the assistant service. For immediate danger, move to a safe public place and contact local emergency services." }]))
      .finally(() => setIsLoading(false))
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    ask(input)
  }

  return <Card className="mx-auto flex min-h-[620px] max-w-4xl flex-col overflow-hidden"><CardHeader className="border-b bg-primary/5"><div className="flex items-start justify-between gap-3"><div><Badge variant="secondary" className="mb-3">{mode}</Badge><CardTitle className="flex items-center gap-2 text-2xl"><ShieldCheck className="h-6 w-6 text-primary" /> SafeVoyage Safety Assistant</CardTitle><p className="mt-2 text-sm text-muted-foreground">Concise safety guidance for your demo journey. This assistant is not a substitute for local emergency support.</p></div><div className="flex items-center gap-2 text-xs text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" /> {mode}</div></div></CardHeader><CardContent className="flex flex-1 flex-col gap-5 p-4 sm:p-6"><div className="flex flex-wrap gap-2">{SAFETY_ASSISTANT_SUGGESTIONS.map((suggestion) => <Button key={suggestion} variant="outline" size="sm" className="h-auto whitespace-normal text-left" onClick={() => ask(suggestion)}>{suggestion}</Button>)}</div><div className="flex-1 space-y-4 overflow-y-auto rounded-lg bg-muted/30 p-3 sm:p-5">{messages.map((message) => <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}><div className={`flex max-w-[85%] gap-2 rounded-xl px-4 py-3 text-sm ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-background shadow-sm"}`}>{message.role === "assistant" ? <Bot className="mt-0.5 h-4 w-4 shrink-0" /> : <User className="mt-0.5 h-4 w-4 shrink-0" />}<p className="whitespace-pre-line">{message.text}</p></div></div>)}{isLoading && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Preparing guidance...</div>}</div><form onSubmit={submit} className="flex gap-2"><Input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask a safety question..." aria-label="Ask the safety assistant" /><Button type="submit" disabled={!input.trim() || isLoading}><Send className="mr-2 h-4 w-4" /> Send</Button></form><p className="text-center text-xs text-muted-foreground">Responses use server-side AI when configured, otherwise a contextual demo fallback.</p></CardContent></Card>
}
