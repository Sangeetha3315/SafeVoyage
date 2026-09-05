"use client"

import { FormEvent, useEffect, useState } from "react"
import { CheckCircle2, FileWarning } from "lucide-react"
import { DemoResponseService, type DemoSeverity } from "@/lib/demo-response"
import { AuthService, type User } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

const categories = ["Suspicious activity", "Theft or lost item", "Unsafe location", "Medical concern", "Other"]

export function DemoIncidentForm() {
  const [user, setUser] = useState<User | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ category: categories[0], title: "", description: "", location: "Central Park, New York", severity: "MEDIUM" as DemoSeverity, timestamp: "" })

  useEffect(() => setUser(AuthService.getCurrentUser()), [])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!user || !form.title.trim() || !form.description.trim() || !form.location.trim()) return
    DemoResponseService.createIncident({ ...form, touristId: user.id, touristName: user.name })
    setSubmitted(true)
    setForm((current) => ({ ...current, title: "", description: "" }))
  }

  return <Card className="mx-auto max-w-3xl"><CardHeader><div className="flex items-center justify-between gap-3"><div><Badge variant="secondary" className="mb-2">DEMO INCIDENT REPORT</Badge><CardTitle className="flex items-center gap-2"><FileWarning className="h-5 w-5 text-primary" /> Report a safety concern</CardTitle><CardDescription className="mt-2">This creates a demo incident for the SafeVoyage authority review queue.</CardDescription></div>{submitted && <CheckCircle2 className="h-7 w-7 text-emerald-600" />}</div></CardHeader><CardContent><form onSubmit={submit} className="space-y-5"><div className="grid gap-5 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="incident-category">Category</Label><select id="incident-category" className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{categories.map((category) => <option key={category}>{category}</option>)}</select></div><div className="space-y-2"><Label htmlFor="incident-severity">Severity</Label><select id="incident-severity" className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" value={form.severity} onChange={(event) => setForm({ ...form, severity: event.target.value as DemoSeverity })}>{["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((severity) => <option key={severity}>{severity}</option>)}</select></div></div><div className="space-y-2"><Label htmlFor="incident-title">Title</Label><Input id="incident-title" required placeholder="Briefly describe what happened" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></div><div className="space-y-2"><Label htmlFor="incident-description">Description</Label><Textarea id="incident-description" required rows={5} placeholder="Add useful context for the authority demo team" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></div><div className="grid gap-5 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="incident-location">Location</Label><Input id="incident-location" required value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} /></div><div className="space-y-2"><Label htmlFor="incident-timestamp">Time (optional)</Label><Input id="incident-timestamp" type="datetime-local" value={form.timestamp} onChange={(event) => setForm({ ...form, timestamp: event.target.value })} /></div></div>{submitted && <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">Demo incident submitted. Authority review status: REPORTED.</p>}<Button type="submit" className="w-full sm:w-auto">Submit demo incident</Button></form></CardContent></Card>
}
