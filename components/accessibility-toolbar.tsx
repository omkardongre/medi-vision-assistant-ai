"use client"

import { Button } from "@/components/ui/button"
import { useAccessibility } from "@/components/accessibility-provider"
import { Volume2, VolumeX, Type, Contrast, Mic, MicOff, Settings, Phone, Sun, Moon } from "lucide-react"
import { useState } from "react"

export function AccessibilityToolbar() {
  const {
    voiceEnabled,
    setVoiceEnabled,
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    speak,
    startVoiceCommand,
    isListeningForCommand,
  } = useAccessibility()

  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleVoice = () => {
    const newState = !voiceEnabled
    setVoiceEnabled(newState)
    if (newState) {
      speak("Voice navigation enabled. Press Control Space to give voice commands.")
    }
  }

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 25, 200)
    setFontSize(newSize)
    speak(`Font size increased to ${newSize} percent`)
  }

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 25, 75)
    setFontSize(newSize)
    speak(`Font size decreased to ${newSize} percent`)
  }

  const toggleContrast = () => {
    const newState = !highContrast
    setHighContrast(newState)
    speak(newState ? "High contrast mode enabled" : "High contrast mode disabled")
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
    speak(isDarkMode ? "Light mode enabled" : "Dark mode enabled")
  }

  const activateEmergency = () => {
    speak("Emergency mode activated. This would contact emergency services in a real implementation.")
    // In a real app, this would trigger emergency protocols
    alert("Emergency services would be contacted in a real implementation")
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 bg-card border border-border rounded-lg p-2 shadow-lg">
      {/* Voice Controls */}
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleVoice}
          className={`touch-target ${voiceEnabled ? "bg-primary text-primary-foreground" : ""}`}
          aria-label={voiceEnabled ? "Disable voice navigation" : "Enable voice navigation"}
          title={voiceEnabled ? "Disable voice navigation" : "Enable voice navigation"}
        >
          {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={startVoiceCommand}
          disabled={!voiceEnabled}
          className={`touch-target ${isListeningForCommand ? "bg-red-500 text-white animate-pulse" : ""}`}
          aria-label="Start voice command"
          title="Start voice command (Ctrl+Space)"
        >
          {isListeningForCommand ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </Button>
      </div>

      {/* Visual Controls */}
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={decreaseFontSize}
          className="touch-target bg-transparent"
          aria-label="Decrease font size"
          title="Decrease font size"
        >
          <Type className="w-3 h-3" />
          <span className="text-xs">-</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={increaseFontSize}
          className="touch-target bg-transparent"
          aria-label="Increase font size"
          title="Increase font size"
        >
          <Type className="w-3 h-3" />
          <span className="text-xs">+</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleContrast}
          className={`touch-target ${highContrast ? "bg-primary text-primary-foreground" : ""}`}
          aria-label={highContrast ? "Disable high contrast" : "Enable high contrast"}
          title={highContrast ? "Disable high contrast" : "Enable high contrast"}
        >
          <Contrast className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleDarkMode}
          className="touch-target bg-transparent"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>

      {/* Emergency and Settings */}
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={activateEmergency}
          className="touch-target bg-red-500 text-white hover:bg-red-600"
          aria-label="Emergency contact"
          title="Emergency contact"
        >
          <Phone className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="touch-target bg-transparent"
          aria-label="Accessibility settings"
          title="Accessibility settings"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Instructions */}
      <div className="text-xs text-muted-foreground p-2 max-w-48">
        <p>Press Ctrl+Space for voice commands</p>
        <p>Use Tab to navigate</p>
      </div>
    </div>
  )
}
