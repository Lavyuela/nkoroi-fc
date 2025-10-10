# 📧 Firebase Email Extension - Complete Setup Guide

## 🎯 Overview

This guide will help you set up **real email sending** for password resets and notifications using Firebase's Trigger Email extension.

---

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ Firebase project created (NkoroiFC)
- ✅ Firebase Console access
- ✅ Email account (Gmail, SendGrid, or Mailgun)
- ✅ Firestore enabled in Firebase

---

## 🚀 Step-by-Step Setup

### Step 1: Enable Firestore

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: **NkoroiFC**
3. Click **"Firestore Database"** in left sidebar
4. Click **"Create database"**
5. Choose **"Start in production mode"**
6. Select location: **us-central1** (or closest to you)
7. Click **"Enable"**

---

### Step 2: Install Trigger Email Extension

1. In Firebase Console, click **"Extensions"** (left sidebar under "Build")
2. Click **"Explore Extensions"**
3. Search for: **"Trigger Email"**
4. Click on **"Trigger Email from Firestore"**
5. Click **"Install in console"**
6. Click **"Next"** on the overview page
7. Review billing (free tier is usually sufficient)
8. Click **"Next"**

---

### Step 3: Configure Extension Settings

You'll see a configuration form. Fill it out:

#### **3.1 SMTP Connection URI**

Choose your email provider:

**Option A: Gmail (Best for Testing)**
```
smtps://YOUR_EMAIL@gmail.com:YOUR_APP_PASSWORD@smtp.gmail.com:465
```

**Option B: SendGrid (Best for Production)**
```
smtps://apikey:YOUR_SENDGRID_API_KEY@smtp.sendgrid.net:465
```

**Option C: Mailgun**
```
smtps://postmaster@YOUR_DOMAIN:YOUR_API_KEY@smtp.mailgun.org:465
```

#### **3.2 Email Documents Collection**
```
mail
```
(Leave as default)

#### **3.3 Default FROM Email Address**
```
noreply@nkoroifc.com
```
(Or your Gmail address if using Gmail)

#### **3.4 Default Reply-To Email**
```
support@nkoroifc.com
```
(Optional - can leave blank)

#### **3.5 Users Collection** (Optional)
Leave blank for now

#### **3.6 Templates Collection** (Optional)
Leave blank for now

---

### Step 4: Get Gmail App Password (If Using Gmail)

**Important:** You need an App Password, not your regular Gmail password!

1. **Enable 2-Step Verification:**
   - Go to: https://myaccount.google.com/security
   - Scroll to "2-Step Verification"
   - Click "Get Started" and follow steps

2. **Create App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select app: **"Mail"**
   - Select device: **"Other (Custom name)"**
   - Type: **"Nkoroi FC App"**
   - Click **"Generate"**

3. **Copy the 16-character password:**
   ```
   Example: abcd efgh ijkl mnop
   ```

4. **Use in SMTP URI** (remove spaces):
   ```
   smtps://youremail@gmail.com:abcdefghijklmnop@smtp.gmail.com:465
   ```

---

### Step 5: Complete Extension Installation

1. After filling all fields, click **"Install extension"**
2. Wait for installation (takes 2-3 minutes)
3. You'll see "Extension installed successfully" ✅

---

### Step 6: Set Up Firestore Security Rules

Update your Firestore rules to allow the extension to work:

1. Go to **Firestore Database** → **Rules** tab
2. Add these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow extension to read/write mail collection
    match /mail/{mailId} {
      allow read, write: if request.auth != null;
    }
    
    // Your other rules...
  }
}
```

3. Click **"Publish"**

---

### Step 7: Enable Firestore in Your App

Update `firebaseConfig.js` to initialize Firestore:

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  // Your existing config...
};

export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
```

---

### Step 8: Update Password Reset Code

The code is already prepared! Just uncomment this line in `LoginScreen.js`:

```javascript
// Line 110 - Uncomment this:
await addDoc(collection(firestore, 'mail'), emailData);
```

