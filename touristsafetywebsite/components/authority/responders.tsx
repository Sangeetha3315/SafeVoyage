"use client"

import { useEffect, useState } from "react"
import { UserRound } from "lucide-react"
import { DemoResponseService, type DemoResponder } from "@/lib/demo-response"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function Responders() {
  const [responders, setResponders] = useState<DemoResponder[]>([])
  useEffect(() => { const refresh = () => setResponders(DemoResponseService.getResponders()); refresh(); window.addEventListener("storage", refresh); return () => window.removeEventListener("storage", refresh) }, [])
  return <Card><CardHeader><CardTitle>Responders</CardTitle></CardHeader><CardContent className="space-y-3">{responders.map((responder) => <div key={responder.id} className="flex items-center justify-between rounded-lg border p-4"><div className="flex items-center gap-3"><UserRound className="h-5 w-5 text-primary" /><div><p className="font-semibold">{responder.name}</p><p className="text-sm text-muted-foreground">{responder.role}</p></div></div><Badge variant={responder.status === "Available" ? "default" : "secondary"}>{responder.status}</Badge></div>)}</CardContent></Card>
}
