# 🎯 What to Choose in EAS Credentials

## When you run: `npx eas credentials`

---

### ✅ PROMPT 1: "Select a platform"

You'll see:
```
? Select a platform › - Use arrow-keys. Return to submit.
❯ Android
  iOS
```

**→ Choose: `Android`** (press Enter)

---

### ✅ PROMPT 2: "What do you want to do?"

You'll see something like:
```
? What do you want to do? › - Use arrow-keys. Return to submit.
  Set up a build credential
❯ Set up push notification credentials
  Manage credentials
  Remove credentials
```

**→ Choose: `Set up push notification credentials`** (press Enter)

OR if you see:
```
? What do you want to do? › - Use arrow-keys. Return to submit.
❯ Manage credentials
  Remove credentials
```

**→ Choose: `Manage credentials`** (press Enter)

---

### ✅ PROMPT 3: "Select the push notification service"

You might see:
```
? Select the push notification service › - Use arrow-keys. Return to submit.
❯ FCM V1 (Google Cloud Messaging)
  FCM (Legacy)
```

**→ Choose: `FCM V1 (Google Cloud Messaging)`** (press Enter)

---

### ✅ PROMPT 4: "Path to Google Services JSON file"

You'll see:
```
? Path to Google Services JSON file: 
```

**→ Type or paste this EXACT path:**
```
C:\Users\Admin\Downloads\nkoroifc-9c964-firebase-adminsdk-fbsvc-e3e33fc80d.json
```

**→ Press Enter**

---

### ✅ SUCCESS MESSAGE

You should see:
```
✔ Successfully uploaded FCM V1 service account key
```

---

## 🔄 Alternative Prompts

If you see different options, here's what to look for:

### If you see "Manage credentials" menu:
```
? What do you want to do? › - Use arrow-keys. Return to submit.
  Update credentials
❯ Add new credentials
  View credentials
  Remove credentials
```

**→ Choose: `Add new credentials`**

### If you see "Select credential type":
```
? Select credential type › - Use arrow-keys. Return to submit.
  Android Keystore
❯ FCM Server Key
  FCM V1 Service Account
```

**→ Choose: `FCM V1 Service Account`**

---

## 🆘 If You Get Stuck

**Copy the EXACT text** you see in the terminal and send it to me.

I'll tell you exactly what to select!

---

## 📋 Quick Reference

| Prompt | What to Choose |
|--------|----------------|
| Platform | **Android** |
| What to do | **Set up push notification credentials** |
| Service type | **FCM V1** |
| File path | `C:\Users\Admin\Downloads\nkoroifc-9c964-firebase-adminsdk-fbsvc-e3e33fc80d.json` |

---

**Still confused?** Take a screenshot of your terminal and I'll guide you!
