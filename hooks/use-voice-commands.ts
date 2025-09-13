"use client"

import { useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"

interface VoiceCommand {
  phrases: string[]
  action: () => void
  description: string
}

interface UseVoiceCommandsOptions {
  enabled: boolean
  onCommandRecognized?: (command: string) => void
  onListening?: (listening: boolean) => void
}

export function useVoiceCommands({ enabled, onCommandRecognized, onListening }: UseVoiceCommandsOptions) {
  const router = useRouter()
  const recognitionRef = useRef<any>(null)
  const isListeningRef = useRef(false)
  const commands = [
    {
      phrases: ["go home", "home page", "main menu"],
      action: () => {
        router.push("/")
        speak("Going to home page")
      },
      description: "Navigate to home page",
    },
    {
      phrases: ["skin analysis", "analyze skin", "take photo", "camera"],
      action: () => {
        router.push("/skin-analysis")
        speak("Opening skin analysis")
      },
      description: "Open skin analysis feature",
    },
    {
      phrases: ["voice logger", "record symptoms", "voice recording"],
      action: () => {
        router.push("/voice-logger")
        speak("Opening voice logger")
      },
      description: "Open voice symptom logger",
    },
    {
      phrases: ["medication", "scan medication", "pill scanner"],
      action: () => {
        router.push("/medication")
        speak("Opening medication scanner")
      },
      description: "Open medication scanner",
    },
    {
      phrases: ["health chat", "chat", "ask question", "talk to assistant"],
      action: () => {
        router.push("/chat")
        speak("Opening health chat")
      },
      description: "Open AI health chat",
    },
    {
      phrases: ["emergency", "help", "call for help", "urgent"],
      action: () => {
        speak("Emergency mode activated. Contacting emergency services.")
        // In a real app, this would trigger emergency protocols
        alert("Emergency services would be contacted in a real implementation")
      },
      description: "Activate emergency mode",
    },
    {
      phrases: ["go back", "previous page", "back"],
      action: () => {
        router.back()
        speak("Going back")
      },
      description: "Go to previous page",
    },
    {
      phrases: ["help", "what can you do", "voice commands", "commands"],
      action: () => {
        const commandList = commands
          .map((cmd) => `Say "${cmd.phrases[0]}" to ${cmd.description.toLowerCase()}`)
          .join(". ")
        speak(`Available voice commands: ${commandList}`)
      },
      description: "List available voice commands",
    },
  ]

  const speak = useCallback((text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1
      speechSynthesis.speak(utterance)
    }
  }, [])

  const processCommand = useCallback(
    (transcript: string) => {
      const normalizedTranscript = transcript.toLowerCase().trim()

      for (const command of commands) {
        for (const phrase of command.phrases) {
          if (normalizedTranscript.includes(phrase.toLowerCase())) {
            onCommandRecognized?.(phrase)
            command.action()
            return true
          }
        }
      }

      // If no command matched, provide feedback
      speak("I didn't understand that command. Say 'help' to hear available commands.")
      return false
    },
    [onCommandRecognized, speak],
  )

  const startListening = useCallback(() => {
    if (!enabled || !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()

    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = false
    recognitionRef.current.lang = "en-US"

    recognitionRef.current.onstart = () => {
      isListeningRef.current = true
      onListening?.(true)
    }

    recognitionRef.current.onend = () => {
      isListeningRef.current = false
      onListening?.(false)
    }

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      processCommand(transcript)
    }

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error)
      isListeningRef.current = false
      onListening?.(false)
    }

    recognitionRef.current.start()
  }, [enabled, processCommand, onListening])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }, [])

  // Set up wake word detection
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Activate voice commands with Ctrl/Cmd + Space
      if ((event.ctrlKey || event.metaKey) && event.code === "Space") {
        event.preventDefault()
        if (!isListeningRef.current) {
          startListening()
          speak("Listening for voice command")
        } else {
          stopListening()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [enabled, startListening, stopListening, speak])

  return {
    startListening,
    stopListening,
    isListening: isListeningRef.current,
    commands: commands.map((cmd) => ({
      phrase: cmd.phrases[0],
      description: cmd.description,
    })),
  }
}
