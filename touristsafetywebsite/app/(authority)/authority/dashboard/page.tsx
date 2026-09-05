import { DemoRoute } from "@/components/auth/demo-route"
import { AuthorityDashboardView } from "@/components/auth/demo-views"

export default function AuthorityDashboardPage() {
  return <DemoRoute allowedRole="authority"><AuthorityDashboardView /></DemoRoute>
}
