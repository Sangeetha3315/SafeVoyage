import "server-only"
import { z } from "zod"

const serverEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("SafeVoyage"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  DATABASE_URL: z.string().optional(),
  AUTH_SECRET: z.string().optional(),
  GEOCODING_API_URL: z.string().url().default("https://api.bigdatacloud.net/data/reverse-geocode-client"),
  AI_API_KEY: z.string().optional(),
  AI_MODEL: z.string().optional(),
  AI_BASE_URL: z.string().url().optional(),
  SMS_PROVIDER_API_KEY: z.string().optional(),
  EMAIL_PROVIDER_API_KEY: z.string().optional(),
})

export function getServerEnv() {
  return serverEnvSchema.parse(process.env)
}
