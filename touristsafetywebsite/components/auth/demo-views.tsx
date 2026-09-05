"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AuthService, type User } from "@/lib/auth"
import { SOSButton } from "@/components/emergency/sos-button"
import { InteractiveMap } from "@/components/location/interactive-map"
import { EmergencyService, type EmergencyContact } from "@/lib/emergency"
import { DemoResponseService, DEMO_RESPONDERS, type DemoIncident, type DemoSosAlert } from "@/lib/demo-response"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, AlertTriangle, CheckCircle2, Compass, FileWarning, HeartHandshake, MapPin, Phone, Shield, Siren, Users } from "lucide-react"

function useDemoUser() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    setUser(AuthService.getCurrentUser())
  }, [])

  return user
}

export function TouristDashboardView() {
  const user = useDemoUser()
  if (!user) return null

  const demoContacts: EmergencyContact[] = [
    { id: "demo-contact-1", name: "Maya Chen", phone: "+1 (212) 555-0148", relationship: "Sister", isPrimary: true },
    { id: "demo-contact-2", name: "Daniel Brooks", phone: "+1 (646) 555-0182", relationship: "Travel partner", isPrimary: false },
    { id: "demo-contact-3", name: "SafeVoyage Support", phone: "+1 (800) 555-0199", relationship: "Demo support desk", isPrimary: false },
  ]
  const storedContacts = EmergencyService.getEmergencyContacts()
  const contacts = storedContacts.length > 0 ? storedContacts.slice(0, 3) : demoContacts
  const demoLocation = { lat: 40.7829, lng: -73.9654 }

  return (
    <div className="space-y-6 pb-8">
      <section className="relative overflow-hidden rounded-2xl bg-slate-950 px-5 py-7 text-white shadow-lg sm:px-8">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.22),transparent_58%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div><Badge className="mb-4 border border-teal-300/30 bg-teal-300/15 text-teal-100 hover:bg-teal-300/15">DEMO MONITORING ACTIVE</Badge><h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">You&apos;re covered, {user.name.split(" ")[0]}.</h1><p className="mt-3 max-w-xl text-slate-300">SafeVoyage is keeping your trip in view and ready to help if something changes.</p></div>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm"><span className="relative flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" /><span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" /></span><div><p className="text-sm font-semibold">Online and watching</p><p className="text-xs text-slate-300">Last check completed just now</p></div></div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <Card className="overflow-hidden border-emerald-200 bg-gradient-to-br from-emerald-50 to-white"><CardHeader className="flex flex-row items-start justify-between space-y-0"><div><CardDescription className="font-medium uppercase tracking-[0.16em] text-emerald-700">Demo-derived readiness</CardDescription><CardTitle className="mt-2 text-2xl">Your safety score</CardTitle></div><div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-emerald-200 bg-white text-xl font-bold text-emerald-700">82</div></CardHeader><CardContent><div className="flex items-end justify-between gap-4"><div><p className="text-4xl font-bold text-slate-900">82<span className="text-lg text-slate-400"> / 100</span></p><p className="mt-1 text-sm text-emerald-700">Good preparation</p></div><Shield className="h-10 w-10 text-emerald-500" /></div><Progress value={82} className="mt-5 h-2 bg-emerald-100" /><p className="mt-4 text-xs leading-5 text-slate-500">Demo score based on configured contacts, location sharing, and the selected safety zone. It is not an AI risk prediction.</p></CardContent></Card>
        <Card><CardHeader><CardDescription className="font-medium uppercase tracking-[0.16em]">Current location</CardDescription><CardTitle className="flex items-center gap-2 text-2xl"><MapPin className="h-5 w-5 text-emerald-600" /> Central Park, New York</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-3"><div className="flex items-center gap-2 text-sm font-medium text-emerald-800"><CheckCircle2 className="h-4 w-4" /> Location sharing on</div><Badge variant="outline" className="border-emerald-200 text-emerald-700">Demo GPS</Badge></div><div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Last updated</span><span className="font-medium">Just now</span></div><div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Accuracy</span><span className="font-medium">High confidence</span></div><Link href="/location" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><Compass className="h-4 w-4" /> Open safety map</Link></CardContent></Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)]"><Card className="overflow-hidden"><CardHeader className="flex flex-row items-center justify-between space-y-0"><div><CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> Safety map</CardTitle><CardDescription>Demo location context around your current position</CardDescription></div><Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Safe zone</Badge></CardHeader><CardContent className="p-0"><div className="h-[270px] sm:h-[330px]"><InteractiveMap onLocationSelect={() => undefined} currentLocation={demoLocation} safetyZone="green" /></div></CardContent></Card><Card><CardHeader><CardTitle>Safety zones</CardTitle><CardDescription>How SafeVoyage labels trip conditions</CardDescription></CardHeader><CardContent className="space-y-4">{[{ label: "Safe zone", note: "Low concern", color: "bg-emerald-500", icon: CheckCircle2 }, { label: "Caution zone", note: "Stay alert", color: "bg-amber-400", icon: AlertTriangle }, { label: "Risk / danger", note: "Take action", color: "bg-rose-500", icon: Siren }].map((zone) => { const Icon = zone.icon; return <div key={zone.label} className="flex items-center gap-3"><span className={`flex h-9 w-9 items-center justify-center rounded-full ${zone.color} text-white`}><Icon className="h-4 w-4" /></span><div><p className="text-sm font-semibold">{zone.label}</p><p className="text-xs text-muted-foreground">{zone.note}</p></div></div> })}<p className="border-t pt-4 text-xs leading-5 text-muted-foreground">Zone labels are simulated for this demo and should not replace local guidance or emergency services.</p></CardContent></Card></section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.8fr)]"><Card><CardHeader className="flex flex-row items-center justify-between space-y-0"><div><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Emergency contacts</CardTitle><CardDescription>People ready to receive your demo SOS request</CardDescription></div><Link href="/contacts" className="text-sm font-semibold text-primary hover:underline">Manage</Link></CardHeader><CardContent className="space-y-3">{contacts.map((contact) => <div key={contact.id} className="flex items-center justify-between gap-3 rounded-lg border p-3"><div className="flex min-w-0 items-center gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700">{contact.name.charAt(0)}</div><div className="min-w-0"><p className="truncate text-sm font-semibold">{contact.name}</p><p className="text-xs text-muted-foreground">{contact.relationship} · {contact.phone}</p></div></div><Badge variant="outline" className="shrink-0 border-emerald-200 text-emerald-700"><CheckCircle2 className="mr-1 h-3 w-3" /> Verified</Badge></div>)}</CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-primary" /> Recent safety activity</CardTitle><CardDescription>Demo timeline from your trip</CardDescription></CardHeader><CardContent className="space-y-4">{[{ icon: MapPin, title: "Location updated", detail: "Central Park, New York", time: "Just now", color: "text-blue-600 bg-blue-50" }, { icon: CheckCircle2, title: "Entered safe zone", detail: "Low concern area confirmed", time: "8 min ago", color: "text-emerald-600 bg-emerald-50" }, { icon: HeartHandshake, title: "Safety check completed", detail: "Preparedness score refreshed", time: "12 min ago", color: "text-violet-600 bg-violet-50" }].map((event) => { const Icon = event.icon; return <div key={event.title} className="flex gap-3"><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${event.color}`}><Icon className="h-4 w-4" /></span><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><p className="text-sm font-semibold">{event.title}</p><span className="shrink-0 text-xs text-muted-foreground">{event.time}</span></div><p className="text-xs text-muted-foreground">{event.detail}</p></div></div> })}</CardContent></Card></section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Button asChild className="h-14 justify-start gap-3"><Link href="/tourist/incidents"><FileWarning className="h-5 w-5" /><span><span className="block text-sm">Report incident</span><span className="block text-xs font-normal opacity-75">Document a concern</span></span></Link></Button><Button asChild variant="destructive" className="h-14 justify-start gap-3"><Link href="/emergency"><Siren className="h-5 w-5" /><span><span className="block text-sm">Emergency SOS</span><span className="block text-xs font-normal opacity-90">Start demo workflow</span></span></Link></Button><Button asChild variant="outline" className="h-14 justify-start gap-3"><Link href="/location"><Compass className="h-5 w-5" /><span><span className="block text-sm">View safety map</span><span className="block text-xs font-normal text-muted-foreground">Check your area</span></span></Link></Button><Button asChild variant="outline" className="h-14 justify-start gap-3"><Link href="/contacts"><Phone className="h-5 w-5" /><span><span className="block text-sm">Emergency contacts</span><span className="block text-xs font-normal text-muted-foreground">Manage trusted people</span></span></Link></Button></section>

      <Card className="border-rose-200 bg-rose-50/70"><CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-700"><Siren className="h-5 w-5" /></div><div><p className="font-semibold text-rose-950">Need immediate help?</p><p className="mt-1 text-sm text-rose-800">The demo SOS creates a local alert and prepares your selected contacts. It does not contact emergency services.</p></div></div><div className="shrink-0"><SOSButton userId={user.id} touristName={user.name} /></div></CardContent></Card>
    </div>
  )
}

export function AuthorityDashboardView() {
  const user = useDemoUser()
  if (!user) return null
  return <DemoAuthorityResponsePanel />
}

function DemoAuthorityResponsePanel() {
  const [alerts, setAlerts] = useState<DemoSosAlert[]>([])
  const [incidents, setIncidents] = useState<DemoIncident[]>([])
  const [selectedResponder, setSelectedResponder] = useState<Record<string, string>>({})

  useEffect(() => {
    const refresh = () => {
      setAlerts(DemoResponseService.getSosAlerts())
      setIncidents(DemoResponseService.getIncidents())
    }
    refresh()
    window.addEventListener("storage", refresh)
    return () => window.removeEventListener("storage", refresh)
  }, [])

  const updateAlert = (id: string, action: "acknowledge" | "assign" | "resolve") => {
    if (action === "acknowledge") DemoResponseService.updateSosStatus(id, "ACKNOWLEDGED")
    if (action === "resolve") DemoResponseService.updateSosStatus(id, "RESOLVED")
    if (action === "assign") {
      const responder = DEMO_RESPONDERS.find((item) => item.id === selectedResponder[id])
      if (responder) DemoResponseService.assignResponder(id, responder)
      else return
    }
    setAlerts(DemoResponseService.getSosAlerts())
  }

  const updateIncident = (id: string, status: DemoIncident["status"]) => {
    DemoResponseService.updateIncidentStatus(id, status)
    setIncidents(DemoResponseService.getIncidents())
  }

  return <section className="container mx-auto space-y-6 px-4 pt-6">
    <div className="flex items-end justify-between gap-3"><div><Badge variant="destructive" className="mb-2">DEMO RESPONSE CENTER</Badge><h2 className="text-2xl font-bold">Emergency alerts</h2><p className="text-sm text-muted-foreground">Shared demo events from the tourist workflow. No external notifications are sent.</p></div><Badge variant="outline">{alerts.filter((alert) => alert.status !== "RESOLVED").length} active</Badge></div>
    <Card className="border-rose-200"><CardHeader><CardTitle className="flex items-center gap-2"><Siren className="h-5 w-5 text-rose-600" /> High-priority SOS alerts</CardTitle><CardDescription>Acknowledge, assign a demo responder, then resolve.</CardDescription></CardHeader><CardContent className="space-y-4">{alerts.length === 0 ? <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">No SOS alerts yet. Trigger the tourist demo SOS to see it appear here.</div> : alerts.map((alert) => <div key={alert.id} className="rounded-xl border border-rose-200 bg-rose-50/60 p-4"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div className="space-y-2"><div className="flex flex-wrap items-center gap-2"><Badge variant="destructive">{alert.severity}</Badge><Badge variant="outline">{alert.status.replace("_", " ")}</Badge></div><p className="font-semibold">{alert.touristName}</p><p className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{alert.location.address ?? `${alert.location.latitude.toFixed(4)}, ${alert.location.longitude.toFixed(4)}`}</p><p className="text-xs text-muted-foreground">{new Date(alert.timestamp).toLocaleString()}</p>{alert.responderName && <p className="text-sm font-medium text-emerald-700">Responder assigned: {alert.responderName}</p>}</div><div className="flex flex-wrap gap-2 lg:max-w-md lg:justify-end">{alert.status === "ACTIVE" && <Button size="sm" onClick={() => updateAlert(alert.id, "acknowledge")}>Acknowledge</Button>}{(alert.status === "ACKNOWLEDGED" || alert.status === "ACTIVE") && <><select aria-label="Select responder" className="h-9 rounded-md border bg-background px-2 text-sm" value={selectedResponder[alert.id] ?? ""} onChange={(event) => setSelectedResponder((current) => ({ ...current, [alert.id]: event.target.value }))}><option value="">Select responder</option>{DEMO_RESPONDERS.map((responder) => <option key={responder.id} value={responder.id}>{responder.name} · {responder.eta}</option>)}</select><Button size="sm" variant="outline" onClick={() => updateAlert(alert.id, "assign")}>Assign responder</Button></>}{alert.status !== "RESOLVED" && <Button size="sm" variant="outline" onClick={() => updateAlert(alert.id, "resolve")}>Resolve</Button>}</div></div></div>)}</CardContent></Card>
    <Card><CardHeader><CardTitle>Demo incident reports</CardTitle><CardDescription>Tourist-submitted reports moving through review.</CardDescription></CardHeader><CardContent className="space-y-3">{incidents.length === 0 ? <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">No incident reports yet.</div> : incidents.map((incident) => <div key={incident.id} className="flex flex-col gap-3 rounded-lg border p-4 lg:flex-row lg:items-center lg:justify-between"><div><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{incident.title}</p><Badge variant="outline">{incident.severity}</Badge><Badge variant="secondary">{incident.status}</Badge></div><p className="mt-1 text-sm text-muted-foreground">{incident.category} · {incident.location} · {incident.touristName}</p></div><div className="flex gap-2">{incident.status === "REPORTED" && <Button size="sm" onClick={() => updateIncident(incident.id, "REVIEWING")}>Start review</Button>}{incident.status === "REVIEWING" && <Button size="sm" variant="outline" onClick={() => updateIncident(incident.id, "RESOLVED")}>Resolve</Button>}</div></div>)}</CardContent></Card>
  </section>
}

export function TouristEmergencyView() {
  const user = useDemoUser()
  if (!user) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Emergency / SOS</h1>
        <p className="mt-2 text-muted-foreground">Demo controls for preparing and sending an emergency request.</p>
      </div>
      <SOSButton userId={user.id} touristName={user.name} />
    </div>
  )
}