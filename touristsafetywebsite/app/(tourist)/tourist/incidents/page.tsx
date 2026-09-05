import { DemoRoute } from "@/components/auth/demo-route"
import { PhasePlaceholder } from "@/components/foundation/phase-placeholder"

export default function TouristIncidentsPage() {
  return <DemoRoute allowedRole="tourist"><PhasePlaceholder title="Report an incident" description="Demo incident reporting workspace for documenting a safety concern." /></DemoRoute>
}
