"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { AuthService } from "@/lib/auth"

export function DemoLoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void fetch("/api/auth/session", { cache: "no-store" }).then(async (response) => {
      if (cancelled || !response.ok) return
      const data = await response.json()
      router.replace(data.user.role === "ADMIN" ? "/admin/dashboard" : data.user.role === "AUTHORITY" ? "/authority/dashboard" : "/tourist/dashboard")
    }).catch(() => undefined)
    return () => { cancelled = true }
  }, [router])

  const handleLogin = async (email: string, password: string, role: "tourist" | "authority") => {
    setError(null)
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) })
      if (response.ok) {
        const data = await response.json().catch(() => null)
        if (!data?.user) {
          setError("SafeVoyage returned an invalid login response.")
          return
        }
        router.replace(data.user.role === "ADMIN" ? "/admin/dashboard" : data.user.role === "AUTHORITY" ? "/authority/dashboard" : "/tourist/dashboard")
        return
      }
      if (response.status !== 503) {
        const data = await response.json().catch(() => ({}))
        setError(data.error || "Unable to sign in")
        return
      }
    } catch {
      // A network failure is treated as unavailable development infrastructure.
    }

    const result = await AuthService.signIn(email, password, role)
    if (result.success && result.user) router.replace(role === "authority" ? "/authority/dashboard" : "/tourist/dashboard")
    else setError(result.error || "Unable to sign in")
  }

  return (
    <div>
      <LoginForm onLogin={handleLogin} />
      {error && <p className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-md bg-destructive px-4 py-3 text-sm text-destructive-foreground">{error}</p>}
    </div>
  )
}
