import { type NextRequest, NextResponse } from "next/server"
import { getGeminiProModel, HEALTH_PROMPTS, parseHealthAnalysis } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File
    const transcript = formData.get("transcript") as string

    if (!audioFile && !transcript) {
      return NextResponse.json({ error: "No audio file or transcript provided" }, { status: 400 })
    }

    const model = getGeminiProModel()
    let analysisText: string

    if (audioFile) {
      // Convert audio to base64
      const arrayBuffer = await audioFile.arrayBuffer()
      const base64Audio = Buffer.from(arrayBuffer).toString("base64")

      const result = await model.generateContent([
        HEALTH_PROMPTS.voiceAnalysis,
        {
          inlineData: {
            data: base64Audio,
            mimeType: audioFile.type || "audio/webm",
          },
        },
      ])

      const response = await result.response
      analysisText = response.text()
    } else {
      // Analyze transcript only
      const result = await model.generateContent([HEALTH_PROMPTS.voiceAnalysis, `Transcript: "${transcript}"`])

      const response = await result.response
      analysisText = response.text()
    }

    // Parse the response into structured format
    const structuredAnalysis = parseHealthAnalysis(analysisText)

    // Extract follow-up questions from the analysis
    const followUpQuestions = extractFollowUpQuestions(analysisText)
    structuredAnalysis.followUpQuestions = followUpQuestions

    return NextResponse.json({
      success: true,
      analysis: structuredAnalysis,
      rawResponse: analysisText,
      transcript: transcript || "Audio analysis without transcript",
    })
  } catch (error) {
    console.error("Error analyzing audio:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze audio",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

function extractFollowUpQuestions(analysisText: string): string[] {
  const questions: string[] = []
  const lines = analysisText.split("\n")

  let inQuestionSection = false
  for (const line of lines) {
    if (line.toLowerCase().includes("follow-up") || line.toLowerCase().includes("questions")) {
      inQuestionSection = true
      continue
    }

    if (inQuestionSection && line.trim()) {
      if (line.includes("?")) {
        questions.push(
          line
            .replace(/^\d+\.\s*/, "")
            .replace(/^[-*]\s*/, "")
            .trim(),
        )
      }

      if (questions.length >= 5) break // Limit to 5 questions
    }
  }

  return questions
}
