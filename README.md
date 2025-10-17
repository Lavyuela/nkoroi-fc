# Nkoroi FC - Team Management App

**Latest Update**: All fixes applied - Admin Dashboard, Player Management, Match Events Notifications

A real-time football match score tracking mobile application built with React Native and Firebase. The app allows an admin to update live match scores and send push notifications to all team members.

## Features

### For Admin Users
- ✅ Create new matches with team names, venue, and date/time
- ✅ Start and end matches
- ✅ Update scores in real-time during live matches
- ✅ Add match events (goals, cards, etc.)
- ✅ Delete matches
- ✅ Automatic push notifications sent to all users

### For Team Members
- ✅ View all matches (upcoming, live, and finished)
- ✅ Real-time score updates
- ✅ Receive push notifications for:
  - Match start
  - Goals scored
  - Match end
- ✅ View match details and events
- ✅ Pull to refresh

## Tech Stack

- **Frontend**: React Native with Expo
- **UI Library**: React Native Paper
- **Navigation**: React Navigation
- **Backend**: Firebase Realtime Database
- **Authentication**: Firebase Authentication
- **Notifications**: Expo Notifications

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your mobile device (iOS or Android)

## Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Give your project a name (e.g., "Nkoroi FC Live Score")

2. **Enable Firebase Services**
   
   **a) Enable Realtime Database:**
   - In Firebase Console, go to "Build" > "Realtime Database"
   - Click "Create Database"
   - Choose a location closest to your users
   - Start in "Test mode" for development (set proper rules for production)
   - Update the rules to:
   ```json
   {
     "rules": {
       "matches": {
         ".read": "auth != null",
         ".write": "auth != null"
       },
       "users": {
         ".read": "auth != null",
         ".write": "auth != null"
       }
     }
   }
   ```

   **b) Enable Authentication:**
   - Go to "Build" > "Authentication"
   - Click "Get started"
   - Enable "Email/Password" sign-in method

3. **Get Firebase Configuration**
   - In Firebase Console, go to Project Settings (gear icon)
   - Scroll down to "Your apps" section
   - Click the web icon (</>) to add a web app
   - Register your app with a nickname
   - Copy the `firebaseConfig` object

4. **Configure the App**
   - Copy `firebaseConfig.template.js` to `firebaseConfig.js`:
     ```bash
     cp firebaseConfig.template.js firebaseConfig.js
     ```
   - Open `firebaseConfig.js` and paste your Firebase configuration

## Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd "c:\Users\Admin\Downloads\Nkoroi FC"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Make sure you've created `firebaseConfig.js` with your Firebase credentials (see Firebase Setup above)

## Running the App

1. **Start the Expo development server**
   ```bash
   npm start
   ```
   or
   ```bash
   expo start
   ```

2. **Run on your device**
   - Install "Expo Go" app on your iOS or Android device
   - Scan the QR code shown in the terminal or browser
   - The app will load on your device

3. **Run on emulator/simulator**
   - For Android: `npm run android` (requires Android Studio and emulator)
   - For iOS: `npm run ios` (requires Xcode and iOS simulator, macOS only)

## User Guide

### First Time Setup

1. **Register an Admin Account**
   - Open the app
   - Click "Don't have an account? Register"
   - Enter email and password
   - Toggle "Register as Admin" to ON
   - Click "Register"

2. **Register Team Member Accounts**
   - Follow the same process but keep "Register as Admin" OFF
   - Team members will have read-only access

### Admin Usage

1. **Create a Match**
   - Login as admin
   - Click the "+" button (FAB) at the bottom right
   - Enter home team and away team names
   - Optionally add venue and select date/time
   - Click "Create Match"

2. **Start a Match**
   - Tap on an upcoming match
   - Click "Start Match" button
   - All users will receive a notification

3. **Update Scores**
   - During a live match, tap the "⚽ Goal" button under the team that scored
   - Score updates in real-time for all users
   - Notifications are sent automatically

4. **End a Match**
   - Click "End Match" button
   - All users will receive a final score notification

### Team Member Usage

1. **View Matches**
   - Login with your team member account
   - See all matches sorted by status (Live → Upcoming → Finished)
   - Pull down to refresh

2. **View Match Details**
   - Tap on any match to see full details
   - View real-time score updates
   - See match events timeline

3. **Receive Notifications**
   - Allow notifications when prompted
   - Get instant updates for goals and match events

## Project Structure

```
Nkoroi FC/
├── App.js                          # Main app entry point
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── firebaseConfig.template.js      # Firebase config template
├── src/
│   ├── context/
│   │   └── AuthContext.js         # Authentication context
│   ├── navigation/
│   │   └── AppNavigator.js        # Navigation setup
│   ├── screens/
│   │   ├── LoginScreen.js         # Login screen
│   │   ├── RegisterScreen.js      # Registration screen
│   │   ├── HomeScreen.js          # Main matches list
│   │   ├── MatchDetailScreen.js   # Match details and controls
│   │   └── CreateMatchScreen.js   # Create new match
│   └── services/
│       ├── firebase.js            # Firebase operations
│       └── notifications.js       # Push notifications
```

## Database Structure

```json
{
  "users": {
    "userId": {
      "email": "user@example.com",
      "isAdmin": true,
      "createdAt": 1234567890
    }
  },
  "matches": {
    "matchId": {
      "homeTeam": "Nkoroi FC",
      "awayTeam": "Rival FC",
      "homeScore": 2,
      "awayScore": 1,
      "status": "live",
      "venue": "Main Stadium",
      "matchDate": 1234567890,
      "events": {
        "eventId": {
          "type": "goal",
          "team": "Nkoroi FC",
          "description": "Goal scored",
          "timestamp": 1234567890
        }
      }
    }
  }
}
```

## Customization

### Change App Colors
Edit the color scheme in the screen files. The primary color is `#1a472a` (dark green).

### Modify Notification Sounds
Update the notification configuration in `src/services/notifications.js`.

### Add More Match Events
Extend the `addMatchEvent` function in `src/services/firebase.js` to support cards, substitutions, etc.

## Troubleshooting

### Firebase Connection Issues
- Verify your `firebaseConfig.js` has the correct credentials
- Check Firebase Console for any service outages
- Ensure Realtime Database and Authentication are enabled

### Notifications Not Working
- Notifications only work on physical devices, not simulators
- Ensure you've granted notification permissions
- Check that Expo Notifications is properly configured in `app.json`

### Build Errors
- Delete `node_modules` and run `npm install` again
- Clear Expo cache: `expo start -c`
- Ensure all dependencies are compatible versions

## Production Deployment

### Building for Production

1. **Configure app.json**
   - Update `expo.name`, `expo.slug`
   - Add proper icons and splash screens
   - Configure iOS bundle identifier and Android package name

2. **Build with EAS**
   ```bash
   npm install -g eas-cli
   eas build --platform android
   eas build --platform ios
   ```

3. **Update Firebase Rules**
   - Set proper security rules for production
   - Restrict write access to admin users only

### Security Considerations
- Never commit `firebaseConfig.js` to version control
- Use Firebase Security Rules to protect data
- Implement proper user role validation
- Enable Firebase App Check for production

## Support

For issues or questions:
- Check Firebase Console for errors
- Review Expo documentation: https://docs.expo.dev/
- Check Firebase documentation: https://firebase.google.com/docs

## License

This project is created for Nkoroi FC. All rights reserved.

---

**Developed with ⚽ for Nkoroi FC**
