"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Bot, User, Send } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  actions?: Array<{
    label: string
    action: () => void
  }>
}

interface ChatbotProps {
  onClose?: () => void
  onEmergencyCall?: () => void
  onLocationHelp?: () => void
  onContactsHelp?: () => void
  onSOSHelp?: () => void
}

export function Chatbot({ onClose, onEmergencyCall, onLocationHelp, onContactsHelp, onSOSHelp }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm the SafeVoyage safety assistant prototype. I can provide general safety guidance and help you find the existing location, contacts, and SOS tools.",
      sender: "bot",
      timestamp: new Date(),
      actions: [
        { label: "Emergency Help", action: () => handleQuickAction("emergency") },
        { label: "Location Issues", action: () => handleQuickAction("location") },
        { label: "Safety Tips", action: () => handleQuickAction("safety") },
        { label: "Contact Support", action: () => handleQuickAction("contact") },
      ],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleQuickAction = (action: string) => {
    let response = ""
    let actions: Array<{ label: string; action: () => void }> = []

    switch (action) {
      case "emergency":
        response =
          "🚨 For immediate emergencies, you can:\n\n1. Call emergency hotline: +1-800-SAFETOUR\n2. Use the SOS button in the app\n3. Contact local emergency services\n\nWould you like me to help you with any of these options?"
        actions = [
          { label: "Call Emergency Hotline", action: () => onEmergencyCall?.() },
          { label: "Open SOS Features", action: () => onSOSHelp?.() },
          { label: "Local Emergency Numbers", action: () => handleQuickAction("local-emergency") },
        ]
        break
      case "location":
        response =
          "📍 I can help you with location-related features:\n\n• GPS tracking setup\n• Safe zone configuration\n• Location sharing with contacts\n• Finding nearby safe places\n\nWhat specific location help do you need?"
        actions = [
          { label: "GPS Setup Help", action: () => onLocationHelp?.() },
          { label: "Safe Zones", action: () => handleQuickAction("safe-zones") },
          { label: "Share Location", action: () => handleQuickAction("share-location") },
        ]
        break
      case "safety":
        response =
          "🛡️ Here are some essential safety tips:\n\n• Always share your location with trusted contacts\n• Keep emergency contacts updated\n• Stay in well-lit, populated areas\n• Trust your instincts\n• Keep your phone charged\n\nWould you like specific safety advice for your current situation?"
        actions = [
          { label: "Travel Safety Tips", action: () => handleQuickAction("travel-tips") },
          { label: "Emergency Contacts", action: () => onContactsHelp?.() },
          { label: "Night Safety", action: () => handleQuickAction("night-safety") },
        ]
        break
      case "contact":
        response =
          "📞 Support integrations are not configured in this prototype. For immediate danger, contact the local emergency service directly. I can also help you find the existing SOS and location tools."
        actions = [
          { label: "Call Support", action: () => onEmergencyCall?.() },
          { label: "Email Support", action: () => handleEmailSupport() },
          { label: "Continue Chat", action: () => handleQuickAction("continue-chat") },
        ]
        break
      case "local-emergency":
        response =
          "🚨 Important Emergency Numbers:\n\n• Police: 911 (US), 112 (EU), 100 (India)\n• Medical: 911 (US), 112 (EU), 108 (India)\n• Fire: 911 (US), 112 (EU), 101 (India)\n\nAlways call local emergency services for immediate help!"
        break
      case "safe-zones":
        response =
          "🏛️ Safe zones are areas marked as secure:\n\n• Tourist information centers\n• Police stations\n• Hospitals and medical centers\n• Embassy/consulate locations\n• Well-reviewed hotels\n\nI can help you find the nearest safe zone to your location."
        actions = [
          { label: "Find Nearest Safe Zone", action: () => onLocationHelp?.() },
          { label: "Set Custom Safe Zone", action: () => handleQuickAction("custom-safe-zone") },
        ]
        break
      case "travel-tips":
        response =
          "✈️ Essential Travel Safety Tips:\n\n• Research your destination beforehand\n• Keep copies of important documents\n• Inform someone of your travel plans\n• Use official transportation\n• Avoid displaying expensive items\n• Stay connected with regular check-ins"
        break
      case "night-safety":
        response =
          "🌙 Night Safety Guidelines:\n\n• Stay in well-lit areas\n• Travel in groups when possible\n• Use official taxi services\n• Keep emergency contacts handy\n• Trust your instincts\n• Have a backup plan"
        break
      default:
        response =
          "I'm here to help! You can ask me about emergency procedures, safety tips, location features, or any other concerns you have while traveling."
    }

    addBotMessage(response, actions)
  }

  const handleEmailSupport = () => {
    const subject = encodeURIComponent("SafeTour AI Support Request")
    const body = encodeURIComponent(
      `Hello SafeVoyage Support Team,\n\nI need assistance with:\n\n[Please describe your issue]\n\nBest regards`,
    )
    window.location.href = `mailto:support@safevoyage.example?subject=${subject}&body=${body}`
  }

  const addBotMessage = (text: string, actions?: Array<{ label: string; action: () => void }>) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "bot",
      timestamp: new Date(),
      actions,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    addUserMessage(inputValue)
    const userInput = inputValue.toLowerCase()
    setInputValue("")
    setIsTyping(true)

    // Simulate bot response delay
    setTimeout(() => {
      setIsTyping(false)

      // Simple keyword-based responses
      if (userInput.includes("emergency") || userInput.includes("help") || userInput.includes("urgent")) {
        handleQuickAction("emergency")
      } else if (userInput.includes("location") || userInput.includes("gps") || userInput.includes("track")) {
        handleQuickAction("location")
      } else if (userInput.includes("safety") || userInput.includes("safe") || userInput.includes("tip")) {
        handleQuickAction("safety")
      } else if (userInput.includes("contact") || userInput.includes("support") || userInput.includes("call")) {
        handleQuickAction("contact")
      } else if (userInput.includes("sos")) {
        addBotMessage(
          "🚨 The SOS feature is for emergencies. You can access it from the main dashboard. In this prototype it creates a local emergency request; notification integrations are not configured yet.",
          [{ label: "Open SOS Features", action: () => onSOSHelp?.() }],
        )
      } else {
        addBotMessage(
          "I understand you're asking about: \"" + inputValue + '". Let me help you with that. Here are some options:',
          [
            { label: "Emergency Help", action: () => handleQuickAction("emergency") },
            { label: "Location Help", action: () => handleQuickAction("location") },
            { label: "Safety Tips", action: () => handleQuickAction("safety") },
            { label: "Contact Support", action: () => handleQuickAction("contact") },
          ],
        )
      }
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className="w-full h-[500px] flex flex-col">
      <div className="p-4 border-b bg-primary/5">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <span className="font-semibold">SafeVoyage Safety Assistant</span>
          <div className="ml-auto flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.sender === "bot" && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div className={`max-w-[80%] ${message.sender === "user" ? "order-first" : ""}`}>
                <div
                  className={`p-3 rounded-lg ${
                    message.sender === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                </div>
                {message.actions && (
                  <div className="mt-2 space-y-1">
                    {message.actions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="mr-2 mb-1 text-xs bg-transparent"
                        onClick={action.action}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              {message.sender === "user" && (
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-secondary" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
