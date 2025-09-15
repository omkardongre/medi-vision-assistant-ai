# 🔧 Chrome Built-in AI APIs Reference Guide

> **Quick reference for implementing Chrome's built-in AI APIs in MediVision Assistant**

---

## 📚 **Available APIs Overview**

| API                 | Purpose                   | Input                  | Output              | Use Case in MediVision                     |
| ------------------- | ------------------------- | ---------------------- | ------------------- | ------------------------------------------ |
| **Prompt API**      | Multimodal AI processing  | Text, Image, Audio     | Structured response | Skin analysis, video analysis, health chat |
| **Proofreader API** | Grammar correction        | Text                   | Corrected text      | Health report grammar checking             |
| **Summarizer API**  | Content summarization     | Text                   | Summary             | Medical article summarization              |
| **Translator API**  | Language translation      | Text + target language | Translated text     | Health advice translation                  |
| **Writer API**      | Original content creation | Prompt                 | Generated text      | Health advice generation                   |
| **Rewriter API**    | Content improvement       | Text                   | Improved text       | Accessibility-friendly health content      |

---

## 💭 **Prompt API - Multimodal AI Processing**

### **Basic Usage**

```javascript
// Check if API is available
if ("ai" in navigator && "prompt" in navigator.ai) {
  const result = await navigator.ai.prompt({
    text: "Analyze this skin condition for health concerns",
    image: imageData, // base64 or File object
    audio: audioData, // base64 or File object
    options: {
      temperature: 0.7,
      maxTokens: 1000,
    },
  });

  console.log(result.text);
}
```

### **MediVision Implementation**

```javascript
// Skin Analysis
async function analyzeSkin(imageFile) {
  const result = await navigator.ai.prompt({
    text: `Analyze this skin image for potential health concerns. 
           Look for: moles, rashes, lesions, discoloration, or other abnormalities.
           Provide: condition assessment, confidence level, recommendations.`,
    image: imageFile,
    options: {
      temperature: 0.3, // Lower temperature for medical accuracy
      maxTokens: 500,
    },
  });

  return {
    analysis: result.text,
    confidence: extractConfidence(result.text),
    recommendations: extractRecommendations(result.text),
  };
}

// Video Analysis (frame by frame)
async function analyzeVideo(videoFile) {
  const frames = await extractVideoFrames(videoFile);
  const analyses = [];

  for (const frame of frames) {
    const result = await navigator.ai.prompt({
      text: "Analyze this video frame for health indicators: posture, movement, skin condition, or other health-related observations.",
      image: frame,
      options: { temperature: 0.3, maxTokens: 300 },
    });
    analyses.push(result.text);
  }

  return combineVideoAnalysis(analyses);
}

// Health Chat
async function processHealthChat(message, conversationHistory) {
  const context = conversationHistory
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n");

  const result = await navigator.ai.prompt({
    text: `You are MediVision Assistant, a healthcare AI companion.
           Previous conversation:
           ${context}
           
           User message: ${message}
           
           Provide helpful, accurate health guidance. Always recommend consulting healthcare professionals for serious concerns.`,
    options: {
      temperature: 0.7,
      maxTokens: 800,
    },
  });

  return result.text;
}
```

---

## 🔤 **Proofreader API - Grammar Correction**

### **Basic Usage**

```javascript
if ("ai" in navigator && "proofreader" in navigator.ai) {
  const result = await navigator.ai.proofreader({
    text: "I have been experincing headaches for 3 days",
    options: {
      language: "en-US",
      style: "formal",
    },
  });

  console.log(result.correctedText);
  console.log(result.corrections); // Array of corrections made
}
```

### **MediVision Implementation**

```javascript
// Health Report Grammar Correction
async function correctHealthReport(reportText) {
  const result = await navigator.ai.proofreader({
    text: reportText,
    options: {
      language: "en-US",
      style: "medical", // Medical writing style
      preserveMedicalTerms: true,
    },
  });

  return {
    originalText: reportText,
    correctedText: result.correctedText,
    corrections: result.corrections,
    confidence: result.confidence,
  };
}

// User Input Grammar Correction
async function correctUserInput(userInput) {
  const result = await navigator.ai.proofreader({
    text: userInput,
    options: {
      language: "en-US",
      style: "conversational",
      preserveMedicalTerms: true,
    },
  });

  return result.correctedText;
}
```

---

## 📄 **Summarizer API - Content Summarization**

