"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Clock, User, Hash, Shield, Copy, CheckCircle, AlertTriangle } from "lucide-react"
import { BlockchainService, type BlockchainRecord } from "@/lib/blockchain"

export function BlockchainTracker() {
  const [searchId, setSearchId] = useState("")
  const [record, setRecord] = useState<BlockchainRecord | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setError("Please enter a blockchain ID")
      return
    }

    setIsLoading(true)
    setError("")
    setRecord(null)

    try {
      // Search for the blockchain record
      const foundRecord = BlockchainService.getRecord(searchId.trim())

      if (foundRecord) {
        setRecord(foundRecord)
      } else {
        setError("Blockchain ID not found. Please check the ID and try again.")
      }
    } catch (err) {
      setError("Error searching for blockchain record. Please try again.")
      console.error("Blockchain search error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const formatLocation = (location: { latitude: number; longitude: number; address?: string }) => {
    const coords = `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
    return location.address ? `${location.address} (${coords})` : coords
  }

  const getTimeSince = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    return "Just now"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Emergency Location Tracker</span>
          </CardTitle>
          <CardDescription>Track live location of emergency alerts using blockchain ID</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="blockchain-id">Blockchain ID</Label>
            <div className="flex space-x-2">
              <Input
                id="blockchain-id"
                placeholder="Enter blockchain ID (e.g., BLK-1K2L3M4N-ABC123)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? "Searching..." : "Track"}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {record && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-700">
              <Shield className="h-5 w-5" />
              <span>Emergency Alert Found</span>
            </CardTitle>
            <CardDescription>Live tracking information for emergency alert</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Alert Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="destructive" className="animate-pulse">
                  ACTIVE EMERGENCY
                </Badge>
                <span className="text-sm text-muted-foreground">{getTimeSince(record.timestamp)}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(record.id)}
                className="flex items-center space-x-1"
              >
                {copied ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "Copied!" : "Copy ID"}</span>
              </Button>
            </div>

            {/* Location Information */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Current Location</span>
              </h4>

              <div className="bg-white p-4 rounded-lg border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Coordinates:</span>
                  <span className="font-mono text-sm">
                    {record.location.latitude.toFixed(6)}, {record.location.longitude.toFixed(6)}
                  </span>
                </div>

                {record.location.address && (
                  <div className="flex items-start justify-between">
                    <span className="font-medium">Address:</span>
                    <span className="text-sm text-right max-w-xs">{record.location.address}</span>
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const url = `https://www.google.com/maps?q=${record.location.latitude},${record.location.longitude}`
                      window.open(url, "_blank")
                    }}
                    className="w-full"
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    View on Google Maps
                  </Button>
                </div>
              </div>
            </div>

            {/* Alert Details */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Alert Details</span>
              </h4>

              <div className="bg-white p-4 rounded-lg border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Alert ID:</span>
                  <span className="font-mono text-sm">{record.alertId}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">User ID:</span>
                  <span className="font-mono text-sm">{record.userId}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Timestamp:</span>
                  <span className="text-sm">{record.timestamp.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Blockchain Verification */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center space-x-2">
                <Hash className="h-4 w-4" />
                <span>Blockchain Verification</span>
              </h4>

              <div className="bg-white p-4 rounded-lg border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Hash:</span>
                  <span className="font-mono text-xs break-all">{record.hash}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Previous Hash:</span>
                  <span className="font-mono text-xs break-all">{record.previousHash}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Nonce:</span>
                  <span className="font-mono text-sm">{record.nonce}</span>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">Blockchain Verified & Immutable</span>
                </div>
              </div>
            </div>

            {/* Edit History */}
            {record.editHistory.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Edit History</span>
                </h4>

                <div className="space-y-2">
                  {record.editHistory.map((edit, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Edited by: {edit.editedBy}</span>
                        <span className="text-muted-foreground">{edit.timestamp.toLocaleString()}</span>
                      </div>
                      <p className="text-sm mt-1">{edit.changes}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Emergency Actions */}
            <div className="pt-4 border-t">
              <div className="flex space-x-3">
                <Button
                  variant="destructive"
                  onClick={() => {
                    const tel = "tel:911"
                    window.location.href = tel
                  }}
                  className="flex-1"
                >
                  <User className="h-4 w-4 mr-2" />
                  Call Emergency Services
                </Button>

                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(formatLocation(record.location))}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Location
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
