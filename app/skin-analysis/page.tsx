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
import { formatAnalysisText, parseAnalysisSections } from "@/lib/text-formatter";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Clock,
  Volume2,
  Square,
  Play,
  Pause,
} from "lucide-react";
import type { HealthAnalysisResponse } from "@/lib/gemini";

export default function SkinAnalysisPage() {
  const router = useRouter();
  const { speak, hasError, isSpeaking, isPaused, pause, resume, stop } = useSpeech();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<HealthAnalysisResponse | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleImageCapture = (imageData: string) => {
    setCapturedImage(imageData);
    speak(
      "Photo captured successfully. You can now analyze it or take another photo."
    );
  };

  const handleAnalyze = async (imageData: string) => {
    setIsAnalyzing(true);
    speak("Analyzing your photo. This may take a moment.");

    try {
      const result = await apiClient.analyzeImage(imageData, "skin");
      setAnalysis(result);

      // Speak the analysis summary
      const urgencyMessage =
        result.urgency === "Seek Care"
          ? "This requires medical attention."
          : result.urgency === "Monitor"
          ? "Please monitor this area."
          : "This appears routine.";

      speak(
        `Analysis complete. Confidence level: ${result.confidence}. ${urgencyMessage}`
      );
    } catch (error) {
      console.error("Analysis failed:", error);
      speak("Sorry, the analysis failed. Please try again or contact support.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Seek Care":
        return "bg-red-100 text-red-800 border-red-200";
      case "Monitor":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-green-100 text-green-800 border-green-200";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "Seek Care":
        return <AlertTriangle className="w-4 h-4" />;
      case "Monitor":
        return <Clock className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
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
                Skin Analysis
              </h1>
              <p className="text-sm text-muted-foreground">
                AI-powered skin health assessment
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="font-work-sans">How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                • Take a clear, well-lit photo of the area you want to analyze
              </p>
              <p>• Ensure the area fills most of the frame</p>
              <p>• Avoid shadows and reflections</p>
              <p>
                • This tool provides general guidance only - consult a
                healthcare professional for medical advice
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
                  Analysis Results
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
                         {isSpeaking ? "Speaking..." : hasError ? "Retry Listen" : "Listen"}
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
                AI-powered assessment based on your photo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge className={getUrgencyColor(analysis.urgency)}>
                  {getUrgencyIcon(analysis.urgency)}
                  <span className="ml-1">{analysis.urgency}</span>
                </Badge>
                <Badge variant="outline">
                  Confidence: {analysis.confidence}
                </Badge>
              </div>

              {/* Analysis Text */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                <h4 className="font-bold mb-4 font-work-sans text-xl text-gray-800 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Assessment
                </h4>
                {(() => {
                  const sections = parseAnalysisSections(analysis.analysis);
                  if (sections.length > 0) {
                    return (
                      <div className="space-y-6">
                        {sections.map((section, index) => (
                          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-400">
                            <h5 className="font-semibold text-lg mb-3 text-green-700 flex items-center">
                              <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full mr-2">
                                {index + 1}
                              </span>
                              {section.title}
                            </h5>
                            <div className="text-gray-700 leading-relaxed space-y-2">
                              {section.content.split('\n').filter(line => line.trim()).map((line, lineIndex) => (
                                <p key={lineIndex} className="flex items-start">
                                  <span className="text-green-500 mr-2 mt-1">•</span>
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
                    Recommendations
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

              {/* Important Disclaimer */}
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> This analysis is for informational
                  purposes only and should not replace professional medical
                  advice. Please consult with a healthcare provider for proper
                  diagnosis and treatment.
                </p>
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
                  Analyze Another Photo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/chat")}
                  className="touch-target"
                >
                  Discuss with AI Assistant
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
