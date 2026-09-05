import { DemoRoute } from "@/components/auth/demo-route"
import { IncidentWorkspace } from "@/components/incidents/incident-workspace"

export default function TouristIncidentsPage() {
  return <DemoRoute allowedRole="tourist"><IncidentWorkspace /></DemoRoute>
}
