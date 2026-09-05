"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { CheckCircle2, ExternalLink, Shield, UserRound } from "lucide-react"
import { getDemoTouristProfile, type DemoTouristProfile } from "@/lib/demo-tourist"
import type { User } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface DigitalTouristIdProps {
  user: User
  compact?: boolean
}

export function DigitalTouristId({ user, compact = false }: DigitalTouristIdProps) {
  const [profile, setProfile] = useState<DemoTouristProfile | null>(null)
  const [verificationUrl, setVerificationUrl] = useState(`/verify/tourist/SV-TOUR-2026-001`)

  useEffect(() => {
    const nextProfile = getDemoTouristProfile(user)
    setProfile(nextProfile)
    setVerificationUrl(`${window.location.origin}/verify/tourist/${nextProfile.id}`)
  }, [user])

  if (!profile) return null

  return (
    <Card className={compact ? "border-sky-200 bg-sky-50/60" : "border-slate-200 shadow-sm"}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div><Badge className="mb-3 bg-slate-900 text-white hover:bg-slate-900">SAFEVOYAGE DEMO ID</Badge><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Digital Tourist ID</CardTitle></div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"><UserRound className="h-6 w-6" /></div>
      </CardHeader>
      <CardContent className={`space-y-5 ${compact ? "" : "sm:grid sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8 sm:space-y-0"}`}>
        <div className="space-y-3"><div><p className="text-lg font-bold">{profile.name}</p><p className="text-sm text-muted-foreground">{profile.country} · {profile.email}</p></div><div className="grid grid-cols-2 gap-3 text-sm"><div><p className="text-xs text-muted-foreground">Tourist ID</p><p className="font-semibold">{profile.id}</p></div><div><p className="text-xs text-muted-foreground">Status</p><p className="flex items-center gap-1 font-semibold text-emerald-700"><CheckCircle2 className="h-4 w-4" /> Verified Demo</p></div><div><p className="text-xs text-muted-foreground">Emergency contacts</p><p className="font-semibold">{profile.emergencyContactCount}</p></div><div><p className="text-xs text-muted-foreground">Issue date</p><p className="font-semibold">{new Date(profile.createdAt).toLocaleDateString()}</p></div></div></div>
        <div className="flex flex-col items-center gap-3"><div className="rounded-xl border-8 border-white bg-white p-1 shadow-sm"><QRCodeSVG value={verificationUrl} size={compact ? 132 : 190} level="M" includeMargin /></div><p className="text-center text-xs text-muted-foreground">Scan for demo verification</p></div>
  {!compact && <Button asChild variant="outline" className="sm:col-span-2 sm:justify-self-start"><Link href={`/verify/tourist/${profile.id}`}><ExternalLink className="mr-2 h-4 w-4" /> View Verification</Link></Button>}
  {compact && <Button asChild variant="outline" className="w-full"><Link href="/profile#digital-id">View Digital ID</Link></Button>}
      </CardContent>
    </Card>
  )
}
