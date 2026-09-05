"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Eye, EyeOff, User, UserCog } from "lucide-react"

interface LoginFormProps {
  onLogin: (email: string, password: string, role: "tourist" | "authority") => void | Promise<void>
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"tourist" | "authority">("tourist")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    Promise.resolve(onLogin(formData.email, formData.password, selectedRole)).finally(() => setIsSubmitting(false))
  }

  const fillDemoAccount = (role: "tourist" | "authority") => {
    setSelectedRole(role)
    setFormData({
      email: role === "tourist" ? "tourist@demo.safevoyage.app" : "authority@demo.safevoyage.app",
      password: role === "tourist" ? "demo-tourist-2026" : "demo-authority-2026",
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">SafeVoyage</span>
          </div>
          <CardTitle>Welcome to SafeVoyage</CardTitle>
          <CardDescription>Demo access for tourist safety and authority response workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select Role</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={selectedRole === "tourist" ? "default" : "outline"}
                  className="h-16 flex-col space-y-2"
                  onClick={() => setSelectedRole("tourist")}
                >
                  <User className="h-5 w-5" />
                  <span className="text-xs">Tourist</span>
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === "authority" ? "default" : "outline"}
                  className="h-16 flex-col space-y-2"
                  onClick={() => setSelectedRole("authority")}
                >
                  <UserCog className="h-5 w-5" />
                  <span className="text-xs">Administrator</span>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign In to Demo"}
            </Button>
          </form>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t pt-4">
            <Button type="button" variant="outline" className="text-xs" onClick={() => fillDemoAccount("tourist")}>
              Use Tourist Demo
            </Button>
            <Button type="button" variant="outline" className="text-xs" onClick={() => fillDemoAccount("authority")}>
              Use Authority Demo
            </Button>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">Demo only. No sensitive credentials are stored.</p>
        </CardContent>
      </Card>
    </div>
  )
}
