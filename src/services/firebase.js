// DEMO MODE: Mock Firebase for testing
// Firebase disabled to avoid initialization errors in Expo Go
import AsyncStorage from '@react-native-async-storage/async-storage';

let app = null;
let database = null;
let auth = null;

// Authentication functions (DEMO MODE - Mock with validation)
export const loginUser = async (email, password) => {
  try {
    // Get registered users from storage
    const usersData = await AsyncStorage.getItem('registeredUsers');
    const users = usersData ? JSON.parse(usersData) : {};
    
    // Check if user exists
    if (!users[email]) {
      return { 
        success: false, 
        error: 'No account found with this email address' 
      };
    }
    
    // Check password
    if (users[email].password !== password) {
      return { 
        success: false, 
        error: 'Incorrect password. Please try again.' 
      };
    }
    
    // Login successful
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
    // Get existing users
    const usersData = await AsyncStorage.getItem('registeredUsers');
    const users = usersData ? JSON.parse(usersData) : {};
    
    // Check if user already exists
    if (users[email]) {
      return { 
        success: false, 
        error: 'An account with this email already exists' 
      };
    }
    
    // Create new user
    const userId = 'demo-' + Date.now();
    users[email] = {
      uid: userId,
      email: email,
      password: password, // In production, this would be hashed!
      createdAt: Date.now()
    };
    
    // Save users
    await AsyncStorage.setItem('registeredUsers', JSON.stringify(users));
    
    // Save admin status
    const adminUsers = await AsyncStorage.getItem('adminUsers');
    const admins = adminUsers ? JSON.parse(adminUsers) : [];
    if (isAdmin && !admins.includes(email)) {
      admins.push(email);
      await AsyncStorage.setItem('adminUsers', JSON.stringify(admins));
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
  return false;
};

// Match functions (DEMO MODE - AsyncStorage)
export const createMatch = async (matchData) => {
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
  
  const savedMatches = await AsyncStorage.getItem('demoMatches');
  const matches = savedMatches ? JSON.parse(savedMatches) : [];
  matches.push(newMatch);
  await AsyncStorage.setItem('demoMatches', JSON.stringify(matches));
  
  return { success: true, matchId };
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
  // Load from AsyncStorage and call callback
  AsyncStorage.getItem('demoMatches').then(data => {
    const matches = data ? JSON.parse(data) : [];
    callback(matches);
  });
  return () => {}; // unsubscribe function
};

export const subscribeToMatch = (matchId, callback) => {
  // Load from AsyncStorage and call callback
  AsyncStorage.getItem('demoMatches').then(data => {
    const matches = data ? JSON.parse(data) : [];
    const match = matches.find(m => m.id === matchId);
    if (match) callback(match);
  });
  return () => {}; // unsubscribe function
};

export { auth, database };
