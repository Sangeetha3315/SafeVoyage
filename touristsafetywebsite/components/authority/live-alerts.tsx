"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, MapPin } from "lucide-react"
import { DemoResponseService, type DemoResponder, type DemoSosAlert } from "@/lib/demo-response"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function LiveAlerts() {
  const [alerts, setAlerts] = useState<DemoSosAlert[]>([])
  const [responders, setResponders] = useState<DemoResponder[]>([])
  const [selectedResponder, setSelectedResponder] = useState<Record<string, string>>({})

  const refresh = () => {
    setAlerts(DemoResponseService.getSosAlerts())
    setResponders(DemoResponseService.getResponders())
  }

  useEffect(() => {
    refresh()
    window.addEventListener("storage", refresh)
    return () => window.removeEventListener("storage", refresh)
  }, [])

  const update = (id: string, status: "ACKNOWLEDGED" | "RESOLVED") => {
    DemoResponseService.updateSosStatus(id, status)
    refresh()
  }

  const assign = (id: string) => {
    const responder = responders.find((item) => item.id === selectedResponder[id] && item.status === "Available")
    if (responder) DemoResponseService.assignResponder(id, responder)
    refresh()
  }

  const activeAlerts = alerts.filter((alert) => alert.status !== "RESOLVED")
  const resolvedAlerts = alerts.filter((alert) => alert.status === "RESOLVED")

    return (
    <Card className="border-rose-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-rose-600" />
          Live Alerts
        </CardTitle>
        <CardDescription>
          Shared demo SOS alerts from tourists.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Active alerts */}
        {activeAlerts.map((alert) => (
          <div
            key={alert.id}
            className="rounded-lg border border-rose-200 bg-rose-50 p-4"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="destructive">{alert.severity}</Badge>
                  <Badge variant="outline">{alert.status}</Badge>
                </div>

                <p className="mt-2 font-semibold">{alert.touristName}</p>

                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {alert.location.address ?? "Location unavailable"}
                </p>

                {alert.responderName && (
                  <p className="mt-1 text-sm font-medium text-emerald-700">
                    Assigned: {alert.responderName}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {alert.status === "ACTIVE" && (
                  <Button
                    size="sm"
                    onClick={() => update(alert.id, "ACKNOWLEDGED")}
                  >
                    Acknowledge
                  </Button>
                )}

                <select
                  aria-label="Select responder"
                  className="h-9 rounded-md border bg-background px-2 text-sm"
                  value={selectedResponder[alert.id] ?? ""}
                  onChange={(event) =>
                    setSelectedResponder((current) => ({
                      ...current,
                      [alert.id]: event.target.value,
                    }))
                  }
                >
                  <option value="">Select available responder</option>

                  {responders
                    .filter((item) => item.status === "Available")
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => assign(alert.id)}
                >
                  Assign
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => update(alert.id, "RESOLVED")}
                >
                  Resolve
                </Button>
              </div>
            </div>
          </div>
        ))}

        {activeAlerts.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No active SOS alerts
          </p>
        )}

        {/* Resolved alerts */}
        {resolvedAlerts.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="font-semibold">Resolved Alerts</h3>

            {resolvedAlerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-lg border bg-muted/30 p-4"
              >
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">RESOLVED</Badge>
                    <Badge variant="outline">{alert.severity}</Badge>
                  </div>

                  <p className="mt-2 font-semibold">
                    {alert.touristName}
                  </p>

                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {alert.location.address ?? "Location unavailable"}
                  </p>

                  {alert.responderName && (
                    <p className="mt-1 text-sm font-medium text-emerald-700">
                      Assigned responder: {alert.responderName}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

