# 🎨 Nkoroi FC Logo Integration Guide

## 📋 Logo Placement

The Nkoroi FC logo should be added to these screens:

### ✅ Already Updated with Theme:
1. **Login Screen** - Top center (currently shows ⚽ emoji)
2. **Register Screen** - Top center (currently shows ⚽ emoji)
3. **Team Stats Screen** - Avatar with "NFC" initials

### 📝 How to Add Your Logo:

---

## 🖼️ Option 1: Replace Emoji with Logo Image

### Step 1: Save Logo File
1. Save your logo as: `logo.png`
2. Place it in: `assets/logo.png`

### Step 2: Update Login Screen

Replace the emoji with logo image in `LoginScreen.js`:

**Current code (line 125-127):**
```javascript
<View style={styles.header}>
  <Text style={styles.logo}>⚽</Text>
  <Text style={styles.title}>Nkoroi FC</Text>
```

**New code with logo:**
```javascript
<View style={styles.header}>
  <Image 
    source={require('../assets/logo.png')} 
    style={styles.logoImage}
    resizeMode="contain"
  />
  <Text style={styles.title}>Nkoroi FC</Text>
```

**Add to imports:**
```javascript
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
```

**Add to styles:**
```javascript
logoImage: {
  width: 100,
  height: 100,
  marginBottom: 20,
},
```

### Step 3: Update Register Screen

Same changes as Login Screen.

### Step 4: Update Team Stats Screen

Replace avatar with logo:

**Current code:**
```javascript
<Avatar.Text size={80} label="NFC" style={styles.avatar} />
```

**New code:**
```javascript
<Image 
  source={require('../assets/logo.png')} 
  style={styles.logoImage}
  resizeMode="contain"
/>
```

---

## 🎨 Option 2: Use Logo from URL

If your logo is hosted online:

```javascript
<Image 
  source={{ uri: 'https://your-website.com/logo.png' }} 
  style={styles.logoImage}
  resizeMode="contain"
/>
```

---

## 📱 Option 3: Use SVG Logo (Best Quality)

For scalable vector graphics:

### Step 1: Install react-native-svg
```bash
npm install react-native-svg
npx expo install react-native-svg
```

### Step 2: Convert PNG to SVG component
Use a tool like: https://react-svgr.com/playground/

### Step 3: Use in app
```javascript
import NkoroiLogo from '../assets/NkoroiLogo';

<NkoroiLogo width={100} height={100} />
```

---

## 🎯 Current Logo Locations

### Login Screen (`LoginScreen.js`)
- **Line 125**: Logo display
- **Style**: `styles.logo` (currently emoji)
- **Recommended size**: 100x100px

### Register Screen (`RegisterScreen.js`)
- **Line 48**: Logo display
- **Style**: `styles.logo` (currently emoji)
- **Recommended size**: 100x100px

### Team Stats Screen (`TeamStatsScreen.js`)
- **Line 81**: Avatar with "NFC"
- **Style**: `styles.avatar`
- **Recommended size**: 80x80px

### Home Screen Header
- Could add small logo next to "Nkoroi FC Live Score"
- Size: 30x30px

---

## 📐 Logo Specifications

### Recommended Sizes:
- **Login/Register**: 100x100px or 120x120px
- **Team Stats**: 80x80px
- **Header**: 30x30px or 40x40px
- **Splash Screen**: 200x200px

### File Formats:
- **PNG**: Transparent background, high resolution (2x, 3x for retina)
- **SVG**: Best for scalability
- **WebP**: Smaller file size

### Color Variants:
- **Full color**: For light backgrounds
- **White**: For dark/blue backgrounds
- **Monochrome**: For small sizes

---

## 🚀 Quick Implementation

Since you have the logo image, here's the fastest way:

### Step 1: Save Logo
```
Save as: c:\Users\Admin\Downloads\Nkoroi FC\assets\logo.png
```

### Step 2: I'll Update the Code

Let me know when you've saved the logo, and I'll update:
- Login screen
- Register screen  
- Team Stats screen
- Splash screen (optional)

---

## 🎨 Current Theme Colors

Your logo colors match perfectly:
- **Light Blue**: #4FC3F7 ✓
- **Dark Blue**: #0277BD ✓
- **White**: #FFFFFF ✓

These are already used throughout the app!

---

## ✅ Summary

**To add your logo:**
1. Save logo as `assets/logo.png`
2. Let me know, and I'll update the code
3. Logo will appear on:
   - Login screen (top)
   - Register screen (top)
   - Team Stats (center)
   - Optionally: Home header, Splash screen

**Or you can manually update using the code snippets above!**

---

**The app theme is now consistent with light blue colors. Logo integration is the final touch!** 🎨⚽

**Created**: 2025-10-08
**Version**: 1.7.0
