"use client"

export interface User {
  id: string
  name: string
  email: string
  role: "tourist" | "authority"
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

type StoredUser = Omit<User, "role"> & { role: "user" | "administrator" | User["role"] }

// Simple localStorage-based auth (in production, use proper backend)
export class AuthService {
  private static readonly USERS_KEY = "safetour_users"
  private static readonly CURRENT_USER_KEY = "safetour_current_user"
  private static readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000 // 24 hours
  private static readonly DEMO_ACCOUNTS = {
    tourist: {
      email: "tourist@demo.safevoyage.app",
      name: "Demo Tourist",
      passwordHash: "23be0a005e66361983652afbb68715f05e3463353324c3d25bbe9a9015ee2dbd",
    },
    authority: {
      email: "authority@demo.safevoyage.app",
      name: "Demo Authority",
      passwordHash: "7d190977a2ed0ca541871c88cf443f4489974c1aa588c986fc619d58d87f3ec7",
    },
  } as const

  static getUsers(): User[] {
    if (typeof window === "undefined") return []
    const users = localStorage.getItem(this.USERS_KEY)
    return users
      ? (JSON.parse(users) as StoredUser[]).map((user) => ({
          ...user,
          role: user.role === "administrator" ? "authority" : user.role === "user" ? "tourist" : user.role,
        }))
      : []
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

  static signUp(email: string, password: string, name: string, role: User["role"]): { success: boolean; user?: User; error?: string } {
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
    role: User["role"],
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    return this.verifyDemoCredentials(email, password, role).then((isValid) => {
      if (!isValid) return { success: false, error: "Use one of the documented demo accounts and passwords." }

      const account = this.DEMO_ACCOUNTS[role]
      const user: User = {
        id: `demo-${role}`,
        name: account.name,
        email: account.email,
        role,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
      }
      this.setCurrentUser(user)
      return { success: true, user }
    })
  }

  private static async verifyDemoCredentials(email: string, password: string, role: User["role"]): Promise<boolean> {
    if (typeof window === "undefined") return false

    const account = this.DEMO_ACCOUNTS[role]
    const encodedPassword = new TextEncoder().encode(password)
    const digest = await crypto.subtle.digest("SHA-256", encodedPassword)
    const passwordHash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("")
    return email.trim().toLowerCase() === account.email && passwordHash === account.passwordHash
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
