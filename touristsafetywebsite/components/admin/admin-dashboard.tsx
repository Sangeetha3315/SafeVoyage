"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Users, MapPin, AlertTriangle, LogOut, Search, Edit, Trash2, Clock, Phone } from "lucide-react"
import { AuthService, type User } from "@/lib/auth"

interface AdminDashboardProps {
  user: User
  onLogout: () => void
}

interface UserLocation {
  userId: string
  latitude: number
  longitude: number
  address: string
  timestamp: Date
  status: "safe" | "caution" | "danger"
}

interface SOSAlert {
  id: string
  userId: string
  userName: string
  location: { latitude: number; longitude: number; address: string }
  message: string
  timestamp: Date
  status: "active" | "resolved"
  blockchainId?: string
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [userLocations, setUserLocations] = useState<UserLocation[]>([])
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [editingUser, setEditingUser] = useState<User | null>(null)

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = () => {
    // Load all users
    const users = AuthService.getUsers().filter((u) => u.role === "tourist")
    setAllUsers(users)

    // Load mock location data
    const mockLocations: UserLocation[] = users.map((u) => ({
      userId: u.id,
      latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
      longitude: -74.006 + (Math.random() - 0.5) * 0.1,
      address: `${Math.floor(Math.random() * 999)} Tourist St, NYC`,
      timestamp: new Date(Date.now() - Math.random() * 86400000),
      status: Math.random() > 0.7 ? "caution" : "safe",
    }))
    setUserLocations(mockLocations)

    // Load mock SOS alerts
    const mockAlerts: SOSAlert[] = [
      {
        id: "1",
        userId: users[0]?.id || "1",
        userName: users[0]?.name || "Tourist User",
        location: { latitude: 40.7589, longitude: -73.9851, address: "Times Square, NYC" },
        message: "Emergency assistance needed",
        timestamp: new Date(Date.now() - 3600000),
        status: "active",
        blockchainId: "BLK-" + Date.now().toString(36).toUpperCase(),
      },
    ]
    setSosAlerts(mockAlerts)
  }

  const filteredUsers = allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditUser = (editedUser: User) => {
    const users = AuthService.getUsers()
    const updatedUsers = users.map((u) => (u.id === editedUser.id ? editedUser : u))
    AuthService.saveUsers(updatedUsers)
    setAllUsers(updatedUsers.filter((u) => u.role === "tourist"))
    setEditingUser(null)
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const users = AuthService.getUsers()
      const updatedUsers = users.filter((u) => u.id !== userId)
      AuthService.saveUsers(updatedUsers)
      setAllUsers(updatedUsers.filter((u) => u.role === "tourist"))
    }
  }

  const resolveAlert = (alertId: string) => {
    setSosAlerts((prev) =>
      prev.map((alert) => (alert.id === alertId ? { ...alert, status: "resolved" as const } : alert)),
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">SafeVoyage Admin</h1>
              <p className="text-sm text-muted-foreground">Administrator Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="px-3 py-1">
              Admin: {user.name}
            </Badge>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{allUsers.length}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <MapPin className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{userLocations.filter((l) => l.status === "safe").length}</p>
                  <p className="text-sm text-muted-foreground">Safe Locations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{userLocations.filter((l) => l.status === "caution").length}</p>
                  <p className="text-sm text-muted-foreground">Caution Areas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{sosAlerts.filter((a) => a.status === "active").length}</p>
                  <p className="text-sm text-muted-foreground">Active SOS</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="locations">Live Locations</TabsTrigger>
            <TabsTrigger value="alerts">SOS Alerts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage all registered users and their information</CardDescription>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((u) => (
                    <div key={u.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{u.name}</p>
                          <p className="text-sm text-muted-foreground">{u.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Joined: {new Date(u.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingUser(u)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteUser(u.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live User Locations</CardTitle>
                <CardDescription>Real-time tracking of all user locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userLocations.map((location, index) => {
                    const user = allUsers.find((u) => u.id === location.userId)
                    return (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <MapPin
                            className={`h-5 w-5 ${
                              location.status === "safe"
                                ? "text-green-500"
                                : location.status === "caution"
                                  ? "text-yellow-500"
                                  : "text-red-500"
                            }`}
                          />
                          <div>
                            <p className="font-medium">{user?.name || "Unknown User"}</p>
                            <p className="text-sm text-muted-foreground">{location.address}</p>
                            <p className="text-xs text-muted-foreground">
                              {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={location.status === "safe" ? "default" : "destructive"}>
                            {location.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {new Date(location.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SOS Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SOS Emergency Alerts</CardTitle>
                <CardDescription>Monitor and respond to emergency situations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sosAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 border rounded-lg ${
                        alert.status === "active" ? "border-red-200 bg-red-50" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <AlertTriangle
                            className={`h-5 w-5 ${alert.status === "active" ? "text-red-500" : "text-gray-400"}`}
                          />
                          <div>
                            <p className="font-medium">{alert.userName}</p>
                            <p className="text-sm text-muted-foreground">{alert.message}</p>
                            <p className="text-xs text-muted-foreground">{alert.location.address}</p>
                            {alert.blockchainId && (
                              <p className="text-xs font-mono text-blue-600">Blockchain ID: {alert.blockchainId}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={alert.status === "active" ? "destructive" : "secondary"}>
                            {alert.status}
                          </Badge>
                          {alert.status === "active" && (
                            <Button size="sm" onClick={() => resolveAlert(alert.id)}>
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(alert.timestamp).toLocaleString()}</span>
                        </span>
                        <span>
                          Location: {alert.location.latitude.toFixed(6)}, {alert.location.longitude.toFixed(6)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Analytics</CardTitle>
                <CardDescription>Overview of system performance and usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">User Activity</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Active Users Today</span>
                        <span className="text-sm font-medium">{Math.floor(allUsers.length * 0.8)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Location Updates</span>
                        <span className="text-sm font-medium">{userLocations.length * 24}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">SOS Alerts (24h)</span>
                        <span className="text-sm font-medium">{sosAlerts.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Safety Metrics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Average Response Time</span>
                        <span className="text-sm font-medium">2.3 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Resolution Rate</span>
                        <span className="text-sm font-medium">98.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Safe Zone Coverage</span>
                        <span className="text-sm font-medium">94.2%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit User</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => handleEditUser(editingUser)}>Save Changes</Button>
                <Button variant="outline" onClick={() => setEditingUser(null)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
