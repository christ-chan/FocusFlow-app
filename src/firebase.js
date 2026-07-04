// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add your web app's Firebase configuration
// For more information on this, visit: https://firebase.google.com/docs/web/setup#available-libraries
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA90whDE2MEqhuiNBwgTY20fiDemFSUXUY",
  authDomain: "focusflow-app-571d5.firebaseapp.com",
  databaseURL: "https://focusflow-app-571d5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "focusflow-app-571d5",
  storageBucket: "focusflow-app-571d5.firebasestorage.app",
  messagingSenderId: "328432305116",
  appId: "1:328432305116:web:6cf4129e054f36d76c0519",
  measurementId: "G-YVETC2QZ52"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
