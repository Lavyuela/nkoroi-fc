# 🔥 Firebase Setup Checklist - Nkoroi FC Live Score

Use this checklist to track your progress. Mark each step as you complete it.

## 📋 Setup Progress

### Step 1: Create Firebase Project ⏱️ 3 minutes
- [ ] Opened https://console.firebase.google.com/
- [ ] Clicked "Add project" or "Create a project"
- [ ] Named project: "Nkoroi FC Live Score"
- [ ] Disabled Google Analytics (optional)
- [ ] Clicked "Create project"
- [ ] Project created successfully
- [ ] Clicked "Continue"

**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

---

### Step 2: Enable Realtime Database ⏱️ 3 minutes

#### Part A: Create Database
- [ ] Clicked "Build" → "Realtime Database" in left sidebar
- [ ] Clicked "Create Database"
- [ ] Selected location (us-central1, europe-west1, or asia-southeast1)
- [ ] Selected "Start in test mode"
- [ ] Clicked "Enable"
- [ ] Database created successfully

#### Part B: Configure Security Rules
- [ ] Clicked "Rules" tab
- [ ] Deleted default rules
- [ ] Opened file: `firebase-rules.json` in this project
- [ ] Copied entire JSON content
- [ ] Pasted into Firebase Rules editor
- [ ] Clicked "Publish"
- [ ] Saw "Last published: just now"

**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

---

### Step 3: Enable Authentication ⏱️ 2 minutes
- [ ] Clicked "Build" → "Authentication" in left sidebar
- [ ] Clicked "Get started"
- [ ] Clicked "Sign-in method" tab
- [ ] Found "Email/Password" in the list
- [ ] Clicked on "Email/Password"
- [ ] Toggled first switch to "Enable"
- [ ] Clicked "Save"
- [ ] Verified "Email/Password" shows as "Enabled"

**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

---

### Step 4: Get Firebase Configuration ⏱️ 3 minutes
- [ ] Clicked gear icon (⚙️) → "Project settings"
- [ ] Scrolled to "Your apps" section
- [ ] Clicked web icon `</>`
- [ ] Entered app nickname: "Nkoroi FC Mobile App"
- [ ] Did NOT check "Also set up Firebase Hosting"
- [ ] Clicked "Register app"
- [ ] Saw firebaseConfig code snippet
- [ ] **COPIED the entire firebaseConfig object**
- [ ] Clicked "Continue to console"

**Your firebaseConfig should look like this:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

---

### Step 5: Update App Configuration ⏱️ 2 minutes
- [ ] Opened file: `firebaseConfig.js` in project folder
- [ ] Replaced `YOUR_API_KEY` with actual apiKey
- [ ] Replaced `YOUR_PROJECT_ID.firebaseapp.com` with actual authDomain
- [ ] Replaced database URL with actual databaseURL
- [ ] Replaced `YOUR_PROJECT_ID` with actual projectId
- [ ] Replaced storage bucket with actual storageBucket
- [ ] Replaced `YOUR_MESSAGING_SENDER_ID` with actual messagingSenderId
- [ ] Replaced `YOUR_APP_ID` with actual appId
- [ ] Saved the file (Ctrl+S)
- [ ] Verified all placeholders are replaced

**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

---

## ✅ Final Verification

Before proceeding, verify:
- [ ] Firebase project exists in console
- [ ] Realtime Database shows in Firebase Console
- [ ] Security rules are published
- [ ] Authentication is enabled
- [ ] Email/Password is enabled
- [ ] Web app is registered
- [ ] firebaseConfig.js has real values (no "YOUR_" placeholders)

---

## 🎉 Setup Complete!

Once all checkboxes are marked:
- [ ] All steps completed
- [ ] Ready to run the app
- [ ] Ready to test

---

## 🆘 Stuck? Common Issues

**Issue**: Can't find Firebase Console
→ Go to: https://console.firebase.google.com/

**Issue**: Don't see "Create Database" button
→ Make sure you're in the correct project (check top of page)

**Issue**: Rules won't publish
→ Make sure JSON is valid (check for missing commas/brackets)

**Issue**: Can't find firebaseConfig.js
→ Location: `c:\Users\Admin\Downloads\Nkoroi FC\firebaseConfig.js`

**Issue**: Not sure what to copy from Firebase
→ Copy ONLY the object inside `const firebaseConfig = { ... }`

---

## 📞 Next Steps After Setup

1. Tell me you've completed the setup
2. I'll help you start the development server
3. We'll run the app on your phone
4. Create your first admin account
5. Test the features!

---

**Current Status**: Update this as you progress!
- Step 1: ⬜
- Step 2: ⬜
- Step 3: ⬜
- Step 4: ⬜
- Step 5: ⬜

**Estimated Time Remaining**: 13 minutes

---

*Save this file and update it as you complete each step!*
