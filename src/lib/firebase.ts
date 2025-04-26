
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration
// Replace this with your own Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsWmi4rQXCydhucmg2pQixMrc14wb85Gk",
  authDomain: "proffessor-portfolio.firebaseapp.com",
  projectId: "proffessor-portfolio",
  storageBucket: "proffessor-portfolio.appspot.com",
  messagingSenderId: "475185968910",
  appId: "1:475185968910:web:dcf084f0a49e9cfd30095f",
  measurementId: "G-Y5T6LG3KR5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Enable persistence to handle offline scenarios
// This helps the app work offline and sync when back online
const enablePersistence = async () => {
  try {
    const { enableIndexedDbPersistence } = await import('firebase/firestore');
    await enableIndexedDbPersistence(db);
    console.log('Firebase persistence enabled');
  } catch (err) {
    // @ts-ignore: expected Firebase error
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.warn('Firebase persistence failed: Multiple tabs open');
    // @ts-ignore: expected Firebase error
    } else if (err.code === 'unimplemented') {
      // The current browser does not support persistence
      console.warn('Firebase persistence not supported in this browser');
    } else {
      console.error('Firebase persistence error:', err);
    }
  }
};

// Call enablePersistence but don't await it to avoid blocking init
enablePersistence();

// CURRENT Firestore security rules for production - USE THESE IN FIREBASE CONSOLE:
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to all collections
    match /{document=**} {
      allow read: if true;
    }
    
    // Allow write access only to authenticated users
    match /{collection}/{document=**} {
      allow write: if request.auth != null;
    }
  }
}
*/

// Add console debugging for Firestore operations
const debugFirestore = true;

const logFirestoreOperation = (operation: string, data: any) => {
  if (debugFirestore) {
    console.log(`Firestore ${operation}:`, data);
  }
};

export { db, auth, logFirestoreOperation };
