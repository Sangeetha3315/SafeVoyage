import { DemoRoute } from "@/components/auth/demo-route"
import { AdminOverview } from "@/components/admin/admin-overview"

export default function AdminDashboardPage() {
  return <DemoRoute allowedRole="admin"><AdminOverview /></DemoRoute>
}