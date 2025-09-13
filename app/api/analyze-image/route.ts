import { type NextRequest, NextResponse } from "next/server"
import { getGeminiProModel, HEALTH_PROMPTS, parseHealthAnalysis } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    const { imageData, analysisType = "skin" } = await request.json()

    if (!imageData) {
      return NextResponse.json({ error: "No image data provided" }, { status: 400 })
    }

    // Remove data URL prefix if present
    const base64Image = imageData.replace(/^data:image\/[a-z]+;base64,/, "")

    const model = getGeminiProModel()

    // Select appropriate prompt based on analysis type
    const prompt = analysisType === "medication" ? HEALTH_PROMPTS.medicationAnalysis : HEALTH_PROMPTS.skinAnalysis

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg",
        },
      },
    ])

    const response = await result.response
    const analysisText = response.text()

    // Parse the response into structured format
    const structuredAnalysis = parseHealthAnalysis(analysisText)

    return NextResponse.json({
      success: true,
      analysis: structuredAnalysis,
      rawResponse: analysisText,
    })
  } catch (error) {
    console.error("Error analyzing image:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
