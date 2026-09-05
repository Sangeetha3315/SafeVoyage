"use client"

import type { User } from "@/lib/auth"

export interface DemoTouristProfile {
  id: string
  name: string
  email: string
  country: string
  phone: string
  status: "VERIFIED_DEMO"
  createdAt: string
  emergencyContactCount: number
}

const PROFILE_KEY = "safevoyage_demo_tourist_profile"

export function getDemoTouristProfile(user: User): DemoTouristProfile {
  if (typeof window !== "undefined") {
    const saved = window.localStorage.getItem(PROFILE_KEY)
    if (saved) return JSON.parse(saved) as DemoTouristProfile
  }

  return {
    id: "SV-TOUR-2026-001",
    name: user.name,
    email: user.email,
    country: "India",
    phone: "+91 98765 43210",
    status: "VERIFIED_DEMO",
    createdAt: new Date(user.createdAt).toISOString(),
    emergencyContactCount: 2,
  }
}

export function saveDemoTouristProfile(profile: DemoTouristProfile): void {
  if (typeof window !== "undefined") window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}
