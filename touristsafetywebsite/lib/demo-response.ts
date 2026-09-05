"use client"

import { LocationService, type LocationData } from "@/lib/location"

export type DemoSosStatus = "ACTIVE" | "ACKNOWLEDGED" | "RESPONDER_ASSIGNED" | "RESOLVED"
export type DemoSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
export type DemoIncidentStatus = "REPORTED" | "REVIEWING" | "RESOLVED"

export interface DemoSosAlert {
  id: string
  touristId: string
  touristName: string
  timestamp: string
  location: LocationData
  severity: DemoSeverity
  status: DemoSosStatus
  responderId?: string
  responderName?: string
}

export interface DemoResponder {
  id: string
  name: string
  role: string
  status: "Available" | "On response"
  eta: string
}

export interface DemoIncident {
  id: string
  touristId: string
  touristName: string
  category: string
  title: string
  description: string
  location: string
  severity: DemoSeverity
  timestamp: string
  status: DemoIncidentStatus
}

const DEMO_SOS_KEY = "safevoyage_demo_sos_alerts"
const DEMO_INCIDENTS_KEY = "safevoyage_demo_incidents"
const DEMO_RESPONDERS_KEY = "safevoyage_demo_responders"

export const DEMO_RESPONDERS: DemoResponder[] = [
  { id: "responder-morgan", name: "Jordan Morgan", role: "Field responder", status: "Available", eta: "6 min" },
  { id: "responder-rivera", name: "Alex Rivera", role: "Safety coordinator", status: "Available", eta: "10 min" },
  { id: "responder-patel", name: "Samir Patel", role: "Mobile support lead", status: "Available", eta: "14 min" },
]

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return []
  const raw = window.localStorage.getItem(key)
  return raw ? (JSON.parse(raw) as T[]) : []
}

function write<T>(key: string, value: T[]): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new StorageEvent("storage", { key, newValue: JSON.stringify(value) }))
}

function getResponders(): DemoResponder[] {
  const saved = read<DemoResponder>(DEMO_RESPONDERS_KEY)
  return saved.length > 0 ? saved : DEMO_RESPONDERS.map((responder) => ({ ...responder }))
}

function createDemoLocation(): LocationData {
  return (
    LocationService.getLastKnownLocation() ?? {
      latitude: 40.7829,
      longitude: -73.9654,
      accuracy: 25,
      timestamp: new Date(),
      address: "Central Park, New York",
    }
  )
}

export const DemoResponseService = {
  getResponders,

  getSosAlerts(): DemoSosAlert[] {
    return read<DemoSosAlert>(DEMO_SOS_KEY)
  },

  createSosAlert(touristId: string, touristName: string): DemoSosAlert {
    const alert: DemoSosAlert = {
      id: `sos-${Date.now()}`,
      touristId,
      touristName,
      timestamp: new Date().toISOString(),
      location: createDemoLocation(),
      severity: "CRITICAL",
      status: "ACTIVE",
    }
    write(DEMO_SOS_KEY, [alert, ...this.getSosAlerts()])
    return alert
  },

  updateSosStatus(id: string, status: DemoSosStatus): DemoSosAlert | null {
    const alerts = this.getSosAlerts()
    const alert = alerts.find((item) => item.id === id)
    if (!alert) return null
    alert.status = status
    if (status === "RESOLVED" && alert.responderId) {
      const responders = getResponders().map((responder) =>
        responder.id === alert.responderId ? { ...responder, status: "Available" as const } : responder,
      )
      write(DEMO_RESPONDERS_KEY, responders)
    }
    write(DEMO_SOS_KEY, alerts)
    return alert
  },

  assignResponder(id: string, responder: DemoResponder): DemoSosAlert | null {
    const alerts = this.getSosAlerts()
    const alert = alerts.find((item) => item.id === id)
    if (!alert) return null
    alert.responderId = responder.id
    alert.responderName = responder.name
    alert.status = "RESPONDER_ASSIGNED"
    const responders = getResponders().map((item) =>
      item.id === responder.id ? { ...item, status: "On response" as const } : item,
    )
    write(DEMO_RESPONDERS_KEY, responders)
    write(DEMO_SOS_KEY, alerts)
    return alert
  },

  getIncidents(): DemoIncident[] {
    return read<DemoIncident>(DEMO_INCIDENTS_KEY)
  },

  createIncident(input: Omit<DemoIncident, "id" | "timestamp" | "status"> & { timestamp?: string }): DemoIncident {
    const incident: DemoIncident = {
      ...input,
      id: `incident-${Date.now()}`,
      timestamp: input.timestamp || new Date().toISOString(),
      status: "REPORTED",
    }
    write(DEMO_INCIDENTS_KEY, [incident, ...this.getIncidents()])
    return incident
  },

  updateIncidentStatus(id: string, status: DemoIncidentStatus): DemoIncident | null {
    const incidents = this.getIncidents()
    const incident = incidents.find((item) => item.id === id)
    if (!incident) return null
    incident.status = status
    write(DEMO_INCIDENTS_KEY, incidents)
    return incident
  },
}
