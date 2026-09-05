"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Edit3, MapPin, ShieldCheck, Users } from "lucide-react"
import { AuthService, type User } from "@/lib/auth"
import { getDemoTouristProfile, saveDemoTouristProfile, type DemoTouristProfile } from "@/lib/demo-tourist"
import { EmergencyService } from "@/lib/emergency"
import { useRouteUser } from "@/components/auth/demo-route"
import { DigitalTouristId } from "@/components/tourist/digital-tourist-id"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export function TouristProfile() {
  const routeUser = useRouteUser()
  const [legacyUser, setLegacyUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<DemoTouristProfile | null>(null)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (!routeUser) setLegacyUser(AuthService.getCurrentUser())
  }, [routeUser])

  const user = routeUser ?? legacyUser

  useEffect(() => {
    if (user) setProfile(getDemoTouristProfile(user))
  }, [user])

  if (!user || !profile) return null

  const save = () => {
    saveDemoTouristProfile(profile)
    setEditing(false)
  }

  const contactCount = Math.max(profile.emergencyContactCount, EmergencyService.getEmergencyContacts().length)

  return <div className="space-y-6"><div className="flex flex-col gap-4 rounded-2xl bg-slate-950 p-6 text-white sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-300/20 text-2xl font-bold text-teal-100">{profile.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div><div><Badge className="mb-2 border-teal-300/30 bg-teal-300/15 text-teal-100 hover:bg-teal-300/15">VERIFIED DEMO PROFILE</Badge><h1 className="text-3xl font-bold">{profile.name}</h1><p className="text-slate-300">SafeVoyage tourist profile</p></div></div><Button variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20" onClick={() => setEditing(!editing)}><Edit3 className="mr-2 h-4 w-4" /> {editing ? "Cancel editing" : "Edit profile"}</Button></div>
  {editing && <Card><CardHeader><CardTitle>Edit demo profile</CardTitle><CardDescription>Changes are stored only in this browser.</CardDescription></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="profile-name">Full name</Label><Input id="profile-name" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} /></div><div className="space-y-2"><Label htmlFor="profile-country">Country / nationality</Label><Input id="profile-country" value={profile.country} onChange={(event) => setProfile({ ...profile, country: event.target.value })} /></div><div className="space-y-2"><Label htmlFor="profile-phone">Phone number</Label><Input id="profile-phone" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} /></div><div className="flex items-end"><Button onClick={save}>Save demo profile</Button></div></CardContent></Card>}
  <div id="digital-id" className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"><Card><CardHeader><CardTitle>Personal information</CardTitle><CardDescription>Demo profile details linked to this session</CardDescription></CardHeader><CardContent className="space-y-4"><div><p className="text-xs text-muted-foreground">Full name</p><p className="font-semibold">{profile.name}</p></div><div><p className="text-xs text-muted-foreground">Tourist ID</p><p className="font-semibold">{profile.id}</p></div><div><p className="text-xs text-muted-foreground">Email</p><p className="font-semibold">{profile.email}</p></div><div className="grid grid-cols-2 gap-4"><div><p className="text-xs text-muted-foreground">Country</p><p className="font-semibold">{profile.country}</p></div><div><p className="text-xs text-muted-foreground">Phone</p><p className="font-semibold">{profile.phone}</p></div></div><div className="flex items-center gap-2 text-sm font-semibold text-emerald-700"><CheckCircle2 className="h-4 w-4" /> Verified Demo Identity</div><p className="text-xs text-muted-foreground">This is a SafeVoyage demo profile, not a government-issued identity.</p></CardContent></Card><DigitalTouristId user={user} /></div>
  <div className="grid gap-6 sm:grid-cols-3"><Card><CardContent className="flex items-center gap-3 p-5"><Users className="h-5 w-5 text-primary" /><div><p className="text-xs text-muted-foreground">Emergency contacts</p><p className="font-bold">{contactCount}</p></div></CardContent></Card><Card><CardContent className="flex items-center gap-3 p-5"><MapPin className="h-5 w-5 text-primary" /><div><p className="text-xs text-muted-foreground">Location sharing</p><p className="font-bold text-emerald-700">Browser GPS ready</p></div></CardContent></Card><Card><CardContent className="flex items-center gap-3 p-5"><ShieldCheck className="h-5 w-5 text-primary" /><div><p className="text-xs text-muted-foreground">Safety status</p><p className="font-bold text-emerald-700">Protected demo</p></div></CardContent></Card></div></div>
}
