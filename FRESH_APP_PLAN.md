# Nkoroi FC - Fresh App Rebuild Plan

## 🎯 Complete Feature List

### 1. Authentication & User Management
- ✅ Email/Password login and registration
- ✅ User roles: super_admin, admin, regular user
- ✅ Persistent login (stay logged in)
- ✅ Password reset functionality
- ✅ User profile management
- ✅ Admin can manage user roles

### 2. Match Management
- ✅ Create matches (admin only)
- ✅ Edit match details
- ✅ Live score updates
- ✅ Match status (upcoming, live, finished)
- ✅ Match history
- ✅ Match details view
- ✅ Real-time score updates

### 3. Push Notifications (Priority Feature)
- ✅ Send notifications to ALL users from app
- ✅ Automatic notifications when:
  - New match is created
  - Match score updates
  - Team update is posted
- ✅ Admin notification panel with:
  - Custom message composer
  - Quick action buttons
  - Preview before sending
- ✅ Topic-based FCM notifications
- ✅ Works even when app is closed

### 4. Team Updates & News
- ✅ Create team updates (admin only)
- ✅ View all updates
- ✅ Rich text content
- ✅ Images in updates
- ✅ Notifications for new updates

### 5. Player Management
- ✅ Add/edit/remove players
- ✅ Player profiles
- ✅ Player statistics
- ✅ Team roster

### 6. Graphics Generation
- ✅ Lineup graphics
- ✅ Match result graphics
- ✅ Pre-match announcements
- ✅ Fan reaction graphics
- ✅ Share to social media

### 7. Match Predictions
- ✅ Users can predict match scores
- ✅ Leaderboard for predictions
- ✅ Points system

### 8. Analytics & Stats
- ✅ User engagement metrics
- ✅ Match statistics
- ✅ Notification delivery stats
- ✅ Admin dashboard with overview

### 9. Favorites
- ✅ Users can favorite matches
- ✅ Quick access to favorite matches

### 10. Settings
- ✅ Notification preferences
- ✅ App settings
- ✅ Account management

## 🏗️ Technical Architecture

### Frontend (React Native)
- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **UI Library**: React Native Paper
- **State Management**: React Context API
- **Icons**: React Native Vector Icons

### Backend (Firebase)
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **Cloud Functions**: Firebase Functions (Node.js)
- **Storage**: Firebase Storage (for images)

### Key Dependencies
```json
{
  "@react-native-firebase/app": "^21.8.0",
  "@react-native-firebase/auth": "^21.8.0",
  "@react-native-firebase/firestore": "^21.8.0",
  "@react-native-firebase/functions": "^21.8.0",
  "@react-native-firebase/messaging": "^21.8.0",
  "@react-native-firebase/storage": "^21.8.0",
  "@notifee/react-native": "^9.0.0",
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/stack": "^6.3.20",
  "react-native-paper": "^5.11.0",
  "react-native-vector-icons": "^10.0.0",
  "react-native-share": "^10.0.2",
  "react-native-view-shot": "^4.0.3"
}
```

## 📁 Clean Project Structure

```
nkoroi-fc/
├── src/
│   ├── components/          # Reusable components
│   │   ├── MatchCard.js
│   │   ├── PlayerCard.js
│   │   ├── UpdateCard.js
│   │   └── GraphicTemplate.js
│   │
│   ├── screens/            # All app screens
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   └── RegisterScreen.js
│   │   ├── matches/
│   │   │   ├── MatchListScreen.js
│   │   │   ├── MatchDetailScreen.js
│   │   │   └── CreateMatchScreen.js
│   │   ├── admin/
│   │   │   ├── AdminDashboardScreen.js
│   │   │   ├── SendNotificationScreen.js
│   │   │   ├── UserManagementScreen.js
│   │   │   └── AnalyticsScreen.js
│   │   ├── players/
│   │   │   ├── PlayerListScreen.js
│   │   │   └── PlayerManagementScreen.js
│   │   ├── updates/
│   │   │   ├── UpdatesListScreen.js
│   │   │   └── CreateUpdateScreen.js
│   │   └── graphics/
│   │       ├── LineupGraphicScreen.js
│   │       └── MatchResultGraphicScreen.js
│   │
│   ├── services/           # Business logic
│   │   ├── authService.js
│   │   ├── matchService.js
│   │   ├── notificationService.js
│   │   ├── adminNotificationService.js
│   │   ├── playerService.js
│   │   └── analyticsService.js
│   │
│   ├── context/            # React Context
│   │   └── AuthContext.js
│   │
│   ├── navigation/         # Navigation setup
│   │   └── AppNavigator.js
│   │
│   ├── config/             # Configuration
│   │   ├── firebase.js
│   │   └── colors.js
│   │
│   └── utils/              # Utility functions
│       └── helpers.js
│
├── functions/              # Cloud Functions
│   ├── index.js           # All cloud functions
│   └── package.json
│
├── android/               # Android native code
├── ios/                   # iOS native code (future)
├── assets/                # Images, fonts, etc.
└── App.js                 # Entry point
```

