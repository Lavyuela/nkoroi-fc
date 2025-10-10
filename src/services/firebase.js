// STABLE MODE: AsyncStorage with optional Firebase sync
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase will be initialized only if needed
let app = null;
let database = null;
let auth = null;

// Try to initialize Firebase, but don't crash if it fails
try {
  const { initializeApp } = require('firebase/app');
  const { getDatabase } = require('firebase/database');
  const { firebaseConfig } = require('../../firebaseConfig');
  
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.log('Firebase not available, using local storage only');
}

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
    
    // Save admin status locally and to cloud
    if (isAdmin) {
      const adminUsers = await AsyncStorage.getItem('adminUsers');
      const admins = adminUsers ? JSON.parse(adminUsers) : [];
      if (!admins.includes(email)) {
        admins.push(email);
        await AsyncStorage.setItem('adminUsers', JSON.stringify(admins));
      }
      
      // Also save to cloud database
      await set(ref(database, `admins/${userId}`), {
        email: email,
        createdAt: Date.now()
      });
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

// Match functions (Hybrid - AsyncStorage with optional Firebase sync)
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
    
    // Save to local storage
    const savedMatches = await AsyncStorage.getItem('demoMatches');
    const matches = savedMatches ? JSON.parse(savedMatches) : [];
    matches.push(newMatch);
    await AsyncStorage.setItem('demoMatches', JSON.stringify(matches));
    
    // Try to sync to Firebase if available
    if (database) {
      try {
        const { ref, set, push } = require('firebase/database');
        const matchesRef = ref(database, 'matches');
        const newMatchRef = push(matchesRef);
        await set(newMatchRef, newMatch);
      } catch (error) {
        console.log('Firebase sync failed, data saved locally');
      }
    }
    
    return { success: true, matchId };
  } catch (error) {
    return { success: false, error: 'Failed to create match' };
  }
};

export const updateMatchScore = async (matchId, homeScore, awayScore) => {
  return { success: true };
};

export const updateMatchStatus = async (matchId, status) => {
  return { success: true };
};

export const addMatchEvent = async (matchId, event) => {
  return { success: true };
};

export const deleteMatch = async (matchId) => {
  return { success: true };
};

export const subscribeToMatches = (callback) => {
  AsyncStorage.getItem('demoMatches').then(data => {
    const matches = data ? JSON.parse(data) : [];
    callback(matches);
  });
  return () => {};
};

export const subscribeToMatch = (matchId, callback) => {
  AsyncStorage.getItem('demoMatches').then(data => {
    const matches = data ? JSON.parse(data) : [];
    const match = matches.find(m => m.id === matchId);
    if (match) callback(match);
  });
  return () => {};
};

export { auth, database };
