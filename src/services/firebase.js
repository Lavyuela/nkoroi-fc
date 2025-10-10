// LIVE MODE: Real Firebase connection
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push, onValue, update, remove, get } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { firebaseConfig } from '../../firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Authentication functions (LIVE MODE - Real Firebase Auth)
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { 
      success: true, 
      user: { 
        uid: userCredential.user.uid, 
        email: userCredential.user.email 
      } 
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
      error: errorMessage 
    };
  }
};

export const registerUser = async (email, password, isAdmin = false) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;
    
    // Save admin status to database
    if (isAdmin) {
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
    let errorMessage = 'Registration failed. Please try again.';
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'An account with this email already exists';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password should be at least 6 characters';
    }
    return { 
      success: false, 
      error: errorMessage 
    };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Logout failed' };
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
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
