// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANDwix9QLvTBxmgksPumap7oEihe2UdYE",
  authDomain: "nextelitefnweb.firebaseapp.com",
  projectId: "nextelitefnweb",
  storageBucket: "nextelitefnweb.firebasestorage.app",
  messagingSenderId: "496900220544",
  appId: "1:496900220544:web:67c549f5d7176b97e76865"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };

