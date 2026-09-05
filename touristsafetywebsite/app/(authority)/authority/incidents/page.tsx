import { DemoRoute } from "@/components/auth/demo-route"
import { AuthorityIncidents } from "@/components/incidents/authority-incidents"

export default function AuthorityIncidentsPage() {
  return <DemoRoute allowedRole="authority"><AuthorityIncidents /></DemoRoute>
}
