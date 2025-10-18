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
    
    // Get user email for the role document
    const userDoc = await firestore().collection('users').doc(userId).get();
    if (!userDoc.exists) {
      throw new Error('User not found');
    }
    
    const userEmail = userDoc.data().email;
    
    // Update or create role document (use set with merge to create if doesn't exist)
    await firestore().collection('roles').doc(userId).set({
      role: newRole,
      email: userEmail,
      updatedAt: firestore.FieldValue.serverTimestamp(),
      updatedBy: currentUser.uid,
    }, { merge: true });
    
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
    
    // Send notification to all fans
    await sendNotificationToAllUsers(
      '⚽ New Match!',
      `${matchData.homeTeam} vs ${matchData.awayTeam}`,
      { matchId: matchRef.id, type: 'new_match' }
    );
    
    return { success: true, matchId: matchRef.id };
  } catch (error) {
    console.error('Error creating match:', error);
    return { success: false, error: error.message };
  }
};

export const getMatch = async (matchId) => {
  try {
    const matchDoc = await firestore().collection('matches').doc(matchId).get();
    if (matchDoc.exists) {
      return {
        success: true,
        match: {
          id: matchDoc.id,
          ...matchDoc.data(),
        },
      };
    }
    return { success: false, error: 'Match not found' };
  } catch (error) {
    console.error('Error getting match:', error);
    return { success: false, error: error.message };
  }
};

