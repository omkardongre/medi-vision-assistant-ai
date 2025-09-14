"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CameraCapture } from "@/components/camera-capture";
import { apiClient } from "@/lib/api-client";
import { useSpeech } from "@/hooks/use-speech";
import {
  formatAnalysisText,
  parseAnalysisSections,
} from "@/lib/text-formatter";
import {
  ArrowLeft,
  Pill,
  AlertTriangle,
  Info,
  Volume2,
  Clock,
  Square,
  Play,
  Pause,
} from "lucide-react";
import type { HealthAnalysisResponse } from "@/lib/gemini";

export default function MedicationPage() {
  const router = useRouter();
  const { speak, hasError, isSpeaking, isPaused, pause, resume, stop } =
    useSpeech();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<HealthAnalysisResponse | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleImageCapture = (imageData: string) => {
    setCapturedImage(imageData);
    speak(
      "Medication photo captured successfully. You can now analyze it or take another photo."
    );
  };

  const handleAnalyze = async (imageData: string) => {
    setIsAnalyzing(true);
    speak("Analyzing your medication. This may take a moment.");

    try {
      const result = await apiClient.analyzeImage(imageData, "medication");
      setAnalysis(result);
      speak(
        "Medication analysis complete. Please review the information carefully."
      );
    } catch (error) {
      console.error("Analysis failed:", error);
      speak(
        "Sorry, the medication analysis failed. Please try again or contact support."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

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
              <h1 className="text-xl font-bold text-foreground font-work-sans">
                Medication Scanner
              </h1>
              <p className="text-sm text-muted-foreground">
                Identify and manage your medications
              </p>
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
              <p>
                • Include the medication name, dosage, and instructions if
                visible
              </p>
              <p>
                • This tool provides general information only - always consult
                your pharmacist or doctor
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Camera Component */}
        <CameraCapture
          onCapture={handleImageCapture}
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
        />

        {/* Analysis Results */}
        {analysis && (
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-work-sans">
                  Medication Information
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (isPaused) {
                        resume();
                       } else {
                         console.log(
                           "Listen button clicked, analysis text:",
                           analysis.analysis
                         );
                         speak(formatAnalysisText(analysis.analysis));
                       }
                    }}
                    className="touch-target"
                    disabled={isSpeaking && !isPaused}
                  >
                    {isPaused ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 mr-2" />
                        {isSpeaking
                          ? "Speaking..."
                          : hasError
                          ? "Retry Listen"
                          : "Listen"}
                      </>
                    )}
                  </Button>
                  {isSpeaking && !isPaused && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={pause}
                      className="touch-target"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  {(isSpeaking || isPaused) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={stop}
                      className="touch-target"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Stop
                    </Button>
                  )}
                </div>
              </div>
              <CardDescription>
                AI-powered medication identification and information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status Badge */}
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-800 border-blue-200"
                >
                  <Info className="w-4 h-4 mr-1" />
                  Medication Info
                </Badge>
                <Badge variant="outline">
                  Confidence: {analysis.confidence}
                </Badge>
              </div>

              {/* Analysis Text */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                <h4 className="font-bold mb-4 font-work-sans text-xl text-gray-800 flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Medication Details
                </h4>
                {(() => {
                  const sections = parseAnalysisSections(analysis.analysis);
                  if (sections.length > 0) {
                    return (
                      <div className="space-y-6">
                        {sections.map((section, index) => (
                          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-400">
                            <h5 className="font-semibold text-lg mb-3 text-blue-700 flex items-center">
                              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full mr-2">
                                {index + 1}
                              </span>
                              {section.title}
                            </h5>
                            <div className="text-gray-700 leading-relaxed space-y-2">
                              {section.content.split('\n').filter(line => line.trim()).map((line, lineIndex) => (
                                <p key={lineIndex} className="flex items-start">
                                  <span className="text-blue-500 mr-2 mt-1">•</span>
                                  <span>{line.trim()}</span>
                                </p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  } else {
                    return (
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {formatAnalysisText(analysis.analysis)}
                        </p>
                      </div>
                    );
                  }
                })()}
              </div>

              {/* Recommendations */}
              {analysis.recommendations.length > 0 && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
                  <h4 className="font-bold mb-4 font-work-sans text-xl text-gray-800 flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    Important Information
                  </h4>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <ul className="space-y-3">
                      {analysis.recommendations.map((rec, index) => (
                        <li
                          key={index}
                          className="text-gray-700 flex items-start gap-3"
                        >
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full mt-0.5 flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="leading-relaxed">{formatAnalysisText(rec)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
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
                  <p className="text-sm text-blue-800 mb-3">
                    Set up reminders to take your medication on time
                  </p>
                  <Button
                    size="sm"
                    className="touch-target"
                    onClick={() => {
                      // Create a simple reminder using browser notifications
                      if ("Notification" in window) {
                        if (Notification.permission === "granted") {
                          // Create immediate test notification
                          new Notification("MediVision Reminder", {
                            body: "This is a test reminder for your medication. Set up regular reminders in your phone's settings.",
                            icon: "/icon-192.png",
                          });
                          speak(
                            "Test reminder sent! Please set up regular reminders in your phone's notification settings for daily medication reminders."
                          );
                        } else if (Notification.permission !== "denied") {
                          Notification.requestPermission().then(
                            (permission) => {
                              if (permission === "granted") {
                                new Notification("MediVision Reminder", {
                                  body: "Medication reminder notifications are now enabled. Set up regular reminders in your phone's settings.",
                                  icon: "/icon-192.png",
                                });
                                speak(
                                  "Notifications enabled! Please set up regular medication reminders in your phone's settings."
                                );
                              } else {
                                speak(
                                  "Please enable notifications in your browser settings and set up medication reminders in your phone's clock or calendar app."
                                );
                              }
                            }
                          );
                        } else {
                          speak(
                            "Notifications are blocked. Please set up medication reminders in your phone's clock app or calendar."
                          );
                        }
                      } else {
                        speak(
                          "Notifications not supported. Please set up medication reminders in your phone's clock app or calendar."
                        );
                      }
                    }}
                  >
                    Set Reminder
                  </Button>
                </CardContent>
              </Card>

              {/* Important Disclaimer */}
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-red-800 font-medium mb-1">
                      Important Safety Information
                    </p>
                    <p className="text-sm text-red-700">
                      This information is for reference only and should not
                      replace professional medical or pharmaceutical advice.
                      Always consult your doctor or pharmacist before starting,
                      stopping, or changing any medication. If you experience
                      any adverse effects, seek immediate medical attention.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    setAnalysis(null);
                    setCapturedImage(null);
                  }}
                  className="touch-target"
                >
                  Scan Another Medication
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/chat")}
                  className="touch-target"
                >
                  Ask About This Medication
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
