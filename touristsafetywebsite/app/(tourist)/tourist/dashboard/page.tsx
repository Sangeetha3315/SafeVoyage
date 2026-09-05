import { DemoRoute } from "@/components/auth/demo-route"
import { TouristDashboardView } from "@/components/auth/demo-views"

export default function TouristDashboardPage() {
  return (
    <DemoRoute allowedRole="tourist"><TouristDashboardView /></DemoRoute>
  )
}
