"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Incident = { id: string; title: string; category: string; severity: string; location: string | null; status: string; createdAt: string; tourist: { name: string } }

export function AuthorityIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [filter, setFilter] = useState("ALL")
  const load = async () => { const response = await fetch("/api/incidents", { cache: "no-store" }); if (response.ok) setIncidents((await response.json()).incidents) }
  useEffect(() => { void load() }, [])
  const update = async (id: string, status: string) => { await fetch(`/api/incidents/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }); await load() }
  const visible = filter === "ALL" ? incidents : incidents.filter((incident) => filter === "REPORTED" ? incident.status === "REPORTED" : filter === "RESOLVED" ? incident.status === "RESOLVED" : incident.status === "ACKNOWLEDGED" || incident.status === "IN_PROGRESS")
  return <Card><CardHeader><CardTitle>Incidents</CardTitle><CardDescription>PostgreSQL reports requiring authority review</CardDescription><div className="flex flex-wrap gap-2">{["ALL", "REPORTED", "IN_PROGRESS", "RESOLVED"].map((item) => <Button key={item} size="sm" variant={filter === item ? "default" : "outline"} onClick={() => setFilter(item)}>{item.replace("_", " ")}</Button>)}</div></CardHeader><CardContent className="space-y-3">{visible.length === 0 ? <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">No incidents found.</p> : visible.map((incident) => <div key={incident.id} className="rounded-lg border p-4"><div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{incident.id}</p><Badge variant="outline">{incident.severity}</Badge><Badge variant="secondary">{incident.status}</Badge></div><p className="mt-1">{incident.title} · {incident.category}</p><p className="text-sm text-muted-foreground">Reported by {incident.tourist.name} · {incident.location ?? "Location unavailable"}</p><p className="text-xs text-muted-foreground">{new Date(incident.createdAt).toLocaleString()}</p></div><div className="flex flex-wrap gap-2">{incident.status === "REPORTED" && <Button size="sm" onClick={() => update(incident.id, "ACKNOWLEDGED")}>Acknowledge</Button>}{incident.status === "ACKNOWLEDGED" && <Button size="sm" onClick={() => update(incident.id, "IN_PROGRESS")}>Mark In Progress</Button>}{incident.status !== "RESOLVED" && <Button size="sm" variant="outline" onClick={() => update(incident.id, "RESOLVED")}>Resolve</Button>}</div></div></div>)}</CardContent></Card>
}