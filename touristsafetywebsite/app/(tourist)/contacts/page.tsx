import { DemoRoute } from "@/components/auth/demo-route"
import { EmergencyContacts } from "@/components/contacts/emergency-contacts"

export default function TouristContactsPage() {
  return <DemoRoute allowedRole="tourist"><EmergencyContacts /></DemoRoute>
}
