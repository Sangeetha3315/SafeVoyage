"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialForm = { name: "", email: "", password: "", confirmPassword: "" }

export function RegisterForm() {
  const router = useRouter()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const update = (field: keyof typeof initialForm) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm((current) => ({ ...current, [field]: event.target.value }))

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError("")
    setFieldErrors({})
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error ?? "Unable to create your account.")
        setFieldErrors(data.fields ?? {})
        return
      }
      router.replace("/tourist/dashboard")
    } catch {
      setError("Unable to reach SafeVoyage. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const input = (field: keyof typeof initialForm, label: string, type = "text", placeholder = "") => (
    <div className="space-y-2">
      <Label htmlFor={field}>{label}</Label>
      <Input id={field} type={type} placeholder={placeholder} value={form[field]} onChange={update(field)} required aria-invalid={Boolean(fieldErrors[field])} />
      {fieldErrors[field]?.map((message) => <p key={message} className="text-xs text-destructive">{message}</p>)}
    </div>
  )

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center"><div className="mb-3 flex items-center justify-center gap-2"><Shield className="h-8 w-8 text-primary" /><span className="text-2xl font-bold">SafeVoyage</span></div><CardTitle>Create your tourist account</CardTitle><CardDescription>Registration creates a Tourist account and signs you in securely.</CardDescription></CardHeader>
        <CardContent><form onSubmit={handleSubmit} className="space-y-5">
          {error && <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
          {input("name", "Full Name", "text", "Your name")}
          {input("email", "Email", "email", "you@example.com")}
          <div className="space-y-2"><Label htmlFor="password">Password</Label><div className="relative"><Input id="password" type={showPassword ? "text" : "password"} value={form.password} onChange={update("password")} required /><Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button></div><p className="text-xs text-muted-foreground">At least 8 characters with uppercase, lowercase, and a number.</p>{fieldErrors.password?.map((message) => <p key={message} className="text-xs text-destructive">{message}</p>)}</div>
          <div className="space-y-2"><Label htmlFor="confirmPassword">Confirm Password</Label><div className="relative"><Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={form.confirmPassword} onChange={update("confirmPassword")} required /><Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full" onClick={() => setShowConfirmPassword((value) => !value)} aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}>{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button></div>{fieldErrors.confirmPassword?.map((message) => <p key={message} className="text-xs text-destructive">{message}</p>)}</div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Creating account..." : "Create Tourist Account"}</Button>
        </form><p className="mt-5 text-center text-sm text-muted-foreground">Already have an account? <Link href="/login" className="font-medium text-primary hover:underline">Sign in</Link></p></CardContent>
      </Card>
    </div>
  )
}
