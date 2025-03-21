// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCF8WQpXhuObT4XkvY1PDcwqdmRwtViWMo",
  authDomain: "daily-vibe-blog.firebaseapp.com",
  projectId: "daily-vibe-blog",
  storageBucket: "daily-vibe-blog.firebasestorage.app",
  messagingSenderId: "307472034215",
  appId: "1:307472034215:web:739793d5d42210d121ee82",
  measurementId: "G-E2VQ8SEVM4"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Generate unique ID for songs
const generateSongId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Load all songs for a specific user
export const loadSongs = async (userId) => {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists) {
      return userDoc.data().songs || [];
    }
    // If user doesn't exist, create new user document
    await db.collection('users').doc(userId).set({ songs: [] });
    return [];
  } catch (error) {
    console.error("Error loading songs:", error);
    return [];
  }
};

// Save a new song for a user
export const saveSong = async (userId, newSong) => {
  try {
    const songWithId = {
      ...newSong,
      songId: generateSongId()
    };
    
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (userDoc.exists) {
      const currentSongs = userDoc.data().songs || [];
      const updatedSongs = [...currentSongs, songWithId];
      await userRef.update({ songs: updatedSongs });
      return updatedSongs;
    } else {
      // If user doesn't exist, create new document
      await userRef.set({ songs: [songWithId] });
      return [songWithId];
    }
  } catch (error) {
    console.error("Error saving song:", error);
    throw error;
  }
};

// Delete a song for a user
export const deleteSong = async (userId, songId) => {
  try {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (userDoc.exists) {
      const currentSongs = userDoc.data().songs;
      const updatedSongs = currentSongs.filter(song => song.songId !== songId);
      await userRef.update({ songs: updatedSongs });
      return updatedSongs;
    }
    return [];
  } catch (error) {
    console.error("Error deleting song:", error);
    throw error;
  }
};

// Set up real-time listener for user's songs
export const setupRealtimeListener = (userId, callback) => {
  return db.collection('users').doc(userId)
    .onSnapshot((doc) => {
      if (doc.exists) {
        callback(doc.data().songs || []);
      } else {
        callback([]);
      }
    });
};
