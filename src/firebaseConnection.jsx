// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCrNiAD1kaDkCWSrTT6-SSTDsThao-wN4c",
  authDomain: "curso-305ba.firebaseapp.com",
  projectId: "curso-305ba",
  storageBucket: "curso-305ba.firebasestorage.app",
  messagingSenderId: "423778252338",
  appId: "1:423778252338:web:5d4e7b48d39725bf51ee2b",
  measurementId: "G-W4EM0L65E0",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { db, auth };
