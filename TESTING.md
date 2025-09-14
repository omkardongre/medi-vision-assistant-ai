# 🧪 MediVision Assistant - Manual Testing Guide

## 📊 **TESTING STATUS DASHBOARD**

**Overall Progress:** \_\_\_/48 tests completed

### 🔥 **Priority Tests Status (Must Complete First)**

- [ ] Test 20.1: Video Analysis Feature - **COMPETITION WINNER**
- [ ] Test 15.2: Wake Word Detection - **WOW FACTOR**
- [ ] Test 10.1: Emergency Detection - **LIFE-SAVING**
- [ ] Test 19.1: Set Reminder Button - **USER EXPERIENCE**
- [ ] Test 17.1: Sign Out Functionality - **RELIABILITY**
- [ ] Test 18.1: Works Without Auth - **ACCESSIBILITY**

### 📈 **Category Progress Tracker**

- **Authentication Tests (1.1-1.3):** \_\_\_/3 completed
- **Feature Tests (2.1, 3.1, 4.1, 5.1):** \_\_\_/4 completed
- **New Features (15.2, 16.1, 17.1, 18.1, 19.1):** \_\_\_/5 completed
- **Data Management (6.1-6.6):** \_\_\_/6 completed
- **Error Handling (8.1-8.4):** \_\_\_/4 completed

### 🎯 **Demo Readiness Check**

- [ ] All priority tests passing
- [ ] Core functionality working
- [ ] No critical bugs found
- [ ] Ready for judge demo

---

## 📋 **Pre-Testing Setup**

### ✅ **Environment Setup Checklist**

```bash
# 1. Install dependencies
npm install critters
npm install

# 2. Verify .env.local file exists with:
GOOGLE_AI_API_KEY=your_google_ai_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GCP_PROJECT_ID=your_gcp_project_id

# 3. Start development server
npm run dev
# Should start at http://localhost:3000
```

---

## 🌐 **Available Routes & Pages**

| Route             | Description              | Authentication Required                         |
| ----------------- | ------------------------ | ----------------------------------------------- |
| `/`               | Home Dashboard           | No (but enhanced when signed in)                |
| `/skin-analysis`  | Skin Analysis Feature    | No (but data saves only when signed in)         |
| `/medication`     | Medication Scanner       | No (but data saves only when signed in)         |
| `/chat`           | Health Chat Assistant    | No (but conversation saves only when signed in) |
| `/voice-logger`   | Voice Symptom Logger     | No (but data saves only when signed in)         |
| `/health-records` | Health Records Dashboard | Yes (redirects to home if not signed in)        |

---

## 🔐 **Authentication Testing (Priority #1)**

### **Test 1.1: User Registration** - Status: [X] PASS [ ] FAIL [ ] SKIP

1. Navigate to `http://localhost:3000`
2. Click **"Sign In"** button (top-right corner)
3. In modal, click **"Sign Up"** tab
4. Fill form:
   - **Email**: `testuser@example.com`
   - **Password**: `SecurePass123!`
   - **Confirm Password**: `SecurePass123!`
5. Click **"Sign Up"**

**✅ Expected Results:**

- Success message appears
- Modal closes automatically
- Header shows "Welcome, testuser@example.com"
- **"Sign Out"** button appears
- Home page shows personalized content

**❌ Troubleshooting:**

- Check browser console (F12) for errors
- Verify Supabase environment variables
- Check network tab for failed requests

**📝 Test Notes:** _[Add any notes about issues, observations, or special conditions here]_

### **Test 1.2: User Login** - Status: [X] PASS [ ] FAIL [ ] SKIP

1. If signed in, sign out first
2. Click **"Sign In"** button
3. Use credentials from Test 1.1
4. Click **"Sign In"**

**✅ Expected Results:**

- Modal closes
- User dashboard appears
- Health statistics visible (initially all zeros)

**📝 Test Notes:** _[Add any notes about issues, observations, or special conditions here]_

### **Test 1.3: User Logout** - Status: [X] PASS [ ] FAIL [ ] SKIP

1. Click **"Sign Out"** button
2. **✅ Expected**: Returns to public view, no user data visible

**📝 Test Notes:** _[Add any notes about issues, observations, or special conditions here]_

---

## 📸 **Skin Analysis Testing**

