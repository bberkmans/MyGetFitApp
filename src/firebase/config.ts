// firebase/config.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBMxbTep_KQqt7lxuvWs4x8_er7QqPXn1o",
  authDomain: "mygetfitapp.firebaseapp.com",
  projectId: "mygetfitapp",
  storageBucket: "mygetfitapp.firebasestorage.app",
  messagingSenderId: "109260344124",
  appId: "1:109260344124:web:736bce277612afa97a2c39",
  // measurementId removed (not needed for React Native)
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth instance
export const auth = getAuth(app);
export const db = getFirestore(app);