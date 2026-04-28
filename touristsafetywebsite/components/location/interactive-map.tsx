"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Navigation, Crosshair, Satellite, Clock, Compass, Map, Loader2, ExternalLink } from "lucide-react"

interface InteractiveMapProps {
  onLocationSelect: (lat: number, lng: number) => void
  currentLocation?: { lat: number; lng: number }
  safetyZone?: string
}

export function InteractiveMap({ onLocationSelect, currentLocation, safetyZone }: InteractiveMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [locationDetails, setLocationDetails] = useState<{
    accuracy: number
    altitude: number | null
    heading: number | null
    speed: number | null
    timestamp: number
  } | null>(null)
  const [watchId, setWatchId] = useState<number | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  const generateMapUrl = (lat: number, lng: number) => {
    return `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dkmvnRAoKlNOWo&center=${lat},${lng}&zoom=18&maptype=satellite`
  }

  const generateDirectionsUrl = (lat: number, lng: number) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
  }

  const handleGetGPSLocation = () => {
    if (navigator.geolocation) {
      setIsGettingLocation(true)
      setMapError(null)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setSelectedLocation(location)
          onLocationSelect(location.lat, location.lng)
          setLocationDetails({
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp,
          })
          setIsGettingLocation(false)
          setMapLoaded(true)
        },
        (error) => {
          console.error("GPS location error:", error)
          let errorMessage = "Unable to get GPS location. "
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "Please allow location access in your browser settings."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable. Check your GPS signal."
              break
            case error.TIMEOUT:
              errorMessage += "Location request timed out. Try again."
              break
            default:
              errorMessage += "An unknown error occurred."
              break
          }
          setMapError(errorMessage)
          setIsGettingLocation(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        },
      )
    } else {
      setMapError("Geolocation is not supported by this browser.")
    }
  }

  const startTracking = () => {
    if (navigator.geolocation) {
      setIsTracking(true)
      setMapError(null)
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setSelectedLocation(location)
          onLocationSelect(location.lat, location.lng)
          setLocationDetails({
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp,
          })
          setMapLoaded(true)
        },
        (error) => {
          console.error("GPS tracking error:", error)
          setMapError("GPS tracking failed. Please check your location settings.")
          setIsTracking(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 1000,
        },
      )
      setWatchId(id)
    }
  }

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
      setIsTracking(false)
    }
  }

  useEffect(() => {
    if (currentLocation && !selectedLocation) {
      setSelectedLocation(currentLocation)
      setMapLoaded(true)
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [watchId, currentLocation, selectedLocation])

  const formatCoordinate = (coord: number, type: "lat" | "lng") => {
    const direction = type === "lat" ? (coord >= 0 ? "N" : "S") : coord >= 0 ? "E" : "W"
    return `${Math.abs(coord).toFixed(6)}° ${direction}`
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Map className="h-5 w-5 text-blue-600" />
            <span>Interactive GPS Map</span>
          </span>
          {safetyZone && (
            <Badge
              className={`${
                safetyZone === "red" ? "bg-red-500" : safetyZone === "yellow" ? "bg-yellow-500" : "bg-green-500"
              } text-white`}
            >
              {safetyZone.toUpperCase()} ZONE
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 mb-4 flex-wrap">
          <Button
            onClick={handleGetGPSLocation}
            variant="default"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isGettingLocation || isTracking}
          >
            {isGettingLocation ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Navigation className="h-4 w-4 mr-2" />
            )}
            {isGettingLocation ? "Getting Location..." : "Get Current Location"}
          </Button>
          {!isTracking ? (
            <Button
              onClick={startTracking}
              variant="outline"
              size="sm"
              className="border-green-600 text-green-600 bg-transparent"
            >
              <Crosshair className="h-4 w-4 mr-2" />
              Start Live Tracking
            </Button>
          ) : (
            <Button onClick={stopTracking} variant="destructive" size="sm">
              <Crosshair className="h-4 w-4 mr-2" />
              Stop Tracking
            </Button>
          )}
          {selectedLocation && (
            <Button
              onClick={() => window.open(generateDirectionsUrl(selectedLocation.lat, selectedLocation.lng), "_blank")}
              variant="outline"
              size="sm"
              className="border-purple-600 text-purple-600"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in Google Maps
            </Button>
          )}
        </div>

        {mapError && (
          <Alert variant="destructive">
            <Satellite className="h-4 w-4" />
            <AlertDescription>{mapError}</AlertDescription>
          </Alert>
        )}

        {selectedLocation && mapLoaded && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3">
                <h3 className="font-semibold flex items-center">
                  <Map className="h-4 w-4 mr-2" />
                  Live Location Map View
                  {isTracking && (
                    <div className="flex items-center ml-auto space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm">Live</span>
                    </div>
                  )}
                </h3>
              </div>
              <div className="relative">
                <iframe
                  ref={mapRef}
                  src={generateMapUrl(selectedLocation.lat, selectedLocation.lng)}
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                  title="Interactive Location Map"
                />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        safetyZone === "red" ? "bg-red-500" : safetyZone === "yellow" ? "bg-yellow-500" : "bg-green-500"
                      }`}
                    ></div>
                    <span className="text-xs font-medium">Your Location</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                  Precise Coordinates
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-white rounded p-2 font-mono">
                    <div>Lat: {formatCoordinate(selectedLocation.lat, "lat")}</div>
                    <div>Lng: {formatCoordinate(selectedLocation.lng, "lng")}</div>
                  </div>
                  <div className="text-xs text-gray-600">
                    Decimal: {selectedLocation.lat.toFixed(8)}, {selectedLocation.lng.toFixed(8)}
                  </div>
                </div>
              </div>

              {locationDetails && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                    <Satellite className="h-4 w-4 mr-2 text-green-600" />
                    GPS System Data
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Accuracy:</span>
                      <span className="font-mono">±{locationDetails.accuracy.toFixed(1)}m</span>
                    </div>
                    {locationDetails.altitude && (
                      <div className="flex justify-between">
                        <span>Altitude:</span>
                        <span className="font-mono">{locationDetails.altitude.toFixed(1)}m</span>
                      </div>
                    )}
                    {locationDetails.speed !== null && (
                      <div className="flex justify-between">
                        <span>Speed:</span>
                        <span className="font-mono">{(locationDetails.speed * 3.6).toFixed(1)} km/h</span>
                      </div>
                    )}
                    {locationDetails.heading !== null && (
                      <div className="flex justify-between items-center">
                        <span>Heading:</span>
                        <span className="flex items-center font-mono">
                          <Compass className="h-3 w-3 mr-1" />
                          {locationDetails.heading.toFixed(0)}°
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {locationDetails && (
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-200">
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-orange-600" />
                  Location Timestamp & Status
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Last Updated:</span>
                    <div className="font-mono text-gray-800">{formatTimestamp(locationDetails.timestamp)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Tracking Status:</span>
                    <div className={`font-medium ${isTracking ? "text-green-600" : "text-gray-600"}`}>
                      {isTracking ? "Live Tracking Active" : "Single Location Fix"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!selectedLocation && (
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
            <Satellite className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Location Data</h3>
            <p className="text-gray-500 mb-4">
              Click "Get Current Location" to trace your exact GPS position and view it on the interactive map
            </p>
            <div className="text-xs text-gray-400 space-y-1">
              <p>• High-precision GPS tracking with satellite view</p>
              <p>• Real-time location updates and mapping</p>
              <p>• Detailed coordinate and system information</p>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1 bg-gray-50 rounded p-3 border">
          <p className="font-medium text-gray-700 mb-2">GPS System Features:</p>
          <p>
            • <strong>Interactive Map:</strong> Google Maps integration with satellite and street view
          </p>
          <p>
            • <strong>High Accuracy:</strong> Uses GPS, WiFi, and cellular data for precise positioning
          </p>
          <p>
            • <strong>Live Tracking:</strong> Continuously updates your location in real-time on the map
          </p>
          <p>
            • <strong>Detailed Info:</strong> Shows accuracy, altitude, speed, and heading when available
          </p>
          <p>
            • <strong>Privacy:</strong> Location data stays secure and is not stored externally
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
