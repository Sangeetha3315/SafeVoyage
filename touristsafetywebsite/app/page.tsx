"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { AuthService, type User } from "@/lib/auth"
import HomePage from "@/components/home-page"
import AdminDashboard from "@/components/admin/admin-dashboard"

export default function Page() {
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

  const handleLogin = (email: string, password: string, role: "user" | "administrator") => {
    const result = AuthService.signIn(email, password, role)
    if (result.success && result.user) {
      setUser(result.user)
    } else {
      alert(result.error || "Login failed")
    }
  }

  const handleSignUp = (email: string, password: string, name: string, role: "user" | "administrator") => {
    const result = AuthService.signUp(email, password, name, role)
    if (result.success && result.user) {
      setUser(result.user)
    } else {
      alert(result.error || "Sign up failed")
    }
  }

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
    return <LoginForm onLogin={handleLogin} onSignUp={handleSignUp} />
  }

  if (user.role === "administrator") {
    return <AdminDashboard user={user} onLogout={handleLogout} />
  }

  // Show main app if authenticated as user
  return <HomePage user={user} onLogout={handleLogout} />
}