### **Test 2.1: Image Upload & Analysis** - Status: [X] PASS [ ] FAIL [ ] SKIP

1. **Prerequisites**: Sign in first
2. Navigate to `/skin-analysis`
3. Upload test image (any photo works)
4. Wait for AI processing

**✅ Expected Results:**

- Loading indicator appears
- AI analysis text displays
- Health recommendations shown
- Response shows `"saved": true`
- Record ID displayed

**📝 Test Notes:** _[Add any notes about issues, observations, or special conditions here]_

### **Test 2.2: Data Persistence Verification** - Status: [X] PASS [ ] FAIL [ ] SKIP

1. After completing Test 2.1
2. Navigate to `/` (home page)
3. **✅ Expected**:
   - Health Summary shows "1" Total Record
   - Health Summary shows "1" Skin Analysis
   - Recent Activity lists your analysis

**📝 Test Notes:** _[Add any notes about issues, observations, or special conditions here]_

### **API Endpoint Test 2.3: Direct API Call**

```bash
# Test the analyze-image endpoint directly
curl -X POST http://localhost:3000/api/analyze-image \
  -H "Content-Type: application/json" \
  -d '{"imageData":"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA...", "analysisType":"skin"}'
```

**✅ Expected Response:**

```json
{
  "success": true,
  "analysis": {...},
  "saved": true,
  "recordId": "uuid-here"
}
```

---

## 💊 **Medication Scanner Testing**

### **Test 3.1: Medication Image Analysis** - Status: [X] PASS [ ] FAIL [ ] SKIP

1. **Prerequisites**: Sign in
2. Navigate to `/medication`
3. Upload image with text/labels (prescription bottle, medicine box)
4. Wait for analysis

**✅ Expected Results:**

- Medication-focused analysis
- Drug interaction warnings (if applicable)
- Safety recommendations
- `"saved": true` confirmation

**📝 Test Notes:** _[Add any notes about issues, observations, or special conditions here]_

### **API Endpoint Test 3.2:** - Status: [X] PASS [ ] FAIL [ ] SKIP

```bash
curl -X POST http://localhost:3000/api/analyze-image \
  -H "Content-Type: application/json" \
  -d '{"imageData":"data:image/jpeg;base64,...", "analysisType":"medication"}'
```

---

## 💬 **Health Chat Testing**

### **Test 4.1: Basic Chat Functionality** - Status: [X] PASS [] FAIL [ ] SKIP

1. **Prerequisites**: Sign in
2. Navigate to `/chat`
3. Send message: `"I have been experiencing headaches for 3 days"`
4. Wait for AI response
5. Send follow-up: `"The pain is worse in the morning"`

**✅ Expected Results:**

- AI provides relevant health guidance
- Conversation history preserved
- Each response shows `"saved": true`
- Conversation ID generated

**📝 Test Notes:**

### **Test 4.2: Conversation Persistence**

1. Complete Test 4.1
2. Refresh page or navigate away and back
3. **✅ Expected**: Chat history preserved

### **API Endpoint Test 4.3:**

````bash
curl -X POST http://localhost:3000/api/chat \
  -**

```json
{
  "success": true,
  "response": "Based on your symptoms...",
  "conversationId": "uuid-here",
  "saved": true
}
````

---

## 🎤 **Voice Logger Testing**

### **Test 5.1: Voice Recording (if microphone available)** - Status: [X] PASS [ ] FAIL [ ] SKIP

1. **Prerequisites**: Sign in, allow microphone access
2. Navigate to `/voice-logger`
3. Click record button
4. Say: _"I feel tired and have been coughing for two days"_
5. Stop recording
6. Wait for analysis

**✅ Expected Results:**

- Transcript appears
- Health analysis provided
- Follow-up questions generated
- `"saved": true` confirmation

### **Test 5.2: Text Input Alternative**

1. Navigate to `/voice-logger`
2. Use text input field (if available)
3. Type: _"I have back pain and trouble sleeping"_
4. Submit for analysis

### **API Endpoint Test 5.3:**

```bash
# Test with form data (audio file)
curl -X POST http://localhost:3000/api/analyze-audio \
  -F "audio=@test-audio.webm" \
  -F "transcript=I have a headache"
