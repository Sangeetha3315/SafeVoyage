"use client"

export interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: Date
  address?: string
}

export interface LocationState {
  currentLocation: LocationData | null
  isTracking: boolean
  isLocationEnabled: boolean
  error: string | null
}

export type SafetyZone = "green" | "yellow" | "red"

export interface SafetyZoneInfo {
  zone: SafetyZone
  level: string
  message: string
  riskFactors: string[]
  recommendations: string[]
}

export class LocationService {
  private static readonly LOCATION_KEY = "safetour_location_data"
  private static watchId: number | null = null
  private static listeners: ((location: LocationData) => void)[] = []

  private static readonly SAFETY_ZONES = [
    // Red Zones - High Crime Areas
    {
      name: "Downtown Detroit",
      lat: 42.3314,
      lng: -83.0458,
      radius: 15,
      zone: "red" as SafetyZone,
      risks: ["High crime rate", "Frequent theft", "Gang activity", "Drug-related incidents"],
    },
    {
      name: "East St. Louis",
      lat: 38.6247,
      lng: -90.1562,
      radius: 10,
      zone: "red" as SafetyZone,
      risks: ["Violent crime", "Property theft", "Armed robbery", "Poor lighting"],
    },
    {
      name: "Camden, NJ",
      lat: 39.9259,
      lng: -75.1196,
      radius: 12,
      zone: "red" as SafetyZone,
      risks: ["High murder rate", "Drug trafficking", "Carjacking", "Abandoned buildings"],
    },

    // Yellow Zones - Moderate Risk Areas
    {
      name: "Times Square Night",
      lat: 40.758,
      lng: -73.9855,
      radius: 8,
      zone: "yellow" as SafetyZone,
      risks: ["Pickpocketing", "Tourist scams", "Crowded areas", "Overpricing"],
    },
    {
      name: "Las Vegas Strip",
      lat: 36.1147,
      lng: -115.1728,
      radius: 10,
      zone: "yellow" as SafetyZone,
      risks: ["Petty theft", "Gambling-related crime", "Intoxicated individuals", "Tourist targeting"],
    },
    {
      name: "Miami Beach",
      lat: 25.7907,
      lng: -80.13,
      radius: 15,
      zone: "yellow" as SafetyZone,
      risks: ["Beach theft", "Party-related incidents", "Traffic accidents", "Seasonal crime spikes"],
    },

    // Green Zones - Safe Areas
    { name: "Central Park", lat: 40.7829, lng: -73.9654, radius: 20, zone: "green" as SafetyZone, risks: [] },
    { name: "Beverly Hills", lat: 34.0736, lng: -118.4004, radius: 25, zone: "green" as SafetyZone, risks: [] },
    { name: "Zurich Center", lat: 47.3769, lng: 8.5417, radius: 30, zone: "green" as SafetyZone, risks: [] },
    { name: "Tokyo Shibuya", lat: 35.6598, lng: 139.7006, radius: 20, zone: "green" as SafetyZone, risks: [] },
  ]

  static async requestPermission(): Promise<boolean> {
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported by this browser")
    }

