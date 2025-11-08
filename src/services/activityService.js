import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

class ActivityService {
  /**
   * Update user's last active timestamp
   */
  async updateLastActive() {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        console.log('⏭️ No user logged in, skipping activity update');
        return;
      }

      const userId = currentUser.uid;
      const userEmail = currentUser.email;

      // Update user document with last active timestamp
      await firestore()
        .collection('users')
        .doc(userId)
        .set(
          {
            email: userEmail,
            lastActive: firestore.FieldValue.serverTimestamp(),
            updatedAt: firestore.FieldValue.serverTimestamp(),
          },
          { merge: true } // Don't overwrite existing data
        );

      console.log('✅ Updated last active timestamp for user:', userId);
    } catch (error) {
      console.error('❌ Error updating last active:', error);
    }
  }

  /**
   * Start tracking user activity
   * Updates every 5 minutes while app is open
   */
  startTracking() {
    // Update immediately
    this.updateLastActive();

    // Update every 5 minutes
    this.trackingInterval = setInterval(() => {
      this.updateLastActive();
    }, 5 * 60 * 1000); // 5 minutes

    console.log('✅ Activity tracking started');
  }

  /**
   * Stop tracking user activity
   */
  stopTracking() {
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
      console.log('⏹️ Activity tracking stopped');
    }
  }

  /**
   * Update activity on app state change
   */
  handleAppStateChange(nextAppState) {
    if (nextAppState === 'active') {
      // App came to foreground
      this.updateLastActive();
    }
  }
}

export default new ActivityService();
