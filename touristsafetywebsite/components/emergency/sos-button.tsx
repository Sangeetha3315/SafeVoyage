"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Phone, MapPin, Clock, CheckCircle, X, Copy } from "lucide-react"
import { EmergencyService, type SOSAlert } from "@/lib/emergency"
import { CallInterface } from "@/components/call/call-interface"

interface SOSButtonProps {
  userId: string
}

export function SOSButton({ userId }: SOSButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [lastAlert, setLastAlert] = useState<SOSAlert | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showCallInterface, setShowCallInterface] = useState(false)
  const [blockchainIdCopied, setBlockchainIdCopied] = useState(false)
  const [callDetails, setCallDetails] = useState<{
    phoneNumber: string
    contactName?: string
    contactType: "emergency" | "personal"
  } | null>(null)

  const copyBlockchainId = async (blockchainId: string) => {
    try {
      await navigator.clipboard.writeText(blockchainId)
      setBlockchainIdCopied(true)
      setTimeout(() => setBlockchainIdCopied(false), 3000)
    } catch (err) {
      console.error("Failed to copy blockchain ID:", err)
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = blockchainId
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setBlockchainIdCopied(true)
      setTimeout(() => setBlockchainIdCopied(false), 3000)
    }
  }

  const handleQuickSOS = async () => {
    setIsLoading(true)

    try {
      const alert = await EmergencyService.sendQuickSOS(userId)
      setLastAlert(alert)
      setShowConfirmation(true)

      // Auto-hide confirmation after 10 seconds
      setTimeout(() => {
        setShowConfirmation(false)
      }, 10000)
    } catch (error) {
      console.error("Failed to send SOS:", error)
      alert("Failed to send SOS alert. Please try again or call emergency services directly.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmergencyCall = (phoneNumber: string, contactName?: string) => {
    setCallDetails({
      phoneNumber,
      contactName,
      contactType: "emergency",
    })
    setShowCallInterface(true)
  }

  const handleCancelAlert = () => {
    if (lastAlert) {
      EmergencyService.updateAlertStatus(lastAlert.id, "cancelled")
      setLastAlert(null)
      setShowConfirmation(false)
    }
  }

  if (showCallInterface && callDetails) {
    return (
      <CallInterface
        phoneNumber={callDetails.phoneNumber}
        contactName={callDetails.contactName}
        contactType={callDetails.contactType}
        onClose={() => {
          setShowCallInterface(false)
          setCallDetails(null)
        }}
        location={lastAlert?.location}
      />
    )
  }

  if (showConfirmation && lastAlert) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-700">
            <CheckCircle className="h-5 w-5" />
            <span>SOS Alert Sent Successfully</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Emergency alert has been sent to your contacts and local authorities.</AlertDescription>
          </Alert>

          {lastAlert.blockchainId && (
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-blue-700">Blockchain Tracking ID:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyBlockchainId(lastAlert.blockchainId!)}
                  className="flex items-center space-x-1"
                >
                  <Copy className="h-3 w-3" />
                  <span>{blockchainIdCopied ? "Copied!" : "Copy"}</span>
                </Button>
              </div>
              <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">{lastAlert.blockchainId}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Share this ID with emergency contacts for live location tracking
              </p>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Sent: {new Date(lastAlert.timestamp).toLocaleTimeString()}</span>
            </div>

            {lastAlert.location && (
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>
                  Location: {lastAlert.location.latitude.toFixed(4)}, {lastAlert.location.longitude.toFixed(4)}
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-3">
              {lastAlert.includePolice && <Badge variant="destructive">Police Notified</Badge>}
              {lastAlert.includeAmbulance && <Badge variant="destructive">Ambulance Notified</Badge>}
              {lastAlert.includeFire && <Badge variant="destructive">Fire Dept Notified</Badge>}
            </div>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleCancelAlert} className="flex-1 bg-transparent">
              <X className="h-4 w-4 mr-2" />
              Cancel Alert
            </Button>
            <Button onClick={() => setShowConfirmation(false)} className="flex-1">
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          <span>Emergency SOS</span>
        </CardTitle>
        <CardDescription>Send immediate emergency alert with your location to contacts and authorities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Only use in real emergencies. This will alert emergency services and your contacts.
          </AlertDescription>
        </Alert>

        <Button
          onClick={handleQuickSOS}
          disabled={isLoading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 text-lg"
          size="lg"
        >
          {isLoading ? (
            "Sending SOS..."
          ) : (
            <>
              <AlertTriangle className="h-6 w-6 mr-2" />
              SEND SOS ALERT
            </>
          )}
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Or call emergency services directly:</p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => handleEmergencyCall("911", "Emergency Services (US)")}>
              <Phone className="h-3 w-3 mr-1" />
              <span>911</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleEmergencyCall("112", "Emergency Services (EU)")}>
              <Phone className="h-3 w-3 mr-1" />
              <span>112</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
