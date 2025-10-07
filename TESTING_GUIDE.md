# Testing Guide for Nkoroi FC Live Score

This guide helps you test all features of the app to ensure everything works correctly.

## Prerequisites

- App installed and running on at least 2 devices (or 1 device + 1 emulator)
- Firebase configured correctly
- At least 2 user accounts created (1 admin, 1 team member)

## Test Scenarios

### 1. Authentication Tests

#### Test 1.1: Admin Registration
**Steps:**
1. Open the app
2. Click "Don't have an account? Register"
3. Enter email: `admin@nkoroifc.com`
4. Enter password: `admin123`
5. Toggle "Register as Admin" to ON
6. Click "Register"

**Expected Result:**
- ✅ Registration successful
- ✅ Redirected to login screen
- ✅ User appears in Firebase Console → Authentication

#### Test 1.2: Team Member Registration
**Steps:**
1. Click "Don't have an account? Register"
2. Enter email: `member@nkoroifc.com`
3. Enter password: `member123`
4. Keep "Register as Admin" OFF
5. Click "Register"

**Expected Result:**
- ✅ Registration successful
- ✅ User created without admin privileges

#### Test 1.3: Login
**Steps:**
1. Enter registered email and password
2. Click "Login"

**Expected Result:**
- ✅ Login successful
- ✅ Redirected to home screen
- ✅ Admin sees "👑 Admin Mode" badge (if admin)

#### Test 1.4: Logout
**Steps:**
1. On home screen, click logout icon (top right)

**Expected Result:**
- ✅ Logged out successfully
- ✅ Redirected to login screen

#### Test 1.5: Invalid Login
**Steps:**
1. Enter wrong password
2. Click "Login"

**Expected Result:**
- ✅ Error message displayed
- ✅ Remains on login screen

---

### 2. Match Creation Tests (Admin Only)

#### Test 2.1: Create Basic Match
**Steps:**
1. Login as admin
2. Click the "+" FAB button
3. Enter Home Team: "Nkoroi FC"
4. Enter Away Team: "Rival FC"
5. Leave venue empty
6. Click "Create Match"

**Expected Result:**
- ✅ Success message shown
- ✅ Redirected to home screen
- ✅ New match appears in list
- ✅ Match status is "📅 Upcoming"
- ✅ Scores show 0-0

#### Test 2.2: Create Match with All Details
**Steps:**
1. Click "+" button
2. Enter Home Team: "Nkoroi FC"
3. Enter Away Team: "Test United"
4. Enter Venue: "Main Stadium"
5. Click date/time button and select future date
6. Click "Create Match"

**Expected Result:**
- ✅ Match created with all details
- ✅ Venue displayed on match card
- ✅ Date/time displayed correctly

#### Test 2.3: Create Match - Validation
**Steps:**
1. Click "+" button
2. Leave Home Team empty
3. Enter Away Team: "Test FC"
4. Click "Create Match"

**Expected Result:**
- ✅ Error message: "Please enter both team names"
- ✅ Match not created

---

### 3. Real-time Updates Tests

#### Test 3.1: Match List Updates
**Setup:** Have 2 devices logged in (1 admin, 1 member)

**Steps:**
1. On admin device, create a new match
2. Observe member device

**Expected Result:**
- ✅ New match appears on member device immediately
- ✅ No refresh needed

#### Test 3.2: Score Updates
**Setup:** Have a live match and 2 devices viewing it

**Steps:**
1. Admin device: Open match details
2. Member device: Open same match details
3. Admin device: Click "⚽ Goal" for home team
4. Observe member device

**Expected Result:**
- ✅ Score updates immediately on member device
- ✅ No refresh needed
- ✅ Both devices show same score

---

### 4. Match Management Tests (Admin)

#### Test 4.1: Start Match
**Steps:**
1. Login as admin
2. Open an upcoming match
3. Click "Start Match"

**Expected Result:**
- ✅ Match status changes to "🔴 LIVE"
- ✅ Status updates on home screen
- ✅ Goal buttons appear
- ✅ Notification sent (if enabled)

