"use client"

import { FormEvent, useEffect, useState } from "react"
import { CheckCircle2, FileWarning, Loader2 } from "lucide-react"
import { LocationService, type LocationData } from "@/lib/location"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

const categories = ["Suspicious activity", "Theft or lost item", "Unsafe location", "Medical concern", "Other"]

type Incident = { id: string; title: string; category: string; description: string; severity: string; location: string | null; status: string; createdAt: string }

export function IncidentWorkspace() {
  const [form, setForm] = useState({ category: categories[0], title: "", description: "", severity: "MEDIUM", location: "" })
  const [location, setLocation] = useState<LocationData | null>(null)
  const [reports, setReports] = useState<Incident[]>([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const loadReports = async () => {
    const response = await fetch("/api/incidents", { cache: "no-store" })
    if (response.ok) setReports((await response.json()).incidents)
  }
  useEffect(() => { void loadReports(); setLocation(LocationService.getLastKnownLocation()) }, [])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true); setError(""); setSuccess(null)
    const current = location ?? LocationService.getLastKnownLocation()
    try {
      const response = await fetch("/api/incidents", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, severity: form.severity, latitude: current?.latitude ?? null, longitude: current?.longitude ?? null, location: current?.address ?? (form.location || null) }) })
      const data = await response.json()
      if (!response.ok) { setError(data.error ?? "Unable to report incident."); return }
      setSuccess(`Incident reported successfully. Incident ID: ${data.incident.id}`)
      setForm({ category: categories[0], title: "", description: "", severity: "MEDIUM", location: "" })
      await loadReports()
    } catch { setError("Unable to reach SafeVoyage.") } finally { setLoading(false) }
  }

  return <div className="space-y-6"><Card className="mx-auto max-w-3xl"><CardHeader><Badge variant="secondary" className="mb-2 w-fit">POSTGRESQL INCIDENT REPORT</Badge><CardTitle className="flex items-center gap-2"><FileWarning className="h-5 w-5 text-primary" /> Report a safety concern</CardTitle><CardDescription>Your report is stored securely and reviewed by the authority workflow.</CardDescription></CardHeader><CardContent><form onSubmit={submit} className="space-y-5">{error && <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}{success && <p className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-800"><CheckCircle2 className="mr-1 inline h-4 w-4" />{success}</p>}<div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label>Category</Label><select className="flex h-10 w-full rounded-md border bg-background px-3 text-sm" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{categories.map((item) => <option key={item}>{item}</option>)}</select></div><div className="space-y-2"><Label>Severity</Label><select className="flex h-10 w-full rounded-md border bg-background px-3 text-sm" value={form.severity} onChange={(event) => setForm({ ...form, severity: event.target.value })}>{["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((item) => <option key={item}>{item}</option>)}</select></div></div><div className="space-y-2"><Label htmlFor="incident-title">Title</Label><Input id="incident-title" required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></div><div className="space-y-2"><Label htmlFor="incident-description">Description</Label><Textarea id="incident-description" required rows={5} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></div><div className="space-y-2"><Label htmlFor="incident-location">Location if GPS is unavailable</Label><Input id="incident-location" placeholder={location?.address ?? "Location unavailable"} value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} /></div><p className="text-xs text-muted-foreground">{location ? `Using actual browser location: ${location.address ?? `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`}` : "Location unavailable. You can still submit this report."}</p><Button type="submit" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Submit incident</Button></form></CardContent></Card><Card className="mx-auto max-w-3xl"><CardHeader><CardTitle>My Reports</CardTitle><CardDescription>Incident status from PostgreSQL</CardDescription></CardHeader><CardContent className="space-y-3">{reports.length === 0 ? <p className="text-sm text-muted-foreground">No reports yet.</p> : reports.map((report) => <div key={report.id} className="rounded-lg border p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-semibold">{report.title}</p><Badge variant="outline">{report.status}</Badge></div><p className="mt-1 text-sm text-muted-foreground">{report.id} · {report.category} · {report.severity}</p><p className="text-xs text-muted-foreground">{report.location ?? "Location unavailable"} · {new Date(report.createdAt).toLocaleString()}</p></div>)}</CardContent></Card></div>
}
