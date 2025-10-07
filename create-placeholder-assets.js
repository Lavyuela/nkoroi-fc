// Simple script to create placeholder assets for testing
// This creates basic colored rectangles as placeholders
// Replace with actual designed assets before production

const fs = require('fs');
const path = require('path');

console.log('📱 Nkoroi FC Live Score - Asset Placeholder Generator');
console.log('====================================================\n');

const assetsDir = path.join(__dirname, 'assets');

// Create assets directory if it doesn't exist
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
  console.log('✅ Created assets directory');
}

// Create placeholder text files to indicate what's needed
const assetRequirements = {
  'icon.png': {
    size: '1024x1024',
    description: 'App icon - should feature Nkoroi FC logo or football imagery',
    color: '#1a472a (dark green background)',
  },
  'splash.png': {
    size: '1284x2778',
    description: 'Splash screen shown when app launches',
    color: '#1a472a (dark green background) with team name',
  },
  'adaptive-icon.png': {
    size: '1024x1024',
    description: 'Android adaptive icon (keep important elements in center)',
    color: '#1a472a (dark green background)',
  },
  'favicon.png': {
    size: '48x48',
    description: 'Web favicon',
    color: 'Simple icon that works at small size',
  },
  'notification-icon.png': {
    size: '96x96',
    description: 'Notification icon (Android)',
    color: 'Simple, monochrome icon',
  },
};

// Create a requirements file
let requirementsContent = '# Asset Requirements for Nkoroi FC Live Score\n\n';
requirementsContent += 'Please create the following image assets:\n\n';

for (const [filename, details] of Object.entries(assetRequirements)) {
  requirementsContent += `## ${filename}\n`;
  requirementsContent += `- **Size**: ${details.size} pixels\n`;
  requirementsContent += `- **Description**: ${details.description}\n`;
  requirementsContent += `- **Design**: ${details.color}\n\n`;
}

requirementsContent += '\n## Quick Options:\n\n';
requirementsContent += '1. **Use Online Generator**: Visit https://www.appicon.co/ or https://makeappicon.com/\n';
requirementsContent += '2. **Design in Canva**: Use free templates at https://www.canva.com/\n';
requirementsContent += '3. **Hire Designer**: Find designers on Fiverr or Upwork\n\n';
requirementsContent += '## Temporary Solution:\n\n';
requirementsContent += 'For testing, you can use any image files with the correct dimensions.\n';
requirementsContent += 'The app will work without custom assets but will show default Expo icons.\n';

fs.writeFileSync(path.join(assetsDir, 'ASSET_REQUIREMENTS.txt'), requirementsContent);
console.log('✅ Created ASSET_REQUIREMENTS.txt in assets folder');

console.log('\n📋 Next Steps:');
console.log('1. Check the assets/ASSET_REQUIREMENTS.txt file');
console.log('2. Create or download the required image assets');
console.log('3. Place them in the assets/ directory');
console.log('4. Run "expo start -c" to clear cache and reload\n');

console.log('💡 Tip: The app will work for testing without custom assets.');
console.log('   Expo will use default icons until you add your own.\n');

console.log('🎨 Recommended Tools:');
console.log('   - Online: https://www.appicon.co/');
console.log('   - Design: https://www.canva.com/');
console.log('   - Free: https://www.figma.com/\n');

console.log('✅ Asset placeholder setup complete!');
