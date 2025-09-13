"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CameraCapture } from "@/components/camera-capture"
import { apiClient } from "@/lib/api-client"
import { useSpeech } from "@/hooks/use-speech"
import { ArrowLeft, Pill, AlertTriangle, Info, Volume2, Clock } from "lucide-react"
import type { HealthAnalysisResponse } from "@/lib/gemini"

export default function MedicationPage() {
  const router = useRouter()
  const { speak } = useSpeech()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<HealthAnalysisResponse | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  const handleImageCapture = (imageData: string) => {
    setCapturedImage(imageData)
    speak("Medication photo captured successfully. You can now analyze it or take another photo.")
  }

  const handleAnalyze = async (imageData: string) => {
    setIsAnalyzing(true)
    speak("Analyzing your medication. This may take a moment.")

    try {
      const result = await apiClient.analyzeImage(imageData, "medication")
      setAnalysis(result)
      speak("Medication analysis complete. Please review the information carefully.")
    } catch (error) {
      console.error("Analysis failed:", error)
      speak("Sorry, the medication analysis failed. Please try again or contact support.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="touch-target"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground font-work-sans">Medication Scanner</h1>
              <p className="text-sm text-muted-foreground">Identify and manage your medications</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-work-sans">
              <Pill className="w-5 h-5" />
              How to Use
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Take a clear photo of the medication label or packaging</p>
              <p>• Ensure all text is readable and well-lit</p>
              <p>• Include the medication name, dosage, and instructions if visible</p>
              <p>• This tool provides general information only - always consult your pharmacist or doctor</p>
            </div>
          </CardContent>
        </Card>

        {/* Camera Component */}
        <CameraCapture onCapture={handleImageCapture} onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

        {/* Analysis Results */}
        {analysis && (
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-work-sans">Medication Information</CardTitle>
                <Button variant="outline" size="sm" onClick={() => speak(analysis.analysis)} className="touch-target">
                  <Volume2 className="w-4 h-4 mr-2" />
                  Listen
                </Button>
              </div>
              <CardDescription>AI-powered medication identification and information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status Badge */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                  <Info className="w-4 h-4 mr-1" />
                  Medication Info
                </Badge>
                <Badge variant="outline">Confidence: {analysis.confidence}</Badge>
              </div>

              {/* Analysis Text */}
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2 font-work-sans">Medication Details</h4>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{analysis.analysis}</p>
              </div>

              {/* Recommendations */}
              {analysis.recommendations.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 font-work-sans">Important Information</h4>
                  <ul className="space-y-1">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Medication Reminders */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-work-sans flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Medication Reminders
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-blue-800 mb-3">Set up reminders to take your medication on time</p>
                  <Button size="sm" className="touch-target">
                    Set Reminder
                  </Button>
                </CardContent>
              </Card>

              {/* Important Disclaimer */}
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-red-800 font-medium mb-1">Important Safety Information</p>
                    <p className="text-sm text-red-700">
                      This information is for reference only and should not replace professional medical or
                      pharmaceutical advice. Always consult your doctor or pharmacist before starting, stopping, or
                      changing any medication. If you experience any adverse effects, seek immediate medical attention.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    setAnalysis(null)
                    setCapturedImage(null)
                  }}
                  className="touch-target"
                >
                  Scan Another Medication
                </Button>
                <Button variant="outline" onClick={() => router.push("/chat")} className="touch-target">
                  Ask About This Medication
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
