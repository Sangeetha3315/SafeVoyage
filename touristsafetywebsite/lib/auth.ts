"use client"

export interface User {
  id: string
  name: string
  email: string
  role: "user" | "administrator"
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// Simple localStorage-based auth (in production, use proper backend)
export class AuthService {
  private static readonly USERS_KEY = "safetour_users"
  private static readonly CURRENT_USER_KEY = "safetour_current_user"
  private static readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000 // 24 hours

  static getUsers(): User[] {
    if (typeof window === "undefined") return []
    const users = localStorage.getItem(this.USERS_KEY)
    return users ? JSON.parse(users) : []
  }

  static saveUsers(users: User[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
  }

  static getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    const userSession = localStorage.getItem(this.CURRENT_USER_KEY)
    const sessionTime = localStorage.getItem(`${this.CURRENT_USER_KEY}_time`)

    if (!userSession || !sessionTime) return null

    // Check if session has expired
    const loginTime = Number.parseInt(sessionTime)
    const currentTime = Date.now()

    if (currentTime - loginTime > this.SESSION_TIMEOUT) {
      // Session expired, clear it
      this.signOut()
      return null
    }

    return JSON.parse(userSession)
  }

  static setCurrentUser(user: User | null): void {
    if (typeof window === "undefined") return
    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user))
      localStorage.setItem(`${this.CURRENT_USER_KEY}_time`, Date.now().toString())
    } else {
      localStorage.removeItem(this.CURRENT_USER_KEY)
      localStorage.removeItem(`${this.CURRENT_USER_KEY}_time`)
    }
  }

  static signUp(
    email: string,
    password: string,
    name: string,
    role: "user" | "administrator",
  ): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers()

    // Check if user already exists
    if (users.find((u) => u.email === email)) {
      return { success: false, error: "User already exists with this email" }
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      createdAt: new Date(),
    }

    users.push(newUser)
    this.saveUsers(users)
    this.setCurrentUser(newUser)

    return { success: true, user: newUser }
  }

  static signIn(
    email: string,
    password: string,
    role: "user" | "administrator",
  ): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers()
    const user = users.find((u) => u.email === email && u.role === role)

    if (!user) {
      return { success: false, error: "User not found or incorrect role selected" }
    }

    // In production, verify password hash
    this.setCurrentUser(user)
    return { success: true, user }
  }

  static signOut(): void {
    this.setCurrentUser(null)
  }

  static isSessionValid(): boolean {
    return this.getCurrentUser() !== null
  }

  static refreshSession(): void {
    const user = this.getCurrentUser()
    if (user) {
      this.setCurrentUser(user) // This will update the timestamp
    }
  }
}
