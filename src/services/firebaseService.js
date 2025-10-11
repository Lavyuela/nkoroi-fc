// Firebase Service - Real-time cross-device sync
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

// ============================================
// AUTHENTICATION
// ============================================

export const loginUser = async (email, password) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      },
    };
  } catch (error) {
    let errorMessage = 'Login failed. Please try again.';
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email address';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password. Please try again.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const registerUser = async (email, password) => {
  try {
    // Create user in Firebase Auth
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // Check if this is the first user (Super Admin)
    const rolesSnapshot = await firestore()
      .collection('roles')
      .where('role', '==', 'super_admin')
      .get();
    
    const isFirstUser = rolesSnapshot.empty;
    const role = isFirstUser ? 'super_admin' : 'fan';
    
    // Create user document in Firestore
    await firestore().collection('users').doc(user.uid).set({
      email: user.email,
      createdAt: firestore.FieldValue.serverTimestamp(),
      uid: user.uid,
    });
    
    // Create role document
    await firestore().collection('roles').doc(user.uid).set({
      role: role,
      email: user.email,
      createdAt: firestore.FieldValue.serverTimestamp(),
      isFirstUser: isFirstUser,
    });
    
    console.log(`✅ User registered: ${email} as ${role}`);
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
      },
    };
  } catch (error) {
    let errorMessage = 'Registration failed. Please try again.';
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'An account with this email already exists';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password must be at least 6 characters';
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const logoutUser = async () => {
  try {
    await auth().signOut();
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Logout failed' };
  }
};

export const getCurrentUser = () => {
  return auth().currentUser;
};

// ============================================
// USER ROLES
// ============================================

export const getUserRole = async (userId) => {
  try {
    const roleDoc = await firestore().collection('roles').doc(userId).get();
    
    if (roleDoc.exists) {
      return roleDoc.data().role || 'fan';
    }
    
    return 'fan';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'fan';
  }
};

export const getAllUsers = async () => {
  try {
    const usersSnapshot = await firestore().collection('users').get();
    const rolesSnapshot = await firestore().collection('roles').get();
    
    const rolesMap = {};
    rolesSnapshot.forEach(doc => {
      rolesMap[doc.id] = doc.data();
    });
    
    const users = [];
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      const roleData = rolesMap[doc.id] || { role: 'fan' };
      
      users.push({
        uid: doc.id,
        email: userData.email,
        createdAt: userData.createdAt,
        role: roleData.role,
        isSuperAdmin: roleData.role === 'super_admin',
        isAdmin: roleData.role === 'admin' || roleData.role === 'super_admin',
      });
    });
    
    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
};

