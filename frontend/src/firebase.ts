// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "nexusblogmern.firebaseapp.com",
  projectId: "nexusblogmern",
  storageBucket: "nexusblogmern.appspot.com",
  messagingSenderId: "882090688629",
  appId: "1:882090688629:web:c31fe9a79d11ffdeb0f83c",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
