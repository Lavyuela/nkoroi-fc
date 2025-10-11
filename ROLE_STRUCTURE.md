# 👥 Role Structure - Clear Hierarchy

## 🎯 Role Distribution

### 👑 Super Admin (ONE USER ONLY)
- **Count:** Exactly **1** across ALL devices
- **Who:** First user to register in the system
- **Cannot be changed:** Once set, this is permanent (unless manually changed in Firebase)
- **Access:** Full system control

### 🛡️ Admin (MULTIPLE USERS)
- **Count:** **Multiple** users can be Admins
- **Who:** Users promoted by Super Admin
- **Can be changed:** Super Admin can promote/demote
- **Access:** Match management

### ⚽ Fan (UNLIMITED)
- **Count:** **Unlimited** users
- **Who:** All users by default (except first user)
- **Can be changed:** Super Admin can promote to Admin
- **Access:** View and interact

---

## 📊 Visual Structure

```
                    ☁️ Firebase Cloud
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
    Device 1          Device 2          Device 3
        │                 │                 │
        ↓                 ↓                 ↓
        
👑 Super Admin (1 user total)
├── ivy@gmail.com ← First registered user
└── Access: Everything

🛡️ Admins (Multiple users)
├── admin1@gmail.com ← Promoted by Super Admin
├── admin2@gmail.com ← Promoted by Super Admin
├── admin3@gmail.com ← Promoted by Super Admin
└── Access: Match management

⚽ Fans (Unlimited)
├── fan1@gmail.com
├── fan2@gmail.com
├── fan3@gmail.com
├── fan4@gmail.com
└── ... (unlimited)
```

---

## 🔄 User Journey Examples

### Example 1: First User (Super Admin)
```
1. App installed (no users exist)
2. User registers: ivy@gmail.com
3. Firebase checks: Any Super Admin? → NO
4. Firebase assigns: ivy@gmail.com → Super Admin ✅
5. Result: ONE Super Admin across all devices
```

### Example 2: Second User (Fan)
```
1. App installed
2. User registers: manga@gmail.com
3. Firebase checks: Any Super Admin? → YES (ivy)
4. Firebase assigns: manga@gmail.com → Fan ✅
5. Result: Still ONE Super Admin, manga is Fan
```

### Example 3: Promoting to Admin
```
1. ivy@gmail.com (Super Admin) logs in
2. Goes to User Management
3. Finds manga@gmail.com (Fan)
4. Promotes to Admin
5. Result: 
   - Super Admin: 1 (ivy)
   - Admins: 1 (manga) ✅
   - Fans: Others
```

### Example 4: Multiple Admins
```
1. Super Admin promotes:
   - manga@gmail.com → Admin
   - john@gmail.com → Admin
   - sarah@gmail.com → Admin
   
2. Result:
   - Super Admin: 1 (ivy)
   - Admins: 3 (manga, john, sarah) ✅
   - Fans: Others
```

---

## 🚫 What's NOT Possible

### ❌ Multiple Super Admins
```
❌ WRONG:
   - ivy@gmail.com → Super Admin
   - manga@gmail.com → Super Admin
   
✅ CORRECT:
   - ivy@gmail.com → Super Admin (ONLY ONE)
   - manga@gmail.com → Admin or Fan
```

### ❌ Changing First User
```
❌ WRONG:
   - First user: ivy@gmail.com (Super Admin)
   - Later: Make manga@gmail.com Super Admin instead
   
✅ CORRECT:
   - First user: ivy@gmail.com (Super Admin FOREVER)
   - Others: Can only be Admin or Fan
```

---

## ✅ What IS Possible

### ✅ Multiple Admins
```
✅ Super Admin can promote MANY users to Admin:
   - Admin 1: manga@gmail.com
   - Admin 2: john@gmail.com
   - Admin 3: sarah@gmail.com
   - Admin 4: peter@gmail.com
   - ... (as many as needed)
```

### ✅ Demoting Admins
```
✅ Super Admin can demote Admins back to Fan:
   - manga@gmail.com: Admin → Fan
   - john@gmail.com: Admin → Fan
```

### ✅ Promoting Fans
```
✅ Super Admin can promote Fans to Admin:
   - fan1@gmail.com: Fan → Admin
   - fan2@gmail.com: Fan → Admin
```

---

## 🎯 Permission Matrix

