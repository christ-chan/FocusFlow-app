
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "focusflow-app-571d5",
  "appId": "1:328432305116:web:1aae8c3436ec11566c0519",
  "databaseURL": "https://focusflow-app-571d5-default-rtdb.asia-southeast1.firebasedatabase.app",
  "storageBucket": "focusflow-app-571d5.firebasestorage.app",
  "apiKey": "AIzaSyA90whDE2MEqhuiNBwgTY20fiDemFSUXUY",
  "authDomain": "focusflow-app-571d5.firebaseapp.com",
  "messagingSenderId": "328432305116",
  "measurementId": "G-T1YBM3MCS7"
}; 

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const getBookings = async () => {
    const querySnapshot = await getDocs(collection(db, "bookings"));
    const bookings = [];
    querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() });
    });
    return bookings;
};

const createBooking = async (bookingData) => {
    const docRef = await addDoc(collection(db, "bookings"), bookingData);
    return { id: docRef.id, ...bookingData };
};

export { getBookings, createBooking };
