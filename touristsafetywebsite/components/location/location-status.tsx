"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Loader2, MapPin, RefreshCw } from "lucide-react"
import { LocationService, type LocationData } from "@/lib/location"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface LocationStatusProps {
  onLocationDetected?: (location: LocationData) => void
}

export function LocationStatus({ onLocationDetected }: LocationStatusProps) {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const lastKnown = LocationService.getLastKnownLocation()
    if (lastKnown) {
      setLocation(lastKnown)
      onLocationDetected?.(lastKnown)
    }

    const handleUpdate = (nextLocation: LocationData) => {
      setLocation(nextLocation)
      onLocationDetected?.(nextLocation)
    }
    LocationService.addLocationListener(handleUpdate)
    return () => LocationService.removeLocationListener(handleUpdate)
  }, [onLocationDetected])

  const detectLocation = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const permissionGranted = await LocationService.requestPermission()
      if (!permissionGranted) throw new Error("Location unavailable — please allow location access.")
      const detected = await LocationService.getCurrentLocation()
      setLocation(detected)
      onLocationDetected?.(detected)
    } catch (locationError) {
      setError(locationError instanceof Error ? locationError.message : "Location unavailable — please allow location access.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {location ? (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3 rounded-lg bg-emerald-50 p-3">
            <div className="flex gap-2"><CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" /><div><p className="font-semibold text-emerald-900">Location detected successfully</p><p className="text-xs text-emerald-800">Browser/device location · one-time demo reading</p></div></div>
            <Badge variant="outline" className="border-emerald-200 text-emerald-700">GPS</Badge>
          </div>
          <div className="space-y-2 text-sm"><p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span className="font-medium">{location.address || "Address lookup unavailable"}</span></p><div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2"><p>Latitude: <span className="font-medium text-foreground">{location.latitude.toFixed(6)}</span></p><p>Longitude: <span className="font-medium text-foreground">{location.longitude.toFixed(6)}</span></p><p>Accuracy: <span className="font-medium text-foreground">{Math.round(location.accuracy)} m</span></p><p>Updated: <span className="font-medium text-foreground">{new Date(location.timestamp).toLocaleTimeString()}</span></p></div></div>
          <Button variant="outline" size="sm" onClick={detectLocation} disabled={isLoading}><RefreshCw className="mr-2 h-4 w-4" /> Refresh location</Button>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-4"><p className="text-sm text-muted-foreground">Location unavailable — please allow location access.</p><Button className="mt-3" onClick={detectLocation} disabled={isLoading}>{isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Detecting location...</> : <><MapPin className="mr-2 h-4 w-4" /> Allow location access</>}</Button></div>
      )}
      {error && <p role="alert" className="rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p>}
      <p className="text-xs text-muted-foreground">SafeVoyage does not provide continuous background tracking in this demo.</p>
    </div>
  )
}