| Action | Super Admin | Admin | Fan |
|--------|-------------|-------|-----|
| **User Management** | ✅ | ❌ | ❌ |
| **View Dashboard** | ✅ | ❌ | ❌ |
| **View Analytics** | ✅ | ❌ | ❌ |
| **Promote to Admin** | ✅ | ❌ | ❌ |
| **Demote Admin** | ✅ | ❌ | ❌ |
| **Create Match** | ✅ | ✅ | ❌ |
| **Update Match** | ✅ | ✅ | ❌ |
| **Delete Match** | ✅ | ✅ | ❌ |
| **Create Update** | ✅ | ✅ | ❌ |
| **View Matches** | ✅ | ✅ | ✅ |
| **Make Predictions** | ✅ | ✅ | ✅ |
| **Favorite Matches** | ✅ | ✅ | ✅ |

---

## 🔐 Firebase Implementation

### Firestore Structure:
```javascript
// roles collection
{
  "ivy@gmail.com": {
    role: "super_admin",  // Only ONE user has this
    createdAt: timestamp,
    isFirstUser: true
  },
  "manga@gmail.com": {
    role: "admin",  // Multiple users can have this
    createdAt: timestamp,
    promotedBy: "ivy@gmail.com",
    promotedAt: timestamp
  },
  "john@gmail.com": {
    role: "admin",  // Another admin
    createdAt: timestamp,
    promotedBy: "ivy@gmail.com",
    promotedAt: timestamp
  },
  "fan1@gmail.com": {
    role: "fan",  // Unlimited users can have this
    createdAt: timestamp
  }
}
```

### Logic:
```javascript
// On user registration
async function assignRole(email) {
  // Check if any Super Admin exists
  const superAdminQuery = await firestore()
    .collection('roles')
    .where('role', '==', 'super_admin')
    .get();
  
  if (superAdminQuery.empty) {
    // No Super Admin exists - make this user Super Admin
    await firestore().collection('roles').doc(email).set({
      role: 'super_admin',
      createdAt: firestore.FieldValue.serverTimestamp(),
      isFirstUser: true
    });
    console.log('✅ First user - Super Admin assigned');
  } else {
    // Super Admin already exists - make this user Fan
    await firestore().collection('roles').doc(email).set({
      role: 'fan',
      createdAt: firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ New user - Fan assigned');
  }
}
```

---

## 📊 Real-World Scenarios

### Scenario 1: Team Setup
```
Team: Nkoroi FC Management

1. First registration:
   - ivy@gmail.com → Super Admin (Owner)
   
2. Add team managers:
   - manager1@gmail.com → Admin (Promoted by ivy)
   - manager2@gmail.com → Admin (Promoted by ivy)
   - manager3@gmail.com → Admin (Promoted by ivy)
   
3. Add fans:
   - fan1@gmail.com → Fan
   - fan2@gmail.com → Fan
   - ... (unlimited fans)

Result:
- 1 Super Admin (ivy)
- 3 Admins (managers)
- Unlimited Fans
```

### Scenario 2: Role Changes
```
Initial:
- Super Admin: ivy@gmail.com
- Admin: manga@gmail.com
- Fan: john@gmail.com

Change 1: Promote john to Admin
- Super Admin: ivy@gmail.com
- Admins: manga@gmail.com, john@gmail.com ✅
- Fans: Others

Change 2: Demote manga to Fan
- Super Admin: ivy@gmail.com
- Admin: john@gmail.com
- Fans: manga@gmail.com, Others ✅

Change 3: Promote sarah to Admin
- Super Admin: ivy@gmail.com
- Admins: john@gmail.com, sarah@gmail.com ✅
- Fans: manga@gmail.com, Others
```

---

## ✅ Key Points to Remember

1. **Super Admin:**
   - ✅ Only ONE across ALL devices
   - ✅ First registered user
   - ✅ Cannot be changed (permanent)
   - ✅ Full system control

2. **Admins:**
   - ✅ MULTIPLE users can be Admins
   - ✅ Promoted by Super Admin
   - ✅ Can be promoted/demoted
   - ✅ Match management access

3. **Fans:**
   - ✅ UNLIMITED users
   - ✅ Default role for all new users (except first)
   - ✅ Can be promoted to Admin
   - ✅ View and interact only

---

## 🎯 Summary

```
Role Hierarchy:
┌─────────────────────────────────┐
│  👑 Super Admin (1 user)        │ ← Full control
├─────────────────────────────────┤
│  🛡️ Admins (Multiple users)     │ ← Match management
├─────────────────────────────────┤
│  ⚽ Fans (Unlimited users)       │ ← View & interact
└─────────────────────────────────┘

Distribution:
- Super Admin: 1 user (first registered)
- Admins: As many as Super Admin promotes
- Fans: Everyone else (unlimited)
```

---

**This structure ensures proper hierarchy while allowing flexibility for team management!** 👥✅
