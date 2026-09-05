import { DemoRoute } from "@/components/auth/demo-route"
import { PhasePlaceholder } from "@/components/foundation/phase-placeholder"

export default function TouristProfilePage() {
  return <DemoRoute allowedRole="tourist"><PhasePlaceholder title="Tourist profile" description="Demo tourist profile workspace." /></DemoRoute>
}
