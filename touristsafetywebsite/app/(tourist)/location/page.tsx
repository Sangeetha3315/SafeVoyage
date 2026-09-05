import { DemoRoute } from "@/components/auth/demo-route"
import { LocationTracker } from "@/components/location/location-tracker"

export default function TouristLocationPage() {
  return <DemoRoute allowedRole="tourist"><LocationTracker /></DemoRoute>
}
