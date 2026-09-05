"use client"

import { useState, useEffect } from "react"
import { AuthService, type User } from "@/lib/auth"
import HomePage from "@/components/home-page"
import { useRouter } from "next/navigation"
import { DemoLoginPage } from "@/components/auth/demo-login-page"

export default function Page() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = AuthService.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)

    const sessionRefreshInterval = setInterval(
      () => {
        if (AuthService.isSessionValid()) {
          AuthService.refreshSession()
        } else {
          // Session expired, log out user
          setUser(null)
        }
      },
      5 * 60 * 1000,
    ) // Check every 5 minutes

    return () => {
      clearInterval(sessionRefreshInterval)
    }
  }, [])

  const handleLogout = () => {
    AuthService.signOut()
    setUser(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Show login form if not authenticated
  if (!user) {
    return <DemoLoginPage />
  }

  if (user.role === "authority") {
    router.replace("/authority/dashboard")
    return null
  }

  // Show main app if authenticated as user
  return <HomePage user={user} onLogout={handleLogout} />
}
