import firestore from '@react-native-firebase/firestore';
import { Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CURRENT_VERSION = '1.0.1';
const VERSION_CHECK_KEY = 'last_version_check';
const DISMISSED_VERSION_KEY = 'dismissed_update_version';

class UpdateService {
  /**
   * Check for app updates
   * @param {boolean} silent - If true, only show alert if update is available
   */
  async checkForUpdates(silent = false) {
    try {
      // Don't check more than once per day
      const lastCheck = await AsyncStorage.getItem(VERSION_CHECK_KEY);
      if (lastCheck && !silent) {
        const lastCheckTime = parseInt(lastCheck);
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        if (lastCheckTime > oneDayAgo) {
          console.log('⏭️ Skipping update check - checked recently');
          return;
        }
      }

      // Get latest version from Firebase
      const versionDoc = await firestore()
        .collection('app_config')
        .doc('version')
        .get();

      if (!versionDoc.exists) {
        console.log('⚠️ No version config found in Firebase');
        if (!silent) {
          await this.createDefaultVersionConfig();
        }
        return;
      }

      const versionData = versionDoc.data();
      const latestVersion = versionData.latest_version;
      const downloadUrl = versionData.download_url;
      const updateMessage = versionData.update_message || 'A new version is available!';
      const forceUpdate = versionData.force_update || false;

      // Save check timestamp
      await AsyncStorage.setItem(VERSION_CHECK_KEY, Date.now().toString());

      // Compare versions
      if (this.isNewerVersion(latestVersion, CURRENT_VERSION)) {
        // Check if user dismissed this version
        const dismissedVersion = await AsyncStorage.getItem(DISMISSED_VERSION_KEY);
        if (dismissedVersion === latestVersion && !forceUpdate) {
          console.log('⏭️ User dismissed this update version');
          return;
        }

        // Show update alert
        this.showUpdateAlert(latestVersion, downloadUrl, updateMessage, forceUpdate);
      } else {
        if (!silent) {
          Alert.alert('✅ Up to Date', 'You have the latest version of Nkoroi FC!');
        }
      }
    } catch (error) {
      console.error('❌ Error checking for updates:', error);
      if (!silent) {
        Alert.alert('Error', 'Could not check for updates. Please try again later.');
      }
    }
  }

  /**
   * Compare version strings (e.g., "1.0.1" vs "1.0.0")
   */
  isNewerVersion(latestVersion, currentVersion) {
    const latest = latestVersion.split('.').map(Number);
    const current = currentVersion.split('.').map(Number);

    for (let i = 0; i < 3; i++) {
      if (latest[i] > current[i]) return true;
      if (latest[i] < current[i]) return false;
    }
    return false;
  }

  /**
   * Show update alert to user
   */
  showUpdateAlert(version, downloadUrl, message, forceUpdate) {
    const buttons = forceUpdate
      ? [
          {
            text: 'Update Now',
            onPress: () => this.openDownloadUrl(downloadUrl),
          },
        ]
      : [
          {
            text: 'Later',
            style: 'cancel',
            onPress: async () => {
              await AsyncStorage.setItem(DISMISSED_VERSION_KEY, version);
            },
          },
          {
            text: 'Update Now',
            onPress: () => this.openDownloadUrl(downloadUrl),
          },
        ];

    Alert.alert(
      `🎉 Update Available - v${version}`,
      message,
      buttons,
      { cancelable: !forceUpdate }
    );
  }

  /**
   * Open download URL in browser
   */
  async openDownloadUrl(url) {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open download link. Please check your browser.');
      }
    } catch (error) {
      console.error('Error opening download URL:', error);
      Alert.alert('Error', 'Could not open download link.');
    }
  }

  /**
   * Create default version config in Firebase (for first time setup)
   */
  async createDefaultVersionConfig() {
    try {
      await firestore()
        .collection('app_config')
        .doc('version')
        .set({
          latest_version: CURRENT_VERSION,
          download_url: 'https://github.com/Lavyuela/nkoroi-fc/releases/latest/download/NkoroiFC.apk',
          update_message: 'A new version of Nkoroi FC is available! Update now to get the latest features and bug fixes.',
          force_update: false,
          release_notes: [
            'Match result fix - Victory/Loss shows correctly',
            'Active Users dashboard for super admins',
            'Player performance analytics',
            'Notification improvements',
          ],
          updated_at: firestore.FieldValue.serverTimestamp(),
        });
      console.log('✅ Created default version config');
    } catch (error) {
      console.error('❌ Error creating version config:', error);
    }
  }

  /**
   * Get current app version
   */
  getCurrentVersion() {
    return CURRENT_VERSION;
  }

  /**
   * Clear dismissed version (for testing)
   */
  async clearDismissedVersion() {
    await AsyncStorage.removeItem(DISMISSED_VERSION_KEY);
  }
}

export default new UpdateService();
