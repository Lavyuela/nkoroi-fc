// LIVE MODE: Real Firebase connection with local auth
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push, onValue, update, remove, get } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig } from '../../firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
let auth = null;

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
    const adminRef = ref(database, `admins/${userId}`);
    const snapshot = await get(adminRef);
    return snapshot.exists();
  } catch (error) {
    return false;
  }
};

// Match functions (LIVE MODE - Real Firebase Database)
export const createMatch = async (matchData) => {
  try {
    const matchesRef = ref(database, 'matches');
    const newMatchRef = push(matchesRef);
    const matchId = newMatchRef.key;
    
    const newMatch = {
      id: matchId,
      ...matchData,
      homeScore: 0,
      awayScore: 0,
      status: 'upcoming',
      events: [],
      createdAt: Date.now(),
    };
    
    await set(newMatchRef, newMatch);
    return { success: true, matchId };
  } catch (error) {
    return { success: false, error: 'Failed to create match' };
  }
};

export const updateMatchScore = async (matchId, homeScore, awayScore) => {
  try {
    const matchRef = ref(database, `matches/${matchId}`);
    await update(matchRef, { homeScore, awayScore });
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update score' };
  }
};

export const updateMatchStatus = async (matchId, status) => {
  try {
    const matchRef = ref(database, `matches/${matchId}`);
    await update(matchRef, { status });
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update status' };
  }
};

export const addMatchEvent = async (matchId, event) => {
  try {
    const eventsRef = ref(database, `matches/${matchId}/events`);
    await push(eventsRef, event);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to add event' };
  }
};

export const deleteMatch = async (matchId) => {
  try {
    const matchRef = ref(database, `matches/${matchId}`);
    await remove(matchRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete match' };
  }
};

export const subscribeToMatches = (callback) => {
  const matchesRef = ref(database, 'matches');
  const unsubscribe = onValue(matchesRef, (snapshot) => {
    const matchesData = snapshot.val();
    const matches = matchesData ? Object.values(matchesData) : [];
    callback(matches);
  });
  return unsubscribe;
};

export const subscribeToMatch = (matchId, callback) => {
  const matchRef = ref(database, `matches/${matchId}`);
  const unsubscribe = onValue(matchRef, (snapshot) => {
    const match = snapshot.val();
    if (match) callback(match);
  });
  return unsubscribe;
};

export { auth, database };
