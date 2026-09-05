import { DemoRoute } from "@/components/auth/demo-route"
import { TouristEmergencyView } from "@/components/auth/demo-views"

export default function TouristEmergencyPage() {
  return (
    <DemoRoute allowedRole="tourist"><TouristEmergencyView /></DemoRoute>
  )
}
