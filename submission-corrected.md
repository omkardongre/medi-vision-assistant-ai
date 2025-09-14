This is a submission for the [Google AI Studio Multimodal Challenge](https://dev.to/challenges/google-ai-studio-2025-09-03)

## What I Built

MediVision Assistant - An AI-powered healthcare companion that makes medical assistance accessible to everyone, especially those with visual impairments or accessibility needs. The app combines computer vision, voice recognition, and AI chat to provide comprehensive health monitoring and assistance.

Key Features:

- 🖼️ AI Skin Analysis - Upload photos for instant skin condition assessment
- 🎥 Video Health Analysis - Upload videos for comprehensive health monitoring and assessment
- 🎤 Voice Symptom Logger - Record and transcribe health symptoms using speech-to-text
- 💊 Medication Scanner - OCR-powered medication identification and management
- 💬 AI Health Chat - Conversational AI for health questions and guidance
- ♿ Full Accessibility Support - Voice navigation, screen reader compatibility, high contrast mode
- 📱 Progressive Web App - Works offline, installable on any device

## Demo

Live Application: https://medivision-assistant-ov3t3b7vaa-uc.a.run.app

GitHub Repository: https://github.com/omkardongre/medi-vision-assistant-ai

### Screenshots

Homepage Dashboard: Clean, accessible dashboard with health summary and quick actions
![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/t953kyqweffpg7wdiflt.png)

Skin Analysis: AI-powered skin condition analysis with detailed insights
![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/yul1vb2f6ib37v4trlt6.png)
![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/npe4ggha14r85n3j9ukw.png)

Voice Logger: Voice-to-text symptom recording with transcription
![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qk52jt47yn8puwqycm2r.png)
![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qfq5rbes56r917w1vhtm.png)

Health Chat: Conversational AI for health questions
![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/u589w00ngr8cu5upwl8w.png)

Health Records
![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3l9y96zckvbavb7fowvx.png)

Accessibility Features: Comprehensive accessibility toolbar with voice navigation
![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0dayoklfqjd6hgkwki6r.png)

## How I Used Google AI Studio

I leveraged Google AI Studio extensively to power the multimodal capabilities:

### 1. Gemini 2.5 Flash for Video Health Analysis

- Integrated Gemini's advanced video analysis capabilities for comprehensive health monitoring
- Analyzes uploaded videos up to 25MB for movement patterns, posture, gait analysis, and health indicators
- Provides detailed health assessments with confidence scores and medical recommendations
- Supports multiple video formats (MP4, MOV, AVI, WebM) with automatic optimization

### 2. Gemini 2.0 Flash Experimental for Skin Analysis

- Integrated Gemini's vision capabilities to analyze uploaded skin photos
- Provides detailed assessments of skin conditions, moles, rashes, and other dermatological concerns
- Returns structured health insights with confidence scores and recommendations

### 3. Gemini 2.0 Flash Experimental for Health Chat

- Powers the conversational AI health assistant
- Processes natural language health questions and provides evidence-based responses
- Maintains conversation context for follow-up questions

### 4. Multimodal Integration

- Combined text, image, video, and voice inputs for comprehensive health monitoring

## Multimodal Features

### 🎥 Video + Text Analysis

- Video Health Monitoring: Users upload videos for comprehensive health analysis including movement patterns, posture, and gait
- Exercise Form Analysis: AI evaluates exercise techniques and provides improvement recommendations
- Symptom Documentation: Video recordings of symptoms for detailed medical assessment
- Progress Tracking: Visual health progress monitoring over time with video comparisons

### 🖼️ Image + Text Analysis

- Skin Photo Analysis: Users upload photos of skin conditions, and Gemini analyzes them for potential health concerns
- Medication OCR: Scans medication labels and bottles to extract drug information, dosages, and instructions
- Visual Health Monitoring: Tracks changes in skin conditions over time with AI-powered analysis

### 🎤 Voice + Text Processing

- Voice Symptom Logger: Records audio descriptions of symptoms and converts them to structured text
- Voice Navigation: Complete app navigation using voice commands ("go home", "skin analysis", "emergency")
- Audio Feedback: Text-to-speech responses for accessibility

### 💬 Conversational AI

- Contextual Health Chat: AI remembers previous conversations and provides personalized health guidance
- Multimodal Queries: Users can ask questions about their uploaded images, voice recordings, or general health topics
- Emergency Response: Voice-activated emergency protocols with immediate AI assistance

### ♿ Accessibility-First Design

- Screen Reader Compatible: Full ARIA labels and semantic HTML
- Voice Commands: Navigate the entire app using voice ("skin analysis", "medication scanner", "help")
- High Contrast Mode: Enhanced visibility for users with visual impairments
- Font Scaling: Adjustable text size up to 300%
- Keyboard Navigation: Complete app functionality without mouse

### 🔄 Data Integration

- Health Records: All multimodal inputs (videos, images, voice, chat) are stored and organized
- Export Capabilities: Users can export their health data for medical consultations
- Video Storage: Secure video analysis results with privacy protection

## Technical Implementation

- Frontend: Next.js 15 with TypeScript and Tailwind CSS
- AI Integration: Google AI Studio with Gemini 2.5 Flash (video) and Gemini 2.0 Flash Experimental (image/text)
- Voice Processing: Web Speech API for speech-to-text and text-to-speech
- Image Processing: Canvas API for image optimization and preprocessing
- Deployment: Google Cloud Run with automatic scaling
- Database: Supabase for health records and user data
- Accessibility: WCAG 2.1 AA compliant with comprehensive testing

## Impact & Accessibility

This project demonstrates how AI can make healthcare more accessible to everyone, particularly:

- Visually impaired users who can navigate entirely by voice
- Elderly users who may have difficulty with complex interfaces
- Users with motor disabilities who rely on voice commands
- Non-native speakers who can describe symptoms in their own words

The multimodal approach ensures that health monitoring is not limited by traditional input methods, making medical assistance truly inclusive.

---

Built with ❤️ for the Google AI Studio Multimodal Challenge
