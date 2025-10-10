# 🚀 WSL Build Guide - After Restart

**Follow these steps after restarting your computer**

---

## Step 1: Open WSL (First Time Setup)

1. Press `Windows + R`
2. Type: `wsl`
3. Press Enter

**First time only:**
- Enter a username (e.g., `admin`)
- Enter a password (remember this!)
- Confirm password

You'll see a Linux terminal like:
```
admin@DESKTOP-XXX:~$
```

---

## Step 2: Update Linux System

Copy and paste these commands one by one:

```bash
sudo apt update
sudo apt upgrade -y
```

(Enter your password when asked)

---

## Step 3: Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version
```

Should show Node v20.x and npm v10.x

---

## Step 4: Install Java (Required for Android)

```bash
sudo apt install -y openjdk-17-jdk
java -version
```

Should show Java 17

---

## Step 5: Install Android SDK

```bash
# Create Android directory
mkdir -p ~/Android/Sdk
cd ~/Android/Sdk

# Download Android command line tools
wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
unzip commandlinetools-linux-11076708_latest.zip
mkdir -p cmdline-tools/latest
mv cmdline-tools/* cmdline-tools/latest/ 2>/dev/null || true

# Set environment variables
echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.bashrc
source ~/.bashrc

# Install required Android packages
yes | sdkmanager --licenses
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
```

---

## Step 6: Navigate to Your Project

```bash
cd /mnt/c/Users/Admin/Downloads/Nkoroi\ FC
```

---

## Step 7: Install Project Dependencies

```bash
npm install
```

(This will take 2-3 minutes)

---

## Step 8: Build APK!

```bash
cd android
./gradlew assembleRelease
```

**This will take 5-10 minutes on first build**

---

## Step 9: Get Your APK

After successful build:

```bash
# Copy APK to Windows Downloads
cp app/build/outputs/apk/release/app-release.apk /mnt/c/Users/Admin/Downloads/nkoroifc-v1.0.3-WSL.apk
```

**Your APK will be at:**
`C:\Users\Admin\Downloads\nkoroifc-v1.0.3-WSL.apk`

---

## 🎯 Quick Reference Commands

**Open WSL:**
```
Windows + R → type "wsl" → Enter
```

**Navigate to project:**
```bash
cd /mnt/c/Users/Admin/Downloads/Nkoroi\ FC
```

**Build APK:**
```bash
cd android
./gradlew assembleRelease
```

**Copy APK to Downloads:**
```bash
cp app/build/outputs/apk/release/app-release.apk /mnt/c/Users/Admin/Downloads/nkoroifc-v1.0.3-NEW.apk
```

---

## ⚠️ Troubleshooting

### If build fails with "ANDROID_HOME not set":
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### If gradlew permission denied:
```bash
chmod +x gradlew
```

### If Node.js not found:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

---

## ✅ After First Build

**Future builds are MUCH faster:**
```bash
cd /mnt/c/Users/Admin/Downloads/Nkoroi\ FC/android
./gradlew assembleRelease
```

Takes only 2-3 minutes!

---

## 📱 Your APK Will Have:

- ✅ Version 1.0.3
- ✅ Modern UI improvements
- ✅ Instant push notifications
- ✅ WhatsApp sharing for all events
- ✅ "Offline Mode" label
- ✅ All your latest code changes

---

**Total setup time: 30-40 minutes**
**Future builds: 2-3 minutes**

**Good luck! 🚀⚽**
