import { DemoRoute } from "@/components/auth/demo-route"
import { Responders } from "@/components/authority/responders"

export default function AuthorityRespondersPage() {
  return <DemoRoute allowedRole="authority"><Responders /></DemoRoute>
}
