# Topic-Based Push Notifications Setup Guide

## Overview
The Cloud Functions have been updated to send push notifications to the `team_updates` FCM topic. All users who subscribe to this topic will receive notifications when:
- A new match is created
- A match score is updated
- A team update is posted
- An admin sends a custom notification

## Architecture

### Client Side (React Native App)
- Users automatically subscribe to the `team_updates` topic when they initialize the notification service
- The app handles both foreground and background notifications
- Notifications are displayed using Notifee for better Android support

### Server Side (Cloud Functions)
- **`onMatchCreated`**: Triggers when a new match is created in Firestore
- **`onMatchUpdated`**: Triggers when a match score changes
- **`onUpdateCreated`**: Triggers when a team update is posted
- **`sendCustomNotification`**: Callable function for admins to send custom notifications
- **`sendTestNotification`**: HTTP endpoint to test the notification system

## Deployment Steps

### 1. Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Deploy Cloud Functions
```bash
cd functions
npm install
firebase deploy --only functions
```

Or use the provided batch file:
```bash
DEPLOY_NOW.bat
```

### 4. Verify Deployment
After deployment, you should see output like:
```
✔  functions[onMatchCreated(us-central1)] Successful create operation.
✔  functions[onMatchUpdated(us-central1)] Successful create operation.
✔  functions[onUpdateCreated(us-central1)] Successful create operation.
✔  functions[sendCustomNotification(us-central1)] Successful create operation.
✔  functions[sendTestNotification(us-central1)] Successful create operation.
```

## Testing the Notification System

### Method 1: Test Endpoint (Easiest)
After deployment, Firebase will provide a URL for the `sendTestNotification` function.

1. Find the function URL in the deployment output or Firebase Console
2. Open the URL in a browser or use curl:
```bash
curl https://YOUR-REGION-YOUR-PROJECT-ID.cloudfunctions.net/sendTestNotification
```

3. All users subscribed to `team_updates` should receive a test notification

### Method 2: Create a Match in Firestore
1. Open Firebase Console → Firestore Database
2. Create a new document in the `matches` collection:
```json
{
  "homeTeam": "Nkoroi FC",
  "awayTeam": "Test Team",
  "date": "2024-01-20",
  "time": "15:00",
  "venue": "Home Stadium",
  "homeScore": 0,
  "awayScore": 0
}
```
3. All subscribed users should receive a "New Match Scheduled!" notification

### Method 3: Update a Match Score
1. Open an existing match document in Firestore
2. Update the `homeScore` or `awayScore` field
3. All subscribed users should receive a "GOAL!" notification

### Method 4: Create a Team Update
1. Open Firebase Console → Firestore Database
2. Create a new document in the `updates` collection:
```json
{
  "title": "Team Practice Tomorrow",
  "content": "Don't forget about practice at 6 PM!",
  "createdAt": "2024-01-19T10:00:00Z"
}
```
3. All subscribed users should receive a "Team Update!" notification

### Method 5: Send Custom Notification (Admin Only)
From your app, if you're logged in as an admin, you can call the Cloud Function:

```javascript
import functions from '@react-native-firebase/functions';

const sendCustomNotification = async () => {
  try {
    const result = await functions().httpsCallable('sendCustomNotification')({
      title: '🎉 Important Announcement',
      body: 'Check out our new features!',
      topic: 'team_updates',
      channelId: 'default'
    });
    
    console.log('Notification sent:', result.data);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
```

## Troubleshooting

### Notifications Not Received

1. **Check Topic Subscription**
   - Verify users are subscribed to `team_updates` topic
   - Check app logs for "✅ Subscribed to topic: team_updates"

2. **Check Cloud Function Logs**
   ```bash
   firebase functions:log
   ```
   Look for:
   - "✅ Successfully sent message to topic: team_updates"
   - Any error messages

3. **Check FCM Token**
   - Ensure the app has obtained an FCM token
   - Check app logs for "✅ FCM Token obtained"

4. **Check Permissions**
   - Android 13+: Ensure POST_NOTIFICATIONS permission is granted
   - iOS: Ensure notification permissions are granted

5. **Check Firebase Project Settings**
   - Ensure FCM is enabled in Firebase Console
   - Verify google-services.json is up to date

### Common Issues

**Issue**: "Error sending message to topic: Requested entity was not found"
- **Solution**: Make sure at least one device is subscribed to the topic before sending

**Issue**: "Permission denied" when calling sendCustomNotification
- **Solution**: Ensure the user has 'admin' or 'super_admin' role in Firestore

**Issue**: Notifications work in foreground but not background
- **Solution**: Check that background message handler is set up correctly (already done in notificationService.js)

## Monitoring

### View Function Logs
```bash
firebase functions:log --only sendTestNotification
firebase functions:log --only onMatchCreated
```

### View All Logs
```bash
firebase functions:log
```

### Firebase Console
1. Go to Firebase Console → Functions
2. Click on a function to view logs, metrics, and usage

## Security Notes

1. **Admin-Only Functions**: The `sendCustomNotification` function checks user roles before sending
2. **Topic Naming**: Use descriptive topic names (e.g., `team_updates`, `match_alerts`)
3. **Data Validation**: All notification data is validated before sending

## Next Steps

1. **Deploy the functions** using the steps above
2. **Test with the test endpoint** to verify everything works
3. **Create a match or update** to test automatic notifications
4. **Monitor the logs** to ensure notifications are being sent
5. **Build and test the app** to verify users receive notifications

## Additional Features

### Multiple Topics
You can create additional topics for different notification types:
- `match_alerts`: Only match-related notifications
- `team_news`: Only team news and updates
- `urgent`: Critical announcements

To subscribe to additional topics in the app:
```javascript
await messaging().subscribeToTopic('match_alerts');
```

### Scheduled Notifications
For scheduled notifications (e.g., match reminders), you can use Firebase Cloud Scheduler with Cloud Functions.

### Analytics
Track notification delivery and engagement using Firebase Analytics:
```javascript
import analytics from '@react-native-firebase/analytics';

await analytics().logEvent('notification_received', {
  type: 'match_update',
  matchId: 'abc123'
});
```

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review Cloud Function logs
3. Verify Firebase project configuration
4. Ensure all dependencies are up to date
