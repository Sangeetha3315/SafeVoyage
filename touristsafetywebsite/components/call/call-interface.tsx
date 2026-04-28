"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, PhoneCall, PhoneOff, Clock, User, MapPin, X } from "lucide-react"

interface CallInterfaceProps {
  phoneNumber: string
  contactName?: string
  contactType?: "emergency" | "personal"
  onClose: () => void
  location?: { latitude: number; longitude: number }
}

export function CallInterface({
  phoneNumber,
  contactName,
  contactType = "emergency",
  onClose,
  location,
}: CallInterfaceProps) {
  const [callStatus, setCallStatus] = useState<"dialing" | "connected" | "ended">("dialing")
  const [callDuration, setCallDuration] = useState(0)
  const [isCallActive, setIsCallActive] = useState(false)

  useEffect(() => {
    // Simulate call connection after 2 seconds
    const connectTimer = setTimeout(() => {
      setCallStatus("connected")
      setIsCallActive(true)
    }, 2000)

    return () => clearTimeout(connectTimer)
  }, [])

  useEffect(() => {
    let durationTimer: NodeJS.Timeout

    if (callStatus === "connected") {
      durationTimer = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (durationTimer) clearInterval(durationTimer)
    }
  }, [callStatus])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleEndCall = () => {
    setCallStatus("ended")
    setIsCallActive(false)
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  const initiateActualCall = () => {
    // This will trigger the device's native call functionality
    window.location.href = `tel:${phoneNumber}`
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between">
            <Badge variant={contactType === "emergency" ? "destructive" : "default"}>
              {contactType === "emergency" ? "Emergency Call" : "Personal Contact"}
            </Badge>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardTitle className="flex items-center justify-center space-x-2 text-xl">
            <User className="h-6 w-6" />
            <span>{contactName || "Emergency Services"}</span>
          </CardTitle>
          <CardDescription className="text-lg font-mono">{phoneNumber}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Call Status */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              {callStatus === "dialing" && (
                <>
                  <Phone className="h-5 w-5 animate-pulse text-blue-500" />
                  <span className="text-blue-500">Connecting...</span>
                </>
              )}
              {callStatus === "connected" && (
                <>
                  <PhoneCall className="h-5 w-5 text-green-500" />
                  <span className="text-green-500">Connected</span>
                </>
              )}
              {callStatus === "ended" && (
                <>
                  <PhoneOff className="h-5 w-5 text-red-500" />
                  <span className="text-red-500">Call Ended</span>
                </>
              )}
            </div>

            {callStatus === "connected" && (
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(callDuration)}</span>
              </div>
            )}
          </div>

          {/* Location Info */}
          {location && (
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Your Location Shared:</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </p>
            </div>
          )}

          {/* Call Actions */}
          <div className="space-y-3">
            {callStatus === "dialing" && (
              <Button
                onClick={initiateActualCall}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <PhoneCall className="h-5 w-5 mr-2" />
                Start Call
              </Button>
            )}

            {callStatus === "connected" && (
              <Button onClick={handleEndCall} variant="destructive" className="w-full" size="lg">
                <PhoneOff className="h-5 w-5 mr-2" />
                End Call
              </Button>
            )}

            {callStatus === "ended" && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">Call duration: {formatDuration(callDuration)}</p>
                <Button onClick={onClose} variant="outline" className="w-full bg-transparent">
                  Close
                </Button>
              </div>
            )}
          </div>

          {/* Emergency Info */}
          {contactType === "emergency" && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
              <p className="text-xs text-red-700">
                <strong>Emergency Call:</strong> Your location and emergency details have been automatically shared with
                the emergency services.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
