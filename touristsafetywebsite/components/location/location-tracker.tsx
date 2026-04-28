"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import {
  MapPin,
  Navigation,
  Shield,
  AlertTriangle,
  Clock,
  Loader2,
  Search,
  MapPinIcon,
  Map,
  Satellite,
  Crosshair,
  Compass,
  Target,
} from "lucide-react"
import { LocationService, type LocationData, type SafetyZoneInfo } from "@/lib/location"
import { InteractiveMap } from "./interactive-map"

export function LocationTracker() {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [safetyZone, setSafetyZone] = useState<SafetyZoneInfo | null>(null)
  const [showManualSelection, setShowManualSelection] = useState(false)
  const [showInteractiveMap, setShowInteractiveMap] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<{ name: string; lat: number; lng: number }[]>([])
  const [manualLat, setManualLat] = useState("")
  const [manualLng, setManualLng] = useState("")
  const [gpsDetails, setGpsDetails] = useState<{
    accuracy: number
    altitude: number | null
    heading: number | null
    speed: number | null
    timestamp: number
  } | null>(null)

  useEffect(() => {
    // Load last known location
    const lastLocation = LocationService.getLastKnownLocation()
    if (lastLocation) {
      setLocation(lastLocation)
      setSafetyZone(LocationService.checkSafeZone(lastLocation))
    }

    // Set up location listener
    const handleLocationUpdate = (newLocation: LocationData) => {
      setLocation(newLocation)
      setSafetyZone(LocationService.checkSafeZone(newLocation))
    }

    LocationService.addLocationListener(handleLocationUpdate)

    // Check if already tracking
    setIsTracking(LocationService.isTracking())

    return () => {
      LocationService.removeLocationListener(handleLocationUpdate)
    }
  }, [])

  const handleGetCurrentLocation = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const hasPermission = await LocationService.requestPermission()
      if (!hasPermission) {
        throw new Error("Location permission denied. Please enable location access in your browser settings.")
      }

      // Get high-accuracy GPS location with detailed information
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const currentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(),
          }

          // Set GPS details
          setGpsDetails({
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp,
          })

          // Get address
          try {
            const address = await LocationService.getAddressFromCoords(
              currentLocation.latitude,
              currentLocation.longitude,
            )
            currentLocation.address = address
          } catch (err) {
            console.warn("Failed to get address:", err)
          }

          setLocation(currentLocation)
          setSafetyZone(LocationService.checkSafeZone(currentLocation))
          setIsLoading(false)
        },
        (err) => {
          let errorMessage = "Unable to get GPS location. "
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage += "Please allow location access in your browser settings."
              break
            case err.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable. Check your GPS signal."
              break
            case err.TIMEOUT:
              errorMessage += "Location request timed out. Try again."
              break
            default:
              errorMessage += "An unknown error occurred."
              break
          }
          setError(errorMessage)
          setIsLoading(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        },
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get location")
      setIsLoading(false)
    }
  }

  const handleStartTracking = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const hasPermission = await LocationService.requestPermission()
      if (!hasPermission) {
        throw new Error("Location permission denied. Please enable location access in your browser settings.")
      }

      await LocationService.startTracking()
      setIsTracking(true)

      console.log("[v0] Location tracking started successfully")
    } catch (err) {
      console.error("[v0] Failed to start tracking:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to start location tracking"

      if (errorMessage.includes("denied")) {
        setError("Location access denied. Please enable location permissions in your browser settings and try again.")
      } else if (errorMessage.includes("unavailable")) {
        setError("GPS signal unavailable. Please ensure you're in an area with good GPS reception and try again.")
      } else if (errorMessage.includes("timeout")) {
        setError("Location request timed out. Please check your GPS signal and try again.")
      } else {
        setError(errorMessage)
      }

      setIsTracking(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStopTracking = () => {
    LocationService.stopTracking()
    setIsTracking(false)
  }

  const handleSearchLocation = async () => {
    if (searchQuery.trim()) {
      const results = await LocationService.searchLocation(searchQuery)
      setSearchResults(results)
    }
  }

  const handleSelectSearchResult = async (result: { name: string; lat: number; lng: number }) => {
    setIsLoading(true)
    try {
      const newLocation = await LocationService.setManualLocation(result.lat, result.lng)
      setLocation(newLocation)
      setSafetyZone(LocationService.checkSafeZone(newLocation))
      setShowManualSelection(false)
      setSearchQuery("")
      setSearchResults([])
    } catch (err) {
      setError("Failed to set manual location")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetManualCoordinates = async () => {
    const lat = Number.parseFloat(manualLat)
    const lng = Number.parseFloat(manualLng)

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError("Please enter valid coordinates (Latitude: -90 to 90, Longitude: -180 to 180)")
      return
    }

    setIsLoading(true)
    try {
      const newLocation = await LocationService.setManualLocation(lat, lng)
      setLocation(newLocation)
      setSafetyZone(LocationService.checkSafeZone(newLocation))
      setShowManualSelection(false)
      setManualLat("")
      setManualLng("")
    } catch (err) {
      setError("Failed to set manual location")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMapLocationSelect = async (lat: number, lng: number) => {
    setIsLoading(true)
    try {
      const newLocation = await LocationService.setManualLocation(lat, lng)
      setLocation(newLocation)
      setSafetyZone(LocationService.checkSafeZone(newLocation))
      setShowInteractiveMap(false)
      setShowManualSelection(false)
    } catch (err) {
      setError("Failed to set location from map")
    } finally {
      setIsLoading(false)
    }
  }

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case "red":
        return "bg-red-500 text-white"
      case "yellow":
        return "bg-yellow-500 text-black"
      case "green":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const formatCoordinate = (coord: number, type: "lat" | "lng") => {
    const direction = type === "lat" ? (coord >= 0 ? "N" : "S") : coord >= 0 ? "E" : "W"
    return `${Math.abs(coord).toFixed(6)}° ${direction}`
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-full">
              <Satellite className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">GPS Location Tracker</h2>
              <p className="text-sm text-gray-600">High-precision location monitoring with system GPS</p>
            </div>
          </div>
          {isTracking && (
            <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Live Tracking</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Button
            onClick={handleGetCurrentLocation}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Target className="h-4 w-4 mr-2" />}
            Get GPS Location
          </Button>

          <Button
            onClick={() => setShowInteractiveMap(!showInteractiveMap)}
            variant="outline"
            size="sm"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <Map className="h-4 w-4 mr-2" />
            Interactive Map
          </Button>

          <Button
            onClick={() => setShowManualSelection(!showManualSelection)}
            variant="outline"
            size="sm"
            className="border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            <MapPinIcon className="h-4 w-4 mr-2" />
            Manual Select
          </Button>

          {isTracking ? (
            <Button onClick={handleStopTracking} variant="destructive" size="sm">
              <Crosshair className="h-4 w-4 mr-2" />
              Stop Tracking
            </Button>
          ) : (
            <Button
              onClick={handleStartTracking}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
              size="sm"
            >
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Navigation className="h-4 w-4 mr-2" />}
              Start Live Track
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showInteractiveMap && (
        <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50/30">
          <InteractiveMap
            onLocationSelect={handleMapLocationSelect}
            currentLocation={location ? { lat: location.latitude, lng: location.longitude } : undefined}
            safetyZone={safetyZone?.zone}
          />
        </div>
      )}

      {showManualSelection && (
        <Card className="border-dashed border-2 border-purple-300 bg-purple-50/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Search className="h-4 w-4 mr-2" />
              Manual Location Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Search location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearchLocation()}
                size="sm"
              />
              <Button onClick={handleSearchLocation} size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-white text-xs"
                    onClick={() => handleSelectSearchResult(result)}
                  >
                    <MapPin className="h-3 w-3 mr-2" />
                    {result.name}
                  </Button>
                ))}
              </div>
            )}

            <div className="border-t pt-2">
              <p className="text-xs text-muted-foreground mb-2">Or enter coordinates:</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Latitude"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  type="number"
                  step="any"
                  size="sm"
                />
                <Input
                  placeholder="Longitude"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  type="number"
                  step="any"
                  size="sm"
                />
                <Button
                  onClick={handleSetManualCoordinates}
                  disabled={isLoading}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Set
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isTracking && (
        <Alert className="border-green-200 bg-green-50">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Live tracking is active. Your location is being monitored for safety with high-precision GPS.
          </AlertDescription>
        </Alert>
      )}

      {location && safetyZone && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-2 border-blue-200">
            <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-blue-100">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center">
                  <Satellite className="h-5 w-5 mr-2 text-blue-600" />
                  GPS Location & Status
                </span>
                <Badge className={getZoneColor(safetyZone.zone)}>{safetyZone.level}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-semibold mb-2 text-sm flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Coordinates
                  </h4>
                  <div className="space-y-1 text-xs font-mono">
                    <p>Lat: {formatCoordinate(location.latitude, "lat")}</p>
                    <p>Lng: {formatCoordinate(location.longitude, "lng")}</p>
                    <p className="text-gray-500">
                      Decimal: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>

                {gpsDetails && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm flex items-center">
                      <Target className="h-4 w-4 mr-1 text-blue-600" />
                      GPS Precision
                    </h4>
                    <div className="space-y-1 text-xs">
                      <p>Accuracy: ±{gpsDetails.accuracy.toFixed(1)}m</p>
                      {gpsDetails.altitude && <p>Altitude: {gpsDetails.altitude.toFixed(1)}m</p>}
                      {gpsDetails.speed !== null && <p>Speed: {(gpsDetails.speed * 3.6).toFixed(1)} km/h</p>}
                      {gpsDetails.heading !== null && (
                        <p className="flex items-center">
                          <Compass className="h-3 w-3 mr-1" />
                          {gpsDetails.heading.toFixed(0)}°
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="font-semibold mb-2 text-sm">Address & Timestamp</h4>
                <p className="text-xs text-gray-700 mb-2">{location.address || "Address not available"}</p>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 text-gray-500" />
                  <p className="text-xs text-gray-500">Updated: {new Date(location.timestamp).toLocaleString()}</p>
                </div>
              </div>

              <Alert
                variant={
                  safetyZone.zone === "red" ? "destructive" : safetyZone.zone === "yellow" ? "default" : "default"
                }
                className={safetyZone.zone === "green" ? "border-green-200 bg-green-50" : ""}
              >
                <Shield className="h-4 w-4" />
                <AlertDescription className="text-sm">{safetyZone.message}</AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200">
            <CardHeader className="pb-3 bg-gradient-to-r from-orange-50 to-yellow-100">
              <CardTitle className="text-base flex items-center">
                <Shield className="h-5 w-5 mr-2 text-orange-600" />
                Safety Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {safetyZone.riskFactors.length > 0 && (
                <div className="border-red-200 bg-red-50 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-red-800 mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Risk Factors
                  </h4>
                  <ul className="text-xs text-red-700 space-y-1">
                    {safetyZone.riskFactors.slice(0, 4).map((risk, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-500 mr-1">•</span>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border-blue-200 bg-blue-50 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  Safety Recommendations
                </h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  {safetyZone.recommendations.slice(0, 4).map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-1">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 border border-green-200">
                <h4 className="font-semibold mb-2 text-sm flex items-center">
                  <Navigation className="h-4 w-4 mr-1 text-green-600" />
                  Location Sharing
                </h4>
                <p className="text-xs text-gray-600 mb-3">
                  Your precise GPS location is shared with emergency contacts for enhanced safety.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="text-xs bg-white">
                    <MapPin className="h-3 w-3 mr-1" />
                    View on Map
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs bg-white">
                    <Navigation className="h-3 w-3 mr-1" />
                    Share Location
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="border-2 border-gray-200 bg-gray-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <Satellite className="h-5 w-5 mr-2 text-gray-600" />
            GPS System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
            <div className="space-y-2">
              <div className="flex items-center">
                <Target className="h-3 w-3 mr-2 text-green-500" />
                <span>
                  <strong>High Accuracy:</strong> Uses GPS, WiFi, and cellular data
                </span>
              </div>
              <div className="flex items-center">
                <Navigation className="h-3 w-3 mr-2 text-blue-500" />
                <span>
                  <strong>Live Tracking:</strong> Continuous real-time updates
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Shield className="h-3 w-3 mr-2 text-purple-500" />
                <span>
                  <strong>Privacy:</strong> Data stays on your device
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-2 text-orange-500" />
                <span>
                  <strong>Precision:</strong> Accurate to within 3-5 meters
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
