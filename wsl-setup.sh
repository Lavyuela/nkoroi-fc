#!/bin/bash

echo "============================================"
echo "WSL Setup for Nkoroi FC - Android Build"
echo "============================================"
echo ""

# Update system
echo "Step 1: Updating Linux system..."
sudo apt update && sudo apt upgrade -y

# Install Node.js
echo ""
echo "Step 2: Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Java
echo ""
echo "Step 3: Installing Java 17..."
sudo apt install -y openjdk-17-jdk

# Install required tools
echo ""
echo "Step 4: Installing build tools..."
sudo apt install -y wget unzip

# Setup Android SDK
echo ""
echo "Step 5: Setting up Android SDK..."
mkdir -p ~/Android/Sdk
cd ~/Android/Sdk

if [ ! -f "commandlinetools-linux-11076708_latest.zip" ]; then
    wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
fi

unzip -q commandlinetools-linux-11076708_latest.zip
mkdir -p cmdline-tools/latest
mv cmdline-tools/* cmdline-tools/latest/ 2>/dev/null || true

# Set environment variables
echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.bashrc
source ~/.bashrc

export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Accept licenses and install packages
echo ""
echo "Step 6: Installing Android SDK packages..."
yes | $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

# Navigate to project
echo ""
echo "Step 7: Installing project dependencies..."
cd "/mnt/c/Users/Admin/Downloads/Nkoroi FC"
npm install

echo ""
echo "============================================"
echo "Setup Complete!"
echo "============================================"
echo ""
echo "To build your APK, run:"
echo "  cd /mnt/c/Users/Admin/Downloads/Nkoroi\ FC/android"
echo "  ./gradlew assembleRelease"
echo ""
echo "Your APK will be at:"
echo "  android/app/build/outputs/apk/release/app-release.apk"
echo ""
echo "============================================"