```

---

## 📊 **Health Records Dashboard Testing**

### **Test 6.1: Dashboard Access** - Status: [X] PASS [ ] FAIL [ ] SKIP

1. **Prerequisites**: Complete tests 2-5 to have data
2. Navigate to `/health-records`
3. **✅ Expected**:
   - Statistics show correct counts
   - All your test records visible
   - Records sorted by date (newest first)

### **Test 6.2: Search Functionality** Status: [X] PASS [ ] FAIL [ ] SKIP

1. In search box, type: `"headache"`
2. **✅ Expected**: Only headache-related records appear
3. Clear search
4. **✅ Expected**: All records return

### **Test 6.3: Filter Functionality** Status: [X] PASS [ ] FAIL [ ] SKIP

1. Use filter dropdown: select "Skin Analysis"
2. **✅ Expected**: Only skin analysis records visible
3. Select "All Records"
4. **✅ Expected**: All records return

### **Test 6.4: Record Details View** Status: [X] PASS [ ] FAIL [ ] SKIP

1. Click **"View Details"** on any record
2. **✅ Expected**:
   - Modal opens with full analysis
   - Shows recommendations and follow-up questions
   - Confidence and urgency levels visible

### **Test 6.5: Data Export** Status: [X] PASS [ ] FAIL [ ] SKIP

1. Click **"Export Data"** button
2. **✅ Expected**:
   - JSON file downloads automatically
   - File contains all health records
   - Data properly formatted

### **Test 6.6: Record Deletion** Status: [X] PASS [ ] FAIL [ ] SKIP

1. Click trash icon on a test record
2. Confirm deletion
3. **✅ Expected**:
   - Record disappears immediately
   - Statistics update
   - No errors in console

---

## 🔄 **Data Persistence & Session Testing**

### **Test 7.1: Browser Refresh Persistence** Status: [X] PASS [ ] FAIL [ ] SKIP

1. After creating several records, refresh any page
2. **✅ Expected**: All data persists, no data loss

### **Test 7.2: Cross-Session Persistence** Status: [X] PASS [ ] FAIL [ ] SKIP

1. Sign out completely
2. Close browser
3. Reopen browser, navigate to site
4. Sign in with same credentials
5. **✅ Expected**: All previous health data still present

### **Test 7.3: Authentication State Persistence** Status: [X] PASS [ ] FAIL [ ] SKIP

1. Sign in and close browser tab
2. Reopen site in new tab
3. **✅ Expected**: Still signed in (session preserved)

---

## 🚨 **Error Handling & Edge Cases** Status: [X] PASS [ ] FAIL [ ] SKIP

### **Test 8.1: Invalid File Uploads**

1. Try uploading .txt, .doc, or other non-image files
2. **✅ Expected**: Graceful error message, no app crash

### **Test 8.2: Empty Form Submissions**

1. Try submitting forms without required data
2. **✅ Expected**: Clear validation errors

### **Test 8.3: Unauthenticated Protected Route Access**

1. Sign out
2. Try accessing `/health-records` directly via URL
3. **✅ Expected**: Redirected to home page

### **Test 8.4: Network Error Handling**

1. Disconnect internet
2. Try using any feature
3. **✅ Expected**: Appropriate error messages

---

## 📱 **Accessibility & User Experience**

### **Test 9.1: Keyboard Navigation** Status: [X] PASS [ ] FAIL [ ] SKIP

1. Use only keyboard (Tab, Enter, Space, Arrow keys)
2. Navigate through all features
3. **✅ Expected**: All functionality accessible

### **Test 9.2: Screen Reader Testing** (if available) Status: [X] PASS [ ] FAIL [ ] SKIP

1. Enable screen reader
2. Navigate through application
3. **✅ Expected**: All content announced properly

### **Test 9.3: High Contrast Mode** Status: [X] PASS [ ] FAIL [ ] SKIP

1. Use accessibility toolbar
2. Enable high contrast mode
3. **✅ Expected**: UI remains usable and readable

---

## 🏥 **End-to-End User Journey**

### **Complete User Flow Test**

1. **New User Registration** (Test 1.1)
2. **Use All Features**:
   - Skin analysis (Test 2.1)
   - Medication scan (Test 3.1)
   - Health chat (Test 4.1)
   - Voice logging (Test 5.1)
3. **Review Data** (Test 6.1)
4. **Export Data** (Test 6.5)
5. **Sign Out & Back In** (Test 7.2)
6. **Verify Data Persisted** (Test 6.1)

**✅ Success Criteria**: Complete user journey without errors

---

## 🐛 **Issue Reporting Template**

When you find issues, document them using this format:

```
## Issue: [Brief Description]

