import { DemoRoute } from "@/components/auth/demo-route"
import { PhasePlaceholder } from "@/components/foundation/phase-placeholder"

export default function AuthorityIncidentsPage() {
  return <DemoRoute allowedRole="authority"><PhasePlaceholder title="Incident coordination" description="Demo incident queue for authority review and assignment." /></DemoRoute>
}
