import { DemoRoute } from "@/components/auth/demo-route"
import { PhasePlaceholder } from "@/components/foundation/phase-placeholder"

export default function AuthorityAlertsPage() {
  return <DemoRoute allowedRole="authority"><PhasePlaceholder title="Live alerts" description="Demo alert stream for authority triage and response coordination." /></DemoRoute>
}