export const updateUserRole = async (userId, newRole) => {
  try {
    const currentUser = auth().currentUser;
    if (!currentUser) {
      throw new Error('Not authenticated');
    }
    
    // Check if current user is Super Admin
    const currentUserRole = await getUserRole(currentUser.uid);
    if (currentUserRole !== 'super_admin') {
      throw new Error('Only Super Admins can change roles');
    }
    
    // Update role
    await firestore().collection('roles').doc(userId).update({
      role: newRole,
      updatedAt: firestore.FieldValue.serverTimestamp(),
      updatedBy: currentUser.uid,
    });
    
    console.log(`✅ User ${userId} role updated to ${newRole}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, error: error.message };
  }
};

export const deleteUser = async (userId) => {
  try {
    const currentUser = auth().currentUser;
    if (!currentUser) {
      throw new Error('Not authenticated');
    }
    
    // Check if current user is Super Admin
    const currentUserRole = await getUserRole(currentUser.uid);
    if (currentUserRole !== 'super_admin') {
      throw new Error('Only Super Admins can delete users');
    }
    
    // Delete user data
    await firestore().collection('users').doc(userId).delete();
    await firestore().collection('roles').doc(userId).delete();
    
    console.log(`✅ User ${userId} deleted`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// MATCHES
// ============================================

export const createMatch = async (matchData) => {
  try {
    const currentUser = auth().currentUser;
    if (!currentUser) {
      throw new Error('Not authenticated');
    }
    
    const matchRef = await firestore().collection('matches').add({
      ...matchData,
      homeScore: 0,
      awayScore: 0,
      status: 'upcoming',
      events: [],
      createdAt: firestore.FieldValue.serverTimestamp(),
      createdBy: currentUser.uid,
    });
    
    console.log('✅ Match created:', matchRef.id);
    return { success: true, matchId: matchRef.id };
  } catch (error) {
    console.error('Error creating match:', error);
    return { success: false, error: error.message };
  }
};

export const subscribeToMatches = (callback) => {
  return firestore()
    .collection('matches')
    .orderBy('date', 'desc')
    .onSnapshot(
      (snapshot) => {
        const matches = [];
        snapshot.forEach((doc) => {
          matches.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        callback(matches);
      },
      (error) => {
        console.error('Error subscribing to matches:', error);
        callback([]);
      }
    );
};

export const subscribeToMatch = (matchId, callback) => {
  return firestore()
    .collection('matches')
    .doc(matchId)
    .onSnapshot(
      (doc) => {
        if (doc.exists) {
          callback({
            id: doc.id,
            ...doc.data(),
          });
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error('Error subscribing to match:', error);
        callback(null);
      }
    );
};

export const updateMatch = async (matchId, updates) => {
  try {
    await firestore().collection('matches').doc(matchId).update({
      ...updates,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
    
    console.log('✅ Match updated:', matchId);
    return { success: true };
  } catch (error) {
    console.error('Error updating match:', error);
    return { success: false, error: error.message };
  }
};

export const deleteMatch = async (matchId) => {
  try {
    await firestore().collection('matches').doc(matchId).delete();
    console.log('✅ Match deleted:', matchId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting match:', error);
    return { success: false, error: error.message };
  }
};

export const addMatchEvent = async (matchId, event) => {
  try {
    await firestore().collection('matches').doc(matchId).update({
      events: firestore.FieldValue.arrayUnion(event),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
    
    console.log('✅ Match event added:', matchId);
    return { success: true };
  } catch (error) {
    console.error('Error adding match event:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// TEAM UPDATES
// ============================================

export const createUpdate = async (updateData) => {
  try {
    const currentUser = auth().currentUser;
    if (!currentUser) {
      throw new Error('Not authenticated');
    }
    
    const updateRef = await firestore().collection('updates').add({
      ...updateData,
      createdAt: firestore.FieldValue.serverTimestamp(),
      createdBy: currentUser.uid,
    });
    
    console.log('✅ Update created:', updateRef.id);
    return { success: true, updateId: updateRef.id };
  } catch (error) {
    console.error('Error creating update:', error);
    return { success: false, error: error.message };
  }
};

export const subscribeToUpdates = (callback) => {
  return firestore()
    .collection('updates')
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      (snapshot) => {
        const updates = [];
        snapshot.forEach((doc) => {
          updates.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        callback(updates);
      },
      (error) => {
        console.error('Error subscribing to updates:', error);
        callback([]);
      }
    );
};

// ============================================
// NOTIFICATIONS
// ============================================

export const requestNotificationPermission = async () => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('✅ Notification permission granted');
      const token = await messaging().getToken();
      console.log('📱 FCM Token:', token);
      
      // Save token to user document
      const currentUser = auth().currentUser;
      if (currentUser) {
        await firestore().collection('users').doc(currentUser.uid).update({
          fcmToken: token,
          fcmTokenUpdatedAt: firestore.FieldValue.serverTimestamp(),
        });
      }
      
      return { success: true, token };
    }
    
    return { success: false, error: 'Permission denied' };
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return { success: false, error: error.message };
  }
};

export const setupNotificationListeners = () => {
  // Foreground messages
  messaging().onMessage(async (remoteMessage) => {
    console.log('📬 Foreground notification:', remoteMessage);
  });

  // Background messages
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('📬 Background notification:', remoteMessage);
  });
};

// ============================================
// ANALYTICS
// ============================================

export const getAnalytics = async () => {
  try {
    const usersSnapshot = await firestore().collection('users').get();
    const rolesSnapshot = await firestore().collection('roles').get();
    const matchesSnapshot = await firestore().collection('matches').get();
    
    const rolesMap = {};
    rolesSnapshot.forEach(doc => {
      rolesMap[doc.id] = doc.data().role;
    });
    
    let superAdminCount = 0;
    let adminCount = 0;
    let fanCount = 0;
    
    Object.values(rolesMap).forEach(role => {
      if (role === 'super_admin') superAdminCount++;
      else if (role === 'admin') adminCount++;
      else fanCount++;
    });
    
    let liveMatches = 0;
    let upcomingMatches = 0;
    let finishedMatches = 0;
    
    matchesSnapshot.forEach(doc => {
      const status = doc.data().status;
      if (status === 'live') liveMatches++;
      else if (status === 'upcoming') upcomingMatches++;
      else if (status === 'finished') finishedMatches++;
    });
    
    return {
      users: {
        total: usersSnapshot.size,
        superAdmins: superAdminCount,
        admins: adminCount,
        fans: fanCount,
      },
      matches: {
        total: matchesSnapshot.size,
        live: liveMatches,
        upcoming: upcomingMatches,
        finished: finishedMatches,
      },
    };
  } catch (error) {
    console.error('Error getting analytics:', error);
    return null;
  }
};
