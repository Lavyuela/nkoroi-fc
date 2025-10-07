# Firebase Setup Instructions

This document provides detailed instructions for setting up Firebase for the Nkoroi FC Live Score app.

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `Nkoroi FC Live Score`
4. (Optional) Disable Google Analytics if not needed
5. Click **"Create project"**
6. Wait for project creation to complete
7. Click **"Continue"**

## 2. Enable Firebase Realtime Database

### Create Database
1. In the left sidebar, click **"Build"** → **"Realtime Database"**
2. Click **"Create Database"**
3. Select a database location (choose closest to your users):
   - `us-central1` (United States)
   - `europe-west1` (Belgium)
   - `asia-southeast1` (Singapore)
4. Choose **"Start in test mode"** (we'll update rules next)
5. Click **"Enable"**

### Configure Security Rules
1. Click on the **"Rules"** tab
2. Replace the default rules with the content from `firebase-rules.json`:

```json
{
  "rules": {
    "users": {
      ".read": "auth != null",
      "$uid": {
        ".write": "auth != null && (auth.uid === $uid || root.child('users').child(auth.uid).child('isAdmin').val() === true)"
      }
    },
    "matches": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('users').child(auth.uid).child('isAdmin').val() === true",
      "$matchId": {
        ".validate": "newData.hasChildren(['homeTeam', 'awayTeam', 'homeScore', 'awayScore', 'status'])",
        "homeTeam": {
          ".validate": "newData.isString() && newData.val().length > 0"
        },
        "awayTeam": {
          ".validate": "newData.isString() && newData.val().length > 0"
        },
        "homeScore": {
          ".validate": "newData.isNumber() && newData.val() >= 0"
        },
        "awayScore": {
          ".validate": "newData.isNumber() && newData.val() >= 0"
        },
        "status": {
          ".validate": "newData.isString() && (newData.val() === 'upcoming' || newData.val() === 'live' || newData.val() === 'finished')"
        },
        "venue": {
          ".validate": "newData.isString()"
        },
        "matchDate": {
          ".validate": "newData.isNumber()"
        },
        "events": {
          ".read": "auth != null",
          ".write": "auth != null && root.child('users').child(auth.uid).child('isAdmin').val() === true"
        }
      }
    }
  }
}
```

3. Click **"Publish"**

### Understanding the Rules
- **Authentication Required**: All reads and writes require user to be logged in
- **Admin-Only Writes**: Only admin users can create, update, or delete matches
- **User Management**: Users can update their own profile, admins can update any profile
- **Data Validation**: Ensures match data has required fields and correct types

## 3. Enable Firebase Authentication

### Enable Email/Password Authentication
1. In the left sidebar, click **"Build"** → **"Authentication"**
2. Click **"Get started"**
3. Click on the **"Sign-in method"** tab
4. Click **"Email/Password"**
5. Toggle the first switch to **"Enable"**
6. (Optional) Keep "Email link (passwordless sign-in)" disabled
7. Click **"Save"**

### Optional: Add Authorized Domains
If deploying to web:
1. Go to **"Settings"** tab in Authentication
2. Scroll to **"Authorized domains"**
3. Add your domain if hosting on custom domain

## 4. Get Firebase Configuration

### For Web/React Native App
1. Click the **gear icon (⚙️)** next to "Project Overview" in the left sidebar
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **web icon** `</>` to add a web app
5. Enter app nickname: `Nkoroi FC Mobile App`
6. **Do NOT** check "Also set up Firebase Hosting"
7. Click **"Register app"**
8. Copy the `firebaseConfig` object shown

Example configuration:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

9. Click **"Continue to console"**

## 5. Configure the App

### Create Firebase Config File
1. Navigate to your project directory
2. Copy the template file:
   ```bash
   copy firebaseConfig.template.js firebaseConfig.js
   ```
   Or on Mac/Linux:
   ```bash
   cp firebaseConfig.template.js firebaseConfig.js
   ```

3. Open `firebaseConfig.js` in a text editor
4. Replace the placeholder values with your actual Firebase configuration:

```javascript
export const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-actual-project.firebaseapp.com",
  databaseURL: "https://your-actual-project-default-rtdb.firebaseio.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-actual-project.appspot.com",
  messagingSenderId: "YOUR_ACTUAL_SENDER_ID",
  appId: "YOUR_ACTUAL_APP_ID"
};
```

5. Save the file

### Important Security Notes
- **Never commit `firebaseConfig.js` to version control** (it's already in `.gitignore`)
- The API key in the config is safe to expose in client-side code
- Security is enforced by Firebase Security Rules, not by hiding the config
- For production, consider using environment variables

## 6. Test Firebase Connection

### Test Authentication
1. Run the app: `npm start`
2. Register a new user
3. Check Firebase Console → Authentication → Users
4. You should see the new user listed

### Test Database
1. Create a match as admin
2. Check Firebase Console → Realtime Database → Data
3. You should see the match data under `matches/`

### Test Real-time Updates
1. Open the app on two devices
2. Update a score on one device
3. The other device should update immediately

## 7. Monitor Usage

### View Usage Statistics
1. Go to Firebase Console → **"Usage and billing"**
2. Monitor:
   - Realtime Database: Concurrent connections, storage, downloads
   - Authentication: Monthly active users
   - Cloud Functions: Invocations (if used)

### Free Tier Limits (Spark Plan)
- **Realtime Database**:
  - 1 GB stored data
  - 10 GB/month downloaded
  - 100 simultaneous connections
- **Authentication**:
  - Unlimited users
  - 10,000 verifications/month for phone auth

### Upgrade if Needed
If you exceed free tier limits:
1. Go to **"Usage and billing"** → **"Details & settings"**
2. Click **"Modify plan"**
3. Choose **"Blaze (Pay as you go)"** plan
4. Set up billing alerts to avoid unexpected charges

## 8. Backup and Export Data

### Export Database
1. Go to Realtime Database
2. Click the **three dots** menu
3. Select **"Export JSON"**
4. Save the file as backup

### Schedule Regular Backups
Consider setting up automated backups:
- Use Firebase Admin SDK to export data programmatically
- Schedule with cron jobs or cloud functions
- Store backups in Cloud Storage or external service

## 9. Production Checklist

Before going live:
- [ ] Update Firebase Security Rules (use rules from `firebase-rules.json`)
- [ ] Test all security rules thoroughly
- [ ] Set up Firebase App Check (prevents abuse)
- [ ] Enable Firebase Performance Monitoring
- [ ] Set up Firebase Crashlytics for error tracking
- [ ] Configure proper backup strategy
- [ ] Set up billing alerts
- [ ] Review and optimize database indexes
- [ ] Test with production data volume
- [ ] Document admin procedures

## 10. Troubleshooting

### Common Issues

**Issue: "Permission denied" errors**
- Check that Security Rules are published
- Verify user is authenticated
- Confirm user has admin role (for admin operations)

**Issue: "Database not found"**
- Verify `databaseURL` in config matches Firebase Console
- Check that Realtime Database is enabled
- Ensure you're using the correct Firebase project

**Issue: Authentication not working**
- Verify Email/Password is enabled in Authentication settings
- Check that API key is correct in config
- Ensure network connection is stable

**Issue: Real-time updates not working**
- Check that you're subscribed to the correct database path
- Verify Security Rules allow read access
- Test network connectivity
- Check for JavaScript errors in console

### Getting Help
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase) - Tag: `firebase`
- [Firebase Community Slack](https://firebase.community/)

## Additional Resources

- [Firebase Realtime Database Documentation](https://firebase.google.com/docs/database)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firebase Security Rules Guide](https://firebase.google.com/docs/database/security)
- [Firebase Best Practices](https://firebase.google.com/docs/database/usage/best-practices)

---

**Setup Complete!** Your Firebase backend is now ready for the Nkoroi FC Live Score app. 🎉
