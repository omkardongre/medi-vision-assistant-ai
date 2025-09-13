"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Camera, Mic, Pill, MessageCircle, Volume2, Sun, Moon, Phone } from "lucide-react"

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled)
    // Voice synthesis would be implemented here
    if (!isVoiceEnabled) {
      speak("Voice navigation enabled. You can now use voice commands.")
    }
  }

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1
      speechSynthesis.speak(utterance)
    }
  }

  const quickActions = [
    {
      id: "skin-analysis",
      title: "Skin Analysis",
      description: "Take a photo for AI health assessment",
      icon: Camera,
      color: "bg-blue-500",
      href: "/skin-analysis",
    },
    {
      id: "voice-logger",
      title: "Voice Logger",
      description: "Record symptoms and health notes",
      icon: Mic,
      color: "bg-green-500",
      href: "/voice-logger",
    },
    {
      id: "medication",
      title: "Medication Scanner",
      description: "Scan and manage your medications",
      icon: Pill,
      color: "bg-purple-500",
      href: "/medication",
    },
    {
      id: "health-chat",
      title: "Health Chat",
      description: "Chat with AI health assistant",
      icon: MessageCircle,
      color: "bg-orange-500",
      href: "/chat",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full">
                <Heart className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground font-work-sans">MediVision Assistant</h1>
                <p className="text-sm text-muted-foreground">Your AI healthcare companion</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleVoice}
                className={`touch-target ${isVoiceEnabled ? "bg-primary text-primary-foreground" : ""}`}
                aria-label={isVoiceEnabled ? "Disable voice navigation" : "Enable voice navigation"}
              >
                <Volume2 className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={toggleDarkMode}
                className="touch-target bg-transparent"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="touch-target bg-destructive text-destructive-foreground hover:bg-destructive/90"
                aria-label="Emergency contact"
              >
                <Phone className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Health Status Card */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-work-sans">Today's Health Status</CardTitle>
                <CardDescription>Overall wellness indicator</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-sm px-3 py-1">
                Good
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">No concerning symptoms detected today</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => speak("Your health status is good today. No concerning symptoms detected.")}
                  className="touch-target"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Listen
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground font-work-sans">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Card
                key={action.id}
                className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    speak(`Opening ${action.title}`)
                  }
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 ${action.color} rounded-full flex items-center justify-center touch-target`}
                    >
                      <action.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-foreground font-work-sans">{action.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="font-work-sans">Recent Activity</CardTitle>
            <CardDescription>Your latest health interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Camera className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Skin analysis completed</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Mic className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Voice symptoms logged</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
