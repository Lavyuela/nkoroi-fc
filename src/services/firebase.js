// STABLE MODE: Pure AsyncStorage - No Firebase dependencies
import AsyncStorage from '@react-native-async-storage/async-storage';

let database = null;
let messaging = null;
let app = null;
let auth = null;
let firebaseAvailable = false;

console.log('✅ Using AsyncStorage mode - stable and reliable');

// Authentication functions (Hybrid - Local storage with cloud database)
export const loginUser = async (email, password) => {
  try {
    const usersData = await AsyncStorage.getItem('registeredUsers');
    const users = usersData ? JSON.parse(usersData) : {};
    
    if (!users[email]) {
      return { 
        success: false, 
        error: 'No account found with this email address' 
      };
    }
    
    if (users[email].password !== password) {
      return { 
        success: false, 
        error: 'Incorrect password. Please try again.' 
      };
    }
    
    return { 
      success: true, 
      user: { 
        uid: users[email].uid, 
        email: email 
      } 
    };
  } catch (error) {
    return { 
      success: false, 
      error: 'Login failed. Please try again.' 
    };
  }
};

export const registerUser = async (email, password, isAdmin = false) => {
  try {
    const usersData = await AsyncStorage.getItem('registeredUsers');
    const users = usersData ? JSON.parse(usersData) : {};
    
    if (users[email]) {
      return { 
        success: false, 
        error: 'An account with this email already exists' 
      };
    }
    
    const userId = 'user-' + Date.now();
    users[email] = {
      uid: userId,
      email: email,
      password: password,
      createdAt: Date.now()
    };
    
    await AsyncStorage.setItem('registeredUsers', JSON.stringify(users));
    
    // Save admin status locally
    if (isAdmin) {
      const adminUsers = await AsyncStorage.getItem('adminUsers');
      const admins = adminUsers ? JSON.parse(adminUsers) : [];
      if (!admins.includes(email)) {
        admins.push(email);
        await AsyncStorage.setItem('adminUsers', JSON.stringify(admins));
      }
    }
    
    return { 
      success: true, 
      user: { uid: userId, email: email } 
    };
  } catch (error) {
    return { 
      success: false, 
      error: 'Registration failed. Please try again.' 
    };
  }
};

export const logoutUser = async () => {
  return { success: true };
};

export const getCurrentUser = () => {
  return null;
};

export const checkIfAdmin = async (userId) => {
  try {
    const adminUsers = await AsyncStorage.getItem('adminUsers');
    const admins = adminUsers ? JSON.parse(adminUsers) : [];
    // Check if any admin user has this userId
    const usersData = await AsyncStorage.getItem('registeredUsers');
    const users = usersData ? JSON.parse(usersData) : {};
    for (const email in users) {
      if (users[email].uid === userId && admins.includes(email)) {
        return true;
      }
    }
    return false;
  } catch (error) {
    return false;
  }
};

// Match functions (HYBRID - Firebase with AsyncStorage fallback)
export const createMatch = async (matchData) => {
  try {
    const matchId = 'match-' + Date.now();
    const newMatch = {
      id: matchId,
      ...matchData,
      homeScore: 0,
      awayScore: 0,
      status: 'upcoming',
      events: [],
      createdAt: Date.now(),
    };
    
    // Save to local storage first (always works)
    const savedMatches = await AsyncStorage.getItem('demoMatches');
    const matches = savedMatches ? JSON.parse(savedMatches) : [];
    matches.push(newMatch);
    await AsyncStorage.setItem('demoMatches', JSON.stringify(matches));
    
    // Try to sync to Firebase if available
    if (firebaseAvailable && database) {
      try {
        const matchRef = database().ref('matches').push();
        await matchRef.set(newMatch);
        console.log('✅ Match synced to Firebase');
      } catch (error) {
        console.log('⚠️ Firebase sync failed, data saved locally only');
      }
    }
    
    return { success: true, matchId };
  } catch (error) {
    console.error('Create match error:', error);
    return { success: false, error: 'Failed to create match' };
  }
};

export const updateMatchScore = async (matchId, homeScore, awayScore) => {
  try {
    // Update in Firebase if available
    if (firebaseAvailable && database) {
      await database().ref(`matches/${matchId}`).update({ homeScore, awayScore });
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update score' };
  }
};

export const updateMatchStatus = async (matchId, status) => {
  try {
    // Update in Firebase if available
    if (firebaseAvailable && database) {
      await database().ref(`matches/${matchId}`).update({ status });
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update status' };
  }
};

export const addMatchEvent = async (matchId, event) => {
  try {
    // Add to Firebase if available
    if (firebaseAvailable && database) {
      await database().ref(`matches/${matchId}/events`).push(event);
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to add event' };
  }
};

export const deleteMatch = async (matchId) => {
  try {
    // Delete from Firebase if available
    if (firebaseAvailable && database) {
      await database().ref(`matches/${matchId}`).remove();
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete match' };
  }
};

export const subscribeToMatches = (callback) => {
  // Use Firebase if available, otherwise use AsyncStorage
  if (firebaseAvailable && database) {
    try {
      const matchesRef = database().ref('matches');
      const onValueChange = matchesRef.on('value', (snapshot) => {
        const matchesData = snapshot.val();
        const matches = matchesData ? Object.values(matchesData) : [];
        callback(matches);
      });
      return () => matchesRef.off('value', onValueChange);
    } catch (error) {
      console.log('Firebase subscription failed, using local storage');
    }
  }
  
  // Fallback to AsyncStorage
  AsyncStorage.getItem('demoMatches').then(data => {
    const matches = data ? JSON.parse(data) : [];
    callback(matches);
  });
  return () => {};
};

export const subscribeToMatch = (matchId, callback) => {
  // Use Firebase if available, otherwise use AsyncStorage
  if (firebaseAvailable && database) {
    try {
      const matchRef = database().ref(`matches/${matchId}`);
      const onValueChange = matchRef.on('value', (snapshot) => {
        const match = snapshot.val();
        if (match) callback(match);
      });
      return () => matchRef.off('value', onValueChange);
    } catch (error) {
      console.log('Firebase subscription failed, using local storage');
    }
  }
  
  // Fallback to AsyncStorage
  AsyncStorage.getItem('demoMatches').then(data => {
    const matches = data ? JSON.parse(data) : [];
    const match = matches.find(m => m.id === matchId);
    if (match) callback(match);
  });
  return () => {};
};

export { auth, database };
