"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { LogOut, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthService, type User } from "@/lib/auth"
import { createContext, useContext } from "react"

const touristLinks = [
  { href: "/tourist/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
  { href: "/profile#digital-id", label: "Digital Tourist ID" },
  { href: "/contacts", label: "Emergency Contacts" },
  { href: "/location", label: "Location / Safety" },
  { href: "/tourist/incidents", label: "Report Incident" },
  { href: "/assistant", label: "Safety Assistant" },
  { href: "/emergency", label: "Emergency / SOS" },
]

const authorityLinks = [
  { href: "/authority/dashboard", label: "Dashboard" },
  { href: "/alerts", label: "Live Alerts" },
  { href: "/authority/incidents", label: "Incidents" },
  { href: "/responders", label: "Responders" },
]
const adminLinks = [{ href: "/admin/dashboard", label: "Admin Dashboard" }]

interface DemoRouteProps {
  allowedRole: User["role"]
  children: React.ReactNode
}

const RouteUserContext = createContext<User | null>(null)

export function useRouteUser() {
  return useContext(RouteUserContext)
}

export function DemoRoute({ allowedRole, children }: DemoRouteProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [sessionError, setSessionError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function loadSession() {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" })
        if (response.ok) {
          const data = await response.json().catch(() => null)
          if (!data?.user || typeof data.user.role !== "string") {
            if (!cancelled) setSessionError("SafeVoyage returned an invalid session response. Please sign in again.")
            return
          }
          const currentUser: User = { ...data.user, role: data.user.role === "TOURIST" ? "tourist" : data.user.role === "ADMIN" ? "admin" : "authority", createdAt: new Date() }
          if (currentUser.role !== allowedRole) {
            router.replace(currentUser.role === "tourist" ? "/tourist/dashboard" : currentUser.role === "admin" ? "/admin/dashboard" : "/authority/dashboard")
            return
          }
          if (!cancelled) setUser(currentUser)
          return
        }

        if (response.status !== 503 && !AuthService.isLegacyFallbackMode()) {
          router.replace("/login")
          return
        }

        if (!AuthService.isLegacyFallbackMode()) {
          if (!cancelled) setSessionError("Database authentication is temporarily unavailable. Please try again after the server is restored.")
          return
        }

        // Temporary migration fallback: old demo-only features still use localStorage.
        const demoUser = AuthService.getCurrentUser()
        if (!demoUser) router.replace("/login")
        else if (demoUser.role !== allowedRole) router.replace(demoUser.role === "authority" ? "/authority/dashboard" : "/tourist/dashboard")
        else if (!cancelled) setUser(demoUser)
      } catch {
        const demoUser = AuthService.getCurrentUser()
        if (AuthService.isLegacyFallbackMode() && demoUser && demoUser.role === allowedRole && !cancelled) setUser(demoUser)
        else if (!cancelled) setSessionError("Unable to verify your SafeVoyage session. Please try again.")
      }
    }
    void loadSession()
    return () => { cancelled = true }
  }, [allowedRole, router])

  if (sessionError) return <div className="flex min-h-screen items-center justify-center bg-background p-6"><div role="alert" className="max-w-md rounded-lg border bg-card p-6 text-center shadow-sm"><h1 className="text-lg font-semibold">Session unavailable</h1><p className="mt-2 text-sm text-muted-foreground">{sessionError}</p><Button className="mt-4" onClick={() => router.replace("/login")}>Return to login</Button></div></div>
  if (!user) return <div className="flex min-h-screen items-center justify-center bg-background p-6"><p className="text-sm text-muted-foreground">Checking your SafeVoyage session...</p></div>

  return <DemoShell user={user}>{children}</DemoShell>
}

function DemoShell({ user, children }: { user: User; children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const links = user.role === "authority" ? authorityLinks : user.role === "admin" ? adminLinks : touristLinks

  const handleLogout = () => {
    void fetch("/api/auth/logout", { method: "POST" }).finally(() => {
      AuthService.signOut()
      router.replace("/login")
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link href={user.role === "authority" ? "/authority/dashboard" : user.role === "admin" ? "/admin/dashboard" : "/tourist/dashboard"} className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            <span className="font-bold text-foreground">SafeVoyage</span>
            <span className="hidden rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary sm:inline">Demo</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{user.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
        <nav className="container mx-auto flex gap-1 overflow-x-auto px-4 pb-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors ${
                pathname === link.href ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="container mx-auto px-4 py-8"><RouteUserContext.Provider value={user}>{children}</RouteUserContext.Provider></main>
    </div>
  )
}