### **Basic Usage**

```javascript
if ("ai" in navigator && "summarizer" in navigator.ai) {
  const result = await navigator.ai.summarizer({
    text: "Long medical article text...",
    options: {
      maxLength: 200,
      style: "bullet-points",
    },
  });

  console.log(result.summary);
}
```

### **MediVision Implementation**

```javascript
// Medical Article Summarization
async function summarizeMedicalArticle(articleText) {
  const result = await navigator.ai.summarizer({
    text: articleText,
    options: {
      maxLength: 300,
      style: "medical",
      focus: "key-points",
      includeRecommendations: true,
    },
  });

  return {
    summary: result.summary,
    keyPoints: result.keyPoints,
    recommendations: result.recommendations,
    confidence: result.confidence,
  };
}

// Health Record Summarization
async function summarizeHealthRecords(records) {
  const combinedText = records
    .map((record) => `${record.date}: ${record.type} - ${record.content}`)
    .join("\n");

  const result = await navigator.ai.summarizer({
    text: combinedText,
    options: {
      maxLength: 400,
      style: "medical-timeline",
      focus: "trends-and-patterns",
    },
  });

  return result.summary;
}
```

---

## 🌐 **Translator API - Language Translation**

### **Basic Usage**

```javascript
if ("ai" in navigator && "translator" in navigator.ai) {
  const result = await navigator.ai.translator({
    text: "Take this medication twice daily with food",
    targetLanguage: "es",
    options: {
      preserveMedicalTerms: true,
      style: "medical",
    },
  });

  console.log(result.translatedText);
}
```

### **MediVision Implementation**

```javascript
// Health Advice Translation
async function translateHealthAdvice(advice, targetLanguage) {
  const result = await navigator.ai.translator({
    text: advice,
    targetLanguage: targetLanguage,
    options: {
      preserveMedicalTerms: true,
      style: "medical",
      includePronunciation: true,
    },
  });

  return {
    originalText: advice,
    translatedText: result.translatedText,
    pronunciation: result.pronunciation,
    confidence: result.confidence,
  };
}

// Medication Instructions Translation
async function translateMedicationInstructions(instructions, targetLanguage) {
  const result = await navigator.ai.translator({
    text: instructions,
    targetLanguage: targetLanguage,
    options: {
      preserveMedicalTerms: true,
      style: "medical-instructions",
      includeDosageInfo: true,
    },
  });

  return result.translatedText;
}
```

---

## ✏️ **Writer API - Original Content Creation**

### **Basic Usage**

```javascript
if ("ai" in navigator && "writer" in navigator.ai) {
  const result = await navigator.ai.writer({
    prompt: "Write a health tip about staying hydrated",
    options: {
      style: "informative",
      length: "short",
      tone: "friendly",
    },
  });

  console.log(result.generatedText);
}
```

### **MediVision Implementation**

```javascript
// Health Advice Generation
async function generateHealthAdvice(topic, userContext) {
  const result = await navigator.ai.writer({
    prompt: `Generate helpful health advice about ${topic} for a user with the following context: ${userContext}`,
    options: {
      style: "medical-advice",
      length: "medium",
      tone: "supportive",
      includeWarnings: true,
      includeRecommendations: true,
    },
  });

  return {
    advice: result.generatedText,
    warnings: result.warnings,
    recommendations: result.recommendations,
    confidence: result.confidence,
  };
}

// Medication Reminder Generation
async function generateMedicationReminder(medication, dosage, frequency) {
  const result = await navigator.ai.writer({
    prompt: `Generate a friendly medication reminder for ${medication}, ${dosage}, ${frequency}`,
    options: {
      style: "reminder",
      length: "short",
      tone: "caring",
      includeTips: true,
    },
  });

  return result.generatedText;
}
```

---

## 🖊️ **Rewriter API - Content Improvement**

### **Basic Usage**

```javascript
if ("ai" in navigator && "rewriter" in navigator.ai) {
  const result = await navigator.ai.rewriter({
    text: "Take this medicine",
    options: {
      style: "more-accessible",
      targetAudience: "elderly",
      preserveMeaning: true,
    },
  });

  console.log(result.rewrittenText);
}
```

### **MediVision Implementation**