export const subscribeToMatches = (callback) => {
  return firestore()
    .collection('matches')
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      (snapshot) => {
        const matches = [];
        snapshot.forEach((doc) => {
          matches.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        console.log(`✅ Loaded ${matches.length} matches from Firebase`);
        callback(matches);
      },
      (error) => {
        console.error('❌ Error subscribing to matches:', error);
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
    
    // If score was updated, send notification
    if (updates.homeScore !== undefined || updates.awayScore !== undefined) {
      const matchDoc = await firestore().collection('matches').doc(matchId).get();
      const matchData = matchDoc.data();
      
      await sendNotificationToAllUsers(
        '🔔 Score Update!',
        `${matchData.homeTeam} ${updates.homeScore || matchData.homeScore} - ${updates.awayScore || matchData.awayScore} ${matchData.awayTeam}`,
        { matchId, type: 'score_update' }
      );
    }
    
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
    
    // Get match details for notification
    const matchDoc = await firestore().collection('matches').doc(matchId).get();
    const matchData = matchDoc.data();
    
    // Get minute display (e.g., "23'", "45+2'", "90+4'")
    const minute = event.minute ? `${event.minute}'` : '';
    
    // Create notification message based on event type
    let notificationTitle = '⚽ Match Event!';
    let notificationBody = '';
    
    switch (event.type) {
      case 'goal':
        notificationTitle = `⚽ GOAL! ${minute}`;
        notificationBody = `${event.player || event.team} scores! ${matchData.homeTeam} vs ${matchData.awayTeam}`;
        break;
      
      case 'penalty_goal':
        notificationTitle = `⚽ PENALTY GOAL! ${minute}`;
        notificationBody = `${event.player} converts from the spot! ${matchData.homeTeam} vs ${matchData.awayTeam}`;
        break;
      
      case 'own_goal':
        notificationTitle = `⚽ OWN GOAL ${minute}`;
        notificationBody = `${event.player} (${event.team}) - ${matchData.homeTeam} vs ${matchData.awayTeam}`;
        break;
      
      case 'penalty_missed':
        notificationTitle = `❌ PENALTY MISSED! ${minute}`;
        notificationBody = `${event.player} misses from the spot! ${matchData.homeTeam} vs ${matchData.awayTeam}`;
        break;
      
      case 'penalty_saved':
        notificationTitle = `🧤 PENALTY SAVED! ${minute}`;
        notificationBody = `${event.goalkeeper} saves ${event.player}'s penalty! ${matchData.homeTeam} vs ${matchData.awayTeam}`;
        break;
      
      case 'yellow_card':
        notificationTitle = `🟨 Yellow Card ${minute}`;
        notificationBody = `${event.player} (${event.team}) booked - ${matchData.homeTeam} vs ${matchData.awayTeam}`;
        break;
      
      case 'second_yellow':
        notificationTitle = `🟨🟥 Second Yellow! ${minute}`;
        notificationBody = `${event.player} (${event.team}) sent off! - ${matchData.homeTeam} vs ${matchData.awayTeam}`;
        break;
      
      case 'red_card':
        notificationTitle = `🟥 RED CARD! ${minute}`;
        notificationBody = `${event.player} (${event.team}) sent off! - ${matchData.homeTeam} vs ${matchData.awayTeam}`;
        break;
      
      case 'substitution':
        notificationTitle = `🔄 Substitution ${minute}`;
        notificationBody = `${event.playerOut} ➡️ ${event.playerIn} (${event.team})`;
        break;
      
      case 'injury':
        notificationTitle = `🚑 Injury ${minute}`;
        notificationBody = `${event.player} (${event.team}) is down - ${matchData.homeTeam} vs ${matchData.awayTeam}`;
        break;
      
      case 'injury_time':
        notificationTitle = `⏱️ Injury Time`;
        notificationBody = `${event.minutes} minutes added - ${matchData.homeTeam} vs ${matchData.awayTeam}`;
        break;
      
      case 'var_check':
        notificationTitle = `📹 VAR Check ${minute}`;
        notificationBody = `VAR reviewing ${event.reason} - ${matchData.homeTeam} vs ${matchData.awayTeam}`;
        break;
      
      case 'var_decision':
        notificationTitle = `📹 VAR Decision ${minute}`;
        notificationBody = `${event.decision} - ${matchData.homeTeam} vs ${matchData.awayTeam}`;
        break;
      
      case 'offside':
        notificationTitle = `🚩 Offside ${minute}`;
        notificationBody = `${event.player} (${event.team}) flagged offside - ${matchData.homeTeam} vs ${matchData.awayTeam}`;
        break;
      
      case 'corner':
        notificationTitle = `⚽ Corner ${minute}`;
        notificationBody = `Corner for ${event.team} - ${matchData.homeTeam} vs ${matchData.awayTeam}`;
        break;
      
      case 'free_kick':
        notificationTitle = `⚽ Free Kick ${minute}`;
        notificationBody = `Free kick for ${event.team} - ${matchData.homeTeam} vs ${matchData.awayTeam}`;
        break;
      
      case 'save':
        notificationTitle = `🧤 Great Save! ${minute}`;
        notificationBody = `${event.goalkeeper} denies ${event.player}! ${matchData.homeTeam} vs ${matchData.awayTeam}`;
        break;
      
      case 'chance':
        notificationTitle = `⚡ Big Chance! ${minute}`;
        notificationBody = `${event.player} (${event.team}) misses! ${matchData.homeTeam} vs ${matchData.awayTeam}`;
        break;
      
      case 'kickoff':
        notificationTitle = `🏁 Kick Off!`;
        notificationBody = `${matchData.homeTeam} vs ${matchData.awayTeam} has started!`;
        break;
      
      case 'halftime':
        notificationTitle = `⏸️ Half Time`;
        notificationBody = `${matchData.homeTeam} ${matchData.homeScore} - ${matchData.awayScore} ${matchData.awayTeam}`;
        break;
      
      case 'second_half':
        notificationTitle = `🏁 Second Half Underway`;
        notificationBody = `${matchData.homeTeam} ${matchData.homeScore} - ${matchData.awayScore} ${matchData.awayTeam}`;
        break;
      
      case 'extra_time':
        notificationTitle = `⏱️ Extra Time`;
        notificationBody = `Match goes to extra time! ${matchData.homeTeam} ${matchData.homeScore} - ${matchData.awayScore} ${matchData.awayTeam}`;
        break;
      
      case 'penalties':
        notificationTitle = `🎯 Penalty Shootout`;
        notificationBody = `Match goes to penalties! ${matchData.homeTeam} vs ${matchData.awayTeam}`;
        break;
      
      case 'fulltime':
        notificationTitle = `🏁 Full Time!`;
        notificationBody = `${matchData.homeTeam} ${matchData.homeScore} - ${matchData.awayScore} ${matchData.awayTeam}`;
        break;
      
      case 'abandoned':
        notificationTitle = `⛔ Match Abandoned`;
        notificationBody = `${matchData.homeTeam} vs ${matchData.awayTeam} - ${event.reason}`;
        break;
      
      case 'postponed':
        notificationTitle = `📅 Match Postponed`;
        notificationBody = `${matchData.homeTeam} vs ${matchData.awayTeam} - ${event.reason}`;
        break;
      
      default:
        notificationTitle = `⚽ Match Event ${minute}`;
        notificationBody = `${event.description || 'Match event'} - ${matchData.homeTeam} vs ${matchData.awayTeam}`;
    }
    
    // Send notification to all users
    await sendNotificationToAllUsers(
      notificationTitle,
      notificationBody,
      { matchId, type: 'match_event', eventType: event.type, minute: event.minute }
    );
    
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
    
    // Send notification to all users
    await sendNotificationToAllUsers(
      '📢 Team Update!',
      updateData.title || 'New update from Nkoroi FC',
      { updateId: updateRef.id, type: 'team_update' }
    );
    
    return { success: true, updateId: updateRef.id };
  } catch (error) {
    console.error('Error creating update:', error);
    return { success: false, error: error.message };
  }
};

// Alias for compatibility
export const createTeamUpdate = createUpdate;

export const deleteUpdate = async (updateId) => {
  try {
    await firestore().collection('updates').doc(updateId).delete();
    console.log('✅ Update deleted:', updateId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting update:', error);
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

// Notification listeners are now handled in notificationService.js
// This prevents duplicate notifications

export const sendNotificationToAllUsers = async (title, body, data = {}) => {
  try {
    // Send notification directly to topic (no Cloud Function needed)
    const messaging = (await import('@react-native-firebase/messaging')).default;
    
    // Note: Sending to topic from client requires admin SDK
    // For now, save to Firestore for manual sending or use Firebase Console
    // In production, you'd use a backend service to send to topic
    
    // Save notification to Firestore for record keeping
    await firestore().collection('notifications').add({
      title,
      body,
      data,
      topic: 'team_updates',
      createdAt: firestore.FieldValue.serverTimestamp(),
      sent: false,
    });
    
    console.log(`✅ Notification saved: ${title}`);
    console.log(`⚠️ To send to all users, use Firebase Console → Messaging → Topic: team_updates`);
    return { success: true };
  } catch (error) {
    console.error('Error sending notification:', error);
    return { success: false, error: error.message };
  }
};

export const sendNotificationToRole = async (role, title, body, data = {}) => {
  try {
    // Get users with specific role
    const rolesSnapshot = await firestore()
      .collection('roles')
      .where('role', '==', role)
      .get();
    
    const userIds = [];
    rolesSnapshot.forEach(doc => {
      userIds.push(doc.id);
    });
    
    if (userIds.length === 0) {
      return { success: false, error: `No users with role: ${role}` };
    }
    
    // Get FCM tokens for these users
    const tokens = [];
    for (const userId of userIds) {
      const userDoc = await firestore().collection('users').doc(userId).get();
      if (userDoc.exists && userDoc.data().fcmToken) {
        tokens.push(userDoc.data().fcmToken);
      }
    }
    
    if (tokens.length === 0) {
      return { success: false, error: 'No FCM tokens found for role' };
    }
    
    // Save notification to Firestore
    await firestore().collection('notifications').add({
      title,
      body,
      data,
      role,
      tokens,
      createdAt: firestore.FieldValue.serverTimestamp(),
      sent: false,
    });
    
    console.log(`✅ Notification queued for ${tokens.length} ${role}s`);
    return { success: true, userCount: tokens.length };
  } catch (error) {
    console.error('Error sending notification to role:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// PLAYER MANAGEMENT
// ============================================

export const addPlayer = async (playerData) => {
  try {
    const currentUser = auth().currentUser;
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const playerRef = await firestore().collection('players').add({
      ...playerData,
      createdAt: firestore.FieldValue.serverTimestamp(),
      createdBy: currentUser.uid,
      active: true,
    });

    console.log(`✅ Player added: ${playerData.name}`);
    return { success: true, playerId: playerRef.id };
  } catch (error) {
    console.error('Error adding player:', error);
    return { success: false, error: error.message };
  }
};

export const updatePlayer = async (playerId, updates) => {
  try {
    await firestore().collection('players').doc(playerId).update({
      ...updates,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });

    console.log(`✅ Player updated: ${playerId}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating player:', error);
    return { success: false, error: error.message };
  }
};

export const deletePlayer = async (playerId) => {
  try {
    await firestore().collection('players').doc(playerId).delete();
    console.log(`✅ Player deleted: ${playerId}`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting player:', error);
    return { success: false, error: error.message };
  }
};

export const getAllPlayers = async () => {
  try {
    const snapshot = await firestore()
      .collection('players')
      .orderBy('name', 'asc')
      .get();

    const players = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      // Filter active players in code instead of query
      if (data.active !== false) {
        players.push({
          id: doc.id,
          ...data,
        });
      }
    });

    return players;
  } catch (error) {
    console.error('Error getting players:', error);
    return [];
  }
};

export const getPlayersByPosition = async (position) => {
  try {
    const snapshot = await firestore()
      .collection('players')
      .where('position', '==', position)
      .orderBy('name', 'asc')
      .get();

    const players = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      // Filter active players in code
      if (data.active !== false) {
        players.push({
          id: doc.id,
          ...data,
        });
      }
    });

    return players;
  } catch (error) {
    console.error('Error getting players by position:', error);
    return [];
  }
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
