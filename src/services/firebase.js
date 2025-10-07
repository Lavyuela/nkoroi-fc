import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, push, update, remove } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { firebaseConfig } from '../../firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Authentication functions
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const registerUser = async (email, password, isAdmin = false) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;
    
    // Store user role in database
    await set(ref(database, `users/${userId}`), {
      email: email,
      isAdmin: isAdmin,
      createdAt: Date.now()
    });
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const checkIfAdmin = async (userId) => {
  return new Promise((resolve) => {
    const userRef = ref(database, `users/${userId}`);
    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      resolve(userData?.isAdmin || false);
    }, { onlyOnce: true });
  });
};

// Match functions
export const createMatch = async (matchData) => {
  try {
    const matchRef = push(ref(database, 'matches'));
    await set(matchRef, {
      ...matchData,
      homeScore: 0,
      awayScore: 0,
      status: 'upcoming', // upcoming, live, finished
      events: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    return { success: true, matchId: matchRef.key };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateMatchScore = async (matchId, homeScore, awayScore) => {
  try {
    await update(ref(database, `matches/${matchId}`), {
      homeScore,
      awayScore,
      updatedAt: Date.now()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateMatchStatus = async (matchId, status) => {
  try {
    await update(ref(database, `matches/${matchId}`), {
      status,
      updatedAt: Date.now()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const addMatchEvent = async (matchId, event) => {
  try {
    const eventRef = push(ref(database, `matches/${matchId}/events`));
    await set(eventRef, {
      ...event,
      timestamp: Date.now()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteMatch = async (matchId) => {
  try {
    await remove(ref(database, `matches/${matchId}`));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const subscribeToMatches = (callback) => {
  const matchesRef = ref(database, 'matches');
  return onValue(matchesRef, (snapshot) => {
    const matches = [];
    snapshot.forEach((childSnapshot) => {
      matches.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    callback(matches);
  });
};

export const subscribeToMatch = (matchId, callback) => {
  const matchRef = ref(database, `matches/${matchId}`);
  return onValue(matchRef, (snapshot) => {
    callback({
      id: snapshot.key,
      ...snapshot.val()
    });
  });
};

export { auth, database };