#### Test 4.2: Update Score - Home Team
**Steps:**
1. Open a live match as admin
2. Click "⚽ Goal" under home team
3. Wait 1 second
4. Click "⚽ Goal" again

**Expected Result:**
- ✅ Home score increases by 1 each time
- ✅ Score updates in real-time
- ✅ Event added to match events
- ✅ Notification sent

#### Test 4.3: Update Score - Away Team
**Steps:**
1. Open a live match as admin
2. Click "⚽ Goal" under away team

**Expected Result:**
- ✅ Away score increases by 1
- ✅ Updates visible immediately

#### Test 4.4: End Match
**Steps:**
1. Open a live match as admin
2. Click "End Match"

**Expected Result:**
- ✅ Match status changes to "✓ Finished"
- ✅ Goal buttons disappear
- ✅ Final score notification sent
- ✅ Match moves to bottom of list

#### Test 4.5: Delete Match
**Steps:**
1. Open any match as admin
2. Click delete icon (top right)
3. Confirm deletion

**Expected Result:**
- ✅ Confirmation dialog appears
- ✅ Match deleted from database
- ✅ Match removed from list
- ✅ Redirected to home screen

---

### 5. Team Member View Tests

#### Test 5.1: View Matches
**Steps:**
1. Login as team member
2. View home screen

**Expected Result:**
- ✅ Can see all matches
- ✅ Cannot see "+" button
- ✅ No "👑 Admin Mode" badge
- ✅ Matches sorted: Live → Upcoming → Finished

#### Test 5.2: View Match Details
**Steps:**
1. Login as team member
2. Tap on any match

**Expected Result:**
- ✅ Can view match details
- ✅ Can see scores
- ✅ Cannot see admin controls
- ✅ Cannot see goal buttons
- ✅ Cannot delete match

#### Test 5.3: Pull to Refresh
**Steps:**
1. On home screen, pull down to refresh

**Expected Result:**
- ✅ Refresh animation shows
- ✅ Match list updates
- ✅ Loading stops after update

---

### 6. Notification Tests

#### Test 6.1: Permission Request
**Steps:**
1. Install app on new device
2. Login for first time

**Expected Result:**
- ✅ Notification permission requested
- ✅ App works even if denied

#### Test 6.2: Match Start Notification
**Steps:**
1. Have team member logged in
2. Admin starts a match
3. Check team member device

**Expected Result:**
- ✅ Notification received: "🏁 Match Started!"
- ✅ Shows team names
- ✅ Tapping opens app

#### Test 6.3: Goal Notification
**Steps:**
1. Have team member logged in
2. Admin adds a goal during live match
3. Check team member device

**Expected Result:**
- ✅ Notification received: "⚽ GOAL! [Team Name]"
- ✅ Shows updated score
- ✅ Tapping opens app

#### Test 6.4: Match End Notification
**Steps:**
1. Have team member logged in
2. Admin ends a match
3. Check team member device

**Expected Result:**
- ✅ Notification received: "🏆 Full Time!"
- ✅ Shows final score
- ✅ Tapping opens app

---

### 7. UI/UX Tests

#### Test 7.1: Match Sorting
**Steps:**
1. Create multiple matches with different statuses
2. View home screen

**Expected Result:**
- ✅ Live matches appear first
- ✅ Upcoming matches in middle
- ✅ Finished matches at bottom

#### Test 7.2: Empty State
**Steps:**
1. Delete all matches
2. View home screen

**Expected Result:**
- ✅ Shows football emoji
- ✅ Shows "No matches yet" message
- ✅ Shows appropriate message for admin/member

#### Test 7.3: Loading States
**Steps:**
1. Logout and login again
2. Observe loading indicators

**Expected Result:**
- ✅ Loading spinner shows while fetching data
- ✅ Smooth transition to content

#### Test 7.4: Match Card Display
**Steps:**
1. View a match card on home screen

**Expected Result:**
- ✅ Status chip clearly visible
- ✅ Team names readable
- ✅ Scores prominent
- ✅ Venue shown (if available)
- ✅ Date shown for upcoming matches

---

### 8. Error Handling Tests

