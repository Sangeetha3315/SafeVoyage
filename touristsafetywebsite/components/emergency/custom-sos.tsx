"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Send, Users, Shield } from "lucide-react"
import { EmergencyService, type EmergencyContact } from "@/lib/emergency"

interface CustomSOSProps {
  userId: string
}

export function CustomSOS({ userId }: CustomSOSProps) {
  const [message, setMessage] = useState("")
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [includeAuthorities, setIncludeAuthorities] = useState({
    police: false,
    ambulance: false,
    fire: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [contacts] = useState<EmergencyContact[]>(EmergencyService.getEmergencyContacts())

  const handleContactToggle = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId],
    )
  }

  const handleAuthorityToggle = (authority: keyof typeof includeAuthorities) => {
    setIncludeAuthorities((prev) => ({
      ...prev,
      [authority]: !prev[authority],
    }))
  }

  const handleSendCustomSOS = async () => {
    if (selectedContacts.length === 0 && !Object.values(includeAuthorities).some(Boolean)) {
      alert("Please select at least one contact or emergency service")
      return
    }

    setIsLoading(true)

    try {
      await EmergencyService.sendSOSAlert(
        userId,
        message || "Emergency assistance needed. Please help!",
        selectedContacts,
        includeAuthorities,
      )

      alert("Emergency request created locally. Notification integrations are not configured yet.")

      // Reset form
      setMessage("")
      setSelectedContacts([])
      setIncludeAuthorities({ police: false, ambulance: false, fire: false })
    } catch (error) {
      console.error("Failed to send custom SOS:", error)
      alert("Failed to send SOS alert. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Send className="h-5 w-5" />
          <span>Custom Emergency Alert</span>
        </CardTitle>
        <CardDescription>Send a customized emergency message to selected contacts and services</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Custom Message */}
        <div className="space-y-2">
          <Label htmlFor="message">Emergency Message</Label>
          <Textarea
            id="message"
            placeholder="Describe your emergency situation..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
        </div>

        {/* Emergency Contacts */}
        <div className="space-y-3">
          <Label className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Emergency Contacts</span>
          </Label>

          {contacts.length === 0 ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>No emergency contacts found. Add contacts first to use this feature.</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-2">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={contact.id}
                    checked={selectedContacts.includes(contact.id)}
                    onCheckedChange={() => handleContactToggle(contact.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={contact.id} className="font-medium">
                        {contact.name}
                      </Label>
                      {contact.isPrimary && (
                        <Badge variant="secondary" className="text-xs">
                          Primary
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {contact.phone} • {contact.relationship}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Emergency Services */}
        <div className="space-y-3">
          <Label className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Emergency Services</span>
          </Label>

          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Checkbox
                id="police"
                checked={includeAuthorities.police}
                onCheckedChange={() => handleAuthorityToggle("police")}
              />
              <Label htmlFor="police" className="flex-1">
                <div className="font-medium">Police</div>
                <div className="text-sm text-muted-foreground">For crimes, violence, or immediate danger</div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Checkbox
                id="ambulance"
                checked={includeAuthorities.ambulance}
                onCheckedChange={() => handleAuthorityToggle("ambulance")}
              />
              <Label htmlFor="ambulance" className="flex-1">
                <div className="font-medium">Ambulance</div>
                <div className="text-sm text-muted-foreground">For medical emergencies or injuries</div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Checkbox
                id="fire"
                checked={includeAuthorities.fire}
                onCheckedChange={() => handleAuthorityToggle("fire")}
              />
              <Label htmlFor="fire" className="flex-1">
                <div className="font-medium">Fire Department</div>
                <div className="text-sm text-muted-foreground">For fires, gas leaks, or rescue operations</div>
              </Label>
            </div>
          </div>
        </div>

        <Button
          onClick={handleSendCustomSOS}
          disabled={isLoading}
          className="w-full bg-orange-600 hover:bg-orange-700"
          size="lg"
        >
          {isLoading ? (
            "Sending Alert..."
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send Custom Emergency Alert
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
