export const publicEnv = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || "SafeVoyage",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  mapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
} as const
