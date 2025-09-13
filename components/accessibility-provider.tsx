"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useVoiceCommands } from "@/hooks/use-voice-commands"
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation"
import { useSpeech } from "@/hooks/use-speech"

interface AccessibilityContextType {
  // Voice settings
  voiceEnabled: boolean
  setVoiceEnabled: (enabled: boolean) => void
  voiceSpeed: number
  setVoiceSpeed: (speed: number) => void

  // Visual settings
  fontSize: number
  setFontSize: (size: number) => void
  highContrast: boolean
  setHighContrast: (enabled: boolean) => void
  reducedMotion: boolean
  setReducedMotion: (enabled: boolean) => void

  // Navigation settings
  keyboardNavEnabled: boolean
  setKeyboardNavEnabled: (enabled: boolean) => void

  // Functions
  speak: (text: string) => void
  announceToScreenReader: (message: string) => void
  startVoiceCommand: () => void
  isListeningForCommand: boolean
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  // Voice settings
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [voiceSpeed, setVoiceSpeed] = useState(1)

  // Visual settings
  const [fontSize, setFontSize] = useState(100)
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Navigation settings
  const [keyboardNavEnabled, setKeyboardNavEnabled] = useState(true)
  const [isListeningForCommand, setIsListeningForCommand] = useState(false)

  // Hooks
  const { speak } = useSpeech({ rate: voiceSpeed })
  const { announceToScreenReader } = useKeyboardNavigation({
    enabled: keyboardNavEnabled,
    onNavigate: (direction) => {
      announceToScreenReader(`Navigating ${direction}`)
    },
  })

  const { startListening } = useVoiceCommands({
    enabled: voiceEnabled,
    onCommandRecognized: (command) => {
      announceToScreenReader(`Voice command recognized: ${command}`)
    },
    onListening: setIsListeningForCommand,
  })

  // Apply settings to document
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`
  }, [fontSize])

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
  }, [highContrast])

  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.add("reduce-motion")
    } else {
      document.documentElement.classList.remove("reduce-motion")
    }
  }, [reducedMotion])

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("medivision-accessibility")
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        setVoiceEnabled(settings.voiceEnabled || false)
        setVoiceSpeed(settings.voiceSpeed || 1)
        setFontSize(settings.fontSize || 100)
        setHighContrast(settings.highContrast || false)
        setReducedMotion(settings.reducedMotion || false)
        setKeyboardNavEnabled(settings.keyboardNavEnabled !== false)
      } catch (error) {
        console.error("Failed to load accessibility settings:", error)
      }
    }
  }, [])

  // Save settings to localStorage
  useEffect(() => {
    const settings = {
      voiceEnabled,
      voiceSpeed,
      fontSize,
      highContrast,
      reducedMotion,
      keyboardNavEnabled,
    }
    localStorage.setItem("medivision-accessibility", JSON.stringify(settings))
  }, [voiceEnabled, voiceSpeed, fontSize, highContrast, reducedMotion, keyboardNavEnabled])

  const value: AccessibilityContextType = {
    voiceEnabled,
    setVoiceEnabled,
    voiceSpeed,
    setVoiceSpeed,
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion,
    keyboardNavEnabled,
    setKeyboardNavEnabled,
    speak,
    announceToScreenReader,
    startVoiceCommand: startListening,
    isListeningForCommand,
  }

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}
