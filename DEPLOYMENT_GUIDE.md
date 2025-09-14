# 🚀 MediVision Assistant - Cloud Run Deployment Guide

## 📋 Prerequisites

### 1. Google Cloud Account Setup
- [ ] Google Cloud account created
- [ ] Billing enabled on your project
- [ ] Google Cloud CLI installed and authenticated

### 2. Required Tools
```bash
# Install Google Cloud CLI (if not installed)
# Visit: https://cloud.google.com/sdk/docs/install

# Verify installation
gcloud --version
```

### 3. Docker Setup
```bash
# Verify Docker is installed and running
docker --version
```

## 🔧 Step-by-Step Deployment

### Step 1: Environment Setup

1. **Create Google Cloud Project** (if you don't have one):
```bash
# Create new project
gcloud projects create YOUR_PROJECT_ID --name="MediVision Assistant"

# Set as default project
gcloud config set project YOUR_PROJECT_ID
```

2. **Set Environment Variables**:
```bash
# Set your project ID (REQUIRED)
export PROJECT_ID=your-project-id-here

# Optional: Set custom region (default: us-central1)
export REGION=us-central1
```

### Step 2: Authentication

```bash
# Login to Google Cloud
gcloud auth login

# Configure Docker to use gcloud as credential helper
gcloud auth configure-docker
```

### Step 3: Environment Variables Setup

1. **Check your `.env.local` file** - Make sure it contains:
```env
# Required for production
GOOGLE_AI_API_KEY=your_google_ai_api_key
GCP_PROJECT_ID=your_project_id

# Supabase (if using)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

2. **Important**: Never commit `.env.local` to version control!

### Step 4: Deploy Using Automated Script

```bash
# Make sure you're in the project directory
cd /home/om/medi-vision-assistant-ez

# Set your project ID
export PROJECT_ID=your-project-id-here

# Run the deployment script
./deploy.sh
```

### Step 5: Manual Deployment (Alternative)

If you prefer manual deployment:

1. **Enable Required APIs**:
```bash
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    containerregistry.googleapis.com
```

2. **Build and Push Docker Image**:
```bash
# Build the image
docker build -t gcr.io/$PROJECT_ID/medivision-assistant:latest .

# Push to Container Registry
docker push gcr.io/$PROJECT_ID/medivision-assistant:latest
```

3. **Deploy to Cloud Run**:
```bash
gcloud run deploy medivision-assistant \
    --image gcr.io/$PROJECT_ID/medivision-assistant:latest \
    --region us-central1 \
    --platform managed \
    --allow-unauthenticated \
    --port 3000 \
    --memory 2Gi \
    --cpu 2 \
    --max-instances 100 \
    --set-env-vars NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1
```

## 🔍 Verification & Testing

### 1. Check Deployment Status
```bash
# Get service URL
gcloud run services describe medivision-assistant --region us-central1 --format 'value(status.url)'

# Check service status
gcloud run services list
```

### 2. Test Your Application
1. Open the service URL in your browser
2. Test all core features:
   - [ ] Home page loads
   - [ ] Skin analysis works
   - [ ] Voice logger functions
   - [ ] Chat responds
   - [ ] Health records accessible
   - [ ] Emergency detection triggers

### 3. Monitor Logs
```bash
# View real-time logs
gcloud run logs tail medivision-assistant --region us-central1

# View recent logs
gcloud run logs read medivision-assistant --region us-central1 --limit 50
```

## 🛠️ Troubleshooting

### Common Issues & Solutions

#### 1. Build Failures
```bash
# Check Docker build locally first
docker build -t test-build .

# Check for missing dependencies
npm install
npm run build
```

#### 2. Environment Variable Issues
- Ensure all required environment variables are set
- Check that API keys are valid
- Verify Supabase configuration

#### 3. Memory/CPU Issues
```bash
# Increase resources if needed
gcloud run services update medivision-assistant \
    --memory 4Gi \
    --cpu 4 \
    --region us-central1
```

#### 4. Cold Start Issues
```bash
# Set minimum instances to reduce cold starts
gcloud run services update medivision-assistant \
    --min-instances 1 \
    --region us-central1
```

## 📊 Production Configuration

### Recommended Settings for Competition:
- **Memory**: 2Gi (sufficient for AI processing)
- **CPU**: 2 (handles concurrent requests)
- **Max Instances**: 100 (scales for demo traffic)
- **Timeout**: 300 seconds (AI processing can be slow)
- **Min Instances**: 1 (reduces cold start for judges)

### Security Settings:
- ✅ HTTPS enforced automatically
- ✅ Environment variables encrypted
- ✅ Container runs as non-root user
- ✅ Health checks configured

## 🎯 Post-Deployment Checklist

- [ ] Service URL is accessible
- [ ] All features work correctly
- [ ] Emergency detection triggers properly
- [ ] Voice features function
- [ ] PWA installs correctly
- [ ] Accessibility features work
- [ ] Performance is acceptable (< 3s load time)

## 📝 For Hackathon Submission

### Your Live Demo URL:
```
https://medivision-assistant-[hash]-uc.a.run.app
```

### Key Features to Highlight:
1. **Multimodal AI Integration**
   - Image analysis for skin conditions
   - Audio processing with speech-to-text
   - Real-time chat with Gemini Live API

2. **Accessibility Excellence**
   - Voice navigation with wake word detection
   - High contrast mode and font scaling
   - Screen reader optimization

3. **Emergency Intelligence**
   - Real-time emergency detection
   - Automatic escalation protocols
   - Location sharing for critical situations

4. **PWA Capabilities**
   - Offline functionality
   - Push notifications
   - App-like experience

## 🔄 Updates & Maintenance

### To Update Your Deployment:
```bash
# Rebuild and redeploy
./deploy.sh

# Or manually:
docker build -t gcr.io/$PROJECT_ID/medivision-assistant:latest .
docker push gcr.io/$PROJECT_ID/medivision-assistant:latest
gcloud run deploy medivision-assistant --image gcr.io/$PROJECT_ID/medivision-assistant:latest --region us-central1
```

### To Delete (After Competition):
```bash
# Delete the Cloud Run service
gcloud run services delete medivision-assistant --region us-central1

# Delete container images
gcloud container images delete gcr.io/$PROJECT_ID/medivision-assistant:latest
```

## 🏆 Competition Success Tips

1. **Test thoroughly** before submission deadline
2. **Document the URL** in your DEV.to post
3. **Include screenshots** of the live app
4. **Highlight unique features** in your demo
5. **Ensure 24/7 availability** during judging period

---

**🎉 You're ready to deploy! Your MediVision Assistant is competition-ready and will impress the judges with its advanced multimodal AI capabilities and accessibility features.**