#### Test 8.1: Network Disconnection
**Steps:**
1. Open app while online
2. Turn off WiFi/data
3. Try to create a match (admin)

**Expected Result:**
- ✅ Error message displayed
- ✅ App doesn't crash
- ✅ Can retry when back online

#### Test 8.2: Invalid Firebase Config
**Steps:**
1. Use incorrect Firebase config
2. Try to login

**Expected Result:**
- ✅ Clear error message
- ✅ App doesn't crash

#### Test 8.3: Concurrent Updates
**Steps:**
1. Have 2 admin devices
2. Both update same match simultaneously

**Expected Result:**
- ✅ Both updates processed
- ✅ Final state is consistent
- ✅ No data loss

---

### 9. Performance Tests

#### Test 9.1: Many Matches
**Steps:**
1. Create 20+ matches
2. Scroll through list

**Expected Result:**
- ✅ Smooth scrolling
- ✅ No lag
- ✅ All matches load

#### Test 9.2: Rapid Score Updates
**Steps:**
1. Quickly tap goal button 10 times

**Expected Result:**
- ✅ All goals registered
- ✅ Score updates correctly
- ✅ No crashes

#### Test 9.3: Multiple Users
**Steps:**
1. Have 5+ devices viewing same match
2. Admin updates score

**Expected Result:**
- ✅ All devices update simultaneously
- ✅ No delays
- ✅ Consistent data across devices

---

### 10. Security Tests

#### Test 10.1: Non-Admin Cannot Create Match
**Steps:**
1. Login as team member
2. Try to access create match screen

**Expected Result:**
- ✅ No "+" button visible
- ✅ Cannot navigate to create screen

#### Test 10.2: Non-Admin Cannot Update Score
**Steps:**
1. Login as team member
2. View live match details

**Expected Result:**
- ✅ No goal buttons visible
- ✅ No admin controls shown

#### Test 10.3: Unauthenticated Access
**Steps:**
1. Logout
2. Try to access app

**Expected Result:**
- ✅ Redirected to login screen
- ✅ Cannot view matches without login

---

## Test Checklist

Use this checklist to track your testing progress:

### Authentication
- [ ] Admin registration works
- [ ] Team member registration works
- [ ] Login works
- [ ] Logout works
- [ ] Invalid credentials handled

### Match Management (Admin)
- [ ] Create match works
- [ ] Start match works
- [ ] Update home team score works
- [ ] Update away team score works
- [ ] End match works
- [ ] Delete match works

### Real-time Updates
- [ ] New matches appear immediately
- [ ] Score updates appear immediately
- [ ] Status changes appear immediately

### Notifications
- [ ] Match start notification works
- [ ] Goal notification works
- [ ] Match end notification works

### Team Member View
- [ ] Can view all matches
- [ ] Cannot access admin features
- [ ] Real-time updates work

### UI/UX
- [ ] Match sorting correct
- [ ] Empty state displays
- [ ] Loading states work
- [ ] All screens responsive

### Error Handling
- [ ] Network errors handled
- [ ] Invalid data handled
- [ ] Concurrent updates handled

### Security
- [ ] Non-admins cannot create matches
- [ ] Non-admins cannot update scores
- [ ] Unauthenticated users redirected

---

## Reporting Issues

If you find any issues during testing:

1. **Note the issue details:**
   - What you were trying to do
   - What happened
   - What you expected to happen
   - Device and OS version

2. **Check Firebase Console:**
   - Authentication → Users (verify user exists)
   - Realtime Database → Data (check data structure)
   - Realtime Database → Rules (verify rules are correct)

3. **Check app logs:**
   - Look for error messages in Expo console
   - Check browser console if running on web

4. **Common fixes:**
   - Clear app cache: `expo start -c`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Verify Firebase config is correct
   - Check internet connection

---

## Success Criteria

The app is ready for production when:
- ✅ All test scenarios pass
- ✅ No critical bugs found
- ✅ Real-time updates work consistently
- ✅ Notifications delivered reliably
- ✅ Security rules enforced properly
- ✅ Performance acceptable with expected load
- ✅ UI/UX smooth and intuitive

---

**Happy Testing! ⚽**
