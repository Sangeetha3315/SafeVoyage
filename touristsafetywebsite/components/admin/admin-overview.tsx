"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, CheckCircle2, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AdminOverview() {
  const [stats, setStats] = useState({ totalIncidents: 0, openIncidents: 0, resolvedIncidents: 0, activeSos: 0, tourists: 0 })
  useEffect(() => { fetch("/api/admin/overview", { cache: "no-store" }).then((response) => response.ok ? response.json() : null).then((data) => data && setStats(data.stats)).catch(() => undefined) }, [])
  return <div className="space-y-6"><div><h1 className="text-3xl font-bold">Admin Dashboard</h1><p className="text-muted-foreground">SafeVoyage operational totals from PostgreSQL and the demo SOS store.</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{[["Total incidents", stats.totalIncidents], ["Open incidents", stats.openIncidents], ["Resolved", stats.resolvedIncidents], ["Active SOS", stats.activeSos], ["Registered tourists", stats.tourists]].map(([label, value]) => <Card key={String(label)}><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{String(label)}</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{String(value)}</p></CardContent></Card>)}</div><Card><CardContent className="flex items-center gap-3 p-5 text-sm text-muted-foreground"><CheckCircle2 className="h-5 w-5 text-emerald-600" /> Metrics are database-derived. SOS count reads the existing shared demo alert store.</CardContent></Card></div>
}
