export const SAFETY_ASSISTANT_SUGGESTIONS = [
  "What should I do if I feel unsafe?",
  "How do I use SOS?",
  "What should I do if I lose my phone?",
  "How can I stay safe in an unfamiliar area?",
  "How do I report an incident?",
]

export function getDemoSafetyResponse(message: string, context?: { location?: string; safetyStatus?: string; activeSos?: boolean }): string {
  const input = message.toLowerCase()
  const place = context?.location ? ` Since your latest location is ${context.location}, keep a trusted person informed about your route.` : ""

  if (input.includes("following") || input.includes("chasing")) {
    return "Do not confront the person. Move into a busy, well-lit business or public place, tell staff clearly that you need help, and call someone you trust. Use SafeVoyage SOS if you need the authority demo to review an alert; contact local emergency services for immediate danger."
  }
  if (input.includes("medical") || input.includes("injur") || input.includes("hospital")) {
    return "Move to a safe place and ask nearby staff or a trusted person for help finding medical care. If there is a serious or immediate medical emergency, contact local emergency services. SafeVoyage can record your location for the demo workflow, but it does not dispatch care."
  }
  if (input.includes("theft") || input.includes("stolen") || input.includes("robbed")) {
    return "Get somewhere safe before dealing with the loss. Secure your bank and account access, use device-finding or remote-lock tools, and document what happened. You can file a SafeVoyage incident report when ready." + place
  }
  if (input.includes("sos") || input.includes("emergency") || input.includes("urgent")) {
    return `${context?.activeSos ? "Your demo SOS is already active. Check its status on the dashboard." : "Move to a safe public place if you can, keep a trusted person informed, and use the Emergency SOS button to create a SafeVoyage authority demo alert."} For immediate danger, contact local emergency services directly.`
  }
  if (input.includes("unsafe") || input.includes("threat") || input.includes("scared")) {
    return "Trust your instincts. Move toward a well-lit public place, avoid confrontation, contact someone you trust, and use SOS if you need the SafeVoyage authority demo to review your situation." + place
  }
  if (input.includes("phone") || input.includes("lost") || input.includes("stolen")) {
    return "Move somewhere safe, ask a trusted person or venue staff for help, lock or remotely locate your phone if possible, and protect your accounts from another device. Report the incident in SafeVoyage when you are safe." + place
  }
  if (input.includes("incident") || input.includes("report")) {
    return "Open Report Incident from the tourist navigation, choose a category and severity, add what happened and where, then submit. The report is stored in PostgreSQL and appears in the authority review queue."
  }
  if (input.includes("area") || input.includes("unfamiliar") || input.includes("travel") || input.includes("safe")) {
    return `For an unfamiliar area, stay in well-lit public places, keep valuables secure, share your plans with a trusted person, check your route before leaving, and keep your phone charged.${context?.safetyStatus ? ` Current demo zone status: ${context.safetyStatus}.` : ""}`
  }

  return "I can help with feeling unsafe, SOS, a lost phone, unfamiliar areas, or reporting an incident. Choose a suggested question or tell me what is happening."
}
