# Send Notifications from App - Quick Start Guide

## Overview
You can now send push notifications to all users directly from the app! This feature is available to admins and super admins.

## Setup Steps

### 1. Install Dependencies
First, install the new Firebase Functions package:

```bash
npm install
```

Or manually install:
```bash
npm install @react-native-firebase/functions@^21.8.0
```

### 2. Deploy Cloud Functions
The Cloud Functions must be deployed to Firebase before you can send notifications:

```bash
cd functions
npm install
firebase deploy --only functions
```

Or use the batch file:
```bash
DEPLOY_NOW.bat
```

### 3. Rebuild the App
After installing the new package, rebuild your app:

```bash
# For Android
npm run android

# Or if using Expo
npx expo run:android
```

## How to Use

### Access the Notification Screen

1. **Login as Admin/Super Admin**
   - Only admins and super admins can send notifications
   - Regular users won't see this option

2. **Navigate to Admin Dashboard**
   - From the home screen, go to Account → Admin Dashboard
   - Or use the admin menu

3. **Click "Send Notifications"**
   - Look for the orange "Send" icon
   - It's in the Admin Tools section

### Send a Custom Notification

1. **Enter Notification Title**
   - Max 50 characters
   - Example: "⚽ Match Tomorrow!"

2. **Enter Notification Message**
   - Max 200 characters
   - Example: "Don't miss our big match against City FC at 3 PM"

3. **Click "Send Notification"**
   - Confirm the action
   - Wait for success message

4. **All Users Receive It**
   - Users get the notification even if the app is closed
   - Notifications appear in the system tray
   - Also saved to Firestore for in-app display

### Quick Actions

The screen includes pre-built notification templates:

- **🧪 Send Test Notification**: Test the system
- **👋 Send Welcome Message**: Welcome new users
- **⚽ Send Practice Reminder**: Remind team about practice

Just tap any quick action button to send instantly!

## Features

### What Happens When You Send?

1. **Push Notification Sent**
   - Delivered via Firebase Cloud Messaging (FCM)
   - Sent to the `team_updates` topic
   - All subscribed users receive it

2. **Saved to Firestore**
   - Notification is also saved to the database
   - Users can view it in the app later
   - Appears in the notifications list

3. **Instant Delivery**
   - Users receive it immediately
   - Works even if app is closed
   - Shows in Android notification tray

### Security

- **Admin Only**: Only users with `admin` or `super_admin` role can send
- **Authentication Required**: Must be logged in
- **Cloud Function Validation**: Server-side checks prevent unauthorized access

## Automatic Notifications

The system also sends automatic notifications when:

### 1. New Match Created
- **Trigger**: When an admin creates a new match
- **Title**: "⚽ New Match Scheduled!"
- **Body**: "Team A vs Team B"

### 2. Match Score Updated
- **Trigger**: When a match score changes
- **Title**: "🔥 GOAL! Team A 2 - 1 Team B"
- **Body**: "Score updated!"

### 3. Team Update Posted
- **Trigger**: When a team update is created
- **Title**: "📢 Team Update!"
- **Body**: The update title/content

## Troubleshooting

### "Permission Denied" Error
**Problem**: You're not an admin
**Solution**: 
- Ask a super admin to grant you admin access
- Check your role in Firestore users collection

### "Unauthenticated" Error
**Problem**: Not logged in
**Solution**: 
- Log out and log back in
- Check your authentication status

### Notifications Not Received
**Problem**: Users aren't getting notifications
**Solution**:
1. **Check Cloud Functions are deployed**
   ```bash
   firebase functions:log
   ```
   Look for "Successfully sent message to topic"

2. **Check users are subscribed**
   - Users must open the app at least once
   - App automatically subscribes to `team_updates` topic

3. **Check notification permissions**
   - Android 13+: Users must grant POST_NOTIFICATIONS permission
   - Check app settings

4. **Test with the test endpoint**
   - Use the HTTP test function to verify FCM is working
   - Check Firebase Console logs

### "Failed to Send" Error
**Problem**: Cloud Function error
**Solution**:
1. Check Cloud Functions are deployed
2. View logs: `firebase functions:log`
3. Ensure Firebase project has FCM enabled
4. Verify google-services.json is up to date

## Advanced Usage

### Send to Specific Topics

You can modify the `adminNotificationService.js` to send to different topics:

```javascript
// Send to match_alerts topic instead
await adminNotificationService.sendCustomNotification(
  'Match Alert',
  'Match starting in 30 minutes!',
  'match_alerts',  // Different topic
  'match_updates'
);
```

### Schedule Notifications

For scheduled notifications, you can use Firebase Cloud Scheduler:

1. Create a Cloud Scheduler job in Firebase Console
2. Set it to call your Cloud Function
3. Configure the schedule (e.g., "1 hour before match")

### Track Notification Analytics

Add analytics tracking to see notification engagement:

```javascript
import analytics from '@react-native-firebase/analytics';

// Track when notification is sent
await analytics().logEvent('notification_sent', {
  type: 'custom',
  title: title,
});
```

## Testing Checklist

Before using in production, test:

- [ ] Deploy Cloud Functions successfully
- [ ] Send test notification from app
- [ ] Verify notification received on test device
- [ ] Test with app in foreground
- [ ] Test with app in background
- [ ] Test with app closed
- [ ] Verify notification appears in system tray
- [ ] Check Firestore notification is created
- [ ] Test quick action buttons
- [ ] Verify admin-only access works

## Next Steps

1. **Install dependencies** (`npm install`)
2. **Deploy Cloud Functions** (`firebase deploy --only functions`)
3. **Rebuild the app** (`npm run android`)
4. **Test the feature** (send a test notification)
5. **Start sending notifications** to your users!

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Cloud Function logs: `firebase functions:log`
3. Check Firebase Console for errors
4. Verify all dependencies are installed
5. Ensure Firebase project is configured correctly

---

**Ready to send notifications?** Open the app, go to Admin Dashboard → Send Notifications, and start engaging with your users! 🚀
