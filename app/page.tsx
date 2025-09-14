"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Camera,
  Mic,
  Pill,
  MessageCircle,
  Volume2,
  Sun,
  Moon,
  Phone,
  User,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { getHealthStats, getRecentHealthRecords } from "@/lib/health-records";
import Link from "next/link";

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [healthStats, setHealthStats] = useState({
    totalRecords: 0,
    skinAnalyses: 0,
    voiceLogs: 0,
    medicationScans: 0,
    chatSessions: 0,
  });
  const [recentRecords, setRecentRecords] = useState<any[]>([]);

  const { user, signIn, signOut, showAuthModal, loading } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (user) {
      // Load health statistics and recent records for authenticated users
      getHealthStats().then(setHealthStats).catch(console.error);
      getRecentHealthRecords().then(setRecentRecords).catch(console.error);
    } else {
      // Clear data when user logs out
      setHealthStats({
        totalRecords: 0,
        skinAnalyses: 0,
        voiceLogs: 0,
        medicationScans: 0,
        chatSessions: 0,
      });
      setRecentRecords([]);
    }
  }, [user]);

  // Refresh data when page becomes visible (e.g., after returning from analysis)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        refreshData();
      }
    };

    const handleFocus = () => {
      if (user) {
        refreshData();
      }
    };

    // Also refresh when the page loads (in case user navigated back)
    const handlePageShow = () => {
      if (user) {
        refreshData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [user]);

  const refreshData = async () => {
    if (user) {
      try {
        const [stats, records] = await Promise.all([
          getHealthStats(),
          getRecentHealthRecords(),
        ]);
        setHealthStats(stats);
        setRecentRecords(records);
      } catch (error) {
        console.error("Error refreshing data:", error);
      }
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    // Voice synthesis would be implemented here
    if (!isVoiceEnabled) {
      speak("Voice navigation enabled. You can now use voice commands.");
    }
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

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
  ];

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
                <h1 className="text-xl font-bold text-foreground font-work-sans">
                  MediVision Assistant
                </h1>
                <p className="text-sm text-muted-foreground">
                  Your AI healthcare companion
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Authentication UI */}
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user.email}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async (e) => {
                      e.preventDefault();
                      setIsSigningOut(true);
                      try {
                        await signOut();
                      } catch (error) {
                        console.error("Sign out failed:", error);
                      } finally {
                        setIsSigningOut(false);
                      }
                    }}
                    disabled={isSigningOut}
                    className="touch-target"
                  >
                    {isSigningOut ? "Signing Out..." : "Sign Out"}
                  </Button>
                  <Link href="/health-records">
                    <Button
                      variant="outline"
                      size="sm"
                      className="touch-target"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Records
                    </Button>
                  </Link>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={showAuthModal}
                  className="touch-target"
                >
                  Sign In
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={toggleVoice}
                className={`touch-target ${
                  isVoiceEnabled ? "bg-primary text-primary-foreground" : ""
                }`}
                aria-label={
                  isVoiceEnabled
                    ? "Disable voice navigation"
                    : "Enable voice navigation"
                }
              >
                <Volume2 className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={toggleDarkMode}
                className="touch-target bg-transparent"
                aria-label={
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  alert(
                    "Emergency services would be contacted in a real implementation. This is a demo."
                  );
                  if (typeof window !== "undefined" && window.speechSynthesis) {
                    const utterance = new SpeechSynthesisUtterance(
                      "Emergency mode activated. This would contact emergency services in a real implementation."
                    );
                    window.speechSynthesis.speak(utterance);
                  }
                }}
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
                <CardTitle className="text-lg font-work-sans">
                  {user ? "Your Health Summary" : "Today's Health Status"}
                </CardTitle>
                <CardDescription>
                  {user
                    ? "Your personal health data overview"
                    : "Overall wellness indicator"}
                </CardDescription>
              </div>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 text-sm px-3 py-1"
              >
                {user ? "Active" : "Good"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {healthStats.totalRecords}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Records
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {healthStats.skinAnalyses}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Skin Analysis
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {healthStats.voiceLogs}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Voice Logs
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {healthStats.medicationScans}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Medications
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {healthStats.chatSessions}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Chat Sessions
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">
                    Sign in to track your health data and get personalized
                    insights
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={showAuthModal}
                    className="touch-target"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign In to Get Started
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground font-work-sans">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Link key={action.id} href={action.href}>
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      speak(`Opening ${action.title}`);
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
                        <h3 className="font-semibold text-lg text-foreground font-work-sans">
                          {action.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {action.description}
                        </p>
                        {!user && (
                          <p className="text-xs text-orange-600 mt-1">
                            Sign in to save your data
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="font-work-sans">Recent Activity</CardTitle>
            <CardDescription>
              {user
                ? "Your latest health interactions"
                : "Example health interactions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user ? (
              recentRecords.length > 0 ? (
                <div className="space-y-3">
                  {recentRecords.map((record) => {
                    const getIcon = (type: string) => {
                      switch (type) {
                        case "skin_analysis":
                          return <Camera className="w-4 h-4 text-white" />;
                        case "voice_log":
                          return <Mic className="w-4 h-4 text-white" />;
                        case "medication_scan":
                          return <Pill className="w-4 h-4 text-white" />;
                        case "chat_session":
                          return (
                            <MessageCircle className="w-4 h-4 text-white" />
                          );
                        default:
                          return <Heart className="w-4 h-4 text-white" />;
                      }
                    };

                    const getBgColor = (type: string) => {
                      switch (type) {
                        case "skin_analysis":
                          return "bg-blue-500";
                        case "voice_log":
                          return "bg-green-500";
                        case "medication_scan":
                          return "bg-purple-500";
                        case "chat_session":
                          return "bg-orange-500";
                        default:
                          return "bg-gray-500";
                      }
                    };

                    return (
                      <div
                        key={record.id}
                        className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                      >
                        <div
                          className={`w-8 h-8 ${getBgColor(
                            record.type
                          )} rounded-full flex items-center justify-center`}
                        >
                          {getIcon(record.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {record.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(record.created_at).toLocaleDateString()}{" "}
                            at{" "}
                            {new Date(record.created_at).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">
                    Use the Quick Actions above to get started!
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your activity will appear here
                  </p>
                </div>
              )
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Skin analysis completed
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Sign in to see your activity
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Mic className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Voice symptoms logged</p>
                    <p className="text-xs text-muted-foreground">
                      Sign in to track your health
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
