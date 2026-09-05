import { DemoRoute } from "@/components/auth/demo-route"
import { TouristProfile } from "@/components/tourist/tourist-profile"

export default function TouristProfilePage() {
  return <DemoRoute allowedRole="tourist"><TouristProfile /></DemoRoute>
}
