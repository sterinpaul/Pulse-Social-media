// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
// import { getAnalytics } from "firebase/analytics";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUPlxdCmYSJaYyAQQCZpsehdC1bc1SpUY",
  authDomain: "pulse-c426a.firebaseapp.com",
  projectId: "pulse-c426a",
  storageBucket: "pulse-c426a.appspot.com",
  messagingSenderId: "560626830691",
  appId: "1:560626830691:web:2213c8f7a09c78bff3d756",
  measurementId: "G-SF8QBTTL8V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// const analytics = getAnalytics(app);