## 🚀 Implementation Plan

### Phase 1: Foundation (Day 1)
1. ✅ Set up fresh React Native project
2. ✅ Configure Firebase
3. ✅ Set up navigation
4. ✅ Create authentication screens
5. ✅ Implement AuthContext

### Phase 2: Core Features (Day 2-3)
1. ✅ Match management screens
2. ✅ Match list and details
3. ✅ Create/edit matches
4. ✅ Real-time score updates

### Phase 3: Notifications (Day 4) - PRIORITY
1. ✅ Set up FCM and Notifee
2. ✅ Create Cloud Functions for notifications
3. ✅ Build admin notification screen
4. ✅ Test topic-based notifications
5. ✅ Automatic notifications for matches

### Phase 4: Additional Features (Day 5-6)
1. ✅ Team updates
2. ✅ Player management
3. ✅ Graphics generation
4. ✅ Predictions
5. ✅ Analytics

### Phase 5: Polish & Testing (Day 7)
1. ✅ UI/UX improvements
2. ✅ Bug fixes
3. ✅ Testing all features
4. ✅ Build and deploy

## 🎨 Design Principles

1. **Clean & Modern UI**
   - Use React Native Paper components
   - Consistent color scheme (team colors)
   - Smooth animations
   - Intuitive navigation

2. **Performance**
   - Optimize images
   - Lazy loading
   - Efficient Firestore queries
   - Minimal re-renders

3. **User Experience**
   - Clear error messages
   - Loading states
   - Offline support
   - Fast response times

4. **Security**
   - Role-based access control
   - Secure Cloud Functions
   - Input validation
   - Protected routes

## 📱 Key Screens

### For Regular Users:
1. Home (Match list)
2. Match Details
3. Team Updates
4. Player List
5. Predictions
6. Profile/Settings

### For Admins (Additional):
7. Admin Dashboard
8. **Send Notifications** (Priority)
9. Create Match
10. Create Update
11. Player Management
12. User Management
13. Analytics

## 🔔 Notification System (Detailed)

### Admin Notification Panel Features:
- **Custom Composer**:
  - Title field (max 50 chars)
  - Message field (max 200 chars)
  - Character counter
  - Preview before sending
  
- **Quick Actions**:
  - Send test notification
  - Match reminder
  - Practice reminder
  - Welcome message
  - Victory celebration

- **Automatic Triggers**:
  - New match created → "⚽ New Match Scheduled!"
  - Score updated → "🔥 GOAL! Team A 2-1 Team B"
  - Team update posted → "📢 Team Update!"

### Cloud Functions:
1. `sendCustomNotification` - Admin sends custom message
2. `onMatchCreated` - Auto-notify on new match
3. `onMatchUpdated` - Auto-notify on score change
4. `onUpdateCreated` - Auto-notify on team update
5. `sendTestNotification` - Test endpoint

## ✅ Success Criteria

The app is successful when:
1. ✅ Users can login/register smoothly
2. ✅ Admins can create and manage matches
3. ✅ **Admins can send notifications to ALL users from the app**
4. ✅ Users receive notifications even when app is closed
5. ✅ Automatic notifications work for matches and updates
6. ✅ All features work without crashes
7. ✅ Clean, modern UI
8. ✅ Fast and responsive
9. ✅ Works on all Android devices
10. ✅ Easy to maintain and extend

## 🛠️ Build & Deployment

### Development:
- Local testing with Expo
- Firebase emulators for functions
- Debug builds for testing

### Production:
- GitHub Actions for automated builds
- Release APK with proper signing
- Firebase hosting for web version (future)

## 📝 Next Steps

1. **Confirm this plan** - Make sure this covers everything you want
2. **Create new project folder** - Fresh start
3. **Set up Firebase project** - New or existing?
4. **Start implementation** - Follow the phases
5. **Test thoroughly** - Each feature as we build
6. **Deploy** - GitHub Actions build

---

**Ready to start?** Let me know and I'll begin creating the fresh app structure!
