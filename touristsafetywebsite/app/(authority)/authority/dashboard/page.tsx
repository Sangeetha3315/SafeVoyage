import { DemoRoute } from "@/components/auth/demo-route"
import { AuthorityDashboardView } from "@/components/auth/demo-views"
import { AuthorityWorkspace } from "@/components/authority/authority-workspace"

export default function AuthorityDashboardPage() {
  return <DemoRoute allowedRole="authority"><AuthorityWorkspace /></DemoRoute>
}
