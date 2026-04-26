import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue } from 'firebase/database';

// Replace with your Firebase credentials from Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBKCYLapOLgVFTbU25kPrmR-MhznS3swuk',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'akyltool.firebaseapp.com',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://akyltool-default-rtdb.firebaseio.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'akyltool',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'akyltool.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '717164888546',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:717164888546:web:0943c85847ea67270339bb',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Save duty class to Firebase
export const saveDutyClass = async (dutyClass) => {
  try {
    await set(ref(database, 'canteen/dutyClass'), dutyClass);
    return true;
  } catch (error) {
    console.error('Error saving duty class:', error);
    return false;
  }
};

// Save location to Firebase
export const saveLocation = async (location) => {
  try {
    await set(ref(database, 'canteen/location'), location);
    return true;
  } catch (error) {
    console.error('Error saving location:', error);
    return false;
  }
};

// Save map state to Firebase
export const saveMapState = async (mapState) => {
  try {
    await set(ref(database, 'canteen/mapState'), mapState);
    return true;
  } catch (error) {
    console.error('Error saving map state:', error);
    return false;
  }
};

// Listen to duty class changes in real-time
export const subscribeToDutyClass = (callback) => {
  const dutyRef = ref(database, 'canteen/dutyClass');
  return onValue(dutyRef, (snapshot) => {
    const data = snapshot.val();
    if (data) callback(data);
  });
};

// Listen to location changes in real-time
export const subscribeToLocation = (callback) => {
  const locationRef = ref(database, 'canteen/location');
  return onValue(locationRef, (snapshot) => {
    const data = snapshot.val();
    if (data) callback(data);
  });
};

// Listen to map state changes in real-time
export const subscribeToMapState = (callback) => {
  const mapRef = ref(database, 'canteen/mapState');
  return onValue(mapRef, (snapshot) => {
    const data = snapshot.val();
    if (data) callback(data);
  });
};

// Get initial values
export const getInitialData = async () => {
  try {
    const dutySnapshot = await get(ref(database, 'canteen/dutyClass'));
    const locationSnapshot = await get(ref(database, 'canteen/location'));
    const mapSnapshot = await get(ref(database, 'canteen/mapState'));
    
    return {
      dutyClass: dutySnapshot.val() || '9B',
      location: locationSnapshot.val() || 'Point B',
      mapState: mapSnapshot.val() || { selectedMapFloor: '1', mapPoints: { '1': null, '2': null, '3': null } }
    };
  } catch (error) {
    console.error('Error fetching initial data:', error);
    return { dutyClass: '9B', location: 'Point B', mapState: { selectedMapFloor: '1', mapPoints: { '1': null, '2': null, '3': null } } };
  }
};
