"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Shield, MapPin, Users, AlertTriangle, Clock, CheckCircle, Activity } from "lucide-react"
import { LocationService, type LocationData, type SafetyZoneInfo } from "@/lib/location"
import { EmergencyService, type SOSAlert } from "@/lib/emergency"

interface SafetyOverviewProps {
  userId: string
}

export function SafetyOverview({ userId }: SafetyOverviewProps) {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [safetyStatus, setSafetyStatus] = useState<SafetyZoneInfo | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [recentAlerts, setRecentAlerts] = useState<SOSAlert[]>([])
  const [contactsCount, setContactsCount] = useState(0)
  const [safetyScore, setSafetyScore] = useState(0)

  useEffect(() => {
    // Load initial data
    loadDashboardData()

    // Set up location listener
    const handleLocationUpdate = (newLocation: LocationData) => {
      setLocation(newLocation)
      setSafetyStatus(LocationService.checkSafeZone(newLocation))
      calculateSafetyScore(newLocation, EmergencyService.getEmergencyContacts().length, LocationService.isTracking())
    }

    LocationService.addLocationListener(handleLocationUpdate)

    // Update tracking status periodically
    const interval = setInterval(() => {
      setIsTracking(LocationService.isTracking())
    }, 5000)

    return () => {
      LocationService.removeLocationListener(handleLocationUpdate)
      clearInterval(interval)
    }
  }, [])

  const loadDashboardData = () => {
    // Load location data
    const lastLocation = LocationService.getLastKnownLocation()
    if (lastLocation) {
      setLocation(lastLocation)
      setSafetyStatus(LocationService.checkSafeZone(lastLocation))
    }

    // Load tracking status
    setIsTracking(LocationService.isTracking())

    // Load emergency contacts
    const contacts = EmergencyService.getEmergencyContacts()
    setContactsCount(contacts.length)

    // Load recent alerts
    const alerts = EmergencyService.getSOSAlerts()
    const recent = alerts.slice(-3).reverse() // Last 3 alerts, most recent first
    setRecentAlerts(recent)

    // Calculate safety score
    calculateSafetyScore(lastLocation, contacts.length, LocationService.isTracking())
  }

  const calculateSafetyScore = (
    currentLocation: LocationData | null,
    contactCount: number,
    trackingActive: boolean,
  ) => {
    let score = 0

    // Location tracking (30 points)
    if (currentLocation) score += 20
    if (trackingActive) score += 10

    // Emergency contacts (40 points)
    if (contactCount >= 1) score += 20
    if (contactCount >= 2) score += 10
    if (contactCount >= 3) score += 10

    // Safety zone (30 points)
    if (currentLocation && safetyStatus?.zone === "green") score += 30
    else if (currentLocation) score += 15 // At least we have location

    setSafetyScore(Math.min(score, 100))
  }

  const getSafetyScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getSafetyScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Needs Improvement"
  }

  return (
    <div className="space-y-6">
      {/* Safety Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Safety Score</span>
          </CardTitle>
          <CardDescription>Your overall safety preparedness level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{safetyScore}/100</span>
              <Badge variant={safetyScore >= 80 ? "default" : safetyScore >= 60 ? "secondary" : "destructive"}>
                {getSafetyScoreLabel(safetyScore)}
              </Badge>
            </div>
            <Progress value={safetyScore} className="w-full" />
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium">Location</div>
                <div className={`text-xs ${location ? "text-green-600" : "text-red-600"}`}>
                  {location ? (isTracking ? "Active" : "Available") : "Disabled"}
                </div>
              </div>
              <div className="text-center">
                <div className="font-medium">Contacts</div>
                <div
                  className={`text-xs ${contactsCount >= 2 ? "text-green-600" : contactsCount >= 1 ? "text-yellow-600" : "text-red-600"}`}
                >
                  {contactsCount} Added
                </div>
              </div>
              <div className="text-center">
                <div className="font-medium">Zone Status</div>
                <div className={`text-xs ${safetyStatus?.zone === "green" ? "text-green-600" : "text-yellow-600"}`}>
                  {safetyStatus?.zone === "green" ? "Safe" : "Caution"}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Status Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Location Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {location ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Tracking</span>
                  <Badge variant={isTracking ? "default" : "secondary"} className="text-xs">
                    {isTracking ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Last update: {new Date(location.timestamp).toLocaleTimeString()}
                </div>
                {safetyStatus && (
                  <Alert
                    className={`py-2 ${safetyStatus.zone === "green" ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}`}
                  >
                    <AlertDescription className="text-xs">{safetyStatus.message}</AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">Location not available</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Emergency Contacts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Total Contacts</span>
                <Badge variant={contactsCount >= 2 ? "default" : "secondary"} className="text-xs">
                  {contactsCount}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {contactsCount === 0 && "Add emergency contacts"}
                {contactsCount === 1 && "Consider adding more contacts"}
                {contactsCount >= 2 && "Well prepared for emergencies"}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>System Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">All Systems</span>
                <Badge variant="default" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Operational
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">SafeVoyage prototype monitoring active</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentAlerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent emergency alerts</p>
              <p className="text-xs">Your safety activity will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div
                    className={`rounded-full p-1 ${
                      alert.status === "active"
                        ? "bg-red-100"
                        : alert.status === "resolved"
                          ? "bg-green-100"
                          : "bg-gray-100"
                    }`}
                  >
                    <AlertTriangle
                      className={`h-3 w-3 ${
                        alert.status === "active"
                          ? "text-red-600"
                          : alert.status === "resolved"
                            ? "text-green-600"
                            : "text-gray-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">SOS Alert</p>
                      <Badge
                        variant={
                          alert.status === "active"
                            ? "destructive"
                            : alert.status === "resolved"
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {alert.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{new Date(alert.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
