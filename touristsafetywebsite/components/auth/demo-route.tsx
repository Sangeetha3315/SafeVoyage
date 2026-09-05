"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { LogOut, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthService, type User } from "@/lib/auth"

const touristLinks = [
  { href: "/tourist/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
  { href: "/contacts", label: "Emergency Contacts" },
  { href: "/location", label: "Location / Safety" },
  { href: "/tourist/incidents", label: "Report Incident" },
  { href: "/emergency", label: "Emergency / SOS" },
]

const authorityLinks = [
  { href: "/authority/dashboard", label: "Dashboard" },
  { href: "/alerts", label: "Live Alerts" },
  { href: "/authority/incidents", label: "Incidents" },
  { href: "/responders", label: "Responders" },
]

interface DemoRouteProps {
  allowedRole: User["role"]
  children: React.ReactNode
}

export function DemoRoute({ allowedRole, children }: DemoRouteProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser) {
      router.replace("/login")
      return
    }

    if (currentUser.role !== allowedRole) {
      router.replace(currentUser.role === "authority" ? "/authority/dashboard" : "/tourist/dashboard")
      return
    }

    setUser(currentUser)
  }, [allowedRole, router])

  if (!user) {
    return <div className="min-h-screen bg-background" />
  }

  return <DemoShell user={user}>{children}</DemoShell>
}

function DemoShell({ user, children }: { user: User; children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const links = user.role === "authority" ? authorityLinks : touristLinks

  const handleLogout = () => {
    AuthService.signOut()
    router.replace("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link href={user.role === "authority" ? "/authority/dashboard" : "/tourist/dashboard"} className="flex items-center gap-2">
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
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
