# 🚀 Build APK with New Expo Account (FREE)

## ❌ Problem
Your current Expo account (lavyuela) has used all free builds for this month.
Resets in 18 days (November 1, 2025).

## ✅ Solution: Create New Free Account

This takes **5 minutes** and gives you fresh free builds!

---

## 📝 Step-by-Step Instructions

### **Step 1: Create New Expo Account**

1. Open browser: https://expo.dev/signup
2. Sign up with a **different email** (or use Gmail aliases like: youremail+expo2@gmail.com)
3. Verify your email
4. Remember your new credentials!

---

### **Step 2: Log Out of Current Account**

Open Command Prompt in your project:

```cmd
cd C:\Users\Admin\Downloads\Nkoroi FC
npx eas logout
```

You should see:
```
✔ Logged out
```

---

### **Step 3: Log In with New Account**

```cmd
npx eas login
```

Enter:
- **Username or Email**: Your new account email
- **Password**: Your new account password

You should see:
```
✔ Logged in as [your-new-username]
```

---

### **Step 4: Link Project to New Account**

The project needs to be linked to your new account:

```cmd
npx eas init
```

When prompted:
- **Project name**: `nkoroi-fc-live-score` (or any name you want)
- **Confirm**: Yes

---

### **Step 5: Re-upload FCM V1 Credentials**

Since you're using a new account, you need to upload the FCM credentials again:

```cmd
npx eas credentials
```

Follow the prompts:
1. **Platform**: Android
2. **Profile**: production
3. **Action**: Manage your Google Service Account Key for Push Notifications (FCM V1)
4. **Choose**: Set up a Google Service Account Key for Push Notifications (FCM V1)
5. **Select**: [Choose an existing key]
6. **File path**: `C:\Users\Admin\Downloads\nkoroifc-9c964-firebase-adminsdk-fbsvc-e3e33fc80d.json`

---

### **Step 6: Build APK**

Now build with your new account:

```cmd
npx eas build -p android --profile preview
```

This will:
- Use your new account's free builds
- Include FCM V1 credentials
- Take 10-15 minutes
- Give you a download link

---

## 🎯 Quick Command Reference

```cmd
# 1. Navigate to project
cd C:\Users\Admin\Downloads\Nkoroi FC

# 2. Log out
npx eas logout

# 3. Log in with new account
npx eas login

# 4. Initialize project
npx eas init

# 5. Upload FCM credentials
npx eas credentials

# 6. Build APK
npx eas build -p android --profile preview
```

---

## ✅ Success Checklist

- [ ] Created new Expo account at expo.dev/signup
- [ ] Logged out: `npx eas logout`
- [ ] Logged in with new account: `npx eas login`
- [ ] Initialized project: `npx eas init`
- [ ] Uploaded FCM V1 credentials: `npx eas credentials`
- [ ] Started build: `npx eas build -p android --profile preview`
- [ ] Build completed successfully
- [ ] Downloaded APK
- [ ] Installed and tested

---

## 🔄 Alternative: Use Different Email Aliases

If you don't want to create a completely new email:

**Gmail users can use aliases:**
- Original: `yourname@gmail.com`
- Alias 1: `yourname+expo1@gmail.com`
- Alias 2: `yourname+expo2@gmail.com`

All emails go to the same inbox, but Expo treats them as different accounts!

---

## ⚠️ Important Notes

### Your FCM V1 Setup is Safe
- The service account JSON file is still on your computer
- You just need to re-upload it to the new Expo account
- Takes 2 minutes with `npx eas credentials`

### Your Code is Safe
- All your code stays the same
- No changes needed to app.json or App.js
- Just linking to a different Expo account

### Your Firebase is Safe
- Firebase project stays the same
- google-services.json stays the same
- Notifications will work exactly the same

---

## 🆘 Troubleshooting

### "Project already exists"
If `eas init` says project exists:
```cmd
npx eas init --force
```

### "Cannot find credentials"
After switching accounts, you need to re-upload FCM:
```cmd
npx eas credentials
```

### "Build still fails"
Make sure you're logged in with the NEW account:
```cmd
npx eas whoami
```

Should show your new username, not "lavyuela"

---

## 💡 Pro Tip

After building successfully, you can switch back to your original account later if needed. The APK will continue to work regardless of which Expo account built it!

---

**Ready to start?** Create your new account at https://expo.dev/signup then follow the steps above!