**Test**: [Which test number]
**Steps to Reproduce**:
1. Step one
2. Step two
3. Step three

**Expected Result**: [What should happen]
**Actual Result**: [What actually happened]
**Browser**: [Chrome/Firefox/Safari + version]
**Console Errors**: [Copy any red errors from F12 console]
**Screenshots**: [If applicable]
```

---

## 🧪 **NEW FEATURE TESTING INSTRUCTIONS**

### **Test 15.2: Wake Word Detection ("Hey MediVision")** - Status: [ ] PASS [ ] FAIL [ ] SKIP

1. Navigate to any page
2. Click accessibility toolbar button (speaker icon)
3. Enable "Wake Word Detection" toggle
4. Say "Hey MediVision" clearly
5. **✅ Expected**: Voice command mode activates, "Yes, how can I help you?" response

**📝 Test Notes:** _[Add any notes about issues, observations, or special conditions here]_

### **Test 15.3: Font Scaling (100%-300%)** - Status: [X] PASS [ ] FAIL [ ] SKIP

1. Use accessibility toolbar
2. Click "A+" button multiple times
3. **✅ Expected**: Font size increases (up to 300%)
4. Click "A-" button to decrease
5. **✅ Expected**: Font size decreases (down to 100%)

**📝 Test Notes:** _[Add any notes about issues, observations, or special conditions here]_

### **Test 16.1-16.4: Push Notifications** - Status: [ ] PASS [ ] FAIL [ ] SKIP

1. Navigate to `/medication`
2. Analyze any medication image
3. Click "Set Reminder" button in blue card
4. **✅ Expected**:
   - Browser requests notification permission
   - Test notification appears
   - Voice feedback explains setup
   - Service worker handles notification click

**📝 Test Notes:** _[Add any notes about issues, observations, or special conditions here]_

### **Test 17.1-17.4: Sign Out Functionality** - Status: [ ] PASS [ ] FAIL [ ] SKIP

1. Sign in first
2. Click "Sign Out" button
3. **✅ Expected**:
   - Button shows "Signing Out..." briefly
   - User state clears immediately
   - Local storage cleaned
   - Returns to "Sign In" state

**📝 Test Notes:** _[Add any notes about issues, observations, or special conditions here]_

### **Test 18.1-18.3: Authentication Error Handling** - Status: [ ] PASS [ ] FAIL [ ] SKIP

1. **Without signing in**:
2. Go to `/skin-analysis` or `/medication`
3. Upload and analyze image
4. **✅ Expected**:
   - Analysis works normally
   - No "User not authenticated" errors
   - Health record not saved (expected)
   - Console shows "User not authenticated, skipping health record save"

**📝 Test Notes:** _[Add any notes about issues, observations, or special conditions here]_

### **Test 19.1-19.4: Set Reminder Button** - Status: [ ] PASS [ ] FAIL [ ] SKIP

1. Go to `/medication`
2. Analyze medication image
3. Look for blue "Medication Reminders" card
4. Click "Set Reminder" button
5. **✅ Expected**:
   - Notification permission requested
   - Test notification sent
   - Voice feedback provided
   - Button is clickable and responsive

**📝 Test Notes:** _[Add any notes about issues, observations, or special conditions here]_

---

## 🎯 **Updated Success Criteria Summary**

**Hackathon Critical (Must Pass)**:

- Emergency detection works in real-time (Tests 10.1-10.4)
- PWA installs and works offline (Tests 12.1, 12.3)
- Live API streaming functions (Test 11.1)
- Wake word detection works (Test 15.2)
- Demo sequence works flawlessly (Test 20.1)

**Core Functionality (Must Pass)**:

- User authentication works (Tests 1.1-1.3)
- Sign out functionality works properly (Tests 17.1-17.4)
- All 4 main features save data (Tests 2.1, 3.1, 4.1, 5.1)
- Health records dashboard displays data (Test 6.1)
- Data persists across sessions (Tests 7.1-7.2)
- Analysis works without authentication (Tests 18.1-18.3)

**Competition Edge (Should Pass)**:

- Emergency alerts during conversations (Test 13.2)
- Voice accessibility commands (Test 15.1)
- Font scaling accessibility (Test 15.3)
- Push notifications work (Tests 16.1-16.4)
- Medication reminders functional (Tests 19.1-19.4)
- Pattern recognition alerts (Test 10.5)

---

## 🏆 **Hackathon Judge Testing Priority**

**Test in this order for maximum impact**:

1. **Test 15.2** (Wake Word "Hey MediVision") - 🔥 **WOW FACTOR**
2. **Test 10.1** (Emergency Detection) - 🔥 **LIFE-SAVING**
3. **Test 19.1** (Set Reminder Button) - 🔥 **USER EXPERIENCE**
4. **Test 12.1** (PWA Installation) - 🔥 **TECHNICAL EXCELLENCE**
5. **Test 17.1** (Sign Out Works) - 🔥 **RELIABILITY**
6. **Test 18.1** (Works Without Auth) - 🔥 **ACCESSIBILITY**
7. **Test 16.1** (Push Notifications) - 🔥 **ENGAGEMENT**

Complete these 7 tests successfully = **Winning Demo Ready!** 🏆

## 📝 **TESTING STATUS TRACKER**

**Quick Status Check** - Mark as you test:

### 🔥 **CRITICAL FIXES COMPLETED**

- [x] Sign out functionality fixed
- [x] Authentication errors resolved
- [x] Set reminder button implemented
- [x] Wake word detection added
- [x] Font scaling enhanced
- [x] Push notifications added

### 🧪 **READY TO TEST**

- [ ] All 46 test cases available
- [ ] Detailed instructions provided
- [ ] Checklist format for easy tracking
- [ ] Priority order for demo prep

---

## 📝 **QUICK STATUS REFERENCE**

**How to Mark Test Status:**

- Find each test (e.g., "Test 1.1: User Registration")
- Mark status: [x] PASS [ ] FAIL [ ] SKIP
- Add notes in the "Test Notes" section
- Update progress counters in dashboard at top

**Status Meanings:**

- **PASS**: Test completed successfully, all expected results achieved
- **FAIL**: Test failed, issues found (document in Test Notes)
- **SKIP**: Test skipped due to dependencies or environment issues

---

## 🎥 **20. Video Analysis Testing** - Status: [ ] PASS [ ] FAIL [ ] SKIP

### **Test 20.1: Video Analysis Feature** - Status: [ ] PASS [ ] FAIL [ ] SKIP

**🔥 COMPETITION WINNER FEATURE - HIGHEST PRIORITY**

1. Go to `/skin-analysis`
2. Click "Video Analysis" mode toggle
3. Upload a video file (MP4, MOV, AVI - max 10MB)
4. Click "Analyze Video" button
5. Wait for analysis to complete
6. Verify analysis results are displayed
7. Test speech synthesis with "Listen" button

**Expected Results:**

- ✅ Video upload works
- ✅ Analysis completes successfully
- ✅ Results show confidence level and urgency
- ✅ Speech synthesis works
- ✅ Analysis is saved to health records (if authenticated)

### **Test 20.2: Video Analysis Error Handling** - Status: [ ] PASS [ ] FAIL [ ] SKIP

1. Try uploading a file that's not a video
2. Try uploading a video larger than 10MB
3. Try analyzing without selecting a video
4. Test with poor quality/low light video

**Expected Results:**

- ✅ Proper error messages for invalid files
- ✅ File size validation works
- ✅ Graceful handling of analysis failures

### **Test 20.3: Video Analysis Accessibility** - Status: [ ] PASS [ ] FAIL [ ] SKIP

1. Test with screen reader
2. Test keyboard navigation
3. Test voice commands for video analysis
4. Test high contrast mode

**Expected Results:**

- ✅ All video analysis features are accessible
- ✅ Voice commands work for video analysis
- ✅ Screen reader announces video analysis results

---

**Priority Order for Testing:**

1. **Test 20.1** (Video Analysis Feature) - 🔥 **COMPETITION WINNER**
2. Start with Authentication Tests (1.1-1.3)
3. Test New Features (15.2, 17.1, 18.1, 19.1)
4. Test Core Features (2.1, 3.1, 4.1, 5.1)
5. Complete remaining tests as needed

**Update Dashboard:** Remember to update the progress counters at the top of this file as you complete tests!
