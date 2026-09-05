"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, CheckCircle2, Clock3, MapPin, ShieldAlert } from "lucide-react"
import { DemoResponseService, type DemoSosAlert } from "@/lib/demo-response"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SOSButtonProps {
  userId: string
  touristName?: string
}

export function SOSButton({ userId, touristName = "Demo Tourist" }: SOSButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [activeAlert, setActiveAlert] = useState<DemoSosAlert | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    const refresh = () => {
      const alert = DemoResponseService.getSosAlerts().find(
        (item) => item.touristId === userId && item.status !== "RESOLVED",
      )
      setActiveAlert(alert ?? null)
    }
    refresh()
    window.addEventListener("storage", refresh)
    return () => window.removeEventListener("storage", refresh)
  }, [userId])

  const confirmSos = () => {
    setIsCreating(true)
    const alert = DemoResponseService.createSosAlert(userId, touristName)
    setActiveAlert(alert)
    setShowConfirmation(false)
    setIsCreating(false)
  }

  if (activeAlert) {
    return (
      <Card className="border-rose-300 bg-rose-50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-rose-800"><ShieldAlert className="h-5 w-5" /> SOS Alert Active</CardTitle>
          <CardDescription className="text-rose-700">Your demo alert is visible in the SafeVoyage authority dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-white/70 p-3"><p className="text-xs text-muted-foreground">Authority response</p><p className="mt-1 font-semibold text-rose-800">{activeAlert.status === "ACTIVE" ? "Pending" : activeAlert.status.replace("_", " ")}</p></div>
            <div className="rounded-lg bg-white/70 p-3"><p className="text-xs text-muted-foreground">Created</p><p className="mt-1 flex items-center gap-1 font-medium"><Clock3 className="h-3.5 w-3.5" />{new Date(activeAlert.timestamp).toLocaleTimeString()}</p></div>
            <div className="rounded-lg bg-white/70 p-3"><p className="text-xs text-muted-foreground">Severity</p><Badge variant="destructive" className="mt-1">{activeAlert.severity}</Badge></div>
          </div>
          <p className="flex items-center gap-2 text-xs text-rose-800"><MapPin className="h-3.5 w-3.5" />{activeAlert.location.address ?? `${activeAlert.location.latitude.toFixed(4)}, ${activeAlert.location.longitude.toFixed(4)}`}</p>
          <p className="text-xs text-rose-700">Demo workflow only. No emergency service or external authority has been contacted.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-rose-300 bg-rose-50">
        <CardHeader><CardTitle className="flex items-center gap-2 text-rose-800"><AlertTriangle className="h-5 w-5" /> Emergency SOS</CardTitle><CardDescription className="text-rose-700">Create a high-priority demo alert for the SafeVoyage authority dashboard.</CardDescription></CardHeader>
        <CardContent><Button onClick={() => setShowConfirmation(true)} className="h-14 w-full bg-rose-600 text-base font-bold text-white hover:bg-rose-700"><AlertTriangle className="mr-2 h-5 w-5" /> Emergency SOS</Button><p className="mt-3 text-center text-xs text-rose-700">This creates a local demo alert. It does not contact emergency services.</p></CardContent>
      </Card>

      {showConfirmation && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4"><Card className="w-full max-w-md shadow-2xl"><CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-rose-600" /> Confirm emergency alert</CardTitle><CardDescription>This action creates a shared demo event for authority review.</CardDescription></CardHeader><CardContent className="space-y-5"><div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">This will create an emergency alert for the SafeVoyage authority dashboard.</div><div className="flex gap-3"><Button variant="outline" className="flex-1" onClick={() => setShowConfirmation(false)}>Cancel</Button><Button className="flex-1 bg-rose-600 text-white hover:bg-rose-700" onClick={confirmSos} disabled={isCreating}><CheckCircle2 className="mr-2 h-4 w-4" />{isCreating ? "Creating..." : "Confirm SOS"}</Button></div></CardContent></Card></div>}
    </>
  )
}
