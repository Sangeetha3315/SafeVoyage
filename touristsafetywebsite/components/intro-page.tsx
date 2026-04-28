"use client"
import {
  Shield,
  MapPin,
  AlertTriangle,
  Users,
  HelpCircle,
  Play,
  CheckCircle,
  ArrowRight,
  Globe,
  Heart,
  Star,
  Award,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface IntroPageProps {
  onNavigate: (section: string) => void
  userName: string
}

export default function IntroPage({ onNavigate, userName }: IntroPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Enhanced Background with Parallax Effect */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full hero-gradient relative">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 opacity-40">
              <img
                src="/tourists-exploring-safely-with-guide--mountain-hik.jpg"
                alt="Tourist Safety Guidance"
                className="w-full h-full object-cover parallax-bg"
              />
            </div>
            <div className="absolute inset-0 bg-black/40"></div>
            {/* Animated Floating Elements */}
            <div className="absolute top-20 left-20 floating-animation">
              <div className="bg-green-400 rounded-full w-6 h-6 shadow-xl pulse-glow"></div>
            </div>
            <div className="absolute top-40 right-32 floating-animation" style={{ animationDelay: "2s" }}>
              <MapPin className="h-8 w-8 text-white drop-shadow-lg" />
            </div>
            <div className="absolute bottom-32 left-1/4 floating-animation" style={{ animationDelay: "4s" }}>
              <Shield className="h-10 w-10 text-green-400 drop-shadow-lg" />
            </div>
            <div className="absolute top-1/2 right-20 floating-animation" style={{ animationDelay: "1s" }}>
              <Star className="h-6 w-6 text-yellow-400 drop-shadow-lg" />
            </div>
          </div>
        </div>

        {/* Enhanced Content Overlay */}
        <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
          <Badge className="mb-8 bg-gray-900/90 text-white border-white/30 text-lg px-6 py-3 fade-in-down backdrop-blur-sm">
            <Award className="h-4 w-4 mr-2" />
            Welcome to SafeTour AI
          </Badge>

          <h1
            className="text-5xl lg:text-7xl font-bold text-balance mb-8 text-white drop-shadow-2xl fade-in-up"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
          >
            Your Ultimate
            <span className="text-gradient block mt-2">Tourist Safety Companion</span>
          </h1>

          <p
            className="text-xl lg:text-2xl text-white/90 text-balance mb-12 max-w-4xl mx-auto drop-shadow-lg fade-in-up"
            style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.8)", animationDelay: "0.2s" }}
          >
            Experience worry-free travel with AI-powered safety monitoring, real-time location tracking, and instant
            emergency response systems designed to protect tourists worldwide.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16 fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Button
              size="lg"
              className="text-xl px-10 py-8 bg-accent hover:bg-accent/90 shadow-2xl card-hover-effect"
              onClick={() => onNavigate("dashboard")}
            >
              <Play className="h-6 w-6 mr-3" />
              Get Started Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-xl px-10 py-8 bg-gray-800/90 text-white border-gray-600 hover:bg-gray-700/90 shadow-2xl card-hover-effect backdrop-blur-sm"
              onClick={() => onNavigate("emergency")}
            >
              <AlertTriangle className="h-6 w-6 mr-3" />
              Emergency SOS
            </Button>
          </div>

          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 text-white stagger-item border border-white/20">
              <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-sm opacity-90">AI Monitoring</div>
            </div>
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 text-white stagger-item border border-white/20">
              <div className="text-3xl font-bold text-blue-400 mb-2">GPS</div>
              <div className="text-sm opacity-90">Live Tracking</div>
            </div>
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 text-white stagger-item border border-white/20">
              <div className="text-3xl font-bold text-purple-400 mb-2">AI</div>
              <div className="text-sm opacity-90">Powered Safety</div>
            </div>
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 text-white stagger-item border border-white/20">
              <div className="text-3xl font-bold text-red-400 mb-2">SOS</div>
              <div className="text-sm opacity-90">Instant Help</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 fade-in-up">
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-foreground">Choose Your Safety Feature</h2>
            <p className="text-xl text-muted-foreground text-balance max-w-3xl mx-auto">
              Access comprehensive safety tools designed to keep you protected during your travels with cutting-edge AI
              technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
            <Card
              className="text-center card-hover-effect cursor-pointer border-2 hover:border-primary/50 bg-card/50 backdrop-blur stagger-item"
              onClick={() => onNavigate("dashboard")}
            >
              <CardHeader className="pb-4">
                <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Shield className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-2xl mb-2">Safety Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg mb-6 text-muted-foreground">
                  Monitor your safety status, view analytics, and get real-time insights about your travel security with
                  AI-powered recommendations
                </CardDescription>
                <Button className="w-full bg-primary hover:bg-primary/90 text-lg py-3">
                  View Dashboard
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card
              className="text-center card-hover-effect cursor-pointer border-2 hover:border-blue-500/50 bg-card/50 backdrop-blur stagger-item"
              onClick={() => onNavigate("location")}
            >
              <CardHeader className="pb-4">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-2xl w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <MapPin className="h-12 w-12 text-blue-600" />
                </div>
                <CardTitle className="text-2xl mb-2">Live Location</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg mb-6 text-muted-foreground">
                  Share your real-time GPS location with trusted contacts and enable continuous tracking with precision
                  accuracy
                </CardDescription>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3">
                  Track Location
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card
              className="text-center card-hover-effect cursor-pointer border-2 hover:border-red-500/50 bg-card/50 backdrop-blur stagger-item"
              onClick={() => onNavigate("emergency")}
            >
              <CardHeader className="pb-4">
                <div className="bg-gradient-to-br from-red-500/20 to-red-500/10 rounded-2xl w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg pulse-glow">
                  <AlertTriangle className="h-12 w-12 text-red-600" />
                </div>
                <CardTitle className="text-2xl mb-2 text-red-600">Emergency SOS</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg mb-6 text-muted-foreground">
                  Instant emergency alerts with location sharing to emergency services and contacts with one-tap
                  activation
                </CardDescription>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-lg py-3">
                  Emergency Help
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card
              className="text-center card-hover-effect cursor-pointer border-2 hover:border-green-500/50 bg-card/50 backdrop-blur stagger-item"
              onClick={() => onNavigate("contacts")}
            >
              <CardHeader className="pb-4">
                <div className="bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-2xl w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Users className="h-12 w-12 text-green-600" />
                </div>
                <CardTitle className="text-2xl mb-2">Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg mb-6 text-muted-foreground">
                  Manage your emergency contact list and configure automatic notifications with smart priority settings
                </CardDescription>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-lg py-3">
                  Manage Contacts
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card
              className="text-center card-hover-effect cursor-pointer border-2 hover:border-purple-500/50 bg-card/50 backdrop-blur stagger-item"
              onClick={() => onNavigate("help")}
            >
              <CardHeader className="pb-4">
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-2xl w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <HelpCircle className="h-12 w-12 text-purple-600" />
                </div>
                <CardTitle className="text-2xl mb-2">Help & Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg mb-6 text-muted-foreground">
                  Get instant assistance from administrators with 24/7 emergency hotline, live chat, and email support
                  with multilingual assistance
                </CardDescription>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-3">
                  Get Help
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-muted/30 to-muted/10">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 fade-in-up">
              <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-foreground">
                Why SOS Emergency System is Critical
              </h2>
              <p className="text-xl text-muted-foreground text-balance max-w-4xl mx-auto">
                Understanding the importance of emergency response systems can save lives and ensure safer travel
                experiences for millions of tourists worldwide
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
              <div className="fade-in-left">
                <h3 className="text-3xl font-bold mb-10 text-foreground">Emergency Response Statistics</h3>
                <div className="space-y-8">
                  <div className="flex items-start space-x-6 stagger-item">
                    <div className="bg-gradient-to-br from-red-500/20 to-red-500/10 rounded-2xl p-4 mt-1 shadow-lg">
                      <Clock className="h-8 w-8 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-2">Golden Hour Principle</h4>
                      <p className="text-muted-foreground text-lg">
                        The first hour after an emergency is critical - faster response increases survival rates by 80%
                        and reduces long-term complications
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-6 stagger-item">
                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-2xl p-4 mt-1 shadow-lg">
                      <Globe className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-2">Tourist Vulnerability</h4>
                      <p className="text-muted-foreground text-lg">
                        Tourists are 3x more likely to face emergencies due to unfamiliar environments, language
                        barriers, and limited local knowledge
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-6 stagger-item">
                    <div className="bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-2xl p-4 mt-1 shadow-lg">
                      <Heart className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-2">Lives Saved</h4>
                      <p className="text-muted-foreground text-lg">
                        Proper emergency systems have saved over 50,000 tourist lives globally in the past decade
                        through rapid response coordination
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="fade-in-right">
                <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur shadow-2xl border-2 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-3xl font-bold mb-6 text-center">How SafeTour AI Helps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4 stagger-item">
                        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                        <span className="text-lg">Instant GPS location sharing with emergency services</span>
                      </div>
                      <div className="flex items-center space-x-4 stagger-item">
                        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                        <span className="text-lg">Automatic notification to emergency contacts</span>
                      </div>
                      <div className="flex items-center space-x-4 stagger-item">
                        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                        <span className="text-lg">AI-powered risk assessment and prevention</span>
                      </div>
                      <div className="flex items-center space-x-4 stagger-item">
                        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                        <span className="text-lg">24/7 monitoring and rapid response coordination</span>
                      </div>
                      <div className="flex items-center space-x-4 stagger-item">
                        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                        <span className="text-lg">Multi-language support for international travelers</span>
                      </div>
                      <div className="flex items-center space-x-4 stagger-item">
                        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                        <span className="text-lg">Integration with local emergency services worldwide</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="text-center fade-in-up">
              <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-2 border-primary/20 shadow-2xl max-w-5xl mx-auto">
                <CardContent className="p-12">
                  <h3 className="text-3xl font-bold mb-6 text-foreground">Your Safety is Our Priority</h3>
                  <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                    Every second counts in an emergency. SafeTour AI ensures you're never alone, no matter where your
                    travels take you. Join millions of travelers who trust our AI-powered safety network.
                  </p>
                  <Button
                    size="lg"
                    className="text-xl px-12 py-6 bg-accent hover:bg-accent/90 shadow-xl card-hover-effect"
                    onClick={() => onNavigate("emergency")}
                  >
                    <AlertTriangle className="h-6 w-6 mr-3" />
                    Access Emergency Features
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-16 bg-gradient-to-r from-card to-card/80 border-t-2 border-primary/20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl p-3">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <span className="text-2xl font-bold text-foreground">SafeTour AI</span>
            </div>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Smart Tourist Safety Monitoring System - Protecting travelers worldwide with cutting-edge AI technology
              and 24/7 emergency response
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <span>© 2024 SafeTour AI. All rights reserved.</span>
              <span>•</span>
              <span className="font-medium">Welcome, {userName}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
