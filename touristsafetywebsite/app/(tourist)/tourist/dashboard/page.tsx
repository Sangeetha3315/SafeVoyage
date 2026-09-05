import { DemoRoute } from "@/components/auth/demo-route"
import { TouristDashboard } from "@/components/tourist/tourist-dashboard"

export default function TouristDashboardPage() {
  return (
    <DemoRoute allowedRole="tourist"><TouristDashboard /></DemoRoute>
  )
}
