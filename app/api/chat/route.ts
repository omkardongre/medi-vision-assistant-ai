import { type NextRequest, NextResponse } from "next/server"
import { getGeminiProModel, HEALTH_PROMPTS } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 })
    }

    const model = getGeminiProModel()

    // Build conversation context
    let conversationContext = HEALTH_PROMPTS.generalHealth + "\n\n"

    if (conversationHistory.length > 0) {
      conversationContext += "Previous conversation:\n"
      conversationHistory.slice(-10).forEach((msg: any) => {
        conversationContext += `${msg.role}: ${msg.content}\n`
      })
      conversationContext += "\n"
    }

    conversationContext += `User: ${message}\nAssistant:`

    const result = await model.generateContent(conversationContext)
    const response = await result.response
    const assistantMessage = response.text()

    return NextResponse.json({
      success: true,
      message: assistantMessage,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in chat:", error)
    return NextResponse.json(
      {
        error: "Failed to process chat message",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
