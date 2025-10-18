# 🎯 End-to-End Test Checklist - Nkoroi FC App

## ✅ Complete Match Flow Testing

### 1. Pre-Match Phase

#### Admin Actions:
- [ ] **Create Match**
  - Navigate to Admin Dashboard → Create Match
  - Fill in: Home Team, Away Team, Date, Time, Venue
  - Match appears in Home screen with "Upcoming" status
  
- [ ] **Create Pre-Match Announcement**
  - Go to match details → Pre-Match Announcement
  - Customize message and graphics
  - Click "Share" → **Notification sent to all fans**
  - Click "Save" → Graphic saved to Saved Graphics
  
- [ ] **Create Lineup**
  - Go to match details → Create Lineup Graphic
  - Select formation (test changing formation multiple times)
  - Assign all 11 players (GK, defenders, midfielders, forwards)
  - Click "Save" → Lineup saved to match
  - Click "Share" → **Notification sent to all fans**
  - Verify saved in Saved Graphics

#### Fan Actions:
- [ ] **View Upcoming Match**
  - See match in Home screen
  - Tap match to view details
  - Make prediction (Home Win / Draw / Away Win)
  - Prediction saved and displayed

- [ ] **Receive Notifications**
  - ✅ Pre-match announcement notification received
  - ✅ Lineup announcement notification received

---

### 2. Match Start

#### Admin Actions:
- [ ] **Start Match**
  - Open match details
  - Click "Start Match" button
  - Match status changes to "Live" (red badge)
  - Match minute starts at 0

#### Fan Actions:
- [ ] **View Live Match**
  - Match shows "Live" status with red badge
  - Can see current score (0-0)
  - Match appears at top of Home screen

---

### 3. During Match - All Events

#### 3.1 Goals (Nkoroi FC)
- [ ] **Score Goal**
  - Admin clicks "⚽ [Team Name]" button
  - Score updates immediately
  - Player selection dialog appears
  - Select player who scored
  - **Notification sent: "🔥 GOAL! [Team] X - Y [Team]" with player name**
  - Event appears in match events list

#### 3.2 Goals (Opponent)
- [ ] **Opponent Scores**
  - Admin clicks opponent goal button
  - Score updates immediately
  - No player selection (opponent team)
  - **Notification sent with score update**

#### 3.3 Yellow Cards
- [ ] **Yellow Card (Nkoroi FC)**
  - Click "🟨 [Team]" button
  - Player selection appears (only lineup players if lineup saved)
  - Select player
  - **Notification sent: "🟨 Yellow Card" with player name**

- [ ] **Yellow Card (Opponent)**
  - Click opponent yellow card
  - No player selection
  - **Notification sent: "🟨 Yellow Card for [Opponent]"**

#### 3.4 Red Cards
- [ ] **Red Card (Nkoroi FC)**
  - Click "🟥 [Team]" button
  - Player selection appears
  - Select player
  - **Notification sent: "🟥 Red Card!" with player name**

- [ ] **Red Card (Opponent)**
  - Click opponent red card
  - **Notification sent: "🟥 Red Card! [Opponent] player sent off"**

#### 3.5 Substitutions
- [ ] **Substitution (Nkoroi FC)**
  - Click "🔄 [Team]" button
  - Dialog: "Select Player Going OFF"
  - Select player going off
  - Dialog changes: "Select Player Coming IN ([Player] going off)"
  - Select player coming in
  - **Notification sent: "🔄 Substitution" showing "[Player OUT] OFF ➡️ [Player IN] ON"**
  - Event shows both players

- [ ] **Substitution (Opponent)**
  - Click opponent substitution
  - **Notification sent: "🔄 Substitution for [Opponent]"**

#### 3.6 Other Events
- [ ] **Penalty** - Click penalty button → **Notification: "🎯 Penalty!"**
- [ ] **Corner** - Click corner button → **Notification: "🚩 Corner Kick"**
- [ ] **Injury** - Click injury button → **Notification: "🏥 Injury"**
- [ ] **Half Time** - Click "⏸️ Half Time" → **Notification: "Half Time: [Score]"**

#### 3.7 Match Minute Control
- [ ] **Update Match Minute**
  - Click minute display
  - Enter new minute (e.g., 45)
  - Minute updates for all events

---

### 4. Match End

#### Admin Actions:
- [ ] **End Match**
  - Click "🏆 End Match" button
  - Match status changes to "Finished"
  - Final score locked
  - Match moves to bottom of Home screen

- [ ] **Share Match Result**
  - Go to match details
  - Click "Share Match Result"
  - Create result graphic
  - Share to fans

#### Fan Actions:
- [ ] **View Final Result**
  - See finished match with final score
  - View all match events
  - Check if prediction was correct

---

## 📱 Notification Testing

### All Users Should Receive:
1. ✅ Pre-match announcements
2. ✅ Lineup announcements
3. ✅ Goal notifications (with player name)
4. ✅ Yellow card notifications
5. ✅ Red card notifications
6. ✅ Substitution notifications (with player in/out)
7. ✅ Penalty notifications
8. ✅ Corner kick notifications
9. ✅ Injury notifications
10. ✅ Half-time notifications

