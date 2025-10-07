# Assets Directory

This directory should contain the following image assets for the Nkoroi FC Live Score app:

## Required Assets

### 1. icon.png
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Purpose**: App icon shown on device home screen
- **Design**: Should feature Nkoroi FC logo or football-related imagery

### 2. splash.png
- **Size**: 1284x2778 pixels (or similar high resolution)
- **Format**: PNG
- **Background**: #1a472a (dark green) to match app theme
- **Purpose**: Splash screen shown when app launches
- **Design**: Can include team logo, name, and tagline

### 3. adaptive-icon.png
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Purpose**: Android adaptive icon
- **Design**: Should work with circular mask (keep important elements in center)

### 4. favicon.png
- **Size**: 48x48 pixels (or 16x16, 32x32)
- **Format**: PNG
- **Purpose**: Web favicon if running on web platform

### 5. notification-icon.png (Optional)
- **Size**: 96x96 pixels
- **Format**: PNG with transparency
- **Purpose**: Icon shown in push notifications (Android)
- **Design**: Simple, recognizable icon that works at small sizes

## Creating Assets

### Option 1: Use Placeholder Assets
For testing purposes, you can use simple colored squares:
- Create a 1024x1024 green square with a football emoji for the icon
- Create a 1284x2778 green rectangle with "Nkoroi FC" text for splash

### Option 2: Design Custom Assets
Use design tools like:
- **Figma** (free, web-based)
- **Canva** (free templates available)
- **Adobe Photoshop** (professional)
- **GIMP** (free alternative to Photoshop)

### Option 3: Hire a Designer
Consider hiring a designer on:
- Fiverr
- Upwork
- 99designs

## Quick Asset Generation

You can use online tools to generate placeholder assets:
1. Go to https://www.appicon.co/
2. Upload a simple logo or design
3. Generate all required sizes
4. Download and extract to this directory

## Asset Guidelines

- **Colors**: Use Nkoroi FC team colors (primary: #1a472a - dark green)
- **Style**: Keep it simple and recognizable at small sizes
- **Branding**: Include team name or logo
- **Consistency**: Use same design language across all assets

## Testing Assets

After adding assets:
1. Run `expo start -c` to clear cache
2. Rebuild the app
3. Check how icons appear on device
4. Test splash screen on app launch
5. Verify notification icons (send test notification)

## Notes

- All assets should be optimized for mobile (compressed but high quality)
- PNG format is preferred for transparency support
- Keep file sizes reasonable (< 1MB per asset)
- Test on both Android and iOS devices if possible

---

**Current Status**: This directory needs to be populated with actual image assets before production deployment. The app will work without them, but may show default Expo icons.
