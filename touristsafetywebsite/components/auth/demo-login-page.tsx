"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { AuthService, type User } from "@/lib/auth"

export function DemoLoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const user = AuthService.getCurrentUser()
    if (user) {
      router.replace(user.role === "authority" ? "/authority/dashboard" : "/tourist/dashboard")
    }
  }, [router])

  const handleLogin = async (email: string, password: string, role: User["role"]) => {
    setError(null)
    const result = await AuthService.signIn(email, password, role)
    if (result.success && result.user) {
      router.replace(role === "authority" ? "/authority/dashboard" : "/tourist/dashboard")
    } else {
      setError(result.error || "Unable to sign in")
    }
  }

  return (
    <div>
      <LoginForm onLogin={handleLogin} />
      {error && <p className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-md bg-destructive px-4 py-3 text-sm text-destructive-foreground">{error}</p>}
    </div>
  )
}
