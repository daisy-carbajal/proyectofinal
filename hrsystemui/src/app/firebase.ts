// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzLD5tsRp1FZ24Cx1R5nZH_LyoQ0EZYjI",
  authDomain: "hrsystem-a5479.firebaseapp.com",
  projectId: "hrsystem-a5479",
  storageBucket: "hrsystem-a5479.firebasestorage.app",
  messagingSenderId: "307312044252",
  appId: "1:307312044252:web:d58c6c91ffbc9407efac19",
  measurementId: "G-CC0VTS65JP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);