    try {
      const permission = await navigator.permissions.query({ name: "geolocation" })
      if (permission.state === "granted") {
        return true
      }

      // Try to get location to trigger permission prompt
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => resolve(true),
          () => resolve(false),
          { timeout: 5000 },
        )
      })
    } catch (error) {
      console.error("Permission request failed:", error)
      return false
    }
  }

  static async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(),
          }

          // Resolve the address through the server route so provider configuration stays server-side.
          try {
            locationData.address = await this.getAddressFromCoords(locationData.latitude, locationData.longitude)
          } catch (error) {
            console.warn("Failed to get address:", error)
          }

          this.saveLocation(locationData)
          resolve(locationData)
        },
        (error) => {
          reject(new Error(`Location error: ${error.message}`))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        },
      )
    })
  }

  static startTracking(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"))
        return
      }

      if (this.watchId !== null) {
        // Already tracking
        resolve()
        return
      }

      let retryCount = 0
      const maxRetries = 3

      const startWatch = () => {
        this.watchId = navigator.geolocation.watchPosition(
          async (position) => {
            const locationData: LocationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: new Date(),
            }

            try {
              locationData.address = await this.getAddressFromCoords(locationData.latitude, locationData.longitude)
            } catch (error) {
              console.warn("Failed to get address:", error)
            }

            this.saveLocation(locationData)
            this.notifyListeners(locationData)
            retryCount = 0 // Reset retry count on successful position
          },
          (error) => {
            console.error("Location tracking error:", error)

            let shouldRetry = false
            let errorMessage = "Location tracking failed: "

            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage += "Location access denied. Please enable location permissions."
                break
              case error.POSITION_UNAVAILABLE:
                errorMessage += "Position information unavailable. Check GPS signal."
                shouldRetry = retryCount < maxRetries
                break
              case error.TIMEOUT:
                errorMessage += "Location request timed out."
                shouldRetry = retryCount < maxRetries
                break
              default:
                errorMessage += "Unknown error occurred."
                shouldRetry = retryCount < maxRetries
                break
            }

            if (shouldRetry) {
              retryCount++
              console.log(`Retrying location tracking (${retryCount}/${maxRetries})...`)
              this.stopTracking()
              setTimeout(() => {
                startWatch()
              }, 2000 * retryCount) // Exponential backoff
            } else {
              this.stopTracking()
              reject(new Error(errorMessage))
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 15000, // Increased timeout for better reliability
            maximumAge: 30000,
          },
        )
      }

      startWatch()
      resolve()
    })
  }

  static stopTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
    }
  }

  static isTracking(): boolean {
    return this.watchId !== null
  }

  static addLocationListener(callback: (location: LocationData) => void): void {
    this.listeners.push(callback)
  }

  static removeLocationListener(callback: (location: LocationData) => void): void {
    this.listeners = this.listeners.filter((listener) => listener !== callback)
  }

  private static notifyListeners(location: LocationData): void {
    this.listeners.forEach((listener) => listener(location))
  }

  private static saveLocation(location: LocationData): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.LOCATION_KEY, JSON.stringify(location))
  }

  static getLastKnownLocation(): LocationData | null {
    if (typeof window === "undefined") return null
    const location = localStorage.getItem(this.LOCATION_KEY)
    return location ? JSON.parse(location) : null
  }

  static async getAddressFromCoords(lat: number, lng: number): Promise<string> {
    const response = await fetch(`/api/location/reverse-geocode?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`)
    if (!response.ok) throw new Error("Reverse geocoding failed")
    const data = (await response.json()) as { address?: string }
    return data.address || `${lat.toFixed(5)}, ${lng.toFixed(5)}`
  }

  static checkSafeZone(location: LocationData): SafetyZoneInfo {
    // Check against predefined safety zones
    for (const zone of this.SAFETY_ZONES) {
      const distance = this.calculateDistance(location.latitude, location.longitude, zone.lat, zone.lng)

      if (distance <= zone.radius) {
        return this.getSafetyZoneInfo(zone.zone, zone.name, zone.risks)
      }
    }

    // Default to green zone if no specific zone found
    return this.getSafetyZoneInfo("green", "Unknown Area", [])
  }

  private static getSafetyZoneInfo(zone: SafetyZone, areaName: string, risks: string[]): SafetyZoneInfo {
    switch (zone) {
      case "red":
        return {
          zone: "red",
          level: "High Risk",
          message: `⚠️ HIGH RISK AREA: ${areaName}. Exercise extreme caution and consider avoiding this area.`,
          riskFactors: risks.length > 0 ? risks : ["High crime rate", "Frequent theft", "Safety concerns"],
          recommendations: [
            "Avoid walking alone, especially at night",
            "Keep valuables hidden and secure",
            "Stay in well-lit, populated areas",
            "Have emergency contacts ready",
            "Consider alternative routes",
          ],
        }
      case "yellow":
        return {
          zone: "yellow",
          level: "Moderate Risk",
          message: `⚡ MODERATE RISK: ${areaName}. Stay alert and take standard precautions.`,
          riskFactors: risks.length > 0 ? risks : ["Moderate crime levels", "Tourist targeting", "Crowded areas"],
          recommendations: [
            "Stay aware of your surroundings",
            "Keep belongings secure",
            "Avoid displaying expensive items",
            "Travel in groups when possible",
            "Know emergency contact numbers",
          ],
        }
      case "green":
        return {
          zone: "green",
          level: "Safe Zone",
          message: `✅ SAFE AREA: ${areaName}. Low crime rate and generally safe for tourists.`,
          riskFactors: [],
          recommendations: [
            "Maintain general awareness",
            "Follow standard travel precautions",
            "Enjoy your visit responsibly",
          ],
        }
    }
  }

  static async setManualLocation(latitude: number, longitude: number): Promise<LocationData> {
    const locationData: LocationData = {
      latitude,
      longitude,
      accuracy: 0, // Manual selection has perfect accuracy
      timestamp: new Date(),
    }

    try {
      locationData.address = await this.getAddressFromCoords(latitude, longitude)
    } catch (error) {
      console.warn("Failed to get address:", error)
    }

    this.saveLocation(locationData)
    this.notifyListeners(locationData)
    return locationData
  }

  static async searchLocation(query: string): Promise<{ name: string; lat: number; lng: number }[]> {
    // Simple location search - in production, use proper geocoding service
    const commonLocations = [
      { name: "Times Square, New York", lat: 40.758, lng: -73.9855 },
      { name: "Central Park, New York", lat: 40.7829, lng: -73.9654 },
      { name: "Las Vegas Strip", lat: 36.1147, lng: -115.1728 },
      { name: "Miami Beach", lat: 25.7907, lng: -80.13 },
      { name: "Beverly Hills", lat: 34.0736, lng: -118.4004 },
      { name: "Downtown Detroit", lat: 42.3314, lng: -83.0458 },
      { name: "Camden, New Jersey", lat: 39.9259, lng: -75.1196 },
      { name: "Zurich Center", lat: 47.3769, lng: 8.5417 },
      { name: "Tokyo Shibuya", lat: 35.6598, lng: 139.7006 },
    ]

    return commonLocations.filter((location) => location.name.toLowerCase().includes(query.toLowerCase()))
  }

  private static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }
}
