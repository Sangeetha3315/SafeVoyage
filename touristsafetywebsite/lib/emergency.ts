"use client"

import { LocationService, type LocationData } from "./location"
import { BlockchainService } from "./blockchain"

export interface EmergencyContact {
  id: string
  name: string
  phone: string
  email?: string
  relationship: string
  isPrimary: boolean
}

export interface SOSAlert {
  id: string
  userId: string
  timestamp: Date
  location: LocationData | null
  message: string
  status: "active" | "resolved" | "cancelled"
  contacts: string[] // Contact IDs
  includePolice: boolean
  includeAmbulance: boolean
  includeFire: boolean
  blockchainId?: string // Added blockchain ID field
}

export class EmergencyService {
  private static readonly CONTACTS_KEY = "safetour_emergency_contacts"
  private static readonly ALERTS_KEY = "safetour_sos_alerts"

  // Emergency Contacts Management
  static getEmergencyContacts(): EmergencyContact[] {
    if (typeof window === "undefined") return []
    const contacts = localStorage.getItem(this.CONTACTS_KEY)
    return contacts ? JSON.parse(contacts) : []
  }

  static saveEmergencyContacts(contacts: EmergencyContact[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.CONTACTS_KEY, JSON.stringify(contacts))
  }

  static addEmergencyContact(contact: Omit<EmergencyContact, "id">): EmergencyContact {
    const contacts = this.getEmergencyContacts()
    const newContact: EmergencyContact = {
      ...contact,
      id: Date.now().toString(),
    }

    // If this is set as primary, remove primary from others
    if (newContact.isPrimary) {
      contacts.forEach((c) => (c.isPrimary = false))
    }

    contacts.push(newContact)
    this.saveEmergencyContacts(contacts)
    return newContact
  }

  static updateEmergencyContact(id: string, updates: Partial<EmergencyContact>): boolean {
    const contacts = this.getEmergencyContacts()
    const index = contacts.findIndex((c) => c.id === id)

    if (index === -1) return false

    // If setting as primary, remove primary from others
    if (updates.isPrimary) {
      contacts.forEach((c) => (c.isPrimary = false))
    }

    contacts[index] = { ...contacts[index], ...updates }
    this.saveEmergencyContacts(contacts)
    return true
  }

  static removeEmergencyContact(id: string): boolean {
    const contacts = this.getEmergencyContacts()
    const filteredContacts = contacts.filter((c) => c.id !== id)

    if (filteredContacts.length === contacts.length) return false

    this.saveEmergencyContacts(filteredContacts)
    return true
  }

  // SOS Alert System
  static async sendSOSAlert(
    userId: string,
    message: string,
    contactIds: string[],
    includeAuthorities: {
      police: boolean
      ambulance: boolean
      fire: boolean
    },
  ): Promise<SOSAlert> {
    // Get current location
    let location: LocationData | null = null
    try {
      location = await LocationService.getCurrentLocation()
    } catch (error) {
      console.warn("Could not get location for SOS:", error)
      // Use last known location if available
      location = LocationService.getLastKnownLocation()
    }

    const alert: SOSAlert = {
      id: Date.now().toString(),
      userId,
      timestamp: new Date(),
      location,
      message,
      status: "active",
      contacts: contactIds,
      includePolice: includeAuthorities.police,
      includeAmbulance: includeAuthorities.ambulance,
      includeFire: includeAuthorities.fire,
    }

    if (location) {
      const blockchainRecord = BlockchainService.createSOSRecord(
        userId,
        alert.id,
        {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address,
        },
        message,
      )
      alert.blockchainId = blockchainRecord.id

      console.log("[v0] Blockchain record created:", blockchainRecord.id)
      console.log("[v0] Blockchain hash:", blockchainRecord.hash)
    }

    // Save alert
    const alerts = this.getSOSAlerts()
    alerts.push(alert)
    this.saveSOSAlerts(alerts)

    await this.sendNotifications(alert)

    return alert
  }

  private static async sendNotifications(alert: SOSAlert): Promise<void> {
    const contacts = this.getEmergencyContacts()
    const selectedContacts = contacts.filter((c) => alert.contacts.includes(c.id))

    console.info("SafeVoyage prototype emergency request created", {
      alertId: alert.id,
      contactCount: selectedContacts.length,
      hasLocation: Boolean(alert.location),
      requestedServices: {
        police: alert.includePolice,
        ambulance: alert.includeAmbulance,
        fire: alert.includeFire,
      },
    })
  }

  static getSOSAlerts(): SOSAlert[] {
    if (typeof window === "undefined") return []
    const alerts = localStorage.getItem(this.ALERTS_KEY)
    return alerts ? JSON.parse(alerts) : []
  }

  private static saveSOSAlerts(alerts: SOSAlert[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.ALERTS_KEY, JSON.stringify(alerts))
  }

  static updateAlertStatus(alertId: string, status: SOSAlert["status"]): boolean {
    const alerts = this.getSOSAlerts()
    const index = alerts.findIndex((a) => a.id === alertId)

    if (index === -1) return false

    alerts[index].status = status
    this.saveSOSAlerts(alerts)
    return true
  }

  static getActiveAlerts(): SOSAlert[] {
    return this.getSOSAlerts().filter((alert) => alert.status === "active")
  }

  // Quick SOS for immediate danger
  static async sendQuickSOS(userId: string): Promise<SOSAlert> {
    const contacts = this.getEmergencyContacts()
    const primaryContact = contacts.find((c) => c.isPrimary)
    const contactIds = primaryContact ? [primaryContact.id] : contacts.slice(0, 2).map((c) => c.id)

    return this.sendSOSAlert(userId, "EMERGENCY: I need immediate help! This is an automated SOS alert.", contactIds, {
      police: true,
      ambulance: true,
      fire: false,
    })
  }

  // Get emergency service numbers based on location
  static getLocalEmergencyNumbers(location?: LocationData): {
    police: string
    ambulance: string
    fire: string
    general: string
  } {
    // In a real app, this would use the location to determine local emergency numbers
    // For now, return common international numbers
    return {
      police: "911", // or 112, 999, etc. based on location
      ambulance: "911",
      fire: "911",
      general: "911",
    }
  }

  // Edit blockchain record for SOS alert
  static editSOSBlockchainRecord(
    alertId: string,
    editedBy: string,
    changes: string,
    newLocation?: { latitude: number; longitude: number; address?: string },
  ): boolean {
    const alerts = this.getSOSAlerts()
    const alert = alerts.find((a) => a.id === alertId)

    if (!alert || !alert.blockchainId) return false

    return BlockchainService.editRecord(
      alert.blockchainId,
      editedBy,
      changes,
      newLocation ? { location: newLocation } : {},
    )
  }

  static getSOSBlockchainRecord(alertId: string) {
    return BlockchainService.getRecordByAlert(alertId)
  }
}
