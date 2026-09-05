import { apiError, apiSuccess } from "@/lib/api/response"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const latitude = Number(searchParams.get("lat"))
  const longitude = Number(searchParams.get("lng"))

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return apiError("INVALID_COORDINATES", "Valid latitude and longitude are required.", 400)
  }

  try {
    const endpoint = process.env.GEOCODING_API_URL ?? "https://api.bigdatacloud.net/data/reverse-geocode-client"
    const response = await fetch(`${endpoint}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    })

    if (!response.ok) return apiError("GEOCODING_UNAVAILABLE", "Address lookup is temporarily unavailable.", 502)

    const data = await response.json()
    return apiSuccess({
      address: data.display_name || data.localityInfo?.administrative?.[0]?.name || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
    })
  } catch {
    return apiError("GEOCODING_UNAVAILABLE", "Address lookup is temporarily unavailable.", 502)
  }
}
