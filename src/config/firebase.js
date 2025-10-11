import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

// Firebase is automatically initialized with google-services.json
// No need for manual initialization with React Native Firebase

// Export Firebase services
export { auth, firestore, messaging };

// Helper functions
export const getCurrentUser = () => {
  return auth().currentUser;
};

export const isUserLoggedIn = () => {
  return auth().currentUser !== null;
};

// Collections
export const COLLECTIONS = {
  USERS: 'users',
  MATCHES: 'matches',
  UPDATES: 'updates',
  PREDICTIONS: 'predictions',
  FAVORITES: 'favorites',
  ROLES: 'roles',
};

// Initialize app settings
export const initializeFirebase = async () => {
  try {
    // Request notification permissions
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('✅ Firebase Messaging authorized');
    }

    // Get FCM token
    const token = await messaging().getToken();
    console.log('📱 FCM Token:', token);

    return { success: true, token };
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    return { success: false, error };
  }
};
