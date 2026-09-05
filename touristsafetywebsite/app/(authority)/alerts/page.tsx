import { DemoRoute } from "@/components/auth/demo-route"
import { LiveAlerts } from "@/components/authority/live-alerts"

export default function AuthorityAlertsPage() {
  return <DemoRoute allowedRole="authority"><LiveAlerts /></DemoRoute>
}
