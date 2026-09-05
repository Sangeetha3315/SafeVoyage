import { DemoRoute } from "@/components/auth/demo-route"
import { SafetyAssistant } from "@/components/assistant/safety-assistant"

export default function TouristAssistantPage() {
  return <DemoRoute allowedRole="tourist"><SafetyAssistant /></DemoRoute>
}
