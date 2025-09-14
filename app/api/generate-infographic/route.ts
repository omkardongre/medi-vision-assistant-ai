import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google AI with Imagen
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { prompt, type, medicationData } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Create enhanced prompt based on type
    let enhancedPrompt = "";
    
    switch (type) {
      case "medication_schedule":
        enhancedPrompt = `Create a professional medical infographic showing a medication schedule. 
        Medication: ${medicationData?.name || "Medication"}
        Dosage: ${medicationData?.dosage || "As prescribed"}
        Frequency: ${medicationData?.frequency || "Daily"}
        
        Design a clean, accessible infographic with:
        - Clear medication name and dosage
        - Time schedule with clock icons
        - Important safety reminders
        - Professional medical styling
        - High contrast colors for accessibility
        - Simple, readable fonts
        
        Style: Medical infographic, clean design, professional colors, accessible typography`;
        break;
        
      case "health_progress":
        enhancedPrompt = `Create a health progress tracking infographic showing:
        - Progress timeline with milestones
        - Health metrics visualization
        - Achievement badges
        - Motivational elements
        - Clean, modern design
        - Accessible color scheme
        
        Style: Modern health dashboard, clean lines, professional medical styling`;
        break;
        
      case "symptom_tracker":
        enhancedPrompt = `Create a symptom tracking infographic with:
        - Symptom categories and severity scales
        - Tracking timeline
        - Color-coded severity indicators
        - Professional medical styling
        - Clear, accessible design
        
        Style: Medical chart, clean design, professional colors, accessible typography`;
        break;
        
      default:
        enhancedPrompt = `Create a professional health infographic about: ${prompt}
        
        Design requirements:
        - Clean, medical professional styling
        - High contrast colors for accessibility
        - Simple, readable fonts
        - Clear visual hierarchy
        - Informative and educational content
        
        Style: Medical infographic, professional, accessible, clean design`;
    }

    // Use Imagen to generate the infographic
    const model = genAI.getGenerativeModel({ 
      model: "imagen-3.0-generate-001" // Using the latest Imagen model
    });

    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [{
          text: enhancedPrompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });

    const response = await result.response;
    const generatedImage = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;

    if (!generatedImage) {
      throw new Error("Failed to generate image");
    }

    return NextResponse.json({
      success: true,
      imageData: generatedImage.data,
      mimeType: generatedImage.mimeType,
      prompt: enhancedPrompt,
      type: type
    });

  } catch (error) {
    console.error("Imagen generation error:", error);
    
    // Fallback: Return a placeholder or error message
    return NextResponse.json(
      { 
        error: "Failed to generate infographic",
        details: error instanceof Error ? error.message : "Unknown error",
        fallback: true
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
