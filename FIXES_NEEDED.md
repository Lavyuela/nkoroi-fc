# Fixes Needed - Systematic Approach

## Issues to Fix:

### 1. Missing Notifications for Match Events ❌
**Current**: Only match creation, start, goals, cards send notifications
**Needed**: All match events should send notifications
**Location**: `functions/index.js` - Add listener for match events collection

### 2. Super Admin Not Receiving Admin Updates ❌
**Current**: Super admin doesn't get notified when admin posts updates
**Needed**: Super admin should receive all notifications
**Location**: `functions/index.js` - onUpdateCreated function

### 3. Admin Missing Test Notification Button ❌
**Current**: Admin dashboard doesn't have test notification
**Needed**: Add test notification button for admins
**Location**: `src/screens/AdminDashboardScreen.js`

### 4. Admin Missing Player Management ❌
**Current**: Admin can't access player management
**Needed**: Add player management button in admin dashboard
**Location**: `src/screens/AdminDashboardScreen.js`

### 5. Graphics Missing Save Button ❌
**Current**: Pre-match announcement and lineup graphics only have share
**Needed**: Add save button to save graphics locally
**Location**: `src/screens/PreMatchAnnouncementScreen.js`, `src/screens/LineupGraphicScreen.js`

### 6. Opponent Scores Not Showing in Events ❌
**Current**: When opponent scores, event doesn't show
**Needed**: Show opponent goals in match events
**Location**: `src/screens/MatchDetailScreen.js` - addEvent function

### 7. Nkoroi Lineup Pops Up When Opponent Scores ❌
**Current**: Wrong lineup shows when opponent scores
**Needed**: Don't show lineup popup for opponent goals
**Location**: `src/screens/MatchDetailScreen.js` - goal handling logic

---

## Fix Priority:

**HIGH PRIORITY** (Fix First):
1. Opponent scores bug (#6 & #7)
2. Missing notifications for match events (#1)

**MEDIUM PRIORITY**:
3. Super admin notifications (#2)
4. Save button on graphics (#5)

**LOW PRIORITY**:
5. Test notification button (#3)
6. Player management access (#4)

---

## Implementation Plan:

### Phase 1: Fix Critical Bugs (10 min)
- Fix opponent scoring issues
- Add match events notifications

### Phase 2: Add Missing Features (15 min)
- Add super admin to notification recipients
- Add save button to graphics
- Add test notification button
- Add player management access

### Phase 3: Test Everything (10 min)
- Test all fixes
- Deploy to GitHub
- Download and verify APK

**Total Time: ~35 minutes**

---

**Ready to start fixing?**