### Notification Requirements:
- [ ] **Regular Admin** - Receives all notifications
- [ ] **Super Admin** - Receives all notifications (NO DUPLICATES)
- [ ] **Regular Fans** - Receive all notifications
- [ ] **Notifications appear only ONCE** (no duplicates)
- [ ] **Foreground** - Notifications show while app is open
- [ ] **Background** - Notifications show when app is in background
- [ ] **Killed** - Notifications show when app is closed

---

## 🛠️ Admin Dashboard Testing

### Regular Admin Dashboard:
- [ ] Shows "⚽ Welcome, Admin!"
- [ ] Shows Quick Stats (4 cards)
- [ ] Shows only these tools:
  - Player Management
  - Create Match
  - Saved Graphics
  - Test Notifications
- [ ] Does NOT show:
  - User Management
  - Advanced Analytics

### Super Admin Dashboard:
- [ ] Shows "👑 Welcome, Super Admin!"
- [ ] Shows Quick Stats (6 cards including Users & Predictions)
- [ ] Shows all tools including:
  - Player Management
  - Create Match
  - Saved Graphics
  - Test Notifications
  - User Management (red icon)
  - Advanced Analytics (cyan icon)

### Super Admin Analytics:
- [ ] Opens visual BI dashboard
- [ ] Shows user analytics with progress bars
- [ ] Shows match analytics
- [ ] Shows match events overview
- [ ] Shows player analytics
- [ ] Shows prediction accuracy
- [ ] Shows top predictors
- [ ] Can refresh data
- [ ] Shows "Nkoroi to the World" footer

---

## 📊 Saved Graphics Testing

### Admin Actions:
- [ ] Navigate to Saved Graphics from Admin Dashboard
- [ ] See all saved announcements and lineups
- [ ] Each graphic shows:
  - Type (📢 Announcement / ⚽ Lineup)
  - Date and time
  - Preview image
- [ ] Can share individual graphics
- [ ] Can delete graphics
- [ ] Empty state shows helpful message

---

## 🎨 Visual Appeal Testing

### General UI:
- [ ] App loads quickly (lightweight)
- [ ] Smooth scrolling on Home screen
- [ ] Cards have proper elevation/shadows
- [ ] Colors are consistent
- [ ] Icons are clear and meaningful
- [ ] "Nkoroi to the World" footer on all relevant screens

### Performance:
- [ ] Home screen shows max 20 matches
- [ ] FlatList renders smoothly
- [ ] No lag when scrolling
- [ ] Images load efficiently
- [ ] Transitions are smooth

---

## 🔐 User Role Testing

### Super Admin:
- [ ] Can access Admin Dashboard
- [ ] Can access User Management
- [ ] Can access Advanced Analytics
- [ ] Can create matches
- [ ] Can manage players
- [ ] Can control live matches
- [ ] Receives notifications (no duplicates)

### Regular Admin:
- [ ] Can access Admin Dashboard (limited)
- [ ] CANNOT access User Management
- [ ] CANNOT access Advanced Analytics
- [ ] Can create matches
- [ ] Can manage players
- [ ] Can control live matches
- [ ] Receives notifications

### Regular Fan:
- [ ] Can view matches
- [ ] Can make predictions
- [ ] Can view team stats
- [ ] Can view team updates
- [ ] CANNOT access admin features
- [ ] Receives all notifications

---

## 🐛 Bug Fixes Verification

### Fixed Issues:
- [x] Admin Dashboard shows correct welcome message
- [x] Formation can be changed multiple times
- [x] Player selection only for Nkoroi FC (home or away)
- [x] Substitution shows player in AND player out
- [x] Goal notifications show player name
- [x] Duplicate notifications fixed for super admin
- [x] Saved Graphics screen accessible
- [x] Notifications for announcements and lineups
- [x] "Nkoroi to the World" footer everywhere
- [x] App is lightweight and performant

---

## 🚀 Deployment Checklist

- [x] All code committed
- [x] Pushed to GitHub
- [ ] APK building on GitHub Actions
- [ ] Cloud Functions deployed (if changes made)
- [ ] Test on physical device
- [ ] Verify all notifications work
- [ ] Verify no duplicates
- [ ] Verify complete match flow

---

## 📝 Final Verification

### Critical Path:
1. Create match → ✅ Notification sent
2. Create announcement → ✅ Notification sent
3. Create lineup → ✅ Notification sent & lineup saved
4. Start match → Match goes live
5. Score goal → ✅ Notification with player name
6. Yellow card → ✅ Notification with player name
7. Substitution → ✅ Notification with both players
8. End match → Match finishes
9. All fans received ALL notifications
10. No duplicate notifications

---

## 🌍 Nkoroi to the World 🌍

**Build Status**: https://github.com/Lavyuela/nkoroi-fc/actions

**Last Updated**: October 18, 2025
