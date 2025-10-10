#!/bin/bash

echo "============================================"
echo "Building Nkoroi FC APK v1.0.3"
echo "============================================"
echo ""

# Navigate to project
cd "/mnt/c/Users/Admin/Downloads/Nkoroi FC/android"

# Make gradlew executable
chmod +x gradlew

# Build APK
echo "Building APK... (this will take 5-10 minutes)"
echo ""
./gradlew assembleRelease

# Check if build succeeded
if [ -f "app/build/outputs/apk/release/app-release.apk" ]; then
    echo ""
    echo "============================================"
    echo "SUCCESS! APK CREATED!"
    echo "============================================"
    echo ""
    
    # Copy to Downloads with new name
    cp app/build/outputs/apk/release/app-release.apk "/mnt/c/Users/Admin/Downloads/nkoroifc-v1.0.3-WSL.apk"
    
    echo "APK saved to:"
    echo "  C:\Users\Admin\Downloads\nkoroifc-v1.0.3-WSL.apk"
    echo ""
    
    # Show file info
    ls -lh "/mnt/c/Users/Admin/Downloads/nkoroifc-v1.0.3-WSL.apk"
    
    echo ""
    echo "============================================"
    echo "Ready to install and share!"
    echo "============================================"
else
    echo ""
    echo "============================================"
    echo "BUILD FAILED"
    echo "============================================"
    echo ""
    echo "Check the error messages above"
fi
