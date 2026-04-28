"use client"

import { DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { Shield, LogOut, Phone, MessageCircle, Mail, ExternalLink, HelpCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LocationTracker } from "@/components/location/location-tracker"
import { SOSButton } from "@/components/emergency/sos-button"
import { CustomSOS } from "@/components/emergency/custom-sos"
import { EmergencyContacts } from "@/components/contacts/emergency-contacts"
import { SafetyOverview } from "@/components/dashboard/safety-overview"
import IntroPage from "@/components/intro-page"
import { Chatbot } from "@/components/support/chatbot"
import { BlockchainTracker } from "@/components/emergency/blockchain-tracker"
import type { User } from "@/lib/auth"

interface HomePageProps {
  user: User
  onLogout: () => void
}

export default function HomePage({ user, onLogout }: HomePageProps) {
  const [currentView, setCurrentView] = useState<string>("intro")
  const [showLocationDialog, setShowLocationDialog] = useState(false)
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false)
  const [showContactsDialog, setShowContactsDialog] = useState(false)
  const [showDashboardDialog, setShowDashboardDialog] = useState(false)
  const [showHelpDialog, setShowHelpDialog] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)
  const [showTrackerDialog, setShowTrackerDialog] = useState(false)

  const handleNavigation = (section: string) => {
    setCurrentView("main")

    switch (section) {
      case "dashboard":
        setShowDashboardDialog(true)
        break
      case "location":
        setShowLocationDialog(true)
        break
      case "emergency":
        setShowEmergencyDialog(true)
        break
      case "contacts":
        setShowContactsDialog(true)
        break
      case "help":
        setShowHelpDialog(true)
        break
      case "tracker":
        setShowTrackerDialog(true)
        break
    }
  }

  const handleLogoClick = () => {
    setCurrentView("intro")
    setShowLocationDialog(false)
    setShowEmergencyDialog(false)
    setShowContactsDialog(false)
    setShowDashboardDialog(false)
    setShowHelpDialog(false)
    setShowChatbot(false)
    setShowTrackerDialog(false)
  }

  const handleEmergencyHotline = () => {
    if (typeof window !== "undefined") {
      window.location.href = "tel:+18007233868" // +1-800-SAFETOUR
    }
  }

  const handleLiveChat = () => {
    setShowChatbot(true)
  }

  const handleEmailSupport = () => {
    const subject = encodeURIComponent("SafeTour AI Support Request")
    const body = encodeURIComponent(`Hello SafeTour AI Support Team,

I need assistance with my SafeTour AI account.

User Details:
- Name: ${user.name}
- User ID: ${user.id}
- Timestamp: ${new Date().toISOString()}

Issue Description:
[Please describe your issue in detail]

Current Location: [Please specify if relevant]
Urgency Level: [Low/Medium/High/Emergency]

Additional Information:
[Any other relevant details]

Best regards,
${user.name}`)

    const emailUrl = `mailto:support@safetour.ai?subject=${subject}&body=${body}`

    try {
      if (typeof window !== "undefined") {
        window.location.href = emailUrl

        setTimeout(() => {
          alert("Email client should have opened. If not, please manually send an email to: support@safetour.ai")
        }, 1000)
      }
    } catch (error) {
      const emailText = `To: support@safetour.ai
Subject: SafeTour AI Support Request

Hello SafeTour AI Support Team,

I need assistance with my SafeTour AI account.

User Details:
- Name: ${user.name}
- User ID: ${user.id}
- Timestamp: ${new Date().toISOString()}

Issue Description:
[Please describe your issue in detail]

Current Location: [Please specify if relevant]
Urgency Level: [Low/Medium/High/Emergency]

Additional Information:
[Any other relevant details]

Best regards,
${user.name}`

      if (navigator.clipboard) {
        navigator.clipboard.writeText(emailText).then(() => {
          alert(
            "Email details copied to clipboard! Please paste into your email client and send to support@safetour.ai",
          )
        })
      } else {
        alert("Please manually send an email to: support@safetour.ai with your support request")
      }
    }
  }

  const handleQuickHelpTopic = (topic: string) => {
    switch (topic) {
      case "gps":
        setShowHelpDialog(false)
        setShowLocationDialog(true)
        break
      case "contacts":
        setShowHelpDialog(false)
        setShowContactsDialog(true)
        break
      case "safety":
        setShowHelpDialog(false)
        setShowDashboardDialog(true)
        break
      case "sos":
        setShowHelpDialog(false)
        setShowEmergencyDialog(true)
        break
    }
  }

  if (currentView === "intro") {
    return <IntroPage onNavigate={handleNavigation} userName={user.name} />
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLogoClick}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">SafeTour AI</span>
            </button>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => setShowDashboardDialog(true)}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => setShowLocationDialog(true)}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Location
            </button>
            <button
              onClick={() => setShowEmergencyDialog(true)}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Emergency
            </button>
            <button
              onClick={() => setShowContactsDialog(true)}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Contacts
            </button>
            <button
              onClick={() => setShowTrackerDialog(true)}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Tracker
            </button>
            <button
              onClick={() => setShowHelpDialog(true)}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Help
            </button>
          </nav>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <section className="py-12 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-4 bg-green-100 text-green-800 border-green-200 p-2 rounded-lg">Status: Protected</div>
            <h1 className="text-3xl lg:text-4xl font-bold text-balance mb-4">Your Safety Dashboard</h1>
            <p className="text-lg text-muted-foreground text-balance mb-8">
              Real-time monitoring and emergency response at your fingertips
            </p>

            <Button onClick={() => setShowDashboardDialog(true)} variant="outline" className="mb-4">
              <Shield className="h-4 w-4 mr-2" />
              View Detailed Dashboard
            </Button>
          </div>
        </div>
      </section>

      <section id="dashboard" className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            <Dialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full hover:bg-red-600 hover:text-white transition-colors bg-transparent"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  SOS Emergency
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] h-auto">
                <DialogHeader>
                  <DialogTitle>Emergency SOS System</DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
                  <Tabs defaultValue="quick" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="quick">Quick SOS</TabsTrigger>
                      <TabsTrigger value="custom">Custom Alert</TabsTrigger>
                    </TabsList>
                    <TabsContent value="quick" className="space-y-4 mt-4">
                      <SOSButton userId={user.id} />
                    </TabsContent>
                    <TabsContent value="custom" className="space-y-4 mt-4">
                      <CustomSOS userId={user.id} />
                    </TabsContent>
                  </Tabs>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full hover:bg-primary hover:text-white transition-colors bg-transparent"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Live Location
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl w-[98vw] max-h-[95vh] h-[95vh]">
                <DialogHeader>
                  <DialogTitle>Location Tracking</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto h-[calc(95vh-80px)] pr-2">
                  <LocationTracker />
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showContactsDialog} onOpenChange={setShowContactsDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full hover:bg-secondary hover:text-white transition-colors bg-transparent"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Emergency Contacts
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] h-auto">
                <DialogHeader>
                  <DialogTitle>Emergency Contacts</DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
                  <EmergencyContacts />
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showTrackerDialog} onOpenChange={setShowTrackerDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full hover:bg-blue-600 hover:text-white transition-colors bg-transparent"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Emergency Tracker
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] h-auto">
                <DialogHeader>
                  <DialogTitle>Emergency Location Tracker</DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
                  <BlockchainTracker />
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showDashboardDialog} onOpenChange={setShowDashboardDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full hover:bg-primary hover:text-white transition-colors bg-transparent"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Safety Status
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] h-auto">
                <DialogHeader>
                  <DialogTitle>Safety Dashboard</DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
                  <SafetyOverview userId={user.id} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">About the Project</h2>
            <p className="text-lg text-muted-foreground text-balance">
              Tourist safety is a critical concern affecting millions of travelers worldwide. Our innovative system
              leverages cutting-edge technology to create a comprehensive safety net for tourists.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">Why Tourist Safety Matters</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-secondary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Global Impact</h4>
                    <p className="text-muted-foreground">
                      Over 1.4 billion international tourist arrivals annually need protection
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-secondary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Economic Significance</h4>
                    <p className="text-muted-foreground">
                      Tourism safety directly impacts $1.7 trillion global tourism economy
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-secondary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Lives at Stake</h4>
                    <p className="text-muted-foreground">
                      Preventing incidents saves lives and creates positive travel experiences
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6">Technologies Used</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold">Artificial Intelligence</h4>
                  <p className="text-sm text-muted-foreground">Risk prediction & analysis</p>
                </div>
                <div className="text-center p-4 bg-secondary/5 rounded-lg">
                  <Shield className="h-8 w-8 text-secondary mx-auto mb-2" />
                  <h4 className="font-semibold">Geo-Fencing</h4>
                  <p className="text-sm text-muted-foreground">Safe zone monitoring</p>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold">Blockchain ID</h4>
                  <p className="text-sm text-muted-foreground">Secure digital identity</p>
                </div>
                <div className="text-center p-4 bg-secondary/5 rounded-lg">
                  <Shield className="h-8 w-8 text-secondary mx-auto mb-2" />
                  <h4 className="font-semibold">Mobile Integration</h4>
                  <p className="text-sm text-muted-foreground">Real-time connectivity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] h-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Help & Support
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2 space-y-6">
            <div className="text-center p-6 bg-primary/5 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Need Assistance?</h3>
              <p className="text-muted-foreground mb-4">
                Our administrators are here to help you 24/7 with any questions or concerns.
              </p>
            </div>

            <div className="grid gap-4">
              <Button
                variant="outline"
                className="w-full border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                onClick={handleEmergencyHotline}
              >
                <Phone className="h-4 w-4 mr-2" />
                Emergency Hotline: +1-800-SAFETOUR
                <ExternalLink className="h-3 w-3 ml-2" />
              </Button>

              <Button
                variant="outline"
                className="w-full border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                onClick={handleLiveChat}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Live Chat Support (AI Assistant)
              </Button>

              <Button
                variant="outline"
                className="w-full border-purple-600 text-purple-600 hover:bg-purple-50 bg-transparent"
                onClick={handleEmailSupport}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email Support: support@safetour.ai
                <ExternalLink className="h-3 w-3 ml-2" />
              </Button>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Quick Help Topics
              </h4>
              <div className="space-y-2 text-sm">
                <button
                  onClick={() => handleQuickHelpTopic("gps")}
                  className="flex items-center gap-2 w-full text-left p-2 rounded hover:bg-background transition-colors"
                >
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-blue-600 hover:underline">How to use GPS location tracking</span>
                </button>
                <button
                  onClick={() => handleQuickHelpTopic("contacts")}
                  className="flex items-center gap-2 w-full text-left p-2 rounded hover:bg-background transition-colors"
                >
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-blue-600 hover:underline">Setting up emergency contacts</span>
                </button>
                <button
                  onClick={() => handleQuickHelpTopic("safety")}
                  className="flex items-center gap-2 w-full text-left p-2 rounded hover:bg-background transition-colors"
                >
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-blue-600 hover:underline">Understanding safety zones</span>
                </button>
                <button
                  onClick={() => handleQuickHelpTopic("sos")}
                  className="flex items-center gap-2 w-full text-left p-2 rounded hover:bg-background transition-colors"
                >
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-blue-600 hover:underline">Using SOS emergency features</span>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-2 text-blue-800">Support Channels</h4>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex items-center justify-between">
                  <span>📞 Emergency Hotline:</span>
                  <span className="font-medium">Immediate response</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>💬 Live Chat (AI):</span>
                  <span className="font-medium">Instant response</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>📧 Email Support:</span>
                  <span className="font-medium">Within 1 hour</span>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p className="font-medium text-primary">Available 24/7 for your safety and peace of mind</p>
              <p className="mt-1">Multi-language support available in 15+ languages</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showChatbot} onOpenChange={setShowChatbot}>
        <DialogContent className="max-w-md w-[95vw] max-h-[90vh] h-auto p-0">
          <Chatbot
            onClose={() => setShowChatbot(false)}
            onEmergencyCall={() => {
              setShowChatbot(false)
              handleEmergencyHotline()
            }}
            onLocationHelp={() => {
              setShowChatbot(false)
              setShowLocationDialog(true)
            }}
            onContactsHelp={() => {
              setShowChatbot(false)
              setShowContactsDialog(true)
            }}
            onSOSHelp={() => {
              setShowChatbot(false)
              setShowEmergencyDialog(true)
            }}
          />
        </DialogContent>
      </Dialog>

      <footer id="contact" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">Stay Safe, Travel Smart</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Your safety is our priority. Use SafeTour AI for worry-free travel experiences.
              </p>
            </div>

            <div className="border-t pt-8 text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">SafeTour AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                © 2024 Smart Tourist Safety Monitoring System. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
