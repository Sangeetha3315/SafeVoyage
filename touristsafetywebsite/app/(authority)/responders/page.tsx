import { DemoRoute } from "@/components/auth/demo-route"
import { PhasePlaceholder } from "@/components/foundation/phase-placeholder"

export default function AuthorityRespondersPage() {
  return <DemoRoute allowedRole="authority"><PhasePlaceholder title="Responder network" description="Demo responder roster for authority coordination." /></DemoRoute>
}
