import { z } from "zod"

const passwordSchema = z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Password must include an uppercase letter").regex(/[a-z]/, "Password must include a lowercase letter").regex(/[0-9]/, "Password must include a number")

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Enter a valid email address").max(254),
  password: passwordSchema,
  confirmPassword: z.string(),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(30).optional().default("Not provided"),
  nationality: z.string().trim().min(2, "Nationality is required").max(80).optional().default("Not provided"),
  emergencyContactName: z.string().trim().min(2, "Contact name is required").max(100).optional().default("Demo emergency contact"),
  emergencyContactPhone: z.string().trim().min(7, "Enter a valid contact phone").max(30).optional().default("Not provided"),
  relationship: z.string().trim().min(2, "Relationship is required").max(50).optional().default("Emergency contact"),
}).refine((data) => data.password === data.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match" })

export const loginSchema = z.object({ email: z.string().trim().email(), password: z.string().min(1) })
export type RegisterInput = z.infer<typeof registerSchema>