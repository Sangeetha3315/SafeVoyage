"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Users, Plus, Edit, Trash2, Phone, Mail, Star, AlertTriangle } from "lucide-react"
import { EmergencyService, type EmergencyContact } from "@/lib/emergency"
import { CallInterface } from "@/components/call/call-interface"

export function EmergencyContacts() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null)
  const [showCallInterface, setShowCallInterface] = useState(false)
  const [callDetails, setCallDetails] = useState<{
    phoneNumber: string
    contactName?: string
    contactType: "emergency" | "personal"
  } | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    relationship: "",
    isPrimary: false,
  })

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = () => {
    const loadedContacts = EmergencyService.getEmergencyContacts()
    setContacts(loadedContacts)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      relationship: "",
      isPrimary: false,
    })
    setEditingContact(null)
  }

  const handleAddContact = () => {
    if (!formData.name || !formData.phone || !formData.relationship) {
      alert("Please fill in all required fields")
      return
    }

    try {
      EmergencyService.addEmergencyContact(formData)
      loadContacts()
      setShowAddDialog(false)
      resetForm()
    } catch (error) {
      console.error("Failed to add contact:", error)
      alert("Failed to add contact. Please try again.")
    }
  }

  const handleEditContact = (contact: EmergencyContact) => {
    setEditingContact(contact)
    setFormData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email || "",
      relationship: contact.relationship,
      isPrimary: contact.isPrimary,
    })
    setShowAddDialog(true)
  }

  const handleUpdateContact = () => {
    if (!editingContact || !formData.name || !formData.phone || !formData.relationship) {
      alert("Please fill in all required fields")
      return
    }

    try {
      EmergencyService.updateEmergencyContact(editingContact.id, formData)
      loadContacts()
      setShowAddDialog(false)
      resetForm()
    } catch (error) {
      console.error("Failed to update contact:", error)
      alert("Failed to update contact. Please try again.")
    }
  }

  const handleDeleteContact = (contactId: string) => {
    if (confirm("Are you sure you want to delete this emergency contact?")) {
      try {
        EmergencyService.removeEmergencyContact(contactId)
        loadContacts()
      } catch (error) {
        console.error("Failed to delete contact:", error)
        alert("Failed to delete contact. Please try again.")
      }
    }
  }

  const handleSetPrimary = (contactId: string) => {
    try {
      EmergencyService.updateEmergencyContact(contactId, { isPrimary: true })
      loadContacts()
    } catch (error) {
      console.error("Failed to set primary contact:", error)
      alert("Failed to set primary contact. Please try again.")
    }
  }

  const handleCallContact = (contact: EmergencyContact) => {
    setCallDetails({
      phoneNumber: contact.phone,
      contactName: contact.name,
      contactType: "personal",
    })
    setShowCallInterface(true)
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
      />
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Emergency Contacts</span>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingContact ? "Edit Emergency Contact" : "Add Emergency Contact"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="relationship">Relationship *</Label>
                    <Select
                      value={formData.relationship}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, relationship: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="colleague">Colleague</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="primary"
                      checked={formData.isPrimary}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPrimary: checked }))}
                    />
                    <Label htmlFor="primary">Set as primary contact</Label>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAddDialog(false)
                        resetForm()
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button onClick={editingContact ? handleUpdateContact : handleAddContact} className="flex-1">
                      {editingContact ? "Update Contact" : "Add Contact"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>Manage your emergency contacts for SOS alerts and safety notifications</CardDescription>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No emergency contacts added yet. Add at least one contact to enable SOS features.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {contacts.map((contact) => (
                <Card key={contact.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{contact.name}</h3>
                          {contact.isPrimary && (
                            <Badge variant="default" className="text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Primary
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {contact.relationship}
                          </Badge>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{contact.phone}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCallContact(contact)}
                              className="h-6 px-2 text-xs text-green-600 hover:text-green-700"
                            >
                              Call
                            </Button>
                          </div>
                          {contact.email && (
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <span>{contact.email}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {!contact.isPrimary && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSetPrimary(contact.id)}
                            title="Set as primary contact"
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleEditContact(contact)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteContact(contact.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {contacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Contact Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <Star className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Primary Contact</h4>
                <p className="text-sm text-muted-foreground">
                  Your primary contact will be notified first in quick SOS alerts
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Phone className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Phone Numbers</h4>
                <p className="text-sm text-muted-foreground">
                  Include country codes for international contacts (e.g., +1 for US)
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Users className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Recommended Contacts</h4>
                <p className="text-sm text-muted-foreground">
                  Add 2-3 trusted contacts who can respond quickly in emergencies
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
