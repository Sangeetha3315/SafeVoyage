import { DemoRoute } from "@/components/auth/demo-route"
import { DemoIncidentForm } from "@/components/incidents/demo-incident-form"

export default function TouristIncidentsPage() {
  return <DemoRoute allowedRole="tourist"><DemoIncidentForm /></DemoRoute>
}
