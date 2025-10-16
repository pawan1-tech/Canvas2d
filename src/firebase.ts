import { initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Connect to Firestore emulator if enabled
const useEmulator = import.meta.env.VITE_USE_FIRESTORE_EMULATOR === 'true';
if (useEmulator) {
  const host = import.meta.env.VITE_FIRESTORE_EMULATOR_HOST || '127.0.0.1';
  const port = Number(import.meta.env.VITE_FIRESTORE_EMULATOR_PORT || 8080);
  
  try {
    connectFirestoreEmulator(db, host, port);
    console.log(`✅ Connected to Firestore Emulator at ${host}:${port}`);
  } catch (error) {
    console.warn('⚠️ Failed to connect to Firestore Emulator:', error);
  }
}