```javascript
// Accessibility-Friendly Health Content
async function makeContentAccessible(healthContent) {
  const result = await navigator.ai.rewriter({
    text: healthContent,
    options: {
      style: "accessible",
      targetAudience: "elderly-and-disabled",
      preserveMedicalAccuracy: true,
      useSimpleLanguage: true,
      includeVisualCues: true,
    },
  });

  return {
    originalText: healthContent,
    rewrittenText: result.rewrittenText,
    accessibilityLevel: result.accessibilityLevel,
    changes: result.changes,
  };
}

// Health Content for Different Reading Levels
async function adaptContentReadingLevel(content, targetLevel) {
  const result = await navigator.ai.rewriter({
    text: content,
    options: {
      style: "reading-level-adaptation",
      targetReadingLevel: targetLevel, // "elementary", "middle-school", "high-school", "college"
      preserveMedicalAccuracy: true,
      includeDefinitions: true,
    },
  });

  return result.rewrittenText;
}
```

---

## 🔧 **Implementation Utilities**

### **API Availability Check**

```javascript
function checkChromeAIAvailability() {
  const apis = {
    prompt: "prompt" in navigator.ai,
    proofreader: "proofreader" in navigator.ai,
    summarizer: "summarizer" in navigator.ai,
    translator: "translator" in navigator.ai,
    writer: "writer" in navigator.ai,
    rewriter: "rewriter" in navigator.ai,
  };

  return {
    available: apis,
    allAvailable: Object.values(apis).every(Boolean),
    anyAvailable: Object.values(apis).some(Boolean),
  };
}
```

### **Error Handling**

```javascript
async function safeChromeAICall(apiCall) {
  try {
    const result = await apiCall();
    return { success: true, data: result };
  } catch (error) {
    console.error("Chrome AI API Error:", error);
    return {
      success: false,
      error: error.message,
      fallback: true,
    };
  }
}
```

### **Offline Detection**

```javascript
function isOffline() {
  return !navigator.onLine;
}

function handleOfflineMode() {
  if (isOffline()) {
    // Show offline indicator
    // Use cached data
    // Provide offline functionality
    return true;
  }
  return false;
}
```

---

## 🎯 **MediVision Feature Mapping**

### **Current Features → Chrome APIs**

| Current Feature      | Chrome API      | Implementation                 |
| -------------------- | --------------- | ------------------------------ |
| Skin Analysis        | Prompt API      | Image + health prompt          |
| Video Analysis       | Prompt API      | Video frames + analysis prompt |
| Health Chat          | Prompt API      | Text + conversation context    |
| Voice Logger         | Prompt API      | Audio + transcription          |
| Medication Scanner   | Prompt API      | Image + medication prompt      |
| Health Reports       | Proofreader API | Grammar correction             |
| Medical Articles     | Summarizer API  | Content summarization          |
| Health Advice        | Writer API      | Original content generation    |
| Multilingual Support | Translator API  | Health content translation     |
| Accessibility        | Rewriter API    | Content adaptation             |

### **New Features with Chrome APIs**

| New Feature        | Chrome API      | Purpose                       |
| ------------------ | --------------- | ----------------------------- |
| Grammar Check      | Proofreader API | Improve health report quality |
| Article Summary    | Summarizer API  | Quick medical information     |
| Health Translation | Translator API  | Multilingual health support   |
| Advice Generation  | Writer API      | Personalized health tips      |
| Content Adaptation | Rewriter API    | Accessibility improvements    |

---

## 🚀 **Getting Started**

### **1. Enable Chrome AI APIs**

```javascript
// Check if running in Chrome with AI support
if (typeof navigator !== "undefined" && "ai" in navigator) {
  console.log("Chrome AI APIs available!");
} else {
  console.log("Chrome AI APIs not available");
}
```

### **2. Test Basic Functionality**

```javascript
async function testChromeAI() {
  try {
    const result = await navigator.ai.prompt({
      text: "Hello, this is a test of Chrome AI APIs",
    });
    console.log("Chrome AI working:", result.text);
    return true;
  } catch (error) {
    console.error("Chrome AI test failed:", error);
    return false;
  }
}
```

### **3. Implement Fallbacks**

```javascript
async function analyzeWithFallback(input) {
  // Try Chrome AI first
  if ("ai" in navigator) {
    try {
      return await navigator.ai.prompt({ text: input });
    } catch (error) {
      console.log("Chrome AI failed, using fallback");
    }
  }

  // Fallback to existing implementation
  return await fallbackAnalysis(input);
}
```

---

**This reference guide will help you implement Chrome's built-in AI APIs in your MediVision Assistant!** 🚀
