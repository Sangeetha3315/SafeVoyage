"use client"

import { useEffect, useState } from "react"
import { AuthService, type User } from "@/lib/auth"
import AdminDashboard from "@/components/admin/admin-dashboard"
import { SafetyOverview } from "@/components/dashboard/safety-overview"
import { SOSButton } from "@/components/emergency/sos-button"
import { CustomSOS } from "@/components/emergency/custom-sos"
import { Badge } from "@/components/ui/badge"

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

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="secondary" className="mb-3">Tourist demo workspace</Badge>
        <h1 className="text-3xl font-bold tracking-tight">Good to see you, {user.name}</h1>
        <p className="mt-2 text-muted-foreground">Your safety readiness and recent activity at a glance.</p>
      </div>
      <SafetyOverview userId={user.id} />
    </div>
  )
}

export function AuthorityDashboardView() {
  const user = useDemoUser()
  if (!user) return null
  return <AdminDashboard user={user} onLogout={() => AuthService.signOut()} />
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
      <SOSButton userId={user.id} />
      <CustomSOS userId={user.id} />
    </div>
  )
}