And add the import at the top:

```javascript
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
```

---

## 🧪 Testing

### Test Password Reset Email:

1. **In the app:**
   - Tap "Forgot Password?"
   - Enter your email
   - Tap "Send Reset Link"

2. **In Firebase Console:**
   - Go to Firestore Database
   - Open `mail` collection
   - You should see a new document
   - Status will change from "PENDING" → "SUCCESS"

3. **Check your email:**
   - Open your inbox
   - Look for "Reset Your Nkoroi FC Password"
   - Email should arrive within 1-2 minutes

---

## 📧 Email Template

The password reset email will look like this:

```
Subject: Reset Your Nkoroi FC Password

Reset Your Password

Hi there,

You requested to reset your password for Nkoroi FC Live Score app.

Your temporary password reset code is:

[RESET CODE]

Or click the link below:
[Reset Password Button]

This link expires in 24 hours.

If you didn't request this, please ignore this email.

---
Nkoroi FC Live Score Team
```

---

## 🔧 Troubleshooting

### Email Not Sending?

**Check 1: Firestore Document Status**
```
1. Go to Firestore → mail collection
2. Check document status
3. If "ERROR", check error message
```

**Check 2: SMTP Credentials**
```
1. Verify SMTP URI is correct
2. Check App Password (no spaces)
3. Ensure 2-Step Verification is enabled (Gmail)
```

**Check 3: Extension Logs**
```
1. Go to Extensions
2. Click on "Trigger Email"
3. Click "View logs"
4. Check for errors
```

**Check 4: Firestore Rules**
```
1. Ensure mail collection is writable
2. Check authentication rules
```

---

## 💰 Costs

### Firebase Trigger Email Extension:
- **Free tier:** 10,000 emails/month
- **After free tier:** $0.10 per 1,000 emails

### Firestore:
- **Free tier:** 50,000 reads, 20,000 writes/day
- Usually sufficient for small apps

### SMTP Provider:
- **Gmail:** Free (with limits)
- **SendGrid:** Free tier (100 emails/day)
- **Mailgun:** Free tier (5,000 emails/month)

---

## 🎯 Current Status

### ✅ What's Ready:
- Email template created
- Reset token generation
- Token validation (24-hour expiry)
- Professional HTML email design

### ⏳ What's Needed:
1. Install Trigger Email extension
2. Configure SMTP settings
3. Enable Firestore
4. Uncomment email sending code

### 📝 What Happens Now (Demo Mode):
- Reset code is generated
- Code is shown in success message
- No actual email sent
- User can use code to reset password

---

## 🚀 Quick Start (5 Minutes)

**Fastest way to get emails working:**

1. **Enable Firestore** (2 min)
   - Firestore Database → Create database

2. **Install Extension** (2 min)
   - Extensions → Trigger Email → Install

3. **Configure Gmail** (1 min)
   - Get App Password
   - Paste in SMTP URI

4. **Test** (30 sec)
   - Forgot Password → Enter email
   - Check inbox!

---

## 📚 Additional Resources

- **Firebase Extensions:** https://extensions.dev/
- **Trigger Email Docs:** https://firebase.google.com/products/extensions/firestore-send-email
- **Gmail App Passwords:** https://support.google.com/accounts/answer/185833
- **SendGrid Setup:** https://sendgrid.com/docs/
- **Mailgun Setup:** https://documentation.mailgun.com/

---

## ✅ Summary

**To send real emails:**
1. Enable Firestore ✓
2. Install Trigger Email extension ✓
3. Configure SMTP (Gmail/SendGrid/Mailgun) ✓
4. Update Firestore rules ✓
5. Uncomment email sending code ✓
6. Test! ✓

**For now (Demo Mode):**
- Reset code is generated and shown
- User can manually use code to reset
- Ready for production when you enable Firestore + Extension

---

**Once set up, password reset emails will be sent automatically!** 📧✅

**Created**: 2025-10-08
**Version**: 1.6.0
